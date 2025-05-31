<template>
	<div class="enhanced-control-panel">
		<div class="panel-header" @click="togglePanel">
			<span>模型控制面板</span>
			<div class="header-actions">
				<span class="fps-counter">FPS: {{ fps }}</span>
				<el-icon class="toggle-icon"> <ArrowDown v-if="showPanel" /><ArrowRight v-else /> </el-icon>
			</div>
		</div>

		<div class="panel-content" v-show="showPanel">
			<div class="panel-content-wrap">
				<!-- 性能控制区 -->
				<div class="control-group">
					<div class="group-title">性能与显示</div>

					<div class="control-row quality-selector">
						<span>渲染质量:</span>
						<el-radio-group v-model="localQualityMode" @change="onQualityChange" size="small">
							<el-radio-button label="auto">自动</el-radio-button>
							<el-radio-button label="low">低</el-radio-button>
							<el-radio-button label="medium">中</el-radio-button>
							<el-radio-button label="high">高</el-radio-button>
						</el-radio-group>
					</div>

					<div class="control-row">
						<span>透明度:</span>
						<el-slider
							v-model="localOpacity"
							:min="0.1"
							:max="1"
							:step="0.05"
							@change="onOpacityChange"
							size="small"
						></el-slider>
					</div>

					<div class="control-actions">
						<el-checkbox v-model="localWireframe" @change="onWireframeToggle" size="small"
							>线框模式</el-checkbox
						>
						<el-checkbox v-model="localAntiAlias" @change="onAntialiasToggle" size="small"
							>抗锯齿</el-checkbox
						>
					</div>
				</div>

				<!-- 视图控制区 -->
				<div class="control-group">
					<div class="group-title">视图控制</div>

					<div class="view-buttons">
						<el-button-group class="view-buttons-group">
							<el-button size="small" @click="onViewChange('front')">正视图</el-button>
							<el-button size="small" @click="onViewChange('top')">俯视图</el-button>
							<el-button size="small" @click="onViewChange('side')">侧视图</el-button>
							<el-button size="small" @click="onResetView">重置</el-button>
						</el-button-group>
					</div>

					<div class="control-actions">
						<el-checkbox v-model="localAutoRotate" @change="onAutoRotateToggle" size="small"
							>自动旋转</el-checkbox
						>
						<el-popover placement="bottom" :width="200" trigger="click">
							<template #reference>
								<el-button size="small" icon="setting">旋转设置</el-button>
							</template>
							<div class="rotation-settings">
								<div class="setting-item">
									<span>旋转速度:</span>
									<el-slider
										v-model="localRotationSpeed"
										:min="0.1"
										:max="5"
										:step="0.1"
										@change="onRotationSpeedChange"
										size="small"
									></el-slider>
								</div>
							</div>
						</el-popover>
					</div>
				</div>

				<!-- 背景控制区已移除 - 统一使用纯白背景 -->

				<!-- 工具区 -->
				<div class="control-group">
					<div class="group-title">辅助工具</div>

					<div class="tool-buttons">
						<el-button-group class="view-buttons-group">
							<el-button
								size="small"
								:type="localShowGrid ? 'primary' : ''"
								@click="onGridToggle(!localShowGrid)"
								>网格</el-button
							>
							<el-button
								size="small"
								:type="localShowAxes ? 'primary' : ''"
								@click="onAxesToggle(!localShowAxes)"
								>坐标轴</el-button
							>
							<el-button
								size="small"
								:type="localShowBoundingBox ? 'primary' : ''"
								@click="onBoundingBoxToggle(!localShowBoundingBox)"
								>边界框</el-button
							>
						</el-button-group>
					</div>

					<div class="special-actions">
						<el-button size="small" @click="onScreenshot" type="success" icon="camera"
							>截图</el-button
						>
						<el-button size="small" @click="onFullscreen" type="primary" icon="full-screen"
							>全屏</el-button
						>
					</div>
				</div>

				<!-- 交互区 -->
				<div class="control-group">
					<div class="group-title">模型交互</div>

					<div class="interaction-buttons">
						<el-button-group class="view-buttons-group">
							<el-button
								size="small"
								:type="measureMode ? 'primary' : ''"
								@click="onMeasurementToggle"
								>测量工具</el-button
							>
							<el-button
								size="small"
								:type="explosionMode ? 'primary' : ''"
								@click="onExplosionToggle"
								>爆炸视图</el-button
							>
						</el-button-group>
					</div>

					<div v-if="measureMode" class="measure-result">
						<span
							>测量结果:
							{{ measureResult ? measureResult.toFixed(2) + " 单位" : "请选择两点" }}</span
						>
					</div>

					<div v-if="explosionMode" class="explosion-control">
						<span>爆炸程度:</span>
						<el-slider
							v-model="localExplosionStrength"
							:min="0"
							:max="2"
							:step="0.1"
							@input="onExplosionStrengthChange"
							size="small"
						></el-slider>
					</div>
				</div>

				<!-- 相机控制部分 - 独立于 el-collapse -->
				<div class="panel-section">
					<div class="section-header">
						<h3>相机控制</h3>
					</div>

					<div class="section-content">
						<div class="control-row">
							<el-button size="small" @click="$emit('record-camera-position')">
								<el-icon><Camera /></el-icon>
								记录位置
							</el-button>

							<el-button size="small" @click="$emit('goto-model-center')">
								<el-icon><Aim /></el-icon>
								移动到模型中心
							</el-button>
						</div>

						<!-- 相机信息显示 -->
						<div class="camera-info" v-if="cameraInfo">
							<div class="info-section">
								<div class="info-label">当前位置:</div>
								<div class="info-value">
									X: {{ cameraInfo.position.x.toFixed(2) }}, Y:
									{{ cameraInfo.position.y.toFixed(2) }}, Z:
									{{ cameraInfo.position.z.toFixed(2) }}
								</div>
							</div>

							<div class="info-section">
								<div class="info-label">目标点:</div>
								<div class="info-value">
									X: {{ cameraInfo.target.x.toFixed(2) }}, Y: {{ cameraInfo.target.y.toFixed(2) }},
									Z:
									{{ cameraInfo.target.z.toFixed(2) }}
								</div>
							</div>

							<div class="button-row">
								<el-button size="small" type="primary" @click="$emit('copy-camera-position')">
									复制位置信息
								</el-button>
							</div>
						</div>
					</div>
				</div>

				<!-- 全屏控制部分 -->
				<div class="panel-section full-screen-section">
					<el-button size="small" @click="$emit('fullscreen')" class="custom-button">
						<div class="button-content">
							<el-icon><FullScreen v-if="!isFullScreen" /><Close v-else /></el-icon>
							<span class="button-text">{{ isFullScreen ? "退出全屏" : "全屏" }}</span>
						</div>
					</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import { ArrowDown, ArrowRight } from "@element-plus/icons-vue";

