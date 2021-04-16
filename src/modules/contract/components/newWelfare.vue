<template>
  <div class="mask">
    <div class="con">
      <!-- 具体内容 -->
      <div class="task-con">
        <div class="item" v-for="(value,key,index) in welfare" :key="index">
          <div class="task-id">新人专享&nbsp;NO.{{index+1}}</div>
          <div class="task-detail">
            <p class="do" v-if="key === 'realNameFlag'">实名认证</p>
            <p class="do" v-if="key === 'launchCompactFlag'">发起一份合同</p>
            <p class="do" v-if="key === 'invitePersonalRegisterFlag'">邀请1位个人用户注册认证</p>
            <p class="do" v-if="key === 'inviteEnterpriseRegisterFlag'">邀请1位企业用户注册认证</p>

            <p class="get" v-if="key === 'realNameFlag'">获得10份合同套餐</p>
            <p class="get" v-if="key === 'launchCompactFlag'">获得5份合同套餐</p>
            <p class="get" v-if="key === 'invitePersonalRegisterFlag'">获得一张9折优惠券</p>
            <p class="get" v-if="key === 'inviteEnterpriseRegisterFlag'">获得一张8.5折优惠券</p>

            <div
              :data-name="key"
              :data-done="value"
              @click="goDone"
              class="go-done-btn"
              :class="value? 'done' : ''"
            >{{value?'已完成' : '去完成'}}</div>
          </div>
        </div>
      </div>
      <!-- 关闭 -->
      <div class="close" @click="close"></div>
    </div>
  </div>
</template>

<script>
import base from "../mixin/base";
export default {
  mixins: [base],
  props: {
    welfare: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userTask: []
    };
  },
  created() {
    // console.log(typeof this.welfare.realNameFlag);
  },
  methods: {
    close() {
      // console.log(this.$parent.showWelfare);
      this.$parent.showWelfare = false; // 直接修改父组件中的数据，关闭新手福利
      sessionStorage.setItem('isNewUser',false)
    },
    goDone(e) {
      // console.log(e.target.dataset.name,e.target.dataset.done);
      // console.log(e);
      
      // let done = e.target.dataset.done;
      let done;
      if(e.target.dataset){
        done = e.target.dataset.done
      }else{
        done = e.target.getAttribute('data-done') // 兼容ie
      }
      // 如果已完成， 直接退出本次点击事件
      if (done != "0") {
        return false;
      }

      // let taskName = e.target.dataset.name;
      let taskName;
      if(e.target.dataset){
        taskName = e.target.dataset.name
      }else{
        taskName = e.target.getAttribute('data-name')
      }
      // 跳转实名认证页面
      if (taskName === "realNameFlag") {
        this.$router.push({path:"/personauthen"});
      }
      // 跳转发起一份合同
      if (taskName === "launchCompactFlag") {
        this.checkPermission(
          // 权限校验
          this.$perMap.contractMgt.saveSignPosition.url
        ).then(res => {
          if (!this.successCheckCode(res)) {
            return;
          }
          if (this.$parent.isAuthentication == 0) {
            this.$parent.dialogTips = true;
          } else if (!this.$parent.phoneNum) {
            //未初始化绑定手机
            this.$router.push({
              path: "/companyinit"
            });
          } else {
            this.$router.push({
              path: "/contractsign",
              query: { index: true }
            });
          }
        });
      }
       // 跳转邀请页面
      if (taskName === "invitePersonalRegisterFlag" || taskName === 'inviteEnterpriseRegisterFlag') { 
        this.$router.push({
            path: "/invitation"
        })
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.mask {
  width: 100%;
  height: 100%;
  /* background-color: skyblue; */
  background-color: rgba(0,0,0,0.6);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  .con {
    width: 1093px;
    height: 495px;
    margin: 0 auto;
    margin-top: 202px;
    background: url("../../../../static/image/newWelfare/bg.svg") no-repeat
      center center;
    position: relative;
    .task-con {
      // display: flex;
      width: 100%;
      height: 182px;
      padding: 0 29px 0 29px;
      // background-color: #fff;
      position: absolute;
      bottom: 73px;
      left: 50%;
      transform: translateX(-50%);
      .item {
        box-sizing: border-box;
        width: 234px;
        height: 100%;
        float: left;
        background-color: #ffecce;
        margin-right: 32px;
        border: 1px dashed #a66906;
        // border-style: inset dashed;
        border-radius: 20px;
        position: relative;
        &::after {
          content: "";
          display: block;
          width: 12px;
          height: 26px;
          box-sizing: border-box;
          border-left: 12px solid #fff;
          border-top: 13px solid transparent;
          border-bottom: 13px solid transparent;
          position: absolute;
          top: 48%;
          right: -22px;
        }
        &:last-child {
          margin-right: 0px;
          &::after {
            display: none;
          }
        }
        .task-id {
          width: 190px;
          height: 31px;
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: url("../../../../static/image/newWelfare/stepBg.svg")
            no-repeat center;
          text-align: center;
          line-height: 31px;
          color: #fff;
          font-size: 14px;
        }
        .task-detail {
          width: 100%;
          height: 100%;
          padding-top: 39px;
          text-align: center;
          p {
            font-size: 16px;
            color: #333;
            margin-bottom: 8px;
            line-height: 22px;
          }
          .get {
            color: #f76300;
            margin-bottom: 20px;
          }
          .go-done-btn {
            width: 143px;
            height: 40px;
            margin: 0 auto;
            background: url("../../../../static/image/newWelfare/goDone.svg")
              no-repeat center;
            text-align: center;
            font-size: 16px;
            color: #fff;
            line-height: 34px;
            border-radius: 20px;
            box-shadow: 0 4px 1px 0 #e26214;
            cursor: pointer;
            user-select: none;
          }
          .done {
            background: url("../../../../static/image/newWelfare/done.svg")
              no-repeat center;
            height: 46px;
            line-height: 40px;
            box-shadow: none;
          }
        }
      }
    }
    .close {
      width: 28px;
      height: 28px;
      position: absolute;
      // background-color: skyblue;
      box-sizing: border-box;
      top: 154px;
      right: 0;
      border: 2px solid #fff;
      border-radius: 50%;
      background:url('../../../../static/image/close.png') no-repeat center center;
      /* ie9 不支持伪元素，直接采用关闭按钮图片 */
      /* &::before {  
        content: "";
        display: inline-block;
        width: 13px;
        height: 13px;
        position: absolute;
        top: 10px;
        left: 9px;
        border-left: 2px solid #fff;
        transform: rotateZ(45deg);
      }
      &::after {
        content: "";
        display: inline-block;
        width: 13px;
        height: 13px;
        position: absolute;
        top: 1px;
        left: 9px;
        border-left: 2px solid #fff;
        transform: rotateZ(-45deg);
      } */
    }
  }
}
</style>>
