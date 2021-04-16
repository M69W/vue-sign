<template>
    <div class="ukeyorder">
        <div class="top-title clearfix">
            <div class="titinfo" v-if="userType == '02'">UKEY签名订单</div>
            <div class="titinfo" v-if="userType == '01'">UKEY印章订单</div>
            <div class="audit-status" v-if="orderInfo.orderBasicInfo">
                <img
                    v-if="orderInfo.orderBasicInfo.orderStatus == '02'"
                    src="../../../../static/image/icon-waitpay.svg"
                >
                <img
                    v-if="orderInfo.orderBasicInfo.orderStatus == '03'"
                    src="../../../../static/image/icon-audit.svg"
                >
                <img
                    v-if="orderInfo.orderBasicInfo.orderStatus == '04'"
                    src="../../../../static/image/icon-nopass.svg"
                >
                <img
                    v-if="orderInfo.orderBasicInfo.orderStatus == '05'"
                    src="../../../../static/image/icon-invalid.svg"
                >
                <img
                    v-if="orderInfo.orderBasicInfo.orderStatus == '06'"
                    src="../../../../static/image/icon-production.svg"
                >
                <img
                    v-if="['07','10'].includes(orderInfo.orderBasicInfo.orderStatus)"
                    src="../../../../static/image/icon-logistics.svg"
                >
                <img
                    v-if="orderInfo.orderBasicInfo.orderStatus == '08'"
                    src="../../../../static/image/icon-complete.svg"
                >
            </div>
        </div>
        <div class="orderdetail">
            <div class="item">
                <div class="item-tit">
                    <i></i>订单号
                    <span>{{orderInfo.orderBasicInfo.orderNo}}</span>
                </div>
                <order-status-nav ref="orderStatus" :status="orderInfo.orderBasicInfo.orderStatus" :orderInfo="orderInfo.orderBasicInfo"></order-status-nav>
            </div>
            <div class="item" v-if="userType == '02'">
                <div class="item-tit">
                    <i></i>个人信息
                </div>
                <div class="item-cont">
                    <div class="cont-item">
                        <span class="cont-item-tit">姓名</span>
                        <span class="cont-item-txt">{{orderInfo.pobOrderPersonalRespVO.personName}}</span>
                    </div>
                    <div class="cont-item">
                        <span class="cont-item-tit">身份证号码</span>
                        <span
                            class="cont-item-txt"
                        >{{orderInfo.pobOrderPersonalRespVO.personCertificateNumber}}</span>
                    </div>
                </div>
            </div>
            <div class="item" v-if="userType == '01'">
                <div class="item-tit">
                    <i></i>企业信息
                </div>
                <div class="item-cont">
                    <el-row>
                        <el-col :span="9">
                            <div class="cont-item">
                                <span class="cont-item-tit">企业名称</span>
                                <span
                                    class="cont-item-txt"
                                >{{orderInfo.enterpriseInfo.enterpriseName}}</span>
                            </div>
                        </el-col>
                        <el-col :span="9">
                            <div class="cont-item">
                                <span class="cont-item-tit" style="width: 120px;">统一社会信用代码</span>
                                <span
                                    class="cont-item-txt"
                                >{{orderInfo.enterpriseInfo.uniformCreditCode}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="9">
                            <div class="cont-item">
                                <span class="cont-item-tit">法人姓名</span>
                                <span
                                    class="cont-item-txt"
                                >{{orderInfo.enterpriseInfo.legalPersonName}}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="cont-item">
                                <span class="cont-item-tit" style="width: 120px;">证件类型</span>
                                <span
                                    class="cont-item-txt"
                                >{{orderInfo.enterpriseInfo.legalPersonCertificateTypeDesc}}</span>
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div class="cont-item" style="text-align: right;">
                                <span class="cont-item-tit">证件号码</span>
                                <span
                                    class="cont-item-txt"
                                >{{orderInfo.enterpriseInfo.legalPersonCertificateNumber}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="item">
                <div class="item-tit" v-if="userType == '02'">
                    <i></i>签名信息
                </div>
                <div class="item-tit" v-if="userType == '01'">
                    <i></i>印章信息
                </div>
                <div class="item-cont" v-if="userType == '02'">
                    <el-table :data="esealList" style="width: 100%; margin-top:10px;">
                        <el-table-column :resizable="false" label="签名样式">
                            <template slot-scope="scope">
                                <img :src="compToken(scope.row.picturePath)" class="tableimg">
                            </template>
                        </el-table-column>
                        <el-table-column :resizable="false" prop="pictureName" label="名称"></el-table-column>
                        <el-table-column :resizable="false" prop="pictureCode" label="签名编码"></el-table-column>
                        <el-table-column :resizable="false" label="有效期" width="300">
                            <template slot-scope="scope">
                                <span
                                    v-if="scope.row.esealBizValidStart||scope.row.esealBizValidEnd"
                                >{{scope.row.esealBizValidStart}} 至 {{scope.row.esealBizValidEnd}}</span>
                                <span v-else>无</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="item-cont" v-if="userType == '01'">
                    <el-table :data="esealList" style="width: 100%; margin-top:10px;">
                        <el-table-column :resizable="false" label="印章样式">
                            <template slot-scope="scope">
                                <img :src="compToken(scope.row.picturePath)" class="tableimg">
                            </template>
                        </el-table-column>
                        <el-table-column :resizable="false" prop="pictureName" label="印章名称"></el-table-column>
                        <el-table-column :resizable="false" prop="esealTypeDesc" label="印章类型"></el-table-column>
                        <el-table-column :resizable="false" prop="pictureCode" label="印章编码"></el-table-column>
                        <el-table-column :resizable="false" prop="pictureOriginDesc" label="印章来源"></el-table-column>
                        <el-table-column :resizable="false" label="来源标识">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.pictureFlag? scope.row.pictureFlag == '-1' ? '无' : scope.row.pictureFlag:'无'}}
