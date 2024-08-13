<template>
    <div class="container">
        <el-form ref="ruleFormRef" :model="loginUser" :rules="rules" label-width="100px" class="login-form">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="loginUser.name" placeholder="请输入用户名"></el-input>
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
import axios from 'axios'; // 确保你已经在项目中安装了axios  

export default {
    data() {
        return {
            loginUser: {
                name: '',
                password: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 30, message: '密码长度在 6 到 30 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        async submitForm() {
            try {
                // 使用Element UI的表单验证  
                this.$refs.ruleFormRef.validate((valid) => {
                    if (valid) {
                        // 发送请求到后端  
                        axios.post('/user/api/getUserPassword', this.loginUser)
                            .then(response => {
                                if (response.data === 'ok') {
                                    alert('登录成功！');
                                    // 可以在这里添加登录成功后的逻辑，如页面跳转  
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
/* 你的样式 */
</style>