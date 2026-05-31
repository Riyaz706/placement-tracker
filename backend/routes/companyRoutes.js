import express from "express";

import {
    createCompany,
    getSingleCompany,
    updateCompany,
    deleteCompany,
    getEligibleStudents,
    getEligibleCompanies,
    getAllCompanies
} from "../controllers/companyController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();


// CREATE COMPANY
router.post("/", protect, adminOnly, createCompany);


// PUBLIC ROUTE
router.get("/", getAllCompanies);


// ELIGIBLE COMPANIES
router.get(
    "/eligible",
    protect,
    getEligibleCompanies
);


// ELIGIBLE STUDENTS
router.get(
    "/:id/eligible-students",
    protect,
    adminOnly,
    getEligibleStudents
);


// SINGLE COMPANY
router.get("/:id", protect, getSingleCompany);


// UPDATE COMPANY
router.put("/:id", protect, adminOnly, updateCompany);


// DELETE COMPANY
router.delete("/:id", protect, adminOnly, deleteCompany);

export default router;