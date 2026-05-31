import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import path from "path";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================

// Enable CORS
app.use(cors());

// Parse JSON data
app.use(express.json());


// ================= ROUTES =================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Placement Tracker API Running"
    });
});

app.use("/api/users", userRoutes);
app.use("/api/companies",companyRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/dashboard",dashboardRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR HANDLER:", err);
    res.status(500).json({ success: false, message: err.message, stack: err.stack });
});


// ================= DATABASE CONNECTION =================

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/placement");
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Database Connection Error:", error.message);
        process.exit(1);
    }
};


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

};

startServer();
