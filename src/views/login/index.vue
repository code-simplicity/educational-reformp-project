<template>
	<div class="login-page">
		<div class="login-container">
			<div class="login-box">
				<div class="login-header">
					<div class="header-content">
						<img src="@/assets/logo.png" alt="Logo" class="login-logo" />
						<h1 class="login-title">水运工程仿真实验系统</h1>
					</div>
					<div class="wave-decoration"></div>
				</div>

				<el-form
					ref="loginFormRef"
					:model="loginForm"
					:rules="loginRules"
					class="login-form"
					label-position="top"
				>
					<el-form-item label="学号" prop="id">
						<el-input
							v-model="loginForm.id"
							placeholder="请输入学号"
							clearable
							@keyup.enter="handleSubmit"
						>
							<template #prefix>
								<div class="input-icon-wrapper">
									<el-icon><UserFilled /></el-icon>
								</div>
							</template>
						</el-input>
					</el-form-item>

					<el-form-item label="密码" prop="password">
						<el-input
							v-model="loginForm.password"
							type="password"
							placeholder="请输入密码"
							show-password
							clearable
							@keyup.enter="handleSubmit"
						>
							<template #prefix>
								<div class="input-icon-wrapper">
									<el-icon><Lock /></el-icon>
								</div>
							</template>
						</el-input>
					</el-form-item>

					<el-form-item label="验证码" prop="captcha">
						<div class="captcha-row">
							<el-input
								v-model="loginForm.captcha"
								placeholder="请输入验证码"
								clearable
								@keyup.enter="handleSubmit"
							>
								<template #prefix>
									<div class="input-icon-wrapper">
										<el-icon><Key /></el-icon>
									</div>
								</template>
							</el-input>

							<div class="captcha-display">
								<div
									class="captcha-img"
									v-html="captchaUrl"
									@click="updateCaptchaCode"
									title="点击刷新验证码"
								></div>
								<div class="captcha-refresh" @click="updateCaptchaCode">
									<el-icon><Refresh /></el-icon>
								</div>
							</div>
						</div>
					</el-form-item>

					<div class="login-actions">
						<div class="action-row">
							<el-button
								type="primary"
								class="login-button"
								:loading="loading"
								@click="handleSubmit"
							>
								登录系统
							</el-button>

							<el-button class="register-button" @click="registerUser">
								注册账号
							</el-button>
						</div>

						<div class="login-tips">
							<el-alert
								title="请使用账号和密码登录系统"
								type="info"
								:closable="false"
								show-icon
								center
							/>
						</div>
					</div>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { UserFilled, Lock, Key, Refresh } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import SparkMD5 from 'spark-md5';
import { sendCaptcha } from '@/api/service/user';
import Constants from '@/utils/Constants.js';

export default {
	name: 'LoginPage',
	components: {
		UserFilled,
		Lock,
		Key,
		Refresh,
	},
	setup() {
		const router = useRouter();
		const store = useStore();
		const loginFormRef = ref(null);
		const loading = ref(false);

		// 登录表单
		const loginForm = reactive({
			id: '',
			password: '',
			captcha: '',
		});

		// 验证规则
		const loginRules = reactive({
			id: [
				{
					required: true,
					message: '请输入学号',
					trigger: 'blur',
				},
			],
			password: [
				{
					required: true,
					message: '请输入密码',
					trigger: 'blur',
				},
			],
			captcha: [
				{
					required: true,
					message: '请输入验证码',
					trigger: 'blur',
				},
			],
		});

		// 验证码图片
		const captchaUrl = ref('');

		// 获取验证码
		const updateCaptchaCode = async () => {
			try {
				const data = await sendCaptcha();
				captchaUrl.value = data;
			} catch (error) {
				ElMessage.error('获取验证码失败，请刷新页面重试');
			}
		};

		// 登录提交
		const handleSubmit = async () => {
			if (!loginFormRef.value) return;

			await loginFormRef.value.validate(async (valid) => {
				if (valid) {
					loading.value = true;

					try {
						// 准备登录参数
						const params = {
							id: loginForm.id,
							password: SparkMD5.hash(loginForm.password),
							captcha: loginForm.captcha,
						};

						// 调用登录接口
						const response = await store.dispatch('user/login', params);

						if (response.code === Constants.status.SUCCESS) {
							router.replace({ path: '/home' });
						} else {
							updateCaptchaCode();
							loginForm.captcha = '';
						}
					} catch (error) {
						updateCaptchaCode();
					} finally {
						loading.value = false;
					}
				}
			});
		};

		// 前往注册页面
		const registerUser = () => {
			router.push({
				name: 'register',
			});
		};

		// 初始化获取验证码
		onMounted(() => {
			updateCaptchaCode();
		});

		return {
			loginFormRef,
			loginForm,
			loginRules,
			loading,
			captchaUrl,
			handleSubmit,
			updateCaptchaCode,
			registerUser,
		};
	},
};
</script>

