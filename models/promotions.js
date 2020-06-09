const express = require("express");
const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    price: {
      type: Currency,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featured: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const promotions = new mongoose.model("promotion", promotionSchema);

module.exports = promotions;
