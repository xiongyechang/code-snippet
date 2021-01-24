const Router = require("koa-router");
const Qiniu = require("../utils/qiniu")
const qiniu = require("qiniu")
const svgCaptcha = require("svg-captcha")
const { makeKeyPair } = require("../utils/crypto");


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

router.get(route + "/getVerifyCode", async ctx => {

	const cap = svgCaptcha.create({
		size: 4, // 验证码长度
		width: 100,
		height: 32,
		fontSize: 30,
		ignoreChars: "0oO1ilI", // 验证码字符中排除 0o1i
		noise: 3, // 干扰线条的数量
		color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
		background: "#eeeeee" // 验证码图片背景颜色
	});

	let img = cap.data; // 验证码
	let text = cap.text.toLowerCase(); // 验证码字符，忽略大小写
	ctx.session.captcha = text;
	ctx.type = "html";
	ctx.body = {
		status: 0,
		msg: "获取验证码成功",
		data: `${img}`
	};
});

router.get(route + `/getPublicKey`, async ctx => {
	try {
		const { publicKey, privateKey } = await makeKeyPair("rsa");
		ctx.session.privateKey = privateKey;
		ctx.body = {
			status: 0,
			msg: "成功",
			data: publicKey
		};
	} catch (error) {
		ctx.body = {
			status: -1,
			msg: "系统异常",
			data: null
		};
	}
});


module.exports = router;