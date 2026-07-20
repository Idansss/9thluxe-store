import Link from "next/link"

import { prisma } from "@/lib/prisma"
import {
  AUDIT_PAGE_SIZE,
  buildAuditWhere,
  pageCount,
  pageSkip,
  parsePage,
} from "@/lib/audit/filters"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const dynamic = "force-dynamic"

interface AdminAuditPageProps {
  searchParams?: Promise<{
    actorId?: string
    action?: string
    targetType?: string
    targetId?: string
    page?: string
  }>
}

interface AuditRow {
  id: string
  actorId: string | null
  actorRole: string | null
  action: string
  targetType: string
  targetId: string | null
  metadata: unknown
  createdAt: Date
}

function formatWhen(value: Date): string {
  // ASCII-only, locale-stable. Example: 2026-07-20 14:03:22
  const iso = value.toISOString()
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)}`
}

function metadataPreview(metadata: unknown): string {
  if (metadata == null) return ""
  try {
    const s = JSON.stringify(metadata)
    return s.length > 160 ? `${s.slice(0, 157)}...` : s
  } catch {
    return ""
  }
}

export default async function AdminAuditPage({ searchParams }: AdminAuditPageProps) {
  const params = (await searchParams) ?? {}
  const filters = {
    actorId: params.actorId ?? "",
    action: params.action ?? "",
    targetType: params.targetType ?? "",
    targetId: params.targetId ?? "",
  }
  const page = parsePage(params.page)
  const where = buildAuditWhere(filters)

  let entries: AuditRow[] = []
  let total = 0
  let loadError = false
  try {
    const [rows, count] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: AUDIT_PAGE_SIZE,
        skip: pageSkip(page),
      }),
      prisma.auditLog.count({ where }),
    ])
    entries = rows as AuditRow[]
    total = count
  } catch {
    loadError = true
  }

  const totalPages = pageCount(total)
  const currentPage = Math.min(page, totalPages)

  const pageHref = (target: number) => {
    const sp = new URLSearchParams()
    if (filters.actorId) sp.set("actorId", filters.actorId)
    if (filters.action) sp.set("action", filters.action)
    if (filters.targetType) sp.set("targetType", filters.targetType)
    if (filters.targetId) sp.set("targetId", filters.targetId)
    if (target > 1) sp.set("page", String(target))
    const qs = sp.toString()
    return qs ? `/admin/audit?${qs}` : "/admin/audit"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Audit log</h1>
        <p className="text-muted-foreground">
          Append-only trail of every administrative change. Read-only: entries are written
          automatically and cannot be edited or deleted from here.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form method="get" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Action contains</span>
              <Input name="action" defaultValue={filters.action} placeholder="e.g. publish" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Target type</span>
              <Input name="targetType" defaultValue={filters.targetType} placeholder="e.g. Story" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Target id</span>
              <Input name="targetId" defaultValue={filters.targetId} placeholder="exact id" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Actor id</span>
              <Input name="actorId" defaultValue={filters.actorId} placeholder="exact user id" />
            </label>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Filter
              </Button>
              {(filters.action || filters.targetType || filters.targetId || filters.actorId) && (
                <Button asChild variant="outline">
                  <Link href="/admin/audit">Clear</Link>
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {loadError ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            The audit log could not be loaded. The audit table may not exist in this environment yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {total} {total === 1 ? "entry" : "entries"}
              </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">When (UTC)</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No audit entries match these filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                        {formatWhen(entry.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{entry.action}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="font-medium">{entry.targetType}</span>
                        {entry.targetId ? (
                          <span className="block font-mono text-xs text-muted-foreground">
                            {entry.targetId}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm">
                        {entry.actorRole ? (
                          <span className="block">{entry.actorRole}</span>
                        ) : (
                          <span className="text-muted-foreground">system</span>
                        )}
                        {entry.actorId ? (
                          <span className="block font-mono text-xs text-muted-foreground">
                            {entry.actorId}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <span className="block truncate font-mono text-xs text-muted-foreground">
                          {metadataPreview(entry.metadata)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                {currentPage > 1 ? (
                  <Button asChild variant="outline">
                    <Link href={pageHref(currentPage - 1)}>Previous</Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                )}
                {currentPage < totalPages ? (
                  <Button asChild variant="outline">
                    <Link href={pageHref(currentPage + 1)}>Next</Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    Next
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
