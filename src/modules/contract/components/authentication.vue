<template>
  <div class="authentication">
    <heads></heads>
    <div class="contentbox">
      <div class="top">
        <div class="clearfix top-inner">
          <div class="back">
            <span class="fanhui"
                  @click="goBack">返回</span>
            <span>客服电话：400-919-6663</span>
          </div>
          <div class="title">{{ pageTitle }}</div>
          <el-button @click="manualAudit"
                     v-if="auditStatus !== 1">人工实名认证</el-button>
        </div>
        <real-name-tips :auditStatus="auditStatus"
                        :reason="reason"></real-name-tips>
      </div>
      <div class="box">
        <!-- <div class="authen" v-if="!success">
                    <div class="person info" v-if="path == 'personauthen'">请填写<br>您相关身份证信息完成认证</div>
                    <div class="company info" v-if="path == 'companyauthen'">请在手机上准备<br>法人身份证、营业执照来完成认证</div>
                    <el-form label-position="right" label-width="110px" :rules="rules" ref="form" :model="formData">
                        <div v-if="path == 'personauthen'">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="formData.name" placeholder="请您输入姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="身份证号码" prop="IDcard">
                                <el-input v-model="formData.IDcard" placeholder="请您输入身份证号码"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="path == 'companyauthen'">
                            <el-form-item label="企业名称" prop="enterpriseName">
                                <el-input v-model="formData.enterpriseName" placeholder="请输入企业名称"></el-input>
                            </el-form-item>
                            <el-form-item label="信用代码" prop="creditCode">
                                <el-input v-model="formData.creditCode" placeholder="请输入信用代码"></el-input>
                            </el-form-item>
                            <el-form-item label="法人姓名" prop="legalName">
                                <el-input v-model="formData.legalName" placeholder="请输入法人姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="法人身份证号" prop="legalIdCard">
                                <el-input v-model="formData.legalIdCard" placeholder="请输入法人身份证号"></el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                    <div class="protol"><el-checkbox v-model="checked">已阅读并同意<a href="javascript:;" @click="routerTo('agreement')">《安印云平台使用协议》</a>及<a href="javascript:;" @click="routerTo('privacy')">《隐私条款》</a></el-checkbox></div>
                    <div class="foot">
                        <el-button class="regbtn" @click="submit_Form('form')" :class="{active: isActive}">开始认证</el-button>
                    </div>
                </div> -->
        <div class="tab">
          <span :class="{ active: type != 1 }"
                @click="$router.push(`${path}`)">
            <span class="inner-text">
              人脸识别认证
              <i class="recommend"></i></span>
          </span>
          <span :class="{ active: type == 1 }"
                v-if="userType == '01'"
                @click="$router.push(`${path}?type=1`)">对公转账认证</span>
        </div>
        <div class="corporate"
             v-if="type == 1">
          <div class="step"
               :class="`step${step}`">
            <!-- <span style="margin-right: 35px;">1.企业信息验证</span>
                        <span>2.填写公司对公账户信息</span>
                        <span style="margin-left: 30px;margin-right: 38px;">3.确认验证打款金额</span>
                        <span>4.认证完成</span> -->
          </div>
          <el-form label-position="left"
                   label-width="120px"
                   ref="form1"
                   :model="formData"
                   :rules="rules"
                   v-if="step == 1">
            <div>
              <el-form-item label="企业名称"
                            prop="companyName">
                <el-input v-model.trim="formData.companyName"
                          placeholder="请输入企业名称"></el-input>
              </el-form-item>
              <el-form-item label="信用代码"
                            prop="creditCode">
                <el-input v-model="formData.creditCode"
                          placeholder="请输入企业信用代码"></el-input>
              </el-form-item>
              <el-form-item label="法人姓名"
                            prop="legalName">
                <el-input v-model.trim="formData.legalName"
                          placeholder="请输入法人姓名"></el-input>
              </el-form-item>
              <el-form-item label="法人身份证号码"
                            prop="cardNumber">
                <el-input v-model="formData.cardNumber"
                          placeholder="请输入法人身份证号码"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <el-form label-position="left"
                   label-width="120px"
                   ref="form2"
                   :model="formData"
                   :rules="rules"
                   v-if="step == 2">
            <div>
              <el-form-item label="企业对公账户"
                            prop="bankNumber">
                <el-input v-model.trim="formData.bankNumber"
                          placeholder="请输入企业对公账户"></el-input>
              </el-form-item>
              <el-form-item label="开户行名称"
                            prop="bankName">
                <!-- <el-input v-model="formData.bankName" placeholder="请输入开户行名称"></el-input> -->
                <!-- <el-autocomplete v-model="formData.bankName" custom-item="selectBankInput"
                                    :fetch-suggestions="querySearchBanks" @select="handleSelectBank"></el-autocomplete> -->
                <select-bank-input v-model="formData.bankName"></select-bank-input>
              </el-form-item>
              <el-form-item label="开户行所在地"
                            prop="bankAddress">
                <!-- <el-cascader :options="areaOptions" @active-item-change="handleItemChange" props="props"
                                    v-if="areaOptions.length>0"> -->
                <el-cascader :options="areaOptions"
                             v-model="formData.bankAddress"
                             @change="handleItemChange"
                             expand-trigger="hover"
                             clearable>
                </el-cascader>
              </el-form-item>
              <el-form-item label="开户行支行名称"
                            prop="bankSubName">
                <el-input v-model.trim="formData.bankSubName"
                          placeholder="请输入开户行支行名称"></el-input>
              </el-form-item>
              <el-form-item label="开户行联行号"
                            prop="bankCard">
                <el-input v-model="formData.bankCard"
                          placeholder="请输入开户行联行号"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <el-form label-position="left"
                   label-width="120px"
                   ref="form3"
                   :model="formData"
                   :rules="rules"
                   v-if="step == 3">
            <div>
              <p class="tip-warn">
                <span class="tishi">温馨提示：</span>
                <span class="tips">
                  1、请耐心等待，打款金额一般在1~2个工作日内到账，如未到账请及时联系客服。<br />
                  2、查收到打款金额后，再次回到此页面填写金额完成认证。<br />
                  3、如果超过2个工作日仍未收到打款金额，请重新提交认证且保证公司账户信息的准确。
                </span>
              </p>
              <el-form-item label="收款金额"
                            prop="money">
                <el-input v-model="formData.money"
                          placeholder="请输入收款金额"
                          type="number"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <el-form>
            <div v-if="step == 4">
              <div class="success"
                   v-if="verifySuccessfulOrNot">
                <div class="step-suces">
                  <img src="../../../../static/image/caozuochenggong.svg"
                       alt=""
                       width="44"
                       height="44" />
                  <br />
                  <span>企业实名认证成功</span>
                  <p>
                    您已完成实名认证，可以开始发起具备法律效力的电子合同了。
                  </p>
                </div>
                <div>
                  <el-button type="primary"
                             class="gosign"
                             @click="gotoSignBtn">发起签约</el-button>
                  <el-button class="back-index"
                             @click="backToIndexBtn">返回首页</el-button>
                </div>
              </div>
              <div class="error"
                   v-else>
                <div class="step-suces">
                  <img src="../../../../static/image/caozuoshibai.svg"
                       alt="" />
                  <br />
                  <span>企业实名认证失败</span>
                  <p>
                    企业收款金额填写错误，请重新填写金额后发起验证
                  </p>
                </div>
                <div>
                  <el-button type="primary"
                             class="gosign"
                             @click="reSubmitBtn">重新认证</el-button>
                  <el-button class="back-index"
                             @click="reVarifyMoneyBtn">重验金额</el-button>
                </div>
              </div>
            </div>
          </el-form>
          <div style="padding: 0px 156px;">
            <div class="btn-bottom">
              <el-button class="next"
                         @click="toUpStep"
                         v-show="step == 2"
                         :class="{ 'step2-btn': step == 2 }"
                         style="backgroundcolor: white;">上一步
              </el-button>
              <el-button class="next"
                         @click="reSubmitBtn"
                         v-show="step == 3"
                         :class="{ 'step2-btn': step == 3 }"
                         style="backgroundcolor: white;">重新认证
              </el-button>
              <el-button class="next"
                         @click="toNext"
                         v-show="step != 4"
                         :class="nextClass">{{ step === 3 ? "确定" : "下一步" }}
              </el-button>
            </div>
            <p class="tip-warn"
               v-show="step == 1">
              <span class="tishi">温馨提示：</span>
              <span class="tips">
                1、对公转账认证，一般需要经过1~2个工作日处理；<br />
                2、请仔细核对填写信息正确、真实；
              </span>
            </p>
          </div>
        </div>
        <div class="success"
             v-show="success && type != 1">
          <div>扫码认证</div>
          <p v-if="path == 'companyauthen'">
            请在手机上准备法人身份证、营业执照，微信扫码完成认证
          </p>
          <p v-else>请用微信扫描二维码进行实名认证</p>
          <div id="qrcode"></div>
          <el-button type="primary"
                     @click="routerTo('index')">已扫码完成实名认证</el-button>
          <el-button @click="goHelp()">扫码认证失败</el-button>
        </div>
      </div>
    </div>
    <foot></foot>
  </div>
