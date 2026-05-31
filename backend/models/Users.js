import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },

    branch: {
        type: String,
        required: function () {
            return this.role === "student";
        }
    },

    cgpa: {
        type: Number,
        required: function () {
            return this.role === "student";
        }
    },

    skills: {
        type: [String],
        default: []
    },

    resume: {
        type: String,
        default: ""
    },

    github: {
        username: { type: String, default: "" },
        repos: { type: Number, default: 0 },
        lastSynced: { type: Date }
    },

    leetcode: {
        username: { type: String, default: "" },
        solved: { type: Number, default: 0 },
        lastSynced: { type: Date }
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;