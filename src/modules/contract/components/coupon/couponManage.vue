<template>
  <div class="coupon-center">
    <div class="coupon-title">我的优惠券</div>
    <div class="coupon-main">
      <div class="coupon-main-top clearfix">
        <div class="main-top-left">
          <el-radio-group v-model="status"
                          class="main-top-left-select"
                          @change="getDiffReadTypeFn">
            <el-radio-button :label="-1">
              <span>全部</span>
            </el-radio-button>
            <el-radio-button :label="2">
              <span>可用券</span>
            </el-radio-button>
            <el-radio-button :label="1">
              <span>已使用</span>
            </el-radio-button>
            <el-radio-button :label="3">
              <span>已过期</span>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="coupon-main-content">
        <div class="coupon-main-content-inner clearfix">
          <coupon-item v-for="(titem,index) in tableData"
                       :key="index"
                       :item="titem"
                       class="coupon-bottom fl"
                       :style="(index+1)%4 !== 0?'margin-right:18px':''"></coupon-item>
        </div>
        <div v-if="tableData.length <= 0"
             style="text-align: center; margin-top:120px;">
          暂无优惠券
        </div>
      </div>
    </div>
    <el-pagination class="pagination-wrap"
                   :page-size="pageSize"
                   layout="prev,pager,next,total"
                   @current-change="handleCurrentChange"
                   @size-change="handleCurrentSize"
                   :total="total"
                   :current-page.sync="pageNum"
                   v-show="tableData.length>0">
    </el-pagination>
  </div>
</template>
<script>
import base from "../../mixin/base";
import couponItem from './couponItem';
// import * as SockJS from 'sockjs-client';
import moment from 'moment';
export default {
  mixins: [base],
  components: { couponItem },
  data() {
    return {
      status: -1,//是否已读:0、未读；1、已读 全部-1,
      userId: JSON.parse($.cookie("userinfo")).currentUserId, //用户id
      pageSize: 8,
      pageNum: 1, //当前页数
      total: 0,
      tableData: []
    };
  },
  mounted() {
    this.getCouponListFn();
    // const self = this
    // // 断开重连机制,尝试发送消息,捕获异常发生时重连
    // mpush.connect('ws://10.9.2.146:8008',this.userId);
    // this.timer = setInterval(() => {
    //     try {
    //         // mpush.connect('ws://192.168.51.218:6381');
    //     } catch (err) {
    //         mpush.connect('ws://10.9.2.146:8008',this.userId);
    //         console.log('断线了: ' + err)
    //     }
    // }, 5000)
    // let sockjs = new SockJS('10.9.2.146:8008');

    //  mock 数据
        // setTimeout(()=>{
        //     let records = {
        //         accountName:"zfdsafdsf", /* (string, optional): 领取者姓名 , */
        //         accountNumber:'18312537527', /* (string, optional): 领取者手机号 , */
        //         availableDay:30, /* (integer, optional): 有效期（天数） , */
        //         batchNumber:'1234', /* (string, optional): 发放批次号 , */
        //         couponMoney: 80, /* (number, optional): 卡券面额 , */
        //         couponName:'哈哈哈', /* (string, optional): 卡券名称 , */
        //         couponNumber:"010101", /* (string, optional): 优惠券编号（券码） , */
        //         couponType: 2, /* (integer, optional): 卡券类型：1现金券；2折扣券 , */
        //         createTime: new Date(), /* (string, optional): 创建时间 , */
        //         discount: 10, /* (integer, optional): 折扣金额 , */
        //         id: '01kk', /* (string, optional): 主键id , */
        //         moneyType: 1, /* (integer, optional): 面额单位：1元；2折扣 , */
        //         moreAvailable: 300, /* (number, optional): 满多少金额可用 , */
        //         productCodeList: [1,2], /* (Array[integer], optional): 适用产品编码(1:合同套餐;2:ukey申请;4:ukey续期) , */
        //         receiveTime: new Date(), /* (string, optional): 领取时间 , */
        //         sendTips: 'buzhidoa', /* (string, optional): 发送来源 , */
        //         status: 3, /* (integer, optional): 状态：1已使用；2未使用；3已过期 , */
        //         userId: '4' /* (string, optional): 领取者用户id */
        //     };
        //     this.tableData.push(records);
        // },1000)
  },
  methods: {
    getCouponListFn() {
      let data = {
        "pageNum": this.pageNum,
        "pageSize": this.pageSize,
        "status": this.status == -1 ? "" : this.status
      }
      this.getCouponList(data).then(res => {
        if (this.successCheckCode(res)) {
          let tableData = res.data.records;
          tableData.forEach(element => {
            element.availableTime = moment(element.receiveTime).add(element.availableDay, 'day').format('YYYY-MM-DD');
          });
          this.tableData = res.data.records;

          this.total = res.data.total;
        }
      });
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getCouponListFn();
    },
    handleCurrentSize() { },
    getDiffReadTypeFn(val) {
      this.pageNum = 1;
      this.getCouponListFn();
    },
  }
};
</script>
<style lang="scss" scoped>
@import "src/assets/css/mixin.scss";

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  background-color: #d8d8d8;
  vertical-align: middle;
}

.red_bg {
  background-color: red;
}
.coupon-bottom {
  margin-bottom: 20px;
}
.coupon-center {
  .coupon-title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    font-size: 18px;
    color: #333333;
  }

  .coupon-main-top {
    padding: 20px 0;

    .main-top-left {
      float: left;
    }
  }
  .pagination-wrap {
    float: right;
  }
}
</style>
<style lang="scss">
.coupon-main-top {
  .main-top-left {
    &-select {
      .el-radio-button {
        .el-radio-button__inner {
          display: inline-block;
          width: 74px;
          height: 36px;
          line-height: 36px;
          padding: 0;
          font-size: 14px;
          color: #99a9bf;
        }
      }

      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        color: white;
        background-color: #02adff;
      }
    }
  }
}
.center-confirm {
  .el-message-box__btns {
    text-align: center;
  }
}
</style>
