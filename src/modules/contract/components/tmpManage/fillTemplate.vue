<template>
    <div class="fill-template">
        <div class="header">
            <div class="back" @click="$router.go(-1)">
                <i class="iconfont icon-fanhui"></i>
                返回
            </div>
            <div class="header-title">填写模板内容</div>
            <div class="btn-wrap">
                <el-button size="small" @click="$router.push('/contractlist')">取消</el-button>
                <el-button size="small" type="primary" @click="next">{{signUser ? '完成填写' : '下一步'}}</el-button>
            </div>
        </div>
        <div class="main-container">
            <div class="page-list">
                <div class="title">合同文件</div>
                <div class="list">
                    <!-- <el-scrollbar> -->
                    <div class="scroll">
                        <div class="item" v-for="(item, index) in fileList" :key="index">
                            <div class="img-con" @click="selectFile(item,index)"
                                :class="{active:item.fileCode===fileCode}">
                                <!-- <img src="../../../../../static/image/idcard-a.png" alt /> -->
                                <img :src="item.homePageImagePath+`&compactId=${compactId}&token=${token}`" alt />
                            </div>
                            <p class="file-name" :title="item.fileName">{{item.fileName}}</p>
                        </div>
                    </div>
                    <!-- </el-scrollbar> -->
                </div>
            </div>
            <!-- 查看合同主界面 -->
            <div class="main-page">
                <div class="btn-wrap">
                    <i class="icon icon-zhiding" :class="{gray:currPage===1}" @click="pageTo('toFirst')"></i>
                    <i class="icon icon-shangyiye" :class="{gray:currPage===1}" @click="pageTo('prev')"></i>
                    <i class="icon icon-xiayiye" :class="{gray:currPage===pageTotal}" @click="pageTo('next')"></i>
                    <i class="icon icon-zhidi" :class="{gray:currPage===pageTotal}" @click="pageTo('toLast')"></i>
                </div>
                <div class="jump">
                    前往
                    <el-input size="small" v-model="tempCurrPage" @blur="pageChange" @keyup.native.enter="pageChange">
                    </el-input>
                    页&nbsp;&nbsp;&nbsp;
                    {{currPage}}&nbsp;/&nbsp;{{pageTotal}}
                </div>
                <div class="main-page-box">
                    <div class="img-box">
                        <!-- 文件图片 -->
                        <img :src="`/compact/file/page?fileCode=${fileCode}&compactId=${compactId}&pageNo=${currPage}&token=${token}`"
                            alt />
                        <!-- 控件 -->
                        <div class="input-container" v-for="(item, index) in currField" :key="index"
                            :style="{left:item.showSignatureCoordinateX+'px',top:item.showSignatureCoordinateY+'px'}">
                            <el-input v-if="item.signType==='3'" v-model.trim="item.content" :style="{width:item.width+'px',height:fontSizeToHeight(item.fontSize)+10+'px',
                                        fontSize:fontSizeToHeight(item.fontSize)+'px'}"
                                :placeholder="'请输入' + filterFieldType(item.fieldType)" :maxlength="100"></el-input>
                            <el-date-picker type="date" placeholder="选择日期" v-if="item.signType==='5'"
                                v-model="item.content" :format="dateFormats[item.dateFormat]"
                                :style="{width:item.width+'px',height:fontSizeToHeight(item.fontSize)+10+'px'}">
                            </el-date-picker>
                            <el-select placeholder="请选择" v-if="item.signType==='4'" v-model="item.content" :style="{width:item.width+'px',height:fontSizeToHeight(item.fontSize)+10+'px',
                                        fontSize:fontSizeToHeight(item.fontSize)+'px'}">
                                <el-option v-for="(option,i) in item.options" :key="i" :label="option" :value="option">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import base from '../../mixin/base';
    import { isPhoneNum, isEmail, checkIntegral, isLetterOrNumber, wordFontSizeToPx, isCard, isNewCredit } from '../../../../utils';

    export default {
        mixins: [base],
        data() {
            return {
                fileList: [],
                mainPageInfo: {},
                tempCurrPage: 1,
                currPage: 1,
                pageTotal: 0,
                fileCode: '',
                constantWidth: 800,
                token: sessionStorage.getItem('token'),
                templateField: [],
                scale: 1, // 缩放比，暂未使用
                compactId: '',
                timer: '',
                dateFormats: {
                    '1': 'yyyy/MM/dd',
                    '2': 'yyyy-MM-dd',
                    '3': 'yyyy年MM月dd日'
                },
                fontSizeToHeight: wordFontSizeToPx,
                signUser: '',
                heightList: {}, // 文件高度列表
                contentArr: []
            };
        },
        computed: {
            currField() {
                return this.templateField.filter((v) => v.fileCode === this.fileCode && v.signatureStartPage === this.currPage);
            }
        },
        watch: {
            currPage(val) {
                this.tempCurrPage = val;
            }
        },
        async created() {
            this.compactId = this.$route.query.id;
            // 获取控件信息
            await this.getCompactTempDetail();
            // 获取文件信息
            this.getCompactFile();
        },
        methods: {
            // 获取控件信息
            async getCompactTempDetail() {
                // 获取签署人
                let res = await this.detail(this.compactId);
                if (!this.successCheckCode(res)) {
                    return;
                }
                let signUser = res.data.compactSignatoryList.find((v) => v.identityNum === this.userinfo.enterpriseId);
                this.signUser = signUser ? signUser.signUser : '';
                if (!this.signUser) {
                    return this.$message.warning('无需填写内容，请点击完成填写进入下一步');
                }
                // 根据签署人确定控件
                await this.compactTempDetail(this.compactId).then((res) => {
                    this.templateField = res.data.signSysTemplateFieldReqVOList.filter(
                        (v) => v.signType !== '1' && v.signType !== '2' && v.signUser === this.signUser
                    );
                    if (!this.templateField.length) {
                        this.$message.warning('无需填写内容，请点击完成填写进入下一步');
                    }
                    console.log(this.templateField,11)
                    this.templateField.forEach((v) => {
                        if (v.signType === '4') {
                            v.options = v.optionContent.split(';');
                        }
                        //设置百分比位置

                        this.$set(v, 'content', '');
                    });
                });
            },
            // 获取文件列表
            getCompactFile() {
                this.editCompact(this.compactId).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.fileList = res.data.compactFileIdList;
                        this.selectFile(this.fileList[0]);
                        this.$nextTick(() => {
                            // 滚轮事件：firefox（DOMMouseScroll），其他（mousewheel）
                            $('.main-page-box')[0].addEventListener('mousewheel', this.mouseWheel);
                            $('.main-page-box')[0].addEventListener('DOMMouseScroll', this.mouseWheel);
                        });
                    }
                });
            },
            // 选择文件
            selectFile(item) {
                this.currPage = 1;
                this.fileCode = item.fileCode;
                this.pageTotal = item.filePage || item.pageTotal;
                // this.$nextTick(() => {
                //     console.log($('.fill-template .img-box img').height());
                //     item.height = $('.fill-template .img-box img').height();
                // });
                // setTimeout(() => {
                //     console.log($('.fill-template .img-box img').height());
                //     item.height = $('.fill-template .img-box img').height();
                // }, 1000);
                this.setScale(item);
            },
            // 设置缩放比/获取高度
            setScale(item) {
                let _this = this;
                let img = new Image();
                img.src = `/compact/file/page?fileCode=${this.fileCode}&compactId=${this.compactId}&pageNo=${this.currPage}&token=${this.token}`;
                img.onload = function (res) {
                    console.log(res);
                    // A4纸标准尺寸 595px * 842px
                    // 页面图片固定595px宽度
                    // 获取文件的高度
                    if (!_this.heightList.hasOwnProperty(item.fileCode)) {
                        console.log(this.width, this.height);
                        _this.heightList[item.fileCode] = (595 * this.height) / this.width;
                        console.log(_this.heightList);
                    }
                    // if (this.width < this.height) {
                    //     // 竖向
                    //     this.scale = 800 / 595;
                    // } else {
                    //     // 横向
                    //     this.scale = 800 / 842;
                    // }
                    console.log(_this.scale);
                    _this.getShowSignatureCoordinate();
                };
            },
            //获取展示框高
            getShowSignatureCoordinate() {
                // A4纸标准尺寸 595px * 842px (模板新建w*h)
                let xRate,yRate;
                let templateField = JSON.parse(JSON.stringify(this.templateField));
                this.templateField.map(v => {
                    // if (v.signType === '3') {//top的Y换算为Bottom的Y 百分比 v.fontSize(字号)
                    //     yRate = v.signatureCoordinateY / 842;
                    //     // v.signatureCoordinateYBottom =  1 - (this.fontSizeToHeight(v.fontSize) + 5 + v.signatureCoordinateY)/842;
                    // } else {
                    //     // v.signatureCoordinateYBottom = 1 - (dom.height() + v.signatureCoordinateY) / 842;
                    //     // v.signatureCoordinateX = v.signatureCoordinateX / 595;
                    // }
                    yRate = v.signatureCoordinateY / 842;
                    xRate = v.signatureCoordinateX / 595;
                    this.$set(v,'showSignatureCoordinateX',(xRate * 595).toFixed(2));
                    this.$set(v,'showSignatureCoordinateY',(yRate * this.heightList[v.fileCode]).toFixed(2));
                    // v.showSignatureCoordinateX =  (xRate * 595).toFixed(2);
                    // v.showSignatureCoordinateY =  (yRate * this.heightList[v.fileCode]).toFixed(2);
                })
                console.log(this.templateField)
            },

            // 翻页
            pageTo(val) {
                if (val === 'toFirst') {
                    this.currPage = 1;
                }
                if (val === 'prev') {
                    if (this.currPage === 1) {
                        return;
                    }
                    this.currPage--;
                }
                if (val === 'next') {
                    if (this.currPage === this.pageTotal) {
                        return;
                    }
                    this.currPage++;
                }
                if (val === 'toLast') {
                    this.currPage = this.pageTotal;
                }
                document.querySelector('.main-page .main-page-box').scrollTop = 0;
            },
            // 跳转翻页
            pageChange() {
                if (!checkIntegral(this.tempCurrPage.trim())) {
                    this.tempCurrPage = this.currPage;
                    return this.$message.warning('页码必须为正整数');
                }
                if (this.tempCurrPage > this.pageTotal) {
                    this.tempCurrPage = this.pageTotal;
                    this.currPage = this.pageTotal;
                } else {
                    this.currPage = parseInt(this.tempCurrPage);
                }
            },
            // 滚轮滚动
            mouseWheel(e) {
                let dom = $('.main-page-box');
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
                        this.pageTo('prev');
                    }, 100);
                    setTimeout(() => {
                        this.timer = false;
                    }, 300);
                }
                if (
                    (e.wheelDelta && e.wheelDelta < 0 && dom.scrollTop() + dom.height() >= dom[0].scrollHeight) ||
                    (e.detail && e.detail > 0 && dom.scrollTop() + dom.height() >= dom[0].scrollHeight)
                ) {
                    // 向下
                    if (this.timer) {
                        return;
                    }
                    this.timer = true;
                    setTimeout(() => {
                        this.pageTo('next');
                    }, 100);
                    setTimeout(() => {
                        this.timer = false;
                    }, 300);
                }
            },
            // 下一步
            next() {
                let noFill = this.templateField.find((v) => !v.content && v.isChoose === 1);
                if (noFill) {
                    return this.$message.warning('请为自定义控件输入内容');
                }
                for (const v of this.templateField) {
                    v.compactFileCode = v.fileCode;
                    v.signatoryId = this.userinfo.userId;
                    if (v.signType === '3' && v.content) {
                        if (v.fieldType === 2 && !isPhoneNum(v.content)) {
                            return this.$message.warning('手机号码格式不正确');
                        }
                        if (v.fieldType === 3 && !isCard(v.content)) {
                            return this.$message.warning('身份证号码格式不正确');
                        }
                        if (v.fieldType === 4 && !isNewCredit(v.content)) {
                            return this.$message.warning('统一社会信用代码格式不正确');
                        }
                    }
                    if (v.signType === '5' && v.content) {
                        let year, month, day;
                        year = v.content.getFullYear();
                        month = v.content.getMonth() + 1;
                        month = month > 9 ? month : '0' + month;
                        day = v.content.getDate();
                        day = day > 9 ? day : '0' + day;
                        if (v.dateFormat === 1) {
                            v.dateContent = year + '/' + month + '/' + day;
                        } else if (v.dateFormat === 2) {
                            v.dateContent = year + '-' + month + '-' + day;
                        } else if (v.dateFormat === 3) {
                            v.dateContent = year + '年' + month + '月' + day + '日';
                        }
                    }
                    if ((v.signType === '3' || v.signType === '4' || v.signType === '5') && v.content) {
                        this.contentArr = [];
                        let oneline = Math.floor((2 * v.width) / this.fontSizeToHeight(v.fontSize)); //一行可显示字数
                        if (v.signType === '5') {
                            this.subString(v.dateContent, 0, oneline);
                            v.dateContent = this.contentArr.join('\n');
                        } else {
                            this.subString(v.content, 0, oneline);
                            v.content = this.contentArr.join('\n');
                        }
                    }
                }
                let templateField = JSON.parse(JSON.stringify(this.templateField));
                console.log(templateField);
                templateField.forEach((v) => {
                    if (v.signType === '5' && v.content) {
                        v.content = v.dateContent;
                    }
                    if (v.signType === '3') {//top的Y换算为Bottom的Y 百分比 v.fontSize(字号)
                        v.signatureCoordinateY =
                            1 - (this.fontSizeToHeight(v.fontSize) + 5 + v.signatureCoordinateY) / 842;
                        v.signatureCoordinateX = v.signatureCoordinateX / 595;
                    } else {
                        // let dom = $('.el-select') || $('.el-date-editor');//22height 20为dom的高度
                        let dom = $('.input-container');//22height  2为微调量
                        v.signatureCoordinateY = 1 - (dom.height() - 2 + v.signatureCoordinateY) / 842;
                        v.signatureCoordinateX = v.signatureCoordinateX / 595;
                    }
                });
                this.fillTemplate({
                    compactId: this.compactId,
                    signUser: this.signUser,
                    templateSignReqVOS: templateField
                }).then((res) => {
                    console.log(res);
                    if (this.successCheckCode(res)) {
                        if (this.$route.query.editType) {
                            this.$router.push(`/contractsignature?compactId=${this.compactId}&isTemp=1&editType=01`);
                        } else {
                            this.$router.push(`/contractsignature?compactId=${this.compactId}&isTemp=1`);
                        }
                    }
                });
            },
            filterFieldType(val) {
                if (val === 2) {
                    return '手机号';
                } else if (val === 3) {
                    return '身份证号';
                } else if (val === 4) {
                    return '统一社会信用代码';
                } else {
                    return '文本';
                }
            },
            // 切割字符串使文本框换行
            subString(str, startIndex, len) {
                let newLength = 0;
                let sIdx = startIndex;
                let newStr = '';
                let chineseRegex = /[^\x00-\xff]/g;
                let singleChar = '';
                let strLength = str.replace(chineseRegex, '**').length;
                let contentLen = str.length;
                for (let i = sIdx; i < strLength; i++) {
                    singleChar = str.charAt(i).toString();
                    if (singleChar.match(chineseRegex) != null) {
                        newLength += 2;
                        startIndex++;
                    } else {
                        newLength++;
                        startIndex++;
                    }
                    if (newLength > len) {
                        startIndex--;
                        break;
                    }
                    newStr += singleChar;
                }
                this.contentArr.push(newStr);
                if (startIndex <= contentLen - 1) {
                    this.subString(str, startIndex, len);
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            $('.main-page-box')[0].removeEventListener('mousewheel', this.mouseWheel);
            $('.main-page-box')[0].removeEventListener('DOMMouseScroll', this.mouseWheel);
            next();
        }
    };
