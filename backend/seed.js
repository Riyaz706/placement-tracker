import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/Users.js";
import Company from "./models/Company.js";
import Application from "./models/Application.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("Error: MONGO_URI is not defined in the .env file.");
  process.exit(1);
}

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected. Clearing old database records...");

    // Delete existing records
    await User.deleteMany({});
    await Company.deleteMany({});
    await Application.deleteMany({});
    console.log("Existing records cleared.");

    // Hash passwords
    const adminPassword = await bcrypt.hash("admin123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);

    // Create Admin User
    const admin = await User.create({
      name: "Admin User",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "admin",
    });
    console.log("Admin user seeded.");

    // Create Student Users
    const john = await User.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: studentPassword,
      role: "student",
      branch: "CSE",
      cgpa: 9.2,
      skills: ["React", "Node.js", "JavaScript"],
    });

    const jane = await User.create({
      name: "Jane Smith",
      email: "janesmith@gmail.com",
      password: studentPassword,
      role: "student",
      branch: "ECE",
      cgpa: 8.5,
      skills: ["Python", "C++", "Embedded Systems"],
    });

    const bob = await User.create({
      name: "Bob Johnson",
      email: "bobjohnson@gmail.com",
      password: studentPassword,
      role: "student",
      branch: "CSE",
      cgpa: 7.8,
      skills: ["Java", "SQL", "HTML"],
    });
    console.log("Student users seeded.");

    // Create Companies (associated with Admin)
    const google = await Company.create({
      companyName: "Google",
      role: "Software Engineer",
      package: 45,
      minCGPA: 9.0,
      allowedBranches: ["CSE", "IT"],
      requiredSkills: ["Data Structures", "Algorithms", "System Design"],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      description: "Join our core engineering team.",
      createdBy: admin._id,
    });

    const microsoft = await Company.create({
      companyName: "Microsoft",
      role: "Software Engineering Intern",
      package: 20,
      minCGPA: 8.0,
      allowedBranches: ["CSE", "IT", "ECE"],
      requiredSkills: ["C#", "Azure", "JavaScript"],
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      description: "Exciting internship opportunity in the cloud division.",
      createdBy: admin._id,
    });

    const qualcomm = await Company.create({
      companyName: "Qualcomm",
      role: "Hardware Engineer",
      package: 18,
      minCGPA: 8.0,
      allowedBranches: ["ECE", "EEE"],
      requiredSkills: ["Verilog", "C", "Microcontrollers"],
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      description: "Work on next-generation Snapdragon processors.",
      createdBy: admin._id,
    });
    console.log("Companies seeded.");

    // Create Applications
    await Application.create({
      student: john._id,
      company: google._id,
      status: "Shortlisted",
    });

    await Application.create({
      student: john._id,
      company: microsoft._id,
      status: "Applied",
    });

    await Application.create({
      student: jane._id,
      company: qualcomm._id,
      status: "Hired",
    });

    await Application.create({
      student: bob._id,
      company: microsoft._id,
      status: "Rejected",
    });
    console.log("Applications seeded.");

    console.log("Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedData();
