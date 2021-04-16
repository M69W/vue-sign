<template>
  <div class="register">
    <regheader></regheader>
    <!-- <ad-banner :adObj="objAd"
               defaultImg="/static/image/reg_bg.jpg"></ad-banner> -->
    <div class="regBox">
      <div class="top">
        <div class="title">
          {{pageTitle}}
          <span v-if="pageTitle == '用户注册'"
                style="font-size:14px;margin-left:20px;color:red;">如您已有安印科技的UKey印章，可以使用UKey登录</span>
        </div>
        <div class="step">
          <ul>
            <li :class="{active: step==1,activated: step>1}">
              <span>1</span>
              {{path=='register'?'基本信息':path=='forgetpsd'?'验证信息':""}}
            </li>
            <li :class="{active: step==2, activated: step>2, step2: path == 'forgetpsd'}">
              <span>2</span>
              {{path=='register'?'注册完成':path=='forgetpsd'?'重置密码':""}}
            </li>
            <li :class="{active: step==3}"
                v-if="path == 'forgetpsd'">
              <span>3</span>
              {{path=='forgetpsd'?'修改完成':""}}
            </li>
          </ul>
        </div>
      </div>
      <!-- 注册框 -->
      <div class="reg"
           v-if="isSuccess">
        <div v-if="path == 'register'">
          <!-- 注册框顶部Tab 个人注册/企业注册 -->
          <div class="tab">
            <span :class="{active: regType}"
                  @click="registerType('reg1',1)">个人注册</span>
            <span :class="{active: !regType}"
                  @click="registerType('reg3',0)">企业注册</span>
          </div>

          <!-- 个人注册 -->
          <el-form ref="reg1"
                   label-position="right"
                   label-width="98px"
                   :rules="rules1"
                   :model="regForm">
            <div v-if="regType && step == 1">
              <el-form-item prop="phoneNo"
                            label="手机号">
                <el-input v-model="regForm.phoneNo"
                          placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item prop="password"
                            label="密码">
                <el-input v-model="regForm.password"
                          :type="visible"
                          placeholder="请设置8~20位字母+数字为密码">
                </el-input>
                <span class="password"
                      @click="changeVisible(visible,1)"
                      ref="visible"></span>
              </el-form-item>
              <el-form-item prop="smsVerificationCode"
                            label="短信验证码">
                <el-input v-model="regForm.smsVerificationCode"
                          placeholder="请输入短信验证码"
                          class="verify"
                          :maxlength="6"></el-input>
                <el-button class="codebtn"
                           @click="getPhoneCode('reg1')"
                           :class="{active: isActive}">
                  {{countdown == 0?'获取验证码':countdown+'s'}}</el-button>
                  <div class="voice-code">
                    <p>收不到短信？试试 <span  @click="showCodePanel('reg1')">语音验证码</span> </p>
                    <transition name="fade">
                    <div class="code-panel" v-if="showPanel">
                      <voice-verify type="pick" :imgUrl="imgUrl" :imgName="imgName" :showButton="false" :showPanel="showPanel" mode="pop"  @success="codeSuccess" @close="closeCodePanel" />
                    </div>
                    </transition>
                  </div>
              </el-form-item>
            </div>
          </el-form>

          <!-- <el-form ref="reg2" label-position="right" label-width="98px" :rules="rules2" :model="regForm">
                        <div v-if="!regType && step == 1">
                            <el-form-item prop="enterpriseEmail" label="账号">
                                <el-input v-model="regForm.enterpriseEmail" placeholder="请输入企业邮箱"></el-input>
                            </el-form-item>
                            <el-form-item prop="password" label="密码">
                                <el-input v-model="regForm.password" :type="visible2" placeholder="请输入登录密码（8~20位字母和数字）"></el-input>
                                <span class="password" @click="changeVisible(visible2,2)" ref="visible2"></span>
                            </el-form-item>
                            <el-form-item prop="emailVerificationCode" label="邮箱验证码">
                                <el-input v-model="regForm.emailVerificationCode" placeholder="请输入邮箱验证码" class="verify" :maxlength="6"></el-input>
                                <el-button class="codebtn" @click="getEmailCode('reg2')" :class="{active: isActive}">{{countdown == 0?'获取验证码':countdown+'s'}}</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
              -->
        
          <!-- 企业注册 -->
          <el-form ref="reg3"
                   label-position="right"
                   label-width="98px"
                   :rules="rules3"
                   :model="regForm">
            <div v-if="!regType && step == 1">
              <el-form-item prop="enterpriseName"
                            label="企业名称">
                <el-input v-model="regForm.enterpriseName"
                          placeholder="请输入企业名称"></el-input>
              </el-form-item>
              <el-form-item prop="linkManName"
                            label="联系人">
                <el-input v-model="regForm.linkManName"
                          placeholder="请输入联系人姓名"></el-input>
              </el-form-item>
              <el-form-item prop="phoneNo"
                            label="手机号">
                <el-input v-model="regForm.phoneNo"
                          placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item prop="password"
                            label="密码">
                <el-input v-model="regForm.password"
                          :type="visible2"
                          placeholder="请设置8~20位字母+数字为密码">
                </el-input>
                <span class="password"
                      @click="changeVisible(visible2,2)"
                      ref="visible2"></span>
              </el-form-item>
              <el-form-item prop="smsVerificationCode"
                            label="短信验证码">
                <el-input v-model="regForm.smsVerificationCode"
                          placeholder="请输入短信验证码"
                          class="verify"
                          :maxlength="6"></el-input>
                <el-button class="codebtn"
                           @click="getPhoneCode('reg3')"
                           :class="{active: isActive}">
                  {{countdown == 0?'获取验证码':countdown+'s'}}</el-button>
                  <!-- 获取语音验证码 -->
                  <div class="voice-code">
                    <p>收不到短信？试试 <span  @click="showCodePanel('reg3')">语音验证码</span> </p>
                    <transition name="fade">
                    <div class="code-panel" v-if="showPanel">
                      <voice-verify type="pick" :imgUrl="imgUrl" :imgName="imgName" :showButton="false" :showPanel="showPanel" mode="pop"  @success="codeSuccess" @close="closeCodePanel" />
                    </div>
                    </transition>
                  </div>
              </el-form-item>
              <el-form-item prop="enterpriseEmail"
                            label="邮箱地址">
                <el-input v-model="regForm.enterpriseEmail"
                          placeholder="请输入邮箱地址"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <!-- 同意条款 -->
          <div class="nextBox">
            <div class="protocol"
                 v-if="step == 1">
              <el-checkbox v-model="checked">
                已阅读并同意
                <a href="javascript:;"
                   @click="routerTo('agreement')">《安印科技用户注册与使用协议》</a>及
                <a href="javascript:;"
                   @click="routerTo('privacy')">《隐私条款》</a>
              </el-checkbox>
            </div>
            <el-button class="regbtn"
                       v-if="step == 1 && regType"
                       @click="submit_Form('reg1')"
                       :class="{active: isActive}">注册</el-button>
            <!-- <el-button class="regbtn" v-if="step == 1 && !regType" @click="submit_Form('reg2')" :class="{active: isActive}">下一步</el-button> -->
            <el-button class="regbtn"
                       v-if="step == 1 && !regType"
                       @click="submit_Form('reg3')"
                       :class="{active: isActive}">注册</el-button>
          </div>
        </div>
        <!-- 忘记密码页 -->
        <div v-if="path == 'forgetpsd'"
             style="padding-top:12px">
          <el-form ref="recoverForm"
                   label-position="right"
                   label-width="98px"
                   :rules="recoverRules"
                   v-if="step == 1"
                   :model="recoverForm">
            <el-form-item prop="phoneNo"
                          label="手机号">
              <el-input v-model="recoverForm.phoneNo"
                        placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item prop="msmCode"
                          label="短信验证码">
              <el-input v-model="recoverForm.msmCode"
                        placeholder="请输入短信验证码"
                        class="verify"
                        :maxlength="6"></el-input>
              <el-button class="codebtn"
                         @click="getPhoneCode('recoverForm')"
                         :class="{active: isActive}">
                {{countdown == 0?'获取验证码':countdown+'s'}}</el-button>
            </el-form-item>
          </el-form>
          <el-form ref="recoverForm2"
                   label-position="right"
                   label-width="98px"
                   :rules="recoverRules2"
                   v-if="step == 2"
                   :model="recoverForm">
            <el-form-item prop="password"
                          label="登录密码">
              <el-input v-model="recoverForm.password"
                        :type="visible"
                        placeholder="请输入新密码（设置8~20位字母+数字为密码）"></el-input>
              <span class="password"
                    @click="changeVisible(visible,1)"
                    ref="visible"></span>
            </el-form-item>
            <el-form-item prop="rpassword"
                          label="确认密码">
              <el-input v-model="recoverForm.rpassword"
                        :type="visible2"
                        placeholder="请再次输入密码"></el-input>
              <span class="password"
                    @click="changeVisible(visible2,2)"
                    ref="visible2"></span>
            </el-form-item>
          </el-form>
          <div class="nextBox">
            <el-button class="regbtn forgetbtn"
                       v-if="step == 1"
                       @click="recover_Form('recoverForm')"
                       :class="{active: isActive}">下一步</el-button>
            <el-button class="regbtn forgetbtn"
                       v-if="step == 2"
                       @click="recover_Form('recoverForm2')"
                       :class="{active: isSure}">确定</el-button>
          </div>
        </div>
      </div>
      <div class="success"
           v-if="!isSuccess">
        <img src="../../../../static/image/reg_success.png"
             alt />
        <p class="regTip">{{path=='register'?'恭喜，您已注册成功':'您的密码已修改成功'}}</p>
        <div class="regName"
             v-if="path == 'register'">注册账号：{{this.regForm.phoneNo}}</div>
        <el-button class="toHome"
                   v-if="path == 'register'"
                   @click="routerTo('index')">进入安印</el-button>
        <el-button type="primary"
                   class="certify"
                   v-if="path == 'register'"
                   @click="routerTo('authen')">立即实名认证
        </el-button>
        <el-button class="relogin"
                   v-if="path == 'forgetpsd'"
                   @click="routerTo('login')">重新登录</el-button>
        <div class="certification"
             v-if="path == 'register'">
          为什么要实名认证？
          <p>
            1、实名认证后，才能在安印云服务平台发起签署文件；
            <br />2、实名认证后，所有的相关文件签署才具有法律效力；
            <br />3、实名认证后，还可以享受安印提供的其他服务；
          </p>
        </div>
      </div>
    </div>
    <a class="give"
       :style="'backgroundImage:url('+objAd.photoPath+')'"
       :href="objAd.link">
      <!-- 注册成功后，免费赠送<span style="font-size: 18px;">10</span>份套餐 -->
    </a>
    <p class="Copyright">Copyright 2014-2020 深圳市安印科技有限公司&nbsp;&nbsp;&nbsp;粤ICP备16033566</p>
  </div>
