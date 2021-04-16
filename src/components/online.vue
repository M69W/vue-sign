<template>
    <div class="online-box">
        <div class="online" @click="toOnline">
            <i></i>
            <span>在线客服</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "online",
        props:{home:{default:false}},
        methods:{
            toOnline(){
                window.open("http://crm2.qq.com/page/portalpage/wpa.php?uin=4009196663&cref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa&ref=https%3A%2F%2Fid.b.qq.com%2Fcrm%2Findex.php%3Frr%3Dwpa%2Fstyle%26id%3Dwpa_setting_a01&pt=undefined&f=1&ty=1&ap=&as=&aty=0&a=")
            }
        }
    }
</script>

<style scoped lang="scss">
    .online-box{
        position: fixed;
        bottom: 154px;
        right: 10px;
        border-radius: 6px;
        z-index: 2;
        &.home{
            right: 25px;
            z-index: 999;
        }
        .online{
            cursor: pointer;
            color: #fff;
            background: #02ADFF;
            border-radius: 6px;
            font-size: 14px;
            padding: 20px 10px 10px;
            width: 50px;
            height: 148px;
            text-align: center;
            span{
                display: inline-block;
                width: 20px;
            }
            i{
                display: inline-block;
                width: 28px;
                height: 28px;
                background-image: url("../../static/image/qq.svg");
                background-size: 100%;
                margin-bottom: 8px;
            }
            &:hover{
                background-color: #0073bd;
            }
        }
    }
</style>
