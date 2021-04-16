<template>
    <el-dialog class="ukey checkPsw" :title="title" :visible.sync="signPswOpen" label-width="80px"
        :before-close="signPswCancel" :close-on-click-modal="false" top="25%">
        <div class="dialog-tab">
            <span :class="{avtive: dialogTab == 1}" @click="changeTab(1)">短信验证</span>
            <span :class="{avtive: dialogTab == 0}" @click="changeTab(0)">密码验证</span>
        </div>
        <el-form :label-position="labelPosition" label-width="70px">
            <el-form-item label="签署密码" v-if="dialogTab == 0 && isSignPassword">
                <el-input type="password" v-model="signPsw" placeholder="请输入签署密码（6位以上字母或数字）"></el-input>
            </el-form-item>
            <div v-if="dialogTab == 0 && !isSignPassword" style="text-align:center;">
                <i class="el-icon-warning"></i>
                <p>为保障您的签署安全，请先去设置签署密码</p>
            </div>
            <el-form-item label="手机号码" v-if="dialogTab == 1">
                {{phoneNum}}
                <el-button style="float:right;" class="sms" @click="getSMS">
                    {{countdown == 0 ? '获取验证码' : countdown+'s'}}</el-button>
            </el-form-item>
            <el-form-item label="验证码" v-if="dialogTab == 1">
                <el-input placeholder="请输入6位验证码" :max="6" v-model="verifyCode"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="signPswCancel">取 消</el-button> -->
            <el-button type="primary" @click="setSignPsd" v-if="dialogTab == 0 && !isSignPassword">设置签署密码
            </el-button>
            <el-button type="primary" @click="signPswConfirm" :loading="loadingBtn" v-else>确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import base from '../modules/contract/mixin/base';
    export default {
        mixins: [base],
        props: {
            value: {//是否显示盒子
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: "安全校验"
            },
            phoneNum: "",
        },
        data() {
            return {
                dialogTab: 1,
                signPsw: "",
                verifyCode: "",
                countdown: 0,
                timer: null,
                signPswOpen: false,
                labelPosition: 'right',
                isSignPassword: $.cookie('userinfo') && JSON.parse($.cookie('userinfo')).isSignPassword,
                accountId: $.cookie('userinfo') && JSON.parse($.cookie('userinfo')).accountId,
                userId: $.cookie('userinfo') && JSON.parse($.cookie('userinfo')).userId,
                loadingBtn: false,
                signParams: {},
            }
        },
        methods: {
            getSMS() {
                if (!this.phoneNum) {
                    return this.$message.error('账号异常，请联系管理员');
                }
                if (this.countdown != 0) {
                    return false;
                }
                this.getSignSms({
                    phone: this.phoneNum,
                    useType: '18'//删除type
                }).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.$message.success('验证码发送成功');
                        this.countdown = 120;
                        this.timer = setInterval(() => {
                            --this.countdown;
                            if (this.countdown <= 0) {
                                clearInterval(this.timer);
                            }
                        }, 1000);
                    }
                });
            },
            changeTab(val) {
                this.dialogTab = val;
                this.signParams.signSms = this.verifyCode = '';
                this.signParams.signPassword = this.signPsw = '';
                if (val == 0 && !this.isSignPassword) {
                }
            },
            signPswConfirm() {
                let reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
                if (this.dialogTab == 0 && !this.signPsw.length) {
                    this.$message.error('签署密码不能为空');
                } else if (this.dialogTab == 1 && !this.verifyCode) {
                    this.$message.error('验证码不能为空');
                } else {
                    if (this.dialogTab == 0) {//签署密码
                        this.signParams.signPassword = this.signPsw;
                        this.checkSignPwd({
                            signPassword: this.signPsw,
                            accountId: this.accountId,
                            userId: this.userId
                        }).then(res => {
                            if (this.successCheckCode(res)) {
                                this.signPswOpen = false;
                                this.dialogTab = 0;
                                this.countdown = 0;
                                this.loadingBtn = false;
                                this.timer&&clearInterval(this.timer);
                                this.$emit('confirm');
                            }
                        })
                    } else {//短信验证码
                        this.signParams.signSms = this.verifyCode;
                        this.signParams.phone = this.phoneNum;
                        this.checkSmsCode({
                            msmCode: this.verifyCode,
                            phone: this.phoneNum,
                            useType: '18'
                        }).then(res => {
                            if (this.successCheckCode(res)) {
                                this.$emit('confirm');
                                this.dialogTab = 1;
                                this.signPswOpen = false;
                                this.loadingBtn = false;
                                this.countdown = 0;
                                this.timer&&clearInterval(this.timer);
                            }
                        })
                    }
                    // this.signPswOpen = false;
                    this.verifyCode = '';
                    this.signPsw = '';
                    // this.countdown = 0;
                    // this.loadingBtn = false;
                    // if (this.editType == '01') {
                    //     this.signFromParams(this.signParams);
                    // } else {
                    //     this.signFromParams(this.signParams, 'first');
                    // }
                    // this.signPswCancel();
                    // this.signature(this.signParams)
                    //     .then((res) => {
                    //         console.log(res);
                    //         if (this.successCheckCode(res)) {
                    //             this.$message({
                    //                 message: '签署成功',
                    //                 type: 'success',
                    //                 duration: 3000
                    //             });
                    //             this.signPswCancel();
                    //         }
                    //         if (res.code === 2031 && res.msg === '签署密码错误') {
                    //             this.signPsw = '';
                    //             setTimeout(() => {
                    //                 this.loadingBtn = false;
                    //             }, 500);
                    //         } else if (res.code === 20330) {
                    //             this.verifyCode = '';
                    //             setTimeout(() => {
                    //                 this.loadingBtn = false;
                    //             }, 500);
                    //         } else {
                    //             if (this.signPswOpen) {
                    //                 this.signPswCancel();
                    //             }
                    //         }
                    //         this.btnLoding = false;
                    //         this.loadingBtn = false;
                    //     })
                    //     .fail((res) => {
                    //         if (this.signPswOpen) {
                    //             this.signPswCancel();
                    //         }
                    //         this.btnLoding = false;
                    //         this.loadingBtn = false;
                    //     });
                }
            },
            signPswCancel() {
                this.signPswOpen = false;
                this.verifyCode = '';
                this.signPsw = '';
                this.dialogTab = 1;
                this.countdown = 0;
                this.loadingBtn = false;
                this.timer&&clearInterval(this.timer);
                this.$emit('signPswCancel');
            },
            setSignPsd() {
                this.$router.push({ name: 'accountmanager', query: { safetyType: 2 } });
            },
        },
        watch: {
            value() {
                this.signPswOpen = this.value;
            },
            signPswOpen() {
                this.$emit('input', this.signPswOpen);
            },
        },
    } 
