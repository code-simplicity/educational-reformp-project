<template>
  <div class="layout">
    <!-- <MainDisplay></MainDisplay> -->
    <router-view></router-view>
    <!-- <div class="footer">
      <MainFooter></MainFooter>
    </div> -->
  </div>
</template>

<script>
// 分发路由
// import MainDisplay from '../../components/main-display/index.vue'
// import MainFooter from '@/components/main-footer/index.vue'

export default {
  name: 'Layout',
  data() {
    return {

    }
  },
  components: {
    // MainDisplay
    // MainFooter
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
  height: 80vh;
  /* min-width: 1080px; */
  .footer {
    margin-top: 16px;
  }
}
</style>
