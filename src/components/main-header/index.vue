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
      <el-col :span="7"><div class="right flex border">登录</div></el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'main-header',
  data() {
    return {

    }
  },
  components: {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.main-header {
  height: 70px;
  /* position: fixed; */
  /* top: 10px; */
  left: 16px;
  right: 16px;
  /* z-index: 99; */
  min-width: 1080px;
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
          color: #0447ff;
        }
        &:hover {
          color: #0447ff;
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
          color: #0447ff;
        }
        &:hover {
          color: #0447ff;
        }
      }
      &:active {
        color: #0447ff;
      }
      &:hover {
        background: #e4e4e4;
        color: #0447ff;
      }
    }
  }
  .right {
    height: 50px;
    padding: 6px 16px;
    font-size: 20px;
  }
}
</style>
