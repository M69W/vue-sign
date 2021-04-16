<template>
  <div class="costmanager">
    <div class="top-title">
      <div class="titinfo">费用管理</div>
    </div>
    <div class="mainBox">
      <div class="tab clearfix">
        <span :class="{ active: active == 1 }"
              @click="tab('1')">电子合同套餐</span>
        <span :class="{ active: active == 2 }"
              @click="tab('2')">UKey费用</span>
      </div>
      <div v-if="active == 1">
        <div class="setmeal">
          <p>
            尊敬的
            <span style="color: #151515;">
              {{ userinfo.enterPriseName }} </span>用户， <br />您所有套餐剩余总份数为
            <span style="color:#02ADFF;">{{ times }}份</span>，若需购买，请进入套餐页面购买。
          </p>
          <el-button class="searchbtn"
                     @click="routerTo('setmeal')">购买套餐</el-button>
        </div>
        <div class="orderlist">
          <div class="myorder">我的订单</div>
          <div class="searchForm">
            <el-form :model="searchForm"
                     ref="searchForm"
                     label-width="75px"
                     label-position="left">
              <el-form-item label="订单时间">
                <el-date-picker v-model="searchForm.daterange"
                                class="border-gray"
                                type="daterange"
                                placeholder="选择日期范围"
                                :editable="false"></el-date-picker>
              </el-form-item>
              <el-form-item label="套餐">
                <el-select v-model="searchForm.signPackageId"
                           placeholder="请选择"
                           clearable
                           class="border-gray">
                  <el-option v-for="item in packList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-button @click="search"
                         class="searchbtn">查询</el-button>
            </el-form>
            <el-table :data="tableData"
                      style="width: 100%"
                      stripe
                      v-loading="loadingTabel">
              <el-table-column :resizable="false"
                               prop="orderNo"
                               label="订单号"
                               width="180"></el-table-column>
              <el-table-column :resizable="false"
                               prop="signPackageName"
                               label="套餐"
                               width="65"
                               show-overflow-tooltip></el-table-column>
              <el-table-column :resizable="false"
                               prop="originFee"
                               label="订单金额"
                               width="65"></el-table-column>
              <el-table-column :resizable="false"
                               prop="couponFee"
                               label="优惠券"
                               width="65"></el-table-column>
              <el-table-column :resizable="false"
                               prop="amountPayable"
                               label="应付金额"
                               width="65"></el-table-column>
              <el-table-column :resizable="false"
                               prop="signSum"
                               label="份数"
                               width="65"></el-table-column>
              <el-table-column :resizable="false"
                               label="套餐有效期"
                               width="220">
                <template slot-scope="scope">
                  {{
                                        FormatDate(
                                            scope.row.signValidBeginTime
                                        )
                                    }}至{{
                                        FormatDate(scope.row.signValidEndTime)
                                    }}
                </template>
              </el-table-column>
              <el-table-column :resizable="false"
                               prop="gmtCreate"
                               label="订单时间"
                               :formatter="dateFormat"></el-table-column>
              <el-table-column :resizable="false"
                               prop="orderStatus"
                               label="订单状态">
                <template slot-scope="scope">
                  {{
                                        orderStatusMapping[
                                            scope.row.orderStatus
                                        ]
                                    }}
                </template>
              </el-table-column>
              <el-table-column :resizable="false"
                               prop="invoiceStatus"
                               label="发票状态"
                               align="center">
                <template slot-scope="scope">
                  {{
                                        scope.row.orderStatus === "02"
                                            ? "--"
                                            : scope.row.invoiceStatus === 2 &&
                                              (scope.row.orderStatus === "01" ||
                                                  scope.row.orderStatus === "0")
                                            ? ""
                                            : invoiceStatusMapping[
                                                  scope.row.invoiceStatus
                                              ]
                                    }}
                  <span v-if="
                                            scope.row.invoiceStatus === 2 &&
                                                (scope.row.orderStatus ===
                                                    '01' ||
                                                    scope.row.orderStatus ===
                                                        '0')
                                        "
                        @click="downLoad(scope.row.fileCode)"
                        class="load">下载发票</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div v-if="active == 2">
        <div class="orderlist">
          <div class="myorder">我的订单</div>
          <div class="searchForm">
            <el-form :model="searchForm"
                     ref="searchForm"
                     label-width="75px"
                     label-position="left">
              <el-form-item label="订单时间">
                <el-date-picker v-model="searchForm2.daterange"
                                type="daterange"
                                placeholder="选择日期范围"></el-date-picker>
              </el-form-item>
              <el-button @click="searchCost">查询</el-button>
            </el-form>
            <el-table :data="tableData2"
                      style="width: 100%"
                      stripe>
              <el-table-column :resizable="false"
                               prop="tradeNo"
                               label="订单号"
                               width="200"></el-table-column>
              <el-table-column :resizable="false"
                               prop="tradeType"
                               label="类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.tradeType == '01'">ukey订单</span>
                  <span v-if="scope.row.tradeType == '02'">套餐订单</span>
                  <span v-if="scope.row.tradeType == '03'">ukey续期</span>
                </template>
              </el-table-column>
              <el-table-column :resizable="false"
                               prop="totalFee"
                               label="订单金额">
                <template slot-scope="scope">
                  <span>{{ scope.row.originFee / 100 }}</span>
                </template>
              </el-table-column>
              <el-table-column :resizable="false"
                               prop="totalFee"
                               label="优惠券">
                <template slot-scope="scope">
                  <span>{{ scope.row.couponFee / 100 }}</span>
                </template>
              </el-table-column>
              <el-table-column :resizable="false"
                               prop="totalFee"
                               label="应付金额">
                <template slot-scope="scope">
                  <span>{{ scope.row.totalFee / 100 }}</span>
                </template>
              </el-table-column>
              <el-table-column :resizable="false"
                               prop="gmtCreate"
                               label="订单时间"></el-table-column>
              <el-table-column :resizable="false"
                               prop="tradeState"
                               label="订单状态">
                <template slot-scope="scope">
                  <span v-if="
                                            scope.row.tradeState == 'SUCCESS' ||
                                                scope.row.tradeState ==
                                                    'TRADE_SUCCESS'
                                        ">支付成功</span>
                  <span v-else>支付失败</span>
                </template>
              </el-table-column>
              <el-table-column :resizable="false"
                               prop="invoiceStatus"
                               label="发票状态"
                               align="center">
                <template slot-scope="scope">
                  <a v-if="
                                            (scope.row.tradeState ==
                                                'SUCCESS' ||
                                                scope.row.tradeState ==
                                                    'TRADE_SUCCESS') &&
                                                scope.row.invoicePath
                                        "
                     :href="scope.row.invoicePath"
                     class="load"
                     download>下载发票</a>
                  <span v-else-if="
                                            scope.row.invoicePath == null &&
                                                scope.row.buyerName == null &&
                                                (scope.row.tradeState ==
                                                    'SUCCESS' ||
                                                    scope.row.tradeState ==
                                                        'TRADE_SUCCESS')
                                        ">无需开票</span>
                  <span v-else-if="
                                            scope.row.invoicePath == null &&
                                                scope.row.buyerName &&
                                                (scope.row.tradeState ==
                                                    'SUCCESS' ||
                                                    scope.row.tradeState ==
                                                        'TRADE_SUCCESS')
                                        ">开票中</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column :resizable="false"
                               label="操作"
                               width="120">
                <template slot-scope="scope">
                  <el-button type="text"
                             size="small"
                             @click="
                                            checkDetail(
                                                scope.row.tradeNo,
                                                scope.row.tradeState,
                                                scope.row.pictureType,
                                                scope.row.tradeType
                                            )
                                        ">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
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
  </div>
