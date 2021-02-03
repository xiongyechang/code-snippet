const JWT = require("jsonwebtoken");
const { whiteList, jwtSecret } = require("../config/config");
// const redis = require('../db/redis');

// /**
//  * 判断token是否可用
//  */
module.exports = async (ctx, next) => {
  // 在白名单里面的 api 放行
  let invoke = whiteList.find(item => item.test(ctx.request.path));
  if (invoke) {
    await next();
  } else {
    try {
      // 获取jwt
      const token = ctx.header.authorization;
      if (token) {
        // 解密payload，获取用户名和ID
        let payload = await JWT.verify(token.split(" ")[1], jwtSecret);
        let params = {
          _id: payload.user_id,
          role: payload.role,
          roleCode: payload.roleCode,
          username: payload.username
        };
        
        if (ctx.request.hasOwnProperty("query")) {
          Object.assign(ctx.request.query, params);
        }
        
        if (ctx.request.hasOwnProperty("body")) {
          Object.assign(ctx.request.body, params);
        }

        ctx.state.payload = payload;
        await next();
      } else {
        throw new Error("token不存在");
      }
    } catch (err) {
      console.log(err.message);
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: "认证失败",
        data: null
      };
    }
  }
};
