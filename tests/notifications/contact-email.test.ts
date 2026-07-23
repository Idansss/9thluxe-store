import { describe, expect, it } from "vitest"

import {
  renderContactOwnerEmail,
  renderContactReplyEmail,
} from "@/lib/notifications/contact-email"

describe("contact email rendering", () => {
  it("escapes every customer-controlled value in the owner email", () => {
    const html = renderContactOwnerEmail({
      name: "<img src=x onerror=alert(1)>",
      email: "person@example.test",
      subject: "<script>alert(1)</script>",
      message: "\"quoted\" & <b>unsafe</b>",
    })

    expect(html).not.toContain("<script>")
    expect(html).not.toContain("<img")
    expect(html).not.toContain("<b>unsafe</b>")
    expect(html).toContain("&lt;script&gt;")
    expect(html).toContain("&amp;")
    expect(html).toContain("&quot;quoted&quot;")
  })

  it("escapes customer content in the auto-reply", () => {
    const html = renderContactReplyEmail(
      {
        name: "<Admin>",
        message: "<a href=\"https://attacker.test\">click</a>",
      },
      "store@example.test",
    )

    expect(html).not.toContain("<Admin>")
    expect(html).not.toContain("<a href=")
    expect(html).toContain("&lt;Admin&gt;")
    expect(html).toContain("&lt;a href=&quot;")
  })
})
