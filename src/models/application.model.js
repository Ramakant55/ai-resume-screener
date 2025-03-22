const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    resumeUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "rejected"],
        default: "pending",
    },
}, { timestamps: true });

module.exports = mongoose.model("Application", ApplicationSchema);