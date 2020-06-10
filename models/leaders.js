const express = require('express');
const mongoose = require('mongoose');
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const leaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  abbr: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  featured: {
    type: String,
    default: false
  }
});

const leaders = mongoose.model("leader", leaderSchema);

module.exports = leaders;
