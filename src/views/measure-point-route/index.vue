<template>
	<div class="measure-point-route">
		<el-row :gutter="12">
			<el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
				<MianLeft>
					<div class="legend">
						<div class="top">
							<div class="title">设计水位</div>
							<div class="radio-check">
								<el-radio-group
									v-for="item in radioList.slice(0, 4)"
									:key="item.id"
									v-model="water_level"
									@change="getContentSearchChooseId(item.id)"
								>
									<el-radio :label="item.content">{{ item.content }}</el-radio>
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
									<el-radio :label="item.content">{{ item.content }}</el-radio>
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
									<el-radio :label="item.content">{{ item.content }}</el-radio>
								</el-radio-group>
							</div>
						</div>

						<div class="botton-click">
							<div class="botton" @click="toMeasurePoint">测点数据</div>
						</div>
					</div>
				</MianLeft>
			</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
				<MainCenter>
					<div class="image">
						<div class="left">
							<el-image
								class="animate__animated animate__fadeInDown"
								style="height: 100%; width: 100%"
								:src="imageUrl"
								fit="fill"
								@click="changePoint"
							></el-image>
						</div>

						<div class="right-box">
							<div
								class="point-list border"
								v-for="item in pointList"
								:key="item.id"
								:class="activeContent === item.content ? 'active' : ''"
								@click="changeWaveFormsAndStats(item.content, item.id)"
							>
								<div class="content">{{ item.content }}</div>
							</div>
							<el-row :gutter="12">
								<el-col :span="24">
									<el-button type="success" size="small" @click="downloadExcel">
										<template #icon>
											<el-icon :size="16">
												<Download />
											</el-icon>
										</template>
										本工况数据下载</el-button
									>
								</el-col>
							</el-row>
						</div>
					</div>
				</MainCenter>
			</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
				<MianRight>
					<transition name="slide">
						<div class="right-box">
							<div class="content border-bottom">
								<div class="content-list">
									<p class="item">{{ content }}</p>
								</div>
							</div>
							<div class="wave-forms">
								<el-image
									style="height: 100%; width: 100%"
									:src="waveFormsUrl"
									fit="contain"
								></el-image>
							</div>
							<el-divider />
							<div class="wave-stats">
								<el-image
									style="height: 100%; width: 100%"
									:src="waveStatsUrl"
									fit="contain"
								></el-image>
							</div>
						</div>
					</transition>
				</MianRight>
			</el-col>
		</el-row>
	</div>
</template>

