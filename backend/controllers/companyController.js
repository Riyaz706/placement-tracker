import Company from "../models/Company.js";
import User from "../models/Users.js";

export const createCompany = async (req, res) => {

    try {

        const {
            companyName,
            role,
            package: salaryPackage,
            minCGPA,
            allowedBranches,
            requiredSkills,
            deadline,
            description
        } = req.body;

        const company = await Company.create({

            companyName,
            role,
            package: salaryPackage,
            minCGPA,
            allowedBranches,
            requiredSkills,
            deadline,
            description,

            createdBy: req.user.id

        });

        res.status(201).json({
            success: true,
            message: "Company created successfully",
            company
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getCompanies = async (req, res) => {

    try {

        const {
            search,
            branch,
            minPackage,
            skill
        } = req.query;

        let query = {};
        // Search by company name
        if (search) {

            query.companyName = {
                $regex: search,
                $options: "i"
            };

        }
        // Filter by branch
        if (branch) {

            query.allowedBranches = {
                $in: [branch]
            };

        }
        // Filter by package
        if (minPackage) {

            query.package = {
                $gte: Number(minPackage)
            };

        }
        // Filter by skills
        if (skill) {

            query.requiredSkills = {
                $in: [skill]
            };

        }
        const companies =
            await Company.find(query)
                .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            count: companies.length,

            companies

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getSingleCompany = async (req, res) => {

    try {
        const company = await Company.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        res.status(200).json({
            success: true,
            company
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        const {
            companyName,
            role,
            package: salaryPackage,
            minCGPA,
            allowedBranches,
            deadline,
            description
        } = req.body;
        // Update fields
        company.companyName =
            companyName || company.companyName;

        company.role =
            role || company.role;

        company.package =
            salaryPackage || company.package;

        company.minCGPA =
            minCGPA || company.minCGPA;

        company.allowedBranches =
            allowedBranches || company.allowedBranches;

        company.deadline =
            deadline || company.deadline;

        company.description =
            description || company.description;

        await company.save();

        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        await company.deleteOne();
        res.status(200).json({
            success: true,
            message: "Company deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const getEligibleStudents = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        const eligibleStudents = await User.find({
            role: "student",
            cgpa: {
                $gte: company.minCGPA
            },
            branch: {
                $in: company.allowedBranches
            }
        }).select("-password");
        res.status(200).json({
            success: true,
            count: eligibleStudents.length,
            students: eligibleStudents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getEligibleCompanies = async (req, res) => {

    try {
            const companies = await Company.find({
                minCGPA: {
                    $lte: req.user.cgpa
                },
                allowedBranches: {
                    $in: [req.user.branch]
                },
                $or: [
                    { requiredSkills: { $size: 0 } },
                    { requiredSkills: { $in: req.user.skills || [] } }
                ]
            });

        res.status(200).json({
            success: true,
            count: companies.length,
            companies
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getAllCompanies = async (req, res) => {

    try {

        const {
            search,
            branch,
            minPackage,
            sort,
            page = 1,
            limit = 5
        } = req.query;

        let query = {};

        const skip = (page - 1) * limit;

        // Search by company name
        if (search) {
            query.companyName = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by branch
        if (branch) {
            query.allowedBranches = branch;
        }

        // Filter by package
        if (minPackage) {
            query.package = {
                $gte: Number(minPackage)
            };
        }

        let companiesQuery = Company.find(query);

        // Sorting
        if (sort === "high") {
            companiesQuery = companiesQuery.sort({
                package: -1
            });
        }

        if (sort === "low") {
            companiesQuery = companiesQuery.sort({
                package: 1
            });
        }

        const total = await Company.countDocuments(query);
        const pages = Math.ceil(total / limit);
        const companies = await companiesQuery
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            page: Number(page),
            pages,
            total,
            count: companies.length,
            companies
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};