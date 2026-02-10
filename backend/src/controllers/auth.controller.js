import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const missingFields = [];
    if (!username) missingFields.push("username");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields.join(", "));
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a diffrent one" });
    }

    //Create user.
    const user = await User.create({ username, email, password, role: "user" });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    logger.error(`Register Error: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide email and password" });
    }

    //Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    //check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    logger.error(`Login Error: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}

export const getMe = async (req, res) => {
  // req.user is already available because of the 'protect' middleware

  res.status(200).json({
    success: true,
    user: req.user,
  });
};

//helper function
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res
    .status(statusCode)
    .cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
};
