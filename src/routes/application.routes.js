const express = require('express');
const { applyForJob, getApplications, updateApplicationStatus } = require("../controllers/application.controller");

const { authVerifyToken, isAdmin } = require("../middleware/auth.middleware");
const router = express.Router();
const upload = require('../middleware/upload.middleware');

router.post("/apply", authVerifyToken, upload.single("resume"), applyForJob);
router.get("/allapp", authVerifyToken, isAdmin, getApplications);
router.put("/update-status", authVerifyToken, isAdmin, updateApplicationStatus);

module.exports = router;
