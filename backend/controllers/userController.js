import User from "../models/Users.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


//register controller
export const registerUser = async (req, res) => {

    try {

        const { name, email, password,confirmPassword, branch, cgpa,role } = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Only Gmail addresses (@gmail.com) are allowed"
            });
        }

        const existingUser = await User.findOne({ email });
        
        if(password!==confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }
        
        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            branch,
            cgpa,
            role
        });
        
        const createdUser = await User.findById(user._id).select("-password");
        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: createdUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//login controller
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check user exists
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });

        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Remove password from response
        const loggedInUser = await User.findById(user._id).select("-password");

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: loggedInUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


//get profile controller
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//update profile controller
export const updateProfile = async (req, res) => {

    try {

        const {
            name,
            branch,
            cgpa,
            skills
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // Update fields
        user.name = name || user.name;
        if (user.role === "student") {
            user.branch = branch || user.branch;
            user.cgpa = cgpa || user.cgpa;
            user.skills = skills || user.skills;
        }

        await user.save();

        const updatedUser = await User.findById(user._id)
            .select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

//upload resume controller
export const uploadResume = async (req, res) => {

    try {

        console.log(req.file);

        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "No file uploaded"

            });

        }

        const user =
            await User.findById(req.user.id);

        user.resume = req.file.path;

        await user.save();

        res.status(200).json({

            success: true,
            message: "Resume uploaded successfully",
            resume: user.resume

        });

    } catch (error) {

    console.log("CLOUDINARY ERROR:");

    console.log(error);

    res.status(500).json({

        success: false,

        message: error.message,

        error

    });

}

};


//sync profile controller
export const syncProfile = async (req, res) => {
    try {
        const { platform, username } = req.body;
        
        if (!platform || !username) {
            return res.status(400).json({ success: false, message: "Platform and username are required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (platform === 'github') {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error("GitHub user not found or API limit reached");
            const data = await response.json();
            
            user.github = {
                username,
                repos: data.public_repos || 0,
                lastSynced: new Date()
            };
        } else if (platform === 'leetcode') {
            const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
            if (!response.ok) throw new Error("LeetCode user not found or API down");
            const data = await response.json();
            
            if (data.status === "error") {
                throw new Error(data.message || "LeetCode user not found");
            }
            
            user.leetcode = {
                username,
                solved: data.totalSolved || 0,
                lastSynced: new Date()
            };
        } else {
            return res.status(400).json({ success: false, message: "Invalid platform" });
        }

        await user.save();
        const updatedUser = await User.findById(user._id).select("-password");

        res.status(200).json({
            success: true,
            message: `${platform} profile synced successfully`,
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};