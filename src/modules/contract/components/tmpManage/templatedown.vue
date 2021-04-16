<template>
    <div class="templatedown">
        <templatenav></templatenav>
        <div class="template-content">
            <div class="title">模板范本下载</div>
            <div class="model-list">
                <el-scrollbar>
                    <ul>
                        <li @click="routerTo()" :class="{ active: !typeId }">
                            所有模板
                            <span>{{ totalType }}</span>
                        </li>
                        <li
                            v-for="(item, key) in modelList"
                            :key="key"
                            :class="{ active: typeId == item.id }"
                            @click="routerTo(item.id)"
                        >
                            <span :title="item.typeName" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                                {{ item.typeName }}
                            </span>
                            <span>{{ item.count }}</span>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
            <div class="model-table">
                <div class="search">
                    <el-input
                        placeholder="请输入模板名称"
                        v-model="searchName"
                    ></el-input>
                    <el-button @click="search">查询</el-button>
                </div>
                <div class="table">
                    <el-table :data="tableData" stripe>
                        <el-table-column
                            prop="codeNum"
                            label="模板编号"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column label="模板名称" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a @click="viewDetail(scope.row.id)">{{
                                    scope.row.name
                                }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="typeName"
                            label="分类"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="uploadDate"
                            label="上传时间"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            prop="initDownloadCount"
                            label="下载量"
                            align="center"
                            show-overflow-tooltip
                            width="80"
                        ></el-table-column>
                        <el-table-column
                            prop="initViewCount"
                            label="浏览量"
                            show-overflow-tooltip
                            align="center"
                            width="80"
                        ></el-table-column>
                    </el-table>
                    <div class="pagination" v-if="total > pageSize">
                        <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page="currentpage"
                            :page-size="pageSize"
                            :total="total"
                            layout="total, prev, pager, next"
                        ></el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import templatenav from "./templatenav";
import base from "../../mixin/base";
export default {
    mixins: [base],
    components: { templatenav },
    props: {},
    data() {
        return {
            typeId: "",
            modelList: [],
            tableData: [],
            totalType: '',
            searchName: ""
        };
    },
    computed: {},
    watch: {
        $route() {
            this.typeId = this.$route.query.typeId;
            this.pageNum = 1;
            this.getModelList();
            this.getListData();
        }
    },
    mounted() {
        this.typeId = this.$route.query.typeId;
        $(".model-table").css("minHeight", $(".content").height() - 59);
        window.onresize = function() {
            $(".model-table").css("minHeight", $(".content").height() - 59);
            $('.el-scrollbar__wrap').css('maxHeight', $('.model-table').height()-30)
        };
        this.getModelList();
        this.getListData();
    },
    methods: {
        getModelList() {
            this.getTempModelType().then(res => {
                if (this.successCheckCode(res)) {
                    this.modelList = res.data.records;
                    this.totalType = res.data.total;
                }
            });
        },
        getListData() {
            this.getTempModelList({
                currentPage: this.pageNum,
                name: this.searchName,
                pageSize: this.pageSize,
                typeId: this.typeId
            }).then(res => {
                if (this.successCheckCode(res)) {
                    this.tableData = res.data.records;
                    this.total = res.data.total;
                    this.currentpage = res.data.current;
                    this.$nextTick(() => {
                        $('.el-scrollbar__wrap').css('maxHeight', $('.model-table').height()-30)
                    })
                }
            });
        },
        search(){
            this.pageNum = 1;
            this.getListData();
        },
        viewDetail(id) {
            this.$router.push(`templatedetail?id=${id}`);
        },
        routerTo(id) {
            if (id) {
                this.$router.push(`templatedown?typeId=${id}`);
            } else {
                this.$router.push("templatedown");
            }
        }
    }
};
</script>
<style lang="scss">
.templatedown {
    .template-content {
        margin-left: 206px;
        padding: 0 30px;
        .title {
            font-size: 18px;
            color: #333;
            line-height: 58px;
            border-bottom: 1px solid #e8ecef;
            // margin-bottom: 30px;
        }
        .model-list {
            width: 193px;
            float: left;
            // height: calc(100% - 219px);
            // position: fixed;
            padding-top: 30px;
            .el-scrollbar{
                
                .el-scrollbar__wrap{
                    overflow-x: hidden;
                }
            }
            li {
                height: 40px;
                line-height: 40px;
                padding-left: 25px;
                color: #626262;
                padding-right: 30px;
                padding-left: 25px;
                position: relative;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
            }
            li.active {
                color: #02adff;
                background: #f3fafd;
                &::before {
                    content: "";
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #02adff;
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
        .model-table {
            margin-left: 193px;
            padding-left: 20px;
            border-left: 1px solid#E8ECEF;
            .search {
                padding: 30px 0 20px;
                .el-input {
                    width: 320px;
                    vertical-align: middle;
                }
                .el-button {
                    width: 80px;
                    margin-left: 20px;
                    vertical-align: middle;
                }
            }
            a {
                color: #02adff;
                text-decoration: underline;
            }
        }
    }
}
</style>
