<template>
    <div class="container">
        <el-form ref="ruleFormRef" :model="loginUser" :rules="rules" label-width="100px" class="login-form">
            <div class="form-header">Login</div>
            <el-form-item label="姓名" prop="username">
                <el-input v-model="loginUser.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="loginUser.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import request from '@/api/request';  

export default {
    data() {
        return {
            loginUser:{
                username: '',
                password: '',
            },
           
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            }
        };
    },
    methods: {
        async submitForm() {
            try {
                // 使用Element UI的表单验证  
                this.$refs.ruleFormRef.validate(async (valid) => {
                    if (valid) {
                        // 发送请求到后端  
                        request.post('/admin/api/getUserPassword', this.loginUser)
                            .then(response => {
                                if (response.code === 200) {
                                    alert('登录成功！');
                                    
                                    this.$router.push({ name: 'HomeView' });
                                } else {
                                    alert('登录失败，用户名或密码错误！');
                                }
                            })
                            .catch(error => {
                                console.error('登录请求失败:', error);
                                alert('登录请求失败，请稍后再试！');
                            });
                    } else {
                        console.log('表单验证失败！');
                        return false;
                    }
                });
            } catch (error) {
                console.error('submitForm方法内部错误:', error);
            }
        }
    }
};  
</script>

<style scoped>
.form-header {
    font-size: 38px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    /* Use viewport height to center the form */
    margin: 0;
    padding: 0;
    background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);
}

.login-form {
    width: 358px;
    border-radius: 15px;
    padding: 30px;
    background: #ffffff;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-form .el-form-item {
    margin-bottom: 24px;
}

.el-button {
    width: 100%;
}
</style>