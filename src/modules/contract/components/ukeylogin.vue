<template>
  <div class="ukeylogin">
    <regheader></regheader>
    <!-- <ad-banner :adObj="objAd"></ad-banner> -->
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
                <span :class="{ active: !loginType }"
                      @click="lognType('login', 0)">UKey登录</span>
                <!--
                                    -->
                <span :class="{ active: loginType }"
                      @click="lognType('login', 1)">账号登录</span>
              </div>
              <div v-if="loginType">
                <el-form-item prop="account">
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
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password"
                            icon="search psd_bg"
                            :type="visible"
                            placeholder="请输入密码（8~20位字母和数字）"
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
                <el-checkbox v-model="checked"
                             v-if="loginType">记住密码</el-checkbox>
                <a class="forget"
                   href="javascript:;"
                   @click="routerTo('forgetpsd')"
                   v-if="loginType">忘记密码</a>
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
    <transition name="fade">
      <div class="errorInfo"
           v-if="errInfo">
        {{
                    errTime != 3
                        ? "用户名或密码错误，剩余" +
                          errTime +
                          "次机会，之后将被冻结1小时"
                        : "密码错误超过2次，请拖动滑块进行验证"
                }}
      </div>
    </transition>
    <transition name="fade">
      <div class="ukeyerror"
           v-if="ukeyerror">
        <div class="el-icon-warning"></div>
        <div class="tips">提示</div>
        <p>
          <span v-if="neterr">您的电子印章已经过期了,请您直接去安印合作受理点完成续期。</span>
          <span v-if="gderr">您的{{
                            vid
                        }}个人电子印章暂时无法在线续期，请您直接去安印合作受理点完成续期。</span>
          去<a href="https://www.i-yin.com.cn/index.php?c=article&a=type&tid=60"
             target="_blank">查看门店地址</a>或联系<a href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4009196663&cref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa&ref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa%2Fstyle%26id%3Dwpa_setting_a01&pt=undefined&f=1&ty=1&ap=&as=&aty=0&a=">在线客服</a>
        </p>
        <span class="el-icon-close"
              @click="close"></span>
      </div>
    </transition>
  </div>
