const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const promotions = require("../models/promotions");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route("/")
  .get((req, res, next) => {
    promotions.find({})
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
    promotions.create(req.body)
      .then((result) => {
        console.log("Promotions Created: ", result);
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT Operation is not supported on /promotions");
  })
  .delete((req, res, next) => {
    promotions.remove({})
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      })
  });

module.exports = promoRouter;
