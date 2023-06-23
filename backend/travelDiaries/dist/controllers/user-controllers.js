"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signup = exports.login = exports.getUserById = exports.getAllUsers = void 0;

var _bcryptjs = require("bcryptjs");

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getAllUsers = async (req, res) => {
  let users;

  try {
    users = await _User.default.find();
  } catch (err) {
    return console.log(err);
  }

  if (!users) {
    return res.status(500).json({
      message: "Unexpected Error Occured"
    });
  }

  return res.status(200).json({
    users
  });
};

exports.getAllUsers = getAllUsers;

const getUserById = async (req, res) => {
  const id = req.params.id;
  let user;

  try {
    user = await _User.default.findById(id).populate("posts");
  } catch (err) {
    return console.log(err);
  }

  if (!user) {
    return res.status(404).json({
      message: "No user found"
    });
  }

  return res.status(200).json({
    user
  });
};

exports.getUserById = getUserById;

const signup = async (req, res, next) => {
  const {
    name,
    email,
    password
  } = req.body;

  if (!name && name.trim() === "" && !email && email.trim() === "" && !password && password.length < 6) {
    return res.status(422).json({
      message: "Inavalid Data"
    });
  }

  const hashedPassword = (0, _bcryptjs.hashSync)(password);
  let user;

  try {
    user = new _User.default({
      email,
      name,
      password: hashedPassword
    });
    await user.save();
  } catch (err) {
    return console.log(err);
  }

  if (!user) {
    return res.status(500).json({
      message: "Unexpected Error Occured"
    });
  }

  return res.status(201).json({
    user
  });
};

exports.signup = signup;

const login = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if (!email && email.trim() === "" && !password && password.length < 6) {
    return res.status(422).json({
      message: "Inavalid Data"
    });
  }

  let existingUser;

  try {
    existingUser = await _User.default.findOne({
      email
    });
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res.status(404).json({
      message: "No user found"
    });
  }

  const isPasswordCorrect = (0, _bcryptjs.compareSync)(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "Incorrect Password"
    });
  }

  return res.status(200).json({
    id: existingUser._id,
    message: "Login Successfull"
  });
};

exports.login = login;