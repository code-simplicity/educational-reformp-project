<template>
  <div class="measure-point-route">
    <el-row :gutter="12">
      <el-col :span="7">
        <keep-alive>
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
                    >
                      <el-radio :label="item.content">{{
                        item.content
                      }}</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </el-scrollbar>

              <div class="botton-click">
                <div class="botton" @click="toMeasurePoint">测点数据</div>
              </div>
            </div>
          </MianLeft>
        </keep-alive>
      </el-col>
      <el-col :span="10">
        <keep-alive>
          <MainCenter>
            <div class="image">
              <div class="left">
                <el-image
                  style="height: 100%; width: 100%"
                  :src="imageUrl"
                  fit="fill"
                ></el-image>
              </div>
              <div class="right"></div>
            </div>
          </MainCenter>
        </keep-alive>
      </el-col>
      <el-col :span="7">
        <keep-alive>
          <MianRight>
            <div class="content">
              <div class="content-list border">
                <el-scrollbar height="12rem">
                  <p class="item">{{ content }}</p>
                </el-scrollbar>
              </div>
            </div>
          </MianRight>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 测点数据

export default {
  name: 'MeasurePointRoute',
  data() {
    return {
      content: '',
      imageUrl: '',
      radioList: [],
      // 选择框的值,分别是水位，波浪方向，堤坝布置
      water_level: '',
      wave_direction: '',
      embank_ment: '',
    }
  },
  components: {

  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal.query.keywords !== oldVal.query.keywords) {
        this.queryObj = newVal.query
        this.postImageSearch(this.queryObj)
      }
    }
  },
  mounted() {
    this.getContentSearch()
    this.getChooseFindlist()
    const queryObj = this.$route.query
    if (queryObj) {
      this.queryObj = queryObj
      this.postImageSearch(queryObj)
    }
  },
  methods: {
    // 获取左边选择
    async getChooseFindlist() {
      await this.$api.getChooseFindlist().then((res) => {
        if (res.status === 200) {
          this.radioList = res.data
        }
      }).catch((err) => {
        console.log(`err`, err)
      });
    },

    async postImageSearch(val) {
      const name = 'wb_map.png'
      const params = {
        name: name,
        ...val
      }
      await this.$api.postImageSearch(params).then((res) => {
        if (res.status === 200) {
          this.imageUrl = this.$Constants.baseURL + res.data.path
        }
      }).catch((err) => {
        console.log(`err`, err)
      });
    },

    // 获取内容介绍
    async getContentSearch() {
      const id = '1637108800537'
      await this.$api.getContentSearch(id).then((res) => {
        if (res) {
          this.content = res.data.content
        }
      }).catch((err) => {
        console.log('err', err)
      });
    },
  }
}
</script>

<style lang='scss' scoped>
.measure-point-route {
  .legend {
    padding: 20px 0;
    margin-left: 20px;
    position: relative;
    height: 80vh;
    /* height: 100%; */
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
      font-size: 1rem;
      font-weight: 600;
    }
    .radio-check {
      display: flex;
      flex-direction: column;
      margin-left: 40px;
    }
    .botton-click {
      position: absolute;
      top: 10px;
      right: 10px;
      .botton {
        padding: 4px 8px;
        text-align: center;
        box-shadow: -1px 1px 5px rgb(0, 0, 0);
        background: #f3f3f3;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.8rem;
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
  .image {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      width: 80%;
      height: 100%;
      background-size: 100%;
    }
    .right {
      width: 20%;
      height: 100%;
      background: url(../../assets/images/港口背景1.jpg);
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
