const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const leaders = require("../models/leaders");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")
  .get((req, res, next) => {
    leaders.find({})
      .then((result) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .post((req, res, next) => {
    leaders.create(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT Operation is not supported on /leaders");
  })
  .delete((req, res, next) => {
    leaders.remove({})
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

module.exports = leaderRouter;
