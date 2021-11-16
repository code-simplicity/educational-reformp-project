<template>
  <div class="main-footer border">
    <div class="container flex-column">
      <div class="version">版本所有：天津城建大学</div>
      <div class="maintain">制作维护：计算机与信息工程学院</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'main-footer',
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
.main-footer {
  position: absolute;
  bottom: 10px;
  left: 16px;
  right: 16px;
  /* margin-top: 20px;
  min-height: calc(170px); */
  .container {
    padding: 10px;
    .version {
      font-size: 16px;
      cursor: pointer;
    }
    .maintain {
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
