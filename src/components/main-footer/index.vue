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
		.version {
			cursor: pointer;
		}
		.maintain {
			cursor: pointer;
		}
	}
}
</style>
