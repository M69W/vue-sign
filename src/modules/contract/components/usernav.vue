<template>
  <div class="left-nav">
    <div class="left-nav-container">
      <el-menu :default-active="pagedefault"
               router
               unique-opened
               class="el-menu-vertical-demo"
               @open="handleOpen"
               @close="handleClose">
        <el-menu-item index="/accountmanager">
          <i class="navicon nav-1"></i>
          <span slot="title">基本信息</span>
        </el-menu-item>
        <el-menu-item index="/contactmanager">
          <i class="navicon nav-2"></i>
          <span slot="title">联系人管理</span>
        </el-menu-item>
        <el-menu-item index="/costmanager">
          <i class="navicon nav-3"></i>
          <span slot="title">费用管理</span>
        </el-menu-item>
        <el-menu-item index="/couponmanage">
          <i class="navicon nav-8"></i>
          <span slot="title">我的优惠券</span>
        </el-menu-item>
        <el-menu-item index="/invitation">
          <i class="navicon nav-9"></i>
          <span slot="title">邀请好友</span>
        </el-menu-item>
        <el-menu-item index="/loginfo">
          <i class="navicon nav-6"></i>
          <span slot="title">签章记录</span>
        </el-menu-item>
        <el-menu-item index="/accountmanagers"
                      v-if="userType == '01'">
          <i class="navicon nav-4"></i>
          <span slot="title">账号管理</span>
        </el-menu-item>
        <el-menu-item index="/charactermanagers"
                      v-if="userType == '01'">
          <i class="navicon nav-5"></i>
          <span slot="title">角色管理</span>
        </el-menu-item>
        <el-menu-item index="/messageManage">
          <i class="navicon nav-7"></i>
          <span slot="title"
                class="message-box">
            <i class="dot"
               v-show="hasMsg"></i>
            消息中心
          </span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
<script>
export default {
  mixins: [],
  components: {},
  data() {
    return {
      pagedefault: "",
      userType: "01",
      isMain: 1
    };
  },
  computed: {
    hasMsg() {
      if (this.$store.getters.hasMsg == 'true') {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    $route() {
      if (this.$route.path == "/usercenter") {
        this.$router.push("/accountmanager");
        this.pagedefault = "/accountmanager";
      } else if (this.$route.path == "/charactermanageradd") {
        this.pagedefault = "/charactermanagers";
      } else if (
        this.$route.path == "/ukeydetails" ||
        this.$route.path == "/ukeyorderdetail"
      ) {
        this.pagedefault = "/costmanager";
      } else {
        // this.pagedefault = this.$route.path;
        // console.log(this.$route.meta.parentPath);
        // console.log(this.$router);
        //修改为
        this.pagedefault = this.$route.meta.indexPath || this.$route.path;
      }
    }
  },
  mounted() {
    this.userType =
      $.cookie("userinfo") && JSON.parse($.cookie("userinfo")).userType;
    this.isMain =
      $.cookie("userinfo") &&
      JSON.parse($.cookie("userinfo")).isMainAccount;
    if (this.$route.path == "/usercenter") {
      this.$router.push("/accountmanager");
      this.pagedefault = "/accountmanager";
    } else if (
      this.$route.path == "/ukeydetails" ||
      this.$route.path == "/ukeyorderdetail"
    ) {
      this.pagedefault = "/costmanager";
    } else if (this.$route.path == "/charactermanageradd") {
      this.pagedefault = "/charactermanagers";
    } else {
      //   this.pagedefault = this.$route.path;
      //修改
      this.pagedefault = this.$route.meta.indexPath || this.$route.path;
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style lang="scss" scoped>
.message-box {
  position: relative;
  .dot {
    position: absolute;
    right: -15px;
    top: 0;
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 4px;
    background-color: red;
    vertical-align: middle;
  }
}
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
      background: url(../../../../static/image/base.svg) no-repeat;
    }
    .navicon.nav-2 {
      background: url(../../../../static/image/contact.svg) no-repeat;
    }
    .navicon.nav-3 {
      background: url(../../../../static/image/cost.svg) no-repeat;
    }
    .navicon.nav-4 {
      background: url(../../../../static/image/account.svg) no-repeat;
    }
    .navicon.nav-5 {
      background: url(../../../../static/image/role.svg) no-repeat;
    }
    .navicon.nav-6 {
      background: url(../../../../static/image/nav-4.svg) no-repeat;
    }
    .navicon.nav-7 {
      background: url(../../../../static/image/xiaoxi.svg) no-repeat;
    }
    .navicon.nav-8 {
      background: url(../../../../static/image/coupon/coupon_logo.svg) no-repeat;
    }
    .navicon.nav-9 {
      background: url(../../../../static/image/invitation.svg) no-repeat;
    }
  }
  .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active,
  .el-menu-item.is-active {
    background-color: #ffffff;
    color: #02adff;
    border-left: 2px solid #02adff;
    .navicon.nav-1 {
      background: url(../../../../static/image/base_active.svg) no-repeat;
    }
    .navicon.nav-2 {
      background: url(../../../../static/image/contact_active.svg) no-repeat;
    }
    .navicon.nav-3 {
      background: url(../../../../static/image/cost_active.svg) no-repeat;
    }
    .navicon.nav-4 {
      background: url(../../../../static/image/account_active.svg) no-repeat;
    }
    .navicon.nav-5 {
      background: url(../../../../static/image/role_active.svg) no-repeat;
    }
    .navicon.nav-6 {
      background: url(../../../../static/image/nav-4_active.svg) no-repeat;
    }
    .navicon.nav-7 {
      background: url(../../../../static/image/xiaoxi_active.svg) no-repeat;
    }
    .navicon.nav-8 {
      background: url(../../../../static/image/coupon/coupon_logo_active.svg)
        no-repeat;
    }
    .navicon.nav-9 {
      background: url(../../../../static/image/invitation_active.svg) no-repeat;
    }
  }
}
</style>
