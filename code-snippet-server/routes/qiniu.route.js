const path = require("path")
const Router = require("koa-router")
const Qiniu = require("../utils/qiniu")
const qiniu = require("qiniu")

const route = 'qiniu'
const router = new Router({
	prefix: '/api/'
})

router.get(route + '/token', async (ctx, next) => {
	const options = {
		scope: Qiniu.bucket,
		deadline: Date.now() / 1000 + 3600,
		expires: 3600 * 24 * 7,
		returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
	}
	var mac = new qiniu.auth.digest.Mac(Qiniu.AccessKey, Qiniu.SecretKey);
	var putPolicy = new qiniu.rs.PutPolicy(options);
	var uploadToken = putPolicy.uploadToken(mac);

	ctx.response.body = {
		status: 0,
		msg: '成功',
		data: uploadToken
	}
})

router.get(route + '/domain', async (ctx, next) => {
	ctx.response.body = {
		status: 0,
		msg: '成功',
		data: Qiniu.domain
	}
})


module.exports = router