</template>
<script>
import base from "../mixin/base";
import { checkBlobFileResponseUtils } from "@/utils";
export default {
  mixins: [base],
  data() {
    return {
      active: 1,
      times: "",
      searchForm: {
        daterange: []
      },
      searchForm2: {
        daterange: []
      },
      dataRangeFormat: [],
      dataRangeFormat2: [],
      tableData: [],
      tableData2: [],
      userinfo: JSON.parse($.cookie("userinfo")),
      orderStatus: [
        {
          value: "01",
          label: "支付成功"
        },
        {
          value: "02",
          label: "支付失败"
        },
        {
          value: "03",
          label: "已撤销"
        },
        {
          value: "0",
          label: "完成"
        },
        {
          value: "1",
          label: "待审核"
        },
        {
          value: "2",
          label: "待付款"
        },
        {
          value: "3",
          label: "付款驳回"
        },
        {
          value: "4",
          label: "审核驳回"
        },
        {
          value: "5",
          label: "已撤销"
        }
      ],
      invoiceStatus: [
        {
          value: "0",
          label: "无需发票"
        },
        {
          value: "1",
          label: "开票中"
        },
        {
          value: "2",
          label: "已开票"
        }
      ],
      packList: [
        {
          value: 1,
          label: "A套餐"
        },
        {
          value: 2,
          label: "B套餐"
        },
        {
          value: 3,
          label: "C套餐"
        },
        {
          value: 4,
          label: "D套餐"
        }
      ]
    };
  },
  computed: {
    orderStatusMapping() {
      let o = {};
      this.orderStatus.map(ele => {
        o[ele.value] = ele.label;
      });
      return o;
    },
    invoiceStatusMapping() {
      let o = {};
      this.invoiceStatus.map(ele => {
        o[ele.value] = ele.label;
      });
      return o;
    }
  },
  watch: {},
  mounted() {
    let from = this.$route;

    this.active = sessionStorage.getItem("costmanagerActive") || "1";

    // 从ukey详情返回
    if (
      (from.params.from && from.params.from === "ukeydetail") ||
      $.cookie("costmanagerActive") === "2"
    ) {
      this.tab("2");
    } else {
      // 其它页面过来
      this.getInfo();
      this.checkPermission(
        // 权限校验
        this.$perMap.userCenter.costMgt.getCostOrderList.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.getListData();
        this.getList();
      });
    }
  },
  methods: {
    tab(val) {
      if (val === "2") {
        this.active = val;
        $.cookie("costmanagerActive", val);
        sessionStorage.setItem("costmanagerActive", val);
        this.checkPermission(
          // 权限校验
          this.$perMap.userCenter.costMgt.getCostOrderList.url
        ).then(res => {
          if (!this.successCheckCode(res)) {
            return;
          }
          this.pageNum = 1;
          this.getListData();
        });
      } else {
        this.active = val;
        $.cookie("costmanagerActive", val);
        sessionStorage.setItem("costmanagerActive", val);
        this.checkPermission(
          // 权限校验
          this.$perMap.userCenter.costMgt.getCostOrderList.url
        ).then(res => {
          if (!this.successCheckCode(res)) {
            return;
          }
          this.pageNum = 1;
          this.getListData();
        });
      }
    },
    checkDetail(orderNo, status, type, tradeType) {
      if (tradeType === "01" || tradeType === "02") {
        this.$router.push({
          path: "/ukeyorderdetail",
          query: {
            orderNo: orderNo,
            paystatus: status,
            pictureType: type
          }
        });
      } else if (tradeType === "03") {
        this.$router.push({
          path: "/ukeydetails",
          query: {
            orderNo: orderNo,
            paystatus: status
          }
        });
      }
    },
    getInfo() {
      this.getAccountInfo({
        userId: this.userinfo.userId,
        accountId: this.userinfo.accountId,
        userType: this.userinfo.userType
      }).then(res => {
        if (this.successCheckCode(res)) {
          this.times = res.data.signatureTotal;
        }
      });
    },
    getListData() {
      if (this.active == "1") {
        this.getPackList();
      } else if (this.active == "2") {
        this.getCostList();
      }
    },
    getPackList() {
      this.loadingTabel = true;
      this.getPackOrderList({
        userId: this.userinfo.userId,
        accountId: this.userinfo.accountId,
        userType: this.userinfo.userType,
        signPackageId: this.searchForm.signPackageId,
        createTimeBegin: this.dataRangeFormat[0],
        createTimeEnd: this.dataRangeFormat[1],
        currPage: this.pageNum,
        pageSize: this.pageSize
      })
        .then(res => {
          if (this.successCheckCode(res)) {
            this.tableData = res.data.records;
            this.total = res.data.total;
            this.currentpage = res.data.current;
          }
          setTimeout(() => {
            this.loadingTabel = false;
          }, 200);
        })
        .fail(res => {
          this.loadingTabel = false;
        });
    },
    getCostList() {
      this.loadingTabel = true;
      this.getCostOrderList(
        this.pageNum,
        this.pageSize,
        this.dataRangeFormat2[0] ? this.dataRangeFormat2[0] : "",
        this.dataRangeFormat2[1] ? this.dataRangeFormat2[1] : ""
      )
        .then(res => {
          if (this.successCheckCode(res)) {
            this.tableData2 = res.data.records;
            this.total = res.data.total;
            this.currentpage = res.data.current;
          }
          setTimeout(() => {
            this.loadingTabel = false;
          }, 200);
        })
        .fail(res => {
          this.loadingTabel = false;
        });
    },
    searchCost() {
      this.checkPermission(
        // 权限校验
        this.$perMap.userCenter.costMgt.getCostOrderList.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.dataRangeFormat2 = [];
        for (var time of this.searchForm2.daterange) {
          if (time !== null) {
            var a = this.FormatDate(time);
            this.dataRangeFormat2.push(a);
          }
        }
        this.pageNum = 1;
        this.getCostList();
      });
    },
    search() {
      this.checkPermission(
        // 权限校验
        this.$perMap.userCenter.costMgt.getCostOrderList.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.dataRangeFormat = [];
        for (var time of this.searchForm.daterange) {
          if (time !== null) {
            var a = this.FormatDate(time);
            this.dataRangeFormat.push(a);
          }
        }
        this.pageNum = 1;
        this.getListData();
      });
    },
    downLoad(fileCode) {
      let _self = this;
      var xhr;
      if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
      } else {
        // code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xhr.open("get", "/api/invoice/download/" + fileCode);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Authorization", sessionStorage.getItem('token'));
      xhr.responseType = "blob";
      xhr.send();
      xhr.onreadystatechange = function () {
        // 这步为判断服务器是否正确响应
        if (xhr.status == 200 && xhr.readyState === 4) {
          var blob = xhr.response; //new Blob([xhr.response],{type:"application/octet-stream"});
          checkBlobFileResponseUtils(blob)
            .then(res => {
              var fileName = fileCode + ".pdf";
              if ("download" in document.createElement("a")) {
                const elink = document.createElement("a");
                elink.download = fileName;
                elink.style.display = "none";
                try {
                  elink.href = URL.createObjectURL(res);
                } catch (e) { }
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href);
                document.body.removeChild(elink);
              } else {
                navigator.msSaveOrOpenBlob(res, fileName);
              }
            })
            .catch(errMsg => {
              _self.$message({
                type: "error",
                message: errMsg
              });
            });
        } else {
        }
      };
    },
    routerTo(val) {
      this.$router.push(val);
    },
    getList() {
      this.getPackageList(1, 10).then(res => {
        if (this.successCheckCode(res)) {
          this.packList = res.data.records;
          this.packList.push({ id: "-1", name: "自定义套餐" });
        }
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    let toPathArr = ["/ukeyorderdetail", "/ukeydetails"];
    if (!toPathArr.includes(to.path)) {
      sessionStorage.removeItem("costmanagerActive");
    }
    next();
  }
};
</script>
<style lang="scss">
.costmanager {
  .top-title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    margin-bottom: 25px;
    .titinfo {
      font-size: 18px;
      color: #333333;
    }
  }
  .mainBox {
    .tab {
      padding-bottom: 20px;
      span {
        float: left;
        padding: 0 25px;
        line-height: 22px;
        font-size: 16px;
        color: #333;
        cursor: pointer;
        &:first-child {
          padding-left: 0;
        }
      }
      span.active {
        color: #02adff;
      }
    }
    .setmeal {
      width: 934px;
      height: 120px;
      background: #f4f6f8;
      border: 1px solid #e8ecef;
      position: relative;
      margin-bottom: 30px;
      p {
        line-height: 30px;
        margin-top: 30px;
        margin-left: 20px;
        color: #626262;
        font-size: 16px;
      }
      .el-button {
        position: absolute;
        right: 20px;
        top: 46px;
        /*border-color: #02adff;*/
        /*background: none;*/
        span {
          /*color: #02adff;*/
        }
      }
    }
    .orderlist {
      border: 1px solid #e8ecef;
      .myorder {
        padding: 28px 20px;
        padding-bottom: 19px;
        line-height: 22px;
        font-size: 16px;
      }
      .el-form {
        padding: 0 20px;
        overflow: hidden;
        .el-form-item {
          float: left;
          margin-right: 20px;
          width: 380px;
          &:nth-child(2) {
            .el-form-item__label {
              width: 48px !important;
            }
            .el-form-item__content {
              margin-left: 48px !important;
            }
          }
          .el-date-editor {
            width: 100%;
          }
          .el-select {
            width: 100%;
          }
        }
        .el-button {
          /*float: right;*/
        }
      }
      .el-table {
        border: none;
        &::after,
        &::before {
          background: none;
        }
      }
      .el-table table td,
      .el-table table th.is-leaf {
        border-bottom: none;
      }
      .el-table table thead th .cell {
        font-size: 14px;
      }
      .load {
        color: #02adff;
        cursor: pointer;
      }
    }
  }
}
</style>
