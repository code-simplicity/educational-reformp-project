<!--
 * @Author: bugdr
 * @Date: 2021-11-16 16:54:25
 * @LastEditors: bugdr
 * @LastEditTime: 2022-03-27 23:10:19
 * @FilePath: \educational_reformp-project\src\views\layout\index.vue
 * @Description: 
-->
<template>
	<div class="layout">
		<MainHeader></MainHeader>
		<router-view v-slot="{ Component }" class="router-style">
			<keep-alive>
				<component
					:is="Component"
					v-if="$route.meta.keepAlive"
					:key="$route.path"
				/>
			</keep-alive>
		</router-view>
		<div class="footer">
			<MainFooter></MainFooter>
		</div>
	</div>
</template>

<script>
// 分发路由
import MainFooter from "../../components/main-footer/index.vue";
import MainHeader from "../../components/main-header/index.vue";
export default {
	name: "Layout",
	data() {
		return {};
	},
	components: {
		MainFooter,
		MainHeader,
	},
	mounted() {},
	methods: {},
};
</script>

<style lang="scss" scoped>
.layout {
	height: 100%;
	width: 100%;
	padding: 12px;
	.router-style {
		height: 80%;
	}
	.footer {
		margin-top: 10px;
	}
}
</style>
