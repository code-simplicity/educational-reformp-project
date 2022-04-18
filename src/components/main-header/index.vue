<template>
	<div class="main-header animate__animated animate__fadeInTopLeft">
		<el-row :gutter="12">
			<el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6"
				><div class="left border">
					<div class="title">
						<router-link class="active-class flex-nowrap" :to="{ path: 'home' }"
							>水运工程仿真实验系统</router-link
						>
					</div>
				</div></el-col
			>
			<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12"
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
			<el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6"
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
import { CaretBottom, Coordinate } from "@element-plus/icons-vue";
import { mapGetters } from "vuex";
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
import { homeItem } from "../../json/homeItem";

const homeItems = ref([]);
homeItems.value = homeItem;
</script>

<style lang="scss" scoped>
.main-header {
	.left {
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #ffffff;
		margin-bottom: 6px;

		.title {
			text-align: center;
			font-size: 22px;
			.active-class {
				color: #000000;
				text-decoration: none;
				cursor: pointer;
				&.router-link-active {
					color: #192eee;
				}
				&:hover {
					color: #192eee;
				}
			}
		}
	}
	.center {
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #ffffff;
		margin-bottom: 6px;

		.active-class {
			color: #000000;
			text-decoration: none;
			text-align: center;
			box-shadow: -1px 1px 5px rgb(0, 0, 0);
			cursor: pointer;
			padding: 0 18px;
			font-size: 18px;
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
		height: 40px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		background: #ffffff;
		margin-bottom: 12px;

		.user-info {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			align-items: center;
			padding: 6px;
			.id {
				font-size: 17px;
			}
			.user-name {
				margin-left: 16px;
			}
		}
		.container {
			font-weight: 600;
			margin-left: 10px;
			.botton {
				cursor: pointer;
				padding: 0 6px;

				.el-icon-right {
					color: #192eee;
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
				color: #192eee;
			}
		}
	}
}
</style>
