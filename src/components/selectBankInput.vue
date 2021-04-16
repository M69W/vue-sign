<template>
  <div class="select-bank-input">
    <el-input v-model.trim="selectName"
              placeholder="请输入开户行名称"
              @focus="focusInput"
              ref="inputBox"
              @change="changeBankName">
    </el-input>
    <!-- <i class="el-input__icon el-icon-caret-bottom" :class="{'is-reverse':isShowBox}"></i> -->
    <transition name="fade">
      <div class="select-bank-input-box"
           v-show="isShowBox">
        <ul class="select-bank-input-tabs clearfix">
          <li class="select-bank-input-tabs-item"
              :class="{'tabs-active':tabActive === tindex}"
              v-for="(tab,tindex) in tabs"
              :key="tindex"
              @click="tabsBtn(tab,tindex)">
            {{tab}}
          </li>
        </ul>
        <el-scrollbar>
          <ul class="select-bank-input-content">
            <li class="select-bank-input-content-item"
                v-for="(item,index) in tableData"
                :key="index"
                @click="selectBankBtn(item,index)"
                :title="item.bankName">
              {{item.bankName}}
            </li>
            <div v-show="tableData.length==0"
                 style="text-align: center;">暂无数据~</div>
          </ul>
        </el-scrollbar>
      </div>
    </transition>
  </div>
</template>
<script>
import service from "@/assets/mixin/service";
import base from "@/modules/contract/mixin/base";
export default {
  name: "selectBankInput",
  mixins: [service, base],
  props: {
    value: {
      type: [String],
      default: ""
    },
  },
  watch: {
  },
  computed: {
    selectName: {
      get() {
        if (this.value) {
          this.innerSelectBank = this.value;
        }
        console.log("get", this.innerSelectBank);
        return this.innerSelectBank;
      },
      set(val, nval) {
        this.innerSelectBank = val;
        this.$emit('input', this.innerSelectBank);
        console.log("set", this.innerSelectBank);
      }
    },
  },
  data() {
    return {
      tabs: [
        "常用银行",
        "ABCDEF",
        "GHJ",
        "KLMN",
        "PQRST",
        "WXYZ"
      ],
      innerSelectBank: "",
      tabActive: 0,//选中的tabsindex
      bankActive: null,//选中的银行index；
      bankName: "",//选中的银行Name；
      isShowBox: false,//是否显示下拉盒子
      tableData: [],//数据
      bankType: 2,//搜素银行列表的方式：1：模糊搜索， 2：首字母检索
    }
  },
  mounted() {
    let that = this;
    document.addEventListener('click', function (e) {
      // 下面这句代码是获取 点击的区域是否包含你的菜单，如果包含，说明点击的是菜单以外，不包含则为菜单以内
      let flag = e.target.contains(document.getElementsByClassName('select-bank-input')[0])
      if (flag) {
        that.isShowBox = false
      };

    })
  },
  methods: {
    tabsBtn(tab, index) {
      this.bankType = 2;
      this.tabActive = index;
      this.getBankListFn();
    },
    focusInput(e) {
      this.isShowBox = true;
      if (this.selectName) {
        this.bankType = 1; //启用模糊搜素
      } else {
        this.bankType = 2; //启用模糊搜素
      }
      this.tabActive = 0;//模糊搜素显示在常用tab
      this.getBankListFn(this.selectName);
    },
    selectBankBtn(item, index) {
      this.bankActive = index;
      this.selectName = item.bankName;
      this.isShowBox = false;
    },
    changeBankName(val) {
      // alert("da");
      // this.isShowBox = true;
      if (val) {
        this.bankType = 1; //启用模糊搜素
      } else {
        this.bankType = 2; //启用搜字母搜索
      }
      this.tabActive = 0;//模糊搜素显示在常用tab
      this.getBankListFn(val);
    },
    getBankListFn(val) {
      let that = this;
      let bankName = "", bankType = "", bankTab = "";
      bankName = val;
      bankType = this.bankType;
      if (bankType == 2) {
        bankName = String(this.tabActive);
      }
      // this.st = setTimeout(() => {
      // }, 600);

      this.st && clearTimeout(this.st);
      let trigger = this.delayFn(() => {
        this.getBanksByName(bankName, bankType).then(res => {
          if (this.successCheckCode(res)) {
            this.tableData = res.data;
          }
        })
      }, 500);
      trigger();
    },

  },
}
</script>
<style lang="scss" scoped>
.select-bank-input {
  position: relative;

  .select-bank-input-box {
    position: absolute;
    z-index: 1000;
    background-color: #fff;
    width: 130%;
    padding-top: 10px;
    box-shadow: 0 0 5px #2d2d2d1c;
    margin-top: 8px;

    .select-bank-input-tabs {
      padding: 0 10px;
      border-bottom: 1px solid #02adff;
      white-space: nowrap;

      &-item {
        cursor: pointer;
        border: 1px solid #80808038;
        float: left;
        /* display:inline-block; */
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: grey;
        border-bottom: none;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;

        &:hover {
          color: #02adff;
        }
      }

      .tabs-active {
        color: #02adff;
        border: 1px solid #02adff;
        border-bottom: 1px solid white;
        position: relative;

        &::before {
          content: "";
          display: block;
          width: 100%;
          height: 2px;
          position: absolute;
          left: 0px;
          bottom: -2px;
          background-color: #fff;
          z-index: 10;
        }
      }
    }

    .select-bank-input-content {
      width: 100%;
      padding: 10px 10px 0;
      height: 260px;
      overflow-y: scroll;

      &-item {
        cursor: pointer;
        float: left;
        width: 33.3%;
        height: 50px;
        line-height: 50px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 10px;
        &:hover {
          color: #02adff;
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
    .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */
 {
  opacity: 0;
}
.is-reverse {
  transform: rotateZ(180deg);
}
</style>
<!-- <style>
.el-scrollbar .el-scrollbar__wrap .el-scrollbar__view .select-bank-input-tabs{
   white-space: nowrap;
}
</style> -->