<template>
  <div class="contractprocess">
    <h2 class="top_title"><i></i>填写签署信息</h2>
    <div class="object">
      <p class="title">签署对象</p>
      <div class="box clearfix">
        <div class="list"
             @click="signType('01')"
             :class="{ activeType: formData.signatoryWay == '01' }">
          <p>我需要签署</p>
          <p>（需自己或他人签署）</p>
          <label class="label">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
        </div>
        <div class="list"
             @click="signType('02')"
             :class="{ activeType: formData.signatoryWay == '02' }">
          <p>需要其他人签署</p>
          <p>（自己不需要签署，仅对方签署）</p>
          <label class="label">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
        </div>
      </div>
    </div>
    <div class="way">
      <p class="title">签署方式</p>
      <div class="box">
        <el-radio-group v-model="formData.signWay">
          <el-radio class="radio"
                    :label="item.value"
                    :key="item.value"
                    v-for="(item, index) in resource">{{ item.label }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="info">
      <p class="title">签署人信息</p>
      <div class="box">
        <el-checkbox v-model="formData.isSiteSign"
                     class="checkbox"
                     label="指定位置签署"></el-checkbox>
        <el-checkbox v-model="formData.isAuthentication"
                     class="checkbox"
                     label="允许未认证用户签署"
                     @change="changeIfAuthSign"></el-checkbox>
      </div>
      <ul class="singlist" v-if="formData.signWay == '02'">
        <draggable :list="infoList" @start="dragging = true" @end="dragging = false">
            <li v-for="(info, index) in infoList"
                :key="index">
            <el-row :gutter="20">
                <el-col :span="4"
                        align="right"
                        style="padding-right: 30px; width: 180px;">
                <span class="move"></span>
                <span class="index">{{ index + 1 }}</span>
                </el-col>
                <el-col :span="6">
                <el-input v-model="info.operatorContact"
                            @blur="userAllId(index)"
                            placeholder="手机号/邮箱"
                            :disabled="index == 0 || moveDisabled"></el-input>
                </el-col>
                <el-col :span="6"
                        v-if="
                                    info.identityList &&
                                    info.identityList.length > 0
                                ">
                <el-select v-model="info.identityNum"
                            :disabled="index == 0 || moveDisabled"
                            placeholder="请选择">
                    <el-option v-for="(item, i) in info.identityList"
                            :key="i"
                            @click.native="
                                            operatorChange(info.identityNum, index)
                                        "
                            :label="item.idName"
                            :value="item.id"></el-option>
                </el-select>
                </el-col>
                <el-col :span="6"
                        v-else>
                <el-input v-model="info.operatorName"
                            placeholder="姓名/企业名"
                            :disabled="index == 0 || moveDisabled"></el-input>
                </el-col>
                <el-col :span="6">
                <el-select v-model="info.handleMethod"
                            placeholder="请选择处理方式"
                            :disabled="index == 0 || moveDisabled"
                            @change="aaa"
                            style="width: 100%;">
                    <el-option v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                </el-select>
                </el-col>
                <el-col :span="2">
                <span icon="el-icon-delete"
                        class="delete_icon"
                        @click="deleteinfoList(index)"
                        v-if="
                                        info.userId != userId ||
                                        info.identityNum != enterpriseId
                                    "
                        title="删除"></span>
                <span icon="el-icon-delete"
                        class="delete_icon save"
                        @click="saveToContact(index)"
                        v-if="
                                        info.userId != userId ||
                                        info.identityNum != enterpriseId
                                    "
                        title="保存为常用联系人"></span>
                </el-col>
            </el-row>
            </li>
        </draggable>
      </ul>
      <ul class="singlist"
          v-if="formData.signWay != '02'">
        <li v-for="(info, index) in infoList"
            :data-number="index"
            :key="index">
          <el-row :gutter="20">
            <!--<el-col :span="7">-->
            <!--<el-input v-model="info.operatorContact" placeholder="手机号/邮箱"-->
            <!--:disabled="info.userId == userId" style="margin-left: 10px"></el-input>-->
            <!--</el-col>-->
            <el-col :span="7">
              <el-input v-model="info.operatorContact"
                        @blur="userAllId(index)"
                        placeholder="手机号/邮箱"
                        :disabled="index == 0"
                        style="margin-left: 10px;"></el-input>
            </el-col>
            <el-col :span="8"
                    v-if="
                                info.identityList &&
                                info.identityList.length > 0
                            ">
              <el-select v-model="info.identityNum"
                         :disabled="index == 0"
                         placeholder="请选择">
                <el-option v-for="item in info.identityList"
                           :key="item.id"
                           @click.native="
                                        operatorChange(info.identityNum, index)
                                    "
                           :label="item.idName"
                           :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8"
                    v-else>
              <el-input v-model="info.operatorName"
                        placeholder="姓名/企业名"
                        :disabled="index == 0"
                        :maxlength="50"></el-input>
            </el-col>
            <el-col :span="7">
              <el-select v-model="info.handleMethod"
                         placeholder="请选择处理方式"
                         :disabled="index == 0"
                         @change="aaa"
                         style="width: 100%;">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <span icon="el-icon-delete"
                    class="delete_icon"
                    @click="deleteinfoList(index)"
                    v-if="
                                    info.userId != userId ||
                                    info.identityNum != enterpriseId
                                "
                    title="删除"></span>
              <span icon="el-icon-delete"
                    class="delete_icon save"
                    @click="saveToContact(index)"
                    v-if="
                                    info.userId != userId ||
                                    info.identityNum != enterpriseId
                                "
                    title="保存为常用联系人"></span>
            </el-col>
          </el-row>
        </li>
      </ul>
      <div class="add_box clearfix">
        <div class="list"
             @click="addSignatory()">
          <span class="el-icon-plus"></span>
          <span>添加签署人</span>
        </div>
        <div class="list"
             @click="addcontacts()">
          <span class="el-icon-plus"></span>
          <span>从联系人添加</span>
        </div>
      </div>
    </div>
    <div class="pay">
      <p class="title">付费模式</p>
      <div class="box clearfix">
        <el-radio-group v-model="formData.paymentMethod" @change="getAllowPayUserId">
          <el-radio class="radio"
                    label="01"
                    key="01">全部自己付：我来承担此次文件的签署费用（发起成功后，将从您的账户中扣除签署份数）
          </el-radio>
          <!-- <el-radio class="radio" label="02" key="02">各自付：由文件签署人各自承担签署费用</el-radio> -->
          <el-radio label="03"
                    class="radio2"
                    v-if="formData.signWay != '03'">指定用户付：</el-radio>
          <el-select v-model="payman"
                     :disabled="formData.paymentMethod !== '03'"
                     class="payman"
                     v-if="formData.signWay != '03'">
            <el-option v-for="item in compInfoList"
                       :key="item.name"
                       :label="`${item.operatorName}-${item.operatorContact}`"
                       :value="`${item.operatorName}-${item.operatorContact}`"></el-option>
          </el-select>
          <span style="font-size: 14px; margin-left: 10px;"
                v-if="formData.signWay != '03'">（选择指定签署人作为支付费用方）</span>
            <p style="padding-left:110px; padding-top:4px;font-size:12px;">注：未注册的用户、有新手福利的用户不能作为指定付费用户</p>
        </el-radio-group>
      </div>
    </div>
    <div class="sure_bottom clearfix">
      <el-button @click="back()">上一步</el-button>
      <el-button type="primary"
                 @click="forward()">下一步</el-button>
    </div>

    <!--添加联系人弹窗-->
    <contractpeoplehub v-model="contractalert"
                       v-on:contractalert="contractalertfn"></contractpeoplehub>
  </div>
</template>

<script>
import base from "../mixin/base";
import contractpeoplehub from "./contractpeoplehub.vue";
import draggable from "vuedraggable"

export default {
  mixins: [base],
  components: { contractpeoplehub, draggable },
  data() {
    return {
      contractalert: false,
      moveDisabled: false,
      isMousedown: false,
      resource: [
        { label: "无序签署：签署顺序不受限制", value: "01" },
        {
          label:
            "顺序签署：按签署顺序一人签署完再到下一环节人签署，即 A-B-C-D",
          value: "02",
        },
        {
          label:
            "每人单独签署：发起方单独发送每个收件人签署，即A-B，A-C，A-D",
          value: "03",
        },
      ],
      formData: {
        signWay: "01",
        signatoryWay: "01",
        isSiteSign: "",
        paymentMethod: "01",
        isAuthentication: "",
      },
      infoList: [],
      mesign: false,
      othersign: false,
      options: [
        {
          label: "需签署",
          value: "01",
        },
        {
          label: "仅抄送",
          value: "02",
        },
      ],
      compactId: "",
      colors: [
        {
          text: "Aquamarine",
        },
        {
          text: "Skyblue",
        },
        {
          text: "Burlywood",
        },
      ],
      userId: "",
      enterpriseId: "",
      currIndex: null,
      isEdit: "",
      userType: "",
      oldId: "",
      timer: 0,
      payman: "",
      userIdList: [],  // 
      allowUserIdList:[]
    };
  },
  computed: {
    compInfoList() {
      if (this.infoList.length) {
      //  console.log(this.allowUserIdList);
        return this.infoList.filter((ele, index) => {
          for(let i=0; i<this.allowUserIdList.length;i++){
            if(ele.currUserId == this.allowUserIdList[i] || ele.userId == this.allowUserIdList[i]){
              // console.log(true,ele.currUserId,this.allowUserIdList[i]);
              return true;
            }else{
              // console.log(false,ele.currUserId,this.allowUserIdList[i]);
              continue;
            }
          }
          /* for (let i of this.allowUserIdList){
            // console.log(i);
            
            return ele.currUserId == i && ((ele.handleMethod == "01" && ele.operatorContact) || index == 0)
          } */
        })
        // (ele.handleMethod == "01" && ele.operatorContact) || index == 0
      }
    },
  },
  watch: {
    "formData.signWay": {
      handler(val) {
        if (val == "03") {
          this.formData.paymentMethod = "01";
        }
      },
    },
  },
  mounted() {
    this.compactId = this.$route.query.id;
    this.isEdit = this.$route.query.type;
    this.oldId = this.$route.query.oldId;
    this.$dragging.$on("dragged", ({ value }) => { });
    let info = JSON.parse($.cookie("userinfo"));
    console.log(info);
    this.userId = info.userId;
    this.enterpriseId = info.enterpriseId;
    this.userType = info.userType;
    if (this.isEdit == "01" || this.isEdit == "08") {
      //草稿||待我签署
      //这两个是什么意思orz???
      this.getCompactSecInfo();
    } else {
      this.infoList.push({
        handleMethod: "01", // 处理方式  要修改
        operatorContact: "", // 操作人联系方式
        operatorName: info.enterPriseName, // 操作人名称
        serialNumber: 1,
        userId: this.userId,
        identityNum: this.enterpriseId,
        identityList: [],
        currUserId: info.currentUserId
      });
      this.getInfo();
    }
  },
  methods: {
    getCompactSecInfo() {
      let id = this.isEdit == "08" ? this.oldId : this.$route.query.id;
      this.editCompactSec(id).then((res) => {
        if (this.successCheckCode(res)) {
          res.data.signatoryWay
            ? this.$set(
              this.formData,
              "signatoryWay",
              res.data.signatoryWay
            )
            : "";
          res.data.signWay
            ? this.$set(this.formData, "signWay", res.data.signWay)
            : "";
          res.data.isSiteSign
            ? this.$set(this.formData, "isSiteSign", true)
            : "";
          res.data.isAuthentication
            ? this.$set(this.formData, "isAuthentication", true)
            : "";
          res.data.signatoryList && res.data.signatoryList.length > 0
            ? (this.infoList = res.data.signatoryList)
            : [];
          res.data.paymentMethod
            ? this.$set(
              this.formData,
              "paymentMethod",
              res.data.paymentMethod
            )
            : "";
        }
        for (let i = 0; i < this.infoList.length; i++) {
          this.$set(this.infoList[i], "identityList", []);
          /*if (i == 0) {
                  continue
              }*/
          this.getUserAllId(this.infoList[i].operatorContact).then(
            (res) => {
              if (this.successCheckCode(res)) {
                this.$nextTick(() => {
                  this.$set(
                    this.infoList[i],
                    "identityList",
                    res.data.identityOnes.length
                      ? res.data.identityOnes
                      : []
                  );
                });
              }
            }
          );
        }
      });
    },
    userAllId(idx) {
      if (this.userId == this.infoList[idx].userId) {
        return false;
      }
      this.currIndex = idx;
      var contactNum = this.infoList[idx].operatorContact.replace(
        /(^\s*)|(\s*$)/g,
        ""
      );
      if (contactNum.length < 1) {
        return false;
      }
      if (
        this.infoList[idx].operatorContact !=
        this.infoList[idx].oldOperatorContact
      ) {
        this.infoList[idx].oldOperatorContact = this.infoList[
          idx
        ].operatorContact;
      } else {
        return false;
      }
      // this.infoList[idx].operatorName = '';
      // 清空选中值
      this.$set(this.infoList[idx], "operatorName", "");
      this.$set(this.infoList[idx], "identityNum", "");
      this.$set(this.infoList[idx], "userId", ""); //由于获取不到userid 则需重置userid

      this.getUserAllId(contactNum).then((res) => {
        if (this.successCheckCode(res)) {
          // this.infoList[idx].identityList = res.data.identityOnes ? res.data.identityOnes : []
          this.$nextTick(() => {
            this.$set(
              this.infoList[idx],
              "identityList",
              res.data.identityOnes.length
                ? res.data.identityOnes
                : []
            );
            this.$set(this.infoList[idx],
            "currUserId",
            res.data.identityOnes.length ? res.data.identityOnes[0].userId : ''
            );
          });
          if (res.data.identityOnes.length == 1) {
            this.$nextTick(() => {
              setTimeout(() => {
                this.$set(
                  this.infoList[idx],
                  "operatorName",
                  res.data.identityOnes[0].idName
                );
                this.$set(
                  this.infoList[idx],
                  "identityNum",
                  res.data.identityOnes[0].id
                );
              }, 100);
            });
          }

          // if(res.data.identityOnes.length > 1){
          //     let list = res.data.identityOnes;
          //     list.forEach(ele => {
          //         if(ele.id == this.infoList[0].identityNum){
          //             this.infoList[0].userId = ele.userId;
          //         }
          //     })
          // }
          // this.infoList[idx].identityList = res.data.identityOnes ? res.data.identityOnes : []
        }
      });
    },
    getInfo() {
      if (this.userType == "02") {
        this.personDetail().then((res) => {
          if (this.successCheckCode(res)) {
            this.infoList[0].operatorContact = res.data.phone;
          }
        });
      } else {
        this.enterpriseDetail().then((res) => {
          if (this.successCheckCode(res)) {
            this.infoList[0].operatorContact =
              res.data.linkManPhone;
          }
        });
      }
    },
    aaa(value) { },
    back() {
      this.$router.push({
        path: "/contractsign",
        query: { type: "01", id: this.$route.query.id },
      });
    },
    operatorChange(val, idx) {
      // console.log(val);
      this.infoList[idx].identityNum = val;
      var list = this.infoList[idx].identityList;
      for (var i = 0; i < list.length; i++) {
        if (val == list[i].id) {
          this.infoList[idx].operatorName = list[i].idName;
          // this.infoList[idx].userId = list[i].userId;
          // this.$set(this.infoList[idx], "operatorName", list[i].idName) ;
          this.infoList[idx].currUserId = list[i].userId
        }
      }
      this.userIdList = [];
      for (let item of this.infoList){
        this.userIdList.push(item.currUserId)
      }
      // console.log(this.infoList);
      // console.log(this.userIdList);
      this.getAllowPayUserId();
    },
    forward() {
      let self = this;
      let arr = [];
      console.log(this.infoList);
      let length = 0; // 签署人的条数
      if (this.infoList.length == 0) {
        this.$message({
          message: "请选择签署人信息",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      let hash = {},
        infoListNew = [];
      infoListNew = this.infoList.reduce((preVal, curVal) => {
        hash[curVal.operatorContact]
          ? ""
          : (hash[curVal.operatorContact] =
            true && preVal.push(curVal));
        return preVal;
      }, []);
      if (infoListNew.length < self.infoList.length) {
        self.$message({
          message: "同一签署人不能出现多次",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      for (var i = 0; i < this.infoList.length; i++) {
        let item = this.infoList[i];
        if (item.operatorContact == "") {
          this.$message({
            message: "签署人手机号码/邮箱不能为空",
            type: "warning",
            duration: 2000,
          });
          return;
        }
        if (item.operatorName == "") {
          this.$message({
            message: "签署人名称不能为空",
            type: "warning",
            duration: 2000,
          });
          return;
        }

        if (item.identityList.length > 0) {
          if (!item.identityNum) {
            this.$message({
              message: "签署人名称不能为空",
              type: "warning",
              duration: 2000,
            });
            return;
          }
        }

        let email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
          phone = /^1[3-9][0-9]{9}$/;
        if (
          !(
            email.test(item.operatorContact) ||
            phone.test(item.operatorContact)
          )
        ) {
          this.$message({
            message: "签署人手机号码/邮箱格式有误",
            type: "warning",
            duration: 2000,
          });
          return;
        }
        if (item.handleMethod == "") {
          this.$message({
            message: "操作方式不能为空",
            type: "warning",
            duration: 2000,
          });
          return;
        }
        if (item.handleMethod == "01") {
          length++;
        }
        item.serialNumber = i - 0 + 1;
        arr.push(item);
      }
      if (length <= 0) {
        this.$message({
          message: "请您填写合同签署人，至少需要1个签署人",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      //发起不能添加自己
      // for (let i = 0; i < arr.length; i++) {
      //     const element = arr[i];
      //     for (let j = i+1; j < arr.length; j++) {
      //         const ele = arr[j];
      //         if(element.userId && element.userId == ele.userId && ele.operatorContact == JSON.parse($.cookie("userinfo")).loginName){
      //             this.$message({
      //                 message: "禁止企业身份的子账号发合同给自己",
      //                 type: "warning",
      //                 duration: 1000
      //             });
      //             return;
      //         }
      //     }
      // }

      if (
        this.formData.paymentMethod != "01" &&
        this.formData.paymentMethod != "03"
      ) {
        this.$message({
          message: "请选择付费模式",
          type: "warning",
          duration: 1000,
        });
        return;
      }

      if (this.formData.paymentMethod == "03" && !this.payman) {
        this.$message({
          message: "请选择指定支付的用户",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (
        this.formData.signatoryWay == "01" &&
        (this.formData.isAuthentication == false ||
          this.formData.isAuthentication == "") &&
        JSON.parse($.cookie("userinfo")).realNameAuthenticationFlag ==
        "0"
      ) {
        this.$confirm(
          "为保证安全和减少法律风险，您需实名认证后再进行签署。",
          "风险提示",
          {
            type: "warning",
            confirmButtonText: "去实名认证",
            cancelButtonText: "取消",
            customClass: "self-icon icon-safe",
          }
        )
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
        return;
      }
      if (this.formData.paymentMethod == "03") {
        var designatedPeople = this.payman.split("-")[1];
        var designatedName = this.payman.split("-")[0];
        let contactList = this.infoList.find(
          (ele) => designatedPeople == ele.operatorContact
        );
        console.log(contactList);
        if (designatedPeople && !contactList) {
          return this.$message.error(
            "指定的付费用户发生变更，请重新指定"
          );
        }
        let identityList = contactList.identityList;
        if (identityList.length > 1) {
          identityList.forEach((ele) => {
            ele.idName == designatedName
              ? (designatedPeople = ele.accountNumber)
              : "";
          });
        }
      }

      this.contractSignNext({
        compactId: this.compactId, // 上一步后台返回的id
        isAuthentication:
          this.formData.isAuthentication == true ? "1" : "0", // （0：未允许未认证用户签署；1：允许未认证用户签署）
        isSiteSign: this.formData.isSiteSign == true ? "1" : "0", // 指定位置签署  （0：未指定位置签署；1：指定位置签署；）
        operatorInfoList: arr, // 操作人集合
        paymentMethod: this.formData.paymentMethod, // 付费模式 （01：全部自己付；02：各自付；）
        signWay: this.formData.signWay, // 签署对象  （01：无序签署；02：顺序签署；03：每人单独签署；）
        signatoryWay: this.formData.signatoryWay, // 签署方式 01：我需要签署；02：需要其他人签署；
        compactSponsorId: this.userId,
        designatedPeople,
        designatedName,
      }).then((res) => {
        if (this.successCheckCode(res)) {
          // this.$root.eventHub.$emit('test',res.data)
          this.$router.push({
            path: "/contractsignature",
            name: "contractsignature",
            query: { compactId: this.compactId },
          });
        }
      });
    },
    addSignatory() {
      let info = {
        handleMethod: "01", // 处理方式
        operatorContact: "", // 操作人联系方式
        operatorName: "", // 操作人名称
        serialNumber: this.infoList.length + 1,
        userId: null,
        identityNum: "",
        identityList: [],
      };
      this.infoList.push(info);
    },
    deleteinfoList(index) {
      // 删除签署人信息
      this.infoList.splice(index, 1);
    },
    saveToContact(index) {
      let obj = this.infoList[index];
      if (obj.operatorContact == "") {
        this.$message({
          message: "联系人手机号码/邮箱不能为空",
          type: "warning",
          duration: 2000,
        });
        return;
      }

      let email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
        phone = /^1[3-9][0-9]{9}$/;
      if (
        !(
          email.test(obj.operatorContact) ||
          phone.test(obj.operatorContact)
        )
      ) {
        this.$message({
          message: "联系人手机号码/邮箱格式有误",
          type: "warning",
          duration: 2000,
        });
        return;
      }

      if (obj.operatorName == "") {
        this.$message({
          message: "联系人名称不能为空",
          type: "warning",
          duration: 2000,
        });
        return;
      }

      if (obj.identityList.length > 0) {
        if (!obj.identityNum) {
          this.$message({
            message: "联系人名称不能为空",
            type: "warning",
            duration: 2000,
          });
          return;
        }
      }

      this.addUser({
        contactsName: obj.operatorName,
        contactsWay: obj.operatorContact,
        remark: "",
      }).then((res) => {
        if (this.successCheckCode(res)) {
          this.$message({
            type: "success",
            message: "添加联系人成功",
          });
        }
      });
    },
    signType(val) {
      // 选择签署类型
      // this.formData.signatoryWay = val;
      this.$set(this.formData, "signatoryWay", val);
      let self = this;
      this.infoList.map(function (data, index) {
        if (
          data.userId == self.userId &&
          data.identityNum == self.enterpriseId
        ) {
          if (val == "01") {
            // 我需要签署
            self.infoList[index].handleMethod = "01";
          } else if (val == "02") {
            self.infoList[index].handleMethod = "02";
          }
        }
      });
    },
    addcontacts() {
      // 添加联系人
      this.contractalert = true;
    },
    contractalertfn(data) {
      console.log(data);
      // 取消添加联系人
      if (data) {
        data.map((res, idx) => {
          let obj = {};
          obj.handleMethod = "01";
          obj.operatorContact = res.contactsWay;
          obj.operatorName = res.contactsName;

          let contactNum = obj.operatorContact;
          this.getUserAllId(contactNum).then((res) => {
            if (this.successCheckCode(res)) {
              obj.identityList = res.data.identityOnes
                ? res.data.identityOnes
                : [];
              this.infoList.push(obj);
              if (res.data.identityOnes.length == 1) {
                this.$set(
                  this.infoList[this.infoList.length - 1],
                  "identityNum",
                  res.data.identityOnes[0].id
                );
                this.$set(
                  this.infoList[this.infoList.length - 1],
                  "operatorName",
                  res.data.identityOnes[0].idName
                );
              }
              if(res.data.identityOnes.length>=1){
                this.$set(this.infoList[this.infoList.length - 1],
                  "currUserId",
                  res.data.identityOnes[0].userId 
                );
              }
            }
          });
        });
      }
      this.contractalert = false;
      if(!this.contractalert){
        let timer = setTimeout(()=>{
          this.getAllowPayUserId()
          clearTimeout(timer)
        },1000)
      }
    },
    //是否允许为认真用户签署
    changeIfAuthSign() {
      if (this.formData.isAuthentication) {
        this.$confirm("您确定允许未实名认证的签署人签署此份合同？如允许此份电子合同将不具备法律效力，仅为演示体验签署", "风险提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "icon-safe self-icon",
        })
          .then(() => {
            this.formData.isAuthentication = true;
          })
          .catch(() => {
            this.formData.isAuthentication = false;
          });
      }
    },
    // 获取允许指定用户支付的 id 
    getAllowPayUserId(val){
      // console.log(val); // 01 代表当前选择全部自己支付
      if(val == '01'){
        return;
      }
      this.userIdList = [];
      for (let item of this.infoList){
        this.userIdList.push(item.currUserId || item.userId)
      }
      // console.log(this.infoList);
      // console.log(this.userIdList);
      this.filterEligibleUs({userIdList:this.userIdList}).then(res => {
        if(res.code == 0){
          this.allowUserIdList = res.data.userIdList;
          // console.log(this.allowUserIdList);
        }
        
      })
    }
  },
};
</script>
<style>
.ui-state-highlight {
  height: 50px !important;
}

.singlist .el-select {
  width: 100%;
}
</style>
<style scoped lang="scss">
.contractprocess {
  padding: 30px;
  padding-top: 0;

  .object {
    .box {
      .list {
        cursor: pointer;
        float: left;
        border: 1px solid #c0ccda;
        border-radius: 4px;
        width: 360px;
        height: 83px;
        text-align: center;
        font-size: 14px;

        p:nth-child(1) {
          color: #333;
          padding-top: 20px;
        }

        p:nth-child(2) {
          color: #666;
          padding-top: 5px;
        }

        .label {
          display: none;
          position: absolute;
          right: -23px;
          top: -4px;
          width: 65px;
          height: 32px;
          background: #02adff;
          text-align: center;
          transform: rotate(45deg);
          box-shadow: 0 1px 1px #ccc;

          i {
            font-size: 12px;
            margin-top: 14px;
            transform: rotate(-45deg);
            color: #fff;
          }
        }
      }

      .activeType {
        position: relative;
        overflow: hidden;
        border: 1px solid #02adff;
        box-shadow: 0 2px 5px 0 rgba(138, 179, 216, 0.5);

        p {
          color: #02adff !important;
        }

        .label {
          display: block;
        }
      }

      .list:nth-child(1) {
        margin-right: 40px;
      }
    }
  }

  .box {
    .radio {
      display: block;
      margin-left: 0;
      padding-bottom: 20px;
    }

    .radio:last-child {
      padding-bottom: 0;
    }

    .radio2 {
      margin-left: 0;
    }

    .payman {
      width: 300px;
    }
  }

  .info {
    .box {
      .checkbox:nth-child(2) {
        margin-left: 24px;
      }
    }

    .add_box {
      .list {
        width: 560px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background: #fafafa;
        border: 1px dashed #c0ccda;
        border-radius: 4px;
        font-size: 14px;
        color: #02adff;
        cursor: pointer;

        .el-icon-plus {
          padding-right: 8px;
        }
      }

      .list:nth-child(1) {
        float: left;
      }

      .list:nth-child(2) {
        float: right;
      }

      .list:hover {
        border-color: #04adfe;
      }
    }

    #sortable {
      .ui-state-highlight {
        background-color: #02adff;
        height: 50px !important;
      }

      .ui-sortable-helper {
        background: rgba(248, 218, 142, 0.4);
      }
    }

    .singlist {
      padding-top: 25px;

      .el-col {
        position: relative;

        .el-input {
          height: 36px;

          .el-input__inner {
            position: absolute;
            top: 6px;
            z-index: 9999;
          }
        }
      }

      li .move {
        display: block;
        position: absolute;
        left: 30px;
        display: none;
        width: 21px;
        height: 10px;
        margin-top: 20px;
        background: url("../../../../static/image/sort.png") center no-repeat;
        cursor: move;
      }

      li:hover .move {
        display: block;
      }

      li:hover {
        background: rgba(248, 218, 142, 0.4);
      }

      li:hover .delete_icon:after {
        display: inline-block !important;
      }

      > li:after {
        content: "";
        display: block;
        border-bottom: 1px solid #eeeeee;
        width: 100%;
        padding-top: 5px;
      }

      li {
        background: #fafafa;
        height: 50px;
        line-height: 50px;
        margin-bottom: 11px;
        position: relative;

        .delete_icon {
          width: 13px;
          height: 14px;
          cursor: pointer;
        }

        .delete_icon:after {
          display: none;
        }
        .delete_icon.save {
          margin-left: 8px;
        }
        .delete_icon.save:after {
          background-image: url("../../../../static/image/save_contract.svg");
          background-size: 100%;
        }
        .index {
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          background: #ffffff;
          border: 1px solid #d3dce6;
        }
      }
    }
  }

  .title {
    color: #999999;
    padding-top: 40px;
    padding-bottom: 20px;
  }

  .title:nth-child(1) {
    padding-top: 20px;
  }

  .box {
    margin-left: 120px;
  }
}
</style>
