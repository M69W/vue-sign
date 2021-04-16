<template>
  <div class="message-center">
    <div class="message-title">消息中心</div>
    <div class="message-main">
      <div class="message-main-top clearfix">
        <div class="main-top-left">
          <el-radio-group v-model="info.isRead"
                          class="main-top-left-select"
                          @change="getDiffReadTypeFn">
            <el-radio-button label="-1">
              <span>全部</span>
            </el-radio-button>
            <el-radio-button label="0">
              <!-- <span><i class="dot"
                   style="background-color: red;"></i>未读</span> -->
                   <span><i class="dot"
                   :style="{'background-color':hasMsg ? 'red':'#d8d8d8'}"></i>未读</span>
            </el-radio-button>
            <el-radio-button label="1">
              <span><i class="dot"></i>已读</span>
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="main-top-right">
          <div class="main-top-right-item"
               style="margin-right: 20px;"
               @click="setAllReadedBtn">
            <span class="read-btn">
              <i class="dot"></i><span>全部标记为已读</span></span>
          </div>
          <div class="main-top-right-item"
               @click="delAllBtn">
            <span class="del-btn">
              <i class=""></i>
              <span style="vertical">全部清除</span></span>
          </div>
        </div>
      </div>
      <div class="message-main-content">
        <div class="message-item"
             v-for="(titem, tindex) in tableData"
             :key="tindex">
          <div class="message-item-title clearfix">
            <div class="message-item-title-text fl"
                 :title="titem.title">
              <div class="message-item-title-type fl"
                   style="margin-right:6px">
                {{titem.type==2?'【活动】':"【公告】"}}
              </div>
              {{ titem.title }}
            </div>
            <div class="message-item-title-time fr">
              {{ titem.sendTime }}
            </div>
          </div>
          <div class="border"></div>
          <div class="message-item-content clearfix">
            <div class="message-item-content-info fl"
                 :title="titem.summary">
              <i class="dot"
                 :class="{ red_bg: titem.isRead === 0 }"></i>
              {{ titem.summary }}
            </div>
            <div class="message-item-content-opt fr clearfix">
              <div class="opt-btn fl"
                   @click="toDetail(titem)">
                查看详情
              </div>
              <div class="opt-btn fl"
                   @click="delBtn(titem,tindex)">
                删除
              </div>
            </div>
          </div>
        </div>
        <div v-if="tableData.length <= 0"
             style="text-align: center; margin-top:120px;">
          <img src="/static/image/no_message.svg"
               alt="">
        </div>
      </div>
    </div>
    <el-pagination class="pagination-wrap"
                   :page-size="pageSize"
                   layout="prev,pager,next,total"
                   @current-change="handleCurrentChange"
                   @size-change="handleCurrentSize"
                   :total="total"
                   :current-page.sync="pageNum"
                   v-show="tableData.length>0">
    </el-pagination>
  </div>
