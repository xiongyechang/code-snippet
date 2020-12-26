<template>
  <div id="app">
    <top-bar class="app-topbar"></top-bar>
    <router-view class="app-router-view"></router-view>
  </div>
</template>

<script>
import TopBar from '@/components/topbar.vue';
export default {
  name: 'App',
  components: {
    TopBar
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  width: 100%;
}
*{
  margin: 0;
  padding: 0;
}
:root {
  --primary-color: #31c17c;
}

#app {
  display: grid;
  grid-auto-rows: 33px calc(100% - 33px);
}
</style>
