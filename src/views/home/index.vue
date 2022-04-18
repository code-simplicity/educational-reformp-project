<template>
	<div class="home">
		<el-row :gutter="12">
			<el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
				<MianLeft>
					<div class="main-left-container">
						<div class="legend">
							操作说明
							<div class="content">{{ legend }}</div>
						</div>
						<div class="team-info">
							<span class="title">水运工程仿真实验系统建设团队</span>
							<p class="team-item">
								系统架构：
								<span>费翔，杜培义，胡德</span>
							</p>
							<p class="team-item">
								BIM建模：
								<span>马朋飞，谷雪清，吴潇</span>
							</p>
							<p class="team-item">
								波浪模拟：
								<span>蒋学炼，米万里，刘文龙</span>
							</p>
							<p class="team-item">
								后台管理：
								<span>张娜，杨伟超，宋吉宁，杨德健</span>
							</p>
							<p class="team-item">
								技术支持：
								<span
									>高刚刚，刘烽，刘珂铖，刘轲航，刘亮杰，刘文婷，唐浩，王忠宇，夏和政，杨建丰，余澳，余润晨，张朋，庄景晨</span
								>
							</p>
							<p class="team-item">
								反馈邮箱：
								<span class="link-email"> jiang.xuelian@tcu.edu.cn </span>
							</p>
							<p class="team-foot">
								衷心感谢各位成员付出的辛勤努力和充满灵感的创意！
							</p>
						</div>
					</div>
				</MianLeft>
			</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
				<MainCenter>
					<div class="image">
						<el-image
							style="height: 100%; width: 100%"
							:src="imageUrl"
							fit="cover"
						></el-image>
					</div>
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
		content.value = result.data.list[1].content;
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
	.main-left-container {
		padding: 10px;
		display: flex;
		flex-direction: column;
		.legend {
			font-size: 18px;
			font-weight: 600;
			.content {
				font-size: 16px;
				font-weight: 500;
				margin-top: 6px;
			}
		}
		.team-info {
			display: flex;
			flex-direction: column;
			margin-top: 10px;
			.title {
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 600;
				margin-bottom: 6px;
			}
			.team-item {
				display: inline-block;
				font-weight: 600;
				margin-bottom: 6px;
				span {
					font-size: 14px;
					font-weight: 500;
				}
				.link-email {
					font-size: 14px;
					font-weight: 600;
				}
			}
			.team-foot {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 18px;
				font-weight: 600;
				margin-top: 6px;
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
			}
		}
	}
}
</style>
