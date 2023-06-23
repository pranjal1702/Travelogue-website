"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _userControllers = require("../controllers/user-controllers");

const userRouter = (0, _express.Router)();
userRouter.get("/", _userControllers.getAllUsers);
userRouter.get("/:id", _userControllers.getUserById);
userRouter.post("/signup", _userControllers.signup);
userRouter.post("/login", _userControllers.login);
var _default = userRouter;
exports.default = _default;