<template>
    <div>
        <h1>用户列表页面</h1>
        <!-- 表格数据渲染用户列表信息 -->
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="用户ID" width="180" />
            <el-table-column prop="username" label="用户名" width="180" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="sex" label="性别" />
            <el-table-column prop="address" label="地址" />
            <el-table-column fixed="right" label="操   作" width="300">
                <el-button type="success" size="small">
                    查看
                </el-button>
                <el-button type="danger" size="small">
                    删除
                </el-button>
                <el-button type="primary" size="small">
                    编辑
                </el-button>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getData } from "@/utils/requestUtil";

export default {
    name: "UserHome",
    data() {
        return {
            tableData: []
        }
    },
    created() {
        this.load();
    },
    methods: {
        load() {
            getData("users/loadAll").then(res => {
                console.log(res);
                this.tableData = res.data;
            });
        }
    }
}
</script>

<style></style>
