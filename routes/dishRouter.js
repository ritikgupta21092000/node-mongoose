const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authenticate = require("../authenticate");

const dishes = require("../models/dishes");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .get((req, res, next) => {
    dishes.find({})
    .populate("comments.author")
      .then((result) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    dishes.create(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT Operation is not supported on /dishes");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    dishes.remove({})
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  dishRouter.route("/:dishId")
    .get((req, res, next) => {
      dishes.findById(req.params.dishId)
      .populate("comments.author")
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .post(authenticate.verifyUser, (req, res, next) => {
      res.statusCode = 403
      res.end("POST Operation not supported on /dishes/" + req.params.dishId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
      dishes.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new: true})
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
      dishes.findByIdAndRemove(req.params.dishId)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    dishRouter.route('/:dishId/comments')
    .get((req,res,next) => {
        dishes.findById(req.params.dishId)
        .populate("comments.author")
        .then((dish) => {
            if (dish != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        dishes.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null) {
                req.body.author = req.user._id;
                dish.comments.push(req.body);
                dish.save()
                .then((dish) => {
                    dishes.findById(dish._id)
                    .populate("comments.author")
                    .then((dish) => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json(dish);  
                    })                                
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/'
            + req.params.dishId + '/comments');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        dishes.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null) {
                for (var i = (dish.comments.length -1); i >= 0; i--) {
                    console.log(dish.comments.id(dish.comments[i]._id));
                    dish.comments.id(dish.comments[i]._id).remove();
                }
                dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);                
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));    
    });
    
    dishRouter.route('/:dishId/comments/:commentId')
    .get((req,res,next) => {
        dishes.findById(req.params.dishId)
        .populate("comments.author")
        .then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments.id(req.params.commentId));
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);            
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/'+ req.params.dishId
            + '/comments/' + req.params.commentId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        dishes.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                if (req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.comment) {
                    dish.comments.id(req.params.commentId).comment = req.body.comment;                
                }
                dish.save()
                .then((dish) => {
                    dish.findById(dish._id)
                    .populate("comments.author")
                    .then((dish) => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json(dish);
                    })               
                }, (err) => next(err));
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);            
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        dishes.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then((dish) => {
                  dish.findById(dish._id)
                  .populate("comments.author")
                  .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                  })                
                }, (err) => next(err));
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);            
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    });

module.exports = dishRouter;
