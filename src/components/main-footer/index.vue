<template>
	<div class="main-footer border">
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
	/* position: absolute;
  bottom: 10px;
  left: 16px;
  right: 16px; */
	/* width: 100%; */
	/* margin-top: 16px; */
	/* min-width: 1080px; */
	background-color: #ffffff;

	.container {
		padding: 6px 0;
		.version {
			font-size: 0.8rem;
			cursor: pointer;
		}
		.maintain {
			font-size: 0.8rem;
			cursor: pointer;
		}
	}
}
</style>
