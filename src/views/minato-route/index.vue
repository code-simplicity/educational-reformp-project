<template>
  <div class="minato-route">
    <el-row :gutter="12">
      <el-col :span="7">
        <MianLeft>
          <div class="legend">
            操作说明
            <div class="content">{{ legend }}</div>
          </div>
        </MianLeft>
      </el-col>
      <el-col :span="10">
        <MainCenter>
          <div class="video">
            <div class="video-location">
              <video
                class="video-style"
                :src="videoSrc"
                :autoplay="true"
              ></video>
            </div>
          </div>
        </MainCenter>
      </el-col>
      <el-col :span="7">
        <MianRight>
          <div class="content">
            <div class="content-list border">
              <el-scrollbar height="12rem">
                <p class="item">{{ content }}</p>
              </el-scrollbar>
            </div>
          </div>
        </MianRight>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 港区漫游
export default {
  name: 'MinatoRoute',
  data() {
    return {
      content: '',
      videoSrc: '',
      legend: ''
    }
  },
  components: {

  },
  watch: {
  },
  mounted() {
    this.getContentSearch()
    this.getContent()
    this.getVideoSearchOne()
  },

  methods: {
    // 获取操作说明的内容
    async getContent() {
      const id = '3267144c-3a6f-4dca-99de-916a413969d9'
      await this.$api.getContentSearch(id).then((res) => {
        if (res) {
          this.legend = res.data.content
        }
      }).catch((err) => {
        console.log('err', err)
      });
    },

    // 获取一个视频
    async getVideoSearchOne() {
      const name = 'portroam.mp4'
      await this.$api.getVideoSearchOne(name).then((res) => {
        this.videoSrc = this.$Constants.baseURL + res.data.path
        console.log(`this.videoSrc`, this.videoSrc)
      }).catch((err) => {
        console.log('err', err)
      });
    },

    // 获取内容介绍
    async getContentSearch() {
      const id = '86e5023b-d6b8-4374-9037-30b142f8d87f'
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
.minato-route {
  .legend {
    height: 80vh;
    padding: 20px 0;
    margin-left: 16px;
    margin-right: 16px;
    font-size: 1rem;
    font-weight: 600;
    .content {
      font-size: 0.9rem;
      font-weight: 500;
      margin-top: 6px;
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
