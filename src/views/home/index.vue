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
            <div class="content border-bottom">
              <div class="content-list">
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
  name: "Home",
  data() {
    return {
      imageUrl: "",
      content: "",
      legend: "",
      page: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  components: {},
  watch: {},

  mounted() {
    this.getContentSearch();
    this.getContent();
    this.getPortMapFind();
  },

  methods: {
    // 获取操作说明的内容
    async getContent() {
      const id = "8c44f522-15d7-462a-bf63-eb45eb893c4b";
      await this.$api
        .getContentSearch(id)
        .then((res) => {
          if (res) {
            this.legend = res.data.content;
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },

    // 获取港口图片
    async getPortMapFind() {
      await this.$api.getPortMapFind(this.page).then((res) => {
        if (res) {
          this.imageUrl = this.$Constants.baseURL + res.data.list[0].path;
        }
      });
    },

    // 获取内容介绍
    async getContentSearch() {
      const id = "a195b032-28b8-4e7e-b3b0-6bdadff995c3";
      await this.$api
        .getContentSearch(id)
        .then((res) => {
          if (res) {
            this.content = res.data.content;
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
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
