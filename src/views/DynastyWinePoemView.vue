<template>
    <div>
        <div style="margin:10px 0px;">
            <el-input v-model="search" clearable placeholder="请输入您要搜索的酒诗的作者或朝代" style="width:25%;"
                :prefix-icon="Search" />
            <span style="margin-left: 10px;"></span>
            <el-button type="primary" clearable @click="load">搜&nbsp;&nbsp;&nbsp;索</el-button>
            <el-button type="success" @click="add"><el-icon>
                    <DocumentAdd />
                </el-icon>新增酒诗</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f2f5fc', color: '#55555' }"
            border>
            <el-table-column prop="id" label="酒诗ID" width="40" />
            <el-table-column prop="title" label="标题" width="100" />
            <el-table-column prop="dynasty" label="朝代" width="60" />
            <el-table-column prop="author" label="作者" width="60" />
            <el-table-column prop="place" label="地点" width="50" />
            <el-table-column prop="time" label="创作年份" width="50" />
            <el-table-column prop="content" label="内容" min-width="150" class="content-column">
                <template v-slot="scope">
                    <div class="cell">
                        <div class="ellipsis">{{ scope.row.content }}</div>
                        <div class="tooltip-div">
                            <div class="tooltip-text">{{ scope.row.content }}</div>
                        </div>

                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="emotion" label="总体情感" width="50" />
            <el-table-column prop="emotionList" label="每句对应情感" min-width="150" class="content-column">
                <template v-slot="scope">
                    <div class="cell">
                        <div class="ellipsis">{{ scope.row.emotionList }}</div>
                        <div class="tooltip-div">
                            <div class="tooltip-text">{{ scope.row.emotionList }}</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
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
            <el-dialog v-model="dialogVisible" title="酒诗信息" style="height:100%;width:80%;" :before-close="handleClose">
                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                    <el-form-item label="ID:" prop="id">
                        <el-input v-model="form.id" style="width: 80%;" clearable disabled />
                    </el-form-item>
                    <el-form-item label="标题:" prop="title">
                        <el-input v-model="form.title" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="朝代:" prop="dynasty">
                        <el-input v-model="form.dynasty" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="作者:" prop="author">
                        <el-input v-model="form.author" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="地点:" prop="place">
                        <el-input v-model="form.place" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="创作年份:" prop="time">
                        <el-input v-model="form.time" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="内容:" prop="content">
                        <el-input type="textarea" v-model="form.content" style="width: 100%;height:80%" clearable
                            :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="情感:" prop="emotion">
                        <el-input v-model="form.emotion" style="width: 80%;" clearable :disabled="!isEditMode" />
                    </el-form-item>
                    <el-form-item label="每句对应情感:" prop="emotionList">
                        <el-input type="textarea" v-model="form.emotionList" style="width: 80%;" clearable
                            :disabled="!isEditMode" />
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
    name: "DynastyPoems",
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 8,
            total: 0,
            isEditMode: false, 
            isAddMode: false,
            search: "",
            dialogVisible: false,
            //originalRow: '',
            nextIdCounter: 1,
            originalnameData: [], // 存储用户名原始数据
            originalUsername: '',
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
        request.get(`/poemsbydynasty/api/total`).then(res => {
            this.nextIdCounter = res + 1;
        })
        this.nextIdCounter++;
    },

    methods: {
       
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_=> {
                    this.dialogVisible = false;
                    this.$nextTick(() => {
                        this.resetForm();
                        this.isEditMode = false
                    })
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
                    search: this.search
                }
            })
                .then(res => {//res已经是data了
                    console.log(res)
                    console.log(res.data)
                    //console.log(res.data.dynasty)
                    if (res.code === 200) {
                        this.tableData = res.data;
                        console.log(res.total)
                        this.total = res.total;
                        
                        this.originalnameData = res.data.map(poems => poems.title);
                        console.log(this.originalnameData);
                        //this.total = res.total;
                        // res.data.forEach(poem => {
                        //     console.log(poem.dynasty);
                        // });  
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
            this.isAddMode = true;
            this.isEditMode = true;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.resetForm();
            })
            this.form.id = this.nextIdCounter;
        },
        mod(row) {
            console.log(row);
            if (row.id) {
                this.isAddMode = false;
                this.isEditMode = true; 
                this.form.id = row.id; 
                this.form.title = row.title; 
                this.form.dynasty = row.dynasty;
                this.form.author = row.author;
                this.form.place = row.place;
                this.form.time = row.time;
                this.form.content = row.content;
                this.form.emotion = row.emotion;
                this.form.emotionList = row.emotionList;
                //this.originalRow = JSON.parse(JSON.stringify(this.form)); 
                this.dialogVisible = true;
                
            }
        },
        look(row) {
            if (row.id) {
                this.$nextTick(() => {
                    this.isAddMode = false;
                    this.isEditMode = false;
                    this.form.id = row.id;
                    this.form.title = row.title;
                    this.form.dynasty = row.dynasty;
                    this.form.author = row.author;
                    this.form.place = row.place;
                    this.form.time = row.time;
                    this.form.content = row.content;
                    this.form.emotion = row.emotion;
                    this.form.emotionList = row.emotionList;
                    this.dialogVisible = true;

                })
            }
        },
        del(id) {
            request.get(`poemsbydynasty/api/delete?id=${id}`).then(res => {
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
            request.post("poemsbydynasty/api/save", this.form).then(res => {
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
        },
        doMod() {
            request.post("poemsbydynasty/api/mod", this.form).then(res => {
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
        },
        save() {
            this.$refs["form"].validate((valid) => {
                
                if (valid) {
                    if (this.isAddMode) {
                        request.post("poemsbydynasty/api/checkTitle", { title: this.form.title }).then(res => {
                            if (res.code === 200) {
                                this.doSave();
                            } else {
                                this.$message({
                                    message: '酒诗已存在，添加酒诗信息失败！',
                                    type: 'error',
                                });
                            }
                        });
                    } else {
                        const originalname = this.originalnameData.find(title => this.form.id === this.tableData.find(poems => poems.title === title).id);
                        if (originalname === this.form.title) {
                            this.doMod();
                        } else {
                            request.post("poemsbydynasty/api/checkTitle", { title: this.form.title }).then(res => {
                                if (res.code === 200) {
                                    this.doMod();
                                } else {
                                    this.$message({
                                        message: '酒诗已存在，修改酒诗信息失败！',
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
    opacity: 0;  /* 确保悬浮框是不透明的 */
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

