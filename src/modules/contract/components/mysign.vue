<template>
    <div class="mysign">
        <div class="top-title clearfix">
            <div class="titinfo">
                我的签名
                <span>当您签署合同时将使用此签名，请确保以上签名与您日常商务合同签名样式一致。</span>
            </div>
            <div class="titbtn">
                <el-button type="primary" @click="addcloudsign()">添加云签名</el-button>
                <!--如果当前用户没有实名认证，不允许申请UKey签名，按钮置灰不可用-->
                <el-button
                    type="primary"
                    @click="addukeysign('02')"
                    v-if="userType == '02'"
                >添加Ukey签名</el-button>
                <!--                <div class="disable-btn" @click="addukeysign('02')" v-if="userType == '02'">添加Ukey签名</div>-->
                <!--                <div class="disable-btn" @click="addukeysign('01')" v-if="userType == '01'">添加Ukey签名</div>-->
            </div>
        </div>
        <div class="signinfo">
            <div class="signinfo-tit">云签名</div>
            <div class="signinfo-list clearfix">
                <div class="signinfo-list-item" v-for="(item,index) in couldSignList" :key="index">
                    <div class="item-label">
                        <span>{{item.signatureName}}</span>
                    </div>
                    <div class="item-img">
                        <div
                            class="bgImg"
                            :style="'background-image: url(' + compToken(item.signatureFilePath) + ')'"
                        ></div>
                        <!--<img :src="item.signatureFilePath">-->
                    </div>
                    <div class="item-btn">
                        <span>{{item.signatureStatusDesc}}</span>
                        <span @click="del(item.bdcescEsealPictureId)">删除</span>
                    </div>
                </div>
            </div>
            <div class="nonedata" v-if="nodata1">
                <div class="imgbg"></div>
                <div class="txt">暂无云签名</div>
            </div>
        </div>
        <div class="signinfo" v-if="userType == '02'">
            <div class="signinfo-tit">Ukey签名</div>
            <div class="signinfo-list clearfix">
                <div class="signinfo-list-item" v-for="(item,index) in ukeySignList" :key="index">
                    <div class="item-label">
                        <span>{{item.signatureName}}</span>
                    </div>
                    <div class="item-img ukey">
                        <!--                        <img :src="item.signatureFilePath">-->
                        <div
                            class="bgImg"
                            :style="'background-image: url(' + compToken(item.signatureFilePath) + ')'"
                        ></div>
                        <div class="endtime" v-if="item.validEnd">到期时间：{{(item.validEnd && item.validEnd.substring(0,10))|| '无'}}</div>
                    </div>
                    <!-- esealStatus 印章状态  01 正常 02 过期 03 禁用 04 预挂失中 05 挂失中 06 注销 07 待激活 08 申请中 09 申请失败-->
                    <!--orderStatus 订单状态  01 草稿 02 待支付 03 待审核 04 审核不通过 05 订单取消 06 生产中 07 物流中 08 订单完成-->
                    <div class="item-btn" v-if="item.esealStatus">
                        <span :class="{'full':item.esealStatus != '07' || item.orderStatus!='07'}">{{item.esealStatusDesc}}</span>
                        <span
                            @click="$router.push({path:'/ukeyactivate', query:{orderNo: item.orderNo, sealType: '02'}})"
                            v-if="item.esealStatus == '07' && item.orderStatus=='07'"
                        >去激活</span>
                        <!--<span style="width:25%;" @click="gotoRenew()">续期</span>-->
                        <!--<span style="width:25%;" @click="setSignReport">挂失</span>-->
                    </div>
                    <div class="item-btn" v-else>
                        <span>{{item.esealStatusDesc || '申请中'}}</span>
                        <span
                            @click="$router.push({path:'/orderdetail', query:{orderNo:item.orderNo}})"
                        >查看订单</span>
                    </div>
                    <!--<div class="item-btn" v-if="item.signatureStatus == '02'"><span>{{item.signatureStatusDesc}}</span><span @click="gotoCancelReport">取消挂失</span></div>-->
                    <!--<div class="item-btn" v-if="item.signatureStatus == '03'"><span>{{item.signatureStatusDesc}}</span><span>续期</span></div>-->
                    <!--<div class="item-btn" v-if="item.signatureStatus == '03'"><span>{{item.signatureStatusDesc}}</span><span>更新证书</span></div>-->
                    <!--                    <div class="item-btn" v-if="item.esealStatus == '04'">-->
                    <!--                        <span>{{item.esealStatusDesc}}</span><span>查看订单</span>-->
                    <!--                    </div>-->
                    <!--                    <div class="item-btn" v-if="item.esealStatus == '05'">-->
                    <!--                        <span>{{item.esealStatusDesc}}</span><span>去激活</span></div>-->
                    <!--                    <div class="item-btn" v-if="item.esealStatus == '06'"><span>{{item.esealStatusDesc}}</span>-->
                    <!--                    </div>-->
                    <!--                    <div class="item-btn" v-if="item.esealStatus == '07'"><span>{{item.esealStatusDesc}}</span>-->
                    <!--                    </div>-->
                </div>
            </div>
            <div class="nonedata" v-if="nodata2">
                <div class="imgbg"></div>
                <div class="txt">暂无Ukey签名</div>
            </div>
        </div>

        <el-dialog title="印章挂失校验" :visible.sync="showFlag" class="signReportDialog">
            <div class="bodybox">
                <div class="item">
                    <span class="item-tit">签名名称</span>
                    <span class="item-cont">合同章</span>
                </div>
                <div class="item">
                    <span class="item-tit">签名编码</span>
                    <span class="item-cont">12365458</span>
                </div>
                <div class="item">
                    <span class="item-tit">手机号码</span>
                    <span class="item-cont">158****3233</span>
                    <span class="getCodeBtn">获取验证码</span>
                </div>
                <div class="item">
                    <span class="item-tit">短信验证码</span>
                    <span class="item-cont">
                        <el-input placeholder></el-input>
                    </span>
                </div>
            </div>
            <div class="footerbox">
                <el-button @click="showFlag = false">取 消</el-button>
                <el-button type="primary" @click="signReportSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import base from "../mixin/base";
