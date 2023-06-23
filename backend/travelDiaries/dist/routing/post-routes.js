"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _postController = require("../controllers/post-controller");

const postRouter = (0, _express.Router)();
postRouter.get("/", _postController.getAllPosts);
postRouter.get("/:id", _postController.getPostById);
postRouter.post("/", _postController.addPost);
postRouter.put("/:id", _postController.updatePost);
postRouter.delete("/:id", _postController.deletePost);
var _default = postRouter;
exports.default = _default;