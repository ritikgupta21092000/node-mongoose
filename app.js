const express = require("express");
const mongoose = require("mongoose");

const app = express();

const promoRouter = require("./routes/promoRouter");
const leaderRouter = require("./routes/leaderRouter");

const promotions = require("./models/promotions");
const leader = require("./models/leaders");

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
