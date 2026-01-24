# Keystone - Company Portal Plan

Keystone is a secure company portal designed for organizations to centralize people management, internal resources, and requests.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **Database & Auth:** Supabase
- **Deployment:** Cloudflare Pages
- **Font:** Inter

## Core Features
### 1. Workspace Management
- Organization creation and configuration.
- Workspace settings (branding, custom domains - future).

### 2. Member & Access Control
- Invitation system via email.
- Role-Based Access Control (RBAC):
  - **Owner:** Full control.
  - **Admin:** Management of members and resources.
  - **Member:** Access to internal resources and requests.
  - **Guest:** Limited access.
- Permission sets for specific modules.
- Approval rules for sensitive actions.

### 3. People Management
- Employee directory.
- Profile management.
- Team organization.

### 4. Internal Resources
- Document library (KB).
- Links and tools directory.
- Company announcements.

### 5. Requests & Approvals
- Standardized request forms (IT, HR, Finance).
- Automated approval workflows based on rules.

## Design System
- **Theme:** Light
- **Primary Color:** `#00674F` (Keystone Green)
- **Typography:** Inter (Sans-serif)
- **Border Radius:** Minimal (2px) for a sharp, professional look.

## Project Structure
- `src/app`: Routes and layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Supabase client, utility functions.
- `src/hooks`: Custom React hooks.
- `src/types`: TypeScript definitions.
- `src/services`: Business logic and data fetching.

## Roadmap
1. [x] Project Initialization
2. [ ] Supabase Integration (Auth & DB Schema)
3. [ ] Workspace & Invitation Flow
4. [ ] Dashboard & Directory
5. [ ] Resource Library
6. [ ] Request System
