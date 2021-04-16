<template>
    <div class="invitation">
        <div class="title">邀请好友</div>
        <div class="invite-info">
            <ul>
                <li>
                    <i class="num">{{couponInfo.inviteUserCount || 0}}</i>
                    人
                    <div>
                        累计邀请好友
                    </div>
                </li>
                <li>
                    <i class="num">{{couponInfo.enableCouponCount || 0}}</i>
                    张
                    <div>
                        可用优惠券
                    </div>
                </li>
                <li>
                    <i class="num">{{couponInfo.totalCouponCount || 0}}</i>
                    张
                    <div>
                        已获优惠券
                    </div>
                </li>
            </ul>
        </div>
        <div class="table">
            <el-table
                :data="tableData"
                style="width: 100%"
                stripe
                tooltip-effect="light"
                v-loading="loadingTabel"
            >
                <el-table-column :resizable="false" type="index" label="序号" width="80" show-overflow-tooltip></el-table-column>
                <el-table-column :resizable="false" prop="invitedUserName" label="受邀好友" show-overflow-tooltip></el-table-column>
                <el-table-column :resizable="false" prop="invitedUserPhone" label="手机号码" width="150"></el-table-column>
                <el-table-column :resizable="false" prop="InvitedUserRegisterTime" label="注册时间" width="180" show-overflow-tooltip></el-table-column>
                <el-table-column :resizable="false" prop="couponName" label="奖励" show-overflow-tooltip></el-table-column>
                <el-table-column :resizable="false" prop="couponObtainStatus" label="获得卡券" width="100">
                    <template scope="scope">
                        <span style="color:#999;">
                            {{scope.row.couponObtainStatus == 0 ? '未发放' : '已发放'}}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" v-if="total > pageSize">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentpage"
                    :page-size="pageSize"
                    :total="total"
                    layout="total, prev, pager, next"
                ></el-pagination>
            </div>
        </div>
        <div class="invite-link">
            <div class="title">邀请方式</div>
            <div class="link-box">
                <p>复制PC端邀请链接地址，发送给好友</p>
                <div class="link">
                    {{href}}
                </div>
                <span class="copy" :data-clipboard-text="href">复制链接</span>
            </div>
        </div>
        <div class="qrcode">
            <p>开启微信扫一扫，邀请好友获奖励</p>
            <div id="qrcode"></div>
        </div>
        <div class="rules">
            活动规则：
            <p>1、被邀好友须通过邀请人的邀请链接注册安印账户；</p>
            <p>2、被邀好友需在30天内完成注册；</p>
            <p>3、本次活动所有解释权归深圳安印科技有限公司所有；</p>
            <p>4、如对活动有任何疑问可以，联系安印客服： 400电话：400-919-6663  、QQ客服：4009196663</p>
        </div>
    </div>
</template>
<script>
import base from "../../mixin/base";
export default {
    mixins: [base],
    components: {},
    data() {
        return {
            tableData: [{}],
            couponInfo: {},
            href: '',
            userInfo: JSON.parse($.cookie('userinfo'))
        };
    },
    mounted() {
        this.getListData();
        this.getInivteInfo();
        var clipboard = new ClipboardJS(".copy");
        let host = window.location.host == 'sign.i-yin.com.cn' ? 'h5.i-yin.com.cn' : window.location.host;
        this.href = `${window.location.protocol}//${host}/#/inviteLand?userId=${this.userInfo.userId}`;
        this.copyLink(clipboard);
        this.qrcode(this.href);
    },
    methods: {
        getListData() {
            this.loadingTabel = true;
            this.getInviteList({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                })
                .then(res => {
                    if (this.successCheckCode(res)) {
                        this.tableData = res.data.records;
                        this.total = res.data.total;
                        this.currentpage = res.data.current;
                    }
                    setTimeout(() => {
                        this.loadingTabel = false;
                    }, 200);
                })
                .fail(res => {
                    this.loadingTabel = false;
                });
        },
        getInivteInfo() {
            this.getInviteCoupon({

            }).then(res => {
                if(this.successCheckCode(res)){
                    this.couponInfo = res.data;
                }
            })
        },
        copyLink(clipboard) {
            clipboard.on("success", e => {
                this.$message.success("链接复制成功");
            });
            clipboard.on("error", e => {
                this.$message.error("链接复制失败");
            });
        },
        qrcode(href) {
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width: 160,
                height: 160,
            });
            qrcode.makeCode(href);
            $("#qrcode").attr("title", "");
        }
    }
};
</script>
<style lang="scss" scoped>
@import "src/assets/css/mixin.scss";

.invitation{
    position: relative;
    .title{
        line-height: 60px;
        font-size: 18px;
    }
    .invite-info{
        width: 100%;
        height: 320px;
        background: url('/static/image/invite_bg.svg') no-repeat;
        position: absolute;
        top: 0;
        left: 0;
        ul{
            position: absolute;
            width: 100%;
            bottom: 40px;
            padding: 0 40px;
            li{
                float: left;
                width: 33.33%;
                text-align: center;
                color: #fff;
                position: relative;
                .num{
                    font-size: 18px;
                }
                div{
                    color: #fff;
                    margin-top: 5px;
                }
            }
            li:nth-child(2){
                &::before{
                    content: '';
                    width: 1px;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    background: #F7A18E;
                }
                &::after{
                    content: '';
                    width: 1px;
                    height: 100%;
                    position: absolute;
                    right: 0;
                    top: 0;
                    background: #F7A18E;
                }
            }
        }
    }
    .table{
        margin-top: 290px;
        
    }
    .invite-link{
        margin-top: 10px;
        .link-box{
            padding: 0 30px 30px 20px;
            background: #FAF1E1;
            margin-bottom: 40px;
            height: 116px;
            p{
                padding: 10px 0;
            }
            .el-input{
                width: calc(100% - 250px);
                vertical-align: middle;
                .el-input__inner{
                    height: 46px;
                }
            }
            .copy{
                // display: inline-block;
                width: 230px;
                height: 46px;
                line-height: 46px;
                border-radius: 4px;
                text-align: center;
                background: #fff;
                vertical-align: middle;
                float: right;
                cursor: pointer;
            }
            .link{
                width: calc(100% - 250px);
                float: left;
                height: 46px;
                line-height: 46px;
                padding: 0 15px;
                background: #fff;
                border-radius: 4px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
    .qrcode{
        margin-bottom: 40px;
        p{
            text-align: center;
            margin-bottom: 10px;
        }
        #qrcode{
            width: 160px;
            margin: 0 auto;
        }
    }
    .rules{
        color: #626262;
        p{
            color: #626262;
            padding: 5px 0;
        }
    }
}
</style>
<style lang="scss">
.invitation{
    .el-table table thead th{
        background: #F2D9AC;
    }
    .el-table table thead th .cell{
        background: #F2D9AC;
        color: #AC0D17;
    }
    .el-table .el-table__body tr.el-table__row--striped td{
        background: #FAF1E1;
    }
    .link-box{
        .el-input__inner{
            height: 46px;
        }
    }
}
</style>
