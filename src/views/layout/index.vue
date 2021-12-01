<template>
  <div class="layout">
    <MainHeader></MainHeader>
    <router-view></router-view>
    <div class="footer">
      <MainFooter></MainFooter>
    </div>
  </div>
</template>

<script>
// 分发路由
import MainFooter from '@/components/main-footer/index.vue'
import MainHeader from '@/components/main-header/index.vue'
export default {
  name: 'Layout',
  data() {
    return {

    }
  },
  components: {
    MainFooter,
    MainHeader
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.layout {
  width: 100%;
  /* height: 100vh; */
  /* padding: 10px; */
  /* min-width: 1080px; */
  /* min-width: 750px; */
  .footer {
    margin-top: 0.5rem;
  }
}
</style>
