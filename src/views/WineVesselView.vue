<template>
    <div>

        <div style="margin:10px px;margin-top:0px">
            <el-button type="primary" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增酒器信息</el-button>
        </div>

        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的酒器的朝代或现藏地" style="width:25%;"
                :prefix-icon="Search" />
            <el-button type="primary" clearable @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f2f5fc', color: '#55555' }"
            border>
            <!-- <el-table-column prop="id" label="酒器ID" width="70" /> -->
            <el-table-column prop="age" label="朝代" />
            <el-table-column prop="now" label="现藏" />
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
            <el-dialog v-model="dialogVisible" title="酒器信息" style="height:90%;width:50%;" :before-close="handleClose">

                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                    <el-form-item label="id:" prop="id">
                        <el-input v-model="form.id" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="朝代:" prop="age">
                        <el-input v-model="form.age" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="现藏:" prop="now">
                        <el-input v-model="form.now" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="酒器图片:" prop="picture">
                        <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                            list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                        <el-dialog title="图片预览" v-model="previewVisible" width="50%">
                            <img :src="previewPath" alt="" class="previewImg">
                        </el-dialog>
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
    name: "VesselView",
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 8,
            total: 0,
            isEditMode: false,
            search: "",
            dialogVisible: false,
            uploadUrl: '/upload', // 你的图片上传接口
            imageFileList: [], // 用于存储已上传的图片列表
            form: {
                id: '',
                age: '',
                time: '',
                picture: ''
            },
            rules: {
                age: [
                    { required: true, message: "请输入酒器的朝代!", trigger: "blur" },
                    
                ],
                now: [
                    { required: true, message: "请输入酒器的现藏地!", trigger: "blur" }
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
        // 图片上传成功后的回调
        handleSuccess(response, file, fileList) {
            if (response.code === 200) {
                this.form.picture = response.data.url; // 假设返回的是图片的URL
            } else {
                this.$message.error('图片上传失败');
            }
        },
        beforeUpload(file) {
            const isImage = file.type.match('image.*');
            if (!isImage) {
                this.$message.error('请上传图片格式的文件');
            }
            return isImage;
        },
        // 移除图片时的钩子
        handleRemove(file, fileList) {
            // 可以在这里实现删除图片的逻辑
        },
        
        getImageUrl(imageId) {
            return this.$httpURL + `/vessel/api/get-image/${imageId}`;
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
            request.post("vessel/api/listPage", {
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
                    this.form.age = row.age;
                    this.form.now = row.now;
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
                    this.form.age = row.age;
                    this.form.now = row.now;
                    this.picture = row.picture;
                    this.dialogVisible = true;
                })
            }
        },
        del(id) {
            request.get(`vessel/api/delete?id=${id}`).then(res => {
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
            
            request.post("vessel/api/save", this.form).then(res => {
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
        },
        doMod() {
            request.post("vessel/api/mod", this.form).then(res => {
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
