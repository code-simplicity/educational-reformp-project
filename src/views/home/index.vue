<template>
	<div class="home">
		<div class="home-container">
			<!-- 左侧区域 -->
			<div class="left-section">
				<!-- 操作说明区域 -->
				<el-card
					class="instruction-card"
					shadow="hover"
					v-loading="loading.content"
				>
					<template #header>
						<div class="card-header">
							<span class="header-title">操作说明</span>
						</div>
					</template>
					<div v-if="legend" class="instruction-content">{{ legend }}</div>
					<el-empty
						v-else
						description="暂无操作说明"
						:image-size="80"
					></el-empty>
				</el-card>

				<!-- 团队信息区域 -->
				<el-card class="team-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<div class="header-title-container">
								<span class="header-title">水运工程仿真实验系统建设团队</span>
								<div class="thanks-text">
									衷心感谢各位成员付出的辛勤努力和充满灵感的创意！
								</div>
							</div>
						</div>
					</template>
					<el-scrollbar height="calc(100% - 20px)" class="team-scrollbar">
						<div class="team-list">
							<div
								v-for="(item, index) in teamInfo"
								:key="index"
								class="team-item"
							>
								<div class="team-role">{{ item.role }}：</div>
								<div class="team-members">{{ item.members }}</div>
							</div>
							<div class="team-item">
								<div class="team-role">反馈邮箱：</div>
								<el-link
									type="primary"
									:href="`mailto:${contactEmail}`"
									class="email-link"
								>
									{{ contactEmail }}
								</el-link>
							</div>
						</div>
					</el-scrollbar>
				</el-card>
			</div>

			<!-- 右侧区域 -->
			<div class="right-section">
				<!-- 包含水位说明和图片的卡片 -->
				<el-card
					class="image-container-card"
					shadow="hover"
					v-loading="loading.image || loading.content"
				>
					<!-- 水位说明区域 -->
					<div v-if="content" class="water-level-container" ref="waterLevelRef">
						<div class="water-level-header">
							<span class="water-level-title">水位说明</span>
						</div>
						<div class="water-level-content">{{ content }}</div>
					</div>
					<el-empty
						v-else
						class="water-level-empty"
						ref="waterLevelRef"
						description="暂无水位说明"
						:image-size="80"
					></el-empty>

					<!-- 图片展示区域 -->
					<div class="image-container" :style="imageContainerStyle">
						<el-image
							v-if="imageUrl"
							class="main-image"
							:src="imageUrl"
							fit="cover"
							:preview-src-list="[imageUrl]"
							@load="handleImageLoad"
							@error="handleImageError"
						/>
						<el-empty
							v-else
							description="暂无图片"
							:image-size="100"
							class="empty-image"
						></el-empty>
					</div>
				</el-card>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick, onUpdated } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { Picture, Loading } from '@element-plus/icons-vue';
import Constants from '../../utils/Constants.js';
import { addUserScore, getUserInfo } from '../../api/service/user';
import { contentFindAll } from '../../api/service/content';
import { getPortMapFindAll } from '../../api/service/portmap';

const store = useStore();
// 获取用户信息
const userInfo = computed(() => store.getters['user/userInfo']);
const legend = ref('');
const content = ref('');
const imageUrl = ref('');
const contactEmail = 'jiang.xuelian@tcu.edu.cn';
const waterLevelRef = ref(null);
const waterLevelHeight = ref(0);

// 计算图片容器的样式
const imageContainerStyle = computed(() => {
	return {
		height:
			waterLevelHeight.value > 0
				? `calc(100% - ${waterLevelHeight.value}px)`
				: 'calc(100% - 80px)', // 默认至少预留80px给水位说明
		minHeight: '300px', // 保持最小高度
	};
});

// 更新水位说明区域高度
const updateWaterLevelHeight = () => {
	if (waterLevelRef.value) {
		nextTick(() => {
			waterLevelHeight.value = waterLevelRef.value.offsetHeight;
		});
	}
};

