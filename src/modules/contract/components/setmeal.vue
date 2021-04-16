<template>
    <div class="setmeal">
        <heads></heads>
        <div class="mainbox-box">
            <div class="mainbox">
                <div class="top-title clearfix">
                    <div class="titinfo fl">{{pageTitle}}</div>
                    <div class="fr">如需更多套餐和优惠，请拨打
                        <span style="font-size:18px;color:#151515;">400-919-6663</span> 为您专属定制
                    </div>
                </div>
                <ul class="pakelist">
                    <li v-for="(item, key) in list" :key="key">
                        <div class="title">{{item.name}}</div>
                        <div class="mainlist">
                            <div class="top">
                                <div>
                                    <span>{{item.price}}</span> 元
                                </div>
                                <el-button @click="toBuy(item.id)">立即购买</el-button>
                            </div>
                            <div class="info">
                                <div class="item">
                                    <span class="label">签署份数：</span>
                                    {{item.signSum}}份
                                </div>
                                <div class="item">
                                    <span class="label">有 效 期 ：</span>
                                    {{format(item.userfulLife)}}年
                                </div>
                                <div class="item money">
                                    <span class="label">一份费用：</span>
                                    <strong>{{item.onceSpare}}</strong> 元
                                </div>
                                <div class="item">
                                    <span class="label">套餐说明：</span>
                                    <br>
                                    <p>{{item.description}}</p>
                                </div>
                            </div>
                        </div>
                        <!-- 最划算右上角图标 -->
                        <div v-if="item.id == '04' || item.id == '07'" class="fork"></div>
                    </li>
                </ul>
                <div class="back">
                    <el-button @click="$router.go(-1)"><span>返回</span></el-button>
                </div>
            </div>
        </div>
        <foot></foot>
    </div>
</template>
<script>
import heads from "./heads";
import foot from "./foot";
import service from "../../../assets/mixin/service";
export default {
    mixins: [service],
    components: { heads, foot },
    props: {},
    data() {
        return {
            pageTitle: "",
            list: []
        };
    },
    computed: {},
    watch: {},
    mounted() {
        this.$nextTick(() => {
            this.pageTitle = this.$route.meta.title;
            this.getList();
        });
    },
    activated() {},
    beforeRouteUpdate(to, from, next) {},
    methods: {
        toBuy(id) {
            this.checkPermission(
                // 权限校验
                this.$perMap.userCenter.costMgt.subPackage.url,
                this.$perMap.userCenter.costMgt.subPackage.method
            ).then(res => {
                if (!this.successCheckCode(res)) {
                    return;
                }
                this.$router.push("packpay?id=" + id);
            });
        },
        getList() {
            this.getPackageList(1, 10).then(res => {
                if (this.successCheckCode(res)) {
                    this.list = res.data.records;
                    console.log(this.list);
                    
                }
            });
        },
        format(val) {
            return Math.floor(val / 365);
        }
    }
};
</script>
<style lang="scss">
.setmeal {
    height: 100%;
    background-color: #F4F6F8;
    .mainbox-box{
        overflow: auto;
        height: calc(100% - 120px);
    }
    .mainbox {
        width: 1200px;
        padding: 24px 0;
        margin: 0 auto;
        min-height: calc(100% - 120px);
        .top-title {
            line-height: 25px;
            padding: 16px 0;
            border-bottom: 1px solid #e8ecef;
            .titinfo {
                font-size: 18px;
                color: #333333;
            }
            .fr {
                color: #626262;
            }
        }
        .pakelist {
            padding-top: 30px;
            display: flex;
            justify-content: space-between;
            li {
                /*float: left;*/
                /*margin-right: 20px;*/
                width: 285px;
                background: #fff;
                border-radius: 4px;
                // overflow: hidden;
                position: relative;
                &:nth-child(1) {
                    .title {
                        background: #02adff;
                    }
                }
                &:nth-child(2) {
                    .title {
                        background: #0088b6;
                    }
                }
                &:nth-child(3) {
                    .title {
                        background: #008877;
                    }
                }
                &:nth-child(4) {
                    .title {
                        background: #66b355;
                    }
                    margin-right: 0;
                }
                .title {
                    text-align: center;
                    color: #fff;
                    font-size: 16px;
                    height: 60px;
                    line-height: 60px;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;;
                }
                .mainlist {
                    height: 540px;
                    .top {
                        text-align: center;
                        height: 230px;
                        &::after {
                            content: "";
                            width: 225px;
                            height: 1px;
                            display: block;
                            margin: 0 auto;
                            margin-top: 50px;
                            background: #e8ecef;
                        }
                        & > div {
                            color: #989a9c;
                            padding-top: 55px;
                            padding-bottom: 32px;
                            span {
                                font-size: 40px;
                                color: #333333;
                                /*&::before{
                                    content: '￥';
                                    display: inline-block;
                                    font-size: 16px;
                                    color: #999;
                                    margin-right: 10px;
                                    position: relative;
                                    top: -26px;
                                }*/
                            }
                        }
                        .el-button {
                            border: 1px solid #02adff;
                            box-shadow: 0 0 6px 0 #c0ccda;
                            border-radius: 20px;
                            width: 140px;
                            height: 40px;
                            span {
                                color: #02adff;
                            }
                            &:hover,
                            &:focus {
                                background: none;
                                border-color: none;
                            }
                        }
                    }
                    .info {
                        padding: 30px;
                        .item {
                            line-height: 20px;
                            margin-bottom: 20px;
                            color: #626262;
                            .label {
                                width: 70px;
                                display: inline-block;
                            }
                            p {
                                line-height: 26px;
                                color: #989a9c;
                            }
                        }
                        .money{
                            color: #fb6b0b;
                        }
                    }
                }
                .fork{
                    width: 100px;
                    height: 100px;
                    background: url('../../../../static/image/cheapest.svg') no-repeat;
                    position: absolute;
                    top: -4px;
                    right: -45px;
                }
                
            }
        }
        .back{
            text-align: right;
            padding-top: 40px;
            span{
                display: inline-block;
                width: 70px;
            }
        }
    }
}
</style>
