<template>
	<div class="user-info flex flex-center">
		<div class="user-card flex flex-column border-radius">
			<div class="container">
				<el-form
					ref="userFormRef"
					:model="userForm"
					label-position="left"
					label-width="60px"
					style="max-width: 460px"
					label-suffix=":"
				>
					<el-form-item label="学号">
						<el-input
							v-model="userForm.id"
							placeholder="学号"
							disabled
						></el-input>
					</el-form-item>
					<el-form-item label="姓名"
						><el-input
							v-model="userForm.user_name"
							placeholder="姓名"
						></el-input
					></el-form-item>
					<el-form-item label="性别">
						<el-radio
							v-model="userForm.sex"
							:label="userForm.sex"
							size="large"
						></el-radio>
					</el-form-item>
					<el-form-item label="邮箱">
						<template #default>
							<el-row>
								<el-col :span="16" class="email-style">{{
									userForm.email
								}}</el-col>
								<el-col :span="8">
									<el-button type="primary">修改邮箱</el-button>
								</el-col>
							</el-row>
						</template>
					</el-form-item>
				</el-form>
			</div>
			<div class="user-footer">
				<div class="left">
					<el-button type="primary" plain @click="toHome">返回首页</el-button>
				</div>
				<div class="right">
					<el-button type="info" plain>修改信息</el-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import {
// 	Document,
// 	Menu as IconMenu,
// 	Location,
// 	Setting,
// } from "@element-plus/icons-vue";
const store = useStore();
const router = useRouter();
const userForm = ref({
	id: "",
	user_name: "",
	sex: "",
	email: "",
});
// 获取用户信息
const userInfo = computed(() => store.getters["user/userInfo"]);
userForm.value = userInfo.value;

// 返回首页
const toHome = () => {
	router.push({
		name: "home",
	});
};
</script>
<style lang="scss" scope>
.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 200px;
}
.user-info {
	padding: 20px;
	.user-nav {
		margin-right: 40px;
	}
	.user-card {
		background: #e7e7e7;
		padding: 20px 60px;
		position: relative;
		box-shadow: 10px 5px 5px rgb(5, 5, 5);
		.container {
			width: 400px;
			padding: 0 16px;
			.email-style {
				font-size: 20px;
				font-weight: 600;
			}
		}
		.user-footer {
			margin-top: 40px;
			.left {
				position: absolute;
				left: 76px;
				bottom: 20px;
			}
			.right {
				position: absolute;
				right: 76px;
				bottom: 20px;
			}
		}
	}
}
</style>
