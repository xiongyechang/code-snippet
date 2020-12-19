const mongoose = require("../db/db");
const {
  random,
  emailExp,
  phoneNumberExp,
} = require("../utils/utils");

let UserSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    select: true,
    index: true,
    unique: true,
    validate: function() {
      return this.id >= 0;
    }
  },
  username: {
    type: String,
    required: true,
    index: true,
    unique: true
  }, // 评论的文章
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  email: {
    type: String,
    match: emailExp
  },
  phone: {
    type: String,
    macth: phoneNumberExp
  },
  online: {
    type: Boolean,
    default: false
  },
  token: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

let UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