</template>
<script>
import heads from "./heads";
import foot from "./foot";
import service from "../../../assets/mixin/service";
import valid from "../mixin/valid";
import { options } from "@/assets/address.js";
import { sessionStore, cookieStore } from "@/utils";
import selectBankInput from "../../../components/selectBankInput";
import realNameTips from "../../../components/realNameTips";
export default {
  mixins: [service, valid],
  components: { heads, foot, selectBankInput, realNameTips },
  data() {
    var checkUniformCreditCode = (rule, value, callback) => {
      if (/^([A-Z0-9]{15}|[A-Z0-9]{18}|[A-Z0-9]{20})$/.test(value)) {
        // this.checkedCreditCodeFn().then(res => {
        //     if (this.successCheckCode(res)) {
        //     } else {
        //         // callback(new Error(""));
        //     }
        // });
        callback();
      } else {
        callback(new Error("请输入正确的统一社会信用代码"));
      }
    };
    var checkLinkName = (rule, value, callback) => {
      var flag = false;
      for (var i = 0; i < value.length; i++) {
        var val = value.charAt(i);
        if (isNaN(parseInt(val))) {
          flag = true;
        } else {
          flag = false;
          break;
        }
      }
      if (flag && value.replace(/(^\s*)|(\s*$)/g, "").length != 0) {
        callback();
      } else {
        callback(new Error("请输入正确的法人姓名"));
      }
    };
    var checkArray = (rule, value, callback) => {
      if (value.length > 0) {
        let flag = value.every((item) => {
          return item;
        });
        if (flag) {
          callback();
        } else {
          callback(new Error("请选择开户行所在地"));
        }
      } else {
        callback(new Error("请选择开户行所在地"));
      }
    };
    return {
      pageTitle: "",
      path: "",
      formData: {
        bankAddress: [],
      },
      checked: false,
      success: true,
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        IDcard: [
          {
            required: true,
            message: "请输入身份证号码",
            trigger: "blur",
          },
          { validator: this.checkIdCard, trigger: "blur" },
        ],
        //step1
        companyName: [
          {
            required: true,
            message: "请输入企业名称",
            trigger: "blur",
          },
          {
            max: 33,
            message: "您输入的企业名称字符长度已超出限制",
            trigger: "blur",
          },
          { validator: this.checkEnterpriseName, trigger: "blur" },
        ],
        creditCode: [
          {
            required: true,
            message: "请输入信用代码",
            trigger: "blur",
          },
          { validator: checkUniformCreditCode, trigger: "blur" },
        ],
        legalName: [
          {
            required: true,
            message: "请输入法人姓名",
            trigger: "blur",
          },
          {
            max: 20,
            message: "您输入的法人姓名字符长度已超出限制",
            trigger: "blur",
          },
          { validator: checkLinkName, trigger: "blur" },
        ],
        cardNumber: [
          {
            required: true,
            message: "请输入法人身份证号",
            trigger: "blur",
          },
          // { validator: validateCredentials2, trigger: "blur" }
          { validator: this.checkIdCard, trigger: "blur" },
        ],
        //step2
        bankNumber: [
          {
            required: true,
            message: "请输入企业对公账户",
            trigger: "blur",
          },
          {
            message: "请输入正确的企业对公账户",
            trigger: "blur",
            pattern: /^([1-9]{1})(\d{11,23})$/,
          },
        ],
        bankName: [
          {
            required: true,
            message: "请输入开户行名称",
            trigger: "blur",
          },
          {
            max: 20,
            message: "您输入的开户行名称字符长度已超出限制",
            trigger: "blur",
          },
        ],
        bankSubName: [
          {
            required: true,
            message: "请输入开户行支行名称",
            trigger: "blur",
          },
          {
            max: 25,
            message: "您输入的开户行支行名称字符长度已超出限制",
            trigger: "blur",
          },
        ],
        bankCard: [
          {
            required: true,
            message: "请输入开户行联行号",
            trigger: "blur",
          },
          {
            message: "请输入正确的开户行联行号",
            trigger: "blur",
            pattern: /^[0-9]{12}$/,
          },
        ],
        bankAddress: [
          {
            required: true,
            message: "请选择开户行所在地",
            trigger: "blur",
            type: "array",
          },
          { validator: checkArray, trigger: "blur" },
        ],
        //step3
        money: [
          {
            required: true,
            message: "请输入收款金额",
            trigger: "blur",
            pattern: /^\d|\w$/,
          },
        ],
      },
      isActive: false,
      hasAuthen: false,
      type: 0,
      step: 1,
      areaOptions: options,
      selectedOptions: [],
      props: {
        value: "value",
        label: "label",
        children: "children",
      },
      userId: "", //用户id
      userType: "", //用户类型
      verifySuccessfulOrNot: false, //金额验证成功还是失败
      publicId: "", //后台返回的当前认证记录数据key值;
      isCanNextClick: true, //是否能点击下一步
      auditStatus: "", //审核状态(1:待审核;2:待扫脸;3:已通过;4:驳回) ,
      reason: "", //驳回原因
      // props: {
      //     value: 'proId',
      //     label: 'proName',
      //     children: 'cities'
      // }
    };
  },
  computed: {
    nextClass() {
      let obj = {
        "active-next": this.isActive,
        "step2-btn": this.step == 2 || this.step == 3,
        "step1-btn": this.step === 1,
      };
      return obj;
    },
  },
  watch: {
    formData: {
      handler(oVal, nVal) {
        if (
          (this.formData.name ||
            this.formData.IDcard ||
            this.formData.companyName ||
            this.formData.creditCode ||
            this.formData.legalName ||
            this.formData.cardNumber) &&
          this.step == 1
        ) {
          this.isActive = true;
        } else if (
          (this.formData.bankNumber ||
            this.formData.bankName ||
            this.formData.bankSubName ||
            this.formData.bankAddress ||
            this.formData.bankCard) &&
          this.step == 2
        ) {
          this.isActive = true;
        } else if (this.formData.money && this.step == 3) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
      },
      deep: true,
    },
    $route() {
      this.type = this.$route.query.type;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.pageTitle = this.$route.meta.title;
      this.path = this.$route.path.match(/([^/]+)$/)[1];
      this.type = this.$route.query.type;
      if (this.path == "companyauthen") {
        $(".box").css("height", "600px");
      }
      // this.getProvince({
      //     currPage: 1,
      //     pageSize: 100
      // }).then(res => {
      //     if (this.successCheckCode(res)) {
      //         this.areaOptions = res.data.records;
      //         this.areaOptions.forEach(ele => {
      //             ele.cities = [];
      //         })
      //     }
      // })
      this.save();
      //设置初始化
      this.init();
    });
  },
  methods: {
    init() {
      // let sessionFromData = sessionStore.get('authCompanyInfo');
      // for (const key in sessionFromData) {
      //     if (sessionFromData.hasOwnProperty(key)) {
      //         this.$set(this.formData, key, sessionFromData[key]);
      //     }
      // }
      // this.formData.step = this.step;
      // this.userId = cookieStore.get('userinfo').userId;
      this.userId = JSON.parse($.cookie("userinfo")).userId;
      this.userType = JSON.parse($.cookie("userinfo")).userType;
      this.getPublicTransferByUserIdFn(); //获取当前用户在第几部只有这个功能
      this.getAuditInfoFn();
    },
    //验证
    // submit_Form(ref) {
    //     this.$refs[ref].validate((valid) => {
    //         if (valid) {
    //             this.save();
    //         }
    //     });
    // },
    save() {
      /*//https://wxdev.i-yin.com.cn/miniapp/living/
    console.log(window.location.href)
    this.success = true*/
      if (this.path == "companyauthen") {
        // var creditCode = this.formData.creditCode;
        // var enterpriseName = this.formData.enterpriseName;
        // var legalIdCard = this.formData.legalIdCard;
        // var legalName = this.formData.legalName;
        this.realName({
          // creditCode: creditCode.replace(/(^\s*)|(\s*$)/g,""),
          // enterpriseName: enterpriseName.replace(/(^\s*)|(\s*$)/g,""),
          // legalIdCard: legalIdCard.replace(/(^\s*)|(\s*$)/g,""),
          // legalName: legalName.replace(/(^\s*)|(\s*$)/g,"")
        }).then((res) => {
          if (this.successCheckCode(res)) {
            this.success = true;
            this.qrcode(res.data);
          }
        });
      } else {
        var IDcard = this.formData.IDcard;
        var name = this.formData.name;
        this.personInit({
          // "idCard": IDcard.replace(/(^\s*)|(\s*$)/g,""),
          // "realName": name.replace(/(^\s*)|(\s*$)/g,"")
        }).then((res) => {
          if (this.successCheckCode(res)) {
            this.success = true;
            this.qrcode(res.data);
          }
        });
      }
    },
    qrcode(data) {
      var qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 160,
        height: 160,
      });
      qrcode.makeCode(data);
      $("#qrcode").attr("title", "");
    },
    routerTo(val) {
      if (this.path == "companyauthen") {
        this.enterpriseDetail().then((res) => {
          if (this.successCheckCode(res)) {
            this.hasAuthen = res.data.realNameAuthenticationFlag;
            if (this.hasAuthen == 1) {
              // 1 已认证
              let userinfo = JSON.parse($.cookie("userinfo"));
              userinfo.realNameAuthenticationFlag = 1;
              userinfo.enterPriseName = res.data.enterpriseName;
              $.cookie("userinfo", JSON.stringify(userinfo), {
                path: "/",
                domain: this.$domain,
              });
              this.$router.push(val);
            } else {
              this.$confirm(
                "您是否已经完成实名认证？",
                "实名认证",
                {
                  type: "warning",
                  confirmButtonText: "是",
                  cancelButtonText: "否",
                  customClass: "self-icon icon-living",
                }
              )
                .then(() => {
                  this.$router.push(val);
                })
                .catch(() => { });
            }
          }
        });
      } else {
        this.personDetail().then((res) => {
          if (this.successCheckCode(res)) {
            this.hasAuthen = res.data.realNameAuthenticationFlag;
            if (this.hasAuthen == 1) {
              // 1 已认证
              let userinfo = JSON.parse($.cookie("userinfo"));
              userinfo.realNameAuthenticationFlag = 1;
              $.cookie("userinfo", JSON.stringify(userinfo), {
                path: "/",
                domain: this.$domain,
              });
              this.$router.push(val);
            } else {
              this.$confirm(
                "您是否已经完成实名认证？",
                "实名认证",
                {
                  type: "warning",
                  confirmButtonText: "是",
                  cancelButtonText: "否",
                  customClass: "self-icon icon-living",
                }
              )
                .then(() => {
                  this.$router.push(val);
                })
                .catch(() => { });
            }
          }
        });
      }
    },
    goHelp() {
      window.open(
        "https://www.i-yin.com.cn/index.php?c=article&a=type&tid=167"
      );
    },
    toNext() {
      // this.step++
      if (!this.isCanNextClick) {
        return;
      }
      //检测信息是否完整
      this.$nextTick(() => {
        let checkAfterSaleForm = function (item) {
          return new Promise((resolve, reject) => {
            item.validate((valid) => {
              if (valid) {
                resolve(true);
              } else {
                reject(false);
              }
            });
          });
        };
        let funcs = [];
        let refsName = "form" + this.step;
        funcs[0] = checkAfterSaleForm(this.$refs[refsName]);
        Promise.all(funcs).then(async (data) => {
          // console.info(data);
          // data 里是各个字段的验证错误信息, 如果为空串则认为验证通过, 如果数组里全为空串则所有验证通过
          // 判断data 里是否全是空串
          this.isCanNextClick = false;
          this.formData.step = this.step;
          this.formData.userId = this.userId;
          switch (this.step) {
            case 1:
              this.formData.id = this.publicId;
              // await this.checkedNameAndIdCardFn().then(async res => {
              //   if (this.successCheckCode(res)) {
              //   } else {
              //     return;
              //   }
              // });
              // await this.checkedCreditCodeFn().then(res => {
              //   if (this.successCheckCode(res)) {
              //   } else {
              //     return;
              //   }
              // });
              break;
            // sessionStore.set('authCompanyInfo', this.formData);
            case 2: //保存提交公司信息
            // this.formData.id = this.publicId;
            // break;
            case 3:
              this.formData.id = this.publicId;
              break;
          }
          if (this.step === 1) {
            await this.checkCreditCodeAndNameFn(this.formData);
          } else {
            this.toNextAndSaveFn(this.formData);
            // this.saveVarifyCompanyInfoFn(this.formData)
            //   .then(res => {
            //     if (this.successCheckCode(res)) {
            //       res = res.data;
            //       if (res.code == 0) {
            //         if (this.step == 3) {
            //           //金额检测成功
            //           this.verifySuccessfulOrNot = true;
            //           $.cookie("userinfo.realNameAuthenticationFlag", '1');//设置实名认证标识
            //           let userinfo = JSON.parse($.cookie("userinfo"));//设置实名认证标识
            //           userinfo.realNameAuthenticationFlag = '1';
            //           $.cookie("userinfo", JSON.stringify(userinfo), {
            //             path: "/",
            //             domain: this.$domain
            //           });//设置实名认证标识
            //         } else {
            //           //非金额检测步骤还原
            //           this.verifySuccessfulOrNot = false;
            //         }
            //         console.log("++++");
            //         this.step++;
            //       } else {
            //         //下一步失败
            //         if (res.code === 200003) {
            //           if (this.step == 3) {
            //             //金额检测失败
            //             this.verifySuccessfulOrNot = false;
            //             this.step++;
            //           }
            //         } else {
            //           if (this.step !== 1) {//第一步报错走checkCreditCodeAndNameFn
            //             this.$message.warning(res.msg);
            //           }
            //         }
            //       }
            //       this.isCanNextClick = true;
            //     } else {
            //       this.isCanNextClick = true;
            //     }
            //   }).fail(err => {
            //     this.isCanNextClick = true;
            //   });
          }
        });
      });
    },
    toUpStep() {
      //上一步
      this.step--;
      //检测信息是否完整
      this.$nextTick(() => {
        let checkAfterSaleForm = function (item) {
          return new Promise((resolve, reject) => {
            item.validate((valid) => {
              if (valid) {
                resolve(true);
              } else {
                reject(false);
              }
            });
          });
        };
        let funcs = [];
        let refsName = "form" + this.step;
        funcs[0] = checkAfterSaleForm(this.$refs[refsName]);
      });
    },
    manualAudit() {
      this.$router.push("manualAudit");
    },
    handleItemChange(val) {
      if (val.length == 2) {
        this.formData.province = val[0];
        this.formData.city = val[1];
      } else {
        this.formData.province = "";
        this.formData.city = "";
      }
    },
    //检测社会信用代码
    checkedCreditCodeFn() {
      let data = {
        companyName: this.formData.companyName,
        creditCode: this.formData.creditCode,
        legalName: this.formData.legalName,
      };
      return this.checkedCreditCode(data);
    },
    //检测法人名称与法人身份证id
    checkedNameAndIdCardFn() {
      let data = {
        idCard: this.formData.cardNumber,
        name: this.formData.legalName,
      };
      return this.checkedNameAndIdCard(data);
    },
    saveVarifyCompanyInfoFn(data) {
      return this.saveVarifyCompanyInfo(data).then((res) => {
        if (this.successCheckCode(res)) {
          this.publicId = res.data.publicId;
        }
        return res;
      });
    },
    //下一步且保存
    toNextAndSaveFn(data) {
      this.saveVarifyCompanyInfoFn(data)
        .then(async (res) => {
          if (this.successCheckCode(res)) {
            res = res.data;
            if (res.code == 0) {
              if (this.step == 3) {
                //金额检测成功
                // $.cookie(
                //     "userinfo.realNameAuthenticationFlag",
                //     "1"
                // ); //设置实名认证标识

                // let userinfo = JSON.parse($.cookie("userinfo")); //设置实名认证标识
                // userinfo.realNameAuthenticationFlag = "1";
                // $.cookie("userinfo", JSON.stringify(userinfo), {
                //     path: "/",
                //     domain: this.$domain,
                // }); //设置实名认证标识
                await this.changeLocalUserInfo();
                this.verifySuccessfulOrNot = true;
              } else {
                //非金额检测步骤还原
                this.verifySuccessfulOrNot = false;
              }
              console.log("++++");
              this.step++;
            } else {
              //下一步失败
              if (res.code === 200003) {
                if (this.step == 3) {
                  //金额检测失败
                  this.verifySuccessfulOrNot = false;
                  this.step++;
                }
              } else if (res.code === 200012) {
                this.$message.warning(res.msg);
                await this.changeLocalUserInfo();
                setTimeout(() => {
                  this.$router.replace("/index");
                }, 1000);
              } else {
                this.$message.warning(res.msg);
              }
            }
            this.isCanNextClick = true;
          } else {
            this.isCanNextClick = true;
          }
        })
        .fail((err) => {
          console.log(err);
          this.isCanNextClick = true;
        });
    },
    checkCreditCodeAndNameFn(data) {
      return this.checkCreditCodeAndName(data).then((res) => {
        if (this.successCheckCode(res)) {
          res = res.data;
          //接口报错停止下一步 --如网络中断等
          if (res.code === 6019) {
            this.$confirm(
              "为保证您的数据安全，继续实名将会删除之前上传的文件资料，请先保存文件。若无文件请忽略继续实名。",
              "风险提示！",
              {
                type: "warning",
                confirmButtonText: "继续实名认证",
                cancelButtonText: "取消",
                customClass: "self-icon icon-safe auth-confirm",
              }
            )
              .then(() => {
                this.toNextAndSaveFn(data);
              })
              .catch(() => { });
          } else if (res.code !== 0) {
            this.$message.warning(res.msg);
          } else if (res.code === 0) {
            this.toNextAndSaveFn(data);
          }
        }
        this.isCanNextClick = true;
      });
    },
    getPublicTransferByUserIdFn() {
      this.getPublicTransferByUserId(this.userId).then((res) => {
        if (this.successCheckCode(res)) {
          let data = res.data;
          if (data) {
            this.step = ++data.step;
            for (const key in data) {
              if (data.hasOwnProperty(key) && key !== "money") {
                this.$set(this.formData, key, data[key]);
              }
            }
            let bankAddress = [];
            bankAddress[0] = this.formData.province;
            bankAddress[1] = this.formData.city;
            this.publicId = data.id;
            console.log(this.publicId);
            this.$set(this.formData, "bankAddress", bankAddress);
          }
        }
      });
    },
    backToIndexBtn() {
      this.$router.push("/index");
    },
    gotoSignBtn() {
      this.checkPermission(
        // 权限校验
        this.$perMap.contractMgt.saveSignPosition.url,
        this.$perMap.contractMgt.saveSignPosition.method
      ).then((res) => {
        if (!this.successCheckCode(res)) {
          return;
        }
        // $.cookie("userinfo.realNameAuthenticationFlag", '1');//设置实名认证标识
        // let userinfo = JSON.parse($.cookie("userinfo"));//设置实名认证标识
        // userinfo.realNameAuthenticationFlag = '1';
        // $.cookie("userinfo", JSON.stringify(userinfo), {
        //   path: "/",
        //   domain: this.$domain
        // });//设置实名认证标识
        this.$router.push("/contractsign");
        // if (!this.$store.getters.companyPhone) {
        //   this.$router.push("/companyinit");
        // } else {
        // }
      });
    },
    reSubmitBtn() {
      this.reSubmitPubTransfer().then(async (res) => {
        if (this.successCheckCode(res)) {
          res = res.data;
          if (res.code === 200012) {
            this.$message.warning(res.msg);
            await this.changeLocalUserInfo();
            setTimeout(() => {
              this.$router.replace("/index");
            }, 1000);
          }
          this.step = 1;
          this.formData = {
            bankAddress: [],
          };
          this.publicId = "";
        }
      });
    },
    reVarifyMoneyBtn() {
      this.reVerifyMoney(this.publicId).then(async (res) => {
        if (this.successCheckCode(res)) {
          res = res.data;
          if (res.code === 200012) {
            this.$message.warning(res.msg);
            await this.changeLocalUserInfo();
            setTimeout(() => {
              this.$router.replace("/index");
            }, 1000);
          }
          this.step = 3;
        }
      });
    },
    goBack() {
      this.$router.push("accountmanager");
    },
    //企业认证后--修改本地用户信息
    changeLocalUserInfo() {
      return this.enterpriseDetail().then((res) => {
        if (this.successCheckCode(res)) {
          this.hasAuthen = res.data.realNameAuthenticationFlag;
          if (this.hasAuthen == 1) {
            // 1 已认证
            let userinfo = JSON.parse($.cookie("userinfo"));
            userinfo.realNameAuthenticationFlag = 1;
            userinfo.enterPriseName = res.data.enterpriseName;
            userinfo.enterpriseInfoList.map((eitem) => {
              if (eitem.enterpriseId == res.data.enterpriseId) {
                eitem.enterPriseName = res.data.enterpriseName;
                eitem.realNameAuthenticationFlag = 1;
              }
            });
            $.cookie("userinfo", JSON.stringify(userinfo), {
              path: "/",
              domain: this.$domain,
            });
            // this.$router.push(val);
          }
        }
      });
    },
    getAuditInfoFn() {
      this.getAuditInfo().then((res) => {
        if (this.successCheckCode(res)) {
          this.userType = res.data.userType;
          this.auditStatus = res.data.auditStatus;
          if (this.auditStatus === 4) {
            //驳回
            this.reason = res.data.reason;
          }
        }
      });
    },
    // toCompanyBox(){
    //     // if
    //     $router.push(`${path}?type=1`)
    // },
  },
  beforeDestroy() {
    sessionStore.remove("authCompanyInfo");
  },
};
</script>
<style lang="scss">
.authentication {
  position: relative;
  height: 100%;
  min-width: 1200px;
  /*min-height: 768px;*/
  background: #fff url("../../../../static/image/reg_bg.jpg") no-repeat 50% 0;
  background-size: 100% 100%;

  a {
    color: #02adff;
  }

  .contentbox {
    width: 100%;
    height: calc(100% - 120px);
    overflow: auto;
    .top {
      // position: absolute;

      // top: -52px;
      // left: 0;
      width: 940px;
      // height: 32px;
      line-height: 32px;
      margin: 0 auto;
      // padding: 0 26px;
      &-inner {
        margin: 20px 0;
      }
      .title {
        font-size: 20px;
        color: #333;
        float: left;
        padding: 0 182px;
      }

      .back {
        float: left;
        color: #626262;

        .fanhui {
          display: inline-block;
          padding-left: 22px;
          background: url(../../../../static/image/fanhui-2.svg) left center
            no-repeat;
          cursor: pointer;
          margin-right: 15px;

          &:hover {
            background: url(../../../../static/image/fanhui-1.svg) left center
              no-repeat;
            color: #02adff;
          }
        }
      }

      .el-button {
        float: right;
        border-color: #02adff;
        background: none;

        span {
          color: #02adff;
        }
      }
    }

    .box {
      width: 940px;
      height: 540px;
      margin: 0 auto;
      position: relative;
      background: #ffffff;
      box-shadow: 0 0 6px 0 rgba(192, 204, 218, 0.5);
      border-radius: 8px;
      padding: 0 25px;
      padding-top: 40px;

      .authen {
        width: 600px;
        margin: 0 auto;

        .info {
          height: 64px;
          font-size: 18px;
          color: #626262;
          line-height: 30px;
          margin: 0 auto;
          margin-bottom: 50px;
          text-align: left;
        }

        .person {
          width: 325px;
          padding-left: 103px;
          background: url(../../../../static/image/authen.png) no-repeat;
        }

        .company {
          width: 360px;
          padding-left: 86px;
          background: url(../../../../static/image/authen2.png) no-repeat;
        }

        .el-form {
          input.el-input__inner {
            background: none;
          }

          .el-form-item {
            margin-bottom: 30px;
          }

          .el-form-item__label {
            padding-right: 20px;
          }

          .el-form-item.is-required .el-form-item__label:before {
            display: none;
          }
        }

        .protol {
          margin-left: 110px;

          .el-checkbox__inner {
            border-radius: 50%;
          }

          .el-checkbox__label {
            padding-left: 10px;
          }
        }

        .foot {
          text-align: center;
          margin-top: 50px;

          .el-button {
            width: 180px;
            height: 50px;
            background: #c0ccda;
            border: none;

            span {
              font-size: 16px;
              color: #999;
            }

            &.active {
              background: #02adff;

              span {
                color: #fff;
              }

              &:hover {
                background: #0073bd;
              }
            }
          }
        }
      }

      .tab {
        text-align: center;
        border-bottom: 1px solid #e8ecef;
        margin-bottom: 30px;
        font-size: 0;

        span {
          display: inline-block;
          padding: 12px 72px;
          font-size: 16px;
          cursor: pointer;
          position: relative;
          &.active {
            border-bottom: 1px solid #02adff;
            color: #02adff;
          }
          .recommend {
            width: 40px;
            height: 18px;
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto 0;
            background: url("/static/image/recommend_logo.svg");
            vertical-align: middle;
            margin-left: 4px;
          }
        }
      }

      .success {
        text-align: center;

        div {
          font-size: 18px;
          color: #333333;
          line-height: 25px;
          margin-bottom: 19px;
        }

        p {
          color: #626262;
          line-height: 20px;
          margin-bottom: 37px;
        }

        img {
          // width: 160px;
          // height: 160px;
          margin: 0 auto;
          // margin-bottom: 45px;
        }

        .el-button {
          width: 180px;
          height: 50px;

          span {
            font-size: 16px;
          }
        }
      }

      .corporate {
        .step {
          width: 100%;
          height: 32px;
          line-height: 32px;
          padding-left: 153px;

          span {
            display: inline-block;
          }
        }

        .step1 {
          background: url(../../../../static/image/1.png) no-repeat center;
        }

        .step2 {
          background: url(../../../../static/image/2.png) no-repeat center;
        }

        .step3 {
          background: url(../../../../static/image/3.png) no-repeat center;
        }

        .step4 {
          background: url(../../../../static/image/4.png) no-repeat center;
        }

        .el-form {
          padding: 20px 156px 0;
        }

        .el-form-item__label {
          border: solid 1px #c0ccda;
          height: 36px;
          border-right: 0;
          border-radius: 4px 0 0 4px;
          padding-right: 0;
          padding-left: 10px;
        }

        .el-input .el-input__inner {
          border-radius: 0 4px 4px 0;
        }

        .el-form-item.is-required .el-form-item__label:before {
          display: none;
        }
        .btn-bottom {
          text-align: center;
        }
        .next {
          width: 100%;
          height: 44px;
          background: #c0ccda;
          border-color: #c0ccda;
          margin-top: 20px;
          margin-bottom: 20px;
          span {
            color: #999;
          }
        }
        .step2-btn {
          width: 40%;
          margin-left: 30px;
        }
        .step1-btn {
          width: 480px;
          margin-left: 0;
        }
        .active-next {
          span {
            color: white;
          }
          border-color: #02adff;
          background-color: #02adff;
        }

        p.tip-warn {
          color: #999;
          width: 630px;
          line-height: 26px;
          margin-bottom: 30px;

          .tishi {
            float: left;
            height: 80px;
          }
        }

        .step-suces {
          text-align: center;
          margin-bottom: 60px;

          span {
            font-size: 16px;
            color: #626262;
            display: inline-block;
            margin-top: 20px;
            margin-bottom: 10px;
          }

          p {
            color: #999999;
            line-height: 26px;
          }
        }

        .gosign {
          width: 240px;
          height: 44px;
          float: left;
          background: #02adff;
          border-color: #02adff;

          span {
            font-size: 16px;
          }
        }

        .back-index {
          width: 240px;
          height: 44px;
          float: right;
          border-color: #99a9bf;

          &:hover {
            background: none;

            span {
              color: #333;
            }
          }

          span {
            font-size: 16px;
          }
        }
      }
    }
  }
}
.auth-confirm {
  .el-message-box__header .el-message-box__title {
    color: #333 !important;
  }
  .el-message-box__content .el-message-box__status {
    height: 48px !important;
  }
  .el-message-box__btns {
    text-align: center;
    .el-button {
      width: 116px;
    }
    button:nth-child(2) {
      margin-left: 20px;
    }
  }
  .el-message-box__content {
    padding: 52px 40px !important;
    .el-message-box__message p {
      line-height: 26px;
    }
  }
}
</style>
