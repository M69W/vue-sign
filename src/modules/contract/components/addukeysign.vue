<template>
  <div class="addukeysign">
    <div class="top-title clearfix">
      <div class="titinfo">添加Ukey签名</div>
      <div class="titremark">
        备注：<span>UKEY设备需要付费480元/2年，提供更高级别的安全证书服务。</span>
      </div>
    </div>
    <el-form class="clearfix"
             :model="formData"
             :rules="rules"
             label-position="top"
             ref="formTab"
             autocomplete="off">
      <!-- :rules="rules"-->
      <el-row>
        <el-col>
          <el-form-item label="订单号">
            <span>{{ orderNo }}</span>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="签名名称">
            <input type="text"
                   class="el-input__inner"
                   @blur="showSignatureName"
                   v-model="formData.signatureName"
                   placeholder="请输入签名名称" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="创建方式">
            <el-radio-group v-model="formData.createMode"
                            @change="signChange">
              <el-radio :label="1">手绘签名</el-radio>
              <el-radio :label="2">本地上传
                <span style="font-size: 12px; color: #999;">(需审核)</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="上传签名"
                        v-if="formData.createMode == 1">
            <div class="code-uploader">
              <img class="code-uploader-img"
                   v-if="
                                    codeUploaderImg && formData.createMode == 1
                                "
                   :src="compToken(codeUploaderImg)" />
              <div id="qrcode"
                   style="
                                    width: 140px;
                                    height: 140px;
                                    margin: 0 auto;
                                "
                   v-if="formData.createMode == 1"></div>
            </div>
            <div class="uploader-tips">
              请打开手机扫一扫二维码，绘制印章5分钟内有效。
            </div>
          </el-form-item>
          <el-form-item class="sign-uploader"
                        label="上传签名"
                        v-else>
            <div class="avatar-uploader">
              <div class="el-upload el-upload--text"
                   v-loading="loading"
                   element-loading-text="正在上传...">
                <img v-if="formData.signatureFilePath"
                     :src="compToken(formData.signatureFilePath)"
                     :style="{
                                        width: previewImgW,
                                        height: previewImgH,
                                    }"
                     class="previewImg" />
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
                <input type="file"
                       id="fileipt1"
                       name="file"
                       class="el-upload__input"
                       @change="handleChange($event)" />
              </div>
            </div>
            <div class="uploader-tips">
              仅支持png、jpg、bmp，文件≤2M以内
            </div>
          </el-form-item>
        </el-col>
        <el-col>
          <div class="cont-tit">
            上传证件信息<span style="
                                color: #999;
                                font-size: 14px;
                                margin-left: 10px;
                            ">（仅支持png、jpg,文件5M以内）</span>
          </div>
          <!--<div class="cont-tit">上传证件信息<span>上传数字证书申请书时，请先下载<a href="javascript:;">申请书模版</a></span></div>-->
          <certInfoPersonal ref="certInfo"
                            :parentCertList="parentCertList"></certInfoPersonal>
        </el-col>
        <el-col>
          <div class="cont-tit">收件地址</div>
          <!--<el-row>
                        <el-col :span="12">
                            <el-form-item label="经办人" prop="agentName">
                                <el-input type="text" v-model="formData.agentName" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="经办人电话" prop="agentContactNumber">
                                <el-input type="text" v-model="formData.agentContactNumber" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
          <el-row>
            <el-col :span="12">
              <el-form-item label="省市"
                            prop="proId">
                <select-address v-model="formData"
                                @getCityList="getCityList"
                                @getProvinceList="getProvinceList"></select-address>
                <!-- <el-select v-model="formData.proId"
                           placeholder="请选择省份"
                           style="width: 49%;">
                  <el-option v-for="item in provinceList"
                             :key="item.proId"
                             :label="item.proName"
                             :value="item.proId">
                  </el-option>
                </el-select>
                <el-select v-model="formData.cityId"
                           placeholder="请选择城市"
                           style="width: 49%; float: right;">
                  <el-option v-for="item in cityList"
                             :key="item.cityId"
                             :label="item.cityName"
                             :value="item.cityId">
                  </el-option>
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址"
                            prop="detailAddress">
                <el-input type="text"
                          v-model="formData.detailAddress"
                          placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <div class="footbtn">
      <el-button @click="cancel()">取消</el-button>
      <el-button @click="submitform('formTab')"
                 :loading="btnLoding"
                 type="primary">{{ edittype == "04" ? "提交" : "下一步" }}</el-button>
    </div>

    <el-dialog title="上传云签名"
               class="cropper-dialog"
               :visible.sync="dialogFormVisible">
      <div class="cropper-dialog-body">
        <div class="cropper-content clearfix">
          <div class="cropper">
            <div style="margin-bottom: 8px;">签名图片</div>
            <vueCropper ref="cropper"
                        :img="option.img"
                        :outputSize="option.size"
                        :outputType="option.outputType"
                        :info="true"
                        :full="option.full"
                        :canMove="option.canMove"
                        :canMoveBox="option.canMoveBox"
                        :original="option.original"
                        :autoCrop="option.autoCrop"
                        :autoCropWidth="option.autoCropWidth"
                        :autoCropHeight="option.autoCropHeight"
                        :fixedBox="option.fixedBox"
                        @realTime="realTime"
                        @imgLoad="imgLoad"></vueCropper>
          </div>
          <div class="show-preview">
            <div style="margin-bottom: 8px;">章模预览</div>
            <div :style="previews.div"
                 class="preview">
              <img :src="previews.url"
                   :style="previews.img" />
            </div>
            <div class="imgInfo">
              <div class="seal-size-tips">
                印章长宽：<span>大小不超过100x100mm</span>
              </div>
              <div class="seal-size-ipt">
                <span>宽<el-input v-model="imgInfoW"
                            size="small"
                            @blur="changeVal"></el-input></span>
                <span>高<el-input v-model="imgInfoH"
                            size="small"
                            @blur="changeVal"></el-input></span>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-btn">
          <div class="scope-btn">
            <label class="btn"
                   for="fileipt2">更换图片</label>
            <input type="file"
                   id="fileipt2"
                   name="file"
                   style="position: absolute; clip: rect(0 0 0 0);"
                   accept="image/png, image/bmp, image/jpg"
                   @change="handleChange2($event)" />
            <button @click="changeScale(1)">+</button>
            <button @click="changeScale(-1)">-</button>
            <button @click="rotateLeft">↺</button>
            <button @click="rotateRight">↻</button>
          </div>
          <div class="uploader-tips">说明：只支持png、jpg、bmp；</div>
        </div>
        <div class="upload-btn">
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary"
                     @click="finish">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import base from "../mixin/base";
