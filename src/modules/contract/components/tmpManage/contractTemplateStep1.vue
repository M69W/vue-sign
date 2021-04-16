<template>
    <div class="contract-temp-step1">
        <div class="header-title">
            <div class="left">新建模板</div>
            <div class="step">
                <img src="../../../../../static/image/daohang.svg" alt />
            </div>
        </div>
        <div class="temp-content">
            <div class="temp-title">
                <span>模板名称</span>
                <el-input v-model="templateInfo.theme" class="theme" :maxlength="100"></el-input>
                <el-checkbox v-model="templateInfo.customContractCode">自定义合同编号</el-checkbox>
                <el-input
                    v-model="templateInfo.serialNumberPrefix"
                    placeholder="合同编号前缀"
                    v-show="templateInfo.customContractCode"
                    class="prefix"
                    :maxlength="30"
                ></el-input>
                <el-select
                    v-model="templateInfo.serialNumberDate"
                    placeholder="时间"
                    v-show="templateInfo.customContractCode"
                >
                    <el-option
                        v-for="(item, index) in timeList"
                        :key="index"
                        :value="item.value"
                        :label="item.label"
                    ></el-option>
                </el-select>
                <el-input
                    v-model="templateInfo.serialNumberNo"
                    placeholder="流水号，如0001"
                    v-show="templateInfo.customContractCode"
                    class="serial-no"
                    :maxlength="10"
                ></el-input>
            </div>
            <h2 class="top_title">
                <i></i>上传模板文件
            </h2>
            <div class="explain">
                温馨提示：
                <span>1、仅支持.doc、docx、pdf、xls、xlsx格式、图片格式；</span>
                <span>2、文件大小需要&lt;20MB；</span>
            </div>
            <!-- 模板文件上传 -->
            <div class="contract_list clearfix" element-loading-text="文件上传中" id="contract_list">
                <div v-for="(item , key) in contractList" :key="key">
                    <div class="img_box add img_list" :class="{noPic: !item.homePageImagePath}">
                        <div class="img_tip" v-show="item.homePageImagePath">
                            <img :src="`${item.homePageImagePath}&token=${token}`" />
                        </div>
                        <div class="supernatant" v-show="item.homePageImagePath">
                            <span @click="deleteUpload(key)" title="删除"></span>
                            <span @click="look(item)" title="查看详情"></span>
                            <span type="primary" @click="reUpload()" title="重新上传">
                                <form
                                    :id="'ajaxForm'+key"
                                    accept-charset="utf-8"
                                    enctype="multipart/form-data"
                                >
                                    <input
                                        class="uploadinput"
                                        :id="'file'+key"
                                        v-on:change="changeImg($event,key,item)"
                                        name="files"
                                        type="file"
                                        data-min-file-count="1"
                                    />
                                </form>
                            </span>
                        </div>

                        <div class="upload-file-stateWrap" style="display: none;">
                            <span class="upload-file-result"></span>
                            <div class="progress hidden">
                                <div
                                    class="progress-bar"
                                    role="progressbar"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    v-bind:style="{ width: percentVal + '%' }"
                                ></div>
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
                        <p class="upload-icon"></p>
                        <p class="upload-desc">上传模板文件</p>
                    </div>
                    <form
                        :id="'ajaxForm'+ contractList.length"
                        accept-charset="utf-8"
                        enctype="multipart/form-data"
                    >
                        <input
                            class="uploadinput"
                            :id="'file'+ contractList.length"
                            v-on:change="changeImg($event,contractList.length)"
                            name="files"
                            type="file"
                            data-min-file-count="1"
                            multiple
                        />
                    </form>
                </div>
            </div>
            <!-- 附件上传 -->
            <div class="clearfix uploadfile-container">
                <div class="upload-desc">附件上传</div>
                <div class="upload-title">
                    <form
                        accept-charset="utf-8"
                        enctype="multipart/form-data"
                        class="uploadform"
                        id="uploadform"
                    >
                        <span>上传附件</span>
                        <input
                            class="uploadfile"
                            v-on:change="changeFile($event,'upload' , 2)"
                            name="file"
                            type="file"
                            id="fileupload"
                            data-min-file-count="1"
                        />
                    </form>
                    <ul class="filelist" v-show="filelist.length">
                        <li
                            v-for="(file , index) in filelist"
                            :key="index"
                            :class="{exl:file.fileFormat == '1' , pdf:  file.fileFormat == '2' , ppt: file.fileFormat == '3' ,word : file.fileFormat == '4' , img:  file.fileFormat == '5' }"
                            @click="look(file)"
                        >
                            <span class="name">{{file.fileName}}</span>
                            <span class="del_icon" @click.stop="deleteFile(index)"></span>
                        </li>
                    </ul>
                </div>
            </div>
            <h2 class="top_title">
                <i></i>参与角色
            </h2>
            <el-form class="demo-input-suffix" :model="templateInfo" label-position="left">
                <!-- :rules="rules"-->
                <el-form-item label="签署方式">
                    <el-radio-group v-model="templateInfo.signWay">
                        <el-radio
                            class="radio"
                            :label="item.value"
                            :key="item.value"
                            v-for="(item) in resource"
                        >{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 签署列表 -->
                <div class="sign-list">
                    <div class="sign-header">签署人信息</div>
                    <!-- 顺序签署 -->
                    <div class="sign-body" v-if="templateInfo.signWay==='02'">
                        <draggable :list="templateSignatories" @start="dragging = true" @end="dragging = false">
                            <div
                                class="sign-tr"
                                v-for="(item, index) in templateSignatories"
                                :key="index"
                            >
                                <div class="drag-icon"></div>
                                <div class="index">
                                    <div class="index-inner">{{index+1}}</div>
                                </div>
                                <el-input
                                    placeholder="请输入角色名称（20字以内）"
                                    v-model="item.name"
                                    :maxlength="20"
                                    class="name"
                                ></el-input>
                                <div class="is-sign">
                                    <el-select v-model="item.sign" popper-class="is-sign-select">
                                        <el-option label="需签署" :value="1"></el-option>
                                        <el-option label="仅抄送" :value="0"></el-option>
                                    </el-select>
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        content="设置签署人不同的业务操作类型"
                                        placement="top"
                                    >
                                        <img src="../../../../../static/image/gantanhao.svg" alt />
                                    </el-tooltip>
                                </div>
                                <div class="role-set">
                                    <el-checkbox
                                        v-model="item.assignation"
                                        :true-label="1"
                                        :false-label="0"
                                    >指定用户</el-checkbox>
                                    <el-input
                                        placeholder="请输入手机号/邮箱"
                                        v-model="item.signContact"
                                        v-show="item.assignation"
                                        @blur="getUser(item)"
                                        class="phone"
                                    ></el-input>
                                    <el-select
                                        v-model="item.signatoryId"
                                        placeholder="请选择"
                                        v-show="item.assignation"
                                        v-if="item.infoList&&item.infoList.length"
                                        @change="selectMan(item)"
                                    >
                                        <el-option
                                            v-for="(option,i) in item.infoList"
                                            :key="i"
                                            :label="option.idName"
                                            :value="option.id"
                                        ></el-option>
                                    </el-select>
                                    <el-input
                                        placeholder="请输入姓名"
                                        v-model="item.signName"
                                        v-show="item.assignation
                                    "
                                        v-else
                                    ></el-input>
                                </div>
                                <div class="del-btn" @click="delRole(index)">删除</div>
                            </div>
                        </draggable>
                    </div>
                    <!-- 无序签署 -->
                    <div class="sign-body" v-else-if="templateInfo.signWay==='01'">
                        <div
                            class="sign-tr"
                            v-for="(item, index) in templateSignatories"
                            :key="index"
                        >
                            <div class="drag-icon no-icon"></div>
                            <div class="index"></div>
                            <el-input
                                placeholder="请输入角色名称（20字以内）"
                                v-model="item.name"
                                :maxlength="20"
                                class="name"
                            ></el-input>
                            <div class="is-sign">
                                <el-select v-model="item.sign" popper-class="is-sign-select">
                                    <el-option label="需签署" :value="1"></el-option>
                                    <el-option label="仅抄送" :value="0"></el-option>
                                </el-select>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="设置签署人不同的业务操作类型"
                                    placement="top"
                                >
                                    <img src="../../../../../static/image/gantanhao.svg" alt />
                                </el-tooltip>
                            </div>
                            <div class="role-set">
                                <el-checkbox
                                    v-model="item.assignation"
                                    :true-label="1"
                                    :false-label="0"
                                >指定用户</el-checkbox>
                                <el-input
                                    placeholder="请输入手机号/邮箱"
                                    v-model="item.signContact"
                                    v-show="item.assignation"
                                    @blur="getUser(item)"
                                    class="phone"
                                ></el-input>
                                <el-select
                                    v-model="item.signatoryId"
                                    placeholder="请选择"
                                    v-show="item.assignation"
                                    v-if="item.infoList&&item.infoList.length"
                                    @change="selectMan(item)"
                                >
                                    <el-option
                                        v-for="(option,i) in item.infoList"
                                        :key="i"
                                        :label="option.idName"
                                        :value="option.id"
                                    ></el-option>
                                </el-select>
                                <el-input
                                    placeholder="请输入姓名"
                                    v-model="item.signName"
                                    v-show="item.assignation
                                "
                                    v-else
                                ></el-input>
                            </div>
                            <div class="del-btn" @click="delRole(index)">删除</div>
                        </div>
                    </div>
                    <!-- 每人单独签署 -->
                    <div class="sign-body" v-else>
                        <div
                            class="sign-tr"
                            v-for="(item, index) in templateSignatories"
                            :key="index"
                        >
                            <div class="drag-icon no-icon"></div>
                            <div class="index"></div>
                            <el-input
                                placeholder="请输入角色名称（20字以内）"
                                v-model="item.name"
                                :maxlength="20"
                                class="name"
                                disabled
                            ></el-input>
                            <div class="is-sign">
                                <el-select
                                    v-model="item.sign"
                                    popper-class="is-sign-select"
                                    disabled
                                >
                                    <el-option label="需签署" :value="1"></el-option>
                                    <el-option label="仅抄送" :value="0"></el-option>
                                </el-select>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="设置签署人不同的业务操作类型"
                                    placement="top"
                                >
                                    <img src="../../../../../static/image/gantanhao.svg" alt />
                                </el-tooltip>
                            </div>
                            <div class="role-set">{{index>0?'使用模板时，可以批量添加多个签署方':'发起方默认为使用模板的人'}}</div>
                        </div>
                    </div>
                    <div class="add-btn" @click="addRole" v-show="templateInfo.signWay!=='03'">
                        <img src="../../../../../static/image/tianjia.svg" alt /> 添加角色
                    </div>
                </div>
            </el-form>
            <div class="help">
                <p class="help-title">使用说明：</p>
                <p class="help-item">1）上传文件底稿：就是文件中固定不变的部分，作为模板底稿；</p>
                <p class="help-item">2）拖放设置动态内容域：就是文件中变化的内容，通过拖放输入控件的方式来实现；</p>
                <p class="help-item">3）使用模板发起签署：输入动态的内容后，就可以使用此模板生成文件并发起签署业务；</p>
            </div>
            <div class="sure_bottom">
                <el-button @click="toPre">取消</el-button>
                <el-button type="primary" @click="next">下一步</el-button>
            </div>
        </div>
        <!--合同查看弹窗-->
        <div class="alert_look" v-if="alertLook">
            <div class="box">
                <i class="el-message-box__close el-icon-close" @click="close()"></i>
                <h3>{{lookTitle}}</h3>
                <div class="pagedetail" @scroll="handleScroll">
                    <div class="compactList" v-for="(item,index) in compact" :key="index">
                        <div class="list">
                            <img :src="item" />
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
import base from '../../mixin/base';
import moment from 'moment';
import { isPhoneNum, isEmail, checkIntegral, isLetterOrNumber } from '../../../../utils';
import draggable from "vuedraggable";

export default {
    mixins: [base],
    components: {draggable},
    data() {
        return {
            eve: '',
            Item: '',
            percentVal: '',
            title: 'sssssss',
            fileUpload: false,
            contractList: [],
            filelist: [],
            pageNo: 1,
            scloll: true,
            fileCode: '',
            total: 0,
            userId: JSON.parse($.cookie('userinfo')).userId,
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() <= Date.now() - 8.64e7;
                }
            },
            resource: [
                { label: '无序签署：签署顺序不受限制；', value: '01' },
                {
                    label: '顺序签署：按签署顺序一人签署完再到下一环节人签署，即 A-B-C-D；',
                    value: '02'
                },
                {
                    label: '每人单独签署：发起方单独发送每个收件人签署，即A-B，A-C，A-D；',
                    value: '03'
                }
            ],
            token: sessionStorage.getItem('token'),
            isEdit: false,
            timeList: [],
            alertLook: false,
            lookTitle: '',
            fileCode: '',
            total: '',
            compact: [],
            pageNo: '',
            loadTips: '',
            templateSignatories: [],
            temTemplateSignatories: [], // 临时存储
            templateInfo: {
                customContractCode: false,
                theme: '',
                serialNumberPrefix: '',
                serialNumberDate: '',
                serialNumberNo: '',
                signWay: '01'
            },
            // 单独签署签署人信息
            signAlone: [
                {
                    name: '发起方',
                    fillIn: 0,
                    sign: 1,
                    assignation: 0,
                    signContact: '',
                    signName: '',
                    signatoryId: '',
                    infoList: []
                },
                {
                    name: '签署方',
                    fillIn: 0,
                    sign: 1,
                    assignation: 0,
                    signContact: '',
                    signName: '',
                    signatoryId: '',
                    infoList: []
                }
            ],
            isGetUser: false, // 正在获取用户
            timer: ''
        };
    },
    filters: {
        fileName: function(name) {
            try {
                return name.substring(0, name.lastIndexOf('.'));
            } catch (e) {}
        }
    },
    watch: {
        'templateInfo.signWay'(val, oldVal) {
            console.log(val);
            console.log(oldVal);
            if (val === '03') {
                this.temTemplateSignatories = this.templateSignatories;
                this.templateSignatories = this.signAlone;
            } else {
                this.templateSignatories = this.temTemplateSignatories;
            }
        },
        // 'templateInfo.customContractCode'(newVal,oldVal){
        //     if(!newVal){
        //         this.templateInfo.serialNumberPrefix= '';
        //         this.templateInfo.serialNumberDate= '';
        //         this.templateInfo.serialNumberNo='';
        //     }
        // }
    },
    async created() {
        this.getTimeList();
        let id = this.$route.query.id;
        if (id) {
            // 是编辑
            this.isEdit = true;
            // 请求该模板信息
            let res = await this.getTemplateInfo(id);
            if (this.successCheckCode(res)) {
                let templateInfo = res.data;
                this.contractList = templateInfo.templateFiles;
                this.filelist = templateInfo.contractFileList.filter((v) => v.fileType === '04');
                this.temTemplateSignatories = this.templateSignatories = templateInfo.templateSignatories;
                this.templateSignatories.forEach((v) => {
                    if (v.assignation) {
                        this.getUserAllId(v.signContact).then((res) => {
                            if (this.successCheckCode(res)) {
                                // v.infoList = res.data.identityOnes;
                                this.$set(v, 'infoList', res.data.identityOnes);
                            }
                        });
                    }
                });
                this.templateInfo = templateInfo;
                if (templateInfo.serialNumberPrefix) {
                    this.$set(this.templateInfo,'customContractCode',true);
                } else {
                    this.templateInfo.serialNumberPrefix = '';
                    this.templateInfo.serialNumberDate = '';
                    this.templateInfo.serialNumberNo = '';
                }
            }
        }
        // session里面取存入的数据，因为是最新的，存在则优先取
        let templateInfo = JSON.parse(sessionStorage.getItem('templateInfo'));
        if (templateInfo) {
            this.contractList = templateInfo.contractFileList.filter((v) => v.fileType === '03');
            this.filelist = templateInfo.contractFileList.filter((v) => v.fileType === '04');
            this.temTemplateSignatories = this.templateSignatories = templateInfo.templateSignatories;
            this.templateInfo = templateInfo;
        }
        // this.$dragging.$on('dragged', ({ value }) => {});
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
            setTimeout(function() {
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
        callbackFalse(val) {
            console.log(val);
        },
        //附件成功
        attachmentSuccess(data) {
            //成功回调
            if (this.successCheckCode(data)) {
                this.fileUpload = false;
                var data = data.data;
                this.filelist.push(data);
            } else {
                setTimeout(function() {
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
        reUpload() {},
        look(item) {
            this.alertLook = true;
            this.fileCode = item.fileCode;
            this.lookTitle = item.fileName ? item.fileName.split('.')[0] : '';
            this.total = item.filePage || item.pageTotal;
            this.compact = [];
            this.pageNo = 1;
            var url = `/compact/file/page?fileCode=${this.fileCode}&pageNo=${this.pageNo}&token=${this.token}`;
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
        },
        deleteFile(index) {
            this.filelist.splice(index, 1);
        },
        toPre() {
            this.$router.push('/templatemanage');
        },
        async next() {
            if (!this.templateInfo.theme.trim()) {
                return this.$message.warning('请输入模板名称');
            }
            if (!!this.fileUpload) {
                return this.$message({
                    message: '请先等待文件上传完成',
                    type: 'warning',
                    duration: 3000
                });
            }
            if (!this.contractList.length) {
                return this.$message({
                    message: '请上传模板文件再进行下一步',
                    type: 'warning',
                    duration: 3000
                });
            }
            if (this.isGetUser) {
                return this.$message.warning('正在获取用户信息，请稍后点击下一步');
            }
            // 如有选择自定义合同编号
            if (this.templateInfo.customContractCode) {
                // 不能留空
                if (!this.templateInfo.serialNumberPrefix.trim()) {
                    return this.$message.warning('请输入合同编号前缀');
                } else if (!isLetterOrNumber(this.templateInfo.serialNumberPrefix.trim(), 1, 30)) {
                    return this.$message.warning('合同编号前缀为数字或字母');
                }
                if (!this.templateInfo.serialNumberDate) {
                    return this.$message.warning('请选择合同编号的时间格式');
                }
                if (!this.templateInfo.serialNumberNo.trim()) {
                    return this.$message.warning('请输入合同编号的流水号');
                } else if (
                    !checkIntegral(this.templateInfo.serialNumberNo.trim()) &&
                    Number(this.templateInfo.serialNumberNo.trim()) !== 0
                ) {
                    return this.$message.warning('流水号应为纯数字');
                }
            }else{
                this.templateInfo.serialNumberPrefix= '';
                this.templateInfo.serialNumberDate= '';
                this.templateInfo.serialNumberNo='';
            }
            if (!this.templateSignatories.length) {
                return this.$message.warning('请添加签署人再进行下一步');
            }
            // 必须存在一个需签署的角色
            let signMan = this.templateSignatories.find((v) => v.sign === 1);
            if (!signMan) {
                return this.$message.warning('至少需要一个需签署的角色');
            }
            // 签署人信息校验
            for (const item of this.templateSignatories) {
                if (!item.name.trim()) {
                    return this.$message.warning('角色名称不能为空');
                }
                if (item.assignation) {
                    if (!item.signName) {
                        return this.$message.warning('指定用户的姓名不能为空');
                    }
                    if (!item.signContact) {
                        return this.$message.warning('指定用户的手机/邮箱不能为空');
                    }
                    if (!isPhoneNum(item.signContact.trim()) && !isEmail(item.signContact.trim())) {
                        return this.$message.warning('指定用户的手机/邮箱格式不正确');
                    }
                    if (!item.userType) {
                        let res = await this.getUserAllId(item.signContact.trim());
                        if (this.successCheckCode(res) && res.data.identityOnes.length) {
                            let selectItem = res.data.identityOnes.find((v) => v.id === item.signatoryId);
                            item.userType = selectItem ? selectItem.userType : '';
                        }
                    }
                } else {
                    item.signName = '';
                    item.signContact = '';
                    item.signatoryId = '';
                    item.userType = '';
                }
            }

            // 检查角色名称是否重复
            let nameList = this.templateSignatories.map((v) => v.name);
            if (nameList.length !== [...new Set(nameList)].length) {
                return this.$message.warning('角色名称不能重复');
            }
            // 检查手机号/邮箱是否重复
            let phoneList = this.templateSignatories.map((v, i) => v.signContact || i);
            if (phoneList.length !== [...new Set(phoneList)].length) {
                return this.$message.warning('同一个签署人不能出现多次');
            }

            this.contractList.forEach((v) => {
                v.pageTotal = v.filePage || v.pageTotal;
                v.fileType = '03';
            });
            this.filelist.forEach((v) => {
                v.pageTotal = v.filePage || v.pageTotal;
                v.fileType = '04';
            });
            let contractFileList = [].concat(this.contractList).concat(this.filelist);
            let templateInfo = Object.assign(this.templateInfo, {
                contractFileList,
                templateSignatories: this.templateSignatories
            });
            sessionStorage.setItem('templateInfo', JSON.stringify(templateInfo));
            if (this.isEdit) {
                this.$router.push(`/wordTemplate?id=${this.$route.query.id}`);
                return;
            }
            this.$router.push('/wordTemplate');
        },
        // 添加角色
        addRole() {
            if (this.templateSignatories.length === 10) {
                return this.$message.warning('最多只能添加10个角色');
            }
            this.templateSignatories.push({
                name: '',
                fillIn: 0,
                sign: 1,
                assignation: 0,
                signContact: '',
                signName: '',
                signatoryId: '',
                infoList: []
            });
        },
        // 删除角色
        delRole(index) {
            this.templateSignatories.splice(index, 1);
        },
        // 获取时间列表
        getTimeList() {
            let now = new Date();
            let year = now.getFullYear().toString();
            let month = now.getMonth() + 1;
            month = (month > 9 ? month : '0' + month).toString();
            let day = now.getDate().toString();
            this.timeList.push({ value: 'yyyy', label: '年，如 ' + year });
            this.timeList.push({ value: 'yyyyMM', label: '年月，如 ' + year + month });
            this.timeList.push({ value: 'yyyyMMdd', label: '年月日，如 ' + year + month + day });
        },
        handleScroll() {
            var distance = $('.compactList').offset().top;
            if (this.pageNo == this.total) {
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
                        var url = '/compact/file/page?fileCode=' + this.fileCode + '&pageNo=' + this.pageNo + '&token=' + this.token;
                        this.compact.push(url);
                        this.timer = '';
                    }, 500);
                }
            }
        },
        close() {
            this.alertLook = false;
        },
        // 查询用户
        getUser(item) {
            this.isGetUser = true;
            this.getUserAllId(item.signContact.trim() || null).then((res) => {
                if (this.successCheckCode(res)) {
                    item.infoList = res.data.identityOnes;
                    if (res.data.identityOnes.length) {
                        item.signatoryId = res.data.identityOnes[0].id;
                        item.signName = res.data.identityOnes[0].idName;
                        item.userType = res.data.identityOnes[0].userType;
                    } else {
                        item.signatoryId = '';
                        item.signName = '';
                        item.userType = '';
                    }
                    this.isGetUser = false;
                }
            });
        },
        selectMan(item) {
            item.signName = item.infoList.find((v) => v.id === item.signatoryId).idName;
            item.userType = item.infoList.find((v) => v.id === item.signatoryId).userType;
        }
    },
    beforeRouteLeave(to, from, next) {
        if (to.path !== '/wordTemplate') {
            sessionStorage.removeItem('templateInfo');
        }
        next();
    }
};
</script>
<style lang="scss">
.contract-temp-step1 .el-form-item__label {
    width: 96px !important;
}

.el-scrollbar__wrap {
    overflow-x: hidden;
}

.el-scrollbar__wrap {
    height: 100%;
}

.contract-temp-step1 .el-form-item__content,
.contract-temp-step1 .el-form-item__content > div,
.contract-temp-step1 .el-date-editor--daterange.el-input {
    width: 354px;
    display: inline-block;
}

.contract-temp-step1 .textarea .el-form-item__content,
.contract-temp-step1 .textarea .el-form-item__content .el-textarea {
    width: 900px;
}

.contract-temp-step1 .el-form-item__label {
    width: 84px;
    margin-right: 20px;
    color: #626262;
}

.contract-temp-step1 .textarea .el-form-item__label {
    vertical-align: top;
}

.contract_list .add .upload-icon:before {
    content: '';
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url('../../../../../static/image/shangchuan.svg') no-repeat center;
}

.add.img_box:hover .upload-icon:before {
    background: url('../../../../../static/image/shangchuan2.svg') no-repeat center;
}

.contract-temp-step1 {
    .el-input.is-disabled {
        .el-input__inner {
            background-color: #f6f9fe;
            color: #c0ccda;
        }
    }
    .top_title {
        border: 0;
        font-size: 16px;
    }
    .demo-input-suffix {
        .el-form-item__label {
            font-size: 16px;
            color: #999;
        }
    }
    .view-detail {
        .page-no {
            text-align: center;
            line-height: 40px;
            background-color: #f4f6f8;
        }
        .el-dialog__header {
            background-color: #f4f6f8;
        }
        .el-dialog__body {
            // background-color: #f4f6f8;
            background-color: #fff;
            padding: 0;
            padding-bottom: 20px;
            height: 620px;
            .el-scrollbar {
                height: 100%;
                .el-image {
                    width: 100%;
                    background-color: #fff;
                    min-height: 500px;
                    text-align: center;
                    .img-error,
                    .img-placeholder {
                        // padding: 50px 200px;
                        line-height: 500px;
                    }
                }
            }
            img {
                // width: 100%;
            }
        }
    }
}
</style>
<style scoped lang="scss">
.contract-temp-step1 {
    background-color: #fff;
    padding-bottom: 30px;
    .header-title {
        height: 60px;
        line-height: 60px;
        padding: 0 30px;
        border-bottom: 1px solid #e8ecef;
        position: relative;
        .left {
            font-size: 18px;
            color: #333;
            position: absolute;
            top: 0;
            left: 20px;
        }
        .step {
            text-align: center;
        }
    }
    .alert_look {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        /*overflow: auto;*/
        z-index: 99;
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

            > div {
                background-color: #fff;
                overflow-y: auto;

                .list {
                    height: 1100px;
                    width: 800px;
                    position: relative;
                    margin: 0 auto;

                    img {
                        height: 1100px;
                        // width: 100%;
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
        div.pagedetail {
            width: 1120px;
            overflow: auto;
            height: 80%;
            margin: 0 auto;

            div.compactList {
                height: 1100px;
            }
        }
        .loadEnd {
            text-align: center;
            padding: 5px;
        }
    }
    .temp-content {
        padding: 0 30px;
        .temp-title {
            line-height: 96px;
            border-bottom: 1px solid #e9e9e9;
            > span {
                font-size: 16px;
                margin-right: 10px;
            }
            .theme {
                width: 300px;
                margin: 0 40px 0 10px;
            }
            .prefix,
            .serial-no {
                width: 150px;
                margin: 0 5px;
            }
            .el-select {
                width: 190px;
            }
        }
        .uploadfile-container {
            padding-bottom: 30px;
            border-bottom: 1px solid #e9e9e9;
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
    }

    .sign-list {
        width: 100%;
        .sign-header {
            line-height: 50px;
            font-size: 16px;
            color: #999;
        }
        .sign-body {
            .sign-tr {
                height: 50px;
                background-color: #dee6f9;
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                padding-left: 10px;
                &:hover {
                    background-color: #fcf0d2;
                    .drag-icon {
                        background: url('../../../../../static/image/hengxian_hover.svg') no-repeat center;
                    }
                }
                .el-input {
                    width: 220px;
                }
                .drag-icon {
                    width: 21px;
                    height: 10px;
                    background: url('../../../../../static/image/hengxian.svg') no-repeat center;
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
                    width: 528px;
                    display: flex;
                    align-items: center;
                    .el-checkbox {
                        margin-right: 16px;
                    }
                    .el-input {
                        margin-right: 10px;
                    }
                    .phone {
                        width: 170px;
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

    .filename {
        display: inline-block;
        max-width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: top;
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
        > .add {
            border-style: dashed !important;
        }

        > .add:hover {
            border-color: #02adff !important;
        }

        > div {
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

        > div:nth-child(4n) {
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
            .upload-desc {
                font-size: 16px;
            }
            &:hover {
                .upload-desc {
                    color: #02adff;
                }
            }
            .upload-icon {
                font-size: 30px;
                display: block;
                color: #c0ccda;
            }

            p {
                font-size: 14px;
                color: #626262;
                padding-top: 10px;
            }

            > div {
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
                    background-image: url('../../../../../static/image/delete_black.png');
                    background-position: center;
                    background-repeat: no-repeat;
                }

                span:nth-child(1):hover {
                    background-image: url('../../../../../static/image/delete_white.png');
                }

                span:nth-child(2) {
                    background-image: url('../../../../../static/image/look_black.png');
                    background-position: center;
                    background-repeat: no-repeat;
                    margin: 0 10px;
                }

                span:nth-child(2):hover {
                    background-image: url('../../../../../static/image/look_white.png');
                }

                span:nth-child(3) {
                    background-image: url('../../../../../static/image/upload_black.png');
                    background-position: center;
                    background-repeat: no-repeat;
                    position: relative;
                }

                span:nth-child(3):hover {
                    background-image: url('../../../../../static/image/upload_white.png');
                }

                > span:hover {
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
        > span {
            color: #626262;
        }
        > span:before {
            content: '';
            width: 12px;
            height: 16px;
            display: inline-block;
            padding-right: 7px;
            background: url('../../../../../static/image/fujian.svg') no-repeat left center;
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
        border-color: #30bcff;
        > span {
            color: #30bcff;
        }
    }

    .uploadform:hover > span:before {
        background: url('../../../../../static/image/fujian2.svg') no-repeat left center;
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
                background: url('../../../../../static/image/cha.svg') no-repeat center;
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
            background: url('../../../../../static/image/exl.png') no-repeat left center;
        }

        .pdf:before {
            content: '';
            width: 16px;
            height: 16px;
            display: inline-block;
            padding-right: 9px;
            float: left;
            background: url('../../../../../static/image/pdf.png') no-repeat left center;
        }

        .ppt:before {
            content: '';
            width: 16px;
            height: 16px;
            display: inline-block;
            padding-right: 9px;
            float: left;
            background: url('../../../../../static/image/ppt.png') no-repeat left center;
        }

        .word:before {
            content: '';
            width: 16px;
            height: 16px;
            display: inline-block;
            padding-right: 9px;
            float: left;
            background: url('../../../../../static/image/word.png') no-repeat left center;
        }

        .img:before {
            content: '';
            width: 16px;
            height: 16px;
            display: inline-block;
            padding-right: 9px;
            float: left;
            /*background: url("../../../../../static/image/img.png") no-repeat left center;*/
        }
    }
    .demo-input-suffix {
        font-size: 14px;
        color: #626262;
        overflow: hidden;
        margin-bottom: 30px;
        .el-radio {
            margin-left: 0;
            line-height: 36px;
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
    .help {
        line-height: 30px;
        &-title {
            font-size: 16px;
            color: #626262;
        }
        &-item {
            font-size: 14px;
            color: #999;
        }
    }
}
</style>
<style lang="scss">
.is-sign-select .el-select-dropdown__item {
    min-width: 150px;
}
</style>