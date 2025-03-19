const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes)
app.get('/', (req, res) => {
    res.send('Ai Resume Screen Backend is Running');
});

module.exports = app;