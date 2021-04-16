<template>
    <div class="signconfirm">
        <div class="box">
            <div class="title"> 发起签署信息确认</div>
            <div class="fileBox">
                <p class="title">文件信息</p>
                <ul class="fileInfo clearfix">
                    <li class="fileList">
                        <div>
                            <img src=""/>
                        </div>
                        <p>合同名称</p>
                    </li>
                    <li class="fileList">
                        <div>
                            <img src=""/>
                        </div>
                        <p>合同名称</p>
                    </li>
                    <li class="fileList">
                        <div>
                            <img src=""/>
                        </div>
                        <p>合同名称</p>
                    </li>
                    <li class="fileList">
                        <div>
                            <img src=""/>
                        </div>
                        <p>合同名称</p>
                    </li>
                </ul>
            </div>
            <div class="fileBox">
                <p class="title">签署人信息</p>
                <el-scrollbar>
                    <ul class="signInfo clearfix">
                        <li class="fileList" v-for="(list , index) in signInfo">
                            <el-row>
                                <el-col :span="2"><span class="index">{{index + 1}}</span></el-col>
                                <el-col :span="8">
                                    <div>{{list.name}}</div>
                                </el-col>
                                <el-col :span="6">
                                    <div>{{list.phone}}</div>
                                </el-col>
                                <el-col :span="8">
                                    <div>{{list.sign}}</div>
                                </el-col>
                            </el-row>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
            <div class="button">
                <el-button @click="cancel()">取消</el-button>
                <el-button type="primary" @click="sure()">确认发起签署</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import base from "../mixin/base";

    export default {
        mixins: [base],
        data() {
            return {
                signInfo: [
                    {
                        name: '刘云',
                        phone: '12456677',
                        sign: '实名认证，在指定位置签署'
                    },
                    {
                        name: '刘云2',
                        phone: '12456677',
                        sign: '实名认证，在指定位置签署'
                    },
                    {
                        name: '刘云3',
                        phone: '12456677',
                        sign: '实名认证，在指定位置签署'
                    },
                    {
                        name: '刘云3',
                        phone: '12456677',
                        sign: '实名认证，在指定位置签署'
                    },
                    {
                        name: '刘云3',
                        phone: '12456677',
                        sign: '实名认证，在指定位置签署'
                    },
                    {
                        name: '刘云3',
                        phone: '12456677',
                        sign: '实名认证，在指定位置签署'
                    }, {
                        name: '刘云3',
                        phone: '12456677',
                        sign: '实名认证，在指定位置签署'
                    }, {
                        name: '刘云3',
                        phone: '12456677',
                        sign: '实名认证，在指定位置签署'
                    }
                ]
            }
        },
        methods: {
            sure() {
                this.$message({
                    message: "已成功发起合同签署！",
                    type: "success",
                    duration: 1000
                });
                this.$emit('confirm',false);
            },
            cancel(){
                this.$emit('confirm',false);
            }
        }
    }
</script>
<style>
    .signconfirm .fileBox .el-scrollbar__bar{
        opacity: 1;
    }
   .signconfirm .fileBox .el-scrollbar__wrap {
        overflow-x: hidden;
        height: 200px;
    }

   .signconfirm .fileBox .el-scrollbar__bar.is-vertical {
        position: absolute;
        right: 0px;
        bottom: 2px;
        border-radius: 4px;
        transition: opacity 120ms ease-out;
        z-index: 200;
        width: 4px !important;
    }

   .signconfirm .fileBox .el-scrollbar__wrap {
        margin-bottom: 0 !important;
    }
</style>
<style scoped lang="scss">
    .signconfirm {
        width: 100%;
        height: 100%;
        position: fixed;
        background: rgba(51, 51, 51, 0.40);
        top: 0;
        left: 0;
        z-index: 2001;
        .box {
            width: 717px;
            height: 601px;
            position: absolute;
            border-radius: 10px;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            background-color: #fff;
            overflow: hidden;
            > .title {
                height: 40px;
                line-height: 40px;
                padding-left: 20px;
                background: #E8ECEF;
                margin-bottom: 30px;
            }
            .fileBox {
                padding: 0 20px;
                .title {
                    padding-bottom: 10px;
                    font-size: 12px;
                    color: #999999;
                }
                .fileInfo {
                    .fileList {
                        margin-right: 26px;
                        margin-bottom: 26px;
                        float: left;
                        text-align: center;
                        div {
                            width: 149px;
                            height: 120px;
                            border: 1px solid #E2E2E2;
                            border-radius: 4px;
                        }
                        p {
                            font-size: 14px;
                            color: #626262;
                            padding-top: 10px;
                        }
                    }
                    .fileList:nth-child(4n) {
                        margin-right: 0;
                    }
                }
                .signInfo {
                    height: 200px;
                    .fileList {
                        height: 40px;
                        line-height: 40px;
                        border-bottom: 1px solid #EEEEEE;
                        font-size: 14px;
                        color: #333333;
                        .index {
                            border: 1px solid #D3DCE6;
                            font-size: 13px;
                            color: #999999;
                            display: block;
                            width: 20px;
                            height: 20px;
                            line-height: 20px;
                            margin-top: 10px;
                            text-align: center;
                        }
                    }
                }
            }
            .button {
                text-align: center;
                padding-top: 30px;
                button {
                    width: 104px;
                    height: 36px;
                    padding: 0;
                    text-align: center;
                    font-size: 14px;
                }
                button:nth-child(1) {
                    border: 1px solid #C0CCDA;
                    color: #999999;
                }
                button:nth-child(1):hover {
                    background-color: #fff;
                    border: 1px solid #C0CCDA;
                    color: #999999;
                }
                button:nth-child(2) {
                    margin-left: 20px;
                }
            }
        }
    }
</style>
