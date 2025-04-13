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
        const { requiredSkills } = req.body;
        if (!requiredSkills || !Array.isArray(requiredSkills)) {
            return res.status(400).json({ message: "Required skills must be provided as an array" });
        }

        // Get all applications and populate necessary fields
        const applications = await Application.find().populate("userId jobId", "name email title company");
        
        // Filter applications based on skills
        const filteredApplications = applications.filter(application => {
            if (!application.skills || !Array.isArray(application.skills)) return false;
            const matchedSkills = application.skills.filter(skill => 
                requiredSkills.some(reqSkill => 
                    skill.toLowerCase().includes(reqSkill.toLowerCase())
                )
            );
            return matchedSkills.length > 0;
        });

        console.log(`Found ${filteredApplications.length} applications matching the skills criteria`);
        res.status(200).json(filteredApplications);
    } catch (error) {
        console.error("Error in filterApplicationsBySkills:", error);
        return res.status(500).json({ message: "An error occurred while filtering applications" });
    }
};


//get applications for the logged-in user
exports.getMyApplications = async (req, res) => {
    try {
        // Ensure the user object exists in the request
        if (!req.user || !req.user.id) {
            console.error("User ID not found in request:", req.user);
            return res.status(401).json({ message: "User authentication failed or user ID missing" });
        }
        
        const userId = req.user.id;
        console.log("Fetching applications for user:", userId);
        
        // Improved query to handle different formats of userId (string or ObjectId)
        const applications = await Application.find({ 
            $or: [
                { userId: userId }, 
                { 'userId._id': userId }
            ] 
        }).populate("jobId", "title company location");
        
        console.log(`Found ${applications.length} applications for user ${userId}`);
        
        res.status(200).json(applications);
    } catch (err) {
        console.error("Error in getMyApplications:", err);
        res.status(500).json({ message: "An error occurred while getting your applications" });
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
