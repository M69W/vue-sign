<template>
    <div class="templatemanage">
        <templatenav></templatenav>
        <div class="template-content">
            <div class="title">自定义模板</div>
            <header class="header">
                <div class="search">
                    <el-form
                        :model="formData"
                        ref="formData"
                        label-position="left"
                        label-width="80px"
                    >
                        <el-form-item class="sign-log-title" prop="theme" label="模板名称">
                            <el-input
                                v-model="formData.theme"
                                placeholder="请输入模板名称"
                                @keyup.enter.native="searchTemp"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button size="medium" @click="searchTemp">查询</el-button>
                </div>
                <el-button type="primary" class="right" @click="addTemp">新建模板</el-button>
            </header>
            <!-- table -->
            <div class="table">
                <el-table :data="tableData" stripe>
                    <el-table-column prop="templateId" label="模板编号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="theme" label="模板名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="gmtCreate" label="创建时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createUserName" label="创建人" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <span class="oper-btn" @click="useTemp(scope.$index, scope.row)">使用模板</span>
                            <span class="oper-btn" @click="editTemp(scope.$index, scope.row)">编辑</span>
                            <span class="oper-btn" @click="delTemp(scope.$index, scope.row)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination
                    :page-size="pagination.pageSize"
                    :page-sizes="pagination.pageSizes"
                    :current-page="pagination.currentPage"
                    :total="pagination.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    layout="total,sizes,prev, pager, next,jumper"
                    hide-on-single-page
                    v-show="pagination.total > 10"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import base from '../../mixin/base';
import templatenav from './templatenav';

export default {
    mixins: [base],
    components: { templatenav },
    name: 'templatemanage',
    data() {
        return {
            formData: {
                theme: ''
            },
            tableData: [],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 20, 30, 50],
                total: 0
            },
            fileList: []
        };
    },
    created() {
        this.searchTemp();
    },
    computed: {},
    methods: {
        // 模板列表查询
        searchTemp() {
            this.pagination.currentPage = 1;
            this.queryTemp();
        },
        // 查询模板
        queryTemp(curPage) {
            let { currentPage, pageSize } = this.pagination;
            this.getTemplateList({
                pageNum: curPage,
                pageSize: pageSize,
                theme: this.formData.theme
            }).then((res) => {
                if (this.successCheckCode(res)) {
                    this.tableData = res.data.records;
                    this.pagination.total = res.data.total;
                    if (!this.tableData.length && this.pagination.currentPage > 1) {
                        this.pagination.currentPage--;
                        this.queryTemp();
                    }
                }
            });
        },
        // 添加模板
        addTemp() {
            if (this.isLowVersionIE()) {
                return this.$message.warning('浏览器不支持自定义模板功能，请升级IE浏览器至11及以上，或使用最新谷歌、火狐等浏览器！');
            }
            this.$router.push('/contractTemplateStep1');
            sessionStorage.removeItem('templateInfo');
        },
        // 编辑
        editTemp(index, row) {
            if (this.isLowVersionIE()) {
                return this.$message.warning('浏览器不支持自定义模板功能，请升级IE浏览器至11及以上，或使用最新谷歌、火狐等浏览器！');
            }
            this.$router.push(`/contractTemplateStep1?id=${row.templateId}`);
        },
        // 使用模板
        useTemp(index, row) {
            if (this.isLowVersionIE()) {
                return this.$message.warning('浏览器不支持自定义模板功能，请升级IE浏览器至11及以上，或使用最新谷歌、火狐等浏览器！');
            }
            this.$router.push(`/contractsign?tempId=${row.templateId}&isTemp=1`);
        },
        // 删除模板
        delTemp(index, row) {
            this.$confirm(`您确认要删除模板名为 ${row.theme} 的模板吗？`, '删除模板', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'icon-delete self-icon temp-mg',
                closeOnClickModal: false
            })
                .then(() => {
                    this.delTemplate(row.templateId).then((res) => {
                        if (this.successCheckCode(res)) {
                            this.$message({
                                message: '模板删除成功！',
                                type: 'success',
                                duration: 3000
                            });
                            this.queryTemp(); // 删除后重新查询模板列表
                        }
                    });
                })
                .catch(() => {});
        },
        sizeChange(pageSize) {
            this.pagination.pageSize = pageSize;
            this.pagination.currentPage = 1;
            this.queryTemp();
        },
        currentChange(curPage) {
            this.queryTemp(curPage);
        },
        isLowVersionIE(){
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE =
                userAgent.indexOf('compatible') > -1 &&
                userAgent.indexOf('MSIE') > -1;
            if (isIE) {
                var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp['$1']);
                if (fIEVersion < 11) {
                    return true;
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.templatemanage {
    .template-content {
        margin-left: 206px;
        padding: 0 30px;
    }
    .title {
        font-size: 18px;
        color: #333;
        line-height: 58px;
        border-bottom: 1px solid #e8ecef;
        margin-bottom: 30px;
    }
    .dialog-box {
        .el-input {
            width: 340px;
        }
    }
    .header {
        // display: flex;
        // justify-content: space-between;
        // align-items: center;
        margin-bottom: 18px;
        overflow: hidden;
        .search {
            float: left;
            > .el-form {
                float: left;
            }
            .el-button {
                float: left;
                width: 80px;
                margin-left: 20px;
                border-color: #00afff;
                color: #00afff;
                &:hover {
                    border-color: #0073bd;
                }
            }
        }
        .right {
            float: right;
        }
    }
    .pagination {
        margin-top: 15px;
        text-align: right;
    }
    .table {
        .oper-btn {
            margin-right: 16px;
            color: #999;
            cursor: pointer;
            &:hover {
                color: #4a90e2;
            }
        }
    }
}
.el-form-item {
    margin: 0;
}
</style>
<style lang="scss">
.templatemanage {
    .sign-log-title {
        .el-input {
            width: 300px;
        }
    }
    .el-upload-dragger {
        width: 560px;
        &:hover {
            border-color: #4a90e2;
        }
        &.is-dragover {
            border: 1px dashed #4a90e2;
            .icon-tuozhuaiwenjian,
            .hand-way {
                display: none;
            }
            .hand-way-drag {
                display: block;
            }
        }
        .icon-tuozhuaiwenjian {
            margin: 24px 0;
            font-size: 50px;
            color: #999;
        }
    }
}
.el-message-box.temp-mg {
    .el-message-box__btns {
        text-align: center;
        .el-button {
            width: 80px;
            margin: 0 10px;
        }
    }
    .el-message-box__header {
        height: 40px;
        line-height: 40px;
        padding: 0;
        background-color: #e8ecef;
        .el-message-box__title {
            padding-left: 20px;
        }
        .el-message-box__headerbtn {
            top: 10px;
        }
    }
}
</style>