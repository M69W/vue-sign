<template>
    <div class="addcloudsign">
        <div class="top-title clearfix">
            <div class="titinfo">添加云签名</div>
        </div>
        <el-form class="clearfix" :model="formData" :rules="rules" label-position="top" ref="formTab" autocomplete="off"><!-- :rules="rules"-->
            <el-col>
                <el-form-item label="签名名称">
                    <input type="text" class="el-input__inner" @blur="showSignatureName" v-model.trim="formData.signatureName" placeholder="请输入签名名称">
                </el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="创建方式">
                    <el-radio-group v-model="formData.createMode" @change="signChange">
                        <el-radio :label="1">手绘签名</el-radio>
                        <el-radio :label="2">本地上传 <span style="font-size:12px;color:#999;">(需审核)</span></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="上传签名" v-if="formData.createMode == 1 ">
                    <div class="code-uploader">
                        <img class="code-uploader-img" v-if="codeUploaderImg && formData.createMode == 1" :src="compToken(codeUploaderImg)">
                        <div id="qrcode" style="width: 140px;height: 140px;margin: 0 auto;" v-if="formData.createMode == 1"></div>
                    </div>
                    <div class="uploader-tips">请打开手机扫一扫二维码，绘制印章5分钟内有效。</div>
                </el-form-item>
                <el-form-item class="sign-uploader" label="上传签名" v-else>
                    <div class="avatar-uploader">
                        <div class="el-upload el-upload--text" v-loading="loading" element-loading-text="正在上传...">
                            <img v-if="formData.signatureFilePath" :src="compToken(formData.signatureFilePath)" :style="{'width':previewImgW, 'height':previewImgH, 'margin-top':previewImgMT, 'margin-left':previewImgML}" class="previewImg">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <input type="file" id="fileipt1" name="file" class="el-upload__input" @change="handleChange($event)">
                        </div>
                    </div>
                    <div class="uploader-tips">仅支持png、jpg、bmp，文件≤2M以内</div>
                </el-form-item>
            </el-col>
        </el-form>
        <div class="footbtn">
            <el-button @click="cancel()">取消</el-button>
            <el-button @click="submitform('formTab')" :loading="btnLoding" type="primary">提交</el-button>
        </div>


        <el-dialog title="上传云签名" class="cropper-dialog" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <div class="cropper-dialog-body">
                <div class="cropper-content clearfix">
                    <div class="cropper">
                        <div style="margin-bottom: 8px;">签名图片</div>
                        <vueCropper
                            ref="cropper"
                            :img="option.img"
                            :outputSize="option.size"
                            :outputType="option.outputType"
                            :info="true"
                            :full="option.full"
                            :canMove="option.canMove"
                            :canMoveBox="option.canMoveBox"
                            :original="option.original"
                            :autoCrop="option.autoCrop"
                            :autoCropWidth="option.autoCropWidth"
                            :autoCropHeight="option.autoCropHeight"
                            :fixedBox="option.fixedBox"
                            @realTime="realTime"
                            @imgLoad="imgLoad"
                        ></vueCropper>
                    </div>
                    <div class="show-preview">
                        <div style="margin-bottom: 8px;">章模预览</div>
                        <!--<div :style="previews.div" class="preview">
                            <img :src="previews.url" :style="previews.img">
                        </div>-->
                        <div class="preview" :style="'background-image: url(' + base64Img + ')'"></div>
                        <div class="imgInfo">
                            <div class="seal-size-tips">印章宽高：<span>大小不超过100x100mm</span></div>
                            <div class="seal-size-ipt">
                                <span>宽<el-input v-model="imgInfoW" size="small" @blur="changeVal"></el-input> mm</span>
                                <span>高<el-input v-model="imgInfoH" size="small" @blur="changeVal"></el-input> mm</span>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="footer-btn">
                    <div class="scope-btn">
                        <label class="btn" for="fileipt2">更换图片</label>
                        <input type="file" id="fileipt2" name="file" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/bmp, image/jpg" @change="handleChange2($event)">
                        <button  @click="changeScale(1)">+</button>
                        <button  @click="changeScale(-1)">-</button>
                        <button  @click="rotateLeft">↺</button>
                        <button  @click="rotateRight">↻</button>
                    </div>
                    <div class="uploader-tips">说明：只支持png、jpg、bmp；</div>
                </div>
                <div class="upload-btn">
                    <el-button @click="cancelDialog">取消</el-button>
                    <el-button type="primary" @click="finish">确定</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import base from "../mixin/base";
    import valid from "../mixin/valid";
    import VueCropper from '../../../components/vue-cropper';

    // 01：ukey印章，02：云签名，03：云印章，04：ukey签名
    export default{
        mixins: [base, valid],
        components: {VueCropper},
        data() {
            return {
                formData: {
                    accountId: JSON.parse($.cookie("userinfo")).accountId,
                    signatureName: "",
                    createMode: 2,
                    signatureFilePath: "",
                    signatureType: '02',
                    pictureWidth: 0,
                    pictureHeight: 0,
                    pictureDataTmpId: "",
                },
                rules: {
                },
                codeUploaderImg: "",
                btnLoding: false,
                crap: false,
                previews: {},
                option: {
                    img: '',
                    size: 1,
                    full: false,//输出原图比例截图 props名full
                    outputType: 'png',
                    canMove: true,
                    original: false,
                    canMoveBox: true,
                    autoCrop: true,
                    autoCropWidth: 28.3*10,
                    autoCropHeight: 28.3*10,
                    fixedBox: false
                },
                dialogFormVisible:false,
                loading: false,
                previewImgW: "auto",
                previewImgH: "178px",
                previewImgMT: "0px",
                previewImgML: "0px",
                imgInfoW: 100,
                imgInfoH: 100,
                base64Img: "",
                timer: null,
                isCreatPaintCode: false
            }
        },
        computed: {},
        watch: {},
        mounted() {
        },
        beforeRouteLeave (to, from, next){
            window.clearInterval(this.timer);
            next();
        },
        methods: {
            showSignatureName(val){
                console.log(val.target.value);
                console.log(val.target.value.trim());
            },
            //提交能验证
            submitform(ref) {
                this.$refs[ref].validate((valid) => {
                    if(valid) {
                        this.saveForm();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //保存提交数据
            saveForm() {
                var that = this;
                if(this.formData.signatureName.length == 0){
                    this.$message.error("请您录入签名名称");
                    return false;
                }else if(this.formData.signatureName.length > 20){
                    this.$message.error("签名名称最大不能超过20个字符");
                    return false;
                }else if(this.formData.signatureFilePath.length == 0 && !this.codeUploaderImg){
                    this.$message.error("请您扫码手绘签名或上传自定义签名图片");
                    return false;
                }
                if(this.formData.createMode == 1){
                    this.formData.signatureFilePath = this.codeUploaderImg
                }
                let data = {
                    id: this.formData.accountId,
                    createMode: parseInt(this.formData.createMode),
                    signatureType: this.formData.signatureType,
                    signatureFilePath: this.formData.signatureFilePath,
                    signatureName: this.formData.signatureName.trim(),
                    width: this.formData.pictureWidth,
                    height: this.formData.pictureHeight,
                    pictureDataTmpId: this.formData.pictureDataTmpId,
                }
                this.addCloudSign(data).then(res=>{
                    this.btnLoding = true;
                    if(this.successCheckCode(res)){
                        this.$message({
                            type: 'success',
                            duration: 2000,
                            message: '成功创建云签名'
                        })
                        setTimeout(() => {
                            that.btnLoding = false;
                            // that.$router.go(0);
                            that.$router.push("/mysign");
                        },2000);
                    } else {
                        this.btnLoding = false;
                        this.$message.error(res.msg);
                    }
                })
            },
            cancel() {
                this.$router.go(-1);
            },
            cancelDialog() {
                this.dialogFormVisible = false;
            },
            // vue-cropper裁图
            changeScale(num) {
                num = num || 1
                this.$refs.cropper.changeScale(num);
            },
            rotateLeft() {
                this.$refs.cropper.rotateLeft();
            },
            rotateRight() {
                this.$refs.cropper.rotateRight();
            },
            //通过输入框设置裁图框大小
            changeVal() {
                if(this.imgInfoW > 100){
                    this.imgInfoW = 100
                }
                if(this.imgInfoH > 100){
                    this.imgInfoH = 100
                }
                this.previews.w = this.imgInfoW*28.3/10;
                this.previews.h = this.imgInfoH*28.3/10;
                this.$refs.cropper.changeCrop(this.previews.w, this.previews.h);
            },
            handleChange(event) {
                  // event = event | window.event;
                  //   var target= event .target || event .srcElement; //获取document 对象的引用
                var that = this;
                var file = event.target.files[0];
                // console.log(file);
                if(file){
                    //this.option.outputType = file.type.substring(6);
                    if (!/\.(jpg|png|bmp|JPG|PNG)$/.test(event.target.value)) {
                        this.$message.error("请上传jpg、png、bmp格式的图片！");
                        return false
                    }
                    if (file.size > 2 * 1024 * 1024) {
                        this.$message.error("请上传2M以内的文件！");
                        return false;
                    }
                    if(window.FileReader) {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            that.dialogFormVisible = true;
                            that.option.img = e.target.result;
                            var filetarget = document.getElementById("fileipt1");
                            $(filetarget).val("");
                        }
                        // 转化为base64
                        reader.readAsDataURL(file);
                    }
                }
            },
            handleChange2(event) {
                // 上传图片
                var that = this;
                var file = event.target.files[0];
                if(file) {
                    //this.option.outputType = file.type.substring(6);
                    if (!/\.(jpg|png|bmp|JPG|PNG)$/.test(event.target.value)) {
                        this.$message.error("请上传jpg、png、bmp格式的图片！");
                        return false
                    }
                    if (file.size > 2 * 1024 * 1024) {
                        this.$message.error("请上传2M以内的文件！");
                        return false;
                    }
                    if (window.FileReader) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            that.option.img = e.target.result;
                        }
                        // 转化为base64
                        reader.readAsDataURL(file);
                    }
                }
            },
            finish() {
                // 输出裁剪后的图片
                this.$refs.cropper.getCropData((data) => {
                    // console.log('------------')
                    // console.log(data)
                    this.dialogFormVisible = false;
                    // 上传图片接口
                    let data2 = {
                        base64: data =='data:,'?this.base64Img: data,
                        pictureType: "01",//01,签名；02,印章
                    }
                    // console.log(data2)
                    this.formData.signatureFilePath = "";
                    this.loading = true;
                    this.signupload(data2).then(res=>{
                        this.loading = false;
                        if(this.successCheckCode(res)){
                            this.formData.pictureDataTmpId = res.data.pictureDataTmpId;
                            this.formData.signatureFilePath = res.data.picturePath;
                            this.formData.pictureWidth = res.data.pictureWidth;
                            this.formData.pictureHeight = res.data.pictureHeight;
                            var WHrate = this.formData.pictureWidth / this.formData.pictureHeight;
                            var marginVal = 0;
                            WHrate.toFixed(2);
                            if(WHrate > 1.5){
                                marginVal = (178 - 268/WHrate) / 2
                                this.previewImgW = "268px";
                                this.previewImgH = "auto";
                                this.previewImgMT = marginVal + "px";
                                this.previewImgML = "0px";
                            }else{
                                marginVal = (268 - 178*WHrate) / 2
                                this.previewImgW = "auto";
                                this.previewImgH = "178px";
                                this.previewImgMT = "0px";
                                this.previewImgML = marginVal + "px";
                            }
                            this.$refs.cropper.refresh();
                        } else {
                            this.$message.error(res.msg);
                        }
                    }).fail(() => {
                    });
                })

            },
            cbError(event) {
                //$(event.target).val("");
            },
            // 实时预览裁剪区域
            realTime(data) {
                let url = data.url ;
                this.$refs.cropper.getCropData((data) => {
                    this.base64Img = data =='data:,'?url: data ;
                })
                this.previews = data;
                this.imgInfoW = Math.round(this.previews.w/28.3*10);
                this.imgInfoH = Math.round(this.previews.h/28.3*10);
            },
            imgLoad(msg) {
                //console.log(msg);
            },
            signChange(val){
                // $('#qrcode').empty()
                // clearInterval(this.timer)
                if(val == 1 && !this.isCreatPaintCode){
                    this.CreatPaintCode()
                }else if(val == 1 && this.isCreatPaintCode){
                    setTimeout(() => {
                        $('#qrcode').find('img').show()
                    }, 10);
                }else if (val == 2 && !this.codeUploaderImg){
                    $('.code-uploader').find('img').hide()
                }
            },
            qrCode(data){
                var qrcode = new QRCode(document.getElementById("qrcode"), {
                    width: 140,
                    height: 140,
                });
                qrcode.makeCode(data)
                $("#qrcode").attr("title","")
            },
            getPaintSignResult(data){
                this.getPaintSign(data).then(res =>{
                    if(this.successCheckCode(res)){
                        if(res.code == 0){
                            //clearInterval(this.timer)
                            $("#qrcode").empty();
                            this.formData.pictureDataTmpId = res.data.fileUploadRespDTO.pictureDataTmpId
                            this.formData.pictureWidth = res.data.fileUploadRespDTO.pictureWidth
                            this.formData.pictureHeight = res.data.fileUploadRespDTO.pictureHeight
                            this.codeUploaderImg = res.data.fileUploadRespDTO.picturePath
                        }else if(res.code == 2053 || res.code == 2050 || res.code == 2051){
                            clearInterval(this.timer)
                            $("#qrcode").empty();
                            this.$message.error("手写绘图失败,请重新扫一扫二维码")
                            this.CreatPaintCode()
                        }
                    }else{
                        clearInterval(this.timer)
                        $("#qrcode").empty();
                        this.$message.error("手写绘图失败,请重新扫一扫二维码")
                        this.CreatPaintCode()
                    }
                }).fail(res =>{
                    clearInterval(this.timer)
                    $("#qrcode").empty();
                    this.$message.error("手写绘图失败,请重新扫一扫二维码")
                    this.CreatPaintCode()
                })
            },
            CreatPaintCode(){
                this.getPaintCode().then(res =>{
                    if(this.successCheckCode(res)){
                        this.qrCode(res.data.url)
                        this.isCreatPaintCode = true
                        this.timer = setInterval(() => {
                            this.getPaintSignResult(res.data.nonceStr)
                        }, 2000);
                    }
                })
            },
        }
    }
</script>
<style>
    .addcloudsign .el-form-item__content{
        width: 354px;
        display: inline-block;
    }
    .addcloudsign .el-form-item__label {
        width: 74px;
        margin-right: 10px;
        color: #626262;
        vertical-align: top;
        height: 36px;
        line-height: 36px;
        padding:0;
    }
    .addcloudsign input.el-input__inner{
        background: #fff;
    }

    .addcloudsign .avatar-uploader .el-upload {
        border: 1px dashed #E8ECEF;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background: #FAFAFA;
        width: 270px;
        height:180px;
    }
    .addcloudsign .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .addcloudsign .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 270px;
        height: 180px;
        line-height: 180px;
        text-align: center;
    }
    .addcloudsign .avatar-uploader input{
        width: 270px;
        height: 210px;
        opacity: 0;
        position: absolute;
        left: 0;
        top: -30px;
        z-index: 1;
        cursor: pointer;
        display: block;
        font-size:0;
        font-size:100px\0;
    }
    .addcloudsign .avatar-uploader .el-loading-spinner{
        margin-top: -50px;
    }
    .addcloudsign .el-icon-plus:before{
        content:"点击上传";
        width: 80px;
        height: 80px;
        line-height: 100px;
        position: absolute;
        text-align: center;
        top: 50%;
        left: 50%;
        margin-top: -40px;
        margin-left: -40px;
        font-size: 14px;
        color: #999999;
        background: url(../../../../static/image/icon-uploader.png) no-repeat;
        background-position: 20px 0;
    }
    .addcloudsign .avatar-uploader .el-upload:hover .el-icon-plus:before{
        color:#0073BD;
        background: url(../../../../static/image/icon-uploader-hover.png) no-repeat;
        background-position: 20px 0;
    }
    .addcloudsign .previewImg {
        margin: 0 auto;
        height: 180px;
        display: block;
        position: absolute;
        top: 0;
    }
    /*width: 220px;
    height: 220px;
    border: 1px solid #dde3e8;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 50%;*/
