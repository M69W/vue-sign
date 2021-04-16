<template>
    <div class="accountmanager">
        <div class="top-title clearfix">
            <div class="titinfo">账户管理</div>
        </div>
        <div class="mainBox">
            <div class="tab clearfix">
                <span :class="{active: active == 1}" @click="tab('1')">基本信息</span>
                <span :class="{active: active == 2}" @click="tab('2')" v-if="isMainAccount=='1'">账号安全</span>
                <span :class="{active: active == 3}" @click="tab('3')" v-if="isMainAccount=='1'">提醒设置</span>
            </div>
            <div class="info">
                <div v-show="active == 1">
                    <div class="userimg">
                        <img :src="userInfo.headImageUrl || imgUrl" alt="">
                        <div class="wraper" @click="uploadImg"></div>
                        <span @click="uploadImg">设置头像</span>
                    </div>
                    <div class="item">
                        <span class="label">{{userType=='02'?'个人账号':'企业账号'}}</span>
                        <span>{{userInfo.safePhone}}</span>
                    </div>
                    <div class="item" v-if="userType == '02'">
                        <span class="label">真实姓名</span>
                        <span v-if="userInfo.realNameAuthenticationFlag==1">{{userInfo.realName}}</span>
                        <span style="color:#EF8000;" v-if="userInfo.realNameAuthenticationFlag==0">未认证</span>
                        <el-button @click="toAuthen(1)" v-if="userInfo.realNameAuthenticationFlag==0">认证</el-button>
                    </div>
                    <div class="item" v-if="userType == '02'">
                        <span class="label">身份证号</span>
                        <span v-if="userInfo.realNameAuthenticationFlag==1">{{userInfo.identityCard}}</span>
                        <span style="color:#EF8000;" v-if="userInfo.realNameAuthenticationFlag==0">未认证</span>
                        <!-- <el-button @click="toAuthen(1)" v-if="userInfo.realNameAuthenticationFlag==0">认证</el-button> -->
                    </div>
                    <div class="item" v-if="userType == '01'">
                        <span class="label">企业名称</span>
                        <span>{{userInfo.enterpriseName}}</span>
                        <el-button @click="setCompanyName" v-if="userInfo.realNameAuthenticationFlag==0 && userType=='01'">修改名称</el-button>
                    </div>
                    <div class="item" v-if="userType == '01'">
                        <span class="label">企业证件号</span>
                        <span v-if="userInfo.realNameAuthenticationFlag == 1">{{userInfo.enterpriseCertificateNo}}</span>
                        <span style="color:#EF8000;" v-if="userInfo.realNameAuthenticationFlag == 0">未认证</span>
                        <el-button @click="toAuthen(0)" v-if="userInfo.realNameAuthenticationFlag == 0">认证</el-button>
                    </div>
                    <div class="item" v-if="userType == '01'">
                        <span class="label">联系人</span>
                        <span>{{userInfo.linkManName}}</span>
                        <el-button @click="setLinkName" v-if="userType=='01' && isMainAccount=='1'">修改联系人</el-button>
                    </div>
                    <div class="item">
                        <span class="label">收件地址</span>
                        <span :class="{setcolor: !userInfo.receptionAddress}">{{ userInfo.receptionAddress || '未设置'}}</span>
                        <el-button v-if="!userInfo.receptionAddress && isMainAccount==1" @click="addAddress()">添加</el-button>
                        <el-button v-if="userInfo.receptionAddress && isMainAccount==1" @click="editAddress()">修改</el-button>
                    </div>
                </div>
                <div v-show="active == 2">
                    <div class="item-safe">
                        <span class="label">登录密码</span>
                        <span>*****************</span>
                        <span class="safe-tip">用于保护帐号信息和登录安全</span>
                        <el-button @click="changePsd" v-if="isMainAccount==1">修改密码</el-button>
                    </div>
                    <div class="item-safe">
                        <span class="label">签署密码</span>
                        <span :class="{setcolor: !userInfo.isSignPassword}">{{userInfo.isSignPassword ? '*****************' : '未设置'}}</span>
                        <span class="safe-tip">用于保障您的合同信息安全</span>
                        <el-button @click="setSignPsd" v-if="isMainAccount==1">{{userInfo.isSignPassword ? '修改密码' : '设置密码'}}</el-button>
                    </div>
                    <div class="item-safe">
                        <span class="label">安全手机</span>
                        <span>{{userInfo.safePhone}}</span>
                        <span class="safe-tip">安全手机可以用于登录安印帐号，重置密码或其他安全验证</span>
                        <el-button @click="changeTel" v-if="isMainAccount==1">更换号码</el-button>
                    </div>
                    <div class="item-safe">
                        <span class="label">安全邮箱</span>
                        <span style="color:#EF8000;" v-if="!userInfo.enterpriseEmail && !userInfo.email">未设置</span>
                        <span v-if="userInfo.enterpriseEmail || userInfo.email">{{userInfo.enterpriseEmail || userInfo.email}}</span>
                        <span class="safe-tip">安全邮箱将可用于登录安印帐号，建议立即设置</span>
                        <el-button @click="setEmail" v-if="!userInfo.enterpriseEmail && !userInfo.email && isMainAccount==1">设置邮箱</el-button>
                        <el-button @click="changeEmail" v-if="(userInfo.enterpriseEmail || userInfo.email) && isMainAccount==1">修改邮箱</el-button>
                    </div>
                    <div class="item-safe">
                        <span class="label">账号注销</span>
                        <span class="safe-tip">账号注销后，所有账号基本信息，都将进行删除，无法进行恢复，请慎重使用注销功能</span>
                        <el-button @click="accountOff" v-if="isMainAccount==1">账号注销</el-button>
                    </div>
                    <div class="item-safe">
                        <span>文件安全验证</span>
                        <span class="safe-tip">为保证用户合同文件安全，可以选择开启合同文件下载双重验证功能</span>
                        <el-switch v-model="isFileSafety" on-text="" off-text="" :width="54" @change="fileSafetyChange"></el-switch>
                    </div>
                </div>
                <div v-show="active == 3">
                    <div class="item-safe">
                        <span>签署截止日设置</span>
                        <span class="safe-tip remand">合同签署截止日前<input type="number" @blur="setSignAbortDay" min="1" v-model="signDate"/>天提醒我</span>
                        <!--<el-switch v-model="isSign" on-text="" off-text="" :width="54" @change="switchChange" class="sign"></el-switch>-->
                    </div>
                    <div class="item-safe">
                        <span>有效期截止日设置</span>
                        <span class="safe-tip remand">合同有效期到期前<input type="number" @blur="setVaildAbortDay" min="1" v-model="expiryDate"/>天提醒我</span>
                        <!--<el-switch v-model="isExpiry" on-text="" off-text="" :width="54" @change="switchChange" class="expiry"></el-switch>-->
                    </div>
                    <div class="item-safe">
                        <span>短信通知</span>
                        <span class="safe-tip">若关闭，进行实名认证、文件签署、完成文件签署时，将不通过短信的方式向您注册的手机发送通知短信</span>
                        <el-switch v-model="isSms" on-text="" off-text="" :width="54" @change="msgChange" class="sms"></el-switch>
                    </div>
                    <div class="item-safe">
                        <span>邮箱通知</span>
                        <span class="safe-tip">若关闭，进行实名认证、文件签署、完成文件签署时，将不通过邮件的方式向您注册的邮箱发送通知邮件</span>
                        <el-switch v-model="isEmail" on-text="" off-text="" :width="54" @change="emailChange" class="email"></el-switch>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="dialogUpload" :before-close="uploadClose" class="dialog headimglog">
            <div class='dialogTitle'>
                <span class="el-dialog__title">{{dialogTitle}}</span>
            </div>
            <div class="dialog-body clearfix">
                <div class="fl">
                    <!-- <img :src="headImageUrl" class="headimg" id="cutImg">
                    <div class="mask"></div>
                    <div class="croperarea">
                        <img :src="headImageUrl" class="headimg">
                        <canvas id="myCan" width="140px" height="140px"></canvas>
                    </div>
                    <img :src="headImageUrl" class="hideImg">
                    <el-slider v-model="cuttingSize" show-input :step="10" @change="cutting"></el-slider> -->
                    <div class="cropper">
                        <vueCropper
                            ref="cropper"
                            :img="option.img"
                            :outputSize="option.size"
                            :outputType="option.outputType"
                            :info="true"
                            :full="option.full"
                            :canMove="option.canMove"
                            :canMoveBox="option.canMoveBox"
                            :original="option.original"
                            :autoCrop="option.autoCrop"
                            :autoCropWidth="option.autoCropWidth"
                            :autoCropHeight="option.autoCropHeight"
                            :fixedBox="option.fixedBox"
                            :fixed="option.fixed"
                            :fixedNumber="option.fixedNumber"
                            :centerBox="option.centerBox"
                            @realTime="realTime"
                            @imgLoad="imgLoad"
                        ></vueCropper>
                    </div>
                </div>
                <div class="fr">
                    <span class="tip">头像预览</span><br>
                    <div class="preview" :style="'background-image: url(' + base64Img + ')'"></div>
                    <span class="size">{{size}} X {{size}}</span>
                </div>
                <p>说明：只支持png、jpg、gif、文件大小&lt;5M</p>
            </div>
            <div slot="footer">
                <div class="fl"><input type="file" id="file" class="file" @change="reUpload($event)"><el-button>重新上传</el-button></div>
                <div class="fr">
                    <el-button @click="uploadClose">取 消</el-button>
                    <el-button type="primary" @click="uploadSave">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogModel" :before-close="dialogClose" class="dialog infolog" top="23%">
            <div class='dialogTitle'>
                <span class="el-dialog__title">{{dialogTitle}}</span>
            </div>
            <div class="dialog-body">
                <el-form :model="formData" :rules="rules" ref="formTab" label-width="110px" label-position="right">
                    <div v-if="dialogType == 'address'">
                        <el-form-item label="省份" prop="proId">
                            <el-select v-model="formData.proId" placeholder="请选择省份" >
                                <el-option v-for="item in provinceList" :key="item.proId" :label="item.proName" :value="item.proId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="城市" prop="cityId">
                            <el-select v-model="formData.cityId" placeholder="请选择城市">
                                <el-option v-for="item in cityList" :key="item.cityId" :label="item.cityName" :value="item.cityId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="详细地址" prop="detailedAddress">
                            <el-input type="textarea" v-model="formData.detailedAddress"></el-input>
                        </el-form-item>
                        <el-form-item label="邮政编码" prop="postcode">
                            <el-input v-model="formData.postcode" placeholder="请输入邮政编码" :maxlength="6"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="dialogType == 'password'">
                        <el-form-item label="当前登录密码" prop="currentPassword">
                            <el-input v-model="formData.currentPassword" :type="visible" placeholder="请输入密码（8~20位字母和数字）"></el-input>
                            <span class="password" @click="changeVisible(visible,1)" ref="visible"></span>
                        </el-form-item>
                        <el-form-item label="新登录密码" prop="newPassword">
                            <el-input v-model="formData.newPassword" :type="visible2" placeholder="请输入密码（8~20位字母和数字）"></el-input>
                            <span class="password" @click="changeVisible(visible2,2)" ref="visible2"></span>
                        </el-form-item>
                        <el-form-item label="确认新密码" prop="confirmPassword">
                            <el-input v-model="formData.confirmPassword" :type="visible3" placeholder="请输入密码（8~20位字母和数字）"></el-input>
                            <span class="password" @click="changeVisible(visible3,3)" ref="visible3"></span>
                        </el-form-item>
                    </div>
                    <div v-if="dialogType == 'verify'" class="verify">
                        <!-- <p>为了保护帐号安全，需要验证手机有效性</p> -->
                        <el-form-item label="手机号码">
                            <span>{{phoneNum}}</span>
                            <el-button class="codebtn" @click="getPhoneCode">{{countdown == 0?'获取验证码':countdown+'s'}}</el-button>
                        </el-form-item>
                        <el-form-item label="短信验证码" prop="verify">
                            <el-input v-model="formData.verify" placeholder="请输入短信验证码" :maxlength="6"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="dialogType == 'signpsd'">
                        <el-form-item label="签署密码" prop="signpsd">
                            <el-input v-model="formData.signpsd" :type="visible" placeholder="请输入密码（6~20位字母或数字）"></el-input>
                            <span class="password" @click="changeVisible(visible,1)" ref="visible"></span>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkSignpsd">
                            <el-input v-model="formData.checkSignpsd" :type="visible2" placeholder="请再次输入密码"></el-input>
                            <span class="password" @click="changeVisible(visible2,2)" ref="visible2"></span>
                        </el-form-item>
                    </div>
                    <div v-if="dialogType == 'tel'">
                        <el-form-item label="新手机号码" prop="tel">
                            <el-input v-model="formData.phoneNum" placeholder="请输入新的手机号码" class="code"></el-input>
                            <el-button class="codebtn" @click="getPhoneCode">{{countdown == 0?'获取验证码':countdown+'s'}}</el-button>
                        </el-form-item>
                        <el-form-item label="短信验证码" prop="verify">
                            <el-input v-model="formData.verify" placeholder="请输入短信验证码"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="dialogType == 'email'">
                        <el-form-item label="邮箱地址" prop="email">
                            <el-input v-model="formData.email" placeholder="请输入新的邮箱地址" class="code"></el-input>
                            <el-button class="codebtn" @click="getEmailCode()">{{countdown == 0?'获取验证码':countdown+'s'}}</el-button>
                        </el-form-item>
                        <el-form-item label="邮箱验证码" prop="emailVerificationCode">
                            <el-input v-model="formData.emailVerificationCode" placeholder="请输入邮箱验证码"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="dialogType == 'companyName'">
                        <el-form-item label="企业名称" prop="companyName">
                            <el-input v-model="formData.companyName" placeholder="请输入新的企业名称"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="dialogType == 'linkName'">
                        <el-form-item label="联系人" prop="linkName">
                            <el-input v-model="formData.linkName" placeholder="请输入新的联系人名称"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="dialogType == 'signoff'" class="signoff" style="width: 500px;">
                        <div v-if="!isOff">
                            <h5>您确定要注销 “{{accountComp}}” 账号？</h5>
                            <p>如您确定注销该账号后，系统将会清除该账号的所有信息，包含所有合同数据、云印章数据、联系人数据、账号基本信息等等，无法进行恢复，请慎重。</p>
                            <p style="margin-top: 20px;color: #999;">注：该注销仅注销合同平台数据不影响电子印章（Ukey）的数据和正常使用。</p>
                        </div>
                        <div v-else style="text-align:center;">
                            <img src="../../../../static/image/icon-paysuccess.png" alt="">
                            <span style="margin-left: 20px;font-size: 15px;">注销成功！</span>
                        </div>
                    </div>
                </el-form>
            </div>
