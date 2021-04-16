<template>
    <div class="left-nav">
        <div class="left-nav-container">
            <el-menu
                :default-active="pagedefault"
                router
                unique-opened
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
            >
                <el-menu-item index="/myseal" v-if="userType == '01'">
                    <i class="navicon nav-2"></i>
                    <span slot="title">电子印章</span>
                    <i class="count">{{totalSealNumBers}}</i>
                </el-menu-item>
                <el-menu-item index="/mysign">
                    <i class="navicon nav-1"></i>
                    <span slot="title">我的签名</span>
                    <i class="count">{{totalSignNumBers}}</i>
                </el-menu-item>
                <el-menu-item index="/ukeyorder">
                    <i class="navicon nav-3"></i>
                    <span slot="title">Ukey订单</span>
                    <i class="count">{{totalUkeyOrderNumBers}}</i>
                </el-menu-item>
            </el-menu>
        </div>
    </div>
</template>
<script>
import base from "../mixin/base";

export default {
    mixins: [base],
    components: {},
    data() {
        return {
            pagedefault: "",
            countData: {},
            totalSeal: 0,
            totalSign: 0,
            userType: JSON.parse($.cookie("userinfo")).userType,
            totalSealNumBers: this.totalSealNumBer,
            totalSignNumBers: this.totalSealNumBer,
            totalUkeyOrderNumBers: this.totalSealNumBer
        };
    },
    props: {
        totalSealNumBer: {
            type: Number,
            default: 0
        },
        totalSignNumBer: {
            type: Number,
            default: 0
        },
        totalUkeyOrderNumBer: {
            type: Number,
            default: 0
        }
    },
    created() {},
    computed: {},
    watch: {
        totalSealNumBer(val) {
            this.totalSealNumBers = val;
        },
        totalSignNumBer(val) {
            this.totalSignNumBers = val;
        },
        totalUkeyOrderNumBer(val) {
            this.totalUkeyOrderNumBers = val;
        },
        $route() {
            if (this.$route.path == "/sealmanage") {
                if (this.userType == "01") {
                    this.$router.push("/myseal");
                    this.pagedefault = "/myseal";
                } else {
                    this.$router.push("/mysign");
                    this.pagedefault = "/mysign";
                }
            } else if (
                this.$route.path == "/addcloudsign" ||
                this.$route.path == "/addukeysign"
            ) {
                this.pagedefault = "/mysign";
            } else if (
                this.$route.path == "/orderdetail" ||
                this.$route.path == "/ukeyrenewaldetails"
            ) {
                this.pagedefault = "/ukeyorder";
            } else if (
                this.$route.path == "/addseal" ||
                this.$route.path == "/editseal" ||
                this.$route.path == "/addukeyseal" ||
                this.$route.path == "/addukeysealinfo"
            ) {
                this.pagedefault = "/myseal";
            } else {
                this.pagedefault = this.$route.path;
            }
        }
    },
    mounted() {
        if (this.$route.path == "/sealmanage") {
            if (this.userType == "01") {
                this.$router.push("/myseal");
                this.pagedefault = "/myseal";
            } else {
                this.$router.push("/mysign");
                this.pagedefault = "/mysign";
            }
        } else if (
            this.$route.path == "/addcloudsign" ||
            this.$route.path == "/addukeysign"
        ) {
            this.pagedefault = "/mysign";
        } else if (
            this.$route.path == "/orderdetail" ||
            this.$route.path == "/ukeyrenewaldetails"
        ) {
            this.pagedefault = "/ukeyorder";
        } else if (
            this.$route.path == "/addseal" ||
            this.$route.path == "/editseal" ||
            this.$route.path == "/addukeyseal" ||
            this.$route.path == "/addukeysealinfo"
        ) {
            this.pagedefault = "/myseal";
        } else {
            this.pagedefault = this.$route.path;
        }
        this.getNavCountData();
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        getNavCountData() {
            this.sealNavCount()
                .then(res => {
                    if (this.successCheckCode(res)) {
                        this.countData = res.data;
                    }
                })
                .fail(res => {
                    this.$message.error(res.msg);
                });

            // 分别单独查询印章和签名数目
            let data = {
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                esealPictureTypeEnum: "06", //签名
                currPage: 1,
                pageSize: 10
            };
            let data2 = {
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                esealPictureTypeEnum: "05", //印章
                currPage: 1,
                pageSize: 10
            };
            if (this.userType == "01") {
                //企业 展示印章和签名数目
                this.getSealSignListByRole(data).then(res => {
                    if (
                        this.successCheckCode(res) &&
                        res.data.records.length > 0
                    ) {
                        this.totalSignNumBers = res.data.total;
                    }
                });
                this.getSealSignListByRole(data2).then(res => {
                    if (
                        this.successCheckCode(res) &&
                        res.data.records.length > 0
                    ) {
                        this.totalSealNumBers = res.data.total;
                    }
                });
            } else {
                //个人 展示签名数目
                this.getPersonSealSignList(data).then(res => {
                    if (
                        this.successCheckCode(res) &&
                        res.data.records.length > 0
                    ) {
                        this.totalSignNumBers = res.data.total;
                    }
                });
            }

            this.orderList(1, 10)
                .then(res => {
                    if (
                        this.successCheckCode(res) &&
                        res.data.list.length > 0
                    ) {
                        this.totalUkeyOrderNumBers = res.data.totalRow;
                    } else {
                        this.totalUkeyOrderNumBers = 0;
                    }
                    setTimeout(() => {
                        this.loadingTabel = false;
                    }, 200);
                })
                .fail(res => {
                    this.loadingTabel = false;
                    this.$message.error(res.msg);
                });
        },
        upDateOrderNum() {
            this.orderList(1, 10)
                .then(res => {
                    if (
                        this.successCheckCode(res) &&
                        res.data.list.length > 0
                    ) {
                        this.totalUkeyOrderNumBers = res.data.totalRow;
                    } else {
                        this.totalUkeyOrderNumBers = 0;
                    }
                    setTimeout(() => {
                        this.loadingTabel = false;
                    }, 200);
                })
                .fail(res => {
                    this.loadingTabel = false;
                    this.$message.error(res.msg);
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.left-nav {
    background-color: #f4f6f8;
    width: 206px;
    float: left;
    position: fixed;
    top: 70px;
    height: calc(100% - 120px);
    padding: 20px 0;
    overflow: auto;
    z-index: 100;

    .left-nav-container {
        background: #e8ecef;
        height: 100%;
        overflow: auto;

        .el-menu {
            margin-top: 20px;
            background-color: #e8ecef;
        }

        .el-menu-item {
            height: 40px;
            line-height: 40px;
            color: #333333;
            font-size: 14px;
            border-left: 2px solid transparent;

            .count {
                float: right;
            }
        }

        .navicon {
            vertical-align: -7px;
            margin-right: 8px;
            width: 20px;
            height: 20px;
            text-align: center;
            display: inline-block;
        }

        .navicon.nav-1 {
            background: url(../../../../static/image/nav-1.svg) no-repeat;
        }

        .navicon.nav-2 {
            background: url(../../../../static/image/nav-2.svg) no-repeat;
        }

        .navicon.nav-3 {
            background: url(../../../../static/image/nav-3.svg) no-repeat;
        }
    }

    .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active,
    .el-menu-item.is-active {
        background-color: #ffffff;
        color: #02adff;
        border-left: 2px solid #02adff;

        .navicon.nav-1 {
            background: url(../../../../static/image/nav-1_active.svg) no-repeat;
        }

        .navicon.nav-2 {
            background: url(../../../../static/image/nav-2_active.svg) no-repeat;
        }

        .navicon.nav-3 {
            background: url(../../../../static/image/nav-3_active.svg) no-repeat;
        }
    }
}
</style>
