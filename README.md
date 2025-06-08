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

## Role Management
KeepUp now defines two user roles: `ADMIN` and `BASIC`. Future permission settings will be added to these roles as the project evolves.
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

## Authentication

Use `/auth/register` to create a new user with a JSON body containing `username` and `password`. Log in via `/auth/login` with the same fields to receive a JWT token.

### Adding a user via script

For development you can also create a user from the command line. Set the
environment variables `USER_EMAIL`, `USER_PASSWORD` and `ACCOUNT_ID` then run:

```bash
npx ts-node scripts/createUser.ts
```

This will create a BASIC role user under the specified account.

This README outlines the current vision and early development goals for KeepUp. The codebase is intentionally minimal as the project is in its initial stages.

## Project Categories API

Projects can be grouped into categories for better organization. Use the
following endpoints to manage them:

- `POST /categories` - create a category
- `GET /categories` - list categories (filter by `accountId` query param)
- `PATCH /categories/:id` - rename a category
- `DELETE /categories/:id` - remove a category

When creating a project via `POST /projects`, omit `categoryId` to automatically
place it in the `Uncategorized` group for its account.


## Backend API Reference

Below is a quick reference for the main backend endpoints.

### Authentication
- `POST /auth/register` – Creates a new account using `{ email, password, name }`.
- `POST /auth/login` – Logs a user in with `{ email, password }` and returns `{ token }`.

### Dashboard & Tasks
- `GET /tasks/me` – Returns tasks assigned to the current user.
- `PATCH /tasks/:id` – Updates a task’s list when moving cards on the board.

### Projects & Board
- `GET /projects` – Fetches all projects.
- `POST /projects` – Creates a project using `{ name }`.
- `GET /projects/:id/board` – Retrieves task lists and tasks for a project board.

### Companies & Users (Admin)
- `GET /companies` – Lists companies.
- `POST /companies` – Creates a company via `{ name }`.
- `GET /users` – Lists users.
- `PATCH /users/:id` – Assigns a company to a user using `{ companyId }`.
- `PATCH /users/:id/role` – Updates a user’s role with `{ role }`.

### Notifications
- `GET /notifications` – Retrieves notifications for the signed‑in user.
- `PATCH /notifications/:id/read` – Marks a notification as read.
