const path = require("path");
const express = require("express");
var cors = require("cors");
require("../db/mongoose");
const userRouter = require("../routers/user");
var cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const port = process.env.PORT || 5000;
// const publicDirectoryPath = path.join(__dirname, "../public");

app.use(userRouter);
// app.use(express.static(publicDirectoryPath));

app.listen(port, () => {
  console.log(`Server Running on ${port}`);
});
