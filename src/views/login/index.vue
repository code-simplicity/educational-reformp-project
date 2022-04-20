<template>
	<div class="login">
		<Particles />
		<div class="login-container animate__animated animate__zoomInDown">
			<div class="title">欢迎登陆水运工程仿真实验系统</div>
			<div class="login-box order">
				<div class="form-box">
					<el-form
						ref="ruleFormRef"
						:model="ruleForm"
						:rules="rules"
						label-position="right"
						label-width="80px"
						class="demo-ruleForm"
						label-suffix=":"
						:hide-required-asterisk="true"
					>
						<el-form-item label="学号" prop="id">
							<el-input
								v-model="ruleForm.id"
								type="text"
								autofocus="true"
								placeholder="请输入学号"
								clearable
								@keyup.enter="submitForm(ruleFormRef)"
							>
								<template #prefix>
									<el-icon class="el-input__icon"
										><UserFilled
									/></el-icon> </template
							></el-input>
						</el-form-item>
						<el-form-item label="密码" prop="password">
							<el-input
								v-model="ruleForm.password"
								type="password"
								placeholder="请输入密码"
								clearable
								@keyup.enter="submitForm(ruleFormRef)"
							>
								<template #prefix>
									<el-icon class="el-input__icon"
										><Unlock
									/></el-icon> </template
							></el-input>
						</el-form-item>
						<el-form-item label="验证码" prop="captcha">
							<el-row :gutter="12">
								<el-col :span="16"
									><el-input
										v-model="ruleForm.captcha"
										type="text"
										placeholder="请输入图灵验证码"
										autocomplete="off"
										@keyup.enter="submitForm(ruleFormRef)"
									>
										<template #prefix>
											<el-icon class="el-input__icon"
												><Key
											/></el-icon> </template></el-input
								></el-col>
								<el-col :span="2">
									<div
										class="captcha-style"
										v-html="captchaUrl"
										@click="updateCaptchaCode"
									></div>
								</el-col>
							</el-row>
						</el-form-item>
						<el-form-item>
							<div class="login-footer">
								<el-button
									type="primary"
									size="large"
									@click="submitForm(ruleFormRef)"
									>登录</el-button
								>
								<el-button size="large" @click="registerUser">注册</el-button>
							</div>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { UserFilled, Unlock, Key } from "@element-plus/icons-vue";
import { sendCaptcha } from "../../api/service/user";
import SparkMD5 from "spark-md5";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Constants from "../../utils/Constants.js";
import Particles from "../../components/particles/index.vue";
const router = useRouter();
const store = useStore();
const ruleFormRef = ref(null);
// 登录表单
const ruleForm = reactive({
	// 学号
	id: "",
	// 密码
	password: "",
	captcha: "",
});
// 验证规则
const rules = reactive({
	id: [{ required: true, message: "请输入学号", trigger: "blur" }],
	password: [
		{
			required: true,
			message: "请输入密码",
			trigger: "blur",
		},
	],
	captcha: [
		{
			required: true,
			message: "请输入验证码",
			trigger: "blur",
		},
	],
});
// svg-captcha验证码
const captchaUrl = ref(null);

/**
 * 获取验证码
 */
const updateCaptchaCode = async () => {
	const data = await sendCaptcha();
	captchaUrl.value = data;
};
// 函数调用
updateCaptchaCode();

/**
登录提交
 */
const submitForm = async (formEl) => {
	if (!formEl) return;
	await formEl.validate((valid) => {
		if (valid) {
			// 验证登录
			const params = {
				id: ruleForm.id,
				password: SparkMD5.hash(ruleForm.password),
				captcha: ruleForm.captcha,
			};
			store.dispatch("user/login", params).then((res) => {
				console.log("res :>> ", res);
				if (res.code === Constants.status.SUCCESS) {
					router.replace({
						path: "/home",
					});
					updateCaptchaCode();
				} else {
					// 更新验证码
					updateCaptchaCode();
				}
			});
		}
	});
};

// 注册
const registerUser = () => {
	router.push({
		name: "register",
	});
};
</script>

<style lang="scss" scoped>
.login {
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	.login-container {
		box-shadow: 0 0 50px rgba(29, 29, 29, 0.732);
		padding: 50px 35px;
		display: flex;
		flex-direction: column;
		align-items: center;
		align-content: center;
		justify-content: center;
		color: #fff;
		.title {
			font-size: 30px;
			margin-bottom: 20px;
		}
		.login-box {
			padding: 16px;

			.captcha-style {
				cursor: pointer;
			}
			.form-box {
				.login-footer {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;
				}
				::v-deep .el-form-item__label {
					color: #fff;
				}
			}
		}
	}
}
</style>
