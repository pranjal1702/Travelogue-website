"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePost = exports.getPostById = exports.getAllPosts = exports.deletePost = exports.addPost = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _Post = _interopRequireDefault(require("../models/Post"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const getAllPosts = async (req, res) => {
  let posts;

  try {
    posts = await _Post.default.find().populate("user");
  } catch (err) {
    return console.log(err);
  }

  if (!posts) {
    return res.status(500).json({
      message: "Unexpected Error Occurred"
    });
  }

  return res.status(200).json({
    posts
  });
};

exports.getAllPosts = getAllPosts;

const addPost = async (req, res) => {
  const {
    title,
    description,
    location,
    date,
    image,
    user
  } = req.body;

  if (!title && title.trim() === "" && !description && description.trim() === "" && !location && location.trim() === "" && !date && !user && !image && image.trim() === "") {
    return res.status(422).json({
      message: "Invalid Data"
    });
  }

  let existingUser;

  try {
    existingUser = await _User.default.findById(user);
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  let post;

  try {
    post = new _Post.default({
      title,
      description,
      image,
      location,
      date: new Date(`${date}`),
      user
    });
    const session = await _mongoose.default.startSession();
    session.startTransaction();
    existingUser.posts.push(post);
    await existingUser.save({
      session
    });
    post = await post.save({
      session
    });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!post) {
    return res.status(500).json({
      message: "Unexpected Error Occurred"
    });
  }

  return res.status(201).json({
    post
  });
};

exports.addPost = addPost;

const getPostById = async (req, res) => {
  const id = req.params.id;
  let post;

  try {
    post = await _Post.default.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!post) {
    return res.status(404).json({
      message: "No post found"
    });
  }

  return res.status(200).json({
    post
  });
};

exports.getPostById = getPostById;

const updatePost = async (req, res) => {
  const id = req.params.id;
  const {
    title,
    description,
    location,
    image
  } = req.body;

  if (!title && title.trim() === "" && !description && description.trim() === "" && !location && location.trim() === "" && !image && image.trim() === "") {
    return res.status(422).json({
      message: "Invalid Data"
    });
  }

  let post;

  try {
    post = await _Post.default.findByIdAndUpdate(id, {
      title,
      description,
      image,
      location
    });
  } catch (err) {
    return console.log(err);
  }

  if (!post) {
    return res.status(500).json({
      message: "Unable to update"
    });
  }

  return res.status(200).json({
    message: "Updated Successfully"
  });
};

exports.updatePost = updatePost;

const deletePost = async (req, res) => {
  const id = req.params.id;
  let post;

  try {
    const session = await _mongoose.default.startSession();
    session.startTransaction();
    post = await _Post.default.findById(id).populate("user");
    post.user.posts.pull(post);
    await post.user.save({
      session
    });
    post = await _Post.default.findByIdAndRemove(id);
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!post) {
    return res.status(500).json({
      message: "Unable to delete"
    });
  }

  return res.status(200).json({
    message: "Deleted Successfully"
  });
};

exports.deletePost = deletePost;