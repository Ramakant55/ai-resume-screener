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
        if (!status || !["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const updatedJob = await Job.findByIdAndUpdate(jobId, { status }, { new: true });
        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found" });
        }
        return res.status(200).json({ message: `Job ${status} successfully`, job: updatedJob });
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

exports.getPendingJobs = async (req, res) => {
    try {
        const pendingJobs = await Job.find({ status: "pending" }).populate('createdBy', 'name email');
        res.status(200).json(pendingJobs);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while fetching pending jobs" });
    }
}

exports.getUserJobs = async (req, res) => {
    try {
        const userJobs = await Job.find({ createdBy: req.user.id });
        res.status(200).json(userJobs);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while fetching user jobs" });
    }
}
