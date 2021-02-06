const CodeSnippetModel = require("../models/code-snippet.model");
const CodeCategoryModel = require("../models/code-category.model");
const Router = require("koa-router");
const Joi = require("@hapi/joi");
const path = require("path");
const { HttpResponseCode } = require("../constants/constants");

const route = "code-category";
const router = new Router({
  prefix: "/api/",
});

// 列出资源列表  ok
router.get(route, async (ctx) => {
    let { limit = 1000, page = 1 } = ctx.request.query;
    try {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(1000)
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
        code: HttpResponseCode.OK,
        message: '获取列表成功',
        data: { rows, count }
      }
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: HttpResponseCode.EXCEPTION,
        message: error.message,
        data: null
      };
    }
});

router.post(route, async ctx => {
  const { title } = ctx.request.body;
  try {
    const schema =  Joi.string().min(1).max(100).required();

    const { error } = await schema.validate(title);

    if(error) throw error;

    const category = await CodeCategoryModel.create({ title });

    ctx.body = {
      code: HttpResponseCode.OK,
      message: "添加分类成功",
      data: category
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      code: HttpResponseCode.EXCEPTION,
      message: error.message,
      data: null
    };
  }
});

router.put(route, async ctx => {
  const { title, _id, avatar } = ctx.request.body;
  try {
    const schema = Joi.object({
      _id: Joi.string().required(),
      title: Joi.string(),
      avatar: Joi.string()
    })

    const { error } = await schema.validate({ _id });

    if(error) throw error;

    const category = await CodeCategoryModel.findByIdAndUpdate(_id, {
      title,
      avatar
    });

    ctx.body = {
      code: HttpResponseCode.OK,
      message: "更新分类成功",
      data: category
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      code: HttpResponseCode.EXCEPTION,
      message: error.message,
      data: null
    };
  }
});

router.delete(route, async ctx => {
  let { _id } = ctx.request.query;
	try {
    const schema = Joi.string().required();

    const { error } = schema.validate(_id);

    if(error) throw error;

    // 批量删除
    const result = await CodeCategoryModel.deleteOne({
      _id
    });

    ctx.body = {
      code: HttpResponseCode.OK,
      message: "删除分类成功",
      data: result
    };
  } catch (error) {
	  console.error(error);
    ctx.body = {
      code: HttpResponseCode.EXCEPTION,
      message:error.message,
      data: null
    };
  }
});
  
module.exports = router;
