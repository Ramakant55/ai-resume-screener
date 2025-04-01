const express = require('express');
const router = express.Router();

const { postJob, reviewJob, getJobs, getPendingJobs, getUserJobs } = require("../controllers/job.controller");
const { authVerifyToken, isAdmin } = require("../middleware/auth.middleware");

router.post("/post-job", authVerifyToken, postJob);
router.put("/review", authVerifyToken, isAdmin, reviewJob);
router.get("/get-jobs", getJobs);
router.get("/pending-jobs", authVerifyToken, isAdmin, getPendingJobs);
router.get("/user-jobs", authVerifyToken, getUserJobs);

module.exports = router;