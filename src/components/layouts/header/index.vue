<template>
	<header class="header" :class="{ 'header-scrolled': scrolled }">
		<div class="header-container">
			<div class="header-brand">
				<router-link to="/home" class="logo-link">
					<img :src="logo" alt="Logo" class="logo" />
					<h1 class="title">水运工程仿真实验系统</h1>
				</router-link>
			</div>

			<div class="header-actions">
				<nav class="nav-links" v-if="!isMobile">
					<router-link
						v-for="item in homeItem"
						:key="item.path"
						:to="{ path: item.path }"
						class="nav-link"
						:class="{ active: $route.path.includes(item.path) }"
					>
						<el-icon>
							<component :is="getIconForPath(item.path)" />
						</el-icon>
						<span>{{ item.name }}</span>
					</router-link>
				</nav>

				<div class="user-section" v-if="!isMobile">
					<template v-if="tokenData">
						<el-dropdown trigger="click" @command="handleCommand">
							<div class="user-info">
								<div class="avatar">{{ userInitial }}</div>
								<span class="username">{{ userInfo.user_name }}</span>
								<el-icon><CaretBottom /></el-icon>
							</div>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										v-if="userInfo.roles === 'admin'"
										command="toCenter"
										>管理中心</el-dropdown-item
									>
									<el-dropdown-item command="usersetting"
										>用户设置</el-dropdown-item
									>
									<el-dropdown-item divided command="logout"
										>退出登录</el-dropdown-item
									>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
					<router-link v-else to="/login" class="login-link">登录</router-link>
				</div>

				<div
					class="mobile-toggle"
					v-if="isMobile"
					@click="drawerVisible = true"
				>
					<el-icon size="22"><Menu /></el-icon>
				</div>
			</div>
		</div>

		<el-drawer
			v-model="drawerVisible"
			direction="ltr"
			size="80%"
			:show-close="false"
			destroy-on-close
			custom-class="mobile-drawer"
		>
			<div class="drawer-inner">
				<div class="drawer-header">
					<template v-if="tokenData">
						<div class="mobile-user-info">
							<div class="avatar">{{ userInitial }}</div>
							<div class="user-details">
								<div class="username">{{ userInfo.user_name }}</div>
							</div>
						</div>
					</template>
					<router-link
						v-else
						to="/login"
						class="mobile-login-link-compact"
						@click="drawerVisible = false"
					>
						登录
					</router-link>
					<div class="close-button" @click="drawerVisible = false">
						<el-icon><Close /></el-icon>
					</div>
				</div>

				<div class="drawer-content">
					<div class="mobile-nav-section">
						<div class="section-title">菜单导航</div>
						<div class="mobile-nav-links">
							<router-link
								v-for="item in homeItem"
								:key="item.path"
								:to="{ path: item.path }"
								class="mobile-nav-link"
								:class="{ active: $route.path.includes(item.path) }"
								@click="drawerVisible = false"
							>
								<el-icon>
									<component :is="getIconForPath(item.path)" />
								</el-icon>
								<span>{{ item.name }}</span>
							</router-link>
						</div>
					</div>

					<template v-if="tokenData">
						<div class="mobile-nav-section user-actions-section">
							<div class="section-title">用户操作</div>
							<div class="mobile-nav-links">
								<div
									class="mobile-nav-link"
									@click="handleCommand('usersetting')"
								>
									<el-icon><User /></el-icon>
									<span>用户设置</span>
								</div>
								<div
									v-if="userInfo.roles === 'admin'"
									class="mobile-nav-link"
									@click="handleCommand('toCenter')"
								>
									<el-icon><SetUp /></el-icon>
									<span>管理中心</span>
								</div>
								<div
									class="mobile-nav-link logout"
									@click="handleCommand('logout')"
								>
									<el-icon><SwitchButton /></el-icon>
									<span>退出登录</span>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>
		</el-drawer>
	</header>
</template>

<script>
import {
	CaretBottom,
	Menu,
	Close,
	House,
	Monitor,
	Setting,
	DataLine,
	User,
	SetUp,
	SwitchButton,
} from '@element-plus/icons-vue';
import { mapGetters } from 'vuex';
import { homeItem } from '@/json/homeItem';
import logo from '@/assets/logo.png';

export default {
	name: 'HeaderComponent',
	components: {
		CaretBottom,
		Menu,
		Close,
		House,
		Monitor,
		Setting,
		DataLine,
		User,
		SetUp,
		SwitchButton,
	},
	data() {
		return {
			logo,
			scrolled: false,
			homeItem: homeItem,
			isMobile: false,
			drawerVisible: false,
			screenWidth: window.innerWidth,
		};
	},
	computed: {
		...mapGetters('user', {
			tokenData: 'tokenData',
			userInfo: 'userInfo',
		}),
		userInitial() {
			if (this.userInfo && this.userInfo.user_name) {
				return this.userInfo.user_name.charAt(0).toUpperCase();
			}
			return 'U';
		},
	},
	mounted() {
		window.addEventListener('scroll', this.handleScroll);
		window.addEventListener('resize', this.handleResize);
		this.handleResize(); // 初始化时执行一次

		// 通知 main 内容调整上边距
		this.$nextTick(() => {
			document.documentElement.style.setProperty('--header-height', '54px');
		});
	},
	beforeUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
		window.removeEventListener('resize', this.handleResize);
	},
	methods: {
		handleScroll() {
			this.scrolled = window.scrollY > 10;
		},
		handleResize() {
			this.screenWidth = window.innerWidth;
			this.isMobile = this.screenWidth < 992;

			if (!this.isMobile) {
				this.drawerVisible = false;
			}
		},
		handleCloseDrawer(done) {
			done();
		},
		handleCommand(command) {
			if (this.isMobile) {
				this.drawerVisible = false;
			}

			switch (command) {
				case 'logout': {
					this.$store.dispatch('user/loginOut').then(() => {
						this.$router.replace({
							name: 'login',
						});
					});
					break;
				}
				case 'usersetting': {
					this.$router.push({
						name: 'user',
					});
					break;
				}
				case 'toCenter': {
					const url = 'http://106.13.233.140/admin/#/dashboard';
					window.open(url, '_blank');
					break;
				}
			}
		},
		getIconForPath(path) {
			// 根据路径返回对应的图标组件名
			const iconMap = {
				home: 'House',
				'minato-route': 'Monitor',
				'project-route': 'Setting',
				'measure-point-route': 'DataLine',
			};

			return iconMap[path] || 'Document'; // 默认返回 Document 图标
		},
	},
};
</script>

