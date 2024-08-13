<template>
  <div>
    <!-- 头部 -->
    <Header></Header>
    <div style="display:flex;">
      <!-- 侧边导航栏 -->
      <Aside></Aside>
      <!-- 内容区域 -->
      <router-view style="flex:1;"></router-view>
    </div>
  </div>
</template>

<script>

import Header from '@/views/HeaderView.vue'
import Aside from '@/views/AsideView.vue'

export default {
  name: "HomeView",
  components: {
    Header,
    Aside
  }

}
</script>

<style></style>
