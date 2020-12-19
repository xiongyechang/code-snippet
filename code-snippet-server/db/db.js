const {
  mongodb
} = require("../config/config");
const mongoose = require("mongoose");

const {
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  MONGODB_DATABASE_NAME,
  MONGODB_HOST,
  MONGODB_PORT
} = mongodb;

mongoose.connect(`mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE_NAME}?authSource=admin`, {
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('open', function () {
  console.log(`${MONGODB_HOST}:${MONGODB_PORT}打开成功`);
});

db.on('connected', function () {
  console.log(`${MONGODB_HOST}:${MONGODB_PORT}连接成功`);
});

db.on('disconnected', function () {
  console.log(`${MONGODB_HOST}:${MONGODB_PORT}断开成功`);
});

db.on('error', function () {
  console.error(`${MONGODB_HOST}连接失败`);
});

module.exports = mongoose;