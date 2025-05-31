<template>
	<div class="minato-route">
		<div class="scene-container">
			<!-- 左侧面板：包含操作说明和场景说明 -->
			<div class="left-panel">
				<!-- 操作说明区域 -->
				<el-card class="instruction-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span class="header-title">操作说明</span>
						</div>
					</template>
					<div v-if="legend" class="instruction-content">{{ legend }}</div>
					<el-empty v-else description="暂无操作说明" :image-size="80"></el-empty>
				</el-card>

				<!-- 场景说明区域 -->
				<el-card class="content-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span class="header-title">场景说明</span>
						</div>
					</template>
					<div v-if="content" class="content-area">
						<div class="content-list">
							<p class="item">{{ content }}</p>
						</div>
					</div>
					<el-empty v-else description="暂无场景说明" :image-size="80"></el-empty>
				</el-card>
			</div>

			<!-- 右侧工程场景区域 -->
			<div class="right-panel">
				<el-card class="model-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span class="header-title">工程场景</span>
						</div>
					</template>
					<div class="model-container">
						<!-- <BimModel /> -->
						<GltfModel />
					</div>
				</el-card>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import Constants from "../../utils/Constants.js";
import { addUserScore, getUserInfo } from "../../api/service/user";
import { contentFindAll } from "../../api/service/content";
import BimModel from "../../components/bim-model/bim-model.vue";
import GltfModel from "../../components/gltf-model/index.vue";

const store = useStore();
// 获取用户信息
const userInfo = computed(() => store.getters["user/userInfo"]);
const legend = ref("");
const content = ref("");
const page = ref({
	pageNum: 1,
	pageSize: 20,
});

// 获取内容数据
const getContentFindAll = async () => {
	try {
		const params = {
			...page.value,
		};
		const result = await contentFindAll(params);
		if (result.code === Constants.status.SUCCESS) {
			legend.value = result.data.list[0]?.content || "";
			content.value = result.data.list[1]?.content || "";
		} else {
			ElMessage.error(result.msg);
		}
	} catch (error) {
		console.error("获取内容错误:", error);
		ElMessage.error("获取内容出错，请稍后再试");
	}
};

// 添加用户等分
const userAddScore = async () => {
	try {
		const params = {
			id: userInfo.value.id,
			score: 40,
		};
		// 获取该用户的分数，如果分数大于等于20，那么不触发加法
		const { data } = await getUserInfo(userInfo.value.id);
		if (data.score >= 20 && data.score < 40) {
			const result = await addUserScore(params);
			if (result.code === Constants.status.SUCCESS) {
				ElMessage.success(result.msg);
			} else {
				ElMessage.error(result.msg);
			}
		}
	} catch (error) {
		console.error("更新分数错误:", error);
	}
};

onMounted(() => {
	getContentFindAll();
	userAddScore();
});
</script>

<style lang="scss" scoped>
.minato-route {
	height: 100%;
	width: 100%;
	box-sizing: border-box;

	.scene-container {
		display: flex;
		gap: 12px;
		height: 100%;
		width: 100%;
	}

	/* 左侧面板样式 - 包含操作说明和场景说明 */
	.left-panel {
		flex: 0.4; /* 左侧占比0.4 */
		min-width: 280px;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 12px;

		/* 操作说明卡片 */
		.instruction-card {
			flex: 1;
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
				padding: 12px;
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
				white-space: pre-line;
			}
		}

		/* 场景说明卡片 */
		.content-card {
			flex: 1;
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
				justify-content: center;

				.header-title {
					font-size: 16px;
					font-weight: 600;
					color: #0369a1;
				}
			}

			.content-area {
				height: 100%;

				.content-list {
					padding: 12px 15px;

					.item {
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

	/* 右侧工程场景区域 */
	.right-panel {
		flex: 1; /* 右侧占比1 */
		height: 100%;

		.model-card {
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
				justify-content: center;

				.header-title {
					font-size: 16px;
					font-weight: 600;
					color: #0369a1;
				}
			}

			.model-container {
				width: 100%;
				height: 100%;
				position: relative;
			}
		}
	}
}

/* 响应式布局 */
@media (max-width: 1024px) {
	.minato-route .scene-container {
		flex-direction: column;

		.left-panel {
			flex: none;
			width: 100%;
			flex-direction: row;
			height: auto;
			min-height: 200px;

			.instruction-card,
			.content-card {
				flex: 1;
				height: 100%;
			}
		}

		.right-panel {
			flex: none;
			width: 100%;
			height: 500px;
			margin-top: 12px;
		}
	}
}

@media (max-width: 768px) {
	.minato-route .scene-container {
		.left-panel {
			flex-direction: column;

			.instruction-card,
			.content-card {
				margin-bottom: 12px;
				height: 200px;
			}
		}

		.right-panel {
			height: 400px;
		}
	}
}
</style>
