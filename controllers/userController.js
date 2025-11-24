const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = async (req, res) => {
  const { name, email, password, phone_number, gender, date_of_birth, membership_status } = req.body;

  if (!name|| !email || !password || !phone_number || !gender|| !date_of_birth|| !membership_status){
    return res.status(400).json({message: "All fields are required"});
  }

  //enum validation
  const chooseGender = ["Male", "Female", "Other"];
  if (!chooseGender.includes(gender)){
    return res.status(400).json({message: "Invalid gender"});
  }

  const chooseMembership = ["Active", "Inactive", "Suspended"]
  if (!chooseMembership.includes(membership_status)){
    return res.status(400).json({message: "Invalid membership"});
  }


  try {
    const user = await User.signup(name, email, password, phone_number, gender, date_of_birth, membership_status );

    // create a token
    const token = generateToken(user._id);

    res.status(201).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    if (user) {
      // create a token
      const token = generateToken(user._id);

      const {
        name,
        email,
        password,
        phone_number,
        gender,
        date_of_birth,
        membership_status
      } = user;

      res.status(200).json({ name, email,  password, phone_number, gender, date_of_birth, membership_status, token });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe,
};
