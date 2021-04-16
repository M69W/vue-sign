<template>
  <div class="manualAudit">
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
          <el-button @click="toOtherVerify">查看其它认证方式</el-button>
        </div>
        <real-name-tips :auditStatus="auditStatus"
                        :reason="reason"></real-name-tips>
      </div>
      <div class="box"
           :class="{ detail: path == 'manualAuditDetail' }">
        <!-- <div class="reject" v-if="path == 'manualAuditDetail'">
                    <span class="info"
                        >认证审核驳回，请重新上传资料，驳回原因：XXXXX阿斯蒂芬阿斯蒂芬XXX占位占位占位占位占位占位占位占位占位占位占位位占位位占位位占位</span
                    >
                    <span class="btn" @click="reSub">重新提交</span>
                </div> -->
        <div class="tab">
          <span>人工审核认证</span>
        </div>
        <div class="corporate">
          <!-- 企业 -->
          <div v-if="userType == '01'">
            <div class="label">
              <h5>企业营业执照/其他证件照</h5>
              <span>非注册的工商企业单位机构，请上传政府权威部门出具的证明材料。</span>
            </div>
            <span style="color: #999; font-size: 12px; display:inline-block;margin:10px 0 20px;">照片仅限jpeg、jpg、png格式且大小不超过5M。</span>
            <!-- <div class="uplaod">
                            <span style="color: #999; font-size: 12px;"
                                >照片仅限jpeg、jpg、png格式且大小不超过10M。</span
                            >
                            <div class="upload1">
                                <span class="up-icon">
                                    <i></i>
                                    <br />
                                    点击上传
                                </span>
                                <input type="file" class="upfile" />
                            </div>
                        </div> -->
            <real-name-upload :preUrl="preUrl"
                              @change="changeImg"
                              v-model="enterpriseFileList[0].file"
                              :defaultImg="enterpriseFileList[0].filePath"
                              bgi="/static/image/realName/yyzz.svg">
            </real-name-upload>
            <div class="label"
                 style="margin-bottom:10px;margin-top:40px;">
              <h5>法人身份证/其他证件照</h5>
              <span>请上传真实身份证照片，如出现造假证件信息、出现法律纠纷，用户需自行承担；
              </span>
              <span style="color: #999; font-size: 12px; display:inline-block; margin:10px 0 20px">照片仅限jpeg、jpg、png格式且大小不超过5M。</span>
            </div>
            <el-row style="margin-bottom:40px">
              <el-col :span="12">
                <real-name-upload :preUrl="preUrl"
                                  @change="changeImg"
                                  title="证件照正面"
                                  size="small"
                                  v-model="legalFileList[0].file"
                                  :defaultImg="legalFileList[0].filePath"
                                  bgi="/static/image/realName/idzm.svg">
                </real-name-upload>
              </el-col>
              <el-col :span="12">
                <real-name-upload :preUrl="preUrl"
                                  @change="changeImg"
                                  title="证件照反面"
                                  size="small"
                                  class="fr"
                                  v-model="legalFileList[1].file"
                                  :defaultImg="legalFileList[1].filePath"
                                  bgi="/static/image/realName/idbm.svg">
                </real-name-upload>
              </el-col>
            </el-row>
            <real-name-upload :preUrl="preUrl"
                              @change="changeImg"
                              title="手持证件照正面"
                              tips="证照旁边必须体现“仅用于安印电子合同实名认证”字样"
                              size="small"
                              v-model="legalFileList[2].file"
                              :defaultImg="legalFileList[2].filePath"
                              bgi="/static/image/realName/zjz_bg.png">
            </real-name-upload>
          </div>
          <!-- 个人 -->
          <div v-else
               style="margin-bottom: 40px;">
            <div class="label">
              <h5 style="margin-bottom:10px;">身份证/其他证件照</h5>
              <span>请上传真实身份证照片，如出现造假证件信息、出现法律纠纷，用户需自行承担；</span>

            </div>
            <el-row>
              <el-col :span="12">
                <real-name-upload :preUrl="preUrl"
                                  @change="changeImg"
                                  title="证件照正面"
                                  size="small"
                                  v-model="personalFileList[0].file"
                                  :defaultImg="personalFileList[0].filePath"
                                  bgi="/static/image/realName/idzm.svg">
                  <span style="color: #999; font-size: 12px;"
                        slot="tips-bottom">照片仅限jpeg、jpg、png格式且大小不超过5M。</span>
                </real-name-upload>
              </el-col>
              <el-col :span="12">
                <!-- <real-name-upload :preUrl="preUrl"
                                  @change="changeImg"
                                  title="证件照反面"
                                  size="small"
                                  class="fr"
                                  v-model="personalFileList[1].file"
                                  :defaultImg="personalFileList[1].filePath"
                                  bgi="/static/image/realName/idbm.svg">
                  <span style="color: #999; font-size: 12px;"
                        slot="tips-bottom">照片仅限jpeg、jpg、png格式且大小不超过5M。</span>
                </real-name-upload> -->
                <real-name-upload :preUrl="preUrl"
                                  @change="changeImg"
                                  title="手持证件照正面"
                                  tips="证照旁边必须体现“仅用于安印电子合同实名认证”字样"
                                  size="small"
                                  v-model="personalFileList[1].file"
                                  :defaultImg="personalFileList[1].filePath"
                                  bgi="/static/image/realName/zjz_bg.png">
                  <span style="color: #999; font-size: 12px;"
                        slot="tips-bottom">照片仅限jpeg、jpg、png格式且大小不超过5M。</span>
                </real-name-upload>
              </el-col>
            </el-row>
          </div>
          <p class="tip-warn">
            <span class="tishi">温馨提示：</span>
            <span class="tips">
              1、人工审核认证，一般会在1-2个工作日内审核通过；<br />
              2、如出现造假证件信息、出现法律纠纷，用户需自行承担。
            </span>
          </p>
          <div style="text-align: center;">
            <el-button type="primary"
                       class="tijiao"
                       :class="{'tijiaoActive':isHasImg}"
                       @click="saveAuditInfoFn">提交资料</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               custom-class="audit-dialog"
               top="25%">
      <div class="dialog-content">
        <div v-if="isSuccess">
          <p>
            <i class="success"></i>
            <span>提交成功</span>
          </p>
          <el-button type="primary"
                     @click="confirmSuccess">确定</el-button>
        </div>
        <div v-else>
          <p>
            <i class="fail"></i>
            <span>提交失败</span>
          </p>
          <el-button type="primary"
                     @click="confirmResubmit">重新上传</el-button>
        </div>
      </div>
    </el-dialog>
    <foot></foot>
  </div>
