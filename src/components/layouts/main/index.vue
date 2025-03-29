<template>
	<main class="main-content">
		<div class="content-container">
			<div class="content-container-wrap">
				<slot></slot>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	name: 'MainContent',
};
</script>

<style lang="scss" scoped>
.main-content {
	background-color: #f5f7fa;
	padding: 12px;
	position: relative;
	height: calc(100% - 64px - 68px);
	overflow: hidden;
	.content-container {
		width: 100%;
		margin: 0 auto;
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
		padding: 12px;
		height: 100%;
		overflow: hidden;

		scrollbar-width: thin;
		scrollbar-color: #d4d4d4 #f5f7fa;

		&::-webkit-scrollbar {
			width: 8px;
		}

		&::-webkit-scrollbar-track {
			background: #f5f7fa;
		}

		&::-webkit-scrollbar-thumb {
			background-color: #d4d4d4;
			border-radius: 4px;
			border: 2px solid #f5f7fa;
		}
		&-wrap {
			overflow-y: auto;
			overflow-x: hidden;
			height: 100%;
		}
	}
}
</style>
