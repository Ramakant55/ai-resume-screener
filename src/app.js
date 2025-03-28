const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const userRoutes = require('./routes/user.routes');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/api/users",userRoutes);
app.get('/', (req, res) => {
    res.send('Ai Resume Screen Backend is Running');
});

module.exports = app;