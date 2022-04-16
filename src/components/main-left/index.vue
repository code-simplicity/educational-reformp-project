<template>
	<div class="main-left border animate__animated animate__fadeInLeft">
		<slot />
	</div>
</template>

<script>
// 左边内容，抽取成一个插槽
export default {
	name: "MainLeft",
	data() {
		return {};
	},
	components: {},
	mounted() {},
	methods: {},
};
</script>

<style lang="scss" scoped>
.main-left {
	height: 100%;
	background: #ffffff;
}
</style>