<!--            <div class="height" style="height: 60px;" v-if="['companyName','linkName'].includes(dialogType)"></div>-->
            <div slot="footer" v-if="!isOff">
                <el-button @click="dialogClose">取 消</el-button>
                <el-button type="primary" @click="submit_Form('formTab')" v-if="dialogType != 'verify' || offStep">确 定</el-button>
                <el-button type="primary" @click="submit_Form('formTab')" v-if="dialogType == 'verify' && !offStep">下一步</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import service from "../../../assets/mixin/service"
    import VueCropper from '../../../components/vue-cropper'
    import valid from "../mixin/valid"

    export default{
        mixins: [service, valid],
        components: {VueCropper},
        data() {
            var checkPsd = (rule, value, callback) => {
                if(!value){
                    callback(new Error('密码不能为空'))
                }else if (value.length < 6 || value.length >20) {
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
            var checkCity = (rule, value, callback) => {
                if(!value && value != null){
                    return callback(new Error("请选择城市"));
                }
                callback()
            }
            var comfirmPsd = (rule, value, callback) => {
                if (this.formData.newPassword != this.formData.confirmPassword) {
                    return callback(new Error("两次输入的密码不一致，请重试"));
                }
                callback();
            };
            return {
                active: 1,
                userType: '',
                imgUrl: './static/image/userheadimg.png',
                userInfo: {},
                isMainAccount:0,
                isSign: true,
                isExpiry: false,
                isSms: false,
                isEmail: true,
                isFileSafety: false,
                signDate: 1,
                expiryDate: 1,
                formData: {},
                dialogModel: false,
                dialogTitle: '',
                dialogType: '',
                dialogUpload: false,
                rules: {
                    verify: [{required: true, message: '请输入验证码', trigger: 'blur'}],
                    companyName: [{required: true, message: '请输入新企业名称', trigger: 'blur'},
                        { max: 33, message: '您输入的企业名称字符长度已超出限制', trigger: 'blur' },
                        {validator: this.checkEnterpriseName, trigger: 'blur'},
                    ],
                    linkName: [{required: true, message: '请输入新联系人名称', trigger: 'blur'},
                        { max: 20, message: '您输入的联系人名称字符长度已超出限制', trigger: 'blur' },
                        {validator: this.checkLinkName, trigger: 'blur'},
                    ],
                    signpsd: [{validator: checkPsd, trigger: "blur"}],
                    checkSignpsd: [
                        {required: true, message: '请输入签署密码', trigger: 'blur'},
                        {validator: checkSignpsd, trigger: "blur"}
                    ],
                    proId: [{required: true, message: '请选择省份', trigger: 'change'}],
                    cityId: [{required: true, message: '请选择城市', trigger: 'change'}],
                    detailedAddress: [
                        {required: true, message: '请填写详细地址', trigger: 'blur'},
                        {max: 100, message: '详细地址最大不能超过100个汉字', trigger: 'blur'}
                    ],
                    currentPassword: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {validator: this.checkPasswords, trigger: "blur"}
                    ],
                    newPassword: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {validator: this.checkPasswords, trigger: "blur"}
                    ],
                    confirmPassword: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {validator: comfirmPsd, trigger: "blur"}
                    ]
                },
                headImageUrl: './static/image/userheadimg.png',
                cuttingSize: 0,
                visible: 'password',
                visible2: 'password',
                visible3: 'password',
                flag: '',
                countdown: 0,
                timer: null,
                size: 100,
                cutImageUrl: '',
                provinceList: [],
                cityList: [],
                addressType: '',
                emailType: '',
                useType: '',
                msmUseType: '',
                option: {
                    img: '',
                    size: 1,
                    full: false,//输出原图比例截图 props名full
                    outputType: 'png',
                    canMove: true,
                    original: false,
                    canMoveBox: true,
                    autoCrop: true,
                    autoCropWidth: 140,
                    autoCropHeight: 140,
                    fixedBox: false,
                    fixed: true,
                    fixedNumber: [1, 1],
                    centerBox: true
                },
                base64Img: './static/image/userheadimg.png',
                isCode: true,
                phoneNum: '',
                realNameAuthenticationFlag:0,
                setNewPhone:false,
                offStep: false,
                isOff: false
            }
        },
        computed: {
            province(){
                return this.formData.proId
            },
            accountComp(){
                if(this.userInfo.realNameAuthenticationFlag == 1){
                    return this.userInfo.enterpriseName || this.userInfo.realName;
                }else{
                    return  this.userInfo.accountNo;
                }
            }
        },
        watch: {
            active(){
                if(this.active == 1){
                    $('.accountmanager .mainBox .info').removeClass("info1 info2")
                }else if(this.active == 2){
                    $('.accountmanager .mainBox .info').addClass("info1").removeClass("info2")
                }else if(this.active == 3){
                    $('.accountmanager .mainBox .info').removeClass("info1").addClass("info2")
                }
            },
            signDate(){
                // if(this.signDate.length>=3){
                //     $(".remand input").css("width",(this.signDate.length-2)*8+50)
                // }
            },
            countdown(){
                if(this.countdown == 0){
                    clearInterval(this.timer)
                    this.isCode = true
                }
            },
            province(val, oldVal){
                if( oldVal && val && val != oldVal ){
                    // this.formData.cityId = ""
                    delete this.formData.cityId
                    this.getCities()
                }else if( oldVal && !val){
                    return
                }else{
                    this.getCities()
                }
            }
        },
        mounted() {
            this.active = this.$route.query.safetyType ? parseInt(this.$route.query.safetyType) : 1;
            this.userType = $.cookie("userinfo") && JSON.parse($.cookie("userinfo")).userType;
            this.isMainAccount = $.cookie("userinfo") && JSON.parse($.cookie("userinfo")).isMainAccount;
            this.realNameAuthenticationFlag = $.cookie("userinfo") && JSON.parse($.cookie("userinfo")).realNameAuthenticationFlag
            this.getInfo()
            this.switchChange();
        },
        methods: {
            getInfo(){
                var that = this;
                if(this.userType == '02'){
                    this.personDetail().then(res =>{
                        if(this.successCheckCode(res)){
                            that.signDate = res.data.signAbortDay;
                            that.expiryDate = res.data.vaildAbortDay;
                            that.isSms = res.data.isShortMessage?true:false;
                            that.isEmail = res.data.isMail?true:false;
                            that.isFileSafety = res.data.compactDownloadValidate?true:false;
                            that.userInfo = res.data
                            that.phoneNum = that.userInfo.phone;
                            that.userInfo.safePhone = that.userInfo.accountNo?this.forMat(res.data.accountNo,3,3):'';
                            that.userInfo.identityCard = that.userInfo.identityCard?this.forMat(that.userInfo.identityCard,4,4):'';
                            that.userInfo.headImageUrl?that.userInfo.headImageUrl='/api'+that.userInfo.headImageUrl:that.userInfo.headImageUrl=''
                            //实名之后刷新企业列表信息
                            if(this.realNameAuthenticationFlag==1){
                                let changeFlag = false;
                                let userinfo = $.cookie("userinfo") && JSON.parse($.cookie("userinfo"))
                                userinfo.enterPriseName = res.data.realName||'';
                                userinfo.personalName = res.data.realName||'';

                                let enterpriseInfoList  = userinfo.enterpriseInfoList ||[];
                                let newEnterpriseInfoList = enterpriseInfoList.map(item=>{
                                    if(item.personalId == res.data.personalId && item.realNameAuthenticationFlag==0){
                                        item.personalName = res.data.realName||'';
                                        item.realNameAuthenticationFlag = 1;
                                        changeFlag=true;
                                        this.$message.success('实名成功')
                                    }
                                    return item
                                })
                                userinfo.enterpriseInfoList = newEnterpriseInfoList;
                                userinfo.realNameAuthenticationFlag = 1;
                                if(changeFlag){
                                    $.cookie('userinfo', JSON.stringify(userinfo), { path: "/", domain: this.$domain});
                                    this.$router.go(0)
                                }
                            }
                        }
                    })
                }else{
                    this.enterpriseDetail().then(res =>{
                        if(this.successCheckCode(res)){
                            that.signDate = res.data.signAbortDay;
                            that.expiryDate = res.data.vaildAbortDay;
                            that.isSms = res.data.isShortMessage?true:false;
                            that.isEmail = res.data.isMail?true:false;
                            that.isFileSafety = res.data.compactDownloadValidate?true:false;
                            that.userInfo = res.data
                            that.phoneNum = that.userInfo.linkManPhone
                            that.userInfo.safePhone = that.userInfo.accountNo?this.forMat(that.userInfo.accountNo,3,3):''
                            that.userInfo.enterpriseCertificateNo = that.userInfo.enterpriseCertificateNo?this.forMat(that.userInfo.enterpriseCertificateNo,4,4):''
                            that.userInfo.headImageUrl?that.userInfo.headImageUrl='/api'+that.userInfo.headImageUrl:that.userInfo.headImageUrl=''
                            that.formData.companyName = res.data.enterpriseName;
                            that.formData.linkName = res.data.linkManName;
                            //实名之后刷新企业列表信息
                            if(this.realNameAuthenticationFlag==1){
                                let changeFlag = false;
                                let userinfo = $.cookie("userinfo") && JSON.parse($.cookie("userinfo"))
                                userinfo.enterPriseName = res.data.enterpriseName||'';
                                userinfo.personalName = res.data.linkManName||'';

                                let enterpriseInfoList  = userinfo.enterpriseInfoList ||[];
                                let newEnterpriseInfoList = enterpriseInfoList.map(item=>{
                                    if(item.enterpriseId == res.data.enterpriseId && item.realNameAuthenticationFlag==0){
                                        item.enterPriseName = res.data.enterpriseName||'';
                                        console.log(item);
                                        item.realNameAuthenticationFlag = 1;
                                        this.$message.success('实名成功')
                                        changeFlag=true;
                                    }
                                    return item
                                })
                                userinfo.enterpriseInfoList = newEnterpriseInfoList;
                                userinfo.realNameAuthenticationFlag = 1;
                                if(changeFlag){
                                    $.cookie('userinfo', JSON.stringify(userinfo), { path: "/", domain: this.$domain});
                                    this.$router.go(0)
                                }
                            }
                        }
                    })
                }
            },
            tab(val){
                this.active = val
            },
            toAuthen(val){
                if(val == 1){
                    this.$router.push('personauthen')
                }else if(val == 0){
                    this.$store.commit('SET_CPHONE',this.phoneNum);
                    this.$router.push('companyauthen')
                }
            },
            submit_Form(ref) {
                if(this.dialogType == 'signoff'){
                    this.dialogType = 'verify';
                    this.msmUseType = 32;
                    this.offStep = true;
                    this.dialogTitle = '账号注销验证';
                    return false;
                }
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        if(this.dialogType == 'verify' && !this.offStep){
                            this.next()
                        }else{
                            this.save()
                        }
                    } else {
                        return false;
                    }
                });
            },
            next(){
                var that = this;
                this.checkSmsCode({
                    "msmCode": this.formData.verify,
                    "phone": this.phoneNum,
                    "useType": this.msmUseType
                }).then(res =>{
                    if(this.successCheckCode(res)){
                        if(this.flag == 1){
                            this.dialogType = 'address'
                            this.getProvince({
                                currPage: 1,
                                pageSize: 100
                            }).then(res =>{
                                if(this.successCheckCode(res)){
                                    this.provinceList = res.data.records
                                }
                            })
                            if(this.addressType == 1){ //修改
                                this.formData = that.userInfo.deliveryAddress
                            }
                        }else if(this.flag == 2){
                            this.dialogType = 'password'
                        }else if(this.flag == 3){
                            this.dialogType = 'signpsd'
                        }else if(this.flag == 4){
                            this.dialogType = 'tel'
                            this.countdown = 0 ;
                            this.setNewPhone = true;
                            this.formData.verify = '';
                        }else if(this.flag == 5){
                            this.dialogType = 'email'
                            this.countdown = 0
                        }
                    }
                })
                // if(this.flag == 1){
                //     this.dialogType = 'address'
                //     this.getProvince({
                //         currPage: 1,
                //         pageSize: 100
                //     }).then(res =>{
                //         if(this.successCheckCode(res)){
                //             this.provinceList = res.data.records
                //         }
                //     })
                //     if(this.addressType == 1){ //修改
                //         this.formData = this.userInfo.deliveryAddress
                //         // this.getAddress(0, {
                //         //     currPage: 1,
                //         //     pageSize: 100
                //         // }).then(res =>{
                //         //     if(this.successCheckCode(res)){
                //         //         this.formData = res.data.records.pop()
                //         //         console.log(this.formData)
                //         //     }
                //         // })
                //     }
                // }else if(this.flag == 2){
                //     this.dialogType = 'password'
                // }else if(this.flag == 3){
                //     this.dialogType = 'signpsd'
                // }else if(this.flag == 4){
                //     this.dialogType = 'tel'
                // }else if(this.flag == 5){
                //     this.dialogType = 'email'
                // }
            },
            save(){
                if(this.flag == 1){
                    let cityName , proName;
                    this.provinceList.map(ele =>{
                        if(ele.proId == this.formData.proId){
                            proName = ele.proName
                        }
                    })
                    this.cityList.map(ele =>{
                        if(ele.cityId == this.formData.cityId){
                            cityName = ele.cityName
                        }
                    })
                    let data = {
                        "addressId": this.formData.id,
                        "addressType": 0,
                        "cityId": this.formData.cityId,
                        "cityName": cityName,
                        "detailedAddress": this.formData.detailedAddress,
                        "postcode": this.formData.postcode,
                        "proId": this.formData.proId,
                        "proName": proName
                    }
                    if(this.addressType == 0){
                        this.setAddress(data).then(res =>{
                            if(this.successCheckCode(res)){
                                this.$message.success('收件地址设置成功')
                                this.dialogClose()
                                this.getInfo()
                            }
                        })
                    }else if(this.addressType == 1){
                        this.changeAddress(data).then(res =>{
                            if(this.successCheckCode(res)){
                                this.$message.success('收件地址修改成功')
                                this.dialogClose()
                                this.getInfo()
                            }
                        })
                    }
                }else if(this.flag == 2){
                    this.editPassword({
                        "currentPassword": this.formData.currentPassword,
                        "newPassword": this.formData.newPassword,
                        "confirmPassword": this.formData.confirmPassword
                    }).then(res =>{
                        if(this.successCheckCode(res)){
                            this.$message({
                                type: 'success',
                                message: '登录密码修改成功'
                            })
                            this.dialogClose()
                            this.getInfo()
                        }
                    })
                }else if(this.flag == 3){
                    this.signPsd({signPassword: this.formData.signpsd}).then(res =>{
                        if(this.successCheckCode(res)){
                            this.$message({
                                type: 'success',
                                message: '签署密码设置成功'
                            })
                            //更新缓存是否设置签署密码
                            let userinfo = $.cookie("userinfo") && JSON.parse($.cookie("userinfo"));
                            userinfo.isSignPassword  = true ;
                            $.cookie('userinfo', JSON.stringify(userinfo), {path: "/", domain: this.$domain});

                            this.dialogClose()
                            this.getInfo()
                        }
                    })
                }else if(this.flag == 4){ //修改手机号
                    this.checkSmsCode({
                        "msmCode": this.formData.verify,
                        "phone": this.formData.phoneNum,
                        "useType": 12
                    }).then(res =>{
                        if(this.successCheckCode(res)){
                            this.updatePhone({
                                "newPhone": this.formData.phoneNum,
                            }).then(res =>{
                                if(this.successCheckCode(res)){
                                    this.$message({
                                        type: 'success',
                                        message: '手机号码修改成功',
                                        duration: 2000
                                    })
                                    this.loginOut();
                                    this.dialogClose()
                                    this.getInfo()
                                }
                            })
                        }
                    })
                }else if(this.flag == 5){
                    if(this.emailType == 0){ //设置
                        this.updateEmail({
                            "accountId":JSON.parse($.cookie("userinfo")).accountId,
                            "email": this.formData.email,
                            "emailVerificationCode": this.formData.emailVerificationCode,
                            "useType":6
                        }).then(res =>{
                            if(this.successCheckCode(res)){
                                this.$message({
                                    type: 'success',
                                    message: '安全邮箱设置成功'
                                })
                                this.dialogClose()
                                this.getInfo()
                            }
                        })

                        /*this.enterpriseRegister({
                            enterpriseEmail: this.formData.email,
                            password: '12345678a',
                            emailVerificationCode: this.formData.emailVerificationCode,
                            useType: 1 //1.注册 2.修改密码 3.找回密码 4.设置或修改签署密码 5.ukey初始化 6.修改邮箱
                        }).then(res =>{
                            if(this.successCheckCode(res)){
                                this.setSafeEmail(this.formData.email).then(res =>{
                                    if(this.successCheckCode(res)){
                                        this.$message({
                                            type: 'success',
                                            message: '安全邮箱设置成功'
                                        })
                                        this.dialogClose()
                                        this.getInfo()
                                    }
                                })
                            }
                        })*/
                    }else{
                        this.updateEmail({
                            "accountId":JSON.parse($.cookie("userinfo")).accountId,
                            "email": this.formData.email,
                            "emailVerificationCode": this.formData.emailVerificationCode,
                            "useType":6
                        }).then(res =>{
                            if(this.successCheckCode(res)){
                                this.$message({
                                    type: 'success',
                                    message: '安全邮箱修改成功'
                                })
                                this.dialogClose()
                                this.getInfo()
                            }
                        })
                    }
                }else if(this.flag==7){ //修改企业名称
                    this.updateLinkOrCompanyName({
                        "companyName": this.formData.companyName.replace(/\s+/g,""),
                        // "linkName": "string",
                        "userId": JSON.parse($.cookie("userinfo")).userId
                    }).then(res=>{
                        if(this.successCheckCode(res)){
                            this.$message({
                                type: 'success',
                                message: '企业名称修改成功'
                            })
                            let userInfo = $.cookie("userinfo")&&JSON.parse($.cookie("userinfo"));
                            userInfo.enterPriseName = this.formData.companyName.replace(/\s+/g,"") ;
                            $.cookie("userinfo", JSON.stringify(userInfo), { path: "/", domain: this.$domain });
                            this.dialogClose()
                            this.getInfo()
                        }
                    })
                }else if(this.flag==8){ //修改联系人名称
                    this.updateLinkOrCompanyName({
                        "linkName": this.formData.linkName.replace(/\s+/g,""),
                        "userId": JSON.parse($.cookie("userinfo")).userId
                    }).then(res=>{
                        if(this.successCheckCode(res)){
                            this.$message({
                                type: 'success',
                                message: '联系人修改成功'
                            })
                            this.dialogClose()
                            this.getInfo()
                        }
                    })
                }else if(this.flag == 9){ //注销
                    this.checkSmsCode({
                        "msmCode": this.formData.verify,
                        "phone": this.phoneNum,
                        "useType": this.msmUseType
                    }).then(res =>{
                        if(this.successCheckCode(res)){
                            this.getOff().then(res => {
                                if(this.successCheckCode(res)){
                                    this.dialogType = 'signoff';
                                    this.isOff = true;
                                    setTimeout(() => {
                                        $.removeCookie('token', { path: '/', domain: this.$domain });
                                        $.removeCookie('sessionToken', { path: '/', domain: this.$domain });
                                        sessionStorage.removeItem('token');
                                        sessionStorage.removeItem('sessionToken');
                                        $.removeCookie('userinfo', { path: '/', domain: this.$domain });
                                        $.removeCookie('ukeylist', { path: '/', domain: this.$domain });
                                        $.removeCookie('anyinUserinfo', { path: '/', domain: 'i-yin.com.cn' });
                                        $.cookie('isSign', false);
                                        this.$router.push('/login');
                                    }, 1500);
                                }
                            })
                        }
                    })
                }
            },
            getPhoneCode(){
                if(this.countdown == 0 && this.isCode){
                    this.isCode = false
                    let data ={
                        phone: this.phoneNum,
                        useType: this.msmUseType //1.注册 2.修改密码 3.找回密码 4.设置或修改签署密码 5.ukey初始化  6.修改邮箱 7.修改手机号 8.修改地址 32.注销
                    }
                    if(this.setNewPhone){
                        data.phone = this.formData.phoneNum
                        data.useType = 12;
                    }

                    this.smsCode(data).then(res =>{
                        if(this.successCheckCode(res)){
                            this.hasMsn = true
                            this.countdown = 120
                            this.timer = setInterval(() => {
                                --this.countdown
                            }, 1000)
                            this.$message({
                                type: 'success',
                                message: '短信验证码发送成功'
                            })
                        }else{
                            this.isCode = true
                        }
                    }).fail(res =>{
                        this.isCode = true
                    })
                }
            },
            getCities(){
                this.getCity({
                    upOneLevelId: this.formData.proId,
                    currPage: 1,
                    pageSize: 100
                }).then(res =>{
                    if(this.successCheckCode(res)){
                        this.cityList = res.data.records
                    }
                })
            },
            realTime(data) {
                let url = data.url ;
                this.$refs.cropper.getCropData((data) => {
                    this.base64Img = data =='data:,'?url: data ;
                })
            },
            imgLoad(msg) {
                console.log(msg);
            },
            cutting(val){
                this.size = val*0.8+140
                var area = val*0.8+140
                $(".croperarea").css({
                    height: area,
                    width: area,
                })
                $(".croperarea img").css("transform",`translate(${-85+val*0.4}px,${-40+val*0.4}px)`)
                this.cutImage(area)
            },
            cutImage(area){
                var that = this
                var area = area || 140;
                var can = document.getElementById("myCan");
                var ctx = can.getContext("2d");
                // var img = document.getElementById("cutImg");
                var img = new Image()
                img.src = this.headImageUrl
                img.onload = function() {
                    var width = $('.hideImg').width();
                    var height = $('.hideImg').height();
                    can.width = area;
                    can.height = area;
                    var y = (220-area)/2*height/220; //计算实际图像的比例
                    var x = (310-area)/2*width/310;
                    ctx.drawImage(img,x,y,area*width/310,area*height/220,0,0,area,area)
                    var data = can.toDataURL();
                    that.cutImageUrl = data
                }
            },
            dialogClose(){
                this.dialogModel = false
                this.formData = {} ;
                this.setNewPhone = false ;
                this.$refs.formTab.resetFields();
                this.provinceList = []
                this.cityList = []
                this.visible = 'password'
                this.visible2 = 'password'
                this.visible3 = 'password'
                this.countdown = 0
                this.offStep = false
                if(this.dialogType == 'password'){
                    this.$refs.visible.className = 'password'
                    this.$refs.visible2.className = 'password'
                    this.$refs.visible3.className = 'password'
                }else if(this.dialogType == 'signpsd'){
                    this.$refs.visible.className = 'password'
                    this.$refs.visible2.className = 'password'
                }
            },
            reUpload(event){
                var that = this
                var file = event.target.files[0]
                var types = /\.(jpg|png|gif|jpeg)$/i;
                if(file){
                    if(!types.test(event.target.value)){
                        return this.$message.error('请上传png、jpg、gif类型的图片')
                    }
                    if(file.size > 1024*1024*5){
                        return this.$message.error('文件大小不超过5M')
                    }
                    var reader = new FileReader()
                    reader.onload = function(e) {
                        // that.headImageUrl = e.target.result
                        that.option.img = e.target.result
                        setTimeout(() => {
                            that.$refs.cropper.getCropData((data) => {
                                that.base64Img = data =='data:,'?that.base64Img: data;
                            })
                        }, 100);
                        $('#file').val('')
                        // that.realTime()
                        // that.cuttingSize = 0
                        // that.cutImage()
                    }
                    reader.readAsDataURL(file)
                }
            },
            getEmailCode(ref){
                if(this.countdown == 0 && this.isCode){
                    this.isCode = false
                    this.emailCode({
                        email: this.formData.email,
                        useType: this.useType //1.注册 2.修改密码 3.找回密码 6.修改邮箱
                    }).then(res =>{
                        if(this.successCheckCode(res)){
                            this.countdown = 120
                            this.timer = setInterval(() => {
                                --this.countdown
                            }, 1000)
                            this.$message({
                                type: 'success',
                                message: '邮箱验证码发送成功'
                            })
                        }else{
                            this.isCode = true
                        }
                    }).fail(res =>{
                        this.isCode = true
                    })
                }
            },
            uploadSave(){
                this.uploadHeadImg({
                    base64: this.base64Img
                }).then(res =>{
                    if(this.successCheckCode(res)){
                        this.getInfo()
                        this.uploadClose()
                    }
                })
            },
            forMat(val,start,end){
                return val.substr(0,start)+'*****'+val.substr(-end)
            },
            uploadClose(){
                var that = this;
                this.dialogUpload = false
                this.cuttingSize = 0
                setTimeout(() => {
                    this.option.img = that.userInfo.headImageUrl || that.headImageUrl
                    this.$refs.cropper.refresh()
                }, 100);
                // this.cutting(0)
            },
            uploadImg(){
                this.dialogUpload = true
                this.dialogTitle = '设置头像'
                this.headImageUrl = this.userInfo.headImageUrl || this.headImageUrl
                this.option.img = this.userInfo.headImageUrl || this.headImageUrl
                // setTimeout(() => {
                //     this.cutImage()
                // }, 100);
            },
            addAddress(){
                this.dialogModel = true
                this.dialogType = 'address'
                this.flag = 1
                this.dialogTitle = '设置收件地址'
                this.addressType = 0
                this.getProvince({
                    currPage: 1,
                    pageSize: 100
                }).then(res =>{
                    if(this.successCheckCode(res)){
                        this.provinceList = res.data.records
                    }
                })
            },
            accountOff(){
                this.dialogModel = true;
                this.dialogTitle = '账号注销提示';
                this.dialogType = 'signoff';
                this.flag = 9;
            },
            editAddress(){
                this.dialogModel = true
                this.dialogType = 'verify'
                this.flag = 1
                this.msmUseType = 8
                this.dialogTitle = '修改收件地址'
                this.addressType = 1
            },
            changePsd(){
                this.dialogModel = true
                this.dialogType = 'password'
                this.flag = 2
                this.msmUseType = 2
                this.dialogTitle = '修改登录密码'
            },
            setSignPsd(){
                this.dialogModel = true
                this.dialogType = 'verify'
                this.msmUseType = 4
                if(this.userInfo.isSignPassword){
                    this.dialogTitle = '修改签署密码'
                }else{
                    this.dialogTitle = '设置签署密码'
                }
                this.flag = 3
            },
            changeTel(){
                this.dialogModel = true
                this.dialogType = 'verify'
                this.flag = 4
                this.msmUseType = 11
                this.dialogTitle = '修改安全手机'
            },
            changeEmail(){
                this.dialogModel = true
                this.dialogType = 'verify'
                this.flag = 5
                this.emailType = 1
                this.useType = 6
                this.msmUseType = 6
                this.dialogTitle = '修改安全邮箱'
            },
            setEmail(){
                this.dialogModel = true
                this.dialogType = 'email'
                this.flag = 5
                this.emailType = 0
                this.useType = 6
                this.dialogTitle = '设置安全邮箱'
            },
            setCompanyName(){
                this.dialogModel = true
                this.dialogType = 'companyName'
                this.formData.companyName = this.userInfo.enterpriseName || ''
                this.flag = 7
                this.dialogTitle = '修改企业名称'
            },
            setLinkName(){
                this.dialogModel = true
                this.dialogType = 'linkName'
                this.formData.linkName = this.userInfo.linkManName || ''
                this.flag = 8
                this.dialogTitle = '修改联系人'
            },
            switchChange(){
                if(this.isSign){
                    $(".sign .el-switch__button").addClass("transform")
                }else{
                    $(".sign .el-switch__button").removeClass("transform")
                }
                if(this.isExpiry){
                    $(".expiry .el-switch__button").addClass("transform")
                }else{
                    $(".expiry .el-switch__button").removeClass("transform")
                }
            },
            msgChange(){
                this.shortMessageSet({
                    "isShortMessage":this.isSms?1:0
                }).then(res=>{
                    if(this.successCheckCode(res)){
                        this.$message({
                            type: 'success',
                            message: this.isSms?'短信通知开启成功':'短信通知关闭成功'
                        })
                    }
                })
            },
            emailChange(){
                this.shortMailSet({
                    "isMail":this.isEmail?1:0
                }).then(res=>{
                    if(this.successCheckCode(res)){
                        this.$message({
                            type: 'success',
                            message: this.isEmail?'邮箱通知开启成功':'邮箱通知关闭成功'
                        })
                    }
                })
            },
            fileSafetyChange(){
                this.fileSafetySet({
                    "compactDownloadValidate":this.isFileSafety?1:0
                }).then(res=>{
                    if(this.successCheckCode(res)){
                        this.$message({
                            type: 'success',
                            message: this.isFileSafety?'文件安全验证开启成功':'文件安全验证关闭成功'
                        })
                    }
                })
            },
            setFileSafety(){
                this.dialogModel = true
                this.dialogType = 'verify'
                this.flag = 6
                this.dialogTitle = '设置文件安全校验'
            },
            changeVisible(val,type){
                if(val == 'password'){
                    if(type == 1){
                        this.visible = 'text'
                        this.$refs.visible.className = 'text'
                    }else if(type == 2){
                        this.visible2 = 'text'
                        this.$refs.visible2.className = 'text'
                    }else if(type == 3){
                        this.visible3 = 'text'
                        this.$refs.visible3.className = 'text'
                    }
                }else if(val == 'text'){
                    if(type == 1){
                        this.visible = 'password'
                        this.$refs.visible.className = 'password'
                    }else if(type == 2){
                        this.visible2 = 'password'
                        this.$refs.visible2.className = 'password'
                    }else if(type == 3){
                        this.visible3 = 'text'
                        this.$refs.visible3.className = 'text'
                    }
                }
            },
            setSignAbortDay(){
                this.signAbortDay({
                    "signAbortDay":this.signDate
                }).then(res=>{
                    if(this.successCheckCode(res)){
                        this.$message({
                            type: 'success',
                            message: '合同签署截止日期提醒修改成功'
                        })
                    }
                })
            },
            setVaildAbortDay(){
                this.vaildAbortDay({
                    "validAbortDay":this.expiryDate
                }).then(res=>{
                    if(this.successCheckCode(res)){
                        this.$message({
                            type: 'success',
                            message: '合同有效期到期提醒修改成功'
                        })
                    }
                })
            },
            loginOut(){
                $.removeCookie("token", {
                    path: "/",
                    domain: this.$domain
                });
                $.removeCookie("sessionToken", {
                    path: "/",
                    domain: this.$domain
                });
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('sessionToken');
                $.removeCookie("userinfo", {
                    path: "/",
                    domain: this.$domain
                });
                $.removeCookie("ukeylist", {
                    path: "/",
                    domain: this.$domain
                });
                $.removeCookie("anyinUserinfo", {
                    path: "/",
                    domain: "i-yin.com.cn"
                });
                setTimeout(() => {
                    this.$router.push("/login");
                }, 2000);
            }
        }
    }
