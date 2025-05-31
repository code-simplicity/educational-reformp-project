<template>
	<div class="measure-point-route">
		<div class="scene-container">
			<!-- 左侧参数设置区域 -->
			<div class="params-panel">
				<el-card class="parameters-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span class="header-title">仿真参数设置</span>
							<el-button type="primary" class="action-button" @click="toMeasurePoint">
								<el-icon><DataAnalysis /></el-icon>
								加载测点数据
							</el-button>
						</div>
					</template>

					<div class="parameters-content">
						<!-- 设计水位选择 -->
						<div class="param-section">
							<div class="section-header">
								<div class="section-title">
									<el-icon><Odometer /></el-icon>
									设计水位
								</div>
								<div class="param-value">当前选择：{{ water_level }}</div>
							</div>
							<el-divider></el-divider>
							<div class="radio-group-container">
								<el-radio-group v-model="water_level" class="radio-options">
									<el-radio
										v-for="item in radioList.slice(0, 4)"
										:key="item.id"
										:label="item.content"
										@change="getContentSearchChooseId(item.id)"
										border
									>
										{{ item.content }}
									</el-radio>
								</el-radio-group>
							</div>
						</div>

						<!-- 波浪来向选择 -->
						<div class="param-section">
							<div class="section-header">
								<div class="section-title">
									<el-icon><Location /></el-icon>
									波浪来向
								</div>
								<div class="param-value">当前选择：{{ wave_direction }}</div>
							</div>
							<el-divider></el-divider>
							<div class="radio-group-container">
								<el-radio-group
									v-model="wave_direction"
									class="radio-options wave-direction-options"
								>
									<el-radio
										v-for="item in radioList.slice(4, 7)"
										:key="item.id"
										:label="item.content"
										@change="getContentSearchChooseId(item.id)"
										border
									>
										{{ item.content }}
									</el-radio>
								</el-radio-group>
							</div>
						</div>

						<!-- 外堤布置选择 -->
						<div class="param-section">
							<div class="section-header">
								<div class="section-title">
									<el-icon><Setting /></el-icon>
									外堤布置
								</div>
								<div class="param-value">当前选择：{{ embank_ment }}</div>
							</div>
							<el-divider></el-divider>
							<div class="radio-group-container">
								<el-radio-group v-model="embank_ment" class="radio-options embank-options">
									<el-radio
										v-for="item in radioList.slice(7, 11)"
										:key="item.id"
										:label="item.content"
										@change="getContentSearchChooseId(item.id)"
										border
									>
										{{ item.content }}
									</el-radio>
								</el-radio-group>
							</div>
						</div>

						<!-- 工况描述区域 -->
						<div class="param-section content-section">
							<div class="section-header">
								<div class="section-title">
									<el-icon><Document /></el-icon>
									工况描述
								</div>
								<el-tag size="small" :type="content ? 'success' : 'info'">
									{{ content ? "已加载" : "暂无数据" }}
								</el-tag>
							</div>
							<el-divider></el-divider>
							<div v-if="content" class="content-area">
								<div class="content-list">
									<div class="current-params">
										<el-tag size="small" type="primary" effect="plain"
											>水位：{{ water_level }}</el-tag
										>
										<el-tag size="small" type="success" effect="plain"
											>波向：{{ wave_direction }}</el-tag
										>
										<el-tag size="small" type="warning" effect="plain"
											>外堤：{{ embank_ment }}</el-tag
										>
									</div>
									<div class="content-text">{{ content }}</div>
								</div>
							</div>
							<el-empty v-else description="暂无工况说明" :image-size="80"></el-empty>
						</div>
					</div>
				</el-card>
			</div>

			<!-- 中间地图面板 -->
			<div class="map-panel">
				<el-card class="map-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span class="header-title"> 港口平面测点分布 </span>
							<div class="params-summary">
								<el-tag size="small" type="primary">{{ water_level }}</el-tag>
								<el-tag size="small" type="success">{{ wave_direction }}</el-tag>
								<el-tag size="small" type="warning">{{ embank_ment }}</el-tag>
							</div>
						</div>
					</template>

					<div class="map-container" v-loading="!imageUrl">
						<el-image
							v-if="imageUrl"
							class="port-map animate__animated animate__fadeIn"
							:src="imageUrl"
							fit="contain"
						></el-image>
						<el-empty
							v-else
							description="请选择参数并点击加载测点数据"
							:image-size="120"
						></el-empty>
					</div>
				</el-card>
			</div>

			<!-- 右侧数据分析面板 -->
			<div class="data-panel">
				<el-card class="data-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span class="header-title"> 测点数据分析 </span>
							<el-button type="success" size="small" @click="downloadExcel">
								<el-icon><Download /></el-icon>
								下载数据
							</el-button>
						</div>
					</template>

					<div class="data-content">
						<!-- 测点选择区域 -->
						<div class="point-selection">
							<div class="section-title">测点选择</div>
							<div class="point-grid">
								<div
									v-for="item in pointList"
									:key="item.id"
									class="point-marker"
									:class="{ active: activeContent === item.content }"
									@click="changeWaveFormsAndStats(item.content, item.id)"
								>
									<span>{{ item.content }}</span>
								</div>
								<el-empty
									v-if="pointList.length === 0"
									description="暂无测点数据"
									:image-size="80"
								></el-empty>
							</div>
						</div>

						<!-- 波形分析区域 -->
						<el-tabs type="border-card" class="wave-tabs">
							<el-tab-pane label="波形图">
								<div class="wave-container" v-loading="!waveFormsUrl && activeContent !== ''">
									<el-image
										v-if="waveFormsUrl"
										:src="waveFormsUrl"
										fit="contain"
										class="wave-chart"
									></el-image>
									<el-empty
										v-else-if="activeContent !== ''"
										description="暂无波形图数据"
										:image-size="80"
									></el-empty>
									<div v-else class="select-hint">
										<el-icon><ArrowRight /></el-icon>
										请选择一个测点查看波形数据
									</div>
								</div>
							</el-tab-pane>
							<el-tab-pane label="统计分析">
								<div class="wave-container" v-loading="!waveStatsUrl && activeContent !== ''">
									<el-image
										v-if="waveStatsUrl"
										:src="waveStatsUrl"
										fit="contain"
										class="wave-chart"
									></el-image>
									<el-empty
										v-else-if="activeContent !== ''"
										description="暂无统计数据"
										:image-size="80"
									></el-empty>
									<div v-else class="select-hint">
										<el-icon><ArrowRight /></el-icon>
										请选择一个测点查看统计数据
									</div>
								</div>
							</el-tab-pane>
						</el-tabs>
					</div>
				</el-card>
			</div>
		</div>
	</div>