import valid from "../mixin/valid";
import VueCropper from "../../../components/vue-cropper";
import certInfoPersonal from "../../../components/certInfoPersonal";
import selectAddress from "@/components/selectAddress"
export default {
  mixins: [base, valid],
  components: { VueCropper, certInfoPersonal, selectAddress },
  data() {
    var validateProCity = (rule, value, callback) => {
      if (
        this.formData.proId && this.formData.cityId
      ) {
        callback();
      } else {
        callback(new Error("请选择省市"));
      }
    };
    return {
      formData: {
        address: "",
        agentName: "",
        agentContactNumber: "",
        detailAddress: "",
        proId: null,
        cityId: null,
        postalCode: "",
        createMode: 2,
        signatureName: "",
        signatureFilePath: "",
        signatureType: "04",
      },
      provinceList: [],
      cityList: [],
      rules: {
        /* agentName: [
                 {required: true, message: '请输入经办人姓名', trigger: 'blur'},
                 {max: 50, message: '长度在 50 字符以内', trigger: 'blur'},
             ],
             agentContactNumber: [
                 {required: true, message: '请输入经办人手机号', trigger: 'blur'},
                 {validator: this.checkTel, trigger: 'blur'},
             ],*/
        proId: [
          {
            required: true,
            message: "请选择省份",
            trigger: "change",
          },
          { validator: validateProCity, trigger: "change" }
        ],
        cityId: [
          {
            required: true,
            message: "请选择城市",
            trigger: "change",
          },
        ],
        detailAddress: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur",
          },
          { max: 50, message: "长度在 50 字符以内", trigger: "blur" },
        ],
      },
      codeUploaderImg: "",
      loading: false,
      previewImgW: "auto",
      previewImgH: "180px",
      imgInfoW: 100,
      imgInfoH: 100,
      btnLoding: false,
      crap: false,
      previews: {},
      option: {
        img: "",
        size: 1,
        full: false, //输出原图比例截图 props名full
        outputType: "png",
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 28.3 * 10,
        autoCropHeight: 28.3 * 10,
        fixedBox: false,
      },
      dialogFormVisible: false,
      orderNo: "",
      orderId: "",
      orderInitData: [],
      pictureDataTmpId: "",
      esealId: "",
      pictureWidth: "",
      pictureHeight: "",
      isCreatPaintCode: false,
      parentCertList: [
        {
          certificateId: "0",
          certificatePath: "",
          certificateName: "个人证件正面",
        },
        {
          certificateId: "1",
          certificatePath: "",
          certificateName: "个人证件反面",
        },
        {
          certificateId: "2",
          certificatePath: "",
          certificateName: "申请书",
        },
      ],
      areaCode: "",
      certificateNo: "",
      certificateType: "",
      ukeySignInfo: {},
      edittype: "",
    };
  },
  // computed: {
  //   province() {
  //     return this.formData.proId;
  //   },
  // },
  // watch: {
  //   province(val, oldVal) {
  //     if (oldVal && val && val != oldVal) {
  //       this.formData.cityId = "";
  //       this.getCities();
  //     } else if (oldVal && !val) {
  //       return;
  //     } else {
  //       this.getCities();
  //     }
  //   },
  // },
  mounted() {
    this.orderNo = this.$route.query.orderNo;
    this.edittype = this.$route.query.edittype;
    // this.getProvinces();
    // this.getCities();

    if (this.orderNo) {
      //如果参数有传订单号，通过订单号查询详情
      this.getOrderDetailPersonal();
    } else {
      //如果没有订单号，初始化订单
      this.getOrderInitData();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    next();
  },
  methods: {
    showSignatureName(val) {
      console.log(val.target.value);
    },
    getOrderInitData() {
      this.signOrderInit()
        .then((res) => {
          if (this.successCheckCode(res)) {
            this.orderInitData = res.data;

            this.certificateNo = this.orderInitData.personalCertificateNo;
            this.certificateType = this.orderInitData.personalCertificateType;
            this.orderNo = res.data.orderNo;
            this.orderId = res.data.orderId;
            this.formData.agentName = this.orderInitData.recipient;
            this.formData.agentContactNumber = this.orderInitData.recipientPhone;
            if (this.orderInitData.userAddress) {
              this.formData.proId = this.orderInitData.userAddress.proId;
              this.formData.cityId = this.orderInitData.userAddress.cityId;
              this.formData.detailAddress = this.orderInitData.userAddress.detailedAddress;
            }

            this.parentCertList[0].certificatePath = this.orderInitData.identityCardFrontPic !== 'publicTransferNoPhoto' ? this.orderInitData.identityCardFrontPic : '';
            this.parentCertList[1].certificatePath = this.orderInitData.identityCardBackPic !== 'publicTransferNoPhoto' ? this.orderInitData.identityCardBackPic : '';
          }
        })
        .fail((res) => {
          this.$message.error(res.msg);
        });
    },
    //个人ukey签名订单详情查询
    getOrderDetailPersonal() {
      this.orderDetailPersonal(this.orderNo)
        .then((res) => {
          if (this.successCheckCode(res)) {
            this.orderInfo = res.data;
            this.formData.agentName = this.orderInfo.orderAcceptInfo.agentName;
            this.areaCode = this.orderInfo.orderAcceptInfo.agentContactNumber.substring(
              0,
              6
            );
            this.certificateNo = this.orderInfo.orderAcceptInfo.agentCertificateNumber;
            this.certificateType = this.orderInfo.orderAcceptInfo.agentCertificateType;
            this.formData.agentContactNumber = this.orderInfo.orderAcceptInfo.agentContactNumber;
            this.orderId = this.orderInfo.orderBasicInfo.orderId;
            this.orderNo = this.orderInfo.orderBasicInfo.orderNo;
            this.ukeySignInfo = this.orderInfo.ukeySignList[0];
            // this.formData.detailAddress = this.orderInfo.orderAcceptInfo.deliveryAddress ;
            if (
              this.orderInfo.ukeySignList &&
              this.orderInfo.ukeySignList.length > 0
            ) {
              this.pictureWidth = this.orderInfo.ukeySignList[0].pictureWidth;
              this.pictureHeight = this.orderInfo.ukeySignList[0].pictureHeight;
              // this.pictureDataTmpId = this.orderInfo.ukeySignList[0].pictureCode;
              this.formData.signatureName = this.orderInfo.ukeySignList[0].pictureName;
              this.formData.signatureFilePath = this.orderInfo.ukeySignList[0].picturePath;
              //删除章模
              // this.deletePicture();
            }
            /*this.getBase64(this.orderInfo.ukeySignList[0].picturePath).then(res=>{
                console.log(res);
            },function (err) {
                console.log(err);
            })*/

            var info = {
              certificateId: "",
              certificatePath: "",
              certificateName: "",
            };
            this.parentCertList[0].certificatePath = this.orderInfo.certificateList[0].certificatePath;
            this.parentCertList[1].certificatePath = this.orderInfo.certificateList[1].certificatePath;
            this.parentCertList[2].certificatePath = this.orderInfo.certificateList[2].certificatePath;
            for (
              var i = 3;
              i < this.orderInfo.certificateList.length;
              i++
            ) {
              info.certificateId = String(i + 100);
              info.certificatePath = this.orderInfo.certificateList[
                i
              ].certificatePath;
              info.certificateName = this.orderInfo.certificateList[
                i
              ].certificateName;
              this.parentCertList.push(info);
            }
          }
        })
        .fail((res) => {
          this.$message.error(res.msg);
        });
    },
    //提交能验证
    submitform(ref) {
      //this.$router.push("/orderconfirm")
      this.$refs[ref].validate((valid) => {
        if (valid) {
          this.savePicture();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //保存草稿数据
    saveForm() {
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

      let data = {
        certificateList: this.$refs.certInfo.certInfoList,
        agentName: this.formData.agentName,
        agentCertificateNumber: this.certificateNo,
        agentCertificateType: this.certificateType,
        agentContactNumber: this.formData.agentContactNumber,
        deliveryWay: "02",
        detailAddress: this.formData.detailAddress,
        orderNo: this.orderNo,
        orderType: "01",
        personCertificateNumber: this.certificateNo,
        personCertificateType: this.certificateType,
        personName: this.formData.agentName,
        province: proName,
        city: cityName,
      };
      // 非驳回订单
      if (this.edittype != "04") {
        this.savePersonDraftOrder(data).then((res) => {
          if (this.successCheckCode(res)) {
            this.$router.push({
              path: "/orderconfirm",
              query: {
                orderNo: this.orderNo,
                edittype: this.edittype,
              },
            });
          }
        });
      } else {
        // 驳回订单 直接走提交 刷新订单步骤
        let self = this;
        let datas = {
          certificateList: this.$refs.certInfo.certInfoList,
          agentName: this.formData.agentName,
          agentCertificateNumber: this.certificateNo,
          agentCertificateType: this.certificateType,
          agentContactNumber: this.formData
            .agentContactNumber,
          deliveryWay: "02",
          detailAddress: this.formData.detailAddress,
          orderNo: this.orderNo,
          orderType: "01",
          personCertificateNumber: this.certificateNo,
          personCertificateType: this.certificateType,
          personName: this.formData.agentName,
          province: proName,
          city: cityName,
          step: '2'//第二步后台更新状态为待审核
        };
        this.submitPersonOrder(datas).then((res) => {
          if (this.successCheckCode(res)) {
            self.$message.success("提交成功！");
            setTimeout(function () {
              self.$router.push({ path: "/ukeyorder" });
            }, 500);
            // self.setOrderStatus();
            /* if(self.edittype && self.edittype == '04'){
                    self.setOrderStatus();
                }else{
                    setTimeout(function(){
                        this.$router.push({
                            path: '/orderconfirm',
                            query: {orderNo: this.orderNo, edittype: this.edittype}
                        });
                        // self.$router.push({path:'/orderpay', query:{orderNo: self.orderNo}});
                        // self.nextbtnLoding = false;
                    }, 1000)
                }*/
          } else {
            this.$message.error(res.msg);
            setTimeout(function () {
              self.nextbtnLoding = false;
            }, 1000);
          }
        });
      }
    },
    savePicture() {
      if (this.formData.signatureName.length == 0) {
        this.$message.error("请您录入签名名称");
        return false;
      } else if (
        this.formData.signatureFilePath.length == 0 &&
        !this.codeUploaderImg
      ) {
        this.$message.error("请您扫码手绘签名或上传自定义签名图片");
        return false;
      }

      var cList = this.$refs.certInfo.certInfoList;
      for (var i = 0; i < cList.length; i++) {
        if (
          cList[i].certificatePath == "" ||
          cList[i].certificateName == ""
        ) {
          this.$message.error("请您完善证件信息");
          return false;
        }
      }

      if (this.formData.createMode == 1) {
        this.formData.signatureFilePath = this.codeUploaderImg;
      }

      let data = {
        areaCode: this.areaCode,
        personalCertificateNo: this.certificateNo,
        personalCertificateType: this.certificateType,
        orderId: this.orderId,
        orderNo: this.orderNo,
        // pictureDataTmpId: this.pictureDataTmpId,
        picturePath: this.formData.signatureFilePath,
        sealName: this.formData.signatureName,
        pictureWidth: this.pictureWidth,
        pictureHeight: this.pictureHeight,
        sealType: "90", //电子私章
      };

      if (!!this.pictureDataTmpId) {
        data.pictureDataTmpId = this.pictureDataTmpId;
      }

      this.addPersonalUkeySign(data).then((res) => {
        if (this.successCheckCode(res)) {
          //保存草稿
          this.saveForm();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    setOrderStatus() {
      var self = this;
      var data = {
        operatorType: "02",
        orderNo: this.orderNo,
        orderStatus: "03",
        remark: "支付服务通知支付结果",
      };
      this.uptOrderStatus(data).then((res) => {
        if (this.successCheckCode(res)) {
          /*  this.$router.push({
                  path: '/ukeyorder',
                  query: {orderNo: this.orderNo, edittype: this.edittype}
              });*/
          self.$message.success("提交成功！");
          setTimeout(function () {
            self.$router.push({ path: "/ukeyorder" });
          }, 500);
        }
      });
    },
    deletePicture() {
      this.deleteOrderSeal(this.esealId).then((res) => {
        if (this.successCheckCode(res)) {
          this.getOrderDetailPersonal();
        }
      });
    },
    cancel() {
      if (this.edittype == "04") {
        this.$router.push({ path: "/ukeyorder" });
        return;
      }
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

      let data = {
        certificateList: this.$refs.certInfo.certInfoList,
        agentName: this.formData.agentName,
        agentCertificateNumber: this.certificateNo,
        agentCertificateType: this.certificateType,
        agentContactNumber: this.formData.agentContactNumber,
        deliveryWay: "02",
        detailAddress: this.formData.detailAddress,
        orderNo: this.orderNo,
        orderType: "01",
        personCertificateNumber: this.certificateNo,
        personCertificateType: this.certificateType,
        personName: this.formData.agentName,
        province: proName ? proName : "",
        city: cityName ? cityName : "",
      };
      this.$confirm(
        "本次UKey签名申请，确定要保存至草稿箱吗？",
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
          if (this.formData.createMode == 1) {
            this.formData.signatureFilePath = this.codeUploaderImg;
          }
          if (
            !!this.formData.signatureFilePath &&
            !!this.formData.signatureName
          ) {
            let datas = {
              areaCode: this.areaCode,
              personalCertificateNo: this.certificateNo,
              personalCertificateType: this.certificateType,
              orderId: this.orderId,
              orderNo: this.orderNo,
              // pictureDataTmpId: this.pictureDataTmpId,
              picturePath: this.formData.signatureFilePath,
              sealName: this.formData.signatureName,
              pictureWidth: this.pictureWidth,
              pictureHeight: this.pictureHeight,
              sealType: "90", //电子私章
            };
            if (!!this.pictureDataTmpId) {
              datas.pictureDataTmpId = this.pictureDataTmpId;
            }
            this.addPersonalUkeySign(datas).then((res) => {
              if (this.successCheckCode(res)) {
                this.savePersonDraftOrder(data).then((res) => {
                  if (this.successCheckCode(res)) {
                    this.$router.push("/mysign");
                  }
                });
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            this.savePersonDraftOrder(data).then((res) => {
              if (this.successCheckCode(res)) {
                this.$router.push("/mysign");
              }
            });
          }
        })
        .catch(() => {
          this.$router.push("/mysign");
        });
    },
    cancelDialog() {
      this.dialogFormVisible = false;
    },
    // vue-cropper裁图
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    //通过输入框参数设置裁图框大小
    changeVal() {
      if (this.imgInfoW > 100) {
        this.imgInfoW = 100;
      }
      if (this.imgInfoH > 100) {
        this.imgInfoH = 100;
      }
      this.previews.w = (this.imgInfoW * 28.3) / 10;
      this.previews.h = (this.imgInfoH * 28.3) / 10;
      this.$refs.cropper.changeCrop(this.previews.w, this.previews.h);
    },
    handleChange(event) {
      var that = this;
      var file = event.target.files[0];
      if (file) {
        //this.option.outputType = file.type.substring(6);
        if (!/\.(jpg|png|bmp|JPG|PNG)$/.test(event.target.value)) {
          this.$message.error("请上传jpg、png、bmp格式的图片！");
          return false;
        }
        if (file.size > 2 * 1024 * 1024) {
          this.$message.error("请上传2M以内的文件！");
          return false;
        }
        if (window.FileReader) {
          var reader = new FileReader();
          reader.onload = function (e) {
            that.dialogFormVisible = true;
            that.imgInfoW = 100;
            that.imgInfoH = 100;
            that.option.img = e.target.result;
            var filetarget = document.getElementById("fileipt1");
            $(filetarget).val("");
          };
          // 转化为base64
          reader.readAsDataURL(file);
        }
      }
    },
    handleChange2(event) {
      // 上传图片
      var that = this;
      var file = event.target.files[0];
      if (!/\.(jpg|png|bmp|JPG|PNG)$/.test(event.target.value)) {
        this.$message.error("请上传jpg、png、bmp格式的图片！");
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error("请上传2M以内的文件！");
        return false;
      }
      if (window.FileReader) {
        var reader = new FileReader();
        reader.onload = function (e) {
          that.imgInfoW = 100;
          that.imgInfoH = 100;
          that.option.img = e.target.result;
        };
        // 转化为base64
        reader.readAsDataURL(file);
      }
    },
    finish() {
      // 输出裁剪后的图片
      var self = this;
      this.$refs.cropper.getCropData((data) => {
        self.dialogFormVisible = false;
        self.option.img = data == "data:," ? self.previews.url : data;
        // console.log(data)
        this.uploadImgBase64();
      });
      this.formData.pictureWidth = 200;
      this.formData.pictureHeight = 200;
      var WHrate =
        this.formData.pictureWidth / this.formData.pictureHeight;
      if (WHrate > 1.5) {
        this.previewImgW = "268px";
        this.previewImgH = "auto";
      } else {
        this.previewImgW = "auto";
        this.previewImgH = "178px";
      }

      var filetarget = document.getElementById("fileipt2");
      $(filetarget).val("");
    },
    uploadImgBase64() {
      // 上传图片接口
      let data2 = {
        base64: this.option.img,
        pictureType: "01", //01,签名；02,印章
      };
      this.signupload(data2)
        .then((res) => {
          if (this.successCheckCode(res)) {
            console.log(res);
            this.pictureDataTmpId = res.data.pictureDataTmpId;
            this.formData.signatureFilePath = res.data.picturePath;
            this.pictureWidth = res.data.pictureWidth;
            this.pictureHeight = res.data.pictureHeight;
          } else {
            this.$message.error(res.msg);
          }
        })
        .fail(() => { });
    },
    // 实时预览裁剪区域
    realTime(data) {
      this.previews = data;
      this.imgInfoW = Math.round((this.previews.w / 28.3) * 10);
      this.imgInfoH = Math.round((this.previews.h / 28.3) * 10);
    },
    imgLoad(msg) {
      //console.log(msg);
    },
    // 读取文件
    parse: function () {
      let fr = new FileReader();
      fr.onloadend = () => {
        if (this.file.size > this.maxSize) {
          console.log("compress");
          this.compress(fr.result);
        } else {
          this.upload(this.file);
        }
      };
      fr.readAsDataURL(this.file);
    },
    // 压缩图片
    compress: function (dataURI) {
      let img = new Image();
      img.onload = () => {
        const w = Math.min(img.height, img.width);
        const h = img.height * (w / img.width);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        // 取出 base64 格式数据并上传
        // this.upload(canvas.toDataURL(this.type));
        let files = canvas.toDataURL("image/jpeg");
        // let files = new window.File([blob], this.file.name, {type: this.fileType})
        console.log(files);
        // this.upload(files);
      };
      img.src = dataURI;
    },
    // getProvinces() {
    //   this.getProvince({
    //     currPage: 1,
    //     pageSize: 100,
    //   }).then((res) => {
    //     if (this.successCheckCode(res)) {
    //       this.provinceList = res.data.records;
    //     }
    //   });
    // },
    // getCities() {
    //   this.getCity({
    //     upOneLevelId: this.formData.proId,
    //     currPage: 1,
    //     pageSize: 100,
    //   }).then((res) => {
    //     if (this.successCheckCode(res)) {
    //       this.cityList = res.data.records;
    //     }
    //   });
    // },
    getProvinceList(val) {
      this.provinceList = val;
    },
    getCityList(val) {
      this.cityList = val;
    },
    signChange(val) {
      // $('#qrcode').empty()
      // clearInterval(this.timer)
      if (val == 1 && !this.isCreatPaintCode) {
        this.CreatPaintCode();
      } else if (val == 1 && this.isCreatPaintCode) {
        setTimeout(() => {
          $("#qrcode").find("img").show();
        }, 10);
      } else if (val == 2 && !this.codeUploaderImg) {
        $(".code-uploader").find("img").hide();
      }
    },
    qrCode(data) {
      var qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 140,
        height: 140,
      });
      qrcode.makeCode(data);
      $("#qrcode").attr("title", "");
    },
    getPaintSignResult(data) {
      this.getPaintSign(data)
        .then((res) => {
          if (this.successCheckCode(res)) {
            if (res.code == 0) {
              clearInterval(this.timer);
              $("#qrcode").empty();
              this.pictureDataTmpId =
                res.data.fileUploadRespDTO.pictureDataTmpId;
              this.pictureWidth =
                res.data.fileUploadRespDTO.pictureWidth;
              this.pictureHeight =
                res.data.fileUploadRespDTO.pictureHeight;
              this.codeUploaderImg =
                res.data.fileUploadRespDTO.picturePath;
            } else if (
              res.code == 2053 ||
              res.code == 2050 ||
              res.code == 2051
            ) {
              clearInterval(this.timer);
              $("#qrcode").empty();
              this.$message.error(
                "手写绘图失败,请重新扫一扫二维码"
              );
              this.CreatPaintCode();
            }
          } else {
            clearInterval(this.timer);
            $("#qrcode").empty();
            this.$message.error("手写绘图失败,请重新扫一扫二维码");
            this.CreatPaintCode();
          }
        })
        .fail((res) => {
          clearInterval(this.timer);
          $("#qrcode").empty();
          this.$message.error("手写绘图失败,请重新扫一扫二维码");
          this.CreatPaintCode();
        });
    },
    CreatPaintCode() {
      this.getPaintCode().then((res) => {
        if (this.successCheckCode(res)) {
          this.qrCode(res.data.url);
          this.isCreatPaintCode = true;
          this.timer = setInterval(() => {
            this.getPaintSignResult(res.data.nonceStr);
          }, 2000);
        }
      });
    },
    getBase64(img) {
      function getBase64Image(img, width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var dataURL = canvas.toDataURL();
        return dataURL;
      }

      var image = new Image();
      image.crossOrigin = "";
      image.src = img;
      /*image.onload = function () {
              return getBase64Image(image)
          }*/
      var deferred = $.Deferred();
      if (img) {
        image.onload = function () {
          deferred.resolve(getBase64Image(image));
        };
        return deferred.promise();
      }
    },
    getURLBase64(url) {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height + 200;
        ctx.drawImage(img, 0, 0);
        let file = canvas.toDataURL("image/jpeg", 1);
        console.log(file);
      };
      img.src = url;
    },
  },
};
</script>
<style>
.addukeysign .el-form-item__content {
  width: 354px;
  display: inline-block;
}

.addukeysign .el-form-item__label {
  width: 114px;
  margin-right: 10px;
  color: #626262;
  vertical-align: top;
  height: 36px;
  line-height: 36px;
  padding: 0;
}

.addukeysign input.el-input__inner {
  background: #fff;
}

.addukeysign .sign-uploader .avatar-uploader .el-upload {
  border: 1px dashed #e8ecef;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: #fafafa;
  width: 270px;
  height: 180px;
}

.addukeysign .sign-uploader .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.addukeysign .sign-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 270px;
  height: 180px;
  line-height: 180px;
  text-align: center;
}

.addukeysign .sign-uploader input {
  width: 270px;
  height: 210px;
  opacity: 0;
  position: absolute;
  left: 0;
  top: -30px;
  z-index: 1;
  cursor: pointer;
  display: block;
  font-size: 0;
  font-size: 200px \0;
}

.addukeysign .sign-uploader .el-loading-spinner {
  margin-top: -50px;
}

.addukeysign .sign-uploader .avatar {
  width: 270px;
  height: 180px;
  display: block;
}

.addukeysign .cert-uploader .avatar {
  width: 218px;
  height: 40px;
  display: block;
}

.addukeysign .cert-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 218px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

.addukeysign .cert-uploader .avatar-uploader .el-upload {
  border-top: 1px solid transparent;
  border-left: 1px solid #e8ecef;
  border-right: 1px solid #e8ecef;
  border-bottom: 1px solid #e8ecef;
  border-radius: 0 0 4px 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: #fafafa;
  height: 40px;
  width: 220px;
}

.addukeysign .cert-uploader input {
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  cursor: pointer;
  display: block;
}

.sign-uploader .el-icon-plus:before {
  content: "点击上传";
  width: 80px;
  height: 80px;
  line-height: 100px;
  position: absolute;
  text-align: center;
  top: 50%;
  left: 50%;
  margin-top: -40px;
  margin-left: -40px;
  font-size: 14px;
  color: #999999;
  background: url(../../../../static/image/icon-uploader.png) no-repeat;
  background-position: 20px 0;
}

.sign-uploader .avatar-uploader .el-upload:hover .el-icon-plus:before {
  color: #0073bd;
  background: url(../../../../static/image/icon-uploader-hover.png) no-repeat;
  background-position: 20px 0;
}

.cert-uploader .el-icon-plus:before {
  content: "点击上传";
  width: 74px;
  height: 20px;
  line-height: 22px;
  position: absolute;
  text-align: right;
  top: 50%;
  left: 50%;
  margin-top: -10px;
  margin-left: -37px;
  font-size: 12px;
  color: #999999;
  background: url(../../../../static/image/icon-uploader.png) no-repeat;
  background-size: 20px 20px;
  background-position: 0 0;
}

.cert-uploader .avatar-uploader .el-upload:hover .el-icon-plus:before {
  color: #0073bd;
  background: url(../../../../static/image/icon-uploader-hover.png) no-repeat;
  background-size: 20px 20px;
  background-position: 0 0;
}

.addukeysign .previewImg {
  margin: 0 auto;
  height: 180px;
  display: block;
}
</style>
<style lang="scss">
.addukeysign {
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

    .titremark {
      float: right;
      font-size: 12px;
      color: #3f3f3f;

      span {
        color: #888;
      }
    }
  }

  .footbtn {
    text-align: right;
    padding: 30px 0;

    .el-button {
      width: 100px;
    }
  }

  .uploader-tips {
    font-size: 12px;
    color: #999999;
    line-height: 20px !important;
  }

  .code-uploader {
    width: 270px;
    height: 180px;
    border: 1px solid #e8ecef;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    background: #fafafa;
    margin-bottom: 13px;
    padding: 20px;
    text-align: center;

    img {
      height: 100%;
    }
  }

  .cont-tit {
    font-size: 16px;
    color: #333333;
    padding: 30px 0;

    span {
      font-size: 14px;
      color: #999999;
      margin-left: 20px;

      a {
        color: #06aeff;
        text-decoration: underline;
      }
    }
  }

  .cert-uploader {
    .cert-uploader-item {
      float: left;
      margin-right: 20px;
      margin-bottom: 20px;

      .cert-item-name {
        font-size: 14px;
        color: #3f3f3f;
        margin-bottom: 10px;

        span {
          font-size: 12px;
          color: #888;
        }
      }

      .imginfo {
        border: 1px solid #e8ecef;
        width: 220px;
        height: 140px;
        padding: 17px 25px;
        border-radius: 4px 4px 0 0;
        overflow: hidden;
        position: relative;
        text-align: center;

        .checkfile-btn {
          font-size: 28px;
          color: #8c939d;
          width: 220px;
          height: 140px;
          line-height: 140px;
          text-align: center;
        }

        .img-example {
          position: absolute;
          left: 25px;
          top: 17px;
          width: 170px;
          height: 106px;
          opacity: 0.4;
          background: #333333;
          border-radius: 6px;
          cursor: pointer;

          .img-example-txt {
            font-size: 12px;
            color: #ffffff;
            text-align: center;
            line-height: 144px;
          }

          .img-example-icon {
            width: 16px;
            height: 16px;
            position: absolute;
            text-align: right;
            top: 50%;
            left: 50%;
            margin-top: -8px;
            margin-left: -8px;
            background: url(../../../../static/image/icon-enlargement.png)
              no-repeat;
            background-size: 16px 16px;
            background-position: 0 0;
          }
        }
      }
    }
  }

  .cropper-dialog {
    .el-dialog {
      width: 800px;
      height: 560px;
      border-radius: 10px;

      .el-dialog__header {
        padding: 10px 20px;
        border-radius: 10px 10px 0 0;
        background: #e8ecef;

        .el-dialog__headerbtn {
          margin-top: 0;
        }

        .el-dialog__title {
          font-size: 16px;
          font-weight: normal;
        }
      }
    }

    .el-dialog__body {
      padding: 20px;
    }

    .cropper-dialog-body {
      .previewImg {
        height: 240px;
        width: 240px;
      }
    }
  }

  .cropper-content {
    .cropper {
      float: left;

      .vue-cropper {
        width: 350px;
        height: 300px;
      }
    }

    .show-preview {
      float: right;
      padding: 0 25px;
      width: 400px;
      position: relative;

      .preview {
        border: 1px solid #cccccc;
        background: #cccccc;
        overflow: hidden;
      }

      .imgInfo {
        position: absolute;
        bottom: 0;
        left: 25px;
        margin-bottom: -65px;

        .seal-size-tips {
          margin-top: 10px;
          font-size: 12px;

          span {
            color: #999999;
          }
        }

        .seal-size-ipt {
          margin-top: 10px;

          span {
            display: inline-block;

            &:nth-child(1) {
              margin-right: 20px;
            }

            .el-input {
              margin-left: 10px;
              width: 62px;
            }
          }
        }
      }
    }
  }

  .footer-btn {
    .scope-btn {
      padding: 10px 0;
      width: 350px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      -webkit-justify-content: space-between;

      button {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #c4c4c4;
        color: rgb(31, 46, 61);
        padding: 10px 15px;
        border-radius: 4px;
      }

      .btn {
        white-space: nowrap;
        cursor: pointer;
        text-align: center;
        transition: 0.1s;
        padding: 8px 15px;
        font-size: 14px;
        border-radius: 3px;
        color: #fff;
        background-color: #67c23a;
        border-color: #67c23a;
      }
    }
  }

  .upload-btn {
    text-align: right;
    margin-top: 20px;
    margin-right: 25px;

    .el-button {
      padding: 10px 30px;
    }
  }
}
</style>
