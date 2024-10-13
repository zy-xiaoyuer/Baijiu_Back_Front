<template>
    <div>
        <!-- 搜索区域 -->
        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的酒画名或id" style="width:25%;"
                :prefix-icon="Search" />
            <span style="margin-left: 10px;"></span>
            <el-button type="primary" clearable @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
            <el-button type="success" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增酒画</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f2f5fc', color: '#55555' }"
            border>
            <el-table-column prop="id" label="酒画ID" width="70" />
            <el-table-column prop="imagename" label="酒画名">
                <template v-slot="scope">
                    <span style="font-size: 20px; letter-spacing: 3px;">{{ scope.row.imagename }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="image" label="酒画图片">
                <template v-slot="scope">
                    <img v-if="scope.row.image" :src="this.$getimageURL + '/' + scope.row.image.split('\\').pop()"
                        alt="Image" style="width: 100%; height: 20%;" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操 作" width="290">
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
            <el-dialog v-model="dialogVisible" title="酒画信息" style="width:80%;height:100%" :before-close="handleClose">
                <el-form :model="form" label-width="120px" :rules="rules" ref="form" enctype="multipart/form-data">
                    <el-form-item label="ID:" prop="id">
                        <el-input v-model="form.id" style="width: 80%;" clearable disabled />
                    </el-form-item>
                    <el-form-item label="酒画名:" prop="imagename">
                        <el-input v-model="form.imagename" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>

                    <el-form-item label="酒画:" prop="image">
                        <input type="file" @change="handleFileChange" accept="image/*" v-if="isEditMode" clearable
                            :disabled="!isEditMode" />
                        <img v-if="dialogImageUrl" :src="dialogImageUrl" alt="Preview" style="width: 40%; height: 80%;">
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

<script >

import request from '@/api/request';

export default {
    name: "WinePicture",
    data() {
        
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 8,
            total: 0,
            isAddMode: false,
            isEditMode: false, // 新增这个属性来标记是否为编辑模式  
            search: "",
            dialogVisible: false,
            dialogImageUrl: '',
            imageFile: null,
            nextIdCounter: 1,
            //isNew: true, // 假设true为新增，false为编辑  
            //maxId: 0, // 用于存储从服务器获取的最大ID
            originalRow: null,
            originalnameData: [], // 存储原始数据
            originalUsername: '',
            form: {
                id: '',
                imagename: '',
                image:null

            },
            rules: {
                imagename: [
                    { required: true, message: "请输入酒画名!", trigger: "blur" },
                   
                ],
              
            }
        }
    },
    mounted() {
        this.load();
        request.get(`/poemimages/api/total`).then(res => {
            this.nextIdCounter = res + 1;
        })
        this.nextIdCounter++;
    },
   
    methods: {
        handleFileChange(event) {
            this.form.image = event.target.files[0];
            const file = event.target.files[0];
            if (file) {
                // 设置预览图片的 URL
                this.dialogImageUrl = URL.createObjectURL(file);
                // 保存文件对象到 imageFile 变量中
                this.imageFile = file;
            }
            else {
                this.dialogImageUrl = this.form.image; // 如果没有新文件，使用旧图片URL
                this.imageFile = null;
            }
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
            request.post("poemimages/api/listPage", {
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
            //console.log('当前页：${val}');
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
           // console.log(row);
            if (row.id) {
                this.$nextTick(() => {
                    this.isAddMode = false;
                    this.isEditMode = true;
                    this.form.id = row.id; 
                    this.form.imagename = row.imagename; 
                    this.form.image = row.image; 
                    this.originalRow = { ...row }; // 保存原始行数据
                    this.form = { ...row }; // 将原始行数据赋值给表单
                    if (row.image) {
                        this.dialogImageUrl = this.$getimageURL + '/' + row.image.split('\\').pop();
                    } else {
                        this.dialogImageUrl = ''; // 如果没有图片，则清空预览
                    }
                   // this.originalRow = JSON.parse(JSON.stringify(this.form));
                   
                    this.dialogVisible = true;
                })
            }
        },
        look(row) {
            console.log(row);
            if (row.id) {
                this.$nextTick(() => {
                    this.isAddMode = false;
                    this.isEditMode = false;
                    this.form.id = row.id;
                    this.form.imagename = row.imagename;
                    this.form.image = row.image;
                    if (row.image) {
                        this.dialogImageUrl = this.$getimageURL + '/' + row.image.split('\\').pop();
                    } else {
                        this.dialogImageUrl = ''; // 如果没有图片，则清空预览
                    }
                    //this.originalRow = JSON.parse(JSON.stringify(this.form));
                    
                    this.dialogVisible = true;
                })
            }
        },
        del(id) {
            request.get(`poemimages/api/delete?id=${id}`).then(res => {
                console.log(res);
                if (res.code === 200) {
                    this.$message({
                        message: '成功删除该条酒画信息！',
                        type: 'success',
                    });
                    this.load();

                } else {
                    this.$message({
                        message: '删除酒画信息失败！',
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
            formData.append('imagename', this.form.imagename); // 添加文本字段
            

            if (this.imageFile) {
                formData.append('image', this.imageFile);
            }
            console.log(this.imageFile)

            // 调试 log
            console.log('提交的 FormData:', formData);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            request.post("poemimages/api/saveall", formData, config).then(res => {
                if (res.code === 200) {
                    this.$message({
                        message: '成功添加酒画信息！',
                        type: 'success',
                    });
                    this.dialogVisible = false;
                    this.load();
                    this.resetForm();
                } else {
                    this.$message({
                        message: '添加酒画信息失败！',
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
            if (this.form.imagename !== this.originalRow.imagename) {
                updateData.append('imagename', this.form.imagename);
            }
            else {
                updateData.append('imagename', this.originalRow.imagename);
            }
            
            if (this.imageFile || this.form.image !== this.originalRow.image) {
                if (this.imageFile) {
                    updateData.append('image', this.imageFile);
                } else {
                    // 如果没有新的图片文件，但图片字段已更改，则需要传递原始图片路径
                    updateData.append('image', this.originalRow.image);
                }
            }
            console.log('提交的 FormData:', updateData);

            // const config = {
            //     headers: {
            //         'Content-Type': 'application/octet-stream'
            //     }
            // };
            request.post("poemimages/api/mod", updateData).then(res => {
                if (res.code === 200) {
                    this.$message({
                        message: '酒画信息修改成功！',
                        type: 'success',
                    });
                    this.dialogVisible = false;
                    this.load();
                    //this.resetForm();
                } else {
                    this.$message({
                        message: '修改酒画信息失败！',
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
                        request.post("poemimages/api/checkname", { imagename: this.form.imagename }).then(res => {
                            if (res.code === 200) {
                                this.doSave();
                            } else {
                                this.$message({
                                    message: '酒画已存在，添加酒画信息失败！',
                                    type: 'error',
                                });
                            }
                        });
                    } else {
                        //const originalname = this.originalnameData.find(name => this.form.id === this.tableData.find(vessel => vessel.name === name).id);
                        if (this.originalRow.imagename === this.form.imagename) {
                            this.doMod();
                        } else {
                            // 用户名变化了，需要检查用户名是否存在
                            request.post("poemimages/api/checkname", { imagename: this.form.imagename }).then(res => {
                                if (res.code === 200) {
                                    this.doMod();
                                } else {
                                    this.$message({
                                        message: '酒画已存在，修改酒画信息失败！',
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
.el-table .cell {
    text-align: center;
    letter-spacing: 5px;
}
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
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
</style>