<template>
  <div class="myseal">
    <div class="top-title clearfix">
      <div class="titinfo">电子印章</div>
      <div class="titbtn">
        <!--<el-button type="primary" @click="addSeal('/addseal')" class="disable-btn">创建云印章</el-button>-->
        <el-button type="primary"
                   @click="addSeal('/addseal')">创建云印章</el-button>
        <el-button type="primary"
                   @click="addSeal('/addukeyseal')">申请UKEY印章</el-button>
      </div>
    </div>
    <div class="loading">
      <el-table :data="tableData"
                style="width: 100%"
                v-if="tableData && tableData != ''">
        <el-table-column :resizable="false"
                         label="印章名称"
                         prop="signatureName"></el-table-column>
        <el-table-column :resizable="false"
                         label="印章编码"
                         prop="pictureCode"></el-table-column>
        <el-table-column :resizable="false"
                         label="创建时间"
                         prop="gmtCreate"></el-table-column>
        <el-table-column :resizable="false"
                         label="有效期限">
          <template slot-scope="scope">
            <div v-if="scope.row.sealBaseType !== '03'">
              <div>{{ timeComp(scope.row.validStart) }}</div>
              <div>{{ timeComp(scope.row.validEnd) }}</div>
            </div>
            <div v-else>无限期</div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false"
                         label="类型"
                         prop="signatureTypeDesc"
                         width="80"></el-table-column>
        <el-table-column :resizable="false"
                         label="状态"
                         width="80">
          <template slot-scope="scope">
            <div v-if="
                            scope.row.signatureType == '01' &&
                                scope.row.esealStatus != '07'
                        ">
              {{ scope.row.esealStatusDesc || "生产中" }}
            </div>
            <div v-if="
                            scope.row.signatureType == '01' &&
                                scope.row.esealStatus == '07'
                        ">
              {{
                            scope.row.orderStatus == "07"
                                ? scope.row.esealStatusDesc
                                : "待发货"
                        }}
            </div>
            <div v-if="scope.row.signatureType == '03'">
              {{ scope.row.signatureStatusDesc }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false"
                         label="管理操作"
                         width="180">
          <template slot-scope="scope">
            <el-button type="text"
                       size="small"
                       @click="sealEdit(scope.row.pictureCode)"
                       v-if="
                            scope.row.signatureType == '03' &&
                                scope.row.signatureStatus == '01'
                        ">编辑</el-button>
            <el-button type="text"
                       size="small"
                       @click="sealDelete(scope.row.bdcescEsealPictureId)"
                       v-if="scope.row.signatureType == '03'">删除</el-button>
            <!--<el-button type="text" size="small" @click="checkLog(scope.row.sealId)" v-if="scope.row.sealBaseType == '03' && scope.row.sealStatus == '01'">日志</el-button>-->
            <el-button type="text"
                       size="small"
                       @click="sealRenew(scope.row.pictureCode,scope.row.orderNo)"
                       v-if="
                            scope.row.signatureType == '01' &&
                            scope.row.orderStatus != '06' &&
                            scope.row.orderStatus != '02' &&
                            (scope.row.esealStatus == '01' ||
                            scope.row.esealStatus == '02')
                        ">续期</el-button>
            <!--<el-button type="text" size="small" @click="sealReport(scope.row.pictureId,scope.row.signatureName,scope.row.pictureCode)" v-if="scope.row.signatureType == '01' && scope.row.esealStatus == '01'">挂失</el-button>-->
            <!--<el-button type="text" size="small" @click="cancelSealReport(scope.row.pictureId,scope.row.signatureName,scope.row.pictureCode,scope.row.orderNo)" v-if="scope.row.signatureType == '01' && scope.row.esealStatus == '05'">取消挂失</el-button>-->
            <!-- esealStatus 印章状态  01 正常 02 过期 03 禁用 04 预挂失中 05 挂失中 06 注销 07 待激活 08 申请中 09 申请失败-->
            <!--orderStatus 订单状态  01 草稿 02 待支付 03 待审核 04 审核不通过 05 订单取消 06 生产中 07 物流中 08 订单完成-->
            <el-button type="text"
                       size="small"
                       @click="updateSeal(scope.row.orderNo)"
                       v-if="
                            scope.row.signatureType == '01' &&
                            scope.row.orderStatus === '06' &&
                            scope.row.orderType == '02'
                        ">更新证书</el-button>
            <!--<el-button type="text" size="small" @click="checkLog(scope.row.sealId)" v-if="scope.row.sealBaseType == '01' && scope.row.sealStatus == '01' || scope.row.sealStatus == '02' || scope.row.sealStatus == '05'">日志</el-button>-->
            <el-button type="text"
                       size="small"
                       @click="
                            sealActivate(
                                scope.row.orderNo,
                                scope.row.signatureType
                            )
                        "
                       v-if="
                            scope.row.signatureType == '01' &&
                                scope.row.esealStatus == '07' &&
                                scope.row.orderStatus == '07'
                        ">去激活</el-button>
            <el-button type="text"
                       size="small"
                       @click="checkOrder(scope.row.orderNo)"
                       v-if="
                            scope.row.signatureType == '01' &&
                                scope.row.esealStatus == '08'
                        ">查看订单</el-button>
            <el-button type="text"
                       size="small"
                       @click="
                            checkSeal(
                                scope.row.signatureFilePath,
                                scope.row.signatureWidth,
                                scope.row.signatureHeight
                            )
                        ">查看章模</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--<div class="nonedata" v-if="nodata">
            <div class="imgbg"></div>
            <div class="txt">暂无数据</div>
        </div>
        <div class="pagination" v-if="total > pageSize">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentpage"
                :page-size="pageSize"
                :total="total"
                layout="total, prev, pager, next"
            ></el-pagination>
        </div>

        <el-dialog title="章模预览" :visible.sync="sealPreviewModel" class="seal-preview-model">
            <div class="bighetong">
                <img :src="hetongimg" alt class="hetongimg">
                <div class="showsealmodel">
                    <img :src="sealsrc" alt class="sealsrc">
                </div>
            </div>
        </el-dialog>-->

    <div class="nonedata"
         v-if="nodata">
      <div class="imgbg"></div>
      <div class="txt">暂无数据</div>
    </div>
    <div class="pagination"
         v-if="total > pageSize">
      <el-pagination @current-change="handleCurrentChange"
                     :current-page="currentpage"
                     :page-size="pageSize"
                     :total="total"
                     layout="total, prev, pager, next"></el-pagination>
    </div>

    <el-dialog title="章模预览"
               :visible.sync="sealPreviewModel"
               class="seal-preview-model"
               top="12%">
      <div class="bighetong">
        <img :src="hetongimg"
             alt
             class="hetongimg" />
        <div class="showsealmodel">
          <img :src="compToken(sealsrc)"
               alt
               class="sealsrc" />
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="sealReportCode == 9 ? '印章挂失校验' : '印章取消挂失校验'"
               :visible.sync="showFlag"
               class="signReportDialog">
      <div class="bodybox">
        <div class="item">
          <span class="item-tit">印章名称</span>
          <span class="item-cont">{{ itemName }}</span>
        </div>
        <div class="item">
          <span class="item-tit">印章编码</span>
          <span class="item-cont">{{ itemCode }}</span>
        </div>
        <div class="item">
          <span class="item-tit">手机号码</span>
          <span class="item-cont">{{ phoneNumStr }}</span>
          <span class="getCodeBtn"
                @click="getMsgCode">{{
                        countdown == 0 ? "获取验证码" : countdown + "s"
                    }}</span>
        </div>
        <div class="item">
          <span class="item-tit">短信验证码</span>
          <span class="item-cont">
            <el-input placeholder
                      v-model="msgCode"></el-input>
          </span>
        </div>
      </div>
      <div class="footerbox">
        <el-button @click="showFlag = false">取 消</el-button>
        <el-button type="primary"
                   @click="checkSmsCodeFn()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import base from "../mixin/base";
import loading from '../../../utils/loading';
export default {
  mixins: [base],
  components: {},
  data() {
    return {
      tableData: [],
      loadingTabel: false,
      nodata: false,
      hetongimg: "./static/image/u1579.jpg",
      sealsrc: "",
      sealPreviewModel: false,
      showFlag: false,
      realNameFlag: JSON.parse($.cookie("userinfo"))
        .realNameAuthenticationFlag,
      accountId: JSON.parse($.cookie("userinfo")).accountId,
      itemName: "",
      itemCode: "",
      phoneNum: "18664562540",
      phoneNumStr: "18664562540",
      esealId: "",
      orderNo: "",
      pictureCode: "",
      countdown: 0,
      sealReportCode: 9,
      isCode: true,
      timer: "",
      msgCode: "",
      userType: ""
    };
  },
  computed: {
    timeComp(time) {
      return function (time) {
        if (time) {
          return time.substr(0, 10);
        } else {
          return time;
        }
      }
    }
  },
  filters: {
    formatStatus(value) {
      if (value == "待发货") {
        return "物流中";
      } else {
        return value;
      }
    },
    formatInvoice(val) {
      if (val == 0) {
        return "无需发票";
      }
      if (val == 1) {
        return "开票中";
      }
      if (val == 2) {
        return "";
      }
      if (val == 3) {
        return "无发票信息";
      }
    }
  },
  watch: {
    countdown() {
      if (this.countdown == 0) {
        clearInterval(this.timer);
        this.isCode = true;
      }
    }
  },
  // beforeRouteEnter(to, from, next){
  //     if($.cookie("userinfo") && JSON.parse($.cookie("userinfo")).userType=='02'){
  //         debugger
  //         this.$router.replace('/mysign')
  //         next();
  //     }
  // },
  created() {
    if (
      $.cookie("userinfo") &&
      JSON.parse($.cookie("userinfo")).userType == "02"
    ) {
      this.$router.replace("/mysign");
      return;
    }
  },
  mounted() {
    this.userType =
      $.cookie("userinfo") && JSON.parse($.cookie("userinfo")).userType;
    if (this.userType == "01") {
      this.getListData();
    }
    // console.log(JSON.parse($.cookie("userinfo")).userId);
    // console.log(JSON.parse($.cookie("userinfo")).accountId);
    this.getInfo();
  },
  methods: {
    addSeal(pathVal) {
      if (pathVal == "/addukeyseal") {
        this.checkPermission(
          // 权限校验
          this.$perMap.sealMgt.electronicSeal.addSeal.url
        ).then(res => {
          if (!this.successCheckCode(res)) {
            return;
          }
          if (!this.realNameFlag == "1") {
            this.$confirm(
              "请您先去完成实名认证之后，才可以申请UKey印章",
              "温馨提示",
              {
                type: "warning",
                confirmButtonText: "去实名认证",
                cancelButtonText: "取消",
                customClass: "self-icon icon-safe"
              }
            ).then(() => {
              this.$router.push({ path: "/companyauthen" });
            });
          } else {
            console.log(pathVal);
            this.$router.push({ path: pathVal });
          }
        });
      } else {
        this.checkPermission(
          // 权限校验
          this.$perMap.sealMgt.electronicSeal.addCloudSeal.url,
          this.$perMap.sealMgt.electronicSeal.addCloudSeal.method
        ).then(res => {
          if (!this.successCheckCode(res)) {
            return;
          }
          this.$router.push({ path: pathVal });
        });
      }
    },
    checkOrder(id) {
      this.$router.push({ path: "/orderdetail", query: { orderNo: id } });
    },
    sealRenew(pictureCode, orderno) {
      console.log(orderno);
      this.$router.push({
        path: "/ukeysealrenew",
        query: {
          // orderNo: orderno,
          pictureCode: pictureCode
        }
      });
    },
    updateSeal(orderno) {
      this.$router.push({
        path: "/ukeyrenewupdate",
        query: {
          orderNo: orderno
        }
      });
    },
    sealReport(id, name, pcode) {
      this.checkPermission(
        // 权限校验
        this.$perMap.sealMgt.electronicSeal.createSignReport.url,
        this.$perMap.sealMgt.electronicSeal.createSignReport.method
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.sealReportCode = 9;
        this.showFlag = true;
        this.itemName = name;
        this.itemCode = pcode;
        this.esealId = id;
        this.pictureCode = pcode;
      });
    },
    cancelSealReport(id, name, pcode, orderNo) {
      this.showFlag = true;
      this.itemName = name;
      this.itemCode = pcode;
      this.esealId = id;
      this.orderNo = orderNo;
      this.pictureCode = pcode;
      this.sealReportCode = 10;
    },
    checkLog(id) {
      this.$router.push({ path: "/loginfo", query: { id: id } });
    },
    checkSeal(imgurl, width, height) {
      this.sealsrc = imgurl;
      this.sealPreviewModel = true;

      this.$nextTick(() => {
        $(".showsealmodel")
          .width((width * 400) / 210)
          .height((height * 400) / 210);
      });
    },
    //编辑云印章
    sealEdit(val) {
      this.checkPermission(
        // 权限校验
        this.$perMap.sealMgt.electronicSeal.editCloudSeal.url,
        this.$perMap.sealMgt.electronicSeal.editCloudSeal.method
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.$router.push({
          path: "/editseal",
          query: { pictureCode: val }
        });
      });
    },
    sealActivate(orderNo, sealBaseType) {
      this.$router.push({
        path: "/ukeyactivate",
        query: { orderNo: orderNo, sealType: sealBaseType }
      });
    },
    signReportSubmit() {
      if (this.sealReportCode == 9) {
        let data = {
          esealId: this.esealId,
          pictureCode: this.pictureCode
        };
        this.createSignReport(data).then(res => {
          if (this.successCheckCode(res)) {
            this.$message.success("印章挂失成功");
            this.showFlag = false;
          }
        });
      } else {
        this.cancelSignReport(this.orderNo).then(res => {
          if (this.successCheckCode(res)) {
            this.$message.success("印章取消挂失成功");
            this.showFlag = false;
          }
        });
      }
    },
    sealDelete(id) {
      var that = this;
      this.checkPermission(
        // 权限校验
        this.$perMap.sealMgt.electronicSeal.delCloudSeal.url,
        this.$perMap.sealMgt.electronicSeal.delCloudSeal.method
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.$confirm("您确认要删除当前云印章吗？", "删除云印章", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "self-icon icon-delete"
        }).then(() => {
          this.delCloudSeal(id)
            .then(res => {
              if (this.successCheckCode(res)) {
                this.$message({
                  message: "删除成功！",
                  type: "success",
                  duration: 1500
                });
                // that.$router.go(0);
                this.getListData();
              }
            })
            .catch(() => { });
        });
      });
    },
    getListData() {
      // this.loadingTabel = true;
      loading.showFullScreenLoading('.loading');
      let data = {
        enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
        esealPictureTypeEnum: "05",
        currPage: this.pageNum,
        pageSize: this.pageSize
      };
      this.getSealSignListByRole(data)
        .then(res => {
          if (
            this.successCheckCode(res) &&
            res.data.records.length > 0
          ) {
            // this.totalSealNumBer = null ;
            this.tableData = res.data.records;
            this.total = res.data.total;
            this.currentpage = res.data.current;
            this.$emit("upDateNum", {
              totalSealNumBer: res.data.total
            }); //刷新印章总数
          } else {
            this.nodata = true;
            this.$emit("upDateNum", { totalSealNumBer: 0 }); //刷新签名总数
          }
          // setTimeout(() => {
          // this.loadingTabel = false;
          // }, 200);
          loading.hideFullScreenLoading();
        })
        .fail(res => {
          loading.hideFullScreenLoading();
          // this.loadingTabel = false;
          // this.$message.error(res.msg);
        });
      // this.getSealSignListByRole(data).then(res =>{
      //     if(this.successCheckCode(res) && res.data.records.length > 0){
      //         this.tableData =  this.tableData.concat(res.data.records);
      //     }
      //     setTimeout(() => {
      //         this.loadingTabel = false
      //     }, 200);
      // }).fail(res =>{
      //     this.loadingTabel = false
      //     this.$message.error(res.msg);
      // })

      // if(this.tableData.length<0){
      //     this.nodata = true;
      // }
    },
    getMsgCode(ref) {
      if (this.countdown == 0 && this.isCode) {
        this.isCode = false;
        this.smsCode({
          phone: this.phoneNum,
          useType: this.sealReportCode //1.注册 2.修改密码 3.找回密码 6.修改邮箱
        })
          .then(res => {
            if (this.successCheckCode(res)) {
              this.countdown = 120;
              this.timer = setInterval(() => {
                --this.countdown;
              }, 1000);
              this.$message({
                type: "success",
                message: "短信验证码发送成功"
              });
            } else {
              this.isCode = true;
            }
          })
          .fail(res => {
            this.isCode = true;
          });
      }
    },
    checkSmsCodeFn() {
      if (!this.userType.length) {
        return this.$message.error("请输入短信验证码");
      }
      let data = {
        msmCode: this.msgCode,
        phone: this.phoneNum,
        useType: this.sealReportCode
      };
      this.checkSmsCode(data).then(res => {
        if (this.successCheckCode(res)) {
          this.signReportSubmit();
        }
      });
    },
    getInfo() {
      var that = this;
      if (this.userType == "02") {
        this.personDetail().then(res => {
          if (this.successCheckCode(res)) {
            // that.phoneNum = res.data.phone;
          }
        });
      } else {
        this.enterpriseDetail().then(res => {
          if (this.successCheckCode(res)) {
            // that.phoneNum = res.data.linkManPhone
            // that.userInfo.safePhone = that.userInfo.accountNo?this.forMat(that.userInfo.accountNo,3,3):''
          }
        });
      }
      that.phoneNumStr = that.phoneNum.replace(
        /(\d{3})\d{4}(\d{4})/,
        "$1****$2"
      );
    }
  }
};
</script>
<style>
.myseal .el-table table thead th .cell {
  color: #626262;
}
</style>
<style lang="scss">
.myseal {
  .top-title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    margin-bottom: 25px;
    .titinfo {
      float: left;
      font-size: 18px;
      color: #333333;
      span {
        font-size: 12px;
        color: #999999;
        margin-left: 10px;
      }
    }
    .titbtn {
      float: right;
      .el-button {
        width: 120px;
        height: 36px;
      }
    }
    .disable-btn {
      width: 120px;
      height: 36px;
      background: #eee;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: default;
      border: 1px solid #dcdcdc;
      color: #989898;
      margin: 0;
      padding: 10px 15px;
      border-radius: 4px;
      margin-right: 10px;
      text-align: center;
    }
  }
  .seal-preview-model {
    .el-dialog {
      width: 500px;
      height: 650px;
      background: #fff;
      padding-top: 24px;
      text-align: center;
      /*top: 50% !important;
            margin-top: -360px;*/
      margin-bottom: 0;
      padding-top: 0;
    }
    .bighetong {
      max-width: 426px;
      max-height: 590px;
      margin: 0 auto;
      position: relative;
      bottom: 70px;
      transform: scale(1.3);
      .hetongimg {
        max-width: 426px;
        max-height: 590px;
      }
      .showsealmodel {
        position: absolute;
        bottom: 4%;
        right: 15%;
        width: 16%;
        .sealsrc {
          height: 100%;
          width: 100%;
        }
      }
    }
  }

  .signReportDialog {
    .el-dialog {
      border-radius: 10px;
      width: 450px;
      .el-dialog__header {
        padding: 10px 20px;
        background: #e8ecef;
        border-radius: 10px 10px 0 0;
        .el-dialog__headerbtn {
          margin-top: 2px;
        }
      }
      .el-dialog__body {
        .bodybox {
          padding: 20px 50px;
          .item {
            line-height: 36px;
            position: relative;
            .item-tit {
              font-size: 14px;
              color: #626262;
              margin-right: 24px;
              text-align: right;
              display: inline-block;
              width: 70px;
            }
            .item-cont {
              font-size: 14px;
              color: #333333;
              display: inline-block;
              .el-input {
                width: 250px;
                .el-input__inner {
                  background-color: #fff;
                }
              }
            }
            .getCodeBtn {
              font-size: 14px;
              min-width: 100px;
              color: #02adff;
              border: 1px solid #02adff;
              border-radius: 4px;
              line-height: 34px;
              text-align: center;
              display: inline-block;
              padding: 0 15px;
              position: absolute;
              right: 0;
              top: 0;
              margin-right: 7px;
              cursor: pointer;
            }
          }
        }
      }
      .footerbox {
        padding: 20px;
        text-align: center;
        .el-button {
          width: 80px;
        }
      }
    }
  }
  .el-dialog__body {
    overflow: hidden;
  }
}
</style>
