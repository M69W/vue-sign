<template>
  <div class="upload">
    <!-- <span style="color: #999; font-size: 12px;"
            >照片仅限jpeg、jpg、png格式且大小不超过10M。</span
        > -->
    <!-- <div class="tips-top">
    </div> -->
    <slot name="tips-top"
          class="tips-top"> </slot>
    <span v-if="title">{{ title }}
      <span style="color:font-size: 13px;color: #FA6400;margin-left:6px;"
            class="tips-title">{{tips}}</span>
    </span>
    <div class="contain-upload"
         :class="uploadClass"
         :style="'backgroundImage:url('+bgi+')'">
      <img src=""
           :id="show"
           alt=""
           class="show-img"
           v-if="fileTarget" />
      <img :src="preUrl + dialogVisibleSrc"
           alt=""
           class="show-img"
           v-else />
      <div class="inner-show">
        <div class="inner-show-mask"
             v-show="hasImage"></div>
        <span class="up-icon">
          <i></i>
          <br />
          <span>{{ hasImage ? "重新上传" : "点击上传" }}</span>
        </span>
        <input type="file"
               class="upfile"
               :id="uploadLicencePic"
               @change="uploadFile($event, 'uploadForm')"
               accept="image/jpg,image/jpeg,image/png" />
      </div>
    </div>
    <slot name="tips-bottom"></slot>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: "normal",
    },
    defaultImg: {
      type: [File, String],
      default: () => {
        return "";
      },
    },
    bgi: '', //背景图
    title: "",
    tips: "",//标题后的提示信息
    preUrl: "", //图片前缀地址--详情返回orz后台要求
  },
  computed: {
    uploadClass() {
      let obj = {
        "upload-normal": this.size === "normal",
        "upload-small": this.size === "small",
      };
      return obj;
    },
  },
  watch: {
    defaultImg() {
      // this.fileTarget = this.value;
      this.dialogVisibleSrc = this.defaultImg;
      if (this.defaultImg) {
        this.hasImage = true;
      } else {
        this.hasImage = false;
      }
      // document.getElementById('show').src = this.value;
      // this.changepic(this.value);
    },
  },
  data() {
    return {
      fileTarget: "", //file数据类型图片地址--本地上传
      // dialogVisible: false,
      dialogVisibleSrc: "", //http类型得知
      hasImage: false,
      // title: "",
      uploadLicencePic: "uploadLicencePic" + this._uid,
      show: "show" + this._uid, //图片IMG预览id
    };
  },
  methods: {
    uploadFile($event, uploadForm) {
      console.log("zx");
      let fileType,
        fileSize,
        fileList = ["jpg", "jpeg", "png"],
        maxFileSize = 1024 * 1024 * 5;
      let file = document.getElementById(this.uploadLicencePic);
      let fileTarget, fileName;
      if (!file.files) {
        let ret = file.value.split("\\");
        let imageName = ret[ret.length - 1];
        let temp = imageName.split(".");
        fileType = temp[temp.length - 1];
      } else {
        fileTarget = $event.target.files[0];
        let tempArr = fileTarget.name.split(".");
        fileName = tempArr[0];
        fileType = tempArr[tempArr.length - 1];
        fileSize = fileTarget.size;
      }
      if (
        !fileType.toLowerCase ||
        fileSize > maxFileSize ||
        !fileList.includes(fileType.toLowerCase())
      ) {
        let msg = fileSize > maxFileSize ? '请上传5M以内的文件' : '请上传jpeg、jpg、png格式的图片'
        this.$message({
          showClose: true,
          message: msg,
          type: "warning",
        });
        $event.target.value = '';
      } else {
        this.fileTarget = fileTarget;
        this.hasImage = true;
        this.changepic(fileTarget);
        this.$emit("input", fileTarget);
        this.$emit('change', true);
        // const QINIU__UPLOAD_URL =
        //     window.location.protocol === 'http:'
        //         ? 'http://up-z2.qiniu.com'
        //         : 'https://up-z2.qbox.me';
        // let formData = new FormData();
        // formData.append('key', fileName);
        // formData.append('token', this.qiniuToken);
        // formData.append('file', fileTarget);
        // $.ajax({
        //     url: QINIU__UPLOAD_URL,
        //     type: 'post',
        //     data: formData,
        //     contentType: false,
        //     processData: false,
        //     success: (data) => {
        //         this.$message.success('上传成功');
        //         this.$emit('baseMapPath', data.key);
        //     },
        //     error: (data) => {
        //         console.log(data);
        //     }
        // });
      }
    },
    changepic(obj) {
      //console.log(obj.files[0]);//这里可以获取上传文件的name
      let newsrc = this.getObjectURL(obj);
      this.dialogVisibleSrc = newsrc;
      this.$nextTick(() => {
        document.getElementById(this.show).src = newsrc;
      });
    },
    //建立一個可存取到該file的url
    getObjectURL(file) {
      let url = null;
      // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
      if (window.createObjectURL !== undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    // previewFn() {
    //     this.dialogVisible = true;
    // },
    // changeTitle(val) {
    //     console.log("xxtitle", val);
    // },
  },
};
</script>
<style lang="scss" scoped>
@import "./src/assets/css/mixin";
.upload {
  .contain-upload {
    background-position: center;
    background-size: contain;
  }
  .upload-normal {
    width: 260px;
    height: 252px;
    border-radius: 16px;
    background: rgba(40, 40, 40, 0.3);
    margin-top: 10px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
  }
  .upload-small {
    width: 280px;
    height: 180px;
    border-radius: 16px;
    background: rgba(40, 40, 40, 0.3);
    margin-top: 10px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
  }
  .tips-top {
    vertical-align: baseline;
    line-height: 0;
    height: 10px;
    margin-bottom: 20px;
  }
  .tips-title {
    font-size: 13px;
    white-space: nowrap;
    position: absolute;
    @include ellipsis();
  }
  .up-icon {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    i {
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url(../../static/image/Fill1.svg) no-repeat;
    }
  }
  .upfile {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .tips-bottom {
    margin-top: 20px;
  }

  .show-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .inner-show {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    &-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #282828;
      opacity: 0.3;
    }
  }
}
</style>
