// integrations/notifications/index.ts
// Consent-aware, deduplicated notification dispatch.
//  - Transactional messages ignore marketing consent (order/payment/shipping).
//  - Promotional messages require the recipient's channel consent.
//  - Dedup by dedupeKey prevents double-sends.
import { logger } from '@/lib/observability/logger'
import { emailAdapter, whatsappAdapter, smsAdapter, inAppAdapter } from './adapters'
import type { ChannelAdapter, NotificationChannel, NotificationMessage, DeliveryResult } from './types'

const ADAPTERS: Record<NotificationChannel, ChannelAdapter> = {
  email: emailAdapter,
  whatsapp: whatsappAdapter,
  sms: smsAdapter,
  in_app: inAppAdapter,
}

// In-memory dedup for a single runtime. A durable dedup uses the NotificationLog table.
const seen = new Set<string>()

export interface Consent {
  marketingEmail?: boolean
  marketingWhatsapp?: boolean
  marketingSms?: boolean
}

export async function notify(
  message: NotificationMessage,
  channels: NotificationChannel[],
  consent: Consent = {},
): Promise<DeliveryResult[]> {
  const dedupe = `${message.dedupeKey}`
  if (seen.has(dedupe)) {
    return [{ channel: channels[0] ?? 'in_app', ok: false, skippedReason: 'duplicate' }]
  }
  seen.add(dedupe)

  const results: DeliveryResult[] = []
  for (const channel of channels) {
    // Consent gate for promotional messages.
    if (message.kind === 'promotional') {
      const allowed =
        (channel === 'email' && consent.marketingEmail) ||
        (channel === 'whatsapp' && consent.marketingWhatsapp) ||
        (channel === 'sms' && consent.marketingSms) ||
        channel === 'in_app'
      if (!allowed) {
        results.push({ channel, ok: false, skippedReason: 'no_consent' })
        continue
      }
    }
    const adapter = ADAPTERS[channel]
    const result = await adapter.send(message)
    results.push(result)
  }
  logger.info('notify_dispatched', {
    event: message.event,
    kind: message.kind,
    channels,
    results: results.map((r) => ({ c: r.channel, ok: r.ok, skip: r.skippedReason })),
  })
  return results
}

/** For tests: reset dedup cache. */
export function __resetNotificationDedup() {
  seen.clear()
}
