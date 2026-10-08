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
