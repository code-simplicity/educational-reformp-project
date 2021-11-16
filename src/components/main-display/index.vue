<template>
  <div class="main-display flex-between">
    <MainLeft></MainLeft>
    <MainCenter></MainCenter>
    <MainRight></MainRight>
  </div>
</template>

<script>
// 中间内容展示区
import MainLeft from '../main-left/index.vue'
import MainCenter from '../main-center/index.vue'
import MainRight from '../main-right/index.vue'
export default {
  name: 'MainDisplay',
  data() {
    return {

    }
  },
  components: {
    MainLeft,
    MainCenter,
    MainRight
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.main-display {
}
</style>
