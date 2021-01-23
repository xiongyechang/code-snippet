const Router = require("koa-router");
const Qiniu = require("../utils/qiniu")
const qiniu = require("qiniu")

const route = "admin";
const router = new Router({
  prefix: "/api/"
});

var mac = new qiniu.auth.digest.Mac(Qiniu.AccessKey, Qiniu.SecretKey);

router.get(route + '/getQiniuToken', async ctx => {
	const options = {
		scope: Qiniu.bucket,
		deadline: Date.now() / 1000 + 3600,
		// expires: 7200,
		returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
	}

	var putPolicy = new qiniu.rs.PutPolicy(options);
	var uploadToken = putPolicy.uploadToken(mac);
	ctx.body = {
		status: 0,
		msg: '成功',
		data: uploadToken
	}
})

router.get(route + '/getQiniuDomain', async (ctx, next) => {
	ctx.body = {
		status: 0,
		msg: '成功',
		data: Qiniu.domain
	}
});

module.exports = router;