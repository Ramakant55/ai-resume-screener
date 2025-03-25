const Application = require("../models/application.model");
const {extractSkillFromResume} = require("../utils/resumeParser");
//apply for a job
exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Resume is required" });
        }
      console.log(req.file);
      const skills = await extractSkillFromResume(req.file.path);
        const application = new Application({
            jobId,
            userId: req.user.id,
            resumeUrl: req.file.path || req.file.url, // Fix applied
            skills:skills
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

exports.filterApplicationsBySkills = async (req, res) => {
    try {
        const { jobId, requiredSkills } = req.body;   
        const applications = await Application.find({ jobId }).populate("userId", "name email");
        const filteredApplications = applications.filter(application => {
            const matchedSkills = application.skills.filter(skill => requiredSkills.includes(skill));
            return matchedSkills.length > 0;  
        });
        res.status(200).json(filteredApplications);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred while filtering applications" });
    }
  };


//update application status(admin only)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId, status } = req.body;
        console.log("Received request to update application:", { applicationId, status });
        
        // Validate status against the enum values in the model
        if (!["pending", "reviewed", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be one of: pending, reviewed, rejected" });
        }

        // First check if the application exists
        const existingApplication = await Application.findById(applicationId);
        if (!existingApplication) {
            console.log("Application not found:", applicationId);
            return res.status(404).json({ message: "Application not found" });
        }

        // Update the application
        existingApplication.status = status;
        const updatedApplication = await existingApplication.save();

        console.log("Application updated:", updatedApplication);

        res.status(200).json({
            message: `Application status successfully updated to ${status}`,
            application: updatedApplication
        });
    } catch (error) {
        console.error("Error updating application status:", error);
        return res.status(500).json({ message: "An error occurred while updating the application status", error: error.message });
    }
};
