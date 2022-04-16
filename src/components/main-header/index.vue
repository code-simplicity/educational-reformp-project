<template>
	<div class="main-header animate__animated animate__fadeInTopLeft">
		<el-row :gutter="12">
			<el-col :span="6"
				><div class="left border">
					<div class="title">
						<router-link class="active-class flex-nowrap" :to="{ path: 'home' }"
							>水运工程仿真实验系统</router-link
						>
					</div>
				</div></el-col
			>
			<el-col :span="12"
				><div class="center border">
					<router-link
						v-for="(item, index) in homeItem"
						:key="index"
						class="active-class"
						:to="{ path: item.path }"
						>{{ item.name }}</router-link
					>
				</div></el-col
			>
			<el-col :span="6"
				><div class="right border">
					<div class="user-info" v-if="tokenData">
						<span class="id">{{ userInfo.id }}</span>
						<span class="user-name">{{ userInfo.user_name }}</span>
					</div>
					<div class="container flex-nowrap flex" v-if="tokenData">
						<el-dropdown @command="handleCommand">
							<div class="botton">
								模块功能<el-icon class="el-icon-right"><CaretBottom /></el-icon>
							</div>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										v-if="userInfo.roles === 'admin'"
										command="toCenter"
										>管理中心</el-dropdown-item
									>
									<el-dropdown-item command="usersetting"
										>用户设置</el-dropdown-item
									>
									<el-dropdown-item command="logout">退出登录</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
					<div class="no-login flex" v-else @click="doLogin">
						<el-icon class="el-icon"><Coordinate /></el-icon> 登录
					</div>
				</div></el-col
			>
		</el-row>
	</div>
</template>

<script>
import { CaretBottom, Coordinate } from "@element-plus/icons";
// import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";
// import { updateUserInfo } from "../../api/service/user";
export default {
	name: "main-header",
	data() {
		return {
			dateTime: "",
			isShowDateTime: true,
			// 屏幕宽度
			fullWidth: 0,
		};
	},
	components: {
		CaretBottom,
		Coordinate,
	},
	computed: {
		...mapGetters("user", {
			tokenData: "tokenData",
			userInfo: "userInfo",
		}),
	},

	mounted() {
		this.dealWithTime();
		this.timer = setInterval(() => {
			this.dealWithTime();
		}, 200);
		window.addEventListener("resize", this.handleResize);
	},
	methods: {
		handleResize() {
			this.fullWidth = document.documentElement.clientWidth;
			if (this.fullWidth < 1300) {
				this.isShowDateTime = false;
			} else {
				this.isShowDateTime = true;
			}
		},

		// 实时刷新时间
		dealWithTime() {
			let timestamp = new Date().valueOf();
			this.dateTime = this.$utils.dateFormat(timestamp, "YYYY-MM-DD HH-MM-SS");
		},

		// 控制下拉菜单功能
		async handleCommand(command) {
			switch (command) {
				case "logout": {
					this.$store.dispatch("user/loginOut").then(() => {
						this.$router.replace({
							name: "login",
						});
					});
					break;
				}
				case "usersetting": {
					this.$router.push({
						name: "user",
					});
					break;
				}
				case "toCenter": {
					const url = "http://101.42.107.166/admin/#/dashboard";
					window.open(url, "_blank");
					break;
				}
			}
		},

		// 去登录页面
		doLogin() {
			this.$router.replace({
				name: "login",
			});
		},
	},

	unmounted() {
		if (this.timer) {
			// 注意在vue实例销毁前，清除我们的定时器
			clearInterval(this.timer);
		}
		window.addEventListener("resize", this.handleResize);
	},
};
</script>

<script setup>
import { ref } from "vue";
import { homeItem } from "@/json/homeItem";

const homeItems = ref([]);
homeItems.value = homeItem;
</script>

<style lang="scss" scoped>
.main-header {
	/* min-width: 750px; */
	margin-bottom: 0.5rem;
	.left {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.5rem;
		min-height: 40px;
		background: #ffffff;

		.title {
			font-size: 1.3rem;
			text-align: center;
			.active-class {
				color: $black;
				text-decoration: none;
				cursor: pointer;
				&.router-link-active {
					color: $active-color;
				}
				&:hover {
					color: $hover-color;
				}
			}
		}
	}
	.center {
		padding: 0 16px;
		height: 2.5rem;
		min-height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #ffffff;
		.active-class {
			margin: 0 4px;
			color: #000000;
			text-decoration: none;
			text-align: center;
			box-shadow: -1px 1px 5px rgb(0, 0, 0);
			cursor: pointer;
			padding: 0 20px;
			font-size: 1.2rem;
			&.router-link-active {
				color: #ffffff;
				background: rgb(111, 125, 255);
			}
			&:hover {
				color: #ffffff;
				background: rgb(111, 125, 255);
			}
		}
	}
	.right {
		height: 2.5rem;
		min-height: 40px;
		padding: 0 16px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		background: #ffffff;

		.time {
			font-size: 0.8rem;
			font-weight: 500;
			margin-right: 10px;
		}
		.user-info {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			align-items: center;
			padding: 6px;
			.id {
				font-size: 1.1rem;
			}
			.user-name {
				font-size: 1.1rem;
				margin-left: 16px;
			}
		}
		.container {
			font-size: 0.8rem;
			font-weight: 600;
			margin-left: 10px;
			.botton {
				font-size: 0.8rem;
				cursor: pointer;
				padding: 0 6px;

				.el-icon-right {
					color: $active-color;
				}
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
		.no-login {
			font-size: 0.8rem;
			cursor: pointer;
			position: absolute;
			right: 10px;
			.el-icon {
				margin-right: 4px;
			}
			&:hover {
				color: $hover-color;
			}
		}
	}
}
</style>
