<template>
	<div class="user-info">
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
				<el-form-item label="邮箱" prop="email">
					<el-row :gutter="24">
						<el-col :span="16">
							<el-input
								v-model="userForm.email"
								placeholder="请输入邮箱"
								@input="checkEmailValue"
								clearable
							></el-input>
						</el-col>
						<el-col :span="2">
							<el-button
								:disabled="isEmailText"
								type="success"
								@click="sendEmailCode"
								>{{ emailTextBtn }}</el-button
							>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="邮箱验证码" prop="emailCode">
					<el-input
						v-model="userForm.emailCode"
						placeholder="请输入邮箱验证码"
						@input="checkUserValue"
						clearable
					></el-input>
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
import {
	sendCaptcha,
	sendMailCode,
	resetEmailUser,
} from "../../../api/service/user";
import Constants from "@/utils/Constants";
import { ElMessage } from "element-plus";
// import { Message } from "@element-plus/icons-vue";
const store = useStore();
const userFormRef = ref(null);
let userForm = ref({
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
			message: "邮箱不可以为空",
			trigger: "blur",
		},
	],
	emailCode: [
		{
			required: true,
			message: "邮箱验证码不可以为空",
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

const emailTextBtn = ref("发送验证码");
const isEmailText = ref(true);
// 验证邮箱
const checkEmailValue = () => {
	if (userForm.value.email !== "") {
		isEmailText.value = false;
	}
};
// 60s倒计时
const countDown = () => {
	let time = 60;
	const sendTime = setInterval(() => {
		time--;
		if (time < 0) {
			clearInterval(sendTime);
			emailTextBtn.value = "获取验证码";
			isEmailText.value = false;
		} else {
			// 重新发送
			emailTextBtn.value = `重新发送（${time}）`;
		}
	}, 1000);
};
// 发送邮箱验证码
const sendEmailCode = async () => {
	const params = {
		emailAddress: userForm.value.email,
	};
	// 发送验证码
	const result = await sendMailCode(params);
	if (result.code === Constants.status.SUCCESS) {
		ElMessage.success(result.msg);
		// 禁止发送按钮
		isEmailText.value = true;
		// 邮箱验证码发送成功
		countDown();
	} else {
		ElMessage.error(result.msg);
	}
};
// 函数调用
updateCaptchaCode();
// 提交表单
// 首先就是验证码用户名，性别，图灵验证码是否填写，不填写的话，按钮控制为不可选
const isDisabled = ref(true); // 默认禁用
const checkUserValue = () => {
	if (
		userForm.value.email !== "" &&
		userForm.value.emailCode !== "" &&
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
	await formEl.validate(async (valid) => {
		if (valid) {
			// 验证
			const params = {
				id: userForm.value.id,
				email: userForm.value.email,
				emailCode: userForm.value.emailCode,
				captcha: userForm.value.captcha,
			};
			const result = await resetEmailUser(params);
			if (result.code === Constants.status.SUCCESS) {
				// 之后对用户信息进行获取
				store.dispatch("user/updateUser", userForm.value.id);
				ElMessage.success(result.msg);
				updateCaptchaCode();
			} else {
				ElMessage.error(result.msg);
				updateCaptchaCode();
			}
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
