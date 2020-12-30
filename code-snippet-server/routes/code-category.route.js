const CodeSnippetModel = require("../models/code-snippet.model");
const CodeCategoryModel = require("../models/note-category.model");
const Router = require("koa-router");
const Joi = require("@hapi/joi");
const path = require("path");

const route = "note-category";
const router = new Router({
  prefix: "/api/",
});

// 列出资源列表  ok
router.get(route + "/list", async (ctx) => {
    let { limit = 20, page = 1 } = ctx.request.query;
    try {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100)
      });
  
      let { error } = await schema.validate({ limit, page });
  
      if (error) {
        throw error;
      }
      
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      const offset = (page - 1) * limit;
  
      let rows = await CodeCategoryModel.find().skip(offset).limit(limit);
      let count = await CodeCategoryModel.countDocuments();
  
      ctx.body = {
        status: 200,
        message: '获取列表成功',
        data: { rows, count }
      }
    } catch (error) {
      console.error(error);
      ctx.body = {
        status: 500,
        data: null,
        msg: error.message,
      };
    }
});
  
module.exports = router;
