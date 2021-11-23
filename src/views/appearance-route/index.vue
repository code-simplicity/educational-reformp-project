<template>
  <div class="appearance-route">
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
                <div class="botton" @click="toMeasurePoint">测点数据</div>
              </div>
            </div>
          </MianLeft>
        </keep-alive>
      </el-col>
      <el-col :span="10">
        <keep-alive>
          <MainCenter>
            <div class="video">
              <div class="video-location">
                <video
                  class="video-style"
                  :src="videoSrc"
                  autoplay="tr"
                ></video>
              </div>
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
// 工况选配
export default {
  name: 'AppearanceRoute',
  data() {
    return {
      content: '',
      imageUrl: '',
      radioList: [],
      // 选择框的值   
      water_level: '极端高水位',
      wave_direction: 'NW',
      embank_ment: '无堤',
      // 路由返回的参数接收
      queryObj: {},
      // 视频地址
      videoSrc: ''
    }
  },
  components: {

  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal.query.keywords !== oldVal.query.keywords) {
        this.queryObj = newVal.query
        this.getVideoSearch(this.queryObj)
      }
    }
  },

  mounted() {
    this.getImageSearchOne()
    this.getChooseFindAll()
    const queryObj = this.$route.query
    if (queryObj) {
      this.queryObj = queryObj
      this.water_level = queryObj.water_level
      this.wave_direction = queryObj.wave_direction
      this.embank_ment = queryObj.embank_ment
      this.getVideoSearch(queryObj)
    }
  },
  methods: {
    // 获取左边选择
    async getChooseFindAll() {
      // const category = '设计水位'
      // const category1 = '波浪来向'
      // const category2 = '外堤布置'
      await this.$api.getChooseFindAll().then((res) => {
        if (res.status === 200) {
          this.radioList = res.data
          this.getContentSearchChooseId(res.data[0].id)
        }
      }).catch((err) => {
        console.log(`err`, err)
      });
    },

    // 去现象观察
    toMeasurePoint() {
      this.$router.push({
        name: 'measure-point-route',
        query: {
          water_level: this.water_level,
          wave_direction: this.wave_direction,
          embank_ment: this.embank_ment
        }
      })
    },

    // 获取演示视频
    async getVideoSearch(params) {
      await this.$api.getVideoSearch(params).then(res => {
        if (res.status === 200) {
          this.videoSrc = this.$Constants.baseURL + res.data.path
        }
      }).catch(err => {
        console.log('err', err)
      })
    },

    // 获取港口图片
    async getImageSearchOne() {
      const name = "port.png"
      await this.$api.getImageSearchOne(name).then(res => {
        if (res) {
          this.imageUrl = this.$Constants.baseURL + res.data.path
        }
      })
    },

    // 获取内容介绍
    async getContentSearchChooseId(choose_id) {
      await this.$api.getContentSearchChooseId(choose_id).then((res) => {
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
.appearance-route {
  .legend {
    padding: 20px 0;
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
