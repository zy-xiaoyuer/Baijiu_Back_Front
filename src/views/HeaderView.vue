<template>
    <div style="height:50px;line-height:50px;
    border-bottom:solid 1px darkcyan;display: flex;">
        <div style="width: 250px;padding-left:30px;font-weight:bold;color:deepskyblue;">
            白酒数据库后台管理系统
        </div>
        <div style="flex:1;"></div>
        <div style="width:100px;padding-right:30px;padding-top:20px;">
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
                        <el-dropdown-item>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
// 导入所需的图标
import { ArrowDown } from '@element-plus/icons-vue';
export default {
    name: "HeaderView",
    
    components: {
        // 注册图标组件
        ArrowDown
    },
}
</script>

<style>

</style>
