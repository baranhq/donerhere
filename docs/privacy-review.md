# Privacy implementation review

Reviewed 2026-10-30. This is a technical inventory for the fictional local demo, not a public Privacy Policy or a legal-compliance claim.

- Accounts store name, email, salted password hashes and role in local SQLite. Sessions use signed HttpOnly cookies and expire after seven days, with a 30-minute inactivity limit.
- Orders retain customer name, phone, delivery address where supplied, items, totals, dates and status history. Account deletion preserves order records, including the order contact details.
- Store analytics aggregate existing order dates, statuses, items and totals on the server. Only store admins can access the aggregate endpoint. It returns no customer names, emails, phone numbers, addresses or identifiers. It adds no visitor tracking, cookies, external processors or new stored analytics records.
- Staff permissions are checked on every server request. Default employees can edit the catalog and orders; default order staff can view the catalog and handle orders. Admins can replace these defaults for individual staff members or copy saved permission templates. Inbox access can be granted separately. User management, analytics and policy publishing remain admin-only. Permission changes revoke the affected user’s sessions.
- Contact submissions store name, email, message and submission date. Feedback stores a 1–5 rating and message; name/email are optional. Only admins or staff granted inbox access can read submissions. The forms add no trackers or external delivery services. Submissions remain in SQLite until an owner-defined retention process is implemented. Production submissions are disabled by default and require PUBLIC_FORMS_ENABLED=true plus a published Privacy Policy.
- Legal pages support admin-authored drafts and explicitly approved publication. Drafts are not public; no Terms or Privacy wording is generated or seeded. These editors do not establish that the supplied text is legally adequate.
- No automatic account/order/message retention policy or complete privacy-rights workflow has been configured.

Before real customer use, the owner must provide the controller identity and privacy contact, hosting and recipients/processors, applicable lawful bases, retention decisions and rights-request handling. A truthful public Privacy Policy must be completed from those facts. Terms remain owner-controlled. The checkout demo does not connect to a payment provider or dispatch service.
