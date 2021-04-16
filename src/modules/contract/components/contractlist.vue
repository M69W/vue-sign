<template>
    <div class="contractlist">
        <div class="contractnav">
            <contractnav v-on:title="titleValue" :tableData="tableData" :phoneNum="phoneNum"
                v-on:dialogTipsFun="dialogTipsFn"></contractnav>
        </div>
        <div class="contract_content">
            <h2 class="title">{{ title }}</h2>
            <div class="search">
                <span class="fl searchtips">
                    <!-- {{
                    type == "04"
                    ? "签约完成时间："
                    : type == "05"
                    ? "过期时间："
                    : type == "03"
                    ? "拒签时间："
                    : type == "02"
                    ? "撤销时间："
                    : type == "01"
                    ? "创建时间："
                    : type == "06"
                    ? "签署截止时间："
                    : ""
                    }} -->
                    {{type | changeNameByTimeType}}：
                </span>
                <!-- <el-select v-model="timeType" placeholder="请选择" v-if="type == '09' || type == '08' || type == '07'">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select> -->
                <el-date-picker v-model="pickerTime" type="daterange" range-separator="至" placeholder="选择日期范围"
                    format="yyyy-MM-dd" class="time" @change="pickerTimeFn">
                </el-date-picker>
                <!-- <div class="time" v-if="type != '06'">
                    <span @click="timeSlot('0')" :class="{ active: timeIndex == '0' }">全部</span>
                    <span @click="timeSlot('01')" :class="{ active: timeIndex == '01' }">一周内</span>
                    <span @click="timeSlot('02')" :class="{ active: timeIndex == '02' }">一月内</span>
                    <span @click="timeSlot('03')" :class="{ active: timeIndex == '03' }">半年内</span>
                </div> -->
                <el-input placeholder="请输入合同主题" v-model="compactTheme" class="input-with-select"
                    @keyup.enter.native="seachList">
                    <el-button slot="append" @click="seachList">查询</el-button>
                </el-input>
                <el-button type="primary" style="float: right; margin-right: 10px;" v-if="type==='04'"
                    @click="downloadFileAllBtn">批量下载</el-button>
                <el-button style="float: right; margin-right: 10px;" class="del-all-btn" v-if="type==='04'"
                    @click="delFileAllBtn">批量删除</el-button>
            </div>
            <el-table :data="tableData" v-loading="loadingTabel" stripe tooltip-effect="light" style="width: 100%"
                v-if="tableData && tableData.length>0" @select="selectionSearchFn" @select-all="selectionSearchFnAll"
                ref="searchResult">
                <el-table-column type="selection" v-if="type==='04'">
                </el-table-column>
                <!-- <el-table-column type="selection" :class="{'ishidden': type==='04'}" v-if>
                </el-table-column> -->
                <el-table-column :resizable="false" label="合同主题" prop="compactTheme" align="left" width="200">
                </el-table-column>
                <el-table-column :resizable="false" label="发起方" prop="initiatorName" align="left" show-overflow-tooltip>
                </el-table-column>
                <el-table-column :resizable="false" label="签署人" prop="signName" align="left" show-overflow-tooltip>
                </el-table-column>
                <el-table-column width="140" :resizable="false" label="发起时间" prop="compactStartDate" align="left"
                    v-if="type == '09' || type == '07'" show-overflow-tooltip></el-table-column>
                <el-table-column width="140" :resizable="false" label="签署截止时间" prop="signDeadline" align="left"
                    v-if="type == '06' || type == '08'" show-overflow-tooltip></el-table-column>
                <el-table-column width="140" :resizable="false" label="过期时间" prop="validityEndDate" align="left"
                    v-if="type == '05'" show-overflow-tooltip></el-table-column>
                <el-table-column width="140" :resizable="false" label="签约完成时间" prop="compactEndDate" align="left"
                    v-if="type == '04'" show-overflow-tooltip></el-table-column>
                <el-table-column width="140" :resizable="false" label="拒签时间" prop="compactRefuseDate" align="left"
                    v-if="type == '03'" show-overflow-tooltip></el-table-column>
                <el-table-column width="140" :resizable="false" label="撤销时间" prop="compactRevocationDate" align="left"
                    v-if="type == '02'" show-overflow-tooltip></el-table-column>
                <el-table-column width="140" :resizable="false" label="创建时间" prop="gmtCreate" align="left"
                    v-if="type == '01'" show-overflow-tooltip></el-table-column>
                <el-table-column width="120" :resizable="false" v-if="type == '09'" label="状态"
                    prop="compactBelongedStatusDesc" align="left" show-overflow-tooltip></el-table-column>
                <el-table-column :resizable="false" label="操作" width="170" align="left" class="edit">
                    <template slot-scope="scope">
                        <el-button v-for="edit in editlist" type="text" size="small" :key="edit.id"
                            @click="sign(scope.row)"
                            v-if="edit == '01'  && (scope.row.compactBelongedStatus == '08' || (scope.row.compactBelongedStatus == '06' && scope.row.signStatus == '01'))">
                            签署</el-button>
                        <el-button v-for="edit in editlist" type="text" size="small" :key="edit.id" v-if="
                                edit == '08' &&
                                    scope.row.compactBelongedStatus == '01'
                            " @click="continueSign(scope.row)">继续</el-button>
                        <el-button v-for="edit in editlist" :key="edit.id" type="text" size="small"
                            @click="rushSign(scope.row.id)" v-if="
                                edit == '01' &&
                                    (scope.row.compactBelongedStatus == '07' ||
                                        (scope.row.compactBelongedStatus ==
                                            '06' &&
                                            scope.row.signStatus != '01'))
                            ">催签</el-button>
                        <el-button v-for="edit in editlist" type="text" size="small" :key="edit.id" v-if="
                                edit == '04' &&
                                    !!'03 04'.match(
                                        scope.row.compactBelongedStatus
                                    )
                            " @click.prevent="
                                download(scope.row.compactTheme, scope.row.id)
                            ">下载</el-button>
                        <!--<el-button v-for="edit in  editlist" type="text" size="small" v-if="edit == '03' && (scope.row.compactBelongedStatus == '07')"-->
                        <!--@click="sendMessage(scope.row.id)">催签-->
                        <!--</el-button>-->
                        <el-button v-for="edit in editlist" type="text" size="small" :key="edit.id" v-if="
                                edit == '05' &&
                                    !!'01 02 03'.match(
                                        scope.row.compactBelongedStatus
                                    )
                            " @click="deleteFile(scope.row.id, 10)">删除</el-button>
                        <el-button v-for="edit in editlist" type="text" size="small" :key="edit.id" v-if="
                                edit == '05' &&
                                    scope.row.compactBelongedStatus == '05' &&
                                    scope.row.compactStatus != '05'
                            " @click="deleteFile(scope.row.id, 10)">删除</el-button>
                        <el-button v-if="scope.row.compactBelongedStatus == '04'" type="text"
                            @click="delComplete(scope.row)">删除</el-button>
                        <el-button v-for="edit in editlist" type="text" size="small" :key="edit.id" v-if="
                                edit == '04' &&
                                    scope.row.compactBelongedStatus == '05' &&
                                    scope.row.compactStatus == '05'
                            " @click.prevent="
                                download(scope.row.compactTheme, scope.row.id)
                            ">下载</el-button>
                        <el-button type="text" size="small" v-if="scope.row.compactBelongedStatus == '10'" @click="fillFile(scope.row.id)">完善</el-button>
                        <!-- <el-button v-for="edit in editlist" type="text" size="small" :key="edit.id" v-if="
                                edit == '02' &&
                                    scope.row.compactBelongedStatus !=
                                        ('01' || '03')
                            " @click="move(scope.row.id)">移动</el-button> -->
                        <!--<el-button  type="text" size="small"-->
                        <!--@click="move(scope.row.id)">移动-->
                        <!--</el-button>-->
                        <el-dropdown size="mini" menu-align="start">
                            <span class="dropdown-btn">
                                <i></i>
                                <i></i>
                                <i></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <p v-for="edit in editlist" type="text" size="small" :key="edit.id" v-if="
                                            userId == scope.row.userId &&
                                                edit == '06' &&
                                                scope.row
                                                    .compactBelongedStatus ==
                                                    '03' &&
                                                checkTime(
                                                    scope.row.compactRefuseDate
                                                )&&scope.row.source!=2
                                        " @click="
                                            $router.push({
                                                path: '/contractsign',
                                                query: {
                                                    type: '08',
                                                    id: scope.row.id
                                                }
                                            })
                                        ">重新发起</p>
                                    <p v-for="edit in editlist" type="text" size="small" :key="edit.id" v-if="
                                            userId == scope.row.userId &&
                                                edit == '07' &&
                                                scope.row
                                                    .compactBelongedStatus ==
                                                    '02' &&
                                                checkTime(
                                                    scope.row
                                                        .compactRevocationDate
                                                )&&scope.row.source!=2
                                        " @click="
                                            $router.push({
                                                path: '/contractsign',
                                                query: {
                                                    type: '08',
                                                    id: scope.row.id
                                                }
                                            })
                                        ">重新发起</p>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <p v-for="edit in editlist" type="text" size="small" :key="edit.id" v-if="
                                            edit == '06' &&
                                                scope.row
                                                    .compactBelongedStatus ==
                                                    '03'
                                        " @click="
                                            refuseSign(
                                                scope.row.compactTheme,
                                                scope.row.refuseSignRemake
                                            )
                                        ">拒签原因</p>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <p v-for="edit in editlist" type="text" size="small" :key="edit.id" v-if="
                                            edit == '07' &&
                                                scope.row
                                                    .compactBelongedStatus ==
                                                    '02'
                                        " @click="
                                            revokeSign(
                                                scope.row.compactTheme,
                                                scope.row.revocationRemake
                                            )
                                        ">撤销原因</p>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <p type="text" size="small" v-if="isWord" @click="removeFile(scope.row.id)">移出</p>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <p v-for="edit in editlist" type="text" size="small" v-if="edit == '09'"
                                        :key="edit.id" @click="
                                            more(
                                                scope.row.id,
                                                scope.row.compactBelongedStatus,
                                                scope.row.signStatus,
                                                scope.row.compactStep,
                                                scope.row.compactTheme,
                                                scope.row.source
                                            )
                                        ">更多</p>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                        <p v-for="edit in editlist" :key="edit.id" v-if="
                                        edit == '02' &&
                                            scope.row.compactBelongedStatus !=
                                                ('01' || '03')
                                    " @click="move(scope.row.id)">移动</p>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <div class="nonedata" v-if="nodata">
                <div class="imgbg"></div>
                <div class="txt">暂无数据</div>
            </div>
            <div class="pagination" v-if="total > pageSize">
                <el-pagination @current-change="handleCurrentChange" :current-page="currentpage" :page-size="pageSize"
                    :total="total" layout="total, prev, pager, next"></el-pagination>
            </div>
        </div>

        <div class="dial-header">
            <el-dialog title="移动" :visible.sync="moveFile" class="moveFile" top="31%">
                <div style="width: 390px">
                    <p>请选择目标文件夹</p>
                    <el-select v-model="value" placeholder="请选择" class="filename">
                        <el-option v-for="item in fileList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <div style="padding-top:20px;text-align: right" class="button">
                        <el-button size="small" @click="radioEvent()">知道了</el-button>
                        <el-button type="primary" size="small" @click="radioEvent()">知道了</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog title="风险提示" :visible.sync="dialogTips" size="tiny"
                class="dialogTips safety icon-safe self-icon">
                <div class="content">
                    <i class="el-message-box__status icon-safe"></i>
                    <p class="tips">您的账号未实名认证，存在安全风险，建议实名认证后再发起签约。</p>
                </div>
                <div class="btn-box">
                    <el-button @click="sureContinueSign()">继续发起签约</el-button>
                    <el-button type="primary" @click="goAuthentication()">去实名认证</el-button>
                </div>
            </el-dialog>
        </div>
        <el-dialog :title="dialogTit" :visible.sync="showFlag" class="backoutDialog" top="31%">
            <div class="bodybox">
                <div class="item">
                    <span class="item-tit">{{ dialogItemName }}:</span>
                    <span class="item-cont">{{ revoke.revokeFile }}</span>
                </div>
                <div class="item-textarea">
                    <el-input type="textarea" readonly v-model="revoke.revokeInfo"></el-input>
                </div>
            </div>
            <div class="footerbox">
                <el-button type="primary" @click="showFlag = false">知道了</el-button>
            </div>
        </el-dialog>
        <el-dialog title="移动" :visible.sync="dialogVisible" custom-class="custom-dialog moveFile" width top="31%"
            :before-close="handleClose">
            <div class="dialog-content">
                <p>请选择目标文件夹</p>
                <div class="move-select">
                    <el-select v-model="wordList" placeholder="请选择文件夹">
                        <el-option :label="item.folderName" :value="item.id" v-for="item in CompactFolderList"
                            :key="item.id"></el-option>
                    </el-select>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeMove">取 消</el-button>&nbsp;
                <el-button type="primary" @click="moveWord">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="下载验证校验" :visible.sync="downloadDialog" class="backoutDialog2" :before-close="dialogClose">
            <div class="bodybox">
                <div class="dialog-body">
                    <el-form ref="formTab" label-width="110px" label-position="right">
                        <el-form-item label="手机号码">
                            <span>{{ phoneNum }}</span>
                            <el-button style="float:right;width:100px;" class="codebtn" @click="getPhoneCode">
                                {{
                                countdown2 == 0
                                ? "获取验证码"
                                : countdown2 + "s"
                                }}
                            </el-button>
                        </el-form-item>
                        <el-form-item label="短信验证码" prop="verify">
                            <el-input v-model="verify" placeholder="请输入短信验证码" :maxlength="6"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="footerbox" style="text-align: center; margin-bottom:10px;">
                <el-button @click="dialogClose">取 消</el-button>
                <el-button type="primary" @click="next">下一步</el-button>
            </div>
        </el-dialog>
        <online></online>
        <sign-password-dialog v-model="signPasswordDialog" :phoneNum="phoneNum" @confirm="delDialogConfirm">
        </sign-password-dialog>
    </div>