</template>
<script>
import regheader from '../../../components/regheader';
import valid from '../mixin/valid';
import service from '../../../assets/mixin/service';
import adBanner from "../../../components/adBanner";
import VoiceVerify from '../../../components/VerifyCode/Verify'
export default {
  mixins: [valid, service],
  props: {},
  components: { regheader, adBanner, VoiceVerify },
  data() {
    var confrimPass = (rule, value, callback) => {
      if (this.recoverForm.password != this.recoverForm.rpassword) {
        return callback(new Error('两次输入的密码不一致，请重试'));
      }
      callback();
    };
    var checkEmail = (rule, value, callback) => {
      if (!/^([a-z0-9A-Z]+[-|_|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/.test(value)) {
        return callback(new Error('请输入正确的邮箱'));
      }
      this.checkPhoneOrEmail({ phoneOrEmail: value }).then((res) => {
        if (this.successCheckCode(res)) {
          if (!!res.data.name) {
            return callback(new Error('该邮箱已注册'));
          } else {
            callback();
          }
        }
      });
    };

    var checkTelphone = (rule, value, callback) => {
      if (!/^1[3-9][0-9]{9}$/.test(value)) {
        return callback(new Error('请输入正确的手机号码'));
      }

      this.checkPhoneOrEmail({ phoneOrEmail: value }).then((res) => {
        if (this.successCheckCode(res)) {
          if (!!res.data.name) {
            return callback(new Error('当前手机号码已注册过，请直接登录'));
          } else {
            callback();
          }
        }
      });
    };
    // var checkPhoneOrEmailReg = (rule, value, callback) => {
    //     if (value === '') {
    //         callback(new Error('请输入密码'));
    //     } else {
    //         if (this.ruleForm2.checkPass !== '') {
    //             this.$refs.ruleForm2.validateField('checkPass');
    //         }
    //         callback();
    //     }
    // };
    return {
      channelCode: '',
      pageTitle: '',
      path: '',
      regType: false, //true为个人，false为企业
      step: 1,
      regForm: {},
      recoverForm: {},
      checked: false,
      isSuccess: true,
      visible: 'password',
      visible2: 'password',
      countdown: 0,
      timer: null,
      hasEmail: false,
      hasMsn: false,
      isActive: false,
      isReg: false,
      isSure: false,
      isCode: true,
      objAd: {},//广告图片
      rules1: {
        phoneNo: [{ required: true, message: '请输入手机号码', trigger: 'blur' }, { validator: checkTelphone, trigger: 'blur' }],
        password: [{ validator: this.checkPasswords, trigger: 'blur' }],
        smsVerificationCode: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }]
      },
      rules2: {
        enterpriseEmail: [
          { required: true, message: '请输入企业邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        password: [{ validator: this.checkPasswords, trigger: 'blur' }],
        emailVerificationCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
      },
      rules3: {
        enterpriseName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          { max: 33, message: '您输入的企业名称字符长度已超出限制', trigger: 'blur' },
          { validator: this.checkEnterpriseName, trigger: 'blur' }
        ],
        linkManName: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { max: 20, message: '您输入的联系人名称字符长度已超出限制', trigger: 'blur' },
          { validator: this.checkLinkName, trigger: 'blur' }
        ],
        phoneNo: [{ required: true, message: '请输入手机号码', trigger: 'blur' }, { validator: checkTelphone, trigger: 'blur' }],
        password: [{ validator: this.checkPasswords, trigger: 'blur' }],
        enterpriseEmail: [
          { required: true, message: '请输入企业邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        smsVerificationCode: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }]
      },
      recoverRules: {
        phoneNo: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: this.checkTelphone, trigger: 'blur' }],
        msmCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      recoverRules2: {
        password: [{ validator: this.checkPasswords, trigger: 'blur' }],
        rpassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }, { validator: confrimPass, trigger: 'blur' }]
      },
      // 选字验证码背景图路径，背景图名字，是否显示选字验证面板
      imgUrl: '../../../../static/image/verifycode_bg/',
      imgName: ['2.jpg','3.jpg'],
      showPanel: false   
    };
  },
  computed: {},
  watch: {
    countdown() {
      if (this.countdown == 0) {
        clearInterval(this.timer);
        this.isCode = true;
      }
    },
    regForm: {
      handler() {
        if (this.regForm.enterpriseEmail && this.step == 1) {
          this.isActive = true;
        } else if (this.regForm.phoneNo) {
          this.isActive = true;
          if (this.regForm.enterpriseName) {
            this.isReg = true;
          } else {
            this.isReg = false;
          }
        } else if (this.regForm.enterpriseName) {
          this.isReg = true;
          if (this.regForm.phoneNo) {
            this.isActive = true;
          } else {
            this.isActive = false;
          }
        } else if (!this.regForm.enterpriseName && this.step == 2) {
          this.isReg = false;
          if (this.regForm.phoneNo) {
            this.isActive = true;
          } else {
            this.isActive = false;
          }
        } else if (!this.regForm.phoneNo) {
          this.isActive = false;
          if (this.regForm.enterpriseName) {
            this.isReg = true;
          } else {
            this.isReg = false;
          }
        } else if (!this.regForm.enterpriseEmail && this.step == 1) {
          this.isActive = false;
        }
      },
      deep: true
    },
    recoverForm: {
      handler() {
        if (this.recoverForm.phoneNo) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
        if (this.recoverForm.password) {
          this.isSure = true;
        } else {
          this.isSure = false;
        }
      },
      deep: true
    }
  },
  activated() {
    this.$nextTick(() => { });
  },
  mounted() {
    // 获取渠道标识
    this.channelCode = this.getQueryString('source');
    this.$nextTick(() => {
      this.pageTitle = this.$route.meta.title;
      this.path = this.$route.path.match(/([^/]+)$/)[1];
    });
    this.getAdListFn();
  },
  methods: {
    registerType(ref, val) {
      this.step = 1;
      this.regForm = {};
      this.visible = 'password';
      this.visible2 = 'password';
      this.countdown = 0;
      this.showPanel = false;
      clearInterval(this.timer);
      if (val == 1) {
        this.$refs[ref].resetFields();
        this.regType = true;
      } else if (val == 0) {
        this.$refs[ref].resetFields();
        this.regType = false;
      }
    },
    //注册验证
    submit_Form(ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          if (!this.checked) {
            this.$message({
              type: 'error',
              message: '请您勾选注册协议'
            });
            return;
          }
          this.reg();
        } else {
          return;
        }
        // if(valid && this.step==1 && !this.regType){
        //     if(!this.hasEmail){
        //         this.$message({
        //             type: 'error',
        //             message: '请先获取验证码'
        //         })
        //         return
        //     }
        //     this.enterpriseRegister({
        //         enterpriseEmail: this.regForm.enterpriseEmail,
        //         password: this.regForm.password,
        //         emailVerificationCode: this.regForm.emailVerificationCode,
        //         useType: 1 //验证码使用类型：1.注册 2.修改密码 3.找回密码
        //     }).then(res =>{
        //         if(this.successCheckCode(res)){
        //             // this.regForm.accountId = res.data
        //             this.step = 2
        //             this.countdown = 0
        //             this.isActive = false
        //             this.isReg = false
        //             clearInterval(this.timer)
        //         }
        //     })
        //     return
        // } else

        /*if (valid) {
            if(!this.hasMsn){
                this.$message({
                    type: 'error',
                    message: '请先获取验证码'
                })
                return
            }
            this.reg()
        } else {
            return false;
        }*/
      });
    },
    //找回密码验证
    recover_Form(ref) {
      this.$refs[ref].validate((valid) => {
        if (valid && this.step == 1) {
          if (!this.hasMsn) {
            this.$message({
              type: 'error',
              message: '请先获取验证码'
            });
            return;
          }
          this.checkSmsCode({
            msmCode: this.recoverForm.msmCode,
            phone: this.recoverForm.phoneNo,
            useType: 3
          }).then((res) => {
            if (this.successCheckCode(res)) {
              this.step = 2;
            }
          });
          return;
        } else if (valid) {
          this.recover();
        } else {
          return false;
        }
      });
    },
    reg() {
      if (this.regType) {
        this.personRegister({
          //个人注册
          phoneNo: this.regForm.phoneNo,
          password: this.regForm.password,
          smsVerificationCode: this.regForm.smsVerificationCode,
          clientId: '02',
          useType: '1', //验证码使用类型：1.注册 2.修改密码 3.找回密码
          channelCode: this.channelCode
        }).then((res) => {
          if (this.successCheckCode(res)) {
            $.cookie('isSign', true);
            this.step = 2;
            this.isSuccess = false;
            this.regSuccess(res);
          }
        });
      } else {
        //企业注册
        this.checkedEnterPriseName(this.regForm.enterpriseName).then(res => {
          if (this.successCheckCode(res)) {
            if (!res.data) {
              this.$confirm('您好！ 请认真核实，该企业可能已经办理过安印的电子印章（UKey），请直接使用UKey登录，无需注册。', '提示', {
                type: "warning",
                confirmButtonText: '去登录',
                cancelButtonText: '取消',
                customClass: "self-icon icon-living",
              }).then(() => {
                this.$router.push("/login?Type=ukey");
              }).catch(() => {
              });
            } else {
              //企业注册  
              this.perfectInfo({
                clientId: '02', //客户端类型 01:api 02:浏览器 03：app ,
                enterpriseEmail: this.regForm.enterpriseEmail,
                password: this.regForm.password,
                enterpriseName: this.regForm.enterpriseName,
                linkManName: this.regForm.linkManName,
                phoneNo: this.regForm.phoneNo,
                smsVerificationCode: this.regForm.smsVerificationCode,
                useType: 1,
                channelCode: this.channelCode
              }).then((res) => {
                if (this.successCheckCode(res)) {
                  $.cookie('isSign', true);
                  this.step = 2;
                  this.isSuccess = false;
                  this.regSuccess(res);
                }
              });
            }
          }
        })
      }
    },
    regSuccess(res) {
      $.cookie('token', res.data.accessToken, { path: '/', domain: this.$domain });
      $.cookie('sessionToken', res.data.ucSessionToken, { path: "/", domain: this.$domain });
      sessionStorage.setItem('token', res.data.accessToken);
      sessionStorage.setItem('sessionToken', res.data.ucSessionToken);
      let userinfo = JSON.stringify({
        loginName: res.data.loginName,
        enterPriseName: res.data.extEnterpriseName,
        accountId: res.data.accountId,
        enterpriseId: res.data.currentPersonalIdOrEnterpriseId,
        userId: res.data.userId,
        currentUserId: res.data.userId,
        userType: res.data.userType, //01：企业用户；02：个人用户
        realNameAuthenticationFlag: res.data.realNameAuthenticationFlag, //是否实名认证（0：未认证，1：认证）
        enterpriseInfoList: res.data.enterpriseInfoList,
        isMainAccount: 1
      });
      this.$store.commit("SET_HASMSG", res.data.notRead); //设置是否有未读消息noRead 0无 1有
      $.cookie('userinfo', userinfo, { path: '/', domain: this.$domain });
    },
    recover(val) {
      this.resetPassword({
        confirmPassword: this.recoverForm.rpassword,
        msmCode: this.recoverForm.msmCode,
        password: this.recoverForm.password,
        phone: this.recoverForm.phoneNo,
        useType: 3
      }).then((res) => {
        if (this.successCheckCode(res)) {
          this.step = 3;
          this.isSuccess = false;
        }
      });
    },
    getEmailCode(ref) {
      this.$refs[ref].validateField('enterpriseEmail', (string) => {
        if (!string) {
          if (this.countdown == 0 && this.isCode) {
            this.isCode = false;
            this.emailCode({
              email: this.regForm.enterpriseEmail,
              useType: 1
            }).then((res) => {
              if (this.successCheckCode(res)) {
                this.hasEmail = true;
                this.countdown = 120;
                this.timer = setInterval(() => {
                  --this.countdown;
                }, 1000);
                this.$message({
                  type: 'success',
                  message: '邮箱验证码发送成功'
                });
              }
            });
          }
        }
      });
    },
    getPhoneCode(ref) {
      if (ref == 'recoverForm') {
        var useType = 3;
      } else {
        var useType = 1;
      }
      this.$refs[ref].validateField('phoneNo', (string) => {
        if (!string && this.isActive) {
          if (this.countdown == 0 && this.isCode) {
            this.isCode = false;
            this.getNewSmsVerification({
              phone: this.regForm.phoneNo || this.recoverForm.phoneNo,
              useType: useType
            })
              .then((res) => {
                if (this.successCheckCode(res)) {
                  this.hasMsn = true;
                  this.countdown = 120;
                  this.timer = setInterval(() => {
                    --this.countdown;
                  }, 1000);
                  this.$message({
                    type: 'success',
                    message: '短信验证码发送成功'
                  });
                } else {
                  this.isCode = true;
                }
              })
              .fail((res) => {
                this.isCode = true;
              });
          }
        }
      });
    },
    changeVisible(val, type) {
      if (val == 'password') {
        if (type == 1) {
          this.visible = 'text';
          this.$refs.visible.className = 'text';
        } else if (type == 2) {
          this.visible2 = 'text';
          this.$refs.visible2.className = 'text';
        }
      } else if (val == 'text') {
        if (type == 1) {
          this.visible = 'password';
          this.$refs.visible.className = 'password';
        } else if (type == 2) {
          this.visible2 = 'password';
          this.$refs.visible2.className = 'password';
        }
      }
    },
    routerTo(val) {
      if (val == 'authen') {
        this.regType ? this.$router.push('personauthen') : this.$router.push('companyauthen');
      } else if (val == 'index' || val == 'login') {
        this.$router.push(val);
      } else {
        let { href } = this.$router.resolve({ path: val });
        window.open(href, '_blank');
      }
    },
    // 获取url的查询参数
    getQueryString(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      if (!window.location.href.split('?')[1]) {
        return '';
      }
      var r = window.location.href.split('?')[1].match(reg);
      var context = '';
      if (r != null) {
        return (context = decodeURIComponent(r[2]) || '');
      }
    },
    getAdListFn() {
      this.getAdList(2).then(res => {
        if (this.successCheckCode(res)) {
          this.objAd = res.data[0] || {};
          this.objAd.photoPath = this.objAd.fileCode ? 'api/background/file/preview?fileCode=' +
            this.objAd.fileCode : ""
        }
      })
    },
    // 显示选字验证码面板
    showCodePanel(ref){
      // 检测是否输入手机号
      this.$refs[ref].validateField('phoneNo',(string) => {
        if(!string && this.countdown === 0){
          this.showPanel = true;
          this.isActive= false;
        }else if(this.countdown >0){
          this.$message({
            type: 'error',
            message: `请${this.countdown}s稍后再尝试`
          })
        }
      })
    },
    // 关闭选字面板
    closeCodePanel(){
      this.showPanel=false;
      this.isActive =true;
    },
    // 选字验证码成功
    codeSuccess(vm){
      // vm 为Verify组件的实例，通过$emit传递
      vm.showImage = false;  // 让验证图片消失，显示验证成功信息
      // 检测当前是否已经发送过验证码  isCode为true代表未发送
      if (this.countdown == 0 && this.isCode) {
            this.isCode = false;
            this.getNewSmsVerification({
              phone: this.regForm.phoneNo || this.recoverForm.phoneNo,
              useType: '1',
              verifyType: '2'  // 代表语音验证， 后台默认为1（短信验证）
            })
            .then( (res) => {
               if (this.successCheckCode(res)) {
                  this.hasMsn = true;
                  this.countdown = 120;
                  this.isActive = true;
                  this.timer = setInterval(() => {
                    --this.countdown;
                    if(this.countdown === 0){
                      this.showPanel = false  // 验证成功信息消失
                    }
                  }, 1000);
                  this.$message({
                    type: 'success',
                    message: '语音验证码发送成功，请留意手机来电'
                  });
                } else {
                  this.isCode = true;
                  this.showPanel = false;
                }
            })
          }    
    }
  }
}
</script>
<style lang="scss">
.register {
  position: relative;
  height: 100%;
  min-width: 1200px;
  /*min-height: 932px;*/
  overflow: auto;
  background: #fff url("../../../../static/image/reg_bg.jpg") no-repeat 50% 0;
  background-size: 100% 100%;

  a {
    color: #02adff;
  }

  .give {
    background: url(../../../../static/image/give.svg) no-repeat;
    width: 940px;
    height: 46px;
    display: block;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 20px;
    font-size: 16px;
    color: #001348;
    line-height: 52px;
    letter-spacing: 1px;
    text-align: center;
    cursor: pointer;
    span {
      color: #fa6400;
    }
  }
  .regBox {
    width: 940px;
    height: 688px;
    margin: 0 auto;
    margin-top: 73px;
    position: relative;
    background: #ffffff;
    box-shadow: 0 0 6px 0 rgba(192, 204, 218, 0.5);
    border-radius: 8px;
    padding: 0 25px;
    padding-top: 38px;
    z-index: 2;

    .top {
      position: absolute;
      top: -52px;
      left: 0;
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding: 0 26px;

      .title {
        font-size: 20px;
        color: #626262;
        float: left;
      }

      .step {
        float: right;

        ul {
          li {
            float: left;

            span {
              display: inline-block;
              width: 32px;
              height: 32px;
              line-height: 32px;
              text-align: center;
              border-radius: 50%;
              border: 1px solid #c0ccda;
              color: #c0ccda;
              margin-right: 5px;
            }
          }

          li:first-child,
          .step2 {
            &::after {
              content: "";
              width: 80px;
              height: 1px;
              background: #c0ccda;
              margin: 0 20px;
              margin-bottom: 4px;
              display: inline-block;
            }
          }

          li.active {
            color: #02adff;

            span {
              color: #fff;
              background: #02adff;
              border-color: #02adff;
            }
          }

          li.activated {
            color: #c0ccda;

            span {
              color: #c0ccda;
              background: #e8ecef;
              border-color: #e8ecef;
            }
          }
        }
      }
    }

    .reg {
      .tab {
        border-bottom: 1px solid #e8ecef;
        padding: 0 205px;
        margin-bottom: 30px;

        span {
          display: inline-block;
          width: 237px;
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
            bottom: -1px;
            left: 0;
          }
        }
      }

      .el-form {
        width: 480px;
        margin: 0 auto;

        .el-form-item__label {
          padding-right: 20px;
        }

        .el-form-item {
          margin-bottom: 30px;
        }

        input.el-input__inner {
          background: none;
        }

        .verify {
          width: 240px;
        }

        .codebtn {
          padding: 10px 24px;
          float: right;
          border-color: #c0ccda;
          width: 120px;
          border-radius: 4px;

          span {
            color: #c0ccda;
          }

          &:hover,
          &:focus {
            background: none;
          }

          &.active {
            background: #02adff;
            border-color: #02adff;

            span {
              color: #fff;
            }
          }

          &.active:hover {
            background: #0073bd;
            border-color: #0073bd;
          }
        }

        .el-form-item.is-required .el-form-item__label:before {
          display: none;
        }

        .voice-code{
          position: relative;

          p{
            font-size: 12px;
            text-align: right;
            height: 20px;
            line-height: 20px;
            cursor: pointer;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
            span{
              color: skyblue;
            }
          }
        }
        
        .password {
          position: absolute;
          right: 10px;
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
          right: 10px;
          top: 12px;
          width: 16px;
          height: 16px;
          background: url(../../../../static/image/visible.png) no-repeat;
          cursor: pointer;

          &:hover {
            background: url(../../../../static/image/visible_hover.png)
              no-repeat;
          }
        }

        .pcode {
          width: 120px;
          height: 36px;
          float: right;
        }
      }

      .nextBox {
        width: 480px;
        margin: 0 auto;

        .protocol {
          margin-left: 98px;
          margin-bottom: 30px;

          .el-checkbox__inner {
            border-radius: 50%;
          }

          .el-checkbox__label {
            padding-left: 10px;
          }
        }

        .regbtn {
          margin-left: 98px;
          margin-top: 20px;
          background: #c0ccda;
          border: none;
          cursor: default;

          span {
            font-size: 16px;
            color: #999;
          }

          &.active {
            cursor: pointer;
            background: #02adff;
            border-color: #02adff;

            span {
              color: #fff;
            }
          }

          &.active:hover {
            background: #0073bd;
            border-color: #0073bd;
          }
        }

        .forgetbtn {
          margin-top: 20px;
        }
      }
    }

    .success {
      padding-top: 12px;
      text-align: center;

      img {
        margin-bottom: 30px;
      }

      .regTip {
        line-height: 28px;
        font-size: 20px;
        color: #333333;
        margin-bottom: 10px;
      }

      .regName {
        color: #626262;
        line-height: 20px;
        margin-bottom: 50px;
      }

      .toHome,
      .certify {
        margin-bottom: 96px;
        border-color: #02adff;

        span {
          font-size: 16px;
          color: #02adff;
        }
      }

      .toHome:hover {
        background: none;
      }

      .certify,
      .relogin {
        border-color: #02adff;
        background: #02adff;

        span {
          color: #fff;
        }
      }

      .relogin {
        margin-top: 50px;
      }

      .certification {
        width: 345px;
        margin: 0 auto;
        text-align: left;
        line-height: 26px;
        color: #3f3f3f;

        p {
          color: #989a9c;
        }
      }
    }

    .el-button {
      border-radius: 8px;
      padding: 17px 30px;
      width: 160px;
    }
  }
  .Copyright {
    text-align: center;
    color: #c0ccda;
    /*position: absolute;*/
    /*bottom: 20px;*/
    line-height: 20px;
    /*left: 50%;*/
    padding-top: 60px;
    padding-bottom: 20px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>