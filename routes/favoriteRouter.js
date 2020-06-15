const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");

var status = false;

const Favorites = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route("/")
.get(authenticate.verifyUser, (req, res, next) => {
    Favorites.find({"user": req.user._id})
    .populate("user")
    .populate("dish")
    .then((favorites) => {
        if (favorites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorites);
        } else {
            var err = new Error("Your favorites list does'nt exist!");
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        res.json(err);
    })
})

.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.find({"user": req.user._id})
    .then((favorite_dish) => {
        if (favorite_dish.length === 0) {
            const user_favorite_dish = new Favorites({
                user: req.user._id,
                dish: req.body
            });
            user_favorite_dish.save((err, result) => {
                if (err) {
                    res.json({err: err});
                } else {
                    res.json(result);
                }
            })
        } else {
            favorite_dish[0].dish.push(req.body._id);
            favorite_dish[0].save()
            .then((dish) => {
                Favorites.find({"user": req.user._id})
                .populate("user")
                .populate("dish")
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);  
                })                                
            }, (err) => next(err));
            
        }
    }, (err) => next(err))
    .catch((err) => {
        res.json({err: err});
    })
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({"user": req.user._id})
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.json({err: err});
    })
});

favoriteRouter.route("/:dishId")
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.find({"user": req.user._id})
    .then((foundDish) => {
        if (foundDish.length != 0) {
            for (let i = 0; i < foundDish[0].dish.length; i++) {  
                if (foundDish[0].dish[i]._id.toString() === req.params.dishId) {
                    var err = new Error("Dish Already Exist");
                    err.status = 403;
                    status = true;
                    return next(err);
                }
            }
        }
        if (foundDish.length === 0) {
            const user_foundDish = new Favorites({
                user: req.user._id,
                dish: req.params.dishId
            });
            user_foundDish.save((err, result) => {
                if (err) {
                    res.json({err: err});
                } else {
                    res.json(result);
                }
            })
        } else {
            if (!status) {
                foundDish[0].dish.push(req.params.dishId);
                foundDish[0].save()
                .then((dish) => {
                    Favorites.find({"user": req.user._id})
                    .populate("user")
                    .populate("dish")
                    .then((foundDishes) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(foundDishes);
                    }, (err) => next(err))
                }, (err) => next(err))
            }
        }     
    })
    .catch((err) => {
        res.json({err: err});
    });
})

.delete(authenticate.verifyUser, (req, res, next) => {
    var deleteStatus = false;
    Favorites.find({"user": req.user._id})
    .then((found_user_dishes) => {
        if (found_user_dishes.length === 0) {
            var err = new Error("Dish Doesn't Exist!");
            err.status = 403;
            return next(err);
        } else {
            for (let i = 0; i < found_user_dishes[0].dish.length; i++) {
                if (found_user_dishes[0].dish[i]._id.toString() === req.params.dishId) {
                    found_user_dishes[0].dish.remove(req.params.dishId);
                    found_user_dishes[0].save()
                    .then((found_dishes) => {
                        deleteStatus = true;
                        res.json(found_dishes)
                    }, (err) => next(err))
                    
                } 
            }
            if (!deleteStatus) {
                var err = new Error("Dish does'nt exist in your list");
                err.status = 403;
                return next(err);
            }
        }
    })
    .catch((err) => {
        res.json({err: err});
    })
});

module.exports = favoriteRouter;