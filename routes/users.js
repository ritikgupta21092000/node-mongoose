const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const User = require("../models/user");
const authenticate = require("../authenticate");

const router = express.Router();

router.use(bodyParser.json());

router.post("/signup", (req, res) => {
    User.register(({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({err: err});
        } else {
            if (req.body.firstname) {
                user.firstname = req.body.firstname;
            } 
            if (req.body.lastname) {
                user.lastname = req.body.lastname;
            }
            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.json({err: err});
                    return;
                }
                passport.authenticate("local")(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({success: true, status: "Registered Successfully"});
                })
                
            })
        }
    });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({success: true, token: token, status: "Successfully LoggedIn"});
});

router.get("/", authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({})
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.json({err: err});
        });
});

module.exports = router;