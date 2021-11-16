<template>
  <div class="app">
    <MainHeader></MainHeader>
    <router-view></router-view>
    <!-- <MainFooter></MainFooter> -->
  </div>
</template>

<script>
// import MainFooter from '@/components/main-footer/index.vue'
import MainHeader from '@/components/main-header/index.vue'
export default {
  name: 'App',
  data() {
    return {

    }
  },

  components: {
    // MainFooter,
    MainHeader
  },

  mounted() {

  },

  methods: {

  },
}
</script>

<style>
.app {
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
  padding: 16px;
}
</style>
