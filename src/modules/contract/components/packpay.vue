<template>
  <div class="packpay">
    <div class="orderpage-topbar clearfix">
      <div class="orderpage-tit">电子合同套餐</div>
    </div>
    <div class="orderpage-cont">
      <el-row>
        <el-col :span="8">
          <div class="orderpage-item-name orderpage-item-font1">
            订单号
          </div>
          <div class="orderpage-item-cont">{{ this.orderNo }}</div>
        </el-col>
      </el-row>
      <div class="orderpage-item-tit">套餐说明</div>
      <div class="ukeycost">
        <div class="ukeycost-total">
          <img src="../../../../static/image/setmeal.png" />{{
                        pakeInfo.name
                    }}
        </div>
        <div class="item">
          <span class="label">套餐费用：</span>{{ originalPrice ? originalPrice : "" }}元
        </div>
        <div class="item">
          <span class="label">签署份数：</span>{{ pakeInfo.signSum }}份
        </div>
        <div class="item">
          <span class="label">有效期限：</span>{{ format(pakeInfo.userfulLife) }}年
          <i>（{{ pakeInfo.signValidBeginTime }} 至
            {{ pakeInfo.signValidEndTime }}）</i>
        </div>
        <div class="item">
          <span class="label">套餐说明：</span><i>{{ pakeInfo.description }}</i>
        </div>
      </div>
      <div class="orderpage-item-tit">支付方式</div>
      <div class="payType-list clearfix">
        <el-radio-group v-model="payTypeVal"
                        size="small">
          <el-radio label="01"
                    :class="payTypeVal == '01' ? 'actived' : ''"><img src="../../../../static/image/wechatpay.png" /><i v-if="payTypeVal == '01'"></i></el-radio>
          <el-radio label="02"
                    :class="payTypeVal == '02' ? 'actived' : ''"><img src="../../../../static/image/alipay.png" /><i v-if="payTypeVal == '02'"></i></el-radio>
          <!--<el-radio label="03" :class="payTypeVal == '03' ? 'actived' : ''"><img src="../../../../static/image/unionpay.png"><i v-if="payTypeVal == '03'"></i></el-radio>-->
        </el-radio-group>
      </div>
      <div class="coupon-select clearfix"
           v-if="hasCoupon">
        <div class="coupon-select-title fl">优惠券</div>
        <div class="coupon-select-content fl">
          <el-select placeholder="请选择优惠券"
                     style="width: 356px;"
                     v-model="selectCouponId"
                     @change="changeCoupon"
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
          <el-radio label="01">无需发票</el-radio>
          <el-radio label="02">企业发票</el-radio>
          <el-radio label="03">个人发票</el-radio>
        </el-radio-group>
      </div>
      <div class="invoiceInfo"
           v-if="invoiceType == '02'">
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
           v-if="invoiceType == '03'">
        <el-row>
          <el-col :span="10">
            <div class="invoiceTitle-label">发票抬头</div>
            <el-input type="text"
                      v-model="personName"
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
              ￥{{ pakeInfo.price | changePrice}}
            </div>
          </div>
        </div>
        <!-- <div class="commodityInfo-total fl">
          <span class="selectedTotal">应付总额<i>￥{{pakeInfo.price?pakeInfo.price:''}}</i>元</span>
        </div>
        <div class="commodityInfo-total fl">
          <span class="selectedTotal">应付总额<i>￥{{pakeInfo.price?pakeInfo.price:''}}</i>元</span>
        </div>
        <div class="commodityInfo-total fl">
          <span class="selectedTotal">应付总额<i>￥{{pakeInfo.price?pakeInfo.price:''}}</i>元</span>
        </div> -->
      </div>
    </div>
    <div class="orderpage-footbtn">
      <el-button @click="back()">上一步</el-button>
      <el-button type="primary"
                 @click="toPay()"
                 :loading="btnLoding">去结算</el-button>
    </div>

    <div class="paycode-dialog">
      <el-dialog title="微信支付码"
                 :visible.sync="dialogFormVisible"
                 :before-close="dialogClose">
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
      invoiceType: "02",
      invoiceTitle: "",
      invoiceNumber: "",
      payTypeVal: "01",
      dialogFormVisible: false,
      pakeInfo: {},
      id: "",
      orderNo: "",
      timer: null,
      payCodeData: {},
      payResultData: {},
      personName: "",
      payCompleteStatus: false,
      accountId: JSON.parse($.cookie("userinfo")).accountId,
      productName: "套餐购买",
      btnLoding: false,
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
    invoiceType() {
      this.invoiceTitle = "";
      this.invoiceNumber = "";
      this.personName = "";
      this.buyerEmail = '';
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.id = this.$route.query.id;
      this.orderNo = this.$route.query.tradeNo;
      this.getList();
      this.getEnableCouponsFn();
    });
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    toPay() {
      if (
        this.invoiceType == "02" &&
        (!this.invoiceTitle || !this.invoiceNumber || !this.buyerEmail)
      ) {
        return this.$message.error("请输入开票信息");
      } else if (this.invoiceType == "03" && (!this.personName || !this.buyerEmail)) {
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
      let data = {
        dutyNo: this.invoiceNumber,
        enterpriseName: this.invoiceTitle,
        invoiceInfoId: this.invoiceInfoId,
        invoiceType: this.invoiceType,
        orderNo: this.orderNo,
        paymentMethod: this.payTypeVal,
        personName: this.personName,
        signPackageId: this.id,
        productName: this.productName,
        couponId: this.hasCoupon && this.selectCouponItem ? this.selectCouponId : "",
        buyerEmail: this.buyerEmail
      };
      var self = this;
      this.btnLoding = true;
      this.subPackage(data)
        .then((res) => {
          setTimeout(function () {
            self.btnLoding = false;
          }, 500);

          if (this.successCheckCode(res)) {
            this.payCodeData = res.data;
            if (this.payTypeVal == "01") {
              //微信支付
              console.log("wx");
              this.dialogFormVisible = true;
              setTimeout(() => {
                this.qrcode(res.data.codeUrl);
              }, 100);
              this.timer = setInterval(() => {
                this.getWxPayResultData();
                if (this.payCompleteStatus == true) {
                  clearInterval(this.timer);
                }
              }, 2000);
            } else if (this.payTypeVal == "02") {
              //支付宝支付
              console.log("ali");
              var alipayurl = res.data.alipayOrderResp.htmlForm;
              var div = document.createElement("div");
              div.innerHTML = alipayurl;
              document.body.appendChild(div);
              document.forms.punchout_form.submit();
            } else if (this.payTypeVal == "03") {
            }
          }
        })
        .fail((res) => {
          this.btnLoding = false;
        });
    },
    getList() {
      this.packageInit(this.id).then((res) => {
        if (this.successCheckCode(res)) {
          this.pakeInfo = res.data.compactSignPackage;
          this.originalPrice = this.pakeInfo.price;
          this.pakeInfo.signValidBeginTime =
            res.data.signValidBeginTime;
          this.pakeInfo.signValidEndTime = res.data.signValidEndTime;
          this.orderNo ? "" : (this.orderNo = res.data.orderNo);
        }
      });
    },
    getWxPayResultData() {
      this.getWxPackagePayResult(this.orderNo).then((res) => {
        if (this.successCheckCode(res)) {
          this.payResultData = res.data;
          this.payCompleteStatus = res.data.state;
          if (this.payCompleteStatus == true) {
            this.$router.push({
              path: "/packpayresult",
              query: {
                result: this.payResultData.tradeState,
                orderNo: this.payCodeData.tradeNo,
                id: this.id,
              },
            });
            clearInterval(this.timer);
          }
        } else {
          clearInterval(this.timer);
        }
      });
    },
    qrcode(data) {
      var qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 240,
        height: 240,
      });
      qrcode.makeCode(data);
    },
    format(val) {
      if (val) {
        return Math.floor(val / 365);
      }
    },
    dialogClose() {
      clearInterval(this.timer);
      this.dialogFormVisible = false;
    },
    getEnableCouponsFn() {
      this.getEnableCouponList({
          productCode: 1
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
            this.pakeInfo.price = accSub(this.originalPrice, discountPrice) >= 0 ? accSub(this.originalPrice, discountPrice) : 0;
          } else {
            discountPrice = accMul(accSub(1, selectCouponItem.couponMoney / 10), this.originalPrice);
            discountPrice = Math.floor(accMul(Number(discountPrice), 100)) / 100;
            this.pakeInfo.price = accSub(this.originalPrice, discountPrice);
          }
          this.discountPrice = discountPrice;
          this.selectCouponItem = selectCouponItem;
        } else {
          this.selectCouponItem = null;
          this.discountPrice = 0;
          this.pakeInfo.price = this.originalPrice;
          this.selectCouponId = '';
          this.$message.warning("不满足优惠券使用条件!");
        }
      } else {
        this.selectCouponItem = null;
        this.discountPrice = 0;
        this.pakeInfo.price = this.originalPrice;
      }
      // this.discountPrice

    },
  },
};
</script>
<style lang="scss">
.packpay {
  .ukeycost {
    margin-top: 10px;
    background: #fafafa;
    border-radius: 4px;
    width: 600px;
    height: 230px;
    padding: 30px 20px;
    .ukeycost-total {
      font-size: 30px;
      color: #333333;
      margin-bottom: 20px;
      img {
        margin-right: 20px;
        vertical-align: -8px;
      }
    }
    .ukeycost-year {
      font-size: 14px;
      color: #626262;
      margin-top: 20px;
    }
    .ukeycost-date {
      font-size: 14px;
      color: #626262;
      margin-top: 20px;
    }
    .item {
      color: #151515;
      line-height: 20px;
      margin-bottom: 10px;
      .label {
        color: #626262;
      }
      i {
        color: #989a9c;
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