</template>
<script>
import heads from "./heads";
import foot from "./foot";
import service from "../../../assets/mixin/service";
import valid from "../mixin/valid";
import realNameUpload from "@/components/realNameUpload";
import realNameTips from "@/components/realNameTips";
import { objectToFormData } from "@/utils";
export default {
  mixins: [service, valid],
  components: { heads, foot, realNameUpload, realNameTips },
  data() {
    return {
      pageTitle: "",
      path: "",
      formData: {
        accountPhone: "",
        userType: "",
      },
      enterpriseFileList: [
        {
          file: null,
          fileName: "企业营业执照/其他证照",
          filePath: "",
        },
      ], //企业证件列表
      legalFileList: [
        {
          file: null,
          fileName: "法人身份证人像面",
          filePath: "",
        },
        {
          file: null,
          fileName: "法人身份证国徽面",
          filePath: "",
        },
        {
          file: null,
          fileName: "法人手持身份证人像面",
          filePath: "",
        },
      ], //法人文件列表
      personalFileList: [
        {
          file: null,
          fileName: "身份证人像面",
          filePath: "",
        },
        {
          file: null,
          fileName: "手持证件照",
          filePath: "",
        },
      ], //个人证照列表
      dialogVisible: false,
      isSuccess: false,
      userInfo: $.cookie("userinfo") && JSON.parse($.cookie("userinfo")),
      userType: "01",
      auditStatus: "", //审核状态(1:待审核;2:待扫脸;3:已通过;4:驳回) ,
      reason: "", //驳回原因
      isCanSubmit: true,
      isAlerCantSubmit: false, //只有审核中与第一次实名可以提交
      preUrl: "", //图片详情前缀
      isHasImg: false,//是否有图片
      token: sessionStorage.getItem("token")
    };
  },
  computed: {
  },
  watch: {
    $route() {
      this.path = this.$route.path.match(/([^/]+)$/)[1];
    },
  },
  mounted() {
    this.userType = this.userInfo.userType;
    // this.userType = "02"
    if (this.userType == "01") {
      this.pageTitle = "企业实名认证";
    } else {
      this.pageTitle = "个人实名认证";
    }
    this.formData.userType = this.userInfo.userType;
    this.formData.accountPhone = this.userInfo.loginName;
    this.path = this.$route.path.match(/([^/]+)$/)[1];
    //获取详情
    this.getAuditInfoFn().then(() => {
      this.changeImg();
    });
  },
  methods: {
    saveAuditInfoFn() {
      //是否可以重新提交
      if (this.isCanSubmit) {
        if (!this.isAlerCantSubmit) {
          this.$message.warning("当前审核中！");
          return;
        }
        this.isCanSubmit = false;
        let reObjEnterprise = {},
          reObjLegl = {},
          reObjPersonal = {};
        if (this.userType === "01") {
          //企业
          reObjEnterprise = this.checkImgAndTitleAll(
            this.enterpriseFileList,
            "企业"
          );
          reObjLegl = this.checkImgAndTitleAll(
            this.legalFileList,
            "法人"
          );
          this.formData.enterpriseFileList = this.enterpriseFileList;
          this.formData.legalFileList = this.legalFileList;
        } else if (this.userType === "02") {
          reObjPersonal = this.checkImgAndTitleAll(
            this.personalFileList,
            "个人"
          );
          this.formData.personalFileList = this.personalFileList;
        }
        if (
          (reObjEnterprise.flag && reObjLegl.flag) ||
          reObjPersonal.flag
        ) {
          let formData = objectToFormData(this.formData);
          this.saveAuditInfo(formData)
            .then((res) => {
              if (this.successCheckCode(res)) {
                this.isSuccess = true;
                this.dialogVisible = true;
              } else {
                this.isSuccess = false;
                this.dialogVisible = true;
              }
              this.isCanSubmit = true;
              this.getAuditInfoFn();
            })
            .fail((err) => {
              console.log("zx");
              this.isCanSubmit = true;
            });
        } else {
          this.isCanSubmit = true;
        }
      }
    },
    getAuditInfoFn() {
      return this.getAuditInfo().then((res) => {
        if (this.successCheckCode(res)) {
          if (res.data) {
            this.formData.accountPhone = res.data.accountPhone;
            this.formData.userType = res.data.userType;
            this.userType = res.data.userType;
            this.auditStatus = res.data.auditStatus;
            // this.preUrl = res.data.url;
            if (this.auditStatus === 4) {
              //驳回
              this.reason = res.data.reason;
            }
            if (this.auditStatus === 1) {
              this.isAlerCantSubmit = false;
            } else {
              this.isAlerCantSubmit = true;
            }
            if (res.data.userType === "02") {
              this.personalFileList = res.data.personalFileList;
              this.personalFileList.map((p) => {
                p.file = null;
                p.filePath =
                  this.realNameImgUrl +
                  '?fileCode=' +
                  p.fileCode +
                  '&token=' +
                  this.token;
              });
            } else if (res.data.userType === "01") {
              this.enterpriseFileList =
                res.data.enterpriseFileList;
              this.legalFileList = res.data.legalFileList;
              this.enterpriseFileList.map((p) => {
                p.file = null;
                p.filePath =
                  this.realNameImgUrl +
                  '?fileCode=' +
                  p.fileCode +
                  '&token=' +
                  this.token;
              });
              this.legalFileList.map((p) => {
                p.file = null;
                p.filePath =
                  this.realNameImgUrl +
                  '?fileCode=' +
                  p.fileCode +
                  '&token=' +
                  this.token;
              });
            }
          } else {
            this.isAlerCantSubmit = true;
          }
        }
      });
    },
    //检测图片是否上传完整--有图有title
    //arr:检测上传文件arr
    checkImgAndTitleAll(arr, msg) {
      let reObj = {};
      let hasImgList;
      hasImgList = arr.filter((v) => {
        return v.file || v.filePath; //自传或从后台获取（编辑）
      });
      if (hasImgList.length === 0) {
        this.$message.warning(`请上传${msg}证件!`);
        reObj.flag = false; //检测成功？
        reObj.hasImgList = []; //可上传图片list
        return reObj;
      }
      if (hasImgList.length !== arr.length) {
        //数量都传
        this.$message.warning(`${msg}对应文件资料上传不完整!`);
        reObj.flag = false; //检测成功？
        reObj.hasImgList = []; //可上传图片list
        return reObj;
      }
      let ok = hasImgList.every((v) => {
        return v.fileName;
      });
      if (ok) {
        reObj.flag = true; //检测成功？
        reObj.hasImgList = hasImgList; //可上传图片list
      } else {
        this.$message.warning(`请给${msg}对应文件图片输入文件名称!`);
        reObj.flag = false; //检测成功？
        reObj.hasImgList = hasImgList; //可上传图片list
      }
      return reObj;
    },
    checkHadImg(arr) {
      let reObj = {};
      let hasImgList;
      hasImgList = arr.filter((v) => {
        return v.file || v.filePath; //自传或从后台获取（编辑）
      });
      if (hasImgList.length === 0) {
        // this.$message.warning(`请上传${msg}证件!`);
        // reObj.flag = false; //检测成功？
        // reObj.hasImgList = []; //可上传图片list
        return false;
      } else {
        return true;
      }

    },
    toOtherVerify() {
      if (this.userType === "01") {
        this.$router.push("/companyauthen");
      } else {
        this.$router.push("/personauthen");
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    //弹窗操作
    confirmResubmit() {
      this.dialogVisible = false;
    },
    confirmSuccess() {
      this.$router.go(-1);
    },
    changeImg() {
      console.log("zx");
      let isHas = false;
      if (this.userType === '01') {
        if (this.checkHadImg(this.enterpriseFileList) || this.checkHadImg(this.legalFileList)) {
          isHas = true;
        } else {
          isHas = false;
        }
      } else if (this.userType === '02') {
        if (this.checkHadImg(this.personalFileList)) {
          isHas = true;
        } else {
          isHas = false;
        }
      }
      this.isHasImg = isHas;
    },
    // reSub(){
    //     this.$router.push('manualAudit');
    // }
  },
};
</script>
<style lang="scss">
.manualAudit {
  position: relative;
  height: 100%;
  min-width: 1200px;
  /*min-height: 768px;*/
  background: #fff url("../../../../static/image/reg_bg.jpg") no-repeat 50% 0;
  background-size: 100% 100%;
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
      // height: 540px;
      margin: 0 auto;
      position: relative;
      background: #ffffff;
      box-shadow: 0 0 6px 0 rgba(192, 204, 218, 0.5);
      border-radius: 8px;
      padding: 0 25px;
      padding-top: 40px;
      margin-bottom: 30px;

      .tab {
        text-align: center;
        border-bottom: 1px solid #e8ecef;
        margin-bottom: 30px;
        span {
          display: inline-block;
          padding: 12px 72px;
          font-size: 16px;
          cursor: pointer;
          border-bottom: 1px solid #02adff;
          color: #02adff;
        }
      }
      .corporate {
        padding: 0 125px;
        padding-bottom: 50px;
        .label {
          h5 {
            line-height: 30px;
            height: 30px;
            display: inline-block;
            margin-right: 10px;
            font-size: 14px;
            &::before {
              vertical-align: middle;
              content: "*";
              color: #ff0000;
              display: inline-block;
              margin-right: 8px;
            }
          }
          span {
            font-size: 12px;
            color: #999999;
          }
        }
        p.tip-warn {
          color: #999;
          width: 600px;
          line-height: 26px;
          margin-bottom: 40px;
          margin-top: 10px;
          .tishi {
            float: left;
            height: 52px;
          }
        }
        .tijiao {
          width: 480px;
          height: 50px;
          background: #c0ccda;
          border-color: #c0ccda;
          span {
            color: #999;
            font-size: 16px;
          }
        }
        .tijiaoActive {
          background-color: #4ca1f4;
          span {
            color: #fff;
          }
        }
      }
    }
    .box.detail {
      margin-top: 122px;
      .top {
        top: -101px;
      }
    }
    // .reject {
    //     position: absolute;
    //     top: -53px;
    //     left: 0;
    //     width: 100%;
    //     line-height: 40px;
    //     border-radius: 4px;
    //     padding-left: 54px;
    //     background: url(../../../../static/image/warning.png) 20px center
    //         no-repeat #f7b500;
    //     .info {
    //         display: inline-block;
    //         white-space: nowrap;
    //         text-overflow: ellipsis;
    //         overflow: hidden;
    //         width: 793px;
    //         vertical-align: middle;
    //     }
    //     .btn {
    //         display: inline-block;
    //         vertical-align: middle;
    //         color: #ff0000;
    //         text-decoration: underline;
    //         cursor: pointer;
    //     }
    // }
  }
  .audit-dialog {
    height: 240px;
    .success {
      background: url(../../../../static/image/caozuochenggong.svg);
    }
    .fail {
      background: url(../../../../static/image/caozuoshibai.svg);
    }
    .dialog-content {
      text-align: center;
      i {
        display: inline-block;
        width: 44px;
        height: 44px;
        margin-right: 10px;
      }
      p {
        text-align: center;
        padding-top: 30px;
        padding-bottom: 50px;
        font-size: 16px;
        color: #626262;
        i,
        span {
          vertical-align: middle;
        }
      }
      .el-button {
        padding: 10px 26px;
      }
    }
  }
}
</style>
