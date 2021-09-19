require("dotenv").config();
const PORT = 3000;
const express = require("express");
const server = express();

const bodyParser = require("body-parser");
server.use(bodyParser.json());

const morgan = require("morgan");
server.use(morgan("dev"));

server.use((req, res, next) => {
  if (!req.headers.authorization) {
    return next();
  }
  //   const token = req.headers.authorization.substring(7);
  //   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  //   const recoveredData = jwt.verify(token, "server secret");

  //   recoveredData;
  //   console.log("user is logged in as: ", decodedToken);
  //   req.user = decodedToken;
  next();
});

const { client } = require("./db");

const apiRouter = require("./api");
server.use("/api", apiRouter);

server.get("/api", (req, res, next) => {
  console.log("a get request was made");
  res.send({ message: "success" });
});

server.use("/api", (req, res, next) => {
  console.log("a get request was made");
  next();
});
client.connect();

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
