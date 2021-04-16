<template>
    <el-dialog title="" :visible.sync="showFlag" id="revokeFile" class="revokeFile" :close-on-click-modal=false :before-close="beforeClose">
        <div class="box" >
            <div class="title">
                签署流程：<span class="state">{{signWay=='01'?"无序签署":signWay=='02'?"顺序签署":signWay=='03'?"每人单独签署":""}}</span>
            </div>
            <div class="fileBox">
                <p class="title">{{compactTheme}}</p>
                <p class="info">
                    <label>状态</label><span class="color_666">{{compactStatus=="01"?"草稿":compactStatus=="02"?"已撤销":compactStatus=="03"?"已拒签":compactStatus=="04"?"签署中":compactStatus=="05"?"签署完成":""}}</span>
                    <label>签署截止倒计时</label><span class="color_666">{{countdown}}</span>
                </p>
                <el-scrollbar style="height: 400px">
                    <ul class="signList">
                        <li v-for="(item,index) in signatoryList">
                            <el-row>
                                <el-col :span="4"><span>{{item.compactSignatoryName==sponsor?"发起人":"签署人"}}</span></el-col>
                                <el-col :span="8"><el-tooltip :content="item.compactSignatoryName" placement="top" effect="light"><div id="company">{{item.compactSignatoryName || '暂无'}}</div></el-tooltip></el-col>
                                <el-col :span="12"><span class="color_999">签署时间：</span> <span>{{item.compactStartDate||"暂未签署"}}</span></el-col>
                            </el-row>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import base from "../mixin/base";

    export default {
        mixins: [base],
        prop:["signatoryList"],
        data() {
            return {
                showFlag: true,
                text: "",
                signInfo: []
            }
        },
        methods: {
            sure() {
                this.$message({
                    message: "已成功发起合同签署！",
                    type: "success",
                    duration: 1000
                });
                this.$emit('confirm', false);
            },
            cancel() {
                this.$emit('confirm', false);
            }
        }
    }
</script>
<style>
    .moreconfirm .fileBox .el-scrollbar__bar {
        opacity: 1;
    }

    .fileBox .el-scrollbar__bar.is-vertical {
        position: absolute;
        right: 0px;
        bottom: 2px;
        border-radius: 4px;
        transition: opacity 120ms ease-out;
        z-index: 200;
        width: 4px !important;
    }
    .fileBox .el-scrollbar__wrap {
        margin-bottom: 0 !important;
    }
    .revokeFile .el-dialog__header {
        padding: 20px 20px 0;
        position: absolute;
        z-index: 1;
        width: 100%;
    }
    .revokeFile .el-dialog--small{
        width: 717px;
        border-radius: 10px;
    }
</style>
<style scoped lang="scss">
    .el-dialog__close{
        color: #999;
    }
    .revokeFile{
        .box {
            width: 717px;
            height: 601px;
            border-radius: 10px;
            background-color: #fff;
            overflow: hidden;
            > .title {
                height: 40px;
                line-height: 40px;
                padding-left: 20px;
                background: #E8ECEF;
                margin-bottom: 30px;
                font-size: 16px;
                .state{
                    font-size: 14px;
                    color: #626262;
                }
                .el-dialog__headerbtn {
                    margin-top: 13px;
                    margin-right: 20px;
                }
            }
            .fileBox {
                padding: 0 20px;
                .title {
                    padding-bottom: 10px;
                    font-size: 16px;
                    color: #333333;
                    text-align: center;
                    padding-bottom: 20px;
                }
                .info{
                    width: 361px;
                    margin: auto;
                    border-bottom: 1px solid #02ADFF;
                    text-align: center;
                    padding-bottom: 12px;
                    text-align: center;
                    margin-bottom: 30px;
                    color: #666;
                    >label{
                        padding-right: 20px;
                    }
                    >span{
                        padding-right: 30px;
                    }
                    span:last-child{
                        padding-right: 0;
                    }
                }
            }
            .signList{
                height: 400px;
                li{
                    background: #E8ECEF;
                    border: 1px solid #C0CCDA;
                    border-radius: 2px;
                    font-size: 14px;
                    color: #333333;
                    height: 40px;
                    line-height: 40px;
                    margin-bottom: 10px;
                    .el-col{
                        padding: 0 30px;
                        overflow: hidden;
                        height: 40px;
                    }
                    .color_999{
                        color: #999;
                    }
                }
            }
        }
    }
</style>