</script>

<style lang="scss" scoped>
    .fill-template {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        // 滚动条
        ::-webkit-scrollbar-thumb {
            border-radius: 1em;
            background-color: rgba(153, 153, 153, 0.5);
        }

        ::-webkit-scrollbar-track {
            border-radius: 1em;
            background-color: transparent;
        }

        >.header {
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            position: relative;
            background-color: #fff;
            box-shadow: 0 2px 3px 0 rgba(227, 237, 242, 0.5);

            >.btn-wrap {
                position: absolute;
                top: 0;
                right: 30px;

                .el-button {
                    width: 80px;
                    height: 30px;
                    margin-left: 20px;
                }
            }

            .header-title {
                text-align: center;
                font-size: 16px;
            }

            .back {
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 20px;

                &:hover {
                    color: #02adff;
                }

                .iconfont {
                    font-size: 14px;
                }
            }
        }

        >.main-container {
            background-color: #f4f6f8;
            flex: 1;
            display: flex;
            overflow: hidden;

            >.page-list {
                width: 216px;
                background-color: #fff;
                display: flex;
                flex-direction: column;

                .title {
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    position: relative;

                    &:after {
                        content: '';
                        width: 180px;
                        height: 1px;
                        background: #c0ccda;
                        position: absolute;
                        bottom: 0;
                        left: 18px;
                    }
                }

                .list {
                    flex: 1;
                    position: relative;

                    .scroll {
                        padding-top: 16px;
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        overflow: auto;
                    }

                    .item {
                        width: 120px;
                        margin: 0 auto 10px;

                        .img-con {
                            width: 100%;
                            height: 120px;
                            border: 1px solid #e8ecef;
                            padding: 4px;
                            cursor: pointer;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            &.active {
                                border-color: #2a68c8;
                            }

                            img {
                                max-width: 100%;
                                max-height: 100%;
                            }
                        }

                        .file-name {
                            line-height: 40px;
                            text-align: center;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                }
            }

            >.main-page {
                flex: 1;
                padding-top: 5px;
                background-color: #eff2f7;
                display: flex;
                flex-direction: column;

                .btn-wrap {
                    position: absolute;
                    z-index: 999;
                    bottom: 110px;
                    right: 60px;

                    .icon {
                        display: block;
                        margin-top: 16px;
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        cursor: pointer;

                        &.icon-zhiding {
                            background: url('../../../../../static/image/zhiding.svg') no-repeat center #c4cfdc;
                        }

                        &.icon-shangyiye {
                            background: url('../../../../../static/image/shang.svg') no-repeat center #c4cfdc;
                        }

                        &.icon-xiayiye {
                            background: url('../../../../../static/image/xia.svg') no-repeat center #c4cfdc;
                        }

                        &.icon-zhidi {
                            background: url('../../../../../static/image/zhidi.svg') no-repeat center #c4cfdc;
                        }

                        &:hover {
                            background-color: #2a68c8;
                        }

                        &.gray {
                            background-color: #e2e2e2;
                            cursor: not-allowed;
                        }
                    }
                }

                .jump {
                    padding-left: 30px;
                    color: #475669;

                    .el-input {
                        width: 34px;
                    }
                }

                .main-page-box {
                    flex: 1;
                    overflow: auto;
                    margin: 20px 0;

                    .img-box {
                        width: 597px;
                        height: auto;
                        margin: 0 auto;
                        border: 1px solid #ccc;
                        position: relative;

                        img {
                            width: 100%;
                        }

                        .input-container {
                            position: absolute;

                            >.el-input,
                            >.el-date-editor,
                            >.el-select {
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

<style lang="scss">
    .fill-template {
        .jump {
            .el-input {
                width: 34px;
                text-align: center;

                .el-input__inner {
                    padding: 3px;
                    text-align: center;
                }
            }
        }

        .main-page-box {
            .input-container {
                .el-input {
                    &__inner {
                        padding: 5px;
                        height: 100%;
                        font-size: inherit;
                    }
                }
            }
        }
    }
</style>