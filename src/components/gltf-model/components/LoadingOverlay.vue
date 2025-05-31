<template>
	<div class="maskLoading" v-if="isLoading">
		<div class="loading">
			<div class="loading-bar" :style="{ width: loadingWidth + '%' }"></div>
		</div>
		<div class="loading-percentage">{{ parseInt(loadingWidth) }}%</div>
	</div>

	<div class="error-message" v-if="loadingFailed">
		<h3>模型加载失败</h3>
		<p>无法加载3D模型，请检查文件格式或网络连接</p>
		<el-button type="primary" @click="onRetry">重试</el-button>
	</div>
</template>

<script setup>
// 接收props
const props = defineProps({
	isLoading: {
		type: Boolean,
		default: true,
	},
	loadingWidth: {
		type: Number,
		default: 0,
	},
	loadingFailed: {
		type: Boolean,
		default: false,
	},
});

// 定义事件
const emit = defineEmits(["retry"]);

// 重试点击事件
const onRetry = () => {
	emit("retry");
};
</script>

<style lang="scss" scoped>
.maskLoading {
	position: absolute;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 1002;
	background: linear-gradient(to bottom, #f8f9fa, #e9ecef);

	.loading {
		width: 300px;
		height: 8px;
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.1);
		overflow: hidden;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);

		.loading-bar {
			background: linear-gradient(to right, #4c8dff, #2979ff);
			height: 100%;
			width: 0;
			border-radius: 4px;
			transition: width 0.3s ease;
			box-shadow: 0 0 10px rgba(41, 121, 255, 0.5);
		}
	}

	.loading-percentage {
		margin-top: 15px;
		color: #333;
		font-size: 16px;
		font-weight: 500;
	}
}

.error-message {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: white;
	padding: 25px;
	border-radius: 10px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	text-align: center;
	z-index: 10000;
	max-width: 90%;
	width: 400px;

	h3 {
		color: #d32f2f;
		margin: 0 0 15px;
		font-size: 20px;
	}

	p {
		margin: 0 0 20px;
		color: #555;
		font-size: 15px;
		line-height: 1.5;
	}
}
</style>