export default {
    mixins: [base],
    components: {},
    data() {
        return {
            couldSignList: [],
            ukeySignList: [],
            nodata1: false,
            nodata2: false,
            showFlag: false,
            realNameFlag: JSON.parse($.cookie("userinfo"))
                .realNameAuthenticationFlag,
            userType: JSON.parse($.cookie("userinfo")).userType
        };
    },
    computed: {},
    watch: {},
    mounted() {
        this.getCouldSignData();
    },
    methods: {
        addcloudsign() {
            this.checkPermission(
                // 权限校验
                this.$perMap.sealMgt.mySign.addCloudSign.url,
                this.$perMap.sealMgt.mySign.addCloudSign.method
            ).then(res => {
                if (!this.successCheckCode(res)) {
                    return;
                }
                this.$router.push("/addcloudsign");
            });
        },
        addukeysign(val) {
            //01企业， 02个人
            this.checkPermission(
                // 权限校验
                this.$perMap.sealMgt.mySign.signOrderInit.url,
                this.$perMap.sealMgt.mySign.signOrderInit.method
            ).then(res => {
                if (!this.successCheckCode(res)) {
                    return;
                }
                if (val == "02") {
                    if (!this.realNameFlag == "1") {
                        this.$confirm(
                            "请您先去完成实名认证之后，才可以申请UKey签名",
                            "温馨提示",
                            {
                                type: "warning",
                                confirmButtonText: "去实名认证",
                                cancelButtonText: "取消",
                                customClass: "self-icon icon-safe",
                            }
                        ).then(() => {
                            this.$router.push({ path: "/personauthen" });
                        });
                    } else {
                        this.$router.push("/addukeysign");
                    }
                } else if (val == "01") {
                    this.$message.info("敬请期待");
                }
            });
        },
        getCouldSignData() {
            // 01：ukey印章，02：云签名，03：云印章，04：ukey签名
            let data = {
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                esealPictureTypeEnum: "02",
                currPage: 1,
                pageSize: 100
            };
            let data2 = {
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                esealPictureTypeEnum: "04",
                currPage: 1,
                pageSize: 100
            };
            let data3 = {
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                esealPictureTypeEnum: "06",
                currPage: 1,
                pageSize: 100
            };

            if (this.userType == "02") {
                /*this.getPersonSealSignList(data).then(res => {
                        if (this.successCheckCode(res) && res.data.records.length > 0) {
                            this.couldSignList = res.data.records;
                        } else {
                            this.nodata1 = true;
                        }
                    });
                    this.getPersonSealSignList(data2).then(res => {
                        if (this.successCheckCode(res) && res.data.records.length > 0) {
                            this.ukeySignList = res.data.records;
                        } else {
                            this.nodata2 = true;
                        }
                    })*/

                this.getPersonSealSignList(data3).then(res => {
                    if (
                        this.successCheckCode(res) &&
                        res.data.records.length > 0
                    ) {
                        let list = res.data.records;

                        this.couldSignList = list.filter(item => {
                            return item.signatureType == "02";
                        });

                        this.ukeySignList = list.filter(item => {
                            return item.signatureType == "01";
                        });

                        if (this.couldSignList.length <= 0) {
                            this.nodata1 = true;
                        }
                        if (this.ukeySignList.length <= 0) {
                            this.nodata2 = true;
                        }
                        this.$emit("upDateNum", {
                            totalSignNumBer: res.data.total
                        }); //刷新签名总数
                    } else {
                        this.nodata1 = true;
                        this.nodata2 = true;
                        //刷新签名总数
                        this.$emit("upDateNum", { totalSignNumBer: 0 }); //刷新签名总数
                    }
                });
            } else {
                /*this.getSealSignListByRole(data).then(res => {
                        if (this.successCheckCode(res) && res.data.records.length > 0) {
                            this.couldSignList = res.data.records;
                        } else {
                            this.nodata1 = true;
                        }
                    });
                    this.getSealSignListByRole(data2).then(res => {
                        if (this.successCheckCode(res) && res.data.records.length > 0) {
                            this.ukeySignList = res.data.records;
                        } else {
                            this.nodata2 = true;
                        }
                    })*/

                this.getSealSignListByRole(data3).then(res => {
                    if (
                        this.successCheckCode(res) &&
                        res.data.records.length > 0
                    ) {
                        let list = res.data.records;

                        this.couldSignList = list.filter(item => {
                            return item.signatureType == "02";
                        });

                        this.ukeySignList = list.filter(item => {
                            return item.signatureType == "04";
                        });

                        if (this.couldSignList.length <= 0) {
                            this.nodata1 = true;
                        }
                        if (this.ukeySignList.length <= 0) {
                            this.nodata2 = true;
                        }
                        this.$emit("upDateNum", {
                            //刷新签名总数
                            totalSignNumBer: res.data.total
                        });
                    } else {
                        this.nodata1 = true;
                        this.nodata2 = true;
                        this.$emit("upDateNum", { totalSignNumBer: 0 }); //刷新签名总数
                    }
                });
            }
        },
        del(id) {
            this.checkPermission(
                // 权限校验
                this.$perMap.sealMgt.mySign.deleteCouldSign.url,
                this.$perMap.sealMgt.mySign.deleteCouldSign.method
            ).then(res => {
                if (!this.successCheckCode(res)) {
                    return;
                }
                this.$confirm("您确认要删除当前签名吗？", "删除签名", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    customClass:"icon-delete self-icon",
                })
                    .then(() => {
                        this.deleteCouldSign(id).then(res => {
                            if (this.successCheckCode(res)) {
                                this.$message.success("删除成功！");
                                this.couldSignList = [];
                                this.ukeySignList = [];
                                this.getCouldSignData();
                            }
                            /*  else{
                              this.$message.error("删除失败！");
                          }*/
                        });
                    })
                    .catch(() => {});
            });
        },
        gotoRenew(orderno, sealid) {
            this.$router.push({
                path: "/ukeyrenew",
                query: { orderNo: orderno, sealId: sealid }
            });
        },
        gotoCancelReport() {
            this.$router.push("/cancelreport");
        },
        setSignReport() {
            this.showFlag = true;
        },
        signReportSubmit() {
            this.showFlag = false;
        },


        signPosition() {
            // isSignatoryField  -- 指定签署位置 0 不指定位置 1指定位置
            // isAuthentication -- 0 不需要认证  1 需要认证
            // isFirstSignatory  1 我需要签署  0 我不需要签署
            let self = this;
            var sealId = 0,
                signNumber = 0;
            // 如果是第一签署人  自己发起的合同&&自己需要签署
            if (this.isFirstSignatory == 1) {
                    //isKeySignature为 1 说明签署了ukey
                    this.compactFieldList.map(function (data, index) {
                        if (data.sealId) {
                            // 拖动章的数量  data.sealId为null  表示为制定位置章
                            sealId++;
                        }
                    });
                    // 如果没有拖动签章或者sealId数为0
                    if ((this.compactFieldList && this.compactFieldList.length == 0) || sealId == 0) {
                        this.$message({
                            message: "请您拖拽签名或印章到合同上",
                            type: "warning",
                            duration: 3000
                        });
                        return;
                    }

                    // 所有合同文件都需签署  compactDocumentList
                    let allCompactsignFlage;
                    // 合同签署文件集合
                    let compactDocumentList = this.compactDocumentList.filter(item => {
                        return item.compactDocumentType == '01'
                    })
                    // 每份签署合同都需要签署
                    compactDocumentList.some(item => {
                        allCompactsignFlage = false;
                        this.compactFieldList.some(file => {
                            if (file.compactFileCode == item.compactDocumentId) {
                                allCompactsignFlage = true;
                                return true
                            }
                        })
                        if (!allCompactsignFlage) {
                            return true
                        }
                    })
                    if (!allCompactsignFlage) {
                        return this.$message({
                            message: "请您为其他文件选择印章/签名进行签署",
                            type: "warning",
                            duration: 3000
                        });
                    }
            }
            // 如果需要标记签署位置
            if (this.isSignatoryField == 1) {
                this.compactFieldList.map(function (data, index) {
                    if (!data.sealId) {
                        signNumber++;  //拖动的标记位置的数量
                    }
                });
                // 签署人的数量
                var length = this.compactSignatoryList.length;

                /*if (this.isKeySignature == 1) {
                    //isKeySignature为1说明签署了ukey
                    // length--;
                }*/

                if (this.isFirstSignatory == 1) {
                    // 如果自己是签署人   无需标记   数量-1
                    length--;
                }
                // debugger
                //拖动的标记位置的数量与签署人的数量对比    （预定bug 拖动标记数  如果是同一个需签署人    无需++）
                if (signNumber < length) {
                    this.$message({
                        message: "您需要给所有签署人标记签署位置",
                        type: "warning",
                        duration: 3000
                    });
                    return;
                }
            }
            // 实名认证判断  需要判断时判断
            let realNameAuthenticationFlag = JSON.parse($.cookie("userinfo")).realNameAuthenticationFlag;
            if (this.isAuthentication == 0 && realNameAuthenticationFlag == "0" && this.isFirstSignatory == '1') {
                this.$confirm(
                    "为保证安全和减少法律风险，您需实名认证后再进行签署。",
                    "风险提示",
                    {
                        type: "warning",
                        confirmButtonText: "去实名认证",
                        cancelButtonText: "取消"
                    }
                )
                    .then(() => {
                        this.$router.push("/companyauthen");
                    })
                    .catch(() => {
                    });
            }

            // this.flag 最终签章位置校验结果  全局变量
            if (!self.flag && self.editType == "01") {
                return self.$message({
                    message: "签章/签名不在签署位置范围内",
                    type: "warning",
                    duration: 1000
                });
            }

            // 所有拖章位置+签署位置
            var list = JSON.parse(JSON.stringify(this.compactFieldList));
            // 对签章坐标进行重新计算
            list.map(res => {
                if (res.sealId) {
                    res.signatureCoordinateX =
                        (res.signatureCoordinateX * 778 + res.width / 2) / 778;
                    res.signatureCoordinateY =
                        (res.signatureCoordinateY * 1100 - res.height / 2) /
                        1100;
                }
            });

            let params = {
                compactFieldInfoList: list,
                compactId: this.compactId,
                compactSponsorId: JSON.parse($.cookie("userinfo")).userId, // 合同发起人Id
                isFirstSignatory: this.isFirstSignatory, // 发起人是否是第一签署人（否：0；是：1）
                // "token": $.cookie('token'),
                accountId: JSON.parse($.cookie("userinfo")).accountId,
                isKeySignature: this.isKeySignature,
                isSignatoryCloudSignature: this.isSignatoryCloudSignature,
                signPassword: '',
            };
            // console.log(JSON.stringify(params));

            //self.loadingTabel = true;
            // 发起人不需要签署
            if (this.isFirstSignatory == 0 && this.editType != '01') {
                this.signFromParams(params, 'first')
            } else {
                // ukey签章位置集合
                let ukeySignList = params.compactFieldInfoList.filter(item => {
                    return (item.signatureType == '01' || item.signatureType == '04')
                })
                // ukey签章参数
                let ukeySignParams = Object.assign({}, params);
                ukeySignParams.compactFieldInfoList = ukeySignList;
                // 标记是否进行过ukey签章，传给后台
                if (!!ukeySignList.length) {
                    this.isKeySignature = 1;
                    ukeySignParams.isKeySignature = 1;
                }
                // 云签章位置集合 包括指定位置
                let cloudSignList = params.compactFieldInfoList.filter(item => {
                    return (item.signatureType != '01' && item.signatureType != '04')
                })
                // 云签章参数
                let cloudSignParams = Object.assign({}, params);
                // 标记是否进行过云签章，传给后台
                if (!!cloudSignList.length) {
                    this.isSignatoryCloudSignature = 1;
                    cloudSignParams.isSignatoryCloudSignature = 1;
                }
                // 待我签署  和发起签署接口不同，  传如签章list  入参名不同
                if (this.editType == '01') {
                    cloudSignParams.compactFieldSignatureInfoList = cloudSignList;
                    cloudSignParams.compactFieldInfoList = null;
                } else {
                    cloudSignParams.compactFieldInfoList = cloudSignList;
                }
                // 记录云签章+签署位置参数 在全局
                this.signParams = cloudSignParams;

                // 如果有一个ukey签章  先进行ukey签章
                if (!!ukeySignList.length) {
                    this.signParams.isKeySignature = 1;
                    this.ukeySign(ukeySignParams);
                    return
                }

                //校验签署密码
                if (!this.isSignPassword) {
                    this.$confirm("为保障您的签署安全，请先去设置签署密码", "提示", {
                        confirmButtonText: "去设置",
                        cancelButtonText: "取消",
                        type: "warning",
                    }).then(() => {
                        this.$router.push({name: "accountmanager", query: {"safetyType": 2}})
                    }).catch(() => {
                    });
                    return
                } else {
                    this.signPswOpen = true;
                }
            }
        },
    }
};
</script>
<style lang="scss">
.mysign {
    .top-title {
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #e8ecef;
        margin-bottom: 25px;

        .titinfo {
            float: left;
            font-size: 18px;
            color: #333333;

            span {
                font-size: 12px;
                color: #999999;
                margin-left: 10px;
            }
        }

        .titbtn {
            float: right;

            .el-button {
                width: 120px;
                height: 36px;
            }
        }

        .disable-btn {
            width: 120px;
            height: 36px;
            background: #eee;
            display: inline-block;
            line-height: 1;
            white-space: nowrap;
            cursor: default;
            border: 1px solid #dcdcdc;
            color: #989898;
            margin: 0;
            padding: 10px 15px;
            border-radius: 4px;
            margin-left: 10px;
            text-align: center;
        }
    }

    .signinfo {
        .signinfo-tit {
            font-size: 16px;
            color: #333333;
            margin-bottom: 25px;
        }

        .signinfo-list {
            width: 956px;

            .signinfo-list-item {
                margin-right: 20px;
                margin-bottom: 30px;
                float: left;
                width: 219px;
                position: relative;

                .item-label {
                    text-align: center;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    margin-top: -10px;
                    z-index: 10;

                    span {
                        background: #ffffff;
                        border: 1px solid #e8ecef;
                        border-radius: 10px;
                        height: 20px;
                        line-height: 18px;
                        font-size: 12px;
                        color: #999999;
                        padding: 0 10px;
                        max-width: 110px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: block;
                        margin: 0 auto;
                    }
                }

                .item-img {
                    position: relative;
                    height: 120px;
                    padding: 20px;
                    background: #ffffff;
                    border: 1px solid #e8ecef;
                    border-radius: 4px 4px 0 0;
                    overflow: hidden;
                    text-align: center;
                    img {
                        height: 100%;
                    }

                    .bgImg {
                        width: 100%;
                        height: 100%;
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: 50%;
                    }

                    .endtime {
                        position: absolute;
                        left: 0;
                        bottom: 6px;
                        z-index: 9;
                        width: 100%;
                        text-align: center;
                        font-size: 12px;
                        color: #999999;
                    }
                    &.ukey {
                        padding-top: 14px;
                        padding-bottom: 26px;
                    }
                }

                .item-btn {
                    height: 40px;
                    line-height: 40px;
                    background: #fff;
                    /*border-top: 1px solid transparent;*/
                    border-right: 1px solid #e8ecef;
                    border-bottom: 1px solid #e8ecef;
                    border-left: 1px solid #e8ecef;
                    border-radius: 0 0 4px 4px;
                    padding: 7px 10px;
                    /*justify-content: space-between;*/
                    span {
                        float: right;
                        height: 24px;
                        line-height: 22px;
                        border-radius: 24px;
                        text-align: center;
                        font-size: 12px;
                        color: #02ADFF;
                        cursor: pointer;
                        min-width: 72px;
                        background-color: #fff;
                        border: 1px solid #02ADFF;
                        &:nth-child(1) {
                            line-height: 24px;
                            font-size: 14px;
                            min-width: 0;
                            width: auto;
                            color: #757575;
                            float: left;
                            background-color: #fff;
                            cursor: default;
                            border: none;
                        }
                        &.full{
                            width: 100%;
                        }
                    }
                }
            }
        }
    }

    .signReportDialog {
        .el-dialog {
            border-radius: 10px;
            width: 450px;

            .el-dialog__header {
                padding: 10px 20px;
                background: #e8ecef;
                border-radius: 10px 10px 0 0;

                .el-dialog__headerbtn {
                    margin-top: 2px;
                }
            }

            .el-dialog__body {
                .bodybox {
                    padding: 20px 50px;

                    .item {
                        line-height: 36px;
                        position: relative;

                        .item-tit {
                            font-size: 14px;
                            color: #626262;
                            margin-right: 24px;
                            text-align: right;
                            display: inline-block;
                            width: 70px;
                        }

                        .item-cont {
                            font-size: 14px;
                            color: #333333;
                            display: inline-block;

                            .el-input {
                                width: 250px;

                                .el-input__inner {
                                    background-color: #fff;
                                }
                            }
                        }

                        .getCodeBtn {
                            font-size: 14px;
                            color: #02adff;
                            border: 1px solid #02adff;
                            border-radius: 4px;
                            line-height: 34px;
                            display: inline-block;
                            padding: 0 15px;
                            position: absolute;
                            right: 0;
                            top: 0;
                            margin-right: 7px;
                            cursor: pointer;
                        }
                    }
                }
            }

            .footerbox {
                padding: 20px;
                text-align: center;

                .el-button {
                    width: 80px;
                }
            }
        }
    }
}
</style>
