const express = require('express');
const { applyForJob, getApplications, updateApplicationStatus, filterApplicationsBySkills, getMyApplications } = require("../controllers/application.controller");

const { authVerifyToken, isAdmin } = require("../middleware/auth.middleware");
const router = express.Router();
const upload = require('../middleware/upload.middleware');

router.post("/apply", authVerifyToken, upload.single("resume"), applyForJob);
router.get("/allapp", authVerifyToken, isAdmin, getApplications);
router.get("/my-applications", authVerifyToken, getMyApplications);
router.put("/update-status", authVerifyToken, isAdmin, updateApplicationStatus);
router.post("/filter-by-skills",authVerifyToken,isAdmin,filterApplicationsBySkills);

module.exports = router;
