const express = require("express");
const mongoose = require("mongoose");

const User = require("./user");
const dishes = require("./dishes");

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    dish: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: dishes 
        }
    ]
}, {
    timestamps: true
});

const Favorites = new mongoose.model("favorite", favoriteSchema);

module.exports = Favorites;