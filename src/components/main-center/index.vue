<template>
	<div class="main-center border animate__animated animate__fadeInDown">
		<slot />
	</div>
</template>

<script>
// 中间内容插槽
export default {
	name: "MainCenter",
	data() {
		return {};
	},
	components: {},
	mounted() {},
	methods: {},
};
</script>

<style lang="scss" scoped>
.main-center {
	height: 100%;
	background: #ffffff;
}
</style>
