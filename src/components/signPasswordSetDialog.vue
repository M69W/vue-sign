<template>
    <el-dialog :visible.sync="signPswOpen" :before-close="dialogClose" class="dialog infolog" top="23%">
        <div class='dialogTitle'>
            <span class="el-dialog__title">{{title}}</span>
        </div>
        <div class="dialog-body">
            <el-form :model="formData" :rules="rules" ref="formTab" label-width="110px">
                <div v-if="dialogType == 'verify'" class="verify">
                    <!-- <p>为了保护帐号安全，需要验证手机有效性</p> -->
                    <el-form-item label="手机号码">
                        <span>{{phoneNum}}</span>
                        <el-button class="codebtn" @click="getPhoneCode">{{countdown == 0?'获取验证码':countdown+'s'}}
                        </el-button>
                    </el-form-item>
                    <el-form-item label="短信验证码" prop="verify">
                        <el-input v-model="formData.verify" placeholder="请输入短信验证码" :maxlength="6"></el-input>
                    </el-form-item>
                </div>
                <div v-if="dialogType == 'signpsd'">
                    <el-form-item label="签署密码" prop="signpsd">
                        <el-input v-model="formData.signpsd" type="text" placeholder="请输入密码（6~20位字母或数字）"></el-input>
                        <!-- <span class="password" @click="changeVisible(visible,1)" ref="visible"></span> -->
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkSignpsd">
                        <el-input v-model="formData.checkSignpsd" type="text" placeholder="请再次输入密码"></el-input>
                        <!-- <span class="password" @click="changeVisible(visible2,2)" ref="visible2"></span> -->
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div slot="footer">
            <el-button @click="dialogClose">取 消</el-button>
            <el-button type="primary" @click="submit_Form('formTab')" v-if="dialogType == 'verify'">下一步
            </el-button>
            <el-button type="primary" @click="submit_Form('formTab')" v-if="dialogType != 'verify'">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import base from '../modules/contract/mixin/base';
    import {isChineseSymbol} from "@/utils"
    export default {
        mixins: [base],
        props: {
            value: {//是否显示盒子
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: "设置签署密码"
            },
            phoneNum: "",
        },
        data() {
            var checkPsd = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('密码不能为空'))
                } else if (isChineseSymbol(value)||value.length < 6 || value.length > 20) {
                    callback(new Error('请输入符合要求的密码'));
                } else {
                    callback();
                }
            }
            var checkSignpsd = (rule, value, callback) => {
                if (this.formData.signpsd != this.formData.checkSignpsd) {
                    return callback(new Error("两次输入的密码不一致，请重试"));
                }
                callback();
            };
            return {
                signPswOpen: false,
                formData: {},
                dialogType: "verify",
                rules: {
                    signpsd: [{ validator: checkPsd, trigger: "blur" }],
                    checkSignpsd: [
                        { required: true, message: '请输入签署密码', trigger: 'blur' },
                        { validator: checkSignpsd, trigger: "blur" }
                    ],
                },
                countdown: 0,
                msmUseType: 4,
                isCode: true,
                timer: null
            }
        },
        methods: {
            init(){
                this.timer&&clearInterval(this.timer);
                this.timer = null;
                this.isCode = true;
                this.countdown = 0;
                this.signPswOpen = false;
                this.$refs.formTab.resetFields();
            },
            dialogClose() {
                this.init();
                this.$emit("cancel");
                // this.formData = {} ;
                // this.setNewPhone = false ;
                // this.provinceList = []
                // this.cityList = []
                // this.visible = 'password'
                // this.visible2 = 'password'
                // this.visible3 = 'password'
                // this.countdown = 0
                // this.offStep = false
                // if(this.dialogType == 'password'){
                //     this.$refs.visible.className = 'password'
                //     this.$refs.visible2.className = 'password'
                //     this.$refs.visible3.className = 'password'
                // }else if(this.dialogType == 'signpsd'){
                //     this.$refs.visible.className = 'password'
                //     this.$refs.visible2.className = 'password'
                // }
            },
            submit_Form() {
                this.$refs.formTab.validate((valid) => {
                    if (valid) {
                        if (this.dialogType == 'verify') {
                            this.next()
                        } else {
                            this.save()
                        }
                    } else {
                        return false;
                    }
                });
            },
            next() {
                var that = this;
                this.checkSmsCode({
                    "msmCode": this.formData.verify,
                    "phone": this.phoneNum,
                    "useType": this.msmUseType
                }).then(res => {
                    if (this.successCheckCode(res)) {
                        this.dialogType = 'signpsd'
                    }
                })
            },
            save() {
                this.signPsd({ signPassword: this.formData.signpsd }).then(res => {
                    if (this.successCheckCode(res)) {
                        this.$message({
                            type: 'success',
                            message: '签署密码设置成功'
                        })
                        //更新缓存是否设置签署密码
                        let userinfo = $.cookie("userinfo") && JSON.parse($.cookie("userinfo"));
                        userinfo.isSignPassword = true;
                        $.cookie('userinfo', JSON.stringify(userinfo), { path: "/", domain: this.$domain });
                        // this.dialogClose();
                        this.init();
                        this.$emit('confirm');
                    }
                })
            },
            getPhoneCode() {
                if (this.countdown == 0 && this.isCode) {
                    this.isCode = false
                    let data = {
                        phone: this.phoneNum,
                        useType: this.msmUseType //1.注册 2.修改密码 3.找回密码 4.设置或修改签署密码 5.ukey初始化  6.修改邮箱 7.修改手机号 8.修改地址 32.注销
                    }
                    this.smsCode(data).then(res => {
                        if (this.successCheckCode(res)) {
                            this.countdown = 120
                            this.timer = setInterval(() => {
                                --this.countdown;
                                if (this.countdown <= 0) {
                                    clearInterval(this.timer);
                                    this.timer = null;
                                    this.isCode = true;
                                }
                            }, 1000)
                            this.$message({
                                type: 'success',
                                message: '短信验证码发送成功'
                            })
                        } else {
                            this.isCode = true
                        }
                    }).fail(res => {
                        this.isCode = true
                    })
                }
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
<style lang="scss" scoped>
    .codebtn {
        float: right;
        width: 100px;
        border-color: #02ADFF;

        span {
            color: #02ADFF;
        }

        &:hover,
        &:focus {
            background: #0073BD;
            border-color: #0073BD;

            span {
                color: #fff;
            }
        }

        &.active {
            background: #02ADFF;
            border-color: #02ADFF;
        }
    }
</style>