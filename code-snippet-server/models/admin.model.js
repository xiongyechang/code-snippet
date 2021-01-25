const mongoose = require("../db/db");
const Schema = mongoose.Schema;
const isImageUrl = require("is-image-url");
const { emailExp, phoneNumberExp } = require("../utils/utils");

let AdminSchema = Schema({
  username: {
    type: String,
    index: true, // 索引相关 索引
    unique: true, // 索引相关 唯一索引
    set: function(value) {
      return value;
    },
    get: function(value) {
      return value;
    }
  },
  password: String,
  avatar: {
    type: String,
    validate: value => isImageUrl(value)
  },
  email: {
    type: String,
    trim: true,
    match: emailExp
  },
  phone: {
    type: String,
    trim: true,
    match: phoneNumberExp
  },
  online: {
    type: Boolean,
    default: false
  },
  token: {
    type: String
  }
}, { timestamps:true });

let AdminModel = mongoose.model("admin", AdminSchema);

module.exports = AdminModel;
