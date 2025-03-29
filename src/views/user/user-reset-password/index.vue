<template>
	<div class="password-reset-module">
		<el-card shadow="hover" class="reset-card">
			<template #header>
				<div class="card-header">
					<span>重置密码</span>
				</div>
			</template>

			<el-form
				ref="userFormRef"
				:model="userForm"
				:rules="userRules"
				label-position="right"
				label-width="100px"
				class="reset-form"
			>
				<el-form-item label="学号" prop="id">
					<el-input v-model="userForm.id" disabled></el-input>
				</el-form-item>

				<el-form-item label="新密码" prop="password">
					<el-input
						v-model="userForm.password"
						placeholder="请输入新密码"
						type="password"
						show-password
						@input="checkUserValue"
						clearable
					></el-input>
					<div class="form-tips">建议使用字母、数字组合的密码以提高安全性</div>
				</el-form-item>

				<el-form-item label="验证码" prop="captcha">
					<div class="captcha-row">
						<el-input
							v-model="userForm.captcha"
							placeholder="请输入验证码"
							@input="checkUserValue"
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
import { computed, ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { sendCaptcha, resetPasswordUser } from '@/api/service/user';
import Constants from '@/utils/Constants';
import SparkMD5 from 'spark-md5';

export default {
	name: 'UserResetPassword',
	setup() {
		const store = useStore();
		const userFormRef = ref(null);
		const loading = ref(false);

		const userForm = ref({
			id: '',
			password: '',
			captcha: '',
		});

		// 验证规则
		const userRules = reactive({
			password: [
				{
					required: true,
					message: '密码不能为空',
					trigger: 'blur',
				},
				{
					min: 6,
					message: '密码长度至少为6个字符',
					trigger: 'blur',
				},
			],
			captcha: [
				{
					required: true,
					message: '验证码不能为空',
					trigger: 'blur',
				},
			],
		});

		// 获取用户信息
		const userInfo = computed(() => store.getters['user/userInfo']);

		// 初始化表单数据
		onMounted(() => {
			userForm.value = {
				id: userInfo.value.id,
				password: '',
				captcha: '',
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
				ElMessage.error('获取验证码失败，请刷新页面重试');
			}
		};

		// 表单验证状态
		const isDisabled = ref(true);

		// 验证表单完整性
		const checkUserValue = () => {
			if (
				userForm.value.password.trim() !== '' &&
				userForm.value.captcha.trim() !== ''
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
							password: SparkMD5.hash(userForm.value.password),
							captcha: userForm.value.captcha,
						};

						const result = await resetPasswordUser(params);

						if (result.code === Constants.status.SUCCESS) {
							await store.dispatch('user/updateUser', userForm.value.id);
							ElMessage.success(result.msg || '密码修改成功');
							userForm.value.password = '';
							userForm.value.captcha = '';
							isDisabled.value = true;
						} else {
							ElMessage.error(result.msg || '修改失败');
						}
					} catch (error) {
						ElMessage.error('密码修改失败: ' + error.message || '服务异常');
					} finally {
						loading.value = false;
						updateCaptchaCode();
					}
				} else {
					ElMessage.warning('请正确填写所有必填项');
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
			checkUserValue,
			updateCaptchaCode,
			submitForm,
		};
	},
};
</script>

<style lang="scss" scoped>
.password-reset-module {
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

			.form-tips {
				font-size: 12px;
				color: #86909c;
				margin-top: 4px;
				line-height: 1.4;
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
