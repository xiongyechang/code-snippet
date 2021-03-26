const AdminModel = require("../models/admin.model");
const Router = require("koa-router");
const Qiniu = require("../utils/qiniu")
const qiniu = require("qiniu")
const svgCaptcha = require("svg-captcha")
const crypto = require("crypto");
const JWT = require("jsonwebtoken");
const JSEncrypt = require("node-jsencrypt");
const Joi = require("@hapi/joi");
const config = require("../config/config");
const { makeKeyPair } = require("../utils/crypto");
const { HttpResponseCode } = require("../constants/constants");


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
		code: HttpResponseCode.OK,
		message: '成功',
		data: uploadToken
	}
})

router.get(route + '/getQiniuDomain', async (ctx, next) => {
	ctx.body = {
		code: HttpResponseCode.OK,
		message: '成功',
		data: Qiniu.domain
	}
});

router.get(route + "/getVerifyCode", async ctx => {

	const cap = svgCaptcha.create({
		size: 4, // 验证码长度
		width: 120,
		height: 40,
		fontSize: 30,
		ignoreChars: "0oO1ilI", // 验证码字符中排除 0o1i
		noise: 3, // 干扰线条的数量
		color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
		background: "#eeeeee" // 验证码图片背景颜色
	});

	let img = cap.data; // 验证码
	let text = cap.text.toLowerCase(); // 验证码字符，忽略大小写
	ctx.session.captcha = text;
	console.log(text);
	ctx.type = "html";
	ctx.body = {
		code: HttpResponseCode.OK,
		message: '成功',
		data: `${img}`
	};
});

router.get(route + `/getPublicKey`, async ctx => {
	try {
		const { publicKey, privateKey } = await makeKeyPair("rsa");
		ctx.session.privateKey = privateKey;
		ctx.body = {
			code: HttpResponseCode.OK,
			message: '获取公钥成功',
			data: publicKey
		};
	} catch (error) {
		ctx.body = {
			code: HttpResponseCode.EXCEPTION,
			message: '获取公钥异常',
			data: null
		};
	}
});

router.post(route + "/login", async ctx => {
	try {
		let {
			username,
			password,
			verify_code
		} = ctx.request.body;

		const schema = Joi.object({
			username: Joi.string().required(),
			password: Joi.string().required(),
			verify_code: Joi.string().min(4).max(4).required()
		});

		if (verify_code.toLowerCase() !== ctx.session.captcha) {
			throw new Error("验证码错误");
		}
		console.log(ctx.session.captcha)
		delete ctx.session.captcha;

		const {
			error,
			value
		} = await schema.validate({
			username,
			password,
			verify_code
		});

		if (error) throw error;

		const decrypt = new JSEncrypt();
		decrypt.setPrivateKey(ctx.session.privateKey);
		password = decrypt.decrypt(password);

		password = crypto
			.createHash("md5")
			.update(password)
			.digest("hex");
		let user = await AdminModel.findOne({
			username,
			password
		});
		if (!user) {
			ctx.body = {
				code: HttpResponseCode.ERROR,
				message: '账号或密码错误',
				data: null
			};
		} else {
			const payload = {
				user_id: user._id,
				username: user.username,
				role: "admin",
				roleCode: 1000,
				exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60
			};
			const access_token = JWT.sign(payload, config.jwtSecret);

			const updatedAdmin = await AdminModel.findOneAndUpdate({
				username
			}, {
				$set: {
					token: access_token,
					online: true
				}
			});

			ctx.session.user = updatedAdmin;

			ctx.body = {
				code: HttpResponseCode.OK,
				message: '登录成功',
				data: access_token
			};
		}
	} catch (error) {
		console.error(error);
		ctx.body = {
			code: HttpResponseCode.EXCEPTION,
			message: '服务端异常',
			data: null
		};
	}
});


module.exports = router;