</template>
<script>
import base from "../../mixin/base";
// import * as SockJS from 'sockjs-client';
export default {
  mixins: [base],
  data() {
    return {
      info: {
        isRead: -1 //是否已读:0、未读；1、已读 全部-1,
      },
      userId: JSON.parse($.cookie("userinfo")).currentUserId, //用户id
      pageSize: 7,
      pageNum: 1, //当前页数
      total: 0,
      tableData: []
    };
  },
  mounted() {
    this.getMsgListFn();
    console.log(this.hasMsg);
    
    // const self = this
    // // 断开重连机制,尝试发送消息,捕获异常发生时重连
    // mpush.connect('ws://10.9.2.146:8008',this.userId);
    // this.timer = setInterval(() => {
    //     try {
    //         // mpush.connect('ws://192.168.51.218:6381');
    //     } catch (err) {
    //         mpush.connect('ws://10.9.2.146:8008',this.userId);
    //         console.log('断线了: ' + err)
    //     }
    // }, 5000)
    // let sockjs = new SockJS('10.9.2.146:8008');
  },
  methods: {
    getMsgListFn() {
      let data = {
        isRead: this.info.isRead,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userId: this.userId
      };
      this.getMsgList(data).then(res => {
        if (this.successCheckCode(res)) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getMsgListFn();
    },
    handleCurrentSize() { },
    toDetail(row) {
      this.$router.push("/messageDetail?msgId=" + row.noticeId + '&recordId=' + row.recordId);
    },
    getDiffReadTypeFn(val) {
      this.pageNum = 1;
      this.getMsgListFn();
    },
    delBtn(row, index) {
      this.$confirm("您确认要删除当前消息？", "删除消息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "self-icon icon-delete center-confirm"
      })
        .then(() => {
          let data = {
            operateType: 1, //操作类型 , 1删除 .0以读
            recordIdList: [row.recordId]
          };
          this.setSimgleMsgState(data).then(res => {
            if (this.successCheckCode(res)) {
              // this.total--;
              // this.tableData.splice(index, 1);
              // if (this.total == 0) {
              //   this.$store.commit("SET_HASMSG", 0);
              // }
              // if (this.tableData.length == 0) {
              //   this.pageNum = 1;
              // }
              // setTimeout(() => {
              this.getMsgListFn();
              this.$message.success("删除成功！");
              if (res.data.left > 0) {
                this.$store.commit("SET_HASMSG", 1);
              } else {
                this.$store.commit("SET_HASMSG", 0);
              }
              // }, 1000);
            }
          });
        })
        .catch(() => { });
    },
    delAllBtn() {
      this.$confirm("您确认要删除所有消息？", "删除消息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "self-icon icon-delete center-confirm"
      })
        .then(() => {
          let data = {
            operateType: 1 //操作类型 , 1删除 .0以读
          };
          this.setMutipleMsgState(data).then(res => {
            if (this.successCheckCode(res)) {
              this.$message.success("删除成功！");
              // this.tableData = [];
              // this.total = 0;
              // this.info.isRead = '-1';
              // setTimeout(() => {
              this.getMsgListFn();
              this.$store.commit("SET_HASMSG", 0);
              // }, 2000);
              // setTimeout(() => {
              // }, 5000);
            }
          });
        })
        .catch(() => { });
    },
    setAllReadedBtn() {
      this.$confirm("全部标记为已读消息？", "标记消息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "self-icon  center-confirm"
      })
        .then(() => {
          let data = {
            operateType: 0 //操作类型 , 1删除 .0以读
          };
          this.setMutipleMsgState(data).then(res => {
            if (this.successCheckCode(res)) {
              // setTimeout(() => {
              this.$message.success("设置已读成功！");
              // if (this.info.isRead == '0') {
              //   this.tableData = [];
              //   this.total = 0;
              // } else {
              //   this.tableData.map(item => {
              //     item.isRead = '1';
              //   })
              // }
              this.getMsgListFn();
              this.$store.commit("SET_HASMSG", 0);
              // }, 2000);
            }
          });
        })
        .catch(() => { });
    }
  },
  computed: {
    hasMsg() {
      if (this.$store.getters.hasMsg == "true") {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "src/assets/css/mixin.scss";

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  background-color: #d8d8d8;
  vertical-align: middle;
}

.red_bg {
  background-color: red;
}

.message-center {
  .message-title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    font-size: 18px;
    color: #333333;
  }

  .message-main-top {
    padding: 20px 0;

    .main-top-left {
      float: left;
    }

    .main-top-right {
      float: right;

      .main-top-right-item {
        cursor: pointer;
        float: left;
        width: 127px;
        height: 36px;
        text-align: center;
        font-size: 14px;
        color: #99a9bf;
        border: 1px solid #99a9bf;
        padding: 5px 8px;
        border-radius: 6px;
        .read-btn {
          line-height: 26px;
        }
        .del-btn {
          line-height: 22px;
          i {
            display: inline-block;
            margin-right: 6px;
            width: 16px;
            height: 16px;
            vertical-align: middle;
            background-image: url("/static/image/del_logo.svg");
            background-repeat: no-repeat;
            background-size: contain;
            background-position: 50% 50%;
          }
          span {
            vertical-align: middle;
          }
        }

        &:hover {
          border-color: #02adff;
          color: #02adff;

          i.dot {
            background-color: #02adff;
          }

          .del-btn {
            i {
              background-image: url("/static/image/del_logo_active.svg");
            }
          }
        }
      }
    }
  }

  .message-main-content {
    .message-item {
      background-color: #fafafa;
      border: 1px solid #c0ccda;
      border-radius: 10px;
      padding: 0 20px;
      margin-bottom: 20px;

      &-title {
        height: 36px;
        line-height: 37px;

        &-text {
          color: #333;
          font-size: 14px;
          font-weight: 700;
          width: 80%;
          @include ellipsis();
        }

        &-time {
          color: #9b9b9b;
          font-size: 13px;
        }
      }

      .border {
        height: 1px;
        background-color: #e8ecef;
      }

      &-content {
        height: 43px;
        line-height: 43px;
        font-size: 14px;

        &-info {
          color: #666;
          width: 80%;
          @include ellipsis();
        }

        &-opt {
          .opt-btn {
            color: #666;
            cursor: pointer;
            margin-left: 20px;

            &:hover {
              color: #02adff;
            }
          }
        }
      }
    }
  }

  .pagination-wrap {
    float: right;
  }
}
</style>
<style lang="scss">
.message-main-top {
  .main-top-left {
    &-select {
      .el-radio-button {
        .el-radio-button__inner {
          display: inline-block;
          width: 74px;
          height: 36px;
          line-height: 36px;
          padding: 0;
          font-size: 14px;
          color: #99a9bf;
        }
      }

      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        color: white;
        background-color: #02adff;
      }
    }
  }
}
.center-confirm {
  .el-message-box__btns {
    text-align: center;
  }
}
</style>
