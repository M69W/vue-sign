<template>
    <div class="UserStatistics">
        <div class="nav">
            <el-menu
                :default-active="activeIndex"
                @select="hanleSelect"
                mode="horizontal"
                text-color="#626262"
                active-text-color="#02adff"
            >
                <el-menu-item index="1">用户统计</el-menu-item>
                <el-menu-item index="2">实名失败统计</el-menu-item>
            </el-menu>
        </div>
        <div class="userStatistics-content" v-show="activeIndex == '1'">
            <div class="userInfo">
                <ul class="clearfix">
                    <li>
                        <span>{{ userInfo.registUserTotal }}</span
                        ><br />
                        注册用户总数
                    </li>
                    <li>
                        <span>{{ userInfo.personUserRegist }}</span
                        ><br />
                        个人注册
                    </li>
                    <li>
                        <span>{{ userInfo.enterpriseUserRegist }}</span
                        ><br />
                        企业注册
                    </li>
                    <li>
                        <span>{{ userInfo.certificationUser }}</span
                        ><br />
                        实名认证用户
                    </li>
                </ul>
            </div>
            <div class="userlist">
                <div class="search">
                    <el-input
                        placeholder="企业名称/个人姓名"
                        v-model="searchForm.extEnterpriseName"
                    ></el-input>
                    <el-input
                        placeholder="手机号码/邮箱"
                        v-model="searchForm.accountNumber"
                    ></el-input>
                    <el-select
                        placeholder="请选择"
                        clearable
                        v-model="searchForm.realNameAuthenticationFlag"
                    >
                        <el-option value="0" label="未实名"></el-option>
                        <el-option value="1" label="已实名"></el-option>
                    </el-select>
                    <el-date-picker
                        v-model="searchForm.daterange"
                        type="daterange"
                        placeholder="选择日期范围"
                    >
                    </el-date-picker>
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="primary" @click.prevent="exportExcel"
                        >导出Excel</el-button
                    >
                </div>
                <el-table :data="tableData" style="width: 100%" stripe>
                    <el-table-column
                        :resizable="false"
                        prop="extEnterpriseName"
                        label="企业名/姓名"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="realNameAuthenticationFlag"
                        label="是否实名"
                        width="90"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.realNameAuthenticationFlag == "0"
                                    ? "未实名"
                                    : scope.row.realNameAuthenticationFlag ==
                                      "1"
                                    ? "已实名"
                                    : ""
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="userType"
                        label="类型"
                        width="80"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.userType == "01"
                                    ? "企业"
                                    : scope.row.userType == "02"
                                    ? "个人"
                                    : ""
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="compactAccount"
                        label="发起合同数量"
                        width="150"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="accountNumber"
                        label="手机"
                        width="150"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="accountNumberSecond"
                        label="邮箱"
                        width="150"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="linkmanName"
                        label="联系人"
                        width="100"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="gmtCreate"
                        label="注册时间"
                        width="180"
                    ></el-table-column>
                </el-table>
                <div class="pagination" v-if="total > pageSize">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentpage"
                        :page-size="pageSize"
                        :total="total"
                        layout="total, prev, pager, next"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        <div class="authenFail-content" v-show="activeIndex == '2'">
            <div class="userlist">
                <div class="search">
                    <el-input
                        placeholder="企业名称/个人姓名"
                        v-model="searchFormAuth.name"
                    ></el-input>
                    <el-input
                        placeholder="手机号码/邮箱"
                        v-model="searchFormAuth.phone"
                    ></el-input>
                    <span
                        class="fl"
                        style="line-height: 36px; margin-right: 6px;"
                        >认证时间</span
                    >
                    <el-date-picker
                        v-model="searchFormAuth.daterange"
                        type="daterange"
                        placeholder="选择日期范围"
                    >
                    </el-date-picker>
                    <el-button type="primary" @click="searchAuth"
                        >查询</el-button
                    >
                    <el-button type="primary" @click.prevent="exportExcelAuth"
                        >导出Excel</el-button
                    >
                </div>
                <el-table :data="tableDataAuth" style="width: 100%" stripe>
                    <el-table-column
                        :resizable="false"
                        prop="name"
                        label="企业名/姓名"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{ scope.row.name ? scope.row.name : "无" }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="linkMan"
                        label="联系人"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.linkMan ? scope.row.linkMan : "无" }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="phone "
                        label="手机号码"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.phone ? scope.row.phone : "无" }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="userType"
                        label="类型"
                        align="center"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.userType ? scope.row.userType : "无" }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="certRslt"
                        label="认证"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.certRslt ? scope.row.certRslt : "失败"
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="certDate"
                        label="最后一次认证时间"
                    ></el-table-column>
                    <el-table-column
                        :resizable="false"
                        prop="regDate"
                        label="注册时间"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.regDate ? scope.row.regDate : "无" }}
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination" v-if="totalAuth > pageSizeAuth">
                    <el-pagination
                        @current-change="handleCurrentChangeAuth"
                        :current-page="currentpageAuth"
                        :page-size="pageSizeAuth"
                        :total="totalAuth"
                        layout="total, prev, pager, next"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import service from "../../../assets/mixin/service";
