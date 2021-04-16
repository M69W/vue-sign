<template>
  <div class="packpayresult">
    <div class="orderpage-topbar clearfix">
      <div class="orderpage-tit">电子合同套餐</div>
    </div>
    <div class="result">
      <div><span class="icon"
              :class="result == '01'?'success':'fail'"></span>{{result == '01'?'支付成功！':'支付失败！'}}</div>
      <p v-if="result == '01'">
        支付金额 <i>{{money}}</i> 元，有效期 <i>{{year}}</i> 年，若有任何疑问请联系<a class="tips"
           href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4009196663&cref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa&ref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa%2Fstyle%26id%3Dwpa_setting_a01&pt=undefined&f=1&ty=1&ap=&as=&aty=0&a=">QQ客服</a>或拨打400-919-6663，<br>
        请随时关注您的<span class="tips"
              @click="routerTo('costmanager')">订单</span>。
      </p>
      <p v-if="result != '01'">
        失败原因：{{errMsg}}
      </p>
      <div class="backmsg"
           v-if="result == '01'">
        <span style="font-size: 16px;">{{second}}</span> 秒后，将自动跳转到首页
      </div>
    </div>
    <div class="foot">
      <el-button @click="goBack">返回</el-button>&nbsp;
      <el-button type="primary"
                 @click="routerTo('index')"
                 v-if="result == '01'">首页</el-button>
      <el-button type="primary"
                 @click="repay"
                 v-if="result != '01'">重新支付</el-button>
    </div>
  </div>
</template>
<script>
import base from "../mixin/base"
export default {
  mixins: [base],
  components: {},
  data() {
    return {
      result: '',
      errMsg: '',
      tradeNo: '',
      packageId: '',
      money: '',
      year: '1',
      second: 3,
    }
  },
  computed: {},
  watch: {
  },
  mounted() {
    this.$nextTick(() => {
      var res = this.$route.query.result;
      if (res == '01' || res == 'TRADE_SUCCESS') {
        this.result = '01'
      } else {
        this.result = '02'
        this.errMsg = '支付失败'
      }

      this.tradeNo = this.$route.query.orderNo
      this.getInfo()
    });
  },
  methods: {
    routerTo(val) {
      this.$router.push(val)
    },
    goBack() {
      this.$router.go(-1)
    },
    repay() {
      this.$router.push({ path: 'packpay', query: { id: this.packageId, tradeNo: this.tradeNo } })
    },
    getInfo() {
      var self = this;
      this.getWxPackagePayResult(this.tradeNo).then(res => {
        if (this.successCheckCode(res)) {
          this.packageId = res.data.packageOrder.packageId;
          this.money = res.data.packageOrder.amountPayable;
          if (this.result == '01') {
            setTimeout(() => {
              self.$router.push('/index')
            }, 3000);
            setInterval(() => {
              --self.second
            }, 1000);
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.packpayresult {
  .result {
    padding-top: 70px;
    padding-left: 190px;
    position: relative;
    & > div {
      font-size: 36px;
      color: #333;
      line-height: 50px;
    }
    .icon {
      display: inline-block;
      width: 44px;
      height: 50px;
      margin-right: 20px;
      vertical-align: middle;
      &.success {
        background: url(../../../../static/image/icon-paysuccess.png) no-repeat
          left 0;
      }
      &.fail {
        background: url(../../../../static/image/icon-payerror.png) no-repeat
          left 0;
      }
    }
    p {
      line-height: 30px;
      color: #626262;
      padding-left: 64px;
      margin-top: 10px;
      i {
        font-size: 20px;
        color: #000000;
      }
      .tips {
        color: #02adff;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .backmsg {
      width: 300px;
      height: 36px;
      line-height: 36px;
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #d2f2ff;
      border-radius: 4px;
      color: #989a9c;
      text-align: center;
      font-size: 14px;
    }
  }
  .foot {
    padding-right: 30px;
    text-align: right;
    margin-top: 167px;
    .el-button {
      width: 100px;
      height: 36px;
    }
  }
}
</style>
