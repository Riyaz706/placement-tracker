import mongoose from "mongoose";

const companySchema = new mongoose.Schema({

    companyName: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },

    package: {
        type: Number,
        required: true
    },

    minCGPA: {
        type: Number,
        required: true
    },

    allowedBranches: {
        type: [String],
        required: true
    },  

    requiredSkills: {
        type: [String],
        default: []
    },
    
    deadline: {
        type: Date,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, 

}, {
    timestamps: true
});

const Company = mongoose.model("Company", companySchema);

export default Company;