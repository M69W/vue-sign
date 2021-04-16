<template>
  <div class="addseal">
    <div class="top-title clearfix">
      <!-- <div class="titinfo" v-if="addTypeVal == '01'">创建云印章</div> -->
      <div class="titinfo"
           v-if="addTypeVal == '02'">申请UKey印章</div>
      <!-- <div class="titinfo" v-if="editseal">编辑云印章</div> -->
      <div class="tit-step fr">
        <img src="/static/image/icon/step2.svg"
             alt="">
      </div>
    </div>
    <div class="orderdetail">
      <!-- <div class="item" v-if="addTypeVal == '02'">
                <div class="item-tit">企业信息</div>
                <div class="item-cont">
                    <el-row>
                        <el-col :span="9">
                            <div class="cont-item">
                                <span class="cont-item-tit">企业名称</span>
                                <span class="cont-item-txt">{{
                                    orderInitData.enterpriseName || "无"
                                }}</span>
                            </div>
                        </el-col>
                        <el-col :span="9">
                            <div class="cont-item">
                                <span
                                    class="cont-item-tit"
                                    style="width: 120px;"
                                    >统一社会信用代码</span
                                >
                                <span class="cont-item-txt">{{
                                    orderInitData.creditCode || "无"
                                }}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="9">
                            <div class="cont-item">
                                <span class="cont-item-tit">法人姓名</span>
                                <span class="cont-item-txt">{{
                                    orderInitData.legalMan || "无"
                                }}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="cont-item">
                                <span
                                    class="cont-item-tit"
                                    style="width: 120px;"
                                    >证件类型</span
                                >
                                <span class="cont-item-txt">{{
                                    orderInitData.legalCcertificateTypeDesc ||
                                        "无"
                                }}</span>
                            </div>
                        </el-col>
                        <el-col :span="7" style="text-align: right;">
                            <div class="cont-item">
                                <span class="cont-item-tit">证件号码</span>
                                <span class="cont-item-txt">{{
                                    orderInitData.legalCertificateNo || "无"
                                }}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div> -->
      <div class="cropper-dialog-body"
           style="margin-top: 20px;"
           v-if="addTypeVal == '01' || editseal">
        <el-form class="clearfix"
                 v-loading="fileUpload"
                 element-loading-text="文件上传中"
                 :model="formData"
                 :rules="rules"
                 label-position="top"
                 ref="formTab"
                 autocomplete="off">
          <el-row>
            <el-col :span="12">
              <div style="padding-right:30px;">
                <el-form-item label="印章名称"
                              prop="sealName">
                  <el-input v-model="formData.sealName"
                            placeholder="请输入印章名称"></el-input>
                </el-form-item>
                <el-form-item label="章模图片"
                              prop="picturePath">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <el-input v-model="formData.picturePath"
                            type="hidden"
                            class="hideinput"></el-input>
                  <form id="fileForm"
                        class="fileForm"
                        accept-charset="utf-8"
                        enctype="multipart/form-data">
                    <input type="file"
                           id="fileipt1"
                           name="file"
                           class="uploadinput"
                           @change="handleChange($event)" />
                  </form>
                  <div class="uploader-tips">
                    仅支持png、jpg、bmp
                  </div>
                </el-form-item>
                <el-form-item label="印章宽高（单位：毫米）"
                              prop="sealSpec">宽：
                  <el-input type="text"
                            class="sealspec"
                            :maxlength="2"
                            v-model="formData.pictureWidth"
                            @keyup.native="regSpec('width')"></el-input>
                  高：
                  <el-input type="text"
                            class="sealspec"
                            :maxlength="2"
                            v-model="formData.pictureHeight"
                            @keyup.native="regSpec('height')"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="padding-left:30px;">
                <el-form-item label="预览章模">
                  <div class="uploader-previewImg">
                    <div v-if="formData.picturePath"
                         class="viewseal">
                      <img @click="
                                                    sealCheck(
                                                        formData.picturePath,
                                                        formData.pictureWidth,
                                                        formData.pictureHeight
                                                    )
                                                "
                           :src="hetongimg"
                           class="hetongbg" />
                      <span id="position">
                        <img :src="
                                                        compToken(
                                                            formData.picturePath
                                                        )
                                                    "
                             alt
                             id="seal_pic" />
                      </span>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="item"
           v-if="addTypeVal == '02'">
        <div class="item-info">
          <div class="item-tit signetInfo">
            印章信息
            <el-button @click="addSignet()"
                       v-if="edittype != '04'">
              <span class="add-icon"></span>添加印章
            </el-button>
          </div>
          <div class="item-cont">
            <el-table :data="tableData"
                      v-loading="loadingTabel"
                      style="width: 100%; margin-top:10px;"
                      v-if="tableData && tableData != ''">
              <el-table-column :resizable="false"
                               prop="pictureName"
                               label="印章名称"></el-table-column>
              <el-table-column :resizable="false"
                               prop="esealTypeDesc"
                               label="印章类型"></el-table-column>
              <el-table-column :resizable="false"
                               prop="pictureCode"
                               label="印章编码"></el-table-column>
              <el-table-column :resizable="false"
                               prop="pictureOriginDesc"
                               label="印章来源"></el-table-column>
              <el-table-column :resizable="false"
                               label="来源标识">
                <template slot-scope="scope">
                  <div>
                    {{
                                            scope.row.pictureFlag
                                                ? scope.row.pictureFlag == "-1"
                                                    ? "无"
                                                    : scope.row.pictureFlag
                                                : "无"
                                        }}
                    <!--                                    {{scope.row.pictureFlag == '-1' ? '无' : scope.row.pictureFlag}}-->
                  </div>
                </template>
              </el-table-column>
              <el-table-column :resizable="false"
                               label="管理操作"
                               width="180px">
                <template slot-scope="scope">
                  <el-button type="text"
                             size="small"
                             @click="sealEdit(scope.row.esealId)">编辑</el-button>
                  <el-button type="text"
                             size="small"
                             @click="sealDelete(scope.row.esealId)"
                             v-if="edittype != '04'">删除
                  </el-button>
                  <el-button type="text"
                             size="small"
                             @click="
                                            sealCheck(
                                                scope.row.picturePath,
                                                scope.row.pictureWidth,
                                                scope.row.pictureHeight
                                            )
                                        ">查看章模
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="nonedata"
                 v-if="nodata">
              <div class="imgbg"></div>
              <div class="txt">暂无数据</div>
            </div>
            <div class="pagination"
                 v-if="total > pageSize">
              <el-pagination @current-change="handleCurrentChange"
                             :current-page="currentpage"
                             :page-size="pageSize"
                             :total="total"
                             layout="total, prev, pager, next"></el-pagination>
            </div>
          </div>
          <div class="item-tips clearfix">
            <div class="item-tips-left fl">温馨提示：</div>
            <div class="item-tips-right fr">
              <p>1、添加一个印章信息就会生成一枚电子印章（Ukey）；</p>
              <p>2、章模图片仅支持png、jpg、bmp格式。</p>
            </div>
          </div>
        </div>
        <div class="item-info client-info"
             style="margin-top:20px">
          <div class="item-tit signetInfo">
            收货地址
          </div>
          <div class="item-cont">
            <el-form :rules="clientInfoRules"
                     :model="clientInfo"
                     class="clearfix"
                     ref="clientInfo">
              <el-col>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="经办人"
                                  prop="agentName">
                      <el-input type="text"
                                v-model="clientInfo.agentName"
                                placeholder></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="经办人电话"
                                  prop="agentContactNumber">
                      <el-input type="text"
                                v-model="clientInfo.agentContactNumber"
                                placeholder></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="经办人证件类型"
                                  prop="agentCertificateType">
                      <el-select v-model="clientInfo.agentCertificateType"
                                 placeholder="请选择证件类型"
                                 style="width:100%">
                        <el-option v-for="item in idType"
                                   :label="item.label"
                                   :key="item.value"
                                   :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="经办人证件号码"
                                  prop="agentCertificateNumber">
                      <el-input type="text"
                                v-model="clientInfo.agentCertificateNumber"
                                placeholder></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="省市"
                                  prop="proId">
                      <select-address v-model="clientInfo"
                                      @getCityList="getCityList"
                                      @getProvinceList="getProvinceList"></select-address>
                      <!-- <el-select v-model="clientInfo.proId"
                                 placeholder="请选择省份"
                                 style="width:49%">
                        <el-option v-for="item in provinceList"
                                   :key="item.proId"
                                   :label="item.proName"
                                   :value="item.proId"></el-option>
                      </el-select>
                      <el-select v-model="clientInfo.cityId"
                                 placeholder="请选择城市"
                                 style="width:49%;float:right;">
                        <el-option v-for="item in cityList"
                                   :key="item.cityId"
                                   :label="item.cityName"
                                   :value="item.cityId"></el-option>
                      </el-select> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="详细地址"
                                  prop="detailAddress">
                      <el-input type="text"
                                v-model="clientInfo.detailAddress"
                                placeholder></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="footbtn">
      <el-button @click="prev()">上一步</el-button>
      <el-button @click="next()"
                 :loading="nextbtnLoding"
                 type="primary"
                 v-if="addTypeVal == '02'">{{ edittype == "04" ? "提交" : "下一步" }}</el-button>
      <!-- <el-button
                @click="submitform('formTab')"
                v-if="addTypeVal == '01' || editseal"
                type="primary"
                :loading="btnLoding"
                :disabled="btnDisabled"
                >确定
            </el-button> -->
    </div>
    <el-dialog v-if="addTypeVal == '02'"
               :title="dialogTit"
               class="cropper-dialog"
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false">
      <div class="cropper-dialog-body">
        <el-tabs v-model="activeName"
                 @tab-click="handleClick">
          <!--<el-tab-pane label="调用公安章模" v-if="tabPaneFlag" name="second" style="height: 340px;overflow-y: auto;">
                                  <el-form class="clearfix" label-position="top" ref="formTab2" autocomplete="off">
                                      <el-table :data="tableData2" style="width: 100%; margin-top:10px;">
                                          <el-table-column :resizable="false" type="selection" width="100"></el-table-column>
                                          <el-table-column :resizable="false" prop="sealName" label="印章名称"></el-table-column>
                                          <el-table-column :resizable="false" prop="sealType" label="印章类型"></el-table-column>
                                          <el-table-column :resizable="false" prop="sourceIdentify" label="来源标识"></el-table-column>
                                          <el-table-column :resizable="false" prop="signImg" label="章模样式" width="100">
                                              <template scope="scope">
                                                  <img :src="scope.row.signImg" class="tableimg">
                                              </template>
                                          </el-table-column>
                                      </el-table>
                                  </el-form>
                    </el-tab-pane>-->
          <el-tab-pane label="上传章模"
                       name="first"
                       v-loading="fileUpload"
                       element-loading-text="文件上传中">
            <el-form class="clearfix"
                     :model="formData"
                     :rules="rules"
                     label-position="top"
                     ref="formTab"
                     autocomplete="off">
              <el-row>
                <el-col :span="12">
                  <div style="padding-right:30px;">
                    <el-form-item label="印章名称"
                                  prop="sealName">
                      <el-input v-model="formData.sealName"
                                placeholder="请输入印章名称"></el-input>
                    </el-form-item>
                    <el-form-item label="印章类型"
                                  prop="esealType"
                                  v-if="addTypeVal == '02'">
                      <el-select v-model="formData.esealType"
                                 placeholder="请选择"
                                 @change="
                                                    changeSealType(
                                                        formData.esealType
                                                    )
                                                ">
                        <el-option v-for="item in sealTypeList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="章模图片"
                                  prop="picturePath">
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                      <el-input v-model="formData.picturePath"
                                type="hidden"
                                class="hideinput"></el-input>
                      <form id="fileForm"
                            class="fileForm"
                            accept-charset="utf-8"
                            enctype="multipart/form-data">
                        <input type="file"
                               id="fileipt"
                               name="file"
                               class="uploadinput"
                               @change="
                                                        handleChange($event)
                                                    " />
                      </form>
                      <div class="uploader-tips">
                        仅支持png、jpg、bmp
                      </div>
                    </el-form-item>
                    <el-form-item label="印章宽高（单位：毫米）"
                                  prop="sealSpec">宽：
                      <el-input type="text"
                                class="sealspec"
                                :maxlength="2"
                                v-model="formData.pictureWidth"
                                @keyup.native="regSpec('width')"></el-input>
                      高：
                      <el-input type="text"
                                class="sealspec"
                                :maxlength="2"
                                v-model="formData.pictureHeight"
                                @keyup.native="
                                                    regSpec('height')
                                                "></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div style="padding-left:30px;">
                    <el-form-item label="预览章模">
                      <div class="uploader-previewImg">
                        <div v-if="formData.picturePath"
                             class="viewseal">
                          <img @click="
                                                            sealCheck(
                                                                formData.picturePath,
                                                                formData.pictureWidth,
                                                                formData.pictureHeight
                                                            )
                                                        "
                               :src="hetongimg"
                               class="hetongbg" />
                          <span id="position">
                            <img :src="
                                                                compToken(
                                                                    formData.picturePath
                                                                )
                                                            "
                                 alt
                                 id="seal_pic" />
                          </span>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="upload-btn">
        <el-button @click="cancelDialog()">取消</el-button>
        <el-button type="primary"
                   v-if="activeName == 'first'"
                   @click="submitform('formTab')"
                   :loading="btnLoding">确定
        </el-button>
        <!-- <el-button type="primary" v-if="activeName == 'second'" @click="submitform('formTab2')" :loading="btnLoding">确定</el-button> -->
      </div>
    </el-dialog>
    <el-dialog title="章模预览"
               :visible.sync="sealPreviewModel"
               class="seal-preview-model"
               top="12%">
      <div class="bighetong">
        <img :src="hetongimg"
             alt
             class="hetongimg" />
        <div class="showsealmodel">
          <img :src="compToken(sealsrc)"
               alt
               class="sealsrc" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import base from "../mixin/base";
