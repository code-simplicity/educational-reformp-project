<template>
	<transition name="fade">
		<div class="login flex-justify-center">
			<div class="title">水运工程仿真实验系统</div>
			<div class="login-box order">
				<div class="login-title">登录</div>
				<div class="form-box">
					<el-form
						ref="ruleFormRef"
						:model="ruleForm"
						status-icon
						:rules="rules"
						label-position="left"
						label-width="60px"
						class="demo-ruleForm"
						label-suffix=":"
						:hide-required-asterisk="true"
					>
						<el-form-item label="学号" prop="id">
							<el-input
								v-model="ruleForm.id"
								type="text"
								autocomplete="off"
								autofocus="true"
								placeholder="请输入学号"
								clearable
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
								autocomplete="off"
								clearable
							>
								<template #prefix>
									<el-icon class="el-input__icon"
										><Unlock
									/></el-icon> </template
							></el-input>
						</el-form-item>
						<el-form-item label="验证码" prop="captcha">
							<el-row :gutter="24">
								<el-col :span="14"
									><el-input
										v-model="ruleForm.captcha"
										type="text"
										placeholder="请输入图灵验证码"
										autocomplete="off"
										clearable
										@click="submitForm(ruleFormRef)"
									>
										<template #prefix>
											<el-icon class="el-input__icon"
												><Key
											/></el-icon> </template></el-input
								></el-col>
								<el-col :span="10">
									<div
										class="captcha-style"
										v-html="captchaUrl"
										@click="updateCaptchaCode"
									></div>
								</el-col>
							</el-row>
						</el-form-item>
						<el-form-item>
							<div class="flex-between">
								<el-button type="primary" @click="submitForm(ruleFormRef)"
									>登录</el-button
								>
								<el-button @click="resetForm('ruleForm')">注册</el-button>
							</div>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
import { reactive, ref } from "vue";
import { UserFilled, Unlock, Key } from "@element-plus/icons";
import { sendCaptcha } from "../../api/service/user";
import SparkMD5 from "spark-md5";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Constants from "../../utils/Constants.js";
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
				if (res.status === Constants.status.SUCCESS) {
					router.replace({
						path: "/home",
					});
				}
			});
		}
	});
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition: 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.login {
	width: 100vw;
	min-height: 100vh;
	.title {
		font-size: 30px;
		margin-bottom: 30px;
	}
	.login-box {
		padding: 16px;
		box-shadow: -1px 1px 10px rgb(0, 0, 0, 0.6);
		width: 30%;
		min-width: 400px;
		display: flex;
		flex-direction: column;
		.login-title {
			margin-bottom: 16px;
			font-size: 20px;
			text-align: center;
		}
		.captcha-style {
			cursor: pointer;
		}
	}
}
</style>
