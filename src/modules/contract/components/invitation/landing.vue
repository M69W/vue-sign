<template>
    <div class="invite-landing">
		<div class='head_area'>
			<div class="logo_area">
				<a href="https://www.i-yin.com.cn/" class="logo"></a>
				<span class="tel">
                    <span class='phone_icon'></span>
				    <span>400-919-6663</span>
				</span>
			</div>
			<div class='logo_text'>
				<div>
					<div class='title_text'>线上签合同 合作更轻松</div>
					<p class='introduce_text'>安印电子合同</p>
				</div>
			
                <div class="reg_box">
                    <div class="reg_head">
                        <span>好友</span><span class="reg_name" :title="userName">{{userName}}</span><span>送您 </span><span class="fs-16">20元现金券,</span><span>注册免费领</span>
                    </div>
                    <div class="reg_info">
                        <div class="tab">
                            <span :class="{active: type == 0}" @click="tabType(0)">企业注册</span>
                            <span :class="{active: type == 1}" @click="tabType(1)">个人注册</span>
                        </div>
                        <el-form :model="regForm" :rules="rules1" ref="reg1" v-if="type == 0">
                            <div v-if="step == 1">
                                <el-form-item prop="enterpriseName">
                                    <el-input placeholder="企业名称" v-model="regForm.enterpriseName"></el-input>
                                </el-form-item>
                                <el-form-item prop="phoneNo">
                                    <el-input placeholder="手机号码" :maxlength="11" v-model="regForm.phoneNo"></el-input>
                                </el-form-item>
                                <el-form-item prop="verifyCode">
                                    <el-input placeholder="验证码" v-model="regForm.verifyCode" class="verify"></el-input>
                                    <el-button class="getcode" :loading="loading" :class="{active: countdown != 0}" @click="getCode">{{countdown == 0 ? '获取验证码' : countdown+'s'}}</el-button>
                                </el-form-item>
                            </div>
                        
                            <div v-if="step == 2">
                                <el-form-item prop="linkManName">
                                    <el-input placeholder="联系人姓名" v-model="regForm.linkManName"></el-input>
                                </el-form-item>
                                <el-form-item prop="password">
                                    <el-input type="password" placeholder="登录密码" v-model="regForm.password"></el-input>
                                </el-form-item>
                                <el-form-item prop="email">
                                    <el-input placeholder="邮箱" v-model="regForm.email"></el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                        <el-form :model="regForm" :rules="rules2" ref="reg2" v-if="type == 1">
                            
                            <el-form-item prop="phoneNo">
                                <el-input placeholder="手机号码" :maxlength="11" v-model="regForm.phoneNo"></el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input type="password" placeholder="登录密码" v-model="regForm.password"></el-input>
                            </el-form-item>
                            <el-form-item prop="verifyCode">
                                <el-input placeholder="验证码" v-model="regForm.verifyCode" class="verify"></el-input>
                                <el-button class="getcode" :loading="loading" :class="{active: countdown != 0}" @click="getCode">{{countdown == 0 ? '获取验证码' : countdown+'s'}}</el-button :loading="loading">
                            </el-form-item>
                        </el-form>

                        <el-checkbox v-model="checked">
                            已阅读并同意
                            <a href="javascript:;"
                                @click="routerTo('agreement')">《安印云平台使用协议》</a>及
                            <a href="javascript:;"
                                @click="routerTo('privacy')">《隐私条款》</a>
                        </el-checkbox>
                        <div class="next-box">
                            <el-button v-if="type == 0 && step == 1" @click="next">下一步</el-button>
                            <el-button v-else @click="register">注册</el-button>
                        </div>
                        
                    </div>
                </div>
			</div>
		</div>

		<div class='service'>
			<div class='title_text_system'>产品服务</div>
			<ul class="clearfix">
				<li>
					<img src="/static/image/landing/service1.svg" />
					<p>实名认证</p>
					<div></div>
					<span>严格遵照《电子签名法》相关规定联合CA数字认证中心，结合人脸识别技术，确保签名主体的真实性和有效性</span>
				</li>
				<li>
					<img src="/static/image/landing/service2.svg" />
					<p>合同签署</p>
					<div></div>
					<span>无需面对面，极速签发有效电子合同；实名认证+数字证书，确保身份真实；领先的数字签名技术，有效防篡改</span>
				</li>
				<li>
					<img src="/static/image/landing/service3.svg" />
					<p>合同管理</p>
					<div></div>
					<span>提供合同模板、检索、归档、下载等免费功能；降低合同管理的仓储成本和人力成本；海量存储空间，合同管理一站解决</span>
				</li>
				<li>
					<img src="/static/image/landing/service4.svg" />
					<p>区块链存证</p>
					<div></div>
					<span>使用区块链技术进行存证，通过增加时间戳和可信数字签名，确保文件一经篡改即可被发现和真实记录，可为客户提供完整的电子合同证据链</span>
				</li>
			</ul>
		</div>

		<div class='advantage clearfix'>
			<div class="swper clearfix">
				<div class='title_text_system'>产品优势</div>
				<div class="div_ul1">
					<h4>纸质合同</h4>
					<ul>
						<li class="click">
							<p>合同签署成本高</p>
							<span>纸质合同线下签署的方式，带来了高昂的纸张成本、打印成本、异地签署的快递成本等</span>
						</li>
						<li>
							<p>纸质合同效率低</p>
							<span>客户来自全国各地，快递签署不仅耗时长效率低，而且客户可能随时反悔，导致合作失败</span>
						</li>
						<li>
							<p>纸质合同管理难</p>
							<span>海量纸质合同管理困难，已经成为困扰各类企业的普遍难题，合同管理环境要求高，不仅查找困难，而且容易丢失</span>
						</li>
						<li>
							<p>潜在签约风险大</p>
							<span>线下签署无法验证签署人身份真实性，盗用、私刻公章和篡改合同频发，存在较大假冒代签的风险</span>
						</li>
					</ul>
				</div>
				<div class="div_ul2">
					<h4>电子合同</h4>
					<ul>
						<li class="hover">
							<p>合同签署费用直降87%</p>
							<span>第三方平台无纸化储存，系统随时调取；无需邮寄，全程线上完成</span>
							<img src="/static/image/landing/advantage1.png" />
						</li>
						<li>
							<p>线上签署，签约只须30秒</p>
							<span>实时追踪合同状态，秒发秒签；随时随地调用查阅</span>
							<img src="/static/image/landing/advantage2.png" />
						</li>
						<li>
							<p>电子合同，轻松管理</p>
							<span>区块存储，永久保存；多状态检索、查看、下载合同</span>
							<img src="/static/image/landing/advantage3.png" />
						</li>
						<li>
							<p>用户身份绝无冒充，大大降低法律风险</p>
							<span>人脸活体识别比对，公安人口库校验；拥有完整证据链；信息加密，点对点签署</span>
							<img src="/static/image/landing/advantage4.png" />
						</li>
					</ul>
				</div>
			</div>
			<div class="swper clearfix">
				<div class='title_text_system'>产品安全</div>
				<ul class="div_ul3">
					<li>
						<img src="/static/image/landing/advantage5.png" />
						<p>身份安全</p>
						<div>
							<p>个人身份公安数据认证</p>
							<p>企业信息工商总局数据认证</p>
							<p>微众银行人脸活体检测</p>
							<p>防伪CA数字证书</p>
						</div>
					</li>
					<li>
						<img src="/static/image/landing/advantage6.png" />
						<p>网络安全</p>
						<div>
							<p>SSL传输加密</p>
							<p>WAF防火墙、ACL控制</p>
							<p>抗DDOS攻击</p>
							<p>木马查杀&安全巡查</p>
							<p>堡垒机运维审计</p>
						</div>
					</li>
					<li>
						<img src="/static/image/landing/advantage7.png" />
						<p>数据安全</p>
						<div>
							<p>AES数据加密存储</p>
							<p>数据区块链存在</p>
							<p>数据时间戳服务</p>
							<p>阿里云+腾讯云备份</p>
							<p>同城双活、异地容灾</p>
						</div>
					</li>
					<li>
						<img src="/static/image/landing/advantage8.png" />
						<p>合法有效</p>
						<div>
							<p>符合《中华人民共和国电子签名法》</p>
							<p>符合《中华人民共和国合同法》</p>
							<p>符合《中华人民共和国民事诉讼法》</p>
							<p>获得司法仲裁、公证处认可</p>
						</div>
					</li>
				</ul>
			</div>
			<div class="fotter_bg"></div>
		</div>
		<div class="process">
			<div class="swper">
				<div class='title_text_system'>产品流程介绍</div>
				<img src="/static/image/landing/process1.svg" class="process_img1" />
				<div class='title_text_system'>产品形态分布</div>
				<img src="/static/image/landing/process2.png" class="process_img2" />
				<p>支持PC、H5、APP等多终端签署，满足客户多样化需求</p>
			</div>
		</div>
		<div class='application'>
			<div class="swper">
				<div class='title_text_system'>行业应用场景</div>
				<ul>
					<li>
						<p>物流行业</p>
					</li>
					<li>
						<p>中介行业</p>
					</li>
					<li>
						<p>人力资源行业</p>
					</li>
					<li>
						<p>教育培训行业</p>
					</li>
					<li>
						<div>
							<p>旅游行业</p>
						</div>
						<div>
							<p>租赁行业</p>
						</div>
						<div>
							<p>B2B电商行业</p>
						</div>
					</li>
					<li>
						<p>互联网金融行业</p>
					</li>
				</ul>
			</div>
		</div>
		<div class="footer_submit">
			<div class="wraper">
				<div>
					<input class="footer_enterprise" type="text" placeholder="公司名称" maxlength="30" />
				</div>
				<div>
					<input class="footer_name" type="text" placeholder="您的姓名" maxlength="10" />
				</div>
				<div>
					<input class="footer_ipone" type="text" placeholder="手机号码" maxlength="11" />
				</div>
				<div class="code">
					<input class="footer_code" type="text" placeholder="短信验证码" maxlength="8" />
					<button class="footer_getcode">获取验证码</button>
					<button class="footer_time" style="display: none;">60s</button>
				</div>
				<button class="footer_button">提交试用信息</button>
			</div>
		</div>
		<div class="footer">
			<div class="wraper">
				<div class="fl link_area">
					<a href="https://www.i-yin.com.cn/">返回官网</a>
					<a href="https://www.i-yin.com.cn/helps.html">帮助中心</a>
					<a href="https://www.i-yin.com.cn/index.php?c=article&a=type&tid=9">关于我们</a>
					<a href="https://www.i-yin.com.cn/index.php?c=article&a=type&tid=50">联系我们</a>
				</div>
				<p class='fr company_info'>Copyright 2014-2020 深圳市安印科技有限公司 粤ICP备16033566号-1</p>
			</div>
		</div>

    </div>
