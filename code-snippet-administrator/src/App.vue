<template>
  <div id="app">
    <top-bar class="app-topbar"></top-bar>
    <router-view class="app-router-view"></router-view>
    <router-view class="app-router-view" name="blank"></router-view>
    <bottom-bar></bottom-bar>
  </div>
</template>

<script>
import TopBar from '@/components/topbar.vue';
import BottomBar from '@/components/bottombar.vue';
export default {
  name: 'App',
  components: {
    TopBar,
    BottomBar
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
  grid-auto-rows: 33px calc(100% - 66px) 33px;
  overflow: hidden;
  height: 100%;
}

.flex-center-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.code-snippet-disabled, .code-snippet-disabled:hover {
  background: pink !important;
}

.full-height {
  height: 100%;
}

.app-router-view {
  height: 100%;
}

.pad5 {
  padding: 5px;
}

.pad10 {
  padding: 10px;
}

.mgn10 {
  margin: 10px;
}
</style>
