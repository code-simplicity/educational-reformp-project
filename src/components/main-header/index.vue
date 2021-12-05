<template>
  <div class="main-header">
    <el-row :gutter="12">
      <el-col :span="7"
        ><div class="left border">
          <div class="title">
            <router-link class="active-class flex-nowrap" :to="{ path: 'home' }"
              >水运工程仿真实验系统</router-link
            >
          </div>
        </div></el-col
      >
      <el-col :span="10"
        ><div class="center flex-between border">
          <el-col :span="6"
            ><div class="menu-list">
              <router-link class="active-class" :to="{ path: 'minato-route' }"
                >港区漫游</router-link
              >
            </div></el-col
          >
          <el-col :span="6">
            <div class="menu-list">
              <router-link class="active-class" :to="{ path: 'project-route' }"
                >工况选配</router-link
              >
            </div></el-col
          >
          <el-col :span="6">
            <div class="menu-list">
              <router-link
                class="active-class"
                :to="{ path: 'appearance-route' }"
                >现象观察</router-link
              >
            </div></el-col
          >
          <el-col :span="6">
            <div class="menu-list">
              <router-link
                class="active-class"
                :to="{ path: 'measure-point-route' }"
                >测点数据</router-link
              >
            </div></el-col
          >
        </div></el-col
      >
      <el-col :span="7"
        ><div class="right flex-between border">
          <div class="time flex-nowrap">{{ dateTime }}</div>
          <div class="user-info flex-nowrap flex" v-if="loginStatus">
            <div class="id">{{ userInfo.id }}</div>
            <div class="user-name">{{ userInfo.user_name }}</div>
          </div>
          <div class="container flex-nowrap flex" v-if="loginStatus">
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
import { ElMessage } from "element-plus";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "main-header",
  data() {
    return {
      dateTime: "",
    };
  },
  components: {
    CaretBottom,
    Coordinate,
  },
  computed: {
    ...mapGetters("user", {
      loginStatus: "login_Status",
      userInfo: "user_Info",
    }),
  },

  mounted() {
    this.dealWithTime();
    this.timer = setInterval(() => {
      this.dealWithTime();
    }, 200);
  },
  methods: {
    // 实时刷新时间
    dealWithTime() {
      let timestamp = new Date().valueOf();
      this.dateTime = this.$utils.dateFormat(timestamp, "YYYY-MM-DD HH-MM-SS");
    },

    // 控制下拉菜单功能
    async handleCommand(command) {
      switch (command) {
        case "logout": {
          await this.$api
            .logout()
            .then((res) => {
              if (res.status === 200) {
                ElMessage({
                  message: res.msg,
                  type: "success",
                });
                this.$router.replace({
                  name: "login",
                });
                // 清除token以及登录状态
                window.localStorage.setItem("_token_", null);
                window.localStorage.setItem("_login_status_", null);
                window.localStorage.setItem("_user_Info_", null);
                this.setLogin_Status(null);
                this.setUserInfo();
              }
            })
            .catch((err) => {
              console.log(`err`, err);
            });
          break;
        }
        case "toCenter": {
          const url = "http://localhost:3002/#/dashboard";
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

    // 提交状态
    ...mapMutations("user", {
      setLogin_Status: "LOGIN_STATUS",
      setUserInfo: "USER_INFO",
    }),
  },

  unmounted() {
    if (this.timer) {
      // 注意在vue实例销毁前，清除我们的定时器
      clearInterval(this.timer);
    }
  },
};
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
    .menu-list {
      font-size: 1.2rem;
      text-align: center;
      box-shadow: -1px 1px 5px rgb(0, 0, 0);
      cursor: pointer;
      .active-class {
        color: #000000;
        text-decoration: none;
        &.router-link-active {
          color: $active-color;
        }
        &:hover {
          color: $hover-color;
        }
      }
      &:active {
        color: $active-color;
      }
      &:hover {
        background: $hover-background-color;
        color: $hover-color;
      }
      &.router-link-active {
        color: $active-color;
        background: rgb(255, 255, 255);
      }
    }
  }
  .right {
    height: 2.5rem;
    padding: 0 16px;
    position: relative;
    .time {
      font-size: 0.8rem;
      font-weight: 500;
      margin-right: 10px;
    }
    .user-info {
      .id {
        font-size: 0.8rem;
        font-weight: 500;
      }
      .user-name {
        font-size: 0.8rem;
        font-weight: 500;
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
        .el-icon-right {
          color: $active-color;
        }
        &:active {
          background: $active-color;
          color: $active-background-color;
        }
        &:hover {
          background: $hover-background-color;
          color: $hover-color;
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
