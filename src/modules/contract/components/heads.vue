<template>
  <div class="heads"
       :class="{ 'border-c-b': $route.name == 'index' && firstBorderColor }">
    <div class="heads-container">
      <div class="logo">
        <router-link to="/index">
          <img src="../../../../static/image/logo.png"
               alt />
        </router-link>
      </div>
      <el-menu :default-active="defalutPage"
               router
               class="el-menu-demo"
               mode="horizontal">
        <el-menu-item index="/index">
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/contractlist">
          <span>合同管理</span>
        </el-menu-item>
        <el-menu-item index="/templatemanage">
          <span>模板管理</span>
        </el-menu-item>
        <el-menu-item index="/sealmanage"
                      :class="{
                        'guide-active': guideStep == 2 && path == '/index',
                    }">
          <span>电子印章管理</span>
          <div class="guide-img"
               v-if="guideStep == 2 && path == '/index'"
               @click.stop="guideTo">
            <img src="../../../../static/image/guide-2.png"
                 alt="" />
            <span class="guide-skip"
                  @click.stop="guideSkip"></span>
            <span class="guide-addseal"
                  @click.stop="addSeal"></span>
          </div>
        </el-menu-item>
        <el-menu-item index="/usercenter"
                      :class="{
                        'guide-active': guideStep == 1 && path == '/index',
                    }">
          <span>用户中心</span>
          <div class="guide-img"
               v-if="guideStep == 1 && path == '/index'"
               @click.stop="guideTo">
            <img src="../../../../static/image/guide-1.png"
                 alt="" />
            <span class="guide-setpsd"
                  @click.stop="setSignPsd"></span>
          </div>
        </el-menu-item>
      </el-menu>
      <div class="head-right">
        <div class="head-right-item"
             :title="
                        realNameAuthenticationFlag == '1'
                            ? userName
                            : fomatUser(loginName)
                    ">
          <img src="../../../../static/image/icon-userphoto.svg"
               alt />
          <span id="head-right-item-name">
            {{
                            realNameAuthenticationFlag == "1"
                                ? userName
                                : fomatUser(loginName)
                        }}
          </span>
          <!--{{realNameAuthenticationFlag == '1'?userName:fomatUser(loginName)}}-->
          <el-select v-model="account"
                     placeholder="请选择账号"
                     @change="switchAccount">
            <!--个人未实名账号中，如果不是当前主账号则不显示-->
            <template v-for="item in enterpriseInfoList">
              <el-option :key="item.enterpriseId" 
                         v-if="(item.userType == '01' && (item.realNameAuthenticationFlag == 1 || item.loginAccountType == '01') || item.userType == '02')" 
                         :label="
                                item.realNameAuthenticationFlag == '1'
                                    ? item.enterPriseName
                                    : fomatUser(loginName)
                            "
                       :value="item.enterpriseId"
              >

              </el-option>
            </template>
            <!-- <el-option v-for="item in enterpriseInfoList"
                       :key="item.enterpriseId"
                       v-if="
                                (item.userType == '01' &&
                                    (item.realNameAuthenticationFlag == 1 ||
                                        item.loginAccountType == '01')) ||
                                item.userType == '02'
                            "
                       :label="
                                item.realNameAuthenticationFlag == '1'
                                    ? item.enterPriseName
                                    : fomatUser(loginName)
                            "
                       :value="item.enterpriseId"></el-option> -->
          </el-select>
        </div>
        <div class="head-right-item">
          <el-button type="text"
                     @click="goMessage()">
            <div class="head-right-item-message">
              <i class="dot"
                 v-show="hasMsg"></i>
              <img src="../../../../static/image/topmsg_logo.svg"
                   title="消息中心"
                   alt="消息中心" />
            </div>
          </el-button>
        </div>
        <div class="head-right-item">
          <el-button type="text"
                     @click="goHelp()">
            <img src="../../../../static/image/help.svg"
                 title="帮助中心"
                 alt="帮助中心" />
          </el-button>
        </div>
        <div class="head-right-item"
             v-if="!issignout">
          <el-button type="text"
                     @click="signout()">
            <img src="../../../../static/image/icon-signout.svg"
                 title="退出登录"
                 alt="退出登录" />
          </el-button>
        </div>
        <div class="head-right-item"
             v-if="issignout">
          <el-button type="text">
            <img src="../../../../static/image/icon-signout.svg"
                 title="退出登录"
                 alt="退出登录" />
          </el-button>
        </div>
      </div>
    </div>
    <div class="guide-model"
         @click.stop="guideTo"
         v-if="guideStep <= 2 && guideStep > 0 && path == '/index'"></div>     
  </div>
