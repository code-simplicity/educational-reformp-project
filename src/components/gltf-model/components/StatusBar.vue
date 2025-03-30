<template>
	<div class="coordinates-display">
		<div class="coord-value">
			X: {{ coords.x.toFixed(2) }} Y: {{ coords.y.toFixed(2) }} Z:
			{{ coords.z.toFixed(2) }}
		</div>
		<div v-if="hoveredObject" class="object-info">
			{{ hoveredObject }}
		</div>
	</div>

	<div class="mode-indicator" v-if="activeModes.length > 0">
		<div
			v-for="mode in activeModes"
			:key="mode.type"
			class="mode-badge"
			:class="mode.type"
		>
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
		default: '',
	},
	activeModes: {
		type: Array,
		default: () => [],
	},
});
</script>

<style lang="scss" scoped>
.coordinates-display {
	position: absolute;
	left: 15px;
	bottom: 15px;
	background-color: rgba(0, 0, 0, 0.6);
	color: white;
	padding: 8px 12px;
	border-radius: 6px;
	font-family: monospace;
	font-size: 14px;
	z-index: 1001;
	backdrop-filter: blur(4px);

	.coord-value {
		margin-bottom: 4px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.object-info {
		font-size: 12px;
		color: #aaa;
		margin-top: 4px;
	}
}

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
				content: '📏';
				margin-right: 6px;
			}
		}

		&.explosion {
			background-color: rgba(211, 47, 47, 0.8);

			&::before {
				content: '💥';
				margin-right: 6px;
			}
		}
	}
}

/* 响应式设计 */
@media (max-width: 768px) {
	.coordinates-display {
		left: 10px;
		bottom: 10px;
	}
}
</style>
