<template>
    <div>
    </div>
</template>
<script>
    import base from "../mixin/base";
    export default{
        mixins: [base],
        components: {},
        data() {
            return {
                paymentNo:'',
                paymentInfo: {}
            }
        },
        computed: {},
        watch: {},
        mounted() {
            this.paymentNo = this.$route.query.out_trade_no;
            console.log(this.paymentNo)
            this.getAliPayResultData();
        },
        methods: {
            //获取支付宝支付结果，并跳转结果页面
            getAliPayResultData(){
                this.getAliPayResult(this.paymentNo).then(res => {
                    if(this.successCheckCode(res)){
                        this.paymentInfo = res.data ? res.data : {};
                        //tradeType:01,ukey订单; 02,套餐订单; 03,续期订单;
                        if(this.paymentInfo.tradeType =='01' && this.paymentInfo.productDesc == 'UKEY签名申请'){
                            this.$router.push({path:"/orderpayresult", query:{result: this.paymentInfo.tradeState, payNo: this.paymentInfo.paymentNo, orderNo: this.paymentInfo.tradeNo}});
                        }else if(this.paymentInfo.tradeType =='01' && this.paymentInfo.productDesc == 'UKEY印章申请'){
                            this.$router.push({path:"/sealorderpayresult", query:{result: this.paymentInfo.tradeState, payNo: this.paymentInfo.paymentNo, orderNo: this.paymentInfo.tradeNo}});
                        }else if(this.paymentInfo.tradeType =='02'){
                            this.$router.push({path:"/packpayresult", query:{result: this.paymentInfo.tradeState, payNo: this.paymentInfo.paymentNo, orderNo: this.paymentInfo.tradeNo}});
                        }else if(this.paymentInfo.tradeType =='03'){
                            this.$router.push({path:"/ukeyrenewupdate", query:{orderNo: this.paymentInfo.tradeNo}});
                        }
                    }
                });
            },
        }
    }
</script>
<style lang="scss">

</style>
