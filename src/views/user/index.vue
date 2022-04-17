<!--
 * @Author: bugdr
 * @Date: 2022-03-27 11:45:29
 * @LastEditors: bugdr
 * @LastEditTime: 2022-03-28 09:46:10
 * @FilePath: \educational_reformp-project\src\views\user\index.vue
 * @Description: 
-->
<template>
	<el-container class="container">
		<Particles></Particles>

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

		<div class="el-menu-aside">
			<div class="el-menu-container">
				<el-menu
					class="el-menu-vertical"
					active-text-color="#dddd4b"
					background-color="#545c64"
					text-color="#fff"
					:collapse="isCollapse"
					:default-active="activeMenu"
					router
				>
					<el-menu-item
						v-for="(item, index) in navItems"
						:key="index"
						:index="item.path"
					>
						<i class="iconfont" :class="item.icon"></i>
						<template v-slot:title>
							<span class="menu-name">{{ item.name }}</span>
						</template>
					</el-menu-item>
				</el-menu>
			</div>
			<div class="user-router">
				<router-view></router-view>
			</div>
		</div>
	</el-container>
</template>
<script setup>
import { computed, ref, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { User } from "@element-plus/icons-vue";
import { useEventListener } from "@vueuse/core";
import { navItems } from "@/json/navItems";
import Particles from "../../components/particles";

const store = useStore();
// 获取用户信息
const userInfo = computed(() => store.getters["user/userInfo"]);
// 获取路由信息
const navItem = ref([]);
navItem.value = navItems;
// 默认激活菜单
const activeMenu = computed(() => {
	const { path } = navItems[0];
	return path;
});
const isCollapse = computed(() => store.state.app.isCollapse);

// 页面监听
const resizeHandler = () => {
	if (document.body.clientWidth <= 1000 && !isCollapse.value) {
		store.commit("app/isCollapseChange", true);
	} else if (document.body.clientWidth > 1000 && isCollapse.value) {
		store.commit("app/isCollapseChange", false);
	}
};
// 初始化调用
resizeHandler();
// 监听页面的变化，beforeMount
onBeforeMount(() => {
	useEventListener("resize", resizeHandler());
});
</script>
<style lang="scss" scoped>
.el-header {
	padding-left: 16px;
	padding-right: 16px;
}

.container {
	position: relative;
	.user-header {
		color: #fff;
		display: flex;
		height: 50px;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		z-index: 1;
		border-bottom: 1px solid #ffffff;
		.user-header-left {
			display: flex;
			.to-home {
				margin-left: 40px;
				font-size: 18px;
				border-bottom: 2px solid #fff;
				.active-class {
					color: #fff;

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
	.el-menu-aside {
		display: flex;
		justify-content: center;
		position: relative;
		.el-menu-container {
			display: flex;
			height: 400px;
			.el-menu {
				background-color: #ffffff;
				.el-menu-item {
					color: #000000;
					&.is-active {
						color: #ffffff;
						background-color: #3a3a3a;
					}
				}
			}
			.el-menu-vertical {
				box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
				background-color: rgba(255, 255, 255, 0.8);
				.menu-name {
					margin-left: 8px;
				}
			}
		}
		.user-router {
			display: flex;
			align-items: flex-start;
			margin-left: 20px;
		}
	}
}
</style>
