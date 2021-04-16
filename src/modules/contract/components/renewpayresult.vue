<template>
  <div class="orderpay">
    <div class="orderpage-topbar clearfix">
      <div class="orderpage-tit">{{titName}}</div>
      <div class="orderpage-progress">
        <img src="../../../../static/image/ukeyrenew2.png">
      </div>
    </div>
    <div class="orderpage-result">
      <div class="result-tit">
        <i class="iconsuccess"></i>您已支付成功，请<a @click="gotoUpdateCert">前往更新证书！</a>
      </div>
      <div class="result-cont">
        支付金额
        <i>{{totalPrice}}</i>元，有效期
        <i>{{renewalTime}}</i>年，若有任何疑问请联系
        <a class="tips"
           href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4009196663&cref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa&ref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa%2Fstyle%26id%3Dwpa_setting_a01&pt=undefined&f=1&ty=1&ap=&as=&aty=0&a=">QQ客服</a>或拨打400-919-6663。
        <!-- <br>请随时关注您的
                <span @click="routerTo('ukeyorder')" style="cursor:pointer;">订单</span>。 -->
      </div>
      <div class="tips">
        <p style="color:red;">温馨提示：</p>
        <p style="color:red;">1、 如果您需要对历史PDF、office文件进行盖章撤销操作，请先去撤销盖章后再回来进行证书更新，否则更新之后将无法对历史office文件撤销。</p>
      </div>
    </div>
    <!--<div class="orderpage-result">
            <div class="result-tit"><i class="iconerror"></i>支付出现错误！</div>
            <div class="result-cont-error"><span>失败原因：</span>您使用的该银行卡未开通网银支付功能，请前往开通或使用其它方式支付。</div>
            <div class="result-btn"></div>
        </div>-->

    <div class="result-btn">
      <el-button class="backpage"
                 @click="back">返回</el-button>
      <el-button class="gotolist"
                 type="primary"
                 @click="gotoUpdateCert">前往更新证书</el-button>
      <!--<el-button class="repay" type="primary">重新支付</el-button>-->
    </div>
    <div class="count">
      <span>{{second}}</span>秒后，将自动跳转到证书更新页面
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
      resultStatus: "",
      orderNo: "",
      titName: "",
      totalPrice: "",
      renewalTime: "",
      second: 3,
      timer: null
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.resultStatus = this.$route.query.result;
    this.orderNo = this.$route.query.orderNo;
    this.totalPrice = this.$route.query.totalPrice;
    this.renewalTime = this.$route.query.renewalTime;
    if (this.$route.path == "/renewpayresult") {
      //ukey签名续期申请流程
      this.typeVal = "01";
      this.titName = "Ukey签名续期";
    } else if (this.$route.path == "/sealrenewpayresult") {
      //ukey印章续期申请流程
      this.typeVal = "02";
      this.titName = "Ukey印章续期";
    }
    if (this.orderNo) {
      this.timer = setInterval(() => {
        --this.second;
        if (this.second <= 0) {
          clearInterval(this.timer);
          this.gotoUpdateCert();
        }
      }, 1000);
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    gotoUpdateCert() {
      // this.updateSassStatus();
      this.$router.push({
        path: "/ukeyrenewupdate",
        query: { orderNo: this.orderNo }
      });
    },
    updateSassStatus() {
      let that = this;
      let data = {
        operatorType: "02",
        orderNo: this.orderNo,
        orderStatus: "06",
        remark: "支付服务通知支付结果"
      };
      this.uptOrderStatus(data).then(res => {
        if (this.successCheckCode(res)) {
          self.$message.success("更新成功！");
          setTimeout(function () {
            that.$router.push({
              path: "/ukeyrenewupdate",
              query: { orderNo: this.orderNo }
            });
          }, 1000);
        }
      });
    },
    routerTo(val) {
      this.$router.push(val)
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  }
};
</script>
<style lang="scss">
.orderpay {
  position: relative;
  .orderpage-result {
    padding: 66px 254px;
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
      a {
        font-size: 36px;
        color: #02adff;
        text-decoration: underline;
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
      font-size: 14px;
      color: #626262;
      span {
        margin-left: 30px;
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
  .count {
    width: 300px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: #d2e9ff;
    border-radius: 4px;
    color: #7a7a7a;
    position: absolute;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    span {
      font-size: 16px;
    }
  }
}
</style>
