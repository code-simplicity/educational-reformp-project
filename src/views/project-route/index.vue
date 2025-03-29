<template>
	<div class="project-route">
		<div class="scene-container">
			<!-- 左侧参数设置区域 -->
			<div class="params-panel">
				<el-card class="parameters-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span class="header-title">仿真参数设置</span>
							<el-button
								type="primary"
								class="action-button"
								@click="changeAppearance"
							>
								<el-icon><VideoPlay /></el-icon>
								现象观察
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
								<el-radio-group
									v-model="water_level"
									class="radio-options"
									@change="handleParamChange('water_level')"
								>
									<el-radio
										v-for="item in getRadiosByType('water_level')"
										:key="item.id"
										:label="item.content"
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
									@change="handleParamChange('wave_direction')"
								>
									<el-radio
										v-for="item in getRadiosByType('wave_direction')"
										:key="item.id"
										:label="item.content"
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
								<el-radio-group
									v-model="embank_ment"
									class="radio-options embank-options"
									@change="handleParamChange('embank_ment')"
								>
									<el-radio
										v-for="item in getRadiosByType('embank_ment')"
										:key="item.id"
										:label="item.content"
										border
									>
										{{ item.content }}
									</el-radio>
								</el-radio-group>
							</div>
						</div>
					</div>
				</el-card>
			</div>

			<!-- 右侧内容和视频区域 -->
			<div class="content-image-panel">
				<!-- 工况说明区域 -->
				<el-card class="content-card" shadow="hover" v-loading="contentLoading">
					<template #header>
						<div class="card-header">
							<span class="header-title">
								工况说明
							</span>
							<el-tag size="small" :type="contentChanged ? 'success' : 'info'">
								{{ contentChanged ? '内容已更新' : '当前工况' }}
							</el-tag>
						</div>
					</template>
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
					<el-empty
						v-else
						description="暂无工况说明"
						:image-size="80"
					></el-empty>
				</el-card>

				<!-- 视频区域 -->
				<el-card class="video-card" shadow="hover" v-loading="videoLoading">
					<template #header>
						<div class="card-header">
							<span class="header-title">
								仿真模拟现象
							</span>
							<div class="params-summary">
								<el-tag size="small" type="primary">{{ water_level }}</el-tag>
								<el-tag size="small" type="success">{{
									wave_direction
								}}</el-tag>
								<el-tag size="small" type="warning">{{ embank_ment }}</el-tag>
							</div>
						</div>
					</template>
					<div class="video-container">
						<div class="video">
							<div class="video-location">
								<div v-if="destroy" ref="videoEl"></div>
								<el-empty
									v-if="!videoSrc"
									description="请点击现象观察按钮加载视频"
									:image-size="100"
									class="video-empty"
								></el-empty>
							</div>
						</div>
					</div>
				</el-card>
			</div>
		</div>
	</div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { mapGetters } from 'vuex';
import Constants from '../../utils/Constants.js';
import { addUserScore, getUserInfo } from '../../api/service/user';
import { getChooseFindAll } from '../../api/service/choose';
import { contentSearchChooseId } from '../../api/service/content';
import { getPortMapFindAll } from '../../api/service/portmap';
import { videoSearchFindOne } from '../../api/service/video';
// 引入西瓜播放器
import Player from 'xgplayer';
import {
	VideoPlay,
	Odometer,
	Location,
	Setting,
	Document,
	VideoCameraFilled,
} from '@element-plus/icons-vue';

