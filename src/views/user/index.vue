<!--
 * @Author: bugdr
 * @Date: 2022-03-27 11:45:29
 * @LastEditors: bugdr
 * @LastEditTime: 2022-03-27 23:21:52
 * @FilePath: \educational_reformp-project\src\views\user\index.vue
 * @Description: 
-->
<template>
	<el-container class="container">
		<el-header class="user-header">
			<div class="user-header-left">
				<h1>水运仿真平台用户管理中心</h1>
				<div class="to-home">
					<router-link class="active-class flex-nowrap" :to="{ name: 'home' }"
						>首页</router-link
					>
				</div>
			</div>
			<div class="user-header-right">
				<h2>{{ userInfo.id }}</h2>
				<el-icon :size="18"><User /></el-icon>
			</div>
		</el-header>
		<div class="user-container flex flex-center">
			<div class="user-nav">
				<div class="menu-collapse">
					<el-icon v-model="isCollapse" :size="30" color="#000000">
						<Expand />
					</el-icon>
				</div>
				<div class="user-box flex">
					<el-menu
						default-openeds="1"
						class="el-menu-vertical-demo"
						active-text-color="#11d04b"
						background-color="#545c64"
						text-color="#fff"
						:collapse="isCollapse"
						@open="handleOpen"
						@close="handleClose"
						router
					>
						<el-menu-item
							v-for="(item, index) in navItems"
							:key="index"
							:index="item.path"
						>
							<el-icon>
								<template v-slot:icon>
									{{ icon }}
								</template>
							</el-icon>
							<template #title>{{ item.name }}</template>
						</el-menu-item>
					</el-menu>
					<div class="right-container">
						<router-view></router-view>
					</div>
				</div>
			</div>
		</div>
	</el-container>
</template>
<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { Expand } from "@element-plus/icons-vue";
import { User } from "@element-plus/icons-vue";
import { navItems } from "@/json/navItems";

const store = useStore();

// 获取用户信息
const userInfo = computed(() => store.getters["user/userInfo"]);

// 获取路由信息
const navItem = ref([]);

navItem.value = navItems;

const isCollapse = ref(false);
const handleOpen = (key, keyPath) => {
	console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
	console.log(key, keyPath);
};
</script>
<style lang="scss" scope>
.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 200px;
}
.container {
	.user-header {
		display: flex;
		background: #6b9ac9;
		height: 50px;
		align-items: center;
		justify-content: space-between;
		.user-header-left {
			display: flex;
			.to-home {
				margin-left: 40px;
				font-size: 22px;
				.active-class {
					color: #e94040;
					text-decoration: none;
					cursor: pointer;
					&.router-link-active {
						color: $active-color;
					}
					&:hover {
						color: $hover-color;
					}
				}
			}
		}
		.user-header-right {
			display: flex;
			align-items: center;
			h2 {
				margin-right: 6px;
			}
		}
	}
	.user-container {
		padding: 10px 16px;
		.user-nav {
			position: relative;
			.menu-collapse {
				position: absolute;
			}
			.user-box {
				display: flex;
				align-items: baseline;
				margin-top: 20px;
				.right-container {
				}
			}
		}
	}
}
</style>
