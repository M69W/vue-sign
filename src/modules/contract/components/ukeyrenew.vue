<template>
  <div class="ukeyrenew">
    <div class="orderpage-topbar clearfix">
      <div class="orderpage-tit"
           v-if="!flag">Ukey签名续期</div>
      <div class="orderpage-tit"
           v-if="flag">Ukey印章续期</div>
      <div class="orderpage-progress">
        <img src="../../../../static/image/ukeyrenew1.png" />
      </div>
    </div>
    <div class="orderpage-cont">
      <el-row>
        <el-col :span="8">
          <div class="orderpage-item-name orderpage-item-font1">订单号</div>
          <div class="orderpage-item-cont">{{ orderNo }}</div>
        </el-col>
      </el-row>
      <div class="orderpage-item-tit">
        Ukey查验
        <span class="tips">读取Ukey、输入PIN码点击确定按钮</span>
      </div>
      <el-row class="ukeychackcont">
        <el-col :span="9">
          UKEY
          <!-- <el-select v-model="ukeyselect" placeholder="请选择UKEY">
                        <el-option v-for="item in ukeylist" :key="item.key_id" :label="item.key_name"
                            :value="item.key_id"></el-option>
                    </el-select>-->
          <el-input v-model="ukeyname"
                    readonly
                    placeholder="请插入UKEY电子印章，点击读取"
                    style="width: 365px;margin-left: 15px;"></el-input>
        </el-col>
        <el-col :span="2">
          <div class="readUkeyBtn"
               @click="refresh">读取</div>
          <!--<el-button class="refresh" type="primary" :loading="loadingBtnKey1" @click="refresh"></el-button>-->
        </el-col>
        <el-col :span="9">
          <span class="pin">PIN码</span>
          <el-input type="password"
                    v-model="pincode"
                    class="pin"
                    placeholder="请输入签章密码(PIN码)"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="readsure"
                     @click="changeUkey"
                     :loading="loadingBtnKey2">确定</el-button>
        </el-col>
      </el-row>
      <div class="orderpage-item-tit"
           v-if="!flag">续费签名</div>
      <div class="orderpage-item-tit"
           v-if="flag">续费印章</div>
      <el-table :data="tableData"
                style="width: 100%; margin-top:10px;"
                v-if="!flag">
        <el-table-column :resizable="false"
                         prop="signImg"
                         label="签名样式"
                         width="180">
          <template slot-scope="scope">
            <img :src="scope.row.signImg"
                 class="tableimg" />
          </template>
        </el-table-column>
        <el-table-column :resizable="false"
                         prop="signName"
                         label="名称"></el-table-column>
        <el-table-column :resizable="false"
                         prop="signCode"
                         label="签名编码"></el-table-column>
        <el-table-column :resizable="false"
                         prop="expiryDate"
                         label="有效期"
                         width="280"></el-table-column>
      </el-table>
      <el-table :data="sealTable"
                style="width: 100%; margin-top:10px;"
                v-if="flag">
        <el-table-column :resizable="false"
                         prop="pictureName"
                         label="印章名称"></el-table-column>
        <el-table-column :resizable="false"
                         prop="esealType"
                         label="印章类型">
          <template slot-scope="scope">
            <div v-if="scope.row.esealType === '01'">行政章</div>
            <div v-if="scope.row.esealType === '02'">财务专用章</div>
            <div v-if="scope.row.esealType === '03'">业务专用章</div>
            <div v-if="scope.row.esealType === '04'">法定代表人名章</div>
            <div v-if="scope.row.esealType === '05'">报关专用章</div>
            <div v-if="scope.row.esealType === '06'">合同专用章</div>
            <div v-if="scope.row.esealType === '07'">其他公章</div>
            <div v-if="scope.row.esealType === '80'">电子杂章</div>
            <div v-if="scope.row.esealType === '90'">电子私章</div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false"
                         prop="pictureCode"
                         label="印章编码"></el-table-column>
        <el-table-column :resizable="false"
                         label="有效期">
          <template slot-scope="scope">
            <div>
              {{ scope.row.bizValidStart }} 至
              {{ scope.row.bizValidEnd }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="orderpage-item-tit"
           v-if="renewFlag">选择续期时间</div>
      <div class="payType-list clearfix">
        <div class="renewukeycost"
             v-for="(item, index) in expirationDateList"
             :key="index"
             :class="{actived: isActived == index, 'year': item.year === 5}"
             @click="selectRenewTime(index, item.year)">
          <div class="ukeycost-total">
            <img src="../../../../static/image/icon-datatime.png" />
            {{ item.year }}年
          </div>
          <div class="ukeycost-year" :class="{cheap: item.year != 0}">
             特惠价&nbsp;<strong>{{ item.price }}元</strong>
          </div>
          <div class="discount" v-if="item.year === 3 || item.year === 2">
            限时6.7折
          </div>
          <p class="p" v-if="item.year === 5">原价：1500元</p>
          <p class="p" v-if="item.year === 3">原价：900</p>
          <p class="p" v-if="item.year === 2">原价：600</p>
          <p v-if="item.year === 1">25元/月</p>
          <i></i>
        </div>
      </div>
    </div>

    <div class="orderpage-footbtn">
      <el-button @click="back()">返回</el-button>
      <el-button type="primary"
                 v-if="renewFlag"
                 @click="next()">下一步</el-button>
    </div>

    <el-dialog title="温馨提示"
               :visible.sync="dialogVisible"
               custom-class="message-dialog"
               top="10%"
               :before-close="closeDialog">
      <div class="dialog-content">
        <div class="err-icon icon"
             v-if="errTip"></div>
        <div class="warn-icon icon"
             v-if="gdcaTip || cancelTip"></div>
        <p v-if="errTip">您选择的续费印章和UKey读取信息不一致，您是否确定进行下一步操作？</p>
        <p v-if="gdcaTip">CA机构规定续期后的有效期不能超过4年，请过段时间再来续期。</p>
        <p v-if="cancelTip"
           style="margin-top:10px;">
          该印章已挂失/注销，不能进行续期，请
          <a href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4009196663&cref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa&ref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa%2Fstyle%26id%3Dwpa_setting_a01&pt=undefined&f=1&ty=1&ap=&as=&aty=0&a=">联系客服！</a>
        </p>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>&nbsp;
        <el-button type="primary"
                   @click="submitRenewOrder"
                   v-if="errTip">确定</el-button>
        <el-button type="primary"
                   @click="closeDialog()"
                   v-if="!errTip">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="温馨提示"
               :visible.sync="sealTagVisible"
               custom-class="message-dialog"
               top="10%"
               :before-close="closeDialog">
      <div class="dialog-content">
        <div class="warn-icon icon"></div>
        <p>
          您的电子印章暂时无法在线续期，请您直接联系客服完成续期。
          <a href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4009196663&cref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa&ref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa%2Fstyle%26id%3Dwpa_setting_a01&pt=undefined&f=1&ty=1&ap=&as=&aty=0&a=">联系在线客服</a>
        </p>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="sealTagVisible = false">取 消</el-button>&nbsp;
        <el-button type="primary"
                   @click="sealTagVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <transition name="fade">
      <div class="update"
           v-if="goupdate">
        <span class="el-icon-warning"
              style="color:#fff;"></span>
        您有 “已付款”
        的待更新数字证书的电子印章，请先前往更新证书后再续期。
        <a @click="toUpdate">去更新证书</a>
        <span class="el-icon-close"
              @click="closeFade"></span>
      </div>
    </transition>
  </div>
</template>
<script>
import base from '../mixin/base';
export default {
  mixins: [base],
  components: {},
  data() {
    return {
      allInfo: '', // 所有ukey信息
      tableData: [],
      tableData2: [],
      signTable: [],
      sealTable: [],
      formData: {
        // 订单提交信息
        orderNo: '', // 订单编号
        pictureCode: '', // 印章编码
        renewTime: '' // 续期时间
      },
      rules: {},
      ukeylist: [],
      ukeyname: '',
      ukeyselect: '',
      pincode: '',
      loadingBtnKey2: false,
      flag: false,
      orderNo: '',
      pictureCode: '',
      expirationDateList: [],
      currVal: null,
      renewFlag: false,
      ukeyType: 'sign',
      dialogVisible: false,
      errTip: false,
      gdcaTip: false,
      cancelTip: false,
      ukeylogin: false,
      signCertificateSn: '',
      isBack: false,
      esealStatus: '',
      goupdate: false,
      trustId: '',
      userInfo: $.cookie('userinfo') && JSON.parse($.cookie('userinfo')),
      creditCode: '',
      cert: '',
      sealTag: '',
      sealTagVisible: false,
      encryptCertificateSn: '',
      isNetca: false  // 当前ukey是否为网政通的key
    };
  },
  computed: {
    isActived() {
      return this.currVal;
    },
    vid() {
      if (this.cert == 'GDCA') {
        return '01';
      } else if (this.cert == 'NETCA') {
        return '02';
      }
    }
  },
  watch: {},
  created() {
    console.log(JSON.parse($.cookie('userinfo')));
    this.pictureCode = this.formData.pictureCode = this.$route.query.pictureCode;
    this.orderNo = this.$route.query.orderNo;
    if (this.orderNo) {
      this.getOrderDetail();
    }
    if (this.pictureCode) {
      this.chekcUkeyOrder();
    }
    // console.log(JSON.parse($.cookie("userinfo")));
    // this.orderNo = "2018122555546622";
    // this.pictureCode = "31000031441453";
    if (this.$route.path == '/ukeysealrenew') {
      this.flag = true;
      this.ukeyType = 'seal';
      this.$nextTick(() => {
        if (this.ukeylogin && $.cookie('ukeylist') && JSON.parse($.cookie('ukeylist'))) {
          this.ukeylist = JSON.parse($.cookie('ukeylist'));
          this.ukeyselect = this.ukeylist[0].key_id;
          this.pincode = this.ukeylist[0].pincode;
          this.ukeyname = this.enterpriseName = this.ukeylist[0].key_name;
        }
        // if (this.isBack) {
        //     this.getSignCertificateSn();
        // }
      });
    }
  },
  mounted() {
    // this.chekcUkeyOrder();
  },
  methods: {
    chekcUkeyOrder() {
      this.checkUkeyIfHas({ pictureCode: this.pictureCode }).then((res) => {
        if (this.successCheckCode(res)) {
          console.log(res);
        }
      });
    },
    getOrderDetail() {
      this.orderDetailEnterprise(this.orderNo).then((res) => {
        if (this.successCheckCode(res)) {
          this.pictureCode = this.formData.pictureCode = res.data.esealList[0].pictureCode;
          this.formData.renewTime = res.data.esealList[0].renewalTime;
          this.checkUkeyIfHas({
            pictureCode: this.pictureCode
          }).then((ret) => {
            if (this.successCheckCode(ret)) {
              this.sealTable = res.data.esealList;
              this.enterpriseName = res.data.enterpriseInfo.enterpriseName;
              this.creditCode = this.$route.query.creditCode;
              this.showPackageTpye();
            }
          });
          // this.sealTable = res.data.esealList;
          // this.enterpriseName =
          //     res.data.enterpriseInfo.enterpriseName;
          // this.showPackageTpye();
        }
      });
    },
    //刷新按钮
    refresh() {
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        // this.isIe = true;
        this.checkUkeyVer();
      } else {
        // this.isIe = false;
        this.$message({
          type: 'error',
          message: '因CA机构仅支持IE浏览器，请在下载浏览器IE10以上版本进行续期',
          duration: 3500
        });
        return false;
      }
    },
    checkUkeyVer() {
      this.getUKeyVersion().then((res) => {
        if (this.successUKeyCheckCode(res)) {
          res = JSON.parse(res);
          let ver = res.version;
          this.checkUKeyVersion(ver).then((res) => {
            if (this.successCheckCode(res)) {
              if (!!res.data.isNewest) {
                this.getUkeyList();
              } else {
                this.$updateUKeyDrive();
              }
            }
          });
        }
      });
    },
    getUkeyList() {
      this.ukeyselect = '';
      this.ukeylist = [];
      this.getAllUKeyList().then((res) => {
        res = JSON.parse(res || {});
        if (this.successUKeyCheckCode(res)) {
          if (!res.keyList.length) {
            this.$message.error('暂无印章数据，请插入UKEY进行读取');
            return;
          }
          this.$message({
            message: `读取成功`,
            type: "success",
            duration: 1500
          });
          this.ukeylist = res.keyList;
          this.ukeyselect = this.ukeylist[0].key_id;
          this.ukeyname = this.enterpriseName = this.ukeylist[0].key_name;
        }
      });
    },
    changeUkey() {
      console.log(this.ukeyselect);
      if (!this.ukeylist.length) {
        this.$message.error('暂无印章数据，请插入UKEY进行读取！');
        return;
      } else if (!this.ukeyselect) {
        this.$message.error('请先选择UKEY！');
        return;
      } else if (this.pincode.length < 4) {
        this.$message.error('请输入正确的PIN码！');
        return;
      }
      // console.log(this.PIN(this.pincode, this.ukeyselect));
      this.loginKey({
        keyid: this.ukeyselect,
        pin: this.pincode
      }).then((res) => {
        res = JSON.parse(res || {});
        if (this.successUKeyCheckCode(res)) {
          this.getSignCertificateSn();
        }
      });
    },
    selectRenewTime(index, year) {
      // 如果是网政通用户，不允许5年续费
      if(year == 5 && this.isNetca){
        const h = this.$createElement;
        this.$msgbox({
          title: '温馨提示',
          message: h('div',null,[
            h('div',{class:'el-icon-warning'}),
            h('span',null,'   非常抱歉，如果您需要续费5年，可以直接'),
            h('a',{
                style:'color:skyblue;text-decoration:underline',
                on: {
                  click(){
                    window.open('http://www.i-yin.com.cn/networkHome.html')
                  }
                }
              },
              '前往门店'),
            h('span',null,'续费或者联系客服')
          ])
        })
        return
      }
      this.currVal = index;
      this.formData.renewTime = year.toString();
    },
    back() {
      this.$router.go(-1);
    },
    // 提交订单
    submitRenewOrder() {
      // 如果是个人用户
      // console.log(this.allInfo);
      // if (this.allInfo.perInfo) {
      //     let perinfo = this.allInfo.perInfo;
      // } else if (this.allInfo.orgInfo) {
      //     // 企业用户
      //     let orginfo = this.allInfo.orgInfo;
      // }
      if (!this.checkEnterprise()) {
        this.$message({
          type: 'error',
          message: '当前账户无此Ukey印章，请重新插入',
          duration: 2000
        });
        return false;
      }
      this.getPayInfo({
        pictureCode: this.formData.pictureCode,
        orderNo: this.orderNo,
        renewYear: this.formData.renewTime,
        enterpriseName: this.enterpriseName
      }).then((res) => {
        if (this.successCheckCode(res)) {
          this.createRenewOrder({
            orderNo: this.orderNo,
            renewTime: this.formData.renewTime,
            pictureCode: this.formData.pictureCode,
            trustId: this.trustId
          }).then((ret) => {
            if (ret.code === 0) {
              this.$router.push({
                path: '/ukeysealrenewpay',
                query: {
                  orderNo: this.orderNo,
                  creditCode: this.creditCode
                }
              });
            } else if (ret.code === 5090) {
              this.goupdate = true;
            } else {
              this.$message.error(ret.msg);
            }
          });
        }
      });
    },
    getSignCertificateSn() {
      // 获取ukey签名序列号
      this.getCertInfoObjFn(this.ukeyselect).then((res) => {
        if (this.successUKeyCheckCode(res)) {
          res = JSON.parse(res || {});
          console.log(res);
          res.info.map((ele) => {
            if (ele.item_type == 10) {
              this.signCertificateSn = ele.item_info;
            } else if (ele.item_type == 12) {
              this.trustId = ele.item_info;
            } else if (ele.item_type == 8) {
              this.creditCode = ele.item_info;
            } else if (ele.item_type == 7) {
              this.cert = ele.item_info;
            } else if (ele.item_type == 17) {
              this.sealTag = ele.item_info;
            } else if (ele.item_type == 11) {
              this.encryptCertificateSn = ele.item_info;
            }else if(ele.item_type == 27 && ele.item_info == 'netca'){
              // 判断是否为网证通用户
              this.isNetca = true;
            }
          });
          if (this.sealTag == '000000' || this.sealTag == '') {
            this.getSealRenewInfoData(this.signCertificateSn);
          } else {
            this.sealTagVisible = true;
          }
        }
      });
    },
    getSealRenewInfoData(signCertificateSn) {
      let signCertificateValue = this.getCertValue({
        keyid: this.ukeyselect,
        certtype: 0 //0签名证书1：加密证书
      });
      let encryptCertificateValue = this.getCertValue({
        keyid: this.ukeyselect,
        certtype: 1 //0签名证书1：加密证书
      });
      this.getSealRenewInfo({
        signCertificateSn,
        vid: this.vid,
        userId: this.userInfo.userId,
        accountId: this.userInfo.accountId,
        creditCode: this.creditCode,
        signCertificateSn: this.signCertificateSn,
        encryptCertificateSn: this.encryptCertificateSn,
        trustId: this.trustId,
        signCertificateValue,
        encryptCertificateValue
      }).then((res) => {
        if (res.code === 0) {
          if (res.data != null) {
            this.orderNo ? (this.formData.orderNo = this.orderNo) : (this.orderNo = this.formData.orderNo = res.data.orderNo);
            this.allInfo = res.data;
            this.esealStatus = this.allInfo.esealInfo.esealStatus;
            this.formData.pictureCode = this.allInfo.esealInfo.pictureCode;
            this.sealTable = [];
            this.sealTable.push(res.data.esealInfo);
            this.showPackageTpye();
          }
        } else if (res.code === 5018) {
          this.dialogVisible = true;
          this.gdcaTip = true;
        } else {
          this.$message({
            type: 'warning',
            message: res.msg,
            duration: 2500
          });
        }
      });
    },
    // 展示续期时间选项
    showPackageTpye() {
      this.expirationDateList = [];
      this.getPayInfo({
        pictureCode: this.formData.pictureCode,
        orderNo: this.orderNo,
        renewYear: this.formData.renewTime || 1,
        enterpriseName: this.enterpriseName
      }).then((res) => {
        if (res.code === 0) {
          // let renewTimeArr = this.sealTable[0].renewTimeArray;
          // if (renewTimeArr.length) {
          //   renewTimeArr.forEach((item) => {
          //     let priceItem = {
          //       year: item,
          //       price: Number(item) * res.data.singleFee
          //     };
          //     this.expirationDateList.push(priceItem);
          //   });
          //   this.renewFlag = true;
          // }
          let listProductAmountPrivilege = res.data.listProductAmountPrivilege;
          if (listProductAmountPrivilege && listProductAmountPrivilege.length > 0) {
            listProductAmountPrivilege.forEach(element => {
                let priceItem = {
                    year: element.serviceYear,
                    price: element.productAmount / 100
                };
                this.expirationDateList.push(priceItem);
            });
            this.renewFlag = true;
          }
          this.expirationDateList.sort(function(a, b) {
            let value1 = a.year;
            let value2 = b.year;
            return value2 - value1;
          })
        } else if (res.code === 6047) {
          this.sealTagVisible = true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    next() {
      let that = this;
      // if (this.allInfo.orderUserType == '02') {
      //     this.$message.error("个人签名暂不支持续期");
      //     return false;
      // }
      if (this.currVal == null) {
        this.$message.error('请选择续期年数');
        return false;
      }
      if (this.pictureCode && this.pictureCode !== this.formData.pictureCode) {
        this.dialogVisible = true;
        this.errTip = true;
      } else if (this.esealStatus == '05' || this.esealStatus == '06') {
        this.dialogVisible = true;
        this.cancelTip = true;
      } else {
        that.submitRenewOrder();
      }
    },
    checkEnterprise() {
      let enterpriseId = this.userInfo.enterpriseId,
        enterpriseList = this.userInfo.enterpriseInfoList,
        creditCode;
      enterpriseList.map((ele) => {
        if (ele.enterpriseId == enterpriseId) {
          creditCode = ele.creditCode;
        }
      });
      if (creditCode.indexOf(this.creditCode) === -1) {
        return false;
      } else {
        return true;
      }
    },
    toUpdate() {
      this.$router.push({
        path: 'ukeyrenewupdate',
        query: {
          orderNo: this.orderNo
        }
      });
    },
    closeFade() {
      this.goupdate = false;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.errTip = false;
      this.gdcaTip = false;
      this.cancelTip = false;
      this.sealTagVisible = false;
    },
    getCertValue(data) {
      let val = '';
      this.getCertData(data).then((res) => {
        if (this.successUKeyCheckCode(res)) {
          res = JSON.parse(res);
          val = res.certdata;
        }
      });
      return val;
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log(to);
    if (from.path == '/ukeylogin') {
      next((vm) => {
        vm.ukeylogin = true;
      });
    }
    // else if(from.path == '/ukeysealrenewpay' && to.query.isBack){
    //     next(vm => {
    //         vm.isBack = true;
    //         // vm.signCertificateSn = from.query.signCertificateSn;
    //         vm.enterpriseName = from.query.enterpriseName;
    //         vm.orderNo = from.query.orderNo;
    //     })
    // }
    next();
  }
};
</script>

<style lang="scss">
.ukeyrenew {
  position: relative;
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .orderpage-topbar {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    padding: 0 30px;
    .orderpage-tit {
      float: left;
      font-size: 18px;
      color: #333333;
    }
    .orderpage-progress {
      float: right;
    }
  }
  .orderpage-cont {
    padding: 30px;
    position: relative;
    .orderpage-item-tit {
      font-size: 16px;
      color: #333333;
      padding: 30px 0 10px 0;
      .tips {
        color: #999999;
        font-size: 14px;
        margin-left: 10px;
      }
      .editbtn {
        font-size: 14px;
        color: #02adff;
        margin-left: 25px;
        padding-left: 22px;
        cursor: pointer;
        background: url(../../../../static/image/icon-edit.png) no-repeat;
        &:hover {
          color: #0073bd;
          background: url(../../../../static/image/icon-edit-hover.png)
            no-repeat;
        }
      }
    }
    .orderpage-item-name {
      width: 80px;
      float: left;
      height: 40px;
      line-height: 40px;
    }
    .orderpage-item-cont {
      margin-left: 90px;
      height: 40px;
      line-height: 40px;
    }
    .orderpage-item-font1 {
      font-size: 16px;
      color: #333333;
    }
    .orderpage-item-font2 {
      font-size: 14px;
      color: #626262;
    }
    .orderpage-item-font3 {
      font-size: 16px;
      color: #626262;
    }
    .tableimg {
      height: 40px;
    }
  }
  .orderpage-footbtn {
    text-align: right;
    padding: 30px;
    .el-button {
      width: 140px;
    }
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .update {
    width: 100%;
    position: absolute;
    top: -20px;
    left: 0;
    background: #50bfff;
    line-height: 36px;
    border-radius: 4px;
    padding: 0 16px;
    color: #fff;
    a {
      color: #fff;
      text-decoration: underline;
    }
    .el-icon-close {
      float: right;
      margin-top: 12px;
      cursor: pointer;
      font-size: 12px;
    }
  }
  .el-input-group__prepend {
    border: 0;
    padding: 0 20px 0 0;
    color: #626262;
  }

  .el-input__inner {
    background-color: #fff;
  }

  .el-button--default {
    color: #626262;
  }

  .el-button--default:hover {
    color: #fff;
  }

  .readUkeyBtn {
    font-size: 14px;
    color: #00afff;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
    width: 60px;
    text-align: center;
  }

  .ukeychackcont {
    margin-top: 10px;

    .el-button {
      border: 1px solid #00afff;
      float: right;
      width: 100px;
    }

    .el-select {
      margin-left: 15px;
      width: 360px;
    }

    .pin {
      margin-left: 15px;
      width: 340px;
    }
  }

  .renewukeycost {
    float: left;
    margin-right: 20px;
    margin-bottom: 10px;
    border: 1px solid #e8ecef;
    border-radius: 4px;
    width: 220px;
    height: 135px;
    padding: 20px;
    cursor: pointer;
    position: relative;
    text-align: center;

    &.actived {
      border: 1px solid #02adff;
      i {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        width: 40px;
        height: 40px;
        background: url(../../../../static/image/icon-selected.png) no-repeat;
      }
    }
    .discount{
      height: 20px;
      padding-left: 3px;
      padding-right: 8px;
      color: #fff;
      line-height: 20px;
      font-size: 12px;
      position: absolute;
      top: 4px;
      left: 0;
      background-color: #fa6400;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    .ukeycost-total {
      font-size: 30px;
      color: #333333;

      img {
        margin-top: 4px;
        margin-right: 10px;
        vertical-align: -8px;
      }
    }

    .ukeycost-year {
      font-size: 14px;
      color: #626262;
      margin-top: 20px;
      &.cheap {
          color: #fa6400;
      }
      strong{
        font-size: 16px;
      }
    }

    .ukeycost-date {
      font-size: 14px;
      color: #626262;
      margin-top: 20px;
    }

    &.year {
        background: url('/static/image/cheap.svg') top left no-repeat;
    }
    .p {
        text-decoration: line-through;
        color: #989898;
        padding-top: 5px;
    }
  }

  .message-dialog.el-dialog.el-dialog--small {
    border-radius: 10px;
    width: 550px;

    .el-dialog__header {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      padding: 0;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      background-color: #e8ecef;

      .el-dialog__title {
        font-size: 16px;
        font-weight: 500;
      }

      .el-dialog__headerbtn {
        margin-top: 0;
        padding: 0 18px 20px;
      }
    }

    .dialog-content {
      padding: 50px 40px 10px;
      text-align: left;

      .icon {
        float: left;
        margin-right: 18px;
        margin-top: 5px;
        width: 40px;
        height: 40px;
      }

      .err-icon {
        background: url(../../../../static/image/err.svg) no-repeat;
      }

      .warn-icon {
        background: url(../../../../static/image/warn.svg) no-repeat;
      }

      p {
        font-size: 16px;
        line-height: 26px;

        a {
          font-size: 16px;
          color: #00afff;
          text-decoration: underline;
        }
      }
    }

    .dialog-footer {
      text-align: center;

      .notice {
        margin-top: 20px;
        text-align: left;

        p {
          color: #999;
        }
      }
    }

    .el-button {
      width: 80px;
    }
  }
}
</style>
<style>
.el-table th > div.cell {
  line-height: 30px;
}

.ukeyrenew .readsure {
  color: #00afff;
}
</style>
