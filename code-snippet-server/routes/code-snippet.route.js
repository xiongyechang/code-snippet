const CodeSnippetModel = require("../models/code-snippet.model");
const Router = require("koa-router");
const Joi = require("@hapi/joi");
const { HttpResponseCode } = require("../constants/constants")
const { auth } = require("../middleware/auth");

const route = "code-snippet";
const router = new Router({
  prefix: "/api/",
});

router.all("*", async (ctx, next) => {
  const request = ctx.request;
  const { method } = request;
  if (['post', 'put', 'delete'].includes(method.toLowerCase())) {
    await auth(ctx, next);
  } else {
    await next(ctx);
  }
});

// 列出资源列表  ok
router.get(route, async (ctx) => {
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
                     .find(null, {
                       title: 1,
                       _id: 1,
                       createdAt: 1,
                       updatedAt: 1,
                       disabled: 1,
                       liked: 1,
                       collected: 1,
                       viewed: 1
                     })
                     .populate('category')
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
  let { limit = 20, page = 1, keyword, category } = ctx.request.query;
  try {
    const schema = Joi.object({
      limit: Joi.number().integer().min(1).max(100),
      page: Joi.number().integer().min(1)
    })

    let { error } = await schema.validate({ limit, page });

    if (error) {
      throw error;
    }
    
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    const conditions = new Object;

    if (category) {
      Object.assign(conditions, {
        category
      })
    }

    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      Object.assign(conditions, {
        $or: [{
          title: {
            $regex: reg
          }
        }, {
          content: {
            $regex: reg
          }
        }] 
      }) 
    }

    let rows = await CodeSnippetModel.find(conditions).populate('category').skip(offset).limit(limit);

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

  const { title, content, category, relations, disabled } = ctx.request.body;

  try {
     
    const schema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      category: Joi.string().required(),
      relations: Joi.array().items(Joi.string()).default([]),
      disabled: Joi.boolean().default(false)
    });

    let { error, value } = await schema.validate({ title, content, category, relations, disabled });

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

  const { _id, title, content, category, prev, next, relations, disabled } = ctx.request.body;

  try {
     
    const schema = Joi.object({
      _id: Joi.string().required(),
      title: Joi.string().required(),
      content: Joi.string().required(),
      category: Joi.string().required(),
      relations: Joi.array().items(Joi.string()).default([]),
      disabled: Joi.boolean().default(false)
    });

    let { error, value } = await schema.validate({ _id, title, content, category, relations, disabled });

    if (error) {
      throw error;
    }

    const CodeSnippet = await CodeSnippetModel.findByIdAndUpdate(_id, {
      ...value,
      updatedAt: new Date()
    });

    console.log(CodeSnippet);

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
