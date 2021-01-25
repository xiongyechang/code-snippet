// cross-env NODE_ENV=production&&nodemon index.js
// 以上命令 NODE_ENV=production 后面不能带空格,否则 process.env.NODE_ENV = 'production '会有空格的

// cross-env 命令不能加 && 符号,否则会区分两个环境,前一个NODE_ENV=production,后一个没有设置,正确的设置为
// cross-env NODE_ENV=production nodemon index.js
console.log(process.env.NODE_ENV);
let whiteList = [
  /^\/api\/admin\/login/,
  /^\/api\/admin\/getVerifyCode/,
  /^\/api\/admin\/forgetPassword/,
  /^\/api\/admin\/getPublicKey/
];
if (process.env.NODE_ENV === "production") {
  require("env2")("./.env.prod");
} else {
  require("env2")("./.env"); // 将.env 文件的配置读取到 process.env对象中
}

const { env } = process;

const config = {
  host: env.HOST,
  port: env.PORT,
  jwtSecret: env.JWT_SECRET,
  sessionSecret: env.sessionSecret,
  mongodb: {
    MONGODB_USERNAME: env.MONGODB_USERNAME,
    MONGODB_PASSWORD: env.MONGODB_PASSWORD,
    MONGODB_DATABASE_NAME: env.MONGODB_DATABASE_NAME,
    MONGODB_HOST: env.MONGODB_HOST,
    MONGODB_PORT: env.MONGODB_PORT
  },
  whiteList,
  qiniu: {
    AccessKey: "xzdJ7o5egzf0GhnqORXdDsR9T_sEW9xvPG_T7R56",
    SecretKey: "TTd_n_zUSLZ96xJviQPz5V7G6i0WJqMZKiH-wzYe",
    bucket: "xiongyechang",
    domain: "https://cdn.xiongyechang.com"
  },
  tencentAI: {
    App_ID: "2119379752",
    App_Key: "zpFCkOMNvk5jw0bt",
    faceCompareUrl: "https://api.ai.qq.com/fcgi-bin/face/face_facecompare"
  },
  email: {
    account: "2226791767@qq.com",
    password: "gomcpabztfkmeaeb",
    name: "熊业昌"
  },
  tinypngKey: "BxljjJbctK3xrLL28CSfbyvwrtYhmGw3"
};

module.exports = config;
