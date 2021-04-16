<template>
  <div class="set-sign-process">
    <h2 class="top_title">
      <i></i>填写签署信息
    </h2>
    <div class="sign-header">签署方式</div>
    <p class="sign-way">{{resource[signWay]}}</p>
    <!-- 签署列表 -->
    <div class="sign-list">
      <div class="sign-header">签署人信息</div>
      <!-- 未认证 -->
      <el-checkbox class="no-auth"
                   v-model="auth"
                   :true-label="1"
                   :false-label="0"
                   @change="changeIfAuthSign">允许未认证用户签署</el-checkbox>
      <!-- 顺序签署 -->
      <div class="sign-body"
           v-if="signWay==='02'">
        <draggable :list="templateSignatories" @start="dragging = true" @end="dragging = false">
            <div class="sign-tr"
                v-for="(item, index) in templateSignatories"
                :key="index">
            <div class="drag-icon"></div>
            <div class="index">
                <div class="index-inner">{{index+1}}</div>
            </div>
            <el-input placeholder="请输入角色名称"
                        disabled
                        v-model="item.name"
                        class="name"></el-input>
            <div class="is-sign">
                <el-select v-model="item.sign"
                        disabled
                        popper-class="is-sign-select">
                <el-option label="需签署"
                            :value="1"></el-option>
                <el-option label="仅抄送"
                            :value="0"></el-option>
                </el-select>
                <el-tooltip class="item"
                            effect="dark"
                            content="设置签署人不同的业务操作类型"
                            placement="top">
                <img src="../../../../../static/image/gantanhao.svg"
                    alt />
                </el-tooltip>
            </div>
            <div class="role-set">
                <span>{{item.assignation?'指定用户':''}}</span>
                <el-input placeholder="请输入手机号/邮箱"
                        v-model="item.signContact"
                        :disabled="!!item.assignation"
                        @blur="getUser(item)"
                        class="phone"></el-input>
                <el-select v-model="item.signatoryId"
                        placeholder="请选择"
                        v-if="item.infoList&&item.infoList.length"
                        @change="selectMan(item)"
                        :disabled="!!item.assignation">
                <el-option v-for="(option,i) in item.infoList"
                            :key="i"
                            :label="option.idName"
                            :value="option.id"></el-option>
                </el-select>
                <el-input placeholder="请输入姓名"
                        v-model="item.signName"
                        :disabled="!!item.assignation"
                        v-else></el-input>
            </div>
            <div class="link-man"
                v-show="!item.assignation"
                @click="addLinkMan(item)"
                title="从联系人添加"></div>
            </div>
        </draggable>
      </div>
      <!-- 非顺序签署 -->
      <div class="sign-body"
           v-else>
        <div class="sign-tr"
             v-for="(item, index) in templateSignatories"
             :key="index">
          <div class="drag-icon no-icon"></div>
          <div class="index"></div>
          <el-input placeholder="请输入角色名称"
                    disabled
                    v-model="item.name"
                    class="name"></el-input>
          <div class="is-sign">
            <el-select v-model="item.sign"
                       disabled
                       popper-class="is-sign-select">
              <el-option label="需签署"
                         :value="1"></el-option>
              <el-option label="仅抄送"
                         :value="0"></el-option>
            </el-select>
            <el-tooltip class="item"
                        effect="dark"
                        content="设置签署人不同的业务操作类型"
                        placement="top">
              <img src="../../../../../static/image/gantanhao.svg"
                   alt />
            </el-tooltip>
          </div>
          <div class="role-set">
            <span>{{item.assignation?'指定用户':''}}</span>
            <el-input placeholder="请输入手机号/邮箱"
                      v-model="item.signContact"
                      :disabled="!!item.assignation || (signWay==='03'&&index===0)"
                      @blur="getUser(item)"
                      class="phone"></el-input>
            <el-select v-model="item.signatoryId"
                       placeholder="请选择"
                       v-if="item.infoList&&item.infoList.length"
                       @change="selectMan(item)"
                       :disabled="!!item.assignation || (signWay==='03'&&index===0)">
              <el-option v-for="(option,i) in item.infoList"
                         :key="i"
                         :label="option.idName"
                         :value="option.id"></el-option>
            </el-select>
            <el-input placeholder="请输入姓名"
                      v-model="item.signName"
                      :disabled="!!item.assignation || (signWay==='03'&&index===0)"
                      v-else></el-input>
          </div>
          <div class="link-man"
               v-show="!(item.assignation || (signWay==='03'&&index===0))"
               @click="addLinkMan(item)"
               title="从联系人添加"></div>
          <span class="del-btn"
                v-if="signWay==='03' && index>0 &&templateSignatories.length>2"
                @click="delRole(index)">删除</span>
        </div>
      </div>
      <div class="add-btn"
           @click="addRole"
           v-show="signWay==='03'">
        <img src="../../../../../static/image/tianjia.svg"
             alt /> 添加角色
      </div>
    </div>
    <div class="sign-header">付费模式</div>
    <div class="pay-options">
      <el-radio-group v-model="paymentMethod" @change="getAllowPayUserId">
        <el-radio label="01">全部自己付：我来承担此次文件的签署费用（发起成功后，将从您的账户中扣除签署份数）</el-radio>
        <br />
        <!-- <el-radio label="02">各自付：由文件签署人各自承担签署费用（此次签署将从您的账户中扣除对应的签署次数）</el-radio> -->
        <br />
        <el-radio label="03"
                  v-if="signWay!=='03'">指定用户付：</el-radio>
        <el-select v-model="payman"
                   :disabled="paymentMethod!=='03'"
                   v-if="signWay!=='03'">
          <el-option v-for="item in compTemplateSignatories"
                     :key="item.name"
                     :label="item.signName + '-' + item.signContact"
                     :value="item.name"></el-option>
        </el-select>{{templateSignatories}}
        <span style="font-size: 14px;margin-left: 10px;"
              v-if="signWay != '03'">（选择指定签署人作为支付费用方）</span>{{payman}}
      </el-radio-group>
    </div>
    <div class="sure_bottom">
      <el-button @click="saveDraft">取消</el-button>
      <el-button type="primary"
                 @click="next">下一步</el-button>
    </div>

    <!--从联系人添加弹窗-->
    <el-dialog title="从联系人添加"
               :visible.sync="dialogVisible"
               size="tiny"
               :before-close="handleClose"
               custom-class="contact-dialog">
      <div class="table-header tr">
        <span class="name">姓名/企业名称</span>
        <span class="phone">手机号码/邮箱</span>
        <span class="auth">是否实名认证</span>
      </div>
      <div class="table-body"
           v-if="contactData.length">
        <div class="tr"
             v-for="(item, index) in contactData"
             :key="index"
             @click="selectContact(item)">
          <div class="name">
            <el-tooltip effect="light"
                        :content="item.contactsName"
                        placement="top">
              <span>{{item.contactsName}}</span>
            </el-tooltip>
          </div>
          <span class="phone">{{item.contactsWay}}</span>
          <span class="auth"
                :class="{red:item.realNameAuthenticationFlag===0}">{{item.realNameAuthenticationFlag===0?'未认证':'已认证'}}</span>
        </div>
      </div>
      <div class="table-body no-data"
           v-else>暂无数据</div>
      <!-- 分页 -->
      <div class="pagination"
           v-show="total > 10">
        <el-pagination :page-size="pageSize"
                       :page-sizes="[10, 20, 30, 50]"
                       :current-page="currentPage"
                       :total="total"
                       @size-change="sizeChange"
                       @current-change="currentChange"
                       layout="total,sizes,prev, pager, next,jumper"
                       hide-on-single-page></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import base from '../../mixin/base';
