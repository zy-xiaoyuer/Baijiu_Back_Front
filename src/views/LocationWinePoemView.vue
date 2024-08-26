<template>
    <div>
        <div style="margin:10px px;margin-top:0px">
            <el-button type="primary" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增酒诗</el-button>
        </div>

        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的酒诗的作者或朝代" style="width:25%;"
                :prefix-icon="Search" />
            <span style="margin-left: 10px;"></span>
            <el-button type="primary" clearable @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
        </div>


        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f2f5fc', color: '#55555' }"
            border>
            <el-table-column prop="id" label="酒诗ID" width="40" />
            <el-table-column prop="fullName" label="地点全称" width="60" />
            <el-table-column prop="country" label="国家" width="60" />
            <el-table-column prop="province" label="省份" width="50" />
            <el-table-column prop="district" label="区/县" width="50" />
            <el-table-column prop="poetry" label="酒诗题目" width="120" />
            <el-table-column prop="dynasty" label="朝代" width="30" />
            <el-table-column prop="author" label="作者" width="60" />
            <el-table-column prop="time" label="创作年份" width="30" />
            <el-table-column prop="content" label="内容" />
            <el-table-column prop="emotion" label="情感" width="30" />
            <el-table-column prop="coordinates" label="创作地理坐标" width="90" />
            <el-table-column fixed="right" label="操 作" width="200">
                <template v-slot="scope">
                    <el-button type="success" size="small" @click="look(scope.row)">
                        查看
                    </el-button>
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
            <el-dialog v-model="dialogVisible" title="酒诗信息" width="30%" :before-close="handleClose">
                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                    <el-form-item label="地点全称:" prop="fullName">
                        <el-input v-model="form.fullName" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="国家:" prop="country">
                        <el-input v-model="form.country" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>

                    <el-form-item label="省份:" prop="province">
                        <el-input v-model="form.province" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="区/县:" prop="district">
                        <el-input v-model="form.district" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="酒诗题目:" prop="poetry">
                        <el-input v-model="form.poetry" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="朝代：" prop="dynasty">
                        <el-input v-model="form.dynasty" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="作者:" prop="author">
                        <el-input v-model="form.author" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="创作年份:" prop="time">
                        <el-input v-model="form.time" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="内容:" prop="content">
                        <el-input type="textarea" v-model="form.content" style="width: 80%;" clearable
                            :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="情感:" prop="emotion">
                        <el-input v-model="form.emotion" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="创作地理坐标:" prop="coordinates">
                        <el-input v-model="form.coordinates" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer" v-if="isEditMode">
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
    name: "LocationPoem",
    data() {
        
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 8,
            total: 0,
            isEditMode: false, 
            search: "",
            dialogVisible: false,
            form: {
                id: '',
                fullName: '',
                country: '',
                province: '',
                district: '',
                author: '',
                time: '',
                content: '',
                emotion: '',
                coordinates: ''

            },
            rules: {
                fullName: [
                    { required: true, message: "请输入酒诗地点全称!", trigger: "blur" },
                   
                ],
                country: [
                    { required: true, message: "请输入作诗国家!", trigger: "blur" }
                ],
                province: [
                    { required: true, message: "请输入作诗省份!", trigger: "blur" }
                ],
                district: [
                    {  message: "请选择作诗区/县!", trigger: "blur" }
                ],
                poetry: [
                    { required: true, message: "请输入酒诗题目!", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            this.checkDuplicatePoetry(value, (err) => {
                                if (err) {
                                    callback(new Error('酒诗已经存在'));
                                } else {
                                    callback();
                                }
                            });
                        }, trigger: 'blur'
                    }
                ],
                dynasty: [
                    { required: true, message: "请输入酒诗朝代!", trigger: "blur" }
                ],
                author: [
                    { required: true, message: "请输入酒诗作者!", trigger: "blur" }
                ],
                time: [
                    { required: true, message: "请输入酒诗创作年份!", trigger: "blur" }
                ],
                content: [
                    { required: true, message: "请输入酒诗内容!", trigger: "blur" }
                ],
               emotion: [
                    { required: true, message: "请输入酒诗情感!", trigger: "blur" }
                ],
                coordinates: [
                    { required: true, message: "请输入酒诗创作地理坐标(格式:[25,25])!", trigger: "blur" }
                ],
                
            }
        }
    },
    mounted() {
        this.load();
    },

    methods: {
        checkDuplicatePoetry(poetry, callback) {
            request.get(`/poemsbylocation/api/findByPoetry?poetry=${poetry}`)
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
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.dialogVisible = false;
                    this.$nextTick(() => {
                        this.resetForm();
                    })
                    done();
                })
                .catch(_ => {
                    //
                });
        },

        load() {
            request.post("poemsbylocation/api/listPage", {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                params: {
                    search: this.search
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
            console.log('当前页：${val}');
            this.currentPage = val;
            this.load();
        },
        add() {
            this.isEditMode = true;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.resetForm();
            })

        },
        mod(row) {
            //console.log(row);
            if (row.id) {
                this.$nextTick(() => {
                    this.isEditMode = true; 
                    this.form.id = row.id; 
                    this.form.fullName = row.fullName; 
                    this.form.country= row.country;
                    this.form.province = row.province;
                    this.form.district = row.district;
                    this.form.poetry = row.poetry;
                    this.form.dynasty = row.dynasty;
                    this.form.author = row.author;
                    this.form.time = row.time;
                    this.form.content = row.content;
                    this.form.emotion = row.emotion;
                    this.form.coordinates = row.coordinates;
                    this.dialogVisible = true;
                })
            }
        },
        look(row)
        {
            if(row.id){
                this.$nextTick(() => {
                    this.isEditMode = false;
                    this.form.id = row.id;
                    this.form.fullName = row.fullName;
                    this.form.country = row.country;
                    this.form.province = row.province;
                    this.form.district = row.district;
                    this.form.poetry = row.poetry;
                    this.form.dynasty = row.dynasty;
                    this.form.author = row.author;
                    this.form.time = row.time;
                    this.form.content = row.content;
                    this.form.emotion = row.emotion;
                    this.form.coordinates = row.coordinates;
                    this.dialogVisible = true;
                })

        }
        },
        del(id) {
            request.get(`poemsbylocation/api/delete?id=${id}`).then(res => {
                console.log(res);
                if (res.code === 200) {
                    this.$message({
                        message: '成功删除酒诗信息！',
                        type: 'success',
                    });
                    this.load();

                } else {
                    this.$message({
                        message: '删除酒诗信息失败！',
                        type: 'error',
                    });
                }
            });

        },
        resetForm() {
            this.$refs.form.resetFields();
        },
        doSave() {
            this.checkDuplicatePoetry(this.form.poetry, (isUnique) => {
                if (isUnique) {
                    request.post("poemsbylocation/api/save", this.form).then(res => {
                        console.log(res);
                        if (res.code === 200) {
                            this.$message({
                                message: '成功添加酒诗信息！',
                                type: 'success',
                            });
                            this.dialogVisible = false;
                            this.load();
                            this.resetForm();
                        } else {
                            this.$message({
                                message: '添加酒诗信息失败！',
                                type: 'error',
                            });
                        }
                    });
                } else {
                    alert('酒诗已存在');
                }
            });
           
        },
        doMod() {
            this.checkDuplicatePoetry(this.form.poetry, (isUnique) => {
                if (isUnique) {
                    request.post("poemsbylocation/api/mod", this.form).then(res => {
                        console.log(res);
                        if (res.code === 200) {
                            this.$message({
                                message: '成功修改酒诗信息！',
                                type: 'success',
                            });
                            this.dialogVisible = false;
                            this.load();
                            this.resetForm();
                        } else {
                            this.$message({
                                message: '修改酒诗信息失败！',
                                type: 'error',
                            });
                        }
                    });
                } else {
                    alert('酒诗已存在');
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
    }
}
</script>

<style></style>
