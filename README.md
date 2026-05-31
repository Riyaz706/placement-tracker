# Placement Tracker

A modern web application designed to streamline and manage the campus placement process. It provides roles for both students (to browse job listings, track applications, and sync coding profiles) and administrators (to manage company postings, review applicants, and analyze placement trends).

## Project Structure

This repository is organized as a monorepo containing two main parts:
* **`backend/`**: An Express-based REST API built with Node.js and MongoDB (Mongoose).
* **`frontend/`**: A React application built with Vite and Tailwind CSS.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas cluster)

---

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Riyaz706/placement-tracker.git
cd placement-tracker
```

#### 2. Set Up the Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables by creating a `.env` file (see the [Backend README](backend/README.md) for details).
4. (Optional) Seed the database with test data:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

#### 3. Set Up the Frontend
1. Navigate to the frontend folder (from the project root):
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Features

### For Students
* **Dashboard & Metrics:** View personalized placement stats, profile sync status, and application counters.
* **Browse Companies:** View active job postings with eligibility criteria (min CGPA, allowed branches).
* **Application Tracking:** Track application status updates (Applied, Shortlisted, Rejected, Hired).
* **Profile Integration:** Sync GitHub repository count and LeetCode solved problems statistics.

### For Admins
* **Dashboard Analytics:** Visual metrics on average packages, branch-wise placement percentages, and recruitment funnels.
* **Company Management:** Create, update, and manage job opening postings.
* **Applicant Review:** Track and update applicant status for each job opening.

---

## Technologies Used

* **Frontend:** React, Vite, Tailwind CSS, Axios, React Router Dom
* **Backend:** Node.js, Express.js, Mongoose, JWT, Cloudinary, Resend API
* **Database:** MongoDB