</script>
<style lang="scss">
    .accountmanager{
        .top-title{
            height:60px;
            line-height: 60px;
            border-bottom: 1px solid #E8ECEF;
            margin-bottom:25px;
            .titinfo{
                float:left;
                font-size: 18px;
                color: #333333;
            }
        }
        .mainBox{
            padding-bottom: 20px;
            .tab{
                padding-bottom: 30px;
                span{
                    float: left;
                    padding: 0 25px;
                    line-height: 22px;
                    font-size: 16px;
                    color: #333;
                    cursor: pointer;
                }
                span.active{
                    color: #02ADFF;
                }
            }
            .info{
                border: 1px solid #E8ECEF;
                box-shadow: 0 0 5px 0 rgba(192,204,218,0.40);
                border-radius: 10px;
                padding: 30px;
                padding-bottom: 0;
                position: relative;
                &::before,&::after{
                    content: "";
                    width: 0;
                    height: 0;
                    font-size: 0;
                    line-height: 0;
                    display: block;
                    position: absolute;
                    left: 38px;
                    border: 15px solid transparent;
                    border-style: dashed dashed solid;
                }
                &::before{
                    border-bottom-color: #fff;
                    top: -30px;
                    z-index: 1;
                }
                &::after{
                    border-bottom-color: #E8ECEF;
                    top: -31px;
                }
                .userimg{
                    padding-bottom: 27px;
                    border-bottom: 1px solid #E8ECEF;
                    position: relative;
                    img{
                        display: inline-block;
                    }
                    img,.wraper{
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        cursor: pointer;
                    }
                    .wraper{
                        background: url(../../../../static/image/editimg.png) no-repeat center;
                        position: absolute;
                        left: 0;
                        top: 0;
                        background-color: rgba(51, 51, 51, 0.6);
                        opacity: 0;
                        &:hover{
                            opacity: 1;
                        }
                    }
                    span{
                        color: #02ADFF;
                        margin-left: 15px;
                        cursor: pointer;
                    }
                }
                .item{
                    padding: 22px 0;
                    line-height: 36px;
                    border-bottom: 1px solid #E8ECEF;
                    .el-button{
                        float: right;
                        width: 100px;
                    }
                    &:last-child{
                        border-bottom: none;
                    }
                }
                .item-safe{
                    padding: 30px 0;
                    height: 110px;
                    border-bottom: 1px solid #E8ECEF;
                    position: relative;
                    &:last-child{
                        border-bottom: none;
                    }
                    &:first-child{
                        padding-top: 0;
                        height: 80px;
                    }
                    .el-button{
                        float: right;
                        width: 100px;
                        margin-top: 7px;
                    }
                    .safe-tip{
                        position: absolute;
                        left: 0;
                        bottom: 30px;
                        color: #9B9B9B;
                    }
                    .remand{
                        color: #333;
                        input{
                            width: 50px;
                            height: 24px;
                            padding-left: 12px;
                            line-height: 24px;
                            border-radius: 4px;
                            border: 1px solid #C0CCDA;
                            margin: 0 5px;
                        }
                    }
                    .el-switch{
                        float: right;
                        line-height: 27px;
                        height: 27px;
                        margin-top: 12px;
                    }
                    .el-switch__core{
                        border-radius: 15px;
                    }
                    .el-switch__core, .el-switch__label{
                        height: 27px;
                    }
                    .el-switch__core .el-switch__button{
                        top: -2px;
                        left: -2px;
                        height: 25px;
                        width: 25px;
                    }
                    .el-switch.is-checked .el-switch__core .el-switch__button{
                        transform: translate(29px,2px) !important;
                    }
                }
                .setcolor{
                    color: #ef8000;
                }
                span.label{
                    display: inline-block;
                    width: 74px;
                    margin-right: 20px;
                }
                .el-button:hover,.el-button:focus{
                    /*background: #0073BD;*/
                    /*border-color: #0073BD;*/
                }
            }
            .info1::after,.info1:before{
                left: 154px;
            }
            .info2::after,.info2:before{
                left: 270px;
            }
        }
        .dialog{
            .el-form{
                padding-right: 60px;
                .el-form-item__label{
                    padding-right: 22px;
                }
                .el-select{
                    width: 100%;
                }
            }
        }
        .headimglog{
            .dialog-body{
                padding: 30px;
                padding-bottom: 40px;
                .fl, .fr{
                    position: relative;
                    border-radius: 10px;
                    overflow: hidden;
                }
                .fr{
                    width: 170px;
                    height: 220px;
                    background: #F4F6F8;
                    text-align: center;
                    span{
                        line-height: 20px;
                        display: inline-block;
                    }
                    span.tip{
                        margin-top: 20px;
                        margin-bottom: 10px;
                    }
                    span.size{
                        color: #999;
                        font-size: 12px;
                        margin-top: 10px;
                    }
                }
                #myCan{
                    display: none;
                }
                .hideImg{
                    display: none;
                }
                .area{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    background: #fff;
                    opacity: 0.1;
                }
                .vue-cropper{
                    width: 310px;
                    height: 220px;
                }
                .croperarea{
                    position: absolute;
                    top: 50%;
                    width: 140px;
                    height: 140px;
                    overflow: hidden;
                    border-radius: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    .headimg{
                        transform: translate(-85px,-40px)
                    }
                }
                .el-slider{
                    position: absolute;
                    bottom: 0;
                    left: 65px;
                    width: 330px;
                    .el-input-number{
                        position: static;
                        .el-input{
                            display: none;
                        }
                    }
                    .el-input-number__decrease, .el-input-number__increase{
                        position: absolute;
                        width: 16px;
                        height: 16px;
                        border: none;
                        top: 10px;
                        i{
                            display: none;
                        }
                    }
                    .el-input-number__decrease{
                        background: url(../../../../static/image/decrease.png) no-repeat;
                        left: -31px;
                        &:hover{
                            background: url(../../../../static/image/decrease_hover.png) no-repeat;
                        }
                    }
                    .el-input-number__increase{
                        background: url(../../../../static/image/increase.png) no-repeat;
                        right: 130px;
                        &:hover{
                            background: url(../../../../static/image/increase_hover.png) no-repeat;
                        }
                    }
                }
            }
            .headimg, .mask{
                width: 310px;
                height: 220px;
            }
            .mask{
                background: rgba(51, 51, 51, 0.6);
                position: absolute;
                left: 0;
                top: 0;
            }
            .cutting, .preview{
                width: 100px;
                height: 100px;
                border-radius: 50%;
                margin: 0 auto;
                background-size: 100%;
            }
            p{
                font-size: 12px;
                color: #999;
                position: absolute;
                left: 30px;
                bottom: 12px;
            }
            .el-dialog__footer{
                padding: 30px;
                overflow: hidden;
                border-top: 1px solid #E8ECEF;
                position: relative;
                button{
                    width: 80px;
                    padding: 10px 0;
                    text-align: center;
                    cursor: pointer;
                    &.el-button--default{
                        color: #626262;
                    }
                    span{
                        cursor: pointer;
                    }
                }
                .file{
                    position: absolute;
                    width: 88px;
                    height: 36px;
                    opacity: 0;
                    overflow: hidden;
                    left: 30px;
                    top: 30px;
                    cursor: pointer;
                }
            }
        }
        .infolog{
            .el-dialog__body{
                min-height: 128px;
                .dialog-body{
                    padding: 30px;
                    .el-form-item{
                        margin-bottom: 20px;
                        &:last-child{
                            margin-bottom: 0;
                        }
                    }
                    .code{
                        width: 234px;
                    }
                    .codebtn{
                        float: right;
                        width: 100px;
                        border-color: #02ADFF;
                        span{
                            color: #02ADFF;
                        }
                        &:hover,&:focus{
                            background: #0073BD;
                            border-color: #0073BD;
                            span{
                                color: #fff;
                            }
                        }
                        &.active{
                            background: #02ADFF;
                            border-color: #02ADFF;
                        }
                    }
                    .password{
                        position: absolute;
                        right: 10px;
                        top: 12px;
                        width: 16px;
                        height: 16px;
                        background: url(../../../../static/image/unvisible.png) no-repeat;
                        cursor: pointer;
                        &:hover{
                            background: url(../../../../static/image/unvisible_hover.png) no-repeat;
                        }
                    }
                    .text{
                        position: absolute;
                        right: 10px;
                        top: 12px;
                        width: 16px;
                        height: 16px;
                        background: url(../../../../static/image/visible.png) no-repeat;
                        cursor: pointer;
                        &:hover{
                            background: url(../../../../static/image/visible_hover.png) no-repeat;
                        }
                    }
                    .signoff{
                        h5{
                            font-size: 16px;
                            margin: 0;
                            margin-bottom: 15px;
                        }
                        p{
                            line-height: 26px;
                        }
                    }
                }
                .verify{
                    p{
                        font-size: 16px;
                        color: #333333;
                        font-weight: bold;
                        padding-left: 30px;
                        margin-bottom: 24px;
                    }
                }
                .el-form-item.is-required .el-form-item__label:before{
                    display: none;
                }
            }
            .el-dialog__footer{
                padding-bottom: 30px;
                .el-button{
                    width: 86px;
                }
            }
        }
    }
</style>