<!--                                    {{scope.row.pictureFlag == '-1' ? '无' : scope.row.pictureFlag}}-->
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="item" v-if="orderInfo.orderAcceptInfo.deliveryAddress">
                <div class="item-tit">
                    <i></i>收货信息
                </div>
                <div class="item-cont">
                    <div class="cont-item">
                        <span class="cont-item-tit">
                            <img src="../../../../static/image/icon-address.png">寄送至
                        </span>
                        <span class="cont-item-txt">
                            <span>{{orderInfo.orderAcceptInfo.deliveryAddress}}</span>
                            <span style="margin-left:40px;">
                                {{orderInfo.orderAcceptInfo.agentName}}
                                <span
                                    v-if="orderInfo.orderAcceptInfo.agentName"
                                >（收)</span>
                            </span>
                            <span
                                style="margin-left:40px;"
                            >{{userType=='01'?orderInfo.orderAcceptInfo.agentContactNumber:orderInfo.orderAcceptInfo.deliveryPhone}}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div
                class="item"
                v-if="orderInfo.orderAcceptInfo.deliveryWay == '01' &&　['07','08'].includes(orderInfo.orderBasicInfo.orderStatus)"
            >
                <div class="item-tit">
                    <i></i>物流信息
                </div>
                <div class="item-cont">
                    <div class="cont-item">
                        <span class="cont-item-tit">物流单号</span>
                        <span
                            class="cont-item-txt"
                        >{{orderInfo.orderAcceptInfo.logisticsCompanyNo||'无'}}</span>
                    </div>
                    <div class="cont-item">
                        <span class="cont-item-tit">物流公司</span>
                        <span
                            class="cont-item-txt"
                            v-if="userType == '02'"
                        >{{orderInfo.orderAcceptInfo.logisticsCompanyName||'无'}}</span>
                        <span class="cont-item-txt" v-else>{{orderInfo.orderAcceptInfo.lcName||'无'}}</span>
                    </div>
                    <!--<div class="cont-item">
                        <span class="cont-item-tit">发货时间</span>
                        <span class="cont-item-txt"></span>
                    </div>-->
                </div>
            </div>
            <div class="item">
                <div class="item-tit">
                    <i></i>开票信息
                </div>
                <div class="item-cont" v-if="orderInfo.buyerName">
                    <div class="cont-item">
                        <span class="cont-item-tit">发票抬头</span>
                        <span class="cont-item-txt">{{orderInfo.buyerName || '无'}}</span>
                    </div>
                    <div class="cont-item" v-if="!!orderInfo.buyerTaxerNo">
                        <span class="cont-item-tit">税号</span>
                        <span class="cont-item-txt">{{orderInfo.buyerTaxerNo || '无'}}</span>
                    </div>
                </div>
                <div class="item-cont" v-else>
                    <div class="cont-item">
                        <span class="cont-item-tit">无需发票</span>
                    </div>
                </div>
            </div>
            <div
                class="item"
                v-if="userType == '02' && orderInfo.orderBasicInfo.orderStatus !=='05' "
            >
                <div class="item-tit">
                    <i></i>证件信息
                </div>
                <div class="item-cont" v-if="orderInfo.certificateList">
                    <div class="cert-uploader clearfix">
                        <div
                            class="cert-uploader-item"
                            v-for="(item,index) in orderInfo.certificateList"
                            :key="index"
                        >
                            <div class="cert-item-name">{{item.certificateName}}</div>
                            <div class="imginfo">
                                <div class="img-example" @click="showbigpic(item.certificatePath)">
                                    <i class="img-example-icon"></i>
                                </div>
                                <div class="img-cont">
                                    <img :src="compToken(item.certificatePath)">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="item"
                v-if="userType == '01' && orderInfo.orderBasicInfo.orderStatus !=='05'"
            >
                <div class="item-tit">
                    <i></i>证件信息
                </div>
                <div class="item-cont">
                    <div class="cert-uploader clearfix">
                        <div
                            class="cert-uploader-item"
                            v-for="(item,index) in orderInfo.certificateList"
                            :key="index"
                        >
                            <div class="cert-item-name">{{item.certificateName}}</div>
                            <div class="imginfo">
                                <div class="img-example" @click="showbigpic(item.certificatePath)">
                                    <i class="img-example-icon"></i>
                                </div>
                                <div class="img-cont">
                                    <img :src="compToken(item.certificatePath)">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footbtn">
            <el-button @click="cancel" type="primary">返回</el-button>
        </div>

        <el-dialog :visible.sync="dialogModel" class="sealmodel">
            <img :src="compToken(bigImg)" style="width:100%;">
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import base from "../mixin/base";
import orderStatusNav from "./orderStatusNav";
export default {
    mixins: [base],
    components: {orderStatusNav},
    data() {
        return {
            dialogModel: false,
            bigImg: "",
            checkImgFlag: false,
            userType: JSON.parse($.cookie("userinfo")).userType,
            orderNum: "",
            esealList: [],
            orderInfo: {
                certificateList: [],
                enterpriseInfo: {
                    enterpriseName: "",
                    legalPersonCertificateNumber: "",
                    legalPersonCertificateType: "",
                    legalPersonCertificateTypeDesc: "",
                    legalPersonName: "",
                    uniformCreditCode: ""
                },
                orderAcceptInfo: {
                    agentCertificateNumber: "",
                    agentCertificateType: "",
                    agentCertificateTypeDesc: "",
                    agentContactNumber: "",
                    agentName: "",
                    deliveryAddress: "",
                    deliveryWay: "",
                    deliveryWayDesc: "",
                    lcName: "",
                    logisticsCompanyId: "",
                    logisticsCompanyNo: ""
                },
                orderBasicInfo: {
                    auditTime: "",
                    belongOrganization: "",
                    createUser: "",
                    createUserId: "",
                    finishTime: "",
                    linkman: "",
                    orderApplyTime: "",
                    orderCreateTime: "",
                    orderId: "",
                    orderNo: "",
                    orderStatus: "",
                    orderStatusDesc: "",
                    orderType: "",
                    orderTypeDesc: "",
                    remark: ""
                },
                pobOrderPersonalRespVO: {
                    personName: "",
                    personCertificateNumber: "",
                    personCertificateType: "",
                    personCertificateTypeDesc: ""
                }
            }
        };
    },
    computed: {},
    watch: {},
    mounted() {
        this.orderNum = this.$route.query.orderNo;
        this.getDetailData();
    },
    methods: {
        getDetailData() {
            if (this.userType == "01") {
                this.orderDetailEnterprise(this.orderNum)
                    .then(res => {
                        if (this.successCheckCode(res)) {
                            this.orderInfo = res.data;
                            this.esealList = res.data.esealList;
                            this.$nextTick(()=>{
                                this.$refs.orderStatus.getOrderTime();
                            })
                            for (var i = 0; i < this.esealList.length; i++) {
                                if (this.esealList[i].pictureCode == null) {
                                    this.esealList.splice(i, 1);
                                }
                            }
                        }
                    })
                    .fail(res => {
                        this.$message.error(res.msg);
                    });
            } else if (this.userType == "02") {
                this.orderDetailPersonal(this.orderNum)
                    .then(res => {
                        if (this.successCheckCode(res)) {
                            this.orderInfo = res.data;
                            this.esealList = res.data.ukeySignList;
                            this.$nextTick(()=>{
                                this.$refs.orderStatus.getOrderTime();
                            })
                        }
                    })
                    .fail(res => {
                        this.$message.error(res.msg);
                    });
            }
        },
        showbigpic(bigImg) {
            this.dialogModel = true;
            this.bigImg = bigImg;
        },
        handleClose() {
            this.dialogModel = false;
        },
        cancel() {
            this.$router.go(-1);
        }
    }
};
</script>
<style lang="scss">
.ukeyorder {
    .top-title {
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #e8ecef;
        margin-bottom: 25px;
        position: relative;
        .titinfo {
            float: left;
            font-size: 18px;
            color: #333333;
        }
        .audit-status {
            position: absolute;
            right: 0;
            bottom: 0;
            margin-bottom: -65px;
        }
    }
    .orderdetail {
        .item {
            padding: 20px 0 10px 0;
            .item-tit {
                font-size: 16px;
                color: #0073bd;
                margin-bottom: 12px;
                i {
                    display: inline-block;
                    width: 3px;
                    height: 16px;
                    background: #0073bd;
                    vertical-align: -3px;
                    margin-right: 5px;
                }
                span {
                    font-size: 14px;
                    color: #333333;
                    margin-left: 46px;
                }
            }
            .item-cont {
                .cont-item {
                    padding-left: 8px;
                    line-height: 36px;
                    .cont-item-tit {
                        font-size: 14px;
                        color: #626262;
                        display: inline-block;
                        width: 70px;
                        margin-right: 15px;
                    }
                    .cont-item-txt {
                        font-size: 14px;
                        color: #333333;
                    }
                }
                .tableimg {
                    height: 40px;
                }
                .cert-uploader {
                    .cert-uploader-item {
                        float: left;
                        margin-right: 20px;
                        margin-bottom: 20px;
                        .cert-item-name {
                            font-size: 14px;
                            color: #3f3f3f;
                            margin-bottom: 10px;
                            padding-left: 10px;
                            span {
                                font-size: 12px;
                                color: #888;
                            }
                        }
                        .imginfo {
                            border: 1px solid #e8ecef;
                            width: 220px;
                            height: 140px;
                            padding: 17px 25px;
                            border-radius: 4px 4px 0 0;
                            overflow: hidden;
                            position: relative;
                            text-align: center;
                            img {
                            }
                            .checkfile-btn {
                                font-size: 28px;
                                color: #8c939d;
                                width: 220px;
                                height: 140px;
                                line-height: 140px;
                                text-align: center;
                            }
                            .img-example {
                                position: absolute;
                                left: 25px;
                                top: 17px;
                                width: 168px;
                                height: 104px;
                                opacity: 0.4;
                                background: #333333;
                                border-radius: 6px;
                                cursor: pointer;
                                display: none;
                                .img-example-txt {
                                    font-size: 12px;
                                    color: #ffffff;
                                    text-align: center;
                                    line-height: 144px;
                                }
                                .img-example-icon {
                                    width: 16px;
                                    height: 16px;
                                    position: absolute;
                                    text-align: right;
                                    top: 50%;
                                    left: 50%;
                                    margin-top: -8px;
                                    margin-left: -8px;
                                    background: url(../../../../static/image/icon-enlargement.png)
                                        no-repeat;
                                    background-size: 16px 16px;
                                    background-position: 0 0;
                                }
                            }
                            .img-cont {
                                background-color: #adadad;
                                width: 100%;
                                height: 100%;
                                border-radius: 5px;
                                img {
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 5px;
                                    object-fit: cover;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .footbtn {
        text-align: right;
        padding: 40px 0;
        .el-button {
            width: 100px;
        }
    }
    .el-dialog__body {
        text-align: center;
    }
}
</style>
<style>
.orderdetail .cert-uploader-item .imginfo:hover .img-example {
    display: block !important;
}
</style>
