<template>
  <div class="renewresult">
    <div class="orderpage-topbar clearfix">
      <div class="orderpage-tit">{{title}}</div>
      <div class="orderpage-progress"><img src="../../../../static/image/ukeyrenew4.png"></div>
    </div>
    <div class="orderpage-result">
      <div class="result-tit"><i class="iconsuccess"></i>恭喜，您的{{title}}成功！</div>
      <div class="result-cont">有效期增加<i>{{renewTime}}</i>年，若有任何疑问请联系<a class="tips"
           href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4009196663&cref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa&ref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa%2Fstyle%26id%3Dwpa_setting_a01&pt=undefined&f=1&ty=1&ap=&as=&aty=0&a=">QQ客服</a>或拨打400-919-6663。</div>
    </div>
    <div class="orderpage-footbtn">
      <el-button @click="routerTo('index')">返回首页</el-button>
      <el-button type="primary"
                 @click="routerTo('myseal')">继续续期</el-button>
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
      orderNo: '',
      pictureCode: '',
      userType: JSON.parse($.cookie("userinfo")).userType,
      title: '',
      bizValidStart: '',
      bizValidEnd: '',
      renewTime: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.orderNo = this.$route.query.orderNo;
    this.pictureCode = this.$route.query.pictureCode;
    this.renewTime = this.$route.query.renewTime;
    this.userType == '01'
      ? this.title = 'Ukey印章续期'
      : this.userType == '02'
        ? this.title = 'Ukey签名续期'
        : '';
    // this.getInfo();
  },
  methods: {
    routerTo(val) {
      this.$router.push(val);
    },
    getInfo() {
      this.getSignetInfo({
        orderNo: this.orderNo,
        pictureCode: this.pictureCode,
      }).then(res => {
        if (this.successCheckCode(res)) {
          this.bizValidStart = res.data.bizValidStart.substr(0, 10);
          this.bizValidEnd = res.data.bizValidEnd.substr(0, 10);
        }
      })
    }
  }
}
</script>
<style lang="scss">
.renewresult {
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
        background: url(../../../../static/image/icon-smile.png) no-repeat;
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
  }
}
</style>
