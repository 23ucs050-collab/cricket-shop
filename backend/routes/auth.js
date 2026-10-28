const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==================== LOGIN (STEP 1: password check + OTP anuppu) ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Resend cooldown (20 sec)
    const existing = await Otp.findOne({ userId: user._id });

    if (existing && Date.now() - existing.lastSentAt.getTime() < 20 * 1000) {
      return res.status(429).json({
        message: "Konjam wait pannitu thirumba try pannunga (20 sec)",
      });
    }

    // 6-digit OTP generate
    const otp = String(crypto.randomInt(100000, 1000000));
    const otpHash = await bcrypt.hash(otp, 10);

    await Otp.findOneAndUpdate(
      { userId: user._id },
      {
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min valid
        attempts: 0,
        lastSentAt: new Date(),
      },
      { upsert: true }
    );

    // Email-ku OTP anuppu
    try {
      await sendEmail({
        to: user.email,
        subject: "Cricket Shop login OTP",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:420px">
            <h2>🏏 Cricket Shop</h2>
            <p>Unga login OTP:</p>
            <p style="font-size:32px;font-weight:bold;letter-spacing:6px">${otp}</p>
            <p>Idhu 5 minutes-ku mattum valid. Idhai yaarukkum share pannaadheenga.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error(mailError);
      return res.status(500).json({
        message: "Unable to send OTP. Please try again later.",
      });
    }

    // Inga token kudukka koodadhu, OTP verify aana apparam thaan
    res.status(200).json({
      message: "OTP sent to your email",
      otpRequired: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==================== LOGIN (STEP 2: OTP verify) ====================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const record = await Otp.findOne({ userId: user._id });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP expired. Thirumba login pannunga",
      });
    }

    // 5 thappaana try-ku apparam OTP delete
    if (record.attempts >= 5) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(429).json({
        message: "Romba thappaana try. Thirumba login pannunga",
      });
    }

    const isOtpCorrect = await bcrypt.compare(String(otp), record.otpHash);

    if (!isOtpCorrect) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "Wrong OTP" });
    }

    // OTP oru thadavai mattum use aagum
    await Otp.deleteOne({ _id: record._id });

    // Create login token (7 naal valid)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==================== GET PROFILE ====================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==================== UPDATE PROFILE ====================
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, address, city, pincode } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name: name.trim(), phone, address, city, pincode },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated", user });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;