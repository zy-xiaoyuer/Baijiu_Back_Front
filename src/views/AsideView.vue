<template>
    <div>
        <el-col :span="12">
            <el-menu style="width:220px;min-height:100vh;" default-active="2" router class="el-menu-vertical-demo"
                @open="handleOpen" @close="handleClose">
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon>
                            <location />
                        </el-icon>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/home">用户列表</el-menu-item>
                    <el-menu-item index="1-2">禁用用户</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon>
                            <location />
                        </el-icon>
                        <span>书籍管理</span>
                    </template>
                    <el-menu-item index="/book">书籍列表</el-menu-item>
                    <el-menu-item index="2-2">下架书籍</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="3">
                    <el-icon>
                        <document />
                    </el-icon>
                    <span>公告管理</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <el-icon>
                        <document />
                    </el-icon>
                    <span>订单管理</span>
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
export default {
    name: "AsideView"
}
</script>

<style></style>
