<template>
    <div style="height:auto">
        <div style="margin:10px px;margin-top:0px">
            <el-button type="primary" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增用户</el-button>
        </div>

        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的用户名" style="width:25%;" :prefix-icon="Search" />
            <el-button type="primary" clearable @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f2f5fc', color: '#55555'}"
            border>
            <el-table-column prop="id" label="用户ID" width="40" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="sex" label="性别" width="60">
                <template v-slot="scope">
                    <el-tag :type="scope.row.sex === '1' ? 'primary' : 'success'" disable-transitions>{{ scope.row.sex
                        === '1' ? '男' : '女' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="60" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column fixed="right" label="操 作" width="200">
                <template v-slot="scope">
                    <el-popconfirm title="确认删除该条信息吗？" @confirm="del(scope.row.id)" style="margin-left:10px">
                        <template #reference>
                            <el-button type="danger" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button type="primary" size="small" @click="look(scope.row)">
                        查看
                    </el-button>
                    <el-button type=" primary" size="small" @click="mod(scope.row)">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin:10px 0px;">
            <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[4, 8, 12, 16]"
                :small="small" :disabled="disabled" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <div>
            <el-dialog v-model="dialogVisible" title="用户信息" width="30%" :before-close="handleClose">
                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                    <el-form-item label="用户名:" prop="username">
                        <el-input v-model="form.username" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="密码:" prop="password">
                        <el-input v-model="form.password" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="昵称:" prop="nickname">
                        <el-input v-model="form.nickname" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="性  别:" prop="sex">
                        <el-radio v-model="form.sex" label="1" size="large" :disabled="!isEditMode">男</el-radio>
                        <el-radio v-model="form.sex" label="0" size="large" :disabled="!isEditMode">女</el-radio>
                    </el-form-item>
                    <el-form-item label="年龄:" prop="age">
                        <el-input v-model="form.age" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="手机号:" prop="phone">
                        <el-input v-model="form.phone" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="邮  箱:" prop="email">
                        <el-input type="textarea" v-model="form.email" style="width: 80%;" clearable
                            :disabled="!isEditMode" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="save">确认</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script>

import request from '@/api/request';

export default {
    name: "UserHome",
    
    mounted() {
        this.load();
    },
    methods: {
        checkDuplicateUsername(username, callback) {
            request.get(`/users/api/findByUsername?username=${username}`)
                .then(res => {
                    if (res.code === 200) {
                        callback(new Error('账号已经存在'));
                    } else {
                        callback();
                    }
                })
                .catch(() => {
                    callback(new Error('检查用户名时发生错误'));
                });
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.$nextTick(() => {
                        this.dialogVisible = false;
                        this.$nextTick(() => {
                            this.resetForm();
                        })
                        this.isEditMode = false;
                    })
                    done();
                })
                .catch(_ => {
                    //
                });
        },

        load() {
            request.post("users/api/listPage", {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                params: {
                    username: this.search,
                }
            })
                .then(res => {//res已经是data了
                    console.log(res)
                    if (res.code === 200) {
                        this.tableData = res.data;
                        this.total = res.total;
                    } else {
                        alert('数据获取失败：' + res.msg);
                    }

                })
        },

        handleSizeChange(val) {
            //console.log('每页${val}条');
            this.pageNum = 1;
            this.pageSize = val;
            this.load();
        },
        handleCurrentChange(val) {
            //console.log('当前页：${val}');
            this.currentPage = val;
            this.load();
        },
        add() {
            this.isEditMode = false; 
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.resetForm();
            })
        },
        mod(row) {
            if (row.id) {
                this.$nextTick(() => {
                    this.isEditMode = true;
                    this.form.id = row.id;
                    this.form.username = row.username;
                    this.form.password = row.password;
                    this.form.nickname = row.nickname;
                    this.form.sex = row.sex + '';
                    this.form.age=row.age,
                    this.form.phone=row.phone,
                    this.form.email = row.email;
                    this.dialogVisible = true;
                })
            }
        },
       

        look(row) {
            if (row.id) {
                this.$nextTick(() => {
                    this.isEditMode = false;
                    this.form.id = row.id;
                    this.form.username = row.username;
                    this.form.password = row.password;
                    this.form.nickname = row.nickname;
                    this.form.sex = row.sex + '';
                    this.form.age = row.age,
                    this.form.phone = row.phone,
                    this.form.email = row.email;
                    this.dialogVisible = true;
                    
                })
            }
        },
        del(id) {
            request.get(`users/api/delete?id=${id}`).then(res => {
                console.log(res);
                if (res.code === 200) {
                    this.$message({
                        message: '成功删除用户信息！',
                        type: 'success',
                    });
                    this.load();

                } else {
                    this.$message({
                        message: '删除用户信息失败！',
                        type: 'error',
                    });
                }
            });

        },
        resetForm() {
            this.$refs.form.resetFields();
        },
        doSave() {
            this.checkDuplicateUsername(this.form.username, (isUnique) => {
                if (isUnique) {
                    request.post("users/api/save", this.form).then(res => {
                        console.log(res);
                        if (res.code === 200) {
                            this.$message({
                                message: '成功添加用户信息！',
                                type: 'success',
                            });
                            this.dialogVisible = false;
                            this.load();
                            this.resetForm();
                        } else {
                            this.$message({
                                message: '添加用户信息失败！',
                                type: 'error',
                            });
                        }
                    });
                } else {
                    alert('用户名已存在，请选择其他用户名。');
                }
            });
        },
        doMod() {
            this.checkDuplicateUsername(this.form.username, (isUnique) => {
                if (isUnique) {
                    request.post("users/api/mod", this.form).then(res => {
                        console.log(res);
                        if (res.code === 200) {
                            this.$message({
                                message: '成功修改用户信息！',
                                type: 'success',
                            });
                            this.dialogVisible = false;
                            this.load();
                            this.resetForm();
                        } else {
                            this.$message({
                                message: '修改用户信息失败！',
                                type: 'error',
                            });
                        }
                    });
                } else {
                    alert('用户名已存在，请选择其他用户名。');
                }
            });

        },
        save() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.isEditMode) {
                        this.doMod()
                    } else {
                        this.doSave();
                    }
                } else {
                    console.log('表单验证失败');
                    return false;
                }
            });
        }
    },
    data() {
        let checkAge = (rule, value, callback) => {
            if (value > 150) {
                callback(new Error('年龄输入过大'));
            }
            else {
                callback();
            }
        };

        return {
            tableData: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            isEditMode: false, //false:查看；true：编辑
            search: "",
            dialogVisible: false,
            form: {
                id: '',
                username: '',
                password: '',
                nickname: '',
                sex: '',
                age: '',
                phone: '',
                email: ''

            },
            rules: {
                username: [
                    { required: true, message: "请输入用户名!", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            this.checkDuplicateUsername(value, (err) => {
                                if (err) {
                                    callback(new Error('账号已经存在'));
                                } else {
                                    callback();
                                }
                            });
                        }
                        , trigger: 'blur'
                    }
                ],
                password: [
                    { required: true, message: "请输入密码!", trigger: "blur" }
                ],
                nickname: [
                    { required: true, message: "请输入昵称!", trigger: "blur" }
                ],
                sex: [
                    { required: true, message: "请选择性别!", trigger: "blur" }
                ],
                age: [
                    { message: "请输入年龄！", trigger: "blur" },
                    { min: 1, max: 3, message: "长度在1到三位", trigger: "blur" },
                    { pattern: /^([1-9][0-9]*){1,3}$/, message: '年龄必须为正整数', trigger: "blur" },
                    { validator: checkAge, trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: "请输入手机号！", trigger: "blur" },
                    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: "blur" },
                ],
                email: [
                    { message: "请输入邮箱!", trigger: "blur" }
                ],
            }
        }
    },
}
</script>

<style>

</style>
