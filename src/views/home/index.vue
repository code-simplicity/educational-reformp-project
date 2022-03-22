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
							:src="$Constants.baseURL + `/portmap/search?id=` + id"
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

<script>
// 首页
import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";
export default {
	name: "Home",
	data() {
		return {
			id: "",
			content: "",
			legend: "",
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

	mounted() {
		this.contentFindAll();
		this.getPortMapFind();
	},

	methods: {
		// 获取操作说明的内容
		async contentFindAll() {
			await this.$api
				.contentFindAll(this.page)
				.then((res) => {
					if (res) {
						this.legend = res.data.list[0].content;
						this.content = res.data.list[1].content;
					}
				})
				.catch((err) => {
					console.log("err", err);
				});
		},

		// 获取港口图片
		async getPortMapFind() {
			await this.$api.getPortMapFind(this.page).then((res) => {
				if (res) {
					// 港口地图id
					this.id = res.data.list[0].id;
					setTimeout(() => {
						this.getUserAddScore();
					}, 6000);
				}
			});
		},

		// 添加分数
		async getUserAddScore() {
			const params = {
				id: this.userInfo.id,
				score: 20,
			};
			// 获取该用户的分数，如果分数大于等于20，那么不触发加法
			const userInfo = await this.$api.getUserInfo(this.userInfo.id);
			if (userInfo.data.score >= 0 && userInfo.data.score < 20) {
				await this.$api
					.getUserAddScore(params)
					.then((res) => {
						if (res.status === 200) {
							ElMessage({
								message: res.msg,
								type: "success",
							});
						} else if (res.status === 400) {
							ElMessage.error({
								message: res.data,
							});
						}
					})
					.catch((err) => {
						console.log("err :>> ", err);
					});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.home {
	.legend {
		padding: 20px 0;
		height: 80vh;
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
