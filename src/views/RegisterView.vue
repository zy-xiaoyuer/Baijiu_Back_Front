<template>
    <div class="register-container">
        <el-form ref="registerFormRef" :model="registerUser" :rules="rules" label-width="100px" class="register-form">
            <div class="form-header">Register</div>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="registerUser.username" placeholder="请设置用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="registerUser.password"
                    placeholder="请设置密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
                <el-input type="password" v-model="registerUser.repassword"
                    placeholder="请确认密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitRegisterForm">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "RegisterView",
    data() {
        return {
            registerUser: {
                username: '',
                password: '',
                repassword: ''
            },
            rules: {
                username: [
                    { required: true, message: 'Please enter your username', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please enter your password', trigger: 'blur' },
                    { min: 6, max: 30, message: 'Password length should be between 6 and 30 characters', trigger: 'blur' }
                ],
                repassword: [
                    { required: true, message: 'Please confirm your password', trigger: 'blur' },
                    { validator: this.confirmPassword, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        confirmPassword(rule, value, callback) {
            if (value !== this.registerUser.password) {
                callback(new Error('The password does not match'));
            } else {
                callback();
            }
        },
        async submitRegisterForm() {
            this.$refs.registerFormRef.validate((valid) => {
                if (valid) {
                    // 发送请求到后端进行注册逻辑
                    axios.post('/register/api/registerUser', this.registerUser)
                        .then(response => {
                            if (response.data.success) {
                                alert('Registration successful!');
                                // 注册成功后的逻辑
                            } else {
                                alert('Registration failed, please try again!');
                            }
                        })
                        .catch(error => {
                            console.error('Registration request failed:', error);
                            alert('Registration request failed, please try again later!');
                        });
                } else {
                    console.log('Registration form validation failed!');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);
}

.register-form {
    width: 358px;
    border: 1px solid #dc9e9e;
    border-radius: 15px;
    padding: 30px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-header {
    font-size: 38px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}
.el-button {
    width: 100%;
}
/* You can add more styles as needed */
</style>