<template>
  <div class="minato-route">
    <el-row :gutter="12" :style="{ height: clientHeight + 'px' }">
      <el-col :span="7">
        <MianLeft>
          <div class="legend">操作说明</div>
        </MianLeft>
      </el-col>
      <el-col :span="10">
        <MainCenter>
          <div class="video">
            <div class="video-location">
              <video class="video-style" :src="videoSrc" autoplay="tr"></video>
            </div>
          </div>
        </MainCenter>
      </el-col>
      <el-col :span="7">
        <MianRight>
          <div class="content">
            <div class="content-list border">
              <el-scrollbar :noresize="true" :always="true" height="200px">
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
      clientHeight: document.body.clientHeight - 170,
      content: '',
      videoSrc: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
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
          that.timer = false
        }, 400)
      }
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        that.clientHeight = document.body.clientHeight
      })()
    }
    this.getContentSearch()
  },

  methods: {
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
.minato-route {
  .legend {
    padding: 20px 26px;
    font-size: 18px;
    font-weight: 600;
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
