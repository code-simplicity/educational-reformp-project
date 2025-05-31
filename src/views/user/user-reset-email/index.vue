<template>
	<div class="email-reset-module">
		<el-card shadow="hover" class="reset-card">
			<template #header>
				<div class="card-header">
					<span>重置邮箱</span>
				</div>
			</template>

			<el-form
				ref="userFormRef"
				:model="userForm"
				:rules="userRules"
				label-position="right"
				label-width="120px"
				class="reset-form"
			>
				<el-form-item label="学号" prop="id">
					<el-input v-model="userForm.id" disabled></el-input>
				</el-form-item>

				<el-form-item label="新邮箱" prop="email">
					<div class="email-row">
						<el-input
							v-model="userForm.email"
							placeholder="请输入新邮箱地址"
							@input="checkEmailValue"
							clearable
						></el-input>
						<el-button
							type="primary"
							:disabled="isEmailText"
							:loading="emailLoading"
							@click="sendEmailCode"
							>{{ emailTextBtn }}</el-button
						>
					</div>
				</el-form-item>

				<el-form-item label="邮箱验证码" prop="emailCode">
					<el-input
						v-model="userForm.emailCode"
						placeholder="请输入邮箱验证码"
						@input="validateForm"
						clearable
					></el-input>
				</el-form-item>

				<el-form-item label="验证码" prop="captcha">
					<div class="captcha-row">
						<el-input
							v-model="userForm.captcha"
							placeholder="请输入验证码"
							@input="validateForm"
							clearable
						></el-input>
						<div
							class="captcha-img"
							v-html="captchaUrl"
							@click="updateCaptchaCode"
							title="点击刷新验证码"
						></div>
					</div>
				</el-form-item>
			</el-form>

			<div class="reset-footer">
				<el-button
					type="primary"
					:disabled="isDisabled"
					:loading="loading"
					@click="submitForm(userFormRef)"
					>确认修改</el-button
				>
			</div>
		</el-card>
	</div>
</template>

<script>
import { computed, ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { sendCaptcha, sendMailCode, resetEmailUser } from "@/api/service/user";
import Constants from "@/utils/Constants";

export default {
	name: "UserResetEmail",
	setup() {
		const store = useStore();
		const userFormRef = ref(null);
		const loading = ref(false);
		const emailLoading = ref(false);

		const userForm = ref({
			id: "",
			email: "",
			emailCode: "",
			captcha: "",
		});

		// 验证规则
		const userRules = reactive({
			email: [
				{
					required: true,
					message: "邮箱不能为空",
					trigger: "blur",
				},
				{
					type: "email",
					message: "请输入正确的邮箱格式",
					trigger: "blur",
				},
			],
			emailCode: [
				{
					required: true,
					message: "邮箱验证码不能为空",
					trigger: "blur",
				},
			],
			captcha: [
				{
					required: true,
					message: "验证码不能为空",
					trigger: "blur",
				},
			],
		});

		// 获取用户信息
		const userInfo = computed(() => store.getters["user/userInfo"]);

		// 初始化表单数据
		onMounted(() => {
			userForm.value = {
				id: userInfo.value.id,
				email: "",
				emailCode: "",
				captcha: "",
			};
			updateCaptchaCode();
		});

		// svg-captcha验证码
		const captchaUrl = ref(null);

		// 获取验证码
		const updateCaptchaCode = async () => {
			try {
				const data = await sendCaptcha();
				captchaUrl.value = data;
			} catch (error) {
				ElMessage.error("获取验证码失败，请刷新页面重试");
			}
		};

		// 邮箱验证码相关
		const emailTextBtn = ref("获取验证码");
		const isEmailText = ref(true);

		// 验证邮箱
		const checkEmailValue = () => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (userForm.value.email.trim() !== "" && emailRegex.test(userForm.value.email)) {
				isEmailText.value = false;
			} else {
				isEmailText.value = true;
			}
			validateForm();
		};

		// 60s倒计时
		const countDown = () => {
			let time = 60;
			isEmailText.value = true;

			const sendTime = setInterval(() => {
				time--;
				if (time < 0) {
					clearInterval(sendTime);
					emailTextBtn.value = "获取验证码";
					isEmailText.value = false;
				} else {
					emailTextBtn.value = `重新发送(${time})`;
				}
			}, 1000);
		};

		// 发送邮箱验证码
		const sendEmailCode = async () => {
			emailLoading.value = true;

			try {
				const params = {
					emailAddress: userForm.value.email,
				};

				const result = await sendMailCode(params);

				if (result.code === Constants.status.SUCCESS) {
					ElMessage.success(result.msg || "验证码发送成功");
					countDown();
				} else {
					ElMessage.error(result.msg || "验证码发送失败");
				}
			} catch (error) {
				ElMessage.error("发送验证码失败: " + error.message || "服务异常");
			} finally {
				emailLoading.value = false;
			}
		};

		// 表单验证状态
		const isDisabled = ref(true);

		// 验证表单完整性
		const validateForm = () => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (
				userForm.value.email.trim() !== "" &&
				emailRegex.test(userForm.value.email) &&
				userForm.value.emailCode.trim() !== "" &&
				userForm.value.captcha.trim() !== ""
			) {
				isDisabled.value = false;
			} else {
				isDisabled.value = true;
			}
		};

		// 提交表单
		const submitForm = async (formEl) => {
			if (!formEl) return;

			await formEl.validate(async (valid) => {
				if (valid) {
					loading.value = true;

					try {
						const params = {
							id: userForm.value.id,
							email: userForm.value.email,
							emailCode: userForm.value.emailCode,
							captcha: userForm.value.captcha,
						};

						const result = await resetEmailUser(params);

						if (result.code === Constants.status.SUCCESS) {
							await store.dispatch("user/updateUser", userForm.value.id);
							ElMessage.success(result.msg || "邮箱更新成功");
							userForm.value.email = "";
							userForm.value.emailCode = "";
							userForm.value.captcha = "";
							isDisabled.value = true;
						} else {
							ElMessage.error(result.msg || "更新失败");
						}
					} catch (error) {
						ElMessage.error("邮箱更新失败: " + error.message || "服务异常");
					} finally {
						loading.value = false;
						updateCaptchaCode();
					}
				} else {
					ElMessage.warning("请正确填写所有必填项");
				}
			});
		};

		return {
			userFormRef,
			userForm,
			userRules,
			userInfo,
			captchaUrl,
			emailTextBtn,
			isEmailText,
			isDisabled,
			loading,
			emailLoading,
			checkEmailValue,
			validateForm,
			updateCaptchaCode,
			sendEmailCode,
			submitForm,
		};
	},
};
</script>

<style lang="scss" scoped>
.email-reset-module {
	width: 100%;

	.reset-card {
		border-radius: 8px;
		background-color: #fff;

		.card-header {
			display: flex;
			align-items: center;
			font-size: 16px;
			font-weight: 500;
			color: #1d2129;
		}

		.reset-form {
			padding: 10px 0;

			.el-form-item {
				margin-bottom: 20px;
			}

			.email-row {
				display: flex;
				align-items: center;
				gap: 12px;

				.el-input {
					flex: 1;
				}
			}

			.captcha-row {
				display: flex;
				align-items: center;
				gap: 12px;

				.el-input {
					flex: 1;
				}

				.captcha-img {
					cursor: pointer;
					border-radius: 4px;
					overflow: hidden;
					height: 32px;
					display: flex;
					align-items: center;

					&:hover {
						opacity: 0.8;
					}
				}
			}
		}

		.reset-footer {
			margin-top: 20px;
			display: flex;
			justify-content: flex-end;
		}
	}
}
</style>