<style lang="scss" scoped>
.header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 54px;
	background-color: #fff;
	transition: all 0.3s ease;
	z-index: 1000;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

	&-scrolled {
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
	}

	&-container {
		max-width: 1400px;
		margin: 0 auto;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
	}

	&-brand {
		.logo-link {
			display: flex;
			align-items: center;
			text-decoration: none;
			gap: 12px;

			.logo {
				height: 28px;
				width: auto;
			}

			.title {
				font-size: 18px;
				font-weight: 600;
				color: #1d2129;
				white-space: nowrap;
			}
		}
	}

	&-actions {
		display: flex;
		align-items: center;
		gap: 24px;

		.nav-links {
			display: flex;
			gap: 8px;

			.nav-link {
				padding: 8px 16px;
				font-size: 14px;
				font-weight: 500;
				color: #1d2129;
				text-decoration: none;
				border-radius: 4px;
				transition: all 0.2s;
				display: flex;
				align-items: center;

				.el-icon {
					margin-right: 6px;
					font-size: 16px;
				}

				&:hover {
					color: #155bd4;
					background-color: rgba(22, 93, 255, 0.1);
				}

				&.active {
					color: #155bd4;
					background-color: rgba(22, 93, 255, 0.1);
				}
			}
		}

		.user-section {
			.user-info {
				display: flex;
				align-items: center;
				gap: 8px;
				cursor: pointer;
				padding: 4px 8px;
				border-radius: 4px;
				transition: all 0.2s;

				&:hover {
					background-color: #f2f3f5;
				}

				.avatar {
					width: 28px;
					height: 28px;
					border-radius: 50%;
					background-color: #155bd4;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #fff;
					font-size: 14px;
					font-weight: 500;
				}

				.username {
					font-size: 14px;
					color: #1d2129;
					max-width: 80px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.el-icon {
					font-size: 12px;
					color: #86909c;
				}
			}

			.login-link {
				padding: 6px 16px;
				background-color: #155bd4;
				color: white;
				font-size: 14px;
				border-radius: 4px;
				text-decoration: none;
				transition: background-color 0.2s;

				&:hover {
					background-color: #1050c1;
				}
			}
		}

		.mobile-toggle {
			cursor: pointer;
			color: #1d2129;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 36px;
			width: 36px;
			font-size: 22px;
		}
	}
}

:deep(.mobile-drawer) {
	.el-drawer__header {
		display: none !important;
	}

	.el-drawer__body {
		padding: 0;
		overflow: hidden;
	}

	.drawer-inner {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	.drawer-header {
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		background-color: #f7f8fa;
		border-bottom: 1px solid #e5e6eb;
		flex-shrink: 0;

		.mobile-user-info {
			display: flex;
			align-items: center;
			gap: 12px;

			.avatar {
				width: 36px;
				height: 36px;
				border-radius: 50%;
				background-color: #155bd4;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-weight: 500;
			}

			.user-details {
				.username {
					font-size: 15px;
					font-weight: 500;
					color: #1d2129;
				}
			}
		}

		.mobile-login-link-compact {
			padding: 6px 16px;
			background-color: #155bd4;
			color: white;
			font-size: 14px;
			border-radius: 4px;
			text-decoration: none;
		}

		.close-button {
			cursor: pointer;
			color: #86909c;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 36px;
			width: 36px;
			font-size: 22px;
		}
	}

	.drawer-content {
		padding: 16px;
		flex-grow: 1;
		overflow-y: auto;

		.mobile-nav-section {
			margin-bottom: 24px;

			&.user-actions-section {
				margin-top: 32px;
			}

			.section-title {
				font-size: 14px;
				color: #86909c;
				margin-bottom: 8px;
				padding: 0 16px;
			}

			.mobile-nav-links {
				display: flex;
				flex-direction: column;

				.mobile-nav-link {
					padding: 12px 16px;
					font-size: 15px;
					font-weight: 500;
					color: #1d2129;
					text-decoration: none;
					border-radius: 4px;
					transition: background-color 0.2s;
					display: flex;
					align-items: center;

					.el-icon {
						margin-right: 6px;
						font-size: 16px;
					}

					&:hover {
						background-color: #f2f3f5;
					}

					&.active {
						color: #155bd4;
						background-color: rgba(21, 91, 212, 0.1);
					}

					&.logout {
						color: #f53f3f;
					}
				}
			}
		}
	}
}

:deep(.el-dropdown-menu) {
	.el-dropdown-menu__item {
		font-size: 14px;
		padding: 8px 16px;
	}
}

@media (max-width: 992px) {
	.header {
		&-brand {
			.logo-link {
				.logo {
					height: 24px;
				}

				.title {
					font-size: 16px;
				}
			}
		}
	}
}
</style>
