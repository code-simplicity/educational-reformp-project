<template>
  <div class="project-route">
    <el-row :gutter="12" :style="{ height: clientHeight + 'px' }">
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
                <div class="botton" @click="toAppearance">现象观察</div>
              </div>
            </div>
          </MianLeft>
        </keep-alive>
      </el-col>
      <el-col :span="10">
        <keep-alive>
          <MainCenter>
            <div class="image">
              <el-image
                style="height: 100%; width: 100%"
                :src="imageUrl"
                fit="fill"
              ></el-image>
            </div>
          </MainCenter>
        </keep-alive>
      </el-col>
      <el-col :span="7">
        <keep-alive>
          <MianRight>
            <div class="content">
              <div class="content-list border">
                <el-scrollbar height="200px">
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
  name: 'ProjectRoute',
  data() {
    return {
      clientHeight: document.body.clientHeight - 170,
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
    clientHeight(val) {
      if (!this.timer) {
        this.clientHeight = val
        this.timer = true
        setTimeout(() => {
          console.log('this.clientHeight', this.clientHeight)
          this.timer = false
        }, 400)
      }
    }
  },
  mounted() {
    this.getContentSearch()
    this.getImageSearchOne()
    this.getChooseFindlist()
    this.onresize()
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

    // 调整视图大小
    onresize() {
      window.onresize = () => {
        return (() => {
          this.clientHeight = document.body.clientHeight - 170
        })()
      }
    },

    // 去现象观察
    toAppearance() {
      this.$router.push({
        name: 'appearance-route',
        query: {
          water_level: this.water_level,
          wave_direction: this.wave_direction,
          embank_ment: this.embank_ment
        }
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
    async getContentSearch() {
      const id = '1637108800537'
      await this.$api.getContentSearch(id).then((res) => {
        if (res) {
          this.content = res.data.content
        }
      }).catch((err) => {
        console.log('err', err)
      });
    }
  },
  unmounted() {
    if (this.timer) {  // 注意在vue实例销毁前，清除我们的定时器
      clearTimeout(this.timer);
    }
  }
}
</script>

<style lang='scss' scoped>
.project-route {
  .legend {
    padding: 20px 0;
    margin-left: 20px;
    position: relative;
    height: 70vh;
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
    width: 100%;
    height: 100%;
    background-size: 100%;
  }
  .content {
    .content-list {
      flex: 1;
      padding: 6px;
      .item {
        padding: 0 16px 0 0;
        font-size: 0.8rem;
        font-weight: 500;
        line-height: 20px;
      }
    }
  }
}
</style>
