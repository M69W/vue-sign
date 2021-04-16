<template>
    <div class="init">
        <regheader></regheader>
        <div class="initBox">
            <div class="top">
                <div class="title">{{ pageTitle }}</div>
            </div>
            <div v-if="isSuccess">
                <el-form
                    ref="init"
                    label-position="right"
                    label-width="98px"
                    :rules="rules"
                    :model="initForm"
                >
                    <div>
                        <el-form-item
                            prop="linkmanName"
                            label="联系人"
                            v-if="path == 'companyinit'"
                        >
                            <el-input
                                v-model="initForm.linkmanName"
                                placeholder="请输入联系人姓名"
                            ></el-input>
                        </el-form-item>
                        <el-form-item prop="phone" label="手机号">
                            <el-input
                                v-model="initForm.phone"
                                placeholder="请输入手机号"
                            ></el-input>
                        </el-form-item>
                        <el-form-item prop="password" label="密码">
                            <el-input
                                v-model="initForm.password"
                                :type="visible"
                                placeholder="请设置8~20位字母+数字为密码"
                            ></el-input>
                            <span
                                :class="visible"
                                @click="changeVisible(visible)"
                            ></span>
                        </el-form-item>
                        <el-form-item
                            prop="smsVerificationCode"
                            label="短信验证码"
                        >
                            <el-input
                                v-model="initForm.smsVerificationCode"
                                placeholder="请输入短信验证码"
                                class="verify"
                                :maxlength="6"
                            ></el-input>
                            <el-button
                                class="codebtn"
                                @click="getPhoneCode('init')"
                                :class="{ active: isActive }"
                                >{{
                                    countdown == 0
                                        ? "获取验证码"
                                        : countdown + "s"
                                }}</el-button
                            >
                        </el-form-item>
                    </div>
                </el-form>
                <div class="nextBox">
                    <div class="protocol">
                        <el-checkbox v-model="checked"
                            >已阅读并同意<a
                                href="javascript:;"
                                @click="routerTo('agreement')"
                                >《安印云平台使用协议》</a
                            >及<a
                                href="javascript:;"
                                @click="routerTo('privacy')"
                                >《隐私条款》</a
                            ></el-checkbox
                        >
                    </div>
                    <el-button
                        class="regbtn"
                        @click="submit_Form('init')"
                        :class="{ active: isInit }"
                        >绑定账户</el-button
                    >
                </div>
            </div>
            <div v-if="!isSuccess" class="success">
                <img src="../../../../static/image/reg_success.png" alt="" />
                <p class="regTip">账户绑定成功!</p>
                <div class="regName">登录账号：{{ this.initForm.phone }}</div>
                <el-button class="toHome" @click="routerTo('usercenter')"
                    >进入用户中心</el-button
                >
                <div class="certification">
                    初始化说明：
                    <p>
                        1、UKEY用户首次登录完成初始化后，绑定登录账户信息；<br />
                        2、电子合同平台信息提醒设置均以初始化手机号码为准；
                    </p>
                </div>
            </div>
        </div>
        <p class="Copyright">
            Copyright 2014-2020
            深圳市安印科技有限公司&nbsp;&nbsp;&nbsp;粤ICP备16033566
        </p>
    </div>
