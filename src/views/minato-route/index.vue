<template>
	<div class="minato-route">
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
					<div class="video">
						<div class="video-location">
							<div ref="video"></div>
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
// 港区漫游
import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";
import Player from "xgplayer";
export default {
	name: "MinatoRoute",
	data() {
		return {
			content: "",
			videoSrc: "", // 视频播放地址
			legend: "",
			// 实例化播放器
			videoPlayer: null,
			page: {
				pageNum: 1,
				pageSize: 20,
			},
		};
	},
	components: {},
	computed: {
		...mapGetters("user", {
			userInfo: "userInfo",
		}),
	},
	watch: {},
	mounted() {
		this.contentFindAll();
		this.getVideoSearchOne();
	},

	methods: {
		// 西瓜播放器实例化
		getVideo() {
			this.videoPlayer = new Player({
				el: this.$refs.video,
				url: this.videoSrc,
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
			this.videoPlayer.once("ended", () => {
				setTimeout(() => {
					this.getUserAddScore(this.videoPlayer.ended);
				}, 500);
			});
		},

		// 判断视频播放结束，进行加分
		async getUserAddScore(val) {
			const params = {
				id: this.userInfo.id,
				score: 40,
			};
			if (val) {
				// 获取该用户的分数，如果分数大于等于20，那么不触发加法
				const userInfo = await this.$api.getUserInfo(this.userInfo.id);
				if (userInfo.data.score >= 20 && userInfo.data.score < 40) {
					await this.$api.getUserAddScore(params).then((res) => {
						if (res.status === this.$Constants.status.SUCCESS) {
							ElMessage.success(res.msg);
						} else {
							ElMessage.error(res.msg);
						}
					});
				}
			}
		},

		// 获取操作说明的内容
		async contentFindAll() {
			await this.$api.contentFindAll(this.page).then((res) => {
				if (res.status === this.$Constants.status.SUCCESS) {
					this.legend = res.data.list[0].content;
					this.content = res.data.list[1].content;
				} else {
					ElMessage.error(res.msg);
				}
			});
		},

		// 获取一个视频
		async getVideoSearchOne() {
			const name = "portroam.mp4";
			await this.$api.getVideoSearchOne(name).then((res) => {
				if (res.status === this.$Constants.status.SUCCESS) {
					this.videoSrc = res.data.url;
					ElMessage.success(res.msg);
					this.getVideo();
				} else {
					ElMessage.error(res.msg);
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.minato-route {
	.legend {
		height: 80vh;
		padding: 20px 0;
		margin-left: 16px;
		margin-right: 16px;
		font-size: 1rem;
		font-weight: 600;
		.content {
			font-size: 0.9rem;
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
