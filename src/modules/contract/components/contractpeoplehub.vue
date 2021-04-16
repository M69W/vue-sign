<template>
    <!-- <div class="masking"> -->
    <el-dialog :title="'选择合同签署人'+(type != 'transfer'?'（多选）':'')" :visible.sync="isShowDialog" class="select-signer-dialog">
        <div class="table">
            <!-- <h3>
                选择合同签署人<span class="checked" v-if="type != 'transfer'">（多选）</span>
            </h3> -->
            <div style="margin-bottom: 20px;"></div>
            <el-table border stripe ref="multipleTable" :data="tableData" tooltip-effect="dark"
                @selection-change="handleSelectionChange">
                <!-- v-loading="loadingTabel"-->
                <el-table-column :resizable="false" type="selection" :selectable="checkSelectable" align="center"
                    width="50">
                </el-table-column>
                <el-table-column :resizable="false" label="姓名/企业名称" prop="contactsName" align="left"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column :resizable="false" label="手机号码/邮箱" prop="contactsWay" show-overflow-tooltip width="200"
                    align="center">
                </el-table-column>
                <el-table-column :resizable="false" label="是否实名认证" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span :class="{ red: scope.row.safetyLevel == '02' }" v-if="scope.row.safetyLevel == '02'">
                            未认证
                        </span>
                        <span v-if="scope.row.safetyLevel == '01'">
                            已认证
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div class="nonedata" v-if="nodata">-->
            <!--<div class="imgbg"></div>-->
            <!--<div class="txt">暂无数据</div>-->
            <!--</div>-->
            <div class="pagination" v-if="total > pagesize">
                <el-pagination @current-change="handleCurrentChange" :current-page="currentpage" :page-size="pagesize"
                    :total="total" layout="total, prev, pager, next">
                </el-pagination>
            </div>
        </div>
        <div class="button" :class="{ pat: total <= pagesize }" slot="footer">
            <el-button class="cancel" @click="cancel()">取消</el-button>
            <el-button type="primary" @click="sure()">确定</el-button>
        </div>
    </el-dialog>
    <!-- </div> -->
</template>


<script>
    import base from "../mixin/base";

    export default {
        mixins: [base],
        props: {
            value: {//是否显示盒子
                type: Boolean,
                default: false,
            },
            type: ""
        },
        data() {
            return {
                isShowDialog:false,
                tableData: [],
                multipleSelection: [],
                pagesize: 5,
                total: ""
            };
        },
        mounted() {
            this.getListData();
        },
        methods: {
            getListData() {
                this.loadingTabel = true;
                this.userList(this.pageNum, this.pagesize, {}).then(res => {
                    if (this.successCheckCode(res)) {
                        this.tableData = res.data.records;
                        this.total = res.data.total;
                        this.pageNum = res.data.current;
                        this.tableData.map(ele => {
                            ele.selected = true;
                        });
                    }
                    setTimeout(() => {
                        this.loadingTabel = false;
                    }, 200);
                });
            },
            handleSelectionChange(val) {
                if (this.type == "transfer") {
                    // this.multipleSelection = [];
                    // this.multipleSelection.push(val);
                    this.multipleSelection = val;
                    if (this.multipleSelection.length > 0) {
                        this.tableData.map((ele, index) => {
                            if (this.multipleSelection[0].id != ele.id) {
                                ele.selected = false;
                            }
                        });
                    } else {
                        this.tableData.map(ele => {
                            ele.selected = true;
                        });
                    }
                } else {
                    this.multipleSelection = val;
                }
            },
            cancel() {
                this.$emit("contractalert", false);
            },
            sure() {
                // 确定添加联系人

                // 请求成功后
                this.$emit("contractalert", this.multipleSelection);
            },
            checkSelectable(row, index) {
                if (this.type == "transfer") {
                    return this.tableData[index].selected;
                } else {
                    return true;
                }
            }
        },
        watch: {
            value() {
                this.isShowDialog = this.value;
            },
            isShowDialog() {
                this.$emit('input', this.isShowDialog);
            },
        },
    };
</script>

<style scoped lang="scss">

        /* position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.4);
    z-index: 1000; // 最好不能超过2000，会覆盖tooltip，表格的tooltip层级为2005
    overflow: auto; */
        .table {
            width: 940px;
            /* position: absolute; */
            /* top: 10%;
            left: 50%;
            transform: translateX(-50%); */
            /* .el-dialog--small{
                width: 940px;
                background-color: #fff;
                border-radius: 10px;
            } */
            padding-bottom: 30px;
            /* h3 {
                height: 50px;
                margin: 0;
                margin-bottom: 20px;
                line-height: 50px;
                background: #e2e2e2;
                font-size: 16px;
                color: #626262;
                padding-left: 20px;
                font-weight: normal;
                border-radius: 10px 10px 0 0;

                .checked {
                    color: #999;
                }
            } */

            >div {
                width: 754px;
                margin: auto;

                .red {
                    color: #cb3b3b;
                }
            }

            .button {
                text-align: center;

                button {
                    width: 80px;
                    height: 36px;
                }

                .cancel {
                    border-radius: 4px;
                }

                .sure {
                    border-radius: 4px;
                }

                &.pat {
                    padding-top: 30px;
                }
            }

            .pagination {
                /*padding: 30px 0;*/
                padding-top: 30px;
            }
    }
</style>
<style lang="scss">
    .select-signer-dialog{
        .el-dialog--small{
           width: 940px;
        }
    }
</style>