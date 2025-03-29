<template>
	<footer class="footer">
		<div class="footer-content">
			<div class="main-info">
				<span>版权所有：天津城建大学</span>
				<span class="separator">|</span>
				<span>制作维护：土木工程学院 计算机与信息工程学院</span>
			</div>
			<div class="copyright">
				&copy; {{ new Date().getFullYear() }} 水运工程仿真实验系统. All rights
				reserved.
			</div>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'AppFooter',
};
</script>

<style lang="scss" scoped>
.footer {
	background-color: #ffffff;
	border-top: 1px solid #e8eaed;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
	width: 100%;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	position: fixed;
	bottom:  0;
	left: 0;
	right: 0;
	z-index: 100;
	height: 68px;

	&-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.main-info {
			font-size: 14px;
			color: #6b7280;
			line-height: 1.3;
			text-align: center;

			.separator {
				margin: 0 8px;
				color: #d1d5db;
			}
		}

		.copyright {
			font-size: 12px;
			color: #9ca3af;
			margin-top: 1px;
			line-height: 1.3;
		}
	}
}
</style>
