<template>
	<div class="register-page">
		<div class="register-container">
			<div class="register-content">
				<!-- 左侧说明区域 -->
				<div class="register-info">
					<div class="info-logo">
						<img src="@/assets/logo.png" alt="Logo" class="logo" />
					</div>

					<h1 class="info-title">用水运工程系统管理项目</h1>
					<p class="info-subtitle">助力工程协作与分析</p>
				</div>

				<!-- 右侧表单区域 -->
				<div class="register-form-container">
					<h2 class="form-title">创建账号</h2>

					<el-form
						ref="registerFormRef"
						:model="registerForm"
						:rules="registerRules"
						label-position="top"
						class="register-form"
						size="large"
					>
						<el-form-item label="学号" prop="id">
							<el-input
								v-model="registerForm.id"
								placeholder="请输入学号"
								clearable
								@blur="checkFormComplete"
							/>
						</el-form-item>

						<el-form-item label="用户名" prop="user_name">
							<el-input
								v-model="registerForm.user_name"
								placeholder="请输入用户名"
								clearable
								@blur="checkFormComplete"
							/>
						</el-form-item>

						<el-form-item label="密码" prop="password">
							<el-input
								v-model="registerForm.password"
								placeholder="请输入密码"
								type="password"
								show-password
								clearable
								@blur="checkFormComplete"
							/>
						</el-form-item>

						<el-form-item label="性别" prop="sex">
							<el-radio-group v-model="registerForm.sex" @change="checkFormComplete">
								<el-radio label="男">男</el-radio>
								<el-radio label="女">女</el-radio>
							</el-radio-group>
						</el-form-item>

						<el-form-item label="邮箱" prop="email">
							<div class="email-group">
								<el-input
									v-model="registerForm.email"
									placeholder="请输入邮箱"
									clearable
									@blur="checkEmailValue"
								/>
								<el-button
									:disabled="isEmailBtnDisabled"
									:loading="emailLoading"
									type="primary"
									class="email-code-btn"
									@click="sendEmailCode"
								>
									{{ sendEmailTxtBtn }}
								</el-button>
							</div>
						</el-form-item>

						<el-form-item label="邮箱验证码" prop="emailCode">
							<el-input
								v-model="registerForm.emailCode"
								placeholder="请输入邮箱验证码"
								clearable
								@blur="checkFormComplete"
							/>
						</el-form-item>

						<el-form-item label="验证码" prop="captcha">
							<div class="captcha-group">
								<el-input
									v-model="registerForm.captcha"
									placeholder="请输入验证码"
									clearable
									@blur="checkFormComplete"
								/>
								<div class="captcha-container" @click="updateCaptchaCode">
									<div class="captcha-image" v-html="captchaUrl"></div>
								</div>
							</div>
						</el-form-item>

						<div class="form-actions">
							<el-button
								type="primary"
								class="submit-btn"
								:disabled="isRegisterBtnDisabled"
								:loading="registerLoading"
								@click="submitForm"
							>
								免费注册
							</el-button>

							<div class="login-link">
								其他注册方式
								<span @click="goToLogin">返回登录</span>
							</div>
						</div>
					</el-form>
				</div>
			</div>
		</div>

		<!-- 注册成功对话框 -->
		<el-dialog
			v-model="dialogVisible"
			title="注册成功"
			width="360px"
			:show-close="false"
			align-center
		>
			<div class="success-content">
				<el-icon class="success-icon"><CheckCircle /></el-icon>
				<p>您的账号已注册成功，是否立即前往登录页？</p>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogVisible = false">稍后登录</el-button>
					<el-button type="primary" @click="goToLogin">立即登录</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { sendCaptcha, addUser, sendMailCode } from "@/api/service/user";
import Constants from "@/utils/Constants.js";
import SparkMD5 from "spark-md5";

