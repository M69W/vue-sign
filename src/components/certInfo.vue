<template>
  <div class="certInfo">
    <!--<div>证照信息上传</div>-->
    <ul class="clearfix">
      <li class="Uploadfiles"
          v-for="(item, key) in certInfoList"
          :key="key">
        <span v-if="path != 'addukeysign'">
          <div class="filename"
               v-if="item.certificateId <= 5">
            {{ item.certificateName
                        }}<a href="../../static/image/企业电子印章申请表及用户责任书.docx"
               class="download"
               v-if="item.certificateId == 5">下载申请书模板</a>
            <span class="file-name-tips">{{
                            item.certificateTips
                                ? "(" + item.certificateTips + ")"
                                : ""
                        }}</span>
          </div>
          <!-- <span
                        class="close"
                        v-if="item.certificateId > 5"
                        @click="close(key)"
                    ></span> -->
          <!-- <el-input
                        type="text"
                        placeholder="请输入附件名称"
                        v-if="item.certificateId > 5"
                        v-model="item.certificateName"
                    ></el-input> -->
        </span>
        <span v-if="path == 'addukeysign'">
          <div class="filename"
               v-if="item.certificateId <= 102">
            {{ item.certificateName
                        }}<a href="../../static/image/个人电子印章申请表及用户责任书.docx"
               class="download"
               v-if="item.certificateId == 102">下载申请书模板</a>
          </div>
          <!-- <span
                        class="close"
                        v-if="item.certificateId > 102"
                        @click="close(key)"
                    ></span>
                    <el-input
                        type="text"
                        placeholder="请输入附件名称"
                        v-if="item.certificateId > 102"
                        v-model="item.certificateName"
                    ></el-input> -->
        </span>
        <div class="upinfo"
             v-if="item.certificateId <= 5">
          <!-- <div class="bg"
               v-show="!item.certificatePath">上传</div> -->
          <!-- <div class="imgdemo"
               id="preview"
               v-show="item.certificatePath"> -->
          <div class="imgdemo"
               id="preview">
            <!-- <span
                            class="bigpic"
                            @click="showbigpic(key)"
                            v-show="item.certificatePath"
                        ></span> -->
            <div class="inner-img"
                 :class="{ 'inner-act': item.certificatePath }">
              <div class="show-pic-box"
                   v-show="item.certificatePath"
                   @click="showbigpic(key)">
                <div class="show-pic-box-inner">
                  <img class="show-pic-box-scale"
                       src="/static/image/icon/scale_icon.svg"
                       alt="" />
                  <br />
                  <span class="show-pic-box-text">查看 </span>
                </div>
              </div>
              <img class="upimg"
                   :src="compToken(item.certificatePath)" />
            </div>
          </div>
          <div class="img-bottom">
            <div class="img-bottom-upload-show">
              <img src="/static/image/icon/upload.svg"
                   alt=""
                   class="img-bottom-upload-show-logo" />
              <span class="img-bottom-upload-show-text">
                点击上传
              </span>
            </div>
            <form :id="'ajaxForm' + key"
                  accept-charset="utf-8"
                  enctype="multipart/form-data">
              <input class="uploadinput"
                     :id="'file' + key"
                     v-on:change="changeImg($event, key)"
                     name="certificateFile"
                     type="file"
                     data-min-file-count="1" />
            </form>
          </div>
        </div>
        <div class="upinfo"
             v-if="item.certificateId > 5"
             :class="{ 'add-box': item.certificateId > 5 }">
          <div class="imgdemo">
            <div class="close"
                 v-if="
                                (item.certificateId > 5 &&
                                    path != 'addukeysign') ||
                                    (item.certificateId > 102 &&
                                        path == 'addukeysign')
                            "
                 @click="close(key)"></div>
            <div class="bg-upload"
                 v-show="!item.certificatePath">
              <div class="bg-upload-show">
                <div>
                  <img src="/static/image/icon/upload.svg"
                       alt=""
                       class="bg-upload-show-logo" />
                </div>
                <span class="bg-upload-show-text">
                  点击上传
                </span>
              </div>
            </div>
            <div class="inner-img">
              <!-- <div
                                class="show-pic-box"
                                v-show="item.certificatePath"
                                @click="showbigpic(key)"
                            >
                                <div class="show-pic-box-inner">
                                    <img
                                        class="show-pic-box-scale"
                                        src="/static/image/icon/scale_icon.svg"
                                        alt=""
                                    />
                                    <br />
                                    <span class="show-pic-box-text">查看 </span>
                                </div>
                            </div> -->
              <img class="upimg"
                   :src="compToken(item.certificatePath)" />
            </div>
            <form :id="'ajaxForm' + key"
                  accept-charset="utf-8"
                  enctype="multipart/form-data">
              <input class="uploadinput"
                     :id="'file' + key"
                     v-on:change="changeImg($event, key)"
                     name="certificateFile"
                     type="file"
                     data-min-file-count="1" />
            </form>
          </div>
          <div class="img-bottom">
            <el-input type="text"
                      placeholder="请输入附件名称"
                      v-model="item.certificateName"></el-input>
          </div>
        </div>
      </li>
      <li @click="addfiles"
          v-if="certInfoList.length < 20"
          class="Uploadfiles add-files">
        <div class="upinfo">

          <div class="bg-add">
            <div class="bg-add-btn">

            </div>
            <div class="bg-add-text">添加</div>
          </div>
        </div>
      </li>
    </ul>
    <el-dialog :visible.sync="dialogModel"
               :close-on-click-modal="false"
               :before-close="handleClose"
               id="sealmodel"
               class="sealmodel">
      <div class="clearposition">
        <div class="arrLeft arrow"
             @click="changePicture('0')">
          <i></i>
        </div>
        <div class="arrRight arrow"
             @click="changePicture('1')">
          <i></i>
        </div>
        <div class="certname">
          {{ certName }} <i @click="handleClose"></i>
        </div>
        <div class="overhidden">
          <div class="certList">
            <div class="certTrans"></div>
            <p v-if="nopicture">暂无图片信息</p>
            <img :src="compToken(sealsrc)"
                 alt="" />
          </div>
        </div>
      </div>
      <div id="bottomBtns">
        <div class="flowhiden">
          <ul class="fl switch">
            <li class="pre"
                @click="changePicture('0')"><i></i></li>
            <li class="next"
                @click="changePicture('1')">
              <i></i>
            </li>
          </ul>
          <ul class="fr operatorBtns">
            <li class="narrow"
                @click="certEnlarge('-1')"
                title="缩小">
              <i></i>
            </li>
            <li class="refresh"
                @click="certEnlarge('0')"
                title="恢复缩放">
              <i></i>
            </li>
            <li class="changebig"
                @click="certEnlarge('1')"
                title="放大">
              <i></i>
            </li>
            <li class="reupload"
                @click="resubmit"
                title="重新上传">
              <i></i>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import base from "../modules/contract/mixin/base.js";
