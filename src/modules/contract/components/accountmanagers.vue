<template>
  <div class="accountmanagers">
    <div class="top-title clearfix">
      <div class="titinfo">账号管理</div>
      <div class="titbtn">
        <el-button type="primary"
                   @click="addDialogModelFn">添加账号</el-button>
      </div>
    </div>
    <div class="list-box cl">
      <div class="list-l fl">
        <el-tree :expand-on-click-node="false"
                 icon-class="comp-arr"
                 :data="computedList"
                 :props="defaultProps"
                 @node-click="handleNodeClick"
                 :default-expanded-keys="expandedComp"
                 node-key="orgId"
                 @node-expand="nodeEexpand"
                 @node-collapse="nodeCollapse"
                 :render-content="renderContent"></el-tree>
      </div>
      <div class="list fl">
        <el-form class="search clearfix"
                 label-position="left">
          <el-form-item>
            <el-input placeholder="请输入账号/姓名"
                      v-model="accountName"></el-input>
          </el-form-item>
          <el-button class="searchbtn"
                     @click.prevent="search">查询</el-button>
        </el-form>
        <el-table :data="tableDatas"
                  style="width: 100%"
                  stripe
                  tooltip-effect="light"
                  v-loading="loadingTabel">
          <el-table-column :resizable="false"
                           width="200"
                           prop="accountNumber"
                           label="账号"
                           show-overflow-tooltip></el-table-column>
          <el-table-column :resizable="false"
                           prop="linkmanName"
                           label="姓名"
                           show-overflow-tooltip></el-table-column>
          <el-table-column :resizable="false"
                           prop="accountNumber"
                           label="账户类型"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.accountType=='01'?'主账号':'子账号'}}</span>
            </template>
          </el-table-column>
          <el-table-column :resizable="false"
                           prop="roleName"
                           label="角色"
                           show-overflow-tooltip></el-table-column>
          <el-table-column :resizable="false"
                           prop="forbid"
                           label="状态"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.forbid=='0'?'启用':'停用'}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column :resizable="false" prop="accountNumber" label="角色"
                                               show-overflow-tooltip>
                                  <template slot-scope="scope">
                                      <span>无</span>
                                  </template>
                    </el-table-column>-->
          <el-table-column :resizable="false"
                           label="操作"
                           width="100">
            <template slot-scope="scope"
                      v-if="scope.row.accountType!='01'">
              <el-button type="text"
                         size="small"
                         @click="edit(scope.$index,scope.row.accountId,scope.row.forbid)">修改
              </el-button>
              <el-button type="text"
                         size="small"
                         @click="del(scope.row.accountId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
    <el-dialog :visible.sync="dialogModel"
               :before-close="dialogClose"
               top="25%"
               class="dialog accountmanagers">
      <div class="dialogTitle">
        <span class="el-dialog__title">{{dialogTitle}}</span>
      </div>
      <div class="dialog-body">
        <el-form :model="formData"
                 :rules="rules"
                 ref="formTab"
                 label-width="76px"
                 label-position="right">
          <el-form-item v-if="dialogType!='delete'"
                        label="部门名称"
                        prop="contactsWay">
            <el-input v-model="editOrgName"
                      ref="inputs"
                      :maxlength="20"
                      placeholder="请填写部门名称"
                      v-if="['add','addSon','edit'].includes(dialogType)"
                      @blur="getUserInfo"></el-input>
          </el-form-item>
          <div class="delete"
               v-if="dialogType=='delete'">
            <i class="icon_delete"></i>
            <p>确定删除部门</p>
            <span>{{editOrgName}}</span>？
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary"
                   @click="submit_Form('formTab')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="addDialogModel"
               :before-close="addDialogClose"
               class="dialog accountmanagers add-account">
      <div class="dialogTitle">
        <span class="el-dialog__title">{{addType=='add'?'添加账号':'修改账号'}}</span>
      </div>
      <div class="dialog-body">
        <el-form :model="addFormData"
                 :rules="rules"
                 ref="addFormTab"
                 label-width="76px"
                 label-position="right">
          <el-form-item label="姓名"
                        prop="linkmanName">
            <el-input v-model="addFormData.linkmanName"
                      :disabled="addType=='edit'"
                      placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号码"
                        prop="linkmanPhone">
            <el-input v-model="addFormData.linkmanPhone"
                      :disabled="addType=='edit'"
                      placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="角色"
                        prop="role">
            <el-select v-model="addFormData.role"
                       placeholder="请选择角色">
              <el-option :label="item.roleName"
                         v-if="item.isSupermanager!='1'"
                         :value="item.id"
                         v-for="item in roleListData"
                         :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门"
                        prop="compName">
            <div class="com-tree-box">
              <div class="com-tree-input"
                   :class="{'active':showAddTreeBox}"
                   @click="showAddTreeBox=!showAddTreeBox">
                <p v-if="!!addFormData.comName">{{addFormData.comName}}</p>
                <p class="none"
                   v-if="!addFormData.comName">请选择所属部门</p>
                <i class="com-tree-input-icon"></i>
              </div>
              <div class="com-tree-content"
                   :class="{'active':showAddTreeBox}">
                <el-tree ref="tree"
                         :expand-on-click-node="false"
                         :default-checked-keys="defaultOrgId"
                         node-key="orgId"
                         icon-class="comp-arr"
                         :data="computedListTree"
                         :props="defaultProps"
                         :check-on-click-node="true"
                         @node-click="addHandleNodeClick"></el-tree>
              </div>
            </div>
            <!--<el-input v-model="addFormData.comName" placeholder="请输入所属部门"></el-input>-->
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="forbid"
                       placeholder="请选择状态"
                       :disabled="addType=='add'">
              <el-option label="启用"
                         value="0"></el-option>
              <el-option label="停用"
                         value="1"></el-option>
            </el-select>
          </el-form-item>
          <div class="tips">
            <p>温馨提示:</p>
            <p>1、企业账户管理，添加个人用户到所属企业账户下；</p>
            <p>2、添加已注册合同平台的用户，只是添加一个企业身份；</p>
            <!--<p>3、添加未注册合同平台的用户，系统会自动注册初始化账号，密码会短信通知；</p>-->
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="addDialogClose">取 消</el-button>
        <el-button type="primary"
                   @click="addAccount">确 定</el-button>
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
        return callback(new Error("请输入手机号码"));
      } else if (!/^1[3-9][0-9]{9}$/.test(value)) {
        return callback(new Error("请输入正确的手机号"));
      }
      callback();
    };
    return {
      enterpriseName: "",
      searchForm: {},
      tableDatas: [],
      total: "",
      currentpage: "",
      mainComp: true,
      comName: "",
      computedList: [],
      computedListTree: [],
      defaultProps: {
        children: "list",
        label: "orgName"
      },
      dialogModel: false,
      addDialogModel: false,
      editOrgName: "",
      editOrgId: "",
      orgId: "",
      editOrgOldName: "",
      OrgNumber: "",
      parentNumber: "",
      dialogType: "",
      dialogTitle: "添加部门",
      addDialogTitle: "添加账号",
      addType: "add",
      index: -1,
      formData: {},
      addFormData: {},
      rules: {
        contactsName: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ],
        linkmanName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 25, message: "姓名不能超过25个字符", trigger: "blur" },
          { validator: this.checkLinkName, trigger: "blur" }
        ],
        linkmanPhone: [{ validator: validateWay, trigger: "blur" }]
        // status: [
        //     {required: true, message: '请选择状态', trigger: 'change'},
        // ],
        // role: [
        //     {required: true, message: '请选择角色', trigger: 'change'},
        // ],
        // compName: [
        //     {required: true, message: '请选择部门', trigger: 'change'},
        // ],
        // contactsWay: [
        //     {validator: validateWay, trigger: "blur"},
        // ]
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
      pageNum: 1,
      pageSize: 10,
      showAddTreeBox: false,
      roleListData: [], //角色列表
      roleChoose: "",
      defaultOrgId: [],
      dialogTips: true,
      expandedComp: [], //默认展开组织
      expandedCompSave: [], //默认展开组织记录
      editFlag: false,
      accountName: "",
      mainOrgId: "",
      forbid: "0"
    };
  },
  created() {
    if (JSON.parse($.cookie("userinfo")).userType == "02") {
      this.$router.replace("/accountmanager");
    } else if (
      JSON.parse($.cookie("userinfo")).realNameAuthenticationFlag != "1"
    ) {
      setTimeout(() => {
        this.$confirm("请先完成企业实名认证后，才可以开启此功能", "提示", {
          confirmButtonText: "去实名",
          cancelButtonText: "知道了",
          type: "warning",
          customClass: "self-icon icon-warning",
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
    if (JSON.parse($.cookie("userinfo")).realNameAuthenticationFlag == "1") {
      this.getComList();
      this.getListData();
      this.getRoleListData();
    }
  },
  methods: {
    getListData() {
      this.loadingTabel = true;

      let data = {
        // roleName: this.roleName,
        // enterpriseId: JSON.parse($.cookie("userinfo")).userId,
        // enterpriseId: 12356
        bizCode: "iyin_contract",
        clientId: "01",
        // "organizationId": "520175608081154048",
        organizationId: JSON.parse($.cookie("userinfo")).enterpriseId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: this.orgId,
        accountName: this.accountName
      };
      if (
        this.computedList.length &&
        this.computedList[0].orgId == this.orgId
      ) {
        data.orgId = "";
      }
      this.getAccountListOfEnterprise(data)
        .then(res => {
          if (this.successCheckCode(res)) {
            this.tableDatas = res.data.list;
            this.total = res.data.totalRows;
            this.currentpage = res.data.pageNum;
          }
          setTimeout(() => {
            this.loadingTabel = false;
          }, 200);
        })
        .fail(res => {
          this.loadingTabel = false;
        });
    },
    addDialogModelFn() {
      this.checkPermission(
        // 权限校验
        this.$perMap.userCenter.acountMgt.addEnterpriseOfAccount.url,
        this.$perMap.userCenter.acountMgt.addEnterpriseOfAccount.method
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.addType = "add";
        this.forbid = "0";
        this.addFormData = {};
        this.addDialogModel = true;
        this.$nextTick(() => {
          this.computedListTree = this.computedList[0].list;
        });
      });
    },
    getComList() {
      let data = {
        enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
        // enterpriseId: "520175608081154048",
      };
      this.findOrgInfoByParentId(data).then(res => {
        if (this.successCheckCode(res)) {
          this.enterpriseName = res.data.orgName;
          let arr = [];
          arr.push(res.data);
          this.computedList = arr;
          this.mainOrgId = arr[0].orgId;
          if (!!this.expandedCompSave.length) {
            this.expandedComp = this.expandedCompSave;
          } else {
            this.expandedComp = [this.mainOrgId];
          }
        }
      });
    },
    submit_Form(ref) {
      this.$refs[ref].validate(valid => {
        if (valid) {
          this.saveForm();
        } else {
          return false;
        }
      });
    },
    addAccount() {
      let data = {
        // userId: JSON.parse($.cookie("userinfo")).userId,
        // linkmanName:this.addFormData.name,
        // phoneNumber:this.addFormData.phone,
        // orgId:this.addFormData.orgId,
        // roleId:this.addFormData.role

        // accountId:'12212',
        // accountId: JSON.parse($.cookie("userinfo")).userId,
        enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
        linkmanName: this.addFormData.linkmanName,
        phoneNumber: this.addFormData.linkmanPhone,
        bizCode: "iyin_contract",
        clientId: "02",
        organizationId: JSON.parse($.cookie("userinfo")).enterpriseId,
        userPower: [
          {
            bizCode: "iyin_contract"
          }
        ]
      };
      let data2 = {
        accountId: this.addFormData.accountId,
        bizCode: "iyin_contract",
        clientId: "02",
        enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
        forbidden: this.forbid
      };

      if (
        !this.addFormData.linkmanName ||
        this.addFormData.linkmanName.trim() == ""
      ) {
        return this.$message.error("请输入姓名");
      }
      if (
        !this.addFormData.linkmanPhone ||
        this.addFormData.linkmanPhone.trim() == ""
      ) {
        return this.$message.error("请输入手机号码");
      }
      if (!this.addFormData.role) {
        return this.$message.error("请选择角色");
      }
      if (!this.addFormData.comName) {
        return this.$message.error("请选择所属部门");
      }

      if (this.addType == "add") {
        this.addEnterpriseOfAccount(
          this.addFormData.orgId,
          this.addFormData.role,
          data
        ).then(res => {
          if (this.successCheckCode(res)) {
            this.$message.success("添加成功！");
            this.addDialogModel = false;
            this.cancelForm("addFormTab");
            this.getListData();
            this.computedListTree = [];
          }
        });
      } else {
        data = {
          enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
          userId: this.addFormData.accountId,
          orgId: this.addFormData.orgId,
          roleId: this.addFormData.role
        };
        this.updateEnterpriseOfAccount(data).then(res => {
          if (this.successCheckCode(res)) {
            this.forbiddenEnterpriseOfAccount(data2).then(res => {
              if (this.successCheckCode(res)) {
                this.$message.success("修改成功！");
                this.addDialogModel = false;
                this.cancelForm("addFormTab");
                this.getListData();
                this.computedListTree = [];
              }
            });
          }
        });
      }
    },
    renderContent(h, { node, data, store }) {
      return (<span class="self-tree-item"><span title={node.label}>{node.label}</span>
        <el-dropdown on-command={this.handleCommand} size="mini" placement="top-end">
          <i class="self-tree-item-more el-dropdown-link" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class={node.label ? "show" : "hide"}
              command={
                {
                  label: node.label,
                  node: node,
                  type: "addSon",
                  typeDsc: "添加子部门",
                  id: data.orgId,
                  parent: data.parentNumber,
                  number: data.orgNumber
                }}
            >
              添加子部门
                </el-dropdown-item>
            <el-dropdown-item command={
              {
                label: node.label,
                node: node,
                type: "add",
                typeDsc: "添加部门",
                id: data.orgId,
                parent: data.parentNumber,
                number: data.orgNumber
              }
            }>添加同级部门
                </el-dropdown-item>
            <el-dropdown-item
              command={
                {
                  label: node.label,
                  node: node,
                  type: "edit",
                  typeDsc: "修改部门",
                  id: data.orgId,
                  parent: data.parentNumber,
                  number: data.orgNumber
                }
              }
            >
              修改部门
                </el-dropdown-item>
            <el-dropdown-item
              command={
                {
                  label: node.label,
                  node: node,
                  type: "delete",
                  typeDsc: "删除部门",
                  id: data.orgId,
                  parent: data.parentNumber,
                  number: data.orgNumber
                }
              }
            >
              删除部门
                </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
      );
    },
    showMore(e) {
      console.log(e);
    },
    handleClick(e) {
      e.stopPropagation();
    },
    // 新增账号部门选择
    addHandleNodeClick(data) {
      console.log(data);
      this.addFormData.comName = data.orgName;
      this.addFormData.orgId = data.orgId;
      this.showAddTreeBox = false;
    },
    handleNodeClick(data) {
      console.log(data);
      this.orgId = data.orgId;
      this.pageNum = 1;
      this.getListData();
    },
    nodeEexpand(data) {
      this.expandedComp.push(data.orgId);
      this.expandedCompSave = this.expandedComp;
    },
    nodeCollapse(data) {
      this.expandedComp = this.expandedComp.filter(item => {
        return item != data.orgId;
      });
      this.expandedCompSave = this.expandedComp;
    },
    handleCommand(n) {
      if (n.type != "addSon" && n.label == this.enterpriseName) {
        this.$message.error("顶级部门不允许此操作！");
        return;
      }

      this.dialogType = n.type;
      this.editOrgName = "";
      this.dialogTitle = n.typeDsc;
      this.dialogModel = true;
      this.editOrgId = n.id;
      this.parentNumber = n.parent;
      this.orgNumber = n.number;
      if (n.type != "add" && n.type != "addSon") {
        this.editOrgName = n.label;
        this.editOrgOldName = n.label;
      }
      if (n.type != "delete") {
        this.$nextTick(() => {
          this.$refs.inputs.$el.querySelector("input").focus();
        });
      }
    },
    add() {
      this.$router.push({ path: "/charactermanageradd" });
    },
    dialogClose() {
      this.cancelForm("formTab");
    },
    addDialogClose() {
      // debugger
      this.computedListTree = [];
      this.addFormData = {};
      this.addDialogModel = false;
      // this.cancelForm("addFormTab")
      this.showAddTreeBox = false;
    },
    saveForm() {
      if (this.editFlag) {
        return this.$message.error("请勿重复提交");
      }
      if (this.dialogType == "edit") {
        //修改
        if (this.editOrgName.trim() == "") {
          this.$message.error("请输入部门名称！");
          return;
        }
        if (this.editOrgOldName == this.editOrgName) {
          this.$message.error("修改名称不能跟原名称相同！");
          return;
        }
        if (this.enterpriseName == this.editOrgName) {
          this.$message.error("修改名称不能跟公司名称相同！");
          return;
        }
        this.editFlag = true;
        this.editOrgInfoByParentId({
          orgName: this.editOrgName,
          id: this.editOrgId,
          // enterpriseId: "1224324",
          enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
        }).then(res => {
          this.editFlag = false;
          if (this.successCheckCode(res)) {
            this.$message.success("修改成功！");
            this.dialogModel = false;
            this.cancelForm("formTab");
            this.getComList();
          }
        });
        return;
      }
      if (this.dialogType == "addSon" || this.dialogType == "add") {
        //添加子部门
        if (this.editOrgName.trim() == "") {
          this.$message.error("请输入部门名称！");
          return;
        }
        if (this.enterpriseName == this.editOrgName) {
          this.$message.error("修改名称不能跟公司名称相同！");
          return;
        }

        let parentNumber =
          this.dialogType == "add" ? this.parentNumber : this.orgNumber;
        this.editFlag = true;
        this.addOrgInfoByParentId({
          orgName: this.editOrgName,
          parentNumber: parentNumber,
          // enterpriseId: "1224324",
          enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
        }).then(res => {
          if (this.dialogType == "addSon") {
            //新增子部门，记录点击orgid
            this.expandedComp.push(this.editOrgId);
            this.expandedCompSave = this.expandedComp;
          }

          this.editFlag = false;
          if (this.successCheckCode(res)) {
            this.$message.success("添加成功");
            this.dialogModel = false;
            this.cancelForm("formTab");
            this.getComList();
          }
        });
        return;
      }

      if (this.dialogType == "delete") {
        //删除
        this.editFlag = true;
        this.deleteOrgInfoByParentId({
          id: this.editOrgId
        }).then(res => {
          this.editFlag = false;
          if (this.successCheckCode(res)) {
            this.$message.success("删除成功！");
            this.dialogModel = false;
            this.cancelForm("formTab");
            this.getComList();
          }
        });
        return;
      }
      return;
      /*let data = {
                    "accountId": JSON.parse($.cookie("userinfo")).userId,
                    "bizCode": "iyin_contract",
                    "clientId": "02",
                    "organizationId": JSON.parse($.cookie("userinfo")).userId,
                    "userPower": [
                        {
                            "bizCode": "iyin_contract"
                        }
                    ]
                }
                this.addEnterpriseOfAccount(data).then(res=>{
                    if (this.successCheckCode(res)) {
                        this.$message.success("新增成功！");
                        this.addDialogModel = false
                        this.cancelForm("addFormTab")
                        this.getComList()
                    }
                })*/
    },
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogModel = false;
      this.addDialogModel = false;
      this.formData = {};
      this.isShow = false;
      this.userInfo = "";
    },
    edit(index, id, forbid) {
      this.checkPermission(
        // 权限校验
        this.$perMap.userCenter.acountMgt.updateEnterpriseOfAccount.url,
        this.$perMap.userCenter.acountMgt.updateEnterpriseOfAccount.method
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.addDialogModel = true;
        // this.index = index
        this.addType = "edit";
        this.dialogTitle = "修改联系人";
        this.forbid = forbid + "";
        this.addFormData = this.tableDatas[index];
        let data = {
          userId: id,
          enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
        };
        this.$nextTick(() => {
          this.computedListTree = this.computedList[0].list;
        });
        this.findEnterpriseOfAccount(data).then(res => {
          if (this.successCheckCode(res)) {
            this.$set(this.addFormData, "role", res.data.roleId);
            this.defaultOrgId = [res.data.orgId];
            // orgId: "547835025006002175"

            // let findOrgName = function (obj,id) {
            //     debugger
            //     if(!obj.orgId){
            //         return '';
            //     }
            //     if(obj.orgId==id){
            //         return obj.orgName;
            //     }
            //     obj.list.map(item=>{
            //         findOrgName(item,id)
            //     })
            // }
            // function getCurrentPart(id, items) {
            //     debugger
            //     let result;
            //     for (var i in items) {
            //         let item = items[i];
            //         if (item.orgId == id) {
            //             result = item.orgName;
            //             break;
            //         } else if (item.list) {
            //             result = getCurrentPart(id, item.list);
            //         }
            //     }
            //     return result;
            // }

            let result;

            function getCurrentPart(id, data) {
              for (var i in data) {
                if (data[i].orgId == id) {
                  result = data[i].orgName;
                  break;
                } else {
                  getCurrentPart(id, data[i].list);
                }
              }
            }

            getCurrentPart(res.data.orgId, this.computedList);
            console.log(result);
            // debugger
            this.addFormData.comName = result;
          }
        });
      });
      // this.formData = JSON.parse(JSON.stringify(this.tableData[index]))
    },
    findComName(id, items) {
      function getCurrentPart(id, items) {
        let result;
        for (var i in items) {
          let item = items[i];
          if (item.id == id) {
            result = item.children;
            break;
          } else if (item.children) {
            result = getCurrentPart(id, item.children);
          }
        }
        return result;
      }
    },
    del(val) {
      this.checkPermission(
        // 权限校验
        this.$perMap.userCenter.acountMgt.deleteEnterpriseOfAccount.url,
        this.$perMap.userCenter.acountMgt.deleteEnterpriseOfAccount.method
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.$confirm("您确认要删除当前账号？", "删除账号", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "self-icon icon-delete",
        })
          .then(() => {
            let data = {
              accountId: val,
              bizCode: "iyin_contract",
              clientId: "02",
              organizationId: JSON.parse($.cookie("userinfo")).enterpriseId
            };
            this.deleteEnterpriseOfAccount(data).then(res => {
              if (this.successCheckCode(res)) {
                this.$message({
                  type: "success",
                  message: "删除账号成功"
                });
                this.getListData();
              }
            });
          })
          .catch(() => {
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
    },
    getRoleListData() {
      this.getUserRoleList(1, 100, {
        roleName: "",
        enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
      }).then(res => {
        if (this.successCheckCode(res)) {
          this.roleListData = res.data.records;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.accountmanagers {
  .top-title {
    margin-bottom: 0;
  }

  .tips {
    p {
      color: #999;
      line-height: 30px;
      font-size: 12px;

      &:first-of-type {
        color: #333;
        font-size: 14px;
      }
    }
  }

  &.add-account {
    .el-select {
      width: 100%;
    }
  }

  .com-tree-box {
    position: relative;
    /*border: 1px solid #eee;*/
    /*border-radius: 4px;*/
    /*&:hover{*/
    /*border-color: #bbb;*/
    /*}*/
    .com-tree-input {
      height: 36px;
      line-height: 36px;
      cursor: pointer;
      border: 1px solid #eee;
      border-radius: 4px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      padding-left: 10px;

      i {
        position: absolute;
        width: 12px;
        height: 7px;
        right: 10px;
        top: 15px;
        background-image: url("../../../../static/image/arrow.png");
        background-size: 100%;
        background-repeat: no-repeat;
        transition: all 0.3s;
        transform-origin: center center;
      }

      &.active i {
        transform: rotate(180deg);
      }

      p.none {
        color: #97a9be;
      }
    }

    .com-tree-content {
      position: absolute;
      top: 40px;
      left: 0;
      width: 100%;
      border: 1px solid transparent;
      z-index: 9999;
      background-color: #fff;
      /*min-height: 90px;*/
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      height: 0;
      overflow-y: scroll;
      transition: height 0.3s;
      /*overflow: hidden;*/
      &.active {
        height: 200px;
        border-color: #eee;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      }
    }
  }
}
</style>
<style lang="scss">
/*自定义tree样式*/
.accountmanagers {
  .el-tree {
    border: none;
  }

  .el-tree-node__expand-icon {
    /*zoom: .9;*/
    border-left-color: #ccc;

    &.is-leaf {
      border-color: transparent;
      cursor: default;
    }
  }

  .el-tree-node__content {
    position: relative;

    .el-dropdown {
      position: absolute;
      right: 8px;
      top: 12px;
      width: 18px;
      height: 18px;
      box-sizing: content-box;
      padding: 2px;
    }

    .self-tree-item {
      width: 100%;
      display: inline-block;

      span {
        display: inline-block;
        width: calc(100% - 50px);
        height: 19px;
        line-height: 19px;
        font-size: 14px;
        color: #626262;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
    }

    i.self-tree-item-more {
      position: absolute;
      right: 0;
      top: 0;
      width: 18px;
      height: 18px;
      opacity: 0;
      background-image: url("../../../../static/image/more.svg");
      background-size: 18px;
      background-repeat: no-repeat;
      box-sizing: content-box;
      padding: 2px;

      &:hover {
        background-image: url("../../../../static/image/more_active.svg");
      }
    }
  }

  .el-tree-node__content:hover {
    i.self-tree-item-more {
      opacity: 1;
    }
  }

  .el-tree-node.is-current {
    > .el-tree-node__content {
      span {
        color: #02adff;
      }
    }
  }

  .el-tree-node__content:hover {
    color: #02adff;
    background-color: #fff;
  }

  .com-tree-box {
    .el-tree-node.is-current {
      > .el-tree-node__content {
        background-color: #02adff;
        color: #fff;
        position: relative;

        span {
          color: #333;
        }

        .el-tree-node__label {
          color: #fff;
        }

        &:after {
          content: "\2714";
          position: absolute;
          right: 10px;
          top: 0;
          width: 10px;
          height: 10px;
        }
      }
    }

    .el-tree-node__content {
      background-color: #fff;
      color: #999;

      &:hover {
        background-color: #f3fafd;
      }
    }
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

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

.accountmanagers {
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

  .list-box {
    .list-l {
      width: 200px;
      padding-top: 30px;
      min-height: 718px;
      border-right: 1px solid #e8ecef;

      .more-box {
        position: fixed;
        top: 20px;
        right: 0;
        width: 140px;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        background-color: #fff;
        border: 1px solid #000;
        color: #626262;
        font-size: 14px;

        &::after {
          content: "";
          position: absolute;
          width: 0px;
          height: 0px;
          border: 14px solid #000;
          border-top-color: #fff;
          border-right-color: #fff;
          border-left-color: #fff;
          top: -28px;
          right: 0;
        }

        &::before {
          content: "";
          position: absolute;
          width: 0px;
          height: 0px;
          border: 14px solid #fff;
          border-top-color: #fff;
          border-right-color: #fff;
          border-left-color: #fff;
          top: -28px;
          right: 0;
          z-index: 1;
        }
      }
    }

    .list {
      width: 730px;
      padding-left: 20px;

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
          /*float: left;*/
          /*width: 80px;
                        border-color: #00afff;

                        span {
                          color: #00afff;
                        }

                        &:hover {
                          !*border-color: #00afff;*!
                          !*background-color: #fff;*!
                        }*/
        }
      }

      .el-table {
        table thead th .cell {
          font-size: 14px;
        }
      }
    }
  }

  .dialog.accountmanagers {
    .el-form {
      padding: 10px 70px 20px 20px;

      .el-form-item {
        .el-form-item__label {
          padding-right: 16px;
        }
      }

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

    .el-dialog__footer {
      padding: 0 0 30px;
    }

    .delete {
      text-align: left;
      position: relative;
      font-size: 16px;
      color: #333;
      height: 40px;
      line-height: 40px;
      padding-left: 40px;
      /*margin-top: 10px;*/

      i {
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        height: 40px;
        width: 40px;
        background-image: url("../../../../static/image/icon_delete.svg");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      p {
        display: inline-block;
        padding-left: 10px;
        font-size: 16px;
      }

      span {
        color: #d0021b;
        font-size: 16px;
      }
    }

    .el-form-item.is-required .el-form-item__label:before {
      display: none;
    }

    .el-button {
      width: 80px;
    }

    .el-button + .el-button {
      margin-left: 16px;
    }

    .dialog-body {
      padding-top: 40px;
    }

    &.add-account .dialog-body {
      padding-top: 20px;
    }
  }
}
</style>
