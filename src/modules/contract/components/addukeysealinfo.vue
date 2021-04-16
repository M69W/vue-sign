<template>
  <div class="addukeysealinfo">
    <div class="top-title clearfix">
      <div class="titinfo">申请UKEY印章</div>
      <div class="tit-step fr">
        <img src="/static/image/icon/step1.svg"
             alt="" />
      </div>
    </div>
    <el-form class="clearfix"
             :model="formData"
             label-position="top"
             ref="formTab"
             autocomplete="off">
      <!-- :rules="rules"-->
      <el-row>
        <el-col class="item item-order">
          <!-- <el-form-item label="订单号"> -->
          <div class="item-tit item-order-title"
               style="display: inline-block;">
            订单号
          </div>
          <div style="display: inline-block;"
               class="item-cont">
            {{ orderNo }}
          </div>
          <!-- </el-form-item> -->
        </el-col>
        <el-col class="item item-company">
          <div class="item-tit item-company-title">企业信息</div>
          <div class="item-cont">
            <el-row>
              <el-col :span="9">
                <div class="cont-item">
                  <span class="cont-item-tit">企业名称</span>
                  <span class="cont-item-txt">{{
                                        orderInitData.enterpriseName || "无"
                                    }}</span>
                </div>
              </el-col>
              <el-col :span="9">
                <div class="cont-item">
                  <span class="cont-item-tit"
                        style="width: 120px;">统一社会信用代码</span>
                  <span class="cont-item-txt">{{
                                        orderInitData.creditCode || "无"
                                    }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <div class="cont-item">
                  <span class="cont-item-tit">法人姓名</span>
                  <span class="cont-item-txt">{{
                                        orderInitData.legalMan || "无"
                                    }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="cont-item">
                  <span class="cont-item-tit"
                        style="width: 120px;">证件类型</span>
                  <span class="cont-item-txt">{{
                                        orderInitData.legalCcertificateTypeDesc ||
                                        "无"
                                    }}</span>
                </div>
              </el-col>
              <el-col :span="7"
                      style="text-align: right;">
                <div class="cont-item">
                  <span class="cont-item-tit">证件号码</span>
                  <span class="cont-item-txt">{{
                                        orderInitData.legalCertificateNo || "无"
                                    }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col class="item">
          <div class="cont-tit">
            <span class="item-tit">
              上传证件信息
            </span>
            <span class="item-tips">（仅支持png、jpg,文件5M以内）</span>
          </div>
          <certInfo ref="certInfo"
                    :parentCertList="parentCertList"></certInfo>
        </el-col>
        <!-- <el-col>
          <div class="cont-tit">收件人地址</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="经办人"
                            prop="agentName">
                <el-input type="text"
                          v-model="formData.agentName"
                          placeholder></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经办人电话"
                            prop="agentContactNumber">
                <el-input type="text"
                          v-model="formData.agentContactNumber"
                          placeholder></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="经办人证件类型"
                            prop="agentCertificateType">
                <el-select v-model="formData.agentCertificateType"
                           placeholder="请选择证件类型"
                           style="width:100%">
                  <el-option v-for="item in idType"
                             :label="item.label"
                             :key="item.value"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经办人证件号码"
                            prop="agentCertificateNumber">
                <el-input type="text"
                          v-model="formData.agentCertificateNumber"
                          placeholder></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="省市"
                            prop="proId">
                <el-select v-model="formData.proId"
                           placeholder="请选择省份"
                           style="width:49%">
                  <el-option v-for="item in provinceList"
                             :key="item.proId"
                             :label="item.proName"
                             :value="item.proId"></el-option>
                </el-select>
                <el-select v-model="formData.cityId"
                           placeholder="请选择城市"
                           style="width:49%;float:right;">
                  <el-option v-for="item in cityList"
                             :key="item.cityId"
                             :label="item.cityName"
                             :value="item.cityId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址"
                            prop="detailAddress">
                <el-input type="text"
                          v-model="formData.detailAddress"
                          placeholder></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col> -->
        <!-- 责任书 -->
        <el-col class="item item-read">
          <div>
            <el-checkbox v-model="read">申请电子印章
              <a href="javascript:void(0);"
                 class="item-read-btn"
                 @click="toRead">《用户责任书》</a>
            </el-checkbox>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="footbtn">
      <!--<el-button @click="cancel()">上一步</el-button>
            <el-button @click="submitform('formTab', 'draft')" type="primary" :loading="savebtnLoding">保存草稿</el-button>
            <el-button @click="submitform('formTab', 'submit')" type="primary" :loading="nextbtnLoding">提交</el-button>-->
      <!-- <el-button @click="submitform('formTab', 'prev')">上一步</el-button> -->
      <el-button @click="cancle">取消</el-button>
      <!-- <el-button :loading="nextbtnLoding"
                 @click="submitform('formTab', 'next')"
                 type="primary">{{ edittype == "04" ? "提交" : "下一步" }}</el-button> -->
      <el-button :loading="nextbtnLoding"
                 @click="submitform('formTab', 'next')"
                 type="primary">下一步</el-button>
    </div>
    <user-responsibility v-model="isShowUserRes"
                         @hasRead="hasRead"></user-responsibility>
  </div>
</template>
<script>
import base from "../mixin/base";
import valid from "../mixin/valid";
import certInfo from "../../../components/certInfo";
import userResponsibility from "@/components/userResponsibility";
export default {
  mixins: [base, valid],
  components: { certInfo, userResponsibility },
  data() {
    // var validateCredentials2 = (rule, value, callback) => {
    //     if (
    //         this.formData.agentCertificateType != "01" ||
    //         value.length == 15 ||
    //         value.length == 18
    //     ) {
    //         callback();
    //     } else {
    //         callback(new Error("请输入15位或18位身份证号码"));
    //     }
    // };
    return {
      formData: {
        agentName: "",
        detailAddress: "",
        agentCertificateNumber: "",
        agentCertificateType: "",
        agentContactNumber: "",
        proId: "",
        cityId: "",
        isShowUserRes: true, //是否显示用户责任书
      },
      // rules: {
      //     agentName: [
      //         {
      //             required: true,
      //             message: "请输入经办人姓名",
      //             trigger: "blur"
      //         },
      //         { max: 50, message: "长度在 50 字符以内", trigger: "blur" }
      //     ],
      //     agentCertificateType: [
      //         {
      //             required: true,
      //             message: "请选择经办人证件类型",
      //             trigger: "blur"
      //         }
      //     ],
      //     agentCertificateNumber: [
      //         {
      //             required: true,
      //             message: "请输入经办人证件号码",
      //             trigger: "blur"
      //         },
      //         { validator: validateCredentials2, trigger: "blur" }
      //     ],
      //     agentContactNumber: [
      //         {
      //             required: true,
      //             message: "请输入经办人手机号",
      //             trigger: "blur"
      //         },
      //         { validator: this.checkTel, trigger: "blur" }
      //     ],
      //     proId: [
      //         { required: true, message: "请选择省份", trigger: "change" }
      //     ],
      //     cityId: [
      //         { required: true, message: "请选择城市", trigger: "change" }
      //     ],
      //     detailAddress: [
      //         {
      //             required: true,
      //             message: "请输入详细地址",
      //             trigger: "blur"
      //         },
      //         { max: 50, message: "长度在 50 字符以内", trigger: "blur" }
      //     ]
      // },
      btnLoding: false,
      dialogFormVisible: false,
      parentCertList: [
        {
          certificateId: "0",
          certificatePath: "",
          certificateName: "法人证件正面",
        },
        {
          certificateId: "1",
          certificatePath: "",
          certificateName: "法人证件背面",
        },
        {
          certificateId: "2",
          certificatePath: "",
          certificateName: "营业执照正面",
        },
        {
          certificateId: "3",
          certificatePath: "",
          certificateName: "经办人证件正面",
          certificateTips: "个人信息页",
        },
        {
          certificateId: "4",
          certificatePath: "",
          certificateName: "经办人证件背面",
          certificateTips: "国徽页",
        },
        {
          certificateId: "5",
          certificatePath: "",
          certificateName: "申请书",
        },
      ],
      idType: [
        {
          label: "大陆居民身份证",
          value: "01",
        },
        /*{
    label: "台湾居民来往大陆通行证",
    value: "02"
},
{
    label: "港澳居民来往内地通行证",
    value: "03"
},
{
    label: "护照",
    value: "04"
},
{
    label: "其他",
    value: "05"
}*/
      ],
      nextbtnLoding: false,
      savebtnLoding: false,
      orderNo: "",
      provinceList: [],
      cityList: [],
      cityName: "",
      proName: "",
      detailAddr: "",
      orderInfo: {
        enterpriseInfo: {
          uniformCreditCode: "",
          enterpriseName: "",
          legalPersonCertificateNumber: "",
          legalPersonCertificateType: "",
          legalPersonName: "",
        },
      },
      orderInitData: {}, //企业基本信息
      cList: [],
      edittype: "",
      read: false, //是否阅读责任书
      isShowUserRes: false, //显示阅读弹窗
    };
  },
  // computed: {
  //     province() {
  //         return this.formData.proId;
  //     }
  // },
  // watch: {
  //     province(val, oldVal) {
  //         if (oldVal && val && val != oldVal) {
  //             this.formData.cityId = "";
  //             this.getCities();
  //         } else if (oldVal && !val) {
  //             return;
  //         } else {
  //             this.getCities();
  //         }
  //     }
  // },
  async mounted() {
    this.orderNo = this.$route.query.orderNo;
    this.edittype = this.$route.query.edittype;
    // this.getProvinces();
    // this.getCities();
    if (!this.orderNo) {
      await this.getOrderInitData();
    } else {
    }
    this.getOrderDetail();
    this.getEnterpriseInfo();
  },
  methods: {
    getOrderInitData() {
      return this.orderInit()
        .then((res) => {
          if (this.successCheckCode(res)) {
            this.orderInitData = res.data;
            this.orderNo = res.data.orderNo;
            this.orderId = res.data.orderId;
            console.log("初始化");
            // this.getListData();
          }
        })
        .fail((res) => {
          this.$message.error(res.msg);
        });
    },
    //获取企业相关信息  已取消展示
    getEnterpriseInfo() {
      this.enterpriseInfo()
        .then((res) => {
          if (this.successCheckCode(res)) {
            this.orderInitData = res.data || {};
          }
        })
        .fail((res) => {
          this.$message.error(res.msg);
        });
    },
    getOrderDetail() {
      console.log("zx");
      if (this.orderNo) {
        this.orderDetailEnterprise(this.orderNo)
          .then((res) => {
            if (this.successCheckCode(res)) {
              this.orderInfo = res.data;
              this.formData.agentName = this.orderInfo
                .orderAcceptInfo.agentName
                ? this.orderInfo.orderAcceptInfo.agentName
                : "";
              this.detailAddr = this.orderInfo.orderAcceptInfo
                .deliveryAddress
                ? this.orderInfo.orderAcceptInfo.deliveryAddress
                : "";
              this.formData.agentCertificateNumber = this
                .orderInfo.orderAcceptInfo
                .agentCertificateNumber
                ? this.orderInfo.orderAcceptInfo
                  .agentCertificateNumber
                : "";
              this.formData.agentCertificateType = this.orderInfo
                .orderAcceptInfo.agentCertificateType
                ? this.orderInfo.orderAcceptInfo
                  .agentCertificateType
                : "";
              this.formData.agentContactNumber = this.orderInfo
                .orderAcceptInfo.agentContactNumber
                ? this.orderInfo.orderAcceptInfo
                  .agentContactNumber
                : "";

              this.orderNo = this.orderInfo.orderBasicInfo.orderNo;

              var certificateList = this.orderInfo
                .certificateList;
              if (certificateList.length > 0) {
                for (
                  var i = 0;
                  i < certificateList.length;
                  i++
                ) {
                  if (i <= 5) {
                    this.parentCertList[i].certificatePath =
                      certificateList[i].certificatePath;
                  } else {
                    this.parentCertList.push(
                      certificateList[i]
                    );
                  }
                }
              }
              this.getCertificateData(); // 获取收货地址和实名证件照接口
            }
          })
          .fail((res) => {
            this.$message.error(res.msg);
          });
      }
    },
    getCertificateData() {
      this.getCertificate()
        .then((res) => {
          if (this.successCheckCode(res)) {
            if (!this.parentCertList[0].certificatePath) {
              this.parentCertList[0].certificatePath = //'http://192.168.51.218:6065/group2/M00/0A/12/wKgz5l0kUvSAY6G3AAvea_OGt2M622.jpg'
                res.data.legalPersonIdentityCardFrontPic !== 'publicTransferNoPhoto' ? res.data.legalPersonIdentityCardFrontPic : '';
            }
            if (!this.parentCertList[1].certificatePath) {
              this.parentCertList[1].certificatePath = //'http://192.168.51.218:6065/group2/M00/0A/12/wKgz5l0kUvSAY6G3AAvea_OGt2M622.jpg'
                res.data.legalPersonIdentityCardBackPic !== 'publicTransferNoPhoto' ? res.data.legalPersonIdentityCardBackPic : '';
            }
            if (!this.parentCertList[2].certificatePath) {
              this.parentCertList[2].certificatePath = //'http://192.168.51.218:6065/group2/M00/0A/12/wKgz5l0kUvSAY6G3AAvea_OGt2M622.jpg'
                res.data.businessLicensePic !== 'publicTransferNoPhoto' ? res.data.businessLicensePic : '';
            }

            if (!this.detailAddr && res.data.userAddress) {
              this.formData.proId = res.data.userAddress.proId;
              this.formData.cityId = res.data.userAddress.cityId;
              this.formData.detailAddress =
                res.data.userAddress.detailedAddress;
            }
          }
        })
        .fail((res) => {
          this.$message.error(res.msg);
        });
    },
    //提交能验证
    submitform(ref, bType) {
      if (bType == "prev") {
        if (this.edittype != "04") {
          //edittype 04编辑
          this.saveForm(bType);
        } else {
          this.$router.go(-1);
        }
      } else {
        //下一步
        console.log(this.parentCertList);
        for (var j = 0; j < this.parentCertList.length; j++) {
          if (!this.parentCertList[j].certificatePath) {
            this.$message.error("请上传证件图片");
            return false;
          }
          if (!this.parentCertList[j].certificateName) {
            this.$message.error("附件名称不能为空！");
            return false;
          }
        }
        if (!this.read) {
          this.$message.error("请确认阅读用户责任书！");
          return false;
        }
        this.$refs[ref].validate((valid) => {
          if (valid) {
            this.saveForm(bType);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    //保存草稿
    saveForm(val) {
      let cityName, proName;
      this.provinceList.map((ele) => {
        if (ele.proId == this.formData.proId) {
          proName = ele.proName;
        }
      });
      this.cityList.map((ele) => {
        if (ele.cityId == this.formData.cityId) {
          cityName = ele.cityName;
        }
      });

      var clistItem = {
        certificateId: "",
        certificateName: "",
        certificatePath: "",
      };
      this.cList = [];
      for (var i = 0; i < this.parentCertList.length; i++) {
        clistItem = {
          certificateId: this.parentCertList[i].certificateId,
          certificateName: this.parentCertList[i].certificateName,
          certificatePath: this.parentCertList[i].certificatePath
            ? this.parentCertList[i].certificatePath
            : "",
        };
        this.cList.push(clistItem);
      }

      let data = {
        certificateList: this.cList,
        city: cityName,
        detailAddress: this.formData.detailAddress,
        orderNo: this.orderNo,
        province: proName,
        recipient: this.formData.agentName,
        recipientCertificateNumber: this.formData
          .agentCertificateNumber,
        recipientCertificateType: this.formData.agentCertificateType,
        recipientPhone: this.formData.agentContactNumber,
        uniformCreditCode: this.orderInfo.enterpriseInfo
          .uniformCreditCode,
        enterpriseName: this.orderInfo.enterpriseInfo.enterpriseName,
        legalPersonCertificateNumber: this.orderInfo.enterpriseInfo
          .legalPersonCertificateNumber,
        legalPersonCertificateType: this.orderInfo.enterpriseInfo
          .legalPersonCertificateType,
        legalPersonName: this.orderInfo.enterpriseInfo.legalPersonName,
      };
      if (val == "next") {
        this.nextbtnLoding = true;
      }
      if (val === 'next' && this.edittype === '04') { //编辑
        //编辑
        let datas = {
          detailAddress: this.formData.detailAddress,
          orderNo: this.orderNo,
          recipient: this.formData.agentName,
          recipientCertificateNumber: this.formData
            .agentCertificateNumber,
          recipientCertificateType: this.formData
            .agentCertificateType,
          recipientPhone: this.formData
            .agentContactNumber,
          province: proName,
          city: cityName,
          certificateList: this.cList,
          enterpriseName: this.orderInfo.enterpriseInfo
            .enterpriseName,
          uniformCreditCode: this.orderInfo.enterpriseInfo
            .uniformCreditCode,
          clientType: "01", // 终端类型：01.web端 02.微信小程序
          dutyParagraph: "", // 税号
          invoiceEnterpriseName: "",
          invoiceType: "",
          invoicesRaised: "",
          esealYear: this.orderInfo.esealList[0].esealYear,
          addressFlag: 0,//是否需要地址标识(0:不需要;1:需要)用于地址检测
          step: '1',//当前所在步骤1
        };
        this.submitOrder(datas).then((res) => {
          if (this.successCheckCode(res)) {
            this.$router.push({
              path: "/addukeylist",
              query: {
                orderNo: this.orderInfo.orderBasicInfo
                  .orderNo,
                edittype: this.edittype,
                esealYear: this.orderInfo.esealList[0].esealYear
              },
            });
            // this.setOrderStatus('02', '04').then(res => {
            // });
          }
        });
      } else {
        this.saveDraftOrder(data).then((res) => {
          if (this.successCheckCode(res)) {
            if (val == "prev") {
              //v4.2已调整步骤 此选项已不存在--
              this.$router.push({
                path: "/addukeyseal",
                query: {
                  orderNo: this.orderInfo.orderBasicInfo.orderNo,
                  edittype: this.edittype,
                },
              });
            } else if (val == "next") {
              if (this.edittype != "04") {
                //新增
                this.$router.push({
                  path: "/addukeylist",
                  query: {
                    orderNo: this.orderInfo.orderBasicInfo
                      .orderNo,
                    edittype: this.edittype,
                  },
                });
              }
              // else {
              //编辑
              // let datas = {
              //   detailAddress: this.formData.detailAddress,
              //   orderNo: this.orderNo,
              //   recipient: this.formData.agentName,
              //   recipientCertificateNumber: this.formData
              //     .agentCertificateNumber,
              //   recipientCertificateType: this.formData
              //     .agentCertificateType,
              //   recipientPhone: this.formData
              //     .agentContactNumber,
              //   province: proName,
              //   city: cityName,
              //   certificateList: this.cList,
              //   enterpriseName: this.orderInfo.enterpriseInfo
              //     .enterpriseName,
              //   uniformCreditCode: this.orderInfo.enterpriseInfo
              //     .uniformCreditCode,
              //   clientType: "01", // 终端类型：01.web端 02.微信小程序
              //   dutyParagraph: "", // 税号
              //   invoiceEnterpriseName: "",
              //   invoiceType: "",
              //   invoicesRaised: "",
              //   esealYear: this.$route.query.esealYear,
              // };
              // this.submitOrder(datas).then((res) => {
              //   if (this.successCheckCode(res)) {
              //     // this.setOrderStatus();
              //   }
              // });
              // }
            }
          } else {
            this.nextbtnLoding = false;
          }
        });
      }

    },
    //操作类型（99提交订单，00修改订单，01提交订单，02付款完成，03审核不通过，04审核通过，05订单取消，06生产完毕，07物流发货，08订单完成，09撤销订单） ,
    //订单状态（01:草稿， 02:待支付， 03:待审核， 04:审核不通过， 05:订单取消， 06:生产中， 07:物流中 ， 08:订单完成 ）
    setOrderStatus(operatorType, orderStatus) {
      var self = this;
      var data = {
        operatorType: operatorType,
        orderNo: this.orderNo,
        orderStatus: orderStatus,
        remark: "支付服务通知支付结果",
      };
      return this.uptOrderStatus(data).then((res) => {
        if (this.successCheckCode(res)) {
          return res.data;
          // self.$message.success("提交成功！");
          // setTimeout(function () {
          //   self.$router.push({ path: "/ukeyorder" });
          // }, 1000);
        }
      });
    },
    //用户责任书
    toRead(val) {
      this.isShowUserRes = true;
    },
    hasRead(val) {
      this.read = val;
    },
    cancle(val) {
      if (this.edittype == "04") {
        this.$router.push({ path: "/ukeyorder" });
        return;
      }
      let data = {
        certificateList: this.parentCertList,
        city: "",
        detailAddress: "",
        orderNo: this.orderNo,
        postcode: "",
        province: "",
        recipient: "",
        recipientPhone: "",
        uniformCreditCode: "",
        enterpriseName: "",
        legalPersonCertificateNumber: "",
        legalPersonCertificateType: "",
        legalPersonName: "",
      };
      this.$confirm(
        "本次UKey印章申请，确定要保存至草稿箱吗？",
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false,
          distinguishCancelAndClose: true,
          customClass: "self-icon icon-draft",
        }
      )
        .then(() => {
          this.saveDraftOrder(data).then((res) => {
            if (this.successCheckCode(res)) {
              this.$router.push("/myseal");
            }
          });
        })
        .catch(() => {
          this.$router.push("/myseal");
        });
      // } else {
      //     this.$router.push("/myseal");
      // }
      // this.$router.go(-1);
    },
  },
};
</script>
<style>
/* .addukeysealinfo .el-form-item__content {
    width: 354px;
    display: inline-block;
}
.addukeysealinfo .el-form-item__label {
    width: 104px;
    margin-right: 10px;
    color: #626262;
    vertical-align: top;
    height: 36px;
    line-height: 36px;
    padding: 0;
}
.addukeysealinfo input.el-input__inner {
    background: #fff;
} */
</style>
<style lang="scss">
.addukeysealinfo {
  .top-title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    margin-bottom: 25px;
    .titinfo {
      float: left;
      font-size: 18px;
      color: #333333;
    }
  }
  .footbtn {
    text-align: right;
    .el-button {
      width: 100px;
    }
  }
  .cont-tit {
    font-size: 16px;
    color: #333333;
    padding: 40px 0 20px;
    span {
      font-size: 14px;
      //   color: #999999;
      //   margin-left: 20px;
      a {
        color: #06aeff;
        text-decoration: underline;
      }
    }
  }
  .item {
    .item-tit {
      font-size: 16px;
      font-weight: 700;
    }
    .item-tips {
      margin-left: 10px;
      font-size: 14px;
      color: #999;
    }
  }
  .item-order {
    .item-tit {
      margin-right: 28px;
    }
    .item-cont {
      font-size: 14px;
    }
  }
  .item-company {
    .item-tit {
      margin: 30px 0 20px 0;
    }
    .item-cont {
      background-color: #f4f6f8;
      padding: 0 10px;
      .cont-item {
        line-height: 34px;
        height: 34px;
        &-tit {
          width: 112px;
          margin-right: 20px;
          font-size: 14px;
        }
        &-txt {
        }
      }
    }
  }
  .item-read {
    text-align: center;
    font-size: 14px;
    margin: 30px 0 20px;
    &-btn {
      color: #06aeff;
    }
  }
}
</style>