export default {
  mixins: [base],
  components: {},
  props: ["parentCertList"],
  data() {
    return {
      path: "",
      certName: "",
      times: 1,
      nopicture: false,
      eve: "",
      dialogModel: false,
      sealsrc: "",
      ind: "",
      uploadind: "",
      certInfoList: [],
      imgInfo: {
        height: "",
        width: ""
      }
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.path = this.$route.path.match(/([^/]+)$/)[1];
    this.certInfoList = this.parentCertList;
    console.log(this.certInfoList);
  },
  methods: {
    addfiles() {
      var info = {
        certificateId: "",
        certificatePath: "",
        certificateName: ""
      };
      if (this.path == "addukeysign") {
        info.certificateId = String(this.certInfoList.length + 100);
      } else {
        info.certificateId = String(this.certInfoList.length);
      }
      this.certInfoList.push(info);
      if (this.certInfoList.length == 20) {
        this.$message({
          type: "warning",
          message: "上传证件信息不超过20个"
        });
      }
    },
    close(key) {
      this.certInfoList.splice(key, 1);
      // console.log(key,this.certInfoList)
    },
    handleClose() {
      this.dialogModel = false;
    },
    resubmit() {
      var ind = this.ind;
      this.dialogModel = false;
      this.certInfoList[ind].certificatePath = "";
    },
    showbigpic(ind) {
      this.ind = ind;
      this.dialogModel = true;
      this.nopicture = false;
      this.certName = this.certInfoList[ind].certificateName;
      this.sealsrc = this.certInfoList[ind].certificatePath;
      this.$nextTick(() => {
        var clientHeight = document.body.clientHeight - 50 - 40;
        $(".certList").css({ height: clientHeight });
        $(".certList img").css({ height: clientHeight });
        $(".overhidden").css({ height: clientHeight });
        var img_url = this.sealsrc;
        var img = new Image();
        img.src = img_url;
        if (img_url == "" || !img_url) {
          this.nopicture = true;
          return;
        }
        this.imgInfo.height = img.height;
        this.imgInfo.width = img.width;
        this.pictureDrag();
      });
    },
    changeImg(event, ind) {
      this.eve = event;
      if (!$(event.target).val()) {
        return;
      }
      this.uploadind = ind;
      var regFile, fileType, fileName;
      var file = document.getElementById("file" + ind);
      if (!file.files) {
        var ret = file.value.split("\\");
        fileName = ret[ret.length - 1];
        fileType = fileName.split(".");
        fileType = fileType[fileType.length - 1];
        regFile = /(png|jpg)(\?.*)?$/;
      } else {
        fileType = file.files[0].type;
        fileName = file.files[0].name;
        regFile = /(image\/\jpe?g)|(image\/\png)/;
        if (file.files[0].size > 5 * 1024 * 1024) {
          this.$message({
            message: "请上传5M以内的文件",
            type: "warning"
          });
          $(event.target).val("");
          return;
        }
      }
      if (!regFile.test(fileType)) {
        this.$message({
          message: "请上传jpg、png格式的图片",
          type: "warning"
        });
        $(event.target).val("");
        return;
      }
      var url = "/order/enterprise/certificate/file/upload";
      var dom = "ajaxForm" + ind;
      this.postFileImageUpload2(dom, url, this.cbSuccess, this.cbError);
      $(event.target).val("");
    },
    cbSuccess(data) {
      if (this.successCheckCode(data)) {
        var ind = this.uploadind;
        this.certInfoList[ind].certificatePath =
          data.data.certificateFilePath;
      }
    },
    cbError() {
      var event = this.eve;
      $(event.target).val("");
    },
    checkCertList() {
      var certList = this.certInfoList;
      for (let i = 0; i < certList.length; i++) {
        if (!certList[i].certificatePath) {
          this.$message({
            type: "error",
            message: "请将证件信息补充完全"
          });
          return false;
        }
        if (!certList[i].certificateName) {
          this.$message({
            type: "error",
            message: "请将证件信息名称补充完整"
          });
          return false;
        }
      }
      return true;
    }
  }
};
</script>
<style lang="scss">
.certInfo {
  .dialog-footer {
    padding: 0;
  }
  > div {
    line-height: 40px;
    font-weight: 700;
  }
  li.Uploadfiles {
    // position: relative;
    float: left;
    margin-right: 30px;
    .upinfo {
      // width: 140px;
      // height: 140px;
      // background: #cdcdcd;
      border-radius: 8px;
      cursor: pointer;
      position: relative;
      .imgdemo {
        display: block;
        // width: 138px;
        // height: 138px;
        // line-height: 135px;
        border: 1px solid #e8ecef;
        width: 220px;
        height: 140px;
        padding: 17px 25px;
        text-align: center;
        border-bottom: none;
        position: relative;
        .inner-img {
          width: 100%;
          height: 100%;
          background-color: #d6d6d6;
          position: relative;
          border-radius: 4px;
        }
        .inner-act {
          background-color: #fff;
          opacity: 1;
        }
        img.upimg {
          // max-width: 134px;
          // max-height: 134px;
          max-width: 100%;
          max-height: 100%;
        }
        .show-pic-box {
          width: 100%;
          height: 100%;
          position: absolute;
          opacity: 0.4;
          background: #333333;
          .show-pic-box-inner {
            position: absolute;
            width: 100%;
            height: 42px;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
          }
          &-scale {
            margin-bottom: 4px;
          }
          &-text {
            color: #fff;
            font-size: 12px;
          }
          // .bigpic {
          //     display: inline-block;
          //     // height: 140px;
          //     // width: 140px;
          //     // width: 100%;
          //     // height: 100%;
          //     opacity: 0;
          //     position: absolute;
          //     z-index: 9;
          //     left: 0;
          //     top: 0;
          // }
        }
      }
      .img-bottom {
        width: 100%;
        background-color: #fafafa;
        position: relative;
        border: 1px dashed #e8ecef;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        .uploadinput {
          position: absolute;
          // width: 140px;
          // height: 140px;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          padding: 0;
          overflow: hidden;
          opacity: 0;
          font-size: 0;
          cursor: pointer;
        }
        &-upload-show {
          text-align: center;
          line-height: 40px;
          height: 40px;
          &-logo {
            width: 16px;
            height: 14px;
            margin-right: 7px;
          }
          &-text {
            font-size: 12px;
            color: #999;
          }
          &:hover {
            background-color: red;
          }
        }
      }
    }
    .add-box {
      margin-top: 40px;
      .imgdemo {
        position: relative;
        background: #fafafa;
        .bg-upload {
          width: 100%;
          height: 40px;
          text-align: center;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          z-index: 1;
          &-show {
            &-logo {
              width: 16px;
              height: 14px;
            }
            &-text {
              font-size: 12px;
              color: #999;
            }
          }
        }
        .inner-img {
          background: #fafafa;
          opacity: 1;
        }
      }
      .img-bottom {
        height: 42px;
        width: 100%;
        background-color: #fff;
        .el-input {
          height: 100%;
          width: 100%;
          input {
            border-radius: 0;
            padding: 0;
            padding-left: 5px;
            margin: 0;
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
      .uploadinput {
        position: absolute;
        // width: 140px;
        // height: 140px;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        padding: 0;
        overflow: hidden;
        opacity: 0;
        font-size: 0;
        z-index: 1;
        cursor: pointer;
      }
    }
    .filename {
      line-height: 40px;
      font-size: 14px;
      color: #626262;
      .download {
        float: right;
        color: #019efd;
        text-decoration: underline;
      }
    }
    .file-name-tips {
      font-size: 12px;
      color: #3f3f3f;
    }
    .close {
      position: absolute;
      top: -16px;
      right: -16px;
      width: 32px;
      height: 32px;
      background: url("/static/image/icon/shanchu.svg") no-repeat center;
      z-index: 999;
      cursor: pointer;
      // &:hover {
      //     background-image: url(../../static/image/close_active.png);
      // }
    }
  }
  li {
    float: left;
    width: 220px;
    margin-bottom: 10px;
    .upinfo {
      // width: 140px;
      // height: 140px;
      // background: #cdcdcd;
      // border: 1px dashed #979797;
      border-radius: 8px;
      // .bg {
      //     background: #ffffff url(../../static/image/icon_add_hover.svg)
      //         50% 40px no-repeat;
      //     width: 138px;
      //     height: 138px;
      //     display: inline-block;
      //     border-radius: 8px;
      //     text-align: center;
      //     line-height: 178px;
      //     font-size: 12px;
      //     color: #999;
      //     cursor: pointer;
      // }
    }
    .el-input {
      width: 140px;
      .el-input__inner {
        height: 30px;
        margin: 5px 0;
      }
    }
  }
  li.add-files {
    .upinfo {
      margin-top: 40px;
      height: 180px;
      width: 100%;
      background: #fafafa;
      border: 1px dashed #c0ccda;
      border-radius: 4px;
      border-radius: 4px;
      position: relative;
      .bg-add {
        height: 36px;
        width: 100%;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        text-align: center;
        &-btn {
          background: url(../../static/image/icon_add_hover.svg) 50% 0px
            no-repeat;
          background-size: 16px 16px;
          height: 16px;
          width: 100%;
        }
        &-text {
          margin-top: 4px;
          font-size: 12px;
          color: #999999;
        }
        // background-size: 16px 16px;
        // display: inline-block;
        // border-radius: 8px;
        // width: 100%;
        // height: 100%;
        // margin: 0 auto;
        // text-align: center;
        // line-height: 180px;
        // font-size: 12px;
        // color: #999;
        // cursor: pointer;
      }
    }
  }
  .sealmodel {
    .certname {
      height: 40px;
      line-height: 40px;
    }
    .clearposition {
      height: 100%;
      width: 100%;
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.8);
      .overhidden {
        overflow: hidden;
      }
      .arrow {
        height: 168px;
        width: 40px;
        position: absolute;
        z-index: 9999999;
        background: #999;
        border-radius: 10px;
        cursor: pointer;
        i {
          display: inline-block;
          width: 18px;
          height: 33px;
          margin: 0 auto;
          position: absolute;
          top: 50%;
          margin-top: -16px;
          margin-left: -9px;
        }
      }
      .arrLeft {
        left: 60px;
        top: 50%;
        margin-top: -84px;
      }
      .arrRight {
        right: 60px;
        top: 50%;
        margin-top: -84px;
      }
      .arrLeft i {
        background: url(../../static/image/arrow_left.png) no-repeat;
      }
      .arrRight i {
        background: url(../../static/image/arrow_right.png) no-repeat;
      }
    }
    .certList {
      position: relative;
      width: 100%;
      height: 100%;
      p {
        margin-top: 250px;
      }
    }
    .el-dialog {
      width: 600px;
      height: 690px;
      background: transparent;
      text-align: center;
      top: 50% !important;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        position: relative;
        height: 100%;
        width: 100%;
        img {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          margin: auto;
          max-width: 100%;
          max-height: 100%;
        }
      }
      .el-dialog__footer {
        padding: 0;
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
      }
      img {
        max-width: 426px;
        max-height: 590px;
      }
    }
  }
}
</style>
