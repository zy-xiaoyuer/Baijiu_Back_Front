<template>
    <div style="padding:10px;">
        <h1>用户列表页面</h1>
        <!-- 功能区域 -->
        <div style="margin:10px 0px;">
            <el-button type="primary" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增用户</el-button>
            <el-button type="danger"><el-icon>
                    <DocumentDelete />
                </el-icon>删除用户</el-button>
            <el-button type="danger"><el-icon>
                    <Delete />
                </el-icon>批量删除</el-button>
            <el-button type="success"><el-icon>
                    <Edit />
                </el-icon>修改用户</el-button>
            <el-button type="info">导入用户</el-button>
            <el-button type="warning">导出用户</el-button>
            <el-button type="info">帮助中心</el-button>
        </div>
        <!-- 搜索区域 -->
        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的条件" style="width:25%;" :prefix-icon="Search" />
            <el-button type="primary" @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
        </div>

        <!-- 表格数据渲染用户列表信息 -->
        <el-table :data="tableData" style="width: 100%" border>
            <el-table-column prop="id" label="用户ID" width="180" />
            <el-table-column prop="username" label="用户名" width="180" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="sex" label="性别" />
            <el-table-column prop="email" label="邮箱" />
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
        <!-- 分页列表 -->
        <div style="margin:10px 0px;">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[2, 5, 10, 20]"
                :small="small" :disabled="disabled" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
        <!-- 添加用户的对话框 -->
        <div>
            <el-dialog v-model="dialogVisible" title="用户信息" width="30%">
                <!-- 表单数据 -->
                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                    <el-form-item label="用户名:" prop="username">
                        <el-input v-model="form.username" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="密码:" prop="password">
                        <el-input v-model="form.password" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="昵称:" prop="nickname">
                        <el-input v-model="form.nickname" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="性  别:" prop="sex">
                        <el-radio v-model="form.sex" label="男" size="large">男</el-radio>
                        <el-radio v-model="form.sex" label="女" size="large">女</el-radio>
                        <el-radio v-model="form.sex" label="未知" size="large">未知</el-radio>
                    </el-form-item>email
                    <el-form-item label="邮  箱:" prop="email">
                        <el-input type="textarea" v-model="form.email" style="width: 80%;" clearable />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">关闭</el-button>
                        <el-button type="primary" @click="save">确认</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { getData, postData } from "@/utils/requestUtil";


export default {
    name: "UserHome",
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 2,
            total: 0,
            search: "",
            dialogVisible: false,
            form: {},
            rules: {
                username: [
                    { required: true, message: "请输入用户名!", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码!", trigger: "blur" }
                ],
                nickname: [
                    { required: true, message: "请输入昵称!", trigger: "blur" }
                ],
                address: [
                    { required: true, message: "请输入邮箱!", trigger: "blur" }
                ]
            }
        }
    },
    created() {
        this.load();
    },
    methods: {
        load() {
            getData("users/api/loadAll", {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                search: this.search
            }).then(res => {
                // res 已经是 records 数组 
                this.tableData = res.data;
                this.total = res.total;
            });
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.load();
        },
        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            this.load();
        },
        add() {
            //显示对话框
            this.dialogVisible = true;
            this.form = {};
        },
        save() {
            //表单提交处理
            //表单校验处理
            this.$refs["form"].validate((valid) => {
                //校验通过发起请求保存用户信息
                // console.log(valid);
                if (valid) {
                    postData("user/api/save", this.form).then(res => {
                        console.log(res.data);
                        if (res.data) {
                            this.load();
                            this.dialogVisible = false;
                            this.$message({
                                message: '成功添加用户信息！',
                                type: 'success',
                            });
                        } else {
                            //ElMessage.error('添加用户信息失败！');
                        }
                    });
                }
            });
        }
    }
}
</script>

<style></style>
