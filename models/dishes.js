const express = require("express");
const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;
const User = require("./user");

const commentSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
}, {
    timestamps: true
});

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const dishes = new mongoose.model("dish", dishSchema);

module.exports = dishes;