</template>

<script>
import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";
import Constants from "../../utils/Constants.js";
import { addUserScore, getUserInfo } from "../../api/service/user";
import { getChooseFindAll } from "../../api/service/choose";
import { contentSearchChooseId } from "../../api/service/content";
import { portPointMapSearchFindOne } from "../../api/service/portpointmap";
import { getPointByPointMapFindAll } from "../../api/service/point";
import { getWaveformsSearchPointId } from "../../api/service/waveforms";
import { getWavestatsSearchPointId } from "../../api/service/wavestats";
import { getWaveDataExcelByPortMapPointId } from "../../api/service/wavedataexcel";
import utils from "../../utils/utils";

export default {
	name: "MeasurePointRoute",
	data() {
		return {
			content: "",
			imageUrl: "", // 图片的路径
			radioList: [],
			// 选择框的值,分别是水位，波浪方向，堤坝布置
			water_level: "",
			wave_direction: "",
			embank_ment: "",
			// 激活内容
			activeContent: "",
			// 展示点位选择列表
			showPoint: false,
			pointList: [],
			// 波形图
			waveFormsUrl: "",
			// 波形统计图
			waveStatsUrl: "",
			page: {
				pageNum: 1,
				pageSize: 50,
			},
			// 港口点位地图的id
			portPointMapId: "",
		};
	},
	computed: {
		...mapGetters("user", {
			userInfo: "userInfo",
		}),
	},
	watch: {
		$route(newVal, oldVal) {
			if (newVal.query.keywords !== oldVal.query.keywords) {
				this.queryObj = newVal.query;
				this.water_level = newVal.query.water_level;
				this.wave_direction = newVal.query.wave_direction;
				this.embank_ment = newVal.query.embank_ment;
				this.getPortPointMapSearch(this.queryObj);
			}
		},
	},
	mounted() {
		this.getChooseFindAll();
		const queryObj = this.$route.query;
		if (Object.keys(queryObj).length > 0) {
			this.water_level = queryObj.water_level;
			this.wave_direction = queryObj.wave_direction;
			this.embank_ment = queryObj.embank_ment;
			this.getPortPointMapSearch(queryObj);
		} else {
			this.water_level = "极端高水位";
			this.wave_direction = "SW";
			this.embank_ment = "无堤";
			const params = {
				water_level: this.water_level,
				wave_direction: this.wave_direction,
				embank_ment: this.embank_ment,
			};
			this.getPortPointMapSearch(params);
		}
	},
	methods: {
		// 下载excel
		async downloadExcel() {
			if (!this.portPointMapId) {
				ElMessage.warning("请先加载测点数据");
				return;
			}

			const params = {
				port_point_map_id: this.portPointMapId,
			};
			const result = await getWaveDataExcelByPortMapPointId(params);
			if (result.code === Constants.status.SUCCESS) {
				ElMessage.success(result.msg);
				window.open(`${result.data.url}`);
			} else {
				ElMessage.error(result.msg);
			}
		},

		// 切换测点，更新波形图和统计图
		async changeWaveFormsAndStats(content, point_id) {
			this.activeContent = content;
			this.getWaveformsSearchPointId(point_id);
			this.getWavestatsSearchPointId(point_id);
			// 获取得分
			this.getUserAddScore();
		},

		// 获取波形图
		async getWaveformsSearchPointId(point_id) {
			const params = {
				point_id,
			};
			const result = await getWaveformsSearchPointId(params);
			if (result.code === Constants.status.SUCCESS) {
				this.waveFormsUrl = result.data.url;
			} else {
				ElMessage.error(result.msg);
				this.waveFormsUrl = "";
			}
		},

		// 获取波形统计图
		async getWavestatsSearchPointId(point_id) {
			const params = {
				point_id,
			};
			const result = await getWavestatsSearchPointId(params);
			if (result.code === Constants.status.SUCCESS) {
				this.waveStatsUrl = result.data.url;
			} else {
				ElMessage.error(result.msg);
				this.waveStatsUrl = "";
			}
		},

		// 用户积分增加
		async getUserAddScore() {
			const params = {
				id: this.userInfo.id,
				score: 100,
			};
			const userInfo = await getUserInfo(this.userInfo.id);
			if (userInfo.data.score >= 80 && userInfo.data.score < 100) {
				const result = await addUserScore(params);
				if (result.code === Constants.status.SUCCESS) {
					ElMessage.success(result.msg);
				} else {
					ElMessage.error(result.msg);
				}
			}
		},

		// 切换点位状态
		changePoint() {
			this.showPoint = !this.showPoint;
		},

		// 查询点位
		async getPointSearch(port_point_map_id) {
			const params = {
				...this.page,
				port_point_map_id,
			};
			const result = await getPointByPointMapFindAll(params);
			if (result.code === Constants.status.SUCCESS) {
				this.pointList = result.data.list;
				// 对数据进行排序
				this.pointList.sort(utils.pointCompare("content"));
				const { list } = result.data;
				if (list.length > 0) {
					this.changeWaveFormsAndStats(list[0].content, list[0].id);
				} else {
					this.waveFormsUrl = "";
					this.waveStatsUrl = "";
					this.activeContent = "";
					ElMessage.warning("当前工况无测点数据");
				}
			} else {
				ElMessage.error(result.msg);
				this.pointList = [];
				this.activeContent = "";
			}
		},

		// 获取测点数据
		async toMeasurePoint() {
			const params = {
				water_level: this.water_level,
				wave_direction: this.wave_direction,
				embank_ment: this.embank_ment,
			};
			this.getPortPointMapSearch(params);
		},

		// 获取左边选择项
		async getChooseFindAll() {
			const params = { ...this.page };
			const result = await getChooseFindAll(params);
			if (result.code === Constants.status.SUCCESS) {
				this.radioList = result.data.list;
				this.getContentSearchChooseId(result.data.list[0].id);
			} else {
				ElMessage.error(result.msg);
			}
		},

		// 获取港口点位地图
		async getPortPointMapSearch(data) {
			const params = {
				...data,
			};
			const result = await portPointMapSearchFindOne(params);
			if (result.code === Constants.status.SUCCESS) {
				this.imageUrl = result.data.url;
				this.portPointMapId = result.data.id;
				this.getPointSearch(result.data.id);
			} else {
				ElMessage.error(result.msg);
				this.imageUrl = "";
				this.portPointMapId = "";
				this.pointList = [];
				this.activeContent = "";
			}
		},

		// 获取内容介绍
		async getContentSearchChooseId(choose_id) {
			const params = {
				choose_id,
			};
			const result = await contentSearchChooseId(params);
			if (result.code === Constants.status.SUCCESS) {
				this.content = result.data.content;
			} else {
				ElMessage.error(result.msg);
				this.content = "";
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.measure-point-route {
	height: 100%;
	width: 100%;
	box-sizing: border-box;

	.scene-container {
		display: flex;
		gap: 12px;
		height: 100%;
		width: 100%;
	}

	/* 左侧参数面板 */
	.params-panel {
		flex: 0.33; /* 参数设置占33%空间 */
		min-width: 320px;
		height: 100%;

		/* 参数设置卡片 */
		.parameters-card {
			height: 100%;
			display: flex;
			flex-direction: column;

			:deep(.el-card__header) {
				padding: 12px 15px;
				background-color: #f0f9ff;
				border-bottom: 1px solid #bae6fd;
			}

			:deep(.el-card__body) {
				flex: 1;
				overflow: auto;
				padding: 15px;
			}

			.card-header {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.header-title {
					font-size: 16px;
					font-weight: 600;
					color: #0369a1;
				}

				.action-button {
					font-size: 14px;

					.el-icon {
						margin-right: 6px;
					}
				}
			}

			.parameters-content {
				.param-section {
					margin-bottom: 20px;
					background-color: #f8fafc;
					border-radius: 6px;
					padding: 12px;
					box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

					&:last-child {
						margin-bottom: 0;
					}

					.section-header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 5px;

						.section-title {
							font-size: 15px;
							font-weight: 600;
							color: #1e40af;
							display: flex;
							align-items: center;

							.el-icon {
								margin-right: 6px;
							}
						}

						.param-value {
							font-size: 13px;
							color: #64748b;
						}
					}

					:deep(.el-divider) {
						margin: 8px 0;
					}

					.radio-group-container {
						.radio-options {
							display: flex;
							flex-wrap: wrap;
							gap: 8px;

							&.wave-direction-options,
							&.embank-options {
								justify-content: flex-start;
							}

							:deep(.el-radio) {
								margin-right: 0;
								margin-bottom: 0;

								&.is-bordered {
									padding: 8px 15px;
									border-radius: 4px;
									border: 1px solid #d1d5db;

									&.is-checked {
										border-color: #409eff;
										background-color: #ecf5ff;
									}

									&:hover {
										border-color: #409eff;
									}
								}

								.el-radio__label {
									font-size: 14px;
								}
							}
						}
					}

					&.content-section {
						.content-area {
							.content-list {
								.current-params {
									display: flex;
									gap: 8px;
									flex-wrap: wrap;
									margin-bottom: 10px;
									padding-bottom: 10px;
									border-bottom: 1px dashed #e2e8f0;
								}

								.content-text {
									margin: 0;
									color: #334155;
									line-height: 1.6;
									font-size: 14px;
									white-space: pre-line;
								}
							}
						}
					}
				}
			}
		}
	}

	/* 中间地图面板 */
	.map-panel {
		flex: 0.34; /* 地图占34%空间 */
		height: 100%;

		/* 地图卡片 */
		.map-card {
			height: 100%;
			display: flex;
			flex-direction: column;

			:deep(.el-card__header) {
				padding: 12px 15px;
				background-color: #f0f9ff;
				border-bottom: 1px solid #bae6fd;
			}

			:deep(.el-card__body) {
				flex: 1;
				padding: 0;
				overflow: hidden;
			}

			.card-header {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.header-title {
					font-size: 16px;
					font-weight: 600;
					color: #0369a1;
					display: flex;
					align-items: center;

					.el-icon {
						margin-right: 6px;
					}
				}

				.params-summary {
					display: flex;
					gap: 8px;

					:deep(.el-tag) {
						border-radius: 4px;
					}
				}
			}

			.map-container {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #f8fafc;

				.port-map {
					max-height: 100%;
					max-width: 100%;
					object-fit: contain;
				}
			}
		}
	}

	/* 右侧数据分析面板 */
	.data-panel {
		flex: 0.33; /* 数据分析占33%空间 */
		height: 100%;
		min-width: 300px;

		/* 数据分析卡片 */
		.data-card {
			height: 100%;
			display: flex;
			flex-direction: column;

			:deep(.el-card__header) {
				padding: 12px 15px;
				background-color: #f0f9ff;
				border-bottom: 1px solid #bae6fd;
			}

			:deep(.el-card__body) {
				flex: 1;
				overflow: auto;
				padding: 0;
			}

			.card-header {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.header-title {
					font-size: 16px;
					font-weight: 600;
					color: #0369a1;
					display: flex;
					align-items: center;

					.el-icon {
						margin-right: 6px;
					}
				}

				.el-button {
					.el-icon {
						margin-right: 6px;
					}
				}
			}

			.data-content {
				padding: 15px;
				height: calc(100% - 30px);
				display: flex;
				flex-direction: column;
				gap: 15px;

				.section-title {
					font-size: 15px;
					font-weight: 600;
					color: #1e40af;
					padding-bottom: 8px;
					border-bottom: 1px solid #e2e8f0;
					margin-bottom: 10px;
				}

				.point-selection {
					.point-grid {
						display: flex;
						flex-wrap: wrap;
						gap: 10px;
						padding: 5px 0;
						min-height: 60px;

						.point-marker {
							width: 40px;
							height: 40px;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: 50%;
							background-color: #e5e7eb;
							color: #1f2937;
							font-weight: 600;
							cursor: pointer;
							transition: all 0.2s ease;
							user-select: none;

							&:hover {
								background-color: #d1d5db;
								transform: translateY(-2px);
								box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
							}

							&.active {
								background-color: #0284c7;
								color: white;
								transform: translateY(-2px);
								box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
							}
						}
					}
				}

				.wave-tabs {
					flex-grow: 1;
					display: flex;
					flex-direction: column;
					border: none;
					box-shadow: none;

					:deep(.el-tabs__header) {
						margin-bottom: 0;
					}

					:deep(.el-tabs__content) {
						padding: 15px;
						flex-grow: 1;
						background-color: #f8fafc;
						border: 1px solid #e2e8f0;
						border-top: none;
						border-radius: 0 0 4px 4px;
					}

					.wave-container {
						height: 230px;
						display: flex;
						align-items: center;
						justify-content: center;

						.wave-chart {
							max-width: 100%;
							max-height: 100%;
							object-fit: contain;
						}

						.select-hint {
							color: #6b7280;
							display: flex;
							align-items: center;
							gap: 5px;

							.el-icon {
								margin-right: 6px;
							}
						}
					}
				}
			}
		}
	}

	/* 全局加载样式优化 */
	:deep(.el-loading-mask) {
		background-color: rgba(255, 255, 255, 0.8);

		.el-loading-spinner {
			.el-loading-text {
				color: #0369a1;
				font-size: 14px;
			}

			.circular .path {
				stroke: #0369a1;
			}
		}
	}

	/* 空状态优化 */
	:deep(.el-empty) {
		padding: 15px 0;

		.el-empty__description {
			margin-top: 10px;
			color: #64748b;
		}

		.el-empty__image {
			opacity: 0.8;
		}
	}

	/* 只保留992px的响应式布局 */
	@media (max-width: 992px) {
		.scene-container {
			flex-direction: column;

			.params-panel,
			.map-panel,
			.data-panel {
				flex: none;
				width: 100%;
				margin-bottom: 12px;
			}
		}
	}
}
</style>
