## 1. Branch Naming Conventions
Use a **prefix/description** system. 
All branch names should be lowercase and use hyphens `-` to separate words.

`feature/`: New functionality (e.g., `feature/jwt-auth`, `feature/clinic-schema`)
`bugfix/`: Fixing a bug (e.g., `bugfix/fix-postgres-connection`)
`refactor/`: Improving code without changing functionality (e.g., `refactor/models-cleanup`)
`docs/`: Documentation changes only (e.g., `docs/update-readme`)

**Command:** `git checkout -b feature/your-feature-name`

---

## 2. Commit Message Standards
**Format:** `<type>: <short description>`

`feat:`: A new feature for the user.
`fix:`: A bug fix.
`chore:`: Updating build tasks, package manager configs, etc. (e.g., `chore: add .env.example`)
`style:`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
`refactor`: A code change that neither fixes a bug nor adds a feature.

**Example:** `git commit -m "feat: implement reservation logic for hotel room"`

---

## 3. Node.js & JavaScript Naming Rules

**Variables & Functions**: `camelCase` (e.g., `getPatientHistory`)
**Classes & Constructors**: `PascalCase` (e.g., `UserSchema` or `AppointmentModel`)
**Folders & Files**: `snake_case` (e.g., `booking_utils.js`)
**Constants**: `UPPER_CASE` (e.g., `PORT = 5`)

### Express & MongoDB Specifics:

* **Models:** Use `PascalCase` and singular names (e.g., `Post`, not `Posts`).
* **Controllers**: Name them based on the resource (e.g., `appointmentController.js`).
* **Middleware**: Use descriptive verbs (e.g., `validateToken.js` or `is_admin.js`).
* **Routes**: Always pluralize the resource in the URL (e.g., `/api/v1/appointments`).

---