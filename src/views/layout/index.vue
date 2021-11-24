<template>
  <div class="layout">
    <router-view></router-view>

  </div>
</template>

<script>
// 分发路由

export default {
  name: 'Layout',
  data() {
    return {

    }
  },
  components: {

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
