<template>
    <div>
        <div style="margin:10px px;margin-top:0px">
            <el-button type="primary" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增酒画</el-button>
        </div>
        <!-- 搜索区域 -->
        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的酒画名或id" style="width:25%;"
                :prefix-icon="Search" />
            <span style="margin-left: 10px;"></span>
            <el-button type="primary" clearable @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
        </div>
        <!-- 表格数据渲染用户列表信息 -->
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f2f5fc', color: '#55555' }"
            border>
            <!-- <el-table-column prop="id" label="id" width="100" /> -->
            <el-table-column prop="imagename" label="酒画名">
                <template v-slot="scope">
                    <span style="font-size: 20px; letter-spacing: 3px;">{{ scope.row.imagename }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="dynasty" label="朝代" width="100" />
            <el-table-column prop="image" label="酒画图片">
                <template v-slot="scope">
                    <img :src="getImageUrl(scope.row.id)" style="width: 100%; height: auto;">
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
            <el-dialog v-model="dialogVisible" title="酒画信息" style="width:50%;height:80%" h:before-close="handleClose">
                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                    <el-form-item label="id:" prop="id">
                        <el-input v-model="form.id" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="酒画名:" prop="imagename">
                        <el-input v-model="form.imagename" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="朝代:" prop="dynasty">
                        <el-input v-model="form.dynasty" style="width: 80%;" clearable />
                    </el-form-item>
                    <el-form-item label="酒画:" prop="image">
                        <!-- action="http://localhost:9000/poemimages/api/upload" -->
                        <!-- :on-success="handleSuccess" -->
                        <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                        <el-upload action="#" list-type="picture-card" :auto-upload="false">
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

                        <el-dialog v-model="dialogVisible">
                            <img w-full :src="dialogImageUrl" alt="Preview Image" />
                        </el-dialog>
                </el-form-item>
                </el-form>
                </el-dialog>
        </div>
    </div>
</template>

<script >

import request from '@/api/request';
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue';


export default {
    name: "WinePicture",
    components: { Plus },
    data() {
        let checkDuplicate = (rule, value, callback, el) => {
            let imagename = el.form.imagename;
            request.get(`/poemimages/api/findByPictureName?imagename=${imagename}`)
                .then(res => {
                    console.log(res);
                    if (res.code === 200) {
                        callback(new Error('酒画已经存在'));
                    } else {
                        callback();
                    }
                })
                .catch(() => {
                    callback(new Error('检查酒画名时发生错误'));
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
            isNew: true, // 假设true为新增，false为编辑  
            maxId: 0, // 用于存储从服务器获取的最大ID
            imageUrl: ref(''),
            form: {
                id: 0,
                imagename: '',
                dynasty:''

            },
            rules: {
                imagename: [
                    { required: true, message: "请输入酒画名!", trigger: "blur" },
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
                dynasty: [{ required: true, message: "请输入酒画朝代!", trigger: "blur" }]
                 
            }
        }
    },
    mounted() {
        this.load();
    },
    created() {
        this.getMaxId();
    },
    methods: {
        getImageUrl(imageId) {
            return this.$httpURL + `/poemimages/api/get-image/${imageId}`;
        },
       
        getMaxId() {
            request.get("poemimages/api/getMaxId").then(response => {
                if (response.code === 200) {
                    this.maxId = response.data.id;
                    if (this.isNew) {
                        this.form.id = this.maxId + 1;
                       
                    }
                } else {
                    this.maxId = 0;
                    this.form.id = 1; // 如果无法获取最大ID，可以默认从1开始
                }
            }).catch(error => {
                this.maxId = 0;
                this.form.id = 1; // 错误处理，设置默认值
            });
        },
        beforeUpload(file) {
            // 校验文件类型
            const isJPG = file.type === 'image/jpeg';
            if (!isJPG) {
                this.$message.error('只能上传 JPG 格式的文件!');
            }
            // 校验文件大小
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleSuccess(response, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.$message({
                message: '图片上传成功！',
                type: 'success'
            });
            
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
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.resetForm();
                //this.form.id = this.getMaxIdPlusOne(); // 确保每次打开对话框时id都是最新的
            })

        },
        mod(row) {
            console.log(row);
            if (row.id) {
                this.$nextTick(() => {
                    this.form.id = row.id; 
                    this.form.imagename = row.imagename; 
                    this.form.image = row.image; 
                    this.isEditMode = true; 
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
        },
        doSave() {
            request.post("poemimages/api/save", this.form).then(res => {
                console.log(res);
                if (res.code === 200) {
                    this.$message({
                        message: '成功添加一条酒画信息！',
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
            });
        },
        doMod() {
            request.post("poemimages/api/mod", this.form).then(res => {
                console.log(res);
                if (res.code === 200) {
                    this.$message({
                        message: '酒画信息修改成功！',
                        type: 'success',
                    });
                    this.dialogVisible = false;
                    this.load();
                    this.resetForm();
                } else {
                    this.$message({
                        message: '修改酒画信息失败！',
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
                        // 确保form.image包含上传的图片URL
                        let formData = new FormData();
                        formData.append('imagename', this.form.imagename);
                        formData.append('image', this.form.image); // 假设form.image是文件对象
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