// 团队信息数据结构
const teamInfo = [
	{ role: '系统架构', members: '费翔，杜培义，胡德' },
	{ role: 'BIM建模', members: '马朋飞，谷雪清，吴潇' },
	{ role: '波浪模拟', members: '蒋学炼，米万里，刘文龙' },
	{ role: '后台管理', members: '张娜，杨伟超，宋吉宁，杨德健' },
	{
		role: '技术支持',
		members:
			'高刚刚，刘烽，刘珂铖，刘轲航，刘亮杰，刘文婷，唐浩，王忠宇，夏和政，杨建丰，余澳，余润晨，张朋，庄景晨',
	},
];

// 加载状态
const loading = reactive({
	content: true,
	image: true,
});

// 分页参数
const page = ref({
	pageNum: 1,
	pageSize: 20,
});

// 获取内容数据
const getContentFindAll = async () => {
	loading.content = true;
	try {
		const params = {
			...page.value,
		};
		const result = await contentFindAll(params);
		if (result.code === Constants.status.SUCCESS) {
			legend.value = result.data.list[0]?.content || '';
			content.value = result.data.list[1]?.content || '';

			// 等待DOM更新后计算水位说明高度
			nextTick(() => {
				updateWaterLevelHeight();
			});
		} else {
			ElMessage.error(result.msg);
		}
	} catch (error) {
		console.error('获取内容错误:', error);
		ElMessage.error('获取内容出错，请稍后再试');
	} finally {
		loading.content = false;
	}
};

// 获取港口地图
const portMapFindAll = async () => {
	loading.image = true;
	try {
		const params = {
			...page.value,
		};
		const result = await getPortMapFindAll(params);
		if (result.code === Constants.status.SUCCESS) {
			imageUrl.value = result.data.list[0]?.url || '';
		} else {
			ElMessage.error(result.msg);
		}
	} catch (error) {
		console.error('获取地图错误:', error);
		ElMessage.error('获取地图出错，请稍后再试');
	} finally {
		loading.image = false;
	}
};

// 图片加载完成处理
const handleImageLoad = () => {
	setTimeout(() => {
		userAddScore();
	}, 6000);
};

// 图片加载错误处理
const handleImageError = () => {
	ElMessage.warning('图片加载失败');
};

// 添加用户等分 - 保持原有逻辑不变
const userAddScore = async () => {
	if (!userInfo.value?.id) {
		return;
	}
	const params = {
		id: userInfo.value.id,
		score: 20,
	};
	// 获取该用户的分数，如果分数大于等于20，那么不触发加法
	const { data } = await getUserInfo(userInfo.value.id);
	if (data.score >= 0 && data.score < 20) {
		const result = await addUserScore(params);
		if (result.code === Constants.status.SUCCESS) {
			ElMessage.success(result.msg);
		} else {
			ElMessage.error(result.msg);
		}
	}
};

// 窗口大小改变时重新计算高度
window.addEventListener('resize', updateWaterLevelHeight);

onMounted(() => {
	Promise.all([getContentFindAll(), portMapFindAll()]);

	// 初始计算水位说明高度
	nextTick(() => {
		updateWaterLevelHeight();
	});
});

onUpdated(() => {
	// 当组件更新时再次计算高度
	updateWaterLevelHeight();
});
</script>

