# Specification

## Summary
**Goal:** Add VM status management for clients, implement live chat support between clients and administrators, and enable multi-admin account management in the admin panel.

**Planned changes:**
- Add VM status field (online/offline/maintenance) to client records with visual indicators in the admin panel
- Allow administrators to change VM status for individual clients through the edit modal
- Implement chat system with floating chat button on client dashboard and admin chat interface in the admin panel
- Add backend storage and management for multiple administrator accounts
- Create admin member management interface to add, edit, and remove administrator accounts
- Update admin login to authenticate against backend-stored admin accounts instead of hardcoded credentials

**User-visible outcome:** Clients can see their VM status and communicate with support via a floating chat button. Administrators can manage VM statuses, respond to client messages through a dedicated chat interface, and add/manage multiple admin accounts for the panel.