// 接收props
const props = defineProps({
	fps: {
		type: Number,
		default: 0,
	},
	qualityMode: {
		type: String,
		default: "auto",
	},
	modelOpacity: {
		type: Number,
		default: 1,
	},
	autoRotate: {
		type: Boolean,
		default: false,
	},
	rotationSpeed: {
		type: Number,
		default: 1.0,
	},
	wireframe: {
		type: Boolean,
		default: false,
	},
	antiAlias: {
		type: Boolean,
		default: false,
	},
	showGrid: {
		type: Boolean,
		default: false,
	},
	showAxes: {
		type: Boolean,
		default: false,
	},
	showBoundingBox: {
		type: Boolean,
		default: false,
	},
	measureMode: {
		type: Boolean,
		default: false,
	},
	measureResult: {
		type: Number,
		default: null,
	},
	explosionMode: {
		type: Boolean,
		default: false,
	},
	explosionStrength: {
		type: Number,
		default: 0,
	},
	cameraInfo: {
		type: Object,
		default: null,
	},
	isFullScreen: Boolean,
	// 背景设置已移除 - 统一使用纯白背景
});

// 定义事件
const emit = defineEmits([
	"quality-change",
	"opacity-change",
	"wireframe-toggle",
	"antialias-toggle",
	"grid-toggle",
	"axes-toggle",
	"boundingbox-toggle",
	"autorotate-toggle",
	"rotation-speed-change",
	"view-change",
	"reset-view",
	"measurement-toggle",
	"explosion-toggle",
	"explosion-strength-change",
	"screenshot",
	"fullscreen",
	"record-camera-position",
	"goto-model-center",
	"copy-camera-position",
	// 'background-change', // 已移除 - 统一使用纯白背景
]);

