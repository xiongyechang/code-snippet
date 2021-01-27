<template>
	<div class="container">
		<div class="main">
			<div class="main_login">
				<p class="main_login-title">登录</p>
			</div>
			<el-form
				ref="ruleForm"
				:model="ruleForm"
				:rules="rules"
				label-width="80px"
				label-position="right"
				:status-icon="true"
			>
				<el-form-item label="账号:" prop="username" required>
					<el-input
						class="input"
						type="text"
						v-model="ruleForm.username"
						placeholder="请输入账号"
					></el-input>
				</el-form-item>
				<el-form-item label="密码:" prop="password" required>
					<el-input
						class="input"
						type="password"
						v-model="ruleForm.password"
						placeholder="请输入密码"
					></el-input>
				</el-form-item>
				<el-form-item label="验证码:" prop="verify_code">
					<el-row>
						<el-col :span="12">
							<el-input
								class="input"
								v-model="ruleForm.verify_code"
								placeholder="请输入验证码"
							></el-input>
						</el-col>
						<el-col :span="12">
							<div
								v-html="verifyCodeImg"
								@click="getVerifyCode"
							></div>
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="center">
				<el-col :span="4">
					<el-button @click="submitForm('ruleForm')" type="primary">登录</el-button>
				</el-col>
				<el-col :span="4">
					<el-button @click="forgetPwd" type="text">忘记密码</el-button>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import API from "@/api/api";
	import JSEncrypt from "jsencrypt";
	import { HttpResponseCode } from '@/constants/constants';

	export default {
		name: "login-page",
		data() {
			return {
				verifyCodeImg: null,
				ruleForm: {
					username: "",
					password: "",
					email: "",
					verify_code: "",
				},
				publicKey: "",
				rules: {
					username: [
						{
							required: true,
							message: "请输入用户名",
							trigger: "blur",
						},
						{
							min: 6,
							max: 16,
							message: "长度在3-16个字符",
							trigger: "blur",
						},
					],
					password: [
						{ required: true, message: "请输入密码", trigger: "blur" },
						{
							min: 6,
							max: 12,
							message: "长度在6-12个字符",
							trigger: "blur",
						},
					],
					email: [
						{ required: false, message: "请输入邮箱", trigger: "blur" },
						{
							partten: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
							message: "邮箱格式错误",
							trigger: "blur",
						},
					],
					verify_code: [
						{
							required: true,
							message: "请输入验证码",
							trigger: "blur",
						},
						{
							min: 4,
							max: 4,
							message: "长度在4-6个字符",
							trigger: "blur",
						},
					],
				},
			};
		},
		async created() {
			// 先获取公钥, 再获取验证码, 这样前一个接口返回的cookie正好被后面的接口使用
			// 如果并行发送请求, 则会请求回来两个不同的cookie, 登陆时, 请求发送的cookie是不对的,
			// 无法验证 验证码的准确性
			await this.getPublicKey();
			await this.getVerifyCode();
		},
		methods: {
			async getVerifyCode() {
				try {
					const { code, message, data } = await API.getVerifyCode();
					if (code === HttpResponseCode.OK) {
						this.verifyCodeImg = data;
					} else {
						this.$message.error(message);
					}
				} catch (error) {
					console.error(error);
				}
			},
			async getPublicKey() {
				try {
					const { code, message, data } = await API.getPublicKey();
					if (code === HttpResponseCode.OK) {
						this.publicKey = data;
					} else {
						this.$message.error(message);
					}
				} catch (error) {
					console.error(error);
				}
			},
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						try {
							let encrypt = new JSEncrypt();
							encrypt.setPublicKey(this.publicKey);
							let username = this.ruleForm.username;
							let password = encrypt.encrypt(this.ruleForm.password);
							let verify_code = this.ruleForm.verify_code;
							const { code, message, data } = await API.login({ username, password, verify_code });
							
							if (code === HttpResponseCode.OK) {
								localStorage.setItem("access_token", data);
								this.$store
									.dispatch("admin/setLoginStatus", true)
									.then(() => {
										this.$router.push({
											name: "admin",
										});
									});
							} else {
								this.$message.error(message)
							}
						} catch (error) {
							console.error(error);
						}
					} else {
						return false;
					}
				});
			},
			async forgetPwd() {
				// let email;
				// if (this.ruleForm.email) {
				// 	email = this.ruleForm.email;
				// } else {
				// 	email = prompt("请输入邮箱:");
				// }
				// if (email.trim()) {
				// 	let { msg } = await API.forgetPwd(email);
				// 	this.$message.success(msg);
				// }
			},
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		position: absolute;
		top: 33px;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url("http://cdn.xiongyechang.com/blog-background.jpg");
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
		.main {
			text-align: center;
			background-color: #ffffff;
			padding: 20px;
			border-radius: 1px;
			width: 30%;
			&_login {
				margin: 0 0 10px 0;
				border-bottom: 1px dashed #dcdfe6;
				&-title {
					font-size: 20px;
					line-height: 1.5em;
				}
			}
			.input {
				font-size: 16px;
			}
		}
	}
</style>
