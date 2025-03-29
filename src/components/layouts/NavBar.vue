<template>
	<nav class="navbar" :class="{ 'navbar-shadow': scrolled }">
		<div class="navbar-content">
			<div class="navbar-left">
				<router-link to="/" class="logo">
					<img src="@/assets/logo.png" alt="Logo" />
					<span class="logo-text">水运工程仿真实验系统</span>
				</router-link>
			</div>

			<!-- 桌面端导航菜单 -->
			<div class="navbar-menu" v-show="!isMobile">
				<router-link
					v-for="item in menuItems"
					:key="item.path"
					:to="item.path"
					class="nav-item"
				>
					{{ item.name }}
				</router-link>
			</div>

			<!-- 用户信息/登录按钮 -->
			<div class="navbar-right">
				<template v-if="isLoggedIn">
					<div class="user-info" @click="toggleUserMenu">
						<img :src="userAvatar" class="user-avatar" />
						<span class="user-name">{{ userName }}</span>
						<i class="fas fa-chevron-down"></i>
					</div>
					<!-- 用户下拉菜单 -->
					<div class="user-dropdown" v-show="showUserMenu">
						<router-link to="/profile" class="dropdown-item">
							<i class="fas fa-user"></i> 个人中心
						</router-link>
						<router-link to="/settings" class="dropdown-item">
							<i class="fas fa-cog"></i> 设置
						</router-link>
						<div class="dropdown-divider"></div>
						<a @click="handleLogout" class="dropdown-item text-danger">
							<i class="fas fa-sign-out-alt"></i> 退出登录
						</a>
					</div>
				</template>
				<template v-else>
					<router-link to="/login" class="btn btn-login">登录</router-link>
					<router-link to="/register" class="btn btn-register"
						>注册</router-link
					>
				</template>
			</div>

			<!-- 移动端菜单按钮 -->
			<div class="mobile-menu-btn" v-show="isMobile" @click="toggleMobileMenu">
				<i class="fas" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
			</div>
		</div>

		<!-- 移动端侧边菜单 -->
		<div class="mobile-menu" :class="{ 'menu-open': mobileMenuOpen }">
			<div class="mobile-menu-items">
				<router-link
					v-for="item in menuItems"
					:key="item.path"
					:to="item.path"
					class="mobile-nav-item"
					@click="closeMobileMenu"
				>
					{{ item.name }}
				</router-link>
			</div>
		</div>
	</nav>
</template>

<script>
// 在顶部引入图片
import userAvatarImg from '@/assets/default-avatar.png'

export default {
	name: 'NavBar',
	data() {
		return {
			scrolled: false,
			isMobile: false,
			mobileMenuOpen: false,
			showUserMenu: false,
			menuItems: [
				{ name: '工程场景', path: '/engineering' },
				{ name: '工况选配', path: '/conditions' },
				{ name: '现象观察', path: '/observation' },
				{ name: '测点数据', path: '/data' }
			],
			isLoggedIn: false,
			userName: '用户名',
			userAvatar: userAvatarImg // 使用导入的图片
		};
	},
	created() {
		this.checkMobile();
		window.addEventListener('resize', this.checkMobile);
		window.addEventListener('scroll', this.handleScroll);
	},
	destroyed() {
		window.removeEventListener('resize', this.checkMobile);
		window.removeEventListener('scroll', this.handleScroll);
	},
	methods: {
		checkMobile() {
			this.isMobile = window.innerWidth <= 768;
		},
		handleScroll() {
			this.scrolled = window.scrollY > 0;
		},
		toggleMobileMenu() {
			this.mobileMenuOpen = !this.mobileMenuOpen;
			document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
		},
		closeMobileMenu() {
			this.mobileMenuOpen = false;
			document.body.style.overflow = '';
		},
		toggleUserMenu() {
			this.showUserMenu = !this.showUserMenu;
		},
		handleLogout() {
			// 实现登出逻辑
		},
	},
};
</script>

<style lang="scss" scoped>
.navbar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 64px;
	background-color: var(--bg-primary);
	transition: all 0.3s ease;
	z-index: 1000;

	&-shadow {
		box-shadow: var(--shadow-sm);
	}

	&-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--spacing-md);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&-left {
		.logo {
			display: flex;
			align-items: center;
			gap: var(--spacing-sm);
			text-decoration: none;
			color: var(--text-primary);

			img {
				height: 32px;
			}

			&-text {
				font-size: 1.25rem;
				font-weight: 600;
			}
		}
	}

	&-menu {
		display: flex;
		gap: var(--spacing-md);

		.nav-item {
			text-decoration: none;
			color: var(--text-secondary);
			padding: var(--spacing-xs) var(--spacing-sm);
			border-radius: var(--radius-sm);
			transition: all 0.3s ease;

			&:hover,
			&.router-link-active {
				color: var(--primary-color);
				background-color: var(--bg-secondary);
			}
		}
	}

	&-right {
		.user-info {
			display: flex;
			align-items: center;
			gap: var(--spacing-xs);
			cursor: pointer;
			padding: var(--spacing-xs) var(--spacing-sm);
			border-radius: var(--radius-md);
			transition: all 0.3s ease;

			&:hover {
				background-color: var(--bg-secondary);
			}

			.user-avatar {
				width: 32px;
				height: 32px;
				border-radius: 50%;
				object-fit: cover;
			}
		}
	}
}

.mobile-menu {
	position: fixed;
	top: 64px;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: var(--bg-primary);
	transform: translateX(100%);
	transition: transform 0.3s ease;
	z-index: 999;

	&.menu-open {
		transform: translateX(0);
	}

	&-items {
		padding: var(--spacing-md);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	&-btn {
		display: none;
		@media (max-width: 768px) {
			display: block;
		}
	}
}

.btn {
	padding: 0.5rem 1rem;
	border-radius: var(--radius-md);
	font-weight: 500;
	text-decoration: none;
	transition: all 0.3s ease;

	&-login {
		color: var(--primary-color);
		background-color: transparent;

		&:hover {
			background-color: var(--bg-secondary);
		}
	}

	&-register {
		color: white;
		background-color: var(--primary-color);

		&:hover {
			background-color: var(--primary-hover);
		}
	}
}

@media (max-width: 768px) {
	.navbar {
		&-menu {
			display: none;
		}

		.logo-text {
			font-size: 1rem;
		}

		.user-name {
			display: none;
		}
	}
}
</style>