<style lang="scss" scoped>
.home {
	height: 100%;
	width: 100%;

	.home-container {
		display: flex;
		height: 100%;
		width: 100%;
		gap: 12px; /* 统一使用gap为12px */
	}

	/* 左侧区域样式 */
	.left-section {
		flex: 0.4; /* 左侧占据40%的空间 */
		min-width: 280px; /* 确保最小宽度 */
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 12px;

		.instruction-card {
			flex-shrink: 0;
			min-height: 120px; /* 设置最小高度 */

			:deep(.el-card__header) {
				padding: 12px 15px;
				background-color: #f0f9ff;
				border-bottom: 1px solid #bae6fd;
			}

			.card-header {
				display: flex;
				align-items: center;
				justify-content: center;

				.header-title {
					font-size: 16px;
					font-weight: 600;
					color: #0369a1;
				}
			}

			.instruction-content {
				color: #334155;
				line-height: 1.6;
				font-size: 14px;
				white-space: pre-line; /* 保留换行符 */
				max-height: 200px; /* 限制最大高度 */
				overflow-y: auto; /* 如果内容过多，允许滚动 */
			}
		}

		.team-card {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			min-height: 200px; /* 设置最小高度 */

			:deep(.el-card__header) {
				padding: 12px 15px;
				background-color: #f0f9ff;
				border-bottom: 1px solid #bae6fd;
			}

			.header-title-container {
				text-align: center;

				.header-title {
					font-size: 16px;
					font-weight: 600;
					color: #0369a1;
					display: block;
					margin-bottom: 6px;
				}

				.thanks-text {
					font-size: 13px;
					color: #0369a1;
					line-height: 1.5;
				}
			}

			:deep(.el-card__body) {
				padding: 0;
				height: calc(100% - 70px); /* 调整以适应更高的标题区域 */
				overflow: hidden;
			}

			.team-list {
				padding: 12px 15px;

				.team-item {
					margin-bottom: 12px;

					.team-role {
						font-weight: 600;
						color: #0369a1;
						font-size: 14px;
						margin-bottom: 3px;
					}

					.team-members {
						color: #475569;
						font-size: 13px;
						line-height: 1.5;
					}

					.email-link {
						font-size: 13px;
					}
				}
			}
		}
	}

	/* 右侧区域样式 */
	.right-section {
		flex: 1; /* 右侧占据剩余空间 */
		height: 100%;
		display: flex;

		.image-container-card {
			width: 100%;
			display: flex;
			flex-direction: column;

			:deep(.el-card__body) {
				flex: 1;
				padding: 0;
				display: flex;
				flex-direction: column;
				overflow: hidden;
			}

			.water-level-container {
				background-color: #f0f9ff;
				border-bottom: 1px solid #bae6fd;
				min-height: 80px; /* 设置最小高度 */
				max-height: 150px; /* 确保不超过主区域高度 */
				overflow-y: auto; /* 如果内容过多，可以滚动查看 */
				flex-shrink: 0; /* 防止高度被压缩 */

				.water-level-header {
					padding: 8px 15px;
					text-align: center;
					background-color: #e0f2fe;
					border-bottom: 1px solid #bae6fd;
					position: sticky; /* 标题固定在顶部 */
					top: 0;
					z-index: 1;

					.water-level-title {
						font-size: 16px;
						font-weight: 600;
						color: #0369a1;
					}
				}

				.water-level-content {
					padding: 10px 15px;
					color: #334155;
					line-height: 1.5;
					font-size: 14px;
				}
			}

			.water-level-empty {
				min-height: 80px;
				padding: 10px 0;
				background-color: #f0f9ff;
				border-bottom: 1px solid #bae6fd;
				flex-shrink: 0; /* 防止高度被压缩 */
			}

			.image-container {
				position: relative;
				width: 100%;
				overflow: hidden;
				flex: 1; /* 占据剩余高度 */

				.main-image {
					height: 100%;
					width: 100%;
					display: block;

					&:deep(.el-image__inner) {
						height: 100%;
						width: 100%;
						object-fit: cover;
					}
				}

				.empty-image {
					height: 100%;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}

	:deep(.el-empty) {
		padding: 20px 0;
	}
}

/* 媒体查询 - 在较小的屏幕上调整布局 */
@media (max-width: 992px) {
	.home .home-container {
		flex-direction: column;
	}

	.home .left-section,
	.home .right-section {
		flex: none;
		width: 100%;
	}

	.home .left-section {
		height: auto;
		min-height: 300px;
	}

	.home .right-section {
		height: 60vh; /* 在小屏幕上设置一个固定的视口高度 */
		min-height: 400px;
	}
}
</style>