</template>
<script>
import base from "../mixin/base";
import regheader from "../../../components/regheader";
import valid from "../mixin/valid";
export default {
    mixins: [base, valid],
    components: { regheader },
    data() {
        var checkTelphone = (rule, value, callback) => {
            if (!/^1[3-9][0-9]{9}$/.test(value)) {
                return callback(new Error("请输入正确的手机号码"));
            }

            this.checkPhoneOrEmail({ phoneOrEmail: value }).then(res => {
                if (this.successCheckCode(res)) {
                    if (!!res.data.name) {
                        this.$alert('当前手机已经注册过，您可以先把手机号码注销后再重新绑定。','绑定Ukey提示',{
                            confirmButtonText: '确定'
                        })
                        return callback(
                            new Error("当前手机号码已注册过，请直接登录")
                        );
                    } else {
                        callback();
                    }
                }
            });
        };

        return {
            pageTitle: "",
            path: "",
            isSuccess: true,
            visible: "password",
            initForm: {},
            checked: false,
            rules: {
                linkmanName: [
                    {
                        required: true,
                        message: "请输入联系人姓名",
                        trigger: "blur"
                    },
                    {
                        max: 20,
                        message: "您输入的联系人姓名字符长度已超出限制",
                        trigger: "blur"
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: "请输入手机号",
                        trigger: "blur"
                    },
                    { validator: checkTelphone, trigger: "blur" }
                ],
                password: [{ validator: this.checkPasswords, trigger: "blur" }],
                smsVerificationCode: [
                    { required: true, message: "请输入验证码", trigger: "blur" }
                ]
            },
            countdown: 0,
            isActive: false,
            isInit: false,
            isCode: true,
            ukeylogin: false
        };
    },
    computed: {},
    watch: {
        initForm: {
            handler() {
                if (this.initForm.phone) {
                    this.isActive = true;
                } else {
                    this.isActive = false;
                }
                if (this.path == "companyinit") {
                    if (this.initForm.linkmanName) {
                        this.isInit = true;
                    } else {
                        this.isInit = false;
                    }
                } else if (this.path == "personinit") {
                    if (this.initForm.password && this.initForm.phone) {
                        this.isInit = true;
                    } else {
                        this.isInit = false;
                    }
                }
            },
            deep: true
        },
        countdown() {
            if (this.countdown == 0) {
                clearInterval(this.timer);
                this.isCode = true;
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.pageTitle = this.$route.meta.title;
            this.path = this.$route.path.match(/([^/]+)$/)[1];
        });
    },
    methods: {
        submit() {
            this.ukeyInitInfo({
                linkmanName: this.initForm.linkmanName,
                password: this.initForm.password,
                phone: this.initForm.phone,
                pictureCode:
                    $.cookie("userinfo") &&
                    JSON.parse($.cookie("userinfo")).pictureCode,
                signCertificateSn:
                    $.cookie("userinfo") &&
                    JSON.parse($.cookie("userinfo")).signCertificateSn,
                smsVerificationCode: this.initForm.smsVerificationCode,
                channelCode: this.$route.query.source
            }).then(res => {
                if (this.successCheckCode(res)) {
                    // if(this.ukeylogin){
                    //     let pictureCode = JSON.parse($.cookie('userinfo')).pictureCode;
                    //     this.$router.push({
                    //         path: 'ukeysealrenew',
                    //         query: {
                    //             pictureCode: pictureCode
                    //         }
                    //     })
                    //     return false;
                    // }
                    if (!!res.data) {
                        this.isSuccess = false;
                    }
                    // this.isSuccess = false
                    // $.cookie('token', res.data.accessToken, { path: "/" });
                    // $.cookie('userinfo', JSON.stringify({
                    //     loginName: res.data.loginName,
                    //     enterPriseName: res.data.extEnterpriseName,
                    //     accountId: res.data.accountId,
                    //     userId: res.data.userId,
                    //     userType: res.data.userType, //01：企业用户；02：个人用户
                    //     realNameAuthenticationFlag: res.data.realNameAuthenticationFlag //是否实名认证（0：未认证，1：认证）
                    // }), { path: "/" })
                }
            });
        },
        submit2() {
            this.ukeyInitPerson({
                password: this.initForm.password,
                phone: this.initForm.phone,
                pictureCode:
                    $.cookie("userinfo") &&
                    JSON.parse($.cookie("userinfo")).pictureCode,
                signCertificateSn:
                    $.cookie("userinfo") &&
                    JSON.parse($.cookie("userinfo")).signCertificateSn,
                smsVerificationCode: this.initForm.smsVerificationCode,
                channelCode: this.$route.query.source
            }).then(res => {
                if (this.successCheckCode(res)) {
                    if (!!res.data) {
                        this.isSuccess = false;
                    }
                    // this.isSuccess = false
                    // $.cookie('token', res.data.accessToken, { path: "/" });
                    // $.cookie('userinfo', JSON.stringify({
                    //     loginName: res.data.loginName,
                    //     enterPriseName: res.data.extEnterpriseName,
                    //     accountId: res.data.accountId,
                    //     userId: res.data.userId,
                    //     userType: res.data.userType, //01：企业用户；02：个人用户
                    //     realNameAuthenticationFlag: res.data.realNameAuthenticationFlag //是否实名认证（0：未认证，1：认证）
                    // }), { path: "/" })
                }
            });
        },
        changeVisible(val) {
            if (val == "password") {
                this.visible = "text";
            } else if (val == "text") {
                this.visible = "password";
            }
        },
        submit_Form(ref) {
            this.$refs[ref].validate(valid => {
                if (valid && !this.checked) {
                    this.$message({
                        type: "error",
                        message: "请您勾选注册协议"
                    });
                    return;
                }
                if (valid) {
                    if (this.path == "companyinit") {
                        this.submit();
                    } else if (this.path == "personinit") {
                        this.submit2();
                    }
                } else {
                    return false;
                }
            });
        },
        routerTo(val) {
            if (val == "usercenter") {
                this.$router.push(val);
            } else {
                let { href } = this.$router.resolve({ path: val });
                window.open(href, "_blank");
            }
        },
        getPhoneCode(ref) {
            this.$refs[ref].validateField("phone", string => {
                if (!string) {
                    if (this.countdown == 0 && this.isCode) {
                        this.isCode = false;
                        this.getNewSmsVerification({
                            phone: this.initForm.phone,
                            useType: 5
                        })
                            .then(res => {
                                if (this.successCheckCode(res)) {
                                    this.countdown = 120;
                                    this.timer = setInterval(() => {
                                        --this.countdown;
                                    }, 1000);
                                    this.$message({
                                        type: "success",
                                        message: "短信验证码发送成功"
                                    });
                                } else {
                                    this.isCode = true;
                                }
                            })
                            .fail(res => {
                                this.isCode = true;
                            });
                    }
                }
            });
        }
    }
    // beforeRouteEnter (to, from, next) {
    //     if(from.path == '/ukeylogin'){
    //         next(vm => {
    //             vm.ukeylogin = true;
    //         })
    //     }
    //     next();
    // }
};
</script>
<style lang="scss">
.init {
    position: relative;
    height: 100%;
    min-width: 1200px;
    min-height: 768px;
    background: #fff url("../../../../static/image/reg_bg.jpg") no-repeat 50% 0;
    background-size: 100% 100%;
    a {
        color: #02adff;
    }
    .initBox {
        width: 940px;
        height: 540px;
        margin: 0 auto;
        margin-top: 73px;
        position: relative;
        background: #ffffff;
        box-shadow: 0 0 6px 0 rgba(192, 204, 218, 0.5);
        border-radius: 8px;
        padding: 0 25px;
        padding-top: 50px;
        .top {
            position: absolute;
            top: -52px;
            left: 0;
            width: 100%;
            height: 32px;
            line-height: 32px;
            padding: 0 26px;
            .title {
                font-size: 20px;
                color: #333;
                float: left;
            }
        }
        .el-form {
            width: 480px;
            margin: 0 auto;
            .el-form-item__label {
                padding-right: 20px;
            }
            .el-form-item {
                margin-bottom: 30px;
            }
            input.el-input__inner {
                background: none;
            }
            .verify {
                width: 240px;
            }
            .codebtn {
                width: 120px;
                float: right;
                border-color: #c0ccda;
                span {
                    color: #c0ccda;
                }
                &:hover,
                &:focus {
                    background: none;
                }
                &.active {
                    background: #02adff;
                    border-color: #02adff;
                    span {
                        color: #fff;
                    }
                }
                &.active:hover {
                    background: #0073bd;
                    border-color: #0073bd;
                }
            }
            .el-form-item.is-required .el-form-item__label:before {
                display: none;
            }
            .password {
                position: absolute;
                right: 10px;
                top: 12px;
                width: 16px;
                height: 16px;
                background: url(../../../../static/image/unvisible.png)
                    no-repeat;
                cursor: pointer;
                &:hover {
                    background: url(../../../../static/image/unvisible_hover.png)
                        no-repeat;
                }
            }
            .text {
                position: absolute;
                right: 10px;
                top: 12px;
                width: 16px;
                height: 16px;
                background: url(../../../../static/image/visible.png) no-repeat;
                cursor: pointer;
                &:hover {
                    background: url(../../../../static/image/visible_hover.png)
                        no-repeat;
                }
            }
        }
        .nextBox {
            width: 480px;
            margin: 0 auto;
            .protocol {
                margin-left: 98px;
                margin-bottom: 30px;
                .el-checkbox__inner {
                    border-radius: 50%;
                }
                .el-checkbox__label {
                    padding-left: 10px;
                }
            }
            .regbtn {
                margin-left: 98px;
                margin-top: 20px;
                padding: 17px 64px;
                background: #c0ccda;
                border: none;
                width: 380px;
                span {
                    font-size: 16px;
                    color: #999;
                }
                &:hover {
                    background: #0073bd;
                    span {
                        color: #fff;
                    }
                }
                &.active {
                    background: #02adff;
                    span {
                        color: #fff;
                    }
                    &:hover {
                        background: #0073bd;
                    }
                }
            }
        }
        .success {
            padding-top: 12px;
            text-align: center;
            img {
                margin-bottom: 30px;
            }
            .regTip {
                line-height: 28px;
                font-size: 20px;
                color: #333333;
                margin-bottom: 10px;
            }
            .regName {
                color: #626262;
                line-height: 20px;
                margin-bottom: 50px;
            }
            .toHome {
                padding: 16px 47px;
                margin-bottom: 77px;
                background: #02adff;
                border-color: #02adff;
                span {
                    font-size: 16px;
                    color: #fff;
                }
            }
            .certification {
                width: 366px;
                margin: 0 auto;
                text-align: left;
                line-height: 26px;
                color: #3f3f3f;
                p {
                    color: #989a9c;
                }
            }
        }
    }
    .Copyright {
        color: #c0ccda;
        position: absolute;
        bottom: 52px;
        line-height: 20px;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
