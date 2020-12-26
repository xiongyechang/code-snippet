const path = require("path");
const fs = require("fs");
const qiniu = require("qiniu");
const Qiniu = require("./qiniu");
const tinify = require("tinify");
const { tinypngKey } = require("../config/config");

tinify.key = tinypngKey;

const uploadDir = path.join(process.cwd(), "upload");
const compressDir = path.join(process.cwd(), "upload", "compress");

exports.writeFile = function(file) {
  return new Promise((resolve, reject) => {
    let reader = fs.createReadStream(file.path);

    let writer = fs.createWriteStream(path.join(uploadDir, file.name));

    writer.on("finish", () => {
      resolve();
    });

    writer.on("error", error => {
      reject(error);
    });
    reader.pipe(writer);
  });
};

exports.compressFile = async function(fileName) {
  try {
    let source = await tinify.fromFile(path.join(uploadDir, fileName));
    await source.toFile(path.join(compressDir, fileName));
  } catch (error) {
    throw error;
  }
};

// 上传到七牛云;
exports.uploadToQiniu = function(compressFileFullPath) {
  return new Promise((resolve, reject) => {
    let localFile = compressFileFullPath;
    let fileName = path.basename(compressFileFullPath);

    const options = {
      scope: Qiniu.bucket,
      deadline: Date.now() / 1000 + 3600,
      expires: 7200,
      returnBody:
        '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    };
    var mac = new qiniu.auth.digest.Mac(Qiniu.AccessKey, Qiniu.SecretKey);
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);

    var resumeUploader = new qiniu.resume_up.ResumeUploader(options);
    var putExtra = new qiniu.resume_up.PutExtra();

    putExtra.params = {
      "x:name": fileName
    };

    putExtra.resumeRecordFile = path.join(uploadDir, "progress.log");
    var key = fileName;
    resumeUploader.putFile(uploadToken, key, localFile, putExtra, function(
      respErr,
      respBody,
      respInfo
    ) {
      if (respErr) {
        reject(respErr);
      } else {
        if (respInfo.statusCode === 200) {
          resolve(respBody);
        } else {
          reject(respBody);
        }
      }
    });
  });
};
