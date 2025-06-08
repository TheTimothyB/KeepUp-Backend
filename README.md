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

Below is a quick reference for the available endpoints.

### Authentication
- `POST /auth/register` – Registers a user using `{ username, password }` and returns `{ token }`.
- `POST /auth/login` – Logs in with `{ username, password }` and returns `{ token }`.

### Accounts & Users
- `POST /accounts` – Create an account via `{ name }`.
- `POST /accounts/:accountId/users` – Add a user to an account using `{ username, password, role? }`.

### Boards
- `POST /boards` – Create a project board.
- `GET /boards/:id` – Retrieve a board and its lists.
- `PUT /boards/:id` – Update a board.
- `DELETE /boards/:id` – Delete a board.
- `POST /boards/:id/lists` – Add a list to a board.
- `PUT /lists/:id` – Update a list.
- `DELETE /lists/:id` – Delete a list.
- `POST /lists/:id/tasks` – Add a task to a list.
- `PUT /tasks/:id` – Update a board task.
- `DELETE /tasks/:id` – Delete a board task.

### Projects & Categories
- `POST /categories` – Create a project category using `{ name, accountId }`.
- `GET /categories` – List categories (filter by `accountId` query param).
- `PATCH /categories/:id` – Rename a category.
- `DELETE /categories/:id` – Remove a category.
- `POST /projects` – Create a project using `{ name, accountId, companyId, categoryId? }`.
- `GET /projects/:id` – Retrieve a project (authorization required).
- `PATCH /projects/:id` – Update a project.

### Companies
- `POST /companies` – Create a company via `{ name, accountId, isMasterCompany? }`.
- `POST /companies/:id/users` – Assign users to a company.
- `GET /companies/:id` – Get a company with its users and projects.

### Tasks
- `POST /tasks` – Create a task.
- `GET /tasks/:taskId` – Retrieve a task.
- `POST /tasks/:taskId/timelogs` – Log time on a task.
- `PATCH /tasks/:taskId/progress` – Update a task’s progress percentage.
- `PATCH /tasks/:taskId/tags` – Update task tags.
- `POST /tags` – Create a tag.
- `POST /tasks/:taskId/comments` – Add a comment.
- `GET /tasks/:taskId/comments` – List comments on a task.
- `POST /tasks/:taskId/followers` – Follow or unfollow a task.
- `POST /tasks/:taskId/repeat` – Set repeat settings for a task.
- `POST /tasks/process-repeats` – Process repeating tasks.

### Misc
- `GET /health` – Simple health check.
- `GET /admin` – Example protected admin route.
