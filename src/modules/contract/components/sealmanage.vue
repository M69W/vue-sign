<template>
    <div class="sealmanage">
        <sealnav :totalSealNumBer="totalSealNumBer" :totalSignNumBer="totalSignNumBer" :totalUkeyOrderNumBer="totalUkeyOrderNumBer"></sealnav>
        <div class="main-content">
            <router-view @upDateNum="upDateNum"></router-view>
        </div>
        <online></online>
    </div>
</template>
<script>
    import sealnav from "./sealnav";
    import base from "../mixin/base";
    import online from "../../../components/online";

    export default{
        mixins: [base],
        components: {sealnav,online},
        data() {
            return {
                pagedefault: "",
                totalSealNumBer:0,
                totalSignNumBer:0,
                totalUkeyOrderNumBer:0,
            }
        },
        computed: {},
        watch: {
        },
        mounted() {
        },
        methods: {
            showbox(msg){
                alert(msg)
            },
            upDateNum(data){
                for(let key in data){
                    if(!!key){
                        this[key] = data[key] ;
                        // console.log(this[key],data[key]);
                    }
                }
            }
        }
    }
</script>
<style lang="scss">
.sealmanage{
    position:relative;
    .left-nav{
        width: 206px;
        float: left;
        background: #E8ECEF;
        position: fixed;
        height: calc(100% - 160px);
        overflow: auto;
    }
    .main-content{
        padding: 0 30px 30px 30px;
        margin-left:206px;
        min-height:100%;
        background-color: #ffffff;
    }
}
</style>
