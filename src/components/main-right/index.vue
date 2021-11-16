<template>
  <div class="main-right border">
    <slot />
  </div>
</template>

<script>
// 右边内容插槽
export default {
  name: 'MainRight',
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
.main-right {
  height: 100%;
}
</style>
