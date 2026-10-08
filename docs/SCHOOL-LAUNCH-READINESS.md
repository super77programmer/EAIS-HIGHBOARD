# School launch readiness — 8 October 2026

This is an implementation review, not legal certification. The preview remains owner-private. A public GitHub repository is not a public student database.

## Present controls
- HTTPS hosting; private D1 database and R2 attachments.
- Google school-account verification, active roles and teacher/class assignment checks.
- Administrator-only school content writes; signed sessions and login attempt limits.
- Suggestions and canteen free text enter private moderation conversations, never automatic public posts.
- Shared client/server language filtering, server input validation and parameterised SQL.
- Rate limits and duplicate vote records; limits vary by action and are not a universal one-action-per-minute policy.
- Local browser preferences. Verified directory classes are stored privately for access control.
- Private PDF preview and download require conversation participation.
- Privacy page and independent-ownership footer.

## Required before school-wide rollout
1. Obtain written principal/advisor/IT approval covering purpose, operators, moderation and escalation.
2. Obtain branding authorisation or remove/replace official logos and naming.
3. Define student photo consent and verify every published media item.
4. Establish the responsible operator, privacy contact, retention period and deletion/access-request workflow.
5. Have school IT review network allowlisting, provider terms, expected traffic, backups and recovery. Do not bypass school firewall policy.
6. Close bootstrap admin access after verified administrators are provisioned; require the school’s account security policy.
7. Run production account/role and attachment checks with school-provided test users and realistic load.
8. Define moderation coverage, reporting escalation and response times. Keyword filters cannot reliably detect all harassment.
9. Review public announcements for personal data before publication. No grades, addresses, national IDs or phone numbers belong on the public board.
10. Confirm a school-approved domain and hosting budget. A custom domain does not establish authorisation.

No configuration guarantees that a school or hosting provider cannot remove or block a site. Approval, policy compliance and operational controls must all be maintained.

## Additional privacy and legal review
Egypt Law 151/2020 treats children's data as sensitive (Article 12) and regulates overseas storage and transfers (Articles 14–16). Executive Regulations issued by Decision 816/2025 add consent, licensing and recordkeeping requirements. A policy page is not a licence or consent record. Obtain a school operator decision and Egyptian professional review of applicable permits, guardian consent, DPO duties and cross-border hosting before real student rollout. Do not assume a US or EU rule automatically applies solely because the app uses an overseas provider.

Sources reviewed on 8 October 2026:
- Law text hosted by ILO NATLEX: https://natlex.ilo.org/dyn/natlex2/natlex2/files/download/111246/EGY111246%20Eng.pdf
- Executive regulation translation: https://shehatalaw.com/wp-content/uploads/2026/01/Shehata-Partners-Publications-Data-Protection-Executive-Regulations-English.pdf (unofficial translation; verify the controlling Arabic text with the school adviser).
- Vercel client upload architecture: https://vercel.com/docs/vercel-blob/client-upload
- Vercel request limits: https://vercel.com/docs/functions/limitations

Required operational decisions still outstanding:
- Operator's legal name, actual privacy contact, consent collection method and evidence; branding/media authorisation.
- Approved retention for chat, files, schedules, reports and audit records. Existing maintenance only cleans completed suggestions and abandoned files; it is not a full retention or data-rights workflow.
- Data access/correction/deletion request handling with verified identity and appeal/escalation responsibilities.
- Provider contracts, data regions, transfer permission and breach response duties/deadlines.
- Restore-tested backups, malware scanning service and independent permission/load testing with school accounts.
- Measured storage/download budget. 100 videos of 500 MB use about 50 GB; 100 pupils downloading one 80 MB video use about 8 GB transfer. A per-file ceiling is not a promise of unlimited free hosting.

## This implementation
- Workspace uses server-assigned roles; schedules are private per teacher. Session times are entered as Cairo wall-clock times. Weekly recurring timetable, current/next session and explicit breaks are supported.
- Teacher publishing is limited server-side to assigned classes; council has student access plus grades/classes/all-school audiences and staff-approval stages. Roster and security settings stay administrator-only.
- New class-scoped workspace posts require authenticated audience membership; changing the local browsing profile cannot grant access. Global posts must be reviewed for personal data.
- Media uploads use 8 MiB parts into private R2, with participant checks on each part and download, a 500 MiB media ceiling, bounded part sizes, three active sessions and a 2 GiB daily reserved allowance. Client retries failed parts up to three times; resuming after closing/reloading the browser is not implemented. Small documents retain structural checks and a 20 MiB ceiling. This is not antivirus scanning.
- Terms and cookie-information routes are published for the restricted pilot. No legal certification is claimed.
