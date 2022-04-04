<template>
	<div class="minato-route">
		<el-row :gutter="12">
			<el-col :span="6">
				<MianLeft>
					<div class="legend">
						操作说明
						<div class="content">{{ legend }}</div>
					</div>
				</MianLeft>
			</el-col>
			<el-col :span="12">
				<MainCenter>
					<div class="video">
						<div class="video-location">
							<div ref="video"></div>
						</div>
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
import { ElMessage } from "element-plus";
import Player from "xgplayer";
import Constants from "../../utils/Constants.js";
import { addUserScore, getUserInfo } from "../../api/service/user";
import { videoFindAll } from "../../api/service/video";
import { contentFindAll } from "../../api/service/content";

const store = useStore();
// 获取用户信息
const userInfo = computed(() => store.getters["user/userInfo"]);
const legend = ref("");
const content = ref("");
const page = ref({
	pageNum: 1,
	pageSize: 20,
});
const videoSrc = ref(""); // 视频播放地址
const videoPlayer = ref(null); // 实例化播放器
const video = ref(null);

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

// 获取一个视频
const getVideoFindAll = async () => {
	const params = { ...page.value };
	const result = await videoFindAll(params);
	if (result.code === Constants.status.SUCCESS) {
		videoSrc.value = result.data.list[0].url;
		getVideo();
	} else {
		ElMessage.error(result.msg);
	}
};
getVideoFindAll();

const getVideo = async () => {
	videoPlayer.value = new Player({
		el: video.value,
		url: videoSrc.value,
		// 流式布局
		fitVideoSize: "auto",
		fluid: true,
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
</script>

<style lang="scss" scoped>
.minato-route {
	.legend {
		height: 80vh;
		padding: 10px 0;
		margin-left: 16px;
		margin-right: 16px;
		font-size: 1.1rem;
		font-weight: 600;
		.content {
			font-size: 1rem;
			font-weight: 500;
			margin-top: 6px;
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
			padding: 6px 6px;
			.item {
				font-size: 1rem;
			}
		}
	}
}
</style>
