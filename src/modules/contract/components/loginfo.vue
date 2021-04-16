<template>
  <div class="loginfo">
    <div class="top-title clearfix">
      <div class="titinfo">
        <span :class="{active: type != 'client'}"
              @click="routerTo('loginfo')">合同平台签章记录</span>
        <span :class="{active: type == 'client'}"
              @click="routerTo('loginfo?type=client')">签章客户端签章记录</span>
      </div>
      <div style="float:right;">
        签章记录有疑问，请<a href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4009196663&cref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa&ref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa%2Fstyle%26id%3Dwpa_setting_a01&pt=undefined&f=1&ty=1&ap=&as=&aty=0&a="
           style="color:#02adff;">联系客服</a>
      </div>
    </div>
    <div class="searchInfo">
      <div class="searchitem">
        <label>名称</label>
        <div class="inputbox">
          <input class="el-input__inner border-gray"
                 v-model="searchName"
                 type="text"
                 placeholder="请输入文档名称/印章名称"
                 @keyup.enter="searchList()">
        </div>
      </div>
      <div class="searchitem">
        <label>时间</label>
        <div class="inputbox">
          <el-date-picker class="border-gray"
                          v-model="daterange"
                          type="daterange"
                          placeholder="选择日期范围"></el-date-picker>
        </div>
      </div>
      <el-button class="searchbtn"
                 @click="search()">查询</el-button>
    </div>
    <el-table :data="tableData"
              v-loading="loadingTabel"
              style="width: 100%"
              stripe
              v-if="type != 'client' && tableData && tableData !=''">
      <el-table-column :resizable="false"
                       label="签章时间"
                       prop="signDate"
                       width="180"></el-table-column>
      <el-table-column :resizable="false"
                       label="文档名称"
                       prop="contractTheme"
                       width="180"
                       show-overflow-tooltip></el-table-column>
      <el-table-column :resizable="false"
                       label="印章名称"
                       prop="sealName"
                       show-overflow-tooltip></el-table-column>
      <el-table-column :resizable="false"
                       label="签署份数"
                       prop="signatureNumber"
                       show-overflow-tooltip
                       align="center"
                       width="120"></el-table-column>
      <el-table-column :resizable="false"
                       label="操作人"
                       prop="operationName"
                       show-overflow-tooltip></el-table-column>
      <el-table-column :resizable="false"
                       label="说明"
                       prop="signTypeDesc"
                       show-overflow-tooltip></el-table-column>
      <el-table-column :resizable="false"
                       label="状态"
                       prop="signStatus"
                       width="80">
        <template slot-scope="scope">{{signStatusMapping[scope.row.signStatus]}}</template>
      </el-table-column>
    </el-table>
    <div v-loading="loadingTabel"
         style="min-height: 100px;width:100%;"
         v-if="type == 'client' && !nodata">
      <el-table :data="clientData"
                style="width: 100%"
                stripe
                v-if="type == 'client' && clientData && clientData !=''">
        <el-table-column :resizable="false"
                         label="签章时间"
                         prop="signTime"
                         width="180"></el-table-column>
        <el-table-column :resizable="false"
                         label="文档名称"
                         prop="signetDocument"
                         width="180"
                         show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false"
                         label="印章编码"
                         prop="esealCode"
                         show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false"
                         label="印章名称"
                         prop="esealFullName"
                         show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false"
                         label="签章类型"
                         prop="signTypeName"
                         show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false"
                         label="操作类型"
                         prop="operateTypeName"
                         show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false"
                         label="状态"
                         prop="operateStatusName"
                         width="80">
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
export default {
  mixins: [base],
  components: {},
  data() {
    return {
      tableData: [],
      clientData: [],
      searchName: "",
      daterange: "",
      nodata: false,
      signStatus: [
        {
          value: "01",
          label: "成功"
        },
        {
          value: "02",
          label: "失败"
        }
      ],
      searchTime: [],
      type: '',
      userinfo: $.cookie('userinfo') && JSON.parse($.cookie('userinfo')),
      loadingTabel: false
    };
  },
  computed: {
    signStatusMapping() {
      let obj = {};
      this.signStatus.map(ele => {
        obj[ele.value] = ele.label;
      });
      return obj;
    }
  },
  watch: {
    $route() {
      this.checkPermission(
        // 权限校验
        this.$perMap.userCenter.log.logInfoList.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.tableData = [];
        this.clientData = [];
        this.nodata = false;
        this.pageNum = 1;
        this.total = 0;
        this.type = this.$route.query.type;
        this.getListData();
      });
    }
  },
  mounted() {
    this.checkPermission(
      // 权限校验
      this.$perMap.userCenter.log.logInfoList.url
    ).then(res => {
      if (!this.successCheckCode(res)) {
        return;
      }
      this.tableData = [];
      this.clientData = [];
      this.type = this.$route.query.type;
      this.getListData();
    });
  },
  methods: {
    async getListData() {
      this.loadingTabel = true;
      let data = {
        searchValue: this.searchName,
        startTime: this.searchTime[0]
          ? this.searchTime[0] + " 00:00:00"
          : this.searchTime[0],
        endTime: this.searchTime[1]
          ? this.searchTime[1] + " 24:00:00"
          : this.searchTime[1],
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      if (this.type == 'client') {
        if (this.userinfo.userType == '01') {
          let creditCode = '', enterpriseId = JSON.parse($.cookie('userinfo')).enterpriseId;
          let enterpriseInfoList = JSON.parse($.cookie('userinfo')).enterpriseInfoList;
          enterpriseInfoList.map(ele => {
            if (enterpriseId == ele.enterpriseId) {
              creditCode = ele.creditCode;
            }
          })
          if (!creditCode) {
            this.nodata = true;
            this.clientData = [];
            setTimeout(() => {
              this.loadingTabel = false;
            }, 200);
            return false;
          }
          data.creditCode = creditCode;
        } else if (this.userinfo.userType == '02') {
          let id = await this.getUserIdCard();
          if (!id) {
            this.nodata = true;
            this.clientData = [];
            setTimeout(() => {
              this.loadingTabel = false;
            }, 200);
            return false;
          }
          // this.userinfo.pictureCode ? data.esealCode = this.userinfo.pictureCode : '';
          data.certificateNo = id;
        }
        this.signSysList(data)
          .then(res => {
            if (this.successCheckCode(res)) {
              this.clientData = res.data.list;
              this.total = res.data.totalRows;
              this.currentpage = res.data.pageNum;
              if (res.data.list.length == 0) {
                this.nodata = true;
              } else {
                this.nodata = false;
              }
            } else {
              this.clientData = [];
              this.nodata = true;
              this.total = 0;
            }
            setTimeout(() => {
              this.loadingTabel = false;
            }, 200);
          })
          .fail(res => {
            this.nodata = true;
            this.clientData = [];
            this.total = 0;
            setTimeout(() => {
              this.loadingTabel = false;
            }, 200);
          });
      } else {
        this.logInfoList(data)
          .then(res => {
            if (this.successCheckCode(res)) {
              this.tableData = res.data.records;
              this.total = res.data.total;
              this.currentpage = res.data.current;
              if (res.data.records.length == 0) {
                this.nodata = true;
              } else {
                this.nodata = false;
              }
            } else {
              this.tableData = [];
              this.nodata = true;
              this.total = 0;
            }
            setTimeout(() => {
              this.loadingTabel = false;
            }, 200);
          })
          .fail(res => {
            this.nodata = true;
            this.tableData = [];
            this.total = 0;
            setTimeout(() => {
              this.loadingTabel = false;
            }, 200);
          });
      }
    },
    search() {
      this.checkPermission(
        // 权限校验
        this.$perMap.userCenter.log.logInfoList.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.searchTime = [];
        if (this.daterange) {
          this.daterange.map(ele => {
            if (ele) {
              this.searchTime.push(this.FormatDate(ele));
            }
          });
        }
        this.pageNum = 1;
        this.getListData();
      });
    },
    getUserIdCard() {
      return new Promise((resolve, reject) => {
        this.personDetail().then(res => {
          if (this.successCheckCode(res)) {
            resolve(res.data.identityCard);
          } else {
            reject()
          }
        })
      })
    },
    routerTo(val) {
      this.$router.push(val);
    }
  }
};
</script>
<style lang="scss">
.loginfo {
  .top-title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    // margin-bottom: 25px;
    .titinfo {
      float: left;
      font-size: 18px;
      color: #333333;
      span {
        display: inline-block;
        margin-right: 40px;
        height: 60px;
        cursor: pointer;
        &.active {
          color: #02adff;
          border-bottom: 1px solid #02adff;
        }
      }
    }
  }
  .searchInfo {
    background-color: #fff;
    padding: 20px 0;
    .searchitem {
      width: 44%;
      float: left;
      label {
        display: block;
        float: left;
        line-height: 36px;
      }
      .inputbox {
        margin-left: 50px;
        margin-right: 20px;
        .el-date-editor--daterange.el-input {
          width: 100%;
        }
        .el-input__inner {
          height: 36px !important;
          font-size: 14px;
        }
        .el-cascader {
          .el-cascader__label {
            line-height: 36px !important;
          }
        }
      }
    }
    .searchbtn {
      border-radius: 4px;
      height: 36px;
      line-height: 36px;
      padding: 0 15px;
      vertical-align: top;
    }
  }
  .pagination {
    padding-bottom: 0;
    height: auto;
  }
}
</style>
