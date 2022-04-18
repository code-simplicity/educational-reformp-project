<template>
	<div class="user-info-box flex">
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
					<el-input v-model="userForm.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="姓名"
					><el-input v-model="userForm.user_name" disabled></el-input
				></el-form-item>
				<el-form-item label="性别">
					<h2>{{ userInfo.sex }}</h2>
				</el-form-item>
				<el-form-item label="邮箱">
					<h2>{{ userInfo.email }}</h2>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const userForm = ref({
	id: "",
	user_name: "",
	sex: "",
	email: "",
});
// 获取用户信息
const userInfo = computed(() => store.getters["user/userInfo"]);
userForm.value = userInfo.value;
</script>
<style lang="scss" scoped>
.user-info-box {
	box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
	padding: 16px 40px;
	position: relative;
	color: #fff;
	.container {
		:v-deep .el-form-item__label {
			color: #fff;
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
