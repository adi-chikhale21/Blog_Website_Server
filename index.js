const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config("./.env");
const connectToMongoDB = require("./mongodb");
const authRouter = require("./Routes/authRouter");
const postRouter = require("./Routes/postRouter");
const userRouter = require("./Routes/userRouter");
const commentRouter = require("./Routes/commentRouter");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectToMongoDB();

const Port = process.env.PORT || 8001;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(cookieParser());

let origin = "http://localhost:5173";
if (process.env.NODE_ENV === "production") {
  origin = process.env.CORS_ORIGIN;
}

app.use(
  cors({
    credentials: true,
    origin,
  })
);

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);

app.listen(Port, (req, res) => {
  console.log(`App is listening at port ${Port}`);
});

app.get("/", (req, res) => {
  res.send("Home page");
});
