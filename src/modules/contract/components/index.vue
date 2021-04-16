<template>
  <div class="home">
    <!-- 首页主体内容---头部   -->
    <div class="people_info">
      <div class="info-top">
        <div class="top-item new-item"
             v-if="limitlessUsefulLeft != -1">
          <span class="new-tip">
            新手福利
            <span style="color: #e02020;">{{limitlessUsefulLeft == 0 ? 1 : limitlessUsefulLeft}}天</span>
            -无限份数签
          </span>
          <!-- <span class="new-days">福利剩余：{{limitlessUsefulLeft == 0 ? 1 : limitlessUsefulLeft}}天</span> -->
        </div>
        <div class="top-item">
          <span class="eave-icon">
            <img src="../../../../static/image/icon-eave.svg" />
          </span>
          <span>
            <span class="eave">套餐剩余：</span>
            <span class="white">{{ times }}份</span>
          </span>
          <!-- <span class="buy">
                        <a @click="toBuy">购买套餐</a>
                    </span> -->
        </div>
        <span>|</span>
        <div class="top-item">
          <span class="integral-icon">
            <img src="../../../../static/image/icon-integral.svg" />
          </span>
          <span class="integral">积分：</span>
          <span class="white">{{ integral }}</span>
        </div>
      </div>

      <div style="padding-top:40px;">
        <!--  -->
        <div class="left">
          <span class="user_img"
                :class="{ bg: !!userHeadImg }">
            <router-link to="/accountmanager">
              <img :src="
                                    userHeadImg ? userHeadImg : defaultHeadImg
                                "
                   style="width: 100%;height: 100%;border-radius: 50%;" />
            </router-link>
          </span>
          <div class="info_box">
            <div class="box-item phone white"
                 style="font-size:20px;max-width: 340px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              {{ userinfo.enterPriseName }}
            </div>
            <div class="box-item">
              <span class="safety-icon">
                <img src="../../../../static/image/icon-safety.svg" />
              </span>
              <span class="safety">安全等级</span>
              <span class="safety-grade">
                <span class="progress">
                  <!--低：#F76260；中：#F5A623；高：#66B355；-->
                  <span v-if="safetyGrade == '1'"
                        class="progress-curr"
                        style="width:40%;background-color: #F76260;"></span>
                  <span v-if="safetyGrade == '2'"
                        class="progress-curr"
                        style="width:70%;background-color: #F5A623;"></span>
                  <span v-if="safetyGrade == '3'"
                        class="progress-curr"
                        style="width:100%;background-color: #66B355;"></span>
                </span>
                <span class="test2" style="margin-left:8px;"
                      v-if="isMainUser == 0">
                  <span v-if="safetyGrade == '1'"
                        style="color:#F76260;">低</span>
                  <span v-if="safetyGrade == '2'"
                        style="color:#F5A623;">中</span>
                  <span v-if="safetyGrade == '3'"
                        style="color:#66B355;">高</span>
                </span>
                <el-popover placement="bottom-start"
                            popper-class="popover-wrap"
                            v-if="isMainUser == 1"
                            width="260"
                            trigger="click">
                  <div class="popover-content">
                    <div class="item">
                      <span class="icon-num">①</span>绑定手机号
                      <span class="right-btn"
                            style="color:#999999;">已绑定</span>
                    </div>
                    <div class="item">
                      <span class="icon-num">②</span>登录密码
                      <span class="right-btn"
                            style="color:#999999;">已设置</span>
                    </div>
                    <div class="item">
                      <span class="icon-num">③</span>实名认证
                      <span v-if="isAuthentication"
                            class="right-btn"
                            style="color:#999999;">已认证</span>
                      <span v-else
                            @click="goUserCenter('1')"
                            class="right-btn"
                            style="color:#02ADFF;cursor: pointer;">立即认证</span>
                    </div>
                    <div class="item">
                      <span class="icon-num">④</span>绑定邮箱
                      <span v-if="isMail"
                            class="right-btn"
                            style="color:#999999;">已设置</span>
                      <span v-else
                            @click="goUserCenter('2')"
                            class="right-btn"
                            style="color:#02ADFF;cursor: pointer;">立即设置</span>
                    </div>
                    <div class="item">
                      <span class="icon-num">⑤</span>签署密码
                      <span v-if="isSignPassword"
                            class="right-btn"
                            style="color:#999999;">已设置</span>
                      <span v-else
                            @click="goUserCenter('2')"
                            class="right-btn"
                            style="color:#02ADFF;cursor: pointer;">立即设置</span>
                    </div>
                  </div>
                  <span class="test" slot="reference"
                        style="cursor:pointer;margin-left:8px;">
                    <span v-if="safetyGrade == '1'"
                          style="color:#F76260;">低</span>
                    <span v-if="safetyGrade == '2'"
                          style="color:#F5A623;">中</span>
                    <span v-if="safetyGrade == '3'"
                          style="color:#66B355;">高</span>
                    <img style="margin-left:4px;"
                         src="../../../../static/image/icon-down-arrow.svg" />
                  </span>
                </el-popover>
              </span>
            </div>
            <!-- <div class="box-item">
                            <span class="integral-icon">
                                <img src="../../../../static/image/icon-integral.svg">
                            </span>
                            <span class="integral">积分：</span>
                            <span class="white">{{integral}}</span>
                        </div>
                        <div class="box-item">
                            <span class="eave-icon">
                                <img src="../../../../static/image/icon-eave.svg">
                            </span>
                            <span>
                                <span class="eave">套餐剩余次数：</span>
                                <span class="white">{{times}}次</span>
                            </span>
                            <span class="buy">
                                <a @click="toBuy">购买套餐</a>
                            </span>
                        </div> -->
          </div>
        </div>
        <div class="right">
          <div class="item"
               v-if="userinfo.userType == '01'"
               @click="routerTo('ukeysealrenew')">
            <!-- <div class="tip">
                            <a>续期</a>
                            <br>
                            <span>电子印章</span>
                        </div> -->
            <div class="icon-show">
              <img src="../../../../static/image/renew.svg">
              <br>
              <el-button type="primary">电子印章续期</el-button>
            </div>

          </div>
          <div class="item"
               @click="applyUkey()">
            <!-- <div class="tip">
                            <a>申请</a>
                            <br>
                            <span>电子印章</span>
                        </div> -->
            <div class="icon-show">
              <img src="../../../../static/image/applyukey.svg" />
              <br />
              <el-button type="primary">电子印章购买</el-button>
            </div>
          </div>
          <div class="item"
               @click="routerTo('setmeal')">
            <!-- <div class="tip">
                            <a>合同</a>
                            <br>
                            <span>套餐购买</span>
                        </div> -->
            <div class="icon-show">
              <img src="../../../../static/image/getsign.svg" />
              <br />
              <el-button type="primary">合同套餐购买</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 首页主体内容---签署状态部分 -->
    <div class="state">
      <div class="box clearfix">
        <!-- 左侧---待我签署， 待他人签，签约完成，即将过期部分 -->
        <template v-for="(sign,index) in signList">
          <div class="list" 
          :key="index" 
          :class="{'z-index': guideStep == 4 && sign.type == '08'}" 
          v-if="sign.type == '04' || sign.type =='05' || sign.type=='07' || sign.type=='08'" 
          @click="goContract(sign.type)">
            <div class="rectangle"></div>
            <div>
              <img src="../../../../static/image/sign1.svg"
                 v-if="sign.type == '08'" />
              <img src="../../../../static/image/sign2.svg"
                 v-if="sign.type == '07'" />
              <img src="../../../../static/image/sign3.svg"
                 v-if="sign.type == '05'" />
              <img src="../../../../static/image/sign4.svg"
                 v-if="sign.type == '04'" />
            </div>
            <p class="number">{{ sign.num }}</p>
            <p class="name">{{ sign.name }}</p>
          </div>
        </template>
        <!-- <div class="list"
             v-for="sign in signList"
             :class="{'z-index': guideStep == 4 && sign.type == '08'}"
             v-if="sign.type == '04' || sign.type == '05' || sign.type == '07' || sign.type == '08'"
             @click="goContract(sign.type)">
          <div class="rectangle"></div>
          <div>
            <img src="../../../../static/image/sign1.svg"
                 v-if="sign.type == '08'" />
            <img src="../../../../static/image/sign2.svg"
                 v-if="sign.type == '07'" />
            <img src="../../../../static/image/sign3.svg"
                 v-if="sign.type == '05'" />
            <img src="../../../../static/image/sign4.svg"
                 v-if="sign.type == '04'" />
          </div>
          <p class="number">{{ sign.num }}</p>
          <p class="name">{{ sign.name }}</p>
        </div> -->

        <!-- 一个操作导航 -->
        <div v-if="guideStep == 4"
             class="guide-active">
          <img src="../../../../static/image/guide-4.png">
          <span class="guide-skip"
                @click.stop="guideSkip"></span>
          <span class="guide-sign"
                @click.stop="guideSignMe"></span>
        </div>
      </div>
      <!-- 右侧---指导 -->
      <div class="gosign clearfix">
        <div class="guide"
             @click="$refs.newbie.open();">新手视频</div>
        <div class="guide"
             @click="openGuide">新手引导</div>
        <div class="guide"
             @click="openWelfare" v-if="isNewUser">新手福利</div>
        <div class="tosign"
             :class="{'z-index': guideStep == 3}">
          <div @click="contractsign($event)">
            <img src="../../../../static/image/sign.svg" />
            <br />
            <span>发起签约</span>
          </div>
        </div>
        <div :class="{'guide-active': guideStep == 3}"
             v-if="guideStep == 3">
          <img src="../../../../static/image/guide-3.png">
          <span class="guide-skip1"
                @click.stop="guideSkip"></span>
          <span class="guide-sign"
                @click.stop="guideSign"></span>
        </div>
      </div>
      <div class="alert"
           v-if="authentication && !orderFlag">
        <div v-if="auditStatus!==1&&auditStatus!==4">
          <p>
            <i style="color: #E02020;margin:-3px -5px 0 0;"
               class="el-message__icon el-icon-warning"></i>
            《中华人民共和国电子签名法》要求签署人必须实名认证，否则签署的文件不具备法律效力。认证后
            <span style="color: #2B9014;">奖励10份电子合同</span>
            套餐
            <a class="authentication_hre"
               @click="goAuthentication()">去认证</a>
            <a class="el-message-box__close el-icon-close"
               @click="close()"></a>
          </p>
          <!-- <p>
            <i class="el-message__icon el-icon-warning"></i>
            《中华人民共和国电子签名法》要求签署方身份真实，
            您还没有完成实名认证，此时签署的文件不具备法律效力。
            <a class="authentication_hre"
               @click="goAuthentication()">去认证</a>
            <a class="el-message-box__close el-icon-close"
               @click="close()"></a>
          </p> -->
        </div>
        <real-name-tips :auditStatus="auditStatus"
                        :reason="reason"></real-name-tips>
      </div>
      <div class="alert"
           v-if="orderFlag">
        <p>
          <i style="color: #E02020;margin:-3px 7px 0 0;"
             class="el-message__icon el-icon-warning"></i>
          您的电子印章续期订单未操作完成，请您继续完成！
          <a class="authentication_hre"
             @click="goUkeyOrder()">继续完成续期</a>
          <a class="el-message-box__close el-icon-close"
             @click="orderFlag = false"></a>
        </p>
      </div>
    </div>
    <div class="sign_list">
      <p class="title">
        <i></i> 最近合同
        <span class="more"
              @click="more()">
          更多
          <span class="img"></span>
        </span>
      </p>
      <!-- 最近合同有数据---列表显示 -->
      <el-table :data="tableData"
                v-loading="loadingTabel"
                stripe
                tooltip-effect="light"
                style="width: 100% ; margin-left: 1px"
                border
                v-if="tableData && tableData != ''">
        <el-table-column :resizable="false"
                         label="合同主题"
                         prop="compactTheme"
                         align="left"
                         width="300">
        </el-table-column>
        <el-table-column :resizable="false"
                         label="发起方"
                         prop="initiatorName"
                         align="left"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false"
                         label="签署人"
                         prop="signName"
                         align="left"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false"
                         width="150"
                         label="发起时间"
                         prop="compactStartDate"
                         align="left"
                         show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false"
                         width="120"
                         label="状态"
                         prop="compactBelongedStatusDesc"
                         align="left"
                         show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false"
                         label="操作"
                         width="170"
                         align="left"
                         class="edit">
          <template slot-scope="scope">
            <!--<el-button v-for="edit in  editlist" type="text" size="small"-->
            <!--v-if="edit == '01'  && (scope.row.compactBelongedStatus == '07' || (scope.row.compactBelongedStatus == '06' && scope.row.signStatus != '01'))">-->
            <!--催签-->
            <!--</el-button>-->
            <!-- compactBelongedStatus 合同所属状态描述 (09:所有合同;08:待我签署;07:待他人签;06:即将截止签约;05:即将过期;04:签约完成;03:已拒签;02:已撤销;01:草稿箱)-->
            <!-- signStatus 签署状态（01：待我签署；02：待他人签；03：签署通过；04签署不通过） -->
            <!-- compactStatus 合同状态（01：草稿；02：已撤销；03：已拒签；04：签署中；05：签署完成；）-->

            <!--新列表修改开始-->
            <!--待我签署 签署人是自己&&未签署&&非草稿状态   btn:签署、移动、更多-->
            <!--<template v-if="scope.row.signStatus == '01' && scope.row.compactBelongedStatus=='08'">
                            <el-button type="text" size="small" @click="sign(scope.row.id)">签署</el-button>
                            <el-button type="text" size="small" @click="move(scope.row.id)">移动</el-button>
                            <el-button type="text" size="small" @click="compactMore(scope.row.id, scope.row.compactBelongedStatus, scope.row.signStatus, scope.row.compactStep, scope.row.compactTheme)">更多</el-button>
                        </template>
                        &lt;!&ndash;待他人签 发起人是自己||签署人有自己||抄送人有自己  && 其余人未签署 && 非草稿   btn:催签、移动、更多&ndash;&gt;
                        <template v-if="scope.row.signStatus == '03' && scope.row.compactBelongedStatus == '07'">
                            <el-button type="text" size="small" @click="sendMessage(scope.row.id)">催签</el-button>
                            <el-button type="text" size="small" @click="move(scope.row.id)">移动</el-button>
                            <el-button type="text" size="small" @click="compactMore(scope.row.id, scope.row.compactBelongedStatus, scope.row.signStatus, scope.row.compactStep, scope.row.compactTheme)">更多</el-button>
                        </template>
                        &lt;!&ndash;即将截止签约 发起人是自己||签署人有自己||抄送人有自己  需要我签署  btn:签署、移动、更多&ndash;&gt;
                        <template v-if="scope.row.compactBelongedStatus == '06' && scope.row.signStatus=='01'">
                            <el-button type="text" size="small" @click="sign(scope.row.id)">签署</el-button>
                            <el-button type="text" size="small" @click="move(scope.row.id)">移动</el-button>
                            <el-button type="text" size="small" @click="compactMore(scope.row.id, scope.row.compactBelongedStatus, scope.row.signStatus, scope.row.compactStep, scope.row.compactTheme)">更多</el-button>
                        </template>
                        &lt;!&ndash;即将截止签约 发起人是自己||签署人有自己||抄送人有自己  不需要我签署   btn:催签、移动、更多&ndash;&gt;
                        <template v-if="scope.row.compactBelongedStatus == '06' && scope.row.signStatus=='03'">
                            <el-button type="text" size="small" @click="sendMessage(scope.row.id)">催签</el-button>
                            <el-button type="text" size="small" @click="move(scope.row.id)">移动</el-button>
                            <el-button type="text" size="small" @click="compactMore(scope.row.id, scope.row.compactBelongedStatus, scope.row.signStatus, scope.row.compactStep, scope.row.compactTheme)">更多</el-button>
                        </template>
                        &lt;!&ndash;签约过期  暂无   btn:下载、删除、更多&ndash;&gt;
                        <template v-if="scope.row.compactBelongedStatus == '03' && scope.row.compactStatus == '05'">
                            <el-button type="text" size="small" @click.prevent="download(scope.row.compactTheme , scope.row.id)">下载</el-button>
                            <el-button type="text" size="small" @click="deleteFile(scope.row.id,10)">删除</el-button>
                            <el-button type="text" size="small" @click="compactMore(scope.row.id, scope.row.compactBelongedStatus, scope.row.signStatus, scope.row.compactStep, scope.row.compactTheme)">更多</el-button>
                        </template>
                        &lt;!&ndash;签约完成  发起人是自己||签署人有自己||抄送人有自己  btn:下载、移动、更多&ndash;&gt;
                        &lt;!&ndash;<template v-if="scope.row.compactBelongedStatus == '04' && scope.row.signStatus=='03'">
                            <el-button type="text" size="small" @click.prevent="download(scope.row.compactTheme , scope.row.id)">下载</el-button>
                            <el-button type="text" size="small" @click="move(scope.row.id)">移动</el-button>
                            <el-button type="text" size="small" @click="compactMore(scope.row.id, scope.row.compactBelongedStatus, scope.row.signStatus, scope.row.compactStep, scope.row.compactTheme)">更多</el-button>
                        </template>&ndash;&gt;
                        &lt;!&ndash;即将过期  发起人是自己||签署人有自己||抄送人有自己  btn:下载、移动、更多&ndash;&gt;
                        <template v-if="scope.row.compactBelongedStatus == '05' && scope.row.signStatus == '03'">
                            <el-button type="text" size="small" @click.prevent="download(scope.row.compactTheme , scope.row.id)">下载</el-button>
                            <el-button type="text" size="small" @click="move(scope.row.id)">移动</el-button>
                            <el-button type="text" size="small" @click="compactMore(scope.row.id, scope.row.compactBelongedStatus, scope.row.signStatus, scope.row.compactStep, scope.row.compactTheme)">更多</el-button>
                        </template>
                        &lt;!&ndash;已拒签  发起人是自己||签署人有自己||抄送人有自己  btn:重新发起、拒签原因、下载、移动、更多、&ndash;&gt;
                        <template v-if="scope.row.compactBelongedStatus == '03'">
                            <el-button type="text" size="small"
                                v-if="userId == scope.row.userId && checkTime(scope.row.compactRevocationDate)"
                                @click="$router.push({path: '/contractsign', query: {type: '08', id: scope.row.id}})">重新发起</el-button>
                            <el-button type="text" size="small"
                                @click="refuseSign(scope.row.compactTheme, scope.row.refuseSignRemake)">拒签原因</el-button >
                            <el-button type="text" size="small" @click.prevent="download(scope.row.compactTheme , scope.row.id)">下载</el-button>
                            <el-button type="text" size="small" @click="move(scope.row.id)">移动</el-button>
                            <el-button type="text" size="small" @click="compactMore(scope.row.id, scope.row.compactBelongedStatus, scope.row.signStatus, scope.row.compactStep, scope.row.compactTheme)">更多</el-button>
                        </template>
                        &lt;!&ndash;已撤销  发起人是自己||签署人有自己||抄送人有自己  btn:重新发起、撤销原因、下载、移动、更多、&ndash;&gt;
                        <template v-if="scope.row.compactBelongedStatus == '02'">
                            <el-button type="text" size="small"
                                v-if="userId == scope.row.userId && checkTime(scope.row.compactRevocationDate)"
                                @click="$router.push({path: '/contractsign', query: {type: '08', id: scope.row.id}})">重新发起</el-button>
                            <el-button type="text" size="small"
                                @click="revokeSign(scope.row.compactTheme, scope.row.refuseSignRemake)">撤销原因</el-button >
                            <el-button type="text" size="small" @click.prevent="download(scope.row.compactTheme , scope.row.id)">下载</el-button>
                            <el-button type="text" size="small" @click="move(scope.row.id)">移动</el-button>
                            <el-button type="text" size="small" @click="compactMore(scope.row.id, scope.row.compactBelongedStatus, scope.row.signStatus, scope.row.compactStep, scope.row.compactTheme)">更多</el-button>
                        </template>
                        &lt;!&ndash;草稿箱  发起人是自己&&草稿  btn:继续、删除、更多&ndash;&gt;
                        <template v-if="scope.row.compactBelongedStatus == '01'">
                            <el-button type="text" size="small" @click="continueSign(scope.row)">继续</el-button>
                            <el-button type="text" size="small" @click="deleteFile(scope.row.id,10)">删除</el-button>
                            <el-button type="text" size="small" @click="compactMore(scope.row.id, scope.row.compactBelongedStatus, scope.row.signStatus, scope.row.compactStep, scope.row.compactTheme)">更多</el-button>
                        </template>-->
            <!--新列表修改结束-->
            <el-button v-for="(edit,index) in editlist"
                       :key="index"
                       type="text"
                       size="small"
                       @click="sign(scope.row)"
                       v-if="edit == '01' && (scope.row.compactBelongedStatus == '08' || (scope.row.compactBelongedStatus == '06' && scope.row.signStatus == '01'))">
              签署
            </el-button>
            <el-button v-for="(edit, index) in editlist"
                       :key="index"
                       type="text"
                       size="small"
                       v-if="
                                edit == '08' &&
                                    scope.row.compactBelongedStatus == '01'
                            "
                       @click="continueSign(scope.row)">继续
            </el-button>
            <el-button v-for="(edit, index) in editlist"
                       :key="index"
                       type="text"
                       size="small"
                       v-if="
                                edit == '03' &&
                                    scope.row.compactBelongedStatus == '07'
                            "
                       @click="sendMessage(scope.row.id)">催签
            </el-button>
            <el-button v-for="(edit, index) in editlist"
                       :key="index"
                       type="text"
                       size="small"
                       v-if="
                                edit == '04' &&
                                    !!'03 04'.match(
                                        scope.row.compactBelongedStatus
                                    )
                            "
                       @click.prevent="
                                download(scope.row.compactTheme, scope.row.id)
                            ">下载
            </el-button>
            <el-button type="text" size="small" v-if="scope.row.compactBelongedStatus == '10'" @click="fillFile(scope.row.id)">完善</el-button>
            <el-button v-for="(edit, index) in editlist"
                       :key="index"
                       type="text"
                       size="small"
                       v-if="
                                edit == '05' &&
                                    !!'01 02 03 05'.match(
                                        scope.row.compactBelongedStatus
                                    )
                            "
                       @click="deleteFile(scope.row.id, 10)">删除
            </el-button>
            <el-button v-for="(edit, index) in editlist"
                       :key="index"
                       type="text"
                       size="small"
                       v-if="
                                edit == '02' &&
                                    !'01 03 10 11'.match(scope.row.compactBelongedStatus)
                            "
                       @click="move(scope.row.id)">移动
            </el-button>
            <el-dropdown size="mini"
                         menu-align="start">
              <span class="dropdown-btn">
                <i></i><i></i><i></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <p v-for="(edit, index) in editlist"
                     :key="index"
                     type="text"
                     size="small"
                     v-if="
                                            userId == scope.row.userId &&
                                                edit == '06' &&
                                                scope.row
                                                    .compactBelongedStatus ==
                                                    '03' &&
                                                checkTime(
                                                    scope.row.compactRefuseDate
                                                )&&scope.row.source!=2
                                        "
                     @click="
                                            $router.push({
                                                path: '/contractsign',
                                                query: {
                                                    type: '08',
                                                    id: scope.row.id
                                                }
                                            })
                                        ">
                    重新发起
                  </p>
                  <p v-for="(edit, index) in editlist"
                     :key="index"
                     type="text"
                     size="small"
                     v-if="
                                            userId == scope.row.userId &&
                                                edit == '07' &&
                                                scope.row
                                                    .compactBelongedStatus ==
                                                    '02' &&
                                                checkTime(
                                                    scope.row
                                                        .compactRevocationDate
                                                )&&scope.row.source!=2
                                        "
                     @click="
                                            $router.push({
                                                path: '/contractsign',
                                                query: {
                                                    type: '08',
                                                    id: scope.row.id
                                                }
                                            })
                                        ">
                    重新发起
                  </p>
                </el-dropdown-item>
                <el-dropdown-item>
                  <p v-for="(edit, index) in editlist"
                     :key="index"
                     type="text"
                     size="small"
                     v-if="
                                            edit == '06' &&
                                                scope.row
                                                    .compactBelongedStatus ==
                                                    '03'
                                        "
                     @click="
                                            refuseSign(
                                                scope.row.compactTheme,
                                                scope.row.refuseSignRemake
                                            )
                                        ">
                    拒签原因
                  </p>
                </el-dropdown-item>
                <el-dropdown-item>
                  <p v-for="(edit, index) in editlist"
                     :key="index"
                     type="text"
                     size="small"
                     v-if="
                                            edit == '07' &&
                                                scope.row
                                                    .compactBelongedStatus ==
                                                    '02'
                                        "
                     @click="
                                            revokeSign(
                                                scope.row.compactTheme,
                                                scope.row.revocationRemake
                                            )
                                        ">
                    撤销原因
                  </p>
                </el-dropdown-item>
                <el-dropdown-item>
                  <p v-for="(edit, index) in editlist"
                     :key="index"
                     type="text"
                     size="small"
                     v-if="edit == '09'"
                     @click="
                                            compactMore(
                                                scope.row.id,
                                                scope.row.compactBelongedStatus,
                                                scope.row.signStatus,
                                                scope.row.compactStep,
                                                scope.row.compactTheme,
                                                scope.row.source
                                            )
                                        ">
                    更多
                  </p>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- 最近合同没有数据---列表隐藏 -->
      <div class="nonedata"
           v-if="nodata">
        <div class="imgbg"></div>
        <div class="txt">暂无数据</div>
        <el-button type="primary"
                   @click="contractsign($event)">发起签约</el-button>
      </div>
      <el-dialog title="风险提示"
                 :visible.sync="dialogTips"
                 size="tiny"
                 class="dialogTips safety icon-safe self-icon">
        <div class="content">
          <i class="el-message-box__status icon-safe"></i>
          <p class="tips">
            您的账号未实名认证，存在安全风险，建议实名认证后再发起签约。
          </p>
        </div>
        <div class="btn-box">
          <el-button @click="sureContinueSign()">继续发起签约</el-button>
          <el-button type="primary"
                     @click="goAuthentication()">去实名认证</el-button>
        </div>
      </el-dialog>

      <el-dialog title="温馨提示"
                 :visible.sync="dialogTips1"
                 size="tiny"
                 class="dialogTips safety icon-safe self-icon">
        <div class="content">
          <i class="el-message-box__status icon-safe"></i>
          <p class="tips">{{ tipsTxt }}</p>
        </div>
        <div class="btn-box">
          <el-button type="primary"
                     @click="goAuthentication()">去实名认证</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="dialogTit"
                 :visible.sync="showFlag"
                 class="backoutDialog"
                 top="31%">
        <div class="bodybox">
          <div class="item">
            <span class="item-tit">{{ dialogItemName }}:</span>
            <span class="item-cont">{{ revoke.revokeFile }}</span>
          </div>
          <div class="item-textarea">
            <el-input type="textarea"
                      readonly
                      v-model="revoke.revokeInfo"></el-input>
          </div>
        </div>
        <div class="footerbox">
          <el-button type="primary"
                     @click="showFlag = false">知道了</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="移动"
               :visible.sync="dialogVisible"
               custom-class="custom-dialog moveFile"
               width
               top="31%"
               :before-close="handleClose">
      <div class="dialog-content">
        <p>请选择目标文件夹</p>
        <div class="move-select">
          <el-select v-model="wordList"
                     placeholder="请选择文件夹">
            <el-option :label="item.folderName"
                       :value="item.id"
                       v-for="item in CompactFolderList"
                       :key="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeMove">取 消</el-button>&nbsp;
        <el-button type="primary"
                   @click="moveWord">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="下载验证校验"
               :visible.sync="downloadDialog"
               class="backoutDialog2">
      <div class="bodybox">
        <div class="dialog-body">
          <el-form ref="formTab"
                   label-width="110px"
                   label-position="right">
            <el-form-item label="手机号码">
              <span>{{ phoneNum }}</span>
              <el-button style="float:right;width:100px;"
                         class="codebtn"
                         @click="getPhoneCode">
                {{
                                    countdown2 == 0
                                        ? "获取验证码"
                                        : countdown2 + "s"
                                }}
              </el-button>
            </el-form-item>
            <el-form-item label="短信验证码"
                          prop="verify">
              <el-input v-model="verify"
                        placeholder="请输入短信验证码"
                        :maxlength="6"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footerbox">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary"
                   @click="next">下一步</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示"
               :visible.sync="isShowUkeyRenewal"
               class="dialogTips ukey-renewal-dialog safety icon-safe self-icon ">
      <div class="content">
        <!-- <p class="tips">{{ tipsTxt }}</p> -->
        <div class="title">
          <div class="title-left">
            <i class="el-message-box__status icon-safe"></i>
          </div>
          <div class="title-right">
            <div class="title-right-top">
              <p>
                为保证您的数据安全
              </p>
              <p>
                请先完成实名认证后,再进行续期操作
              </p>
            </div>
            <div class="title-right-tips">
              注：如对电子印章(Ukey)续期，直接退出采用Ukey登录无需实名认证
            </div>
          </div>
          <!-- <i class="el-message-box__status icon-safe"></i>
                    <span style="">
                        为保证您的数据安全，
                        
                        请先完成实名认证后,再进行续期操作
                    </span>
                    <div class="title-tips">
                        注：如对电子印章(ukey)续期，直接退出采用Ukey登录无需实名认证
                    </div> -->
        </div>
      </div>
      <!-- <div class="bodybox">
                <div class="dialog-body">
                </div>
            </div> -->
      <div class="footerbox">
        <el-button @click="cancelShowUkeyRenewal">取 消</el-button>
        <el-button type="primary"
                   @click="reLoginByUkey">用Ukey登录实名</el-button>
      </div>
    </el-dialog>
    <online :home="true"></online> <!-- 在线客服 -->
    <newbie-guide ref="newbie"></newbie-guide><!-- 新手引导视频 -->
    <div class="guide-model"
         @click.stop="guideTo"
         v-if="(guideStep < 5 && guideStep > 2) || showGuide"></div>
    <!-- 新手引导弹窗 -->
    <div class="guide-lead"
         v-if="showGuide">
      <h6>新手引导</h6>
      <div class="guide-box">
        <ul>
          <li>
            <span>设置签署密码</span>
            <a @click="setSignPsd">去设置</a>
            <p>为保证签署安全需要，您需要优先进行签署密码设置。</p>
          </li>
          <li>
            <span>创建印章</span>
            <a @click="addSeal">去创建</a>
            <p>为自己创建一枚印章，以便后面进行合同签署需要。</p>
          </li>
          <li>
            <span>发起签约</span>
            <a @click="contractsign">去发起签约</a>
            <p>发起第一份合同，来感受一下电子合同带来的高效和便捷。</p>
          </li>
          <li>
            <span>签署合同</span>
            <a @click="guideSignMe">去签署合同</a>
            <p>签署接收到的合同文件，可以直接进入待我签署列表，完成签署。</p>
          </li>
          <li>
            <span>查看签署记录</span>
            <a @click="guideSignLog">去查看</a>
            <p>
              针对企业的用章行为记录，减少企业的用章风险。
            </p>
          </li>
        </ul>
      </div>
      <span class="guide-close"
            @click="showGuide = false"></span>
    </div>
    <!-- 新手福利弹窗 -->
    <new-welfare v-if="showWelfare && (guideStep<1 || guideStep >4 || guideStep == '')" :welfare="welfareTask"></new-welfare>
  </div>
