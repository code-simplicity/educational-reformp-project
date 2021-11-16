<template>
  <div class="main-center border">
    <slot />
  </div>
</template>

<script>
// 中间内容插槽
export default {
  name: 'MainCenter',
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
.main-center {
  height: 100%;
}
</style>
