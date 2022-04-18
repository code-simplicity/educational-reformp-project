<template>
	<div class="minato-route">
		<el-row :gutter="12">
			<el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
				<MianLeft>
					<div class="legend">
						操作说明
						<div class="content">{{ legend }}</div>
					</div>
				</MianLeft>
			</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
				<MainCenter>
					<BimModel />
				</MainCenter>
			</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
				<MianRight>
					<div class="content border-bottom">
						<div class="content-list">
							<p class="item">{{ content }}</p>
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
import BimModel from "../../components/bim-model/bim-model.vue";

const store = useStore();
// 获取用户信息
const userInfo = computed(() => store.getters["user/userInfo"]);
const legend = ref("");
const content = ref("");
const page = ref({
	pageNum: 1,
	pageSize: 20,
});

const getContentFindAll = async () => {
	const params = {
		...page.value,
	};
	const result = await contentFindAll(params);
	if (result.code === Constants.status.SUCCESS) {
		legend.value = result.data.list[0].content;
		content.value = result.data.list[1].content;
	} else {
		ElMessage.error(result.msg);
	}
};
getContentFindAll();

// 添加用户等分
const userAddScore = async () => {
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
};
userAddScore();
</script>

<style lang="scss" scoped>
.minato-route {
	.legend {
		height: 80vh;
		padding: 10px 0;
		margin-left: 16px;
		margin-right: 16px;
		font-size: 18px;
		font-weight: 600;
		.content {
			font-size: 16px;
			font-weight: 500;
			margin-top: 6px;
		}
	}

	.content {
		.content-list {
			padding: 6px 6px;
		}
	}
}
</style>
