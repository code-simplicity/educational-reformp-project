<!--
 * @Author: bugdr
 * @Date: 2022-04-19 13:08:58
 * @LastEditors: bugdr
 * @LastEditTime: 2025-03-15 23:10:15
 * @FilePath: /educational-reformp-project/src/components/main-footer/index.vue
 * @Description: 
-->
<template>
	<div class="main-footer border animate__animated animate__fadeInBottomRight">
		<div class="container flex-column">
			<div class="version">版权所有：天津城建大学</div>
			<div class="maintain">制作维护：土木工程学院 计算机与信息工程学院</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "main-footer",
	data() {
		return {};
	},
	components: {},
	mounted() {},
	methods: {},
};
</script>

<style lang="scss" scoped>
.main-footer {
	background-color: #ffffff;
	.container {
		padding: 6px 0;
		line-height: 24px;
		.version {
			cursor: pointer;
		}
		.maintain {
			cursor: pointer;
			line-height: 24px;
		}
	}
}
</style>
