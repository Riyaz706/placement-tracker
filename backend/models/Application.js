import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },

status: {

    type: String,

    enum: [

        "Applied",
        "Shortlisted",
        "Rejected",
        "Hired"

    ],

    default: "Applied"

}

}, {
    timestamps: true
});

const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;