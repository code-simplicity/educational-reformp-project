<template>
	<div class="user-info">
		<div class="container">
			<el-form
				ref="userFormRef"
				:model="userForm"
				:rules="userRules"
				label-position="right"
				label-width="80px"
				style="max-width: 460px"
				label-suffix=":"
			>
				<el-form-item label="学号" prop="id">
					<el-input v-model="userForm.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="user_name"
					><el-input
						v-model="userForm.user_name"
						placeholder="请输入姓名"
						@input="checkUserValue"
						clearable
					></el-input
				></el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="userForm.sex">
						<el-radio label="1">男</el-radio>
						<el-radio label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="验证码" prop="captcha">
					<el-row :gutter="24">
						<el-col :span="16">
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
import { sendCaptcha } from "../../../api/service/user";

const store = useStore();
const userFormRef = ref(null);
let userForm = ref({
	id: "",
	user_name: "",
	sex: "",
	captcha: "",
});
// 验证规则
const userRules = reactive({
	id: [
		{
			message: "学号不可以为空",
			trigger: "blur",
		},
	],
	user_name: [
		{
			required: true,
			message: "用户名不可以为空",
			trigger: "blur",
		},
	],
	sex: [
		{
			required: true,
			message: "请选择性别",
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
	if (
		userForm.value.user_name !== "" &&
		userForm.value.sex !== "" &&
		userForm.value.captcha !== ""
	) {
		isDisabled.value = false;
	}
};
const submitForm = async (formEl) => {
	if (!formEl) {
		isDisabled.value = true;
		return;
	}
	await formEl.validate((valid) => {
		if (valid) {
			// 验证登录
			const params = {
				id: userForm.value.id,
				user_name: userForm.value.user_name,
				sex: userForm.value.sex,
				captcha: userForm.value.captcha,
			};
			store.dispatch("user/updateUser", params).then(() => {
				updateCaptchaCode();
			});
		}
	});
};
</script>
<style lang="scss" scope>
.user-info {
	background: #ffffff;
	padding: 16px 40px;
	position: relative;
	display: flex;
	flex-direction: column;
	.container {
		margin-bottom: 16px;
	}
	.user-footer {
		display: flex;
		justify-content: flex-end;
	}
}
</style>
