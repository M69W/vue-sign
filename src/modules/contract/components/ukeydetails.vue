<template>
  <div class="ukeydetails">
    <div class="top-title">
      <div class="titinfo">Ukey续期订单查看</div>
      <div v-if="orderStatus === '02'"
           class="paystatus"
           :class="status == '1' ? 'success' : 'failed'"></div>
      <div v-if="orderStatus ==='03'"
           class="paystatus icon-audit"></div>
      <div v-if="orderStatus ==='04'"
           class="paystatus icon-nopass"></div>
      <div v-if="orderStatus ==='05'"
           class="paystatus icon-invalid"></div>
      <div v-if="orderStatus ==='06'"
           class="paystatus icon-production"></div>
      <div v-if="orderStatus ==='07' || orderStatus ==='10'"
           class="paystatus icon-logistics"></div>
      <div v-if="orderStatus ==='08'"
           class="paystatus icon-complete"></div>
    </div>
    <div class="order">
      <span class="label">订单号</span>
      {{orderNo}}
    </div>
    <div class="time">
      <span class="label">续期时间</span>
      <div class="detail"
           v-for="(item,index) in esealList"
           :key="index">
        <div class="years">
          <img src="../../../../static/image/icon-datatime.png"
               alt>
          <span v-if="item.renewalTime">{{item.renewalTime}}年</span>
        </div>
        <div class="grey">续期费用：{{sealPrice}}元</div>
        <div class="grey">有效期限：{{item.bizValidStart}} 至 {{item.bizValidEnd}}</div>
      </div>
    </div>
    <div class="info"
         v-if="orderInfo.buyerName">
      <span class="label">开票信息</span>
      <div>
        <span class="item">发票抬头</span>
        <span>{{orderInfo.buyerName}}</span>
      </div>
      <div style="margin-top:10px;"
           v-if="userType == '01'">
        <span class="item">税号</span>
        <span>{{orderInfo.buyerTaxerNo}}</span>
      </div>
    </div>
    <div class="info"
         v-else>
      <span class="label">开票信息</span>
      <div>无需开票</div>
    </div>
    <div class="signinfo"
         v-if="userType == '02'">
      <span class="label">签名信息</span>
      <el-table :data="esealList"
                style="width: 100%"
                stripe>
        <el-table-column :resizable="false"
                         prop="sign"
                         label="签名样式">
          <template slot-scope="scope">
            <img :src="scope.row.sealUrl"
                 class="signpic">
          </template>
        </el-table-column>
        <el-table-column :resizable="false"
                         prop="pictureName"
                         label="名称"></el-table-column>
        <el-table-column :resizable="false"
                         prop="pictureCode"
                         label="签名编码"></el-table-column>
        <el-table-column :resizable="false"
                         label="有效期">
          <template slot-scope="scope">
            <span>{{scope.row.bizValidStart}} 至 {{scope.row.bizValidEnd}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="signinfo"
         v-if="userType == '01'">
      <span class="label">印章信息</span>
      <el-table :data="esealList"
                style="width: 100%"
                stripe>
        <el-table-column :resizable="false"
                         prop="pictureName"
                         label="印章名称"></el-table-column>
        <el-table-column :resizable="false"
                         prop="esealTypeDesc"
                         label="印章类型"></el-table-column>
        <el-table-column :resizable="false"
                         prop="pictureCode"
                         label="印章编码"></el-table-column>
        <el-table-column :resizable="false"
                         label="有效期">
          <template slot-scope="scope">
            <span>{{scope.row.bizValidStart}} 至 {{scope.row.bizValidEnd}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="clearfix">
      <el-button style="margin-left:20px;"
                 type="primary"
                 v-if="orderStatus == '02'"
                 @click="repay">重新支付</el-button>
      <el-button @click="goBack">返回</el-button>
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
      status: "",
      orderNo: "",
      userType: JSON.parse($.cookie("userinfo")).userType,
      esealList: [],
      orderInfo: {},
      sealPrice: '',
      orderStatus: "", // 续期状态 (03:待审核 04:审核不通过 05:订单取消 06:生产中 07:物流中 08:订单完成) ,
      renewType: "" //01：ukey印章，02：云签名，03：云印章，04：ukey签名
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.orderNo = this.$route.query.orderNo;
    this.renewType = this.$route.query.pictureType;
    this.orderStatus = this.$route.query.orderStatus;
    var paystatus = this.$route.query.paystatus;
    console.log(paystatus);
    if (paystatus == "SUCCESS" || paystatus == "TRADE_SUCCESS") {
      this.status = "1";
    } else {
      this.status = "0";
    }
    this.getDetailData();
    this.getOrderConfirmData();
  },
  methods: {
    getOrderConfirmData() {
      this.getRenewOrderConfirm(this.orderNo, this.pageNum, 100).then(res => {
        if (this.successCheckCode(res)) {
          // this.esealList = res.data.sealList;
          // this.sealPrice = res.data.sealList[0].sealPrice;
          this.sealPrice = res.data.totalPrice;
        }
      });
    },
    getDetailData() {
      if (this.userType == "01") {
        this.orderDetailEnterprise(this.orderNo)
          .then(res => {
            if (this.successCheckCode(res)) {
              this.orderInfo = res.data;
              this.esealList = res.data.esealList;
              this.orderStatus = res.data.orderBasicInfo.orderStatus;
            }
          })
      } else if (this.userType == "02") {
        this.orderDetailPersonal(this.orderNo)
          .then(res => {
            if (this.successCheckCode(res)) {
              this.orderInfo = res.data;
            }
          })
      }
    },
    goBack() {
      // if (!this.orderStatus) {
      //     this.$router.push({
      //         name: "costmanager",
      //         params: {
      //             from: "ukeydetail"
      //         }
      //     });
      // } else {
      //     this.$router.push({
      //         name: "ukeyorder"
      //     });
      // }
      this.$router.go(-1);
    },
    repay() {
      this.$router.push({
        path: "/ukeyrenewpay",
        query: { orderNo: this.orderNo }
      });
    }
  }
};
</script>
<style lang="scss">
.ukeydetails {
  .top-title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    margin-bottom: 25px;
    position: relative;

    .titinfo {
      font-size: 18px;
      color: #333333;
    }

    .paystatus {
      width: 120px;
      height: 120px;
      position: absolute;
      right: 0;
      top: 0;

      &.success {
        background: url(../../../../static/image/pay_success.png) no-repeat;
      }

      &.failed {
        background: url(../../../../static/image/pay_failed.png) no-repeat;
      }
      &.icon-audit {
        background: url(../../../../static/image/icon-audit.png) no-repeat;
      }
      &.icon-nopass {
        background: url(../../../../static/image/icon-nopass.png) no-repeat;
      }
      &.icon-invalid {
        background: url(../../../../static/image/icon-invalid.png) no-repeat;
      }
      &.icon-production {
        background: url(../../../../static/image/icon-production.png) no-repeat;
      }
      &.icon-logistics {
        background: url(../../../../static/image/icon-logistics.png) no-repeat;
      }
      &.icon-complete {
        background: url(../../../../static/image/icon-complete.png) no-repeat;
      }
    }
  }

  .label {
    font-size: 16px;
    color: #0073bd;
    padding-left: 9px;
    line-height: 22px;
    margin-right: 42px;
    margin-bottom: 20px;
    display: inline-block;
    position: relative;

    &::before {
      content: "";
      width: 3px;
      height: 16px;
      position: absolute;
      left: 0;
      top: 3px;
      background: #0073bd;
    }
  }

  .order {
    margin-bottom: 14px;
  }

  .time {
    margin-bottom: 30px;

    .detail {
      background: #fafafa;
      border-radius: 4px;
      width: 354px;
      height: 180px;

      div {
        color: #626262;
        padding-left: 20px;
      }

      .years {
        font-size: 30px;
        color: #333333;
        padding-top: 30px;

        img {
          margin-right: 30px;
        }
      }

      .grey {
        height: 20px;
        line-height: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
      }
    }
  }

  .info {
    margin-bottom: 40px;

    div {
      height: 20px;
      line-height: 20px;

      span {
        // margin-left: 34px;
      }

      .item {
        width: 70px;
        display: inline-block;
        margin-right: 15px;
        color: #626262;
      }
    }
  }

  .signpic {
    width: 70px;
    height: 40px;
  }

  .el-button {
    margin-top: 50px;
    float: right;
    width: 100px;
    height: 36px;
  }
}
</style>
