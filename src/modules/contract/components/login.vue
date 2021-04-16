<template>
  <div class="login">
    <regheader></regheader>
    <ad-banner :adObj="objAd"
               defaultImg="/static/image/login_bg.jpg"></ad-banner>
    <div class="login-bottom">
      <div class="login-bottom-content">
        <div class="deviation">
          <div class="ad"></div>
          <div class="loginBox">
            <div class="title">用户登录</div>
            <el-form :model="loginForm"
                     :rules="rules"
                     ref="login">
              <div class="tab">
                <span :class="{ active: loginType }"
                      @click="lognType('login', 1)">账号登录</span>
                <!--
                                    -->
                <span :class="{ active: !loginType }"
                      @click="lognType('login', 0)">UKey登录</span>
              </div>
              <div v-if="loginType">
                <el-form-item prop="account"
                              v-if="verifyType">
                  <el-input v-model="loginForm.account"
                            icon="search user_bg"
                            placeholder="请输入手机号/邮箱"
                            ref="user"
                            @focus="addstyle($event, 0)"
                            @blur="delstyle($event, 0)"></el-input>
                  <span class="close"
                        @click="clear(0)"
                        v-if="loginForm.account"></span>
                </el-form-item>
                <el-form-item prop="telphone"
                              v-else>
                  <el-input v-model="loginForm.telphone"
                            icon="search user_bg"
                            placeholder="请输入手机号"
                            ref="user"
                            @focus="addstyle($event, 0)"
                            @blur="delstyle($event, 0)"></el-input>
                  <span class="close"
                        @click="clear(4)"
                        v-if="loginForm.telphone"></span>
                </el-form-item>
                <el-form-item prop="password"
                              v-if="verifyType">
                  <el-input v-model="loginForm.password"
                            icon="search psd_bg"
                            :type="visible"
                            placeholder="请输入密码（8~20位字符）"
                            ref="pass"
                            @focus="addstyle($event, 1)"
                            @blur="delstyle($event, 1)"
                            @keyup.native.enter="
                                            submit_Form('login')
                                        "></el-input>
                  <span class="close psdClose"
                        @click="clear(1)"
                        v-if="loginForm.password"></span>
                  <span :class="visible"
                        @click="changeVisible(visible)"></span>
                </el-form-item>
                <el-form-item prop="verifyCode"
                              v-else>
                  <el-input v-model="loginForm.verifyCode"
                            icon="search psd_bg"
                            placeholder="请输入验证码"
                            ref="pass"
                            class="verifyCode"
                            @focus="addstyle($event, 1)"
                            @blur="delstyle($event, 1)"
                            @keyup.native.enter="
                                            submit_Form('login')
                                        "></el-input>
                  <el-button class="getcode"
                             @click="getCode"
                             :max="6"
                             :loading="loadingBtn">{{
                                            countdown == 0
                                                ? "获取验证码"
                                                : countdown + "s"
                                        }}</el-button>
                </el-form-item>
              </div>
              <!-- <el-input v-model="visible"></el-input> -->
              <div v-if="!loginType">
                <el-form-item prop="ukey">
                  <el-input class="ukeyIpt"
                            v-model="loginForm.ukey"
                            icon="search key_bg"
                            placeholder="请插入UKEY电子印章，点击读取"
                            ref="ukey"
                            @focus="addstyle($event, 2)"
                            @blur="delstyle($event, 2)"
                            readonly></el-input>
                  <!-- <span class="close" @click="clear(2)" v-if="loginForm.ukey"></span> -->
                  <el-button class="readKey"
                             @click="checkUkeyVer(readUkey)">读取</el-button>
                </el-form-item>
                <el-form-item prop="kpassword">
                  <el-input v-model="loginForm.kpassword"
                            icon="search pin_bg"
                            type="password"
                            placeholder="请输入签章密码(PIN码)"
                            ref="kpass"
                            @focus="addstyle($event, 3)"
                            @blur="delstyle($event, 3)"></el-input>
                  <span class="close"
                        @click="clear(3)"
                        v-if="loginForm.kpassword"></span>
                </el-form-item>
              </div>
              <div class="remeber">
                <span class="change-login"
                      v-if="loginType"
                      @click="changeVerify">{{
                                        verifyType
                                            ? "验证码登录"
                                            : "帐号密码登录"
                                    }}</span>
                <el-checkbox v-model="checked"
                             v-if="loginType && verifyType">记住密码</el-checkbox>
                <a class="forget"
                   href="javascript:;"
                   @click="routerTo('forgetpsd')"
                   v-if="loginType && verifyType">忘记密码</a>
                <a class="forget"
                   href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4009196663&cref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa&ref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa%2Fstyle%26id%3Dwpa_setting_a01&pt=undefined&f=1&ty=1&ap=&as=&aty=0&a="
                   @click="routerTo('')"
                   v-if="!loginType">忘记PIN码</a>
                <span class="errTip"
                      v-if="errTip">账号或密码错误，请输入正确的账号和密码。</span>
              </div>
              <!-- <select class="form-control seleBook" id="seleBook" name="seleBook">
                                     <option value=""><span> 选择证书 </span></option>
                                </select>-->
              <div class="loginBtn">
                <el-button type="primary"
                           @click="submit_Form('login')"
                           :class="{ active: isActive }">登录
                </el-button>
              </div>
            </el-form>
            <p class="reg"
               v-if="loginType">
              没有账号？
              <a href="javascript:;"
                 @click="routerTo('register')">马上免费注册>></a>
            </p>
            <p class="reg"
               v-if="!loginType"
               style="color:#d5dde6;">
              <a @click="getDown"
                 target="_self">下载驱动</a>
              |
              <a href="javascript:;"
                 @click="routerTo('register')">免费注册</a>
            </p>
          </div>
        </div>
        <p class="Copyright">
          Copyright 2014-2020
          深圳市安印科技有限公司&nbsp;&nbsp;&nbsp;粤ICP备16033566
        </p>
      </div>
    </div>
    <!-- <transition name="fade">
            <div class="errorInfo" v-if="errInfo">
                {{
                    errTime != 3
                        ? "用户名或密码错误，剩余" +
                          errTime +
                          "次机会，之后将被冻结1小时"
                        : "密码错误超过2次，请拖动滑块进行验证"
                }}
            </div>
        </transition> -->
    <!-- 错误2次以上拖动验证 -->
    <slide-fixed @checked-ok="checkedOk"
                 v-if="errInfo"></slide-fixed>
  </div>
