<template>
  <div class="orderpay">
    <div class="orderpage-topbar clearfix">
      <div class="orderpage-tit"
           v-if="typeVal == '01'">Ukey签名申请</div>
      <div class="orderpage-tit"
           v-if="typeVal == '02'">Ukey印章申请</div>
      <div class="orderpage-progress">
        <img src="../../../../static/image/ukeyorder3.png"
             v-if="typeVal == '01'">
        <img src="/static/image/icon/step4.svg"
             v-if="typeVal == '02'">
      </div>
    </div>
    <div class="orderpage-result"
         v-if="resultStatus == 'SUCCESS' || resultStatus == 'TRADE_SUCCESS'">
      <div class="result-tit"><i class="iconsuccess"></i>您已支付成功！</div>
      <div class="result-cont">
        <div v-if="typeVal == '01'">UKey签名已成功申请，</div>支付金额<i>{{totalPrice}}</i>元，有效期<i>{{year}}</i>年，Ukey申请数量<i>{{totalNum}}</i>个，若有任何疑问请联系<a class="tips"
           href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4009196663&cref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa&ref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa%2Fstyle%26id%3Dwpa_setting_a01&pt=undefined&f=1&ty=1&ap=&as=&aty=0&a=">QQ客服</a>或拨打400-919-6663，<br>请随时关注您的<span style="cursor:pointer;"
              @click="gotoDetail()">订单</span>。
      </div>
      <!-- <div class="result-addr">货物寄送至：{{addressInfo}}<span>{{name}}（收)</span><span>{{phoneNum}}</span></div> -->
      <!-- 3秒返回提示 -->
      <div class="back-tips-box"
           v-if="isShowBackBox">
        <span class="back-tips-box-time">{{time3}}</span>秒后，将自动跳转到申请订单页面
      </div>
    </div>
    <div class="orderpage-result"
         v-else>
      <div class="result-tit"><i class="iconerror"></i>支付出现错误！</div>
      <div class="result-cont-error"><span>失败原因：</span>{{resultStatusDes}}</div>
      <div class="result-btn"></div>
    </div>
    <div class="result-btn">
      <el-button class="backpage"
                 @click="gotoList()">返回</el-button>
      <el-button class="gotolist"
                 type="primary"
                 @click="gotoDetail()"
                 v-if="resultStatus == 'SUCCESS' || resultStatus == 'TRADE_SUCCESS'">查看订单</el-button>
      <el-button class="repay"
                 type="primary"
                 @click="repay"
                 v-else>重新支付</el-button>
    </div>
  </div>
