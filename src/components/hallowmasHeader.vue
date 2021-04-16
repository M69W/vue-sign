<template>
    <div class="hallowmas-header" :class="{ isNew: isNew }">
        <div class="active-header" v-if="isNew">
            <div class="wrap">
                <p>
                    安印科技推出<span style="font-size: 20px;color: #02ADFF;">
                        电子合同平台 </span
                    >全新体验版本，提供更多新功能、提升了整个系统稳定性，让签约更快捷更安全。
                </p>
                <span class="arrow"></span>
                <span class="new-version" @click="goToNew">前往新版本</span>
            </div>
        </div>
        <div class="inner">
            <div class="logo-wrap">
                <img
                    class="logo"
                    src="../../static/image/hallowmas/hallowmas-logo.png"
                    alt="logo"
                />
                <img
                    src="../../static/image/hallowmas/hallowmas-tip.png"
                    alt="可以在网上盖的公章"
                />
            </div>
            <div class="go-website">
                <a href="https://www.i-yin.com.cn/" target="_self">
                    <img
                        src="../../static/image/hallowmas/hallowmas-back.png"
                        alt="返回官网"
                    />
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {
            isNew: false,
            isOld: false
        };
    },
    created() {},
    mounted() {
        var hostname = window.location.hostname;
        if (hostname == "sign.i-yin.com.cn") {
            this.isNew = true;
        } else if (hostname == "http://pre-sign.i-yin.com.cn") {
            this.isOld = true;
        }
    },
    methods: {
        goToNew() {
            window.open("https://pre-sign.i-yin.com.cn", "_self");
        }
    }
};
</script>
<style lang="scss" scoped>
.hallowmas-header {
    height: 70px;
    background: url("../../static/image/hallowmas/hallowmas-banner-back.png")
        no-repeat;
    background-size: 100% 100%;
    &.isNew {
        height: auto;
        background: url("../../static/image/hallowmas/hallowmas-banner-back.png")
            left 50px no-repeat;
        background-size: 100% 70px;
    }
    .inner {
        width: 1200px;
        height: 70px;
        position: relative;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .logo-wrap {
            display: flex;
            align-items: center;
            .logo {
                margin-right: 30px;
                margin-left: 80px;
            }
        }
    }
    .active-header {
        background: url(../../static/image/hd-bg.png) no-repeat #e1ecfa;
        width: 100%;
        height: 50px;
        .wrap {
            width: 1200px;
            margin: 0 auto;
            text-align: center;
            position: relative;
            line-height: 50px;
            height: 50px;
            p {
                font-size: 16px;
                color: #001348;
                height: 50px;
            }
            .arrow {
                width: 41px;
                height: 29px;
                background: url(../../static/image/arr-left.png) no-repeat;
                position: absolute;
                top: 10px;
                right: 149px;
            }
            .new-version {
                width: 98px;
                height: 34px;
                line-height: 34px;
                color: #fff;
                position: absolute;
                right: 24px;
                top: 7px;
                background-image: linear-gradient(
                    54deg,
                    #f31a47 0%,
                    #d01a3e 100%
                );
                border-radius: 2px;
                cursor: pointer;
            }
        }
    }
}
</style>