# Specification

## Summary
**Goal:** Add operating system tracking, connection instructions for SSH/RDP, and plan management with expiration dates.

**Planned changes:**
- Add OS field (Windows/Ubuntu) to client records in backend
- Add plan expiration date field to client records in backend
- Update admin panel client registration form with OS dropdown and expiration date picker
- Update admin panel client edit modal to allow editing OS and expiration date
- Display SSH connection instructions on client dashboard when OS is Ubuntu
- Display RDP connection instructions on client dashboard when OS is Windows
- Show plan name and expiration date in client dashboard profile section

**User-visible outcome:** Admins can register clients with their operating system and plan expiration date. Clients see their plan validity and receive OS-specific connection instructions (SSH for Ubuntu, RDP for Windows) on their dashboard.
