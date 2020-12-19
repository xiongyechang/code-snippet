const crypto = require("crypto");

// 生成公钥和私钥
exports.makeKeyPair = function(type = "rsa") {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      type,
      {
        modulusLength: 1024,
        publicKeyEncoding: {
          type: "spki",
          format: "pem"
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem"
        }
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            publicKey: publicKey
              .replace("-----BEGIN PUBLIC KEY-----", "")
              .replace("-----END PUBLIC KEY-----", "")
              .trim(),
            privateKey: privateKey
              .replace("-----BEGIN ENCRYPTED PRIVATE KEY-----", "")
              .replace("-----END ENCRYPTED PRIVATE KEY-----", "")
              .trim()
          });
        }
      }
    );
  });
};
