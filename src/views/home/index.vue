<template>
  <div class="home">
    <el-row :gutter="12">
      <el-col :span="7">
        <keep-alive>
          <MianLeft>
            <div class="legend">操作说明</div>
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
// 首页

export default {
  name: 'Home',
  data() {
    return {
      imageUrl: '',
      content: '',

    }
  },
  components: {

  },
  watch: {

  },

  mounted() {
    this.getContentSearch()
    this.getImageSearchOne()
  },

  methods: {
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
.home {
  .legend {
    padding: 20px 0;
    height: 80vh;
    margin-left: 20px;
    font-size: 1rem;
    font-weight: 600;
  }
  .image {
    width: 100%;
    height: 100%;
    background-size: 100%;
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
