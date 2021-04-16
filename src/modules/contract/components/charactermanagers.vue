<template>
  <div class="contactmanager">
    <div class="top-title clearfix">
      <div class="titinfo">角色管理</div>
      <div class="titbtn">
        <el-button type="primary" @click="add">添加角色</el-button>
      </div>
    </div>
    <div class="list">
      <el-form class="search clearfix" label-position="left">
        <el-form-item>
          <el-input placeholder="请输入角色名称" v-model="roleName"></el-input>
        </el-form-item>
        <el-button class="searchbtn" @click.prevent="search">查询</el-button>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        tooltip-effect="light"
        v-loading="loadingTabel"
      >
        <el-table-column :resizable="false" prop="roleName" label="角色" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" label="操作" width="100">
          <template slot-scope="scope" v-if="scope.row.isSupermanager!='1'">
            <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="deleteAccount(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-if="total > pageSize">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentpage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogModel" ref="formTab" :before-close="dialogClose" class="dialog">
      <div class="dialogTitle">
        <span class="el-dialog__title">删除角色</span>
      </div>
      <div class="dialog-body">
        <p class="delete">您确认要删除此角色吗?</p>
      </div>
      <div slot="footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="deleteAccountConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import base from "../mixin/base";
import service from "../../../assets/mixin/service";
import charactermanageradd from "./charactermanageradd";
export default {
  mixins: [base, service],
  components: { charactermanageradd },
  data() {
    var validateWay = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号码/邮箱"));
      } else if (
        !/^1[3-9][0-9]{9}$/.test(value) &&
        !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
      ) {
        return callback(new Error("请输入正确的手机号和邮箱"));
      }
      callback();
    };
    return {
      searchForm: {},
      tableData: [],
      dialogModel: false,
      index: -1,
      formData: {},
      rules: {
        contactsName: [
          {
            required: true,
            message: "请输入个人姓名或企业名称",
            trigger: "blur"
          }
        ],
        contactsWay: [{ validator: validateWay, trigger: "blur" }]
      },
      userInfo: "",
      isShow: false,
      safetyLevel: [
        {
          value: "01",
          label: "安全"
        },
        {
          value: "02",
          label: "有风险"
        }
      ],
      roleName: "",
      total: "",
      pageNum: 1,
      pageSize: 10
    };
  },
  created() {
    if (JSON.parse($.cookie("userinfo")).userType == "02") {
      //只有实名企业用户查看
      this.$router.replace("/accountmanager");
    } else if (
      JSON.parse($.cookie("userinfo")).realNameAuthenticationFlag != "1"
    ) {
      setTimeout(() => {
        //去除弹框闪屏
        this.$confirm("请先完成企业实名认证后，才可以开启此功能", "提示", {
          confirmButtonText: "去实名",
          cancelButtonText: "知道了",
          type: "warning",
            customClass:"self-icon icon-warning",
        })
          .then(() => {
            this.$router.push("/companyauthen");
          })
          .catch(() => {
            this.$router.replace("/accountmanager");
          });
      }, 200);
    }
  },
  computed: {
    levelMapping() {
      let o = {};
      this.safetyLevel.map(ele => {
        o[ele.value] = ele.label;
      });
      return o;
    }
  },
  watch: {},
  mounted() {
    if (
      JSON.parse($.cookie("userinfo")).userType == "01" &&
      JSON.parse($.cookie("userinfo")).realNameAuthenticationFlag == "1"
    ) {
      //只有实名企业用户查看
      this.getListData();
    }
  },
  methods: {
    getListData() {
      this.loadingTabel = true;
      this.getUserRoleList(this.pageNum, this.pageSize, {
        roleName: this.roleName,
        enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
        // enterpriseId: 12356
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
    add() {
      this.checkPermission(
        // 权限校验
        this.$perMap.userCenter.roleMgt.addUserRole.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.$router.push({ path: "/charactermanageradd" });
      });
    },
    dialogClose() {
      this.dialogModel = false;
    },
    deleteAccount(roleId) {
      this.checkPermission(
        // 权限校验
        this.$perMap.userCenter.roleMgt.permissionRoleDelete.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.roleId = roleId;
        this.dialogModel = true;
      });
    },
    deleteAccountConfirm() {
      let data = {
        id: this.roleId
      };
      this.permissionRoleDelete(data).then(res => {
        if (this.successCheckCode(res)) {
          this.$message({
            type: "success",
            message: "删除角色成功"
          });
          this.dialogModel = false;
          this.pageNum = 1;
          this.getListData();
        }
      });
    },
    edit(data) {
      this.checkPermission(
        // 权限校验
        this.$perMap.userCenter.roleMgt.updateUserRole.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.$router.push({
          path: "/charactermanageradd",
          query: {
            roleId: data.id,
            roleName: data.roleName,
            isEdit: "1"
          }
        });
      });
    },
    search() {
      this.pageNum = 1;
      this.getListData();
    },
    getUserInfo() {
      if (
        /^1[3-9][0-9]{9}$/.test(this.formData.contactsWay) ||
        /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
          this.formData.contactsWay
        )
      ) {
        this.getUser(this.formData.contactsWay)
          .then(res => {
            if (this.successCheckCode(res)) {
              if (res.data && res.data.name) {
                this.isShow = true;
                this.userInfo = this.format(res.data.name, res.data.userType);
              } else {
                this.isShow = false;
                this.userInfo = "";
              }
            } else {
              this.isShow = false;
              this.userInfo = "";
            }
          })
          .fail(res => {
            this.isShow = false;
            this.userInfo = "";
          });
      }
    },
    format(val, type) {
      if (type == "01") {
        return val.substr(0, 3) + Array(val.length - 2).join("*");
      } else {
        return val.substr(0, 1) + Array(val.length).join("*");
      }
    }
  }
};
</script>
<style scoped lang="scss">
.contactmanager {
  .top-title {
    margin-bottom: 0;
  }
  .dialog-body {
    .delete {
      text-align: center;
      color: #333;
      font-size: 16px;
      padding-top: 40px;
      padding-bottom: 10px;
    }
  }
}
</style>
<style lang="scss">
.delete-user {
  width: 380px;
  .el-button--primary:focus {
    background: #4ca1f4;
    border-color: #4ca1f4;
  }
}
.delete-user .el-message-box__message p {
  font-size: 16px;
}
.contactmanager {
  .top-title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    .titinfo {
      float: left;
      font-size: 18px;
      color: #333333;
    }
    .titbtn {
      float: right;
      .el-button {
        width: 120px;
        height: 36px;
      }
    }
  }
  .list {
    .search {
      padding: 20px 0 20px;
      .el-form-item {
        float: left;
        line-height: 36px;
        margin-right: 20px;
        margin-bottom: 0;
        width: 40%;
        .el-input__inner {
          background: none;
        }
      }
      .searchbtn {
        float: left;
        width: 80px;
        border-color: #00afff;
        span {
          color: #00afff;
        }
        &:hover {
          border-color: #0073bd;
          span {
            color: #fff;
          }
        }
      }
    }
    .el-table {
      table thead th .cell {
        font-size: 14px;
      }
    }
  }
  .dialog {
    .el-form {
      padding: 10px 20px;
      .userInfo {
        font-size: 12px;
        color: #ff4949;
        position: absolute;
        top: 100%;
        left: 0;
        line-height: 1;
        padding-top: 4px;
      }
    }
    .el-form-item.is-required .el-form-item__label:before {
      display: none;
    }
  }
}
</style>
