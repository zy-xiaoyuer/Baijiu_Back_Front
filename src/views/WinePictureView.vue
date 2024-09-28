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
                    <img v-if="scope.row.image" :src="this.$getimageURL + '/' + scope.row.image.split('\\').pop()"
                        alt="Image" style="width: 100%; height: auto;" />
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
                        <input type="file" @change="handleFileChange" accept="image/*" />
                        <img v-if="dialogImageUrl" :src="dialogImageUrl" alt="Preview">
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script >

import request from '@/api/request';
import { ref } from 'vue'

export default {
    name: "WinePicture",
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
            dialogImageUrl: '',
            imageFile: null,
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
            this.dialogImageUrl = '';
            this.imageFile = null;
        },
        doSave() {
            // request.post("poemimages/api/save", this.form).then(res => {
            //     console.log(res);
            //     if (res.code === 200) {
            //         this.$message({
            //             message: '成功添加一条酒画信息！',
            //             type: 'success',
            //         });
            //         this.dialogVisible = false;
            //         this.load();
            //         this.resetForm();
            //     } else {
            //         this.$message({
            //             message: '添加酒画信息失败！',
            //             type: 'error',
            //         });
            //     }
            // });
            let formData = new FormData();
            formData.append('iamgename', this.form.imagename); // 添加文本字段
            

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