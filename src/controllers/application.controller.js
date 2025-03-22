const Application = require("../models/application.model");
//apply for a job
exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Resume is required" });
        }

        const application = new Application({
            jobId,
            userId: req.user.id,
            resumeUrl: req.file.path || req.file.url, // Fix applied
        });
        

        await application.save();
        res.status(200).json({ message: "Application submitted successfully" });

    } catch (err) {
        console.error("Error in applyForJob:", err);
        res.status(500).json({ message: "An error occurred while applying for the job" });
    }
};

//get all applications for a job
exports.getApplications=async(req,res)=>{
    try{
       
        const applications = await Application.find().populate("jobId userId", "title name email");
        res.status(200).json(applications);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"An error occurred while getting applications"});
    }
}
//update application status(admin only)
exports.updateApplicationStatus=async(req,res)=>{
    try{
        const{applicationId,status}=req.body;
        if (!["reviewed", "rejected"].includes(status)) {
            return res.status(400).json({message:"Invalid status"});
        }
        await Application.findByIdAndUpdate(applicationId,{status});
        res.status(200).json({message:`Application status updated successfully to ${status}`});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"An error occurred while updating application status"});
    }
}