<script>
// 测点数据
import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";
import Constants from "../../utils/Constants.js";
import { addUserScore, getUserInfo } from "../../api/service/user";
import { getChooseFindAll } from "../../api/service/choose";
import { contentSearchChooseId } from "../../api/service/content";
import { portPointMapSearchFindOne } from "../../api/service/portpointmap";
import { getPointByPointMapFindAll } from "../../api/service/point";
import { getWaveformsSearchPointId } from "../../api/service/waveforms";
import { getWavestatsSearchPointId } from "../../api/service/wavestats";
import { getWaveDataExcelByPortMapPointId } from "../../api/service/wavedataexcel";
import utils from "../../utils/utils";
import { Download } from "@element-plus/icons-vue";
export default {
	name: "MeasurePointRoute",
	data() {
		return {
			content: "",
			imageUrl: "", // 图片的路径
			radioList: [],
			// 选择框的值,分别是水位，波浪方向，堤坝布置
			water_level: "",
			wave_direction: "",
			embank_ment: "",
			// 激活内容
			activeContent: "1",
			// 展示点位选择列表
			showPoint: false,
			pointList: [],
			// 波形图
			waveFormsUrl: "",
			// 波形统计图
			waveStatsUrl: "",
			page: {
				pageNum: 1,
				pageSize: 50,
			},
			// 港口点位地图的id
			portPointMapId: "",
		};
	},
	components: { Download },
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
				this.getPortPointMapSearch(this.queryObj);
			}
		},
	},
	mounted() {
		this.getChooseFindAll();
		const queryObj = this.$route.query;
		if (Object.keys(queryObj).length > 0) {
			this.water_level = queryObj.water_level;
			this.wave_direction = queryObj.wave_direction;
			this.embank_ment = queryObj.embank_ment;
			this.getPortPointMapSearch(queryObj);
		} else {
			this.water_level = "极端高水位";
			this.wave_direction = "NW";
			this.embank_ment = "无堤";
			const params = {
				water_level: this.water_level,
				wave_direction: this.wave_direction,
				embank_ment: this.embank_ment,
			};
			this.getPortPointMapSearch(params);
		}
	},
	methods: {
		// 下载excel
		async downloadExcel() {
			const params = {
				port_point_map_id: this.portPointMapId,
			};
			const result = await getWaveDataExcelByPortMapPointId(params);
			if (result.code === Constants.status.SUCCESS) {
				// 将url传递出去
				ElMessage.success(result.msg);
				window.open(`${result.data.url}`);
			} else {
				ElMessage.error(result.msg);
			}
		},
		// 左侧获取图片
		async changeWaveFormsAndStats(content, point_id) {
			this.activeContent = content;
			this.getWaveformsSearchPointId(point_id);
			this.getWavestatsSearchPointId(point_id);
			// 获取得分
			this.getUserAddScore();
		},

		// 获取波形图
		async getWaveformsSearchPointId(point_id) {
			const params = {
				point_id,
			};
			const result = await getWaveformsSearchPointId(params);
			if (result.code === Constants.status.SUCCESS) {
				this.waveFormsUrl = result.data.url;
			} else {
				ElMessage.error(result.msg);
				this.waveFormsUrl = "";
			}
		},

		// 获取波形统计图
		async getWavestatsSearchPointId(point_id) {
			const params = {
				point_id,
			};
			const result = await getWavestatsSearchPointId(params);
			if (result.code === Constants.status.SUCCESS) {
				this.waveStatsUrl = result.data.url;
			} else {
				ElMessage.waveStatsUrl(result.msg);
				this.waveFormsUrl = "";
			}
		},

		async getUserAddScore() {
			const params = {
				id: this.userInfo.id,
				score: 100,
			};
			const userInfo = await getUserInfo(this.userInfo.id);
			if (userInfo.data.score >= 80 && userInfo.data.score < 100) {
				const result = await addUserScore(params);
				if (result.code === Constants.status.SUCCESS) {
					ElMessage.success(result.msg);
				} else {
					ElMessage.error(result.msg);
				}
			}
		},

		changePoint() {
			!this.showPoint;
		},

		// 查询点位
		async getPointSearch(port_point_map_id) {
			const params = {
				...this.page,
				port_point_map_id,
			};
			const result = await getPointByPointMapFindAll(params);
			if (result.code === Constants.status.SUCCESS) {
				this.pointList = result.data.list;
				// 对数据进行排序
				this.pointList.sort(utils.pointCompare("content"));
				const { list } = result.data;
				this.changeWaveFormsAndStats(list[0].content, list[0].id);
			} else {
				ElMessage.error(result.msg);
			}
		},

		// 获取测点数据
		async toMeasurePoint() {
			const params = {
				water_level: this.water_level,
				wave_direction: this.wave_direction,
				embank_ment: this.embank_ment,
			};
			this.getPortPointMapSearch(params);
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

		async getPortPointMapSearch(data) {
			const params = {
				...data,
			};
			const result = await portPointMapSearchFindOne(params);
			if (result.code === Constants.status.SUCCESS) {
				this.imageUrl = result.data.url;
				this.portPointMapId = result.data.id;
				this.getPointSearch(result.data.id);
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
.slide-left-enter,
.slide-right-leave-to {
	transition: opacity 0.3s;
}

.slide-left-leave-to,
.slide-right-enter {
	opacity: 0;
}

.measure-point-route {
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
			font-size: 18px;
			font-weight: 600;
			margin: 10px 0;
		}
		.radio-check {
			display: flex;
			flex-direction: column;
			margin-left: 40px;
			::v-deep .el-radio__label {
				font-size: 17px;
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
		display: flex;
		justify-content: space-between;
		height: 80vh;
		.left {
			width: 80%;
			height: 100%;
		}

		.right-box {
			width: 20%;
			height: 100%;
			padding: 10px 6px;
			display: flex;
			align-items: center;
			flex-flow: row wrap;
			align-content: flex-start;
			justify-content: space-between;
			overflow: auto;
			.point-list {
				cursor: pointer;
				text-align: center;
				margin-bottom: 5px;
				flex: 1;
				width: 48%;
				min-width: 48%; // 加入这两个后每个item的宽度就生效了
				max-width: 48%; // 加入这两个后每个item的宽度就生效了
				&.active {
					background: $active-color;
					color: $white;
				}
				.content {
					font-size: 0.9rem;
				}
				&:active {
					color: $active-color;
				}
				&:hover {
					background: $hover-background-color;
					color: $hover-color;
				}
			}
		}
	}
	.right-box {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.content {
			.content-list {
				padding: 6px 6px;
				.item {
				}
			}
		}
		.wave-forms {
			margin-top: 10px;
			width: 100%;
		}
		.wave-stats {
			margin-top: 10px;
			width: 100%;
		}
	}
}
</style>
