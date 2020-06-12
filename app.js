const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");

const authenticate = require("./authenticate");

const app = express();

const dishRouter = require("./routes/dishRouter");
const promoRouter = require("./routes/promoRouter");
const leaderRouter = require("./routes/leaderRouter");
const router = require("./routes/users");

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

app.use(passport.initialize());
app.use(passport.session());

app.use("/users", router);

function auth(req, res, next) {
  if (!req.user) {
    var err = new Error("You are not authenticated");
    err.status = 403;
    next(err);
  } else {
    next();
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
