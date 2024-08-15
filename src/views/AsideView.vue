<template>
    <div>
        <el-col :span="12">
            <el-menu style="width:220px;min-height:100vh;" default-active="2" router class="el-menu-vertical-demo"
                @open="handleOpen" @close="handleClose">
                <el-sub-menu index="user">
                    <template #title>
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/userinfo">用户列表</el-menu-item>
                    <el-menu-item index="1-2">禁用用户</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon>
                            <Document />
                        </el-icon>
                        <span>赋酒诗词管理</span>
                    </template>
                    <el-menu-item index="/book">书籍列表</el-menu-item>
                    <el-menu-item index="2-2">下架书籍</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="3">
                    <el-icon>
                        <GobletSquareFull />
                    </el-icon>
                    <span>酒器管理</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <el-icon>
                        <Picture />
                    </el-icon>
                    <span>酒画管理</span>
                </el-menu-item>
                <el-menu-item index="5">
                    <el-icon>
                        <setting />
                    </el-icon>
                    <span>个人信息</span>
                </el-menu-item>
            </el-menu>
        </el-col>
    </div>

</template>

<script>
import { User, Picture, Document, Setting, GobletSquareFull } from '@element-plus/icons-vue';
export default {
    name: "AsideView",
    components:{
        //Location,
        Document,
        Setting,
        User,
        GobletSquareFull,
        Picture
    }
}
</script>

<style>

</style>