// 本地状态
const showPanel = ref(true);
const localQualityMode = ref(props.qualityMode);
const localOpacity = ref(props.modelOpacity);
const localAutoRotate = ref(props.autoRotate);
const localRotationSpeed = ref(props.rotationSpeed);
const localWireframe = ref(props.wireframe);
const localAntiAlias = ref(props.antiAlias);
const localShowGrid = ref(props.showGrid);
const localShowAxes = ref(props.showAxes);
const localShowBoundingBox = ref(props.showBoundingBox);
const localExplosionStrength = ref(props.explosionStrength);
// const localCurrentSky = ref(props.currentSky); // 已移除 - 统一使用纯白背景

// 同步props到本地状态
watch(
	() => props.qualityMode,
	(newVal) => {
		localQualityMode.value = newVal;
	},
);
watch(
	() => props.modelOpacity,
	(newVal) => {
		localOpacity.value = newVal;
	},
);
watch(
	() => props.autoRotate,
	(newVal) => {
		localAutoRotate.value = newVal;
	},
);
watch(
	() => props.rotationSpeed,
	(newVal) => {
		localRotationSpeed.value = newVal;
	},
);
watch(
	() => props.wireframe,
	(newVal) => {
		localWireframe.value = newVal;
	},
);
watch(
	() => props.antiAlias,
	(newVal) => {
		localAntiAlias.value = newVal;
	},
);
watch(
	() => props.showGrid,
	(newVal) => {
		localShowGrid.value = newVal;
	},
);
watch(
	() => props.showAxes,
	(newVal) => {
		localShowAxes.value = newVal;
	},
);
watch(
	() => props.showBoundingBox,
	(newVal) => {
		localShowBoundingBox.value = newVal;
	},
);
watch(
	() => props.explosionStrength,
	(newVal) => {
		localExplosionStrength.value = newVal;
	},
);
// 背景设置监听已移除 - 统一使用纯白背景

// 切换面板显示
const togglePanel = () => {
	showPanel.value = !showPanel.value;
};

// 事件处理方法
const onQualityChange = (value) => {
	emit("quality-change", value);
};

const onOpacityChange = (value) => {
	emit("opacity-change", value);
};

const onWireframeToggle = (value) => {
	emit("wireframe-toggle", value);
};

const onAntialiasToggle = (value) => {
	emit("antialias-toggle", value);
};

const onGridToggle = (value) => {
	emit("grid-toggle", value);
	localShowGrid.value = value;
};

const onAxesToggle = (value) => {
	emit("axes-toggle", value);
	localShowAxes.value = value;
};

const onBoundingBoxToggle = (value) => {
	emit("boundingbox-toggle", value);
	localShowBoundingBox.value = value;
};

const onAutoRotateToggle = (value) => {
	emit("autorotate-toggle", value);
};

const onRotationSpeedChange = (value) => {
	emit("rotation-speed-change", value);
};

const onViewChange = (view) => {
	emit("view-change", view);
};

const onResetView = () => {
	emit("reset-view");
};

const onMeasurementToggle = () => {
	emit("measurement-toggle");
};

const onExplosionToggle = () => {
	emit("explosion-toggle");
};

const onExplosionStrengthChange = (value) => {
	emit("explosion-strength-change", value);
};

const onScreenshot = () => {
	emit("screenshot");
};

const onFullscreen = () => {
	emit("fullscreen");
};

// 背景切换函数已移除 - 统一使用纯白背景
</script>