</template>

<script>
    import contractnav from './contractnav.vue';
    import base from '../mixin/base';
    import online from '../../../components/online';
    import { checkBlobFileResponseUtils } from '@/utils';
    import moment from "moment";
    import signPasswordDialog from "@/components/signPasswordDialog";
    export default {
        name: 'contractlist',
        mixins: [base],
        components: { contractnav, online, signPasswordDialog },
        data() {
            return {
                dialogTips: false,
                loadingTabel: true,
                dialogVisible: false,
                showFlag: false,
                moveFile: false,
                isWord: false,
                radio: '',
                total: 0,
                title: '',
                type: '',
                timeType: '02',
                endTime: '',
                value: '',
                timeIndex: '',
                compactTheme: '',
                startTime: '',
                pickerTime: "",//筛选的时间区间
                folderId: '',
                nodata: false,
                pageSize: 10,
                revoke: {
                    revokeFile: '',
                    revokeInfo: ''
                },
                CompactFolderList: [],
                options: [
                    {
                        label: '创建时间',
                        value: '01'
                    },
                    {
                        label: '发起时间',
                        value: '02'
                    },
                    {
                        label: '签署截止时间',
                        value: '03'
                    },
                    {
                        label: '完成时间',
                        value: '04'
                    },
                    {
                        label: '过期时间',
                        value: '05'
                    }
                ],
                editlist: ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
                tableData: [],
                fileList: [
                    {
                        value: '文件1'
                    },
                    {
                        value: '文件2'
                    }
                ],
                dialogTit: '',
                dialogItemName: '',
                wordList: '',
                moveCompId: '',
                countdown2: '',
                isCode: true,
                phoneNum: '',
                verify: '',
                downloadDialog: false,
                isFileSafety: false,
                currFileName: '',
                currFileId: '',
                dateStr: '',
                nowDate: new Date().getTime(),
                userId: JSON.parse($.cookie('userinfo')).userId,
                timer: null,
                downloadType: 1,//下载方式 1单文件 2批量
                delType: 1,//删除方式 用于签署完成类型 1单文件 2批量
                delItem: null,//删除单文件的项 用于签署完成类型 
                selectedList: [],//列表选中
                signPasswordDialog: false,//签署密码
            };
        },
        watch: {
            type() {
                // this.timeType = ''; // 时间类型
                this.startTime = ''; // 开始时间
                this.endTime = ''; // 结束时间
                this.compactTheme = ''; // 合同主题
                this.timeIndex = ''; // 选择的是周 月 年 类型
                // this.getListData();
                if (this.type == '09' || this.type == '04') {
                    this.options = [
                        {
                            label: '发起时间',
                            value: '02'
                        }
                        // {
                        //     label: "签署截止时间",
                        //     value: "03"
                        // },
                        // {
                        //     label: "完成时间",
                        //     value: "04"
                        // }
                    ];
                } else if (this.type == '06' || this.type == '03' || this.type == '02') {
                    this.options = [
                        {
                            label: '发起时间',
                            value: '02'
                        },
                        {
                            label: '签署截止时间',
                            value: '03'
                        }
                    ];
                } else if (this.type == '05') {
                    this.options = [
                        {
                            label: '过期时间',
                            value: '05'
                        }
                    ];
                } else if (this.type == '01') {
                    this.options = [
                        {
                            label: '创建时间',
                            value: '01'
                        }
                    ];
                } else if (this.type == '08') {
                    this.timeType = '03';
                    this.options = [
                        {
                            label: '签署截止时间',
                            value: '03'
                        }
                    ];
                } else if (this.type == '07') {
                    // this.timeType = '03';
                    this.options = [
                        {
                            label: '发起时间',
                            value: '02'
                        }
                    ];
                }
            },
            folderId() {
                console.log(22222);
                this.getListData();
            }
            // countdown() {
            //     if (this.countdown == 0) {
            //         clearInterval(this.timer);
            //         this.isCode = true;
            //     }
            // }
        },
        created() {
            if (!!this.$route.query.folderId) {
                this.type = '09';
                this.folderId = this.$route.query.folderId;
            }
        },
        mounted() {
            if (this.$route.query.type) {
                if (this.$route.query.type == '10') {
                    this.type = '09';
                    this.isWord = true;
                    this.folderId = this.$route.query.folderId;
                } else {
                    this.type = this.$route.query.type;
                }
            } else {
                this.type = '09';
            }
            // 刷新页面 没有出发title事件 title为空时
            if (!this.title && !this.folderId) {
                this.getStatList();
            }
            this.getUserInfo();
            this.getListData();
            this.getCompactFolder();
        },
        filters:{
            changeNameByTimeType(timeType){
                let str = "";
                switch(timeType){
                    case "01": str="创建时间";break;
                    case "02": str="撤销时间";break;
                    case "03": str="拒签时间";break;
                    case "04": str="签约完成时间";break;
                    case "05": str="过期时间";break;
                    case "06": str="签署截止时间";break;
                    case "07": str="发起时间";break;
                    case "08": str="签署截止时间";break;
                    case "09": str="发起时间";break;
                }
                return str;
            },
        },
        methods: {
            // 合同状态
            getStatList() {
                this.signState(this.userinfo.userId).then((res) => {
                    if (this.successCheckCode(res)) {
                        let list = res.data.list;
                        list.map((item) => {
                            if (this.type == item.type) {
                                this.title = item.name;
                                return;
                            }
                        });
                    }
                });
            },
            getUserInfo() {
                if (JSON.parse($.cookie('userinfo')).userType == '02') {
                    this.personDetail().then((res) => {
                        if (this.successCheckCode(res)) {
                            this.phoneNum = res.data.phone;
                            this.isFileSafety = res.data.compactDownloadValidate ? true : false;
                        }
                    });
                } else {
                    this.enterpriseDetail().then((res) => {
                        if (this.successCheckCode(res)) {
                            this.phoneNum = res.data.linkManPhone;
                            this.isFileSafety = res.data.compactDownloadValidate ? true : false;
                        }
                    });
                }
            },
            downloadfile(name, id) {
                // 下载
                let _self = this;
                var data = {
                    compactId: id,
                    userId: JSON.parse($.cookie('userinfo')).userId
                };
                // var xhr = new XMLHttpRequest();
                var xhr;
                if (window.XMLHttpRequest) {
                    // code for IE7+, Firefox, Chrome, Opera, Safari
                    xhr = new XMLHttpRequest();
                } else {
                    // code for IE6, IE5
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }
                xhr.open('POST', '/api/compact/package/download');
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.setRequestHeader('Authorization', $.cookie('token') || sessionStorage.getItem('token'));
                xhr.responseType = 'blob';
                xhr.send(JSON.stringify(data));
                xhr.onreadystatechange = function () {
                    // 这步为判断服务器是否正确响应
                    if (xhr.status == 200 && xhr.readyState === 4) {
                        var blob = xhr.response;
                        checkBlobFileResponseUtils(xhr.response).then(
                            (res) => {
                                var fileName = name + '.zip';
                                if ('msSaveOrOpenBlob' in navigator) {
                                    window.navigator.msSaveOrOpenBlob(res, fileName);
                                } else {
                                    console.log(res);
                                    const elink = document.createElement('a');
                                    elink.download = fileName;
                                    elink.style.display = 'none';
                                    try {
                                        elink.href = window.URL.createObjectURL(res);
                                    } catch (e) { }
                                    document.body.appendChild(elink);
                                    elink.click();
                                    URL.revokeObjectURL(elink.href);
                                    document.body.removeChild(elink);
                                }
                            },
                            (errMsg) => {
                                console.log(errMsg);
                                _self.$message({
                                    type: 'error',
                                    message: errMsg
                                });
                            }
                        );
                    } else {
                    }
                };
            },
            // downloadfile(name, id) {
            //     // 下载
            //     let _self = this;
            //     var data = {
            //         compactId: id,
            //         userId: JSON.parse($.cookie('userinfo')).userId
            //     };
            //     // var xhr = new XMLHttpRequest();
            //     var xhr;
            //     if (window.XMLHttpRequest) {
            //         // code for IE7+, Firefox, Chrome, Opera, Safari
            //         xhr = new XMLHttpRequest();
            //     } else {
            //         // code for IE6, IE5
            //         xhr = new ActiveXObject('Microsoft.XMLHTTP');
            //     }
            //     xhr.open("POST", "/api/compact/package/download");
            //     xhr.setRequestHeader("Content-type", "application/json");
            //     xhr.setRequestHeader("Authorization", sessionStorage.getItem('token'));
            //     xhr.responseType = "blob";
            //     xhr.send(JSON.stringify(data));
            //     xhr.onreadystatechange = function () {
            //         // 这步为判断服务器是否正确响应
            //         if (xhr.status == 200 && xhr.readyState === 4) {
            //             var blob = xhr.response;
            //             checkBlobFileResponseUtils(xhr.response).then(
            //                 (res) => {
            //                     var fileName = name + '.zip';
            //                     if ('msSaveOrOpenBlob' in navigator) {
            //                         window.navigator.msSaveOrOpenBlob(res, fileName);
            //                     }
            //                 });
            //         }
            //     }
            // },
            getPhoneCode() {
                if (this.countdown2 == 0 && this.isCode) {
                    this.isCode = false;
                    this.smsCode({
                        phone: this.phoneNum,
                        useType: '13' //1.注册 2.修改密码 3.找回密码 4.设置或修改签署密码 5.ukey初始化  6.修改邮箱 7.修改手机号 8.修改地址 12.绑定手机号码(更换手机用) 13:合同文件下载身份验证
                    })
                        .then((res) => {
                            if (this.successCheckCode(res)) {
                                this.countdown2 = 120;
                                this.timer = setInterval(() => {
                                    --this.countdown2;
                                    if (this.countdown2 <= 0) {
                                        clearInterval(this.timer);
                                        this.timer = null;
                                        this.isCode = true;
                                    }
                                }, 1000);
                                this.$message({
                                    type: 'success',
                                    message: '短信验证码发送成功'
                                });
                            } else {
                                this.isCode = true;
                            }
                        })
                        .fail((res) => {
                            this.isCode = true;
                        });
                }
            },
            next() {
                this.checkSmsCode({
                    msmCode: this.verify,
                    phone: this.phoneNum,
                    useType: '13'
                }).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.downloadDialog = false;
                        this.verify = "";
                        this.countdown2 = 0;
                        this.isCode = true;
                        clearInterval(this.timer);
                        if (this.downloadType == 1) {
                            this.downloadfile(this.currFileName, this.currFileId);
                        } else {
                            this.downloadFileAllFn();
                        }
                    }
                });
            },
            download(name, id) {
                this.downloadType = 1;
                // console.log(this.$perMap);
                this.checkPermission(
                    // 权限校验
                    this.$perMap.contractMgt.download.url
                ).then((res) => {
                    if (!this.successCheckCode(res)) {
                        return;
                    }
                    this.currFileName = name;
                    this.currFileId = id;
                    if (this.isFileSafety) {
                        this.downloadDialog = true;
                    } else {
                        this.downloadfile(this.currFileName, this.currFileId);
                    }
                });
            },
            // handleSelectionChange(val) {
            //     this.delType = 2;
            //     this.selectedList = val;
            // },
            selectionSearchFn(val, row, isFromAll) {
                let isIn = this.selectedList.some(sitem => {
                    return sitem.id === row.id;
                })
                if (isIn) {//已选中
                    if (!isFromAll) {//是否来自全选区域 全选区域不需要删除
                        this.delSeletedListById(row.id);
                    }
                } else {
                    this.selectedList.push(row);
                }
            },
            selectionSearchFnAll(val) {
                if (val.length > 0) {
                    val.map(v => {//全选
                        this.selectionSearchFn(val, v, true);
                    })
                } else {
                    //当前页全不选
                    this.tableData.map(t => {
                        this.delSeletedListById(t.id);
                    })
                }
            },
            delSeletedListById(id) {
                this.selectedList.map((sitem, index) => {
                    if (sitem.id === id) {
                        this.selectedList.splice(index, 1);
                    }
                })
            },
            //批量删除
            delFileAllBtn() {
                this.delType = 2;
                if (this.selectedList.length > 0) {
                    if(this.selectedList.length > 30){
                       return this.$message.warning("批量删除文件份数不能超过30份!");
                    }
                    this.signPasswordDialog = true;
                } else {
                    this.$message.warning("请选择要删除的合同！");
                }
            },
            //批量下载
            downloadFileAllBtn() {
                this.downloadType = 2;
                let list = this.selectedList.filter(t => {
                    return t.compactBelongedStatus === '04';
                })
                if (list.length === 0) {
                    this.$message.warning("请选择要下载的合同！");
                    return
                }
                if (list.length > 30) {
                    this.$message.warning("批量下载文件份数不能超过30份！");
                    return
                }
                this.checkPermission(
                    // 权限校验
                    this.$perMap.contractMgt.download.url
                ).then((res) => {
                    if (!this.successCheckCode(res)) {
                        return;
                    }
                    if (this.isFileSafety) {
                        this.downloadDialog = true;
                    } else {
                        this.downloadFileAllFn();
                    }
                });
            },
            downloadFileAllFn() {
                let list = this.selectedList.filter(t => {
                    return t.compactBelongedStatus === '04';
                })
           
                let arr = [];
                list.map(l => {
                    let temp = {};
                    temp.compactId = l.id;
                    temp.theme = l.compactTheme
                    arr.push(temp)
                })
                let data = {
                    "compactIdAndThemeList": arr
                }
                if (arr.length > 0) {
                    this.dowloadFileAll(data);
                }
            },
            dialogClose() {
                this.downloadDialog = false;
                this.countdown2 = 0;
                clearInterval(this.timer);
                this.timer = null;
                this.isCode = true;
                this.verify = '';
            },
            rushSign(id) {
                this.contractRush(id).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.$message.success('催签成功');
                    }
                });
            },
            dialogTipsFn(data) {
                this.dialogTips = data;
            },
            seachList() {
                this.pageNum = 1;
                this.getListData();
                //清楚选中的按钮
                this.selectedList = [];
            },
            radioEvent() {
                this.showFlag = false;
            },
            titleValue(data) {
                //切换数据重置
                this.tableData = [];
                this.selectedList = [];
                if (data.type == 'updateWord') {
                    this.title = data.name;
                    this.getCompactFolder();
                    return;
                }
                this.title = data.name || '所有合同';
                this.type = data.type;
                this.pageNum = 1;
                this.startTime = '';
                this.timeIndex = '';
                this.endTime = '';
                this.compactTheme = '';
                this.timeType = '02';
                this.pickerTime = "";
                this.folderId = data.folderId || '';
                this.getListData();
            },
            // 选择时间
            timeSlot(type) {
                this.pageNum = 1;
                if (this.timeIndex == type) {
                    this.timeIndex = '';
                    this.endTime = '';
                    this.startTime = '';
                    this.getListData();
                    return;
                } else {
                    this.timeIndex = type;
                }

                if (
                    this.type == '05' ||
                    (this.type == '09' && this.timeType == '03') ||
                    (this.type == '08' && this.timeType == '03') ||
                    (this.type == '07' && this.timeType == '03')
                ) {
                    this.endTime = this.getDay(0);
                } else {
                    this.startTime = this.getDay(0);
                }

                if (type == '0') {
                    this.endTime = '';
                    this.startTime = '';
                    this.getListData();
                    return;
                }

                if (type == '01') {
                    // 一周
                    if (
                        this.type == '05' ||
                        (this.type == '09' && this.timeType == '03') ||
                        (this.type == '08' && this.timeType == '03') ||
                        (this.type == '07' && this.timeType == '03')
                    ) {
                        this.startTime = this.getDay(+7);
                    } else {
                        this.endTime = this.getDay(-7);
                    }
                    // return;
                }
                if (type == '02') {
                    // 一个月
                    if (
                        this.type == '05' ||
                        (this.type == '09' && this.timeType == '03') ||
                        (this.type == '08' && this.timeType == '03') ||
                        (this.type == '07' && this.timeType == '03')
                    ) {
                        this.startTime = this.getDay(+30);
                    } else {
                        this.endTime = this.getDay(-30);
                    }
                    // return;
                }
                if (type == '03') {
                    // 半年
                    if (
                        this.type == '05' ||
                        (this.type == '09' && this.timeType == '03') ||
                        (this.type == '08' && this.timeType == '03') ||
                        (this.type == '07' && this.timeType == '03')
                    ) {
                        this.startTime = this.getDay(+180);
                    } else {
                        this.endTime = this.getDay(-180);
                    }
                    // return;
                }
                this.getListData();
            },
            pickerTimeFn(val) {
                // if()
                this.endTime = this.pickerTime[1] && moment(this.pickerTime[1]).format("YYYY-MM-DD") + " 23:59:59";
                this.startTime = this.pickerTime[0] && moment(this.pickerTime[0]).format("YYYY-MM-DD") + " 00:00:00"
                 //清楚选中的按钮
                 this.selectedList = [];
                this.pageNum = 1;
                // console.log(this.pickerTime);
                this.getListData();
                // if(this.startTime && this.endTime){
                // }
            },
            getDay(day) {
                var today = new Date();
                var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
                today.setTime(targetday_milliseconds);

                var tYear = today.getFullYear();
                var tMonth = today.getMonth();
                var tDate = today.getDate();
                var houre = today.getHours();
                var minut = today.getMinutes();
                var seconds = today.getSeconds();
                tMonth = this.doHandleMonth(tMonth + 1);
                tDate = this.doHandleMonth(tDate);
                houre = this.doHandleMonth(houre);
                minut = this.doHandleMonth(minut);
                seconds = this.doHandleMonth(seconds);
                return tYear + '-' + tMonth + '-' + tDate + ' ' + houre + ':' + minut + ':' + seconds;
            },
            doHandleMonth(month) {
                var m = month;
                if (month.toString().length == 1) {
                    m = '0' + month;
                }
                return m;
            },
            // 签署
            sign(row) {
                this.checkPermission(
                    // 权限校验
                    this.$perMap.contractMgt.signature.url,
                    this.$perMap.contractMgt.signature.method
                ).then((res) => {
                    if (!this.successCheckCode(res)) {
                        return;
                    }
                    if (row.source === 2) {
                        // 模板签署
                        this.detail(row.id).then((res) => {
                            console.log(res);
                            if (this.successCheckCode(res)) {
                                let nowUser = res.data.compactSignatoryList.find((v) => v.userId === this.userinfo.userId);
                                let query = {
                                    editType: '01',
                                    isTemp: '1'
                                };
                                nowUser.fillFieldFlag === 1 ? (query.compactId = row.id) : (query.id = row.id);
                                // 是否还需要填充模板，需要就去填充模板，不需要就直接去签合同
                                let path = nowUser.fillFieldFlag === 1 ? '/contractsignature' : '/fillTemplate';
                                this.$router.push({
                                    path,
                                    query
                                });
                            }
                        });
                    } else {
                        // 普通合同签署
                        this.$router.push({
                            path: '/contractsignature',
                            query: { compactId: row.id, editType: '01' }
                        });
                    }
                });
            },
            // 移动
            move(id) {
                // this.moveFile = true;
                this.dialogVisible = true;
                this.moveCompId = id;
            },
            // 催签
            sendMessage(id) {
                this.contractRush(id).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.$message.success('催签成功');
                    }
                });
                /*this.$message({
                    message: "已通过短信的方式通知对方及时完成合同签署",
                    type: "success",
                    duration: 3000
                });*/
            },
            // 拒签原因
            refuseSign(theme, txt) {
                this.dialogTit = '查看拒签原因';
                this.dialogItemName = '拒签合同';
                this.revoke.revokeFile = theme;
                this.revoke.revokeInfo = txt;
                this.showFlag = true;
            },
            // 撤销原因
            revokeSign(theme, txt) {
                this.dialogTit = '查看撤销原因';
                this.dialogItemName = '撤销合同';
                this.revoke.revokeFile = theme;
                this.revoke.revokeInfo = txt;
                this.showFlag = true;
            },
            // 继续
            continueSign(val) {
                if (val.source === 2) { //模板合同为2  正常合同为1
                    if (val.compactStep == '04') {
                        return this.$router.push(`/contractsignature?compactId=${val.id}&isTemp=1`);
                    } else {
                        return this.$router.push(`/contractsign?id=${val.id}&isTemp=1&type=01`);
                    }
                }
                if (val.compactStep == '01') {
                    this.$router.push({
                        path: '/contractsign',
                        query: { type: '01', id: val.id }
                    });
                } else if (val.compactStep == '02') {
                    this.$router.push({
                        path: '/contractprocess',
                        query: { type: '02', id: val.id }
                    });
                } else if (val.compactStep == '03') {
                    this.$router.push({
                        path: '/contractsignature',
                        name: 'contractsignature',
                        query: { compactId: val.id }
                    });
                }
            },
            // 更多
            more(id, status, signStatus, compactStep, compactTheme, source) {
                if (this.blockStatusType == '08') {
                    // 跳转待待我签署 更多
                }
                this.$router.push({
                    path: '/contractmore',
                    query: {
                        id: id,
                        status: status,
                        signStatus: signStatus,
                        compactStep: compactStep,
                        compactTheme: compactTheme,
                        source
                    }
                });
            },
            removeFile(val) {
                if (!!this.folderId) {
                    this.$confirm('是否移出该文件？', '移出文件', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        customClass: 'self-icon icon-warning'
                    }).then(() => {
                        this.moveCompId = val;
                        let data = { compactId: this.moveCompId };
                        this.moveCompactFolder(data).then((res) => {
                            if (this.successCheckCode(res)) {
                                this.$message({
                                    message: `移出成功`,
                                    type: 'success'
                                });
                                this.moveCompId = '';
                                this.wordList = '';
                                this.getListData();
                            }
                        });
                    });
                    return;
                }
            },
            //
            deleteFile(val) {
                this.checkPermission(
                    // 权限校验
                    this.$perMap.contractMgt.deleteCompact.url
                ).then((res) => {
                    if (!this.successCheckCode(res)) {
                        return;
                    }
                    this.$confirm('此操作将永久删除该文件，是否继续？', '删除文件', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        customClass: 'icon-delete self-icon',
                        closeOnClickModal: false
                    }).then(() => {
                        var data = {
                            compactId: val,
                            userId: this.userinfo.userId
                        };
                        this.deleteCompact(data).then((res) => {
                            if (this.successCheckCode(res)) {
                                this.$message({
                                    message: `操作成功`,
                                    type: 'success',
                                    duration: 3000
                                });
                                this.pageNum = 1;
                                this.getListData();
                            }
                        });
                    });
                });
            },
            //签约完成删除
            delComplete(row) {
                this.checkPermission(
                    // 权限校验
                    this.$perMap.contractMgt.deleteCompact.url
                ).then((res) => {
                    if (!this.successCheckCode(res)) {
                        return;
                    }
                    // this.selectedList = [row];
                    this.delType = 1;
                    this.delItem = row;
                    this.signPasswordDialog = true;
                });
            },
            //删除校验弹窗确认后
            delDialogConfirm() {
                let compactIds = [];
                if (this.delType == 1) {
                    //单文件
                    compactIds.push(this.delItem.id)
                } else {
                    //批量
                    this.selectedList.map(s => {
                        compactIds.push(s.id);
                    })
                }
                var data = {
                    compactIds: compactIds,
                    userId: this.userinfo.userId
                };
                this.deleteCompactBatch(data).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.$message({
                            message: `删除成功！`,
                            type: 'success',
                            duration: 3000
                        });
                        this.selectedList = [];
                        this.signPasswordDialog = false;
                        this.pageNum = 1;
                        this.getListData();
                    }
                });
            },
            // 合同列表
            getListData() {
                let params = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    userId: this.userinfo.userId,
                    blockStatusType: this.type, //类型
                    // timeType: this.timeType, // 时间类型
                    endTime: this.endTime || this.paramsNull, // 开始时间
                    startTime: this.startTime || this.paramsNull, // 结束时间
                    compactTheme: this.compactTheme || this.paramsNull, // 合同主题,
                    folderId: this.folderId || this.paramsNull// 合同归档id,
                };
                if (this.type == '09' || this.type == '08' || this.type == '07') {
                    params.timeType = this.timeType;
                }
                if (this.type == '10') {
                    params.blockStatusType = '10';
                    this.isWord = true;
                }
                if (!!this.folderId) {
                    this.isWord = true;
                } else {
                    this.isWord = false;
                }
                // console.log(JSON.stringify(params))
                var self = this;
                self.loadingTabel = true;
                this.getSignList(params)
                    .then((res) => {
                        if (this.successCheckCode(res)) {
                            if (res.data.list.records.length > 0) {
                                this.nodata = false;
                            } else {
                                this.nodata = true;
                            }
                            this.tableData = res.data.list.records;
                            // this.tableData.filter(t=>{
                            //     this.selectedList.some(s=>{
                            //         return t.id === s.id;
                            //     })
                            // })
                            //设置选中状态
                            this.$nextTick(() => {
                                this.tableData.map(t => {
                                    this.selectedList.map(s => {
                                        if (t.id === s.id) {
                                            this.$refs.searchResult.toggleRowSelection(t, true);
                                        }
                                    })
                                })
                            })
                            this.total = res.data.list.total;
                            this.currentpage = res.data.list.current;
                            this.dateStr = new Date(Date.parse(res.data.dateStr.replace(/-/g, '/'))).getTime();
                        }
                        setTimeout(() => {
                            self.loadingTabel = false;
                        }, 500);
                    })
                    .fail(() => {
                        self.nodata = true;
                        self.loadingTabel = false;
                    });

            },
            //合同归档列表
            getCompactFolder() {
                //this.type = 'word';
                let enterpriseId = JSON.parse($.cookie('userinfo')).userId;
                // let enterpriseId = 12424 ;
                this.getCompactFolderList(enterpriseId).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.CompactFolderList = res.data;
                        if (!!this.folderId && !this.title) {
                            let list = res.data;
                            list.map((item) => {
                                if (this.folderId == item.id) {
                                    this.title = item.folderName;
                                    return;
                                }
                            });
                        }
                    }
                });
            },
            handleClose(done) {
                this.moveCompId = '';
                this.wordList = '';
                done();
            },
            moveWord() {
                if (!this.wordList) {
                    return this.$message.error('请选择目标文件夹');
                }
                let data = { compactId: this.moveCompId, folderId: this.wordList };
                this.moveCompactFolder(data).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.$message({
                            message: `移动成功`,
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.moveCompId = '';
                        this.wordList = '';
                        this.getListData();
                    }
                });
            },
            closeMove() {
                this.dialogVisible = false;
                this.moveCompId = '';
                this.wordList = '';
            },
            checkTime(date) {
                console.log(new Date(Date.parse(date.replace(/-/g, '/'))).getTime(), this.dateStr);
                console.log(new Date(Date.parse(date.replace(/-/g, '/'))).getTime() > this.dateStr);
                return new Date(Date.parse(date.replace(/-/g, '/'))).getTime() > this.dateStr;
            },
            fillFile(id) {
                this.$router.push({
                    path: '/fillTemplate',
                    query: {
                        id,
                        isTemp: '1',
                        editType: '01'
                    }
                })
            }
        }
    }
