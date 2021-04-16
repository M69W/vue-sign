<template>
  <div>
    <!-- 验证码容器 -->
    <components
      v-if="componentType"
      :is="componentType"
      :type="verifyType"
      :figure="figure"
      :arith="arith"
      :width="width"
      :height="height"
      :fontSize="fontSize"
      :codeLength="codeLength"
      :mode="mode"
      :vOffset="vOffset"
      :vSpace="vSpace"
      :explain="explain"
      :imgUrl="imgUrl"
      :imgName="imgName"
      :showButton="showButton"
      :imgSize="imgSize"
      :blockSize="blockSize"
      :barSize="barSize"
      :defaultNum="defaultNum"
      :checkNum="checkNum" 
      :showPanel="showPanel"
      @close = "close"
      ref="instance"
    ></components>

    <!--确定按钮容器 -->
    <div @click="checkCode" v-show="showButton" style="width:0; height:0;">
      <slot name="check">
        <button class="verify-btn">{{i18n('ok')}}</button>
      </slot>
    </div>
  </div>
</template>

<script>
/**
 * verify 验证码组件
 * */
import VerifyPoints from "./components/VerifyPoints"; // 引入选字验证码组件
export default {
  name: "Verify",
  components: {
    VerifyPoints
  },
  props: {
    // 双语化
    locale: {
      require: false,
      type: String,
      default() {
        // 默认语言不输入为浏览器语言
        var language;
        if (navigator.language) {
          language = navigator.language;
        } else {
          language = navigator.browserLanguage;
        }
        return language;
      }
    },
    type: {   // 采用验证码的类型 目前只有选字验证
      type: [String, Number],
      require: false,
      default: "pick"
    },
    figure: {
      type: Number
    },
    arith: {
      type: Number
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    fontSize: {
      type: String
    },
    codeLength: {
      type: Number
    },
    mode: {
      type: String
    },
    vOffset: {
      type: Number
    },
    vSpace: {
      type: Number
    },
    explain: {
      type: String
    },
    imgUrl: {   // 图片的路径
      type: String
    },
    imgName: {  // 图片的名字
      type: Array
    },
    imgSize: {   // 图片的大小
      type: Object
    },
    blockSize: {
      type: Object
    },
    barSize: {
      type: Object
    },
    //默认的文字数量
    defaultNum: {
      type: Number
    },
    //校对的文字数量
    checkNum: {
      type: Number
    },
    showButton: {  // 是否显示底部按钮
      type: Boolean,
      default: true
    },
    showPanel:{    // 是否显示蒙版，主要用于关闭按钮
      type:Boolean,
      default: true   
    }
  },

  data() {
    return {
      // 内部类型
      verifyType: undefined
    };
  },
  methods: {
    /**
     * i18n
     * @description 兼容vue-i18n 调用$t来转换ok
     * @param {String} text-被转换的目标
     * @return {String} i18n的结果
     * */
    i18n(text) {
      if (this.$t) {
        return this.$t(text);
      } else {
        // 兼容不存在的语言
        let i18n =
          this.$options.i18n.messages[this.locale] ||
          this.$options.i18n.messages["en-US"];
        return i18n[text];
      }
    },
    /**
     * checkCode
     * @description 判断验证码
     * */
    checkCode() {
        // 点击确定按钮，检测验证码,
      if (this.instance.checkCode) {
        this.instance.checkCode();
      }
    },
    /**
     * refresh
     * @description 刷新
     * */
    refresh() {
      if (this.instance.refresh) {
        this.instance.refresh();
      }
    },
    close(){
      this.$emit('close')
    }
  },
  computed: {
    // 获取当前验证码容器实例
    instance() {
      return this.$refs.instance || {};
    }
  },
  watch: {
    type: {  // 监听type属性， 动态修改验证码容器需要显示的验证码类型
      immediate: true,
      handler(type) {
        switch (type.toString()) {
          /* case 'picture':
                            this.verifyType = '1'
                            this.componentType = 'VerifyCode'
                            break
                        case '1':
                            this.verifyType = '1'
                            this.componentType = 'VerifyCode'
                            break
                        case 'compute':
                            this.verifyType = '2'
                            this.componentType = 'VerifyCode'
                            break
                        case '2':
                            this.verifyType = '2'
                            this.componentType = 'VerifyCode'
                            break
                        case 'slide':
                            this.verifyType = '1'
                            this.componentType = 'VerifySlide'
                            break
                        case '3':
                            this.verifyType = '1'
                            this.componentType = 'VerifySlide'
                            break
                        case 'puzzle':
                            this.verifyType = '2'
                            this.componentType = 'VerifySlide'
                            break
                        case '4':
                            this.verifyType = '2'
                            this.componentType = 'VerifySlide'
                            break */
          case "pick":
            this.verifyType = "";
            this.componentType = "VerifyPoints";
            break;
          case "5":
            this.verifyType = "";
            this.componentType = "VerifyPoints";
            break;
          default:
            this.verifyType = undefined;
            this.componentType = undefined;
            console.error("Unsupported Type:" + type);
        }
      }
    }
  },
  i18n: {
    messages: {
      "en-US": {
        ok: "ok"
      },
      "zh-CN": {
        ok: "确定"
      }
    }
  }
};
</script>

<style>
.verify-btn {
        width: 200px;
        height: 30px;
        background-color: #337AB7;
        color: #FFFFFF;
        border: none;
        margin-top: 10px;
    } 


    /*滑动验证码*/
    .verify-bar-area {
        position: relative;
        background: #FFFFFF;
        text-align: center;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        border: 1px solid #ddd;
        -webkit-border-radius: 4px;
    }

    .verify-bar-area .verify-move-block {
        position: absolute;
        top: 0px;
        left: 0;
        background: #fff;
        cursor: pointer;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        box-shadow: 0 0 2px #888888;
        -webkit-border-radius: 1px;
    }

    .verify-bar-area .verify-move-block:hover {
        background-color: #337ab7;
        color: #FFFFFF;
    }

    .verify-bar-area .verify-left-bar {
        position: absolute;
        top: -1px;
        left: -1px;
        background: #f0fff0;
        cursor: pointer;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        border: 1px solid #ddd;
    }
    .verify-img-out{
      position: relative;
    }
    .verify-img-panel {
        margin: 0;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        /* border: 1px solid #ddd; */
        border-radius: 3px;
        position: relative;
    }
    .verify-control{
        position: absolute;
        width: 40px;
        height: 100%;
        top: 0;
        right: 2px;
    }
    .verify-refresh .icon-refresh,.verify-close .icon-close{
      position: relative;
      cursor: pointer;
    }
    .verify-refresh .icon-refresh::before {
        content: "";
        width: 14px;
        height: 14px;
        border: 1px solid #b7b7b7;
        border-top: 1px solid transparent;
        border-radius: 100%;
        position: absolute;
        top: 5px;
        left: -16px;
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
    }
    .verify-refresh .icon-refresh::after {
        content: "";
        border: 4px solid #b7b7b7;
        border-right: 4px solid transparent;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        position: absolute;
        right: 0px;
        top: 2px;
    }
    .verify-close .icon-close::after{
      content: 'X';
      position: absolute;
      width: 14px;
      right: -18px;
      font-size: 18px;
      color: #b7b7b7;
    }
    .verify-img-panel .verify-gap {
        background-color: #fff;
        position: relative;
        z-index: 2;
        border: 1px solid #fff;
    }

    .verify-bar-area .verify-move-block .verify-sub-block {
        position: absolute;
        text-align: center;
        z-index: 3;
        border: 1px solid #fff;
    }

    .verify-bar-area .verify-move-block .verify-icon {
        font-size: 18px;
    }

    .verify-bar-area .verify-msg {
        z-index: 3;
    } 
</style>