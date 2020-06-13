const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
      type: String,
      default: ''
    },
    lastname: {
        type: String,
        default: ''
      },
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("user", userSchema);



module.exports = User