const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/nodemailer");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate OTP Token (store email inside JWT)
    const otpToken = jwt.sign({ email, otp }, process.env.JWT_SECRET_KEY, { expiresIn: "10m" });

    // Save user without verification
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await user.save();

    await sendEmail(email, "Verify your email", `Your OTP is: ${otp}`);

    res.status(201).json({ message: "User created successfully. OTP sent to email.", otpToken });
  } catch (err) {
    res.status(500).json({ message: "Error occurred during signup" });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, otpToken } = req.body;

    // Verify OTP Token
    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired OTP token" });
    }

    if (decoded.email !== email || decoded.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update user as verified
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    await sendEmail(email, "Congratulations", "Your OTP has been verified successfully! You can now login.");

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error occurred during OTP verification" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your OTP first" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error occurred during login" });
  }
};
      
    