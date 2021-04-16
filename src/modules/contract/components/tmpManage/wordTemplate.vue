<template>
    <div class="word-template">
        <div class="inner">
            <div class="tmp-head d-flex">
                <span class="breadcrumb">
                    <router-link :to="{path:'/contractTemplateStep1',query:{id:$route.query.id}}">
                        <i class="el-icon-arrow-left"></i>&nbsp;返回
                    </router-link>
                </span>
                <span class="step-nav flex1">
                    <img :src="step2Img" alt="设置模板" />
                </span>
                <span class="tmp-info">
                    <el-button @click="cancelTemplate">取消</el-button>
                    <el-button type="primary" @click="saveTemplate">保存</el-button>
                </span>
            </div>

            <section class="container container-sign">
                <!-- 控件列表 -->
                <div class="sign-list">
                    <div class="sign-list-box">
                        <div class="widget-title">
                            <div class="title-big title-big-tmp">模板文件列表</div>
                            <el-form class="tmp-list" ref="selectForm" :model="selectForm">
                                <el-form-item>
                                    <el-select
                                        v-model="selectForm.tmpName"
                                        @change="tmpFileChange"
                                        placeholder="请选择模板文件"
                                    >
                                        <el-option
                                            v-for="(item, index) in tmpFileList"
                                            :key="index"
                                            :label="item.fileName"
                                            :value="item.fileCode"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="widget-list">
                            <div class="title">
                                <span>自定义控件</span>
                                <span class="tips">请向右侧文件点击添加控件</span>
                            </div>
                            <div class="pos-sign">
                                <ul>
                                    <li
                                        v-for="(item, index) in widgetItem"
                                        class="commonClassName"
                                        :key="index"
                                        :class="item.class"
                                        @click="addControl(index + 1)"
                                    >
                                        <i :class="item.icon"></i>
                                        {{item.title}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /控件列表 -->

                <!-- 文件签署区 -->
                <div class="file-area">
                    <div class="drag-wrap">
                        <div class="page-num">
                            <div class="skip-page">
                                前往
                                <input v-model.trim="skipPage" @blur="skipPageBlur" />页
                            </div>
                            <span class="number">{{ pageNumber }}/{{ totalPage }}</span>
                        </div>
                        <div class="drag-wrap-files" style="width: 100%;height:100%">
                            <img
                                :src="`/compact/file/page?fileCode=${fileCode}&pageNo=${pageNumber}&token=${token}`"
                                alt="文件"
                            />
                        </div>
                        <!-- 控件 -->
                        <vue-draggable-resizable
                            v-for="(item, index) in controlsArr"
                            :key="item.customId"
                            :ref="item.customId"
                            :custom-id="item.customId"
                            :h="item.fontsSize | filterFonstSizeToHeight(item)"
                            :w="item.width"
                            :x="item.initX"
                            :y="item.initY"
                            :minWidth="200"
                            :parent="true"
                            :common-class-name="commonClassName"
                            :class-name="item.type | filterAccordingToType"
                            :border-class="item.borderClass"
                            :handles="item.type | filterAccordingToType('handles')"
                            :class="{'not-click': notClick}"
                            @resizestop="onResizstop"
                            @dragstop="onDragstop"
                            @activated="onActivated"
                            v-show="item.fileCode === fileCode && item.pageNumber === pageNumber"
                        >
                            <div :class="commonClassName" class="inner-container">
                                {{ filterSignatory(item.signatory)}}
                                <span
                                    class="name"
                                    :title="item.name"
                                >{{ item.name }}</span>
                            </div>
                            <i class="close icon-close" @click="removeControl(item.customId)"></i>
                            <div class="seal-inner" :class="commonClassName">
                                <div class="seal" :class="commonClassName"></div>
                            </div>
                        </vue-draggable-resizable>
                        <!-- /控件 -->
                    </div>
                    <!-- 翻页器 -->
                    <div class="turn-page">
                        <span :class="{ disabled: pageNumber==1 }" @click="redirectTop">
                            <i class="iconfont icon-zhiding"></i>
                        </span>
                        <span :class="{ disabled: pageNumber==1 }" @click="prePage">
                            <i class="iconfont icon-shangyiye"></i>
                        </span>
                        <span :class="{ disabled: pageNumber==totalPage }" @click="nextPage">
                            <i class="iconfont icon-xiayiye"></i>
                        </span>
                        <span :class="{ disabled: pageNumber==totalPage }" @click="redirectBottom">
                            <i class="iconfont icon-zhidi"></i>
                        </span>
                    </div>
                    <!-- /翻页器 -->
                </div>

                <div class="attr-list" v-if="widgetSet">
                    <div class="attr-list-box">
                        <div class="title-big title-big-widget">
                            <span class="title-width" :title="textVal" v-text="`${textVal}`"></span>
                            <span>控件设置</span>
                        </div>
                        <div class="attr-list-item">
                            <!-- 保留 -->
                            <div class="item">
                                <el-form :label-position="labelPosition" label-width="80px">
                                    <el-form-item
                                        v-show="activedType!=='seal'&&activedType!=='sign'"
                                    >
                                        <div class="require-box">
                                            <div class="left">
                                                <span>是否为必填项</span>
                                                <el-tooltip
                                                    class="item"
                                                    effect="dark"
                                                    content="该控件字段在签署合同的时候是否为必填项"
                                                    placement="top"
                                                >
                                                    <img
                                                        src="../../../../../static/image/gantanhao.svg"
                                                        alt
                                                    />
                                                </el-tooltip>
                                            </div>
                                            <el-switch
                                                v-model="nameRequire"
                                                @change="requireChange"
                                                on-text
                                                off-text
                                            ></el-switch>
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="控件名称" class="label-name">
                                        <el-input
                                            type="text"
                                            v-model="textVal"
                                            @change="textChange"
                                            :maxlength="30"
                                            placeholder="请输入控件名称"
                                        ></el-input>
                                        <!-- <span class="err-txt" v-if="requireTips">必填字段不能为空</span> -->
                                        <!-- <el-checkbox
                                            v-model="nameRequire"
                                            @change="requireChange"
                                            label="必填项"
                                            name="require"
                                            v-show="activedType!=='seal'&&activedType!=='sign'"
                                        ></el-checkbox>-->
                                    </el-form-item>
                                    <el-form-item label="类型" v-if="typeShow">
                                        <el-select
                                            v-model="inputType"
                                            @change="selectInputType"
                                            placeholder="请选择类型"
                                        >
                                            <el-option
                                                v-for="(item, index) in typeOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="签署人设置" v-if="signPersonShow">
                                        <el-select
                                            v-model="signatory"
                                            @change="selectSignatory"
                                            placeholder="请选择签署人"
                                        >
                                            <el-option
                                                v-for="(item, index) in signatoryOption"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.name"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="optionsShow">
                                        <div class="area-box">
                                            <div class="options-title">
                                                <span class="title">选项内容</span>
                                            </div>
                                            <div class="text-area">
                                                <el-form-item prop="initial">
                                                    <el-input
                                                        v-model="optionsInitial"
                                                        placeholder="请输入选项内容"
                                                        :maxlength="25"
                                                    ></el-input>
                                                    <i class="icon icon-add" @click="addDomain"></i>
                                                </el-form-item>
                                                <el-form-item
                                                    v-for="(domain, index) in sealSet.domains"
                                                    :key="domain.key"
                                                    prop="'domains.' + index + '.value'"
                                                >
                                                    <el-input
                                                        v-model="domain.value"
                                                        placeholder="请输入选项内容"
                                                        :maxlength="25"
                                                    ></el-input>
                                                    <i
                                                        class="icon icon-remove"
                                                        @click.prevent="removeDomain(domain)"
                                                    ></i>
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </el-form-item>

                                    <el-form-item label="日期格式" v-if="dateFormatShow">
                                        <el-select
                                            v-model="dateFormat"
                                            @change="dataFormatStyle"
                                            placeholder="请选择日期格式"
                                        >
                                            <el-option
                                                v-for="(item, index) in dateFormatList"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="字体" v-if="fontFamilyShow">
                                        <el-select
                                            v-model="fontFamilyValue"
                                            @change="selectFontFamily"
                                            placeholder="请选择字体"
                                        >
                                            <el-option
                                                v-for="(item, index) in fontFamilyList"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="字号" v-if="fontSizeShow">
                                        <el-select
                                            v-model="fontSizeValue"
                                            @change="selectFontsize"
                                            placeholder="请选择字号"
                                        >
                                            <el-option
                                                v-for="(item, index) in fontSizeOptions"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="外观" v-if="borderShow">
                                        <el-select
                                            v-model="borderStyle"
                                            @change="selectBorderStyle"
                                            placeholder="请选择外观"
                                        >
                                            <el-option
                                                v-for="(item, index) in borderSet"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <!-- /保留 -->
                        </div>
                    </div>
                </div>

                <!-- 模板无控件显示 -->
                <div class="tmp-null" v-if="emptyTmp">
                    <img :src="emptyImg" alt="请选择控件" />
                    <span class="tips">
                        请从控件库中选择控件或
                        <br />选中已经添加到文件上的控件
                    </span>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import VueDraggableResizable from '@/components/vueDraggableResizable';
import { findIndex, find } from 'lodash';
import { wordFontSizeToPx, checkIntegral } from '@/utils';
import service from '@/assets/mixin/service';
import arrtList from './attrList';

export default {
    components: {},
    mixins: [service],
    data() {
        return {
            activedId: '', // 编辑实例的id
            activedType: '', // 编辑实例的类型
            commonClassName: 'target', // 确保点击其它非控件元素时，已激活的控件不失去焦点,作为单选高亮判定标准
            activedClass: 'lq-active-class',
            widgetItem: [], // 控件库按钮
            controlsArr: [], // 所有控件数组
            fontSizeOptions: [], // 字号选择
            typeOptions: [], // 类型选择
            fontFamilyList: [], // 选择字体
            signatoryOptions: [], // 签署人设置
            dateFormatList: [], // 日期格式
            borderSet: [], // 外观设置
            textVal: '',
            fontSizeValue: 10, // 默认5号 14px
            fontFamilyValue: '宋体',
            inputType: '文本',
            borderStyle: '下划线',
            dateFormat: 'YYYY/MM/DD',
            signatory: '', // 默认甲方
            typeShow: false,
            fontFamilyShow: false,
            fontSizeShow: false,
            signPersonShow: false,
            borderShow: false,
            dateFormatShow: false,
            optionsShow: false,
            widgetSet: false,
            emptyTmp: true,
            labelPosition: 'top',
            token: sessionStorage.getItem('token'),
            tmpFileList: [], // 模板文件列表
            redirectTopPageDis: true, // 直达顶部
            prePageDis: true,
            nextPageDis: false,
            redirectBottomPageDis: false,
            selectForm: {
                tmpName: ''
            },
            fileCode: '', // 文件code
            pageNumber: 1, // 当前页
            totalPage: 1, // 总页数
            skipPage: 1,
            step2Img: '../../../../../static/image/tmpManage/step2.svg',
            emptyImg: '../../../../../static/image/tmpManage/kongjian.svg',
            nameRequire: false,
            debounceTimer: null, // 鼠标滚动翻页
            // 提交的数据
            dataNew: null,
            contractFileList: [],
            templateSignatories: [],
            templateWidgetList: [], // 控件列表
            optionsInitial: '',
            sealSet: {
                domains: []
            },
            notClick: false,
            templateId: this.$route.query.id,
            // 编辑的数据
            editTemplateData: [],
            timer: ''
        };
    },
    components: {
        VueDraggableResizable
    },
    created() {
        this.widgetItem = arrtList.widgetItem; // 控件库按钮

        this.typeOptions = arrtList.typeItem; // 类型选择

        this.fontFamilyList = arrtList.fontFamilyList; // 设置字体

        this.dateFormatList = arrtList.dateFormat; // 设置日期格式

        this.borderSet = arrtList.border; // 设置外观

        this.fontSizeOptions = arrtList.fontSize; // 设置字号

        let tmpInfo = sessionStorage.getItem('templateInfo');

        let data = JSON.parse(tmpInfo);

        this.dataNew = data;

        this.fileCode = data.contractFileList[0].fileCode || ''; // 默认显示第一个文件

        this.selectForm.tmpName = data.contractFileList[0].fileName || '';

        // 过滤附件
        let getFileList = data.contractFileList.filter((item) => {
            if (item.fileType === '03') {
                return item;
            }
        });

        this.tmpFileList = getFileList; // 获取文件列表

        this.totalPage = data.contractFileList[0].pageTotal || 1; // 获取总页数
        this.renderData();
        // 编辑渲染数据
        if (!!this.templateId) {
            this.getTemplateInfo(this.templateId)
                .then((res) => {
                    let height = 0;
                    let widgetList = res.data.signSysTemplateFieldReqVOList;
                    widgetList.map((item) => {
                        let optionContent = '';
                        if (item.type === 'sign') {
                            height = 40;
                        }
                        if (item.type === 'seal') {
                            height = 86;
                        }
                        if (item.type === 'select') {
                            let time = +new Date();
                            optionContent = item.optionContent.split(';').map((v, i) => {
                                if (i === 0) {
                                    return v;
                                } else {
                                    return {
                                        key: time + 100 * i,
                                        value: v
                                    };
                                }
                            });
                        }
                        //设置当前如何
                        this.controlsArr.push({
                            type: item.type,
                            height: height,
                            customId: item.customId,
                            width: +item.width,
                            x: item.signatureCoordinateX,
                            y: item.signatureCoordinateY,
                            initX: item.signatureCoordinateX,
                            initY: item.signatureCoordinateY,
                            fileCode: item.fileCode,
                            fontsSize: item.fontSize,
                            name: item.signName,
                            inputType: String(item.fieldType),
                            borderStyle: item.appearance,
                            isRequire: item.isChoose === 0 ? false : true,
                            optionContent,
                            fontsFamily: item.typeface,
                            signatory: this.signatoryOptions.filter(v=>v.sign==1).map((v) => v.name).includes(item.signUser) ? item.signUser : '',
                            dateFormat: item.dateFormat,
                            pageNumber: item.signatureStartPage
                        });
                    });
                })
                .fail((err) => {
                    console.log(err);
                });
        }
        this.$nextTick(() => {
            // 滚轮事件：firefox（DOMMouseScroll），其他（mousewheel）
            $('.file-area')[0].addEventListener('mousewheel', this.fileContainerWheel);
            $('.file-area')[0].addEventListener('DOMMouseScroll', this.fileContainerWheel);
        });
    },

    filters: {
        filterAccordingToType(controlsType, type) {
            let className = '';
            let handles = [];
            switch (controlsType) {
                case 'text':
                    className = 'lq-draggable-text';
                    handles = ['mr'];
                    break;
                case 'seal':
                    className = 'lq-draggable-seal';
                    handles = [];
                    break;
                case 'sign':
                    className = 'lq-draggable-sign';
                    handles = [];
                    break;
                case 'date':
                    className = 'lq-draggable-date';
                    handles = [];
                    break;
                case 'select':
                    className = 'lq-draggable-select';
                    handles = [];
                    break;
                default:
                    break;
            }
            if (type && type === 'handles') {
                return handles;
            } else {
                return className;
            }
        },
        filterFonstSizeToHeight(fontSize, item) {
            if (item.type === 'sign' || item.type === 'seal') {
                // 印章和签名固定高度
                return item.height;
            }
            return wordFontSizeToPx(fontSize) + 10; // 上下5px padding
        }
    },
    watch: {
        // 监听控件数组长度
        controlsArr(val) {
            // if (val.length === 0) {
            //     this.widgetSet = false;
            //     this.emptyTmp = true;
            // } else {
            //     this.emptyTmp = false;
            // }
        },
        // 跳转到指定页
        skipPage(val, oldVal) {
            if (val) {
                if (typeof +val === 'number' && val > 0 && val <= this.totalPage && checkIntegral(val)) {
                    this.pageNumber = val;
                } else if (val > this.totalPage) {
                    this.$message.warning('输入页码不能大于总页数');
                    this.skipPage = this.totalPage;
                } else if (val <= 0) {
                    this.skipPage = 1;
                } else if (!oldVal) {
                    this.skipPage = this.pageNumber;
                } else {
                    this.skipPage = this.pageNumber = oldVal;
                }
            }
        }
    },
    computed: {
        filterSignatory() {
            return function(signatory) {
                let findItem = find(this.signatoryOptions, (o) => {
                    return signatory === o.signatoryId;
                });
            };
        },
        signatoryOption() {
            console.log("signatoryOption");
            let index = this.getEditIndex();
            let type = this.controlsArr[index].type;
            let signatoryOptions = this.signatoryOptions.filter((v) => v.sign === 1);
            //当seal时候签署人需要是userType||userType==01 
            return type === 'seal' ? signatoryOptions.filter((v) => !v.userType || v.userType === '01') : signatoryOptions;
        }
    },
    methods: {
        // 点击控件
        onActivated(customId) {
            let copyData = JSON.parse(JSON.stringify(this.controlsArr));
            copyData.forEach((item) => {
                item.customId === customId ? (item.borderClass = 'lq-active-class') : (item.borderClass = '');
            });
            this.controlsArr = copyData;

            let oldIndex = this.getEditIndex();//设置好选项内容，再次点击其他空间，则设置sealSet.domains//activeId为上一激活的空间
            if (oldIndex !== '') {
                let arr = JSON.parse(JSON.stringify(this.sealSet.domains));
                arr.unshift(this.optionsInitial);
                this.controlsArr[oldIndex].optionContent = arr;
            }//新增
            this.widgetSet = true;
            this.emptyTmp = false;
            // 点击 赋值
            this.activedId && this.setVal(this.textVal);
            this.activedId = customId;

            let editIndex = this.getEditIndex();
            this.activedType = this.controlsArr[editIndex].type;
            this.textVal = this.controlsArr[editIndex].name; // 设置文本名称
            this.signatory = this.controlsArr[editIndex].signatory; // 设置签署方
            this.nameRequire = this.controlsArr[editIndex].isRequire; // 绑定是否必填项
            this.pageNumber = this.controlsArr[editIndex].pageNumber; // 绑定当前页
            this.fileCode = this.controlsArr[editIndex].fileCode; // 绑定fileCode
            this.className = this.controlsArr[editIndex].className; // 绑定className

            // 设置签字号
            if (['text', 'date', 'select'].includes(this.activedType)) {
                this.fontSizeValue = this.controlsArr[editIndex].fontsSize;
                this.fontFamilyValue = this.controlsArr[editIndex].fontsFamily;
                this.borderStyle = this.controlsArr[editIndex].borderStyle;
                if (['text'].includes(this.activedType)) {
                    this.inputType = this.controlsArr[editIndex].inputType;
                }
                if (['date'].includes(this.activedType)) {
                    this.dateFormat = this.controlsArr[editIndex].dateFormat;
                }
                if (['select'].includes(this.activedType)) {
                    let arr = JSON.parse(JSON.stringify(this.controlsArr[editIndex].optionContent));
                    this.optionsInitial = arr[0];
                    arr.shift();
                    this.sealSet.domains = arr;
                }
            } else {
                this.fontSizeValue = 10;
                this.fontFamilyValue = '宋体';
                // this.inputType = 1;
                this.inputType = '文本';
                this.borderStyle = '下划线';
                // this.dateFormat = 'YYYY/MM/DD';
            }
            this.widgetList(this.activedType);
        },
        setControlsBorder() {
            let copyData = JSON.parse(JSON.stringify(this.controlsArr));
            copyData.forEach((item) => {
                item.borderClass = '';
            });
            controlObjMap[type].borderClass = 'lq-active-class';
            copyData.push(controlObjMap[type]);
            this.controlsArr = copyData;
        },
        //控件对因显示右侧列表
        widgetList(type) {
            if (type === 'text') {
                this.typeShow = true; // 类型
                this.signPersonShow = true; // 签署人
                this.fontFamilyShow = true; // 字体
                this.fontSizeShow = true; // 字号
                this.borderShow = true; // 外观
                this.optionsShow = false; // 选项
                this.dateFormatShow = false; // 日期格式
            }
            if (type === 'select') {
                this.typeShow = false; // 类型
                this.signPersonShow = true; // 签署人
                this.fontFamilyShow = true; // 字体
                this.fontSizeShow = true; // 字号
                this.borderShow = true; // 外观
                this.optionsShow = true; // 选项
                this.dateFormatShow = false; // 日期格式
            }
            if (type === 'date') {
                this.typeShow = false; // 类型
                this.signPersonShow = true; // 签署人
                this.fontFamilyShow = true; // 字体
                this.fontSizeShow = true; // 字号
                this.borderShow = true; // 外观
                this.optionsShow = false; // 选项
                this.dateFormatShow = true; // 日期格式
            }
            if (type === 'seal') {
                this.typeShow = false; // 类型
                this.signPersonShow = true; // 签署人
                this.fontFamilyShow = false; // 字体
                this.fontSizeShow = false; // 字号
                this.borderShow = false; // 外观
                this.optionsShow = false; // 选项
                this.dateFormatShow = false; // 日期格式
            }
            if (type === 'sign') {
                (this.typeShow = false), // 类型
                    (this.signPersonShow = true); // 签署人
                this.fontFamilyShow = false; // 字体
                this.fontSizeShow = false; // 字号
                this.borderShow = false; // 外观
                this.optionsShow = false; // 选项
                this.dateFormatShow = false; // 日期格式
            }
        },
        // 模板文件选择
        tmpFileChange(fileCode) {
            this.fileCode = fileCode;
            this.skipPage = this.pageNumber = 1;
            this.totalPage = this.tmpFileList.find((v) => v.fileCode === fileCode).pageTotal;
        },
        // 缩放结束
        onResizstop(left, top, width, height, customId) {
            let editIndex = this.getEditIndex();
            this.controlsArr[editIndex].width = width;
        },
        // 拖动结束
        onDragstop(left, top, customId) {
            let editIndex = this.getEditIndex();
            console.log(left,top);
            this.controlsArr[editIndex].x = left;
            this.controlsArr[editIndex].y = top;
        },
        // 文本编辑完成
        textChange(val) {
            this.setVal(val);
        },
        // 必填项检查
        requireChange() {
            let editIndex = this.getEditIndex();
            this.controlsArr[editIndex].isRequire = this.nameRequire;
        },
        setVal(val) {
            let editIndex = this.getEditIndex();
            this.controlsArr[editIndex].name = val;
        },
        // 选择类型
        selectInputType(inputType) {
            let editIndex = this.getEditIndex();
            this.controlsArr[editIndex].inputType = inputType;
        },
        // 选择字号
        selectFontsize(fontsSize) {
            let editIndex = this.getEditIndex();
            this.controlsArr[editIndex].fontsSize = fontsSize;
        },
        // 选择字体
        selectFontFamily(fontsFamily) {
            let editIndex = this.getEditIndex();
            this.controlsArr[editIndex].fontsFamily = fontsFamily;
        },
        // 选择签署方
        selectSignatory(signatory) {
            let editIndex = this.getEditIndex();
            this.controlsArr[editIndex].signatory = signatory;
        },
        // 选择外观
        selectBorderStyle(borderStyle) {
            let editIndex = this.getEditIndex();
            this.controlsArr[editIndex].borderStyle = borderStyle;
        },
        // 选择日期格式
        dataFormatStyle(dateFormat) {
            let editIndex = this.getEditIndex();
            this.controlsArr[editIndex].dateFormat = dateFormat;
        },
        // 获取当前编辑控件的索引Index
        getEditIndex() {
            if (this.activedId) {
                return findIndex(this.controlsArr, (o) => {
                    return o.customId === this.activedId;
                });
            } else {
                return '';
            }
        },
        // 添加控件
        addControl(type) {
            let signatory,signatoryOptions;
            let arr;
            signatoryOptions = this.signatoryOptions.filter(v=>v.sign==1);
            if (type === 4) { //添加印章类型 userType 01企业用户
                let arr = signatoryOptions.filter((v) => !v.userType || v.userType === '01');
                if (!arr.length) {
                    return this.$message.warning('签署人均为个人用户，无法使用印章');
                }
                signatory = arr[0].name;
            } else {
                signatory = signatoryOptions[0].name;
            }
            const controlObjMap = {
                1: {
                    customId: Date.now(),
                    width: 180,
                    x: 300,
                    y: 40,
                    className: 'lq-draggable-text',
                    borderClass: 'lq-active-class',
                    type: 'text', // 控件类型
                    handles: ['mr'],
                    name: '',
                    fontsSize: 10,
                    inputType: '1',
                    fontsFamily: 1,
                    signatory, // 签署方默认甲方
                    borderStyle: 3, // 边框外观
                    isRequire: false,
                    pageNumber: this.pageNumber,
                    fileCode: this.fileCode,
                    initX: 300,
                    initY: 40
                },
                2: {
                    customId: Date.now(),
                    width: 180,
                    x: 200,
                    y: 380,
                    initX: 200,
                    initY: 380,
                    className: 'lq-draggable-select',
                    type: 'select', // 控件类型
                    name: '',
                    fontsSize: 10,
                    fontsFamily: 1,
                    optionContent: [],
                    signatory, // 签署方默认甲方
                    borderStyle: 3, // 边框外观
                    isRequire: false,
                    pageNumber: this.pageNumber,
                    fileCode: this.fileCode,
                    borderClass: 'lq-active-class'
                },
                3: {
                    customId: Date.now(),
                    width: 180,
                    x: 0,
                    y: 380,
                    initX: 0,
                    initY: 380,
                    className: 'lq-draggable-date',
                    type: 'date', // 控件类型
                    name: '日期',
                    fontsSize: 10,
                    fontsFamily: 1,
                    dateFormat: 3,
                    signatory, // 签署方默认甲方
                    borderStyle: 3, // 边框外观
                    isRequire: false,
                    pageNumber: this.pageNumber,
                    fileCode: this.fileCode,
                    borderClass: 'lq-active-class'
                },
                4: {
                    customId: Date.now(),
                    width: 86,
                    height: 86,
                    x: 0,
                    y: 140,
                    initX: 0,
                    initY: 140,
                    className: 'lq-draggable-seal',
                    type: 'seal', // 控件类型
                    name: '印章',
                    signatory, // 签署方默认甲方
                    isRequire: false,
                    pageNumber: this.pageNumber,
                    fileCode: this.fileCode,
                    borderClass: 'lq-active-class'
                },
                5: {
                    customId: Date.now(),
                    width: 100,
                    height: 40,
                    x: 0,
                    y: 260,
                    initX: 0,
                    initY: 260,
                    className: 'lq-draggable-sign',
                    type: 'sign', // 控件类型
                    name: '签名',
                    signatory, // 签署方默认甲方
                    isRequire: false,
                    pageNumber: this.pageNumber,
                    fileCode: this.fileCode,
                    borderClass: 'lq-active-class'
                }
            };
            let copyData = JSON.parse(JSON.stringify(this.controlsArr));
            copyData.forEach((item) => {
                item.borderClass = '';
            });
            controlObjMap[type].borderClass = 'lq-active-class';
            copyData.push(controlObjMap[type]);
            this.controlsArr = copyData;
            this.setControlActive(controlObjMap[type].customId);
        },
        // 手动设置刚才添加的控件为选中状态
        setControlActive(customId) {
            this.$nextTick(() => {
                // this.$refs[customId][0].elementDown();
                this.onActivated(customId);
                // console.log(this.$refs[customId][0])
            });
        },
        // 移除控件
        removeControl(customId) {
            let editIndex = findIndex(this.controlsArr, (o) => {
                return o.customId === customId;
            });
            this.controlsArr.splice(editIndex, 1);
            this.activedId = '';
            this.activedType = '';
            this.widgetSet = false;
            this.emptyTmp = true;
        },
        renderData() {
            let tmpInfo = sessionStorage.getItem('templateInfo');
            let data = JSON.parse(tmpInfo);
            this.contractFileList = data.contractFileList; // 获取文件列表信息
            this.templateSignatories = data.templateSignatories; // 获取签署人详情
            this.signatoryOptions = data.templateSignatories;
        },
        // 保存模板
        saveTemplate() {
            // 判断名称是否为空
            let isNull = this.controlsArr
                .map((i) => {
                    if (i.name) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .includes(false);

            if (isNull) {
                return this.$message.warning('控件名称不能为空');
            }

            // 有印章时判断有无企业用户（编辑）
            let hasSealNoEnterprise =
                this.controlsArr.find((v) => v.type === 'seal') && !this.signatoryOptions.find((v) => !v.userType || v.userType === '01');
            if (hasSealNoEnterprise) {
                return this.$message.warning('印章位置对应无企业类型签署人数据，请先删除');
            }

            // 有无签署人
            let noSignUser = this.controlsArr.find((v) => !v.signatory);
            if (noSignUser) {
                return this.$message.warning('请为控件选择签署人');
            }

            // 编辑时印章对应角色由企业改为个人后，禁止提交
            let hasPersonalSeal = this.controlsArr.find(
                (v) => v.type === 'seal' && this.signatoryOptions.find((val) => val.name === v.signatory).userType === '02'
            );
            if (hasPersonalSeal) {
                return this.$message.warning('禁止印章位置签署人设置为个人用户，请重新设置');
            }

            // 选项内容判断
            let oldIndex = this.getEditIndex(); //当前激活的index
            if (oldIndex !== '') {
                let arr = JSON.parse(JSON.stringify(this.sealSet.domains));
                arr.unshift(this.optionsInitial);
                this.controlsArr[oldIndex].optionContent = arr;
            }
            let emptyOption = this.controlsArr.find(
                (v) => v.type === 'select' && (!v.optionContent.length || (v.optionContent.length && !v.optionContent[0]))
            );
            let emptySelect = !this.controlsArr.find((v) => v.type === 'select');
            if (emptyOption && !emptySelect) {//存在emptySelect&&没有设置内容
                return this.$message.warning('请添加选项控件内容');
            }
            // 保持选项内容
            sessionStorage.setItem('optionsCont', JSON.stringify(this.sealSet.domains));

            // 当前控件数据
            this.controlsArr.map((item) => {
                let optionContent;
                if (item.type === 'select') {
                    optionContent = item.optionContent
                        .map((v, i) => {
                            if (i !== 0) {
                                return v.value;
                            } else {
                                return v;
                            }
                        })
                        .join(';');
                }
                this.templateWidgetList.push({
                    type: item.type,
                    customId: item.customId,
                    width: item.width,
                    className: item.className,
                    appearance: item.borderStyle, // 外观1边框2下划线3无边框
                    dateFormat: item.dateFormat, // 日期格式：1 YYYY/MM/DD 、2 YYYY-MM-DD 、3 YYYY年MM月DD日
                    fieldType: item.inputType, // 文本类型：1文本、2手机号、3身份证、4统一社会信用代码
                    fileCode: item.fileCode, // 合同文件编码
                    fontSize: item.fontsSize, // 字号：1初号、2小初、3一号、4二号、5小二、6三号、7小三、8四号、9小四、10五号、11小五
                    isChoose: item.isRequire === true ? 1 : 0, // 是否必填1代表true、0代表false
                    optionContent, // 选项内容
                    signName: item.name, // 名称
                    typeface: item.fontsFamily, // 字体：1宋体、2新宋体、3黑体、4楷体
                    signType:
                        item.type === 'seal'
                            ? 1
                            : item.type === 'sign'
                            ? 2
                            : item.type === 'text'
                            ? 3
                            : item.type === 'select'
                            ? 4
                            : item.type === 'date'
                            ? 5
                            : 0, // 控件类型
                    signUser: item.signatory, // 填写人-角色名称
                    signatureCoordinateX: item.x, // 控件X轴坐标
                    signatureCoordinateY: item.y, // 控件Y轴坐标
                    signatureStartPage: item.pageNumber // 文件页面
                });
            });

            // 数据集合
            let data = {
                theme: this.dataNew.theme || '', // 文件主题
                serialNumberDate: this.dataNew.serialNumberDate || '', // 自定义合同编号时间
                serialNumberNo: this.dataNew.serialNumberNo || '', // 自定义合同编号流水号
                serialNumberPrefix: this.dataNew.serialNumberPrefix || '', //  自定义合同编号前缀
                signWay: this.dataNew.signWay || '', // 签署方式 (01：无序签；02：顺序签署；03：每人单独签署)
                contractFileList: this.contractFileList,
                signSysTemplateFieldReqVOList: this.templateWidgetList, // 控件属性列表
                templateSignatories: this.templateSignatories
            };

            // 模板ID不存在时为添加
            if (!this.templateId) {
                this.insertTmp(data).then((res) => {
                    if (res.data === null) {
                        return false;
                    }
                    if (this.successCheckCode(res)) {
                        if (res.code === 0) {
                            this.$message.success('保存成功');
                            this.$router.push('/templatemanage');
                        } else {
                            console.log('err');
                        }
                    }
                });
            }
            // 模板ID存在时为编辑
            if (!!this.templateId) {
                // 编辑时将ID添加到data中
                data.id = this.templateId;
                this.updateTmp(data).then((res) => {
                    if (res.data === null) {
                        return false;
                    }
                    if (this.successCheckCode(res)) {
                        if (res.code === 0) {
                            this.$message.success('编辑成功');
                            this.$router.push('/templatemanage');
                        } else {
                            console.log(err);
                        }
                    }
                });
            }
        },
        // 取消保存模板
        cancelTemplate() {
            this.$confirm(`您确认要取消模板保存吗？`, '取消保存', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'self-icon',
                closeOnClickModal: false
            })
                .then(() => {
                    this.$router.push('/templatemanage');
                })
                .catch(() => {});
        },
        // 鼠标滚动翻页
        fileContainerWheel(e) {
            let dom = $('.file-area');
            //  浏览器   firefox     其他
            //   属性   e.detail  wheelDelta
            //   向下      3        -120
            //   向上     -3         120
            if ((e.wheelDelta && e.wheelDelta > 0 && dom.scrollTop() === 0) || (e.detail && e.detail < 0 && dom.scrollTop() === 0)) {
                // 向上
                if (this.timer) {
                    return;
                }
                this.timer = true;
                setTimeout(() => {
                    this.prePage();
                }, 100);
                setTimeout(() => {
                    this.timer = false;
                }, 300);
            }
            if (
                (e.wheelDelta && e.wheelDelta < 0 && dom.scrollTop() + dom.height() >= dom[0].scrollHeight - 10) ||
                (e.detail && e.detail > 0 && dom.scrollTop() + dom.height() >= dom[0].scrollHeight - 10)
            ) {
                // 向下
                if (this.timer) {
                    return;
                }
                this.timer = true;
                setTimeout(() => {
                    this.nextPage();
                }, 100);
                setTimeout(() => {
                    this.timer = false;
                }, 300);
            }
        },
        // 向上到达顶部
        redirectTop() {
            this.skipPage = this.pageNumber = 1;
        },
        // 向上翻页
        prePage() {
            if (this.pageNumber <= 1) {
                return;
            }
            this.skipPage = --this.pageNumber;
        },
        // 向下翻页
        nextPage() {
            if (this.pageNumber >= this.totalPage) {
                return;
            }
            this.skipPage = ++this.pageNumber;
            $('.file-area')[0].scrollTop = 0;
        },
        // 向下到底
        redirectBottom() {
            this.skipPage = this.pageNumber = this.totalPage;
            $('.file-area')[0].scrollTop = 0;
        },
        // 添加选项输入框
        addDomain() {
            if (this.sealSet.domains.length >= 14) {
                return this.$message.warning('最多只能添加15个选项');
            }
            this.sealSet.domains.push({
                value: '',
                key: Date.now()
            });
        },
        // 删除选项输入框
        removeDomain(item) {
            var index = this.sealSet.domains.indexOf(item);
            if (index !== -1) {
                this.sealSet.domains.splice(index, 1);
            }
        },
        // 页码跳转狂blur事件
        skipPageBlur() {
            if (!this.skipPage) {
                this.skipPage = this.pageNumber;
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        if (to.path !== '/contractTemplateStep1') {
            sessionStorage.removeItem('templateInfo');
        }
        $('.file-area')[0].removeEventListener('mousewheel', this.fileContainerWheel);
        $('.file-area')[0].removeEventListener('DOMMouseScroll', this.fileContainerWheel);
        next();
    }
};
</script>
<style lang="scss" scoped>
.word-template {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background-color: #f4f6f8;
    .tmp-head {
        height: 50px;
        line-height: 50px;
        box-shadow: 0 2px 3px 0 rgba(227, 237, 242, 0.5);
        .step-nav {
            text-align: center;
            background-color: #fff;
        }
        .tmp-info {
            position: absolute;
            right: 30px;
            .el-button {
                width: 80px;
            }
        }
        .breadcrumb {
            position: absolute;
            left: 18px;
            a {
                color: #626262;
            }
            a:hover {
                color: #0073bd;
            }
        }
    }
    .title-big {
        margin-bottom: 20px;
        font-size: 16px;
        color: #333;
        text-align: center;
        border-bottom: 1px solid #e2e2e2;
        &.title-big-tmp {
            height: 40px;
            line-height: 40px;
        }
        &.title-big-widget {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px 0 10px;
        }
        .title-width {
            max-width: 116px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .inner {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        color: #333;
        .container {
            display: flex;
            position: absolute;
            width: 100%;
            left: 0;
            top: 51px;
            bottom: 0;
            .shadow-sign {
                position: absolute;
                z-index: 10000;
                cursor: move;
            }
            .sign-list {
                width: 216px;
                background: #fff;
                .title {
                    display: block;
                    margin-bottom: 20px;
                    padding: 20px 0 10px;
                    font-size: 16px;
                    color: #333;
                    border-bottom: 1px solid #e2e2e2;
                    .tips {
                        display: block;
                        margin-top: 5px;
                        font-size: 12px;
                        color: #999;
                    }
                }
                .sign-list-box {
                    width: 100%;
                    text-align: center;
                    .widget-title {
                        padding: 0 18px;
                    }
                    .widget-list {
                        padding: 0 18px;
                        border-top: 10px solid #eff2f7;
                    }
                }
                .pos-sign {
                    ul {
                        li {
                            height: 32px;
                            line-height: 32px;
                            margin: 0 auto 10px;
                            text-align: center;
                            background-color: #fafafa;
                            font-size: 14px;
                            color: #333;
                            cursor: pointer;
                            border: 1px solid transparent;
                            border-radius: 4px;
                            user-select: none;
                            &:hover {
                                border: 1px dashed #0073bd;
                                color: #0073bd;
                                border-radius: 4px;
                            }
                        }
                    }
                }
                .el-tabs {
                    width: 100%;
                    height: 320px;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                .el-tabs__nav.is-top {
                    width: 100%;
                }
                .el-tabs__item {
                    width: 100%;
                }
                .el-scrollbar {
                    flex: 1;
                }
                .pagination-wrap {
                    height: 40px;
                }
                .pagination-wrap {
                    width: 100%;
                    text-align: center;
                    margin-top: 10px;
                }
                .no-seal {
                    text-align: center;
                    margin-top: 20px;
                    color: #ccc;
                }
                .reset-pos {
                    position: absolute;
                    top: 420px;
                }
            }
            .file-area {
                flex: 1;
                position: relative;
                overflow: auto;
                padding-bottom: 10px;
                .page-num {
                    position: absolute;
                    top: -32px;
                    right: 0;
                    color: #475669;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    .skip-page {
                        font-size: 13px;
                        color: #475669;
                        margin-right: 5px;
                        input {
                            width: 34px;
                            height: 28px;
                            margin: 0 5px;
                            text-align: center;
                            border-radius: 4px;
                            color: #475669;
                            font-size: 13px;
                            border: 1px solid #ccc;
                        }
                    }
                }
                .turn-page {
                    position: absolute;
                    left: 50%;
                    transform: translateX(320px);
                    bottom: 30px;
                    width: 32px;
                    color: #999;
                    span {
                        display: inline-block;
                        width: 30px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        font-size: 16px;
                        border-radius: 50%;
                        cursor: pointer;
                        margin-bottom: 20px;
                        color: #fff;
                        background: #c4cfdc;
                        &:hover {
                            background: #2a68c8;
                            color: #fff;
                        }
                    }
                    .disabled {
                        background: #e2e2e2;
                        pointer-events: none;
                        &:hover {
                            background: #e2e2e2;
                        }
                    }
                }
                .drag-wrap {
                    position: relative;
                    width: 597px;
                    height: 844px;
                    margin: 36px auto 0;
                    border: solid 1px #e8e8e8;
                    .draggable {
                        cursor: move;
                    }
                    .inner-container {
                        position: relative;
                        height: 30px;
                        line-height: 30px;
                        margin-top: -20px;
                        padding-left: 10px;
                        padding-right: 25px;
                        font-size: 14px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #fff;
                        background-color: #2a68c8;
                        border-radius: 4px 4px 0 0;
                        .name {
                            font-size: 12px;
                        }
                    }
                    .close {
                        font-size: 16px;
                        position: absolute;
                        top: -22px;
                        right: 5px;
                        z-index: 100;
                        color: #fff;
                        cursor: pointer;
                    }
                    .lq-draggable-text,
                    .lq-draggable-date,
                    .lq-draggable-sign,
                    .lq-draggable-select {
                        border: dashed 1px #99a9bf;
                        border-radius: 0 0 4px 4px;
                        box-sizing: border-box;
                        .inner-container {
                            position: relative;
                            top: -10px;
                            left: -1px;
                            height: 30px;
                            line-height: 30px;
                            width: inherit;
                            padding-left: 10px;
                            color: #fff;
                            background-color: #2a68c8;
                            border-radius: 4px 4px 0 0;
                        }
                    }
                    .lq-draggable-seal {
                        .inner-container {
                            margin-top: -30px;
                        }
                        .seal-inner {
                            width: 100%;
                            height: 100%;
                            padding: 3px;
                            border: dashed 1px #99a9bf;
                            .seal {
                                // width: calc(100% - 12px);
                                // height: calc(100% - 12px);
                                // margin: 5px 0 0 5px;
                                width: 100%;
                                height: 100%;
                                border: dashed 1px #99a9bf;
                                border-radius: 50%;
                            }
                        }
                        .close {
                            top: -22px;
                        }
                    }
                    .lq-active-class {
                        border-color: rgb(14, 74, 238);
                        .seal-inner {
                            border-color: rgb(14, 74, 238);
                            .seal {
                                border-color: rgb(14, 74, 238);
                            }
                        }
                    }
                    .not-click {
                        pointer-events: none;
                        &.lq-active-class {
                            border: 1px dashed red;
                        }
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .set-wrap {
                    width: 230px;
                    padding: 0 10px;
                    border-left: solid 1px rgb(105, 103, 103);
                    .control-set-item {
                        margin-bottom: 20px;
                        .title {
                            margin-bottom: 5px;
                            font-size: 14px;
                        }
                    }
                }
            }
            .attr-list,
            .tmp-null {
                width: 216px;
                background-color: #fff;
                user-select: none;
            }
            .attr-list {
                .attr-list-box {
                    width: 180px;
                    margin: 0 auto;
                    .attr-list-item {
                        .require-box {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .left {
                                display: flex;
                                align-items: center;
                                > span {
                                    margin-right: 5px;
                                }
                                img {
                                    width: 16px;
                                    height: 16px;
                                }
                            }
                        }
                        .el-checkbox {
                            position: absolute;
                            bottom: -32px;
                            right: 0;
                        }
                        .options-title {
                            font-size: 14px;
                            color: rgb(72, 88, 106);
                        }
                        .text-area {
                            position: relative;
                            padding: 10px;
                            background-color: #f5f5f5;
                            border-radius: 4px;
                            max-height: 156px;
                            overflow-y: auto;
                            .el-input {
                                width: 100%;
                            }
                            .el-form-item {
                                margin-bottom: 0;
                            }
                        }
                        .label-name {
                            margin-bottom: 30px;
                            .err-txt {
                                position: absolute;
                                bottom: -32px;
                                left: 0;
                                color: red;
                                font-size: 12px;
                            }
                        }
                    }
                }
            }
            .tmp-null {
                text-align: center;
                img {
                    padding: 90px 0 20px;
                }
                .tips {
                    display: block;
                    color: #999;
                    font-size: 14px;
                }
            }
            .choose-type {
                width: 30px;
                margin: 0 0 0 30px;
                .el-button {
                    width: 30px;
                    height: 104px;
                    line-height: initial;
                    padding: 15px 8px;
                    margin-left: 0;
                    margin-top: 20px;
                    cursor: pointer;
                }
            }
        }
    }
}
.file-list {
    .el-scrollbar {
        width: 100%;
        position: absolute;
        left: 0;
        top: 10px;
        bottom: 95px;
    }
}
.file-area {
    .el-scrollbar {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
    }
}
.el-checkbox-group {
    width: 100%;
    display: flex;
    padding-left: 10px;
}
</style>
<style lang="scss">
.word-template {
    .el-tabs__header {
        margin: 0;
    }
    .el-tabs__content {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
    }
    .choose-type span {
        display: inline-block;
        height: 100%;
        line-height: 18px;
        word-wrap: break-word;
        white-space: normal;
        width: 100%;
        letter-spacing: 2px;
    }
    .text-area {
        .el-form-item {
            margin-bottom: 5px;
        }
        .el-form-item__label {
            padding-bottom: 5px;
        }
        .el-form-item__content {
            display: flex;
            align-items: center;
            .icon {
                position: absolute;
                top: 11px;
                right: -6px;
                color: #d3dae6;
                background-color: #e8e8e8;
                border-radius: 50%;
                cursor: pointer;
            }
            .el-input__inner {
                height: 30px;
                line-height: 30px;
            }
        }
    }
    .lq-active-class {
        .handle {
            border: 1px solid #c4cfdc;
        }
        .handle.handle-mr {
            border-radius: 50%;
            width: 20px;
            height: 20px;
            margin-top: -10px;
        }
        .handle-mr::before {
            content: ' ';
            width: 0;
            height: 0;
            border-top: 7px transparent solid;
            border-bottom: 7px transparent solid;
            border-right: 6px solid #c4cfdc;
            position: absolute;
            left: 2px;
            top: 2px;
        }
        .handle-mr::after {
            content: ' ';
            width: 0;
            height: 0;
            border-top: 7px transparent solid;
            border-bottom: 7px transparent solid;
            border-left: 6px solid #c4cfdc;
            position: absolute;
            right: 2px;
            top: 2px;
        }
    }
}
.el-message-box {
    .el-message-box__btns {
        text-align: center;
    }
}
</style>