</template>
<script>
import base from "../mixin/base";
export default {
  mixins: [base],
  components: {},
  data() {
    return {
      typeVal: "",
      resultStatus: "",
      resultStatusDes: "",
      paymentNo: "",
      orderNo: "",
      addressInfo: "",
      name: "",
      phoneNum: "",
      totalPrice: "",
      totalNum: "",//申请数量
      year: '',
      resultStatusList: [{
        "statusCode": "SUCCESS",
        "statusTxt": "支付成功",
      }, {
        "statusCode": "REFUND",
        "statusTxt": "转入退款",
      }, {
        "statusCode": "NOTPAY",
        "statusTxt": "未支付",
      }, {
        "statusCode": "CLOSED",
        "statusTxt": "已关闭",
      }, {
        "statusCode": "REVOKED",
        "statusTxt": "已撤销",
      }, {
        "statusCode": "USERPAYING",
        "statusTxt": "用户支付中",
      }, {
        "statusCode": "PAYERROR",
        "statusTxt": "支付失败",
      }],
      aliResultStatusList: [{
        "statusCode": "TRADE_SUCCESS",
        "statusTxt": "支付成功",
      }, {
        "statusCode": "TRADE_FINISHED",
        "statusTxt": "交易结束，不可退款",
      }, {
        "statusCode": "TRADE_CLOSED",
        "statusTxt": "未付款交易超时关闭，或支付完成后全额退款",
      }, {
        "statusCode": "WAIT_BUYER_PAY",
        "statusTxt": "交易创建，等待买家付款",
      }],
      backTimer: null,//3秒返回ukey列表定时器
      time3: 3,
      isShowBackBox: false,//显示3秒返回的提示窗口
    }
  },
  computed: {},
  watch: {},
  mounted() {

    this.resultStatus = this.$route.query.result;
    this.paymentNo = this.$route.query.payNo;
    this.orderNo = this.$route.query.orderNo;
    if (this.$route.path == "/orderpayresult") {
      this.typeVal = '01';//签名
    } else if (this.$route.path == "/sealorderpayresult") {
      this.typeVal = '02';//印章
      //支付成功设置3秒后，自动跳转到订单列表页面 --ukey印章申请
      this.setSuccessBackFn();
    }
    for (var i = 0; i < this.resultStatusList.length; i++) {
      if (this.resultStatus == this.resultStatusList[i].statusCode) {
        this.resultStatusDes = this.resultStatusList[i].statusTxt;
      }
    }
    if (this.resultStatusDes == '') {
      for (var i = 0; i < this.aliResultStatusList.length; i++) {
        if (this.resultStatus == this.aliResultStatusList[i].statusCode) {
          this.resultStatusDes = this.aliResultStatusList[i].statusTxt;
        }
      }
    }

    this.getOrderDetail();
    this.getOrderConfirmData();
  },
  methods: {
    gotoDetail() {
      this.$router.push({ path: "/orderdetail", query: { orderNo: this.orderNo, applyType: this.typeVal } });
    },
    gotoList() {
      this.$router.push('/ukeyorder');
    },
    getOrderConfirmData() {
      this.getOrderConfirm(this.orderNo, this.pageNum, 100).then(res => {
        if (this.successCheckCode(res)) {
          this.totalPrice = res.data.totalPrice;
          this.year = res.data.sealList[0].esealYear;
          this.totalNum = res.data.sealList.length;
        }
      });
    },
    getOrderDetail() {
      if (this.typeVal == '01') {
        this.orderDetailPersonal(this.orderNo).then(res => {
          if (this.successCheckCode(res)) {
            this.name = res.data.orderAcceptInfo.agentName;
            this.phoneNum = res.data.orderAcceptInfo.deliveryPhone;
            this.addressInfo = res.data.orderAcceptInfo.deliveryAddress;
          }
        })
      } else {
        this.orderDetailEnterprise(this.orderNo).then(res => {
          if (this.successCheckCode(res)) {
            this.name = res.data.orderAcceptInfo.agentName;
            this.phoneNum = res.data.orderAcceptInfo.agentContactNumber;
            this.addressInfo = res.data.orderAcceptInfo.deliveryAddress;
          }
        })
      }
    },
    repay() {
      if (this.typeVal == '01') {
        this.$router.push(`/orderpay?orderNo=${this.orderNo}`);
      } else {
        this.$router.push(`/sealorderpay?orderNo=${this.orderNo}`);
      }
    },
    //支付成功设置3秒后，自动跳转到订单列表页面 --ukey印章申请
    setSuccessBackFn() {
      if (this.typeVal == '02' && (this.resultStatus == 'SUCCESS' || this.resultStatus == 'TRADE_SUCCESS')) {
        let self = this;
        this.isShowBackBox = true;
        this.backTimer && clearInterval(this.backTimer);
        this.backTimer = setInterval(() => {
          self.time3--;
          if (self.time3 == 0) {
            clearInterval(self.backTimer);
            self.gotoList();
          }
        }, 3000);
      }
    },
  },
  destroyed() {
    this.backTimer && clearInterval(this.backTimer);
  },
}
</script>
<style lang="scss">
.orderpay {
  .orderpage-result {
    padding: 66px 254px;
    position: relative;
    .result-tit {
      font-size: 36px;
      color: #333333;
      margin-bottom: 10px;
      position: relative;
      i {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        margin-top: 2px;
        margin-left: -64px;
        width: 44px;
        height: 44px;
      }
      .iconsuccess {
        background: url(../../../../static/image/icon-paysuccess.png) no-repeat;
      }
      .iconerror {
        background: url(../../../../static/image/icon-payerror.png) no-repeat;
      }
    }
    .result-cont {
      font-size: 14px;
      color: #626262;
      line-height: 30px;
      margin-bottom: 30px;
      i {
        font-size: 20px;
        padding: 0 5px;
      }
      span,
      a {
        color: #02adff;
        text-decoration: underline;
      }
    }
    .result-cont-error {
      font-size: 14px;
      color: #000000;
      line-height: 30px;
      span {
        color: #999999;
      }
    }
    .result-addr {
      ont-size: 14px;
      color: #626262;
      span {
        margin-left: 30px;
      }
    }
    .back-tips-box {
      width: 310px;
      height: 36px;
      position: absolute;
      left: 0;
      right: 0;
      top: 10px;
      margin: 0 auto;
      padding: 0 36px;
      line-height: 36px;
      font-size: 14px;
      background-color: #fff;
      background: #d2f2ff;
      border-radius: 4px;
      &-time {
        font-size: 18px;
        margin-right: 16px;
      }
    }
  }
  .result-btn {
    text-align: right;
    padding: 0 30px;
    .el-button {
      margin-left: 20px;
    }
    .backpage,
    .repay {
      width: 120px;
    }
    .gotolist {
      width: 150px;
    }
  }
}
</style>
