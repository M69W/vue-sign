<template>
    <div class="orderconfirm">
        <div class="orderpage-topbar clearfix">
            <div class="orderpage-tit" v-if="typeVal == '01'">Ukey签名申请</div>
            <div class="orderpage-tit" v-if="typeVal == '02'">Ukey印章申请</div>
            <div class="orderpage-progress">
                <img src="../../../../static/image/ukeyorder1.png" v-if="typeVal == '01'" />
                <img src="/static/image/icon/step3.svg" v-if="typeVal == '02'"/>
            </div>
        </div>
        <div class="orderpage-cont">
            <el-row>
                <el-col :span="8">
                    <div class="orderpage-item-name orderpage-item-font1">
                        订单号
                    </div>
                    <div class="orderpage-item-cont">{{ orderNo }}</div>
                </el-col>
            </el-row>
            <div class="orderpage-item-tit" v-if="typeVal == '01'">
                个人信息
            </div>
            <el-row v-if="typeVal == '01'">
                <el-col :span="24">
                    <div class="orderpage-item-name orderpage-item-font2">
                        姓名
                    </div>
                    <div class="orderpage-item-cont">{{ personalName }}</div>
                </el-col>
                <el-col :span="24">
                    <div class="orderpage-item-name orderpage-item-font2">
                        身份证号码
                    </div>
                    <div class="orderpage-item-cont">{{ certNum }}</div>
                </el-col>
            </el-row>
            <div class="orderpage-item-tit" v-if="typeVal == '02'">收货人</div>
            <el-row v-if="typeVal == '02'">
                <el-col :span="24">
                    <div class="orderpage-item-name orderpage-item-font2">
                        姓名
                    </div>
                    <div class="orderpage-item-cont">{{ name }}</div>
                </el-col>
                <el-col :span="24">
                    <el-col :span="8">
                        <div class="orderpage-item-name orderpage-item-font2">
                            电话号码
                        </div>
                        <div class="orderpage-item-cont">{{ phoneNum }}</div>
                    </el-col>
                </el-col>
            </el-row>

            <div class="orderpage-item-tit">
                收货信息
                <!--<span @click="editinfo()" class="editbtn">修改</span>-->
            </div>
            <el-row>
                <el-col :span="24">
                    <div class="orderpage-item-name orderpage-item-font3">
                        <img
                            src="/static/image/icon/address.svg"
                        />&nbsp;寄送至
                    </div>
                    <div class="orderpage-item-cont">
                        <span style="margin-right:30px;">{{ address }}</span>
                        <span style="margin-right:30px;" v-if="typeVal != '02'">{{ name }}<span v-if="name">（收)</span></span>
                        <span v-if="typeVal != '02'">{{ phoneNum }}</span>
                    </div>
                </el-col>
            </el-row>
            <div class="orderpage-item-tit">
                印章期限
            </div>
            <el-row>
                <el-col :span="24">
                    <div
                        class="renew-time-item"
                        v-for="item in priceList"
                        :class="{ active: item.esealYear == yearNum, year: item.esealYear == 5 }"
                        @click="changeYear(item.esealYear)"
                        :key="item.esealYear"
                    >
                        <div class="time-item">
                            <i class="time-icon"></i>
                            {{ item.esealYear }}年
                        </div>
                        <p :class="{cheap: item.esealYear == 5}">特惠价：{{ item.esealPrice }}元</p>
                        <!-- <p>
                            有效期限：{{
                                confirmInfoData.sealList &&
                                    confirmInfoData.sealList[0]
                                        .sealValidDateStart
                            }}
                            至
                            {{ compDateEnd(item.esealYear) }}
                        </p> -->
                        <p style="text-decoration: line-through;">原价：{{item.esealYear | priceFilter}}元</p>
                    </div>
                </el-col>
            </el-row>
            <div class="orderpage-item-tit" v-if="typeVal == '01'">
                签名信息
            </div>
            <div class="orderpage-item-tit" v-if="typeVal == '02'">
                印章信息
            </div>
            <el-table
                :data="confirmInfoData.sealList"
                style="width: 100%; margin-top:10px;"
                v-if="typeVal == '01'"
            >
                <el-table-column
                    :resizable="false"
                    prop="signImg"
                    label="签名样式"
                    width="180"
                >
                    <template slot-scope="scope">
                        <img
                            :src="compToken(scope.row.sealUrl)"
                            class="tableimg"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    :resizable="false"
                    prop="sealName"
                    label="名称"
                ></el-table-column>
                <el-table-column
                    :resizable="false"
                    prop="pictureCode"
                    label="签名编码"
                ></el-table-column>
                <el-table-column :resizable="false" label="有效期" width="280">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.sealValidDateStart }} 至
                            {{ scope.row.sealValidDateEnd }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :resizable="false" label="价格" width="150">
                    <template slot-scope="scope">
                        <div>{{ scope.row.sealPrice }}元</div>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                :data="confirmInfoData.sealList"
                style="width: 100%; margin-top:10px;"
                v-if="typeVal == '02'"
            >
                <el-table-column
                    :resizable="false"
                    prop="sealUrl"
                    label="印章样式"
                    width="120"
                >
                    <template slot-scope="scope">
                        <img
                            :src="compToken(scope.row.sealUrl)"
                            class="tableimg"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    :resizable="false"
                    prop="sealName"
                    label="印章名称"
                    width="160"
                ></el-table-column>
                <el-table-column
                    :resizable="false"
                    prop="sealTypeDesc"
                    label="印章类型"
                ></el-table-column>
                <el-table-column
                    :resizable="false"
                    prop="pictureCode"
                    label="印章编码"
                    width="200"
                ></el-table-column>
                <el-table-column :resizable="false" label="有效期" width="280">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.sealValidDateStart }} 至
                            {{ scope.row.sealValidDateEnd }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :resizable="false" label="价格" width="150">
                    <template slot-scope="scope">
                        <div>{{ scope.row.sealPrice }}元</div>
                    </template>
                </el-table-column>
                <!--<el-table-column :resizable="false" label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="sealDelete(scope.row.sealId)">删除</el-button>
                    </template>
                </el-table-column>-->
            </el-table>
        </div>
        <div class="orderpage-footbtn">
            <el-button @click="back()">返回</el-button>
            <el-button
                type="primary"
                @click="saveForm()"
                :loading="nextbtnLoding"
                >提交</el-button
            >
        </div>

        <!--<div class="eidt-consignee-dialog">
            <el-dialog title="修改收货人信息" :visible.sync="dialogFormVisible">
                <el-form :model="confirmInfoData" label-width="100px" ref="formTab" :rules="rules">
                    <el-form-item label="收件人" prop="consigneeName">
                        <el-input type="text" v-model="confirmInfoData.consigneeName" placeholder="" :maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="收件人电话" prop="consigneeTel">
                        <el-input type="text" v-model="confirmInfoData.consigneeTel" placeholder="" :maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="省份" prop="province">
                        <el-input type="text" v-model="confirmInfoData.province" placeholder="" :maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="城市/地区" prop="cityarea">
                        <el-input type="text" v-model="confirmInfoData.cityarea" placeholder="" :maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="detailAddr">
                        <el-input type="textarea" :rows="3" v-model="confirmInfoData.detailAddr" placeholder="" :maxlength="130"></el-input>
                    </el-form-item>
                    <el-form-item label="邮政编码" prop="postcode">
                        <el-input type="text" v-model="confirmInfoData.postcode" placeholder="" :maxlength="30"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel_Form('formTab')">取消</el-button>
                    <el-button type="primary" @click="submit_Form('formTab')">确定</el-button>
                </div>
            </el-dialog>
        </div>-->
    </div>
</template>
<script>
import base from "../mixin/base";
export default {
    mixins: [base],
    components: {},
    data() {
        return {
            confirmInfoData: {},
            rules: {},
            orderInfo: {},
            dialogFormVisible: false,
            typeVal: "",
            orderNo: "",
            nextbtnLoding: false,
            address: "",
            name: "",
            phoneNum: "",
            edittype: "",
            personalName: "",
            certNum: "",
            yearNum: 2,
            zone: "",
            priceList: []
        };
    },
    computed: {
        compDateEnd(year) {
            if (!this.confirmInfoData.sealList) {
                return;
            }
            return function(year) {
                let result = /^(.*?)-(.*?)$/.exec(
                    this.confirmInfoData.sealList[0].sealValidDateStart
                );
                return `${+result[1] + +year}-${result[2]}`;
            };
        }
    },
    filters: {
        priceFilter(year) {
            let price = '';
            switch (year) {
                case 5:
                    price = 1580;
                    break;
                case 3:
                    price = 980;
                    break;
                case 2:
                    price = 680;
                    break;
                case 1:
                    price = 300;
                    break;
                default:
                    price = 0
                    break;
            }
            return price;
        }
    },
    created() {
        this.orderNo = this.$route.query.orderNo;
        this.edittype = this.$route.query.edittype;
        if (this.$route.path == "/orderconfirm") {
            this.typeVal = "01";
            // this.getOrderConfirmData();
            this.getOrderDetailPersonal();
        } else if (this.$route.path == "/sealorderconfirm") {
            this.typeVal = "02";
            // this.getOrderConfirmData();
            this.getOrderDetail();
        }
    },
    methods: {
        getOrderConfirmData() {
            this.getOrderConfirm(this.orderNo, this.pageNum, 100).then(res => {
                if (this.successCheckCode(res)) {
                    this.confirmInfoData = res.data;
                    this.yearNum = res.data.sealList[0].esealYear;
                }
            });
        },
        submit_Form() {},
        cancel_Form() {
            this.dialogFormVisible = false;
        },
        back() {
            //个人
            if (this.typeVal == "01") {
                this.$router.push({
                    path: "/addukeysign",
                    query: { orderNo: this.orderNo }
                });
            } else {
                this.$router.go(-1);
            }
        },
        /*next() {
                this.$router.push({path:'/sealorderpay', query:{orderNo: this.orderNo}});
            },*/
        editinfo() {
            this.dialogFormVisible = true;
        },
        getOrderDetail() {
            this.orderDetailEnterprise(this.orderNo)
                .then(res => {
                    if (this.successCheckCode(res)) {
                        this.orderInfo = res.data;
                        this.address = res.data.orderAcceptInfo.deliveryAddress;
                        this.name = res.data.orderAcceptInfo.agentName;
                        this.phoneNum =
                            res.data.orderAcceptInfo.agentContactNumber;
                        this.getUkeyPrice({
                            creditCode: this.orderInfo.enterpriseInfo
                                .uniformCreditCode
                        }).then(res => {
                            if (this.successCheckCode(res)) {
                                this.priceList = res.data.priceList;
                                this.priceList.sort(function(a, b) {
                                    return b.esealYear - a.esealYear;
                                })
                            }
                        });
                        this.changeYear(5);
                    }
                })
                .fail(res => {
                    this.$message.error(res.msg);
                });
        },
        getOrderDetailPersonal() {
            this.orderDetailPersonal(this.orderNo)
                .then(res => {
                    if (this.successCheckCode(res)) {
                        this.orderInfo = res.data;
                        this.address = res.data.orderAcceptInfo.deliveryAddress;
                        this.name = res.data.orderAcceptInfo.agentName;
                        this.personalName =
                            res.data.pobOrderPersonalRespVO && res.data.pobOrderPersonalRespVO.personName;
                        this.certNum =
                            res.data.pobOrderPersonalRespVO && res.data.pobOrderPersonalRespVO.personCertificateNumber;
                        this.phoneNum = res.data.orderAcceptInfo.deliveryPhone;
                        this.getUkeyPrice().then(res => {
                            if (this.successCheckCode(res)) {
                                this.priceList = res.data.priceList;
                            }
                        });
                        this.changeYear(5);
                    }
                })
                .fail(res => {
                    this.$message.error(res.msg);
                });
        },
        //保存提交数据
        saveForm() {
            //个人
            if (this.typeVal == "01") {
                this.savePersonOrder();
            } else if (this.typeVal == "02") {
                //企业
                this.saveEnterpriseForm();
            }
        },
        saveEnterpriseForm() {
            var self = this;
            /*this.orderInfo.certificateList.certificateId = ""
                for(var i = 0; i < this.orderInfo.certificateList.length; i++) {
                    this.orderInfo.certificateList[i].certificateId = '0' + i + 1;
                }*/

            let data = {
                detailAddress: this.orderInfo.orderAcceptInfo.deliveryAddress,
                orderNo: this.orderNo,
                recipient: this.orderInfo.orderAcceptInfo.agentName,
                recipientCertificateNumber: this.orderInfo.orderAcceptInfo
                    .agentCertificateNumber,
                recipientCertificateType: this.orderInfo.orderAcceptInfo
                    .agentCertificateType,
                recipientPhone: this.orderInfo.orderAcceptInfo
                    .agentContactNumber,
                province: "",
                city: "",
                certificateList: this.orderInfo.certificateList,
                enterpriseName: this.orderInfo.enterpriseInfo.enterpriseName,
                uniformCreditCode: this.orderInfo.enterpriseInfo
                    .uniformCreditCode,
                clientType: "01", // 终端类型：01.web端 02.微信小程序
                dutyParagraph: "", // 税号
                invoiceEnterpriseName: "",
                invoiceType: "",
                invoicesRaised: "",
                esealYear: this.yearNum
            };
            this.nextbtnLoding = true;
            this.submitOrder(data).then(res => {
                if (this.successCheckCode(res)) {
                    if (self.edittype && self.edittype == "04") {
                        self.setOrderStatus();
                    } else {
                        setTimeout(function() {
                            self.$router.push({
                                path: "/sealorderpay",
                                query: {
                                    orderNo: self.orderNo,
                                    edittype: this.edittype
                                }
                            });
                            self.nextbtnLoding = false;
                        }, 1000);
                    }
                } else {
                    this.$message.error(res.msg);
                    setTimeout(function() {
                        self.nextbtnLoding = false;
                    }, 1000);
                }
            });
        },
        //个人ukey申请
        savePersonOrder() {
            let self = this;
            let data = {
                certificateList: this.orderInfo.certificateList,
                agentName: this.orderInfo.orderAcceptInfo.agentName,
                agentCertificateNumber: this.orderInfo.orderAcceptInfo
                    .agentCertificateNumber,
                agentCertificateType: this.orderInfo.orderAcceptInfo
                    .agentCertificateType,
                agentContactNumber: this.orderInfo.orderAcceptInfo
                    .agentContactNumber,
                deliveryWay: this.orderInfo.orderAcceptInfo.deliveryWay,
                detailAddress: this.orderInfo.orderAcceptInfo.deliveryAddress,
                orderNo: this.orderInfo.orderBasicInfo.orderNo,
                orderType: this.orderInfo.orderBasicInfo.orderType,
                personCertificateNumber: this.orderInfo.orderAcceptInfo
                    .agentCertificateNumber,
                personCertificateType: this.orderInfo.orderAcceptInfo
                    .agentCertificateType,
                personName: this.orderInfo.orderAcceptInfo.agentName,
                province: "",
                city: ""
            };

            this.submitPersonOrder(data)
                .then(res => {
                    if (this.successCheckCode(res)) {
                        if (self.edittype && self.edittype == "04") {
                            self.setOrderStatus();
                        } else {
                            setTimeout(function() {
                                self.$router.push({
                                    path: "/orderpay",
                                    query: { orderNo: self.orderNo }
                                });
                                self.nextbtnLoding = false;
                            }, 1000);
                        }
                    } else {
                        this.$message.error(res.msg);
                        setTimeout(function() {
                            self.nextbtnLoding = false;
                        }, 1000);
                    }
                })
                .fail(err => {
                    this.nextbtnLoding = false;
                });
        },
        setOrderStatus() {
            var self = this;
            var data = {
                operatorType: "02",
                orderNo: this.orderNo,
                orderStatus: "03",
                remark: "支付服务通知支付结果"
            };
            this.uptOrderStatus(data).then(res => {
                if (this.successCheckCode(res)) {
                    self.$message.success("提交成功！");
                    setTimeout(function() {
                        self.$router.push({ path: "/ukeyorder" });
                    }, 1000);
                }
            });
        },
        changeYear(val) {
            if (this.$route.path == "/orderconfirm" || val == this.yearNum) {
                return false;
            }
            this.yearNum = val;
            this.saveDraftOrder({
                certificateList: this.orderInfo.certificateList,
                orderNo: this.orderNo,
                esealYear: this.yearNum,
                zone: this.zone
            }).then(res => {
                if (this.successCheckCode(res)) {
                    // this.getOrderDetail();
                    this.getOrderConfirmData();
                }
            });
        }
    }
};
</script>
<style lang="scss">
.orderpage-topbar {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    padding: 0 30px;
    .orderpage-tit {
        float: left;
        font-size: 18px;
        color: #333333;
    }
    .orderpage-progress {
        float: right;
    }
}
.orderpage-cont {
    padding: 30px;
    position: relative;
    .orderpage-item-tit {
        font-size: 16px;
        color: #333333;
        padding: 30px 0 10px 0;
        .tips {
            color: #999999;
            font-size: 14px;
            margin-left: 10px;
        }
        .editbtn {
            font-size: 14px;
            color: #02adff;
            margin-left: 25px;
            padding-left: 22px;
            cursor: pointer;
            background: url(../../../../static/image/icon-edit.png) no-repeat;
            &:hover {
                color: #0073bd;
                background: url(../../../../static/image/icon-edit-hover.png)
                    no-repeat;
            }
        }
    }
    .orderpage-item-name {
        width: 80px;
        float: left;
        height: 40px;
        line-height: 40px;
    }
    .orderpage-item-cont {
        margin-left: 90px;
        height: 40px;
        line-height: 40px;
    }
    .orderpage-item-font1 {
        font-size: 16px;
        color: #333333;
    }
    .orderpage-item-font2 {
        font-size: 14px;
        color: #626262;
    }
    .orderpage-item-font3 {
        font-size: 16px;
        color: #C0CCDA;
    }
    .tableimg {
        height: 40px;
    }
}
.orderpage-footbtn {
    text-align: right;
    padding: 30px;
    .el-button {
        width: 140px;
    }
}

.eidt-consignee-dialog {
    input.el-input__inner {
        background: #fff;
    }
    .el-dialog {
        width: 570px;
        height: 540px;
        border-radius: 10px;
        .el-dialog__header {
            padding: 10px 20px;
            border-radius: 10px 10px 0 0;
            background: #e8ecef;
            .el-dialog__title {
                font-size: 16px;
                font-weight: normal;
            }
            .el-dialog__headerbtn {
                margin-top: 2px;
            }
        }
        .el-dialog__body {
            padding: 30px 50px 0 40px;
        }
        .dialog-footer {
            text-align: center;
            padding: 0;
            .el-button {
                width: 80px;
            }
        }
    }
}

.renew-time-item {
    width: 260px;
    height: 168px;
    border: 1px solid #e8ecef;
    border-radius: 4px;
    padding: 20px;
    margin-top: 10px;
    float: left;
    margin-right: 20px;
    position: relative;
    text-align: center;
    .time-item {
        font-size: 30px;
        .time-icon {
            width: 40px;
            height: 38px;
            display: inline-block;
            background: url(../../../../static/image/renewtime.svg) no-repeat;
            vertical-align: middle;
            margin-right: 20px;
        }
    }
    p {
        color: #626262;
        margin-top: 20px;
    }
    &.active {
        background: url(../../../../static/image/icon-selected.png) right top
            no-repeat;
        border-color: #02adff;
    }
    &.year::after {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: url('/static/image/cheap.svg') left top no-repeat;
    }
    .cheap {
        color: #fa6400;
    }
}
</style>
