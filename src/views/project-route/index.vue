<template>
  <div class="project-route">
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
                :src="$Constants.baseURL + `/portmap/search?id=` + id"
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
// 工况选配
import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";
export default {
  name: "ProjectRoute",
  data() {
    return {
      content: "",
      id: "",
      radioList: [],
      // 选择框的值,分别是水位，波浪方向，堤坝布置
      water_level: "极端高水位",
      wave_direction: "NW",
      embank_ment: "无堤",
      page: {
        pageNum: 1,
        pageSize: 20,
      },
    };
  },
  components: {},
  watch: {},
  computed: {
    ...mapGetters("user", {
      userInfo: "userInfo",
    }),
  },
  mounted() {
    // this.getContentSearch()
    this.getPortMapFind();
    this.getChooseFindAll();
  },
  methods: {
    // 获取左边选择
    async getChooseFindAll() {
      await this.$api
        .getChooseFindAll(this.page)
        .then((res) => {
          if (res.status === 200) {
            this.radioList = res.data.list;
            this.getContentSearchChooseId(res.data.list[0].id);
          }
        })
        .catch((err) => {
          console.log(`err`, err);
        });
    },

    // 去现象观察
    toAppearance() {
      this.$router.push({
        name: "appearance-route",
        query: {
          water_level: this.water_level,
          wave_direction: this.wave_direction,
          embank_ment: this.embank_ment,
        },
      });
      this.getUserAddScore();
    },

    // 判断视频播放结束，进行加分
    async getUserAddScore() {
      const params = {
        id: this.userInfo.id,
        score: 60,
      };
      const userInfo = await this.$api.getUserInfo(this.userInfo.id);
      if (userInfo.data.score >= 40 && userInfo.data.score < 60) {
        await this.$api
          .getUserAddScore(params)
          .then((res) => {
            if (res.status === 200) {
              ElMessage({
                message: res.msg,
                type: "success",
              });
            } else if (res.status === 400) {
              ElMessage.error({
                message: res.data,
              });
            }
          })
          .catch((err) => {
            console.log("err :>> ", err);
          });
      }
    },

    // 获取港口图片
    async getPortMapFind() {
      await this.$api.getPortMapFind(this.page).then((res) => {
        if (res) {
          this.id = res.data.list[0].id;
        }
      });
    },

    // 获取内容介绍
    async getContentSearchChooseId(choose_id) {
      const params = {
        ...this.page,
        choose_id,
      };
      await this.$api
        .getContentSearchChooseId(params)
        .then((res) => {
          if (res) {
            this.content = res.data.list[0].content;
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
.project-route {
  .legend {
    padding: 20px 0;
    margin-left: 16px;
    margin-right: 16px;
    position: relative;
    height: 80vh;
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
      right: 0;
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
