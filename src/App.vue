<template>
  <div class="app">
    <MainFooter></MainFooter>
    <MainHeader></MainHeader>
    <router-view></router-view>
  </div>
</template>

<script>
import MainFooter from '@/components/main-footer/index.vue'
import MainHeader from '@/components/main-header/index.vue'
export default {
  name: 'App',
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

  },
}
</script>

<style>
.app {
  width: 100vw;
  height: 100vh;
  background-color: #020308;
  overflow: hidden;
}
</style>
