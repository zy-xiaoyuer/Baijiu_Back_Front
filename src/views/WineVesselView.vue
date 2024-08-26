<template>
    <div>
        <!-- 功能区域 -->
        <div style="margin:10px px;margin-top:0px">
            <el-button type="primary" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增酒器</el-button>
        </div>
        <!-- 搜索区域 -->
        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的酒器" style="width:25%;" :prefix-icon="Search" />
            <el-button type="primary" clearable @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
        </div>

        <!-- 表格数据渲染用户列表信息 -->
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f2f5fc', color: '#55555' }"
            border>
            <el-table-column prop="id" label="酒器ID" width="70" />
            <el-table-column prop="name" label="酒器名" width="180" />
            <el-table-column prop="discription" label="描述"  />
            <el-table-column label="酒器图片" >
                <template v-slot="scope">
                    <img :src="getImageUrl(scope.row.id)" style="width: 100%; height: auto;">
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操 作" width="260">
                <template v-slot="scope">
                    <el-button type="success" size="large" @click="look(scope.row)">
                        查看
                    </el-button>

                    <el-popconfirm title="确认删除该条信息吗？" @confirm="del(scope.row.id)" style="margin-left:10px">
                        <template #reference>
                            <el-button type="danger" size="large">删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button type=" primary" size="large" @click="mod(scope.row)">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页列表 -->
        <div style="margin:10px 0px;">
            <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[4, 8, 12, 16]"
                :small="small" :disabled="disabled" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
        <!-- 添加用户的对话框 -->
        <div>
            <el-dialog v-model="dialogVisible" title="用户信息" width="30%" :before-close="handleClose">
                <!-- 表单数据 -->
                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                    <el-form-item label="用户名:" prop="username">
                        <el-input v-model="form.username" style="width: 80%;" clearable :disabled="isEditMode" />
                    </el-form-item>
                    <el-form-item label="密码:" prop="password">
                        <el-input v-model="form.password" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="昵称:" prop="nickname">
                        <el-input v-model="form.nickname" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="性  别:" prop="sex">
                        <el-radio v-model="form.sex" label="1" size="large">男</el-radio>
                        <el-radio v-model="form.sex" label="0" size="large">女</el-radio>
                    </el-form-item>
                    <el-form-item label="邮  箱:" prop="email">
                        <el-input type="textarea" v-model="form.email" style="width: 80%;" clearable />
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
    data() {
        let checkAge = (rule, value, callback) => {
            if (value > 150) {
                callback(new Error('年龄输入过大'));
            }
            else {
                callback();
            }
        };
        let checkDuplicate = (rule, value, callback, el) => {
            let username = el.form.username;
            request.get(`/users/api/findByUsername?username=${username}`)
                .then(res => {
                    console.log(res);
                    if (res.code === 200) {
                        callback(new Error('账号已经存在'));
                    } else {
                        callback();
                    }
                })
                .catch(() => {
                    callback(new Error('检查用户名时发生错误'));
                });
        };

        return {
            tableData: [],
            pageNum: 1,
            pageSize: 8,
            total: 0,
            isEditMode: false, // 新增这个属性来标记是否为编辑模式  
            search: "",
            dialogVisible: false,
            form: {
                id: '',
                username: '',
                password: '',
                nickname: '',
                sex: '1',
                email: ''

            },
            rules: {
                username: [
                    { required: true, message: "请输入用户名!", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            if (!this.isEditMode) {
                                checkDuplicate(rule, value, callback, this);
                            } else {

                                callback();
                            }
                        }, trigger: 'blur'
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
                email: [
                    { required: true, message: "请输入邮箱!", trigger: "blur" }
                ],
                // age:[
                //     {required:true,message:"请输入年龄！",trigger:"blur"},
                //     {min:1,max:3,message:"长度在1到三位",trigger:"blur"},
                //     {pattern:/^([1-9][0-9]*){1,3}$/,message:'年龄必须为正整数',trigger:"blur"},
                //     {validator:checkAge,trigger:'blur'}
                // ],
                // phone:[
                //     { required: true, message: "请输入手机号！", trigger: "blur" },
                //     { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: "blur" },
                // ]

                //年龄和手机号
            }
        }
    },
    mounted() {
        this.load();
    },

    methods: {
        getImageUrl(imageId) {
            // 调用后端接口获取图片的URL
            return this.$httpURL+`/vesselTotal/api/get-image/${imageId}`;
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                    //
                });
        },

        load() {
            request.post("vesselTotal/api/listPage", {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                params: {
                    rname: this.search
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
            console.log('每页${val}条');
            this.pageNum = 1;
            this.pageSize = val;
            this.load();
        },
        handleCurrentChange(val) {
            console.log('当前页：${val}');
            this.currentPage = val;
            this.load();
        },
        add() {
            //显示对话框
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.resetForm();
            })

        },
        mod(row) {
            console.log(row);
            if (row.id) {
                this.$nextTick(() => {
                    this.form.id = row.id; // 用于识别编辑操作
                    this.form.name = row.name; // 填充数据，但不允许修改
                    this.form.password = row.password;
                    this.form.nickname = row.nickname;
                    this.form.sex = row.sex + '';
                    this.form.email = row.email;
                    this.isEditMode = true; // 设置为编辑模式  
                    this.dialogVisible = true;
                })
            }
        },
        del(id) {
            request.get(`vesselTotal/api/delete?id=${id}`).then(res => {
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
            request.post("vesselTotal/api/save", this.form).then(res => {
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
        },
        doMod() {
            request.post("vesselTotal/api/mod", this.form).then(res => {
                console.log(res);
                if (res.code === 200) {
                    this.$message({
                        message: '用户信息修改成功！',
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

        },
        save() {
            this.$refs["form"].validate((valid) => {
                //校验通过发起请求保存用户信息
                // console.log(valid);
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
    }
}
</script>

<style></style>