</script>
<style lang="scss">
    .checkPsw {
        .el-dialog--small {
            .el-dialog__body {
                // padding-right: 106px;
                padding-top: 30px;
            }

            .el-dialog__footer {
                padding-top: 40px;
            }
        }

        .dialog-tab {
            text-align: center;
            font-size: 0;
            margin-bottom: 30px;

            span {
                display: inline-block;
                line-height: 36px;
                padding: 0 48px;
                border: 1px solid #eeeeee;
                font-size: 14px;
                cursor: pointer;

                &:first-child {
                    border-right: 0;
                    margin-left: 70px;
                }
            }

            span.avtive {
                background: #02adff;
                color: #fff;
                border-color: #02adff;
            }
        }

        .el-form-item__label {
            color: #48586a !important;
        }

        .sms {
            width: 102px;
        }

        .el-icon-warning {
            color: #f7ba2a;
            font-size: 30px;
            vertical-align: middle;
            margin-right: 24px;
        }

        p {
            vertical-align: middle;
            display: inline-block;
        }

        .dialog-footer button {
            width: auto !important;
            min-width: 80px;
        }
    }

    .ukey {
        .el-dialog__headerbtn {
            margin: 10px 10px;
        }

        .el-dialog--small {
            width: 570px;
            border-radius: 10px;
            overflow: hidden;

            .el-dialog__body {
                padding: 50px 40px 0;
                padding-right: 86px;

                .el-form-item:nth-of-type(2) {
                    .el-form-item__label {
                        color: #999;
                    }
                }
            }

            .el-dialog__footer {
                padding-bottom: 30px;
                padding-top: 0;

                .dialog-footer {
                    text-align: center;
                    padding: 0;

                    button {
                        width: 80px;
                    }
                }
            }
        }

        .el-select {
            width: 100%;
        }

        .el-dialog__header {
            height: 40px;
            background: #e8ecef;
            padding: 0;
            padding-left: 20px;
            line-height: 40px;

            .el-dialog__title {
                font-weight: 500;
                font-size: 16px;
                color: #626262;
            }
        }

        &.checkPsw {
            .el-dialog--small {
                .el-dialog__body {
                    padding-right: 106px;
                }

                .el-dialog__footer {
                    padding-top: 40px;
                }
            }
        }
    }
</style>