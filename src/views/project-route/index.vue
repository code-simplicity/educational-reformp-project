<template>
  <div class="project-route">
    <el-row :gutter="12" :style="{ height: clientHeight + 'px' }">
      <el-col :span="7">
        <keep-alive>
          <MianLeft>
            <div class="legend">
              <div class="top">
                <div class="title">设计水位</div>
                <div class="radio-check">
                  <el-radio-group
                    v-for="item in radioList1"
                    :key="item.id"
                    v-model="radioValue1"
                    @change="changeRadio1"
                  >
                    <el-radio :label="item.label">{{ item.label }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="center">
                <div class="title">波浪来向</div>
                <div class="radio-check">
                  <el-radio-group
                    v-for="item in radioList2"
                    :key="item.id"
                    v-model="radioValue2"
                    @change="changeRadio2"
                  >
                    <el-radio :label="item.label">{{ item.label }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="bottom">
                <div class="title">外堤布置</div>
                <div class="radio-check">
                  <el-radio-group
                    v-for="item in radioList3"
                    :key="item.id"
                    v-model="radioValue3"
                    @change="changeRadio3"
                  >
                    <el-radio :label="item.label">{{ item.label }}</el-radio>
                  </el-radio-group>
                </div>
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
                <el-scrollbar :noresize="true" :always="true" height="200px">
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
const radioList1 = [
  {
    id: 1,
    value: "极端高水位",
    label: "极端高水位",
  },
  {
    id: 2,
    value: "设计高水位",
    label: "设计高水位",
  },
  {
    id: 3,
    value: "设计低水位",
    label: "设计低水位",
  },
  {
    id: 4,
    value: "极端低水位",
    label: "极端低水位",
  },
]
const radioList2 = [
  {
    id: 1,
    value: "NW",
    label: "NW",
  },
  {
    id: 2,
    value: "W",
    label: "W",
  },
  {
    id: 3,
    value: "SW",
    label: "SW",
  },
]
const radioList3 = [
  {
    id: 1,
    value: "无堤",
    label: "无堤",
  },
  {
    id: 2,
    value: "南堤",
    label: "南堤",
  },
  {
    id: 3,
    value: "北堤",
    label: "北堤",
  },
  {
    id: 5,
    value: "南北双堤",
    label: "南北双堤",
  },
]
export default {
  name: 'ProjectRoute',
  data() {
    return {
      clientHeight: document.body.clientHeight - 170,
      content: '',
      imageUrl: '',
      radioList1: radioList1,
      radioList2: radioList2,
      radioList3: radioList3,
      // 选择框的值
      radioValue1: '',
      radioValue2: '',
      radioValue3: '',
    }
  },
  components: {

  },
  watch: {
    clientHeight(val) {
      if (!this.timer) {
        this.clientHeight = val - 170
        this.timer = true
        let that = this
        setTimeout(() => {
          console.log('this.clientHeight', this.clientHeight)
          that.timer = false
        }, 400)
      }
    }
  },
  mounted() {
    this.getContentSearch()
    this.getImageSearchOne()
    const that = this
    window.onresize = () => {
      return (() => {
        that.clientHeight = document.body.clientHeight
      })()
    }
  },
  methods: {
    // 单选框的值
    changeRadio(val) {
      console.log(`val`, val)
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
  }
}
</script>

<style lang='scss' scoped>
.project-route {
  .legend {
    padding: 20px;
    /* height: 100%; */
    .top {
    }
    .center {
      margin: 10px 0;
    }
    .bottom {
    }
    .title {
      font-size: 18px;
      font-weight: 600;
    }
    .radio-check {
      display: flex;
      flex-direction: column;
      margin-left: 40px;
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
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
      }
    }
  }
}
</style>
