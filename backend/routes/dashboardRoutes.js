import express from "express";
import { studentDashboard, adminDashboard, getDashboardStats } from "../controllers/dashboardController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/stats",
    protect,
    adminOnly,
    getDashboardStats
);

router.get("/student",protect,studentDashboard);

router.get("/admin",protect,adminOnly,adminDashboard);


export default router;