<template>
    <div class="contract_signature contract_more">
        <div class="header">
            <span class="back" @click="back()">
                <i class="icon-back"></i>返回
            </span>
            <a href="/" class="logo">
                <img src="../../../../static/image/logo.png" alt />
            </a>
        </div>
        <div class="mian">
            <div class="left">
                <p class="title">合同文件</p>
                <ul class="contract_list">
                    <li
                        v-for="(info, index) in compactDocumentList"
                        @click="
                            contractInfo(
                                info.compactDocumentCode,
                                info.compactDocumentPage,
                                info.compactDocumentId,
                                info.compactDocumentType
                            )
                        "
                        :class="{
                            active: compactFileCode == info.compactDocumentId
                        }"
                        :key="index"
                    >
                        <div class="box-show">
                            <div class="img_box">
                                <img
                                    :src="
                                        info.compactFirstImagePath +
                                            '&compactId='+compactId+'&token=' +
                                            token
                                    "
                                />
                                <span
                                    class="autograph_tip"
                                    v-if="info.autographNumber"
                                ></span>
                                <span
                                    class="sign_tip"
                                    v-if="info.sealNumber"
                                ></span>
                                <label
                                    class="label"
                                    v-if="info.compactDocumentType == '02'"
                                >
                                    <i class="el-icon-upload-success">附件</i>
                                </label>
                            </div>
                        </div>
                        <p :title="info.compactDocumentName | fileName">
                            {{ info.compactDocumentName | fileName }}
                        </p>
                    </li>
                </ul>
            </div>
            <div class="center">
                <el-scrollbar id="scroll">
                    <!--<p class="page"><span id="pageNumber">{{pageNumber}}</span>/<span id="total">{{total}}</span></p>-->
                    <p class="pagetext">页码：{{ pageNumber }} / {{ total }}</p>
                    <div class="img_box" id="img_box">
                        <div
                            v-for="(fileinfo, index) in fileList"
                            class="list"
                            :key="index"
                        >
                            <img :src="fileinfo.imgUrl + '&compactId='+compactId + '&token=' + token" />
                        </div>
                    </div>
                    <ul class="goto-wrapper">
                        <!--首页-->
                        <li
                            class="first_page"
                            :class="{ first_page_last: pageNumber <= 1 }"
                            style="margin-top:40px;text-align: center;height: 24px;background: none;border: none;padding: 0;"
                        >
                            <a @click="firstPage()" style="color:#0677BF;"></a>
                        </li>
                        <!--上一页-->
                        <li
                            class="prev"
                            style="margin-top:0;"
                            :class="{ prev_last: pageNumber <= 1 }"
                        >
                            <a @click="scrollprev()"></a>
                            <!--:href=" '#scroll-'+ pageNumber"-->
                        </li>
                        <!--下一页-->
                        <li
                            class="next"
                            :class="{ next_last: pageNumber >= total }"
                        >
                            <a @click="scrollnext()"></a>
                            <!--:href=" '#scroll-'+ pageNumber"-->
                        </li>
                        <!--末页-->
                        <li
                            class="last_page"
                            :class="{ last_page_last: pageNumber == total }"
                            style="text-align: center;height: 24px;background: none;border: none;padding: 0;"
                        >
                            <a @click="lastPage()" style="color:#0677BF;"></a>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
            <div class="right" style="overflow-y: auto;">
                <!--01：草稿；02：已撤销；03：已拒签；04：签署中；05：签署完成；-->
                <p
                    class="state"
                    :class="{ stateing: state == '01', omplete: state == '02' }"
                >
                    {{
                        compactStatus == "01"
                            ? "草稿"
                            : compactStatus == "02"
                            ? "已撤销"
                            : compactStatus == "03"
                            ? "已拒签"
                            : compactStatus == "04"
                            ? "签署中"
                            : compactStatus == "05"
                            ? "签署完成"
                            : ""
                    }}
                </p>
                <ul>
                    <li>
                        <p class="lable">发起签署人</p>
                        <p class="value">{{ sponsor || "无" }}</p>
                    </li>
                    <li>
                        <p class="lable">发起时间</p>
                        <p class="value">{{ compactStartDate || "无" }}</p>
                    </li>
                    <li>
                        <p class="lable">签署截止时间</p>
                        <p class="value">{{ signDeadline || "无" }}</p>
                    </li>
                    <li>
                        <p class="lable">付费用户</p>
                        <p class="value">
                            {{ designedPeople }}
                        </p>
                    </li>
                    <li>
                        <p class="lable">合同编号</p>
                        <p class="value">{{ compactId }}</p>
                    </li>
                    <li>
                        <p class="lable">自定义合同编号</p>
                        <p class="value" :title="compactNo">{{compactNo || '无'}}</p>
                    </li>
                </ul>
                <div class="right_bottom">
                    <div class="flowChart" @click="getOrder">
                        <span class="singImg"></span>
                        <span>签署流程图</span>
                    </div>
                    <!-- compactStatusCode 合同所属状态描述(09:所有合同;08:待我签署;07:待他人签;06:即将截止签约;05:即将过期;04:签约完成;03:已拒签;02:已撤销;01:草稿箱)  -->
                    <!-- signStatus 签署状态（01：待我签署；02：待他人签；03：签署通过；04签署不通过） -->
                    <!-- compactStatus 合同状态（01：草稿；02：已撤销；03：已拒签；04：签署中；05：签署完成；）-->
                    <el-button
                        v-if="
                            ((signStatus == '02' || signStatus == '03') &&
                                userId == sponsorId &&
                                compactStatusCode == '06') ||
                                (userId == sponsorId &&
                                    compactStatusCode == '07') ||
                                (userId == sponsorId &&
                                    compactStatusCode == '08') ||
                                (userId == sponsorId && compactStatusCode == '11')
                        "
                        @click="backoutBtn()"
                        >撤销
                    </el-button>
                    <el-button
                        v-if="compactStatusCode == '02'"
                        @click="checkRevoke()"
                        >撤销原因</el-button
                    >
                    <el-button
                        v-if="
                            signStatus == '01' &&
                                (compactStatusCode == '08' ||
                                    compactStatusCode == '06')
                        "
                        @click="deniedBtn()"
                        >拒签
                    </el-button>
                    <el-button
                        v-if="compactStatusCode == '03'"
                        @click="checkDenied()"
                        >拒签原因</el-button
                    >
                    <el-button
                        v-if="
                            signStatus == '01' &&
                                (compactStatusCode == '08' ||
                                    compactStatusCode == '06')
                        "
                        @click="noSign()"
                        >转签
                    </el-button>
                    <el-button
                        v-if="
                            signStatus == '01' &&
                                (compactStatusCode == '08' ||
                                    compactStatusCode == '06')
                        "
                        type="primary"
                        @click="sureSign()"
                        >去签署
                    </el-button>
                    <button
                        v-if="
                            (signStatus == '02' || signStatus == '03') &&
                                (compactStatusCode == '07' ||
                                    compactStatusCode == '06')
                        "
                        class="copybtn el-button el-button--default"
                        :data-clipboard-text="href"
                    >
                        复制签署链接
                    </button>
                    <el-button
                        v-if="
                            (signStatus == '02' || signStatus == '03') &&
                                (compactStatusCode == '07' ||
                                    compactStatusCode == '06')
                        "
                        type="primary"
                        @click="rushSign()"
                        >催签
                    </el-button>
                    <el-button
                        v-if="
                            compactStatusCode == '01' ||
                                compactStatusCode == '02' ||
                                compactStatusCode == '03' ||
                                compactStatusCode == '04' ||
                                compactStatusCode == '05'
                        "
                        @click="download(fileNameTxt, compactId)"
                        >下载
                    </el-button>
                    <el-button
                        v-if="
                            compactStatusCode == '01' ||
                                compactStatusCode == '02' ||
                                compactStatusCode == '03' ||
                                (compactStatusCode == '05' &&
                                    compactStatus != '05')
                        "
                        @click="deleteFile"
                        >删除
                    </el-button>
                    <el-button
                        v-if="compactStatusCode == '01'"
                        @click="continueSign"
                        >继续</el-button
                    >
                    <el-button
                        v-if="compactStatusCode == '04'"
                        @click="checkEvidence()"
                        :loading="btnload"
                        >申请司法仲裁
                    </el-button>
                    <el-button
                        v-if="compactStatusCode == '04' && isShowReportDownloadBtn"
                        @click="downloadCompactReport"
                        :loading="btnloading"
                        >
                        存证报告下载
                    </el-button>
                    <div
                        v-if="remake.length > 0"
                        style="margin: 20px auto;width:178px;text-align: left;border: 1px dotted #d6d6d6;padding: 10px;border-radius: 5px;"
                    >
                        <span style="font-weight: bold;color:#636363;"
                            >备注：</span
                        >
                        <div
                            style="color: #929090;font-size: 12px;margin-top: 5px;"
                        >
                            {{ remake }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            title
            :visible.sync="showFlag"
            id="revokeFile"
            class="revokeFile"
            :close-on-click-modal="false"
            :before-close="beforeClose"
        >
            <div class="box">
                <div class="title">
                    签署流程：
                    <span class="state">{{
                        signWay == "01"
                            ? "无序签署"
                            : signWay == "02"
                            ? "顺序签署"
                            : signWay == "03"
                            ? "每人单独签署"
                            : ""
                    }}</span>
                </div>
                <div class="fileBox">
                    <p class="title">{{ compactTheme }}</p>
                    <p class="info">
                        <label>状态</label>
                        <span class="color_666">{{
                            compactStatus == "01"
                                ? "草稿"
                                : compactStatus == "02"
                                ? "已撤销"
                                : compactStatus == "03"
                                ? "已拒签"
                                : compactStatus == "04"
                                ? "签署中"
                                : compactStatus == "05"
                                ? "签署完成"
                                : compactStatus == "06"
                                ? "待完善"
                                : ""
                        }}</span>
                        <label v-if="signDeadline">签署截止倒计时</label>
                        <span class="color_666">{{ countdown }}</span>
                    </p>
                    <el-scrollbar style="height:400px">
                        <ul class="signList">
                            <li>
                                <el-row>
                                    <el-col :span="4">
                                        <span>发起人</span>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-tooltip
                                            :content="sponsor"
                                            placement="top"
                                            effect="light"
                                        >
                                            <div
                                                style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"
                                            >
                                                {{ sponsor || "暂无" }}
                                            </div>
                                        </el-tooltip>
                                    </el-col>
                                    <el-col :span="10">
                                        <span class="color_999"
                                            >发起时间：</span
                                        >
                                        <span>{{
                                            compactStartDate || "无"
                                        }}</span>
                                    </el-col>
                                </el-row>
                            </li>
                            <li
                                v-if="compactStatus != '01'"
                                :key="index"
                                v-for="(item, index) in signatoryList"
                            >
                                <el-row
                                    v-if="
                                        item.signStatus == '01' ||
                                            item.signStatus == '02' ||
                                            item.signStatus == '03'
                                    "
                                >
                                    <el-col :span="4">
                                        <span>{{
                                            item.turnSignFlag == 1
                                                ? "转签方"
                                                : "签署人"
                                        }}</span>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-tooltip
                                            :content="item.compactSignatoryName"
                                            placement="top"
                                            effect="light"
                                            v-if="item.turnSignFlag == 0"
                                        >
                                            <div
                                                style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"
                                            >
                                                {{
                                                    item.compactSignatoryName ||
                                                        "暂无"
                                                }}
                                            </div>
                                        </el-tooltip>
                                        <el-tooltip
                                            :content="
                                                `${item.compactSignatoryName}转签给${item.turnSignName}`
                                            "
                                            placement="top"
                                            effect="light"
                                            v-if="item.turnSignFlag == 1"
                                        >
                                            <div
                                                style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"
                                            >
                                                {{
                                                    item.compactSignatoryName +
                                                        "转签给" +
                                                        item.turnSignName ||
                                                        "暂无"
                                                }}
                                            </div>
                                        </el-tooltip>
                                    </el-col>
                                    <el-col :span="10">
                                        <span class="color_999">{{
                                            item.turnSignFlag == 1
                                                ? "转签时间："
                                                : "签署时间："
                                        }}</span>
                                        <span v-if="item.turnSignFlag == 0">{{
                                            item.signDate || "暂未签署"
                                        }}</span>
                                        <span v-if="item.turnSignFlag == 1">{{
                                            item.turnDate || "暂未签署"
                                        }}</span>
                                    </el-col>
                                </el-row>
                                <el-row v-if="item.signStatus == '04'">
                                    <el-col :span="4">
                                        <span>拒签人</span>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-tooltip
                                            :content="item.compactSignatoryName"
                                            placement="top"
                                            effect="light"
                                        >
                                            <div
                                                style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"
                                            >
                                                {{
                                                    item.compactSignatoryName ||
                                                        "暂无"
                                                }}
                                            </div>
                                        </el-tooltip>
                                    </el-col>
                                    <el-col :span="10">
                                        <span class="color_999"
                                            >拒签时间：</span
                                        >
                                        <span>{{ item.signDate || "无" }}</span>
                                    </el-col>
                                </el-row>
                            </li>
                            <li v-if="compactStatus == '02'">
                                <el-row>
                                    <el-col :span="4">
                                        <span>撤销人</span>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-tooltip
                                            :content="sponsor"
                                            placement="top"
                                            effect="light"
                                        >
                                            <div
                                                style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"
                                            >
                                                {{ sponsor || "暂无" }}
                                            </div>
                                        </el-tooltip>
                                    </el-col>
                                    <el-col :span="10">
                                        <span class="color_999"
                                            >撤销时间：</span
                                        >
                                        <span>{{
                                            compactRevocationDate || "无"
                                        }}</span>
                                    </el-col>
                                </el-row>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
            </div>
        </el-dialog>
        <!-- <contractmoreconfirm v-if="signOrderFlag" ></contractmoreconfirm> -->
        <el-dialog
            title="撤销"
            :visible.sync="backoutShowFlag"
            class="backoutDialog"
        >
            <div class="bodybox">
                <div class="item">
                    <span class="item-tit">撤销合同:</span>
                    <span class="item-cont">{{ fileNameTxt }}</span>
                </div>
                <div class="item">
                    <span style="font-size: 14px;color: #626262;"
                        >撤销原因</span
                    >
                </div>
                <div class="item-textarea">
                    <el-input type="textarea" v-model="reasonTxt"></el-input>
                </div>
            </div>
            <div class="footerbox">
                <el-button @click="backoutShowFlag = false">取 消</el-button>
                <el-button type="primary" @click="backoutSubmit()"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <el-dialog
            title="查看撤销原因"
            :visible.sync="checkBackoutShowFlag"
            class="backoutDialog"
        >
            <div class="bodybox">
                <div class="item">
                    <span class="item-tit">撤销合同:</span>
                    <span class="item-cont">{{ fileNameTxt }}</span>
                </div>
                <div class="item-textarea">
                    <el-input
                        type="textarea"
                        readonly
                        v-model="reasonTxt"
                    ></el-input>
                </div>
            </div>
            <div class="footerbox">
                <el-button type="primary" @click="checkBackoutShowFlag = false"
                    >知道了</el-button
                >
            </div>
        </el-dialog>

        <el-dialog
            title="拒签"
            :visible.sync="deniedShowFlag"
            class="backoutDialog"
        >
            <div class="bodybox">
                <div class="item">
                    <span class="item-tit">拒签合同:</span>
                    <span class="item-cont">{{ fileNameTxt }}</span>
                </div>
                <div class="item">
                    <span style="font-size: 14px;color: #626262;"
                        >拒签原因</span
                    >
                </div>
                <div class="item-textarea">
                    <el-input type="textarea" v-model="reasonTxt"></el-input>
                </div>
            </div>
            <div class="footerbox">
                <el-button @click="deniedShowFlag = false">取 消</el-button>
                <el-button type="primary" @click="deniedSubmit()"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <el-dialog
            title="查看拒签原因"
            :visible.sync="checkDeniedShowFlag"
            class="backoutDialog"
        >
            <div class="bodybox">
                <div class="item">
                    <span class="item-tit">拒签合同:</span>
                    <span class="item-cont">{{ fileNameTxt }}</span>
                </div>
                <div class="item-textarea">
                    <el-input
                        type="textarea"
                        readonly
                        v-model="deniedTxt"
                    ></el-input>
                </div>
            </div>
            <div class="footerbox">
                <el-button type="primary" @click="checkDeniedShowFlag = false"
                    >知道了</el-button
                >
            </div>
        </el-dialog>

        <el-dialog
            title="转签"
            :visible.sync="transferDialog"
            class="trunSignDialog"
            :before-close="transferClose"
        >
            <div class="bodybox">
                <p>添加联系人</p>
                <el-input
                    v-model="transferData.signContact"
                    placeholder="手机号/邮箱"
                    @blur="userAllId()"
                    class="contactInput"
                ></el-input>

                <el-select
                    v-if="identityList.length > 0"
                    v-model="transferData.identityNum"
                    @change="operatorChange($event)"
                    class="contactInput"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in identityList"
                        :key="item.id"
                        :label="item.idName"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-input
                    v-else
                    v-model="transferData.signName"
                    placeholder="姓名/企业名"
                    class="contactInput"
                ></el-input>

                <el-button icon="plus" class="addBtn" @click="addContact"
                    >从联系人添加</el-button
                >
                <div class="tips">
                    温馨提示
                    <p>1、最好可以从联系人中选取转签人/企业；</p>
                    <p>2、不建议填写不在联系人中的企业和个人进行签署；</p>
                </div>
            </div>
            <div class="footerbox">
                <el-button @click="transferClose">取 消</el-button>
                <el-button type="primary" @click="transferSubmit()"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <el-dialog
            title="仲裁说明"
            :visible.sync="arbitrationDialog"
            class="backoutDialog arbitrationDialog"
        >
            <div class="bodybox">
                <p>
                    当前合同存证数据我们已经同步至微众银行区块链上的广州仲裁委节点上，如果您要进行司法裁决，可以向广州仲裁委提出申请后出具仲裁书。
                </p>
                <div class="tips">
                    <p style="margin-bottom:10px;color: #282828;">
                        申请仲裁方法如下：
                    </p>
                    <p>1、进入广州仲裁委官网上有“网络仲裁”入口；</p>
                    <p>2、完成注册完成，登录后，提交申请仲裁；</p>
                    <p>3、提交资料时候可以同步提交证据链上地址；</p>
                </div>
                <p style="margin-top:16px;font-size: 14px;">
                    证据链上地址：<span style="color: #20a0ff;">{{
                        evidenceAddress
                    }}</span>
                </p>
                <p style="color:#999;margin-top:16px;font-size: 14px;">
                    说明：
                    为了后续更为方便用户申请仲裁，我们会尽快和广州仲裁委或其他司法机构进行系统对接，线上直接一键仲裁。
                </p>
            </div>
            <div class="footerbox">
                <el-button @click="arbitrationDialog = false">取 消</el-button>
                <el-button type="primary" @click="arbitrationOrgUrl()"
                    >确 定</el-button
                >
            </div>
        </el-dialog>

        <el-dialog
            title="下载验证校验"
            :visible.sync="downloadDialog"
            class="backoutDialog2"
        >
            <div class="bodybox">
                <div class="dialog-body">
                    <el-form
                        ref="formTab"
                        label-width="110px"
                        label-position="right"
                    >
                        <el-form-item label="手机号码">
                            <span>{{ phoneNum }}</span>
                            <el-button
                                style="float:right;width:100px;"
                                class="codebtn"
                                @click="getPhoneCode"
                                >{{
                                    countdown2 == 0
                                        ? "获取验证码"
                                        : countdown2 + "s"
                                }}
                            </el-button>
                        </el-form-item>
                        <el-form-item label="短信验证码" prop="verify">
                            <el-input
                                v-model="verify"
                                placeholder="请输入短信验证码"
                                :maxlength="6"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="footerbox">
                <el-button @click="dialogClose">取 消</el-button>
                <el-button type="primary" @click="next">下一步</el-button>
            </div>
        </el-dialog>

        <!--添加联系人弹窗-->
        <contractpeoplehub
            v-model="contractalert"
            v-on:contractalert="contractalertfn"
            type="transfer"
        ></contractpeoplehub>
    </div>
</template>

<script>
import base from "../mixin/base";
import contractmoreconfirm from "./contractmoreconfirm.vue";
import contractpeoplehub from "./contractpeoplehub.vue";
import { checkBlobFileResponseUtils } from "@/utils";

export default {
    mixins: [base],
    components: { contractmoreconfirm, contractpeoplehub },
    data() {
        return {
            compactTheme: "",
            autographType: true,
            signatureMethod: "01",
            state: "01",
            list: [],
            value: "",
            color: [
                "#0088B6",
                "#BC8F8F",
                "#008877",
                "#FFC1C1",
                "#66B355",
                "#CD5C5C",
                "#BDB76B",
                "#FF6A6A",
                "#DAA520",
                "#B8860B"
            ],
            confirm: false,
            type: true,
            compactId: "",
            compactStatusCode: "",
            signOrderFlag: false,
            compactDocumentList: [],
            compactFileCode: "",
            fileList: [],
            pageNumber: 1,
            total: 1,
            compactStatus: "",

            compactStartDate: "",
            // 是否显示 `存证报告下载` 按钮，2020/10/01 之前的旧合同不显示
            isShowReportDownloadBtn: false,
            btnloading: false,

            signDeadline: "",
            sponsor: "",
            signList: [],
            paymentMethod: "",
            showFlag: false,
            signatoryList: "",
            signWay: "",
            countdown: "",
            countdown2: "",
            userId: JSON.parse($.cookie("userinfo")).userId,
            reasonTxt: "",
            deniedTxt: "",
            fileNameList: [],
            fileNameTxt: "",
            backoutShowFlag: false,
            checkBackoutShowFlag: false,
            deniedShowFlag: false,
            checkDeniedShowFlag: false,
            sponsorId: "",
            signStatus: "",
            transferDialog: false,
            transferData: {
                signName: "",
                signContact: "",
                identityNum: ""
            },
            contractalert: false,
            turnSignName: "",
            href: "",
            compactStep: "",
            sponsorTime: "",
            compactRevocationDate: "",
            arbitrationDialog: false,
            idType: "",
            idNum: "",
            userType: JSON.parse($.cookie("userinfo")).userType,
            btnload: false,
            evidenceAddress: "",
            downloadDialog: false,
            phoneNum: "",
            verify: "",
            isCode: true,
            isFileSafety: false,
            currFileName: "",
            currFileId: "",
            remake: "",
            identityList: [],
            realNameAuthenticationFlag: JSON.parse($.cookie("userinfo"))
                .realNameAuthenticationFlag,
            token: sessionStorage.getItem('token'),
            source:'',
            compactNo:'',
            designedPeople: '',
            nowTime: +new Date()
        };
    },
    mounted() {
        this.getUserInfo();
        var clipboard = new ClipboardJS(".copybtn");
        this.href = window.location.href;
        this.copySignLink(clipboard);
        var that = this;
        this.source = this.$route.query.source;
        this.compactId = this.$route.query.id;
        this.compactStatusCode = this.$route.query.status;
        this.compactStep = this.$route.query.compactStep;
        this.signStatus = this.$route.query.signStatus; //01：待我签署；02：待他人签；03：签署通过；04签署不通过（拒签）
        this.fileNameTxt = this.$route.query.compactTheme;
        this.compactMore(this.compactId).then(res => {
            if (this.successCheckCode(res)) {
                var docfile = res.data.compactDocumentList,
                    arr1 = [],
                    arr2 = [];
                //保证合同在前附件在后
                docfile.map(res => {
                    if (res.compactDocumentType == "01") {
                        arr1.push(res);
                    } else {
                        arr2.push(res);
                    }
                });
                docfile = arr1.concat(arr2);
                this.compactDocumentList = docfile;
                this.total = this.compactDocumentList[0].compactDocumentPage;
                this.compactDocumentId = this.compactDocumentList[0].compactDocumentCode;
                this.compactFileCode = this.compactDocumentList[0].compactDocumentId;
                this.compactStatus = res.data.compactStatus;
                this.compactStartDate = res.data.compactStartDate;

                if (new Date(res.data.compactStartDate.replace(/-/g, '/')).getTime() > new Date('2020/10/24 00:00:00').getTime()) {
                    // *规定：合同发起大于 2020/10/24 的才可以下载存证
                    this.isShowReportDownloadBtn = true
                }

                this.signDeadline = res.data.signDeadline;
                this.sponsor = res.data.sponsor;
                this.sponsorId = res.data.sponsorUserId;
                this.paymentMethod = res.data.paymentMethod;
                this.designedPeople = res.data.designedPeople;
                this.fileList = [
                    {
                        imgUrl:
                            "/compact/file/page?fileCode=" +
                            this.compactDocumentList[0].compactDocumentCode +
                            "&pageNo=1" +
                            "&t=" + this.nowTime
                    }
                ];

                this.reasonTxt = res.data.revocationRemake;
                this.deniedTxt = res.data.refuseSignRemake;
            }
        });
        let self = this;
        let index = 0;
        $("#scroll .el-scrollbar__wrap").scroll(function() {
            if (index == 0) {
                self.scrollHeight = 1100 + 26 * 2 + 60 - $("#scroll").height();
                if ($(this).scrollTop() == self.scrollHeight) {
                    index++;
                    setTimeout(function() {
                        self.loadMore();
                        index = 0;
                    }, 500);
                }
            }
            if ($(this).scrollTop() == 0) {
                index = 0;
                setTimeout(function() {
                    self.loadprev();
                }, 200);
            }
        });

        this.getContractBasicInfo();

        if (document.addEventListener) {
            document.addEventListener("DOMMouseScroll", this.scrollFn, false);
        } //W3C
        window.onmousewheel = document.onmouseenter = this.scrollFn; //IE/OPERA/CHROME/SAFARI
    },
    beforeRouteLeave(to, from, next) {
        if (document.addEventListener) {
            document.removeEventListener(
                "DOMMouseScroll",
                this.scrollFn,
                false
            );
        }
        window.onmousewheel = document.onmouseenter = null;
        next();
    },
    created() {
        $(document).ready(function() {
            $(".el-scrollbar__wrap").scroll(function() {
                //
                var srollPos = $(this).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
                let scrollHeight =
                    parseFloat($(this).height()) + parseFloat(srollPos);
                let totalHeight = $("#draggable_box").height();

                if (totalHeight == scrollHeight - 30) {
                    console.log(1);
                }
            });
        });
        if (
            window.devicePixelRatio &&
            window.devicePixelRatio != 1 &&
            !this.$parent.isMac
        ) {
            this.$message.warning(
                "为保证文件翻页体验，需调整浏览器缩放比例至100%"
            );
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
    filters: {
        fileName: function(name) {
            return name.substring(0, name.lastIndexOf("."));
        }
    },
    methods: {
        getOrder() {
            this.showFlag = true;
            var that = this;
            that.signOrder(that.compactId).then(res => {
                if (that.successCheckCode(res)) {
                    that.signWay = res.data.signWay;
                    that.sponsor = res.data.sponsor;
                    that.sponsorTime = res.data.compactStartDate;
                    that.compactRevocationDate = res.data.compactRevocationDate;
                    that.compactStatus = res.data.compactStatus;
                    that.signatoryList = res.data.signatoryList;
                    that.compactTheme = res.data.compactTheme;
                    that.signDeadline = res.data.signDeadline;
                    res.data.signatoryList.map((ele, index) => {
                        //获取转签人名称
                        if (ele.turnSignFlag == 1) {
                            // res.data.signatoryList.map(value =>{
                            //     if(ele.turnToId == value.id){
                            //         this.turnSignName = value.compactSignatoryName
                            //     }
                            // })
                            ele.turnSignName =
                                res.data.signatoryList[
                                    index + 1
                                ].compactSignatoryName;
                        }
                    });
                    if (that.signDeadline) {
                        var current = res.data.currentDate.replace(/-/g, "/");
                        current = new Date(current); //转为时间戳
                        var timeStr = new Date(
                            that.signDeadline.replace(/-/g, "/")
                        );
                        timeStr = timeStr.getTime();
                        var dateDiff = timeStr - current;
                        if (dateDiff > 0) {
                            this.countdownFn(dateDiff);
                            window.countDown = setInterval(() => {
                                dateDiff -= 1000;
                                this.countdownFn(dateDiff);
                            }, 1000);
                        } else {
                            this.countdown = "0天0时0分0秒";
                        }
                    }
                }
            });
        },
        userAllId() {
            var contactNum = this.transferData.signContact.replace(
                /(^\s*)|(\s*$)/g,
                ""
            );
            if (contactNum.length < 1) {
                return false;
            }
            if (
                this.transferData.signContact !=
                this.transferData.oldSignContact
            ) {
                this.transferData.oldSignContact = this.transferData.signContact;
            } else {
                return false;
            }
            this.$set(this.transferData, "signName", "");
            this.$set(this.transferData, "identityNum", "");
            this.getUserAllId(contactNum).then(res => {
                if (this.successCheckCode(res)) {
                    this.identityList = res.data.identityOnes
                        ? res.data.identityOnes
                        : [];
                    if (res.data.identityOnes.length == 1) {
                        this.$set(
                            this.transferData,
                            "identityNum",
                            res.data.identityOnes[0].id
                        );
                        this.$set(
                            this.transferData,
                            "signName",
                            res.data.identityOnes[0].idName
                        );
                    }
                    console.log(this.identityList);
                }
            });
        },
        operatorChange(val) {
            console.log(val);
            this.transferData.identityNum = val;
            var list = this.identityList;
            for (var i = 0; i < list.length; i++) {
                if (val == list[i].id) {
                    this.transferData.signName = list[i].idName;
                }
            }
        },
        getContractBasicInfo() {
            this.editCompact(this.compactId).then(res => {
                if (this.successCheckCode(res)) {
                    this.remake = res.data.remake ? res.data.remake : "";
                    this.compactNo = res.data.compactNo?res.data.compactNo:'';
                }
            });
        },
        downloadfile(name, id, ...rest) {
            // `...rest` 主要是用来传递一些定制参数 

            let _self = this;
            // 下载
            var data = {
                compactId: id,
                userId: JSON.parse($.cookie("userinfo")).userId
            };
            // var xhr = new XMLHttpRequest();
            var xhr;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xhr = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.open("POST", rest[0] || "/api/compact/package/download");
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Authorization", sessionStorage.getItem('token'));
            xhr.responseType = "blob";
            xhr.send(JSON.stringify(data));
            xhr.onreadystatechange = function() {
                _self.btnloading = false

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
                                } catch (e) {}
                                document.body.appendChild(elink);
                                elink.click();
                                URL.revokeObjectURL(elink.href);
                                document.body.removeChild(elink);
                            }
                        })
                        .catch(errMsg => {
                            _self.$message({
                                type: "warning",
                                message: errMsg
                            });
                        });
                } else {
                }
            };
        },
        countdownFn(dateDiff) {
            if (dateDiff < 1000) {
                this.countdown = "0天0时0分0秒";
                clearInterval(countDown);
            }
            var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算相差天数
            var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000)); //计算相差小时数
            hours = hours > 9 ? hours : "0" + hours;
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
            minutes = minutes > 9 ? minutes : "0" + minutes;
            //计算相差秒数
            var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000);
            seconds = seconds > 9 ? seconds : "0" + seconds;
            this.countdown =
                dayDiff + "天" + hours + "时" + minutes + "分" + seconds + "秒";
        },
        getUserInfo() {
            if (this.userType == "02") {
                this.personDetail().then(res => {
                    if (this.successCheckCode(res)) {
                        this.idType = "02";
                        this.idNum = res.data.identityCard;
                        this.phoneNum = res.data.phone;
                        this.isFileSafety = res.data.compactDownloadValidate
                            ? true
                            : false;
                    }
                });
            } else {
                this.enterpriseDetail().then(res => {
                    if (this.successCheckCode(res)) {
                        this.idType = "01";
                        this.idNum = res.data.enterpriseCertificateNo;
                        this.phoneNum = res.data.linkManPhone;
                        this.isFileSafety = res.data.compactDownloadValidate
                            ? true
                            : false;
                    }
                });
            }
        },
        checkEvidence() {
            console.log(this.realNameAuthenticationFlag);
            if (this.realNameAuthenticationFlag == "0") {
                this.$message({
                    message: "签署人未实名，无法进行司法仲裁",
                    type: "error",
                    duration: 2000
                });
                return;
            }
            this.btnload = true;
            this.getEvidenceInfo({
                compactId: this.compactId,
                idNum: this.idNum,
                idType: this.idType
            })
                .then(res => {
                    if (this.successCheckCode(res)) {
                        if (res.data.fileEvidences.length > 0) {
                            this.evidenceAddress =
                                res.data.fileEvidences[0].evidenceAddress;
                            this.arbitrationDialog = true;
                        } else {
                            this.$message({
                                message: "存证数据正在同步，请稍后再试",
                                type: "warning",
                                duration: 2000
                            });
                            return;
                        }
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "error",
                            duration: 2000
                        });
                    }
                    this.btnload = false;
                })
                .fail(res => {
                    this.$message({
                        message: res.msg,
                        type: "error",
                        duration: 2000
                    });
                    this.btnload = false;
                });
        },
        // 存证报告下载
        downloadCompactReport() {
            console.log(this.compactTheme);
            this.btnloading = true

            this.downloadfile(
                this.fileNameTxt || '存证报告', 
                this.compactId,
                '/api/compact/report/download'
            )            
        },

        arbitrationOrgUrl() {
            window.open("http://www.gzac.org");
        },
        beforeClose() {
            this.showFlag = false;
            this.signWay = "";
            this.signatoryList = "";
            this.compactTheme = "";
            if (window.countDown) {
                clearInterval(countDown);
            }
        },
        contractInfo(code, total, id, compactDocumentType) {
            this.compactDocumentType = compactDocumentType;
            this.compactFileCode = id; // 默认是compactDocumentList数组第一个值的compactFileCode
            this.compactDocumentId = code;
            this.total = total;
            this.pageNumber = 1;
            $("#scroll .el-scrollbar__wrap").scrollTop(0);
            this.fileList = [
                {
                    imgUrl:
                        "/compact/file/page?fileCode=" +
                        this.compactDocumentId +
                        "&pageNo=1"
                }
            ];
        },
        loadMore() {
            if (this.pageNumber >= this.total) {
                // this.busy = true;
                this.nomore = false;
                return;
            }
            this.pageNumber++;
            let data = {
                imgUrl:
                    "/compact/file/page?fileCode=" +
                    this.compactDocumentId +
                    "&pageNo=" +
                    this.pageNumber
            };
            this.fileList = [data];
            $("#scroll .el-scrollbar__wrap").animate({ scrollTop: 1 }, 100);
        },
        loadprev() {
            if (this.pageNumber <= 1) {
                // this.busy = true;
                this.nomore = false;
                return;
            }
            this.pageNumber--;
            let data = {
                imgUrl:
                    "/compact/file/page?fileCode=" +
                    this.compactDocumentId +
                    "&pageNo=" +
                    this.pageNumber
            };
            this.fileList = [data];
            $("#scroll .el-scrollbar__wrap").animate({ scrollTop: 5 }, 200);
        },
        scrollnext() {
            this.loadMore();
        },
        scrollprev() {
            this.loadprev();
        },
        chosseSign(type) {
            this.signatureMethod = type;
        },
        back() {
            history.go(-1);
        },
        meSign() {},
        sureSign() {
            this.checkPermission(
                // 权限校验
                this.$perMap.contractMgt.signature.url,
                this.$perMap.contractMgt.signature.method
            ).then(res => {
                if (!this.successCheckCode(res)) {
                    return;
                }
                if (this.source == '2') {
                    // 模板签署
                    this.detail(this.compactId).then((res) => {
                        console.log(res);
                        if (this.successCheckCode(res)) {
                            let nowUser = res.data.compactSignatoryList.find((v) => v.signContact === this.userinfo.loginName);
                            let query = {
                                editType: '01',
                                isTemp: '1'
                            };
                            nowUser.fillFieldFlag === 1 ? (query.compactId = this.compactId) : (query.id = this.compactId);
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
                        query: { compactId: this.compactId, editType: '01' }
                    });
                }
            });
            // this.renew();
        },
        noSign() {
            this.checkPermission(
                // 权限校验
                this.$perMap.contractMgt.contractTransfer.url,
                this.$perMap.contractMgt.contractTransfer.method
            ).then(res => {
                if (!this.successCheckCode(res)) {
                    return;
                }
                this.transferDialog = true;
            });
        },
        backoutBtn() {
            this.backoutShowFlag = true;
        },
        deniedBtn() {
            this.checkPermission(
                // 权限校验
                this.$perMap.contractMgt.refuse.url,
                this.$perMap.contractMgt.refuse.method
            ).then(res => {
                if (!this.successCheckCode(res)) {
                    return;
                }
                this.deniedShowFlag = true;
            });
        },
        setContractBackout() {
            var that = this;
            if (!that.reasonTxt) {
                this.$message({
                    message: "请输入撤销原因",
                    type: "error",
                    duration: 2000
                });
                return;
            }
            if (that.reasonTxt.length > 100) {
                this.$message({
                    message: "撤销原因不能超过100个汉字",
                    type: "error",
                    duration: 2000
                });
                return;
            }
            this.contractBackout({
                contractId: that.compactId,
                initiatorId: that.userId,
                remark: that.reasonTxt
            }).then(res => {
                if (this.successCheckCode(res)) {
                    this.$message({
                        message: "撤销成功",
                        type: "success",
                        duration: 2000
                    });
                    that.backoutShowFlag = false;
                    that.$router.push("/contractlist");
                } else {
                    this.$message({
                        message: res.msg,
                        type: "error",
                        duration: 2000
                    });
                }
            });
        },
        backoutSubmit() {
            this.setContractBackout();
        },
        setContractDenied() {
            var that = this;
            if (!that.reasonTxt) {
                this.$message({
                    message: "请输入拒签原因",
                    type: "error",
                    duration: 2000
                });
                return;
            }
            if (that.reasonTxt.length > 100) {
                this.$message({
                    message: "拒签原因不能超过100个汉字",
                    type: "error",
                    duration: 2000
                });
                return;
            }
            this.contractDenied({
                contractId: that.compactId,
                userId: that.userId,
                remark: that.reasonTxt
            }).then(res => {
                if (this.successCheckCode(res)) {
                    this.$message({
                        message: "拒签成功",
                        type: "success",
                        duration: 2000
                    });
                    that.deniedShowFlag = false;
                    that.$router.push("/contractlist");
                } else {
                    this.$message({
                        message: res.msg,
                        type: "error",
                        duration: 2000
                    });
                }
            });
        },
        deniedSubmit() {
            this.setContractDenied();
        },
        //1 续费
        renew() {
            this.$message({
                dangerouslyUseHTMLString: true,
                message:
                    "对不起，您的套餐已用完，请前往购买。<a href=''>去购买套餐</a>",
                type: "warning",
                duration: 1000
            });
            this.sign();
        },
        // 2 是否签名
        sign() {
            if (this.signList == 0) {
                this.$confirm(
                    "当前模板没有设置签署人签名位置，建议请先进行设置。",
                    "友情提示",
                    {
                        confirmButtonText: "立即设置",
                        cancelButtonText: "忽略",
                        customClass: "self-icon icon-position"
                    }
                )
                    .then(() => {
                        // 调用草稿箱接口
                        this.signCheck();
                    })
                    .catch(() => {});
            }
        },
        //3 签署校验
        signCheck() {
            let obj = {
                inputPattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,})$/,
                inputErrorMessage: "密码格式不正确",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            };
            this.$prompt("签署密码", "签署校验", obj)
                .then(({ value }) => {
                    obj.inputErrorMessage =
                        "密码错误，剩余3次机会，用完将被冻结1小时";
                    this.signConfirm();
                })
                .catch(() => {});
        },
        // 发起签署信息确认
        signConfirm() {
            this.confirm = true;
        },
        childByValue(value) {
            console.log(value);
            this.confirm = value;
        },
        fileNameFormat(name) {
            return name.substring(0, name.lastIndexOf("."));
        },
        checkRevoke() {
            this.checkBackoutShowFlag = true;
        },
        checkDenied() {
            this.checkDeniedShowFlag = true;
        },
        rushSign() {
            this.contractRush(this.compactId).then(res => {
                if (this.successCheckCode(res)) {
                    this.$message.success("催签成功");
                }
            });
        },
        checkEmail(str) {
            var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
            if (re.test(str)) {
                alert("正确");
            } else {
                alert("错误");
            }
        },
        transferSubmit() {
            if (this.transferData.signName === "") {
                this.$message.error("请输入姓名/企业名");
                return false;
            }
            if (this.transferData.signContact === "") {
                this.$message.error("请输入手机号/邮箱");
                return false;
            }
            if (
                this.identityList.length &&
                this.transferData.identityNum === ""
            ) {
                this.$message.error("请输入姓名/企业名");
                return false;
            }
            var v_email = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
            var v_mobPhone = /^1\d{10}$/;
            if (
                !v_email.test(this.transferData.signContact) &&
                !v_mobPhone.test(this.transferData.signContact)
            ) {
                this.$message.error("请输入正确的手机号/邮箱");
                return false;
            }
            this.transferData.identityNum = !!this.transferData.identityNum
                ? this.transferData.identityNum
                : this.transferData.signName;

            var realDesignatedPeople = '';
            //转签选择子账户时获取子账户手机号
            this.identityList.forEach(ele => {
                if(ele.id == this.transferData.identityNum){
                    realDesignatedPeople = ele.accountNumber;
                }
            })
            let data = {
                contractId: this.compactId,
                signContact: this.transferData.signContact,
                signName: this.transferData.signName,
                identityNum: this.transferData.identityNum,
                realDesignatedPeople
            }
            this.contractTransfer(data).then(res => {
                if (this.successCheckCode(res)) {
                    this.$message.success("转签成功");
                    this.transferClose();
                    setTimeout(() => {
                        this.$router.push({
                            path: "/contractlist",
                            query: { type: "07" }
                        });
                    }, 1500);
                }
            });
        },
        transferClose() {
            this.identityList = [];
            this.transferDialog = false;
            this.transferData = {};
        },
        copySignLink(clipboard) {
            clipboard.on("success", e => {
                this.$message.success("签署链接复制成功");
            });
            clipboard.on("error", e => {
                this.$message.error("签署链接复制失败");
            });
        },
        addContact() {
            this.contractalert = true;
        },
        contractalertfn(data) {
            console.log(data);
            if (data.length > 0) {
                this.getUserAllId(data[0].contactsWay).then(res => {
                    if (this.successCheckCode(res)) {
                        this.identityList = res.data.identityOnes
                            ? res.data.identityOnes
                            : [];
                        // this.transferData.identityNum = this.identityList[0].id ||'' ;
                        this.$set(this.transferData, "identityNum", "");

                        if (res.data.identityOnes.length == 1) {
                            this.$set(
                                this.transferData,
                                "identityNum",
                                res.data.identityOnes[0].id
                            );
                            this.$set(
                                this.transferData,
                                "signName",
                                res.data.identityOnes[0].idName
                            );
                        }
                    }
                });
                this.transferData.signContact = data[0].contactsWay;
                this.transferData.signName = data[0].contactsName;
            }
            // identityList
            this.contractalert = false;
        },
        continueSign() {
            if (this.source == '2') {
                if (this.compactStep == '04') {
                    return this.$router.push(`/contractsignature?compactId=${this.compactId}&isTemp=1`);
                } else {
                    return this.$router.push(`/contractsign?id=${this.compactId}&isTemp=1&type=01`);
                }
            }
            if (this.compactStep == "01") {
                this.$router.push({
                    path: "/contractsign",
                    query: { type: "01", id: this.compactId }
                });
            } else if (this.compactStep == "02") {
                this.$router.push({
                    path: "/contractprocess",
                    query: { type: "01", id: this.compactId }
                });
            } else if (this.compactStep == "03") {
                this.$router.push({
                    path: "/contractsignature",
                    name: "contractsignature",
                    query: { compactId: this.compactId, editType: "08" }
                });
            }
        },
        deleteFile() {
            this.checkPermission(
                // 权限校验
                this.$perMap.contractMgt.deleteCompact.url,
                this.$perMap.contractMgt.deleteCompact.method
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
                        customClass: "self-icon icon-delete"
                    }
                )
                    .then(() => {
                        var data = {
                            compactId: this.compactId,
                            userId: this.userId
                        };
                        this.deleteCompact(data).then(res => {
                            if (this.successCheckCode(res)) {
                                this.$message({
                                    message: `操作成功`,
                                    type: "success",
                                    duration: 1000
                                });
                                setTimeout(() => {
                                    this.$router.push("contractlist");
                                }, 1000);
                            }
                        });
                    })
                    .catch(() => {});
            });
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
                this.$perMap.contractMgt.download.url,
                this.$perMap.contractMgt.download.method
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
        firstPage() {
            this.pageNumber = 1;
            let data = {
                imgUrl:
                    "/compact/file/page?fileCode=" +
                    this.compactDocumentId +
                    "&pageNo=1"
            };
            this.fileList = [data];
        },
        lastPage() {
            this.pageNumber = this.total;
            let data = {
                imgUrl:
                    "/compact/file/page?fileCode=" +
                    this.compactDocumentId +
                    "&pageNo=" +
                    this.total
            };
            this.fileList = [data];
        },
        scrollFn(e) {
            e = e || window.event;
            if (
                (e.wheelDelta && event.ctrlKey) ||
                (e.detail && event.ctrlKey && !this.$parent.isMac)
            ) {
                if (window.devicePixelRatio) {
                    if (window.devicePixelRatio == 1) {
                        this.$message.warning(
                            "为保证更好的体验，不允许页面缩放"
                        );
                        event.returnValue = false;
                        event.preventDefault();
                    }
                } else {
                    this.$message.warning("为保证更好的体验，不允许页面缩放");
                    event.returnValue = false;
                    event.preventDefault();
                }
            }
        }
    }
};
</script>
<style lang="scss">
.contract_more .main {
    height: calc(100% - 60px);
    width: 100%;
}

