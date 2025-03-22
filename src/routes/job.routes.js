const express = require('express');
const router = express.Router();

const { postJob, reviewJob,getJobs } = require("../controllers/job.controller");  // Add reviewJob import
const { authVerifyToken, isAdmin } = require("../middleware/auth.middleware");

router.post("/post-job", authVerifyToken, postJob);
router.put("/review", authVerifyToken, isAdmin, reviewJob);
router.get("/get-jobs",getJobs);

module.exports = router;