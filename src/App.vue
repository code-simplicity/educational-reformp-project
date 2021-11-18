<template>
  <div class="app">
    <MainHeader v-if="loginStatus"></MainHeader>
    <router-view></router-view>
    <div class="footer">
      <MainFooter></MainFooter>
    </div>
  </div>
</template>

<script>
import MainFooter from '@/components/main-footer/index.vue'
import MainHeader from '@/components/main-header/index.vue'

import { mapGetters } from 'vuex'
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

  computed: {
    ...mapGetters('user', { loginStatus: 'login_Status', userInfo: 'user_Info' }),
  },

  mounted() {
    // this.onresize()
    // this.setRem()

  },

  methods: {
    // onresize() {
    //   window.onresize = () => {
    //     this.setRem()
    //   }
    // },

    // setRem() {
    //   const baseSize = 16
    //   const scale = document.documentElement.clientWidth / 1920
    //   document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
    // }
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
.footer {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  /* margin-top: 16px; */
}
</style>