<style lang="scss" scoped>
.login-page {
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
	background-color: #f5f7fa;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url('@/assets/images/bg.jpg');
		background-size: cover;
		background-position: center;
		opacity: 0.85;
		z-index: 0;
	}
}

.login-container {
	position: relative;
	z-index: 1;
	width: 100%;
	max-width: 460px;
	min-width: 320px;
	padding: 0 20px;
}

.login-box {
	background-color: rgba(255, 255, 255, 0.97);
	border-radius: 16px;
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28);
	overflow: hidden;
}

.login-header {
	background-color: #155bd4;
	color: white;
	position: relative;
	padding-bottom: 20px;

	.header-content {
		padding: 30px 35px 40px;
		text-align: center;
		position: relative;
		z-index: 1;
	}

	.login-logo {
		height: 50px;
		margin-bottom: 15px;
	}

	.login-title {
		font-size: 24px;
		font-weight: 600;
		margin: 0;
		letter-spacing: 0.5px;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.wave-decoration {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 20px;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' fill='%23ffffff' opacity='1'%3E%3C/path%3E%3C/svg%3E");
		background-size: cover;
		background-position: center;
		z-index: 0;
	}
}

.login-form {
	padding: 35px 35px 35px;

	.el-form-item {
		margin-bottom: 22px;

		&__label {
			font-weight: 500;
			color: #1d2129;
			padding-bottom: 6px;
		}
	}

	.input-icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		color: #909399;
	}

	.captcha-row {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;

		.el-input {
			flex: 1;
		}

		.captcha-display {
			position: relative;
			flex-shrink: 0;
			border-radius: 4px;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: center;

			.captcha-img {
				cursor: pointer;
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #fff;
			}

			.captcha-refresh {
				position: absolute;
				top: 0;
				right: 0;
				width: 20px;
				height: 20px;
				background-color: rgba(255, 255, 255, 0.9);
				border-bottom-left-radius: 4px;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;

				.el-icon {
					font-size: 12px;
					color: #155bd4;
				}
			}
		}
	}
}

.login-actions {
	margin-top: 32px;

	.action-row {
		display: flex;
		gap: 15px;

		.login-button,
		.register-button {
			flex: 1;
			height: 44px;
			font-size: 15px;
			border-radius: 6px;
		}

		/* 明确覆盖 Element Plus 的默认样式 */
		.login-button + .register-button {
			margin-left: 0;
		}
	}

	.login-tips {
		margin-top: 20px;

		:deep(.el-alert) {
			background-color: #f2f3f5;
			padding: 12px;

			.el-alert__content {
				padding: 0;
			}

			.el-alert__title {
				font-size: 13px;
				color: #4e5969;
				line-height: 1.5;
			}

			.el-alert__icon {
				color: #155bd4;
				font-size: 16px;
				margin-right: 6px;
			}
		}
	}
}

@media (max-width: 768px) {
	.login-container {
		max-width: 400px;
	}

	.login-actions {
		.action-row {
			flex-direction: column;
			gap: 10px;

			.login-button,
			.register-button {
				width: 100%;
			}
		}
	}

	.login-form {
		.captcha-row {
			flex-direction: column;
			gap: 8px;

			.captcha-display {
				width: 100%;
			}
		}
	}
}
</style>
