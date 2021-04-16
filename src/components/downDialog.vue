<template>
    <div class="down-dialog">
        <el-dialog
            :visible.sync="downVisible"
            class="downCert"
            :before-close="closeDialog"
        >
            <div class="dialogTitle">
                <span class="el-dialog__title">驱动下载</span>
            </div>
            <div class="dialog-body">
                <ul>
                    <li
                        class="item"
                        v-for="(item, index) in downloadList"
                        :key="index"
                    >
                        <div class="left">
                            <img :src="item.noImageUrl" alt />
                        </div>
                        <div class="right">
                            <!-- 描述 -->
                            <div class="desc">
                                <h5>{{ item.desHead }}</h5>
                                <p>{{ item.desContent }}</p>
                                <p>驱动版本：{{ item.version }}</p>
                            </div>
                            <!-- 下载按钮 -->
                            <div class="download-btn">
                                <a :href="item.appDownUrl">客户端软件下载</a>
                                <a :href="item.manualDownUrl">
                                    <img
                                        src="../../static/image/icon/use.svg"
                                        alt
                                    />
                                    使用手册下载
                                </a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    mixins: [],
    props: {
        downVisible: {
            default: false,
        },
    },
    components: {},
    data() {
        return {
            downloadList: [
                {
                    noImageUrl:
                        "http://www.i-yin.com.cn/images/download/4.ba9f6c91.png",
                    desHead: "网证通（Net CA）PDF签章客户端下载",
                    desContent:
                        "下载前仔细核对左边图片，查看自己的电子印章编号是否为 “F”字母开头。",
                    version: "V3.5.2",
                    appDownUrl:
                        "https://qn1.i-yin.com.cn/saas/zip/%E5%AE%89%E5%8D%B0%E7%94%B5%E5%AD%90%E7%AD%BE%E7%AB%A0%E5%AE%A2%E6%88%B7%E7%AB%AFV3.5.2_netca.zip",
                    manualDownUrl:
                        "https://qn1.i-yin.com.cn/iyin_web/Download/%E7%94%B5%E5%AD%90%E5%8D%B0%E7%AB%A0%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.docx",
                },
                {
                    noImageUrl:
                        "http://www.i-yin.com.cn/images/download/1.dc1d7eac.png",
                    desHead: "广东CA（GDCA）签章客户端下载",
                    desContent:
                        "下载前仔细核对左边图片，查看自己的电子印章编号是否为 “C”字母开头。",
                    version: "V3.5.2",
                    appDownUrl:
                        "https://qn1.i-yin.com.cn/saas/zip/%E5%AE%89%E5%8D%B0%E7%94%B5%E5%AD%90%E7%AD%BE%E7%AB%A0%E5%AE%A2%E6%88%B7%E7%AB%AFV3.5.2_gdca.zip",
                    manualDownUrl:
                        "https://qn1.i-yin.com.cn/iyin_web/Download/%E7%94%B5%E5%AD%90%E5%8D%B0%E7%AB%A0%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.docx",
                },
                {
                    noImageUrl:
                        "http://www.i-yin.com.cn/images/download/9.126b80d9.png",
                    desHead: "PDF签章客户端组合包下载",
                    desContent:
                        "同时拥有广东CA（GDCA）和网证通（Net CA）的电子印章用户，请务必下载组合包进行安装使用。",
                    version: "V3.5.2",
                    appDownUrl:
                        "https://qn1.i-yin.com.cn/saas/zip/%E5%AE%89%E5%8D%B0%E7%94%B5%E5%AD%90%E7%AD%BE%E7%AB%A0%E5%AE%A2%E6%88%B7%E7%AB%AFV3.5.2_%E6%95%B4%E4%BD%93%E5%8C%85.zip",
                    manualDownUrl:
                        "https://qn1.i-yin.com.cn/iyin_web/Download/%E7%94%B5%E5%AD%90%E5%8D%B0%E7%AB%A0%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.docx",
                },
                {
                    noImageUrl:
                        "http://www.i-yin.com.cn/images/download/9.126b80d9.png",
                    desHead: "PDF签章客户端组合包（office 64位）下载",
                    desContent:
                        "同时拥有广东CA（GDCA）和网证通（Net CA）的电子印章用户，请务必下载组合包进行安装使用。",
                    version: "V3.5.2",
                    appDownUrl:
                        "https://qn1.i-yin.com.cn/saas/zip/%E5%AE%89%E5%8D%B0%E7%94%B5%E5%AD%90%E7%AD%BE%E7%AB%A0%E5%AE%A2%E6%88%B7%E7%AB%AFV3.5.2_x64_%E6%95%B4%E4%BD%93%E5%8C%85.zip",
                    manualDownUrl:
                        "https://qn1.i-yin.com.cn/iyin_web/Download/%E7%94%B5%E5%AD%90%E5%8D%B0%E7%AB%A0%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.docx",
                },
            ],
        };
    },
    computed: {},
    mounted() {},
    methods: {
        closeDialog() {
            this.$emit("changeDialog");
        },
    },
};
</script>
<style lang="scss">
/* .down-dialog {
    .downCert {
        .el-dialog.el-dialog--small {
            border-radius: 10px;
            width: 700px;
        }
        .el-dialog__header {
            background-image: linear-gradient(to right, #005d9d, #0b97de) !important;
            border-radius: 8px 8px 0 0;
            height: 40px;
            padding-top: 15px;
            .el-dialog__headerbtn .el-dialog__close {
                color: #fff;
                &:hover {
                    color: #fff;
                }
            }
        }
        .dialog-body {
            padding: 30px 20px;
            border-bottom: 0px;
            // height: 450px;
            // overflow-y: auto;
        }
        .el-dialog__body {
            .dialogTitle {
                top: -29px;
                .el-dialog__title {
                    color: #fff;
                    font-size: 16px;
                    font-weight: normal;
                }
            }
            .img-box {
                background: #f4f8fb;
                border-radius: 6px;
                position: relative;
                img {
                    width: 200px;
                }
                span {
                    position: absolute;
                    right: 52px;
                    bottom: 14px;
                    color: #999999;
                    font-size: 12px;
                }
            }
            .fr {
                width: 433px;
                h5 {
                    margin: 8px 0;
                    font-size: 16px;
                }
                p {
                    margin: 5px 0;
                    line-height: 24px;
                    span {
                        font-size: 21px;
                        color: #d0021b;
                    }
                }
                span {
                    color: #999999;
                    margin: 3px 0;
                    display: inline-block;
                }
                a {
                    display: inline-block;
                    padding: 10px 25px;
                    background: #00adff;
                    border-radius: 4px;
                    color: #fff;
                    margin-top: 8px;
                }
            }
        }
    }
} */
// 样式重写
.down-dialog {
    .downCert {
        .el-dialog.el-dialog--small {
            border-radius: 10px;
            width: 900px;
        }
        .el-dialog__header {
            background-image: linear-gradient(
                to right,
                #005d9d,
                #0b97de
            ) !important;
            border-radius: 8px 8px 0 0;
            height: 40px;
            padding-top: 15px;
            .el-dialog__headerbtn .el-dialog__close {
                color: #fff;
                &:hover {
                    color: #fff;
                }
            }
        }
        .dialog-body {
            background-color: #f4f8fb;
            .item {
                display: flex;
                background: #fff;
                margin-bottom: 13px;
                .left {
                    flex: 1;
                    img {
                        width: 200px;
                    }
                }
                .right {
                    flex: 3;
                    display: flex;
                    box-sizing: border-box;
                    .desc {
                        flex: 3;
                        // background-color: skyblue;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                        box-sizing: border-box;
                        h5 {
                            line-height: 34px;
                        }
                        p {
                            margin-bottom: 15px;
                            width: 100%;
                        }
                    }
                    .download-btn {
                        flex: 1;
                        // background-color: yellowgreen;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        a {
                            display: block;
                            width: 130px;
                            height: 40px;
                            background-color: yellowgreen;
                            text-align: center;
                            line-height: 40px;
                            color: #fff;
                            background-color: #3997cb;
                            border-radius: 4px;
                        }
                        a:nth-child(2) {
                            background-color: #fff;
                            border: 1px solid #0c6db0;
                            color: #0c6db0;
                            margin-top: 10px;
                        }
                    }
                }
            }
        }
    }
}
</style>
