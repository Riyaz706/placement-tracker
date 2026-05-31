import jwt from "jsonwebtoken";
import User from "../models/Users.js";

export const protect = async (req, res, next) => {

    try {

        let token;

        // Check token exists
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            token = req.headers.authorization.split(" ")[1];

        }

        // No token
        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Not authorized, no token"
            });

        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded data in request
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, user not found"
            });
        }

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Token failed"
        });

    }

};

export const adminOnly = (req, res, next) => {

    try {

        if (req.user.role !== "admin") {

            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });

        }

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};