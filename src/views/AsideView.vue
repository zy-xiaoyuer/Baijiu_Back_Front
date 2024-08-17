<template>
    <div>
        <el-col :span="24">
            <el-menu style="width:inherit;min-height:100vh;background-color: #f5f7fa;" default-active="/home" router
                class="el-menu-vertical-demo" :collapse="isCollapse" :collapse-transition="false">

                <el-sub-menu index="/home">
                    <template #title>
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/userinfo">
                        用户列表
                    </el-menu-item>
                    <el-menu-item index="1-2">禁用用户</el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="/wine">
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
                    <template #title>
                        <span>酒器管理</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="4">
                    <el-icon>
                        <Picture />
                    </el-icon>
                    <template #title>
                        <span>酒画管理</span>
                    </template>
                </el-menu-item>

            </el-menu>
        </el-col>
    </div>

</template>

<script>
import { User, Picture, Document, GobletSquareFull } from '@element-plus/icons-vue';
export default {
    name: "AsideView",
    components: {
        
        Document,
        User,
        GobletSquareFull,
        Picture
    },
    data()
    {
        return{
            //iscollapse:false  
        }
    },
    props:{
        isCollapse:Boolean
    }
}
</script>
<style>
.el-menu-vertical-demo {

    border-top: 1px solid #9BA4AF;
}
</style>