</template>
<script>
import service from "../../../assets/mixin/service";
import { mapState } from "vuex";
import * as mpush from "@/utils/mpush.js";
import { MSG_WS } from "../../../config/api";
import { windowOnBeforeunloadFn } from "@/utils";
export default {
  mixins: [service],
  components: {},
  data() {
    return {
      switch: false,
      pageTitles: "",
      pageTitle: "",
      userName: "",
      issignout: false,
      defalutPage: "",
      userType: "",
      userId: "",
      userinfo: {}, //登录用户信息
      realNameAuthenticationFlag: "",
      loginName: "",
      enterpriseInfoList: [],
      enterpriseId:
        $.cookie("userinfo") &&
        JSON.parse($.cookie("userinfo")).enterpriseId,
      account: "",
      width: "230px",
      firstBorderColor: true,
      path: "",
      socket: null,
      // hasMsg:false,//是否有未读的新消息
    };
  },
  computed: {
    // ...mapState({
    //     guideStep: store => store.change.guideStep
    // })
    guideStep: {
      get() {
        return this.$store.state.change.guideStep;
      },
      set(newValue) {
        this.$store.state.change.guideStep = newValue;
        localStorage.setItem("guideStep", newValue);
      },
    },
    hasMsg() {
      if (this.$store.getters.hasMsg == "true") {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    $route() {
      // localStorage.clear("navIndex"); // 清除合同管理的本地存储
      this.defalutPage = this.$route.meta.parentPath;
      this.pageTitles = this.$route.meta.parentName;
      this.pageTitle = this.$route.meta.title;
      this.path = this.$route.path;
      // this.routerName = this.$route.name
    },
    account(val) {
      // if(!this.switch){
      //     return
      // }
      // if(val.userType=='02'){
      //     this.switchAccount(val.enterpriseId,'02');
      // }else if(val.enterpriseId=='-1'){
      //     this.switchAccount(val.enterpriseId,'02');
      // }else{
      //     this.switchAccount(val.enterpriseId,'01');
      // }
    },
  },
  mounted() {
    let self = this;
    // console.log(JSON.parse($.cookie('userinfo')||{}));
    this.defalutPage = this.$route.meta.parentPath;
    this.pageTitles = this.$route.meta.parentName;
    this.pageTitle = this.$route.meta.title;
    this.path = this.$route.path;
    this.userinfo =
      $.cookie("userinfo") && JSON.parse($.cookie("userinfo"));
    this.realNameAuthenticationFlag =
      $.cookie("userinfo") &&
      JSON.parse($.cookie("userinfo")).realNameAuthenticationFlag;
    // console.log(this.realNameAuthenticationFlag)
    this.userName =
      $.cookie("userinfo") &&
      JSON.parse($.cookie("userinfo")).enterPriseName;
    this.loginName =
      $.cookie("userinfo") && JSON.parse($.cookie("userinfo")).loginName;
    let enterpriseInfoList =
      ($.cookie("userinfo") &&
        JSON.parse($.cookie("userinfo")).enterpriseInfoList) ||
      [];
    let newEnterpriseInfoList = enterpriseInfoList.map((item) => {
      if (item.userType == "02") {
        item.enterpriseId = item.personalId;
        item.enterPriseName = item.personalName;
      }
      return item;
    });
    this.userType =
      $.cookie("userinfo") && JSON.parse($.cookie("userinfo")).userType;

    this.enterpriseInfoList = newEnterpriseInfoList;
    this.account =
      $.cookie("userinfo") &&
      JSON.parse($.cookie("userinfo")).enterpriseId;
    this.mathNameWidth();
    /*if(this.userType=='02'){
            let data = {
                userType:'02',
                enterpriseId:JSON.parse($.cookie("userinfo")).userId,
                realNameAuthenticationFlag:this.realNameAuthenticationFlag,
                enterPriseName:this.userName,
 
                certificateNo:null,
                creditCode:"914419000929615103",
                personalId:JSON.parse($.cookie("userinfo")).userId,
                personalName:this.userName,
            }
            enterpriseInfoList.push(data)
            // this.account =data ;
            this.enterpriseInfoList = enterpriseInfoList;
            this.account = JSON.parse($.cookie("userinfo")).userId;
        }else{
            this.enterpriseInfoList = enterpriseInfoList;
            this.account = this.enterpriseInfoList[0].enterpriseId;
        }*/
    //        if(this.userType == '01'){ //企业
    //            this.userName = $.cookie('userinfo') && JSON.parse($.cookie('userinfo')).enterPriseName;
    //        }else if(this.userType == '02'){ //个人
    //            this.userName = $.cookie('userinfo') && JSON.parse($.cookie('userinfo')).loginName;
    //        }
    // if ($.cookie("token")) {
    //     this.issignout = true;
    // } else {
    //     this.issignout = false;
    // }
    // this.setMsgWebSocket();
    // $(window).bind('beforeunload', function () {
    //   return '您可能有数据没有保存';
    // });
    //实现关闭窗口则关闭mpush; 刷新则重新链接socket
    mpush.close();
    this.socket = null;
    // window.onbeforeunload = function () {
    //   return null;
    // }
    setTimeout(() => {
      this.setMsgWebSocket();
    }, 1000);
    this.timer = setInterval(() => {
      try {
        mpush.testPush("test"); //
      } catch (err) {
        mpush.close();
        console.log("断线了:------------------------------- " + err);
        this.socket = mpush.connect(
          MSG_WS,
          this.userinfo.currentUserId,
          {
            cbReceive: function (res) {
              if (res && res.data == 1) {
                self.$store.commit("SET_HASMSG", 1);
              }
            },
          }
        );
      }
    }, 15000);
    // windowOnBeforeunloadFn(() => {
    //   mpush.close();
    // });
  },
  methods: {
    signout() {
      this.issignout = true;
      this.loginOut()
        .then((res) => {
          if (this.successCheckCode(res)) {
            $.removeCookie("token", {
              path: "/",
              domain: this.$domain,
            });
            $.removeCookie("sessionToken", {
              path: "/",
              domain: this.$domain,
            });
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("sessionToken");
            sessionStorage.removeItem('isNewUser')
            $.removeCookie("userinfo", {
              path: "/",
              domain: this.$domain,
            });
            $.removeCookie("ukeylist", {
              path: "/",
              domain: this.$domain,
            });
            $.removeCookie("anyinUserinfo", {
              path: "/",
              domain: "i-yin.com.cn",
            });
            if (!this.guideStep) {
              $.cookie("isSign", false);
            }
            this.$message({
              message: `退出成功`,
              type: "success",
              duration: 1000,
            });
            localStorage.removeItem("anyinUserinfo");
            mpush.close();
            this.socket = null;
            this.$store.commit("DEL_MSG");
            setTimeout(() => {
              this.$router.push("/login");
            }, 1000);
          } else {
            this.issignout = false;
          }
        })
        .fail((res) => {
          this.issignout = false;
        });
    },
    goHelp() {
      window.open(
        "https://www.i-yin.com.cn/helps.html"
      );
    },
    goMessage() {
      this.$router.push("/messageManage");
    },
    fomatUser(val) {
      let a = val.substr(0, 3);
      let b = val.substr(-3);
      return a + "*****" + b;
    },
    switchAccount(id) {
      // 第一次不调用接口
      if (!this.switch) {
        this.switch = true;
        return;
      }
      let data = {
        clientId: "02",
        enterpriseIdOrPersonalId: id,
      };
      this.switchAccountOfEnterprise(data).then((res) => {
        if (this.successCheckCode(res)) {
          this.$message({
            message: `切换成功`,
            type: "success",
            duration: 1000,
          });
          console.log(res.data);
          // $.cookie("token", res.data.accessToken, { path: "/" });
          $.cookie('token', res.data.accessToken, { path: '/', domain: this.$domain });
          //   $.cookie('sessionToken', res.data.ucSessionToken, { path: "/", domain: this.$domain });
          sessionStorage.setItem("token", res.data.accessToken);
          let userinfo = JSON.parse($.cookie("userinfo"));

          userinfo.enterpriseInfoList = res.data.enterpriseInfoList;
          userinfo.enterPriseName = res.data.extEnterpriseName;
          userinfo.enterpriseId =
            res.data.currentPersonalIdOrEnterpriseId;
          userinfo.realNameAuthenticationFlag =
            res.data.currentAccountUserType == "01"
              ? res.data.masterAccountRealNameAuthenticationFlag
              : res.data.realNameAuthenticationFlag;
          userinfo.accountId = res.data.accountId;
          userinfo.userId = res.data.userId;
          userinfo.loginName = res.data.loginName;
          userinfo.userType = res.data.currentAccountUserType;
          (userinfo.isMainAccount = res.data.masterAccountFlag),
            (this.realNameAuthenticationFlag =
              userinfo.realNameAuthenticationFlag);
          this.loginName = userinfo.loginName;
          this.userName = userinfo.enterPriseName;

          // 更新currentUserId
          if (userinfo.userType == "01") {
            userinfo.enterpriseInfoList.map((listItem) => {
              if (
                listItem.enterpriseId ==
                res.data.currentPersonalIdOrEnterpriseId
              ) {
                userinfo.currentUserId = listItem.userId;
              }
            });
          } else {
            userinfo.enterpriseInfoList.map((listItem) => {
              if (
                listItem.personalId ==
                res.data.currentPersonalIdOrEnterpriseId
              ) {
                userinfo.currentUserId = listItem.userId;
              }
            });
          }
          this.mathNameWidth();
          $.cookie("userinfo", JSON.stringify(userinfo), {
            path: "/",
          });
          this.$store.commit("SET_HASMSG", res.data.notRead);
          // console.log(userinfo);
          // console.log(JSON.parse($.cookie("userinfo")));
          // $.cookie('userinfo', JSON.stringify({
          //     loginName: res.data.loginName,
          //     enterPriseName: res.data.extEnterpriseName,
          //     enterpriseId: res.data.currentPersonalIdOrEnterpriseId,
          //     accountId: res.data.accountId,
          //     userId: res.data.userId,
          //     userType: res.data.userType, //01：企业用户；02：个人用户
          //     realNameAuthenticationFlag: res.data.realNameAuthenticationFlag, //是否实名认证（0：未认证，1：认证）
          //     pictureCode: this.esealCode(this.loginForm.kpassword, 0),
          // }), { path: "/" })
          setTimeout(() => {
            if (this.$router.currentRoute.fullPath == "/index") {
              this.$router.go(0);
            } else {
              this.$router.replace("/index");
            }
            setTimeout(() => {
              location.reload();
            }, 500);
          }, 1000);
        }
      });
    },
    // 计算下拉框显示宽度
    mathNameWidth() {
      this.$nextTick(() => {
        let width = $("#head-right-item-name").width();
        width = width + 50 > 210 ? width + 50 + "px" : "210px";
        $(
          ".heads .head-right .head-right-item .el-input .el-input__inner"
        ).css("width", width);
      });
    },
    returnBorderColor(type) {
      this.firstBorderColor = type;
    },
    guideTo() {
      this.guideStep = ++this.guideStep;
      // this.$store.commit('changeGuideStep', guideStep);
      console.log(this.guideStep);
    },
    setSignPsd() {
      this.guideStep = ++this.guideStep;
      this.$router.push({
        path: "accountmanager",
        query: {
          safetyType: 2,
        },
      });
    },
    guideSkip() {
      this.guideStep = ++this.guideStep;
    },
    addSeal() {
      this.guideStep = ++this.guideStep;
      this.$router.push("sealmanage?from=index");
    },
    setMsgWebSocket() {
      const self = this;
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      if (!this.socket) {
        this.socket = mpush.connect(
          MSG_WS,
          this.userinfo.currentUserId,
          {
            cbReceive: function (res) {
              if (res && res.data == 1) {
                self.$store.commit("SET_HASMSG", 1);
              }
            },
          }
        );
      }
      // console.log(this.socket);
      // this.timer = setInterval(() => {
      //   try {
      //     mpush.send("test");
      //   } catch (err) {
      //     this.socket = mpush.connect(MSG_WS, this.userinfo.currentUserId, {
      //       cbReceive: function (res) {
      //         if (res && res.data == 1) {
      //           self.$store.commit('SET_HASMSG', 1);
      //         }
      //       }
      //     });
      //     console.log('断线了: ' + err)
      //   }
      // }, 10000)
    },
  },
  destroyed() {
    mpush.close();
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss">
.heads {
  position: relative;
  border-bottom: 1px solid #e8ecef;

  &.border-c-b {
    border-color: #01294b;
  }

  .heads-container {
    width: 1200px;
    margin: 0 auto;
    position: relative;
  }

  .logo {
    float: left;

    a {
      display: block;
    }

    img {
      display: block;
      height: 100%;
      margin-top: 16px;
      width: 100px;
    }
  }

  .el-menu {
    float: left;
    padding-left: 80px;
    background-color: #ffffff;

    .el-menu-item {
      height: 69px;
      line-height: 69px;
      border-bottom: 2px solid transparent;
      color: #626262;
      font-size: 16px;
      position: relative;
      cursor: auto;

      &:hover {
        background-color: #ffffff;
        color: #02adff;
        /*border-bottom: 2px solid #02ADFF;*/
      }

      & > span {
        cursor: pointer;
        display: block;
      }

      &.guide-active {
        z-index: 9999;
        background: #ffffff;
        line-height: 43px;
        margin-top: 13px;
        margin-bottom: 13px;
        height: 43px;
        border-radius: 43px;
        border-bottom: none;
      }

      .guide-img {
        position: absolute;
        left: 0;
        top: 43px;

        .guide-setpsd {
          position: absolute;
          width: 101px;
          height: 45px;
          bottom: 4px;
          left: 144px;
          cursor: pointer;
        }

        .guide-skip {
          position: absolute;
          left: 58px;
          bottom: 0px;
          width: 101px;
          height: 46px;
          cursor: pointer;
        }

        .guide-addseal {
          position: absolute;
          left: 202px;
          bottom: 0px;
          width: 118px;
          height: 46px;
          cursor: pointer;
        }
      }
    }

    .is-active {
      color: #02adff;
      border-bottom: 2px solid #02adff;
    }
  }

  .head-right {
    position: absolute;
    right: 0;
    height: 70px;

    .head-right-item {
      float: left;
      height: 70px;
      line-height: 70px;
      padding: 0 15px;
      color: #626262;
      font-size: 14px;

      &-message {
        position: relative;

        .dot {
          position: absolute;
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: red;
          right: 2px;
          top: 0;
        }
      }

      img {
        margin-right: 6px;
        vertical-align: -4px;
      }

      #head-right-item-name {
        display: none;
      }

      .el-input .el-input__inner {
        width: 230px;
      }
    }
  }
}
</style>
