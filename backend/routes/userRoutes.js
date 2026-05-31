import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    uploadResume,
    syncProfile
} from "../controllers/userController.js";

const router = express.Router();


//Register the user
router.post("/register", registerUser);

//Login the user
router.post("/login", loginUser);

//Admin Dashboard Route
router.get("/admin-dashboard", protect, adminOnly, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Welcome Admin",
        user: req.user
    });

}
);

//Protected profile route
router.get("/profile", protect, getProfile);

//Protected profile update route
router.put("/profile", protect, updateProfile);

//Protected resume upload route
router.put("/resume",protect,upload.single("resume"),uploadResume);

// Sync external profile (GitHub, LeetCode)
router.post("/sync-profile", protect, syncProfile);

export default router;