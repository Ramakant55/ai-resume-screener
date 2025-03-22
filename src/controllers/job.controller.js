const Job = require("../models/job.model");

exports.postJob = async (req, res) => {
    try {
        const { title, description, company, location } = req.body;
        const job = new Job({
            title,
            description,
            company,
            location,
            createdBy: req.user.id,
        })
        await job.save();
        res.status(201).json({ message: "Job posted successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while posting the job" });
    }
}

exports.reviewJob = async (req, res) => {
    try {
        const { jobId, status } = req.body;
        if (!["approved", "rejected"]) {
            return res.status(400).json({ message: "Invalid status" });
        }
        await Job.findByIdAndUpdate(jobId, { status });
        return res.status(200).json({ message: `Job ${status} successfully` });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "An error occurred during review the job" });
    }
}

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: "approved" });
         res.status(200).json(jobs);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while fetching jobs" });
    }
}
