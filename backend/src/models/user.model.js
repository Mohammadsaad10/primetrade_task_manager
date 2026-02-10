import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: "String",
    required: true,
    trim: true, // Remove whitespace
  },

  email: {
    type: "String",
    required: true,
    unique: true,
  },

  password: {
    type: "String",
    required: true,
    minlength: 6,
    select: false, // Do not return password field by default
  },

  role: {
    type: "String",
    enum: ["user", "admin"],
    default: "user",
  },

  createAt: {
    type: "Date",
    default: Date.now,
  },
});

//Hashing password before saving to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//match entered password to actual password.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