import { isPhoneNum, isEmail } from '../../../../utils';
import draggable from "vuedraggable";

export default {
  mixins: [base],
  components: {draggable},
  data() {
    return {
      signWay: '01',
      userId: JSON.parse($.cookie('userinfo')).userId,
      resource: {
        '01': '无序签署：签署顺序不受限制；',
        '02': '顺序签署：按签署顺序一人签署完再到下一环节人签署，即 A-B-C-D；',
        '03': '每人单独签署：发起方单独发送每个收件人签署，即A-B，A-C，A-D；'
      },
      templateSignatories: [],
      token: sessionStorage.getItem('token'),
      auth: 0,
      dialogVisible: false,
      compactId: '',
      paymentMethod: '01',
      payman: '',
      editRow: '',
      contactData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isGetUser: false, // 正在获取用户
      userIdList: [],  // 用户id列表
      allowUserIdList:[] // 允许指定用户支付的 id
    };
  },
  filters: {},
  watch: {},
  computed: {
    compTemplateSignatories() {
      if (this.templateSignatories.length) {
        return this.templateSignatories.filter(ele => {
          /* return (ele.sign == 1 &&
            ele.signContact) ||
            ele.signatoryId == JSON.parse($.cookie('userinfo')).enterpriseId */
            for(let i=0; i<this.allowUserIdList.length;i++){
              if(ele.currentUserId == this.allowUserIdList[i]){
                // console.log(true,ele.currUserId,this.allowUserIdList[i]);
                return true;
              }else{
                // console.log(false,ele.currUserId,this.allowUserIdList[i]);
              continue;
             }
            }
        });
      }
      // if (this.templateSignatories.length) {
      // //  console.log(this.allowUserIdList);
      //   return this.templateSignatories.filter((ele, index) => {
      //     for(let i=0; i<this.allowUserIdList.length;i++){
      //       if(ele.currUserId == this.allowUserIdList[i] || ele.userId == this.allowUserIdList){
      //         // console.log(true,ele.currUserId,this.allowUserIdList[i]);
      //         return true;
      //       }else{
      //         // console.log(false,ele.currUserId,this.allowUserIdList[i]);
      //         continue;
      //       }
      //     }
      //   })
      // }
    }
  },
  async created() {
    this.compactId = this.$route.query.id;
    // 签署人信息
    let res = await this.compactTempDetail(this.compactId);
    if (!this.successCheckCode(res)) {
      return;
    }
    this.signWay = res.data.signWay;
    this.templateSignatories = res.data.templateSignatories;
    this.templateSignatories.forEach((v, i) => {
      this.$set(v, 'infoList', v.ones);
      if((v.infoList && v.infoList[0]) || (v.ones && v.ones[0])){
         this.$set(v,'currentUserId',v.infoList[0].userId ||v.ones[0].userId)
      }
      if (this.signWay === '03' && i === 0) {
        v.signContact = this.userinfo.loginName;
        v.signName = this.userinfo.enterPriseName;
        v.signatoryId = this.userinfo.enterpriseId;
      }
    });
    // 获取签署人姓名和手机
    this.editCompactSec(this.compactId).then((res) => {
      if (this.successCheckCode(res)) {
        this.auth = res.data.isAuthentication || 0;
        this.paymentMethod = res.data.paymentMethod || '01';
        let list = res.data.signatoryList;
        if (list.length) {
          let arr;
          arr = list.map((v, i) => {
            if (i > 1 && this.signWay === '03' && list.length > this.templateSignatories.length) {
              // 当签署人比角色多时，给每人单独签署增加签署人（只会出现在单独签署）
              i = 1;
            }
            // 深拷贝，解决数组里对象的异步更新问题
            let obj = JSON.parse(JSON.stringify(this.templateSignatories[i]));
            return Object.assign(obj, {
              signName: v.operatorName,
              signContact: v.operatorContact,
              signatoryId: v.identityNum
            });
          });
          this.templateSignatories = arr;
          this.templateSignatories.forEach((v) => {
            if (v.assignation === 0 && v.signContact) {
              this.isGetUser = true;
              this.getUserAllId(v.signContact).then((res) => {
                if (this.successCheckCode(res)) {
                  v.infoList = res.data.identityOnes;
                  this.isGetUser = false;
                }
              });
            }
          });
        }
      }
    });
  },
  methods: {
    saveDraft() {
      this.$router.push('/contractlist');
    },
    async next() {
      if (this.isGetUser) {
        return this.$message.warning('用户信息输入有误');
      }
      for (const item of this.templateSignatories) {
        if (!item.signName) {
          return this.$message.warning('姓名不能为空');
        }
        if (!item.signContact) {
          return this.$message.warning('手机/邮箱不能为空');
        }
        if (!isPhoneNum(item.signContact.trim()) && !isEmail(item.signContact.trim())) {
          return this.$message.warning('手机/邮箱格式不正确');
        }
      }
      // let firstSignatory = this.templateSignatories.find((v) => v.sign === 1);
      let firstSignatory = this.templateSignatories.find((v) => v.sign === 1 && v.signatoryId == this.userinfo.enterpriseId);
      console.log(firstSignatory);
      if (firstSignatory &&
        !this.auth &&
        this.userinfo.realNameAuthenticationFlag === 0 &&
        firstSignatory.signatoryId === this.userinfo.enterpriseId
      ) {
        return this.$confirm('为保证安全和减少法律风险，您需实名认证后再进行签署。', '风险提示', {
          type: 'warning',
          confirmButtonText: '去实名认证',
          cancelButtonText: '取消',
          customClass: 'self-icon icon-safe'
        })
          .then(() => {

            let type =
              $.cookie("userinfo") &&
              JSON.parse($.cookie("userinfo")).userType;

            if (type == "01") {
              this.$router.push("/companyauthen");
            } else {
              this.$router.push("/personauthen");
            }

          })
          .catch(() => { });
      }

      // 检查手机号/邮箱是否重复
      let phoneList = this.templateSignatories.map((v) => v.signContact);
      if (phoneList.length !== [...new Set(phoneList)].length) {
        return this.$message.warning('同一个签署人不能出现多次');
      }

      // 付款方式
      let designatedName, designatedPeople;
      if (this.paymentMethod === '03') {
        if (!this.payman) {
          return this.$message.warning('请选择指定支付的用户');
        } else {
          let payman = this.templateSignatories.find((v) => v.name === this.payman);
          designatedName = payman.signName;
          designatedPeople = payman.signContact;
          if (payman.infoList.length > 1) {
            payman.infoList.forEach(ele => {
              ele.idName == designatedName ? designatedPeople = ele.accountNumber : '';
            })
          }
        }
      }
      let operatorInfoList = this.templateSignatories.map((v, i) => {
        return {
          fillIn: v.fillIn,
          handleMethod: v.sign === 1 ? '01' : '02',
          operatorContact: v.signContact,
          operatorName: v.signName,
          serialNumber: i + 1,
          signUser: v.name,
          identityNum: v.signatoryId,
          identityList: v.infoList
        };
      });
      // 是否是第一签署人
      let isSponsorSeal = '0';
      // (operatorInfoList.find((v) => v.handleMethod === '01').identityNum === this.userinfo.enterpriseId &&
      //     this.signWay === '01') ||
      // (operatorInfoList.find((v) => v.handleMethod === '01' && v.identityNum === this.userinfo.enterpriseId) &&
      //     this.signWay === '01')
      //     ? '1'
      //     : '0';
      // 是否需要我签署
      let myOperate = operatorInfoList.find((v) => v.identityNum === this.userinfo.enterpriseId && v.handleMethod === '01');
      let signatoryWay = myOperate ? '01' : '02';
      this.contractSignNext({
        designatedName,
        designatedPeople,
        compactId: this.compactId,
        isAuthentication: this.auth, // 允许未认证用户签署（0：未允许未认证用户签署；1：允许未认证用户签署）
        operatorInfoList,
        signWay: this.signWay,
        compactSponsorId: this.userId,
        paymentMethod: this.paymentMethod, // 付费模式（01：全部自己付；02：各自付；03：指定人付；）
        isSiteSign: 0, // 指定位置签署（0：未指定位置签署；1：指定位置签署；）
        isSponsorSeal, // 是否是第一签署人 0：否； 1:是
        signatoryWay // 签署人方式（01：我需要签署；02：需要其他人签署；）
      }).then((res) => {
        console.log(res);
        if (this.successCheckCode(res)) {
          this.$router.push(`/fillTemplate?id=${this.compactId}`);
        }
      });
    },
    addLinkMan(item) {
      this.editRow = item;
      this.dialogVisible = true;
      this.getContact();
    },
    getContact() {
      this.userList(this.currentPage, this.pageSize).then((res) => {
        if (this.successCheckCode(res)) {
          this.total = res.data.total;
          this.contactData = res.data.records;
        }
      });
    },
    handleClose(done) {
      done();
    },
    selectContact(item) {
      this.editRow.signContact = item.contactsWay;
      this.editRow.signName = item.contactsName;
      this.getUser(this.editRow, true);
      this.dialogVisible = false;
    },
    /**
     * 查询用户
     * @param {Boolean} isContact 是否是从联系人添加
     */
    getUser(item, isContact = false) {
      console.log(item);
      this.isGetUser = true;
      this.getUserAllId(item.signContact || null).then((res) => {
        if (this.successCheckCode(res)) {
          item.infoList = res.data.identityOnes;
          item.currentUserId = res.data.identityOnes[0]? res.data.identityOnes[0].userId : '';
          if (res.data.identityOnes.length) {
            item.signatoryId = res.data.identityOnes[0].id;
            item.signName = res.data.identityOnes[0].idName;
          } else if (!isContact) {
            item.signatoryId = '';
            item.signName = '';
          }
          this.isGetUser = false;
          this.getAllowPayUserId();
        }
      });
    },
    selectMan(item) {
      item.signName = item.infoList.find((v) => v.id === item.signatoryId).idName;
    },
    // 添加角色
    addRole() {
      if (this.templateSignatories.length === 10) {
        return this.$message.warning('最多只能添加10个角色');
      }
      this.templateSignatories.push({
        name: '签署方',
        fillIn: 0,
        sign: 1,
        assignation: 0,
        signContact: '',
        signName: '',
        signatoryId: '',
        infoList: []
      });
    },
    delRole(index) {
      this.templateSignatories.splice(index, 1);
    },
    currentChange(val) {
      this.currentPage = val;
      this.getContact();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getContact();
    },
    //是否允许为认真用户签署
    changeIfAuthSign() {
      if (this.auth === 1) {
        this.$confirm("您确定允许未实名认证的签署人签署此份合同？如允许此份电子合同将不具备法律效力，仅为演示体验签署", "风险提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "icon-safe self-icon",
        })
          .then(() => {
            this.auth = 1;
          })
          .catch(() => {
            this.auth = 0;
          });
      }
    },
    // 获取指定用户签
    getAllowPayUserId(val){
      if(val == '01'){
        return;
      }
      this.userIdList.length = 0;
      // console.log(this.templateSignatories);
      for(let item of this.templateSignatories){
        if(item.infoList && item.infoList.length){
          this.userIdList.push(item.infoList[0].userId);
          // console.log(this.userIdList);
        }
      }
      if(this.userIdList.length){
        this.filterEligibleUs({userIdList:this.userIdList}).then(res => {
        if(res.code == 0){
          this.allowUserIdList = res.data.userIdList;
          // console.log(this.allowUserIdList);
          }
        })
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/contractsign' && !to.query.type) {
      next(`/contractsign?id=${this.compactId}&isTemp=1&type=01`);
    } else {
      next();
    }
  }
};
</script>
<style lang="scss">
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-scrollbar__wrap {
  height: 100%;
}
.set-sign-process {
  .el-dialog.contact-dialog {
    width: 660px;
    border-radius: 10px;
    .el-dialog__header {
      background-color: #e2e2e2;
      line-height: 50px;
      padding: 0 20px;
      border-radius: 10px 10px 0 0;
      font-weight: normal;
      .el-dialog__headerbtn {
        margin-top: 18px;
      }
      .el-dialog__title {
        font-weight: normal;
      }
    }
    .el-dialog__body {
      padding: 20px 30px 30px;
      height: 600px;
      display: flex;
      flex-direction: column;
      .table-header {
        background-color: #c9e5f8;
        font-size: 16px;
        border-radius: 4px 4px 0 0;
      }
      .tr {
        height: 50px;
        line-height: 50px;
        padding-left: 30px;
        color: #333;
        display: flex;
        cursor: pointer;
        .name {
          width: 300px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .phone {
          width: 140px;
        }
        .auth {
          width: 110px;
          text-align: center;
          &.red {
            color: #cb3b3b;
          }
        }
      }
      .table-body {
        flex: 1;
        overflow-y: auto;
        .tr:nth-of-type(2n) {
          background-color: #f3fafd;
        }
        .tr:hover {
          background-color: #fff5d2;
          box-shadow: 2px 2px 4px 0 rgba(147, 184, 221, 0.5);
        }
        &.no-data {
          line-height: 50px;
          text-align: center;
          color: #999;
        }
      }
    }
  }
  .el-input.is-disabled {
    .el-input__inner {
      background-color: #f6f9fe;
      color: #c0ccda;
    }
  }
}
</style>
<style scoped lang="scss">
.set-sign-process {
  background-color: #fff;
  padding: 0 30px 30px;
  .pay-options {
    padding-left: 90px;
    .el-radio {
      line-height: 40px;
      margin: 0;
    }
    .el-select {
      width: 300px;
    }
  }
  .top_title {
    border-color: #eee;
    font-size: 16px;
  }
  .sign-header {
    line-height: 50px;
    color: #999;
  }
  .sign-way {
    padding-left: 90px;
  }
  .sign-list {
    width: 100%;
    .no-auth {
      padding-left: 90px;
      margin-bottom: 20px;
    }
    .sign-body {
      .sign-tr {
        height: 50px;
        background-color: #dee6f9;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding-left: 20px;
        &:hover {
          background-color: #fcf0d2;
          .drag-icon {
            background: url("../../../../../static/image/hengxian_hover.svg")
              no-repeat center;
          }
        }
        .el-input {
          width: 220px;
        }
        .drag-icon {
          width: 21px;
          height: 10px;
          background: url("../../../../../static/image/hengxian.svg") no-repeat
            center;
          cursor: move;
          &.no-icon {
            cursor: auto;
            background: none;
          }
        }
        .index {
          width: 44px;
          display: flex;
          justify-content: center;
          .index-inner {
            width: 20px;
            height: 20px;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #c0ccda;
            text-align: center;
            color: #999;
          }
        }
        .name {
          margin-right: 30px;
          &.el-input {
            width: 300px;
          }
        }
        .write {
          display: flex;
          align-items: center;
          margin-right: 30px;
          img {
            margin-left: 4px;
            cursor: pointer;
          }
        }
        .is-sign {
          margin-right: 30px;
          display: flex;
          align-items: center;
          img {
            margin-left: 6px;
            cursor: pointer;
          }
          .el-select {
            width: 92px;
          }
        }
        .role-set {
          width: 500px;
          display: flex;
          align-items: center;
          > span {
            width: 56px;
            margin-right: 16px;
          }
          .el-input {
            margin-right: 10px;
          }
          .phone {
            width: 170px;
          }
          .el-select {
            width: 220px;
          }
        }
        .link-man {
          width: 20px;
          height: 20px;
          background: url("../../../../../static/image/lianxiren1.svg")
            no-repeat center;
          background-size: contain;
          cursor: pointer;
          margin-right: 15px;
          &:hover {
            background: url("../../../../../static/image/lianxiren2.svg")
              no-repeat center;
            background-size: contain;
          }
        }
        .del-btn {
          color: #999;
          cursor: pointer;
          &:hover {
            color: #02adff;
          }
        }
      }
    }
    .add-btn {
      width: 100%;
      text-align: center;
      font-size: 16px;
      line-height: 45px;
      border: 1px dashed #ccc;
      background-color: #fafafa;
      border-radius: 8px;
      cursor: pointer;
      color: #02adff;
      &:hover {
        border-color: #02adff;
        background-color: #fff;
      }
      img {
        vertical-align: middle;
      }
    }
  }
}
</style>