</template>
<script>
import ukey from "../../../assets/plugin/ukey";
import regheader from "../../../components/regheader";
import valid from "../mixin/valid";
import base from "../mixin/base";
import service from "../../../assets/mixin/service";
import SlideFixed from "../../../components/slideFixed";
import { encryption, decrypt, sessionStore } from "@/utils";
import adBanner from "../../../components/adBanner";
export default {
  mixins: [valid, service],
  components: { regheader, SlideFixed, adBanner },
  data() {
    var validateUser = (rule, value, callback) => {
      // let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,}$/
      if (!value) {
        return callback(new Error("请输入您注册的账户"));
      } else if (
        !/^1[3-9][0-9]{9}$/.test(value) &&
        !/^([a-z0-9A-Z]+[-|_|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/.test(
          value
        )
      ) {
        return callback(new Error("请输入正确的手机号和邮箱"));
      }
      callback();
    };
    var validateUkey = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择UKEY"));
      }
      callback();
    };
    var validateKPass = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z]{4,}$/;
      if (!value) {
        return callback(new Error("PIN码不能为空"));
      } else if (!reg.test(value)) {
        return callback(new Error("PIN码为4位以上"));
      }
      callback();
    };
    //密码校验
    var validcheckPasswords = (rule, value, callback) => {
      // let reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
      // 8-20位数字和字母
      // let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
      let reg = /^[0-9A-Za-z]{8,20}$/;
      if (!value) {
        callback(new Error("密码不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入8~20位字符"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else if (!/^1[3-9][0-9]{9}$/.test(value)) {
        return callback(new Error("请输入正确的手机号"));
      }
      callback();
    };
    return {
      loginForm: {
        account: "",
        password: "",
        graphicCode: "",
        ukey: "",
        kpassword: "",
        loadingBtn: false,
        telphone: "",
        verifyCode: ""
      },
      rules: {
        account: [{ validator: validateUser, trigger: "blur" }],
        password: [{ validator: validcheckPasswords, trigger: "blur" }],
        ukey: [{ validator: validateUkey, trigger: "blur" }],
        kpassword: [{ validator: validateKPass, trigger: "blur" }],
        telphone: [{ validator: validatePhone, trigger: "blur" }],
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ]
      },
      // ukeylist: [],
      loginType: true, //true为账户登录，false为ukey登录
      checked: false,
      visible: "password",
      errTip: false,
      errTime: 5,
      errInfo: false,
      isActive: false,
      ctx: "http://127.0.0.1:9825/",
      UKeyNum: 0, //插入ukey数目,
      isIe: false,
      ukeyInfo: [],
      verifyType: true,
      countdown: 0,
      timer: null,
      loadingBtn: false,
      objAd: null,//广告
      channelCode:'', // 渠道标识
    };
  },
  computed: {},
  watch: {
    checked() {
      if (this.checked) {
        $(".el-checkbox__label").addClass("isChecked");
      } else {
        $(".el-checkbox__label").removeClass("isChecked");
      }
    },
    loginForm: {
      handler() {
        if (
          this.loginForm.account ||
          this.loginForm.ukey ||
          this.loginForm.telphone
        ) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
      },
      deep: true
    }
  },
  mounted() {
    // $.cookie("isSign", false);
    this.channelCode = this.getQueryString('source');
    this.isIE();
    this.$nextTick(() => {
      if (localStorage.loginInfo) {
        let loginInfo =
          localStorage.loginInfo &&
          JSON.parse(localStorage.loginInfo);
        loginInfo = decrypt({
          data: loginInfo,
          param: ["password"]
        });
        this.loginForm.account = loginInfo.account;
        this.loginForm.password = loginInfo.password;
        this.checked = true;
      }
      if (this.loginForm.account) {
        this.isActive = true;
      }
    });
    //登录方式
    if (this.$route.query.Type && this.$route.query.Type === "ukey") {
      this.loginType = false;
    }
    this.getAdListFn();
  },
  methods: {
    isIE() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        this.isIe = true;
      } else {
        this.isIe = false;
      }
      // console.log(this.isIe);
    },
    //样式交互
    addstyle(event, index) {
      // event.target.removeAttribute('readonly');
      if (index == 0) {
        this.$refs.user.$el.children[1].style.borderColor = "#02ADFF";
      } else if (index == 1) {
        this.$refs.pass.$el.children[1].style.borderColor = "#02ADFF";
      } else if (index == 2) {
        this.$refs.ukey.$el.children[1].style.borderColor = "#02ADFF";
      } else if (index == 3) {
        this.$refs.kpass.$el.children[1].style.borderColor = "#02ADFF";
      }
    },
    //样式交互
    delstyle(event, index) {
      // event.target.setAttribute('readonly','true');
      if (index == 0) {
        this.$refs.user.$el.children[1].style.borderColor = "#C0CCDA";
      } else if (index == 1) {
        this.$refs.pass.$el.children[1].style.borderColor = "#C0CCDA";
      } else if (index == 2) {
        this.$refs.ukey.$el.children[1].style.borderColor = "#C0CCDA";
      } else if (index == 3) {
        this.$refs.kpass.$el.children[1].style.borderColor = "#C0CCDA";
      }
    },
    clear(index) {
      if (index == 0) {
        this.loginForm.account = "";
      } else if (index == 1) {
        this.loginForm.password = "";
      } else if (index == 2) {
        this.loginForm.ukey = "";
      } else if (index == 3) {
        this.loginForm.kpassword = "";
      } else if (index == 4) {
        this.loginForm.telphone = "";
      }
    },
    //更新图形码
    replace() { },
    //切换登录类型
    lognType(ref, val) {
      this.errTip = false;
      if (val == 1) {
        this.$refs[ref].resetFields();
        if (localStorage.loginInfo) {
          let loginInfo =
            localStorage.loginInfo &&
            JSON.parse(localStorage.loginInfo);
          loginInfo = decrypt({
            data: loginInfo,
            param: ["password"]
          });
          this.loginForm.account = loginInfo.account;
          this.loginForm.password = loginInfo.password;
          this.checked = true;
        }
        this.loginType = true;
      } else if (val == 0) {
        this.$refs[ref].resetFields();
        this.loginType = false;
        this.countdown = 0;
        clearInterval(this.timer);
      }
    },
    //登录验证
    submit_Form(ref) {
      this.$refs[ref].validate(valid => {
        if (valid) {
          if (!this.loginType) {
            this.loginKey({
              keyid: this.ukeylist[0].key_id,
              pin: this.loginForm.kpassword
            }).then(data => {
              const res = JSON.parse(data || {});
              if (this.successUKeyCheckCode(res)) {
                this.login();
              }
            });
          } else {
            this.login();
          }
        } else {
          return false;
        }
      });
    },
    //登录请求
    async login() {
      // this.loginForm.loadingBtn = true;
      if (this.loginType) {
        //账号登录
        let data = {
          // account: this.loginForm.account,
          // password: this.loginForm.password,
          decryptFlag: 1, //是否需要解密标志：1解密；0否
          bizCode: "iyin_contract", //iyin_contract、iyin_saas 、iyin_xing_zuo、iyin_cloud_sign
          clientId: "02" //客服端ID 01:api 02:浏览器 03：app ,
          // graphicCode:this.loginForm.graphicCode,
        };
        if (this.verifyType) {
          data.account = this.loginForm.account;
          data.password = this.loginForm.password;
          data = encryption({
            //暂时关闭
            data: data,
            param: ["password"]
          });
          console.log(data);
          this.userLogin(data)
            .done(res => {
              console.log(res);
              this.loginSuccess(res, data); //data 密码加密后
            })
            .fail(() => { });
        } else {
          //手机号登录
          data.phone = this.loginForm.telphone;
          data.smsCode = this.loginForm.verifyCode;
          this.loginSms(data).then(res => {
            this.loginSuccess(res);
          });
        }
      } else {
        //ukey登录
        let data = {};
        this.getCertInfoObjFn(this.ukeylist[0].key_id).then(res => {
          if (this.successUKeyCheckCode(res)) {
            res = JSON.parse(res);
            this.ukeyInfo = res.info;
            this.ukeyInfo.forEach(element => {
              for (const key in element) {
                switch (element.item_type) {
                  case 0:
                    data.enterpriseName = element.item_info;
                    break;
                  case 1:
                    data.oid = element.item_info;
                    break;
                  case 2:
                    data.mediumType = element.item_info;
                    break;
                  case 3:
                    data.pictureCode = element.item_info;
                    // Fix 签署的时候无法获取 pictureCode 的问题，做个缓存
                    sessionStore.set('curPictureCode', element.item_info)
                    break;
                  case 4:
                    data.userType = element.item_info;
                    break;
                  case 5:
                    data.validStart = element.item_info;
                    break;
                  case 6:
                    data.validEnd = element.item_info;
                    break;
                  case 7:
                    data.vid = element.item_info;
                    break;
                  case 8:
                    data.creditCode = element.item_info;
                    break;
                  case 10:
                    data.signCertificateSn =
                      element.item_info;
                    break;
                  case 11:
                    data.encryptSN = element.item_info;
                    break;
                  case 14:
                    data.certIssuer = element.item_info;
                    break;
                  case 15:
                    data.certSignAlgorithm =
                      element.item_info;
                    break;
                  case 16:
                    data.certVersion = element.item_info;
                    break;
                  case 17:
                    data.certSealSealTag =
                      element.item_info;
                    break;
                  case 18:
                    data.certSealSignName =
                      element.item_info;
                    break;
                  case 19:
                    data.sealSignTypeDesc =
                      element.item_info;
                    break;
                  case 20:
                    data.sealSealImg = element.item_info;
                    break;
                  case 21:
                    data.pictureWidth = element.item_info;
                    break;
                  case 22:
                    data.pictureHeight = element.item_info;
                    break;
                  case 27:
                    data.certType = element.item_info;
                  default:
                    break;
                }
              }
            });
          }
        });
        if (
          data.certType == "gass" &&
          data.sealSignTypeDesc == "电子私章"
        ) {
          return this.$message.error(
            "暂不支持个人三所电子印章，敬请期待"
          );
        }
        data.signCertValue = this.getCertValue({
          keyid: this.ukeylist[0].key_id,
          certtype: 0 //0签名证书1：加密证书
        });
        data.encryptCertValue = this.getCertValue({
          keyid: this.ukeylist[0].key_id,
          certtype: 1 //0签名证书1：加密证书
        });
        if (data.certType == "skf_kfx") {
          //科富兴ukey判断
          data.certSealSealTag = "skf_kfx";
        }
        this.ukeyLogin(data).then(res => {
          let code = res.code;
          if (code === 0) {
            this.success(
              res,
              data.pictureCode,
              data.signCertificateSn
            );
          } else if (
            (code === 2038 ||
              code === 2037 ||
              code === 2025 ||
              code === 2003 ||
              code === 2035) &&
            data.certSealSealTag == "000000"
          ) {
            //信息补全
            let loading = this.$loading({
              lock: true,
              text: "当前用户数据正在同步，请耐心等待",
              customClass: "icon-none"
            });
            data.mediumType =
              data.mediumType == 0
                ? (data.mediumType = 2)
                : (data.mediumType = 1); //1为ODC，2为IYIN
            data.userType =
              data.userType == 1 ||
                data.sealSignTypeDesc == "电子私章"
                ? (data.userType = "02")
                : (data.userType = "01"); //01-单位用户 ， 02-普通个人用户
            data.signSN = data.signCertificateSn;
            let certType = data.certType.toUpperCase();
            data.vid =
              certType == "GDCA"
                ? (data.vid = "01")
                : certType == "NETCA"
                  ? (data.vid = "02")
                  : certType == "SZCA"
                    ? (data.vid = "03")
                    : certType == "BJCA"
                      ? (data.vid = "04")
                      : certType == "GASS"
                        ? (data.vid = "05")
                        : (data.vid = "");
            if (data.enterpriseName.indexOf("@") != -1) {
              let arr = data.enterpriseName.split("@");
              data.enterpriseName = arr[0];
            }
            this.ukeyUpdata(data)
              .then(ret => {
                if (this.successCheckCode(ret)) {
                  this.success(
                    ret,
                    data.pictureCode,
                    data.signCertificateSn
                  );
                }
                setTimeout(() => {
                  loading.close();
                }, 1500);
              })
              .fail(ret => {
                setTimeout(() => {
                  loading.close();
                }, 1500);
              });
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    loginSuccess(res, pwddata) {
      //pwddata:用户密码登录 密码加密后的值
      if (this.successCheckCode(res)) {
        this.errTip = false;
        $.cookie("token", res.data.accessToken, {
          path: "/",
          domain: this.$domain
        });
        $.cookie("sessionToken", res.data.ucSessionToken, {
          path: "/",
          domain: this.$domain
        });
        sessionStorage.setItem("token", res.data.accessToken);
        sessionStorage.setItem("sessionToken", res.data.ucSessionToken);
        let userinfo = JSON.stringify({
          loginName: res.data.loginName,
          enterPriseName: res.data.extEnterpriseName,
          accountId: res.data.accountId,
          enterpriseId: res.data.currentPersonalIdOrEnterpriseId,
          userId: res.data.userId,
          currentUserId: res.data.userId,
          userType: res.data.userType, //01：企业用户；02：个人用户
          realNameAuthenticationFlag:
            res.data.realNameAuthenticationFlag, //是否实名认证（0：未认证，1：认证）
          enterpriseInfoList: res.data.enterpriseInfoList,
          isMainAccount: "1"
        });
        $.cookie("userinfo", userinfo, {
          path: "/",
          domain: this.$domain
        });
        if (this.checked) {
          //记住密码
          // localStorage.loginInfo = JSON.stringify({
          //     account: this.loginForm.account,
          //     password: this.loginForm.password
          // });
          localStorage.loginInfo = JSON.stringify(pwddata);
        } else {
          this.loginForm.account = "";
          this.loginForm.password = "";
          localStorage.removeItem("loginInfo");
        }
        this.$store.commit("SET_HASMSG", res.data.notRead); //设置是否有未读消息noRead 0无 1有
        this.$message({
          message: "登录成功",
          type: "success",
          duration: 1000
        });
        setTimeout(() => {
          this.$router.push("/index");
        }, 1000);
      } else {
        if (res.data && res.data.accessToken == null) {
          this.errTip = true;
        }
        if (res.data && res.data.passwordErrorTimes) {
          let str =
            res.data.passwordErrorTimes == 3
              ? "登录剩余2次机会，账户将会冻结1小时!"
              : res.data.passwordErrorTimes == 4
                ? "登录剩余1次机会，账户将会冻结1小时!"
                : res.data.passwordErrorTimes == 5
                  ? "密码错误超过5次，账户已冻结，请1小时后再试!"
                  : "";
          str && this.$message.warning(str);
        }
        if (res.data && res.data.needNoFeelVer) {
          // 密码或名称错误两次以上需滑动验证
          let _self = this;
          setTimeout(() => {
            _self.errInfo = true;
          }, 500);
        }
      }
    },
    success(res, pictureCode, signCertificateSn) {
      console.log(JSON.stringify(res.data));
      // $.cookie("token", res.data.accessToken, {
      //     path: "/",
      //     domain: this.$domain
      // });
      // $.cookie("sessionToken", res.data.ucSessionToken, {
      //     path: "/",
      //     domain: this.$domain
      // });
      sessionStorage.setItem("token", res.data.accessToken);
      sessionStorage.setItem("sessionToken", res.data.ucSessionToken);
      let userinfo = {
        loginName: res.data.loginName,
        enterPriseName: res.data.extEnterpriseName,
        enterpriseId: res.data.currentPersonalIdOrEnterpriseId,
        accountId: res.data.accountId,
        userId: res.data.userId,
        currentUserId: res.data.userId,
        userType: res.data.userType, //01：企业用户；02：个人用户
        realNameAuthenticationFlag: res.data.realNameAuthenticationFlag, //是否实名认证（0：未认证，1：认证）
        // pictureCode: this.esealCode(this.loginForm.kpassword, 0),
        enterpriseInfoList: res.data.enterpriseInfoList,
        // currentPersonalIdOrEnterpriseId:
        //     res.data.currentPersonalIdOrEnterpriseId,
        isMainAccount: "1"
      };
      /* if (this.isIe) {
              userinfo.pictureCode = this.esealCode(
                  this.loginForm.kpassword,
                  0
              );
              userinfo.signCertificateSn = this.getCertSignSN();
          } else { */
      userinfo.pictureCode = pictureCode;
      userinfo.signCertificateSn = signCertificateSn;
      // }

      userinfo = JSON.stringify(userinfo);
      $.cookie("userinfo", userinfo, { path: "/", domain: this.$domain });

      /*if (res.data.initAccountFlagSaas) {
              window.open(res.data.ukeyComplementPath);
              return false;
          } else */
      if (res.data.initAccountFlag) {
        res.data.userType == "01"
          ? this.$router.push({path:"companyinit", query: {source: this.channelCode}})
          : this.$router.push({path:"personinit", query: {source: this.channelCode}});
      } else {
        this.$store.commit("SET_HASMSG", res.data.notRead); //设置是否有未读消息noRead 0无 1有
        this.$message({
          message: "登录成功",
          type: "success",
          duration: 1000
        });
        setTimeout(() => {
          this.$router.push("/index");
        }, 1000);
      }
    },
    checkedOk(status) {
      this.errInfo = status;
    },
    // 读取ukey
    readUkey() {
      this.getAllUKeyList().then(data => {
        const res = JSON.parse(data || {});
        console.log(res);
        if (this.successUKeyCheckCode(res)) {
          if (!res.keyList.length) {
            this.$message.error("暂无印章数据，请插入UKEY进行读取");
          } else {
            this.UKeyNum = res.keyList.length;
            this.ukeylist = res.keyList;
            // this.setUKeyListFn();
            // this.setCertIndexFn(0);
            this.loginForm.ukey = this.ukeylist[0].key_name;
            // console.log(this.esealCode(this.loginForm.kpassword, 0), this.GetOid(0), this.getCertSignSN(), typeof (this.getCertSignSN()))
          }
        }
      });
    },
    checkUkeyVer(callback) {
      this.getUKeyVersion().then(res => {
        if (this.successUKeyCheckCode(res)) {
          res = JSON.parse(res);
          let ver = res.version;
          this.checkUKeyVersion(ver).then(res => {
            if (this.successCheckCode(res)) {
              if (!!res.data.isNewest) {
                callback();
              } else {
                this.$updateUKeyDrive();
              }
            }
          });
        }
      });
    },
    //设置第几个ukey
    setCertIndexFn(i) {
      let flag = false;
      this.setCertIndex(i).then(data => {
        const res = JSON.parse(data || {});
        if (this.successUKeyCheckCode(res)) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
    // 设置ukey列表
    setUKeyListFn() {
      this.ukeylist = [];
      for (let i = 0; i < this.UKeyNum; i++) {
        //获取第几个ukey
        if (this.setCertIndexFn(i)) {
          this.ukeylist[i] = {};
          this.ukeylist[i].value = i.toString();
          this.ukeylist[i].id = i;
          this.ukeylist[i].label = this.GetCertInfoFn(0);
        } else {
          return;
        }
      }
      if (this.ukeylist.length <= 0) {
        this.tip("暂无印章数据，请插入UKEY进行读取");
      } else {
        return this.ukeylist;
      }
    },
    GetCertInfoFn(type) {
      let label = "";
      this.GetCertInfo(type).then(data => {
        const res = JSON.parse(data || {});
        if (this.successUKeyCheckCode(res)) {
          label = res.info;
        }
      });
      return label;
    },
    changeVisible(val) {
      if (val == "password") {
        this.visible = "text";
      } else if (val == "text") {
        this.visible = "password";
      }
    },
    routerTo(val) {
      // this.$router.push(val);
      if(val == 'register'){
        this.$router.push({
          path: val,
          query: {source: this.channelCode}
        })
        return
      }
      this.$router.push(val)
    },
    getCertValue(data) {
      let val = "";
      this.getCertData(data).then(res => {
        if (this.successUKeyCheckCode(res)) {
          res = JSON.parse(res);
          val = res.certdata;
        }
      });
      return val;
    },
    changeVerify() {
      this.verifyType = !this.verifyType;
    },
    getCode() {
      if (!this.loginForm.telphone) {
        return this.$message.warning("请输入手机号");
      }
      if (!/^1[3456789][0-9]{9}$/.test(this.loginForm.telphone)) {
        return this.$message.warning("请输入正确的手机号");
      }
      if (this.countdown != 0) {
        return false;
      }
      this.loadingBtn = true;
      this.getLoginSms(this.loginForm.telphone)
        .then(res => {
          if (this.successCheckCode(res)) {
            if (res.data == false) {
              this.loadingBtn = false;
              return this.$message.error(
                "当前手机号码未注册或已注销"
              );
            }
            this.$message.success("验证码发送成功");
            this.countdown = 120;
            this.timer = setInterval(() => {
              --this.countdown;
              if (this.countdown <= 0) {
                clearInterval(this.timer);
              }
            }, 1000);
          }
          setTimeout(() => {
            this.loadingBtn = false;
          }, 200);
        })
        .fail(res => {
          setTimeout(() => {
            this.loadingBtn = false;
          }, 200);
        });
    },
    getDown() {
      this.$store.commit("downVisibleChange", true);
    },
    getAdListFn() {
      this.getAdList(1).then(res => {
        if (this.successCheckCode(res)) {
          this.objAd = res.data[0];
        }
      })
    },
    // toAd(e){
    //   let event = e || window.event;
    //   window.location.href = this.objAd.link;
    //   event.stopPropagation();
    //   event.stopImmediatePropagation();
    // },
     getQueryString(name){
    let reg = RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    if(!window.location.href.split('?')[1]){
      return '';
    }
    let r = window.location.href.split('?')[1].match(reg);
    let context = '';
    if(r != null){
      return (context = decodeURIComponent(r[2]) || '')
    }
  }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  }
};
</script>
<style lang="scss">
.login {
  position: relative;
  height: 100%;
  min-width: 1200px;
  /*min-height: 768px;*/
  // background: #fff url("../../../../static/image/login_bg.jpg") no-repeat 50% 0;
  // background-size: 100% 100%;

  .header {
    background: #fff;
    height: 70px;

    .wrap {
      width: 1200px;
      height: 70px;
      margin: 0 auto;

      .logo {
        float: left;
        width: 280px;
        height: 70px;
        background: url("../../../../static/image/logo_login.png") no-repeat;
      }

      .back {
        color: #02adff;
        cursor: pointer;
      }
    }
  }
  .login-bottom {
    height: calc(100% - 70px);
    overflow-y: auto;
    width: 100%;
    overflow: hidden;
    .login-bottom-content {
      height: 100%;
      min-height: 710px;
      position: relative;
    }
  }

  .deviation {
    width: 1200px;
    margin: 0 auto;
    position: relative;

    .ad {
      width: 450px;
      height: 150px;
      position: absolute;
      top: 170px;
      left: 62px;
      // background: url("../../../../static/image/ad.png") no-repeat;
    }

    .loginBox {
      width: 440px;
      height: 480px;
      background: rgba(250, 250, 250, 0.9);
      border-radius: 8px;
      box-shadow: 0 0 6px 0 rgba(51, 51, 51, 0.4);
      position: absolute;
      top: 90px;
      right: 60px;
      z-index: 2;
      .title {
        font-size: 24px;
        color: #333333;
        text-align: center;
        line-height: 32px;
        padding-top: 30px;
        padding-bottom: 20px;
      }

      .tab {
        padding: 0 30px;
        border-bottom: 1px solid #e8ecef;
        margin-bottom: 25px;
        overflow: hidden;

        span {
          display: inline-block;
          float: left;
          width: 190px;
          line-height: 22px;
          text-align: center;
          padding: 12px 0;
          color: #626262;
          font-size: 16px;
          position: relative;
          cursor: pointer;

          &:hover {
            color: #0073bd;
          }
        }

        span.active {
          color: #02adff;

          &::after {
            content: "";
            width: 100%;
            position: absolute;
            height: 1px;
            background: #02adff;
            bottom: 0;
            left: 0;
          }
        }
      }

      .el-form-item {
        margin-bottom: 24px;
        padding: 0 30px;

        &.is-error .el-input__inner {
          border-color: #ff4949 !important;
        }
      }

      .el-input input {
        height: 36px;
        border: none;
        border-bottom: 1px solid #c0ccda;
        background: transparent;
        border-radius: 0;

        &:hover {
          border-color: #0073bd;
        }
      }

      .el-input__icon {
        left: 0;
      }

      .el-input__icon + .el-input__inner {
        padding-right: 0;
        padding-left: 34px;
      }

      .el-icon-search {
        background-position: center left;
        background-repeat: no-repeat;
      }

      .el-icon-search:before {
        content: "";
      }

      .user_bg {
        background-image: url(../../../../static/image/user_bg.png);
      }

      .psd_bg {
        background-image: url(../../../../static/image/psd_bg.png);
      }

      .key_bg {
        background-image: url(../../../../static/image/Ukey_bg.png);
      }

      .pin_bg {
        background-image: url(../../../../static/image/pin_bg.png);
      }

      .verifyCode {
        width: 240px;
      }
      .getcode {
        float: right;
        width: 115px;
      }
      .remeber {
        padding: 0 30px;
        height: 22px;
        line-height: 22px;
        margin-bottom: 40px;
        position: relative;
        text-align: right;

        .el-checkbox {
          &::after {
            content: "";
            display: inline-block;
            width: 1px;
            height: 22px;
            margin: 0 10px;
            background: #d8d8d8;
            vertical-align: middle;
          }
        }
        .el-checkbox__inner {
          border-radius: 50%;
        }

        .el-checkbox__label {
          padding-left: 14px;
          color: #626262;

          &:hover {
            color: #0073bd;
          }
        }

        .isChecked {
          color: #02adff;
        }

        .forget {
          float: right;
          color: #626262;

          &:hover {
            color: #0073bd;
          }
        }

        .errTip {
          position: absolute;
          bottom: -26px;
          left: 62px;
          color: #ff4747;
          font-size: 12px;
        }

        .change-login {
          float: left;
          cursor: pointer;
          color: #626262;
          &:hover {
            color: #0073bd;
          }
        }
      }

      .loginBtn {
        padding: 0 30px;

        .el-button {
          width: 100%;
          padding: 19px 15px;
          background: #c0ccda;
          border: none;
          border-radius: 8px;

          &:hover {
            background: #0073bd;

            span {
              color: #fff;
            }
          }

          &:active,
          &:focus,
          &.active {
            background: #02adff;

            span {
              color: #fff;
            }
          }

          span {
            font-size: 16px;
            color: #999;
          }
        }
      }

      .reg {
        text-align: center;
        // margin-top: 48px;
        margin-top: 10px;
        line-height: 28px;
      }

      a {
        color: #02adff;

        &:hover {
          text-decoration: underline;
          color: #0073bd;
        }
      }

      .el-checkbox__label:hover {
        color: #0073bd;
      }

      .close {
        position: absolute;
        right: 0px;
        top: 12px;
        width: 16px;
        height: 16px;
        background: url(../../../../static/image/delete.png) no-repeat;

        &:hover {
          background: url(../../../../static/image/delete_hover.png) no-repeat;
        }
      }

      .psdClose {
        right: 26px;
      }

      .password {
        position: absolute;
        right: 0;
        top: 12px;
        width: 16px;
        height: 16px;
        background: url(../../../../static/image/unvisible.png) no-repeat;
        cursor: pointer;

        &:hover {
          background: url(../../../../static/image/unvisible_hover.png)
            no-repeat;
        }
      }

      .text {
        position: absolute;
        right: 0;
        top: 12px;
        width: 16px;
        height: 16px;
        background: url(../../../../static/image/visible.png) no-repeat;
        cursor: pointer;

        &:hover {
          background: url(../../../../static/image/visible_hover.png) no-repeat;
        }
      }

      .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #02adff;
        border-color: #02adff;
      }

      .readKey {
        position: absolute;
        right: 0;
        bottom: 4px;
        padding: 6px 15px;
        border-color: #02adff;
        background: none;

        &:hover {
          background: none;
          /*border-color: none;*/
        }

        span {
          color: #02adff;
        }
      }
    }
  }

  .Copyright {
    color: #f4f6f8;
    position: absolute;
    bottom: 52px;
    line-height: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .errorInfo {
    width: 340px;
    height: 36px;
    line-height: 36px;
    padding-left: 32px;
    color: #626262;
    background: url(../../../../static/image/err.png) 10px center no-repeat
      #ffc8c8;
    border-radius: 4px;
    font-size: 12px;
    margin: 0 auto;
    margin-top: 22px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .ukeyIpt {
    .el-input__inner {
      padding-right: 70px !important;
    }
  }
}

@media screen and (max-width: 1400px) {
  .login .login-bottom .login-bottom-content {
    min-height: 550px;
  }
  .login .Copyright {
    bottom: 20px;
  }
  .login .deviation .loginBox {
    top: 20px;
  }
}
</style>
