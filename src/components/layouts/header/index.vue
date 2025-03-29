<template>
	<header class="header" :class="{ 'header-scrolled': scrolled }">
		<div class="header-container">
			<div class="header-left">
				<img :src="logo" alt="Logo" class="logo" />
				<h1 class="title">水运工程仿真实验系统</h1>
			</div>

			<nav class="header-nav">
				<router-link
					v-for="route in navRoutes"
					:key="route.path"
					:to="route.path"
					class="nav-item"
					:class="{ active: isActive(route.path) }"
				>
					<i v-if="route.icon" :class="route.icon"></i>
					{{ route.name }}
				</router-link>
			</nav>

			<div class="header-right">
				<template v-if="isLoggedIn">
					<div class="user-info" @click="toggleUserMenu">
						<img :src="avatar" alt="用户头像" class="avatar" />
						<span class="username">{{ username }}</span>
						<i class="arrow-down"></i>

						<!-- 用户下拉菜单 -->
						<div class="user-dropdown" v-show="showUserMenu">
							<router-link to="/user/user-info" class="dropdown-item">
								<i class="user-icon"></i> 个人中心
							</router-link>
							<router-link to="/user/user-update" class="dropdown-item">
								<i class="settings-icon"></i> 修改信息
							</router-link>
							<div class="dropdown-divider"></div>
							<a @click="handleLogout" class="dropdown-item logout">
								<i class="logout-icon"></i> 退出登录
							</a>
						</div>
					</div>
				</template>
				<template v-else>
					<router-link to="/login" class="login-btn">登录</router-link>
					<router-link to="/register" class="register-btn">注册</router-link>
				</template>
			</div>
		</div>
	</header>
</template>

<script>
import logo from '@/assets/logo.png';
import defaultAvatar from '@/assets/default-avatar.png';

export default {
	name: 'HeaderComponent',
	data() {
		return {
			logo,
			scrolled: false,
			showUserMenu: false,
			isLoggedIn: false, // 实际项目中应从 store 获取
			username: '用户名',
			avatar: defaultAvatar,
			navRoutes: [
				{ name: '首页', path: '/home', icon: 'home-icon' },
				{ name: '工程场景', path: '/minato-route', icon: 'engineering-icon' },
				{ name: '工况选配', path: '/project-route', icon: 'conditions-icon' },
				{ name: '测点数据', path: '/measure-point-route', icon: 'data-icon' },
			],
		};
	},
	mounted() {
		window.addEventListener('scroll', this.handleScroll);
		document.addEventListener('click', this.handleOutsideClick);
	},
	beforeUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
		document.removeEventListener('click', this.handleOutsideClick);
	},
	methods: {
		handleScroll() {
			this.scrolled = window.scrollY > 10;
		},
		isActive(path) {
			return this.$route.path === path;
		},
		toggleUserMenu() {
			this.showUserMenu = !this.showUserMenu;
		},
		handleOutsideClick(event) {
			const userInfo = this.$el.querySelector('.user-info');
			if (userInfo && !userInfo.contains(event.target)) {
				this.showUserMenu = false;
			}
		},
		handleLogout() {
			// 实现登出逻辑
			console.log('Logout');
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
	height: 64px;
	background-color: #fff;
	transition: all 0.3s ease;
	z-index: 1000;

	&-scrolled {
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
	}

	&-container {
		max-width: 1200px;
		margin: 0 auto;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 24px;
	}

	&-left {
		display: flex;
		align-items: center;
		gap: 12px;

		.logo {
			height: 36px;
			width: auto;
		}

		.title {
			font-size: 1.25rem;
			font-weight: 600;
			color: #2d3748;
			white-space: nowrap;
		}
	}

	&-nav {
		display: flex;
		gap: 8px;

		.nav-item {
			padding: 8px 16px;
			color: #4a5568;
			text-decoration: none;
			border-radius: 4px;
			transition: all 0.3s ease;
			font-weight: 500;

			i {
				margin-right: 4px;
			}

			&:hover {
				color: #3182ce;
				background-color: #ebf8ff;
			}

			&.active {
				color: #3182ce;
				background-color: #ebf8ff;
				font-weight: 600;
			}
		}
	}

	&-right {
		display: flex;
		align-items: center;
		gap: 16px;

		.user-info {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 4px 12px;
			border-radius: 30px;
			cursor: pointer;
			position: relative;

			&:hover {
				background-color: #f7fafc;
			}

			.avatar {
				width: 32px;
				height: 32px;
				border-radius: 50%;
				object-fit: cover;
			}

			.username {
				font-weight: 500;
				color: #4a5568;
			}

			.arrow-down {
				margin-left: 4px;
				border: solid #718096;
				border-width: 0 2px 2px 0;
				display: inline-block;
				padding: 2px;
				transform: rotate(45deg);
			}

			.user-dropdown {
				position: absolute;
				top: calc(100% + 8px);
				right: 0;
				width: 200px;
				background-color: white;
				border-radius: 4px;
				box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
					0 4px 6px -2px rgba(0, 0, 0, 0.05);
				overflow: hidden;
				z-index: 10;

				.dropdown-item {
					display: flex;
					align-items: center;
					gap: 8px;
					padding: 12px 16px;
					color: #4a5568;
					text-decoration: none;
					transition: background-color 0.2s;

					&:hover {
						background-color: #f7fafc;
					}

					&.logout {
						color: #e53e3e;
					}
				}

				.dropdown-divider {
					height: 1px;
					background-color: #e2e8f0;
					margin: 4px 0;
				}
			}
		}

		.login-btn,
		.register-btn {
			padding: 8px 16px;
			border-radius: 4px;
			font-weight: 500;
			text-decoration: none;
			transition: all 0.3s ease;
		}

		.login-btn {
			color: #3182ce;

			&:hover {
				background-color: #ebf8ff;
			}
		}

		.register-btn {
			background-color: #3182ce;
			color: white;

			&:hover {
				background-color: #2b6cb0;
			}
		}
	}
}

// 响应式设计
@media (max-width: 1024px) {
	.header {
		&-container {
			padding: 0 16px;
		}

		&-left {
			.title {
				font-size: 1rem;
			}
		}

		&-nav {
			.nav-item {
				padding: 8px 12px;
			}
		}
	}
}

@media (max-width: 768px) {
	.header {
		&-left {
			.title {
				display: none;
			}
		}

		&-nav {
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;

			&::-webkit-scrollbar {
				display: none;
			}

			.nav-item {
				white-space: nowrap;
			}
		}

		&-right {
			.register-btn {
				display: none;
			}
		}
	}
}
</style>