import { checkBlobFileResponseUtils } from "@/utils";
export default {
    mixins: [service],
    components: {},
    props: {},
    data() {
        return {
            tableData: [],
            tableDataAuth: [],
            searchForm: {
                daterange: [],
                extEnterpriseName: "",
                accountNumber: ""
            },
            searchFormAuth: {
                daterange: [],
                name: "",
                phone: ""
            },
            dataRangeFormat: [],
            dataRangeFormatAuth: [],
            userInfo: {},
            pageNum: 1,
            pageNumAuth: 1,
            pageSize: 10,
            pageSizeAuth: 10,
            currentpage: 1,
            currentpageAuth: 1,
            total: 0,
            totalAuth: 0,
            activeIndex: "2"
        };
    },
    computed: {},
    watch: {},
    mounted() {
        this.getUserCount();
        this.getListData();
        this.getAuthListData();
    },
    methods: {
        search() {
            this.dataRangeFormat = [];
            for (var time of this.searchForm.daterange) {
                if (time !== null) {
                    var a = this.FormatDate(time);
                    this.dataRangeFormat.push(a);
                }
            }
            this.pageNum = 1;
            this.getListData();
        },
        searchAuth() {
            this.dataRangeFormatAuth = [];
            for (var time of this.searchFormAuth.daterange) {
                if (time !== null) {
                    var a = this.FormatDate(time);
                    this.dataRangeFormatAuth.push(a);
                }
            }
            this.pageNumAuth = 1;
            this.getAuthListData();
        },
        getListData() {
            this.userCountList(this.pageNum, this.pageSize, {
                accountNumber: this.searchForm.accountNumber,
                extEnterpriseName: this.searchForm.extEnterpriseName,
                realNameAuthenticationFlag: this.searchForm
                    .realNameAuthenticationFlag,
                registTimeBegin:
                    this.dataRangeFormat.length > 0
                        ? this.dataRangeFormat[0] + " 00:00:00"
                        : "",
                registTimeEnd:
                    this.dataRangeFormat.length > 0
                        ? this.dataRangeFormat[1] + " 24:00:00"
                        : ""
            }).then(res => {
                if (this.successCheckCode(res)) {
                    this.tableData = res.data.records;
                    this.total = res.data.total;
                    this.currentpage = res.data.current;
                }
            });
        },
        getAuthListData() {
            this.authFailList(this.pageNumAuth, this.pageSizeAuth, {
                phone: this.searchFormAuth.phone,
                name: this.searchFormAuth.name,
                startDate:
                    this.dataRangeFormatAuth.length > 0
                        ? this.dataRangeFormatAuth[0]
                        : "",
                endDate:
                    this.dataRangeFormatAuth.length > 0
                        ? this.dataRangeFormatAuth[1]
                        : ""
            }).then(res => {
                if (this.successCheckCode(res)) {
                    this.tableDataAuth = res.data.records;
                    this.totalAuth = res.data.total;
                    this.currentpageAuth = res.data.current;
                }
            });
        },
        getUserCount() {
            this.userCount().then(res => {
                if (this.successCheckCode(res)) {
                    this.userInfo = res.data;
                }
            });
        },
        FormatDate(data) {
            if (data == undefined) {
                return "";
            }
            return moment(data).format("YYYY-MM-DD");
        },
        //分页选择
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getListData();
        },
        handleCurrentChangeAuth(val) {
            this.pageNumAuth = val;
            this.getAuthListData();
        },
        exportExcel() {
            var that = this,
                xhr;
            var data = {
                accountNumber: this.searchForm.accountNumber,
                extEnterpriseName: this.searchForm.extEnterpriseName,
                realNameAuthenticationFlag: this.searchForm
                    .realNameAuthenticationFlag,
                registTimeBegin:
                    this.dataRangeFormat.length > 0
                        ? this.dataRangeFormat[0] + " 00:00:00"
                        : "",
                registTimeEnd:
                    this.dataRangeFormat.length > 0
                        ? this.dataRangeFormat[1] + " 24:00:00"
                        : ""
            };
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xhr = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.open("POST", `/api/user/info/export/1/10`);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Authorization", sessionStorage.getItem('token'));
            xhr.responseType = "blob";
            xhr.send(JSON.stringify(data));
            xhr.onreadystatechange = function() {
                if (xhr.status === 200 && xhr.readyState === 4) {
                    var blob = xhr.response;
                    checkBlobFileResponseUtils(blob)
                        .then(res => {
                            var name = `用户统计.xls`;
                            if ("msSaveOrOpenBlob" in navigator) {
                                window.navigator.msSaveOrOpenBlob(res, name);
                            } else {
                                var elink = document.createElement("a");
                                elink.download = name;
                                elink.style.display = "none";
                                try {
                                    elink.href = window.URL.createObjectURL(
                                        res
                                    );
                                } catch (e) {}
                                document.body.appendChild(elink);
                                elink.click();
                                URL.revokeObjectURL(elink.href);
                                document.body.removeChild(elink);
                            }
                        })
                        .catch(errMsg => {
                            _self.$message({
                                type: "error",
                                message: errMsg
                            });
                        });
                }
            };
        },
        exportExcelAuth() {
            var that = this,
                xhr;
            var data = {
                phone: this.searchFormAuth.phone,
                name: this.searchFormAuth.name,
                startDate:
                    this.dataRangeFormatAuth.length > 0
                        ? this.dataRangeFormatAuth[0]
                        : "",
                endDate:
                    this.dataRangeFormatAuth.length > 0
                        ? this.dataRangeFormatAuth[1]
                        : ""
            };
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xhr = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.open("POST", `/api/user/getRealNamePageExcel/1/10`);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Authorization", sessionStorage.getItem('token'));
            xhr.responseType = "blob";
            xhr.send(JSON.stringify(data));
            xhr.onreadystatechange = function() {
                if (xhr.status === 200 && xhr.readyState === 4) {
                    var blob = xhr.response;
                    checkBlobFileResponseUtils(blob)
                        .then(res => {
                            var name = `实名失败统计.xls`;
                            if ("msSaveOrOpenBlob" in navigator) {
                                window.navigator.msSaveOrOpenBlob(res, name);
                            } else {
                                var elink = document.createElement("a");
                                elink.download = name;
                                elink.style.display = "none";
                                try {
                                    elink.href = window.URL.createObjectURL(
                                        res
                                    );
                                } catch (e) {}
                                document.body.appendChild(elink);
                                elink.click();
                                URL.revokeObjectURL(elink.href);
                                document.body.removeChild(elink);
                            }
                        })
                        .catch(errMsg => {
                            _self.$message({
                                type: "error",
                                message: errMsg
                            });
                        });
                }
            };
        },
        hanleSelect(val) {
            this.activeIndex = val;
        }
    }
};
</script>
<style lang="scss">
.UserStatistics {
    width: 1200px;
    margin: 0 auto;
    position: relative;
    top: 20px;
    min-height: calc(100% - 50px);
    background: #fff;
    .nav {
        padding: 0 24px;
        .el-menu {
            padding-left: 55px;
            background-color: #fff;
            margin: 0;
            border-bottom: 1px solid #e6e6e6;
        }
        .el-menu--horizontal .el-menu-item {
            border-bottom: 2px solid transparent;
            color: #909399;
            &:hover {
                background-color: #fff;
                color: #303133;
            }
        }
        .el-menu--horizontal > .el-menu-item.is-active {
            border-bottom: 2px solid #409eff;
            color: #303133;
        }
    }

    .userInfo {
        ul {
            li {
                float: left;
                width: 25%;
                text-align: center;
                padding: 20px 0;
                line-height: 40px;
                font-size: 16px;
                span {
                    font-size: 20px;
                }
            }
        }
    }
    .userlist {
        padding: 20px;
        .search {
            margin-bottom: 20px;
            .el-input {
                float: left;
                width: 20%;
                margin-right: 15px;
            }
            .el-select {
                width: 20%;
                margin-right: 15px;
                float: left;
                .el-input {
                    width: 100%;
                }
            }
        }
    }
}
</style>