.dragName,
.dragSeal {
    position: absolute;
}

li {
    list-style: none;
}

.drag {
    cursor: move;

    i {
        display: none;
    }

    .imgSeal,
    .imgName {
        display: none;
        background: #fff;
    }
}

.drag_list {
    > div {
        position: relative;

        i {
            position: absolute;
            right: 5px;
            top: 10px;
            font-size: 12px;
            transform: scale(0.8);
            color: #fff;
            display: block;
            cursor: pointer;
        }

        .name {
            padding: 5px 22px 5px 10px;
            border-radius: 4px 4px 0 0;
            color: #fff;
            word-break: break-all;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .imgName {
            border: 1px dashed #e2e2e2;
            border-radius: 0 0 4px 4px;
            min-height: 50px;
            text-align: center;
            position: relative;
            display: block;

            img {
                position: absolute;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                -moz-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
            }
        }

        .imgSeal {
            border: 1px dashed #e2e2e2;
            border-radius: 0 0 4px 4px;
            min-height: 110px;
            text-align: center;
            position: relative;
            display: block;

            img {
                position: absolute;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                -moz-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
            }
        }
    }

    .drag_Seal {
        min-width: 180px;
        max-width: 230px;
    }

    .drag_name {
        min-width: 101px;
        max-width: 230px;
    }
}

.contract_signature .el-input__inner::placeholder,
.contract_signature .el-input__inner::-webkit-input-placeholder {
    /*color: #333;*/
}

.el-message-box .el-message-box__header {
    background: #e8ecef;
    border-radius: 10px 10px 0 0;
    padding-top: 0;
    height: 40px;
}

.el-message-box .el-message-box__title {
    font-size: 16px;
    color: #1f2d3d;
    font-weight: normal;
}

.el-message-box .el-message-box__headerbtn {
    top: 12px;
    *top: 0;
}

.el-message-box .el-message-box__btns {
    text-align: center;
}

.el-message-box__btns button {
    min-width: 80px;
    height: 36px;
    font-size: 14px;
}

.el-message-box__btns button:nth-child(2) {
    margin-left: 20px;
}

.el-message-box__btns button:nth-child(1) {
    color: #999999;
    border: 1px solid #e2e2e2;
}

.el-message-box__btns button:nth-child(1):hover {
    /*color: #999999;*/
    /*border: 1px solid #e2e2e2;*/
    /*background-color: #fff;*/
}

.el-message-box__message p {
    font-size: 14px;
    color: #475669;
}

#draggable_box .draggable {
    cursor: move;
    border-radius: 4px 4px 0 0;
}

