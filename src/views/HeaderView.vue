<template>
    <div style="height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px;">
        <div style="display: flex; align-items: center;">
            <el-icon size="30px" @click="isCollapse ? handleOpen : handleClose">
                <Expand v-show="!isCollapse" @click="handleClose()" />
                <Fold v-show="isCollapse" @click="handleOpen()" />
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
                    管理员
                    <el-icon class="el-icon--right">
                        <ArrowDown />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="UserInfo">个人信息</el-dropdown-item>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item>退出登录</el-dropdown-item>
                        <el-dropdown-item>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
// 导入所需的图标
import { ArrowDown,Expand,Fold, UserFilled} from '@element-plus/icons-vue';
export default {
    name: "HeaderView",
    
    components: {
        // 注册图标组件
        ArrowDown,
        Expand,
        Fold,
        UserFilled
    },
    data() {
        return {
            
        };
    },
    methods:{
        userInfo()
        {
            console.log("TOUSER")
        },
        handleOpen() {
            this.$emit('doCollapse', false); // 假设 true 代表展开  
            
        },
        handleClose() {
            this.$emit('doCollapse', true); // false 代表收起  
        }  
        
    }
}
</script>

<style>
.el-header {
    background-color: #9BA4AF;
    /* 举例背景颜色，您可以根据设计自行调整 */
    color: white;
    /* 确保文字颜色与背景色形成对比，易于阅读 */
    line-height: 50px;
}

</style>
