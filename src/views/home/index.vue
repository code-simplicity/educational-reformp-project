<template>
  <div class="home">
    <el-row :gutter="12">
      <el-col :span="7">
        <keep-alive>
          <MianLeft>
            <div class="legend">
              操作说明
              <div class="content">{{ legend }}</div>
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
    this.getPortMapFind()
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

    // 获取港口图片
    async getPortMapFind() {
      await this.$api.getPortMapFind().then(res => {
        if (res) {
          this.imageUrl = this.$Constants.baseURL + res.data.path
        }
      })
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
    }
  }
}
</script>

<style lang='scss' scoped>
.home {
  .legend {
    padding: 20px 0;
    height: 80vh;
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
