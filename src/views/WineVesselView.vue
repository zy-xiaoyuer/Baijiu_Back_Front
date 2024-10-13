<template>
    <div>
        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的酒器的朝代或现藏地" style="width:25%;"
                :prefix-icon="Search" />
            <el-button type="primary" clearable @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
            <el-button type="success" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增酒器信息</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f2f5fc', color: '#55555' }"
            border>
            <el-table-column prop="id" label="酒器ID" width="70" />
            <el-table-column prop="age" label="朝代" />
            <el-table-column prop="now" label="现藏" />
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
            <el-dialog v-model="dialogVisible" title="酒器信息" style="height:90%;width:50%;" :before-close="handleClose">

                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                    <el-form-item label="ID:" prop="id">
                        <el-input v-model="form.id" style="width: 80%;" clearable disabled />
                    </el-form-item>
                    <el-form-item label="朝代:" prop="age">
                        <el-input v-model="form.age" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="现藏:" prop="now">
                        <el-input v-model="form.now" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="酒器图片:" prop="picture">
                        <input type="file" @change="handleFileChange" accept="image/*" />
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
    name: "VesselView",
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 8,
            total: 0,
            isAddMode: false,
            isEditMode: false,
            search: "",
            dialogVisible: false,
            dialogImageUrl: '',
            imageFile: null,
            nextIdCounter: 1,
            uploadUrl: '/upload', // 你的图片上传接口
            imageFileList: [], // 用于存储已上传的图片列表
            originalRow: null,
            originalnameData: [], // 存储原始数据
            originalUsername: '',
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
        request.get(`/vessel/api/total`).then(res => {
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
            //console.log(row);
            if (row.id) {
                this.$nextTick(() => {
                    this.isAddMode = false;
                    this.isEditMode = true;
                    this.form.id = row.id;
                    this.form.age = row.age;
                    this.form.now = row.now;
                    this.picture = row.picture;
                    this.originalRow = { ...row }; // 保存原始行数据
                    this.form = { ...row }; // 将原始行数据赋值给表单
                    if (row.picture) {
                        this.dialogImageUrl = this.$getimageURL + '/' + row.picture.split('\\').pop();
                    } else {
                        this.dialogImageUrl = ''; // 如果没有图片，则清空预览
                    }
                    //this.originalRow = JSON.parse(JSON.stringify(this.form));
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
                    this.form.age = row.age;
                    this.form.now = row.now;
                    this.picture = row.picture;
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
            this.dialogImageUrl = '';
            this.imageFile = null;
        },
        doSave() {
            
            let formData = new FormData();
            formData.append('age', this.form.age); // 添加文本字段
            formData.append('now', this.form.now); // 添加文本字段

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
            request.post("vessel/api/saveall", formData, config).then(res => {
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
            if (this.form.age !== this.originalRow.age) {
                updateData.append('age', this.form.name);
            }
            else {
                updateData.append('age', this.originalRow.age);
            }
            if (this.form.now !== this.originalRow.now) {
                updateData.append('now', this.form.now);
            }
            else {
                updateData.append('now', this.originalRow.now);
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
            request.post("vessel/api/mod", updateData).then(res => {
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
                        this.doSave();
                    } else {
                        this.doMod();
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
