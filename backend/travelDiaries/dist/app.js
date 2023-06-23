"use strict";

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _userRoutes = _interopRequireDefault(require("./routing/user-routes"));

var _postRoutes = _interopRequireDefault(require("./routing/post-routes"));

var _cors = _interopRequireDefault(require("cors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();

_dotenv.default.config(); // middlewares


app.use((0, _cors.default)());
app.use(_express.default.json());
app.use("/user", _userRoutes.default);
app.use("/posts", _postRoutes.default); // connections

_mongoose.default.connect(`mongodb+srv://pranjalsingh1702:${process.env.MONGODB_PASSWORD}@cluster0.f7wgkcc.mongodb.net/?retryWrites=true&w=majority`).then(() => app.listen(5000, () => console.log("Connection Succesfull  & Listening to localhost Port 5000"))).catch(err => console.log(err));