const Koa = require("koa");
const favicon = require("koa-favicon");
const path = require("path");
const config = require("./config/config");
const session = require("koa-session");
const koaBody = require("koa-body"); // 解析 post 数据 以及文件上传
const cors = require("koa2-cors");
var serve = require('koa-static-server');
// 自定义中间件
const { logger } = require("./middleware/logger");

const app = new Koa();

const { CodeSnippetRouter, CodeCategoryRouter, AdminRouter } = require("./routes");

app.keys = [config.sessionSecret];

const CONFIG = {
  key: "koa:sess", //cookie key (default is koa:sess)
  maxAge: 86400000, // cookie的过期时间 maxAge in ms (default is 1 days)
  overwrite: true, //是否可以overwrite    (默认default true)
  httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true), js不能访问cookie
  signed: true, //签名默认true
  rolling: false, //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false //(boolean) renew session when session is nearly expired,
};

app.use(session(CONFIG, app));
app.use(logger);

const env = process.env.NODE_ENV;
if (env === "development") {
  app.use(
    cors({
      origin: function(ctx) {
        return "*";
      },
      exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
      maxAge: 5,
      credentials: true,
      allowMethods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "Accept"]
    })
  );
}

app.use(
  koaBody({
    multipart: true, // 支持文件上传
    encoding: "utf-8",
    json: true,
    strict: false, // get, head, delete 请求不在 ctx.request.body中
    formidable: {
      uploadDir: path.join(process.cwd(), "upload"), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 20 * 1024 * 1024, // 文件上传大小
      multiples: true, // 支持多文件上传
      onFileBegin: (name, file) => {
        // 文件上传前的设置
        file.path = path.join(process.cwd(), "upload", path.basename(name));
      }
    },
    onError(error) {
      console.log(error);
    }
  })
);


app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.use(AdminRouter.routes()).use(AdminRouter.allowedMethods());
app.use(CodeSnippetRouter.routes()).use(CodeSnippetRouter.allowedMethods());
app.use(CodeCategoryRouter.routes()).use(CodeCategoryRouter.allowedMethods());

app.use(serve({rootDir: 'release', rootPath: '/update', index: 'latest.yml'})); // 软件自动更新地址
app.use(serve({rootDir: 'public', rootPath: '/', index: 'index.html'}));

app.on("error", function(error) {
  console.log(error);
});

module.exports = app;
