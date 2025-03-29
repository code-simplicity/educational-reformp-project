<template>
	<div class="user-info-module">
		<el-card shadow="hover" class="info-card">
			<template #header>
				<div class="card-header">
					<span>基本信息</span>
				</div>
			</template>

			<el-form
				ref="userFormRef"
				:model="userForm"
				label-position="right"
				label-width="80px"
				class="info-form"
			>
				<el-form-item label="学号">
					<el-input v-model="userForm.id" disabled></el-input>
				</el-form-item>

				<el-form-item label="姓名">
					<el-input v-model="userForm.user_name" disabled></el-input>
				</el-form-item>

				<el-form-item label="性别">
					<el-tag
						:type="userInfo.sex === '男' ? 'primary' : 'danger'"
						size="default"
					>
						{{ userInfo.sex }}
					</el-tag>
				</el-form-item>

				<el-form-item label="邮箱">
					<div class="email-display">
						<el-icon><Message /></el-icon>
						<span>{{ userInfo.email }}</span>
					</div>
				</el-form-item>
			</el-form>

			<div class="info-footer">
				<el-alert
					title="这里展示您的个人信息，若需修改请使用其他功能页面"
					type="info"
					:closable="false"
					show-icon
				/>
			</div>
		</el-card>
	</div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { Message } from '@element-plus/icons-vue';

export default {
	name: 'UserInfo',
	components: { Message },
	setup() {
		const store = useStore();
		const userForm = ref({
			id: '',
			user_name: '',
			sex: '',
			email: '',
		});

		// 获取用户信息
		const userInfo = computed(() => store.getters['user/userInfo']);

		// 使用新对象，避免引用问题
		userForm.value = { ...userInfo.value };

		return {
			userForm,
			userInfo,
		};
	},
};
</script>

<style lang="scss" scoped>
.user-info-module {
	width: 100%;

	.info-card {
		border-radius: 8px;
		background-color: #fff;

		.card-header {
			display: flex;
			align-items: center;
			font-size: 16px;
			font-weight: 500;
			color: #1d2129;
		}

		.info-form {
			padding: 10px 0;

			.el-form-item {
				margin-bottom: 20px;
			}

			.email-display {
				display: flex;
				align-items: center;
				color: #155bd4;

				.el-icon {
					margin-right: 6px;
					font-size: 16px;
				}
			}
		}

		.info-footer {
			margin-top: 20px;
		}
	}
}
</style>
