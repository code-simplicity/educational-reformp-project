<template>
	<div class="user-info-box">
		<div class="container">
			<el-form
				ref="userFormRef"
				:model="userForm"
				:rules="userRules"
				label-position="right"
				label-width="100px"
				style="max-width: 460px"
				label-suffix=":"
			>
				<el-form-item label="学号" prop="id">
					<el-input v-model="userForm.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input
						v-model="userForm.password"
						placeholder="请输入密码"
						@input="checkUserValue"
						type="password"
						clearable
					></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="captcha">
					<el-row :gutter="24">
						<el-col :span="12">
							<el-input
								v-model="userForm.captcha"
								placeholder="请输入图灵验证码"
								@input="checkUserValue"
								clearable
							></el-input
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
			</el-form>
		</div>
		<div class="user-footer">
			<el-button
				:disabled="isDisabled"
				type="primary"
				@click="submitForm(userFormRef)"
				>确定</el-button
			>
		</div>
	</div>
</template>
<script setup>
import { computed, ref, reactive } from "vue";
import { useStore } from "vuex";
import { sendCaptcha, resetPasswordUser } from "../../../api/service/user";
import Constants from "@/utils/Constants";
import { ElMessage } from "element-plus";
import SparkMD5 from "spark-md5";
const store = useStore();
const userFormRef = ref(null);
let userForm = ref({
	id: "",
	password: "",
	captcha: "",
});
// 验证规则
const userRules = reactive({
	password: [
		{
			required: true,
			message: "邮箱不可以为空",
			trigger: "blur",
		},
	],
	captcha: [
		{
			required: true,
			message: "请输入图灵验证码",
			trigger: "blur",
		},
	],
});
// 获取用户信息
const userInfo = computed(() => store.state.user.userInfo);
userForm.value = JSON.parse(JSON.stringify(userInfo.value));
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
// 提交表单
// 首先就是验证码用户名，性别，图灵验证码是否填写，不填写的话，按钮控制为不可选
const isDisabled = ref(true); // 默认禁用
const checkUserValue = () => {
	if (userForm.value.password !== "" && userForm.value.captcha !== "") {
		isDisabled.value = false;
	}
};
const submitForm = async (formEl) => {
	if (!formEl) {
		isDisabled.value = true;
		return;
	}
	await formEl.validate(async (valid) => {
		if (valid) {
			// 验证
			const params = {
				id: userForm.value.id,
				password: SparkMD5.hash(userForm.value.password),
				captcha: userForm.value.captcha,
			};
			const result = await resetPasswordUser(params);
			if (result.code === Constants.status.SUCCESS) {
				// 之后对用户信息进行获取
				store.dispatch("user/updateUser", userForm.value.id);
				ElMessage.success(result.msg);
			} else {
				ElMessage.error(result.msg);
			}
			updateCaptchaCode();
		}
	});
};
</script>
<style lang="scss" scoped>
.user-info-box {
	box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
	padding: 16px 40px;
	position: relative;
	display: flex;
	flex-direction: column;
	background: rgb(188, 188, 188);

	.container {
		margin-bottom: 16px;
		::v-deep .el-form-item__label {
		}
	}
	.user-footer {
		display: flex;
		justify-content: flex-end;
	}
}
</style>