#draggable_box .draggable .top {
    padding: 5px 5px 5px 10px;
    border-radius: 4px 4px 0 0;
}

#draggable_box .draggable .top .name {
    padding-right: 28px;
    color: #fff;
    font-size: 14px;
}

#draggable_box .draggable .bottom {
    border: 1px dashed #e2e2e2;
    background-color: #fff;
}

.contract_signature .center .el-scrollbar__wrap {
    overflow-x: hidden;
    /*height: 1132px;*/
    height: 100%;
}

.contract_signature .el-scrollbar__bar.is-vertical {
    position: absolute;
    right: 0px;
    bottom: 2px;
    border-radius: 4px;
    transition: opacity 120ms ease-out;
    z-index: 200;
    width: 4px !important;
}

.contract_signature .el-scrollbar__wrap {
    margin-bottom: 0 !important;
}

#revokeFile .el-dialog__header {
    padding: 20px 20px 0;
    position: absolute !important;
    background: none !important;
    z-index: 1;
    width: 100%;
}

#revokeFile .el-dialog--small {
    width: 740px;
    border-radius: 10px;
}

.el-dialog {
    margin-bottom: 0px;
}

.backoutDialog2 {
    .el-dialog {
        border-radius: 10px;
        width: 520px;

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

                .codebtn {
                    span {
                        color: #02adff;
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
</style>
<style scoped lang="scss">
#revokeFile {
    .scroll {
        overflow: auto;
    }

    .scroll::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
        margin-left: 100px;
        background: #fff;
    }

    .scroll::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 2px;
        // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: rgba(151, 168, 190, 0.5);
    }

    .scroll::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 2px;
        background: #ededed;
    }

    .moreconfirm .fileBox .el-scrollbar__bar {
        opacity: 1;
    }

    .fileBox .el-scrollbar__bar.is-vertical {
        position: absolute;
        right: 0px;
        bottom: 2px;
        border-radius: 4px;
        transition: opacity 120ms ease-out;
        z-index: 200;
        width: 4px !important;
    }

    .fileBox .el-scrollbar__wrap {
        margin-bottom: 0 !important;
    }

    .el-dialog__close {
        color: #999;
    }

    .box {
        width: 100%;
        height: 601px;
        border-radius: 10px;
        background-color: #fff;
        overflow: hidden;

        > .title {
            height: 40px;
            line-height: 40px;
            padding-left: 20px;
            background: #e8ecef;
            margin-bottom: 30px;
            font-size: 16px;

            .state {
                font-size: 14px;
                color: #626262;
            }

            .el-dialog__headerbtn {
                margin-top: 13px;
                margin-right: 20px;
            }
        }

        .fileBox {
            padding: 0 20px;
            text-align: center;
            .title {
                font-size: 18px;
                color: #333333;
                text-align: center;
                padding-bottom: 20px;
            }

            .info {
                margin: auto;
                border-bottom: 1px solid #c0ccda;
                text-align: center;
                padding-bottom: 8px;
                text-align: center;
                margin-bottom: 30px;
                color: #333;
                display: inline-block;
                padding-left: 16px;

                > label {
                    padding-right: 16px;
                }

                > span {
                    padding-right: 30px;
                    color: #20a0ff;
                }

                span:last-child {
                    padding-right: 0;
                    color: #666;
                }
            }
        }

        .signList {
            height: 400px;

            li {
                background: #e8ecef;
                border-radius: 2px;
                font-size: 14px;
                color: #333333;
                height: 40px;
                line-height: 40px;
                margin-bottom: 10px;
                text-align: left;

                .el-col {
                    padding: 0 30px;
                    overflow: hidden;
                    height: 40px;
                }

                .color_999 {
                    color: #999;
                }
            }
        }
    }
}