export default {
	name: "UserRegister",
	components: {},
	setup() {
		const router = useRouter();
		const registerFormRef = ref(null);
		const registerLoading = ref(false);
		const emailLoading = ref(false);

		// 注册表单
		const registerForm = reactive({
			id: "",
			user_name: "",
			password: "",
			sex: "",
			email: "",
			emailCode: "",
			captcha: "",
		});

		// 表单验证规则
		const registerRules = reactive({
			id: [
				{ required: true, message: "请输入学号", trigger: "blur" },
				{
					min: 3,
					max: 20,
					message: "长度应在3到20个字符之间",
					trigger: "blur",
				},
			],
			user_name: [
				{ required: true, message: "请输入用户名", trigger: "blur" },
				{
					min: 2,
					max: 20,
					message: "长度应在2到20个字符之间",
					trigger: "blur",
				},
			],
			password: [
				{ required: true, message: "请输入密码", trigger: "blur" },
				{ min: 6, message: "密码长度至少为6个字符", trigger: "blur" },
			],
			sex: [{ required: true, message: "请选择性别", trigger: "change" }],
			email: [
				{ required: true, message: "请输入邮箱", trigger: "blur" },
				{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
			],
			emailCode: [{ required: true, message: "请输入邮箱验证码", trigger: "blur" }],
			captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
		});

		// 验证码图片
		const captchaUrl = ref("");

		// 获取验证码
		const updateCaptchaCode = async () => {
			try {
				const data = await sendCaptcha();
				captchaUrl.value = data;
			} catch (error) {
				ElMessage.error("获取验证码失败，请刷新页面重试");
			}
		};

		// 邮箱发送按钮
		const sendEmailTxtBtn = ref("发送验证码");
		const isEmailBtnDisabled = ref(true);

		// 验证邮箱
		const checkEmailValue = () => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			isEmailBtnDisabled.value = !(registerForm.email && emailRegex.test(registerForm.email));
			checkFormComplete();
		};

		// 倒计时
		const countDown = () => {
			let time = 60;
			isEmailBtnDisabled.value = true;

			const sendTime = setInterval(() => {
				time--;
				if (time < 0) {
					clearInterval(sendTime);
					sendEmailTxtBtn.value = "发送验证码";
					checkEmailValue();
				} else {
					sendEmailTxtBtn.value = `${time}s`;
				}
			}, 1000);
		};

		// 发送邮箱验证码
		const sendEmailCode = async () => {
			if (isEmailBtnDisabled.value) return;

			emailLoading.value = true;

			try {
				const params = {
					emailAddress: registerForm.email,
				};

				const result = await sendMailCode(params);

				if (result.code === Constants.status.SUCCESS) {
					ElMessage.success(result.msg || "验证码发送成功");
					countDown();
				} else {
					ElMessage.error(result.msg || "验证码发送失败");
				}
			} catch (error) {
				ElMessage.error("发送验证码失败，请检查网络连接");
			} finally {
				emailLoading.value = false;
			}
		};

		// 注册按钮状态
		const isRegisterBtnDisabled = ref(true);

		// 检查表单是否填写完整
		const checkFormComplete = () => {
			isRegisterBtnDisabled.value = !(
				registerForm.id.trim() &&
				registerForm.user_name.trim() &&
				registerForm.password &&
				registerForm.sex &&
				registerForm.email.trim() &&
				registerForm.emailCode.trim() &&
				registerForm.captcha.trim()
			);
		};

		// 确认对话框
		const dialogVisible = ref(false);

		// 去登录页
		const goToLogin = () => {
			router.push({
				name: "login",
			});
		};

		// 提交表单
		const submitForm = async () => {
			if (!registerFormRef.value) return;

			await registerFormRef.value.validate(async (valid) => {
				if (valid) {
					registerLoading.value = true;

					try {
						const params = {
							id: registerForm.id,
							user_name: registerForm.user_name,
							password: SparkMD5.hash(registerForm.password),
							sex: registerForm.sex,
							email: registerForm.email,
							emailCode: registerForm.emailCode,
							captcha: registerForm.captcha,
						};

						const result = await addUser(params);

						if (result.code === Constants.status.SUCCESS) {
							ElMessage.success(result.msg || "注册成功");
							dialogVisible.value = true;

							// 清空表单
							Object.keys(registerForm).forEach((key) => {
								registerForm[key] = "";
							});
							isRegisterBtnDisabled.value = true;
						} else {
							ElMessage.error(result.msg || "注册失败");
						}
					} catch (error) {
						ElMessage.error("注册失败，请检查网络连接");
					} finally {
						registerLoading.value = false;
						updateCaptchaCode();
					}
				} else {
					ElMessage.warning("请正确填写所有必填项");
				}
			});
		};

		// 初始化获取验证码
		onMounted(() => {
			updateCaptchaCode();
		});

		return {
			registerFormRef,
			registerForm,
			registerRules,
			captchaUrl,
			sendEmailTxtBtn,
			isEmailBtnDisabled,
			isRegisterBtnDisabled,
			dialogVisible,
			registerLoading,
			emailLoading,
			updateCaptchaCode,
			checkEmailValue,
			checkFormComplete,
			sendEmailCode,
			goToLogin,
			submitForm,
		};
	},
};
</script>

