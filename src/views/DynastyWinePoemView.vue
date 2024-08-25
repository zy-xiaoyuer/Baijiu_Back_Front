<template>
    <div>
        <div style="margin:10px px;margin-top:0px">
            <el-button type="primary" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增酒诗</el-button>
        </div>
        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的酒诗" style="width:25%;" :prefix-icon="Search" />
            <el-button type="primary" clearable @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f2f5fc', color: '#55555' }"
            border>
            <el-table-column prop="id" label="酒诗ID" width="40" />
            <el-table-column prop="title" label="标题" width="100" />
            <el-table-column prop="dynasty" label="朝代" width="60" />
            <el-table-column prop="author" label="作者" width="60" />
            <el-table-column prop="place" label="地点" width="50" />
            <el-table-column prop="time" label="创作年份" width="50" />
            <el-table-column prop="content" label="内容" />
            <el-table-column prop="emotion" label="总体情感" width="50" />
            <el-table-column prop="emotionList" label="每句对应情感" width="90" />
            <el-table-column fixed="right" label="操 作" width="200">
                <template v-slot="scope">
                    <el-popconfirm title="确认删除该条信息吗？" @confirm="del(scope.row.id)" style="margin-left:10px">
                        <template #reference>
                            <el-button type="danger" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
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
            <el-dialog v-model="dialogVisible" title="酒诗信息" style="height:100%;width:60%;" :before-close="handleClose">

                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                    <el-form-item label="标题:" prop="title">
                        <el-input v-model="form.title" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="朝代:" prop="dynasty">
                        <el-input v-model="form.dynasty" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="作者:" prop="author">
                        <el-input v-model="form.author" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="地点:" prop="place">
                        <el-input v-model="form.place" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="创作年份:" prop="time">
                        <el-input v-model="form.time" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="内容:" prop="content">
                        <el-input type="textarea" v-model="form.content" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="情感:" prop="emotion">
                        <el-input v-model="form.emotion" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="每句对应情感:" prop="emotionList">
                        <el-input type="textarea" v-model="form.emotionList" style="width: 80%;" clearable />
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
    name: "DynastyPoems",
    data() {
        let checkDuplicate = (rule, value, callback, el) => {
            let title = el.form.title;
            request.get(`/poemsbydynasty/api/findByTitle?title=${title}`)
                .then(res => {
                    if (res.code === 200) {
                        callback(new Error('酒诗已经存在'));
                    } else {
                        callback();
                    }
                })
                .catch(() => {
                    callback(new Error('检查酒诗标题时发生错误'));
                });
        };
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            isEditMode: false, 
            search: "",
            dialogVisible: false,
            form: {
                id: '',
                title: '',
                dynasty: '',
                author: '',
                place: '',
                time: '',
                content:'',
                emotion:'',
                emotionList:'',
            },
            rules: {
                title: [
                    { required: true, message: "请输入酒诗标题!", trigger: "blur" },
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
                dynasty: [
                    { required: true, message: "请输入酒诗朝代!", trigger: "blur" }
                ],
                author: [
                    { required: true, message: "请输入酒诗作者!", trigger: "blur" }
                ],
                place: [
                    { message: "请输入酒诗创作地点!", trigger: "blur" }
                ],
                time: [
                    {  message: "请输入酒诗创作时间!", trigger: "blur" }
                ],
                content: [
                    { required: true, message: "请输入酒诗内容!", trigger: "blur" }
                ],
                emotion: [
                    { required: true, message: "请输入酒诗总体情感!", trigger: "blur" }
                ],
                emotionList: [
                    { required: true, message: "请输入酒诗每句对应情感!", trigger: "blur" }
                ], 
            }
        }
    },
    mounted() {
        this.load();
    },

    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_=> {
                    done();
                })
                .catch(_ => {
                    //
                });
        },

        load() {
            request.post("poemsbydynasty/api/listPage", {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                params: {
                    title: this.search
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
                this.form.id = row.id; // 用于识别编辑操作
                this.form.username = row.username; // 填充数据，但不允许修改
                this.form.password = row.password;
                this.form.nickname = row.nickname;
                this.form.sex = row.sex + '';
                this.form.email = row.email;
                this.isEditMode = true; // 设置为编辑模式  
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.resetForm();
                })
            }
        },
        del(id) {
            request.get(`poemsbydynasty/api/delete?id=${id}`).then(res => {
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
            request.post("poemsbydynasty/api/save", this.form).then(res => {
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
            request.post("poemsbydynasty/api/mod", this.form).then(res => {
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