</script>
<style>
    .contract_content .search .el-input__inner {
        border: 1px solid #c0ccda;
        background: #fff;
    }

    .dial-header .el-dialog {
        -ms-transform: translate(-50%) !important;
        transform: translate(-50%, -50%) !important;
        border-radius: 10px !important;
    }

    .contractlist .el-dialog__body {
        padding: 0 20px;
        border-radius: 10px !important;
    }

    .dial-header .el-dialog__header {
        background: #e8ecef;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        border-radius: 10px 10px 0 0 !important;
        font-size: 16px;
        color: #333333;
    }

    .dial-header .el-dialog__body .filename {
        padding-top: 30px;
        padding-bottom: 20px;
        font-size: 14px;
        color: #626262;
    }

    .dial-header .el-dialog__body .textarea {
        border: 1px solid #e2e2e2;
        width: 100%;
        height: 170px;
        padding: 10px;
        font-size: 14px;
        color: #626262;
    }

    .dial-header .el-dialog__body>div {
        width: auto !important;
    }

    .dial-header .el-dialog__body .button {
        padding-top: 30px !important;
        padding-bottom: 30px !important;
    }

    .dial-header .el-dialog__body .button button {
        min-width: 80px;
        height: 36px;
    }

    .dial-header .el-dialog__body .button button.cancel {
        border: 1px solid #c0ccda;
    }

    .dial-header .el-dialog__headerbtn {
        margin-top: 13px;
    }

    .el-input-group__append button.el-button {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }

    .el-input-group__append button.el-button:hover {
        background-color: #0073bd;
    }

    .contractlist .contract_content .search .input-with-select.el-input.el-input-group.el-input-group--append .el-input__inner {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .del-all-btn {
        border: 1px solid #4CA1F4;
        color: #4CA1F4;
    }

    .myCell .el-checkbox__input {
        display: none
    }
</style>
<style scoped lang="scss">
    .el-dialog__wrapper {
        width: auto !important;
    }

    .el-dialog.el-dialog--small {}

    .el-button--text:focus {
        color: #999;
    }

    .el-icon-el-icon-search {
        display: inline-block;
        width: 19px;
        height: 19px;
        margin-left: -6px;
        background: url('../../../../static/image/search.png') center no-repeat;
    }

    .contractlist {

        // height: calc(100% - 70px);
        .contractnav {
            z-index: 2;
            width: 206px;
            float: left;
            background: #e8ecef;
            position: fixed;
            height: calc(100% - 160px);
            height: -moz-calc(100% - 160px);
            height: -webkit-calc(100% - 160px);
            overflow: auto;
            overflow-x: hidden;

            /*合同nav滚动条样式优化*/
            &::-webkit-scrollbar {
                width: 5px;
                height: 5px;
            }

            &::-webkit-scrollbar-thumb {
                border-radius: 1em;
                background-color: rgba(50, 50, 50, 0.3);
            }

            &::-webkit-scrollbar-track {
                border-radius: 1em;
                background-color: rgba(50, 50, 50, 0.1);
            }
        }

        .contract_content {
            height: 100%;
            background-color: #fff;
            padding-left: 30px;
            padding-right: 30px;
            margin-left: 206px;

            .title {
                padding: 19px 0;
                font-size: 16px;
                color: #333333;
                border-bottom: 1px solid #c0ccda;
            }

            .time {
                margin-left: 30px;
                margin-right: 40px;
                border-radius: 4px;
                // border: 1px solid #c0ccda;
            }

            /* span {
                padding: 0 16px;
                float: left;
                height: 36px;
                line-height: 36px;
                border-right: 1px solid #c0ccda;
                cursor: pointer;
                font-size: 14px;
                color: #99a9bf;
            } */

            .search {
                height: 38px;
                margin: 20px 0;

                .el-select {
                    width: 148px;

                }

                .input-with-select {
                    width: 300px;
                }

                .searchtips {
                    height: 38px;
                    line-height: 38px;
                }

                >div {
                    float: left;
                }

                .time {
                    margin-left: 30px;
                    margin-right: 40px;
                    border-radius: 4px;

                    span {
                        padding: 0 16px;
                        float: left;
                        height: 36px;
                        line-height: 36px;
                        border-right: 1px solid #c0ccda;
                        cursor: pointer;
                        font-size: 14px;
                        color: #99a9bf;
                    }

                    span.active {
                        background: #0073bd;
                        color: #ffffff;
                    }

                    span:nth-child(4) {
                        border-right: none;
                        border-radius: 0 4px 4px 0;
                    }

                    span:nth-child(1) {
                        border-radius: 4px 0 0 4px;
                    }
                }
            }

            table {
                button {
                    width: auto;
                }
            }
        }


        .dropdown-btn {
            cursor: pointer;
            margin-left: 6px;
            display: inline-block;

            i {
                display: inline-block;
                width: 4px;
                height: 4px;
                border-radius: 4px;
                border: 1px solid #999;
                background-color: #fff;
                margin-left: 4px;
                vertical-align: middle;
            }
        }

        .el-dropdown-menu__item {
            p {
                font-size: 12px;
                color: #999;

                &:hover {
                    color: #0073bd;
                }
            }
        }
    }
</style>