<template>
    <div class="ukeyrenew">
        <div class="orderpage-topbar clearfix">
            <div class="orderpage-tit" v-if="userType === '02'">
                Ukey签名续期
            </div>
            <div class="orderpage-tit" v-if="userType === '01'">
                Ukey印章续期
            </div>
            <div class="orderpage-progress">
                <img src="../../../../static/image/ukeyrenew3.png" />
            </div>
        </div>
        <div class="orderpage-cont">
            <!-- <div class="orderpage-item-tit" v-if="userType==='02'">个人信息</div>
      <div class="orderpage-item-tit" v-if="userType==='01'">企业信息</div>
      <table class="renewInfoTable" rules="all" width="100%" v-if="userType==='02'">
        <tbody>
          <tr>
            <td class="td-tit">姓名</td>
            <td class="td-cont">
              <div>{{personName}}</div>
            </td>
          </tr>
          <tr>
            <td class="td-tit">身份证号码</td>
            <td class="td-cont">
              <div>{{personCertificateNumber}}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="renewInfoTable" rules="all" width="100%" v-if="userType==='01'">
        <tbody>
          <tr>
            <td class="td-tit">企业名称</td>
            <td class="td-cont">
              <div
                v-if="orderInfo.enterpriseInfo&& orderInfo.enterpriseInfo.enterpriseName"
              >{{orderInfo.enterpriseInfo.enterpriseName}}</div>
            </td>
          </tr>
          <tr>
            <td class="td-tit">统一社会信用代码</td>
            <td class="td-cont">
              <div
                v-if="orderInfo.enterpriseInfo&&orderInfo.enterpriseInfo.uniformCreditCode"
              >{{orderInfo.enterpriseInfo.uniformCreditCode}}</div>
            </td>
          </tr>
          <tr>
            <td class="td-tit">法人代表</td>
            <td class="td-cont">
              <div
                v-if="orderInfo.enterpriseInfo&&orderInfo.enterpriseInfo.legalPersonName"
              >{{orderInfo.enterpriseInfo.legalPersonName}}</div>
            </td>
          </tr>
        </tbody>
      </table> -->
            <div class="orderpage-item-tit" v-if="userType === '02'">
                签名信息
            </div>
            <div class="orderpage-item-tit" v-if="userType === '01'">
                印章信息
            </div>
            <span class="warning">注意：请保持UKEY插入电脑不要拔出。</span>
            <!-- <table
                class="renewInfoTable"
                rules="all"
                width="100%"
                v-if="userType === '02'"
            >
                <tbody v-for="item in esealList">
                    <tr>
                        <td class="td-tit">签名名称</td>
                        <td class="td-cont">
                            <div>{{ item.pictureName }}</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-tit">签名编号</td>
                        <td class="td-cont">
                            <div>{{ item.pictureCode }}</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-tit">失效时间</td>
                        <td class="td-cont">
                            <div>
                                {{ item.bizValidStart }} 变更为
                                {{ modifyEnd }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table> -->
            <table
                class="renewInfoTable"
                rules="all"
                width="100%"
                v-if="userType === '01'"
            >
                <tbody v-for="item in esealList">
                    <tr>
                        <td class="td-tit">印章名称</td>
                        <td class="td-cont">
                            <div>{{ item.pictureName }}</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-tit">印章编号</td>
                        <td class="td-cont">
                            <div>{{ item.pictureCode }}</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-tit">失效时间</td>
                        <td class="td-cont">
                            <div>
                                {{ item.bizValidEnd }} 变更为
                                {{ modifyEnd }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="updateTips">
                <span>温馨提示：</span>
                <span>
                    1、 如果您需要对历史PDF、office文件进行盖章撤销操作，请先去撤销盖章后再回来进行证书更新，否则更新之后将无法对历史office文件撤销。
                </span>
            </div>
        </div>



        <div class="orderpage-footbtn">
            <el-button @click="back">返回</el-button>
            <el-button
                type="primary"
                @click="updateCert"
                v-if="esealList.length"
                >更新证书</el-button
            >
        </div>

        <el-dialog
            title="更新证书"
            :visible.sync="dialogVisible"
            custom-class="custom-dialog"
            width="30%"
            top="22%"
        >
            <div class="dialog-content">
                <div class="ukey-err">
                    <span class="icon-ukey"></span>请插入UKEY点击读取！
                </div>
                <div class="notice">
                    <p style="color:#333;font-size:15px;">注意：</p>
                    <p>1、UKey设备需要插入电脑；</p>
                    <p>2、提前安装UKey驱动程序；</p>
                    <p>3、请在IE、360浏览器下，进行操作；</p>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button
                >&nbsp;
                <el-button type="primary" @click="refresh">读 取</el-button>
            </div>
        </el-dialog>

        <el-dialog
            title="更新证书"
            :visible.sync="dialogVisible2"
            custom-class="custom-dialog"
            :close-on-click-modal="false"
            width="30%"
            top="22%"
        >
            <div class="dialog-content dialog-align-left">
                <p>
                    <span>UKEY信息：</span>
                    {{ ukeyName }}
                </p>
                <div class="pin-code-ipt">
                    请输入PIN码：
                    <el-input
                        type="password"
                        v-model="pincode"
                        class="pin"
                        placeholder="请输入PIN码"
                    ></el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button
                >&nbsp;
                <el-button type="primary" @click="subUkey" :loading="loadings">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
            title="更新证书"
            :visible.sync="dialogVisible3"
            :show-close="true"
            :close-on-click-modal="false"
            custom-class="custom-dialog3"
            top="10%"
        >
            <div class="dialog-content">
            	<div slot="footer" class="write-foot">
					<span>1</span> 请先点击下面“<b>马上更新</b>”按钮  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>2</span> 更新成功后点击此<el-button
                        type="primary"
                        style="margin:0 5px;background: #20A0FF;"
                        @click="writeBack"
                        >证书回写</el-button
                    >按钮
                </div>
                <iframe
                    :src="gdcaUrl"
                    ref="iframe_gdca"
                    name="iframe_gdca"
                    id="iframe_gdca"
                    style="height:500px;width:100%;"
                ></iframe>
            </div>
        </el-dialog>

        <el-dialog
            title="更新证书"
            :visible.sync="dialogVisible4"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            custom-class="custom-dialog"
            top="22%"
        >
            <div class="dialog-content">
                <div>
                    <div class="write-back-tit">
                        <div class="tit-info">
                            证书回写中，请勿关闭当前窗口！
                        </div>
                        <div class="cont-info">
                            如遇到问题，请联系客服
                            <a style="color:#02adff;">400-919-6663</a> ，或
                            <a
                                style="color:#02adff;text-decoration:underline;"
                                href="tencent://message/?uin=3003627997&site=%E5%AE%89%E5%8D%B0%E7%A7%91%E6%8A%80&menu=yes"
                                >在线客服</a
                            >
                        </div>
                    </div>
                    <div class="write-back-progress">
                        <el-progress
                            :percentage="updateProgressVal"
                        ></el-progress>
                    </div>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            title="更新证书"
            :visible.sync="dialogVisible6"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            custom-class="custom-dialog"
            top="22%"
        >
            <div class="dialog-content">
                <div class="renew-result-info">
                    <div class="tit-info">证书回写失败</div>
                    <div class="cont-info">失败原因：{{ updateErrorInfo }}</div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>&nbsp;
                <el-button type="primary" @click="writeBack"
                    >重新回写</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script>
import base from "../mixin/base";
// import ukey from "../../../assets/plugin/ukey.js";
import netca from "../../../assets/plugin/netca";
var certUtil = require("../../../assets/plugin/cert.js").default;

export default {
    mixins: [base],
    components: {},
    data() {
        return {
            dialogVisible: false,
            dialogVisible2: false,
            dialogVisible3: false,
            dialogVisible4: false,
            dialogVisible6: false,
            pincode: "",
            gdcaUrl: "",
            personName: "",
            personCertificateNumber: "",
            ukeyselect: "",
            ukeylist: [],
            ukeyName: "",
            updateErrorInfo: "",
            updateProgressVal: 0,
            orderNo: "",
            esealList: [],
            orderInfo: {},
            userType: JSON.parse($.cookie("userinfo")).userType,
            oid: "",
            bizValidStart: "",
            bizValidEnd: "",
            signCertificateSn: "",
            encryptCertificateSn: "",
            pictureCode: "",
            timer: null,
            vid: "",
            netcaRenewInfo: {},
            signCertContent: "",
            encryptCertContent: "",
            modifyEnd: '',
            loadings: false,
            template: 1
        };
    },
    computed: {
        bizValidEndComp(time, year) {
            return function(time, year) {
                let dateNow = new Date().getTime();
                let dateEnd = new Date(time).getTime();
                let max = Math.max(dateNow, dateEnd);
                let maxYear = new Date(max).getFullYear() + +year;
                let maxMonth = new Date(max).getMonth() + 1;
                let maxDate = new Date(max).getDate();
                console.log(maxYear, maxMonth, maxDate);
                return maxYear + "-" + maxMonth + "-" + maxDate;
            };
        }
    },
    watch: {},
    mounted() {
        this.orderNo = this.$route.query.orderNo;
        this.getDetailData();
        this.getComfrimData();
    },
    methods: {
        getComfrimData(){
            this.getOrderConfirm(this.orderNo, this.pageNum, 100).then(res => {
                if (this.successCheckCode(res)) {
                    this.modifyEnd = res.data.sealList[0].sealValidDateEnd;
                }
            });
        },
        getDetailData() {
            if (this.userType == "01") {
                this.orderDetailEnterprise(this.orderNo)
                    .then(res => {
                        if (this.successCheckCode(res)) {
                            let status = res.data.orderBasicInfo.orderStatus;
                            if (status != "06" && status != "08") {
                                this.$message({
                                    type: "error",
                                    message: "非法请求",
                                    duration: 1500
                                });
                                setTimeout(() => {
                                    this.$router.replace('ukeyorder');
                                }, 1500);
                                return;
                            }
                            if (status == "08") {
                                this.$router.push({
                                    path: "/renewupdateresult",
                                    query: {
                                        orderNo: this.orderNo,
                                        pictureCode:
                                            res.data.esealList[0].pictureCode,
                                        renewTime:
                                            res.data.esealList[0].renewalTime
                                    }
                                });
                            }
                            this.orderInfo = res.data;
                            this.esealList = res.data.esealList;
                        }
                    })
            } else if (this.userType == "02") {
                this.orderDetailPersonal(this.orderNo).then(res => {
                    if (this.successCheckCode(res)) {
                        if (
                            res.data.orderBasicInfo.orderStatus != "06" &&
                            res.data.orderBasicInfo.orderStatus != "08"
                        ) {
                            this.$message({
                                type: "error",
                                message: "非法请求",
                                duration: 1500
                            });
                            setTimeout(() => {
                                this.$router.go(-1);
                            }, 1500);
                            return;
                        }
                        this.orderInfo = res.data;
                        this.esealList = res.data.esealInfoList;
                        this.personName =
                            res.data.pobOrderPersonalRespVO.personName;
                        this.personCertificateNumber =
                            res.data.pobOrderPersonalRespVO.personCertificateNumber;
                    }
                });
            }
        },
        updateCert() {
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                // if(this.vid == '01'){ //gdca
                //     window.open(this.gdcaUrl, '_blank');
                // }else if(this.vid == '02'){ //netca
                    
                // }
                this.getUKeyVersion().then(res => {
                    if (this.successUKeyCheckCode(res)) {
                        res = JSON.parse(res);
                        let ver = res.version;
                        this.checkUKeyVersion(ver).then(res => {
                            if (this.successCheckCode(res)) {
                                if (!!res.data.isNewest) {
                                    this.refresh();
                                } else {
                                    this.$updateUKeyDrive();
                                }
                            }
                        });
                    }
                });
            } else {
                // this.isIe = false;
                this.$message({
                    type: "error",
                    message:
                        "因CA机构仅支持IE浏览器，请在下载浏览器IE10以上版本进行续期",
                    duration: 3500
                });
                return false;
            }
        },
        //刷新读取ukey
        refresh() {
            this.ukeyselect = "";
            this.ukeylist = [];
            this.getAllUKeyList().then(res => {
                if (this.successUKeyCheckCode(res)) {
                    res = JSON.parse(res || {});
                    if (this.dialogVisible == true && !res.keyList.length) {
                        this.$message({
                            type: "error",
                            message: "暂无印章数据，请插入UKEY进行读取"
                        });
                        return false;
                    }
                    if (!res.keyList.length) {
                        this.dialogVisible = true;
                        return false;
                    }
                    this.dialogVisible = false;
                    this.ukeylist = res.keyList;
                    this.ukeyName = this.ukeylist[0].key_name;
                    this.ukeyselect = this.ukeylist[0].key_id;
                    this.dialogVisible2 = true;
                    // this.UKeyNum = res.count;
                }
            });
        },
        subUkey() {
            if (this.pincode.length < 4) {
                this.$message.error("请输入正确的PIN码");
                return;
            }
            this.loadings = true;
            this.loginKey({
                keyid: this.ukeyselect,
                pin: this.pincode
            }).then(res => {
                res = JSON.parse(res || {});
                if (this.successUKeyCheckCode(res)) {
                    this.getSignetInfo();
                } else {
                    this.$message.error("PIN码不正确");
                    setTimeout(() => {
                        this.loadings = false;
                    }, 200);
                }
            }).fail(res => {
                setTimeout(() => {
                    this.loadings = false;
                }, 200);
            });
        },
        getSignetInfo() {
            this.getCertInfoObjFn(this.ukeyselect).then(res => {
                if(this.successUKeyCheckCode(res)){
                    res = JSON.parse(res);
                    res.info.map(ele => {
                        if(ele.item_type == 3){
                            this.pictureCode = ele.item_info;
                        }
                    })
                }else{
                    setTimeout(() => {
                        this.loadings = false;
                    }, 200);
                }
            }).fail(res => {
                setTimeout(() => {
                    this.loadings = false;
                }, 200);
            })
            if (this.pictureCode != this.esealList[0].pictureCode) {
                this.$message({
                    type: "error",
                    message: "插入Ukey印章错误，请重新更换",
                    duration: 2500
                });
                setTimeout(() => {
                    this.loadings = false;
                }, 200);
                return false;
            }
            this.getSignInfo({
                orderNo: this.orderNo,
                pictureCode: this.esealList[0].pictureCode,
                surrogateKey: this.esealList[0].esealId
            }).then(res => {
                if (this.successCheckCode(res)) {
                    let data = res.data;
                    this.vid = data.vid;
                    if (this.vid == "01") {
                        //gdca发送续期订单
                        this.applyGDCA({
                            orderNo: this.orderNo,
                            pictureCode: data.pictureCode,
                            vid: "01"
                        }).then(ret => {
                            if (this.successCheckCode(ret)) {
                                data.list.map(ele => {
                                    if(this.vid == ele.vid){
                                        // this.gdcaUrl ? document.getElementById("iframe_gdca").src = ele.url : '';
                                        this.dialogVisible3 = true;
                                        this.dialogVisible2 = false;
                                        this.$nextTick(() => {
                                            document.iframe_gdca.location.href = this.gdcaUrl = ele.url;
                                        });
                                    }
                                })
                            }
                            setTimeout(() => {
                                this.loadings = false;
                            }, 500);
                        }).fail(ret => {
                            setTimeout(() => {
                                this.loadings = false;
                            }, 500);
                        });
                    } else if (this.vid == "02") {
                        //netca
                        this.writeBack();
                        this.dialogVisible2 = false;
                        setTimeout(() => {
                            this.loadings = false;
                        }, 200);
                    }
                }else{
                    setTimeout(() => {
                        this.loadings = false;
                    }, 200);
                }
            }).fail(res => {
                setTimeout(() => {
                    this.loadings = false;
                }, 200);
            });
        },
        checkList(){
            return new Promise((resolve, reject) => {
                this.getAllUKeyList().then(ret => {
                    if(this.successUKeyCheckCode(ret)){
                        ret = JSON.parse(ret || {});
                        if (this.dialogVisible == true && !ret.keyList.length) {
                            this.$message({
                                type: "error",
                                message: "暂无印章数据，请插入UKEY进行读取"
                            });
                            resolve(false);
                            return false;
                        }
                        if (!ret.keyList.length) {
                            this.dialogVisible3 = false;
                            this.dialogVisible = true;
                            resolve(false);
                            return false;
                        }
                        this.dialogVisible = false;
                        this.ukeylist = ret.keyList; 
                        this.ukeyName = this.ukeylist[0].key_name;
                        this.ukeyselect = this.ukeylist[0].key_id;
                        resolve(true);
                    }
                }).fail(ret => {
                    this.updateErrorInfo = "当前网络故障，请重新回写证书";
                    this.dialogVisible3 = false;
                    this.dialogVisible6 = true;
                })
            })
        },
        async writeBack() {
            if(!await this.checkList()){
                return false;
            }
            this.dialogVisible3 = false;
            this.dialogVisible6 = false;
            this.dialogVisible4 = true;
            this.updateProgressVal = 0;
            this.timer = setInterval(() => {
                if (this.updateProgressVal < 80) {
                    this.updateProgressVal += 20;
                }
            }, 200);

            this.getCertInfoObjFn(this.ukeyselect)
                .then(res => {
                    if (this.successUKeyCheckCode(res)) {
                        res = JSON.parse(res);
                        res.info.map(ele => {
                            switch (ele.item_type) {
                                case 1:
                                    this.oid = ele.item_info;
                                    break;
                                case 3:
                                    this.pictureCode = ele.item_info;
                                    break;
                                case 5:
                                    this.bizValidStart = ele.item_info;
                                    break;
                                case 6:
                                    this.bizValidEnd = ele.item_info;
                                    break;
                                case 10:
                                    this.signCertificateSn = ele.item_info;
                                    break;
                                case 11:
                                    this.encryptCertificateSn = ele.item_info;
                                    break;
                                default:
                                    break;
                            }
                        });
                    } else {
                        clearInterval(this.timer);
                        this.updateErrorInfo =
                            res.errMsg || "续期操作失败，请重试";
                        this.dialogVisible4 = false;
                        this.dialogVisible6 = true;
                    }
                })
                .fail(res => {
                    clearInterval(this.timer);
                    this.updateErrorInfo = "当前网络故障，请重新回写证书";
                    this.dialogVisible4 = false;
                    this.dialogVisible6 = true;
                });
            if (this.pictureCode != this.esealList[0].pictureCode) {
                clearInterval(this.timer);
                this.dialogVisible4 = false;
                this.$message({
                    type: "error",
                    message: "插入Ukey印章错误，请重新更换",
                    duration: 2500
                });
                return false;
            }
            if (this.vid == "01") {
                this.rewriteData();
            } else if (this.vid == "02") {
                this.haveRenew().then(res => {
                    if (res === true) {
                        this.isNeedChangeCert({
                            signCertContent: this.signCertContent,
                            signCertSn: this.signCertificateSn
                        })
                            .then(res => {
                                if (res.code == 0) {
                                    if (res.data) {
                                        //true为换体
                                        this.netcaRenewInfo.isChangeBody = 1;
                                        var jsonVal = certUtil.getCertInfo(
                                            this.encryptCertContent
                                        );
                                        this.netcaRenewInfo.p10 =
                                            jsonVal &&
                                            netca.buildParamForRequestCa(
                                                jsonVal
                                            )["p10"];
                                        this.netcaRenewInfo.symmAlgo = netca.getSymmAlgo();
                                    } else {
                                        console.log(6666)
                                        //不需换体
                                        this.netcaRenewInfo.isChangeBody = 0;
                                        this.netcaRenewInfo.p10 = null;
                                        this.netcaRenewInfo.symmAlgo = null;
                                    }
                                    this.netcaSignPlaintext();
                                } else {
                                    this.updateErrorInfo =
                                        res.msg || "续期操作失败，请重试";
                                    this.dialogVisible6 = true;
                                }
                            })
                            .fail(res => {});
                    }
                });
            }
        },
        rewriteData() {
            //gdca回写
            this.uptCertificateStatus({
                bizValidStart: this.bizValidStart,
                bizValidEnd: this.bizValidEnd,
                orderNo: this.orderNo,
                pictureCode: this.esealList[0].pictureCode,
                encryptCertificateSn: this.encryptCertificateSn,
                signCertificateSn: this.signCertificateSn
            })
                .then(res => {
                    if (res.code === 0) {
                        clearInterval(this.timer);
                        this.updateProgressVal = 100;
                        setTimeout(() => {
                            this.dialogVisible4 = false;
                            this.$router.push({
                                path: "/renewupdateresult",
                                query: {
                                    orderNo: this.orderNo,
                                    pictureCode: this.esealList[0].pictureCode,
                                    renewTime: this.esealList[0].renewalTime
                                }
                            });
                        }, 1000);
                    } else {
                        this.updateErrorInfo =
                            res.msg || "续期操作失败，请重试";
                        this.dialogVisible4 = false;
                        this.dialogVisible6 = true;
                    }
                })
                .fail(res => {
                    this.updateErrorInfo = "当前网络故障，请重新回写证书";
                    this.dialogVisible4 = false;
                    this.dialogVisible6 = true;
                });
        },
        haveRenew() {
            //netca是否成功调用过续期接口
            return new Promise((resolve, reject) => {
                this.signCertContent = this.getCert(0);
                this.encryptCertContent = this.getCert(1);
                let data = {
                    esealCode: this.esealList[0].pictureCode,
                    orderNo: this.orderNo,
                    signCertContent: this.signCertContent
                };
                this.netcaSuccess(data)
                    .then(res => {
                        if (res.code == 0) {
                            //成功调用过直接调用续期成功回调
                            if (res.data == false) {
                                //未调用过续期接口
                                resolve(true);
                            } else if (res.data) {
                                this.renewcbsuccess(res);
                            }
                        } else {
                            this.updateErrorInfo =
                                res.msg || "续期操作失败，请重试";
                            this.dialogVisible6 = true;
                        }
                    })
                    .fail(res => {
                        this.updateErrorInfo = "当前网络故障，请重新回写证书";
                        this.dialogVisible6 = true;
                    });
            });
        },
        netcaSignPlaintext() {
            //netca获取签名原文
            var data = {
                oid: this.oid,
                orderNo: this.orderNo,
                esealCode: this.esealList[0].pictureCode,
                signCertContent: this.signCertContent,
                year: this.esealList[0].renewalTime,
                p10: this.netcaRenewInfo.p10,
                symmAlgo: this.netcaRenewInfo.symmAlgo,
                isChangeBody: this.netcaRenewInfo.isChangeBody,
                template: this.template
            };
            this.getNetcaSignText(data)
                .then(res => {
                    if (typeof res != "string") {
                        data.identityType = res.linkman.identityType;
                        res = JSON.stringify(res);
                        let signData = netca.signData(res); //生成签名
                        console.log(signData)
                        if(signData === false){
                            this.updateErrorInfo = '生成签名失败，请重试';
                            this.dialogVisible6 = true;
                            return false;
                        }
                        data.userSignature = signData;
                        // console.log(data, typeof res)
                        this.netcaRenew(data);
                    } else {
                        this.updateErrorInfo =
                            res.msg || "续期操作失败，请重试";
                        this.dialogVisible6 = true;
                    }
                })
                .fail(res => {
                    this.updateErrorInfo = "当前网络故障障，请重新回写证书";
                    this.dialogVisible6 = true;
                });
        },
        netcaRenew(data) {
            this.renewNetca(data)
                .then(res => {
                    if (
                        res.code == 0 &&
                        res.data &&
                        res.data.bpmsResponse.status == 11
                    ) {
                        this.renewcbsuccess(res);
                    } else if (res.code === 5095) {
                        this.template = 2;
                        this.netcaSignPlaintext();
                    } else {
                        this.updateErrorInfo =
                            res.msg || "续期操作失败，请重试";
                        this.dialogVisible6 = true;
                    }
                })
                .fail(res => {
                    this.updateErrorInfo = "当前网络故障障，请重新回写证书";
                    this.dialogVisible6 = true;
                });
        },
        renewcbsuccess(res) {
            var correctData = res.data.bpmsResponse;
            if (
                !(
                    correctData.certInfo &&
                    Object.keys(correctData.certInfo).length != 0
                )
            ) {
                this.updateErrorInfo =
                    correctData.responseResult.msg || "续期操作失败，请重试";
                this.dialogVisible6 = true;
                return;
            }
            //判断是否已续期；
            if (correctData.certInfo[1].certContent == this.signCertContent) {
                // console.log(correctData.certInfo[1].certContent == this.getSignatureCert(this.ukeysele))
                this.netcaCallFn();
                return;
            }
            var deleteCertList = correctData.deleteCert;
            if (
                this.netcaRenewInfo.isChangeBody == 1 &&
                !(netca.delCert(deleteCertList) == "deleSuccess")
            ) {
                this.updateErrorInfo = "删除旧证书失败，无法写入新证书";
                this.dialogVisible6 = true;
                return;
            }
            //install CA to KEY;
            var write_cert = {
                certEnc: "",
                certSign: "",
                encPair: ""
            };
            $.each(correctData.certInfo, function(i, v) {
                if (v.certUsage == 1) {
                    write_cert.certEnc = v.certContent;
                    write_cert.encPair = v.enckeyPair || "";
                } else if (v.certUsage == 2) {
                    write_cert.certSign = v.certContent;
                }
            });
            console.log(22222222222)
            if (netca.installCa(write_cert) == "NetcaWriteSuccess") {
                this.netcaCallFn();
            }
        },
        netcaCallFn() {
            //netca续期回写通知
            this.netcaNotify({
                // "accountId": JSON.parse($.cookie('userinfo')).surrogateKey,
                orderNo: this.orderNo,
                pictureCode: this.esealList[0].pictureCode
            })
                .then(res => {
                    if (res.code == 0) {
                        // 续期成功
                        clearInterval(this.timer);
                        this.updateProgressVal = 100;
                        setTimeout(() => {
                            this.dialogVisible4 = false;
                            this.$router.push({
                                path: "/renewupdateresult",
                                query: {
                                    orderNo: this.orderNo,
                                    pictureCode: this.esealList[0].pictureCode,
                                    renewTime: this.esealList[0].renewalTime
                                }
                            });
                        }, 1000);
                    } else {
                        this.updateErrorInfo = res.msg;
                        this.dialogVisible6 = true;
                    }
                })
                .fail(res => {
                    this.updateErrorInfo = "当前网络故障障，请重新回写证书";
                    this.dialogVisible6 = true;
                });
        },
        getCert(val) {
            let data = "";
            this.getCertData({
                keyid: this.ukeyselect,
                certtype: val //0签名证书1：加密证书
            }).then(res => {
                if (this.successUKeyCheckCode(res)) {
                    res = JSON.parse(res);
                    data = res.certdata;
                }
            });
            return data;
        },
        back() {
            this.$router.go(-1);
        },
        closeDialog() {
            this.dialogVisible4 = false;
            this.dialogVisible6 = false;
        }
    }
};
</script>

<style lang="scss">
.ukeyrenew {
    .renewInfoTable {
        border: 1px solid #e8ecef;
        line-height: 50px;
        margin-top: 10px;
        font-size: 14px;
        color: #626262;
        .td-tit {
            text-align: center;
            width: 25%;
            border: 1px solid #e8ecef;
        }
        .td-cont {
            text-align: left;
            width: 75%;
            border: 1px solid #e8ecef;
            div {
                margin-left: 80px;
                color: #333333;
            }
        }
    }
    .updateTips {
        font-size: 14px;
        color: #d0021b;
        margin-top: 40px;
        span {
            color: #d0021b;
            margin-right: 10px;

            &:last-child {
                display: block;
            }
        }
    }
    .orderpage-cont {
        .warning {
            color: #d0021b;
            position: absolute;
            position: absolute;
            left: 115px;
            top: 61px;
            padding-left: 25px;
            background: url(../../../../static/image/warn1.svg) no-repeat left
                center;
        }
    }
}
.custom-dialog.el-dialog.el-dialog--small {
    border-radius: 10px;
    width: 550px;
    .el-dialog__header {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        padding: 0;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        background-color: #e8ecef;
        .el-dialog__title {
            font-size: 16px;
            font-weight: 500;
        }
        .el-dialog__headerbtn {
            margin-top: 0;
            /*padding: 12px 18px 20px;*/
            padding: 0;
        }
    }

    .dialog-content {
        padding-top: 30px;
        padding-bottom: 10px;
        // text-align: center;
        p {
            color: #475669;
            font-size: 14px;
            padding-bottom: 10px;
            padding: 20px 40px;
        }
        .ukey-err {
            text-align: left;
            font-size: 16px;
            line-height: 40px;
            margin: 0 40px;
            padding-bottom: 30px;
            border-bottom: 1px solid #e8ecef;
            .icon-ukey {
                display: inline-block;
                width: 40px;
                height: 40px;
                background: url(../../../../static/image/Ukey.svg) no-repeat;
                margin-right: 16px;
                vertical-align: middle;
            }
        }
        .pin-code-ipt {
            position: relative;
            height: 36px;
            line-height: 36px;
            text-align: left;
            padding: 0 60px;
            .pin {
                position: absolute;
                left: 160px;
                top: 0;
                width: 320px;
            }
        }
        .write-back-tit {
            padding-left: 40px;
            .tit-info {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
            }
        }
        .write-back-progress {
            padding: 30px 50px;
        }
        .renew-result-info {
            padding-left: 40px;
            .tit-info {
                font-size: 20px;
                font-weight: bold;
                padding: 10px 0;
            }
            .cont-info {
                padding-top: 10px;
                color: #626262;
            }
        }
        .notice {
            margin-top: 12px;
            text-align: left;
            padding-left: 40px;
            p {
                color: #999;
                padding: 0;
                line-height: 30px;
            }
        }
    }
    .dialog-align-left {
        p {
            padding: 20px 40px 20px 60px;
            text-align: left;
            span {
                display: inline-block;
                width: 94px;
                text-align: right;
                margin-right: 4px;
            }
        }
    }
    .dialog-footer {
        text-align: center;
    }
    .el-button {
        min-width: 80px;
    }
}
.custom-dialog3.el-dialog.el-dialog--small {
    width: 900px;
    // height: 610px;
    .el-dialog__header {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        padding: 0;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        background-color: #e8ecef;
        .el-dialog__title {
            font-size: 16px;
            color: #333;
            font-weight: 500;
        }
        .el-dialog__headerbtn {
            margin-top: 0;
            /*padding: 12px 18px 20px;*/
            padding: 0;
        }
    }
    .write-foot {
        padding: 12px 0;
        background: #01294b;
        text-align: center;
        color: #ffffff;
        font-size: 16px;
        >span{
        	display: inline-block;
        	width: 20px;
        	height: 20px;
        	background: #E02020;
        	color: #FFF;
        	border-radius: 8px;
        	text-align: center;
        	line-height: 20px;
        }
        b{
        	color: #5FB760;
        }
    }
}
</style>

