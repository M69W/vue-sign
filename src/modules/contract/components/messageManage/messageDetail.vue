<template>
  <div class="message-detail">
    <div class="message-detail-back">
      <div style="cursor:pointer;"
           @click="goBack()">
        <img src="/static/image/back.png"
             alt="返回列表"
             title="返回列表"
             class="message-detail-back-logo">
        <span class="message-detail-back-text">返回列表</span>
      </div>
    </div>
    <div class="message-detail-main">
      <div class="message-title">{{msgDetail.title}}</div>
      <div class="message-content"
           v-html="msgDetail.content">
      </div>
    </div>
  </div>
</template>
<script>
import base from '../../mixin/base';
export default {
  mixins: [base],
  data() {
    return {
      userId: JSON.parse($.cookie('userinfo')).userId,    //用户id
      msgId: "",//消息id
      recordId: "",//用户对应消息
      msgDetail: {},
    }
  },
  mounted() {
    this.msgId = this.$route.query.msgId;
    this.recordId = this.$route.query.recordId;
    this.getDetailById().then(res => {
      this.setSimgleMsgStateBtn();
    });
  },
  methods: {
    getDetailById() {
      if (this.msgId) {
        return this.getMsgDetail(this.msgId).then(res => {
          if (this.successCheckCode(res)) {
            this.msgDetail = res.data;
            return res.data;
          }
        })
      }
    },
    //设置已读
    goBack() {
      this.$router.go(-1);
    },
    //设置以读状态
    setSimgleMsgStateBtn(recordId) {
      let data = {
        operateType: 0,
        recordIdList: [this.recordId]
      }
      this.setSimgleMsgState(data).then(res => {
        if (this.successCheckCode(res)) {
          if (res.data.left > 0) {
            this.$store.commit('SET_HASMSG', 1);
          } else {
            this.$store.commit('SET_HASMSG', 0);
          }
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import "src/assets/css/mixin.scss";

.message-detail {
  &-back {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    cursor: pointer;

    &-logo {
      background-size: contain;
      margin-left: 4px;
      width: 8px;
      margin-right: 4px;
      vertical-align: middle;
    }

    &-text {
      vertical-align: middle;
      font-size: 18px;
      color: #333;
    }
  }

  &-main {
    .message-title {
      // height: 58px;
      line-height: 24px;
      font-size: 16px;
      color: #333;
      font-weight: 700;
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
.message-detail {
  a:hover {
    text-decoration: underline;
  }
  img {
    max-width: 100%;
  }
}
</style>