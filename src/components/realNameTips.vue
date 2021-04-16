<template>
  <div class="reject">
    <span class="info"
          v-if="auditStatus === 4">认证审核驳回，请重新上传资料，
      <span :title="reason">驳回原因：{{ reason }}</span>
    </span>
    <span class="info"
          v-if="auditStatus === 1">您的实名信息已在审核中，请耐心等待</span>

    <span class="btn fr"
          @click="reSub"
          v-if="auditStatus === 4">重新提交</span>
  </div>
</template>
<script>
export default {
  props: {
    auditStatus: {
      //审核状态(1:待审核;2:待扫脸;3:已通过;4:驳回) ,
      type: [Number, String],
      default: "",
    },
    reason: "", //驳回原因
  },
  methods: {
    reSub() {
      this.$router.push("manualAudit");
    },
  },
};
</script>
<style lang="scss" scoped>
.reject {
  width: 100%;
  line-height: 40px;
  border-radius: 4px;
  padding-left: 54px;
  padding-right: 100px;
  background: url(../../static/image/realName/warning_red.svg) 20px center
    no-repeat #f7b500;
  margin-bottom: 10px;
  position: relative;
  .info {
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    vertical-align: middle;
    font-size: 14px;
    color: #333;
    text-align: center;
  }
  .btn {
    position: absolute;
    right: 52px;
    top: 0;
    display: inline-block;
    vertical-align: middle;
    color: #ff0000;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
