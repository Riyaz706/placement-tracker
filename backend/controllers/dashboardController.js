import Application from "../models/Application.js";
import Company from "../models/Company.js";
import User from "../models/Users.js";

export const getDashboardStats = async (req, res) => {

    try {

        // Total students
        const totalStudents =
            await User.countDocuments({
                role: "student"
            });

        // Total companies
        const totalCompanies =
            await Company.countDocuments();

        // Total applications
        const totalApplications =
            await Application.countDocuments();

        // Selected students
        const selectedStudents =
            await Application.countDocuments({
                status: "Hired"
            });

        // Rejected students
        const rejectedStudents =
            await Application.countDocuments({
                status: "Rejected"
            });

        // Placement percentage
        const placementPercentage =
            totalStudents > 0

                ? (
                    (selectedStudents / totalStudents) * 100
                ).toFixed(2)

                : 0;

        res.status(200).json({

            success: true,

            stats: {
                totalStudents,
                totalCompanies,
                totalApplications,
                selectedStudents,
                rejectedStudents,
                placementPercentage
            }

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const studentDashboard = async (req, res) => {

    try {

        const total =

            await Application.countDocuments({

                student: req.user.id

            });

        const shortlisted =

            await Application.countDocuments({

                student: req.user.id,

                status: "Shortlisted"

            });

        const rejected =

            await Application.countDocuments({

                student: req.user.id,

                status: "Rejected"

            });

        const hired =

            await Application.countDocuments({

                student: req.user.id,

                status: "Hired"

            });

        res.status(200).json({

            success: true,

            totalApplications: total,

            shortlisted,

            rejected,

            hired

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const adminDashboard = async (req, res) => {

    try {

        const totalStudents =

            await User.countDocuments({

                role: "student"

            });

        const totalCompanies =

            await Company.countDocuments();

        const totalApplications =

            await Application.countDocuments();

        const hiredStudents =

            await Application.countDocuments({

                status: "Hired"

            });

        res.status(200).json({

            success: true,

            totalStudents,

            totalCompanies,

            totalApplications,

            hiredStudents

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};