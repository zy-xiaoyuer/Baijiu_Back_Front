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
                    <img v-if="scope.row.picture" :src="this.$getimageURL +'/'+ scope.row.picture.split('//').pop()"
                        alt="Image" style="width: 100%; height: auto;" />
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
                    <el-form-item label="酒器名:" prop="name">
                        <el-input v-model="form.name" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="描述:" prop="discription">
                        <el-input type="textarea" v-model="form.discription" style="width: 80%;" clearable
                            :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="酒器图片:" prop="picture">
                        <el-upload action="" list-type="picture-card" :auto-upload="false" :before-upload="beforeUpload"
                            v-model="form.picture" @change="handleUpload">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <template #file="{ file }">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-preview"
                                            @click="handlePictureCardPreview(file)">
                                            <el-icon><zoom-in /></el-icon>
                                        </span>
                                        <span v-if="!disabled" class="el-upload-list__item-delete"
                                            @click="handleDownload(file)">
                                            <el-icon>
                                                <Download />
                                            </el-icon>
                                        </span>
                                        <span v-if="!disabled" class="el-upload-list__item-delete"
                                            @click="handleRemove(file)">
                                            <el-icon>
                                                <Delete />
                                            </el-icon>
                                        </span>
                                    </span>
                                </div>
                            </template>
                        </el-upload>
                        <!-- <el-dialog v-model="dialogVisible">
                            <img w-full :src="dialogImageUrl" alt="Preview Image" />
                        </el-dialog> -->
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
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
export default {

    name: "VesselTotal",
    components: {
        Delete,
        Download,
        Plus,
        ZoomIn
    },
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 8,
            total: 0,
            isEditMode: false,
            search: "",
            dialogImageUrl:'',
            disabled:false,
            dialogVisible: false,
            imageFile: null,
            fileList: [],
            uploadUrl: 'http://localhost:9000/vesselTotal/api/save',
            imageSrc: null,
            form: {
                name: '',
                discription: '',
                picture: ''
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
                    { required: true, message: "请选择酒器图片!", trigger: "change" }
                ],

            }
        }
    },
    mounted() {
        this.load();
        // this.tableData.forEach(row => {
        //     this.getImageById(row.id, row);  // 根据 id 获取并设置图片路径
        // });
    },

    methods: {
        handleUpload(file) {
            this.imageFile = file.raw; // 将文件直接赋值给 imageFile
            this.form.picture = file.raw; // 如果你想保留 url
        },
        beforeUpload(file) {
            console.log('beforeUpload called with file:', file);
            this.imageFile = file.raw;
            return false; // 阻止自动上传
        },  
       
        handleRemove(file) {
            console.log(file);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleDownload(file) {
            console.log(file);
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
                    this.picture = row.picture;
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
            //this.form.picture = '';
           // this.imageFileList = [];
        },
        doSave() {
            this.checkDuplicatename(this.form.name, (isUnique) => {
               
                    console.log(this.form.name)
                    let formData = new FormData();
                    formData.append('name', this.form.name); // 添加文本字段
                    formData.append('discription', this.form.discription); // 添加文本字段
                    if (this.imageFile) {
                        formData.append('picture', this.imageFile); // 确保 imageFile 已经被赋值
                    }
                    console.log(this.form.picture)
                    request.post("vesselTotal/api/saveall", formData,{
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(res => {
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
                console.log(this.form.name)
                console.log(this.form.discription)
                console.log(this.form.picture)
                if (valid) {
                    // if (this.isEditMode) {
                    //     this.doMod()
                    // } else {
                    //     this.doSave();
                    // }
                    this.doSave();
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
</style>