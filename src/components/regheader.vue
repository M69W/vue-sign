<template>
    <div class="regheader">
        <!-- <div class="active-header" v-if="isNew && path == 'login'">
            <div class="wrap">
                <p>安印科技推出<span style="font-size: 20px;color: #02ADFF;"> 电子合同平台 </span>全新体验版本，提供更多新功能、提升了整个系统稳定性，让签约更快捷更安全。</p>
                <span class="arrow"></span>
                <span class="new-version" @click="goToNew">前往新版本</span>
            </div>
        </div> -->
        <div class="header">
            <div class="wrap">
                <div class="logo" v-if="path == 'login' || path == 'register'"></div>
                <img v-if="path == 'login' || path == 'register'" class="logo-desc" src="../../static/image/logo-desc.svg" alt="">
                <div class="ukeylogo" v-if="path == 'ukeylogin'"></div>
                <div class="ukeylogo-desc" v-if="path == 'ukeylogin'">电子印章续期</div>
                <div class="head-right">
                    <a v-if="path == 'ukeylogin'" class="kf" target="_blank" href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4009196663&cref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa&ref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa%2Fstyle%26id%3Dwpa_setting_a01&pt=undefined&f=1&ty=1&ap=&as=&aty=0&a=">在线咨询</a>
                    <span v-if="path == 'ukeylogin'" class="kf-tel">4009196663</span>
                    <span  v-if="path == 'register'" style="margin-right:30px;">客户热线：<span style="color: #02ADFF;">400-919-6663</span></span>
                    <span class="back" v-if="path == 'register' || path == 'forgetpsd' || path == 'companyinit' || path == 'personinit'">已有账号, <a href="javascript:;" @click="toLogin">返回登录</a></span>
                    <!-- <span class="back backold" @click="backOld" v-if="isOld">返回旧版本</span> -->
                    <span class="back" @click="toIyin" v-if="path == 'login' || path == 'ukeylogin'">返回官网</span>
                    <!-- <a href="javascript:;" @click="back" class="fr" v-if="path == 'agreement' || path == 'privacy'">返回</a> -->
                </div>

            </div>
        </div>
    </div>
</template>
<script>
export default {
    mixins: [],
    components: {},
    data() {
        return {
            path: '',
            isNew: false,
            isOld: false
        };
    },
    computed: {},
    watch: {},
    mounted() {
        this.$nextTick(() => {
            this.path =  this.$route.path.match(/([^/]+)$/)[1];
            var hostname = window.location.hostname;
            if(hostname == 'sign.i-yin.com.cn'){
                this.isNew = true;
            }else if(hostname == 'pre-sign.i-yin.com.cn'){
                this.isOld = true;
            }
        })
    },
    methods: {
        toIyin(){
            window.open('https://www.i-yin.com.cn/')
        },
        toLogin(){
            this.$router.push('login')
        },
        back(){
            this.$router.go(-1)
        },
        goToNew(){
            window.open('https://pre-sign.i-yin.com.cn', '_self');
        },
        backOld(){
            window.open('https://sign.i-yin.com.cn', '_self');
        }
    }
};
</script>
<style lang="scss">
.regheader {
    a{
        color: #02ADFF;
    }
    .active-header{
        background: url(../../static/image/hd-bg.png) no-repeat #E1ECFA;
        width: 100%;
        height: 50px;
        .wrap{
            width: 1200px;
            margin: 0 auto;
            text-align: center;
            position: relative;
            line-height: 50px;
            height: 50px;
            p{
                font-size: 16px;
                color: #001348;
                height: 50px;
            }
            .arrow{
                width: 41px;
                height: 29px;
                background: url(../../static/image/arr-left.png) no-repeat;
                position: absolute;
                top: 10px;
                right: 149px;
            }
            .new-version{
                width: 98px;
                height: 34px;
                line-height: 34px;
                color: #fff;
                position: absolute;
                right: 24px;
                top: 7px;
                background-image: linear-gradient(54deg, #F31A47 0%, #D01A3E 100%);
                border-radius: 2px;
                cursor: pointer;
            }
        }
    }
    .header {
        background: #fff;
        height: 60px;
        .wrap{
            width: 1200px;
            height: 60px;
            margin: 0 auto;
            .logo{
                float: left;
                width: 280px;
                height: 50px;
                background: url("../../static/image/logo.png") no-repeat;
                width: 150px;
                margin-top: 10px;
            }
            .logo-desc {
                float: left;
                height: 20px;
                margin-top: 23px;
            }

            .ukeylogo{
                float: left;
                width: 130px;
                height: 42px;
                background: url("../../static/image/renew_logo.png") no-repeat;
                margin-top: 10px;
            }
            .ukeylogo-desc {
                display: inline-block;
                font-size: 20px;
                margin-top: 18px;
                font-weight: 700;
            }
            .head-right{
                float: right;
                height: 60px;
                padding: 20px 0;
            }
            .back{
                cursor: pointer;
                // vertical-align: middle;
            }
            .kf{
                padding-left: 22px;
                background: url(../../static/image/zaixianzixun.svg) no-repeat left center;
                color: #333;
                margin-right: 18px;
                vertical-align: middle;
            }
            .kf-tel{
                padding-left: 22px;
                background: url(../../static/image/dianhua.svg) no-repeat left center;
                color: #333;
                margin-right: 30px;
                vertical-align: middle;
            }
            .backold{
                position: relative;
                display: inline-block;
                padding-right: 35px;
                &::after{
                    content: '';
                    width: 1px;
                    height: 20px;
                    position: absolute;
                    right: 16px;
                    top: 0;
                    background: #ccc;
                }
            }
        }
        .fr{
            padding: 25px 0;
            line-height: 20px;
        }
    }
}
</style>
