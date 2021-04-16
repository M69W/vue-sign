<template>
    <div class="contractsign">
        <h2 class="top_title">
            <i></i>上传合同
        </h2>
        <div class="explain">
            温馨提示：
            <span>1、仅支持.doc、docx、pdf、xls、xlsx格式、图片格式；</span>
            <span>2、文件大小需要&lt;20MB；</span>
        </div>
        <div class="contract_list clearfix" element-loading-text="文件上传中" id="contract_list">
            <div v-for="(item , key) in contractList" :key="key">
                <div class="img_box add img_list" :class="{noPic: !item.homePageImagePath}">
                    <!--:class="{img_list: item.homePageImagePath}"-->
                    <!--<div v-show="!item.homePageImagePath">-->
                    <!--<p class="el-icon-plus"></p>-->
                    <!--<p>上传</p>-->
                    <!--</div>-->
                    <div class="img_tip" v-show="item.homePageImagePath">
                        <img :src="item.homePageImagePath + '&token=' + token" v-if="item.homePageImagePath" />
                    </div>
                    <div class="supernatant" v-show="item.homePageImagePath">
                        <span @click="deleteUpload(key)" v-show="!item.isFromTemp"></span>
                        <span @click="look(item)" style="margin-top: 10px;"></span>
                        <span type="primary" @click="reUpload()" v-show="!item.isFromTemp">
                            <form :id="'ajaxForm'+key" accept-charset="utf-8" enctype="multipart/form-data">
                                <input class="uploadinput" :id="'file'+key" v-on:change="changeImg($event,key,item)"
                                    name="files" type="file" data-min-file-count="1" />
                            </form>
                        </span>
                    </div>

                    <div class="upload-file-stateWrap" style="display: none;">
                        <span class="upload-file-result"></span>
                        <div class="progress hidden">
                            <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                v-bind:style="{ width: percentVal + '%' }"></div>
                        </div>
                    </div>
                </div>
                <p class="title">
                    <span v-show="item.homePageImagePath" :title="item.fileName | fileName">
                        <span class="filename">{{item.fileName | fileName }}</span>
                        （{{item.filePage || item.pageTotal }}页）
                    </span>
                </p>
            </div>
            <div class="add img_box">
                <div>
                    <p class="el-icon-plus"></p>
                    <p>添加合同</p>
                </div>
                <form :id="'ajaxForm'+ contractList.length" accept-charset="utf-8" enctype="multipart/form-data">
                    <input class="uploadinput" :id="'file'+ contractList.length"
                        v-on:change="changeImg($event,contractList.length)" name="files" type="file"
                        data-min-file-count="1" multiple />
                </form>
            </div>
        </div>
        <!-- 附件上传 -->
        <div class="clearfix uploadfile-container">
            <div class="upload-desc">附件上传</div>
            <div class="upload-title">
                <form accept-charset="utf-8" enctype="multipart/form-data" class="uploadform" id="uploadform">
                    <span>上传附件</span>
                    <input class="uploadfile" v-on:change="changeFile($event,'upload' , 2)" name="file" type="file"
                        id="fileupload" data-min-file-count="1" />
                </form>
                <ul class="filelist" v-show="filelist.length">
                    <li v-for="(file , index) in filelist" :key="index"
                        :class="{exl:file.fileFormat == '1' , pdf:  file.fileFormat == '2' , ppt: file.fileFormat == '3' ,word : file.fileFormat == '4' , img:  file.fileFormat == '5' }"
                        @click="look(file)">
                        <span class="name">{{file.fileName}}</span>
                        <span class="del_icon" @click.stop="deleteFile(index)"></span>
                    </li>
                </ul>
            </div>
        </div>
        <h2 class="top_title">
            <i></i>添加合同信息
        </h2>
        <el-form class="demo-input-suffix" :model="formData" label-position="left">
            <!-- :rules="rules"-->
            <el-col>
                <el-form-item label="合同主题">
                    <el-input :maxlength="100" type placeholder="合同主题" v-model="formData.compactTheme"
                        :title="formData.compactTheme"></el-input>
                </el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="合同有效期">
                    <el-date-picker v-model="formData.daterange" type="daterange" placeholder="选择日期范围"
                        value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <span class="tip">合同到期前，系统提醒您</span>
            </el-col>
            <el-col>
                <el-form-item label="签署截止日期">
                    <el-date-picker v-model="formData.signDeadline" type="date" :picker-options="pickerOptions0"
                        placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <span class="tip">所有签署方必须在截止时间前完成</span>
            </el-col>
            <el-col class="textarea">
                <el-form-item label="备注">
                    <el-input type="textarea" placeholder="请输入内容" v-model="formData.remake" :rows="3"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="sure_bottom">
                <el-button @click="cancel()">取消</el-button>
                <el-button type="primary" @click="next()">下一步</el-button>
            </el-col>
        </el-form>

        <!--合同查看弹窗-->
        <div class="alert_look" v-if="alertLook">
            <div class="box">
                <i class="el-message-box__close el-icon-close" @click="close()"></i>
                <h3>{{lookTitle}}</h3>
                <div class="pagedetail" @scroll="handleScroll">
                    <div class="compactList" v-for="(item,index) in compact" :key="index">
                        <div class="list">
                            <img :src="item + '&token=' + token" />
                        </div>
                    </div>
                    <div class="loadEnd">{{loadTips}}</div>
                </div>
            </div>
        </div>

        <!-- loading遮罩 -->
        <transition name="loading-pop">
            <div class="loading-mask" v-show="fileUpload">
                <div class="loading">
                    <div class="spinner">
                        <div class="rect1"></div>
                        <div class="rect2"></div>
                        <div class="rect3"></div>
                        <div class="rect4"></div>
                        <div class="rect5"></div>
                    </div>
                    <span class="loading-text">上传中...</span>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import base from '../mixin/base';
    import moment from 'moment';

    export default {
        mixins: [base],
        data() {
            return {
                eve: '',
                Item: '',
                percentVal: '',
                title: 'sssssss',
                fileUpload: false,
                formData: { compactTheme: '', daterange: [], signDeadline: '', remake: '' },
                lookUrl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_86d58ae1.png',
                lookTitle: '标题',
                alertLook: false,
                contractList: [],
                filelist: [],
                pageNo: 1,
                scloll: true,
                fileCode: '',
                compact: [],
                total: 0,
                loadTips: '',
                userId: JSON.parse($.cookie('userinfo')).userId,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() <= Date.now() - 8.64e7;
                    }
                },
                isTemp: false,
                token: sessionStorage.getItem('token'),
                templateInfo: '',
                timer: ''
            };
        },
        filters: {
            fileName: function (name) {
                try {
                    return name.substring(0, name.lastIndexOf('.'));
                } catch (e) { }
            }
        },
        watch: {
            contractList() {
                if (this.$route.query.type == '01' || this.$route.query.type == '08') {
                    //08 重新发起
                    return;
                }
                if (this.contractList.length > 0) {
                    // 这里要修改
                    try {
                        this.formData.compactTheme = this.formData.compactTheme
                            ? this.formData.compactTheme
                            : this.contractList[0].fileName.substring(0, this.contractList[0].fileName.lastIndexOf('.'));
                    } catch (e) { }
                } else {
                    this.formData.compactTheme = '';
                }
            }
        }, // 由于v-model双向绑定不能使用filter，所以通过计算属性代替
        mounted() {
            this.isTemp = !!this.$route.query.isTemp;
            if (this.isTemp && this.$route.query.type != '01') {
                this.getTemplateInfo(this.$route.query.tempId).then((res) => {
                    if (this.successCheckCode(res)) {
                        let templateInfo = res.data;
                        this.templateInfo = templateInfo;
                        this.contractList = templateInfo.templateFiles;
                        if (this.isTemp) {
                            this.contractList.map(item => {
                                item.isFromTemp = true;
                            })
                        }
                        this.filelist = templateInfo.contractFileList.filter((v) => v.fileType === '04');
                    }
                });
            }
            this.$nextTick(() => {
                if (this.$route.query.type == '01' || this.$route.query.type == '08') { //type 01 草稿继续 08重新发起
                    //08 重新发起
                    let isOriginal = this.$route.query.type == '08' ? 1 : 0;
                    this.editCompact(this.$route.query.id + '?isOriginal=' + isOriginal).then((res) => {
                        if (this.successCheckCode(res)) {
                            this.contractList = res.data.compactFileIdList;
                            if (this.isTemp) {
                                this.contractList.map(item => {
                                    item.isFromTemp = true;
                                })
                            }
                            this.formData.compactTheme = res.data.compactTheme;
                            res.data.validityStartDate ? this.formData.daterange.push(res.data.validityStartDate.split(' ')[0]) : '';
                            res.data.validityEndDate ? this.formData.daterange.push(res.data.validityEndDate.split(' ')[0]) : '';
                            res.data.signDeadline ? (this.formData.signDeadline = res.data.signDeadline.split(' ')[0]) : '';
                            this.formData.remake = res.data.remake ? res.data.remake : '';
                            res.data.compactAccessoryCodeList.map((res) => {
                                var obj = {};
                                obj.fileCode = res.compactAccessoryCode;
                                obj.fileName = res.compactAccessoryName;
                                obj.fileFormat = res.fileFormat;
                                obj.filePage = res.filePage;
                                this.filelist.push(obj);
                            });
                        }
                    });
                }
                // console.log(JSON.parse($.cookie("userinfo")).userId)
            });
        },
        methods: {
            // 文件上传
            changeImg(event, ind, item) {
                if (event.target.files.length + this.contractList.length > 100) {
                    return this.$message.warning(`最多上传100个文件，当前${this.contractList.length}个`);
                }
                //有其他合同在上传 ie下会触发两次
                if (!!this.fileUpload && !!document.getElementById('file' + ind)) {
                    console.log(this.fileUpload);
                    //清除inputfile value值
                    let isIE10 = false;
                    if (window.navigator.userAgent.indexOf('MSIE') >= 1) {
                        // 判断ie10以及以下
                        isIE10 = true;
                    } else {
                        isIE10 = false;
                    }
                    let uploadInput = document.getElementById('file' + ind);
                    if (isIE10) {
                        // 关键部分ie10以下
                        let form = document.createElement('form');
                        let beforInput = uploadInput.nextSibling;
                        let parentInput = uploadInput.parentNode;
                        form.appendChild(uploadInput);
                        form.reset();
                        parentInput.insertBefore(uploadInput, beforInput);
                    } else {
                        // 谷歌、火狐和ie11、edge
                        $(event.target).val('');
                    }

                    /* return this.$message({
                            message: '请先等待其他合同上传完成',
                            type: 'warning'
                        });*/
                }
                this.Item = item;
                this.eve = event;
                let bool = this.uploadCheck(event, ind);
                if (!bool) {
                    return;
                }
                let url = '/compact/upload/files/' + this.userId;

                let files = document.getElementById('file' + ind).files;
                // console.log(files[0]);

                if (this.Item == undefined) {
                    var obj = {
                        homePageImagePath: '',
                        fileName: '',
                        fileCode: '',
                        filePage: ''
                    };
                    for (let i = 0; i < files.length; i++) {
                        this.contractList.push(obj);
                    }
                }
                // 请求接口
                var dom = 'ajaxForm' + ind;
                this.fileUpload = true;
                this.postFileImageUpload(dom, url, this.uploadSuccess, this.cbError, this.percent);

                //清除inputfile value值
                let isIE10 = false;
                if (window.navigator.userAgent.indexOf('MSIE') >= 1) {
                    // 判断ie10以及以下
                    isIE10 = true;
                } else {
                    isIE10 = false;
                }
                let uploadInput = document.getElementById('file' + ind);
                if (isIE10) {
                    // 关键部分ie10以下
                    let form = document.createElement('form');
                    let beforInput = uploadInput.nextSibling;
                    let parentInput = uploadInput.parentNode;
                    form.appendChild(uploadInput);
                    form.reset();
                    parentInput.insertBefore(uploadInput, beforInput);
                } else {
                    // 谷歌、火狐和ie11、edge
                    $(event.target).val('');
                }
            },
            //percentVal
            percent(data) {
                // 进度条
                this.$nextTick(() => {
                    if (this.Item) {
                        $(this.eve.target)
                            .parents('.img_list')
                            .eq(0)
                            .find('.upload-file-stateWrap')
                            .show();
                    } else {
                        $('#contract_list .img_list.noPic')
                            .find('.upload-file-stateWrap')
                            .show();
                    }
                    if (data > 80) {
                        data = '85';
                    }
                    this.percentVal = data + '%';
                });
            },
            //success
            uploadSuccess(data) {
                this.percentVal = '100%';
                var that = this;
                if (this.successCheckCode(data)) {
                    var data = data.data;
                    if (this.Item) {
                        // 重新上传
                        this.Item.homePageImagePath = data[0].homePageImagePath;
                        this.Item.fileName = data[0].fileName;
                        this.Item.fileCode = data[0].fileCode;
                        this.Item.filePage = data[0].filePage;
                        that.formData.compactTheme = that.contractList[0].fileName ? that.contractList[0].fileName.split('.')[0] : '';
                    } else {
                        // 新增
                        if (data.length) {
                            this.contractList.splice(this.contractList.length - data.length, data.length);
                            this.contractList = this.contractList.concat(data);
                        }
                    }
                    this.uploading = false;
                } else {
                }
                setTimeout(function () {
                    that.fileUpload = false;
                    // $(that.eve.target).parents(".img_list").eq(0).find(".upload-file-stateWrap").hide();
                    $('#contract_list .img_list')
                        .find('.upload-file-stateWrap')
                        .hide();
                }, 500);
            },
            // 附件上传
            changeFile(event, ind, type) {
                // type == 2  是上传附件
                let bool = this.uploadCheck(event, ind, type);
                if (!bool) {
                    return;
                }
                // 请求接口
                var url = '/compact/upload/accessory/' + this.userId;
                var dom = 'uploadform';
                this.fileUpload = true;
                this.postFileImageUpload(dom, url, this.attachmentSuccess, this.callbackFalse, this.callbackFalse);

                //清除inputfile value值
                let isIE10 = false;
                if (window.navigator.userAgent.indexOf('MSIE') >= 1) {
                    // 判断ie10以及以下
                    isIE10 = true;
                } else {
                    isIE10 = false;
                }
                let uploadInput = document.getElementById('fileupload');
                if (isIE10) {
                    // 关键部分ie10以下
                    let form = document.createElement('form');
                    let beforInput = uploadInput.nextSibling;
                    let parentInput = uploadInput.parentNode;
                    form.appendChild(uploadInput);
                    form.reset();
                    parentInput.insertBefore(uploadInput, beforInput);
                } else {
                    // 谷歌、火狐和ie11、edge
                    $(event.target).val('');
                }
            },
            callbackFalse() { },
            //附件成功
            attachmentSuccess(data) {
                //成功回调
                if (this.successCheckCode(data)) {
                    this.fileUpload = false;
                    var data = data.data;
                    this.filelist.push(data);
                } else {
                    setTimeout(function () {
                        this.fileUpload = false;
                    }, 100);
                }
            },
            uploadCheck(event, ind, type) {
                type;
                if (!$(event.target).val()) {
                    return false;
                }
                var self = this,
                    regFile,
                    fileType,
                    eve = event,
                    fileName;
                var file = document.getElementById('file' + ind);
                let flag = true;
                for (let i = 0; i < file.files.length; i++) {
                    flag = this.uploadCheckFn(file.files[i]);
                }
                return flag;
            },
            uploadCheckFn(file) {
                var self = this,
                    regFile,
                    fileType,
                    eve = event,
                    fileName,
                    fileNameReal;
                if (!file) {
                    var ret = file.value.split('\\');
                    fileName = ret[ret.length - 1];
                    fileType = fileName.split('.');
                    fileType = fileType[fileType.length - 1];
                    /*  if(type == 2){
                              regFile = /(doc|docx|wps|pdf|xls|xlsx|jpg|png|bmp|JPG|PNG|ppt|pptx)(\?.*)?$/ ;
                          }else {
                              regFile = /(doc|docx|wps|pdf|xls|xlsx|jpg|png|bmp|JPG|PNG)(\?.*)?$/ ;
                          }*/
                    regFile = /(doc|docx|pdf|xls|xlsx|jpg|png|bmp|JPG|PNG|ppt|pptx)(\?.*)?$/;
                } else {
                    fileType = file.name.replace(/.+\./, '').toLowerCase();
                    fileName = file.name;
                    /*if(type == 2){
                            regFile = /(doc|docx|wps|pdf|xls|xlsx|jpg|png|bmp|JPG|PNG|ppt|pptx)(\?.*)?$/;
                        }else {
                            regFile = /(doc|docx|wps|pdf|xls|xlsx|jpg|png|bmp|JPG|PNG)(\?.*)?$/ ;
                        }*/
                    regFile = /(doc|docx|pdf|xls|xlsx|jpg|png|bmp|JPG|PNG|ppt|pptx)(\?.*)?$/;
                    if (file.size > 20 * 1024 * 1024) {
                        this.$message({
                            message: '请上传20M以内的文件',
                            type: 'warning'
                        });
                        $(event.target).val('');
                        return false;
                    }
                }

                let index = fileName.lastIndexOf('.');
                fileNameReal = fileName.substring(0, index);
                var regFileNameReal = /[`~&$?,]/im;
                // console.log(fileNameReal);
                if (!regFile.test(fileType)) {
                    this.$message({
                        message: '请上传doc、docx、pdf、xls、xlsx、图片格式的文件',
                        type: 'warning'
                    });
                    $(event.target).val('');
                    return false;
                }
                if (!!regFileNameReal.test(fileNameReal)) {
                    this.$message({
                        message: '文件名不能包含特殊符号',
                        type: 'warning'
                    });
                    $(event.target).val('');
                    return false;
                }
                return true;
            },
            cbError() {
                $(this.eve.target).val('');
                $(this.eve.target)
                    .parents('.img_list')
                    .eq(0)
                    .find('.upload-file-stateWrap')
                    .hide();
            },
            reUpload() { },
            look(item) {
                this.alertLook = true;
                this.fileCode = item.fileCode;
                this.lookTitle = item.fileName ? item.fileName.split('.')[0] : '';
                this.total = item.filePage || item.pageTotal;
                this.compact = [];
                this.pageNo = 1;
                var url = '/compact/file/page?fileCode=' + this.fileCode + '&pageNo=' + this.pageNo;
                this.compact.push(url);
            },
            deleteUpload(index) {
                if (!!this.fileUpload) {
                    return this.$message.warning('文件正在上传中，请勿删除');
                }
                this.contractList.splice(index, 1);
                let fileName = 'file' + index;
                var file = document.getElementById(fileName);
                if (file.outerHTML) {
                    //IE重置表单不能清空file值
                    file.outerHTML = file.outerHTML;
                }
                if (this.contractList.length == 0) {
                    this.formData.name = '';
                    return;
                }
                this.formData.name = this.contractList[0].title;
            },
            deleteFile(index) {
                this.filelist.splice(index, 1);
            },
            close() {
                this.alertLook = false;
            },
            cancel() {
                let self = this;
                let index = this.$route.query.index;
                if (this.contractList.length > 0) {
                    this.$confirm('本次创建的合同信息，将保存至草稿箱', '保存草稿', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        customClass: 'icon-save self-icon',
                        type: 'warning',
                        closeOnClickModal: false,
                        closeOnPressEscape: false
                    })
                        .then(() => {
                            // 调用草稿箱接口
                            self.save('01');
                        })
                        .catch(() => {
                            let el = event.target.tagName.toLowerCase();
                            if ((el == 'span' || el == 'button') && index == true) {
                                history.go(-1);
                            } else {
                                self.$router.push('/contractlist');
                            }
                        });
                } else {
                    history.go(-1);
                }
            },
            next() {
                if (!!this.fileUpload) {
                    return this.$message({
                        message: '请先等待合同上传完成',
                        type: 'warning',
                        duration: 3000
                    });
                }
                if (this.contractList.length > 0) {
                    this.save('02');
                } else {
                    this.$message({
                        message: '请上传合同再进行下一步',
                        type: 'warning',
                        duration: 3000
                    });
                }
            },
            save(val) {
                // console.log(val);
                // console.log(this.formData)
                var validityEndDate, validityStartDate, signDeadline;
                if (this.formData.compactTheme == '') {
                    this.$message({
                        message: '请您输入合同主题内容',
                        type: 'warning',
                        duration: 3000
                    });
                    return;
                }
                if (this.formData.daterange && this.formData.daterange[0] != null) {
                    validityEndDate = moment(this.formData.daterange[1]).format('YYYY-MM-DD');
                    validityStartDate = moment(this.formData.daterange[0]).format('YYYY-MM-DD');
                    if (new Date(validityEndDate).getTime() < new Date().getTime()) {
                        this.$message({
                            message: '合同有效期不能小于当前时间',
                            type: 'warning',
                            duration: 3000
                        });
                        return;
                    } else if (new Date(validityEndDate).getTime() < new Date(validityStartDate).getTime()) {
                        this.$message({
                            message: '合同有效期截至日不能小于起始日',
                            type: 'warning',
                            duration: 3000
                        });
                        return;
                    } else {
                        validityEndDate += ' 23:59:59';
                        validityStartDate = moment(this.formData.daterange[0]).format('YYYY-MM-DD') + ' 23:59:59';
                    }
                } else {
                    validityStartDate = '';
                    validityStartDate = '';
                }
                if (this.formData.signDeadline) {
                    signDeadline = moment(this.formData.signDeadline).format('YYYY-MM-DD') + ' 23:59:59';
                }
                let compactAccessoryCodeList = [],
                    compactFileIdList = [];
                this.contractList.map((data) => {
                    // compactFileIdList 合同文件
                    let obj = { contractFileCode: data.fileCode, pageTotal: data.filePage || data.pageTotal };
                    // 模板增加控件字段
                    if (this.isTemp) {
                        obj.templateFieldInfoList = data.templateFields;
                    }
                    compactFileIdList.push(obj);
                });
                this.filelist.map(function (data) {
                    // compactAccessoryCode 合同附件
                    compactAccessoryCodeList.push({ compactAccessoryCode: data.fileCode, pageTotal: data.filePage || data.pageTotal });
                });
                // console.log(
                //     JSON.stringify({
                //         compactAccessoryCodeList: compactAccessoryCodeList,
                //         compactFileIdList: compactFileIdList,
                //         compactTheme: this.formData.compactTheme,
                //         remake: this.formData.remake,
                //         signDeadline: signDeadline,
                //         userId: this.userId,
                //         validityEndDate: validityEndDate,
                //         validityStartDate: validityStartDate,
                //         compactId: this.$route.query.type == '08' ? '' : this.$route.query.id,
                //         operationType: val
                //     })
                // );
                let sendData = {
                    compactAccessoryCodeList: compactAccessoryCodeList,
                    compactFileIdList: compactFileIdList,
                    compactTheme: this.formData.compactTheme,
                    remake: this.formData.remake,
                    signDeadline: signDeadline,
                    userId: this.userId,
                    validityEndDate: validityEndDate,
                    validityStartDate: validityStartDate,
                    compactId: this.$route.query.type == '08' ? '' : this.$route.query.id,
                    operationType: val
                };
                // 使用模板
                if (this.isTemp && this.$route.query.type !== '01') {
                    sendData.signWay = this.templateInfo.signWay;
                    sendData.templateId = this.$route.query.tempId;
                    sendData.templateSignatories = this.templateInfo.templateSignatories;
                    this.templateBasicInfo(sendData).then((res) => {
                        if (this.successCheckCode(res)) {
                            if (val == '01') {
                                this.$router.push('/contractlist');
                            } else {
                                return this.$router.push(`/setSignProcess?id=${res.data.compactId}`);
                            }
                        }
                    });
                    return;
                }
                this.contractBasicNext(sendData).then((res) => {
                    if (this.successCheckCode(res)) {
                        if (val == '01') {
                            this.$router.push('/contractlist');
                        } else {
                            if (this.isTemp) {
                                return this.$router.push(`/setSignProcess?id=${res.data.compactId}`);
                            }
                            if (this.$route.query.type == '08') {
                                this.$router.push({
                                    path: '/contractprocess',
                                    query: { id: res.data.compactId, oldId: this.$route.query.id, type: '08' }
                                });
                            } else {
                                this.$router.push({ path: '/contractprocess', query: { id: res.data.compactId } });
                            }
                        }
                    } else {
                        return false;
                    }
                });
            },
            handleScroll() {
                var distance = $('.compactList').offset().top;
                if (this.pageNo >= this.total) {
                    this.loadTips = '合同文件加载完毕';
                } else {
                    this.loadTips = '加载中...';
                    var boxHeight = $('.pagedetail').height();
                    if (distance + 1129 - 173 - boxHeight + 1100 * (this.pageNo - 1) < 3) {
                        if (this.timer) {
                            return;
                        }
                        this.timer = setTimeout((res) => {
                            this.pageNo++;
                            var url = '/compact/file/page?fileCode=' + this.fileCode + '&pageNo=' + this.pageNo;
                            this.compact.push(url);
                            this.timer = '';
                        }, 500);
                    }
                }
            }
        }
    };
</script>
<style>
    .contractsign .el-form-item__label {
        width: 96px !important;
    }

    .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .el-scrollbar__wrap {
        height: 100%;
    }

    .contractsign .el-form-item__content,
    .contractsign .el-form-item__content>div,
    .contractsign .el-date-editor--daterange.el-input {
        width: 354px;
        display: inline-block;
    }

    .contractsign .textarea .el-form-item__content,
    .contractsign .textarea .el-form-item__content .el-textarea {
        width: 900px;
    }

    .contractsign .el-form-item__label {
        width: 84px;
        margin-right: 20px;
        color: #626262;
    }

    .contractsign .textarea .el-form-item__label {
        vertical-align: top;
    }

    .contract_list .add .el-icon-plus:before {
        content: '';
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url('../../../../static/image/icon_add.svg') no-repeat center;
    }

    .add.img_box:hover .el-icon-plus:before {
        background: url('../../../../static/image/icon_add_hover.svg') no-repeat center;
    }
</style>
<style scoped lang="scss">
    .contractsign {
        .loadEnd {
            text-align: center;
            padding: 5px;
        }

        .uploadfile-container {
            padding-bottom: 10px;

            .upload-desc {
                font-size: 16px;
                color: #999;
                margin-right: 20px;
                margin-bottom: 10px;
            }

            .upload-title {
                margin-bottom: 16px;
                display: flex;
                align-items: center;

                .uploadform {
                    margin-right: 20px;
                    align-self: flex-start;
                }
            }
        }

        div.pagedetail {
            width: 1120px;
            overflow: auto;
            height: 80%;
            margin: 0 auto;

            div.compactList {
                height: 1100px;
            }
        }

        background-color: #fff;
        padding: 30px;
        padding-top: 0;

        .filename {
            display: inline-block;
            max-width: 200px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: top;
        }

        .alert_look {
            position: fixed;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            top: 0;
            left: 0;

            /*overflow: auto;*/
            .box {
                width: 1200px;
                height: calc(100% - 121px);
                background: #f4f6f8;
                padding: 0 30px 30px 30px;
                box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04);
                border-radius: 10px;
                margin: auto;
                margin-top: 70px;
                margin-bottom: 50px;
                position: relative;

                i {
                    position: absolute;
                    right: 12px;
                    top: 12px;
                    font-size: 27px;
                    color: #c0ccda;
                    cursor: pointer;
                }

                >div {
                    background-color: #fff;
                    overflow-y: auto;

                    .list {
                        height: 1100px;
                        width: 800px;
                        position: relative;
                        margin: 0 auto;

                        img {
                            height: 1100px;
                        }
                    }
                }

                h3 {
                    font-size: 24px;
                    color: #333333;
                    text-align: center;
                    padding: 24px 0;
                }
            }
        }

        .explain {
            font-size: 13px;
            color: #999999;
            height: 52px;
            line-height: 52px;

            span {
                padding-left: 20px;
            }
        }

        .contract_list {
            >.add {
                border-style: dashed !important;
            }

            >.add:hover {
                border-color: #02adff !important;
            }

            >div {
                float: left;
                text-align: center;
                margin-right: 20px;
                margin-bottom: 20px;

                .title {
                    font-size: 14px;
                    color: #666666;
                    padding-top: 20px;
                    height: 40px;
                }

                .uploadinput {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    overflow: hidden;
                    opacity: 0;
                    font-size: 0;
                    font-size: 100px \0;
                    cursor: pointer;
                }

                /*进度条*/
                .progressWrap {
                    position: absolute;
                    bottom: 0;
                    width: 200px;
                    height: 4px;
                }

                .progress {
                    width: 100%;
                    height: 4px;
                    background: #2fbcff;
                    -webkit-border-radius: 20px;
                    -moz-border-radius: 20px;
                    border-radius: 20px;
                    overflow: hidden;
                }

                .progress-bar {
                    height: 4px;
                }

                .progress-bar span {
                    position: absolute;
                    color: #58637e;
                    font-size: 12px;
                    line-height: 18px;
                }

                .progress-bar span.progress-bar-status {
                    left: 50%;
                    top: -23px;
                    margin-left: -15px;
                    color: #1cc3b0;
                }

                .upload-file-stateWrap {
                    position: absolute;
                    width: 100%;
                    height: auto;
                    bottom: -4px;
                    top: inherit !important;
                    border: 1px solid #88bbd4;
                    border-radius: 5px;
                    padding: 1px;
                }

                .upload-file-stateWrap .progress {
                    width: 60%;
                }

                .upload-file-stateWrap span.progress-bar-status {
                    top: inherit;
                    bottom: -3px;
                    left: 60%;
                    margin-left: 5px;
                }
            }

            >div:nth-child(4n) {
                margin-right: 0;
            }

            .img_box {
                width: 270px;
                height: 220px;
                line-height: 220px;
                position: relative;
                background: #fafafa;
                border: 1px solid #e2e2e2;
                border-radius: 4px;
                position: relative;

                .el-icon-plus {
                    font-size: 30px;
                    display: block;
                    color: #c0ccda;
                }

                p {
                    font-size: 14px;
                    color: #626262;
                    padding-top: 10px;
                }

                >div {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    -webkit-transform: translate(-50%, -50%);
                    -moz-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%);
                    text-align: center;
                }

                .img_tip {
                    width: 100%;
                    height: 100%;
                    line-height: 100%;
                    vertical-align: middle;
                    text-align: center;
                    position: relative;
                    padding: 10px;

                    img {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        -webkit-transform: translate(-50%, -50%);
                        -moz-transform: translate(-50%, -50%);
                        transform: translate(-50%, -50%);
                        height: 218px;
                        max-width: 248px;
                    }
                }

                .supernatant {
                    position: absolute;
                    width: 270px;
                    margin-left: -1px;
                    width: 100%;
                    height: 60px;
                    left: 0;
                    bottom: 0;
                    top: inherit;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 0 0 4px 4px;
                    transform: translate(0, 0);
                    display: none;

                    span {
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        margin-top: 10px;
                        border-radius: 50%;
                        background-color: #fff;
                        cursor: pointer;
                    }

                    span:nth-child(1) {
                        background-image: url('../../../../static/image/delete_black.png');
                        background-position: center;
                        background-repeat: no-repeat;
                    }

                    span:nth-child(1):hover {
                        background-image: url('../../../../static/image/delete_white.png');
                    }

                    span:nth-child(2) {
                        background-image: url('../../../../static/image/look_black.png');
                        background-position: center;
                        background-repeat: no-repeat;
                        margin: 0 10px;
                    }

                    span:nth-child(2):hover {
                        background-image: url('../../../../static/image/look_white.png');
                    }

                    span:nth-child(3) {
                        background-image: url('../../../../static/image/upload_black.png');
                        background-position: center;
                        background-repeat: no-repeat;
                        position: relative;
                    }

                    span:nth-child(3):hover {
                        background-image: url('../../../../static/image/upload_white.png');
                    }

                    >span:hover {
                        background-color: #02adff;
                    }

                    .el-button--default {
                        margin-top: 97px;
                        margin-bottom: 20px;
                    }
                }
            }

            .img_list:hover .supernatant {
                display: block !important;
            }

            .add.img_box {
                line-height: inherit;
            }
        }

        .uploadform {
            position: relative;
            width: 186px;
            height: 36px;
            border: 1px dashed #e8ecef;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fafafa;

            >span {
                color: #626262;
            }

            >span:before {
                content: '';
                width: 12px;
                height: 16px;
                display: inline-block;
                padding-right: 7px;
                background: url('../../../../static/image/fujian.svg') no-repeat left center;
                position: relative;
                top: 2px;
                margin-right: 5px;
            }

            .uploadfile {
                position: absolute;
                left: 0;
                top: 0;
                font-size: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
            }
        }

        .uploadform:hover {
            color: #30bcff !important;
        }

        .uploadform:hover>span:before {
            background: url('../../../../static/image/fujian.svg') no-repeat left center;
        }

        .demo-input-suffix {
            font-size: 14px;
            padding-top: 20px;
            color: #626262;
            overflow: hidden;

            .uploadfile {
                padding-left: 118px;
            }

            .el-form-item {
                margin-bottom: 20px;
            }

            .sure {
                text-align: right;
                padding-top: 50px;

                .el-button:nth-child(2) {
                    margin-left: 20px;
                }
            }

            .el-form-item {
                display: inline-block;
                margin-right: 27px;
            }

            .tip {
                color: #999999;
            }
        }

        .filelist {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            padding-left: 16px;
            line-height: 34px;
            background-color: #fafafa;
            border-radius: 6px;
            border: 1px solid #e8ecef;

            li {
                position: relative;
                color: #30bcff;
                cursor: pointer;
                margin-right: 40px;
                padding-right: 20px;

                .del_icon {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    position: absolute;
                    top: 10px;
                    right: 0;
                    background: url('../../../../static/image/cha.svg') no-repeat center;
                    display: none;
                }

                .name {
                    float: left;
                    display: block;
                }
            }

            li:hover .del_icon {
                display: block;
            }

            li:nth-child(1) {
                margin-left: 0;
            }

            .exl:before {
                content: '';
                width: 16px;
                height: 16px;
                display: inline-block;
                padding-right: 9px;
                float: left;
                background: url('../../../../static/image/exl.png') no-repeat left center;
            }

            .pdf:before {
                content: '';
                width: 16px;
                height: 16px;
                display: inline-block;
                padding-right: 9px;
                float: left;
                background: url('../../../../static/image/pdf.png') no-repeat left center;
            }

            .ppt:before {
                content: '';
                width: 16px;
                height: 16px;
                display: inline-block;
                padding-right: 9px;
                float: left;
                background: url('../../../../static/image/ppt.png') no-repeat left center;
            }

            .word:before {
                content: '';
                width: 16px;
                height: 16px;
                display: inline-block;
                padding-right: 9px;
                float: left;
                background: url('../../../../static/image/word.png') no-repeat left center;
            }

            .img:before {
                content: '';
                width: 16px;
                height: 16px;
                display: inline-block;
                padding-right: 9px;
                float: left;
                /*background: url("../../../../static/image/img.png") no-repeat left center;*/
            }
        }
    }
</style>