</style>

<style lang="scss">
.addcloudsign{
    .top-title{
        height:60px;
        line-height: 60px;
        border-bottom: 1px solid #E8ECEF;
        margin-bottom:25px;
        position:relative;
        .titinfo{
            float:left;
            font-size: 18px;
            color: #333333;
        }

    }
    .footbtn{
        text-align:right;
        padding:30px 0;
        .el-button{
            width: 100px;
        }
    }
    .uploader-tips{
        font-size: 12px;
        color: #999999;
        line-height: 20px!important;
    }
    .code-uploader{
        width: 270px;
        height: 180px;
        border: 1px solid #E8ECEF;
        border-radius: 6px;
        position: relative;
        overflow: hidden;
        background: #FAFAFA;
        margin-bottom:13px;
        padding: 20px;
        text-align: center;
        .code-uploader-img{
            max-width: 100%;
            max-height: 100%;
        }
    }

    .cropper-dialog{
        .el-dialog{
            width:800px;
            height:560px;
            border-radius: 10px;
            .el-dialog__header{
                padding: 10px 20px;
                border-radius: 10px 10px 0 0;
                background: #E8ECEF;
                .el-dialog__headerbtn{
                    margin-top:0;
                }
                .el-dialog__title{
                    font-size: 16px;
                    font-weight: normal;
                }
            }
        }
        .el-dialog__body{
            padding:20px;
        }
        .cropper-dialog-body{
            .previewImg{
                height:240px;
                width:240px;
            }
        }
    }

    .cropper-content{
        .cropper{
            float:left;
            .vue-cropper{
                width: 350px;
                height: 300px;
            }
        }
        .show-preview{
            float:right;
            padding: 0 25px;
            width: 400px;
            position:relative;
            .preview{
                /*border:1px solid #cccccc;
                background: #cccccc;
                overflow: hidden;*/
                width: 283px;
                height: 283px;
                border: 1px solid #dde3e8;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: 50%;
            }
            .imgInfo{
                position:absolute;
                bottom:0;
                left:25px;
                margin-bottom:-65px;
                .seal-size-tips{
                    margin-top:10px;
                    font-size:12px;
                    span{
                        color:#999999;
                    }
                }
                .seal-size-ipt{
                    margin-top:10px;
                    span{
                        display: inline-block;
                        &:nth-child(1){
                            margin-right:20px;
                         }
                        .el-input{
                            margin-left:10px;
                            width:62px;
                        }
                    }
                }
            }
        }
    }
    .footer-btn{
        .scope-btn{
            padding:10px 0;
            width: 350px;
            display: flex;
            display: -webkit-flex;
            justify-content: space-between;
            -webkit-justify-content: space-between;
            button{
                display: inline-block;
                line-height: 1;
                white-space: nowrap;
                cursor: pointer;
                background: #fff;
                border: 1px solid #c4c4c4;
                color: rgb(31, 46, 61);
                padding: 10px 15px;
                border-radius: 4px;
            }
            .btn {
                white-space: nowrap;
                cursor: pointer;
                text-align: center;
                transition: .1s;
                padding: 8px 15px;
                font-size: 14px;
                border-radius: 3px;
                color: #fff;
                background-color: #67c23a;
                border-color: #67c23a;
            }
        }
    }
    .upload-btn{
        text-align: right;
        margin-top: 20px;
        margin-right:25px;
        .el-button{
            padding:10px 30px;
        }
    }
}
</style>
