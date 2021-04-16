<template>
    <div class="ukeyactivate">
        <div class="orderpage-topbar clearfix">
            <div class="orderpage-tit">Ukey激活</div>
            <div class="orderpage-progress" style="font-size: 14px;color: #999999;"><img src="../../../../static/image/icon-txcloud.png" style="margin-right:8px;margin-top: -3px;">由腾讯云提供技术服务支持</div>
        </div>

        <div class="code-wrap">
            <div style="font-size: 16px;color: #333333;margin-bottom:10px;">扫码激活</div>
            <div style="font-size: 14px;color: #626262;">请用微信扫描二维码进行UKey激活</div>
            <div class="activate-code">
                <div id="qrcode" style="width: 160px;height: 160px;margin: 0 auto;"></div>
            </div>
        </div>
        <div class="orderpage-footbtn" style="text-align: center;">
            <el-button type="primary" v-if="sealBaseType == '01'" @click="$router.push('/myseal')">已扫码完成激活</el-button>
            <el-button type="primary" v-else @click="$router.push('/mysign')">已扫码完成激活</el-button>
        </div>

        <div class="orderpage-cont" style="padding: 10px 30px 30px 30px;">
            <div class="orderpage-item-tit" style="padding:10px 0 10px 0;">
                <span v-if="sealBaseType == '01'">UKey印章信息</span>
                <span v-else>UKey签名信息</span>
            </div>
            <el-table :data="activeCodeData.ukeySealList" style="width: 100%;">
                <el-table-column :resizable="false" prop="pictureName" label="印章名称"></el-table-column>
                <el-table-column :resizable="false" prop="esealTypeDescribe" label="印章类型"></el-table-column>
                <el-table-column :resizable="false" prop="pictureCode" label="印章编码"></el-table-column>
                <el-table-column :resizable="false" label="有效期">
                    <template slot-scope="scope">
                        <div v-if="scope.row.bizValidStart">{{scope.row.bizValidStart}} 至 {{scope.row.bizValidEnd}}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>
<script>
    import base from "../mixin/base";
    export default{
        mixins: [base],
        components: {},
        data() {
            return {
                orderNo: "",
                userType: JSON.parse($.cookie("userinfo")).userType,
                activeCodeData: {},
                sealBaseType: '01',
            }
        },
        computed: {},
        watch: {},
        mounted() {
            this.orderNo = this.$route.query.orderNo;
            this.sealBaseType = this.$route.query.sealType;
            this.getActivateCodeData();
        },
        methods: {
            activeComplete() {
                this.$router.push('/myseal');
            },
            getActivateCodeData() {
                var data = {
                    "orderNo": this.orderNo,
                    "userType": this.userType
                }
                $("#qrcode").empty();
                this.getActivateCode(data).then(res => {
                    if(this.successCheckCode(res)){
                        this.activeCodeData = res.data;
                        this.qrcode(this.activeCodeData.twoDimensionCode);
                    }
                });
            },
            qrcode(data){
                var qrcode = new QRCode(document.getElementById("qrcode"), {
                    width: 160,
                    height: 160,
                });
                qrcode.makeCode(data)
            },
        }
    }
</script>

<style lang="scss">
    .orderpage-topbar{
        height:60px;
        line-height: 60px;
        border-bottom:1px solid #E8ECEF;
        padding:0 30px;
        .orderpage-tit{
            float:left;
            font-size: 18px;
            color: #333333;
        }
        .orderpage-progress{
            float:right;
        }
    }
    .ukeyactivate{
        .renewInfoTable{
            border:1px solid #E8ECEF;
            line-height:50px;
            margin-top:10px;
            font-size: 14px;
            color: #626262;
            .td-tit{
                text-align: center;
                width: 25%;
            }
            .td-cont{
                text-align: left;
                width: 75%;
                div{
                    margin-left:80px;
                    color: #333333;
                }
            }
        }
        .code-wrap{
            margin: 30px auto 0;
            background: #FAFAFA;
            border-radius: 4px;
            text-align:center;
            width:620px;
            height:290px;
            padding: 25px;
            .activate-code{
                text-align: center;
                padding: 30px;
                img{
                    height:160px;
                    width:160px;
                }
            }
        }

    }
</style>

