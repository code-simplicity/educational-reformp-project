<template>
	<!-- 底部坐标信息区域已移除 -->

	<div class="mode-indicator" v-if="activeModes.length > 0">
		<div v-for="mode in activeModes" :key="mode.type" class="mode-badge" :class="mode.type">
			{{ mode.label }}
		</div>
	</div>
</template>

<script setup>
// 接收props
const props = defineProps({
	coords: {
		type: Object,
		default: () => ({ x: 0, y: 0, z: 0 }),
	},
	hoveredObject: {
		type: String,
		default: "",
	},
	activeModes: {
		type: Array,
		default: () => [],
	},
});
</script>

<style lang="scss" scoped>
/* 底部坐标信息区域已移除 */

.mode-indicator {
	position: absolute;
	top: 10px;
	left: 10px;
	display: flex;
	flex-direction: column;
	gap: 6px;
	z-index: 1001;

	.mode-badge {
		background-color: rgba(0, 0, 0, 0.6);
		color: white;
		padding: 4px 10px;
		border-radius: 4px;
		font-size: 12px;
		display: flex;
		align-items: center;
		backdrop-filter: blur(4px);

		&.measure {
			background-color: rgba(25, 118, 210, 0.8);

			&::before {
				content: "📏";
				margin-right: 6px;
			}
		}

		&.explosion {
			background-color: rgba(211, 47, 47, 0.8);

			&::before {
				content: "💥";
				margin-right: 6px;
			}
		}
	}
}

/* 响应式设计 - 底部坐标信息区域已移除 */
</style>
