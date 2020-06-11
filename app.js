const express = require("express");
const mongoose = require("mongoose");

const app = express();

const promoRouter = require("./routes/promoRouter");
const leaderRouter = require("./routes/leaderRouter");

const promotions = require("./models/promotions");
const leader = require("./models/leaders");

function auth(req, res, next) {
  var authHeader = req.headers.authorization;
  if (!authHeader) {
    var err = new Error("You are not authenticated");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    next(err);
  }
  var auth = new Buffer(authHeader.split(" ")[1], "base64").toString().split(":");
  var username = auth[0];
  var password = auth[1];
  if (username === "admin" && password === "password") {
    next();
  } else {
    var err = new Error("You are not authenticated");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    next(err);
  }
}

app.use(auth);

app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

const url = "mongodb://localhost:27017/conFusion";

const connect = mongoose.connect(url);

connect
  .then((db) => {
    console.log("Connected Successfully to the database: ", db);
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("Successfully Connected to port 3000");
});
