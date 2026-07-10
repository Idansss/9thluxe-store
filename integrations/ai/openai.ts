// integrations/ai/openai.ts
// OpenAI adapter. Active only when AI_PROVIDER=openai AND OPENAI_API_KEY is set.
import { AppError } from '@/lib/http/errors'
import type { AiProvider, AiCallOptions } from './types'

const MODEL = 'gpt-4o-mini'

export const openaiProvider: AiProvider = {
  name: 'openai',
  model: MODEL,
  async complete(system: string, user: string, opts: AiCallOptions) {
    const key = process.env.OPENAI_API_KEY
    if (!key) throw new AppError('AI_UNAVAILABLE', { internal: 'OPENAI_API_KEY missing' })
    const start = Date.now()
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: opts.maxOutputTokens ?? 1024,
        temperature: opts.temperature ?? 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    })
    if (!res.ok) throw new AppError('PROVIDER_ERROR', { internal: { status: res.status } })
    const body = await res.json()
    const text = body?.choices?.[0]?.message?.content ?? ''
    return {
      text,
      usage: {
        provider: 'openai',
        model: MODEL,
        inputTokens: body?.usage?.prompt_tokens,
        outputTokens: body?.usage?.completion_tokens,
        latencyMs: Date.now() - start,
      },
    }
  },
}
