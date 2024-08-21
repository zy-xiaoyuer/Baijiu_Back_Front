<template>
    <div style="height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px;">
        <div style="display: flex; align-items: center;cursor:pointer">
            <el-icon size="30px" @click="collapse">
                <!-- 使用 v-if 或 v-show 根据 icon prop 来决定显示哪个图标 -->
                <template v-if="icon === 'Fold'">
                    <Fold />
                </template>
                <template v-else>
                    <Expand />
                </template>
            </el-icon>

        </div>

        <div
            style="flex: 1; display: flex; justify-content: center; align-items: center;font-weight:bold;font-size:30px;margin-top:6px">
            白酒数据库后台管理系统
        </div>

        <div style="display: flex; align-items: center;">
            <div style="width: 40px; height: 40px;">
                <el-icon>
                    <UserFilled />
                </el-icon>
            </div>
            <el-dropdown>
                <span class="el-dropdown-link">
                    超级管理员
                    <el-icon class="el-icon--right">
                        <ArrowDown />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="userInfo" v-if="user">个人信息</el-dropdown-item>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item>退出登录</el-dropdown-item>
                        <el-dropdown-item>注销账号</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
// 导入所需的图标
import { ArrowDown, Expand, Fold, UserFilled } from '@element-plus/icons-vue';
export default {
    name: "HeaderView",
   
    props: {
        icon: {
            type: String,
            required: true
        },
       
    },
    components: {
        // 注册图标组件
        ArrowDown,
        Expand, // 懒加载图标组件
        Fold,// 懒加载图标组件
        UserFilled
    },

    methods: {
        userInfo() {

        console.log(this.user);
        },
        logout() {
        //sessionStorage.removeItem('CurUser');// 清除用户信息
            //this.$router.push({ name: 'LoginView' });

        },
        modifyPassword() {
            
            //this.$router.push({ name: 'ModifyPasswordView' });
        },

        collapse() {
            this.$emit('doCollapse');
        }


    }
}
</script>

<style>
.el-header {
    background-color: #9BA4AF;
    color: white;
    line-height: 50px;
}
</style>
