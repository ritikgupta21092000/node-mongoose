const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express();

const dishRouter = require("./routes/dishRouter");
const promoRouter = require("./routes/promoRouter");
const leaderRouter = require("./routes/leaderRouter");

const dishes = require("./models/dishes");
const promotions = require("./models/promotions");
const leader = require("./models/leaders");

// app.use(cookieParser("1234-5678-9101112"));
app.use(session({
  name: "session-id",
  secret: "1234-5678-9101112",
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

function auth(req, res, next) {
  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      var err = new Error("You are not authenticated.Please Authenticate first");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      next(err);
    }
    var auth = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
    var username = auth[0];
    var password = auth[1];
    if (username === "admin" && password === "password") {
      req.session.user = "admin";
      next();
    } else {
      var err = new Error("You are not authenticated.Please Authenticate first");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      next(err);
    }
  } else {
    if (req.session.user === "admin") {
      next();
    } else {
      var err = new Error("You are not authenticated.Please Authenticate first");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      next(err);
    }
  }
  
}

app.use(auth);

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

const url = "mongodb://localhost:27017/conFusion";

const connect = mongoose.connect(url);

connect
  .then((db) => {
    console.log("Connected Successfully to the database");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("Successfully Connected to port 3000");
});
