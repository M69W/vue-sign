<template>
  <div class="ukeyorder">
    <div class="top-title">
      <div class="titinfo">UKEY订单列表</div>
      <el-button type="primary"
                 v-if="userType == '02'"
                 @click="addukeysign('02')">添加Ukey签名</el-button>
      <el-button type="primary"
                 v-if="userType == '01'"
                 @click="addSeal('/addukeyseal')">申请UKEY印章</el-button>
    </div>
    <div class="loading">
      <el-table :data="tableData"
                stripe
                class="order-table"
                style="width: 100%;"
                v-if="tableData && tableData != ''">
        <el-table-column :resizable="false"
                         label="订单号"
                         prop="orderNo"
                         width="180"></el-table-column>
        <el-table-column :resizable="false"
                         label="类型"
                         prop="orderTypeDesc">
        </el-table-column>
        <el-table-column :resizable="false"
                         label="申请数量"
                         align="center"
                         prop="totleEseal"
                         width="100"></el-table-column>
        <el-table-column :resizable="false"
                         label="申请时间"
                         prop="createTime"
                         width="180"></el-table-column>
        <el-table-column :resizable="false"
                         label="状态">
          <template slot-scope="scope">
            <div class="status">
              <span class="circle"
                    :class="{
                                draft:
                                    scope.row.orderStatus == '01' ||
                                    scope.row.orderStatus == '05',
                                notThrough: scope.row.orderStatus == '04',
                                complete: scope.row.orderStatus == '08',
                            }"></span>
              {{ scope.row.orderStatusDesc || "无" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false"
                         label="管理操作">
          <!-- 01:草稿 02:待支付 03:待审核 04:审核不通过 05:订单取消 06:生产中 07:物流中 08:订单完成 -->
          <template slot-scope="scope">
            <el-button type="text"
                       size="small"
                       @click="
                            submitOrder(
                                scope.row.orderNo,
                                scope.row.orderStatus,
                                scope.row.orderType,
                                scope.row.name
                            )
                        "
                       v-if="
                            (scope.row.orderStatus == '01' ||
                                scope.row.orderStatus == '02') &&
                            (scope.row.orderType == '01' ||
                                scope.row.orderType == '02')
                        ">提交
            </el-button>
            <el-button type="text"
                       size="small"
                       @click="
                            cancelOrder(scope.row.orderNo, scope.row.orderType)
                        "
                       v-if="
                            (scope.row.orderStatus == '01' ||
                                scope.row.orderStatus == '02') &&
                            (scope.row.orderType == '01' ||
                                scope.row.orderType == '02')
                        ">取消
            </el-button>
            <el-button type="text"
                       size="small"
                       @click="
                            editOrder(scope.row.orderNo, scope.row.orderStatus)
                        "
                       v-if="
                            scope.row.orderStatus == '04' &&
                            scope.row.orderType == '01'
                        ">编辑
            </el-button>
            <!--<el-button type="text" size="small" @click="delOrder(scope.row.orderNo, scope.row.orderStatus)" v-if="scope.row.orderStatus == '05'">删除</el-button>-->
            <el-button type="text"
                       size="small"
                       @click="
                            updateCa(scope.row.orderNo, scope.row.orderType)
                        "
                       v-if="
                            scope.row.orderStatus == '06' &&
                            scope.row.orderType == '02'
                        ">更新证书</el-button>
            <el-button type="text"
                       size="small"
                       @click="
                            checkOrder(
                                scope.row.orderNo,
                                scope.row.orderType,
                                scope.row.orderStatus
                            )
                        "
                       v-if="
                            (scope.row.orderType == '01' &&
                                scope.row.orderStatus != '02' &&
                                scope.row.orderStatus != '01') ||
                            (scope.row.orderType == '02' &&
                                scope.row.orderStatus == '08')
                        ">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
  </div>
</template>
<script>
import base from "../mixin/base";
import loading from '../../../utils/loading';
// 订单状态(01:草稿 02:待支付 03:待审核 04:审核不通过 05:订单取消 06:生产中 07:物流中 08:订单完成)
export default {
  mixins: [base],
  components: {},
  data() {
    return {
      tableData: [
        // {
        //     orderType: "01" // 01 申请，02 续期，03补办，04挂失，05变更，06注销
        // }
      ],
      loadingTabel: false,
      nodata: false,
      userId: JSON.parse($.cookie("userinfo")).userId,
      userType: JSON.parse($.cookie("userinfo")).userType,
      realNameFlag: JSON.parse($.cookie("userinfo"))
        .realNameAuthenticationFlag,
    };
  },
  computed: {},
  watch: {},
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
    },
  },
  mounted() {
    this.getListData();
  },
  methods: {
    addSeal(pathVal) {
      this.checkPermission(
        // 权限校验
        this.$perMap.sealMgt.electronicSeal.addSeal.url
      ).then((res) => {
        if (!this.successCheckCode(res)) {
          return;
        }
        if (+this.realNameFlag !== 1) {
          this.$confirm(
            "请您先去完成实名认证之后，才可以申请UKey印章",
            "温馨提示",
            {
              type: "warning",
              confirmButtonText: "去实名认证",
              cancelButtonText: "取消",
              customClass: "self-icon icon-safe",
            }
          ).then(() => {
            this.$router.push({ path: "/companyauthen" });
          });
        } else {
          this.$router.push({ path: pathVal });
        }
      });
    },
    addukeysign(val) {
      //01企业， 02个人
      console.log(this.realNameFlag);
      this.checkPermission(
        // 权限校验
        this.$perMap.sealMgt.mySign.signOrderInit.url,
        this.$perMap.sealMgt.mySign.signOrderInit.method
      ).then((res) => {
        if (!this.successCheckCode(res)) {
          return;
        }
        if (+this.realNameFlag !== 1) {
          this.$confirm(
            "请您先去完成实名认证之后，才可以申请UKey签名",
            "温馨提示",
            {
              type: "warning",
              confirmButtonText: "去实名认证",
              cancelButtonText: "取消",
              customClass: "self-icon icon-safe",
            }
          ).then(() => {
            this.$router.push({ path: "/personauthen" });
          });
        } else {
          this.$router.push("/addukeysign");
        }
      });
    },
    updateCa(id, type) {
      this.$router.push({
        path: "/ukeyrenewupdate",
        query: { orderNo: id },
      });
    },
    checkOrder(id, type, orderStatus) {
      this.checkPermission(
        // 权限校验
        this.$perMap.sealMgt.ukeyOrder.orderDetailEnterprise.url,
        this.$perMap.sealMgt.ukeyOrder.orderDetailEnterprise.method
      ).then((res) => {
        if (!this.successCheckCode(res)) {
          return;
        }
        if (type === "02") {
          // 续期
          this.$router.push({
            path: "/ukeyrenewaldetails",
            query: {
              orderNo: id,
              orderStatus: orderStatus,
            },
          });
        } else {
          // 申请
          this.$router.push({
            path: "/orderdetail",
            query: { orderNo: id },
          });
        }
      });
    },
    submitOrder(id, status, type, name) {
      this.checkPermission(
        // 权限校验
        this.$perMap.sealMgt.ukeyOrder.orderDetailEnterprise.url
      ).then((res) => {
        if (!this.successCheckCode(res)) {
          return;
        }
        if (status == "02") {
          // 待支付
          if (type === "01") {
            // 申请的
            this.$router.push({
              path: "/sealorderpay",
              query: { orderNo: id },
            });
          } else if (type === "02") {
            // 续期的
            this.$router.push({
              path: "/ukeysealrenewpay",
              query: {
                orderNo: id,
                enterpriseName: name,
              },
            });
          }
        } else {
          if (type == "01") {
            if (this.userType == "01") {
              this.$router.push({
                path: "/addukeyseal",
                query: { orderNo: id },
              });
            } else {
              this.$router.push({
                path: "/addukeysign",
                query: { orderNo: id },
              });
            }
          } else if (type == "02") {
            this.$router.push({
              path: "/ukeysealrenew",
              query: {
                orderNo: id,
              },
            });
          }
        }
      });
    },
    cancelOrder(orderNo, orderType) {
      this.checkPermission(
        // 权限校验
        this.$perMap.sealMgt.ukeyOrder.cancelUkeyOrder.url
      ).then((res) => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.$confirm("订单取消后不可恢复, 是否继续?", "提示", {
          confirmButtonText: "取消订单",
          cancelButtonText: "返回",
          type: "warning",
          customClass: "self-icon icon-unrestore",
        }).then(() => {
          this.cancelUkeyOrder(orderNo, orderType)
            .then((res) => {
              if (this.successCheckCode(res)) {
                this.$message.success("已取消订单成功！");
                this.pageNum = 1;
                this.getListData();
              }
            })
            .fail((res) => {
              this.$message.error("取消订单失败！");
            });
        });
      });
    },
    delOrder() { },
    editOrder(id, status) {
      //                if(status == '02'){
      //                    this.$router.push({path:"/sealorderpay", query:{orderNo:id}});
      //                }else{
      //                    this.$router.push({path:"/addukeyseal", query:{orderNo:id}});
      //                }
      this.checkPermission(
        // 权限校验
        this.$perMap.sealMgt.ukeyOrder.editUkeyOrder.url,
        this.$perMap.sealMgt.ukeyOrder.editUkeyOrder.method
      ).then((res) => {
        if (!this.successCheckCode(res)) {
          return;
        }
        if (this.userType == "01") {
          this.checkPermission(
            // 权限校验
            this.$perMap.sealMgt.ukeyOrder.editUkeyOrder.url
          ).then((res) => {
            if (!this.successCheckCode(res)) {
              return;
            }
            this.$router.push({
              path: "/addukeyseal",
              query: { orderNo: id, edittype: status },
            });
          });
        } else {
          this.$router.push({
            path: "/addukeysign",
            query: { orderNo: id, edittype: status },
          });
        }
      });
    },
    getListData() {
      // this.loadingTabel = true;
      loading.showFullScreenLoading('.loading');
      this.orderList(this.pageNum, this.pageSize)
        .then((res) => {
          if (
            this.successCheckCode(res) &&
            res.data.list.length > 0
          ) {
            this.tableData = res.data.list;
            this.tableData.map((ele) => {
              if (ele.orderType == "07") {
                ele.orderTypeDesc = "门店续期缴费";
              }
            });
            this.total = res.data.totalRow;
            this.$emit("upDateNum", {
              totalUkeyOrderNumBer: res.data.totalRow,
            }); //刷新订单总数
            this.currentpage = res.data.pageNum;
          } else {
            this.nodata = true;
            this.$emit("upDateNum", { totalUkeyOrderNumBer: 0 }); //刷新订单总数
          }
          // this.loadingTabel = false;
          loading.hideFullScreenLoading();
          // setTimeout(() => {
          // }, 200);
        })
        .fail((res) => {
          // this.loadingTabel = false;
          loading.hideFullScreenLoading();
          // this.$message.error(res.msg);
        });
    },
  },
};
</script>
<style lang="scss">
.ukeyorder {
  .top-title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    margin-bottom: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-button {
      height: 36px;
    }
    .titinfo {
      float: left;
      font-size: 18px;
      color: #333333;
    }
  }

  .order-table {
    .status {
      position: relative;
      display: inline-block;
      width: 100px;

      span {
        float: left;
        margin-right: 10px;
        margin-top: 5px;
      }
    }

    .circle {
      width: 8px;
      height: 8px;
      background: #4ca1f4;
      border-radius: 50%;
      margin-right: 20px;
      margin-top: 5px;
      display: inline-block;
    }

    .draft {
      background: #b5b5b5;
    }

    .notThrough {
      background: #f35614;
    }

    .complete {
      background: #64c757;
    }
  }
}
</style>
