const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");

const authenticate = require("./authenticate");
const config = require("./config");

const app = express();

const router = require("./routes/users");

const dishRouter = require("./routes/dishRouter");
const promoRouter = require("./routes/promoRouter");
const leaderRouter = require("./routes/leaderRouter");
const uploadRouter = require("./routes/uploadRouter");
const favoriteRouter = require("./routes/favoriteRouter");

const User = require("./models/user");
const dishes = require("./models/dishes");
const promotions = require("./models/promotions");
const leader = require("./models/leaders");
const Favorites = require("./models/favorite");


// app.use(cookieParser("1234-5678-9101112"));


app.use(passport.initialize());

app.use("/users", router);



app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favorites", favoriteRouter);

const url = config.mongoUrl;

const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
