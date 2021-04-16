<template>
  <div class="slide-fixed">
    <div class="inner">
      <div class="inner-inner">
        <div class="mention">
          请完成安全验证
        </div>
        <div class="wrap">
          <!--No-Captcha渲染的位置，其中 class 中必须包含 nc-container-->
          <!-- 注释阿里云验证服务相关dom -->
          <!-- <div id="your-dom-id"
               class="nc-container"></div> -->
          <div class="code">
            <div class="icon"></div>
            <div class="code-inp"><input v-model="code" class="inp" type="text"  required placeholder="请输入验证码"></div>
            <div class="code-show" @click="getCode()">
                <img class="code-img" :src="imgSrc" alt="">
            </div>
            <div class="btn" @click="checkCode">确认</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "../assets/mixin/service";
export default {
  mixins:[service],
  components: {},
  props: {},
  data() {
    return {
      imgSrc: '',
      uuid:'',
      code:''
    };
  },
  created() { },
  mounted() {
    // this.init();  因为没钱暂时注释阿里云的验证服务api
    this.getCode();
  },
  methods: {
    /* init() {
      let _self = this;
      var nc_token = [
        "FFFF0N00000000007E59",
        new Date().getTime(),
        Math.random()
      ].join(":");
      var NC_Opt = {
        renderTo: "#your-dom-id",
        appkey: "FFFF0N00000000007E59",
        scene: "nc_other",
        token: nc_token,
        customWidth: 400,
        trans: { key1: "code0" },
        elementID: ["usernameID"],
        is_Opt: 0,
        language: "cn",
        isEnabled: true,
        timeout: 3000,
        times: 5,
        apimap: {},
        callback: function (data) {
          _self.afsCheck(data);
        }
      };
      var nc = new noCaptcha(NC_Opt);
      nc.upLang("cn", {
        _startTEXT: "向右拖动滑块完成验证",
        _yesTEXT: "验证通过",
        _error300:
          '哎呀，出错了，点击<a href="javascript:__nc.reset()">刷新</a>再来一次',
        _errorNetwork:
          '网络不给力，请<a href="javascript:__nc.reset()">点击刷新</a>'
      });
    },
    afsCheck: function (data) {
      let sData = {
        sessionId: data.csessionid,
        sig: data.sig,
        token: data.token,
        scene: "nc_other"
      };
      console.log(sData);
      this.$emit("checked-ok", false);
    } */

    getCode(){
      this.getSecurityCode().then(res => {
        // console.log(res);
        if(res.code == 0){
          this.imgSrc = res.data.img;
          this.uuid = res.data.uuid;
        }else{
          // console.log(res.msg);
          this.$message({
            message: res.msg,
            type: 'warning',
            duration: 1500
          })
        }
      })
    },
    checkCode(){
      // console.log(this.code);
      if(!this.code){
        this.$message({
          message: '验证码不能为空',
          type: 'warning',
          duration: 1500,
        });
        return;
      }
      
      let data = {
        uuid: this.uuid,
        code: this.code
      };
        
      this.checkSecurityCode(data).then( res => {
        // console.log(res);
        if(res.code == 0){
         this.$emit("checked-ok", false);
        }else{
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1500
          })
          this.getCode();
          this.code='';
        }
      });
    }
  }
};
</script>
<style lang="scss">
.slide-fixed {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  .inner {
    width: 1200px;
    position: relative;
    margin: 0 auto;
    .inner-inner {
      position: absolute;
      width: 420px;
      height: 160px;
      top: 300px;
      right: 70px;
      background: #fff;
      border-radius: 8px;
    }
  }
  .wrap {
    width: 400px;
    position: relative;
    margin: 0 auto;
    margin-top: 20px;
    .code{
      width: 100%;
      height: 100%;
      position: relative;
      .icon{
        width: 40px;
        height: 40px;
        background-color: skyblue;
        position: absolute;
        left: 0;
        background: url('../../static/image/icon/security.svg') no-repeat 10px;
        background-size: 30px 30px;
      }
      .code-inp input{
        padding-left: 45px;
        padding-right: 115px;
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        outline: none;
        border: none;
        border-bottom: 1px solid #ccc;
      }
      .code-show{
        width: 100px;
        height: 40px;
        background-color: skyblue;
        position: absolute;
        right: 0;
        top: 0;
        .code-img{
          width: 100%;
          height: 100%;
        }
      }
      .btn{
        width: 200px;
        height: 30px;
        border-radius: 15px;
        margin: 0 auto;
        margin-top: 10px;
        border: 1px solid #ccc;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .mention {
    color: #333;
    margin-top: 14px;
    font-size: 16px;
    padding-left: 10px;
    border-bottom: solid 1px #eee;
    padding-bottom: 14px;
  }
  #your-dom-id.nc-container .nc_scale {
    background-color: #fff; /*默认背景色*/
    height: 40px;
    line-height: 40px;
    /*opacity: .5;*/
    border-radius: 4px;
    overflow: hidden;
    border: solid 1px #99a9bf;
    color: #333;
  }
  .nc-container .nc_scale span {
    height: 40px;
  }
  /*默认字体颜色*/
  #your-dom-id.nc-container
    .scale_text.scale_text.slidetounlock
    span[data-nc-lang="_startTEXT"] {
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(0, #333),
      color-stop(0.4, #7a7a7a),
      color-stop(0.5, #fff),
      color-stop(0.6, #7a7a7a),
      color-stop(1, #333)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-animation: slidetounlock 3s infinite;
    -webkit-text-size-adjust: none;
  }
  #your-dom-id.nc-container .nc_scale div.nc_bg {
    /*background-color: rgba(192,204,218,.5); //滑过时的背景色*/
  }
  #your-dom-id.nc-container .nc_scale .nc_iconfont.btn_slide {
    background-color: transparent;
    color: transparent;
    background-image: url(../../static/image/push.svg);
    background-size: 100%;
    margin-top: -1px;
    margin-left: -1px;
  }
  #your-dom-id.nc-container .nc_scale .btn_ok {
    font-size: 20px;
    color: #4a90e2;
  }
  #your-dom-id.nc-container .nc_scale .scale_text2 {
    color: #fff; //滑过时的字体颜色
  }
  #your-dom-id.nc-container .nc_scale span {
    color: #fff;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }
}
</style>