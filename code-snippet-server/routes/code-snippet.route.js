const CodeSnippetModel = require("../models/code-snippet.model");
// const CodeCategoryModel = require("../models/note-category.model");
const Router = require("koa-router");
const Joi = require("@hapi/joi");
// const path = require("path");

const route = "code-snippet";
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

    let rows = await CodeSnippetModel.find().populate('category').skip(offset).limit(limit);
    let count = await CodeSnippetModel.countDocuments();

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

// 列出资源列表  ok
router.get(route + "/search", async (ctx) => {
  let { limit = 20, keyword } = ctx.request.query;
  try {
    const schema = Joi.object({
      keyword: Joi.string().required(),
      limit: Joi.number().integer().min(1).max(100)
    });

    let { error } = await schema.validate({ limit, keyword });

    if (error) {
      throw error;
    }
    
    limit = parseInt(limit, 10);
    const reg = new RegExp(keyword, 'i');

    const conditions = { 
      $or: [{
        title: {
          $regex: reg
        }
      }, {
        content: {
          $regex: reg
        }
      }] 
    }

    let rows = await CodeSnippetModel.find(conditions).populate('category').limit(limit);

    let count = await CodeSnippetModel.countDocuments(conditions);

    ctx.body = {
      status: 200,
      message: '搜索列表成功',
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


// 列出资源列表  ok
router.get(route + "/by", async (ctx) => {
  let { limit = 20, categoryId } = ctx.request.query;
  try {
    const schema = Joi.object({
      categoryId: Joi.string().required(),
      limit: Joi.number().integer().min(1).max(100)
    });

    let { error } = await schema.validate({ limit, categoryId });

    if (error) {
      throw error;
    }
    
    limit = parseInt(limit, 10);

    const conditions = { 
      category: categoryId
    }

    let rows = await CodeSnippetModel.find(conditions).populate('category').limit(limit);

    let count = await CodeSnippetModel.countDocuments(conditions);

    ctx.body = {
      status: 200,
      message: '搜索列表成功',
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


// 获取一篇文章 ok
router.get(`${route}/:_id`, async ctx => {
  
  const { _id } = ctx.params;
  
  try {

    const schema = Joi.string().required();

    let { error } = await schema.validate(_id);

    if(error) throw error;
    
    let CodeSnippet = await CodeSnippetModel.findOneAndUpdate(
      { _id },
      { $inc: { look: 1 } } // look字段 + 1
    ).populate("category");

    console.log(CodeSnippet)
    
    ctx.body = {
      status: 200,
      msg: "获取数据成功",
      data: CodeSnippet
    };

  } catch (error) {
    console.log(error);
    ctx.body = {
      status: 500,
      msg: "服务端异常",
      data: error
    };
  }
});

router.post(`${route}`, async ctx => {
  try {
     
    const schema = Joi.object({
      title: Joi.string().required(),
      summary: Joi.string().required(),
      content: Joi.string().required(),
      category: Joi.string().required()
    });

    let { error, value } = await schema.validate(ctx.request.body);

    if (error) {
      throw error;
    }

    const CodeSnippet = await CodeSnippetModel.create(value);

    ctx.body = {
      status: 200,
      msg: "添加数据成功",
      data: CodeSnippet
    };

    
  } catch (error) {
    console.error(error);
    ctx.body = {
      status: 500,
      msg: "服务端异常",
      data: error
    };
  }
})

module.exports = router;
