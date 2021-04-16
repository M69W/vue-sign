<template>
    <div class="footer clearfix">
        <div class="footer-nav clearfix">
            <a class="footer-nav-item" href="http://www.i-yin.com.cn" target="_blank">返回官网</a>
            <span class="item-line">|</span>
            <a class="footer-nav-item" @click="getDown" target="_blank">下载驱动</a>
            <span class="item-line">|</span>
            <a class="footer-nav-item" href="https://www.i-yin.com.cn/helps.html" target="_blank">帮助中心</a>
            <span class="item-line">|</span>
            <a class="footer-nav-item" href="https://www.i-yin.com.cn/index.php?c=article&a=type&tid=9" target="_blank">关于我们</a>
            <span class="item-line">|</span>
            <a class="footer-nav-item" href="https://www.i-yin.com.cn/index.php?c=article&a=type&tid=50" target="_blank">联系我们</a>
            <span class="item-line">|</span>
            <span class="copyright">Copyright 2014-2021 深圳市安印科技有限公司 粤ICP备16033566号-1 </span>
        </div>
    </div>
</template>
<script>
    export default{
        mixins: [],
        components: {},
        data() {
            return {}
        },
        computed: {},
        watch: {},
        mounted() {
        },
        methods: {
            getDown(){
                this.$store.commit('downVisibleChange', true);
            }
        }
    }
</script>
<style lang="scss">
.footer{
    height:50px;
    background-color: #333333;
    text-align:center;
    .footer-nav{
        width: 1200px;
        margin: 0 auto;
        .footer-nav-item{
            height:50px;
            line-height:50px;
            color: #999999;
            font-size:12px;
        }
        .item-line{
            padding: 0 20px;
            color: #999999;
            height:50px;
            line-height:50px;
        }
        .copyright{
            color: #999999;
            font-size:12px;
        }
    }
}
</style>
