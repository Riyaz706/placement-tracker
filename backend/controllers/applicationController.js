import Application from "../models/Application.js";
import Company from "../models/Company.js";
import sendEmail from "../utils/sendEmail.js";


// APPLY TO COMPANY
export const applyToCompany = async (req, res) => {

    try {

        const company =
            await Company.findById(req.params.id);

        if (!company) {

            return res.status(404).json({
                success: false,
                message: "Company not found"
            });

        }

        // Only students can apply
        if (req.user.role !== "student") {

            return res.status(403).json({
                success: false,
                message: "Only students can apply"
            });

        }

        // Check eligibility
        if (req.user.cgpa < company.minCGPA) {
            return res.status(400).json({
                success: false,
                message: `Your CGPA (${req.user.cgpa}) does not meet the minimum required CGPA (${company.minCGPA}) for this company.`
            });
        }

        if (!company.allowedBranches.includes(req.user.branch)) {
            return res.status(400).json({
                success: false,
                message: `Your branch (${req.user.branch}) is not allowed to apply for this company.`
            });
        }

        // Check duplicate application
        const alreadyApplied =
            await Application.findOne({

                student: req.user.id,
                company: company._id

            });

        if (alreadyApplied) {

            return res.status(400).json({
                success: false,
                message: "Already applied"
            });

        }

        // Create application
        const application =
            await Application.create({

                student: req.user.id,
                company: company._id

            });

        // Send email
        await sendEmail(

            req.user.email,

            `Application Submitted | ${company.companyName}`,

            `
            <div style="font-family: Arial; padding: 20px;">

                <h2>
                    Application Submitted Successfully
                </h2>

                <p>
                    Dear ${req.user.name},
                </p>

                <p>
                    Your application has been successfully submitted.
                </p>

                <hr>

                <h3>Company Details</h3>

                <p>
                    <strong>Company:</strong>
                    ${company.companyName}
                </p>

                <p>
                    <strong>Role:</strong>
                    ${company.role}
                </p>

                <p>
                    <strong>Package:</strong>
                    ${company.package} LPA
                </p>

                <p>
                    <strong>Minimum CGPA:</strong>
                    ${company.minCGPA}
                </p>

                <p>
                    <strong>Status:</strong>
                    Applied
                </p>

                <hr>

                <p>
                    Please check your dashboard regularly
                    for further updates.
                </p>

                <p>
                    Best Regards,
                </p>

                <p>
                    Training & Placement Office
                </p>

            </div>
            `
        );

        res.status(201).json({

            success: true,
            message: "Applied successfully",
            application

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// GET MY APPLICATIONS
export const getMyApplications = async (req, res) => {

    try {

        const applications =
            await Application.find({

                student: req.user.id

            })

                .populate(
                    "company",
                    "companyName role package deadline"
                )

                .sort({
                    createdAt: -1
                });

        res.status(200).json({

            success: true,
            count: applications.length,
            applications

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// GET COMPANY APPLICANTS
export const getCompanyApplicants = async (req, res) => {

    try {

        const applications =
            await Application.find({

                company: req.params.id

            })

                .populate(
                    "student",
                    "name email branch cgpa skills resume"
                )

                .populate(
                    "company",
                    "companyName role package"
                )

                .sort({
                    createdAt: -1
                });

        res.status(200).json({

            success: true,
            count: applications.length,
            applications

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// UPDATE APPLICATION STATUS
export const updateApplicationStatus = async (req, res) => {

    try {

        const { status } = req.body;

        // Valid statuses
        const validStatuses = [

            "Applied",
            "Shortlisted",
            "Rejected",
            "Hired"

        ];

        // Validate status
        if (!validStatuses.includes(status)) {

            return res.status(400).json({

                success: false,
                message: "Invalid status"

            });

        }

        // Find application
        const application =
            await Application.findById(req.params.id)
                .populate("student","name email branch cgpa skills resume")
                .populate("company","companyName role package");

        if (!application) {

            return res.status(404).json({

                success: false,
                message: "Application not found"

            });

        }

        // Update status
        application.status = status;

        await application.save();

        // Send email notification
        await sendEmail(

            application.student.email,

            `Application Status Updated | ${application.company.companyName}`,

            `
            <div style="font-family: Arial; padding: 20px;">

                <h2>
                    Application Status Updated
                </h2>

                <p>
                    Dear ${application.student.name},
                </p>

                <p>
                    Your application status has been updated.
                </p>

                <hr>

                <h3>Application Details</h3>

                <p>
                    <strong>Company:</strong>
                    ${application.company.companyName}
                </p>

                <p>
                    <strong>Role:</strong>
                    ${application.company.role}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${status}
                </p>

                <hr>

                <p>
                    Please login to your dashboard
                    for more updates.
                </p>

                <p>
                    Best Regards,
                </p>

                <p>
                    Training & Placement Office
                </p>

            </div>
            `
        );

        res.status(200).json({

            success: true,
            message: "Application status updated",
            application

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};