<template>
    <div>

        <div style="margin:10px px;margin-top:0px">
            <el-button type="primary" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增酒器汇总信息</el-button>
        </div>

        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的酒器" style="width:25%;" :prefix-icon="Search" />
            <el-button type="primary" clearable @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f2f5fc', color: '#55555' }"
            border>
            <el-table-column prop="id" label="酒器ID" width="70" />
            <el-table-column prop="name" label="酒器名" width="180" />
            <el-table-column prop="discription" label="描述" />
            <el-table-column prop="picture" label="酒器图片">
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

        <div style="margin:10px 0px;">
            <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[4, 8, 12, 16]"
                :small="small" :disabled="disabled" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <div>
            <el-dialog v-model="dialogVisible" title="酒器汇总信息" style="height:90%;width:50%;" :before-close="handleClose">

                <el-form :model="form" label-width="120px" :rules="rules" ref="form" enctype="multipart/form-data">
                    <el-form-item label="酒器名:" prop="name">
                        <el-input v-model="form.name" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="描述:" prop="discription">
                        <el-input type="textarea" v-model="form.discription" style="width: 80%;" clearable
                            :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="酒器图片:" prop="picture">
                        <input type="file" @change="handleFileChange" />
                        <el-button type="primary" @click="uploadFile">上传图片</el-button>
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
   
    name: "VesselTotal",
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 8,
            total: 0,
            isEditMode: false, 
            search: "",
            dialogVisible: false,
            imageFile: null,
            form: {
                id: '',
                name: '',
                discription: '',
                picture:''
            },
            rules: {
                name: [
                    { required: true, message: "请输入酒器名!", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            this.checkDuplicatename(value, (err) => {
                                if (err) {
                                    callback(new Error('酒器已经存在'));
                                } else {
                                    callback();
                                }
                            });
                        },
                        trigger: 'blur'
                    }
                ],
                discription: [
                    { required: true, message: "请输入酒器描述内容!", trigger: "blur" }
                ],
                picture: [
                    { required: true, message: "请选择酒器图片!", trigger: "blur" }
                ],
                
            }
        }
    },
    mounted() {
        this.load();
    },
    
    methods: {
        handleFileChange(event) {
            this.imageFile = event.target.files[0];
        },
        async uploadFile() {
            if (!this.imageFile) {
                alert('请选择文件！');
                return;
            }
            const formData = new FormData();
            formData.append('file', this.imageFile); 

            try {
                const response = await request.post('/vesselTotal/api/add', formData);
                console.log(response.data); // 处理响应数据  
                alert('文件上传成功：' + response.data);
            } catch (error) {
                console.error('文件上传失败：', error);
                alert('文件上传失败，请重试！');
            }
        },
        
        
        checkDuplicatename(name, callback) {
            request.get(`/vesselTotal/api/findByname?name=${name}`)
                .then(res => {
                    if (res.code === 200) {
                        callback(new Error('酒器已经存在'));
                    } else {
                        callback();
                    }
                })
                .catch(() => {
                    callback(new Error('检查酒器名时发生错误'));
                });
        },
        getImageUrl(imageId) {
            return this.$httpURL+`/vesselTotal/api/get-image/${imageId}`;
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.$nextTick(() => {
                        this.dialogVisible = false;
                        this.$nextTick(() => {
                            this.resetForm();
                            this.isEditMode = false
                        })
                    })
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
                    name: this.search
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
                    this.form.name = row.name; 
                    this.form.discription = row.discription; 
                    this.picture=row.picture;
                    this.dialogVisible = true;
                })
            }
        },
        look(row) {
            //console.log(row);
            if (row.id) {
                this.$nextTick(() => {
                    this.isEditMode = false;
                    this.form.id = row.id;
                    this.form.name = row.name;
                    this.form.discription = row.discription; 
                    this.picture = row.picture;
                    this.dialogVisible = true;
                })
            }
        },
        del(id) {
            request.get(`vesselTotal/api/delete?id=${id}`).then(res => {
                console.log(res);
                if (res.code === 200) {
                    this.$message({
                        message: '成功删除酒器信息！',
                        type: 'success',
                    });
                    this.load();

                } else {
                    this.$message({
                        message: '删除酒器信息失败！',
                        type: 'error',
                    });
                }
            });

        },
        resetForm() {
            this.$refs.form.resetFields();
            this.form.picture = '';
            this.imageFileList = [];
        },
        doSave() {
            this.checkDuplicatename(this.form.name, (isUnique) => {
                if (isUnique) {
                    request.post("vesselTotal/api/save", this.form).then(res => {
                        //console.log(res);
                        if (res.code === 200) {
                            this.$message({
                                message: '成功添加酒器信息！',
                                type: 'success',
                            });
                            this.dialogVisible = false;
                            this.load();
                            this.resetForm();
                        } else {
                            this.$message({
                                message: '添加酒器信息失败！',
                                type: 'error',
                            });
                        }
                    });
                } else {
                    alert('酒器名已存在，请选择其他酒器名。');
                }
            });
        },
        doMod() {
            request.post("vesselTotal/api/mod", this.form).then(res => {
                console.log(res);
                if (res.code === 200) {
                    this.$message({
                        message: '酒器信息修改成功！',
                        type: 'success',
                    });
                    this.dialogVisible = false;
                    this.load();
                    this.resetForm();
                } else {
                    this.$message({
                        message: '修改酒器信息失败！',
                        type: 'error',
                    });
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