</template>

<script>
import base from "../../mixin/base";
import valid from '../../mixin/valid';
export default {
    mixins: [base, valid],
    data() {
        var checkTelphone = (rule, value, callback) => {
            if (!/^1[3-9][0-9]{9}$/.test(value)) {
                return callback(new Error('请输入正确的手机号码'));
            }

            this.checkPhoneOrEmail({
                phoneOrEmail: value
            }).then((res) => {
                if (this.successCheckCode(res)) {
                    if (!!res.data.name) {
                        return callback(new Error('当前手机号码已注册过，请直接登录'));
                    } else {
                        callback();
                    }
                }
            });
        };
        var checkEmail = (rule, value, callback) => {
            if (!/^([a-z0-9A-Z]+[-|_|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/.test(value)) {
                return callback(new Error('请输入正确的邮箱'));
            }
            this.checkPhoneOrEmail({
                phoneOrEmail: value
            }).then((res) => {
                if (this.successCheckCode(res)) {
                    if (!!res.data.name) {
                        return callback(new Error('该邮箱已注册'));
                    } else {
                        callback();
                    }
                }
            });
        };
        return {
            type: 0,
            step: 1,
            regForm: {},
            checked: false,
            userName: '',
            userId: '',
            countdown: 0,
            timer: null,
            loading: false,
            rules1: {
                enterpriseName: [
                    { required: true, message: '请输入企业名称', trigger: 'blur' },
                    { max: 33, message: '您输入的企业名称字符长度已超出限制', trigger: 'blur' },
                    { validator: this.checkEnterpriseName, trigger: 'blur' }
                ],
                linkManName: [
                    { required: true, message: '请输入联系人', trigger: 'blur' },
                    { max: 20, message: '您输入的联系人名称字符长度已超出限制', trigger: 'blur' },
                    { validator: this.checkLinkName, trigger: 'blur' }
                ],
                phoneNo: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: checkTelphone, trigger: 'blur' }
                ],
                verifyCode: [
                    { required: true, message: '请输入短信验证码', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入企业邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                password: [
                    { validator: this.checkPasswords, trigger: 'blur' }
                ],
            },
            rules2: {
                phoneNo: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: checkTelphone, trigger: 'blur' }
                ],
                verifyCode: [
                    { required: true, message: '请输入短信验证码', trigger: 'blur' }
                ],
                password: [
                    { validator: this.checkPasswords, trigger: 'blur' }
                ],
            }
        }
    },
    mounted() {
        $(".advantage .div_ul1 li").hover(function() {
            $(this).siblings().removeClass('click');
            $(this).addClass('click');
            $(".advantage .div_ul2 li").eq($(this).index()).addClass('hover').siblings().removeClass('hover');
        }, function() {

        })

        $(".advantage .div_ul3 li").hover(function() {
            $(this).addClass('hover');
        }, function() {
            $(this).removeClass('hover');
        })

        this.userId = this.$route.query.userId;
        this.getInfo();
        this.initJs();
    },
    methods: {
        tabType(val){
            this.type = val;
            this.regForm = {};
            this.setp = 1;
            clearInterval(this.timer);
            this.timer = null;
        },
        routerTo(val){
            this.$router.push(val);
        },
        getInfo(){
            this.getInviteMan(this.userId).then(res => {
                if(this.successCheckCode(res)){
                    this.userName = res.data.name || res.data.phone;
                }
            })
        },
        getCode(){
            let ref = '';
            this.type == 0 ? ref = 'reg1' : ref = 'reg2';
            this.$refs[ref].validateField('phoneNo', (string) => {
                if (!string) {
                    this.loading = true;
                    if (this.countdown == 0) {
                        this.getNewSmsVerification({
                                phone: this.regForm.phoneNo,
                                useType: 1
                            })
                            .then((res) => {
                                if (this.successCheckCode(res)) {
                                    this.countdown = 120;
                                    this.timer = setInterval(() => {
                                        --this.countdown;
                                        if(this.countdown < 0){
                                            clearInterval(this.timer);
                                            this.countdown = 0;
                                            this.loading = false;
                                        }
                                    }, 1000);
                                    this.$message({
                                        type: 'success',
                                        message: '短信验证码发送成功'
                                    });
                                }
                                this.loading = false;
                            })
                            .fail(err => {
                                this.loading = false;
                            })
                    }
                }
            });
        },
        next(){
            this.$refs.reg1.validate(valid => {
                if(valid){
                    if (!this.checked) {
                        this.$message({
                            type: 'error',
                            message: '请您勾选注册协议'
                        });
                        return;
                    }
                    this.checkSmsCode({
                        msmCode: this.regForm.verifyCode,
                        phone: this.regForm.phoneNo,
                        useType: 1
                    }).then(res => {
                        if(this.successCheckCode(res)){
                            this.step = 2;
                        }
                    })
                }
            })
        },
        register(){
            let ref = '';
            this.type == 0 ? ref = 'reg1' : ref = 'reg2';
            this.$refs[ref].validate(valid => {
                if (!valid) { return };
                if (!this.checked) {
                    this.$message({
                        type: 'error',
                        message: '请您勾选注册协议'
                    });
                    return;
                }
                this.reg();
            })
        },
        reg() {
            if (this.type == 1) {
                this.personRegister({
                    //个人注册
                    phoneNo: this.regForm.phoneNo,
                    password: this.regForm.password,
                    smsVerificationCode: this.regForm.verifyCode,
                    clientId: '02',
                    useType: '1', //验证码使用类型：1.注册 2.修改密码 3.找回密码
                    // channelCode: this.channelCode
                    userId: this.userId
                }).then((res) => {
                    if (this.successCheckCode(res)) {
                        $.cookie('isSign', true);
                        this.regSuccess(res);
                    }
                });
            } else {
                //企业注册
                this.checkedEnterPriseName(this.regForm.enterpriseName).then(res => {
                    if (this.successCheckCode(res)) {
                        if (!res.data) {
                            this.$confirm('您好！ 请认真核实，该企业可能已经办理过安印的电子印章（UKey），请直接使用UKey登录，无需注册。', '提示', {
                                type: "warning",
                                confirmButtonText: '去登录',
                                cancelButtonText: '取消',
                                customClass: "self-icon icon-living",
                            }).then(() => {
                                this.$router.push("/login?Type=ukey");
                            }).catch(() => {});
                        } else {
                            //企业注册  
                            this.perfectInfo({
                                clientId: '02', //客户端类型 01:api 02:浏览器 03：app ,
                                enterpriseEmail: this.regForm.email,
                                password: this.regForm.password,
                                enterpriseName: this.regForm.enterpriseName,
                                linkManName: this.regForm.linkManName,
                                phoneNo: this.regForm.phoneNo,
                                smsVerificationCode: this.regForm.verifyCode,
                                useType: 1,
                                // channelCode: this.channelCode
                                userId: this.userId
                            }).then((res) => {
                                if (this.successCheckCode(res)) {
                                    $.cookie('isSign', true);
                                    this.regSuccess(res);
                                }
                            });
                        }
                    }
                })
            }
        },
        regSuccess(res) {
            $.cookie('token', res.data.accessToken, {
                path: '/',
                domain: this.$domain
            });
            $.cookie('sessionToken', res.data.ucSessionToken, {
                path: "/",
                domain: this.$domain
            });
            sessionStorage.setItem('token', res.data.accessToken);
            sessionStorage.setItem('sessionToken', res.data.ucSessionToken);
            let userinfo = JSON.stringify({
                loginName: res.data.loginName,
                enterPriseName: res.data.extEnterpriseName,
                accountId: res.data.accountId,
                enterpriseId: res.data.currentPersonalIdOrEnterpriseId,
                userId: res.data.userId,
                currentUserId: res.data.userId,
                userType: res.data.userType, //01：企业用户；02：个人用户
                realNameAuthenticationFlag: res.data.realNameAuthenticationFlag, //是否实名认证（0：未认证，1：认证）
                enterpriseInfoList: res.data.enterpriseInfoList,
                isMainAccount: 1
            });
            this.$store.commit("SET_HASMSG", res.data.notRead); //设置是否有未读消息noRead 0无 1有
            $.cookie('userinfo', userinfo, {
                path: '/',
                domain: this.$domain
            });
            this.$message({
                message: '注册成功',
                type: 'success',
                duration: 1500
            });
            setTimeout(() => {
                this.$router.push('/index');
            }, 1500);
        },
        initJs() {
            // 校验手机号
            function checkIpone(number) {
                return /^(1[3-9][0-9])[0-9]{8}$/.test(number);
            }
            function httpPost(url, data, fnSuccess, fnFail) {
                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: "json",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify(data),
                    success: function(data) {
                        if(data.code == 0) {
                            fnSuccess(data);
                        } else {
                            fnFail(data);
                        }
                    },
                    error: function(data) {
                        fnFail(data)
                    }
                })
            }

            function httpGet(url, data, fnSuccess, fnFail) {
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: "json",
                    data: data,
                    success: function(data) {
                        console.log(data, "success");
                    },
                    error: function(data) {
                        fnFail(data)
                    }
                })
            }
            var url = {
                getCode: '/api/user/sms/not-login-verification/code',
                getInsert: "/api/applyTrial/insert"
            };
            var footer_interval = null;
            $(".footer_button").click(function() {
                console.log(123);
                if(!$(".footer_enterprise").val()) {
                    alert('请输入公司名称');
                } else if(!$(".footer_name").val()) {
                    alert('请输入您的姓名');
                } else if(!checkIpone($(".footer_ipone").val())) {
                    alert('请输入正确手机号');
                } else if(!$(".footer_code").val()) {
                    alert('请输入短信验证码');
                } else if($(".footer_name").val() && $(".footer_code").val() && $(".footer_enterprise").val() && checkIpone($(".footer_ipone").val())) {
                    httpPost(url.getInsert, {
                            "companyName": $(".footer_enterprise").val(),
                            "contact": $(".footer_name").val(),
                            "phone": $(".footer_ipone").val(),
                            "source": 4,
                            "verifyCode": $(".footer_code").val()
                        },
                        function(successData) {
                            alert('提交信息成功');
                            $(".footer_name").val("");
                            $(".footer_enterprise").val("");
                            $(".footer_ipone").val("");
                            $(".footer_code").val("");
                            $('.footer_getcode').css({
                                display: "block"
                            });
                            $('.footer_time').css({
                                display: "none"
                            });
                            $('.footer_time').html(60 + "s");
                            clearInterval(footer_interval);
                        },
                        function(failData) {
                            alert(failData.msg);
                        })
                }
            });

            $('.footer_getcode').click(function() {
                var timeNumber = 60;
                if(checkIpone($(".footer_ipone").val())) {
                    $('.footer_getcode').css({
                        display: "none"
                    });
                    $('.footer_time').css({
                        display: "block"
                    });
                    footer_interval = setInterval(function() {
                        timeNumber = timeNumber - 1;
                        $('.footer_time').html(timeNumber + "s");
                        if(timeNumber == 0) {
                            $('.footer_getcode').css({
                                display: "block"
                            });
                            $('.footer_time').css({
                                display: "none"
                            });
                            $('.footer_time').html(60 + "s");
                            clearInterval(footer_interval);
                        }
                    }, 1000)
                    httpPost(url.getCode, {
                            "phone": $(".footer_ipone").val(),
                            "useType": "33"
                        },
                        function(successData) {
                            console.log(successData);
                        },
                        function(failData) {
                            console.log(failData);
                        });
                } else {
                    alert('请输入正确手机号')
                }
            })
            
        }
    },
}
</script>