import valid from "../mixin/valid";
import selectAddress from "@/components/selectAddress"
export default {
  mixins: [base, valid],
  components: { selectAddress },
  data() {
    var validateCredentials2 = (rule, value, callback) => {
      if (
        this.clientInfo.agentCertificateType != "01" ||
        value.length == 15 ||
        value.length == 18
      ) {
        callback();
      } else {
        callback(new Error("请输入15位或18位身份证号码"));
      }
    };
    var validateProCity = (rule, value, callback) => {
      if (
        this.clientInfo.proId && this.clientInfo.cityId
      ) {
        callback();
      } else {
        callback(new Error("请选择省市"));
      }
    };
    return {
      tableData: [],
      btnLoding: false,
      dialogFormVisible: false,
      fileUpload: false,
      activeName: "first",
      formData: {
        pictureDataTmpId: "",
        sealName: "",
        picturePath: "",
        pictureWidth: "",
        pictureHeight: "",
        esealType: ""
      },
      //收件信息start
      clientInfo: {
        agentName: "",
        detailAddress: "",
        agentCertificateNumber: "",
        agentCertificateType: "",
        agentContactNumber: "",
        proId: "",
        cityId: "",
        isShowUserRes: true //是否显示用户责任书
      },
      idType: [
        {
          label: "大陆居民身份证",
          value: "01"
        }
      ],
      provinceList: [],
      cityList: [],
      cityName: "",
      proName: "",
      detailAddr: "",
      parentCertList: [
        {
          certificateId: "0",
          certificatePath: "",
          certificateName: "法人证件正面",
        },
        {
          certificateId: "1",
          certificatePath: "",
          certificateName: "法人证件背面",
        },
        {
          certificateId: "2",
          certificatePath: "",
          certificateName: "营业执照正面"
        },
        {
          certificateId: "3",
          certificatePath: "",
          certificateName: "经办人证件正面",
          certificateTips: "个人信息页"
        },
        {
          certificateId: "4",
          certificatePath: "",
          certificateName: "经办人证件背面",
          certificateTips: "国徽页"
        },
        {
          certificateId: "5",
          certificatePath: "",
          certificateName: "申请书"
        }
      ],
      clientInfoRules: {
        agentName: [
          {
            required: true,
            message: "请输入经办人姓名",
            trigger: "blur"
          },
          { max: 50, message: "长度在 50 字符以内", trigger: "blur" }
        ],
        agentCertificateType: [
          {
            required: true,
            message: "请选择经办人证件类型",
            trigger: "blur"
          }
        ],
        agentCertificateNumber: [
          {
            required: true,
            message: "请输入经办人证件号码",
            trigger: "blur"
          },
          { validator: validateCredentials2, trigger: "blur" }
        ],
        agentContactNumber: [
          {
            required: true,
            message: "请输入经办人手机号",
            trigger: "blur"
          },
          { validator: this.checkTel, trigger: "blur" }
        ],
        proId: [
          { required: true, message: "请选择省份", trigger: "change" },
          { validator: validateProCity, trigger: "change" }
        ],
        cityId: [
          { required: true, message: "请选择城市", trigger: "change" }
        ],
        detailAddress: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur"
          },
          { max: 50, message: "长度在 50 字符以内", trigger: "blur" }
        ]
      },
      //收件信息end
      rules: {
        sealName: [
          {
            required: true,
            message: "请输入印章名称",
            trigger: "blur"
          },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" },
          { validator: this.checkSpace, trigger: "blur" }
        ],
        esealType: [
          {
            required: true,
            message: "请选择印章类型",
            trigger: "blur"
          }
        ],
        picturePath: [
          {
            required: true,
            message: "请上传章模图片",
            trigger: "blur"
          }
        ],
        sealSpec: [{ validator: this.checkSealSpec, trigger: "blur" }]
      },
      legalCertificateObj: {
        "01": "大陆居民身份证",
        "02": "台湾居民来往大陆通行证",
        "03": "港澳居民来往内地通行证",
        "04": "护照",
        "05": "其他"
      },
      sealTypeList: [
        {
          label: "行政章",
          value: "01"
        },
        {
          label: "财务专用章",
          value: "02"
        },
        {
          label: "业务专用章",
          value: "03"
        },
        {
          label: "法定代表人名章",
          value: "04"
        },
        {
          label: "报关专用章",
          value: "05"
        },
        {
          label: "合同专用章",
          value: "06"
        },
        {
          label: "其他公章",
          value: "07"
        }
      ],
      sealPreviewModel: false,
      hetongimg: "./static/image/u1579.jpg",
      sealsrc: "",
      addTypeVal: "", //"01":云印章;"02":UKEY印章
      dialogTit: "",
      tabPaneFlag: true,
      loadingTabel: false,
      nextbtnLoding: false,
      nodata: false,
      orderInitData: {
        creditCode: "",
        enterpriseName: "",
        legalCcertificateTypeDesc: "",
        legalCertificateNo: "",
        legalMan: ""
      },
      selectIndex: 0, //新曾印章0 编辑印章1
      esealId: "",
      orderNo: "",
      orderId: "",
      editseal: false,
      btnDisabled: false,
      edittype: "", //04编辑 非04新增orz
      fileObj: {},
      base64Img: ""
    };
  },
  // computed: {
  //   province() {
  //     return this.clientInfo.proId;
  //   }
  // },
  // watch: {
  //   province(val, oldVal) {
  //     if (oldVal && val && val != oldVal) {
  //       this.clientInfo.cityId = "";
  //       this.getCities();
  //     } else if (oldVal && !val) {
  //       return;
  //     } else {
  //       this.getCities();
  //     }
  //   }
  // },
  mounted() {
    if (this.$route.path == "/addseal") {
      this.addTypeVal = "01"; //云印章
    } else if (
      this.$route.path == "/addukeylist" ||
      this.$route.path == "/addukeyseal"
    ) {
      // } else if (this.$route.path == "/addukeyseal") {
      this.addTypeVal = "02"; //UKEY印章
      this.orderNo = this.$route.query.orderNo;
      this.edittype = this.$route.query.edittype;
      if (this.orderNo) {
        //如果参数有传订单号，通过订单号查询详情
        this.getOrderDetail();
      }
      // else {
      //     //如果没有订单号，初始化订单
      //     this.getOrderInitData();
      // }
    } else if (this.$route.path == "/editseal") {
      this.editseal = true;
      this.getSealDetailsInfo();
    }
    // this.getProvinces();
    // this.getCities();
    this.getClientInfo();//获取收货地址
    this.getEnterpriseInfo();
  },
  methods: {
    // cancel() {
    //     if (this.addTypeVal == "02") {
    //         if (this.edittype == "04") {
    //             this.$router.push({ path: "/ukeyorder" });
    //             return;
    //         }
    //         let data = {
    //             certificateList: [],
    //             city: "",
    //             detailAddress: "",
    //             orderNo: this.orderNo,
    //             postcode: "",
    //             province: "",
    //             recipient: "",
    //             recipientPhone: "",
    //             uniformCreditCode: "",
    //             enterpriseName: "",
    //             legalPersonCertificateNumber: "",
    //             legalPersonCertificateType: "",
    //             legalPersonName: ""
    //         };
    //         this.$confirm(
    //             "本次UKey印章申请，确定要保存至草稿箱吗？",
    //             "温馨提示",
    //             {
    //                 confirmButtonText: "确定",
    //                 cancelButtonText: "取消",
    //                 type: "warning",
    //                 closeOnClickModal: false,
    //                 distinguishCancelAndClose: true,
    //                 customClass: "self-icon icon-draft"
    //             }
    //         )
    //             .then(() => {
    //                 this.saveDraftOrder(data).then(res => {
    //                     if (this.successCheckCode(res)) {
    //                         this.$router.push("/myseal");
    //                     }
    //                 });
    //             })
    //             .catch(() => {
    //                 this.$router.push("/myseal");
    //             });
    //     } else {
    //         this.$router.push("/myseal");
    //     }
    // },
    cancelDialog() {
      this.dialogFormVisible = false;
      this.getOrderDetail();
    },
    addSignet() {
      this.formData.esealType = "";
      this.formData.sealName = "";
      this.formData.picturePath = "";
      this.formData.pictureWidth = "";
      this.formData.pictureHeight = "";
      this.dialogTit = "创建UKey印章";
      this.tabPaneFlag = true;
      this.activeName = "first";
      this.dialogFormVisible = true;
      this.selectIndex = 0;
    },
    sealEdit(id) {
      this.getListData();
      this.esealId = id;
      this.dialogTit = "编辑UKey印章";
      this.selectIndex = 1;
      this.activeName = "first";
      this.tabPaneFlag = false;
      this.dialogFormVisible = true;
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].esealId == id) {
          this.formData.pictureDataTmpId = this.tableData[
            i
          ].pictureCode;
          this.formData.sealName = this.tableData[i].pictureName;
          this.formData.esealType = this.tableData[i].esealType;
          this.formData.picturePath = this.tableData[i].picturePath;
          this.formData.pictureWidth = this.tableData[i].pictureWidth;
          this.formData.pictureHeight = this.tableData[
            i
          ].pictureHeight;
        }
      }
      var self = this;
      setTimeout(function () {
        self.resetmodel();
      }, 100);
    },
    changeSealType(val) {
      console.log(val);
    },
    getOrderDetail() {
      this.orderDetailEnterprise(this.orderNo)
        .then(res => {
          if (this.successCheckCode(res)) {
            /*this.orderInitData.creditCode = res.data.enterpriseInfo &&
  res.data.enterpriseInfo.uniformCreditCode;
this.orderInitData.enterpriseName =
  res.data.enterpriseInfo && res.data.enterpriseName;
this.orderInitData.legalMan =
  res.data.enterpriseInfo &&
  res.data.enterpriseInfo.legalPersonName;
this.orderInitData.legalCertificateNo =
  res.data.enterpriseInfo &&
  res.data.enterpriseInfo.legalPersonCertificateNumber;
this.orderInitData.legalCcertificateTypeDesc =
  res.data.enterpriseInfo &&
  res.data.enterpriseInfo.legalPersonCertificateTypeDesc;*/

            this.orderNo = res.data.orderBasicInfo.orderNo;
            this.orderId = res.data.orderBasicInfo.orderId;
            this.tableData = res.data.esealList;
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].pictureCode == null) {
                this.tableData.splice(i, 1);
              }
            }
          }
        })
        .fail(res => {
          this.$message.error(res.msg);
        });
    },
    /*getEnterpriseInfo(){
    alert(1111111)
    this.enterpriseDetail().then(res => {
        if (this.successCheckCode(res)) {
            this.orderInitData.creditCode = res.data.enterpriseCertificateNo;
            this.orderInitData.enterpriseName = res.data.enterpriseName;
            this.orderInitData.legalMan = res.data.legalName;
            this.orderInitData.legalCertificateNo = res.data.legalCertificateNo;
            this.orderInitData.legalCcertificateTypeDesc = this.legalCertificateObj[res.data.legalCertificateType];
        }
    });
    } ,*/
    //提交能验证 -- 修改印章信息列表
    submitform(ref) {
      this.$refs[ref].validate(valid => {
        if (valid) {
          this.saveForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //保存提交数据
    saveForm() {
      var self = this;
      if (this.selectIndex == 0) {
        let data = {
          areaCode:
            this.orderInitData.creditCode &&
            this.orderInitData.creditCode.substring(2, 8),
          orderId: this.orderId,
          orderNo: this.orderNo,
          pictureDataTmpId: this.formData.pictureDataTmpId,
          picturePath: this.formData.picturePath,
          sealName: this.formData.sealName,
          pictureWidth: this.formData.pictureWidth,
          pictureHeight: this.formData.pictureHeight,
          sealType: this.formData.esealType
        };
        this.btnLoding = true;
        this.btnDisabled = true;
        if (this.addTypeVal == "02") {
          // ukey印章
          this.addSeal(data).then(res => {
            this.btnLoding = false;
            this.btnDisabled = false;
            if (this.successCheckCode(res)) {
              this.$message.success("添加成功！");
              this.dialogFormVisible = false;
              this.uploadImageBase64();
              this.getListData();
              this.getOrderDetail();
              this.getEnterpriseInfo();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else if (this.addTypeVal == "01") { //云印章 -- 操作不走已更改不会在走此代码orz
          // var sealdata = {
          //     cloudSealName: this.formData.sealName,
          //     pictureDataTmpId: this.formData.pictureDataTmpId,
          //     signatureFilePath: this.formData.picturePath,
          //     width: this.formData.pictureWidth,
          //     height: this.formData.pictureHeight
          // };
          // this.addCloudSeal(sealdata).then(res => {
          //     if (this.successCheckCode(res)) {
          //         this.$message({
          //             message: "云印章创建成功！",
          //             type: "success",
          //             duration: 1000
          //         });

          //         setTimeout(function() {
          //             self.btnLoding = false;
          //             self.btnDisabled = false;
          //             // self.$router.go(0);
          //             self.$router.push("/myseal");
          //         }, 1000);
          //     } else {
          //         this.btnLoding = false;
          //         this.btnDisabled = false;
          //         this.$message.error(res.msg);
          //     }
          // });
        } else if (this.editseal) {
          var sealdata = {
            pictureCode: this.formData.pictureCode,
            sealId: this.formData.pictureId,
            sealName: this.formData.sealName,
            pictureDataTmpId: this.formData.pictureDataTmpId,
            picturePath: this.formData.picturePath,
            pictureWidth: this.formData.pictureWidth,
            pictureHeight: this.formData.pictureHeight
          };
          this.editCloudSeal(sealdata).then(res => {
            if (this.successCheckCode(res)) {
              this.$message({
                message: "编辑成功！",
                type: "success",
                duration: 1000
              });
              setTimeout(function () {
                self.btnLoding = false;
                self.btnDisabled = false;
                self.$router.push("/myseal");
              }, 1000);
            } else {
              this.btnLoding = false;
              this.btnDisabled = false;
              this.$message.error(res.msg);
            }
          });
        }
      } else {
        // 编辑ukey印章
        let data = {
          areaCode:
            this.orderInitData.creditCode &&
            this.orderInitData.creditCode.substring(2, 8),
          pictureDataTmpId: this.formData.pictureDataTmpId,
          pictureWidth: this.formData.pictureWidth,
          pictureHeight: this.formData.pictureHeight,
          picturePath: this.formData.picturePath,
          sealId: this.esealId,
          sealName: this.formData.sealName,
          sealType: this.formData.esealType
        };
        this.btnLoding = true;
        this.editSeal(data).then(res => {
          if (this.successCheckCode(res)) {
            this.$message.success("编辑成功！");
            this.btnLoding = false;
            this.dialogFormVisible = false;
            this.getListData();
            this.getOrderDetail();
            this.getEnterpriseInfo();
          } else {
            this.btnLoding = false;
            this.$message.error(res.msg);
          }
        });
      }
    },
    //添加ukey印章流程，下一步
    // next() {
    //     if (this.tableData.length <= 0) {
    //         this.$message.error("至少申请一个印章");
    //     } else {
    //         this.$router.push({
    //             path: "/addukeysealinfo",
    //             query: {
    //                 orderNo: this.orderNo,
    //                 edittype: this.edittype,
    //                 esealYear: this.tableData[0].esealYear
    //             }
    //         });
    //     }
    // },    
    next() {
      if (this.tableData.length <= 0) {
        this.$message.error("至少申请一个印章");
      } else {
        this.submitAllForm('clientInfo', 'next');
      }
    },
    prev() {
      this.submitAllForm('clientInfo', 'prev');
    },
    //提交云印章
    // submitCloudSeal() {
    //     this.nextbtnLoding = true;
    //     this.$message.success("添加云印章成功！");
    //     var self = this;
    //     setTimeout(function() {
    //         this.nextbtnLoding = false;
    //         self.$router.push("/myseal");
    //     }, 1000);
    // },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //上传章模
    handleChange(event) {
      var self = this;
      this.fileObj = event.target.files[0];
      if (this.fileObj) {
        if (window.FileReader) {
          var reader = new FileReader();
          // 转化为base64
          reader.readAsDataURL(this.fileObj);
          reader.onload = function (e) {
            var reg = "jpeg";
            self.base64Img = e.target.result.replace(reg, "jpg");
          };
        }
        this.uploadImage();
      }
      $(event.target).val("");
    },
    uploadImage() {
      if (!/\.(jpg|png|bmp|JPG|PNG)$/.test(this.fileObj.name)) {
        this.$message.error("请上传jpg、png、bmp格式的图片！");
        return false;
      }
      if (this.fileObj.size > 2 * 1024 * 1024) {
        this.$message.error("请上传2M以内的文件！");
        return false;
      }
      // 上传图片接口
      if (this.addTypeVal == "02") {
        //企业自定义章模
        var url =
          "/seal/enterprise/custom/upload/" +
          this.orderInitData.creditCode;
      } else if (this.addTypeVal == "01" || this.editseal) {
        //云印章章模
        var url = "/seal/cloud/seal/upload";
      }
      var dom = "fileForm";
      this.fileUpload = true;
      var self = this;
      this.postFileImageUpload2(
        dom,
        url,
        function (data) {
          //成功回调
          if (self.successCheckCode(data)) {
            var file = data.data;
            self.formData.pictureDataTmpId = file.pictureDataTmpId;
            self.formData.picturePath = file.picturePath;
            self.formData.pictureWidth = file.pictureWidth;
            self.formData.pictureHeight = file.pictureHeight;

            setTimeout(function () {
              self.resetmodel();
              self.fileUpload = false;
            }, 100);
          } else {
            setTimeout(function () {
              self.fileUpload = false;
            }, 100);
          }
        },
        function (event) {
          setTimeout(function () {
            self.fileUpload = false;
          }, 100);
        },
        function (data) {
          setTimeout(function () {
            self.fileUpload = false;
          }, 100);
        }
      );
    },
    uploadImageBase64() {
      var self = this;
      var data = {
        creditCode: this.orderInitData.creditCode,
        fileBase64: this.base64Img,
        height: this.formData.pictureHeight,
        width: this.formData.pictureWidth
      };
      this.uploadImgBase64(data)
        .then(res => {
          if (this.successCheckCode(res)) {
            self.formData.pictureDataTmpId =
              res.data.pictureDataTmpId;
            self.formData.picturePath = res.data.picturePath;
            self.formData.pictureWidth = res.data.pictureWidth;
            self.formData.pictureHeight = res.data.pictureHeight;
          }
        })
        .fail(res => { });
    },
    sealDelete(id) {
      this.$confirm("您确认要删除此印章吗？", "删除印章", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "self-icon icon-delete"
      })
        .then(() => {
          this.deleteOrderSeal(id).then(res => {
            if (this.successCheckCode(res)) {
              this.$message.success("删除成功！");
              this.getListData();
            } else {
              this.$message.error("删除失败！");
            }
          });
        })
        .catch(() => { });
    },
    getListData() {
      this.loadingTabel = true;
      this.sealInfoList(this.orderNo, this.pageNum, this.pageSize)
        .then(res => {
          if (this.successCheckCode(res)) {
            this.tableData = res.data.records;
            this.total = res.data.total;
            this.pageNum = res.data.current;
          } else {
            this.nodata = true;
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
    getOrderInitData() {
      this.orderInit()
        .then(res => {
          if (this.successCheckCode(res)) {
            this.orderInitData = res.data;
            this.orderNo = res.data.orderNo;
            this.orderId = res.data.orderId;
            this.getListData();
          }
        })
        .fail(res => {
          this.$message.error(res.msg);
        });
    },
    regSpec(type) {
      var that = this;
      setTimeout(function () {
        if (type == "width") {
          that.formData.pictureWidth = that.formData.pictureWidth.replace(
            /\D/g,
            ""
          );
          that.formData.pictureWidth > 99
            ? (that.formData.pictureWidth = 99)
            : that.formData.pictureWidth;
        } else {
          that.formData.pictureHeight = that.formData.pictureHeight.replace(
            /\D/g,
            ""
          );
          that.formData.pictureHeight > 99
            ? (that.formData.pictureHeight = 99)
            : that.formData.pictureHeight;
        }
        that.resetmodel();
      }, 10);
    },
    resetmodel() {
      var height = (this.formData.pictureHeight * 210) / 210;
      var width = (this.formData.pictureWidth * 210) / 210;
      var top = 310 - height + "px";
      var left = 200 - width + "px";
      $("#position").css({
        height: height + "px",
        width: width + "px",
        top: top,
        left: left
      });
    },
    sealCheck(imgurl, w, h) {
      this.sealsrc = imgurl;
      this.sealPreviewModel = true;
      var height = (h * 400) / 210;
      var width = (w * 400) / 210;
      var top = 544 - height + "px";
      var left = 350 - width + "px";
      setTimeout(function () {
        $(".showsealmodel").css({
          height: height + "px",
          width: width + "px",
          top: top,
          left: left
        });
      }, 10);
    },
    //获取企业相关信息  已取消展示
    getEnterpriseInfo() {
      this.enterpriseInfo()
        .then(res => {
          if (this.successCheckCode(res)) {
            this.orderInitData = res.data || {};
          }
        })
        .fail(res => {
          this.$message.error(res.msg);
        });
    },
    //印章详细信息
    getSealDetailsInfo() {
      var self = this;
      this.signImgUrl(this.$route.query.pictureCode)
        .then(res => {
          if (this.successCheckCode(res)) {
            this.formData = res.data;
            this.formData.sealName = res.data.signatureName;
            this.formData.pictureDataTmpId = res.data.pictureId;
            this.formData.picturePath = res.data.signatureFilePath;
            this.formData.pictureWidth = res.data.signatureWidth;
            this.formData.pictureHeight = res.data.signatureHeight;
            setTimeout(function () {
              self.resetmodel();
            }, 100);
          }
        })
        .fail(res => {
          this.$message.error(res.msg);
        });
    },
    checkSealSpec(rule, value, callback) {
      if (!this.formData.pictureWidth || !this.formData.pictureHeight) {
        callback("请填写章模宽高");
      } else {
        callback();
      }
    },
    // getProvinces() {
    //   this.getProvince({
    //     currPage: 1,
    //     pageSize: 100
    //   }).then(res => {
    //     if (this.successCheckCode(res)) {
    //       this.provinceList = res.data.records;
    //     }
    //   });
    // },
    // getCities() {
    //   this.getCity({
    //     upOneLevelId: this.clientInfo.proId,
    //     currPage: 1,
    //     pageSize: 100
    //   }).then(res => {
    //     if (this.successCheckCode(res)) {
    //       this.cityList = res.data.records;
    //     }
    //   });
    // },
    getProvinceList(val) {
      this.provinceList = val;
    },
    getCityList(val) {
      this.cityList = val;
    },
    //获取收货地址
    getClientInfo() {
      if (this.orderNo) {
        this.orderDetailEnterprise(this.orderNo)
          .then(res => {
            if (this.successCheckCode(res)) {
              this.orderInfo = res.data;
              this.clientInfo.agentName = this.orderInfo
                .orderAcceptInfo.agentName
                ? this.orderInfo.orderAcceptInfo.agentName
                : "";
              this.detailAddr = this.orderInfo.orderAcceptInfo
                .deliveryAddress
                ? this.orderInfo.orderAcceptInfo.deliveryAddress
                : "";
              this.clientInfo.agentCertificateNumber = this
                .orderInfo.orderAcceptInfo
                .agentCertificateNumber
                ? this.orderInfo.orderAcceptInfo
                  .agentCertificateNumber
                : "";
              this.clientInfo.agentCertificateType = this.orderInfo
                .orderAcceptInfo.agentCertificateType
                ? this.orderInfo.orderAcceptInfo
                  .agentCertificateType
                : "";
              this.clientInfo.agentContactNumber = this.orderInfo
                .orderAcceptInfo.agentContactNumber
                ? this.orderInfo.orderAcceptInfo
                  .agentContactNumber
                : "";

              this.orderNo = this.orderInfo.orderBasicInfo.orderNo;

              var certificateList = this.orderInfo
                .certificateList;
              if (certificateList.length > 0) {
                for (
                  var i = 0;
                  i < certificateList.length;
                  i++
                ) {
                  if (i <= 5) {
                    this.parentCertList[i].certificatePath =
                      certificateList[i].certificatePath;
                  } else {
                    this.parentCertList.push(
                      certificateList[i]
                    );
                  }
                }
              }
              this.getCertificateData(); // 获取收货地址和实名证件照接口
            }
          })
          .fail(res => {
            this.$message.error(res.msg);
          });
      }
    },
    getCertificateData() {
      this.getCertificate()
        .then(res => {
          if (this.successCheckCode(res)) {
            if (!this.parentCertList[0].certificatePath) {
              this.parentCertList[0].certificatePath = //'http://192.168.51.218:6065/group2/M00/0A/12/wKgz5l0kUvSAY6G3AAvea_OGt2M622.jpg'
                res.data.legalPersonIdentityCardFrontPic !== 'publicTransferNoPhoto' ? res.data.legalPersonIdentityCardFrontPic : '';
            }
            if (!this.parentCertList[1].certificatePath) {
              this.parentCertList[1].certificatePath = //'http://192.168.51.218:6065/group2/M00/0A/12/wKgz5l0kUvSAY6G3AAvea_OGt2M622.jpg'
                res.data.legalPersonIdentityCardBackPic !== 'publicTransferNoPhoto' ? res.data.legalPersonIdentityCardBackPic : '';
            }
            if (!this.parentCertList[2].certificatePath) {
              this.parentCertList[2].certificatePath = //'http://192.168.51.218:6065/group2/M00/0A/12/wKgz5l0kUvSAY6G3AAvea_OGt2M622.jpg'
                res.data.businessLicensePic !== 'publicTransferNoPhoto' ? res.data.businessLicensePic : '';
            }

            if (!this.detailAddr && res.data.userAddress) {
              this.clientInfo.proId = res.data.userAddress.proId;
              this.clientInfo.cityId = res.data.userAddress.cityId;
              this.clientInfo.detailAddress =
                res.data.userAddress.detailedAddress;
            }
          }
        })
        .fail(res => {
          this.$message.error(res.msg);
        });
    },
    //提交能验证
    submitAllForm(ref, bType) {
      if (bType == "prev") {
        if (this.edittype != "04") {
          //新曾
          this.saveAllFrom(bType);
        } else {
          //编辑edittype 04编辑
          this.$router.go(-1);
        }
      } else {
        // console.log(this.parentCertList);
        // for (var j = 0; j < this.parentCertList.length; j++) {
        //     if (!this.parentCertList[j].certificatePath) {
        //         this.$message.error("请上传证件图片");
        //         return false;
        //     }
        //     if (!this.parentCertList[j].certificateName) {
        //         this.$message.error("附件名称不能为空！");
        //         return false;
        //     }
        // }
        // if (!this.read) {
        //     this.$message.error("请确认阅读用户责任书！");
        //     return false;
        // }
        this.$refs[ref].validate(valid => {
          if (valid) {
            this.saveAllFrom(bType);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    //保存下一步使用
    saveAllFrom(val) {
      let cityName, proName;
      this.provinceList.map(ele => {
        if (ele.proId == this.clientInfo.proId) {
          proName = ele.proName;
        }
      });
      this.cityList.map(ele => {
        if (ele.cityId == this.clientInfo.cityId) {
          cityName = ele.cityName;
        }
      });

      var clistItem = {
        certificateId: "",
        certificateName: "",
        certificatePath: ""
      };
      this.cList = [];
      for (var i = 0; i < this.parentCertList.length; i++) {
        clistItem = {
          certificateId: this.parentCertList[i].certificateId,
          certificateName: this.parentCertList[i].certificateName,
          certificatePath: this.parentCertList[i].certificatePath
            ? this.parentCertList[i].certificatePath
            : ""
        };
        this.cList.push(clistItem);
      }

      let data = {
        certificateList: this.cList,
        city: cityName,
        detailAddress: this.clientInfo.detailAddress,
        orderNo: this.orderNo,
        province: proName,
        recipient: this.clientInfo.agentName,
        recipientCertificateNumber: this.clientInfo
          .agentCertificateNumber,
        recipientCertificateType: this.clientInfo.agentCertificateType,
        recipientPhone: this.clientInfo.agentContactNumber,
        uniformCreditCode: this.orderInfo.enterpriseInfo
          .uniformCreditCode,
        enterpriseName: this.orderInfo.enterpriseInfo.enterpriseName,
        legalPersonCertificateNumber: this.orderInfo.enterpriseInfo
          .legalPersonCertificateNumber,
        legalPersonCertificateType: this.orderInfo.enterpriseInfo
          .legalPersonCertificateType,
        legalPersonName: this.orderInfo.enterpriseInfo.legalPersonName
      };
      if (val == "next") {
        this.nextbtnLoding = true;
      }
      if (val === 'next' && this.edittype === '04') { //编辑
        //编辑
        var self = this;
        let datas = {
          detailAddress: this.clientInfo.detailAddress,
          orderNo: this.orderNo,
          recipient: this.clientInfo.agentName,
          recipientCertificateNumber: this.clientInfo
            .agentCertificateNumber,
          recipientCertificateType: this.clientInfo
            .agentCertificateType,
          recipientPhone: this.clientInfo
            .agentContactNumber,
          province: proName,
          city: cityName,
          certificateList: this.cList,
          enterpriseName: this.orderInfo.enterpriseInfo
            .enterpriseName,
          uniformCreditCode: this.orderInfo.enterpriseInfo
            .uniformCreditCode,
          clientType: "01", // 终端类型：01.web端 02.微信小程序
          dutyParagraph: "", // 税号
          invoiceEnterpriseName: "",
          invoiceType: "",
          invoicesRaised: "",
          esealYear: this.$route.query.esealYear,
          addressFlag: 1,//是否需要地址标识(0:不需要;1:需要)用于地址检测
          step: '2'//当前所在步骤2
        };
        this.submitOrder(datas).then((res) => {
          if (this.successCheckCode(res)) {
            this.$message.success("提交成功！");
            setTimeout(function () {
              self.$router.push({ path: "/ukeyorder" });
            }, 1000);
            // this.setOrderStatus('02', '04').then(res => {
            // });
          }
        });
      } else {
        this.saveDraftOrder(data).then(res => {
          if (this.successCheckCode(res)) {
            if (val == "prev") {
              this.$router.push({
                path: "/addukeyseal",
                query: {
                  orderNo: this.orderInfo.orderBasicInfo.orderNo,
                  edittype: this.edittype
                }
              });
            } else if (val == "next") {
              if (this.edittype != "04") {
                //新增
                this.$router.push({
                  // path: "/addukeylist",
                  path: "/sealorderconfirm",
                  query: {
                    orderNo: this.orderInfo.orderBasicInfo
                      .orderNo,
                    edittype: this.edittype
                  }
                });
              }
              // else {
              //   //编辑
              //   let datas = {
              //     detailAddress: this.clientInfo.detailAddress,
              //     orderNo: this.orderNo,
              //     recipient: this.clientInfo.agentName,
              //     recipientCertificateNumber: this.clientInfo
              //       .agentCertificateNumber,
              //     recipientCertificateType: this.clientInfo
              //       .agentCertificateType,
              //     recipientPhone: this.clientInfo
              //       .agentContactNumber,
              //     province: proName,
              //     city: cityName,
              //     certificateList: this.cList,
              //     enterpriseName: this.orderInfo.enterpriseInfo
              //       .enterpriseName,
              //     uniformCreditCode: this.orderInfo.enterpriseInfo
              //       .uniformCreditCode,
              //     clientType: "01", // 终端类型：01.web端 02.微信小程序
              //     dutyParagraph: "", // 税号
              //     invoiceEnterpriseName: "",
              //     invoiceType: "",
              //     invoicesRaised: "",
              //     esealYear: this.$route.query.esealYear,
              //     step: '2'//当前所在步骤2
              //   };
              //   this.submitOrder(datas).then(res => {
              //     if (this.successCheckCode(res)) {
              //       // this.setOrderStatus();
              //       this.$message.success("提交成功！");
              //       setTimeout(function () {
              //         this.$router.push({ path: "/ukeyorder" });
              //       }, 1000);
              //     }
              //   });
              // }
            }
          } else {
            this.nextbtnLoding = false;
          }
        });
      }
    },
    setOrderStatus() {
      var self = this;
      var data = {
        operatorType: "02",
        orderNo: this.orderNo,
        orderStatus: "03",
        remark: "支付服务通知支付结果"
      };
      this.uptOrderStatus(data).then(res => {
        if (this.successCheckCode(res)) {
          self.$message.success("提交成功！");
          setTimeout(function () {
            self.$router.push({ path: "/ukeyorder" });
          }, 1000);
        }
      });
    },
  }
};
</script>
<style lang="scss">
.addseal .item .item-tit button .add-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url(../../../../static/image/icon-add.png) no-repeat;
  vertical-align: -3px;
  margin-right: 5px;
}

.addseal .item .item-tit button.el-button:hover {
  background-color: #fff;
  border: 1px solid #0073bd;
}

.addseal .item .item-tit button:hover span {
  color: #0073bd;
}

.addseal .item .item-tit button:hover .add-icon {
  background: url(../../../../static/image/icon-add-hover.png) no-repeat;
}

.addseal .cropper-dialog .item .item-cont .cont-item {
  padding-left: 0px;
}

.addseal .el-tabs .el-tabs__header {
  background: #fff;
  padding-left: 0;
  border-bottom: 1px solid rgb(209, 219, 229);
}

.addseal .el-tabs .el-tabs__header .el-tabs__nav .el-tabs__active-bar {
  z-index: 1;
  height: 1px;
  border-radius: 0;
  background-color: #2796dc;
}

.addseal .el-tabs .el-tabs__header .el-tabs__nav .el-tabs__item.is-active {
  color: #02adff;
}

.addseal .el-tabs .el-tabs__header .el-tabs__nav .el-tabs__item {
  padding: 0 16px;
  line-height: 38px;
  text-align: center;
  font-size: 16px;
  color: #999;
}

.addseal .el-tabs .el-table table thead th {
  background: #c9e5f8;
}

.el-tabs .el-table .el-table__header-wrapper th .cell {
  background: #c9e5f8;
  color: #626262;
}

.addseal .el-tabs .el-table .el-table__body-wrapper tr {
  background: #fff;
}

.addseal .cropper-dialog .tableimg {
  height: 30px;
}

.addseal .el-table table thead th .cell {
  color: #626262;
}

.addseal .avatar-uploader .el-upload {
  border: 1px dashed #e8ecef;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: #fafafa;
  width: 354px;
  height: 180px;
}

.addseal .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.addseal .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.addseal .avatar-uploader input {
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  cursor: pointer;
  display: block;
}

.addseal .avatar-uploader .el-loading-spinner {
  margin-top: -50px;
}

.addseal .el-icon-plus:before {
  content: "点击上传";
  width: 150px;
  height: 40px;
  line-height: 42px;
  position: absolute;
  text-align: center;
  top: 50%;
  left: 50%;
  margin-top: -37px;
  margin-left: -55px;
  font-size: 16px;
  color: #999999;
  background: url(../../../../static/image/icon-uploader.png) no-repeat;
  background-position: 0 0;
}

.addseal .avatar-uploader .el-upload:hover .el-icon-plus:before {
  color: #0073bd;
  background: url(../../../../static/image/icon-uploader-hover.png) no-repeat;
  background-position: 20px 0;
}

.addseal .uploader-tips {
  font-size: 12px;
  color: #999999;
}

.addseal .uploader-previewImg {
  border: 1px dashed #e8ecef;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: #fafafa;
  width: 348px;
  height: 320px;
}

.addseal .previewImg {
  margin: 0 auto;
  height: 180px;
  display: block;
  position: absolute;
  top: 0;
}
.addseal .viewseal {
  transform: scale(1.3);
  position: relative;
  bottom: 50px;
}
</style>
<style lang="scss">
.addseal {
  .top-title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8ecef;
    margin-bottom: 25px;
    position: relative;

    .titinfo {
      float: left;
      font-size: 18px;
      color: #333333;
    }
  }

  .item {
    padding: 5px 0 10px 0;

    .item-tit {
      font-size: 16px;
      color: #333;
      margin-bottom: 12px;

      .el-button {
        font-size: 14px;
        color: #02adff;
        border: 1px solid #02adff;
        border-radius: 4px;
        float: right;
        // width: 80px;
      }
    }

    .signetInfo {
      height: 36px;
      line-height: 36px;
      margin-bottom: 20px;
    }

    .item-cont {
      .cont-item {
        padding-left: 8px;
        line-height: 36px;

        .cont-item-tit {
          font-size: 14px;
          color: #626262;
          display: inline-block;
          width: 70px;
          margin-right: 15px;
        }

        .cont-item-txt {
          font-size: 14px;
          color: #333333;
        }
      }

      .tableimg {
        height: 40px;
      }

      .cert-uploader {
        .cert-uploader-item {
          float: left;
          margin-right: 20px;
          margin-bottom: 20px;

          .cert-item-name {
            font-size: 14px;
            color: #3f3f3f;
            margin-bottom: 10px;
            padding-left: 10px;

            span {
              font-size: 12px;
              color: #888;
            }
          }

          .imginfo {
            border: 1px solid #e8ecef;
            width: 220px;
            height: 140px;
            padding: 17px 25px;
            border-radius: 4px 4px 0 0;
            overflow: hidden;
            position: relative;
            text-align: center;

            .checkfile-btn {
              font-size: 28px;
              color: #8c939d;
              width: 220px;
              height: 140px;
              line-height: 140px;
              text-align: center;
            }

            .img-example {
              position: absolute;
              left: 25px;
              top: 17px;
              width: 170px;
              height: 106px;
              opacity: 0.4;
              background: #333333;
              border-radius: 6px;
              cursor: pointer;
              display: none;

              .img-example-txt {
                font-size: 12px;
                color: #ffffff;
                text-align: center;
                line-height: 144px;
              }

              .img-example-icon {
                width: 16px;
                height: 16px;
                position: absolute;
                text-align: right;
                top: 50%;
                left: 50%;
                margin-top: -8px;
                margin-left: -8px;
                background: url(../../../../static/image/icon-enlargement.png)
                  no-repeat;
                background-size: 16px 16px;
                background-position: 0 0;
              }
            }

            .img-cont {
              background-color: #adadad;
              width: 100%;
              height: 100%;
              border-radius: 5px;
            }
          }
        }
      }
    }
    .item-tips {
      margin-top: 20px;
      font-size: 14px;
      line-height: 26px;
      width: 420px;
      &-left {
        color: #999999;
        font-size: 14px;
      }
      &-right {
        p {
          font-size: 14px;
          color: #999999;
        }
      }
    }
  }

  .footbtn {
    text-align: right;
    padding: 26px 0 0px;

    .el-button {
      width: 100px;
    }
  }

  input.el-input__inner {
    background: #fff;
  }

  .cropper-dialog-body {
    .previewImg {
      height: 240px;
      width: 240px;
    }

    .el-select {
      width: 100%;
    }

    .sealspec {
      width: 94px;
      height: 40px;

      &:first-child {
        margin-right: 30px;
      }
    }

    .uploadinput {
      width: 100%;
      height: 40px;
      opacity: 0;
      position: absolute;
      left: 0;
      top: 2px;
      z-index: 1;
      cursor: pointer;
      font-size: 0;
      font-size: 210px \0; //解决ie双击生效问题
    }

    .fileForm {
      display: block;
      background-color: #eee;
      width: 100%;
      height: 40px;
      cursor: pointer;
      margin-top: -72px;
      border-radius: 8px;
      box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);

      &:hover {
        background-color: #f3f3f3;
      }
    }

    .viewseal {
      height: 320px;
      width: 244px;
      margin: 0 auto;
      position: relative;

      img.hetongbg {
        height: 100%;
        width: 100%;
      }

      #position {
        position: absolute;
        margin: 0;

        img {
          height: 100%;
          width: 100%;
          vertical-align: top;
        }
      }
    }
  }

  .cropper-dialog {
    .el-dialog {
      width: 800px;
      height: 560px;
      border-radius: 10px;

      .el-dialog__header {
        padding: 10px 20px;
        border-radius: 10px 10px 0 0;
        background: #e8ecef;

        .el-dialog__headerbtn {
          margin-top: 0;
        }

        .el-dialog__title {
          font-size: 16px;
          font-weight: normal;
        }
      }
    }

    .el-dialog__body {
      padding: 20px;
    }
  }

  .cropper-content {
    .cropper {
      float: left;

      .vue-cropper {
        width: 350px;
        height: 166px;
      }
    }

    .show-preview {
      float: right;
      padding: 0 25px;
      width: 400px;
      position: relative;

      .preview {
        border: 1px solid #cccccc;
        background: #cccccc;
        overflow: hidden;
      }
    }
  }

  .footer-btn {
    .scope-btn {
      padding: 10px 0;
      width: 350px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      -webkit-justify-content: space-between;

      button {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #c4c4c4;
        color: rgb(31, 46, 61);
        padding: 10px 15px;
        border-radius: 4px;
      }

      .btn {
        white-space: nowrap;
        cursor: pointer;
        text-align: center;
        transition: 0.1s;
        padding: 8px 15px;
        font-size: 14px;
        border-radius: 3px;
        color: #fff;
        background-color: #67c23a;
        border-color: #67c23a;
      }
    }

    .uploader-tips {
      color: #999999;
      font-size: 12px;
    }
  }

  .upload-btn {
    text-align: center;
    margin-top: 20px;
    margin-right: 25px;

    .el-button {
      padding: 10px 30px;
    }
  }

  .seal-preview-model {
    .el-dialog {
      width: 500px;
      height: 650px;
      background: #fff;
      padding-top: 24px;
      text-align: center;
      /*top: 50% !important;
                margin-top: -360px;*/
      margin-bottom: 0;
      padding-top: 0;
    }

    .el-dialog__header {
      padding: 20px;
    }
    .el-dialog__body {
      overflow: hidden;
    }
    .bighetong {
      max-width: 426px;
      max-height: 590px;
      margin: 0 auto;
      position: relative;
      box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.2);

      transform: scale(1.3);
      bottom: 84px;

      .hetongimg {
        max-width: 426px;
        max-height: 590px;
      }

      .showsealmodel {
        position: absolute;

        img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
</style>
<style>
.addseal .client-info .el-form-item__content {
  width: 354px;
  display: inline-block;
}
.addseal .client-info .el-form-item__label {
  width: 110px;
  margin-right: 10px;
  color: #626262;
  vertical-align: top;
  height: 36px;
  line-height: 36px;
  padding: 0;
}
.addseal .client-info input.el-input__inner {
  background: #fff;
}
</style>
