# Placement Tracker - Backend API

This is the backend server for the Placement Tracker application. It handles authentication, data storage, resume uploads via Cloudinary, email notifications, and statistics aggregation.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing
* **File Uploads:** Multer & Cloudinary
* **Emails:** Resend API / Nodemailer

---

## Folder Structure

* **`config/`**: External service integrations (e.g., Cloudinary).
* **`controllers/`**: Request handlers for routes (Auth, Companies, Applications, Dashboard).
* **`middleware/`**: Authentication checks and file upload configurations.
* **`models/`**: Mongoose schemas representing the database structure.
* **`routes/`**: API endpoints grouping.
* **`utils/`**: Helper utilities (e.g., email dispatching).

---

## Environment Variables

Create a `.env` file in the root of the `backend/` directory and configure the following variables:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
MONGO_URI=your_mongodb_connection_uri
RESEND_API_KEY=your_resend_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## Scripts

Execute these scripts from the `backend/` directory:

* **Start Production Server:**
  ```bash
  npm start
  ```
* **Start Development Server (with nodemon auto-restart):**
  ```bash
  npm run dev
  ```
* **Seed Database:**
  Populates the database with test profiles, companies, and applications.
  ```bash
  npm run seed
  ```

---

## API Endpoints

### Authentication & Users (`/api/users`)
* `POST /register`: Registers a new user. Only `@gmail.com` addresses are permitted.
* `POST /login`: Logs in an existing user and returns a JWT token.
* `GET /profile`: Retrieves the authenticated user's profile.
* `PUT /profile`: Updates profile fields.
* `POST /upload-resume`: Uploads a student resume PDF to Cloudinary.
* `POST /sync-profile`: Syncs coding data from external platforms (GitHub/LeetCode).

### Companies (`/api/companies`)
* `GET /`: Retrieves all active company job postings.
* `GET /:id`: Retrieves details of a specific job posting.
* `POST /`: Creates a new job posting (Admin only).
* `PUT /:id`: Updates a job posting (Admin only).
* `DELETE /:id`: Deletes a job posting (Admin only).

### Applications (`/api/applications`)
* `POST /apply`: Submits a job application for a company.
* `GET /my-applications`: Lists applications submitted by the logged-in student.
* `GET /company/:companyId`: Lists all applicants for a company posting (Admin only).
* `PUT /status/:id`: Updates the recruitment status of an applicant (Admin only).

### Dashboard (`/api/dashboard`)
* `GET /`: Returns aggregated system statistics, branch-wise metrics, and recruitment funnel distributions.
