const CodeSnippetModel = require("../models/code-snippet.model");
// const CodeCategoryModel = require("../models/code-category.model");
const Router = require("koa-router");
const Joi = require("@hapi/joi");
const { off } = require("../models/code-snippet.model");
// const path = require("path");
const { HttpResponseCode } = require("../constants/constants")

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

    let rows = await CodeSnippetModel
                     .find()
                     .populate('category')
                     .populate('prev', '_id title')
                     .populate('next', '_id title')
                     .populate('relations')
                     .skip(offset)
                     .limit(limit);
    let count = await CodeSnippetModel.countDocuments();

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
      code: HttpResponseCode.OK,
      message: '搜索列表成功',
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


// 列出资源列表  ok
router.get(route + "/by", async (ctx) => {
  let { page = 1, limit = 20, categoryId } = ctx.request.query;
  try {
    const schema = Joi.object({
      categoryId: Joi.string().required(),
      limit: Joi.number().integer().min(1).max(100),
      page: Joi.number().integer().min(1)
    });

    let { error } = await schema.validate({ page, limit, categoryId });

    if (error) {
      throw error;
    }
    
    limit = parseInt(limit, 10);
    page = parseInt(page, 10);
    const offset = (page - 1) * limit;

    const conditions = { 
      category: categoryId
    }

    const rows = await CodeSnippetModel.find(conditions).populate('category').skip(offset).limit(limit);

    const count = await CodeSnippetModel.countDocuments(conditions);

    ctx.body = {
      code: HttpResponseCode.OK,
      message: '搜索列表成功',
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
    )

    console.log(CodeSnippet)
    
    ctx.body = {
      code: HttpResponseCode.OK,
      message: "获取数据成功",
      data: CodeSnippet
    };

  } catch (error) {
    console.log(error);
    ctx.body = {
      code: HttpResponseCode.EXCEPTION,
      message: error.message,
      data: null
    };
  }
});

router.post(`${route}`, async ctx => {

  const { title, summary, content, category, prev, next, relations, disabled } = ctx.request.body;

  try {
     
    const schema = Joi.object({
      title: Joi.string().required(),
      summary: Joi.string().required(),
      content: Joi.string().required(),
      category: Joi.string().required(),
      prev: Joi.string(),
      next: Joi.string(),
      relations: Joi.array().items(Joi.string()).default([]),
      disabled: Joi.boolean().default(false)
    });

    let { error, value } = await schema.validate({ title, summary, content, category, prev, next, relations, disabled });

    console.log(value)

    if (error) {
      throw error;
    }

    const CodeSnippet = await CodeSnippetModel.create(value);

    ctx.body = {
      code: HttpResponseCode.OK,
      message: "添加数据成功",
      data: CodeSnippet
    };

    
  } catch (error) {
    console.error(error);
    ctx.body = {
      code: HttpResponseCode.EXCEPTION,
      message: error.message,
      data: null
    };
  }
})

router.put(`${route}`, async ctx => {

  const { _id, title, summary, content, category, prev, next, relations, disabled } = ctx.request.body;

  try {
     
    const schema = Joi.object({
      _id: Joi.string().required(),
      title: Joi.string().required(),
      summary: Joi.string().required(),
      content: Joi.string().required(),
      category: Joi.string().required(),
      prev: Joi.string(),
      next: Joi.string(),
      relations: Joi.array().items(Joi.string()).default([]),
      disabled: Joi.boolean().default(false)
    });

    let { error, value } = await schema.validate({ _id, title, summary, content, category, prev, next, relations, disabled });

    console.log({
      ...value,
      updatedAt: new Date()
    })

    if (error) {
      throw error;
    }

    const CodeSnippet = await CodeSnippetModel.findOneAndUpdate({ _id }, {
      ...value,
      updatedAt: new Date()
    });

    ctx.body = {
      code: HttpResponseCode.OK,
      message: "更新数据成功",
      data: CodeSnippet
    };

    
  } catch (error) {
    console.error(error);
    ctx.body = {
      code: HttpResponseCode.EXCEPTION,
      message: error.message,
      data: null
    };
  }
})

router.delete(route, async ctx => {
  let { _id } = ctx.request.query;
	try {
    const schema = Joi.string().required();

    const { error } = schema.validate(_id);

    if(error) throw error;

    // 批量删除
    const result = await CodeSnippetModel.deleteOne({ _id });

    ctx.body = {
      code: HttpResponseCode.OK,
      message: "删除代码片段成功",
      data: result
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

module.exports = router;
