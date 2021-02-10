const JWT = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

module.exports = {
  async auth(ctx, next) {
    try {
      const token = ctx.header.authorization;

      if (token) {
        let payload = await JWT.verify(token.split(" ")[1], jwtSecret);
        let params = {
          user_id: payload.user_id,
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

        return await next(ctx);
      } else {
        throw new Error("token不存在");
      }
    } catch (error) {
      console.error(error);
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: "认证失败",
        data: null
      };
    }
  }
}