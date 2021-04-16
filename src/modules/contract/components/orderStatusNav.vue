<template>
    <div class="order-status">
        <div class="status-item">
            <div class="status-icon-box">
                <div class="status-icon">
                    <img
                        v-if="status=='05'"
                        src="../../../../static/image/orderStatus/create.svg"
                        alt
                    />
                    <img v-else src="../../../../static/image/orderStatus/created.svg" alt />
                    <!--                    <img src="../../../../static/image/orderStatus/creating.svg" alt="">-->
                </div>
                <div class="status-txt">
                    <p :class="{'no-ing':['05'].includes(status)}">创建订单</p>
                    <p :class="{'no-ing':['05'].includes(status)}">
                        {{orderInfo.orderCreateTime &&
                        orderInfo.orderCreateTime.substring(0,10)}}
                    </p>
                    <p :class="{'no-ing':['05'].includes(status)}">
                        {{orderInfo.orderCreateTime &&
                        orderInfo.orderCreateTime.substring(11,16)}}
                    </p>
                </div>
            </div>
            <div class="status-line">
                <img v-if="status=='05'" src="../../../../static/image/orderStatus/arr.svg" alt />
                <img v-else src="../../../../static/image/orderStatus/arr_ing.svg" alt />
            </div>
        </div>
        <div class="status-item">
            <div class="status-icon-box">
                <div class="status-icon">
                    <img v-if="status=='05'" src="../../../../static/image/orderStatus/pay.svg" alt />
                    <img
                        v-else-if="status=='02'"
                        src="../../../../static/image/orderStatus/待支付.svg"
                        alt
                    />
                    <img v-else src="../../../../static/image/orderStatus/payed.svg" alt />
                    <!--                    <img src="../../../../static/image/orderStatus/paying.svg" alt="">-->
                </div>
                <div class="status-txt">
                    <p v-if="status=='02'">待支付</p>
                    <p :class="{'no-ing':['05'].includes(status)}" v-else>付款成功</p>
                    <p
                        v-if="status!='05'"
                    >{{payTime.operationTime && payTime.operationTime.substring(0,10)}}</p>
                    <p
                        v-if="status!='05'"
                    >{{payTime.operationTime && payTime.operationTime.substring(11,16)}}</p>
                </div>
            </div>
            <div class="status-line">
                <img
                    v-if="status=='05' || status=='02'"
                    src="../../../../static/image/orderStatus/arr.svg"
                    alt
                />
                <img v-else src="../../../../static/image/orderStatus/arr_ing.svg" alt />
            </div>
        </div>
        <div class="status-item">
            <div class="status-icon-box">
                <div class="status-icon">
                    <img
                        v-if="status=='03'"
                        src="../../../../static/image/orderStatus/checking.svg"
                        alt
                    />
                    <img
                        v-else-if="status=='05' || status=='02'"
                        src="../../../../static/image/orderStatus/check.svg"
                        alt
                    />
                    <img
                        v-else-if="status=='04'"
                        src="../../../../static/image/orderStatus/check_fail.svg"
                        alt
                    />
                    <img
                        v-else-if="['06','07','08'].includes(status)"
                        src="../../../../static/image/orderStatus/cheked.svg"
                        alt
                    />
                    <img v-else src="../../../../static/image/orderStatus/check.svg" alt />
                </div>
                <div class="status-txt">
                    <p
                        :class="{'no-ing':['05'].includes(status)}"
                    >{{status=='04'?'审核不通过':['06','07','08','10'].includes(status)?'审核通过':'审核中'}}</p>
                    <template v-if="status=='03'">
                        <p>
                            {{rejectTime.operationTime?submitTime.operationTime.substring(0,10):payTime.operationTime &&
                            payTime.operationTime.substring(0,10)}}
                        </p>
                        <p>
                            {{rejectTime.operationTime?submitTime.operationTime.substring(11,16):payTime.operationTime &&
                            payTime.operationTime.substring(11,16)}}
                        </p>
                    </template>
                    <template v-else-if="status=='04'">
                        <p>{{rejectTime.operationTime && rejectTime.operationTime.substring(0,10)}}</p>
                        <p>{{rejectTime.operationTime && rejectTime.operationTime.substring(11,16)}}</p>
                    </template>
                    <template v-else-if="['06','07','08','10'].includes(status)">
                        <p>{{auditTime.operationTime && auditTime.operationTime.substring(0,10)}}</p>
                        <p>{{auditTime.operationTime && auditTime.operationTime.substring(11,16)}}</p>
                    </template>
                </div>
            </div>
            <div class="status-line">
                <img
                    v-if="['06','07','08','10'].includes(status)"
                    src="../../../../static/image/orderStatus/arr_ing.svg"
                    alt
                />
                <img v-else src="../../../../static/image/orderStatus/arr.svg" alt />
            </div>
        </div>
        <div class="status-item">
            <div class="status-icon-box">
                <div class="status-icon">
                    <img
                        v-if="['07','08','10'].includes(status)"
                        src="../../../../static/image/orderStatus/produced.svg"
                        alt
                    />
                    <img
                        v-else-if="status=='06'"
                        src="../../../../static/image/orderStatus/producing.svg"
                        alt
                    />
                    <img v-else src="../../../../static/image/orderStatus/produce.svg" alt />
                </div>
                <div class="status-txt">
                    <p
                        :class="{'no-ing':!['06','07','08','10'].includes(status)}"
                    >{{['07','08','10'].includes(status)?'生产完成':'生产中'}}</p>
                    <template v-if="['06'].includes(status)">
                        <p>{{auditTime.operationTime && auditTime.operationTime.substring(0,10)}}</p>
                        <p>{{auditTime.operationTime && auditTime.operationTime.substring(11,16)}}</p>
                    </template>
                    <template v-if="['07','08','10'].includes(status)">
                        <p v-if="['06','07','08','10'].includes(status)">
                            {{productTime.operationTime &&
                            productTime.operationTime.substring(0,10)}}
                        </p>
                        <p v-if="['06','07','08','10'].includes(status)">
                            {{productTime.operationTime &&
                            productTime.operationTime.substring(11,16)}}
                        </p>
                    </template>
                </div>
            </div>
            <div class="status-line">
                <img
                    v-if="['07','08','10'].includes(status)"
                    src="../../../../static/image/orderStatus/arr_ing.svg"
                    alt
                />
                <img v-else src="../../../../static/image/orderStatus/arr.svg" alt />
            </div>
        </div>
        <div class="status-item">
            <div class="status-icon-box">
                <div class="status-icon">
                    <img
                        v-if="['07','10'].includes(status)"
                        src="../../../../static/image/orderStatus/waiting.svg"
                        alt
                    />
                    <img
                        v-else-if="['08'].includes(status)"
                        src="../../../../static/image/orderStatus/waited.svg"
                        alt
                    />
                    <img v-else src="../../../../static/image/orderStatus/wait.svg" alt />
                </div>
                <div class="status-txt">
                    <p
                        :class="{'no-ing':!['07','08','10'].includes(status)}"
                    >{{status=='08'?'已收货':'物流中'}}</p>
                    <template v-if="['07'].includes(status)">
                        <p>{{waitDate.operationTime && waitDate.operationTime.substring(0,10)}}</p>
                        <p>{{waitDate.operationTime && waitDate.operationTime.substring(11,16)}}</p>
                    </template>
                    <template v-if="['08'].includes(status)">
                        <p>{{orderInfo.finishTime && orderInfo.finishTime.substring(0,10)}}</p>
                        <p>{{orderInfo.finishTime && orderInfo.finishTime.substring(11,16)}}</p>
                    </template>
                </div>
            </div>
            <div class="status-line">
                <img
                    v-if="['08'].includes(status)"
                    src="../../../../static/image/orderStatus/arr_ing.svg"
                    alt
                />
                <img v-else src="../../../../static/image/orderStatus/arr.svg" alt />
            </div>
        </div>
        <div class="status-item">
            <div class="status-icon-box">
                <div class="status-icon">
                    <img
                        v-if="['08'].includes(status)"
                        src="../../../../static/image/orderStatus/compacting.svg"
                        alt
                    />
                    <img v-else src="../../../../static/image/orderStatus/compact.svg" alt />
                </div>
                <div class="status-txt">
                    <p :class="{'no-ing':!['08'].includes(status)}">完成</p>
                    <p v-if="['08'].includes(status)">
                        {{orderInfo.finishTime &&
                        orderInfo.finishTime.substring(0,10)}}
                    </p>
                    <p v-if="['08'].includes(status)">
                        {{orderInfo.finishTime &&
                        orderInfo.finishTime.substring(11,16)}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 订单状态(01:草稿 02:待支付 03:待审核 04:审核不通过 05:订单取消 06:生产中 07:物流中 08:订单完成 10:待发货)
import service from '../../../assets/mixin/service';

export default {
    mixins: [service],
    props: {
        status: {
            default: '02'
        },
        orderInfo: {
            default: {
                orderNo: ''
            }
        }
    },
    data() {
        return {
            waitDate: {},
            finishTime: {},
            payTime: {},
            productTime: {},
            rejectTime: {},
            auditTime: {},
            submitTime: {}
        };
    },
    mounted() {},
    methods: {
        getOrderTime() {
            this.getOrderLog(this.orderInfo.orderNo).then((res) => {
                if (this.successCheckCode(res)) {
                    res.data.filter((item) => {
                        if (item.currentStatus == '07') {
                            this.waitDate = item;
                        }
                        if (item.currentStatus == '03') {
                            this.payTime = item;
                        }
                        if (item.currentStatus == '10') {
                            this.productTime = item;
                        }
                        if (item.currentStatus == '08') {
                            this.finishTime = item;
                        }
                        if (item.currentStatus == '04') {
                            this.rejectTime = item;
                        }
                        if (item.currentStatus == '06') {
                            this.auditTime = item;
                        }
                        if (item.currentStatus == '02') {
                            //审核中时间  如果有多个，即有驳回重新提交  取时间最长的
                            if (this.submitTime.operationTime) {
                                // this.submitTime = item
                                let newDate = new Date(item.operationTime);
                                let oldDate = new Date(this.submitTime.operationTime);
                                if (newDate > oldDate) {
                                    this.submitTime = item;
                                }
                            } else {
                                this.submitTime = item;
                            }
                        }
                    });
                }
            });
        }
    },
    name: 'orderStatusNav'
};
</script>

<style scoped lang="scss">
.order-status {
    height: 228px;
    padding: 40px 20px;
    background-color: rgba(187, 221, 255, 0.1);

    .status-item {
        float: left;
        /*width: 164px;*/
        .status-icon-box {
            width: 80px;
            float: left;
            text-align: center;

            .status-icon {
                img {
                    width: 64px;
                    height: 64px;
                }
            }

            .status-txt {
                text-align: center;
                margin-top: 18px;

                p {
                    color: #999;
                    font-size: 14px;
                    line-height: 20px;

                    &:first-of-type {
                        color: #333;
                        margin-bottom: 6px;
                    }

                    &.no-ing {
                        color: #cdcdcd;
                    }
                }
            }
        }

        .status-line {
            float: left;
            padding-top: 22px;

            img {
                width: 80px;
                height: 17px;
            }
        }
    }
}
</style>
