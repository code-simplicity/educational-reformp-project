<template>
	<div class="home">
		<el-row :gutter="12">
			<el-col :span="7">
				<MianLeft>
					<div class="legend">
						操作说明
						<div class="content">{{ legend }}</div>
					</div>
				</MianLeft>
			</el-col>
			<el-col :span="10">
				<MainCenter>
					<div class="image">
						<el-image
							style="height: 100%; width: 100%"
							:src="imageUrl"
							fit="fill"
						></el-image>
					</div>
				</MainCenter>
			</el-col>
			<el-col :span="7">
				<MianRight>
					<div class="content border-bottom">
						<div class="content-list">
							<el-scrollbar height="12rem">
								<p class="item">{{ content }}</p>
							</el-scrollbar>
						</div>
					</div>
				</MianRight>
			</el-col>
		</el-row>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import Constants from "../../utils/Constants.js";
import { addUserScore, getUserInfo } from "../../api/service/user";
import { contentFindAll } from "../../api/service/content";
import { getPortMapFindAll } from "../../api/service/portmap";
const store = useStore();
// 获取用户信息
const userInfo = computed(() => store.getters["user/userInfo"]);
const legend = ref("");
const content = ref("");
const page = ref({
	pageNum: 1,
	pageSize: 20,
});
const imageUrl = ref("");
const getContentFindAll = async () => {
	const params = {
		...page.value,
	};
	const result = await contentFindAll(params);
	if (result.code === Constants.status.SUCCESS) {
		legend.value = result.data.list[0].content;
		content.value = result.data.list[0].content;
	} else {
		ElMessage.error(result.msg);
	}
};
getContentFindAll();

// 获取港口地图
const portMapFindAll = async () => {
	const params = {
		...page.value,
	};
	const result = await getPortMapFindAll(params);
	if (result.code === Constants.status.SUCCESS) {
		imageUrl.value = result.data.list[0].url;
		setTimeout(() => {
			userAddScore();
		}, 6000);
	} else {
		ElMessage.error(result.msg);
	}
};
portMapFindAll();

// 添加用户等分
const userAddScore = async () => {
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
</script>

<style lang="scss" scoped>
.home {
	.legend {
		padding: 10px 0;
		height: 80vh;
		margin-left: 16px;
		margin-right: 16px;
		font-size: 1rem;
		font-weight: 600;
		.content {
			font-size: 1rem;
			font-weight: 500;
			margin-top: 6px;
		}
	}
	.image {
		width: 100%;
		height: 100%;
		background-size: 100%;
	}
	.content {
		.content-list {
			padding: 6px 0 0 6px;
			.item {
				padding: 0 16px 0 0;
				font-size: 0.9rem;
				font-weight: 500;
				line-height: 20px;
			}
		}
	}
}
</style>