<style lang="scss" scoped>
.register-page {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f0f5ff;
	padding: 20px 0;
	overflow: hidden;
}

.register-container {
	width: 100%;
	max-width: 1000px;
	margin: 0 auto;
	min-width: 700px;
}

.register-content {
	display: flex;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	background-color: #fff;
}

/* 左侧信息区域 */
.register-info {
	width: 380px;
	background-color: #f0f5ff;
	padding: 40px 30px;
	display: flex;
	flex-direction: column;

	.info-logo {
		margin-bottom: 24px;

		.logo {
			height: 40px;
		}
	}

	.info-title {
		font-size: 22px;
		font-weight: 600;
		color: #1e1e1e;
		margin: 0 0 12px;
		line-height: 1.3;
	}

	.info-subtitle {
		font-size: 16px;
		color: #666;
		margin: 0;
	}

	.info-divider {
		height: 1px;
		background-color: rgba(0, 0, 0, 0.06);
		margin: 30px 0;
	}

	.info-features {
		.feature-item {
			display: flex;
			align-items: center;
			margin-bottom: 14px;

			.feature-icon {
				color: #4080ff;
				font-size: 15px;
				margin-right: 10px;
			}

			.feature-text {
				font-size: 14px;
				color: #333;
			}
		}
	}
}

/* 右侧表单区域 */
.register-form-container {
	flex: 1;
	padding: 40px;
	background-color: #fff;

	.form-title {
		font-size: 24px;
		font-weight: 600;
		color: #1e1e1e;
		margin: 0 0 30px;
		text-align: center;
	}
}

.register-form {
	max-width: 400px;
	margin: 0 auto;

	.el-form-item {
		margin-bottom: 12px;
	}

	.email-group,
	.captcha-group {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;

		.el-input {
			flex: 1;
		}

		.email-code-btn {
			width: 120px;
			flex-shrink: 0;
			background-color: #4080ff;
			border-color: #4080ff;

			&:hover:not(:disabled) {
				background-color: #2b63d4;
				border-color: #2b63d4;
			}

			&:disabled {
				background-color: #a0c0ff;
				border-color: #a0c0ff;
			}
		}
	}

	.captcha-container {
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid #dcdfe6;
		cursor: pointer;

		.captcha-image {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.form-actions {
		margin-top: 32px;

		.submit-btn {
			width: 100%;
			height: 44px;
			font-size: 16px;
			background-color: #4080ff;
			border-color: #4080ff;

			&:hover:not(:disabled) {
				background-color: #2b63d4;
				border-color: #2b63d4;
			}

			&:disabled {
				background-color: #a0c0ff;
				border-color: #a0c0ff;
			}
		}

		.login-link {
			margin-top: 16px;
			text-align: center;
			font-size: 14px;
			color: #666;

			span {
				margin-left: 8px;
				color: #4080ff;
				cursor: pointer;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}
}

.success-content {
	text-align: center;
	padding: 20px 0;

	.success-icon {
		font-size: 60px;
		color: #52c41a;
		margin-bottom: 16px;
	}

	p {
		font-size: 16px;
		color: #333;
		margin: 0;
	}
}

.dialog-footer {
	display: flex;
	justify-content: center;
	gap: 12px;
}
</style>
