<template>
	<div class="user-update-module">
		<el-card shadow="hover" class="update-card">
			<template #header>
				<div class="card-header">
					<span>信息修改</span>
				</div>
			</template>

			<el-form
				ref="userFormRef"
				:model="userForm"
				:rules="userRules"
				label-position="right"
				label-width="80px"
				class="update-form"
			>
				<el-form-item label="学号" prop="id">
					<el-input v-model="userForm.id" disabled></el-input>
				</el-form-item>

				<el-form-item label="姓名" prop="user_name">
					<el-input
						v-model="userForm.user_name"
						placeholder="请输入姓名"
						@input="validateForm"
						clearable
					></el-input>
				</el-form-item>

				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="userForm.sex" @change="validateForm">
						<el-radio label="男">男</el-radio>
						<el-radio label="女">女</el-radio>
					</el-radio-group>
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

			<div class="update-footer">
				<el-button
					type="primary"
					:disabled="isDisabled"
					:loading="loading"
					@click="submitForm(userFormRef)"
					>保存修改</el-button
				>
			</div>
		</el-card>
	</div>
</template>

<script>
import { computed, ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { sendCaptcha } from "@/api/service/user";

export default {
	name: "UserUpdate",
	setup() {
		const store = useStore();
		const userFormRef = ref(null);
		const loading = ref(false);

		const userForm = ref({
			id: "",
			user_name: "",
			sex: "",
			captcha: "",
		});

		// 验证规则
		const userRules = reactive({
			user_name: [
				{
					required: true,
					message: "用户名不能为空",
					trigger: "blur",
				},
				{
					min: 2,
					max: 20,
					message: "用户名长度应在2-20个字符之间",
					trigger: "blur",
				},
			],
			sex: [
				{
					required: true,
					message: "请选择性别",
					trigger: "change",
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
			userForm.value = { ...userInfo.value, captcha: "" };
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

		// 表单验证状态
		const isDisabled = ref(true);

		// 验证表单完整性
		const validateForm = () => {
			if (
				userForm.value.user_name.trim() !== "" &&
				userForm.value.sex !== "" &&
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
						// 验证登录
						const params = {
							id: userForm.value.id,
							user_name: userForm.value.user_name,
							sex: userForm.value.sex,
							captcha: userForm.value.captcha,
						};

						await store.dispatch("user/updateUser", params);
						ElMessage.success("更新信息成功");
						userForm.value.captcha = "";
					} catch (error) {
						ElMessage.error("更新失败: " + error.message || "未知错误");
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
			isDisabled,
			loading,
			validateForm,
			updateCaptchaCode,
			submitForm,
		};
	},
};
</script>

<style lang="scss" scoped>
.user-update-module {
	width: 100%;

	.update-card {
		border-radius: 8px;
		background-color: #fff;

		.card-header {
			display: flex;
			align-items: center;
			font-size: 16px;
			font-weight: 500;
			color: #1d2129;
		}

		.update-form {
			padding: 10px 0;

			.el-form-item {
				margin-bottom: 20px;
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

		.update-footer {
			margin-top: 20px;
			display: flex;
			justify-content: flex-end;
		}
	}
}
</style>