</template>
<script>
import base from "../mixin/base";
import newbieGuide from "./newbieGuide";
import newWelfare from "./newWelfare"
import online from "../../../components/online";
import { checkBlobFileResponseUtils } from "@/utils";
import realNameTips from "../../../components/realNameTips";
export default {
  mixins: [base],
  components: { newbieGuide, online, realNameTips,newWelfare },
  data() {
    return {
      pageTitle: "",
      nodata: false,
      editlist: ["01", "02", "03", "04", "05", "06", "07", "08", "09"],
      signList: [],
      tableData: [],
      userinfo: {},
      authentication: false,
      isAuthentication: 0,//是否实名
      isSignPassword: false,
      isMail: false,
      loadingTabel: true,
      dialogTips: false,
      dialogTips1: false,
      times: "",
      integral: "",
      dialogTit: "",
      dialogItemName: "",
      revoke: {
        revokeFile: "",
        revokeInfo: ""
      },
      showFlag: false,
      userHeadImg: "",
      tipsTxt: "",
      defaultHeadImg:
        "data:image/png;base64,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",
      CompactFolderList: [],
      dialogVisible: false,
      moveCompId: "",
      wordList: [],
      safetyGrade: "1",
      countdown2: "",
      isCode: true,
      phoneNum: "",
      verify: "",
      downloadDialog: false,
      isFileSafety: false,
      currFileName: "",
      currFileId: "",
      isMainUser: 1,
      dateStr: "",
      userId:
        $.cookie("userinfo") && JSON.parse($.cookie("userinfo")).userId,
      realNameAuthenticationFlag:
        $.cookie("userinfo") &&
        JSON.parse($.cookie("userinfo")).realNameAuthenticationFlag,
      showGuide: false,
      showWelfare: false, // 显示和隐藏新手福利蒙版标志
      welfareTask: {},
      isNewUser:false,
      limitlessUsefulLeft: -1,
      isShowUkeyRenewal: false,//未实名显示续期弹窗
      orderFlag: false,  //续期订单显示弹窗
      auditStatus: "", //审核状态(1:待审核;2:待扫脸;3:已通过;4:驳回) ,
      reason: "", //驳回原因
    };
  },
  computed: {
    guideStep: {
      get() {
        return this.$store.state.change.guideStep;
      },
      set(newValue) {
        this.$store.state.change.guideStep = newValue;
        localStorage.setItem('guideStep', newValue);
      }
    }
  },
  watch: {
    countdown() {
      if (this.countdown == 0) {
        clearInterval(this.timer);
        this.isCode = true;
      }
    }
  },
  created() {
    this.userHeadImg =
      $.cookie("userinfo") &&
        JSON.parse($.cookie("userinfo")).headImageUrl
        ? JSON.parse($.cookie("userinfo")).headImageUrl
        : "";
  },
  // beforeRouteEnter (to, from, next) {
  //     $.ajax({
  //         type: 'get',
  //         url: '/api/garyscale',
  //         async: false,
  //         beforeSend: function(request) {
  //             request.setRequestHeader('Authorization', $.cookie('token'));
  //         },
  //         success: function(res){
  //             if(res.code === 0){
  //                 window.location.href = res.data;
  //             }else{
  //                 next();
  //             }
  //         },
  //         error: function(res){
  //             next();
  //         }
  //     })
  // },
  mounted() {
    this.pageTitle = this.$route.name;
    let self = this;
    if (!sessionStorage.getItem('token')) {
      // localStorage.removeItem("anyinUserinfo");
      $.removeCookie("anyinUserinfo", {
        path: "/",
        domain: "i-yin.com.cn"
      });
      this.$router.replace("/login");
      return;
    }

    this.getUserInfo()
    this.userinfo =
      $.cookie("userinfo") && JSON.parse($.cookie("userinfo"));
      console.log(this.userinfo);
    this.isMainUser =
      $.cookie("userinfo") &&
      JSON.parse($.cookie("userinfo")).isMainAccount;

    if (this.userinfo.realNameAuthenticationFlag == "0") {
      this.authentication = true;
    } else if (this.userinfo.realNameAuthenticationFlag == "1") {
      this.authentication = false;
    }
    // this.getUserInfo(); 
    this.getStatList();
    this.getListData(5);
    this.getCompactFolder();
    this.getInfo();
    this.getAuditInfoFn(); //获取审核详情
    if ($.cookie("isSign") && $.cookie("isSign") == "true") {
      // this.$refs.newbie.open();
      !this.guideStep ? this.guideStep = 1 : '';
      // $.cookie("isSign", false);
      $.cookie('signGuide', true);
    }
    this.isAuthentication == 1
      ? this.userinfo.enterPriseName
      : this.fomatUser(this.userinfo.enterPriseName);

    $(".home").scroll(function () {
      console.log($(this));
      // console.log($(this).scrollTop());
    });
    this.getOrderListData(); 
  },
  methods: {
    // 未完成续期的订单  后续跟进新的接口
    getOrderListData() {
      this.orderList(1, 100)
        .then(res => {
          let list = res.data.list;
          list.forEach((data, index) => {
            if (data.orderStatus == '06' && data.orderType == '02') {
              this.orderFlag = true;
              return;
            }
          })
        })
        .fail(res => {
          // this.$message.error(res.msg);
        });
    },
    // 前往继续续期
    goUkeyOrder() {
      this.$router.push({ path: "ukeyorder" });
    },
    compactMore(id, status, signStatus, compactStep, compactTheme, source) {
      this.$router.push({
        path: "/contractmore",
        query: {
          id: id,
          status: status,
          signStatus: signStatus,
          compactStep: compactStep,
          compactTheme: compactTheme,
          source
        }
      });
    },
    sign(row) {
      this.checkPermission(
        // 权限校验
        this.$perMap.contractMgt.signature.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        if (row.source === 2) {
          // 模板签署
          this.detail(row.id).then((res) => {
            console.log(res);
            if (this.successCheckCode(res)) {
              let nowUser = res.data.compactSignatoryList.find((v) => v.userId === this.userinfo.userId);
              let query = {
                editType: '01',
                isTemp: '1'
              };
              nowUser.fillFieldFlag === 1 ? (query.compactId = row.id) : (query.id = row.id);
              // 是否还需要填充模板，需要就去填充模板，不需要就直接去签合同
              let path = nowUser.fillFieldFlag === 1 ? '/contractsignature' : '/fillTemplate';
              this.$router.push({
                path,
                query
              });
            }
          });
        } else {
          // 普通合同签署
          this.$router.push({
            path: '/contractsignature',
            query: { compactId: row.id, editType: '01' }
          });
        }
      });
    },
    reSign(id) {
      this.checkPermission(
        // 权限校验
        this.$perMap.contractMgt.signature.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.$router.push({
          path: "/contractsign",
          query: { type: "08", id: id }
        });
      });
    },
    close() {
      this.authentication = false;
    },
    goUserCenter(val) {
      if (val == "1") {
        if (this.userinfo.userType == "01") {
          this.$router.push({ path: "/companyauthen" });
        } else if (this.userinfo.userType == "02") {
          this.$router.push({ path: "/personauthen" });
        }
      } else if (val == "2") {
        this.$router.push({
          path: "/accountmanager",
          query: { safetyType: "2" }
        });
      }
    },
    // 拒签原因
    refuseSign(theme, txt) {
      this.dialogTit = "查看拒签原因";
      this.dialogItemName = "拒签合同";
      this.revoke.revokeFile = theme;
      this.revoke.revokeInfo = txt;
      this.showFlag = true;
    },
    // 撤销原因
    revokeSign(theme, txt) {
      this.dialogTit = "查看撤销原因";
      this.dialogItemName = "撤销合同";
      this.revoke.revokeFile = theme;
      this.revoke.revokeInfo = txt;
      this.showFlag = true;
    },
    //合同归档列表
    getCompactFolder() {
      let enterpriseId =
        $.cookie("userinfo") && JSON.parse($.cookie("userinfo")).userId;
      // let enterpriseId = 12424 ;
      this.getCompactFolderList(enterpriseId).then(res => {
        if (this.successCheckCode(res)) {
          this.CompactFolderList = res.data;
          /*if(!this.wordId){
                                this.wordId = res.data[0].id
                            }*/
        }
      });
    },
    // 移动
    move(id) {
      this.dialogVisible = true;
      this.moveCompId = id;
    },
    radioEvent() {
      this.showFlag = false;
    },
    goContract(type) {
      this.guideStep = '';
      $.cookie('isSign', false);
      localStorage.removeItem('guideStep');
      this.$router.push({ path: "/contractlist", query: { type: type } });
    },
    downloadfile(name, id) {
      let _self = this;
      // 下载
      var data = {
        compactId: id,
        userId:
          $.cookie("userinfo") &&
          JSON.parse($.cookie("userinfo")).userId
      };
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/compact/package/download");
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Authorization", sessionStorage.getItem('token'));
      xhr.responseType = "blob";
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = function (res) {
        // 这步为判断服务器是否正确响应
        if (xhr.status == 200 && xhr.readyState === 4) {
          var blob = xhr.response; //new Blob([xhr.response],{type:"application/octet-stream"});
          checkBlobFileResponseUtils(blob)
            .then(res => {
              var fileName = name + ".zip";
              if ("msSaveOrOpenBlob" in navigator) {
                window.navigator.msSaveOrOpenBlob(
                  res,
                  fileName
                );
              } else {
                const elink = document.createElement("a");
                elink.download = fileName;
                elink.style.display = "none";
                try {
                  elink.href = window.URL.createObjectURL(
                    res
                  );
                } catch (e) { }
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href);
                document.body.removeChild(elink);
              }
            })
            .catch(errMsg => {
              _self.$message({
                type: "error",
                message: errMsg
              });
            });
        } else {
        }
      };
    },
    getPhoneCode() {
      if (this.countdown2 == 0 && this.isCode) {
        this.isCode = false;
        this.smsCode({
          phone: this.phoneNum,
          useType: "13" //1.注册 2.修改密码 3.找回密码 4.设置或修改签署密码 5.ukey初始化  6.修改邮箱 7.修改手机号 8.修改地址 12.绑定手机号码(更换手机用) 13:合同文件下载身份验证
        })
          .then(res => {
            if (this.successCheckCode(res)) {
              this.countdown2 = 120;
              this.timer = setInterval(() => {
                --this.countdown2;
              }, 1000);
              this.$message({
                type: "success",
                message: "短信验证码发送成功"
              });
            } else {
              this.isCode = true;
            }
          })
          .fail(res => {
            this.isCode = true;
          });
      }
    },
    next() {
      this.checkSmsCode({
        msmCode: this.verify,
        phone: this.phoneNum,
        useType: "13"
      }).then(res => {
        if (this.successCheckCode(res)) {
          this.downloadDialog = false;
          this.downloadfile(this.currFileName, this.currFileId);
        }
      });
    },
    download(name, id) {
      this.checkPermission(
        // 权限校验
        this.$perMap.contractMgt.download.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.currFileName = name;
        this.currFileId = id;
        if (this.isFileSafety) {
          this.downloadDialog = true;
        } else {
          this.downloadfile(this.currFileName, this.currFileId);
        }
      });
    },
    dialogClose() {
      this.downloadDialog = false;
      this.countdown2 = 0;
    },
    applyUkey() {
      this.checkPermission(
        // 权限校验
        this.$perMap.sealMgt.electronicSeal.addSeal.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        if (this.isAuthentication == 0) {
          //未认证
          if (JSON.parse($.cookie("userinfo")).userType == "01") {
            //企业用户
            this.tipsTxt =
              "请您先去完成实名认证之后，才可以申请UKey印章。";
          } else if (
            JSON.parse($.cookie("userinfo")).userType == "02"
          ) {
            //个人用户
            this.tipsTxt =
              "请您先去完成实名认证之后，才可以申请UKey签名。";
          }
          this.dialogTips1 = true;
        } else if (this.isAuthentication == 1) {
          if (JSON.parse($.cookie("userinfo")).userType == "01") {
            //企业用户
            this.$router.push({ path: "/addukeyseal" });
          } else if (
            JSON.parse($.cookie("userinfo")).userType == "02"
          ) {
            //个人用户
            this.$router.push({ path: "/addukeysign" });
          }
        }
      });
    },
    contractsign(event) {
      if (this.guideStep) {
        this.guideStep = ++this.guideStep;
      }
      this.checkPermission(
        // 权限校验
        this.$perMap.contractMgt.saveSignPosition.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        if (this.isAuthentication == 0) {
          this.dialogTips = true;
        } else if (!this.phoneNum) {
          //未初始化绑定手机
          this.$router.push({
            path: "/companyinit"
          });
        } else {
          this.$router.push({
            path: "/contractsign",
            query: { index: true }
          });
        }
      });
    },
    more() {
      this.$router.push({ path: "/contractlist", query: { type: "09" } });
    },
    getUserInfo() {
      if (this.userinfo.userType == "02") {
        this.personDetail().then(res => {
          if (this.successCheckCode(res)) {
            let userinfo =
              $.cookie("userinfo") &&
              JSON.parse($.cookie("userinfo"));
            if(res.data.realNameAuthenticationFlag != userinfo.realNameAuthenticationFlag){
              userinfo.realNameAuthenticationFlag = res.data.realNameAuthenticationFlag
            }
            this.welfareTask = res.data.newbieTask;  // 新手福利任务是否完成标志对象
            this.isNew(this.welfareTask)
            //缓存是否设置签署密码
            userinfo.isSignPassword = res.data.isSignPassword;
            $.cookie("userinfo", JSON.stringify(userinfo), {
              path: "/",
              domain: this.$domain
            });

            if (res.data.headImageUrl) {
              if (!this.userHeadImg) {
                this.userHeadImg =
                  "/api" + res.data.headImageUrl;

                // 缓存头像
                let headImageUrl =
                  window.location.origin + this.userHeadImg;
                userinfo.headImageUrl = headImageUrl;
                $.cookie("userinfo", JSON.stringify(userinfo), {
                  path: "/",
                  domain: this.$domain
                });
              } else if (
                this.userHeadImg.indexOf(
                  res.data.headImageUrl
                ) == -1
              ) {
                this.userHeadImg =
                  "/api" + res.data.headImageUrl;

                // 缓存头像
                let headImageUrl =
                  window.location.origin + this.userHeadImg;
                userinfo.headImageUrl = headImageUrl;
                $.cookie("userinfo", JSON.stringify(userinfo), {
                  path: "/",
                  domain: this.$domain
                });
              }
            } else {
              this.userHeadImg = null;
              userinfo.headImageUrl = null;
              $.cookie("userinfo", JSON.stringify(userinfo), {
                path: "/",
                domain: this.$domain
              });
            }
            // localStorage.setItem("anyinUserinfo", JSON.stringify(userinfo));
            let anyinUserinfo = {
              enterPriseName: userinfo.enterPriseName,
              headImageUrl: userinfo.headImageUrl,
              realNameAuthenticationFlag: userinfo.realNameAuthenticationFlag
            }
            $.cookie("anyinUserinfo", JSON.stringify(anyinUserinfo), {
              path: "/",
              domain: "i-yin.com.cn"
            });
            this.phoneNum = res.data.phone;
            this.isMail = !!res.data.email ? true : false;
            this.isFileSafety = res.data.compactDownloadValidate
              ? true
              : false;
            this.isAuthentication =
              res.data.realNameAuthenticationFlag;
            this.isSignPassword = res.data.isSignPassword;
            if (
              this.isAuthentication == 1 &&
              this.isSignPassword == true &&
              this.isMail == true
            ) {
              this.safetyGrade = "3";
            } else if (
              this.isAuthentication == 1 ||
              this.isSignPassword == true ||
              this.isMail == true
            ) {
              this.safetyGrade = "2";
            } else if (
              this.isAuthentication == 0 &&
              this.isSignPassword == false &&
              this.isMail == false
            ) {
              this.safetyGrade = "1";
            }

            //实名之后刷新企业列表信息
            if (this.realNameAuthenticationFlag == 1) {
              let changeFlag = false;
              userinfo.enterPriseName = res.data.realName || "";
              userinfo.personalName = res.data.realName || "";

              let enterpriseInfoList =
                userinfo.enterpriseInfoList || [];
              let newEnterpriseInfoList = enterpriseInfoList.map(
                item => {
                  if (
                    item.personalId ==
                    res.data.personalId &&
                    item.realNameAuthenticationFlag == 0
                  ) {
                    item.personalName =
                      res.data.realName || "";
                    item.realNameAuthenticationFlag = 1;
                    changeFlag = true;
                    this.$message.success("实名成功");
                  }
                  return item;
                }
              );
              userinfo.enterpriseInfoList = newEnterpriseInfoList;
              userinfo.realNameAuthenticationFlag = 1;
              if (changeFlag) {
                $.cookie("userinfo", JSON.stringify(userinfo), {
                  path: "/",
                  domain: this.$domain
                });
                this.$router.go(0);
              }
            }
          }
        });
      } else {
        this.enterpriseDetail().then(res => {
          if (this.successCheckCode(res)) {
            let userinfo =
              $.cookie("userinfo") &&
              JSON.parse($.cookie("userinfo"));
            if(res.data.realNameAuthenticationFlag != userinfo.realNameAuthenticationFlag){
              userinfo.realNameAuthenticationFlag = res.data.realNameAuthenticationFlag
            }
            //缓存是否设置签署密码
            userinfo.isSignPassword = res.data.isSignPassword;
            $.cookie("userinfo", JSON.stringify(userinfo), {
              path: "/",
              domain: this.$domain
            });
            this.welfareTask = res.data.newbieTask;  // 新手福利任务是否完成标志对象
            this.isNew(this.welfareTask)
            if (res.data.headImageUrl) {
              if (!this.userHeadImg) {
                this.userHeadImg =
                  "/api" + res.data.headImageUrl;

                // 缓存头像
                let headImageUrl =
                  window.location.origin + this.userHeadImg;
                userinfo.headImageUrl = headImageUrl;
                $.cookie("userinfo", JSON.stringify(userinfo), {
                  path: "/",
                  domain: this.$domain
                });
              } else if (
                this.userHeadImg.indexOf(
                  res.data.headImageUrl
                ) == -1
              ) {
                this.userHeadImg =
                  "/api" + res.data.headImageUrl;

                // 缓存头像
                let headImageUrl =
                  window.location.origin + this.userHeadImg;
                userinfo.headImageUrl = headImageUrl;
                $.cookie("userinfo", JSON.stringify(userinfo), {
                  path: "/",
                  domain: this.$domain
                });
              }
            } else {
              this.userHeadImg = null;
              userinfo.headImageUrl = null;
              $.cookie("userinfo", JSON.stringify(userinfo), {
                path: "/",
                domain: this.$domain
              });
            }
            // localStorage.setItem("anyinUserinfo", JSON.stringify(userinfo));
            let anyinUserinfo = {
              enterPriseName: userinfo.enterPriseName,
              headImageUrl: userinfo.headImageUrl,
              realNameAuthenticationFlag: userinfo.realNameAuthenticationFlag
            }
            $.cookie("anyinUserinfo", JSON.stringify(anyinUserinfo), {
              path: "/",
              domain: "i-yin.com.cn"
            });
            this.phoneNum = res.data.linkManPhone;
            this.isMail = !!res.data.enterpriseEmail ? true : false;
            this.isFileSafety = res.data.compactDownloadValidate
              ? true
              : false;
            this.isAuthentication =
              res.data.realNameAuthenticationFlag;
            this.isSignPassword = res.data.isSignPassword;
            if (
              this.isAuthentication == 1 &&
              this.isSignPassword == true &&
              this.isMail == true
            ) {
              this.safetyGrade = "3";
            } else if (
              this.isAuthentication == 1 ||
              this.isSignPassword == true ||
              this.isMail == true
            ) {
              this.safetyGrade = "2";
            } else if (
              this.isAuthentication == 0 &&
              this.isSignPassword == false &&
              this.isMail == false
            ) {
              this.safetyGrade = "1";
            }

            //实名之后刷新企业列表信息
            if (this.realNameAuthenticationFlag == 1) {
              let changeFlag = false;
              userinfo.enterPriseName =
                res.data.enterpriseName || "";
              userinfo.personalName = res.data.linkManName || "";

              let enterpriseInfoList =
                userinfo.enterpriseInfoList || [];
              let newEnterpriseInfoList = enterpriseInfoList.map(
                item => {
                  if (
                    item.enterpriseId ==
                    res.data.enterpriseId &&
                    item.realNameAuthenticationFlag == 0
                  ) {
                    item.enterPriseName =
                      res.data.enterpriseName || "";
                    console.log(item);
                    item.realNameAuthenticationFlag = 1;
                    this.$message.success("实名成功");
                    changeFlag = true;
                  }
                  return item;
                }
              );
              userinfo.enterpriseInfoList = newEnterpriseInfoList;
              userinfo.realNameAuthenticationFlag = 1;
              if (changeFlag) {
                $.cookie("userinfo", JSON.stringify(userinfo), {
                  path: "/",
                  domain: this.$domain
                });
                this.$router.go(0);
              }
            }
          }
        });
      }
    },
    // 是否为新用户
    isNew(obj){
      if(Object.values && Object.values(obj).length){
        // 判断是否为新用户  0 未完成任务  1 已完成任务 2  不参加活动
        this.isNewUser = Object.values(obj).some( (val) => {return val =='0'})
        // console.log(obj);       
        let done =false;
        if(obj.realNameFlag && obj.launchCompactFlag){
          done = true;  // 第一项和第二项已经完成
        }
        // console.log(done); 
        if(!sessionStorage.getItem('isNewUser') && this.isNewUser && !done){
          sessionStorage.setItem('isNewUser',true)
          this.showWelfare = true;
        }else{
          sessionStorage.setItem('isNewUser',false)
        }
        
      }
    },
    // 合同状态
    getStatList() {
      this.signState(this.userinfo.userId).then(res => {
        if (this.successCheckCode(res)) {
          this.signList = res.data.list;
        }
      });
    },

    continueSign(val) {
      this.checkPermission(
        // 权限校验
        this.$perMap.contractMgt.signature.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        if (val.source === 2) {
          if (val.compactStep == '04') {
            return this.$router.push(`/contractsignature?compactId=${val.id}&isTemp=1`);
          } else {
            return this.$router.push(`/contractsign?id=${val.id}&isTemp=1&type=01`);
          }
        }
        if (val.compactStep == "01") {
          this.$router.push({
            path: "/contractsign",
            query: { type: "01", id: val.id }
          });
        } else if (val.compactStep == "02") {
          this.$router.push({
            path: "/contractprocess",
            query: { type: "02", id: val.id }
          });
        } else if (val.compactStep == "03") {
          this.$router.push({
            path: "/contractsignature",
            name: "contractsignature",
            query: { compactId: val.id, next: true }
          });
        }
      });
    },
    goAuthentication() {
      let type =
        $.cookie("userinfo") &&
        JSON.parse($.cookie("userinfo")).userType;
      if (type == "01") {
        this.$router.push("/companyauthen");
      } else {
        this.$router.push("/personauthen");
      }
    },
    //
    deleteFile(val, pagesize) {
      this.checkPermission(
        // 权限校验
        this.$perMap.contractMgt.deleteCompact.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        this.$confirm(
          "此操作将永久删除该文件，是否继续？",
          "删除文件",
          {
            type: "warning",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            customClass: "icon-delete self-icon"
          }
        )
          .then(() => {
            var data = {
              compactId: val,
              userId: this.userinfo.userId
            };
            this.deleteCompact(data).then(res => {
              if (this.successCheckCode(res)) {
                this.$message({
                  message: `操作成功`,
                  type: "success",
                  duration: 3000
                });
                this.pageNum = 1;
                this.getListData(pagesize);
              }
            });
          })
          .catch(() => { });
      });
    },
    // 催签
    sendMessage(id) {
      this.contractRush(id).then(res => {
        if (this.successCheckCode(res)) {
          this.$message.success("催签成功");
        }
      });
    },
    // 合同列表
    getListData(val) {
      let self = this;
      let params = {
        pageNum: this.pageNum,
        pageSize: val,
        userId: this.userinfo.userId,
        blockStatusType: this.type, //类型
        timeType: this.endTime, // 时间类型
        startTime: this.startTime, // 开始时间
        endTime: this.endTime, // 结束时间
        compactTheme: this.compactTheme // 合同主题
      };
      self.loadingTabel = true;
      this.getSignList(params)
        .then(res => {
          if (this.successCheckCode(res)) {
            if (res.data.list.records.length > 0) {
              this.nodata = false;
            } else {
              this.nodata = true;
            }
            this.tableData = res.data.list.records;
            this.total = res.data.list.total;
            this.dateStr = new Date(
              Date.parse(res.data.dateStr.replace(/-/g, "/"))
            ).getTime();
          }
          setTimeout(() => {
            self.loadingTabel = false;
          }, 500);
        })
        .fail(res => {
          this.nodata = true;
          self.loadingTabel = false;
        });
    },
    getInfo() {
      this.getAccountInfo({
        userId: this.userinfo.userId,
        accountId: this.userinfo.accountId,
        userType: this.userinfo.userType
      }).then(res => {
        if (this.successCheckCode(res)) {
          this.times = res.data.signatureTotal;
          this.integral = res.data.integral;
          this.limitlessUsefulLeft = res.data.limitlessUsefulLeft;
        }
      });
    },
    toBuy() {
      this.$router.push("/setmeal");
    },
    handleClose(done) {
      this.moveCompId = "";
      this.wordList = "";
      done();
    },
    closeMove() {
      this.dialogVisible = false;
      this.moveCompId = "";
      this.wordList = "";
    },
    moveWord() {
      if (!this.wordList) {
        return this.$message.error("请选择目标文件夹");
      }
      let data = { compactId: this.moveCompId, folderId: this.wordList };
      this.moveCompactFolder(data).then(res => {
        if (this.successCheckCode(res)) {
          this.$message({
            message: `移动成功`,
            type: "success"
          });
          this.dialogVisible = false;
          this.moveCompId = "";
          this.wordList = "";
          this.getListData(5);
        }
      });
    },
    fillFile(id) {
        this.$router.push({
            path: '/fillTemplate',
            query: {
                id,
                isTemp: '1',
                editType: '01'
            }
        })
    },
    fomatUser(val) {
      let a = val.substr(0, 3);
      let b = val.substr(-3);
      return a + "*****" + b;
    },
    checkTime(date) {
      console.log(
        new Date(Date.parse(date.replace(/-/g, "/"))).getTime(),
        this.dateStr
      );
      console.log(
        new Date(Date.parse(date.replace(/-/g, "/"))).getTime() >
        this.dateStr
      );
      return (
        new Date(Date.parse(date.replace(/-/g, "/"))).getTime() >
        this.dateStr
      );
    },
    routerTo(val) {
      switch (val) {
        case 'ukeysealrenew':
      }
      if (val == 'ukeysealrenew') {
        if (this.isAuthentication == 0) {
          this.isShowUkeyRenewal = true;
        } else {
          this.$router.push(val);
        }
      } else {
        this.$router.push(val);
      }
    },
    // ukey重登
    reLoginByUkey() {
      this.loginOut()
        .then(res => {
          if (this.successCheckCode(res)) {
            $.removeCookie("token", {
              path: "/",
              domain: this.$domain
            });
            $.removeCookie("sessionToken", {
              path: "/",
              domain: this.$domain
            });
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('sessionToken');
            sessionStorage.removeItem('isNewUser')
            $.removeCookie("userinfo", {
              path: "/",
              domain: this.$domain
            });
            $.removeCookie("ukeylist", {
              path: "/",
              domain: this.$domain
            });
            $.removeCookie("anyinUserinfo", {
              path: "/",
              domain: "i-yin.com.cn"
            });
            $.cookie("isSign", false);
            this.$message({
              message: `退出成功`,
              type: "success",
              duration: 1000
            });
            localStorage.removeItem("anyinUserinfo");
            setTimeout(() => {
              this.$router.push("/login?Type=ukey");
            }, 1000);
          } else {
            // this.issignout = false;
          }
        })
        .fail(res => {
          // this.issignout = false;
        });
    },
    //取消ukeyRelogin
    cancelShowUkeyRenewal() {
      this.isShowUkeyRenewal = false;
    },
    openGuide() {
      this.showGuide = true;
      // this.$store.commit('changeGuideStep', 1);
    },
    openWelfare(){
      this.showWelfare = true;
    },
    guideTo() {
      if (this.showGuide || this.showWelfare) {
        return false;
      }
      this.guideStep = ++this.guideStep;
      if (this.guideStep > 4) {
        this.guideStep = '';
        $.cookie('isSign', false);
        localStorage.removeItem('guideStep');
      }
    },
    guideSkip() {
      if (this.guideStep == 4) {
        this.guideStep = '';
        $.cookie('isSign', false);
        localStorage.removeItem('guideStep');
        return false;
      }
      this.guideStep = ++this.guideStep;
    },
    guideSign() {
      this.guideStep = ++this.guideStep;
      this.checkPermission(
        // 权限校验
        this.$perMap.contractMgt.saveSignPosition.url
      ).then(res => {
        if (!this.successCheckCode(res)) {
          return;
        }
        if (this.isAuthentication == 0) {
          this.dialogTips = true;
        } else if (!this.phoneNum) {
          //未初始化绑定手机
          this.$router.push({
            path: "/companyinit"
          });
        } else {
          this.$router.push({
            path: "/contractsign",
            query: { index: true }
          });
        }
      });
    },
    guideSignMe() {
      this.guideStep = '';
      $.cookie('isSign', false);
      localStorage.removeItem('guideStep');
      this.$router.push('contractlist?type=08');
    },
    setSignPsd() {
      this.$router.push({
        path: 'accountmanager',
        query: {
          safetyType: 2
        }
      })
    },
    addSeal() {
      this.$router.push('sealmanage');
    },
    guideSignLog() {
      this.$router.push('loginfo');
    },
    getAuditInfoFn() {
      this.getAuditInfo().then((res) => {
        if (this.successCheckCode(res)) {
          this.auditStatus = res.data && res.data.auditStatus;
          if (this.auditStatus === 4) {
            //驳回
            this.reason = res.data.reason;
          }
        }
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    console.log(to)
    if (to.path == '/usercenter' && this.guideStep) {
      this.guideStep = ++this.guideStep;
    }
    if (to.path == '/sealmanage' && !Object.keys(to.query).length && this.guideStep) {
      this.guideStep = ++this.guideStep;
    }
    next()
  }
};
</script>
<style lang="scss" scoped>
.home {
  background: #fff;

  .people_info {
    background-color: #01294b;
    background-image: url("../../../../static/image/index-banner-bg.jpg");
    background-position: center;
    background-size: auto 200px;
    // padding-top: 40px;
    height: 200px;
    padding-bottom: 40px;
    position: relative;

    &::before {
      content: "";
      height: 1px;
      width: 100%;
      position: absolute;
      background: #21415d;
      top: 40px;
    }

    .info-top {
      height: 40px;
      line-height: 40px;
      text-align: right;
      color: #aeaeae;

      .top-item {
        display: inline-block;
        color: #aeaeae;
        position: relative;
      }

      > span {
        padding: 0 5px;
      }

      .new-tip {
        display: inline-block;
        width: 185px;
        height: 40px;
        background: url(../../../../static/image/new.svg) no-repeat left center;
        padding-left: 26px;
        text-align: left;
        font-size: 12px;
        color: #333333;
      }

      .new-item:hover {
        .new-days {
          display: block;
        }
      }

      .new-days {
        position: absolute;
        top: 5px;
        left: -140px;
        padding: 8px 15px;
        background: #02adff;
        line-height: 1;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
        display: none;

        &::after {
          content: "";
          position: absolute;
          border: 6px solid #02adff;
          height: 0;
          width: 0;
          border-right: none;
          right: -6px;
          top: 8px;
          border-top-color: transparent;
          border-bottom-color: transparent;
        }
      }
    }

    > div {
      width: 1200px;
      margin: auto;
      position: relative;

      .left {
        .user_img {
          width: 80px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          border-radius: 50%;
          background-color: #01294b;
          display: inline-block;
          vertical-align: top;
          margin-right: 21px;

          img {
            vertical-align: top;
            background-color: #fff;
          }

          background-image: url("../../../../static/image/userheadimg.png");
          background-size: 100%;

          &.bg {
            background-image: none;
          }
        }

        .info_box {
          display: inline-block;
          vertical-align: middle;

          .box-item {
            line-height: 26px;
            margin-bottom: 2px;

            span {
              color: #aeaeae;
              font-size: 14px;
            }

            .buy {
              margin-left: 40px;

              a {
                font-size: 14px;
                color: #02adff;
                text-decoration: underline;

                &:hover {
                  color: #0073bd;
                }
              }
            }

            .white {
              color: #eee;
            }

            .safety-grade {
              .progress {
                position: relative;
                width: 240px;
                height: 4px;
                border-radius: 2px;
                background-color: #999;
                display: inline-block;
                vertical-align: middle;
                margin-left: 5px;

                .progress-curr {
                  position: absolute;
                  left: 0;
                  top: 0;
                  display: inline-block;
                  height: 4px;
                  border-radius: 2px;
                }
              }
            }
          }

          .phone {
            color: #fff;
            padding-bottom: 8px;
          }
        }
      }

      .right {
        position: absolute;
        right: 0;
        top: 0;

        .item {
          float: left;
          width: 160px;
          height: 160px;
          text-align: center;
          position: relative;
          cursor: pointer;

          &::after {
            content: "";
            width: 1px;
            height: 80px;
            background: #21415d;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }

          &:last-child {
            &::after {
              display: none;
            }
          }

          img {
            margin-right: -9px;
            transform: scale(0.8);
            transition: 0.5s;
          }

          .el-button {
            width: 100%;
            margin-top: 20px;
          }

          .tip {
            color: #02adff;
            line-height: 28px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            a {
              text-decoration: underline;
              color: #02adff;
              font-size: 18px;
            }
          }

          .icon-show {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            .el-button {
              width: 110px;
              height: 36px;
              border-color: #0073bd;
              background: none;
              color: #0073bd;

              &:hover {
                span {
                  color: #0073bd;
                }
              }

              transition: 0.3s;
              width: 110px;
              height: 36px;
              border-color: #02adff;
              background: none;
              color: #02adff;

              &:hover {
                background-color: #02adff;
                color: #fff;
              }
            }
          }

          &:hover {
            // background: #063054;
            // &::after{
            //     display: none;
            // }
            // .tip{
            //     display: none;
            // }
            // .icon-show{
            //     display: block;
            // }
            img {
              transform: scale(1);
            }
          }
        }

        .applyukey {
          .el-button {
            &:active {
              color: #02adff;
            }

            &:hover {
              color: #02adff;
            }
          }
        }
      }
    }
  }

  .state {
    position: relative;
    width: 1200px;
    margin: 0 auto;
    height: 310px;

    .alert {
      position: absolute;
      top: 0;
      width: 100%;

      p {
        background: #f7ba2a;
        border-radius: 4px;
        width: 1200px;
        height: 36px;
        line-height: 36px;
        margin: auto;
        font-size: 13px;
        color: #333333;
        padding: 0 16px;
        text-align: center;
        .authentication_hre {
          font-size: 14px;
          color: #e02020;
          text-decoration: underline;
          padding-left: 20px;

          &:hover {
            color: #0073bd;
          }
        }

        .el-message-box__close.el-icon-close {
          float: right;
          margin-top: 12px;
          color: #ffffff;
        }
      }
    }

    .box {
      float: left;
      margin-left: 70px;
      padding-top: 44px;
      padding-bottom: 13px;
      position: relative;

      .list {
        text-align: center;
        float: left;
        margin-right: 57px;
        padding: 16px 23px 47px 23px;
        position: relative;
        cursor: pointer;

        .rectangle {
          position: absolute;
          background: url("../../../../static/image/Rectangle.png") center;
          width: 120px;
          display: none;
        }

        > div {
          height: 120px;
          width: 120px;
          line-height: 120px;
          text-align: center;
          background: #ffffff;
          box-shadow: -1px 2px 6px 0 #b0e6ff;
          border-radius: 90px;
        }

        .number {
          padding-top: 10px;
          padding-bottom: 10px;
          font-size: 24px;
          color: #626262;
        }

        .name {
          font-size: 14px;
          color: #999999;
        }
      }

      .list:nth-of-type(4) {
        margin-right: 0;
      }

      .list:hover .rectangle {
        animation: example 2s linear infinite;
        -webkit-animation: example 2s linear infinite;
        display: block;
      }

      .list:hover {
        background: rgba(244, 246, 248, 0.6);
        border-radius: 10px;
      }

      .list:hover p {
        color: #02adff !important;
      }

      @keyframes example {
        0% {
          transform: rotate(0deg);
        }

        100% {
          transform: rotate(360deg);
        }
      }

      .list.z-index {
        z-index: 9999;

        &:hover {
          background: none;
        }
      }

      .guide-active {
        position: absolute;
        left: 0;
        top: 46px;
        width: 166px;
        height: 225px;
        background: #fff;
        z-index: 9998;
        border-radius: 10px;

        img {
          position: absolute;
          left: 183px;
          top: 162px;
        }

        .guide-skip {
          position: absolute;
          width: 100px;
          height: 44px;
          right: -208px;
          bottom: -184px;
          cursor: pointer;
        }

        .guide-sign {
          position: absolute;
          width: 116px;
          height: 44px;
          bottom: -184px;
          right: -367px;
          cursor: pointer;
        }
      }
    }

    .gosign {
      float: right;
      margin-top: 70px;
      position: relative;

      .guide {
        color: #02adff;
        padding-left: 22px;
        background: url(../../../../static/image/newguide.svg) left center
          no-repeat;
        margin-bottom: 10px;
        cursor: pointer;
        display: inline-block;
        margin-right: 8px;
      }

      .tosign {
        width: 260px;
        height: 135px;
        border: 1px dashed #02adff;
        border-radius: 10px;
        background: #f3fafd;
        text-align: center;
        position: relative;

        > div {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          line-height: 30px;
          cursor: pointer;
        }

        span {
          color: #02adff;
          margin-left: -7px;
        }

        &.z-index {
          z-index: 9999;
        }
      }

      .guide-active {
        z-index: 9998;
        background: #fff;
        width: 280px;
        height: 155px;
        position: absolute;
        left: -10px;
        top: 19px;
        border-radius: 10px;

        img {
          position: absolute;
          left: -115px;
          top: 115px;
        }

        .guide-skip1 {
          position: absolute;
          width: 100px;
          height: 44px;
          left: -23px;
          bottom: -206px;
          cursor: pointer;
        }

        .guide-sign {
          position: absolute;
          width: 116px;
          height: 44px;
          left: 119px;
          bottom: -206px;
          cursor: pointer;
        }
      }
    }
  }

  .sign_list {
    width: 1200px;
    margin: auto;
    padding-bottom: 118px;

    .title {
      padding-bottom: 13px;
      font-size: 16px;
      color: #333333;

      .more {
        float: right;
        margin-right: 20px;
        color: #999999;
        cursor: pointer;

        .img {
          content: "";
          display: inline-block;
          width: 10px;
          height: 12px;
          background: url("../../../../static/image/more.png") no-repeat center !important;
          background-size: 10px 12px !important;
          margin-left: 6px;
        }
      }

      .more:hover .img {
        background: url("../../../../static/image/more_hover2.png") no-repeat
          center !important;
        background-size: 10px 12px !important;
      }

      .more:hover {
        color: #0073bd;
      }

      i {
        background: #02adff;
        width: 4px;
        height: 20px;
        display: inline-block;
        margin-right: 10px;
        vertical-align: middle;
      }
    }
  }
}

.guide-lead {
  width: 584px;
  height: 723px;
  position: absolute;
  background: url(../../../../static/image/guide-bg.svg) no-repeat;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;

  h6 {
    position: absolute;
    top: 126px;
    font-size: 16px;
    color: #333333;
    font-weight: normal;
    left: 125px;
  }

  .guide-close {
    position: absolute;
    width: 32px;
    height: 32px;
    top: 2px;
    right: 235px;
    cursor: pointer;
  }

  .guide-box {
    width: 355px;
    position: absolute;
    left: 143px;
    top: 206px;

    li {
      font-weight: bold;
      line-height: 20px;
      margin-bottom: 47px;

      a {
        color: #02adff;
        text-decoration: underline;
        font-weight: normal;
        font-size: 14px;
        display: inline-block;
        line-height: 20px;
      }

      p {
        font-size: 12px;
        color: #999999;
        font-weight: normal;
        padding-top: 4px;
      }
    }
  }
}

.revoke-dialog {
  .el-dialog {
    border-radius: 10px;
    width: 717px;

    .el-dialog__header {
      padding: 10px 20px;
      background: #e8ecef;
      border-radius: 10px 10px 0 0;

      .el-dialog__headerbtn {
        margin-top: 2px;
      }
    }

    .el-dialog__body {
      .bodybox {
        padding: 20px;

        .item {
          line-height: 36px;
          position: relative;

          .item-tit {
            font-size: 14px;
            color: #1f2d3d;
            display: inline-block;
            width: 80px;
          }

          .item-cont {
            font-size: 14px;
            color: #1f2d3d;
            width: 640px;
            text-overflow: ellipsis;
            white-space: nowrap;

            .el-input {
              width: 250px;

              .el-input__inner {
                background-color: #fff;
              }
            }
          }

          .getCodeBtn {
            font-size: 14px;
            color: #02adff;
            border: 1px solid #02adff;
            border-radius: 4px;
            line-height: 34px;
            display: inline-block;
            padding: 0 15px;
            position: absolute;
            right: 0;
            top: 0;
            margin-right: 7px;
            cursor: pointer;
          }
        }

        .item-textarea {
          textarea {
            width: 100%;
            height: 100%;
            border: 1px solid #e2e2e2;
            padding: 20px 10px;
            height: 150px;
          }
        }

        .contactInput {
          width: 240px;
          margin-right: 20px;

          input {
            background: none;
          }
        }

        .addBtn {
          background: #fafafa;
          border-color: #e2e2e2;

          span {
            color: #999;
          }

          .el-icon-plus:before {
            color: #e2e2e2;
          }
        }

        & > p {
          margin-bottom: 10px;
        }

        .tips {
          color: #626262;
          font-size: 14px;
          margin-top: 30px;

          p {
            font-size: 12px;
            padding: 6px 0;
          }
        }
      }
    }

    .footerbox {
      padding: 20px;
      text-align: center;

      .el-button {
        width: 80px;
      }
    }
  }
}

.el-popover {
  .popover-content {
    .item {
      position: relative;
      margin-bottom: 10px;

      .icon-num {
        font-size: 16px;
        margin-right: 5px;
      }

      .right-btn {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
}

.el-dropdown-menu__item {
  p {
    font-size: 12px;
    color: #999;

    &:hover {
      color: #0073bd;
    }
  }
}

.dropdown-btn {
  cursor: pointer;
  margin-left: 6px;
  display: inline-block;

  i {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 4px;
    border: 1px solid #999;
    background-color: #fff;
    margin-left: 4px;
    vertical-align: middle;
  }
}

.ukey-renewal-dialog {
  .el-dialog__body {
    width: 100%;
  }

  .content {
    width: 100%;
    height: 100%;

    .title {
      width: 100%;

      /* .title-left {
                    width: 60px;
                    float: left;
                }

                .title-right {
                    float: left;
                    width: calc(100% - 60px);
                } */

      /* .icon-safe {
                    position: relative;
                    transform: translateX(-105%) !important;
                    top: 0 !important;
                }

                span {
                    font-size: 18px;
                    height: 40px;
                    line-height: 40px;
                } */
    }
  }

  .footerbox {
    text-align: center;
    padding: 20px 0;
  }
}
</style>
<style lang="scss">
.ukey-renewal-dialog {
  .el-dialog__body {
    width: 100%;
    padding: 30px 40px 20px !important;
    .content {
      width: 100%;
      height: 100%;
      display: block;

      .title {
        width: 100%;

        .title-left {
          position: relative;
          width: 60px;
          float: left;

          .icon-safe {
            position: static !important;
            display: block;
            left: 0 !important;
            top: 50% !important;
            transform: translateY(50%) !important;
          }
        }

        .title-right {
          float: left;
          width: calc(100% - 60px);

          p {
            padding-left: 0 !important;
            line-height: 26px;
            height: 26px;
            color: #333;
            font-size: 18px !important;
          }

          .title-right-tips {
            color: #999;
            font-size: 14px;
            margin-top: 5px;
            margin-bottom: 30px;
          }
        }
      }
    }
  }
}
</style>
