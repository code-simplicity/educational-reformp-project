<template>
	<div class="appearance-route">
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
							<div class="botton" @click="changeAppearance">现象观察</div>
						</div>
					</div>
				</MianLeft>
			</el-col>
			<el-col :span="12">
				<MainCenter>
					<div class="video">
						<div class="video-location">
							<div v-if="destroy" ref="video"></div>
						</div>
					</div>
				</MainCenter>
			</el-col>
			<el-col :span="6">
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
import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";
import Constants from "../../utils/Constants.js";
import { addUserScore, getUserInfo } from "../../api/service/user";
import { getChooseFindAll } from "../../api/service/choose";
import { contentSearchChooseId } from "../../api/service/content";
import { videoSearchFindOne } from "../../api/service/video";
// 工况选配
import Player from "xgplayer";
export default {
	name: "AppearanceRoute",
	data() {
		return {
			content: "",
			radioList: [],
			// 选择框的值
			water_level: "",
			wave_direction: "",
			embank_ment: "",
			// 路由返回的参数接收
			queryObj: {},
			// 视频地址
			videoSrc: "",
			// 实例化播放器
			videoPlayer: null,
			// 销毁播放器实例
			destroy: true,
			page: {
				pageNum: 1,
				pageSize: 20,
			},
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
				this.getVideoSearch(this.queryObj);
			}
		},
	},

	mounted() {
		this.getChooseFindAll();
		const queryObj = this.$route.query;
		if (Object.keys(queryObj).length > 0) {
			this.queryObj = queryObj;
			this.water_level = queryObj.water_level;
			this.wave_direction = queryObj.wave_direction;
			this.embank_ment = queryObj.embank_ment;
			this.getVideoSearch(this.queryObj);
		} else {
			this.water_level = "极端高水位";
			this.wave_direction = "NW";
			this.embank_ment = "无堤";
			const params = {
				water_level: "极端高水位",
				wave_direction: "NW",
				embank_ment: "无堤",
			};
			this.getVideoSearch(params);
		}
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
				score: 80,
			};
			// 获取该用户的分数，如果分数大于等于20，那么不触发加法
			if (val) {
				const { data } = await getUserInfo(this.userInfo.id);
				if (data.score >= 60 && data.score < 80) {
					const result = await addUserScore(params);
					if (result.code === Constants.status.SUCCESS) {
						ElMessage.success(result.msg);
					} else {
						ElMessage.error(result.msg);
					}
				}
			}
		},

		// 获取左边选择
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

		// 去现象观察
		changeAppearance() {
			const params = {
				water_level: this.water_level,
				wave_direction: this.wave_direction,
				embank_ment: this.embank_ment,
			};
			this.destroy = false;
			this.$nextTick(() => {
				this.destroy = true;
			});
			this.getVideoSearch(params);
		},

		// 获取演示视频
		async getVideoSearch(params) {
			const result = await videoSearchFindOne(params);
			if (result.code === Constants.status.SUCCESS) {
				this.videoSrc = result.data.url;
				this.getVideo();
			} else {
				ElMessage.error(result.msg);
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
				ElMessage.error(result.data);
			}
		},
	},
};
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
			font-size: 1.1rem;
			font-weight: 600;
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
