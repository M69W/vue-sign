<template>
  <div class="orderpay">
    <div class="orderpage-topbar clearfix">
      <div class="orderpage-tit"
           v-if="userType == '02'">
        申请Ukey签名
      </div>
      <div class="orderpage-tit"
           v-if="userType == '01'">
        申请Ukey印章
      </div>
      <div class="orderpage-progress">
        <img src="../../../../static/image/ukeyorder2.png"
             v-if="userType == '02'" />
        <img src="/static/image/icon/step3.svg"
             v-if="userType == '01'" />
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
      <div class="orderpage-item-tit">UKey费用</div>
      <div class="clearfix">
        <!-- <div class="ukeycost"
             v-for="item in paySealList">
          <div class="ukeycost-total"><img src="../../../../static/image/icon-rmb.png">{{item.sealPrice}}元</div>
          <div class="ukeycost-year"
               v-if="userType == '02'">签名名称：{{item.sealName}}</div>
          <div class="ukeycost-year"
               v-if="userType == '01'">印章名称：{{item.sealName}}</div>
          <div class="ukeycost-year">有效年限：{{item.esealYear}}年</div>
          <div class="ukeycost-date">有效期限：{{item.sealValidDateStart}} 至 {{item.sealValidDateEnd}}</div>
        </div> -->
        <div class="ukey-item clearfix">
          <div class="ukey-item-left fl">
            <img src="/static/image/icon/menoy_logo.svg"
                 alt="" />
          </div>
          <div class="ukey-item-right fl">
            <span class="ukey-item-right-price ukey-item-big">{{
                            paySealList[0] ? paySealList[0].sealPrice : ""
                        }}</span>
            <span class="ukey-item-right-tips">元</span>
            <span class="ukey-item-right-x ukey-item-big">X</span>
            <span class="ukey-item-right-num ukey-item-big">{{
                            productNum
                        }}</span>
            <span class="ukey-item-right-tips">个</span>
          </div>
        </div>
      </div>
      <div class="orderpage-item-tit">支付方式</div>
      <div class="payType-list clearfix">
        <el-radio-group v-model="payTypeVal"
                        size="small">
          <el-radio :label="1"
                    :class="payTypeVal == 1 ? 'actived' : ''"><img src="../../../../static/image/wechatpay.png" /><i v-if="payTypeVal == 1"></i></el-radio>
          <el-radio :label="2"
                    :class="payTypeVal == 2 ? 'actived' : ''"><img src="../../../../static/image/alipay.png" /><i v-if="payTypeVal == 2"></i></el-radio>
          <!--<el-radio :label="3" :class="payTypeVal == 3 ? 'actived' : ''"><img src="../../../../static/image/unionpay.png"><i v-if="payTypeVal == 3"></i></el-radio>-->
        </el-radio-group>
      </div>
      <div class="coupon-select clearfix"
           v-if="hasCoupon">
        <div class="coupon-select-title fl">优惠券</div>
        <div class="coupon-select-content fl">
          <el-select placeholder="请选择优惠券"
                     style="width: 356px;"
                     v-model="selectCouponId"
                     clearable>
            <el-option v-for="(citem, cindex) in couponList"
                       :key="cindex"
                       :value="citem.id"
                       :label="citem.couponName"></el-option>
          </el-select>
        </div>
      </div>
      <div class="orderpage-item-tit">发票信息</div>
      <div class="invoiceType">
        <el-radio-group v-model="invoiceType">
          <el-radio :label="1">无需发票</el-radio>
          <el-radio :label="2">企业发票</el-radio>
          <el-radio :label="3">个人发票</el-radio>
        </el-radio-group>
      </div>
      <div class="invoiceInfo"
           v-if="invoiceType == '2'">
        <el-row>
          <el-col :span="10">
            <div class="invoiceTitle-label">发票抬头</div>
            <el-input type="text"
                      v-model="invoiceTitle"
                      placeholder="请填写公司发票抬头"></el-input>
          </el-col>
          <el-col :span="10">
            <div class="invoiceTitle-label label-w">
              纳税人识别号
            </div>
            <el-input type="text"
                      v-model="invoiceNumber"
                      placeholder="请输入纳税人识别号"></el-input>
          </el-col>
          <el-col :span="10"
                  style="margin-top: 10px;">
            <div class="invoiceTitle-label">收票邮箱</div>
            <el-input type="text"
                      v-model="buyerEmail"
                      placeholder="接收电子发票的邮箱"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="invoiceInfo"
           v-if="invoiceType == '3'">
        <el-row>
          <el-col :span="10">
            <div class="invoiceTitle-label">发票抬头</div>
            <el-input type="text"
                      v-model="invoiceTitle"
                      placeholder="请填写个人发票抬头内容"></el-input>
          </el-col>
          <el-col :span="10">
            <div class="invoiceTitle-label">收票邮箱</div>
            <el-input type="text"
                      v-model="buyerEmail"
                      placeholder="接收电子发票的邮箱"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="commodity-info">
        <div class="inner fr">
          <div class="commodity-info-item"
               v-show="hasCoupon">
            <div class="commodity-info-item-title">订单金额</div>
            <div class="commodity-info-item-content">
              ￥{{originalPrice}}
            </div>
          </div>
          <div class="commodity-info-item"
               v-show="hasCoupon">
            <div class="commodity-info-item-icon">
              -
            </div>
          </div>
          <div class="commodity-info-item"
               v-show="hasCoupon">
            <div class="commodity-info-item-title">优惠金额</div>
            <div class="commodity-info-item-content">￥{{discountPrice}}</div>
          </div>
          <div class="commodity-info-item"
               v-show="hasCoupon">
            <div class="commodity-info-item-icon">
              =
            </div>
          </div>
          <div class="commodity-info-item">
            <div class="commodity-info-item-title"
                 style="color: red; margin-bottom: 8px;">
              应付金额
            </div>
            <div class="commodity-info-item-content"
                 style="color: red; font-size: 20px;">
              ￥{{ totalPrice | changePrice}}
            </div>
          </div>
        </div>
        <!-- <div class="commodityInfo-total fl">
          <span class="selectedTotal">应付总额<i>￥{{totalPrice?totalPrice:''}}</i>元</span>
        </div>
        <div class="commodityInfo-total fl">
          <span class="selectedTotal">应付总额<i>￥{{totalPrice?totalPrice:''}}</i>元</span>
        </div>
        <div class="commodityInfo-total fl">
          <span class="selectedTotal">应付总额<i>￥{{totalPrice?totalPrice:''}}</i>元</span>
        </div> -->
      </div>
    </div>
    <div class="orderpage-footbtn">
      <el-button @click="gotoList()">上一步</el-button>
      <el-button type="primary"
                 @click="toPay()"
                 :loading="btnLoding">去结算</el-button>
    </div>

    <div class="paycode-dialog">
      <el-dialog title="微信支付码"
                 :visible.sync="dialogFormVisible"
                 @open="openDialog"
                 @close="closeDialog">
        <div class="paycode-dialog-body">
          <div id="qrcode"
               style="width: 240px; height: 240px; margin: 0 auto;"></div>
        </div>
        <div class="paycode-dialog-tips">
          请用微信扫描二维码进行支付
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import base from "../mixin/base";
import { accAdd, accSub, accMul, accDiv } from "huaji-calculate";
import { isEmail } from "../common/index";
export default {
  mixins: [base],
  components: {},
  data() {
    return {
      invoiceType: 2,
      invoiceTitle: "",
      invoiceNumber: "",
      yearNum: "2",
      payTypeVal: 1,
      productNum: 1,
      addressInfo: "",
      name: "",
      phoneNum: "",
      dialogFormVisible: false,
      typeVal: "",
      payCodeData: {},
      payResultData: {},
      accountId: JSON.parse($.cookie("userinfo")).accountId,
      orderNo: "",
      edittype: "",
      payCompleteStatus: false,
      timer: null,
      paySealList: [],
      productName: "",
      userType: JSON.parse($.cookie("userinfo")).userType,
      btnLoding: false,
      totalPrice: null,//应付
      couponList: [], //优惠券列表
      hasCoupon: false,//是否有优惠券
      selectCouponItem: null, //选中的优惠券
      selectCouponId: "",
      originalPrice: 0,//原价
      discountPrice: 0,//优惠金额
      buyerEmail: ''
    };
  },
  computed: {},
  watch: {
    selectCouponId() {
      this.changeCoupon();
    },
  },
  async mounted() {
    this.orderNo = this.$route.query.orderNo;
    this.edittype = this.$route.query.edittype;
    if (this.$route.path == "/orderpay") {
      //ukey签名申请流程
      this.typeVal = "01";
      this.productName = "UKEY签名申请";
    } else if (this.$route.path == "/sealorderpay") {
      //ukey印章申请流程
      this.typeVal = "02";
      this.productName = "UKEY印章申请";
    }
    await this.getEnableCouponsFn();
    await this.getOrderConfirmData();
    await this.getOrderDetail();
  },
  methods: {
    gotoList() {
      this.$router.push("/ukeyorder");
      /*  if(this.typeVal=='01'){
      this.$router.push({
          path: '/orderconfirm',
          query: {orderNo: this.orderNo}
      });
  }else{
      this.$router.push({
          path: '/orderconfirm',
          query: {orderNo: this.orderNo, edittype: this.edittype}
      });
  }*/
    },
    toPay() {
      if (
        this.invoiceType == "02" &&
        (!this.invoiceTitle || !this.invoiceNumber || !this.buyerEmail)
      ) {
        return this.$message.error("请输入开票信息");
      } else if (this.invoiceType == "03" && (!this.invoiceTitle || !this.buyerEmail)) {
        return this.$message.error("请输入开票信息");
      } else if (this.invoiceType == "02") {
        if (
          /[\u4e00-\u9fa5]/.test(this.invoiceNumber) ||
          (this.invoiceNumber.length != 15 &&
            this.invoiceNumber.length != 18 &&
            this.invoiceNumber.length != 20)
        ) {
          return this.$message.error("请输入正确的纳税人识别号");
        }
      }
      if (
        (this.invoiceType == 2 || this.invoiceType == 3) &&
        !isEmail(this.buyerEmail)
      ) {
        return this.$message.error("请输入正确的邮箱");
      }
      $("#qrcode").empty();

      if (this.payTypeVal == 1) {
        console.log("wx");
        // this.dialogFormVisible = true;
        //
        this.getWxPayCodeData();
      } else if (this.payTypeVal == 2) {
        console.log("ali");
        this.getAliPayCodeData();
      } else if (this.payTypeVal == 3) {
      }
    },
    openDialog() {
      console.log("opendialog");
      // this.getWxPayCodeData();
    },
    closeDialog() {
      clearInterval(this.timer);
      this.btnLoding = false;
    },
    getOrderConfirmData() {
      return this.getOrderConfirm(this.orderNo, this.pageNum, 100).then(
        (res) => {
          if (this.successCheckCode(res)) {
            this.paySealList = res.data.sealList;
            this.productNum = res.data.sealList.length;
            this.totalPrice = res.data.originFee;
            this.originalPrice = res.data.originFee;
          }
        }
      );
    },
    getOrderDetail() {
      return this.orderDetailEnterprise(this.orderNo).then((res) => {
        if (this.successCheckCode(res)) {
          this.name = res.data.orderAcceptInfo.agentName;
          this.phoneNum = res.data.orderAcceptInfo.agentContactNumber;
          this.addressInfo = res.data.orderAcceptInfo.deliveryAddress;
          this.selectCouponId = res.data.couponId ? res.data.couponId + "" : "";
        }
      });
    },
    //支付宝支付
    getAliPayCodeData() {
      var data = {
        accountId: this.accountId,
        buyerName: this.invoiceTitle, // 购买方名称-发票抬头
        buyerTaxerNo: this.invoiceNumber, // 购买方纳税人识别号-税号
        productId: this.orderNo,
        productName: this.productName, // 这里如果更改，要在alipayNotifyReturn.vue文件修改该名称
        totalFee: this.originalPrice * 100, // 标价金额（单位为分）
        tradeNo: this.orderNo,
        tradeType: "01", // 01：ukey订单，02：套餐订单
        couponId: this.selectCouponId || "",
        buyerEmail: this.buyerEmail
      };
      var self = this;
      this.btnLoding = true;
      this.getAliPayCode(data)
        .then((res) => {
          setTimeout(function () {
            self.btnLoding = false;
          }, 500);

          if (this.successCheckCode(res)) {
            var alipayurl = res.data.htmlForm;
            var div = document.createElement("div");
            div.innerHTML = alipayurl;
            document.body.appendChild(div);
            document.forms.punchout_form.submit();
          }
        })
        .fail((res) => {
          this.btnLoding = false;
        });
    },
    //微信支付
    getWxPayCodeData() {
      var data = {
        accountId: this.accountId,
        buyerName: this.invoiceTitle, // 购买方名称-发票抬头
        buyerTaxerNo: this.invoiceNumber, // 购买方纳税人识别号-税号
        productId: this.orderNo,
        productName: this.productName,
        totalFee: this.originalPrice * 100, // 标价金额（单位为分）
        tradeNo: this.orderNo,
        tradeType: "01", // 01：ukey订单，02：套餐订单
        couponId: this.selectCouponId || "",
        buyerEmail: this.buyerEmail
      };
      $("#qrcode").empty();
      var self = this;
      this.btnLoding = true;
      return this.getWxPayCode(data)
        .then((res) => {
          setTimeout(function () {
            self.btnLoding = false;
          }, 500);

          if (this.successCheckCode(res)) {
            this.dialogFormVisible = true;
            this.payCodeData = res.data;
            this.qrcode(this.payCodeData.codeUrl);

            this.timer = setInterval(function () {
              self.getWxPayResultData();
              if (self.payCompleteStatus == true) {
                clearInterval(this.timer);
              }
            }, 2000);
          }
        })
        .fail((res) => {
          this.btnLoding = false;
        });
    },
    //获取微信支付结果，并跳转结果页面
    getWxPayResultData() {
      this.getWxPayResult(this.payCodeData.paymentNo).then((res) => {
        if (this.successCheckCode(res)) {
          this.payResultData = res.data;
          this.payCompleteStatus = res.data.state;
          if (this.payCompleteStatus == true) {
            clearInterval(this.timer);
            if (this.typeVal == "01") {
              this.$router.push({
                path: "/orderpayresult",
                query: {
                  result: this.payResultData.tradeState,
                  payNo: this.payCodeData.paymentNo,
                  orderNo: this.orderNo,
                },
              });
            } else if (this.typeVal == "02") {
              this.$router.push({
                path: "/sealorderpayresult",
                query: {
                  result: this.payResultData.tradeState,
                  payNo: this.payCodeData.paymentNo,
                  orderNo: this.orderNo,
                },
              });
            }
          }
        } else {
          clearInterval(this.timer);
        }
      });
    },
    qrcode(data) {
      this.$nextTick(() => {
        var qrcode = new QRCode(document.getElementById("qrcode"), {
          width: 240,
          height: 240,
        });
        qrcode.makeCode(data);
      })
    },
    getEnableCouponsFn() {
      return this.getEnableCouponList({
          productCode: 2
      }).then((res) => {
        if (this.successCheckCode(res)) {
          this.couponList = res.data;
          if (this.couponList.length > 0) {
            this.hasCoupon = true;
          } else {
            this.hasCoupon = false;
          }
        }
      });
    },
    //选中优惠券获取当前优惠券
    changeCoupon() {
      let discountPrice = 0, price = 0;
      let selectCouponItem = null;
      selectCouponItem = this.couponList.filter((item) => {
        return item.id == this.selectCouponId;
      })[0];
      if (selectCouponItem) {
        if (this.originalPrice >= selectCouponItem.moreAvailable) {
          //1现金券；2折扣券 ,
          if (selectCouponItem.couponType === 1) {
            discountPrice = selectCouponItem.couponMoney
            this.totalPrice = accSub(this.originalPrice, discountPrice) >= 0 ? accSub(this.originalPrice, discountPrice) : 0;
          } else {
            discountPrice = accMul(accSub(1, selectCouponItem.couponMoney / 10), this.originalPrice);
            discountPrice = Math.floor(accMul(Number(discountPrice), 100)) / 100;
            this.totalPrice = accSub(this.originalPrice, discountPrice);
          }
          this.discountPrice = discountPrice;
          this.selectCouponItem = selectCouponItem;
        } else {
          this.selectCouponItem = null;
          this.discountPrice = 0;
          this.totalPrice = this.originalPrice;
          this.selectCouponId = '';
          this.$message.warning("不满足优惠券使用条件!");
        }
      } else {
        this.selectCouponItem = null;
        this.discountPrice = 0;
        this.totalPrice = this.originalPrice;
      }
      // this.discountPrice

    },
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.timer);
    next();
  },
};
</script>
<style lang="scss">
.orderpay {
  .ukeycost {
    margin-top: 10px;
    background: #f4f6f8;
    border-radius: 4px;
    width: 354px;
    height: 180px;
    padding: 30px 20px;
    float: left;
    margin-right: 20px;
    .ukeycost-total {
      font-size: 30px;
      color: #333333;
      img {
        margin-right: 20px;
        vertical-align: -8px;
      }
    }
    .ukeycost-year {
      font-size: 14px;
      color: #626262;
      margin-top: 10px;
    }
    .ukeycost-date {
      font-size: 14px;
      color: #626262;
      margin-top: 10px;
    }
  }
  .ukey-item {
    padding: 29px 24px;
    width: 354px;
    height: 100px;
    border: 1px solid #02adff;
    border-radius: 4px;
    &-left {
      margin-right: 25px;
      vertical-align: middle;
    }
    &-right {
      line-height: 40px;
      vertical-align: middle;
      &-price,
      &-num {
        font-size: 30px;
        font-weight: 700;
        margin-right: 8px;
      }
      &-x {
        font-size: 16px;
        font-weight: 700;
        margin: 0 15px;
      }
      &-tips {
        font-size: 14px;
      }
    }
  }
  .payType-list {
    margin-top: 10px;
    .el-radio {
      float: left;
      margin-right: 20px;
      width: 212px;
      height: 60px;
      border: 1px solid #e8ecef;
      border-radius: 4px;
      padding: 4px 12px;
      cursor: pointer;
      position: relative;
      .el-radio__input {
        display: none;
      }
    }
    .actived {
      border: 1px solid #02adff;
      i {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        width: 40px;
        height: 40px;
        background: url(../../../../static/image/icon-selected.png) no-repeat;
      }
    }
  }
  .coupon-select {
    margin: 40px 0;
    &-title {
      line-height: 40px;
      height: 40px;
      float: left;
      font-size: 16px;
      color: #333333;
      margin-right: 18px;
    }
  }
  .invoiceType {
    margin-top: 10px;
  }
  .invoiceInfo {
    padding: 30px 0 0 0;
    .invoiceTitle-label {
      font-size: 14px;
      color: #626262;
      width: 56px;
      margin-right: 20px;
      float: left;
      height: 36px;
      line-height: 36px;
    }
    .label-w {
      width: 84px;
    }
    .el-input {
      width: 350px;
      input.el-input__inner {
        background-color: #fff;
      }
    }
  }
  .commodity-info {
    text-align: center;
    margin-top: 40px;
    background-color: #f4f6f8;
    width: 1200px;
    height: 103px;
    margin-left: -30px;
    padding: 24px 30px;
    &-item {
      height: 54px;
      float: left;
      font-size: 14px;
      &-title {
        color: #666666;
        margin-bottom: 13px;
      }
      &-content {
        color: #666666;
      }
      &-icon {
        height: 54px;
        line-height: 54px;
        color: #999;
        width: 60px;
      }
    }
    // .commodityInfo-addr {
    //   font-size: 14px;
    //   color: #333333;
    //   span {
    //     font-size: 16px;
    //     color: #626262;
    //     margin-right: 30px;
    //     img {
    //       margin-right: 5px;
    //       vertical-align: -4px;
    //     }
    //   }
    // }
  }
  .paycode-dialog {
    .el-dialog {
      width: 570px;
      height: 430px;
      border-radius: 10px;
      .el-dialog__header {
        padding: 10px 20px;
        border-radius: 10px 10px 0 0;
        background: #e8ecef;
        .el-dialog__headerbtn {
          margin-top: 0;
        }
        .el-dialog__title {
          font-size: 16px;
          font-weight: normal;
        }
      }
    }
    .el-dialog__body {
      padding: 20px;
    }
    .paycode-dialog-body {
      text-align: center;
      padding: 30px;
      img {
        height: 240px;
        width: 240px;
      }
    }
    .paycode-dialog-tips {
      text-align: center;
      font-size: 14px;
      color: #626262;
    }
  }
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
      padding: 30px 0 20px 0;
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
      color: #626262;
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
}
</style>
