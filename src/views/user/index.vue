<!--
 * @Author: bugdr
 * @Date: 2022-03-27 11:45:29
 * @LastEditors: bugdr
 * @LastEditTime: 2022-06-07 23:20:56
 * @FilePath: \educational-reformp-project\src\views\user\index.vue
 * @Description: 
-->
<template>
	<div class="user-center-container">
		<div class="user-center-content">
			<div class="profile-card">
				<div class="avatar-section">
					<div class="avatar">{{ userInitial }}</div>
					<div class="user-meta">
						<h3 class="username">{{ userInfo.user_name }}</h3>
						<p class="user-id">ID: {{ userInfo.id }}</p>
					</div>
				</div>
				<div class="user-roles" v-if="userInfo.roles">
					<el-tag type="success" effect="dark" size="small">{{ userInfo.roles }}</el-tag>
				</div>
			</div>

			<div class="tabs-section">
				<el-tabs v-model="activeTab" class="user-tabs">
					<el-tab-pane
						v-for="item in navItems"
						:key="item.path"
						:label="item.name"
						:name="item.path"
					>
						<template #label>
							<span class="tab-label">
								<i class="iconfont" :class="item.icon"></i>
								<span>{{ item.name }}</span>
							</span>
						</template>
					</el-tab-pane>
				</el-tabs>

				<div class="tab-content">
					<!-- 用户信息 -->
					<UserInfo v-if="activeTab === 'user-info'" />
					<!-- 信息修改 -->
					<UserUpdate v-if="activeTab === 'user-update'" />
					<!-- 重置邮箱 -->
					<UserResetEmail v-if="activeTab === 'user-reset-email'" />
					<!-- 重置密码 -->
					<UserResetPassword v-if="activeTab === 'user-reset-password'" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { User } from "@element-plus/icons-vue";
import { navItems } from "@/json/navItems";
import UserInfo from "./user-info/index.vue";
import UserUpdate from "./user-update/index.vue";
import UserResetEmail from "./user-reset-email/index.vue";
import UserResetPassword from "./user-reset-password/index.vue";

export default {
	name: "UserCenter",

	components: {
		User,
		UserInfo,
		UserUpdate,
		UserResetEmail,
		UserResetPassword,
	},

	setup() {
		const store = useStore();

		const userInfo = computed(() => store.getters["user/userInfo"]);
		const userInitial = computed(() => {
			if (userInfo.value && userInfo.value.user_name) {
				return userInfo.value.user_name.charAt(0).toUpperCase();
			}
			return "U";
		});

		// 默认活动标签
		const activeTab = ref("user-info");

		return {
			userInfo,
			userInitial,
			navItems,
			activeTab,
		};
	},
};
</script>

<style lang="scss" scoped>
.user-center-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: #f5f7fa;
	border-radius: 8px;
}
.user-center-content {
	max-width: 1200px;
	margin: 0 auto;
	padding: 12px;
	width: 100%;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	gap: 12px;

	.profile-card {
		background-color: white;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;

		.avatar-section {
			display: flex;
			align-items: center;

			.avatar {
				width: 56px;
				height: 56px;
				border-radius: 50%;
				background-color: #155bd4;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				font-size: 22px;
				font-weight: 600;
				margin-right: 16px;
				box-shadow: 0 2px 8px rgba(21, 91, 212, 0.3);
			}

			.user-meta {
				.username {
					font-size: 18px;
					margin: 0 0 4px;
					font-weight: 600;
					color: #1d2129;
				}

				.user-id {
					font-size: 14px;
					color: #86909c;
					margin: 0;
				}
			}
		}
	}

	.tabs-section {
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		.user-tabs {
			padding: 0 16px;

			:deep(.el-tabs__header) {
				margin-bottom: 0;
				border-bottom-color: #e5e6eb;
			}

			:deep(.el-tabs__item) {
				padding: 0 20px;
				height: 48px;
				line-height: 48px;
				font-weight: 500;

				&.is-active {
					color: #155bd4;
				}

				&:hover {
					color: #155bd4;
				}
			}

			.tab-label {
				display: flex;
				align-items: center;

				.iconfont {
					margin-right: 8px;
					font-size: 16px;
				}
			}
		}

		.tab-content {
			padding: 20px;
			flex-grow: 1;
			background-color: #ffffff;
		}
	}
}

@media (max-width: 768px) {
	.user-center-content {
		padding: 12px;
		gap: 12px;

		.profile-card {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
			padding: 16px;

			.user-roles {
				align-self: flex-start;
			}
		}

		.tabs-section {
			.user-tabs {
				padding: 0 8px;

				:deep(.el-tabs__item) {
					padding: 0 12px;
					height: 40px;
					line-height: 40px;
				}
			}

			.tab-content {
				padding: 16px;
			}
		}
	}
}
</style>
