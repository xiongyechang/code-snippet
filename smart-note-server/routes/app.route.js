const Router = require("koa-router");
const fs = require("fs");
const Joi = require("@hapi/joi");
const path = require("path");
const fse = require("fs-extra");
const send = require("koa-send");

const PATH = path.join(process.cwd(), "release");

const route = "app";
const router = new Router({
  prefix: "/api/"
});

// 列出资源列表  ok
router.get(route, async ctx => {

  let { version } = ctx.request.query; // 当前版本

  try {

    const schema = Joi.string().pattern(new RegExp(/^(\d+\.{1}){2}\d/));

    let { error, value } = await schema.validate(version);
  
    if(error){
      throw error;
    }

    const list = fs.readdirSync(PATH);
    console.log(list.find(item => item.includes(version)));

    if(list.length >= 2 && !list.find(item => item.includes(version))){
      const name = list[list.length - 1];
      ctx.attachment(path.join("release", name));
      await send(ctx, path.join("release", name));
    }else{
      ctx.status = 404;
    }
  } catch (error) {
    console.log(error);
    ctx.status = 500;
  }
});

module.exports = router;