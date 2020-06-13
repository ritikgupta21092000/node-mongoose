const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");

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
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.create(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT Operation is not supported on /leaders");
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.remove({})
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  leaderRouter.route("/:leaderId")
    .get((req, res, next) => {
      leaders.findById(req.params.leaderId)
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      res.statusCode = 403
      res.end("POST Operation not supported on /leaders/" + req.params.leaderId);
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new: true})
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      leaders.findByIdAndRemove(req.params.leaderId)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });


module.exports = leaderRouter;