.contract_signature {
    /*width: 1366px;*/
    margin: auto;
    height: 100%;

    .header {
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        box-shadow: 0 2px 3px 0 rgba(227, 237, 242, 0.5);
        position: relative;
        z-index: 10;

        .logo {
            float: right;
            // margin-top: -10px;
            padding-right: 47px;
            cursor: pointer;

            img {
                width: 100px;
            }
        }

        .back {
            padding-left: 20px;
            cursor: pointer;
            font-size: 16px;
            color: #626262;
            .icon-back {
                display: inline-block;
                width: 16px;
                height: 16px;
                background-image: url("../../../../static/image/back.svg");
                background-repeat: no-repeat;
                background-size: 100%;
                margin-right: 6px;
                position: relative;
                top: 3px;
            }
            img {
                height: 13px;
                margin-right: 8px;
            }
        }

        .back:hover {
            color: #30bcff;
            .icon-back {
                background-image: url("../../../../static/image/back_hover.svg");
            }
        }
    }

    .mian {
        height: calc(100% - 50px);
        /*overflow: auto;*/
        width: 100%;

        .left {
            width: 220px;
            height: 100%;
            background-color: #fff;
            position: fixed;
            float: left;

            .title {
                height: 36px;
                line-height: 36px;
                font-size: 16px;
                color: #999999;
                text-align: center;
            }

            .contract_list {
                padding-top: 10px;
                border-top: 1px solid #e2e2e2;
                overflow-y: auto;
                height: calc(100% - 100px);

                li {
                    padding-bottom: 20px;
                    cursor: pointer;

                    p {
                        width: 180px;
                        display: block;
                        margin: 0 auto;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .img_box {
                        margin: auto;
                        width: 120px;
                        height: 120px;
                        border-radius: 4px;
                        /*border: 1px solid #E2E2E2;*/
                        overflow: hidden;
                        position: relative;
                        text-align: center;

                        > img {
                            height: 115px;
                            width: auto;
                        }

                        .autograph_tip {
                            position: absolute;
                            right: -12px;
                            top: 5px;
                            display: block;
                            width: 12px;
                            height: 6px;
                            background: #e3c273;
                            border-radius: 0 10px 10px 0;
                        }

                        .sign_tip {
                            position: absolute;
                            right: -12px;
                            top: 16px;
                            display: block;
                            width: 12px;
                            height: 6px;
                            background: #89b1ec;
                            border-radius: 0 10px 10px 0;
                        }
                    }

                    /*.img_box.active {*/
                    /*border: 1px solid #E3EDF1;*/
                    /*box-shadow: 0 2px 3px 0 rgba(146, 213, 244, 0.50);*/
                    /*}*/
                    .box-show {
                        width: 120px;
                        height: 120px;
                        margin: auto;
                        border-radius: 4px;
                        border: 1px solid #e2e2e2;
                        margin-bottom: 10px;
                    }

                    .label {
                        position: absolute;
                        left: -14px;
                        top: -4px;
                        width: 44px;
                        height: 24px;
                        background: #eff2f7;
                        text-align: center;
                        transform: rotate(-45deg);
                        font-size: 12px;

                        i {
                            margin-left: -1px;
                            margin-top: 9px;
                            transform: scale(0.83);
                            -ms-transform: scale(0.83);
                            -moz-transform: scale(0.83);
                            -webkit-transform: scale(0.83);
                            -o-transform: scale(0.83);
                            color: #02adff;
                        }
                    }

                    p {
                        font-size: 14px;
                        color: #333333;
                        text-align: center;
                    }
                }

                li.active .box-show {
                    border: 1px solid #e3edf1;
                    box-shadow: 0 2px 3px 0 rgba(146, 213, 244, 0.5);
                }

                li.active p {
                    color: #30bcff;
                }

                li:hover .box-show {
                    border: 1px solid #e3edf1;
                    box-shadow: 0 2px 3px 0 rgba(146, 213, 244, 0.5);
                }

                li:hover p {
                    color: #30bcff;
                }
            }
        }

        .center {
            height: 100%;
            padding: 30px 0;
            margin-left: 220px;
            margin-right: 206px;

            #scroll {
                height: 100%;
                max-height: 1000px;

                .pagetext {
                    width: 778px;
                    margin: auto;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    background-color: #fafafa;
                    font-size: 12px;
                    color: #999;
                    text-align: center;
                }
            }

            .dataMore {
                text-align: center;
            }

            .img_box {
                /*width: 595px;*/
                max-width: 778px;
                margin: auto;
                position: relative;

                > .list {
                    /*width: 595px;*/
                    /*height: 800px;*/

                    width: 778px;
                    height: 1186px;
                    background-color: transparent;
                    /*background-color: #fff;*/
                    text-align: center;
                    /*margin-bottom: 40px;*/
                    border: none;

                    img {
                        /*width: 595px;*/
                        /*height: 842px;*/

                        width: 778px;
                        height: 1100px;
                        margin-bottom: 40px;
                    }
                }
            }

            .page {
                padding-right: 20px;
                padding-top: 11px;
                text-align: right;
                font-size: 14px;
                color: #999999;
                position: fixed;
                top: 45px;
                right: 222px;
            }

            .goto-wrapper {
                width: 30px;
                position: fixed;
                right: 280px;
                top: 90%;
                /*right: 280px;*/
                right: 250px;
                margin-top: -245px;
                li {
                    padding: 15px 8px;
                    height: 110px;
                    width: 32px;
                    border: 1px solid #e2e2e2;
                    border-radius: 4px;
                    margin-bottom: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #626262;
                    background-color: #fff;

                    > a {
                        width: 24px;
                        height: 24px;
                        display: inline-block;
                    }
                }

                .prev {
                    margin-top: 40px;
                }

                .prev a {
                    background: url("../../../../static/image/prev.svg") center
                        no-repeat;
                }

                .prev:hover a {
                    background: url("../../../../static/image/prev_hover.svg")
                        center no-repeat;
                }

                .prev_last a {
                    background: url("../../../../static/image/prev_last.svg")
                        center no-repeat;
                }

                .prev,
                .next {
                    text-align: center;
                    height: 24px;
                    background: none;
                    border: none;
                    padding: 0;
                }

                .next a {
                    background: url("../../../../static/image/page_next.svg")
                        center no-repeat;
                }

                .next:hover a {
                    background: url("../../../../static/image/page_next_hover.svg")
                        center no-repeat;
                }

                .next_last a {
                    background: url("../../../../static/image/page_next_last.svg")
                        center no-repeat;
                }

                .first_page a {
                    background: url("../../../../static/image/first_page.svg")
                        center no-repeat;
                }

                .first_page:hover a {
                    background: url("../../../../static/image/first_page_hover.svg")
                        center no-repeat;
                }

                .first_page_last a {
                    background: url("../../../../static/image/first_page_last.svg")
                        center no-repeat;
                }

                .last_page a {
                    background: url("../../../../static/image/last_page.svg")
                        center no-repeat;
                }

                .last_page:hover a {
                    background: url("../../../../static/image/last_page_hover.svg")
                        center no-repeat;
                }

                .last_page_last a {
                    background: url("../../../../static/image/last_page_last.svg")
                        center no-repeat;
                }

                .type:hover {
                    background: #02adff;
                    color: #fff;
                }

                .current {
                    background: #02adff;
                    color: #fff;
                }
            }
        }

        .right {
            width: 206px;
            height: 100%;
            background-color: #fff;
            position: fixed;
            float: right;
            right: 0;
            top: 50px;
            text-align: center;
            .state {
                height: 40px;
                line-height: 40px;
                color: #fff;
                font-size: 16px;
            }

            .stateing {
                background: #e3c273;
            }

            .complete {
                background: #2095e4;
            }

            > ul {
                border-bottom: 1px solid #e2e2e2;

                .lable {
                    font-size: 13px;
                    color: #999999;
                    line-height: 20px;
                    padding: 10px 0;
                }

                .value {
                    font-size: 14px;
                    color: #626262;
                    line-height: 14px;
                    padding-bottom: 12px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }

            .flowChart {
                width: 140px;
                height: 80px;
                line-height: 80px;
                border: 1px dashed #e2e2e2;
                margin: 30px auto;
                border-radius: 4px;
                font-size: 14px;
                color: #02adff;
                cursor: pointer;

                .singImg {
                    width: 24px;
                    height: 25px;
                    display: inline-block;
                    background: url("../../../../static/image/fill.png")
                        no-repeat left center;
                    vertical-align: middle;
                    margin-right: 10px;
                }
            }

            .flowChart:hover {
                border: 1px dashed #02adff;
                color: #0073bd;
            }

            .flowChart:hover .singImg {
                background: url("../../../../static/image/fill_hover.png")
                    no-repeat left center;
            }

            button {
                display: block;
                width: 178px;
                height: 36px;
                margin-left: auto;
                margin-right: auto;
                margin-top: 20px;
            }

            .el-button--default {
                color: #999999;

                &:hover {
                    color: #fff !important;
                }
            }

            .right_bottom {
                /*height: calc(100% - 400px);*/
                /*height: -moz-calc(100% - 400px);*/
                /*height: -webkit-calc(100% - 400px);*/
                padding-bottom: 50px;
                margin-bottom: 50px;

                .copybtn {
                }
            }
        }
    }
}

@media screen and (max-width: 1366px) {
    .contract_signature .mian .center .goto-wrapper {
        position: absolute;
        top: 300px;
        right: 6px;
    }
}
</style>
