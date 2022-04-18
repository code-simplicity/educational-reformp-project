<template>
	<div class="user-register animate__animated animate__zoomInDown">
		<div class="user-container">
			<h1 class="title">用户注册</h1>
			<div class="user-form">
				<el-form
					ref="userFormRef"
					:rules="rulesForm"
					label-width="120px"
					:model="userForm"
					label-suffix=":"
				>
					<el-row :gutter="12">
						<el-col :span="12">
							<el-form-item label="学号" prop="id">
								<el-input
									v-model="userForm.id"
									placeholder="请输入学号"
									clearable
									@blur="checkValue"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="用户名" prop="user_name">
								<el-input
									v-model="userForm.user_name"
									placeholder="请输入用户名"
									clearable
									@blur="checkValue"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="12">
						<el-col :span="12">
							<el-form-item label="密码" prop="password">
								<el-input
									v-model="userForm.password"
									placeholder="请输入密码"
									type="password"
									@blur="checkValue"
									show-password
									clearable
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="性别" prop="sex">
								<el-select
									v-model="userForm.sex"
									placeholder="请选择性别"
									clearable
									@blur="checkValue"
								>
									<el-option label="男" value="男" />
									<el-option label="女" value="女" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="12">
						<el-col :span="12">
							<el-form-item label="邮箱" prop="email">
								<el-row :gutter="12">
									<el-col :span="14">
										<el-input
											v-model="userForm.email"
											placeholder="请输入邮箱吧"
											clearable
											@blur="checkEmailValue"
										></el-input>
									</el-col>
									<el-col :span="10">
										<el-button
											:disabled="isEmailText"
											type="primary"
											@click="sendEmailCode"
											>{{ sendEmailTxtBtn }}</el-button
										>
									</el-col>
								</el-row>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="邮箱验证码" prop="emailCode">
								<el-input
									v-model="userForm.emailCode"
									placeholder="请输入邮箱验证码"
									@blur="checkValue"
									clearable
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="图灵验证码" prop="captcha">
						<el-row :gutter="6">
							<el-col :span="13">
								<el-input
									v-model="userForm.captcha"
									placeholder="请输入图灵验证码"
									@blur="checkValue"
									clearable
								></el-input>
							</el-col>
							<el-col :span="10">
								<div v-html="captchaUrl" @click="updateCaptchaCode"></div>
							</el-col>
						</el-row>
					</el-form-item>
				</el-form>
			</div>
			<div class="user-footer">
				<span class="do-login" @click="doLogin">存在账户,直接登录</span>

				<el-button
					:disabled="isRegisterBtn"
					type="success"
					@click="submitForm(userForm)"
					>注册</el-button
				>
			</div>
		</div>
		<div class="diolog">
			<el-dialog v-model="dialogVisible" title="确定返回登录页面" width="20%">
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogVisible = false">取消</el-button>
						<el-button type="primary" @click="backLogin">确定</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { sendCaptcha, addUser, sendMailCode } from "@/api/service/user";
import Constants from "@/utils/Constants.js";
import { ElMessage } from "element-plus";
import SparkMD5 from "spark-md5";

const router = useRouter();
const userForm = reactive({
	id: "",
	user_name: "",
	password: "",
	sex: "",
	email: "",
	emailCode: "",
	captcha: "",
});

const rulesForm = reactive({
	id: [{ required: true, message: "请输入学号", trigger: "blur" }],
	user_name: [
		{
			required: true,
			message: "请输入密码",
			trigger: "blur",
		},
	],
	password: [
		{
			required: true,
			message: "请输入验证码",
			trigger: "blur",
		},
	],
	sex: [
		{
			required: true,
			message: "请输入验证码",
			trigger: "blur",
		},
	],
	email: [
		{
			required: true,
			message: "请输入验证码",
			trigger: "blur",
		},
	],
	emailCode: [
		{
			required: true,
			message: "请输入验证码",
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

// 验证码
const captchaUrl = ref(null);
const updateCaptchaCode = async () => {
	const data = await sendCaptcha();
	captchaUrl.value = data;
};
updateCaptchaCode();

// 去登录
const doLogin = () => {
	router.push({
		name: "login",
	});
};
const sendEmailTxtBtn = ref("发送验证码");
const isEmailText = ref(true);
// 检验邮箱是否输入成功
const checkEmailValue = () => {
	if (userForm.email !== "") {
		isEmailText.value = false;
	}
};
// 倒计时
const countDown = () => {
	let time = 60;
	const sendTime = setInterval(() => {
		time--;
		if (time < 0) {
			clearInterval(sendTime);
			sendEmailTxtBtn.value = `发送验证码`;
			isEmailText.value = false;
		} else {
			sendEmailTxtBtn.value = `${time}s`;
			isEmailText.value = true;
		}
	}, 1000);
};
// 发送邮箱验证码
const sendEmailCode = async () => {
	const params = {
		emailAddress: userForm.email,
	};
	const result = await sendMailCode(params);
	if (result.code === Constants.status.SUCCESS) {
		ElMessage.success(result.msg);
		countDown();
	} else {
		ElMessage.error(result.msg);
	}
};
// 检查表单是否提交完成,
const isRegisterBtn = ref(true);
const checkValue = () => {
	if (
		userForm.id !== "" &&
		userForm.user_name !== "" &&
		userForm.password !== "" &&
		userForm.sex !== "" &&
		userForm.email !== "" &&
		userForm.emailCode !== "" &&
		userForm.captcha !== ""
	) {
		isRegisterBtn.value = false;
	}
};
// 确定是否返回到登录页进行登录
const dialogVisible = ref(false);
const backLogin = () => {
	// 去登录页面
	doLogin();
};
// 提交表单
const submitForm = async (formEl) => {
	if (!formEl) {
		return;
	}
	const params = {
		id: userForm.id,
		user_name: userForm.user_name,
		password: SparkMD5.hash(userForm.password),
		sex: userForm.sex,
		email: userForm.email,
		emailCode: userForm.emailCode,
		captcha: userForm.captcha,
	};
	const result = await addUser(params);
	// 注册成功之后，询问是否返回到登录界面
	if (result.code === Constants.status.SUCCESS) {
		ElMessage.success(result.msg);
		// 弹窗出现
		dialogVisible.value = true;
		updateCaptchaCode();
	} else {
		ElMessage.error(result.msg);
		updateCaptchaCode();
	}
};
</script>
<style lang="scss" scoped>
.user-register {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 100%;
	height: 100%;

	.user-container {
		box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
		padding: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		.title {
			margin-bottom: 16px;
			color: #fff;
		}
		.user-form {
			padding: 16px;
			:v-deep .el-form-item__label {
				color: #fff;
			}
			.el-select {
				display: inline-block;
				position: relative;
				line-height: 32px;
				width: 100%;
			}
		}
		.user-footer {
			.do-login {
				font-size: 0.9rem;
				margin-right: 26px;
				color: #ff0000;
				cursor: pointer;
				&:hover {
					color: #0075fa;
				}
			}
		}
	}
}
</style>
