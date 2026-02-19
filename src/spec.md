# Specification

## Summary
**Goal:** Add client editing capabilities, client name and password fields, password-based authentication, and network monitoring status toggle in the admin panel.

**Planned changes:**
- Add Nome (client name) and Senha_Cliente (client password) fields to backend ClientRecord and all CRUD operations
- Create backend update function to modify all client fields by ID_Luid
- Add network monitoring status field with "normal" and "offline" values and management functions
- Update ClientRegistrationForm to include Nome and Senha_Cliente input fields
- Create client edit form/modal in admin panel for editing all client fields
- Update ClientList to display Nome column
- Update client login flow to require both ID_Luid and Senha_Cliente for authentication
- Add network monitoring status toggle control in admin panel with Normal/Offline options
- Modify network speed simulation to display zero Gbps when status is Offline and normal oscillating speeds when Normal
- Add frontend mutation hooks for updating clients and managing monitoring status
- Generate migration.mo to preserve existing client data when adding new fields

**User-visible outcome:** Administrators can edit client information, register clients with names and passwords, and toggle network monitoring status between Normal and Offline. Clients must authenticate with both ID and password to access their dashboard. Network speed displays zero when monitoring is set to Offline.
