<template>
	<div class="project-route">
		<el-row :gutter="12">
			<el-col :span="6">
				<MianLeft>
					<div class="legend">
						<el-scrollbar>
							<div class="top">
								<div class="title">设计水位</div>
								<div class="radio-check">
									<el-radio-group
										v-for="item in radioList.slice(0, 4)"
										:key="item.id"
										v-model="water_level"
										@change="getContentSearchChooseId(item.id)"
									>
										<el-radio :label="item.content">{{
											item.content
										}}</el-radio>
									</el-radio-group>
								</div>
							</div>
							<div class="center">
								<div class="title">波浪来向</div>
								<div class="radio-check">
									<el-radio-group
										v-for="item in radioList.slice(4, 7)"
										:key="item.id"
										v-model="wave_direction"
										@change="getContentSearchChooseId(item.id)"
									>
										<el-radio :label="item.content">{{
											item.content
										}}</el-radio>
									</el-radio-group>
								</div>
							</div>
							<div class="bottom">
								<div class="title">外堤布置</div>
								<div class="radio-check">
									<el-radio-group
										v-for="item in radioList.slice(7, 11)"
										:key="item.id"
										v-model="embank_ment"
										@change="getContentSearchChooseId(item.id)"
									>
										<el-radio :label="item.content">{{
											item.content
										}}</el-radio>
									</el-radio-group>
								</div>
							</div>
						</el-scrollbar>

						<div class="botton-click">
							<div class="botton" @click="toAppearance">现象观察</div>
						</div>
					</div>
				</MianLeft>
			</el-col>
			<el-col :span="12">
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
			<el-col :span="6">
				<MianRight>
					<div class="content border-bottom">
						<div class="content-list">
							<el-scrollbar height="200px">
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
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import Constants from "../../utils/Constants.js";
import { addUserScore, getUserInfo } from "../../api/service/user";
import { getChooseFindAll } from "../../api/service/choose";
import { getPortMapFindAll } from "../../api/service/portmap";
import { contentSearchChooseId } from "../../api/service/content";
const store = useStore();
const router = useRouter();
// 获取用户信息
const userInfo = computed(() => store.getters["user/userInfo"]);
const content = ref("");
const page = ref({
	pageNum: 1,
	pageSize: 20,
});
const imageUrl = ref("");
const radioList = ref([]);
// 选择框的值,分别是水位，波浪方向，堤坝布置
const water_level = ref("极端高水位");
const wave_direction = ref("NW");
const embank_ment = ref("无堤");

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
		score: 60,
	};
	// 获取该用户的分数，如果分数大于等于20，那么不触发加法
	const { data } = await getUserInfo(userInfo.value.id);
	if (data.score >= 40 && data.score < 60) {
		const result = await addUserScore(params);
		if (result.code === Constants.status.SUCCESS) {
			ElMessage.success(result.msg);
		} else {
			ElMessage.error(result.msg);
		}
	}
};

// 获取左边选择
const chooseFindAll = async () => {
	const params = { ...page.value };
	const result = await getChooseFindAll(params);
	if (result.code === Constants.status.SUCCESS) {
		radioList.value = result.data.list;
		getContentSearchChooseId(result.data.list[0].id);
	} else {
		ElMessage.error(result.msg);
	}
};
chooseFindAll();

// 获取内容介绍
const getContentSearchChooseId = async (choose_id) => {
	const params = {
		choose_id,
	};
	const result = await contentSearchChooseId(params);
	if (result.code === Constants.status.SUCCESS) {
		content.value = result.data.content;
	} else {
		ElMessage.error(result.data);
	}
};

// 去现象观察
const toAppearance = async () => {
	router.push({
		name: "appearance-route",
		query: {
			water_level: water_level.value,
			wave_direction: wave_direction.value,
			embank_ment: embank_ment.value,
		},
	});
	userAddScore();
};
</script>

<style lang="scss" scoped>
.project-route {
	.legend {
		padding: 10px 0;
		margin-left: 16px;
		margin-right: 16px;
		position: relative;
		display: flex;
		flex-direction: column;
		.top {
		}
		.center {
			margin: 10px 0;
		}
		.bottom {
		}
		.title {
			font-size: 1.1rem;
			font-weight: 600;
			margin: 10px 0;
		}
		.radio-check {
			display: flex;
			flex-direction: column;
			margin-left: 40px;
			::v-deep .el-radio__label {
				font-size: 1rem;
				padding-left: 8px;
			}
		}
		.botton-click {
			position: absolute;
			top: 10px;
			right: 0;
			.botton {
				padding: 4px 8px;
				text-align: center;
				box-shadow: -1px 1px 5px rgb(0, 0, 0);
				background: #f3f3f3;
				cursor: pointer;
				font-weight: 600;
				font-size: 0.9rem;
				&:active {
					color: #ffffff;
					background: rgb(111, 125, 255);
				}
				&:hover {
					color: #ffffff;
					background: rgb(111, 125, 255);
				}
			}
		}
	}
	.image {
		height: 80vh;
		width: 100%;
		background-size: 100%;
	}
	.content {
		.content-list {
			padding: 6px 6px;
			.item {
				font-size: 1rem;
			}
		}
	}
}
</style>