<style lang="scss" scoped>
.invite-landing{
    .head_area {
        width: 100%;
        position: relative;
        background: url('/static/image/landing/banner.jpg') no-repeat;
        background-size: 100% 100%;
        height: 650px;
    }

    .logo_area {
        position: absolute;
        height: 64px;
        line-height: 64px;
        width: 1200px;
        top: 0px;
        margin-left: -600px;
        left: 50%;
        z-index: 1;
    }

    .bannerImg {
        width: 100%;
        max-height: 640px;
    }

    input::-webkit-input-placeholder {
        color: #99A9BF;
    }

    input:-moz-placeholder {
        color: #99A9BF;
    }

    input::-moz-placeholder {
        color: #99A9BF;
    }

    input:-ms-input-placeholder {
        color: #99A9BF;
    }

    .sumbit div span {
        display: none;
    }

    .logo {
        margin-top: 10px;
        float: left;
        width: 230px;
        height: 106px;
        background: url('/static/image/landing/logo.svg') no-repeat;
        z-index: 99;
    }

    .tel {
        float: right;
        font-family: PingFangSC-Medium;
        line-height: 64px;
        font-size: 20px;
        color: #fff;
    }

    .phone_icon {
        margin-right: 8px;
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url('/static/image/landing/phone_icon.svg') no-repeat;
    }

    .reg_box {
        position: absolute;
        right: 0;
        top: 90px;
        width: 350px !important;
        height: 416px;
        border-radius: 8px;
        background: #fff;
        .reg_head {
            height: 35px;
            line-height: 35px;
            background: linear-gradient(86deg, #FE4E3E 0%, #FD9F5C 99%);
            border-radius: 8px 8px 0 0;
            font-size: 0;
            padding: 0 15px;
            &>span{
                font-size: 12px;
                color: #fff;
                vertical-align: middle;
            }
            .reg_name {
                display: inline-block;
                width: 120px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            .fs-16 {
                font-size: 16px;
                position: relative;
                top: -2px;
            }
        }
        .reg_info {
            padding: 20px 24px;
            .tab {
                font-size: 0;
                margin-bottom: 25px;
                span{
                    display: inline-block;
                    width: 50%;
                    text-align: center;
                    font-size: 14px;
                    padding-bottom: 9px;
                    border-bottom: 1px solid #99A9BF;
                    cursor: pointer;
                    position: relative;
                    &.active {
                        color: #02ADFF;
                        &::after{
                            content: '';
                            width: 100%;
                            height: 2px;
                            background: #02ADFF;
                            position: absolute;
                            left: 0;
                            bottom: -1px;
                        }
                    }
                }
            }
            .verify {
                width: 187px;
            }
            .getcode {
                float: right;
                width: 100px;
                height: 36px;
                text-align: center;
                border: 1px solid #99A9BF;
                color: #99A9BF;
                border-radius: 4px;
                padding: 10px 0;
                cursor: pointer;
                &.active {
                    color: #02ADFF;
                    border-color: #02ADFF;
                }
                &:hover {
                    background: none;
                }
            }
            .next-box {
                margin-top: 20px;
                .el-button {
                    width: 100%;
                    background: #DCCB9E;
                    border-color: #DCCB9E;
                }
            }
        }
    }

    .service {
        background: #FFFFFF;
    }

    .service ul {
        width: 1200px;
        padding: 60px 0 80px;
        margin: 0 auto;
    }

    .service ul li {
        width: 300px;
        float: left;
        padding: 0 40px;
        box-sizing: border-box;
    }

    .service ul li img {
        display: block;
        width: 120px;
        height: 120px;
        margin: 0 auto;
        margin-bottom: 20px;
    }

    .service ul li p {
        font-size: 20px;
        color: #333333;
        text-align: center;
        font-weight: 500;
        line-height: 20px;
        margin-bottom: 10px;
    }

    .service ul li div {
        width: 40px;
        height: 2px;
        background: #C9B387;
        margin: 0 auto;
        margin-bottom: 6px;
    }

    .service ul li span {
        font-size: 14px;
        color: #626262;
        text-align: center;
        line-height: 26px;
        display: block;
    }

    .swper {
        width: 1200px;
        margin: 0 auto;
    }

    .advantage {
        width: 100%;
        margin: 0 auto;
        background: #F3F2F2;
        position: relative;
    }

    .advantage .div_ul1 {
        margin-top: 60px;
        width: 406px;
        height: 660px;
        background: #FFFFFF;
        float: left;
        position: relative;
    }

    .advantage .div_ul1 li.click p:after {
        content: '';
        display: block;
        position: absolute;
        right: -16px;
        top: 65px;
        border-left: 16px solid #666666;
        border-top: 11px solid transparent;
        border-bottom: 11px solid transparent;
        z-index: 10;
    }

    .advantage .div_ul1 li.click p:before {
        content: '';
        display: block;
        position: absolute;
        right: -15px;
        top: 66px;
        border-left: 15px solid #FFFFFF;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        z-index: 11;
    }

    .advantage .div_ul1 li.click span:after {
        content: '';
        display: block;
        position: absolute;
        right: -28px;
        top: 65px;
        border-left: 16px solid #C9B387;
        border-top: 11px solid transparent;
        border-bottom: 11px solid transparent;
        z-index: 5;
    }

    .advantage .div_ul1 li.click span:before {
        content: '';
        display: block;
        position: absolute;
        right: -27px;
        top: 66px;
        border-left: 15px solid #F3F2F2;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        z-index: 6;
    }

    .advantage .div_ul1 h4 {
        background: #090F1F;
        width: 100%;
        height: 40px;
        font-size: 20px;
        color: #FFFFFF;
        text-align: center;
        line-height: 40px;
        font-weight: normal;
    }

    .advantage .div_ul1 ul {
        border: 1px solid #979797;
        width: 100%;
        height: 620px;
        box-sizing: border-box;
    }

    .advantage .div_ul1 ul li {
        background: #FAFAFC;
        width: 100%;
        height: 154px;
        padding: 20px 40px;
        box-sizing: border-box;
        position: relative;
        cursor: pointer;
    }

    .advantage .div_ul1 ul li.click:before {
        content: '';
        display: block;
        width: 386px;
        height: 1px;
        background: #818182;
        position: absolute;
        bottom: 3px;
        left: 10px;
    }

    .advantage .div_ul1 ul li p {
        font-size: 20px;
        color: #333333;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .advantage .div_ul1 ul li span {
        font-size: 14px;
        color: #666666;
        line-height: 26px;
    }

    .advantage .div_ul2 {
        width: 783px;
        height: 660px;
        float: right;
        background: #FFFFFF;
        margin-top: 60px;
    }

    .advantage .div_ul2 h4 {
        background: #C9B387;
        width: 100%;
        height: 40px;
        font-size: 20px;
        color: #333333;
        text-align: center;
        line-height: 40px;
        font-weight: normal;
    }

    .advantage .div_ul2 ul {
        width: 100%;
        height: 620px;
        box-sizing: border-box;
        border: 1px solid #C9B387;
        position: relative;
    }

    .advantage .div_ul2 li {
        display: none;
        padding-top: 30px;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
    }

    .advantage .div_ul2 li.hover {
        display: block;
    }

    .advantage .div_ul2 li p {
        font-size: 26px;
        color: #333333;
        text-align: center;
        margin-bottom: 10px;
    }

    .advantage .div_ul2 li span {
        font-size: 14px;
        color: #666666;
        display: block;
        text-align: center;
        margin-bottom: 40px;
    }

    .advantage .div_ul2 li img {
        display: block;
        width: 505px;
        height: 372px;
        margin: 0 auto;
    }

    .advantage .div_ul3 li.hover>p{
        animation: p_animation 0.5s linear;
        -moz-animation: p_animation 0.5s linear;
        -webkit-animation: p_animation 0.5s linear;
        -o-animation: p_animation 0.5s linear;
        animation-fill-mode: forwards;
    }
    .advantage .div_ul3 li.hover>div{
        animation: div_animation 0.5s linear;
        -moz-animation: div_animation 0.5s linear;
        -webkit-animation: div_animation 0.5s linear;
        -o-animation: div_animation 0.5s linear;
        animation-fill-mode: forwards;
    }
    .advantage .div_ul3 {
        width: 1200px;
        margin: 0 auto;
        height: 700px;
        box-sizing: border-box;
        padding: 60px 0 80px;
        position: relative;
        z-index: 10;
    }

    .advantage .div_ul3 li {
        width: 285px;
        height: 560px;
        float: left;
        margin-right: 20px;
        position: relative;
        cursor: pointer;
    }

    .advantage .div_ul3 li:last-child {
        margin-right: 0;
    }

    .advantage .div_ul3 li img {
        width: 285px;
        height: 410px;
        border-radius: 10px;
    }

    .advantage .div_ul3 li>p {
        width: 100%;
        position: absolute;
        text-align: center;
        font-size: 20px;
        color: #FFFFFF;
        top: 190px;
    }

    .advantage .div_ul3 li div {
        position: absolute;
        top: 430px;
        left: 50%;
        margin: 0 auto;
    }

    .advantage .div_ul3 li:nth-child(1) div {
        width: 200px;
        margin-left: -100px;
    }
    .advantage .div_ul3 li:nth-child(2) div {
        width: 164px;
        margin-left: -82px;
    }
    .advantage .div_ul3 li:nth-child(3) div {
        width: 144px;
        margin-left: -72px;
    }
    .advantage .div_ul3 li:nth-child(4) div {
        width: 256px;
        margin-left: -128px;
    }

    .advantage .div_ul3 li div p {
        width: 100%;
        text-align: left;
        font-size: 16px;
        color: #FFFFFF;
        line-height: 26px;
    }

    .process {
        width: 100%;
        height: 1320px;
        background: url(/static/image/landing/process_bg.jpg) no-repeat;
        background-size: 100% 100%;
    }

    .process .process_img1 {
        display: block;
        width: 1200px;
        height: auto;
        margin: 0 auto;
        padding: 60px 0 20px;
    }
    .process .process_img2 {
        width: 940px;
        height: 536px;
        padding: 60px 0 24px;
        margin: 0 auto;
        display: block;
    }

    .process p {
        font-size: 20px;
        color: #666666;
        text-align: center;
    }

    .application {
        width: 100%;
        height: 900px;
        background: #FFFFFF;
    }

    .application ul {
        width: 100%;
        height: 630px;
        padding-top: 60px;
    }

    .application ul li {
        width: 390px;
        height: 300px;
        float: left;
        margin: 0 15px 15px 0;
        background-size: 100% 100%;
    }

    .application ul li>p {
        text-align: center;
        line-height: 300px;
        font-size: 18px;
        color: #FFFFFF;
    }

    .application ul li div {
        background-size: 100% 100%;
    }

    .application ul li div:nth-child(1) {
        width: 100%;
        height: 140px;
        margin-bottom: 20px;
        background: url(/static/image/landing/application5.png) no-repeat;
    }

    .application ul li div:nth-child(2) {
        width: 183px;
        height: 140px;
        float: left;
        background: url(/static/image/landing/application6.png) no-repeat;
    }

    .application ul li div:nth-child(3) {
        width: 183px;
        height: 140px;
        margin-bottom: 20px;
        float: right;
        background: url(/static/image/landing/application7.png) no-repeat;
    }

    .application ul li div p {
        text-align: center;
        line-height: 140px;
        font-size: 18px;
        color: #FFFFFF;
    }

    .application ul li:nth-child(3n) {
        margin: 0;
    }

    .application ul li:nth-child(1) {
        background: url(/static/image/landing/application1.png) no-repeat;
    }

    .application ul li:nth-child(2) {
        background: url(/static/image/landing/application2.png) no-repeat;
    }

    .application ul li:nth-child(3) {
        background: url(/static/image/landing/application3.png) no-repeat;
    }

    .application ul li:nth-child(4) {
        background: url(/static/image/landing/application4.png) no-repeat;
    }

    .application ul li:nth-child(6) {
        background: url(/static/image/landing/application8.png) no-repeat;
    }

    .fotter_bg {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 530px;
        background: url(/static/image/landing/footer_bg.png) no-repeat;
        background-size: 100% 100%;
    }

    .footer {
        height: 40px;
        line-height: 40px;
        background-color: #000;
        color: #fff;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        text-align: center;
    }

    .link_area a {
        text-decoration: none;
        color: #fff;
        margin-right: 14px;
        font-family: PingFangSC-Regular;
    }

    .company_info {
        font-size: 12px;
        font-family: PingFangSC-Regular;
        color: #FFFFFF;
    }

    .system_text {
        color: #333;
        font-family: PingFangSC-Medium;
        font-size: 16px;
    }

    .title_text_system {
        font-size: 44px;
        line-height: 44px;
        font-family: PingFangSC-Regular;
        padding-top: 80px;
        text-align: center;
    }

    .apply_way_title {
        position: absolute;
        top: 60px;
        width: 100%;
        text-align: center;
        font-size: 44px;
        color: #fff;
        font-family: PingFangSC-Regular;
    }

    .apply_way_sub_title {
        position: absolute;
        top: 120px;
        width: 100%;
        text-align: center;
        color: #fff;
        line-height: 25px;
        font-size: 18px;
    }

    .wraper {
        display: inline-block;
        width: 1200px;
    }

    .logo_text>div {
        width: 1200px;
        margin: 0 auto;
    }

    .logo_text .buy_btn {
        display: block;
        margin: 0 auto;
        width: 140px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #02adff;
        border-radius: 20px;
        color: #fff;
        cursor: pointer;
    }

    .logo_text {
        width: 1200px;
        margin: 0 auto;
        padding-top: 200px;
        position: relative;
    }

    .logo_text .title_text {
        font-size: 60px;
        color: #fff;
        margin: 0;
        padding: 0;
        margin-bottom: 30px;
        // text-align: center;
    }

    .logo_text .introduce_text {
        font-family: PingFangSC-Light;
        font-size: 30px;
        color: rgba(256, 256, 256, 0.9);
        margin: 0;
        padding: 0;
        margin-bottom: 50px;
        // text-align: center;
    }

    .footer_submit {
        width: 100%;
        height: 138px;
        background: #000000;
    }

    .footer_submit .wraper {
        display: block;
        width: 1200px;
        padding: 40px 0;
        height: 58px;
        margin: 0 auto;
        background: #000000;
    }

    .footer_submit .wraper div {
        width: 240px;
        height: 58px;
        margin-right: 16px;
        float: left;
        background: #fff;
        border-radius: 4px;
    }

    .footer_submit .wraper div input {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        border: 0;
        width: 240px;
        height: 58px;
        line-height: 58px;
        background: #FFFFFF;
        border-radius: 4px;
        text-indent: 20px;
        font-size: 14px;
        letter-spacing: 0;
        padding-right: 10px;
    }

    .footer_submit .wraper div.code input {
        width: 130px;
        height: 58px;
        line-height: 58px;
        background: #FFFFFF;
        border-radius: 4px;
        text-indent: 30px;
        font-size: 14px;
        letter-spacing: 0;
        float: left;
    }

    .footer_submit .wraper div.code button {
        width: 110px;
        height: 58px;
        line-height: 58px;
        background: #E8E8ED;
        border-radius: 4px;
        font-size: 14px;
        letter-spacing: 0;
        text-align: center;
        float: left;
        border: 0;
        outline: 0;
        cursor: pointer;
        color: #02ADFF;
    }

    .footer_submit .wraper>button {
        width: 170px;
        float: right;
        height: 58px;
        background: #02ADFF;
        border-radius: 4px;
        border: 0;
        outline: 0;
        font-size: 18px;
        color: #FFFFFF;
        cursor: pointer;
    }
}
@keyframes p_animation {
    0% {
        top: 190px;
    }
    100% {
        top: 110px;
    }
}

@-moz-keyframes p_animation {
    0% {
        top: 190px;
    }
    100% {
        top: 110px;
    }
}

@-webkit-keyframes p_animation {
    0% {
        top: 190px;
    }
    100% {
        top: 110px;
    }
}

@-o-keyframes p_animation {
    0% {
        top: 190px;
    }
    100% {
        top: 110px;
    }
}

@keyframes div_animation {
    0% {
        top: 430px;
    }
    100% {
        top: 164px;
    }
}

@-moz-keyframes div_animation {
    0% {
        top: 430px;
    }
    100% {
        top: 164px;
    }
}

@-webkit-keyframes div_animation {
    0% {
        top: 430px;
    }
    100% {
        top: 164px;
    }
}

@-o-keyframes div_animation {
    0% {
        top: 430px;
    }
    100% {
        top: 164px;
    }
}
</style>
<style lang="scss">
    .app{
        overflow: scroll;
    }
    .reg_info {
        .el-checkbox__inner {
            border-radius: 50%;
            width: 14px;
            height: 14px;
            vertical-align: middle;
        }
        .el-checkbox__label {
            font-size: 12px;
            padding-left: 0;
            a {
                color: #02ADFF;
            }
        }
        .next-box .el-button span{
            color: #fff;
        }
        .el-checkbox__inner::after {
            transform: translate(-50%, -50%) !important;
            width: 6px;
            height: 6px;
            left: 50%;
            top: 50%;
            background: #fff;
            border-radius: 50%;
            border: none;
        }
        .getcode:hover {
            background: none;
            span {
                color: #99A9BF;
            }
        }
        .getcode.active:hover{
            span {
                color: #02ADFF;
            }
        }
    }
</style>