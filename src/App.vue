<template>
  <nav class="nav-bar">
    <button class="nav-button" @click="goToLogin">登录</button>
    <button class="nav-button" @click="goToRegister">注册</button>
  </nav>
  <div v-if="isLoginActive">
    <!-- 登录表单 -->
  </div>
  <div v-else>
    <!-- 注册表单 -->
  </div>
  <router-view /> 
</template>

<script>
export default {
  data() {
    return {
      isLoginActive: true, // 控制显示登录还是注册表单  
    };
  },
  methods: {
    goToLogin() {
      this.$router.push('/login');
      this.isLoginActive = true;
    },
    goToRegister() {
      this.$router.push('/register');
      this.isLoginActive = false;
    },
  },
};  
</script>

<style scoped>
.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  background-image: linear-gradient(to right, #a6c1ee, #fbc2eb);
}

.nav-button {
  padding: 10px 20px;
  margin: 0 5px;
  font-size: 16px;
  color: #ffffff;
  /* 通常按钮上的文字颜色为白色或对比色 */
  background-color: #652727;
  /* 你可以根据需要调整按钮的背景色 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-button:hover {
  background-color: #e9ecef;
  /* 鼠标悬停时的背景色 */
}
</style>