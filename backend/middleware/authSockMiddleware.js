const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protectSock = async (token) => {
  let user = {};
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id).select("-password");
    } catch (error) {
    }
    return user._id ? true : false;
};

module.exports = { protectSock };