export default {
	name: 'ProjectRoute',
	components: {
		VideoPlay,
		Odometer,
		Location,
		Setting,
		Document,
		VideoCameraFilled,
	},
	data() {
		return {
			content: '',
			radioList: [],
			contentLoading: false,
			videoLoading: false,
			contentChanged: false,
			currentParamId: null,

			// 选择框的值
			water_level: '极端高水位',
			wave_direction: 'SW',
			embank_ment: '无堤',

			// 视频相关
			videoSrc: '',
			videoPlayer: null,
			destroy: true,

			// 分页参数
			page: {
				pageNum: 1,
				pageSize: 20,
			},
		};
	},
	computed: {
		...mapGetters('user', {
			userInfo: 'userInfo',
		}),
	},
	mounted() {
		this.portMapFindAll();
		this.chooseFindAll();
		this.checkUrlParams();

		// 获取浏览器宽度处理响应式
		this.updateSize();
		window.addEventListener('resize', this.updateSize);
	},
	beforeUnmount() {
		// 组件卸载时清理播放器
		if (this.videoPlayer) {
			this.videoPlayer.destroy();
			this.videoPlayer = null;
		}
		window.removeEventListener('resize', this.updateSize);
	},
	methods: {
		// 按类型分组的单选按钮
		getRadiosByType(type) {
			if (!this.radioList || this.radioList.length === 0) return [];

			if (type === 'water_level') {
				return this.radioList.slice(0, 4);
			} else if (type === 'wave_direction') {
				return this.radioList.slice(4, 7);
			} else if (type === 'embank_ment') {
				return this.radioList.slice(7, 11);
			}
			return [];
		},

		// 获取港口地图
		async portMapFindAll() {
			try {
				const params = {
					...this.page,
				};
				const result = await getPortMapFindAll(params);
				if (result.code === Constants.status.SUCCESS) {
					// 只需要获取，不需要显示
				} else {
					ElMessage.error(result.msg);
				}
			} catch (error) {
				console.error('获取图像错误:', error);
				ElMessage.error('获取图像出错，请稍后再试');
			}
		},

		// 添加用户等分
		async userAddScore(score, minScore) {
			try {
				const params = {
					id: this.userInfo.id,
					score: score,
				};
				// 获取该用户的分数
				const { data } = await getUserInfo(this.userInfo.id);
				if (data.score >= minScore && data.score < score) {
					const result = await addUserScore(params);
					if (result.code === Constants.status.SUCCESS) {
						ElMessage.success(result.msg);
					} else {
						ElMessage.error(result.msg);
					}
				}
			} catch (error) {
				console.error('更新分数错误:', error);
			}
		},

		// 获取左边选择
		async chooseFindAll() {
			try {
				const params = { ...this.page };
				const result = await getChooseFindAll(params);
				if (result.code === Constants.status.SUCCESS) {
					this.radioList = result.data.list || [];
					if (result.data.list && result.data.list.length > 0) {
						// 根据默认选择的water_level找到对应的ID
						const waterLevelItem = result.data.list.find(
							(item) => item.content === this.water_level
						);
						if (waterLevelItem) {
							this.getContentSearchChooseId(waterLevelItem.id);
						} else {
							this.getContentSearchChooseId(result.data.list[0].id);
						}
					}
				} else {
					ElMessage.error(result.msg);
				}
			} catch (error) {
				console.error('获取选项错误:', error);
				ElMessage.error('获取选项出错，请稍后再试');
			}
		},

		// 获取内容介绍
		async getContentSearchChooseId(choose_id) {
			this.contentLoading = true;
			try {
				const params = {
					choose_id,
				};
				this.currentParamId = choose_id;
				const result = await contentSearchChooseId(params);
				if (result.code === Constants.status.SUCCESS) {
					// 使用动画效果显示内容更新
					this.content = result.data.content || '';
					this.contentChanged = true;
					setTimeout(() => {
						this.contentChanged = false;
					}, 2000);
				} else {
					ElMessage.error(result.msg || '获取内容失败');
				}
			} catch (error) {
				console.error('获取内容错误:', error);
				ElMessage.error('获取内容出错，请稍后再试');
			} finally {
				this.contentLoading = false;
			}
		},

		// 处理参数变更
		handleParamChange(paramType) {
			let selectedItem;

			if (paramType === 'water_level') {
				selectedItem = this.getRadiosByType('water_level').find(
					(item) => item.content === this.water_level
				);
			} else if (paramType === 'wave_direction') {
				selectedItem = this.getRadiosByType('wave_direction').find(
					(item) => item.content === this.wave_direction
				);
			} else if (paramType === 'embank_ment') {
				selectedItem = this.getRadiosByType('embank_ment').find(
					(item) => item.content === this.embank_ment
				);
			}

			if (selectedItem && selectedItem.id !== this.currentParamId) {
				this.getContentSearchChooseId(selectedItem.id);
			}
		},

		// 获取视频并播放
		async getVideoSearch(params) {
			this.videoLoading = true;
			try {
				const result = await videoSearchFindOne(params);
				if (result.code === Constants.status.SUCCESS) {
					this.videoSrc = result.data.url;
					// 确保DOM更新后再初始化播放器
					this.$nextTick(() => {
						this.initVideoPlayer();
					});
				} else {
					ElMessage.error(result.msg);
				}
			} catch (error) {
				console.error('获取视频错误:', error);
				ElMessage.error('获取视频出错，请稍后再试');
			} finally {
				this.videoLoading = false;
			}
		},

		// 初始化视频播放器
		initVideoPlayer() {
			// 如果已有播放器实例，先销毁
			if (this.videoPlayer) {
				this.videoPlayer.destroy();
				this.videoPlayer = null;
			}

			// 创建新的播放器实例
			if (this.$refs.videoEl && this.videoSrc) {
				this.videoPlayer = new Player({
					el: this.$refs.videoEl,
					url: this.videoSrc,
					// 流式布局
					fitVideoSize: 'auto',
					fluid: true,
					preloadTime: 10,
					// 初始音量
					volume: 0.8,
					// 自动播放
					autoplay: true,
					// 内联模式
					playsinline: true,
					// 跨域
					cors: true,
					// 初始化显示视频首帧
					videoInit: true,
					// 网页全屏
					cssFullscreen: true,
					controls: false,
					errorTips: `请<span>刷新</span>测试哦`,
				});

				// 注册视频结束事件，视频播放完成，学生成绩加分
				this.videoPlayer.once('ended', () => {
					setTimeout(() => {
						if (this.videoPlayer.ended) {
							this.userAddScore(80, 60);
						}
					}, 500);
				});
			}
		},

		// 点击现象观察按钮
		changeAppearance() {
			// 重置视频容器
			this.destroy = false;
			this.$nextTick(() => {
				this.destroy = true;
				this.$nextTick(() => {
					// 获取视频
					const params = {
						water_level: this.water_level,
						wave_direction: this.wave_direction,
						embank_ment: this.embank_ment,
					};
					this.getVideoSearch(params);
				});
			});
		},

		// 检查URL参数
		checkUrlParams() {
			const query = this.$route.query;
			if (Object.keys(query).length > 0) {
				this.water_level = query.water_level || '极端高水位';
				this.wave_direction = query.wave_direction || 'SW';
				this.embank_ment = query.embank_ment || '无堤';

				// 更新内容
				this.chooseFindAll();
			}
		},

		// 更新响应式布局
		updateSize() {
			const viewportWidth = document.documentElement.clientWidth;
			if (viewportWidth >= 1920) {
				this.$store.dispatch('app/changeState', { key: 'size', val: 'xl' });
			} else if (viewportWidth < 1920 && viewportWidth >= 1200) {
				this.$store.dispatch('app/changeState', { key: 'size', val: 'lg' });
			} else if (viewportWidth < 1200 && viewportWidth >= 992) {
				this.$store.dispatch('app/changeState', { key: 'size', val: 'md' });
			} else if (viewportWidth < 992 && viewportWidth >= 768) {
				this.$store.dispatch('app/changeState', { key: 'size', val: 'sm' });
			} else {
				this.$store.dispatch('app/changeState', { key: 'size', val: 'xs' });
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.project-route {
	height: 100%;
	width: 100%;
	box-sizing: border-box;

	.scene-container {
		display: flex;
		gap: 12px;
		height: 100%;
		width: 100%;
	}

	/* 左侧参数设置面板 */
	.params-panel {
		flex: 0.4; /* 参数设置占40%空间 */
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
							gap: 5px;
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
				}
			}
		}
	}

	/* 右侧内容和图片面板 */
	.content-image-panel {
		flex: 0.6; /* 右侧内容和视频占60%空间 */
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 12px;

		/* 工况说明卡片 */
		.content-card {
			flex: 0.35; /* 内容占35%高度 */
			min-height: 150px;
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
				}
			}

			.content-area {
				height: 100%;

				.content-list {
					padding: 15px;

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

		/* 视频卡片 */
		.video-card {
			flex: 0.65; /* 视频占65%高度 */
			min-height: 300px;
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
				background-color: #000; /* 视频背景设为黑色 */
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

				.params-summary {
					display: flex;
					gap: 8px;

					:deep(.el-tag) {
						border-radius: 4px;
					}
				}
			}

			.video-container {
				width: 100%;
				height: 100%;

				.video {
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;

					.video-location {
						width: 100%;
						height: 100%;
						position: relative;

						.video-empty {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							display: flex;
							align-items: center;
							justify-content: center;

							:deep(.el-empty__description) {
								color: #ffffff;
							}
						}
					}
				}
			}
		}
	}

	/* 添加自定义图标样式 */
	.el-icon-video-play:before {
		content: '\e6e0';
	}

	.el-icon-water-level:before {
		content: '\e79a'; /* 使用合适的水平/测量图标 */
	}

	.el-icon-location:before {
		content: '\e7f1';
	}

	.el-icon-setting:before {
		content: '\e6ca';
	}

	.el-icon-document:before {
		content: '\e6b4';
	}

	.el-icon-video-camera:before {
		content: '\e6e7';
	}

	/* 图标通用样式 */
	[class^='el-icon-'] {
		margin-right: 5px;
		font-size: 16px;
	}

	/* 参数设置面板 */
	.params-panel {
		.section-title [class^='el-icon-'] {
			color: #1e40af;
		}
	}

	/* 内容和视频面板 */
	.content-image-panel {
		.header-title [class^='el-icon-'] {
			color: #0369a1;
		}
	}
}

/* 响应式布局 */
@media (max-width: 1024px) {
	.project-route .scene-container {
		flex-direction: column;

		.params-panel {
			flex: none;
			width: 100%;
			margin-bottom: 12px;
			height: auto;
			min-height: 450px; /* 确保参数设置区域有足够的高度 */
		}

		.content-image-panel {
			flex: none;
			width: 100%;
			height: 60vh; /* 设定一个合理的视口高度 */
		}
	}
}

@media (max-width: 768px) {
	.project-route .scene-container {
		.content-image-panel {
			height: auto;
			min-height: 500px;

			.content-card {
				min-height: 180px;
			}

			.video-card {
				min-height: 300px;
			}
		}
	}
}
</style>