<style lang="scss" scoped>
.enhanced-control-panel {
	position: absolute;
	top: 15px;
	right: 15px;
	width: 320px;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 10px;
	box-shadow: 0 3px 15px rgba(0, 0, 0, 0.12);
	z-index: 1001;
	backdrop-filter: blur(10px);
	overflow: hidden;
	border: 1px solid rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;

	.panel-header {
		padding: 12px 15px;
		background: linear-gradient(to right, #4c8dff, #2979ff);
		color: white;
		font-weight: 600;
		font-size: 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;

		.header-actions {
			display: flex;
			align-items: center;
			gap: 12px;

			.fps-counter {
				font-size: 13px;
				background-color: rgba(0, 0, 0, 0.2);
				padding: 3px 8px;
				border-radius: 12px;
				font-family: monospace;
			}

			.toggle-icon {
				transition: transform 0.3s;
			}
		}
	}

	.panel-content {
		max-height: 60vh; /* 限制最大高度为视口高度的90% */
		overflow-y: hidden;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px; /* 添加间距 */

		&-wrap {
			overflow-y: auto;
			padding-right: 5px; /* 为滚动条预留空间 */
			padding-bottom: 20px; /* 添加底部间距，确保可以滚动到底部 */
			&::-webkit-scrollbar {
				width: 6px;
			}

			&::-webkit-scrollbar-track {
				background: rgba(0, 0, 0, 0.05);
			}

			&::-webkit-scrollbar-thumb {
				background: rgba(0, 0, 0, 0.15);
				border-radius: 3px;
			}

			.control-group {
				padding: 15px;
				border-bottom: 1px solid rgba(0, 0, 0, 0.05);
				display: flex;
				flex-direction: column;
				gap: 12px;
				margin-bottom: 10px;
				background-color: rgba(255, 255, 255, 0.6);
				border-radius: 8px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

				&:last-child {
					border-bottom: none;
					margin-bottom: 0;
				}

				.group-title {
					font-size: 14px;
					font-weight: 600;
					margin-bottom: 12px;
					color: #333;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.control-row {
					margin-bottom: 12px;
					display: flex;
					align-items: center;
					gap: 10px;

					span {
						min-width: 65px;
						font-size: 13px;
						color: #555;
					}

					&.quality-selector {
						margin-bottom: 15px;
					}
				}

				.control-actions,
				.special-actions,
				.tool-buttons,
				.view-buttons,
				.interaction-buttons {
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
					gap: 10px;
					margin-bottom: 10px;
					.view-buttons-group {
						display: flex;
						align-items: center;
					}

					&:last-child {
						margin-bottom: 0;
					}
				}

				.measure-result,
				.explosion-control {
					margin-top: 10px;
					padding: 8px 10px;
					background-color: rgba(0, 0, 0, 0.05);
					border-radius: 6px;
					font-size: 13px;
				}

				.rotation-settings {
					.setting-item {
						display: flex;
						flex-direction: column;
						gap: 8px;

						span {
							font-size: 13px;
							color: #555;
						}
					}
				}
			}

			.camera-info {
				font-size: 12px;
				margin-top: 10px;
				background-color: #f5f7fa;
				padding: 8px;
				border-radius: 4px;

				.info-label {
					font-weight: bold;
					margin-top: 4px;
				}

				.info-value {
					font-family: monospace;
					margin-bottom: 4px;
				}
			}
		}
	}
}

/* 响应式设计 */
@media (max-width: 768px) {
	.enhanced-control-panel {
		width: 85%;
		max-width: 300px;
		right: 10px;
		top: 10px;
	}
}

.panel-section {
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	margin-bottom: 8px;
	overflow: hidden;
	background-color: #fff;
}

.section-header {
	background-color: #f5f7fa;
	padding: 10px 15px;
	border-bottom: 1px solid #dcdfe6;
}

.section-header h3 {
	margin: 0;
	font-size: 14px;
	color: #303133;
}

.section-content {
	padding: 10px 15px;
}

.camera-info {
	font-size: 12px;
	margin-top: 10px;
	background-color: #f5f7fa;
	padding: 8px;
	border-radius: 4px;
}

.info-section {
	margin-bottom: 8px;
}

.info-label {
	font-weight: bold;
	color: #606266;
}

.info-value {
	font-family: monospace;
	color: #303133;
}

.button-row {
	margin-top: 8px;
	display: flex;
	justify-content: flex-end;
}

.camera-preset-controls {
	margin-top: 10px;
	border-top: 1px solid #ebeef5;
	padding-top: 10px;
}

.preset-title {
	font-size: 12px;
	color: #606266;
	margin-bottom: 5px;
}

.preset-buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
}

.full-screen-btn {
	transition: all 0.3s ease;
	margin-top: 10px;
}
.full-screen-icon {
	margin-right: 6px;
}

/* 确保图标和文字间距为6px */
.el-icon + span {
	margin-left: 6px;
}

/* 确保图标和文字之间的间距为6px */
.custom-button {
	display: flex;
	align-items: center;
	justify-content: center;
}

.button-content {
	display: flex;
	align-items: center;
}

.button-text {
	margin-left: 6px !important;
}

/* 针对其他按钮也应用相同的样式 */
.el-button .el-icon + span {
	margin-left: 6px !important;
}

:deep(.el-button .el-icon) {
	margin-right: 6px !important;
}

/* 修复Element Plus的默认margin */
:deep(.el-button .el-icon + span) {
	margin-left: 0 !important;
}
</style>
