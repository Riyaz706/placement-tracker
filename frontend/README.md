# Placement Tracker - Frontend Client

This is the frontend client for the Placement Tracker application. It is a Single Page Application (SPA) providing dashboards and management tools for students and administrators.

## Tech Stack

* **Framework:** React (18+)
* **Build System:** Vite
* **Styling:** Tailwind CSS (v4)
* **Routing:** React Router Dom (v6)
* **HTTP Client:** Axios
* **Context State:** Custom AuthContext & ToastContext

---

## Folder Structure

* **`public/`**: Static assets like icons and favicons.
* **`src/api/`**: Axios configuration and base client config.
* **`src/assets/`**: Visual assets (logos, images).
* **`src/components/`**: Reusable components (e.g., CompanyCard, Sidebar, SkeletonLoader, StatusBadge, ProtectedRoute).
* **`src/context/`**: React context providers for authentication and application notifications.
* **`src/layouts/`**: Dashboard layouts grouping sidebar and content.
* **`src/pages/`**: View templates:
  * **Student Views (`src/pages/student/`):** Dashboard, profile, company listings, prediction, and applications.
  * **Admin Views (`src/pages/admin/`):** Dashboard, company creator, analytics, and applicant tracking.

---

## Environment Configuration

By default, the client determines the backend API URL dynamically based on the build mode:
* **Development (`npm run dev`):** Resolves to `http://localhost:5000/api`.
* **Production (`npm run build`):** Resolves to `https://placement-tracker-m7yd.onrender.com/api`.

To override the API URL manually, create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=https://your-custom-backend-api.com/api
```

---

## Scripts

Execute these scripts from the `frontend/` directory:

* **Start Development Server:**
  ```bash
  npm run dev
  ```
* **Build Application for Production:**
  ```bash
  npm run build
  ```
* **Lint Files:**
  ```bash
  npm run lint
  ```
* **Preview Production Build Locally:**
  ```bash
  npm run preview
  ```