</template>
<script>
import ukey from "../../../assets/plugin/ukey";
import regheader from "../../../components/regheader";
import adBanner from "../../../components/adBanner";
import valid from "../mixin/valid";
import base from "../mixin/base";
import service from "../../../assets/mixin/service";
import { encryption, decrypt } from "@/utils";
export default {
  mixins: [valid, service, ukey],
  components: { regheader, adBanner },
  data() {
    var validateUser = (rule, value, callback) => {
      // let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,}$/
      if (!value) {
        return callback(new Error("请输入您注册的账户"));
      } else if (
        !/^1[3-9][0-9]{9}$/.test(value) &&
        !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
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
    return {
      loginForm: {
        account: "",
        password: "",
        graphicCode: "",
        ukey: "",
        kpassword: "",
        loadingBtn: false
      },
      rules: {
        account: [{ validator: validateUser, trigger: "blur" }],
        password: [{ validator: this.checkPasswords, trigger: "blur" }],
        ukey: [{ validator: validateUkey, trigger: "blur" }],
        kpassword: [{ validator: validateKPass, trigger: "blur" }]
      },
      // ukeylist: [],
      loginType: false, //true为账户登录，false为ukey登录
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
      ukeyerror: false,
      neterr: false,
      gderr: false,
      vid: "",
      objAd: null,//广告图片
      sealTag: "" //true为安印key，false为海南、山西等地key
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
        if (this.loginForm.account || this.loginForm.ukey) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
      },
      deep: true
    }
  },
  mounted() {
    $.cookie("isSign", false);
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
    this.getAdListFn();
  },
  methods: {
    isIE() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        this.isIe = true;
      } else {
        this.isIe = false;
        this.$message({
          type: "error",
          message:
            "因CA机构仅支持IE浏览器，请在下载浏览器IE10以上版本进行续期",
          duration: 3500
        });
      }
      // console.log(this.isIe);
    },
    //样式交互
    addstyle(event, index) {
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
      }
    },
    //更新图形码
    replace() { },
    //切换登录类型
    lognType(ref, val) {
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
          decryptFlag: 1, //是否需要解密标志：1解密；0否
          account: this.loginForm.account,
          password: this.loginForm.password,
          bizCode: "iyin_contract", //iyin_contract、iyin_saas 、iyin_xing_zuo、iyin_cloud_sign
          clientId: "02" //客服端ID 01:api 02:浏览器 03：app ,
          // graphicCode:this.loginForm.graphicCode,
        };
        data = encryption({  //暂时关闭
          data: data,
          param: ['password']
        });
        this.userLogin(data)
          .done(res => {
            if (this.successCheckCode(res)) {
              this.errTip = false;
              // $.cookie("token", res.data.accessToken, {
              //     path: "/",
              //     domain: this.$domain
              // });
              // $.cookie("sessionToken", res.data.ucSessionToken, {
              //     path: "/",
              //     domain: this.$domain
              // });
              sessionStorage.setItem(
                "token",
                res.data.accessToken
              );
              sessionStorage.setItem(
                "sessionToken",
                res.data.ucSessionToken
              );
              let userinfo = JSON.stringify({
                loginName: res.data.loginName,
                enterPriseName: res.data.extEnterpriseName,
                accountId: res.data.accountId,
                enterpriseId:
                  res.data.currentPersonalIdOrEnterpriseId,
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
                // localStorage.loginInfo = JSON.stringify({
                //   account: this.loginForm.account,
                //   password: this.loginForm.password
                // });  
                localStorage.loginInfo = JSON.stringify(data);
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
              // if(!res.data.needVerCode){
              //     this.errInfo = true
              //     this.errTip = true
              //     this.errTime = res.data.allowPasswordErrorTimes
              //     setTimeout(() => {
              //         this.errInfo = false
              //     }, 2500);
              //     return
              // }
            }
          })
          .fail(() => {
            // this.loginForm.loadingBtn = false
          });
      } else {
        //ukey登录
        let data = {
          isRenewLogin: true
        };
        /* if (this.isIe) {
                data.oid = this.GetOid(0);
                data.pictureCode = this.esealCode(
                    this.loginForm.kpassword,
                    0
                );
                data.signCertificateSn = this.getCertSignSN();
            } else { */
        // data.oid = this.GetCertInfoFn(1);
        // data.pictureCode = this.GetCertInfoFn(3);
        // data.signCertificateSn = this.GetCertInfoFn(10);
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
                    data.vid = element.item_info.toUpperCase();
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
                  case 27:
                    data.certType = element.item_info;
                    break;
                  default:
                    break;
                }
              }
            });
          }
        });
        //}
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
          } else if (code === 2102) {
            //netca过期不支持
            this.ukeyerror = true;
            this.neterr = true;
          } else if (code === 2101) {
            // 个人不支持续期
            this.vid = data.vid;
            this.ukeyerror = true;
            this.gderr = true;
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
            // if(window.location.hostname != 'sign.i-yin.com.cn'){
            //     data.enterpriseName = data.enterpriseName.substring(0, data.enterpriseName.length-4)
            // }
            data.mediumType =
              data.mediumType == 0
                ? (data.mediumType = 2)
                : (data.mediumType = 1); //1为ODC，2为IYIN
            data.userType =
              data.userType == 0
                ? (data.userType = "01")
                : (data.userType = "02"); //01-单位用户 ， 02-普通个人用户
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
    success(res, pictureCode, signCertificateSn) {
      console.log(JSON.stringify(res.data));
      $.cookie("token", res.data.accessToken, { path: "/", domain: this.$domain });
      $.cookie("sessionToken", res.data.ucSessionToken, {
        path: "/",
        domain: this.$domain
      });
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
      this.ukeylist[0].pincode = this.loginForm.kpassword;
      $.cookie("ukeylist", JSON.stringify(this.ukeylist), {
        path: "/",
        domain: this.$domain
      });

      /*if (res.data.initAccountFlagSaas) {
    window.open(res.data.ukeyComplementPath);
    return false;
} else */
      this.$store.commit("SET_HASMSG", res.data.notRead); //设置是否有未读消息noRead 0无 1有
      this.$message({
        message: "登录成功",
        type: "success",
        duration: 1000
      });
      setTimeout(() => {
        this.$router.push({
          path: "ukeysealrenew",
          query: {
            pictureCode: pictureCode
          }
        });
      }, 1000);
      // if (res.data.initAccountFlag) {
      //     res.data.userType == "01"
      //         ? this.$router.push("companyinit")
      //         : this.$router.push("personinit");
      // } else {
      //     this.$message({
      //         message: "登录成功",
      //         type: "success",
      //         duration: 1000
      //     });
      //     setTimeout(() => {
      //         this.$router.push({
      //             path: "ukeysealrenew",
      //             query: {
      //                 pictureCode: pictureCode
      //             }
      //         });
      //     }, 1000);
      // }
    },
    readUkey() {
      /*if (this.isIe) {
    if (this.issupport()) {
        this.getukeyNames();
        this.loginForm.ukey = this.ukeylist[0].label;
        console.log(
            this.esealCode(this.loginForm.kpassword, 0),
            this.GetOid(0),
            this.getCertSignSN(),
            typeof this.getCertSignSN()
        );
    }
} else {*/
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
      // }
    },
    checkUkeyVer(callback) {
      if (!this.isIe) {
        this.$message({
          type: "error",
          message:
            "因CA机构仅支持IE浏览器，请在下载浏览器IE10以上版本进行续期",
          duration: 3500
        });
        return false;
      }
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
      this.$router.push(val);
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
    close() {
      this.ukeyerror = false;
      this.gderr = false;
      this.neterr = false;
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
  }
};
</script>
<style lang="scss">
.ukeylogin {
  position: relative;
  height: 100%;
  min-width: 1200px;
  /*min-height: 768px;*/
  background: #fff url("../../../../static/image/ukeylogin_bg.jpg") no-repeat
    50% 0;
  background-size: 100% 100%;

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

    .login-bottom-content {
      height: 100%;
      min-height: 710px;
      position: relative;
    }
  }

  .deviation {
    width: 970px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;

    .ad {
      width: 530px;
      height: 480px;
      background: url("../../../../static/image/ukey.png") no-repeat;
      float: left;
      margin-top: 90px;
    }

    .loginBox {
      width: 440px;
      height: 480px;
      background: rgba(250, 250, 250, 0.9);
      box-shadow: 0 0 6px 0 rgba(51, 51, 51, 0.4);
      float: left;
      margin-top: 90px;

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

      .remeber {
        padding: 0 30px;
        height: 20px;
        margin-bottom: 40px;
        position: relative;

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
        margin-top: 48px;
        line-height: 20px;
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

  .ukeyerror {
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    width: 480px;
    height: 116px;
    border: 1px solid #d3dce6;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    border-radius: 2px;
    padding: 20px 12px;

    .el-icon-warning {
      float: left;
      color: #f7ba2a;
      font-size: 40px;
    }

    .tips {
      position: absolute;
      left: 68px;
      top: 18px;
      font-size: 16px;
    }

    p {
      margin-left: 56px;
      margin-top: 29px;
      color: #8492a6;
      line-height: 22px;

      a {
        color: #02adff;
        text-decoration: underline;
      }
    }

    .el-icon-close {
      position: absolute;
      right: 20px;
      top: 12px;
      color: #c0ccda;
      cursor: pointer;
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
