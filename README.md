# KeepUp

KeepUp is a scalable task management system under development. The backend of the application runs on Node.js and Express with a PostgreSQL database managed through Prisma.

## Tech Stack

- **Frontend**: Vercel (connected to GitHub)
- **Backend**: Render (connected to GitHub)
- **Database**: PostgreSQL on Render
- **ORM**: Prisma
- **Email**: Resend (connected to GitHub)

## Local Development Tools

- Node.js
- Docker
- Insomnia
- Visual Studio Code + Tailwind CSS
- Figma

## Day 1 Goals

The initial goal is to build a functional foundation that can grow in the future. Key features include:

- Account management with a unique account ID
- Ability to create new accounts and add users under an account ID
- User authentication with username and password (with optional Gmail or Microsoft linkage)
- Admin and basic user roles (future permissions can be added later)
- Restrict user access to certain projects
- User home page showing only their tasks
- Company and project hierarchy:
  - Create companies and assign users to them
  - Assign projects to companies
  - A master company under each account ID for unrestricted users
- Project categories/folders for organization
- Optional email-based ticket creation
- Customizable notifications for:
  - Ticket closure
  - Mentions in comments
  - Comments on tickets you opened
  - Ticket assignments
  - Reassignment of your tickets
- Project boards with unlimited task lists and tasks
- Project and task list templates
- Task attributes:
  - Name
  - Assigned users (multi-select)
  - Start date and due date
  - Time logs
  - Tags (project specific, account wide, or client wide)
  - Priority field (6 editable options)
  - Created date/time
  - Progress bar
  - Unique task ID number
  - Description
  - File attachments
  - Comments with @ mentions
  - Repeat on a set cadence
  - Task history
  - Followers (notified on all updates)

## Future Plans

KeepUp aims to be scalable with features such as:

- Task dependencies
- Proof review/approvals
- Activity logs
- Integration with multiple Google Drives or user-linked drives
- Additional board views (Gantt, Kanban, etc.)
- Support for multiple customers/SaaS deployments
- Feature limitations based on account plans
- Automations triggered by actions
- Search across task names, IDs, descriptions, and comments
- Restrict category visibility to projects where the user is active
- Free users with limited permissions
- Custom fields for tasks

This README outlines the current vision and early development goals for KeepUp. The codebase is intentionally minimal as the project is in its initial stages.

