
<template>
  <div class="common-layout">
   
    <el-container style="height:100vh">
      
      <el-aside width="asideWidth" style="height: 100%;overflow: hidden;overflow-y: auto">
        <Aside :isCollapse="isCollapse"></Aside>
      </el-aside>

      <el-container :style="{ marginLeft: asideWidth + 'px' }">
        <el-header>
          <Header @doCollapse="doCollapse" :icon="icon" ></Header>
        </el-header>
       
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import Header from '@/views/HeaderView.vue'
import Aside from '@/views/AsideView.vue'

export default {
  name: "HomeView",
  components: {
    Header,
    Aside,
  },
  data()
  {
    return{
      isCollapse:false,
      asideWidth:'200px',
      icon:"Fold"
    }
  },
  methods:{
    doCollapse() {
      this.isCollapse = !this.isCollapse
      this.asideWidth = this.isCollapse ? '64px' : '220px';
      this.icon = this.isCollapse ? 'Expand' : 'Fold';
    },
    
  }

}
</script>

<style>


</style>
