<template>
    <div>
        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的酒器" style="width:25%;" :prefix-icon="Search" />
            <el-button type="primary" clearable @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
            <el-button type="success" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增酒器汇总信息</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f2f5fc', color: '#55555' }"
            border>
            <el-table-column prop="id" label="酒器ID" width="70" />
            <el-table-column prop="name" label="酒器名" width="180" />
            <el-table-column prop="discription" label="描述" min-width="150" class="content-column">
                <template v-slot="scope">
                    <div class="cell">
                        <div class="ellipsis">{{ scope.row.discription }}</div>
                        <div class="tooltip-div">
                            <div class="tooltip-text">{{ scope.row.discription }}</div>
                        </div>

                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="picture" label="酒器图片">
                <template v-slot="scope">
                    <img v-if="scope.row.picture" :src="this.$getimageURL + '/' + scope.row.picture.split('\\').pop()"
                        alt="Image" style="width: 100%; height: 40%;" />
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
            <el-dialog v-model="dialogVisible" title="酒器汇总信息" style="height:100%;width:50%;"
                :before-close="handleClose">
                <el-form id="vesselForm" :model="form" label-width="120px" :rules="rules" ref="form"
                    enctype="multipart/form-data">
                    <el-form-item label="ID:" prop="id">
                        <el-input v-model="form.id" style="width: 80%;" clearable disabled />
                    </el-form-item>
                    <el-form-item label="酒器名:" prop="name">
                        <el-input v-model="form.name" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="描述:" prop="discription">
                        <el-input type="textarea" v-model="form.discription" style="width: 80%;" clearable
                            :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="酒器图片:" prop="picture">
                        <input type="file" @change="handleFileChange" accept="image/*" v-if="isEditMode" clearable
                            :disabled="!isEditMode" />
                        <img v-if="dialogImageUrl" :src="dialogImageUrl" alt="Preview">
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
            isAddMode: false,
            isEditMode: false,
            search: "",
            dialogImageUrl: '',
            imageFile: null,
            disabled: false,
            dialogVisible: false,
            imageSrc: null,
            nextIdCounter: 1,
            originalRow: null,
            originalnameData: [], // 存储原始数据
            originalUsername: '',
            form: {
                id:'',
                name: '',
                discription: '',
                picture: null
            },
            rules: {
                name: [
                    { required: true, message: "请输入酒器名!", trigger: "blur" },
                ],
                discription: [
                    { required: true, message: "请输入酒器描述内容!", trigger: "blur" }
                ],
                picture: [
                    { required: true, message: "请选择酒器图片!", trigger: "change" }
                ],

            }
        }
    },

    mounted() {
        this.load();
        request.get(`/vesselTotal/api/total`).then(res => {
            this.nextIdCounter = res + 1;
        })
        this.nextIdCounter++;
    },

    methods: {
        handleFileChange(event) {
            this.form.picture = event.target.files[0];
            const file = event.target.files[0];
            if (file) {
                // 设置预览图片的 URL
                this.dialogImageUrl = URL.createObjectURL(file);
                // 保存文件对象到 imageFile 变量中
                this.imageFile = file;
            }
            else {
                this.dialogImageUrl = this.form.picture; // 如果没有新文件，使用旧图片URL
                this.imageFile = null;
            }
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
                        this.originalnameData = [...this.tableData]; 
                        console.log(this.originalnameData);
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
           // console.log('当前页：${val}');
            this.currentPage = val;
            this.load();
        },
        add() {
            this.isAddMode = true;
            this.isEditMode = true;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.resetForm();
            })
            this.form.id = this.nextIdCounter;

        },
        mod(row) {
            if (row.id) {
                this.$nextTick(() => {
                    this.isAddMode = false;
                    this.isEditMode = true;
                    this.form.id = row.id;
                    this.form.name = row.name;
                    this.form.discription = row.discription;
                    this.form.picture = row.picture;
                    this.originalRow = { ...row }; // 保存原始行数据
                    this.form = { ...row }; // 将原始行数据赋值给表单
                    if (row.picture) {
                        this.dialogImageUrl = this.$getimageURL + '/' + row.picture.split('\\').pop();
                    } else {
                        this.dialogImageUrl = ''; // 如果没有图片，则清空预览
                    }
                  
                    this.dialogVisible = true;
                })
            }
        },
        look(row) {
            //console.log(row);
            if (row.id) {
                this.$nextTick(() => {
                    this.isAddMode = false;
                    this.isEditMode = false;
                    this.form.id = row.id;
                    this.form.name = row.name;
                    this.form.discription = row.discription;
                    this.form.picture = row.picture;
                    if (row.picture) {
                        this.dialogImageUrl = this.$getimageURL + '/' + row.picture.split('\\').pop();
                    } else {
                        this.dialogImageUrl = ''; // 如果没有图片，则清空预览
                    }
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
            this.dialogImageUrl = '';
            this.imageFile = null;
        },
        doSave() {
            let formData = new FormData();
            formData.append('name', this.form.name); // 添加文本字段
            formData.append('discription', this.form.discription); // 添加文本字段

            if (this.imageFile) {
                formData.append('picture', this.imageFile);
            }

            console.log(this.imageFile)

            // 调试 log
            console.log('提交的 FormData:', formData);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            request.post("vesselTotal/api/saveall", formData, config).then(res => {
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
            }).catch(error => {
                console.error('请求失败:', error);
                this.$message({
                    message: '请求失败，请稍后重试！',
                    type: 'error',
                });
            });

        },
        doMod() {
            let updateData = new FormData();
            updateData.append('id', this.form.id);
            if (this.form.name !== this.originalRow.name) {
                updateData.append('name', this.form.name);
            }
            else{
                updateData.append('name', this.originalRow.name);
            }
            if (this.form.discription !== this.originalRow.discription) {
                updateData.append('discription', this.form.discription);
            }
            else{
                updateData.append('discription', this.originalRow.discription);
            }
            if (this.imageFile || this.form.picture !== this.originalRow.picture) {
                if (this.imageFile) {
                    updateData.append('picture', this.imageFile);
                } else {
                    // 如果没有新的图片文件，但图片字段已更改，则需要传递原始图片路径
                    updateData.append('picture', this.originalRow.picture);
                }
            }
             console.log('提交的 FormData:', updateData);

            // const config = {
            //     headers: {
            //         'Content-Type': 'application/octet-stream'
            //     }
            // };
            request.post("vesselTotal/api/mod", updateData).then(res => {
                if (res.code === 200) {
                    this.$message({
                        message: '酒器信息修改成功！',
                        type: 'success',
                    });
                    this.dialogVisible = false;
                    this.load();
                    //this.resetForm();
                } else {
                    this.$message({
                        message: '修改酒器信息失败！',
                        type: 'error',
                    });
                }
            }).catch(error => {
                console.error('请求失败:', error);
                this.$message({
                    message: '请求失败，请稍后重试！',
                    type: 'error',
                });
            });

        },
        save() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.isAddMode) {
                        request.post("vesselTotal/api/checkname", { name: this.form.name }).then(res => {
                            if (res.code === 200) {
                                this.doSave();
                            } else {
                                this.$message({
                                    message: '酒器已存在，添加酒器信息失败！',
                                    type: 'error',
                                });
                            }
                        });
                    } else {
                        //const originalname = this.originalnameData.find(name => this.form.id === this.tableData.find(vessel => vessel.name === name).id);
                        if (this.originalRow.name === this.form.name) {
                            this.doMod();
                        } else {
                            // 用户名变化了，需要检查用户名是否存在
                            request.post("vesselTotal/api/checkname", { name: this.form.name }).then(res => {
                                if (res.code === 200) {
                                    this.doMod();
                                } else {
                                    this.$message({
                                        message: '酒器已存在，修改酒器信息失败！',
                                        type: 'error',
                                    });
                                }
                            });
                        }
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

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.avatar-uploader img {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    padding: 4px;
    margin-top: 10px;
}
.el-table .content-column {
    height: auto;
    overflow: hidden;
}

.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}


.tooltip-div {
    display: none;
    position: absolute;
    background-color: #f4ecec;
    border: 1px solid #dcdfe6;
    padding: 10px;
    z-index: 1001;
    color: blue;
    opacity: 0;
    /* 确保悬浮框是不透明的 */
    transition: opacity 0.3s;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

.tooltip-text {
    color: blue;
    font-size: larger;
    font-weight: bold;
}

.cell:hover .tooltip-div {
    display: block;
    opacity: 1;
}
</style>