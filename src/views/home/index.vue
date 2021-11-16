<template>
  <div class="home">
    <el-row :gutter="12">
      <el-col :span="7">
        <MianLeft>
          <div class="legend">操作说明</div>
        </MianLeft>
      </el-col>
      <el-col :span="10">
        <MainCenter>
          <div class="image">
            <el-image :src="url" fit="contain"></el-image>
          </div>
        </MainCenter>
      </el-col>
      <el-col :span="7">
        <MianRight>
          <div class="content">
            <span>{{ content }}</span>
          </div>
        </MianRight>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 首页
import MianLeft from '../../components/main-left/index.vue'
import MainCenter from '../../components/main-center/index.vue'
import MianRight from '../../components/main-right/index.vue'
export default {
  name: 'Home',
  data() {
    return {
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      content: ''
    }
  },
  components: {
    MianLeft,
    MainCenter,
    MianRight
  },
  mounted() {
    this.getContentSearch()
  },
  methods: {
    async getContentSearch() {
      const id = '1637070559966'
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
    margin: 16px 0 0 16px;
    font-size: 18px;
    font-weight: 600;
  }
  .image {
    background-size: 100%;
  }
}
</style>
