<template>
	<div class="appearance-route">
		<el-row :gutter="12">
			<el-col :span="7">
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
							<div class="botton" @click="changeAppearance">现象观察</div>
						</div>
					</div>
				</MianLeft>
			</el-col>
			<el-col :span="10">
				<MainCenter>
					<div class="video">
						<div class="video-location">
							<div v-if="destroy" ref="video"></div>
						</div>
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

<script>
export default {
	name: "AppearanceRoute",
};
</script>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Player from "xgplayer";
import { ElMessage } from "element-plus";
import Constants from "../../utils/Constants.js";
import { addUserScore, getUserInfo } from "../../api/service/user";
import { getChooseFindAll } from "../../api/service/choose";
import { contentSearchChooseId } from "../../api/service/content";
import { videoSearchFindOne } from "../../api/service/video";

const store = useStore();
// const router = useRouter();
const route = useRoute();
const content = ref("");
const radioList = ref([]);
const water_level = ref("");
const wave_direction = ref("");
const embank_ment = ref("");
const queryObj = ref({});
const videoSrc = ref("");
const videoPlayer = ref(null);
const video = ref(null);
const destroy = ref(true);
const page = ref({
	pageNum: 1,
	pageSize: 20,
});
const userInfo = computed(() => store.getters["user/userInfo"]);

// 添加用户等分
const userAddScore = async () => {
	const params = {
		id: userInfo.value.id,
		score: 80,
	};
	// 获取该用户的分数，如果分数大于等于20，那么不触发加法
	const { data } = await getUserInfo(userInfo.value.id);
	if (data.score >= 60 && data.score < 80) {
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

// 监听路由携带过来的值
watch(
	() => route.query,
	(newVal, oldVal) => {
		if (newVal.length > 0) {
			// 这里路由携带过来的两个值是否相等，如果不等，那么就把新的值给这个页面
			queryObj.value = newVal;
			water_level.value = newVal.water_level;
			wave_direction.value = newVal.wave_direction;
			embank_ment.value = newVal.embank_ment;
		} else {
			// 这里路由携带过来的两个值是否相等，如果不等，那么就把新的值给这个页面
			queryObj.value = oldVal;
			water_level.value = oldVal.water_level;
			wave_direction.value = oldVal.wave_direction;
			embank_ment.value = oldVal.embank_ment;
		}
	},
	{ deep: true }
);

// 西瓜播放器实例化
const getVideo = async () => {
	videoPlayer.value = new Player({
		el: video.value,
		url: videoSrc.value,
		// 流式布局
		fitVideoSize: "auto",
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
		errorTips: `请<spa>刷新</spa>测试哦`,
	});
	// 注册视频结束事件，视频播放完成，学生成绩加80
	videoPlayer.value.once("ended", () => {
		setTimeout(() => {
			userAddScore(videoPlayer.value.ended);
		}, 500);
	});
};

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

// 获取演示视频
const getVideoSearch = async (params) => {
	const result = await videoSearchFindOne(params);
	if (result.code === Constants.status.SUCCESS) {
		videoSrc.value = result.data.url;
		getVideo();
	} else {
		ElMessage.error(result.msg);
	}
};

// 改变相关的值
const changeAppearance = async () => {
	const params = {
		water_level: water_level.value,
		wave_direction: wave_direction.value,
		embank_ment: embank_ment.value,
	};
	destroy.value = false;
	nextTick(() => {
		destroy.value = true;
	});
	getVideoSearch(params);
};

onMounted(() => {
	const obj = route.query;
	console.log("obj :>> ", obj);
	if (obj.length > 0) {
		queryObj.value = obj;
		water_level.value = obj.water_level;
		wave_direction.value = obj.wave_direction;
		embank_ment.value = obj.embank_ment;
		console.log("queryObj :>> ", queryObj.value);
		getVideoSearch(queryObj.value);
	} else {
		water_level.value = "极端高水位";
		wave_direction.value = "NW";
		embank_ment.value = "无堤";
		const params = {
			water_level: "极端高水位",
			wave_direction: "NW",
			embank_ment: "无堤",
		};
		getVideoSearch(params);
	}
});
// 判断路由携带的值
// const routeWatch = async () => {

// };
// routeWatch();
</script>

<style lang="scss" scoped>
.appearance-route {
	.legend {
		padding: 10px 0;
		height: 80vh;
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
			font-size: 1rem;
			font-weight: 600;
		}
		.radio-check {
			display: flex;
			flex-direction: column;
			margin-left: 40px;
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
				font-size: 0.8rem;
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
	.video {
		width: 100%;
		background: $black;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		.video-location {
			width: 100%;
			.video-style {
				width: 100%;
				height: 100%;
			}
		}
	}
	.content {
		.content-list {
			padding: 6px 0 0 6px;
			.item {
				padding: 0 16px 0 0;
				font-size: 1rem;
				font-weight: 500;
				line-height: 20px;
			}
		}
	}
}
</style>
