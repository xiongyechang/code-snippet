"use scrict";
const fs = require("fs");

function writeFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  writeFile
};
