<template>
  <div class="main-header">
    <el-row :gutter="12">
      <el-col :span="7"
        ><div class="left border">
          <div class="title">
            <router-link class="active-class" :to="{ path: 'Home' }"
              >水运工程仿真实验系统</router-link
            >
          </div>
        </div></el-col
      >
      <el-col :span="10"
        ><div class="center flex-between border">
          <el-col :span="6"
            ><div class="menu-list">
              <router-link class="active-class" :to="{ path: 'MinatoRoute' }"
                >港区漫游</router-link
              >
            </div></el-col
          >
          <el-col :span="6">
            <div class="menu-list">
              <router-link class="active-class" :to="{ path: 'MinatoRoute' }"
                >工况选配</router-link
              >
            </div></el-col
          >
          <el-col :span="6">
            <div class="menu-list">
              <router-link class="active-class" :to="{ path: 'MinatoRoute' }"
                >现象观察</router-link
              >
            </div></el-col
          >
          <el-col :span="6">
            <div class="menu-list">
              <router-link class="active-class" :to="{ path: 'MinatoRoute' }"
                >测点数据</router-link
              >
            </div></el-col
          >
        </div></el-col
      >
      <el-col :span="7"
        ><div class="right flex-between border">
          <div class="time">2021年11月17日20:15:06</div>
          <div class="user-info flex">
            <div class="id">1807010210</div>
            <div class="user-name">dpy</div>
          </div>
          <div class="container flex">
            <el-dropdown @command="handleCommand">
              <div class="botton">
                模块功能<el-icon class="el-icon-right"><CaretBottom /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="toCenter"
                    >管理中心</el-dropdown-item
                  >
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="no-login">登录</div>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script>
import { CaretBottom } from '@element-plus/icons'
import { ElMessage } from 'element-plus'
export default {
  name: 'main-header',
  data() {
    return {

    }
  },
  components: {
    CaretBottom,
  },
  mounted() {

  },
  methods: {
    // 控制下拉菜单功能
    async handleCommand(command) {
      switch (command) {
        case "logout": {
          await this.$api.logout().then((res) => {
            this.$router.push({
              name: 'Login'
            })
            if (res.status === 200) {
              ElMessage({
                message: res.msg,
                type: 'success',
              })
            }
          }).catch((err) => {
            console.log(`err`, err)
          });
          break
        }
        case "toCenter": {
          break
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.main-header {
  min-width: 1080px;
  margin-bottom: 10px;
  .left {
    padding: 6px 16px;
    text-align: center;
    height: 50px;
    .title {
      font-size: 24px;
      .active-class {
        color: #000000;
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
    padding: 6px 16px;
    height: 50px;
    .menu-list {
      font-size: 22px;
      text-align: center;
      padding: 2px 0;
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
    }
  }
  .right {
    height: 50px;
    padding: 6px 16px;
    .time {
      font-size: 14px;
      font-weight: 600;
    }
    .user-info {
      .id {
        font-size: 14px;
        font-weight: 600;
      }
      .user-name {
        font-size: 14px;
        font-weight: 600;
        margin-left: 16px;
      }
    }
    .container {
      font-size: 14px;
      font-weight: 600;
      margin-left: 16px;
      .botton {
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
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: $hover-color;
      }
    }
  }
}
</style>
