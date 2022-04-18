<template>
	<div class="error">
		<div class="pic-404">
			<el-image :src="four"></el-image>
		</div>
		<div class="back-home">
			<div class="tip">页面不存在</div>
			<div class="home">
				请检查您输入的网址是否正确，或单击下面的按钮返回主页!
			</div>
			<el-button type="primary" round @click="toHome">跳转首页</el-button>
		</div>
	</div>
</template>

<script>
// 错误
import four from "@/assets/images/404.png";
export default {
	name: "Error",
	data() {
		return {
			four,
		};
	},
	methods: {
		toHome() {
			this.$router.push("/");
		},
	},
};
</script>

<style lang="scss" scoped>
.error {
	display: flex;
	height: 100%;
	justify-content: center;
	align-items: center;
	.pic-404 {
		position: relative;
		float: left;
		width: 600px;
		overflow: hidden;
	}
	.back-home {
		.tip {
			font-size: 30px;
			color: #5867f1;
		}
		.home {
			font-size: 16px;
			margin: 10px 0;
		}
	}
}
</style>
