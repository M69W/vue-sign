<template>
  <div class="coupon-item"
       :class="typeClass">
    <div class="coupon-item-logo"></div>
    <div class="coupon-item-top">
      <div class="coupon-item-top-money">{{item.couponType === 1? item.couponMoney+"元":item.couponMoney+"折"}}</div>
      <div class="coupon-item-top-base">满{{item.moreAvailable}}可用</div>
      <div class="coupon-item-top-time">{{item.receiveTime | changeReceiveTime}} 至 {{item.availableTime}}</div>
    </div>
    <div class="coupon-item-bottom">
      <div class="coupon-item-bottom-time">
        <span class="coupon-item-bottom-title">领券时间：</span>
        <span class="coupon-item-bottom-time-content coupon-item-bottom-content">{{item.receiveTime}}</span>
      </div>
      <div class="coupon-item-bottom-condition">
        <span class="coupon-item-bottom-title">仅限：</span>
        <span class="coupon-item-bottom-condition-text">
          {{item.productCodeList.indexOf(1)+1 ? '套餐' :''}}
          {{item.productCodeList.length > 1 ? '、' : ''}}
          {{item.productCodeList.indexOf(2)+1 ? 'ukey申请' :''}}
          {{item.productCodeList.length >2 ? '、': ''}}
          {{item.productCodeList.indexOf(4)+1 ? '续期' :''}}
        </span>
      </div>
      <div class="coupon-item-bottom-desc">
        <span class="coupon-item-bottom-desc-title coupon-item-bottom-title">说明：</span>
        <span class="coupon-item-bottom-desc-content coupon-item-bottom-content"
              :title="item.sendTips">{{item.sendTips}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  // status 状态：1已使用；2未使用；3已过期 ,
  props: {
    item: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  computed: {
    typeClass() {
      return {
        'money-item': this.item.couponType === 1 && this.item.status === 2,
        'discount-item': this.item.couponType === 2 && this.item.status === 2,
        'used-item': this.item.status === 1,
        'passed-item': this.item.status === 3,
      }
    }
  },
  data() {
    return {

    }
  },
}
</script>
<style lang="scss" scoped>
@import "src/assets/css/mixin.scss";
.coupon-item {
  width: 219px;
  position: relative;
  &-top {
    width: 100%;
    height: 120px;
    padding: 20px 0px 8px;
    @include bg-image("/static/image/coupon/money.svg");
    text-align: center;
    &-money {
      color: white;
      font-size: 30px;
    }
    &-base {
      color: white;
      font-size: 14px;
      margin: 8px 0;
    }
    &-time {
      font-size: 14px;
      color: #b24d4f;
    }
  }
  &-logo {
    position: absolute;
    width: 52px;
    height: 58px;
    right: 0;
    top: 0;
  }
  &-bottom {
    background: #f9f9f9;
    width: 100%;
    height: 128px;
    padding: 18px 14px 20px;
    &-title {
      font-size: 13px;
      color: #666666;
    }
    &-content {
      font-size: 14px;
      color: #999999;
    }
    &-time {
      &-content {
      }
    }
    &-desc {
      position: relative;
      &-title {
        top: 6px;
        position: absolute;
      }
      &-content {
        @include ellipsis2(3);
        &::before {
          display: inline-block;
          content: "";
          width: 44px;
          height: 20px;
        }
      }
    }
    &-condition {
      &-text{
        font-size: 13px;
        color: #999999;
      }
    }
  }
}
.discount-item {
  .coupon-item-top {
    @include bg-image("/static/image/coupon/discount.svg");
    &-time {
      color: #83d5f1;
    }
  }
}
.used-item {
  .coupon-item-top {
    opacity: 0.5;
  }
  .coupon-item-logo {
    @include bg-image("/static/image/coupon/used_logo.svg");
  }
}
.passed-item {
  .coupon-item-top {
    @include bg-image("/static/image/coupon/passed_bg.svg");
    &-time {
      color: #fff;
    }
  }
  .coupon-item-logo {
    @include bg-image("/static/image/coupon/passed_logo.svg");
  }
}
</style>