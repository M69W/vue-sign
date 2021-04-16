<template>
    <div class="contract_signature">
        <div class="header">
            <span class="back" @click="back()" title="返回合同列表">
                <i class="icon-back"></i>返回
            </span>
            <a href="javascript:;" class="logo">
                <img
                    src="../../../../static/image/logo.png"
                    @click="routerTo('index')"
                />
            </a>
        </div>
        <div class="mian">
            <!--<div class="mian" v-loading="loadingTabel">-->
            <div class="left">
                <div class="tab-box">
                    <ul class="autograph_tab">
                        <li
                            @click="handleSealTabClick('anyin')"
                            :class="{ active: !isShenzhenTab }"
                        >
                            安印电子印章
                        </li>
                        <li
                            @click="handleSealTabClick('shenzhen')"
                            :class="{ active: isShenzhenTab }"
                        >
                            深圳市电子印章
                        </li>
                    </ul>
                </div>
                <!-- 原有的安印电子印章 -->
                <template v-if="!isShenzhenTab">
                    <!-- 把 `给待签署人标记签署的位置` 这一块移到该 `安印电子印章` 块中 -->
                    <template>
                        <div
                            v-show="editType != '01' && !isTemp"
                            class="select-signer"
                        >
                            <p class="title">给待签署人标记签署的位置</p>
                            <el-select
                                v-model="value"
                                placeholder="选择待签署人"
                                @change="draggable"
                                :title="value"
                            >
                                <el-option
                                    v-for="(
                                        item, index
                                    ) in compactSignatoryList"
                                    :key="item.compactSignatoryId"
                                    :label="item.compactSignatoryName"
                                    :value="item.compactSignatoryId"
                                    :data-number="index"
                                    v-if="userId != item.userId"
                                ></el-option>
                            </el-select>
                            <ul class="autograph" style="height: 78px">
                                <div class="cover" v-if="cover"></div>
                                <li
                                    id="draggable"
                                    disabled="true"
                                    class="ui-state-highlight"
                                    data-type="02"
                                    :data-id="id"
                                    :class="{
                                        compactDocumentType:
                                            compactDocumentType == '02',
                                    }"
                                >
                                    <span class="img img_autograph"></span>
                                    <span>签名</span>
                                    <span class="name" :title="valueName">{{
                                        valueName
                                    }}</span>
                                    <span class="name_border"></span>
                                </li>
                                <li
                                    id="draggable2"
                                    disabled="true"
                                    class="ui-state-highlight"
                                    data-type="01"
                                    :data-id="id"
                                    v-show="valueUserType != '02'"
                                    :class="{
                                        compactDocumentType:
                                            compactDocumentType == '02',
                                    }"
                                >
                                    <span class="img img_seal"></span>
                                    <span>盖章</span>
                                    <span class="name" :title="valueName">{{
                                        valueName
                                    }}</span>
                                    <span class="name_border"></span>
                                </li>
                            </ul>
                        </div>
                        <div v-show="editType != '01'" class="line"></div>
                        <p
                            class="title"
                            v-if="editType == '01' && isCurrentSign"
                            style="
                                text-align: right;
                                padding-right: 20px;
                                cursor: pointer;
                            "
                            @click="mysign()"
                        >
                            进入印章管理
                            <img
                                src="../../../../static/image/back.png"
                                style="
                                    transform: rotate(180deg) scale(0.5);
                                    padding-right: 5px;
                                "
                            />
                        </p>
                    </template>

                    <div>
                        <div
                            class="sign-time"
                            v-if="
                                (editType == '01' && isCurrentSign) ||
                                (!isTemp && isFirstSignatory == 1) ||
                                (isTemp &&
                                    signUser &&
                                    isShowSignTime &&
                                    isCurrentSign)
                            "
                        >
                            <p>
                                签署时间
                                <span class="mark"
                                    >?<i>拖动/单击时间控件到合同正文上</i></span
                                >
                            </p>
                            <div id="timeMask">
                                <span>{{ nowDate }}</span>
                            </div>
                        </div>

                        <div
                            v-show="
                                (editType == '01' && isCurrentSign) ||
                                (!isTemp && isFirstSignatory == 1) ||
                                (isTemp &&
                                    signUser &&
                                    isShowSignTime &&
                                    isCurrentSign)
                            "
                            :style="navHeight"
                        >
                            <!--签名选择tab-->
                            <div class="tab-box" v-if="userType == '01'">
                                <ul class="autograph_tab">
                                    <li
                                        @click="tab('0')"
                                        :class="{ active: !autographType }"
                                    >
                                        电子印章
                                    </li>
                                    <li
                                        @click="tab('1')"
                                        :class="{ active: autographType }"
                                    >
                                        我的签名
                                    </li>
                                </ul>
                            </div>
                            <div class="tab-box" v-else>
                                <ul class="autograph_tab">
                                    <li class="active" style="cursor: default">
                                        我的签名
                                    </li>
                                </ul>
                            </div>
                            <!--ukey读取box-->
                            <div
                                class="ukey-box"
                                v-show="autographType && userType == '02'"
                            >
                                <p class="ukey-box-title">
                                    UKey签名
                                    <el-button
                                        class="span"
                                        @click="checkUkeyVer(readUkey, '01')"
                                        :loading="ukeyReading"
                                        >读取
                                    </el-button>
                                </p>
                                <p
                                    class="ukey-box-content none"
                                    v-show="!ukeySignList.length"
                                >
                                    请插入UKey,读取签名
                                </p>
                                <ul
                                    v-show="ukeySignList.length"
                                    class="seal_box clearfix singAutograph"
                                    id="ukeySign"
                                >
                                    <li
                                        class="autograph_list drag_list"
                                        :id="'ukeySign' + index"
                                        v-for="(
                                            autograph, index
                                        ) in ukeySignList"
                                        :key="autograph.pictureCode"
                                        :data-sealid="autograph.pictureCode"
                                        data-type="02"
                                        :data-signatureType="
                                            autograph.signatureType
                                        "
                                        :data-width="autograph.signatureWidth"
                                        :data-height="autograph.signatureHeight"
                                        :class="{
                                            compactDocumentType:
                                                compactDocumentType == '02',
                                        }"
                                    >
                                        <div>
                                            <img
                                                class="imgSrc"
                                                :src="
                                                    autograph.signatureFilePath
                                                "
                                            />
                                        </div>
                                        <p
                                            class="sign-title"
                                            :title="autograph.signatureName"
                                        >
                                            {{ autograph.signatureName }}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <div class="ukey-box" v-show="!autographType">
                                <p class="ukey-box-title">
                                    UKey印章
                                    <el-button
                                        class="span"
                                        @click="checkUkeyVer(readUkey, '02')"
                                        :loading="ukeyReading"
                                        >读取
                                    </el-button>
                                </p>
                                <p
                                    class="ukey-box-content none"
                                    v-show="!ukeySealList.length"
                                >
                                    请插入UKey,读取印章
                                </p>
                                <ul
                                    v-show="ukeySealList.length"
                                    class="seal_box clearfix singAutograph"
                                    id="ukeySeal"
                                >
                                    <li
                                        class="autograph_list drag_list"
                                        :id="'ukeySeal' + index"
                                        v-for="(
                                            autograph, index
                                        ) in ukeySealList"
                                        :key="autograph.pictureCode"
                                        :data-sealid="autograph.pictureCode"
                                        data-type="01"
                                        :data-signatureType="
                                            autograph.signatureType
                                        "
                                        :data-width="autograph.signatureWidth"
                                        :data-height="autograph.signatureHeight"
                                        :class="{
                                            compactDocumentType:
                                                compactDocumentType == '02',
                                        }"
                                    >
                                        <div>
                                            <img
                                                class="imgSrc"
                                                :src="
                                                    autograph.signatureFilePath
                                                "
                                                @error="errorImage"
                                            />
                                        </div>
                                        <p
                                            class="sign-title"
                                            :title="autograph.signatureName"
                                        >
                                            {{ autograph.signatureName }}
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            <div class="cloud-box-title">
                                {{ autographType ? "云签名" : "云印章" }}
                            </div>
                            <!--云签名、云印章-->
                            <el-scrollbar
                                class="cloud-box-scrollbar"
                                :style="{ height: cloudBoxScrollbarHeight }"
                            >
                                <div class="cloud-box">
                                    <div class="cloud-box-content">
                                        <!--发起人签名列表-->
                                        <div
                                            v-show="
                                                autographType &&
                                                (isFirstSignatory == '1' ||
                                                    (isTemp && signUser)) &&
                                                editType != '01'
                                            "
                                        >
                                            <ul
                                                class="autograph_box clearfix singAutograph"
                                                id="autograph"
                                            >
                                                <li
                                                    class="autograph_list drag_list"
                                                    :id="'autograph_' + index"
                                                    v-for="(
                                                        autograph, index
                                                    ) in mySignList"
                                                    :key="autograph.pictureCode"
                                                    :data-sealid="
                                                        autograph.pictureCode
                                                    "
                                                    :data-signatureType="
                                                        autograph.signatureType
                                                    "
                                                    data-type="02"
                                                    :data-width="
                                                        autograph.signatureWidth
                                                    "
                                                    :data-height="
                                                        autograph.signatureHeight
                                                    "
                                                    :class="{
                                                        compactDocumentType:
                                                            compactDocumentType ==
                                                            '02',
                                                    }"
                                                >
                                                    <div>
                                                        <img
                                                            class="imgSrc"
                                                            :src="
                                                                compToken(
                                                                    autograph.signatureFilePath
                                                                )
                                                            "
                                                        />
                                                    </div>
                                                    <p
                                                        class="sign-title"
                                                        :title="
                                                            autograph.signatureName
                                                        "
                                                    >
                                                        {{
                                                            autograph.signatureName
                                                        }}
                                                    </p>
                                                </li>
                                                <p
                                                    class="nodata"
                                                    style="clear: both"
                                                    v-if="
                                                        mySignList.length == 0
                                                    "
                                                >
                                                    暂无签名
                                                </p>
                                            </ul>
                                        </div>
                                        <!--签署人签名列表-->
                                        <div
                                            v-show="
                                                editType == '01' &&
                                                autographType
                                            "
                                        >
                                            <ul
                                                class="autograph_box clearfix singAutograph"
                                                id="autograph"
                                            >
                                                <li
                                                    class="autograph_list drag_list"
                                                    :id="'autograph_' + index"
                                                    v-for="(
                                                        autograph, index
                                                    ) in mySignList"
                                                    :key="autograph.pictureCode"
                                                    :data-sealid="
                                                        autograph.pictureCode
                                                    "
                                                    data-type="02"
                                                    :data-signatureType="
                                                        autograph.signatureType
                                                    "
                                                    :data-width="
                                                        autograph.signatureWidth
                                                    "
                                                    :data-height="
                                                        autograph.signatureHeight
                                                    "
                                                    :class="{
                                                        compactDocumentType:
                                                            compactDocumentType ==
                                                            '02',
                                                    }"
                                                >
                                                    <div>
                                                        <img
                                                            class="imgSrc"
                                                            :src="
                                                                compToken(
                                                                    autograph.signatureFilePath
                                                                )
                                                            "
                                                        />
                                                    </div>
                                                    <p
                                                        class="sign-title"
                                                        :title="
                                                            autograph.signatureName
                                                        "
                                                    >
                                                        {{
                                                            autograph.signatureName
                                                        }}
                                                    </p>
                                                </li>
                                                <p
                                                    class="nodata"
                                                    style="clear: both"
                                                    v-if="
                                                        mySignList.length == 0
                                                    "
                                                >
                                                    暂无签名
                                                </p>
                                            </ul>
                                        </div>
                                        <!--印章列表-->
                                        <div v-show="!autographType">
                                            <ul
                                                class="seal_box clearfix singAutograph"
                                                id="seal"
                                            >
                                                <li
                                                    class="autograph_list drag_list"
                                                    :id="'autograph_' + index"
                                                    v-for="(
                                                        autograph, index
                                                    ) in ukeySealLists"
                                                    :key="autograph.pictureCode"
                                                    :data-sealid="
                                                        autograph.pictureCode
                                                    "
                                                    data-type="01"
                                                    :data-signatureType="
                                                        autograph.signatureType
                                                    "
                                                    :data-width="
                                                        autograph.signatureWidth
                                                    "
                                                    :data-height="
                                                        autograph.signatureHeight
                                                    "
                                                    :class="{
                                                        compactDocumentType:
                                                            compactDocumentType ==
                                                            '02',
                                                    }"
                                                >
                                                    <div>
                                                        <img
                                                            class="imgSrc"
                                                            :src="
                                                                compToken(
                                                                    autograph.signatureFilePath
                                                                )
                                                            "
                                                        />
                                                    </div>
                                                    <p
                                                        class="sign-title"
                                                        :title="
                                                            autograph.signatureName
                                                        "
                                                    >
                                                        {{
                                                            autograph.signatureName
                                                        }}
                                                    </p>
                                                </li>
                                                <p
                                                    class="nodata"
                                                    v-if="
                                                        !ukeySealLists.length >
                                                        0
                                                    "
                                                    style="clear: both"
                                                >
                                                    暂无电子印章
                                                </p>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </el-scrollbar>
                            <!--印章分页-->
                            <div
                                class="pic-pagination"
                                v-if="!autographType && total2 > pageSize2"
                            >
                                <!--<div style="border-bottom:1px solid #eee;"></div>-->
                                <el-pagination
                                    small
                                    @current-change="handleCurrentChange2"
                                    :current-page="currentpage2"
                                    :page-size="pageSize2"
                                    :total="total2"
                                    layout="prev, pager, next"
                                ></el-pagination>
                            </div>
                            <!--签名分页-->
                            <div
                                class="pic-pagination"
                                v-if="autographType && total1 > pageSize1"
                            >
                                <!--<div class="pic-pagination">-->
                                <!--<div style="border-bottom:1px solid #eee;"></div>-->
                                <el-pagination
                                    small
                                    @current-change="handleCurrentChange1"
                                    :current-page="currentpage1"
                                    :page-size="pageSize1"
                                    :total="total1"
                                    layout="prev, pager, next"
                                ></el-pagination>
                            </div>
                            <div
                                class="add_name"
                                id="add_autograph"
                                v-if="autographType"
                                @click="goMysign('0')"
                            >
                                <p class="el-icon-plus"></p>
                                <p>添加签名</p>
                            </div>
                            <div
                                class="add_name"
                                id="add_seal"
                                v-if="!autographType"
                                @click="goMysign('1')"
                            >
                                <div>
                                    <p class="el-icon-plus"></p>
                                    <p>添加电子印章</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- 新增的深圳市电子印章 -->
                <template v-else>
                    <div>
                        <!-- TODO 去授权 BTN -->
                        <div class="wrapper--auth">
                            <div class="auth--desc">
                                支持由深圳市统一电子印章平台发放企业印章应用，请先完成授权。
                            </div>
                            <div class="auth-btn">
                                <el-button
                                    type="primary"
                                    style="width: 196px"
                                    @click="
                                        toAuthByShenzhen({
                                            flag: 'isFromClick',
                                        })
                                    "
                                >
                                    去授权
                                </el-button>
                            </div>
                        </div>

                        <!-- TODO 深圳市电子印章列表 -->
                        <div class="wrapper-seal--shenzhen">
                            <div class="cloud-box-title">电子印章</div>
                            <el-scrollbar
                                class="cloud-box-scrollbar"
                                :style="{ height: cloudBoxScrollbarHeight }"
                            >
                                <div class="cloud-box">
                                    <div class="cloud-box-content">
                                        <ul
                                            class="seal_box clearfix singAutograph"
                                            id="seal"
                                        >
                                            <li
                                                class="autograph_list drag_list"
                                                :id="'autograph_' + sealIdx"
                                                v-for="(
                                                    sealItem, sealIdx
                                                ) in shenzhenSealList"
                                                :key="sealItem.sealCode"
                                                :data-sealid="sealItem.sealCode"
                                                data-type="07"
                                                :data-grant-code="
                                                    sealItem.sealGrantCode
                                                "
                                                :data-cert="sealItem.cert"
                                                :data-signatureType="
                                                    sealItem.signatureType
                                                "
                                                :data-width="
                                                    sealItem.signatureWidth
                                                "
                                                :data-height="
                                                    sealItem.signatureHeight
                                                "
                                                :class="{
                                                    compactDocumentType:
                                                        compactDocumentType ==
                                                        '02',
                                                }"
                                            >
                                                <div>
                                                    <img
                                                        class="imgSrc"
                                                        :src="
                                                            base64ToUrl(
                                                                sealItem.sealImg
                                                            )
                                                        "
                                                    />
                                                </div>
                                                <p
                                                    class="sign-title"
                                                    :title="sealItem.sealName"
                                                >
                                                    {{ sealItem.sealName }}
                                                </p>
                                            </li>
                                            <p
                                                class="nodata"
                                                v-if="
                                                    !shenzhenSealList.length > 0
                                                "
                                                style="clear: both"
                                            >
                                                暂无电子印章
                                            </p>
                                        </ul>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                </template>
            </div>
            <div class="center">
                <div class="guide-img1" v-if="guideLead == 1">
                    <img src="../../../../static/image/guide-5.png" />
                    <span class="guide-know" @click="guideLead = 2"></span>
                    <span class="guide-mysign">我的签名</span>
                    <span class="guide-read">读取</span>
                    <span class="guide-cloud">云印章</span>
                </div>
                <div class="guide-img2" v-if="guideLead == 2">
                    <img src="../../../../static/image/guide-6.png" />
                    <span class="guide-know" @click="guideLead = 0"></span>
                    <span class="guide-sign">完成签署</span>
                </div>
                <div class="doll" v-if="isHadSignPos && signMarkArr.length">
                    <div class="cloud">
                        <p v-if="compactDocumentList.length == 1">
                            有标记签署位置：<br />
                            <span
                                v-for="(item, index) in signMarkArr"
                                :key="index"
                            >
                                {{ index + 1 }}、请为第{{
                                    item.signatureStartPage
                                }}页选择{{
                                    item.signType == "1" ||
                                    item.sealType == "01"
                                        ? "印章"
                                        : "签名"
                                }}; <br v-if="index == 0" />
                            </span>
                        </p>
                        <p v-else>
                            有标记签署位置：<br />
                            <span
                                v-for="(item, index) in signMarkArr"
                                :key="index"
                            >
                                {{ index + 1 }}、请为【第{{
                                    item.compactServings
                                }}份文件-{{ item.signatureStartPage }}页】{{
                                    item.signType == "1" ||
                                    item.sealType == "01"
                                        ? "签章"
                                        : "签名"
                                }};<br v-if="index == 0" />
                            </span>
                        </p>
                    </div>
                </div>
                <el-scrollbar id="scroll">
                    <!--<p class="page"><span id="pageNumber">{{pageNumber}}</span>/<span id="pageTotal">{{pageTotal}}</span></p>-->
                    <p class="pagetext">
                        页码：{{ pageNumber }} / {{ pageTotal }}
                    </p>
                    <div class="img_box" id="img_box">
                        <div
                            v-for="(fileinfo, index) in fileList"
                            :key="fileinfo.imgUrl"
                            class="list"
                        >
                            <img
                                :src="fileinfo.imgUrl"
                                @load="successLoadImg"
                                @error="imgLoadError"
                            />
                        </div>
                        <!--<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"-->
                        <!--:infinite-scroll-distance="height">-->
                        <!--<div class="loading" style="text-align: center" v-if="nomore">加载中...</div>-->
                        <!--</div>-->

                        <div
                            class="drag drag_list ui-draggable"
                            v-for="(data, index) in compactFieldList"
                            v-show="data.compactFileCode == compactFileCode"
                            :key="index"
                            :class="{
                                sign:
                                    (editType == '01' || isTemp) &&
                                    !data.sealId &&
                                    !data.signTime,
                                singDrg:
                                    (editType == '01' || isTemp) && data.sealId,
                            }"
                            :data-id="index"
                            :style="{
                                position: 'absolute',
                                left:
                                    data.signatureCoordinateX * widthPx + 'px',
                                top:
                                    heightPx * (1 - data.signatureCoordinateY) +
                                    'px',
                            }"
                        >
                            <!--拖拽的指定位置签名-->
                            <!--单页-->
                            <div
                                class="drag_name"
                                v-if="
                                    !data.sealId &&
                                    data.sealType == '02' &&
                                    data.signatureStartPage == pageNumber &&
                                    data.signatureMethod == '01'
                                "
                            >
                                <!--发起人 数据index小于10-->
                                <div
                                    class="name"
                                    :style="{ background: color[index] }"
                                    v-if="
                                        index < 10 &&
                                        !(
                                            (editType == '01' || isTemp) &&
                                            !data.sealId
                                        )
                                    "
                                >
                                    {{ data.signName }}
                                </div>
                                <!--发起人 数据index大于10-->
                                <div
                                    class="name"
                                    :title="data.signName"
                                    :style="{
                                        background:
                                            color[
                                                index
                                                    .toString()
                                                    .substring(
                                                        index.toString()
                                                            .length - 1,
                                                        index.toString().length
                                                    )
                                            ],
                                    }"
                                    v-if="
                                        index >= 10 &&
                                        !(
                                            (editType == '01' || isTemp) &&
                                            !data.sealId
                                        )
                                    "
                                >
                                    {{ data.signName }}
                                </div>
                                <div
                                    class="imgName"
                                    :class="{
                                        boxfill:
                                            (editType == '01' || isTemp) &&
                                            !data.sealId,
                                    }"
                                >
                                    <div
                                        :class="{
                                            imgbox:
                                                (editType == '01' || isTemp) &&
                                                !data.sealId,
                                        }"
                                    >
                                        <img
                                            src="../../../../static/image/singName.png"
                                        />
                                    </div>
                                </div>
                                <i
                                    class="el-message-box__close el-icon-close"
                                    @click="deleteSign(index)"
                                    v-if="editType != '01' && !isTemp"
                                ></i>
                            </div>
                            <!--多页-->
                            <div
                                class="drag_name"
                                v-if="
                                    !data.sealId &&
                                    data.sealType == '02' &&
                                    ((data.signatureStartPage <= pageNumber &&
                                        data.signatureEndPage >= pageNumber) ||
                                        (data.signatureEndPage == 1 &&
                                            data.signatureStartPage != 1)) &&
                                    data.signatureMethod != '01'
                                "
                            >
                                <div
                                    class="name"
                                    :title="data.signName"
                                    :style="{ background: color[index] }"
                                    v-if="
                                        index < 10 &&
                                        !(editType == '01' && !data.sealId)
                                    "
                                >
                                    {{ data.signName }}
                                </div>
                                <div
                                    class="name"
                                    :title="data.signName"
                                    :style="{
                                        background:
                                            color[
                                                index
                                                    .toString()
                                                    .substring(
                                                        index.toString()
                                                            .length - 1,
                                                        index.toString().length
                                                    )
                                            ],
                                    }"
                                    v-if="
                                        index >= 10 &&
                                        !(editType == '01' && !data.sealId)
                                    "
                                >
                                    {{ data.signName }}
                                </div>
                                <div class="imgName">
                                    <img
                                        src="../../../../static/image/singName.png"
                                    />
                                </div>
                                <i
                                    class="el-message-box__close el-icon-close"
                                    @click="deleteSign(index)"
                                    v-if="editType != '01'"
                                ></i>
                            </div>
                            <!--拖拽的指定位置印章-->
                            <!--单页-->
                            <div
                                class="drag_Seal"
                                v-if="
                                    !data.sealId &&
                                    data.sealType == '01' &&
                                    data.signatureStartPage == pageNumber &&
                                    data.signatureMethod == '01'
                                "
                            >
                                <div
                                    class="name"
                                    :title="data.signName"
                                    :style="{ background: color[index] }"
                                    v-if="
                                        index < 10 &&
                                        !(
                                            (editType == '01' || isTemp) &&
                                            !data.sealId
                                        )
                                    "
                                >
                                    {{ data.signName }}
                                </div>
                                <div
                                    class="name"
                                    :title="data.signName"
                                    :style="{
                                        background:
                                            color[
                                                index
                                                    .toString()
                                                    .substring(
                                                        index.toString()
                                                            .length - 1,
                                                        index.toString().length
                                                    )
                                            ],
                                    }"
                                    v-if="
                                        index >= 10 &&
                                        !(
                                            (editType == '01' || isTemp) &&
                                            !data.sealId
                                        )
                                    "
                                >
                                    {{ data.signName }}
                                </div>
                                <div
                                    class="imgSeal"
                                    :class="{
                                        boxfill:
                                            (editType == '01' || isTemp) &&
                                            !data.sealId,
                                    }"
                                >
                                    <div
                                        :class="{
                                            imgbox:
                                                (editType == '01' || isTemp) &&
                                                !data.sealId,
                                        }"
                                    >
                                        <img
                                            src="../../../../static/image/Oval.png"
                                        />
                                    </div>
                                </div>
                                <i
                                    class="el-message-box__close el-icon-close"
                                    @click="deleteSign(index)"
                                    v-if="editType != '01' && !isTemp"
                                ></i>
                            </div>
                            <!--多页-->
                            <div
                                class="drag_Seal"
                                v-if="
                                    !data.sealId &&
                                    data.sealType == '01' &&
                                    ((data.signatureStartPage <= pageNumber &&
                                        data.signatureEndPage >= pageNumber) ||
                                        (data.signatureEndPage == 1 &&
                                            data.signatureStartPage != 1)) &&
                                    data.signatureMethod != '01'
                                "
                            >
                                <div
                                    class="name"
                                    :title="data.signName"
                                    :style="{ background: color[index] }"
                                    v-if="
                                        index < 10 &&
                                        !(editType == '01' && !data.sealId)
                                    "
                                >
                                    {{ data.signName }}
                                </div>
                                <div
                                    class="name"
                                    :title="data.signName"
                                    :style="{
                                        background:
                                            color[
                                                index
                                                    .toString()
                                                    .substring(
                                                        index.toString()
                                                            .length - 1,
                                                        index.toString().length
                                                    )
                                            ],
                                    }"
                                    v-if="
                                        index >= 10 &&
                                        !(editType == '01' && !data.sealId)
                                    "
                                >
                                    {{ data.signName }}
                                </div>
                                <div class="imgSeal">
                                    <img
                                        src="../../../../static/image/Oval.png"
                                    />
                                </div>
                                <i
                                    class="el-message-box__close el-icon-close"
                                    @click="deleteSign(index)"
                                    v-if="editType != '01'"
                                ></i>
                            </div>
                            <!--拖拽的签章-->
                            <!--单页-->
                            <div
                                class="autograph_seal"
                                v-if="
                                    data.sealId &&
                                    data.signatureStartPage == pageNumber &&
                                    data.signatureMethod == '01'
                                "
                            >
                                <img
                                    :src="data.imgUrl"
                                    :width="data.width"
                                    :height="data.height"
                                />
                                <i
                                    class="el-message-box__close el-icon-close"
                                    @click="deleteSign(index)"
                                ></i>
                            </div>
                            <!--多页-->
                            <div
                                class="autograph_seal"
                                v-if="
                                    data.sealId &&
                                    ((data.signatureStartPage <= pageNumber &&
                                        data.signatureEndPage >= pageNumber) ||
                                        (data.signatureEndPage == 1 &&
                                            data.signatureStartPage != 1)) &&
                                    data.signatureMethod != '01'
                                "
                            >
                                <img
                                    :src="data.imgUrl"
                                    :width="data.width"
                                    :height="data.height"
                                />
                                <i
                                    class="el-message-box__close el-icon-close"
                                    @click="deleteSign(index)"
                                ></i>
                            </div>
                            <!--时间戳-->
                            <div
                                class="autograph_seal"
                                v-if="
                                    data.sealType == '05' &&
                                    data.signatureStartPage == pageNumber &&
                                    data.signatureMethod == '01'
                                "
                            >
                                <img
                                    :src="data.imgUrl"
                                    :width="data.width"
                                    :height="data.height"
                                    style="display: block"
                                />
                                <i
                                    class="el-message-box__close el-icon-close"
                                    @click="deleteSign(index)"
                                ></i>
                            </div>
                            <div
                                class="autograph_seal"
                                v-if="
                                    data.sealType == '05' &&
                                    ((data.signatureStartPage <= pageNumber &&
                                        data.signatureEndPage >= pageNumber) ||
                                        (data.signatureEndPage == 1 &&
                                            data.signatureStartPage != 1)) &&
                                    data.signatureMethod != '01'
                                "
                            >
                                <img
                                    :src="data.imgUrl"
                                    :width="data.width"
                                    :height="data.height"
                                    style="display: block"
                                />
                                <i
                                    class="el-message-box__close el-icon-close"
                                    @click="deleteSign(index)"
                                ></i>
                            </div>
                        </div>
                    </div>
                    <ul class="goto-wrapper">
                        <template v-if="!isShenzhenTab">
                            <li
                                class="type"
                                :class="
                                    signatureMethod == '01' ? 'current' : ''
                                "
                                @click="chosseSign('01')"
                            >
                                单页签章
                            </li>
                            <li
                                class="type"
                                :class="
                                    signatureMethod == '02' ? 'current' : ''
                                "
                                @click="chosseSign('02')"
                            >
                                多页签章
                            </li>
                            <li
                                class="type"
                                :class="
                                    signatureMethod == '03' ? 'current' : ''
                                "
                                @click="chosseSign('03')"
                            >
                                骑缝签章
                            </li>
                        </template>
                        <!--首页-->
                        <li
                            class="first_page"
                            :class="{ first_page_last: pageNumber <= 1 }"
                            style="
                                margin-top: 20px;
                                text-align: center;
                                height: 24px;
                                background: none;
                                border: none;
                                padding: 0;
                            "
                        >
                            <a @click="firstPage()" style="color: #0677bf"></a>
                        </li>
                        <!--上一页-->
                        <li
                            class="prev"
                            style="margin-top: 0"
                            :class="{ prev_last: pageNumber <= 1 }"
                        >
                            <a @click="scrollprev()"></a>
                            <!--:href=" '#scroll-'+ pageNumber"-->
                        </li>
                        <!--下一页-->
                        <li
                            class="next"
                            :class="{ next_last: pageNumber >= pageTotal }"
                        >
                            <a @click="scrollnext()"></a>
                            <!--:href=" '#scroll-'+ pageNumber"-->
                        </li>
                        <!--末页-->
                        <li
                            class="last_page"
                            :class="{ last_page_last: pageNumber == pageTotal }"
                            style="
                                text-align: center;
                                height: 24px;
                                background: none;
                                border: none;
                                padding: 0;
                            "
                        >
                            <a @click="lastPage()" style="color: #0677bf"></a>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
            <div class="right" style="overflow-y: auto">
                <p class="title">合同文件</p>
                <el-scrollbar tag="ul" class="contract_list">
                    <li
                        v-for="info in compactDocumentList"
                        :key="info.compactDocumentId"
                        @click="
                            contractInfo(
                                info.compactDocumentCode,
                                info.compactDocumentPage,
                                info.compactDocumentId,
                                info.compactDocumentType
                            )
                        "
                        :class="{
                            active: compactFileCode == info.compactDocumentId,
                        }"
                    >
                        <div class="box-show">
                            <div class="img_box">
                                <img
                                    :src="
                                        info.compactFirstImagePath +
                                        '&compactId=' +
                                        compactId +
                                        '&token=' +
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
                </el-scrollbar>

                <el-button
                    @click="noSign()"
                    v-if="editType != '01'"
                    class="el-button el-button--default nosign"
                    :disabled="disabled"
                    >暂不签署</el-button
                >
                <el-button
                    @click="backlist()"
                    v-if="editType == '01'"
                    class="el-button el-button--default nosign"
                    :disabled="disabled"
                    >暂不签署</el-button
                >
                <el-button
                    type="primary"
                    @click="sureSign()"
                    v-if="isFirstSignatory == '1' && !isTemp"
                    :disabled="disabled"
                    :loading="btnLoding"
                    >完成签署</el-button
                >

                <!--待我签署signInfo-->
                <el-button
                    type="primary"
                    @click="signInfo($event)"
                    v-if="editType == '01' && !isTemp"
                    :disabled="disabled"
                    :loading="btnLoding"
                    >完成签署</el-button
                >
                <el-button
                    type="primary"
                    @click="sureSign()"
                    v-if="isFirstSignatory == '0' && !isTemp"
                    :disabled="disabled"
                    :loading="btnLoding"
                    >发起签署</el-button
                >
                <!-- 模板签署 -->
                <el-button
                    type="primary"
                    @click="signTemp()"
                    v-if="isTemp"
                    :disabled="disabled"
                    :loading="btnLoding"
                >
                    {{ editType == "01" ? "完成签署" : "发起签署" }}</el-button
                >
                <!--判断是否需要本人签署-->
                <div
                    v-if="remake.length > 0"
                    style="
                        margin: 20px auto;
                        width: 178px;
                        border: 1px dotted #d6d6d6;
                        padding: 10px;
                        border-radius: 5px;
                    "
                >
                    <span style="font-weight: bold; color: #636363"
                        >备注：</span
                    >
                    <div
                        style="color: #929090; font-size: 12px; margin-top: 5px"
                    >
                        {{ remake }}
                    </div>
                </div>
            </div>
        </div>
        <contractsignconfirm
            v-if="confirm"
            v-on:confirm="childByValue"
        ></contractsignconfirm>
        <el-dialog
            class="ukey"
            title="UKEY签署校验"
            :visible.sync="UkeyCheck"
            label-width="80px"
            :before-close="ukeycancel"
            :close-on-click-modal="false"
            top="35%"
        >
            <el-form :label-position="labelPosition" label-width="100px">
                <el-form-item label="UKEY信息:">
                    <el-select v-model="ukeychoice" placeholder="请选择UKEY">
                        <el-option
                            :label="item.key_name"
                            :value="index"
                            v-for="(item, index) in ukeyList"
                            :key="item.key_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请输入PIN码:">
                    <el-input type="password" v-model="pin"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!--                <el-button :disabled="isCanClick" @click="ukeycancel">取 消</el-button>-->
                <el-button
                    type="primary"
                    @click="ukeyconfirm"
                    :loading="ukeySiging"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            class="ukey"
            title="UKEY读取校验"
            :visible.sync="UkeyReadCheck"
            label-width="80px"
            :before-close="ukeyReadcancel"
            :close-on-click-modal="false"
            top="35%"
        >
            <el-form :label-position="labelPosition" label-width="100px">
                <el-form-item label="UKEY信息:">
                    <el-select v-model="ukeychoice" placeholder="请选择UKEY">
                        <el-option
                            :label="item.key_name"
                            :value="index"
                            v-for="(item, index) in ukeyList"
                            :key="item.key_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请输入PIN码:">
                    <el-input type="password" v-model="pin"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!--                <el-button @click="ukeyReadcancel">取 消</el-button>-->
                <el-button type="primary" @click="ukeyReadConfirm"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            class="ukey checkPsw"
            title="签署校验"
            :visible.sync="signPswOpen"
            label-width="80px"
            :before-close="signPswCancel"
            :close-on-click-modal="false"
            top="25%"
        >
            <div class="dialog-tab">
                <span :class="{ avtive: dialogTab == 1 }" @click="changeTab(1)"
                    >短信验证</span
                >
                <span :class="{ avtive: dialogTab == 0 }" @click="changeTab(0)"
                    >密码验证</span
                >
            </div>
            <el-form :label-position="labelPosition" label-width="70px">
                <el-form-item
                    label="签署密码"
                    v-if="dialogTab == 0 && isSignPassword"
                >
                    <el-input
                        type="password"
                        v-model="signPsw"
                        placeholder="请输入签署密码（6位以上字母或数字）"
                    ></el-input>
                </el-form-item>
                <div
                    v-if="dialogTab == 0 && !isSignPassword"
                    style="text-align: center"
                >
                    <i class="el-icon-warning"></i>
                    <p>为保障您的签署安全，请先去设置签署密码</p>
                </div>
                <el-form-item label="手机号码" v-if="dialogTab == 1">
                    {{ phoneNum }}
                    <el-button style="float: right" class="sms" @click="getSMS">
                        {{
                            countdown == 0 ? "获取验证码" : countdown + "s"
                        }}</el-button
                    >
                </el-form-item>
                <el-form-item label="验证码" v-if="dialogTab == 1">
                    <el-input
                        placeholder="请输入6位验证码"
                        :max="6"
                        v-model="verifyCode"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="signPswCancel">取 消</el-button> -->
                <el-button
                    type="primary"
                    @click="setSignPsd"
                    v-if="dialogTab == 0 && !isSignPassword"
                    >设置签署密码
                </el-button>
                <el-button
                    type="primary"
                    @click="signPswConfirm"
                    :loading="loadingBtn"
                    v-else
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="dialogVisible"
            :before-close="dialogClose"
            class="dialog signdialog"
        >
            <div class="dialogTitle">
                <span class="el-dialog__title">{{ dialogTitle }}</span>
            </div>
            <div class="dialog-body">
                <div class="signPages">
                    <span
                        class="signPages-title"
                        :class="{ 'ridingPage-width': signatureMethod == '03' }"
                        >签署页码</span
                    >
                    <el-input
                        type="number"
                        v-model="signPage.signatureStartPage"
                        @keyup.native="regSignPage('start')"
                        min="1"
                    ></el-input>
                    <span class="space">至</span>
                    <el-input
                        type="number"
                        v-model="signPage.signatureEndPage"
                        @keyup.native="regSignPage('end')"
                        min="1"
                    ></el-input>
                </div>
                <div v-if="signatureMethod == '03'">
                    <div class="ridingPage">
                        <span class="signPages-title">一枚印章覆盖页数</span>
                        <el-input
                            v-model="signPage.ridingPage"
                            type="number"
                            min="1"
                            :max="pageTotal"
                        ></el-input>
                        <span
                            class="mark"
                            title="一枚印章覆盖页数，是指一枚印章被切割为多少份，每一份就是覆盖在每一页上的图案大小"
                            >?</span
                        >
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button @click="dialogClose">取 消</el-button>
                <el-button type="primary" @click="submit" :loading="ukeySiging"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            title="提示"
            :close-on-click-modal="false"
            :visible.sync="keySign"
            size="tiny"
            class="dialogTips safety"
        >
            <div>
                <i class="el-message-box__status el-icon-warning"></i>
                <span class="tips"
                    >当前合同已经进行了UKey签名/印章签署，暂不允许修改合同签署流程。</span
                >
            </div>
            <div>
                <el-button @click="keySign = false">取消</el-button>
                <el-button type="primary" @click="geolist()"
                    >返回列表</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="signNumDialog"
            :before-close="signNumDialogClose"
            title="签约份数不足"
            class="dialogTips safety icon-safe self-icon"
        >
            <div class="content">
                <i class="el-message-box__status icon-buy"></i>
                <p>
                    本次合同签署费用，全部由发起人来承担。发起人账户签署份数不足，请您提醒合同发起人购买套餐
                </p>
            </div>
            <div class="btn-box width-88">
                <el-button @click="remind">提醒对方</el-button>
                <el-button
                    :loading="btnLoding2"
                    :disabled="btnDisabled"
                    @click="deduction"
                    type="primary"
                    >自己付
                </el-button>
            </div>
        </el-dialog>
        <sign-password-set-dialog
            v-model="isShowSetSignPwd"
            :phoneNum="phoneNum"
            @confirm="confirmSetSignPwd"
            @cancel="cancelSetSignPwd"
        >
        </sign-password-set-dialog>
        <div
            class="guide-model"
            @click="guideTo"
            v-if="guideLead == 1 || guideLead == 2"
        ></div>
        <div class="wrapper-iframe">
            <el-dialog
                top="5vh"
                title="深圳市统一电子印章平台授权信息填写"
                :visible.sync="dialogGrantVisible"
                :close-on-click-modal="false"
            >
                <!-- TODO iframe -->
                <iframe
                    name="grantifm"
                    style="width: 100%; min-height: 670px"
                    id="grant-iframe"
                    frameborder="0"
                    scrolling="auto"
                    :src="shenzhenGrantWeb"
                >
                </iframe>
            </el-dialog>
        </div>

        <div class="wrapper-qrcode">
            <el-dialog
                :visible.sync="dialogQrCodeVisible"
                title="请使用i深圳APP--电子印章服务--扫码签章"
                :close-on-click-modal="false"
            >
                <div id="qrcode"></div>
                <p class="tips">请用“i深圳”APP--【电子印章服务】--【扫码签章】功能扫码二维码签署文件</p>
            </el-dialog>
        </div>

        <div class="wrapper-shenzhentip">
            <el-dialog
                :visible.sync="dialogShenzhenTipVisible"
                title="温馨提示"
                :close-on-click-modal="false"
            >
                <div class="shenzhentip">
                    您好暂时<span>不支持安印电子印章和深圳统一电子印章同时签署</span>，请先完成安印电子印章签署后，再来签署深圳电子印章。
                </div>

                <div slot="footer">
                    <el-button @click="dialogShenzhenTipVisible = false">
                        确 定
                    </el-button>
                </div>
            </el-dialog>
        </div>

        <div class="wrapper-shenzhenguide">
            <el-dialog
                :visible.sync="dialogShenzhenGuideVisible"
                title="深圳市统一电子印章领用引导"
                :close-on-click-modal="false"
                top="5vh"
            >
                <div class="wrapper-shenzhenguide--inner">
                    <el-radio-group
                        v-model="whichSealAndGrantWay"
                        @change="selectWhichSealAndGrantWay"
                    >
                        <el-radio :label="0">
                            <span style="font-weight: 700">
                                企业法人未领取深圳市电子印章
                            </span>
                            <div
                                class="shenzhenguide"
                                v-if="whichSealAndGrantWay === 0"
                            >
                                <div>
                                    请您先完成深圳电子印章的领取，然后再来进行签章操作。
                                </div>
                                <div>
                                    <div>操作说明：</div>
                                    <div>1、下载i深圳APP；</div>
                                    <div>
                                        2、进入部门服务---市市场监督管理局---电子印章服务。
                                    </div>
                                </div>
                            </div>
                        </el-radio>
                        <div style="margin: 10px 0"></div>
                        <el-radio :label="1">
                            <span style="font-weight: 700">
                                法人已领取深圳市电子印章且
                                <span style="color: #911">
                                    未进行授权他人
                                </span>
                            </span>
                        </el-radio>
                        <div style="margin: 10px 0"></div>

                        <el-radio :label="2">
                            <span style="font-weight: 700">
                                法人已领取深圳市电子印章且
                                <span style="color: #911"> 已授权给他人 </span>
                            </span>
                        </el-radio>
                        <div style="margin: 10px 0"></div>
                    </el-radio-group>

                    <div
                        class="form-of-type2"
                        v-if="whichSealAndGrantWay === 2"
                    >
                        <el-form
                            label-position="left"
                            :model="formGrantUserInfo"
                        >
                            <el-form-item label="授权人姓名：">
                                <el-input
                                    style="width: 40%; margin-left: 28px"
                                    size="mini"
                                    v-model="formGrantUserInfo.grantUserName"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="授权人身份证号：">
                                <el-input
                                    style="width: 40%"
                                    size="mini"
                                    v-model="formGrantUserInfo.grantIdCard"
                                ></el-input>
                            </el-form-item>
                        </el-form>

                        <div class="tips__form-type2">
                            注：建议企业授权人去注册安印自己个人账号完成实名后，更方便使用企业电子印章盖章。
                        </div>
                    </div>

                    <div slot="footer">
                        <div style="margin: 20px auto; text-align: center">
                            <el-button
                                style="width: 160px"
                                @click="okDialogShenzhenGuide"
                            >
                                重新获取授权人印章
                            </el-button>
                            <el-button
                                style="width: 160px"
                                type="primary"
                                @click="
                                    okDialogShenzhenGuide({
                                        flag: 'isToAuthByShenzhen',
                                    })
                                "
                            >
                                前往授权页面
                            </el-button>
                        </div>
                    </div>

                    <div class="tips__dialog-shenzhen-guide">
                        <div style="margin-bottom: 16px">温馨提示：</div>
                        1、使用深圳电子印章前，企业法人必须先在i深圳上完成印章领取；<br />
                        2、如果法人授权给多个人使用印章，对应的印章必须使用对应的授权人信息来进行签章操作；<br />
                        3、如果法人授权出的印章，法人是无法再次进行使用的，除非先进行解除授权；<br />
                        4、同一印章授权一次后，下次同样的印章无需再次进行授权操作，除非授权人发生变更需重新授权；<br />
                        5、每个企业总共有4枚电子印章，如果没有展示其他印章出来，请修改印章授权人信息重新获取印章；<br />
                        6、<span style="color: #911"
                            >如果企业法人授权给他人使用印章，建议授权人去注册安印自己个人账号完成实名后，更方便使用企业电子印章盖章；</span
                        >
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<!-- -webkit-input-placeholder-->
<script>
import base from "../mixin/base";
import ukey from "../../../assets/plugin/ukey.js";
import contractsignconfirm from "./contractsignconfirm.vue";
import signPasswordSetDialog from "@/components/signPasswordSetDialog.vue";
import html2canvas from "html2canvas";
import { sessionStore, isCard } from "@/utils";

export default {
    mixins: [base, ukey],
    components: { contractsignconfirm, signPasswordSetDialog },
    data() {
        return {
            // TODO data shenzhen ///
            // ----------------------------
            isShenzhenTab: false,
            dialogGrantVisible: false,
            shenzhenSealGrantInfo: {
                grantUserName: "",
                grantIdCard: "",
            },

            shenzhenGrantWeb: "",
            // `shenzhenGrantInfo` 所有深圳市电子印章的包含授权码的印章信息
            shenzhenGrantInfo: [],
            shenzhenSealList: [],
            curShenzhenSealCert: "",
            shenzhenFileList: [],
            shenzhenFileHash: "",
            shenzhenFileUniqueId: "",

            shenzhenQrCode: "",
            dialogQrCodeVisible: false,

            shenzhenSignTaskId: "",
            shenzhenSignResult: "",
            shenzhenTimer: "",
            shenzhenFileBase64: "",

            shenzhenSignatureCoordinateX: "",
            shenzhenSignatureCoordinateY: "",

            hasInvokeSureSign: false,

            // 深圳市电子印章与合同平台印章不能同时签署提示
            dialogShenzhenTipVisible: false,
            // 深圳市统一电子印章领用引导
            dialogShenzhenGuideVisible: false,
            whichSealAndGrantWay: 0,
            formGrantUserInfo: {
                grantUserName: "",
                grantIdCard: "",
            },
            // 区分 `重新获取授权人印章` 和 `前往授权页面` 按钮
            isToAuthByShenzhen: false,

            // ----------------------------
            isCanClick: false,
            ukeySealLists: "",
            keySign: false,
            ukeyList: [],
            ukeychoice: "",
            labelPosition: "right",
            UkeyCheck: false,
            UkeyReadCheck: false,
            pin: "",
            cover: true,
            disabled: false,
            signatureMethod: "01",
            autographType: "", //签名类型  true云签名 false云签章
            compactDocumentType: "",
            value: "",
            valueName: "",
            valueUserType: "",
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
                "#B8860B",
            ],
            fileList: [],
            compactFieldList: [],
            compactFieldListNew: [],
            confirm: false,
            type: "",
            compactDocumentList: [],
            compactFileCode: "",
            compactDocumentCode: "",
            compactDocumentId: "",
            signatoryId: "",
            compactSignatoryList: [],
            userId:
                $.cookie("userinfo") && JSON.parse($.cookie("userinfo")).userId,
            mySignList: [],
            signatureData: "",
            isFirstSignatory: "",
            compactId: "",
            id: "",
            sealSrc: "",
            nomore: true,
            warning: false,
            height: 90,
            scrollHeight: 0,
            editType: "",
            rate: 0,
            widthPx: 778,
            naturalWidth: 0,
            widthA4: 210,
            heightPx: 1100,
            right: false,
            rightNumber: 0,
            flag: false,
            dialogVisible: false,
            signPage: {},
            dialogTitle: "多页签署参数",
            isKeySignature: "",
            isSignatoryCloudSignature: 0,
            isCloudSignature: 0,
            isAuthentication: "", //整个合同是否需要实名认证 0要 1no
            index: "",
            ctx: "http://127.0.0.1:9825/",
            signNumDialog: false,
            signList: [],
            tempClone: "",
            isIe: false,
            btnLoding: false,
            btnDisabled: false,
            btnLoding2: false,
            userType:
                $.cookie("userinfo") &&
                JSON.parse($.cookie("userinfo")).userType,
            remake: "",
            loadingTabel: false,
            pageNumber: 1,
            pageTotal: 0,
            pageNum1: 1,
            pageSize1: 10,
            currentpage1: 1,
            total1: 0,
            pageNum2: 1,
            pageSize2: 10,
            currentpage2: 1,
            total2: 0,
            ukeySignList: [],
            ukeySealList: [],
            cloudBoxScrollbarHeight: "calc(100% - 370px)",
            ukeySiging: false,
            ukeyReading: false,
            esealcode: "",
            isSignPassword:
                $.cookie("userinfo") &&
                JSON.parse($.cookie("userinfo")).isSignPassword,
            signPswOpen: false,
            signPsw: "",
            signParams: {},
            signCloudParams: {},
            signUKeyParams: {},
            paymentMethod: "",
            isMainAccount:
                $.cookie("userinfo") &&
                JSON.parse($.cookie("userinfo")).isMainAccount,
            navHeight:
                "height: calc(100% - 291px);min-height: 470px;position:relative;",
            dialogTab: 1,
            phoneNum: "",
            verifyCode: "",
            countdown: 0,
            timer: null,
            loadingBtn: false,
            token: sessionStorage.getItem("token"),
            loadingBtn: false,
            isTemp: false, // 是否是模板
            signUser: "",
            guideLead: 0,
            nowTime: +new Date(), // 时间戳
            updateTimer: null, //监听页面时间监听器id,
            isShowSetSignPwd: false, //是否显示设置签署密码弹窗
            allNoSignsCurrentDoc: [], //当前合同所有未签署标签
            allNoSigns: [], //整个所有合同所有未签署标签
            currentPagePoiSigns: [], //当前页的标签
            currentPagePoiHadSigns: [], //当前页的已签名的标签
            currentPagePoiNoSigns: [], //当前页的未签名的标签
            hasPoiSigns: false, //当前是否有标签
            sealsvrurl: "", //三所ukey签章服务器地址
            signTimeSrc: "", //生成的时间戳base64图片
            nowDate: "", //服务器当前时间
            isShowSignTime: true,
            isCurrentSign: true,
            signMarkArr: [],

            // For UKEY
            pictureCode: "",
            signCertificateSn: "",
        };
    },
    filters: {
        fileName: function (name) {
            if (name) {
                return name.substring(0, name.lastIndexOf("."));
            }
        },
    },
    watch: {
        compactFieldList() {
            this.compactFieldListChange("sure");
        },
        autographType(val) {
            if (!!val) {
                //签名
                this.getCouldSignData();
                if (this.userType == "01") {
                    this.cloudBoxScrollbarHeight = "calc(100% - 220px)";
                } else {
                    this.cloudBoxScrollbarHeight = "calc(100% - 370px)";
                }
            } else {
                //印章
                this.getListData();
                this.cloudBoxScrollbarHeight = "calc(100% - 370px)";
            }
        },
        isAuthentication(val) {
            this.realNameAuthenticationFn();
        },
        pageNumber() {
            // 切换页面 || 切换合同都要计算状态合集
            this.calcAllStatusSign();
        },
    },
    computed: {
        isHadSignPos() {
            if (!this.isCurrentSign) {
                return false;
            }
            let arr = this.compactFieldList.filter(
                (ele) => !ele.sealId && !ele.hasPoxSign
            );
            if (arr.length && this.compactDocumentList.length == 1) {
                arr.sort((a, b) => a.signatureStartPage - b.signatureStartPage);
                this.signMarkArr = arr.slice(0, 2);
            } else if (arr.length && this.compactDocumentList.length > 1) {
                let packArr = [];
                this.compactDocumentList.forEach((ele, index) => {
                    let newArr = [];
                    arr.forEach((v) => {
                        if (ele.compactDocumentId == v.compactFileCode) {
                            v.compactServings = index + 1;
                            newArr.push(v);
                        }
                    });
                    newArr.sort(
                        (a, b) => a.signatureStartPage - b.signatureStartPage
                    );
                    packArr.push(...newArr);
                });
                console.log(packArr);
                this.signMarkArr = packArr.slice(0, 2);
            }
            return !!arr.length && (this.editType == "01" || this.isTemp);
        },
    },
    async mounted() {
        let self = this;
        let index = 0;
        if (this.userType == "01") {
            this.autographType = false;
        } else {
            this.autographType = true;
        }
        this.isTemp = !!this.$route.query.isTemp;
        // 缩放比例
        this.rate = this.widthPx / this.widthA4;
        this.type = this.$route.query.type;
        this.compactId = this.$route.query.compactId;
        this.editType = this.$route.query.editType;
        if (this.editType == "01") {
            this.navHeight =
                "height: calc(100% - 147px);min-height: 470px;position:relative;";
        } else if (this.isTemp) {
            this.navHeight =
                "height: calc(100% - 104px);min-height: 470px;position:relative;";
        }
        // 模板签署信息
        await this.getTemplateInfo();
        await this.detailData();
        // this.getCouldSignData();
        // this.getListData();
        this.getUserInfo();
        this.getContractBasicInfo();

        function isIE() {
            //ie?
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                self.isIe = true;
            } else {
                self.isIe = false;
            }
        }

        isIE();

        let d1 = document.getElementById("draggable");
        let d2 = document.getElementById("draggable2");
        this.cloneMove(d1);
        this.cloneMove(d2);

        $("#scroll .el-scrollbar__wrap").scroll(function () {
            if (index == 0) {
                self.scrollHeight = 1100 + 26 * 2 + 110 - $("#scroll").height();
                // console.log(self.scrollHeight);
                // console.log($(this).scrollTop());
                if ($(this).scrollTop() >= self.scrollHeight) {
                    index++;
                    setTimeout(function () {
                        self.loadMore();
                        index = 0;
                    }, 500);
                }
            }
            if ($(this).scrollTop() == 0) {
                index = 0;
                setTimeout(function () {
                    console.log("zx");
                    self.loadprev();
                }, 200);
            }
        });

        if (document.addEventListener) {
            document.addEventListener("DOMMouseScroll", this.scrollFn, false);
        } //W3C
        window.onmousewheel = document.onmouseenter = this.scrollFn; //IE/OPERA/CHROME/SAFARI

        if ($.cookie("signGuide") && $.cookie("signGuide") == "true") {
            this.guideLead = 1;
            $.cookie("signGuide", false);
        }

        // TODO shenzhen mounted...
        // if (this.isShenzhenTab) {
        //     let hasUserInfo = await this.getSealGrantUserInfo();
        //     if (hasUserInfo) {
        //         await this.getGrantCode();
        //         await this.getSealByGrantCode();
        //     }
        // }
    },
    beforeRouteLeave(to, from, next) {
        if (this.isTemp && to.path === "/fillTemplate") {
            next(false);
            return this.$message.warning("已填充控件信息的合同无法再次编辑");
        }
        if (document.addEventListener) {
            document.removeEventListener(
                "DOMMouseScroll",
                this.scrollFn,
                false
            );
        }
        window.onmousewheel = document.onmouseenter = null;
        clearInterval(this.timer);
        next();
    },
    created() {
        if (
            window.devicePixelRatio &&
            window.devicePixelRatio != 1 &&
            !this.$parent.isMac
        ) {
            this.$message.warning(
                "为保证文件翻页体验，需调整浏览器缩放比例至100%"
            );
        }
        //三所ukey签章服务器地址分生产及测试
        if (window.location.hostname.indexOf("i-yin.com.cn") != -1) {
            this.sealsvrurl = "esealpin.i-yin.com.cn";
        } else {
            this.sealsvrurl = "yzyzma.oa.com";
        }
    },
    methods: {
        // TODO methods shenzhen ///
        // ---------------------------------
        async handleSealTabClick(tab) {
            console.log(tab);
            this.isShenzhenTab = tab === "shenzhen" ? true : false;

            if (this.isShenzhenTab) {
                let hasUserInfo = await this.getSealGrantUserInfo();
                if (hasUserInfo) {
                    await this.getGrantCode();
                    await this.getSealByGrantCode();
                }
            }
            // 切换 Tab 时请求印章，以实现 DOM 事件绑定...
            this.getListData();
        },
        async getSealGrantUserInfo() {
            let res = await this.apiGetSealGrantUserInfo();
            if (!this.successCheckCode(res)) {
                return;
            }

            console.log(res);
            if (!res.data) {
                this.dialogShenzhenGuideVisible = true;
                return false;
            }

            // if (!res.data.grantIdCard) {
            //     this.$message.error("授权用户身份不存在");
            //     return false;
            // }

            this.shenzhenSealGrantInfo = res.data;
            return true;
        },

        selectWhichSealAndGrantWay(val) {
            console.log(typeof val);
            this.whichSealAndGrantWay = val;
        },
        okDialogShenzhenGuide(options) {
            if (options && options.flag === "isToAuthByShenzhen") {
                // ^ `前往授权页面`
                this.isToAuthByShenzhen = true;
            } else {
                // ^ `新获取授权人印章`
                this.isToAuthByShenzhen = false;
            }

            // ^0
            if (this.whichSealAndGrantWay === 0) {
                // this.resetDialogShenzhenGuide();
                this.insertSealGrantUserInfo(
                    this.shenzhenSealGrantInfo.grantUserName,
                    this.shenzhenSealGrantInfo.grantIdCard
                );
            }
            // ^1 未授权
            if (this.whichSealAndGrantWay === 1) {
                this.insertSealGrantUserInfo();
            }
            // ^2 已授权
            if (this.whichSealAndGrantWay === 2) {
                if (!isCard(this.formGrantUserInfo.grantIdCard)) {
                    this.$message.warning("身份证号码有误，请检查");
                    return;
                }

                this.insertSealGrantUserInfo(
                    this.formGrantUserInfo.grantUserName,
                    this.formGrantUserInfo.grantIdCard
                );
            }
        },
        async insertSealGrantUserInfo(grantUserName, grantIdCard) {
            let _data = {
                grantUserName,
                grantIdCard,
                type: this.whichSealAndGrantWay,
            };

            let res = await this.apiInsertSealGrantUserInfo(_data);
            if (!this.successCheckCode(res)) {
                return;
            }

            console.log(res);
            // `res.data - 1 跳授权弹窗 2 关掉当前提示窗口`
            if (this.whichSealAndGrantWay === 1) {
                // PS* 切换`未授权`和`已授权`时，恢复授权人信息
                await this.getSealGrantUserInfo();
            }

            if (this.whichSealAndGrantWay === 2) {
                // ^ 企业法人已授权他人
                this.shenzhenSealGrantInfo.grantUserName = grantUserName;
                this.shenzhenSealGrantInfo.grantIdCard = grantIdCard;
            }

            await this.getGrantCode();
            await this.getSealByGrantCode();
            await this.getListData();

            this.resetDialogShenzhenGuide();

            // 如果点击`前去授权页面`
            if (this.isToAuthByShenzhen) {
                this.toAuthByShenzhen();
            }

            // 1 跳授权弹窗
            // if (res.data === 1) {
            //     this.toAuthByShenzhen();

            //     return;
            // }
            // // 2 关掉当前提示窗口
            // if (res.data === 2) {
            //     this.dialogShenzhenGuideVisible = false;
            // }
        },
        resetDialogShenzhenGuide() {
            this.dialogShenzhenGuideVisible = false;
            this.whichSealAndGrantWay = 0;
            this.formGrantUserInfo = {
                grantUserName: "",
                grantIdCard: "",
            };
        },
        async toAuthByShenzhen(options) {
            console.log("Auth by shenzhen...");

            if (
                this.userType === "01" &&
                options &&
                options.flag === "isFromClick"
            ) {
                // ^ `this.userType === "01"` 只有企业时才弹窗，个人略过，直接授权弹窗
                // ^ 点击`去授权`触发
                this.dialogShenzhenGuideVisible = true;
                return;
            }

            let res = await this.apiGetGrantWeb({
                idCardNo: this.shenzhenSealGrantInfo.grantIdCard,
                personName: this.shenzhenSealGrantInfo.grantUserName,
            });
            if (!this.successCheckCode(res)) {
                return;
            }
            console.log(res.data);
            // 授权弹窗
            this.shenzhenGrantWeb = res.data;
            this.dialogGrantVisible = true;
        },
        // 深圳市电子印章一章一授权码，故返回一个列表
        async getGrantCode() {
            let res = await this.apiGetGrantCode({
                idCardNo: this.shenzhenSealGrantInfo.grantIdCard,
            });
            console.log(res.data);
            if (!res.data) {
                this.$message({
                    type: "warning",
                    message: res.msg,
                    duration: 1800,
                });

                setTimeout(() => {
                    // 如果当前用户没有授权过，则弹窗提示
                    this.dialogShenzhenGuideVisible = true;
                }, 2000);
                return;
            }

            if (!this.successCheckCode(res)) {
                return;
            }
            this.shenzhenGrantInfo = res.data.grantInfo;
            // return res.data.grantInfo[0].grantCode;
            return res.data.grantInfo;
        },
        async getSealByGrantCode() {
            // 置空，移除旧有印章
            this.shenzhenSealList = [];

            // 遍历 `shenzhenGrantInfo` 获取印章信息
            for (let i = 0, len = this.shenzhenGrantInfo.length; i < len; i++) {
                let _grantCode = this.shenzhenGrantInfo[i].grantCode;

                let _data = {
                    grantCode: _grantCode,
                };

                let res = await this.apiGetSealByGrantCode(_data);
                if (!this.successCheckCode(res)) {
                    return;
                }

                // 如果印章已经存在于印章列表中，则不重新添加
                let _isInSealList = false;
                this.shenzhenSealList.map((_sealItem) => {
                    if (_sealItem.sealCode === res.data.sealCode) {
                        _isInSealList = true;
                    }
                });

                if (!_isInSealList) {
                    let _seal = Object.assign(res.data, {
                        sealGrantCode: _grantCode,
                    });

                    this.shenzhenSealList.push(_seal);
                }
            }

            console.log(this.shenzhenSealList);

            // 初始化印章事件绑定
            this.$nextTick(() => {
                let _domSealList = $("#seal li");

                _domSealList.map((idx, seal) => {
                    if (idx < _domSealList.length) {
                        this.cloneMove(seal);
                    }
                });
            });
        },

        // 签署前的准备：
        // * signatureType 为 '07' 时表示是深圳市电子印章
        // 根据`/file/str/{compactFileCode}` 获取文件 base64
        // 1. 根据授权码获取文档 HASH
        // 2. Hash值推送 - 生成二维码
        // 3. 轮询 "获取签名值"，监听用户操作
        // 4. 操作成功后进行 "Pdf文件合章"
        // 5. `/key/compact/file/info` 保存到合同平台
        // 6. 调用原有接口进行签署
        async getPdfHash() {
            let _file = await this.getShenzhenFileInfo();

            let _seal = this.checkIsShenzhenSealInCompactFieldList(
                this.compactFieldList
            );
            console.log(_seal);

            // let _grantCode = await this.getGrantCode();
            // TODO shenzhen 印章坐标转换
            let _data = {
                cert: _seal.sealCert,
                file: _file,
                grantCode: _seal.sealGrantCode,
                seal: {
                    ruleInfo: {
                        acrossRule: null,
                        keywordRule: null,
                        rectangleRule: {
                            top: this.shenzhenSignatureCoordinateY * 297 - 40,
                            left: this.shenzhenSignatureCoordinateX * 210,
                            bottom:
                                this.shenzhenSignatureCoordinateY * 297 +
                                40 -
                                40,
                            right: this.shenzhenSignatureCoordinateX * 210 + 40,
                            page: this.pageNumber,
                        },
                        ruleType: "RECTANGLE",
                        version: "1.0",
                    },
                    sealInfo: {
                        algo: "SM3withSM2",
                    },
                },
            };

            let res = await this.apiGetPdfHash(_data);

            if (!this.successCheckCode) {
                return;
            }

            console.log(res);
            this.shenzhenFileHash = res.data.fileHash;
            this.shenzhenFileUniqueId = res.data.fileUniqueId;
        },
        async signTask() {
            // let _seal = this.shenzhenSealList[0];
            let _seal = this.checkIsShenzhenSealInCompactFieldList(
                this.compactFieldList
            );

            let _data = {
                content: {
                    algo: "SM3withSM2",
                    data: this.shenzhenFileHash,
                    dataType: "HASH",
                    expiryDate: "",
                    sealNo: _seal.sealId,
                },
                reqId: "string",
            };

            let res = await this.apiSignTask(_data);

            if (!this.successCheckCode(res)) {
                return;
            }

            console.log(res);
            this.shenzhenQrCode = res.data.qrCode;
            this.shenzhenSignTaskId = res.data.signTaskId;

            // 弹出二维码...
            // ...
            this.dialogQrCodeVisible = true;
            this.$nextTick(() => {
                this.makeCode(this.shenzhenQrCode);
            });
        },
        makeCode(content) {
            document.getElementById("qrcode").innerHTML = "";
            let qrcode = new QRCode(document.getElementById("qrcode"), {
                width: 200,
                height: 200,
            });
            qrcode.makeCode(content);
        },

        // apiPushSignResult
        async pushSignResult() {
            clearTimeout(this.shenzhenTimer);

            let _data = {
                content: {
                    signTaskId: this.shenzhenSignTaskId,
                },
                reqId: "reqId_" + new Date().getTime(),
            };

            let res = await this.apiPushSignResult(_data);

            if (!this.successCheckCode(res)) {
                return;
            }

            console.log(res);

            // ^ 调用 `pushSignResult` 进行轮询，监听用户扫码
            // `signTaskStatus` 为 "1" 表示用户已扫码，通过； 为 "0" 表示用户未扫码，递归调用当前函数
            if (res.data.signTaskStatus === "1") {
                this.dialogQrCodeVisible = false;
                this.hasInvokeSureSign = true;

                this.shenzhenSignResult = res.data.p7SignResult;

                await this.detachedPdf();
                // TODO 对接原有保存、签署
                await this.saveUkey(this.shenzhenFileBase64, {
                    compactFileCode: this.shenzhenFileList[0].fileCode,
                    signName: "string-signName",
                    compactId: this.compactId,
                    id: "",
                });

                // 开始签署了
                // ...
                this.sureSign();

                return true;
            }

            if (res.data.signTaskStatus === "0") {
                this.shenzhenTimer = setTimeout(() => {
                    this.pushSignResult();
                }, 5000);
            }
        },
        async detachedPdf() {
            let _seal = this.checkIsShenzhenSealInCompactFieldList(
                this.compactFieldList
            );

            let _data = {
                cert: _seal.sealCert,
                fileUniqueId: this.shenzhenFileUniqueId,
                signValue: this.shenzhenSignResult,
            };

            let res = await this.apiDetachedPdf(_data);

            if (!this.successCheckCode) {
                return;
            }
            console.log(res);

            this.shenzhenFileBase64 = res.data.file.fileB64;
        },
        // 返回当前合同文件的 base64
        async getShenzhenFileInfo() {
            let _curFile = this.shenzhenFileList[0];

            let _data = {
                compactFileCode: _curFile.fileCode,
            };

            let res = await this.apiGetFileBase64(_data);

            if (!this.successCheckCode(res)) {
                return;
            }

            return {
                fileB64: res.data.fileBase64Str,
                fileDesc: "string-fileDesc",
                fileType: "PDF",
                title: _curFile.fileName,
            };
        },

        base64ToUrl(base64) {
            return "data:image/jpeg;base64," + base64;
        },

        /**
         * 检查是否有深圳市电子印章存在于列表中
         * @param {Object[]} compactFieldList - 当前文件中已存在的印章列表
         * @returns {Boolean} false - 不存在
         * @returns {Object} shenzhenSeal - 存在，则返回该枚印章
         */
        checkIsShenzhenSealInCompactFieldList(compactFieldList) {
            let _list =
                compactFieldList.filter(
                    (sealItem) => sealItem.sealType === "07"
                ) || [];

            if (_list.length === 0) {
                return false;
            } else {
                return _list[0];
            }
        },

        // ---------------------------------
        // 模板签署信息
        async getTemplateInfo() {
            // 获取模板合同信息
            let res = await this.compactTempDetail(this.compactId);
            console.log(res);
            if (!this.successCheckCode(res)) {
                return;
            }
            let res1 = await this.detail(this.compactId);
            console.log(res1);
            if (!this.successCheckCode(res1)) {
                return;
            }
            this.compactSignatoryList = res1.data.compactSignatoryList;
            let signUser = res1.data.compactSignatoryList.find(
                (v) => v.identityNum === this.userinfo.enterpriseId
            );
            this.signUser = signUser ? signUser.signUser : "";
            // 有控件信息，是模板
            if (this.isTemp) {
                // 过滤角色印章和签名
                let compactField = res.data.signSysTemplateFieldReqVOList.filter(
                    (v) =>
                        (v.signType === "1" || v.signType === "2") &&
                        v.signUser === this.signUser
                );
                // let compactField = res.data.signSysTemplateFieldReqVOList.filter((v) => v.signType === '1' || v.signType === '2');
                console.log(compactField);
                this.compactFieldList = compactField.map((v) => {
                    let obj = {};
                    // A4纸标准尺寸  595 * 842
                    let x, y;
                    if (v.signType === "1") {
                        // 印章 110 * 110
                        x = (v.signatureCoordinateX - 28) / 595;
                        y = (842 - v.signatureCoordinateY) / 842;
                    }
                    if (v.signType === "2") {
                        // 签名 180 * 80
                        x = v.signatureCoordinateX / 595;
                        y = (842 - v.signatureCoordinateY) / 842;
                    }
                    obj.compactId = v.compactId;
                    // obj.conpactFileCode = v.fileCode;
                    obj.fileCode = v.fileCode;
                    obj.id = v.compactTemplateFieldId;
                    obj.sealType = v.signType === "1" ? "01" : "02";
                    obj.signName = this.userinfo.enterPriseName;
                    obj.signatoryId = this.userinfo.userId;
                    obj.signatureCoordinateX = x;
                    obj.signatureCoordinateY = y;
                    obj.signatureDirection = "1";
                    obj.signatureStartPage = v.signatureStartPage;
                    obj.signatureEndPage = v.signatureStartPage;
                    obj.signatureMethod = "01";
                    return obj;
                });
                await this.getIsShowSignTime();
                // this.compactFieldList = compac
            }
        },
        geolist() {
            this.$router.push("/contractlist");
        },
        getContractBasicInfo() {
            this.editCompact(this.compactId).then((res) => {
                if (this.successCheckCode(res)) {
                    this.remake = res.data.remake ? res.data.remake : "";

                    // 深圳市印章分支添加
                    // 为了获取对应 file 的 base64
                    // ------------------
                    this.shenzhenFileList = res.data.compactFileIdList;
                    console.log(this.shenzhenFileList);
                    // ------------------------
                }
            });
        },
        ukeycancel() {
            var list = this.compactFieldList;
            this.ukeySiging = false;
            // this.compactFieldList.splice(list.length - 1, 1);
            this.UkeyCheck = false;
            this.loadingTabel = false;
            // $(this.tempClone).remove();
        },
        ukeyReadcancel() {
            this.UkeyReadCheck = false;
        },
        signPswCancel() {
            this.signPswOpen = false;
            this.signPsw = "";
            this.signParams = {};
            clearInterval(this.timer);
            this.countdown = 0;
            this.dialogTab = 1;
            this.verifyCode = "";
            this.loadingBtn = false;
        },
        //确认设置签署密码
        confirmSetSignPwd() {
            this.isSignPassword = true;
            this.signPswOpen = true;
        },
        cancelSetSignPwd() {
            console.log("zx");
            this.signPswOpen = true;
        },
        // 签署密码弹窗
        signPswConfirm() {
            let signList =
                this.signParams.compactFieldInfoList ||
                this.signParams.compactFieldSignatureInfoList;
            let ukeySignList = signList.filter((item) => {
                return item.signatureType == "01" || item.signatureType == "04";
            });
            let cloudSignList = signList.filter((item) => {
                return item.signatureType != "01" && item.signatureType != "04";
            });
            let reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
            if (this.dialogTab == 0 && !this.signPsw.length) {
                this.$message.error("签署密码不能为空");
            } else if (this.dialogTab == 1 && !this.verifyCode) {
                this.$message.error("验证码不能为空");
            } else {
                if (this.dialogTab == 0) {
                    this.signParams.signPassword = this.signPsw;
                } else {
                    this.signParams.signSms = this.verifyCode;
                    this.signParams.phone = this.phoneNum;
                }
                if (this.editType == "01") {
                    this.signFromParams(this.signParams);
                } else {
                    this.signFromParams(this.signParams, "first");
                }
                // this.signPswCancel();
            }
        },

        //校验UKey PIN码
        ukeyconfirm() {
            //未做校验PIN码处理
            // this.UkeyCheck = false;
            var that = this,
                index;
            if (that.ukeychoice === "") {
                this.$message.error("请选择UKEY");
                return;
            }
            if (that.pin.length == 0) {
                this.$message.error("请输入PIN码");
                return;
            }
            if (that.pin.length < 4) {
                this.$message.error("请输入4位以上的PIN码");
                return;
            }

            that.ukeySignOperator(this.signUKeyParams);
        },
        ukeyReadConfirm() {
            var that = this,
                index;
            if (that.ukeychoice === "") {
                this.$message.error("请选择UKEY");
                return;
            }
            if (that.pin.length == 0) {
                this.$message.error("请输入PIN码");
                return;
            }
            if (that.pin.length < 4) {
                this.$message.error("请输入4位以上的PIN码");
                return;
            }

            this.loginKey({
                keyid: this.ukeychoice,
                pin: this.pin,
            }).then((res) => {
                if (this.successUKeyCheckCode(res)) {
                    this.UkeyReadCheck = false;
                    // 设置ukey
                    this.getCertInfoObjFn(0).then((res) => {
                        res = JSON.parse(res || {});
                        if (this.successUKeyCheckCode(res)) {
                            let pictureCode = "";
                            let signatureFilePath = "";
                            let signatureWidth = "";
                            let signatureHeight = "";
                            res.info.map((item) => {
                                if (item.item_type == 3) {
                                    pictureCode = item.item_info;
                                    this.esealcode = item.item_info;
                                }
                                if (item.item_type == 20) {
                                    signatureFilePath =
                                        "data:image/jpg;base64," +
                                        item.item_info;
                                }
                                if (item.item_type == 21) {
                                    signatureWidth = item.item_info;
                                }
                                if (item.item_type == 22) {
                                    signatureHeight = item.item_info;
                                }
                            });
                            this.getSignSealFromUKey(
                                pictureCode,
                                signatureFilePath,
                                signatureWidth,
                                signatureHeight
                            );
                        }
                    });
                }
            });
        },
        // ukey签署
        ukeySignOperator(params) {
            this.ukeySiging = true;
            var that = this,
                index;
            if (that.index == 0) {
                index = 0;
            } else {
                if (that.index) {
                    index = that.index
                        ? that.index
                        : that.compactFieldList.length - 1;
                }
            }
            this.isCanClick = true;

            this.loginKeyOfSign({
                keyid: this.ukeychoice,
                pin: this.pin,
            }).then((res) => {
                if (this.successUKeyCheckCode(res)) {
                    //pin密码校验成功，开始签署Loding
                    this.ukeySiging = false;
                    // this.ukeycancel();
                    this.UkeyCheck = false;
                    this.loadingTabel = false;
                    this.btnLoding = true;

                    // var esealcode = res.result.sealCode;
                    // var code = this.compactFieldList[this.compactFieldList.length - 1].sealId;
                    // 印章id   暂取第一个   因为ukey只拖动同一个签章  id都一样
                    setTimeout(() => {
                        var code = params.compactFieldInfoList[0].sealId;
                        if (this.esealcode == code) {
                            let compactFieldList = [];
                            let newParams = {};
                            // 遍历ukey签名数组 将所有compactFileId取出
                            params.compactFieldInfoList.map((item) => {
                                if (
                                    !compactFieldList.includes(
                                        item.compactFileId
                                    )
                                ) {
                                    compactFieldList.push(item.compactFileId);
                                }
                            });

                            compactFieldList.map((item, index) => {
                                newParams["compact" + index] = [];
                                params.compactFieldInfoList.map((signObj) => {
                                    if (signObj.compactFileId == item) {
                                        newParams["compact" + index].push(
                                            signObj
                                        );
                                    }
                                });
                            });
                            console.log(newParams);
                            for (let key in newParams) {
                                // 获取合同base64文件
                                let result = false;
                                this.getCompactBase64(
                                    newParams[key][0].compactFileId
                                ).then((res) => {
                                    if (this.successCheckCode(res)) {
                                        var base64 = res.data.fileBase64Str;
                                        // var obj = that.compactFieldList[index];
                                        var obj = newParams[key][0];

                                        let signinfo = [];

                                        newParams[key].map((item) => {
                                            let signinfoObj = {
                                                posx: item.signatureCoordinateX,
                                                posy:
                                                    1 -
                                                    item.signatureCoordinateY,
                                            };
                                            if (item.signatureMethod == "01") {
                                                signinfoObj.signtype = 0;
                                                signinfoObj.page = Number(
                                                    item.signatureStartPage
                                                );
                                            } else if (
                                                item.signatureMethod == "02"
                                            ) {
                                                signinfoObj.signtype = 1;
                                                signinfoObj.pageStart = Number(
                                                    item.signatureStartPage
                                                );
                                                signinfoObj.pageEnd = Number(
                                                    item.signatureEndPage
                                                );
                                            } else {
                                                signinfoObj.signtype = 2;
                                                signinfoObj.pagetype = 1;
                                                signinfoObj.posxy =
                                                    1 -
                                                    item.signatureCoordinateY;
                                                signinfoObj.pageStart = Number(
                                                    item.signatureStartPage
                                                );
                                                signinfoObj.pageEnd = Number(
                                                    item.signatureEndPage
                                                );
                                                //骑缝章每枚章所占页数
                                                signinfoObj.seamPart = Number(
                                                    item.coverPageNum
                                                );
                                                // signinfoObj.seamPart = 5;
                                            }
                                            signinfo.push(signinfoObj);
                                        });
                                        // obj.compactFileId = that.compactFieldList[index].compactFileId;
                                        obj.compactFileId =
                                            newParams[key][0].compactFileId;
                                        var url = "";
                                        var positionY =
                                            1 - obj.signatureCoordinateY;
                                        let data = {
                                            keyid: this.ukeychoice,
                                            pdfFile: base64,
                                            signinfo: JSON.stringify(signinfo),
                                            sealsvrurl: this.sealsvrurl,
                                        };
                                        console.log(base64);
                                        this.uKeySignOfSignBylist(data).then(
                                            (res) => {
                                                res = JSON.parse(res);
                                                if (
                                                    this.successUKeyCheckCode(
                                                        res
                                                    )
                                                ) {
                                                    this.saveUkey(
                                                        res.signedFile,
                                                        obj
                                                    );
                                                    result = true;
                                                } else {
                                                    result = false;
                                                    this.btnLoding = false;
                                                    this.isCanClick = false;
                                                }
                                            }
                                        );
                                        if (!result) {
                                            this.btnLoding = false;
                                            return;
                                        }
                                    } else {
                                        result = false;
                                        this.btnLoding = false;
                                        return;
                                    }
                                });
                                //遍历到最后一层
                                if (
                                    compactFieldList.length - 1 ==
                                    key.substring(7, key.length)
                                ) {
                                    if (result) {
                                        this.flag = true;
                                        if (this.isFirstSignatory) {
                                            this.signFromParams(
                                                this.signParams,
                                                "first"
                                            );
                                        } else {
                                            this.signFromParams(
                                                this.signParams
                                            );
                                        }
                                    } else {
                                        this.btnLoding = false;
                                    }
                                }
                            }
                        } else {
                            this.$message.error("请选择正确的UKEY印章");
                            this.isCanClick = false;
                        }
                    }, 500);
                } else {
                    this.ukeySiging = false;
                    this.isCanClick = false;
                }
            });
        },
        // 同步更新后台 保存ukey签署
        saveUkey(base64, obj) {
            var that = this,
                originalFileCode;
            that.compactDocumentList.map((res) => {
                if (res.compactDocumentId == obj.compactFileCode) {
                    originalFileCode = res.compactDocumentCode;
                    return;
                }
            });

            console.log("=========");
            console.log(JSON.stringify(that.compactDocumentList));
            console.log(JSON.stringify(obj));
            var data = {
                //                    accountId:JSON.parse($.cookie("userinfo")).accountId,
                //                    accountNumber: '',
                //                    orgId: obj.compactFileCode,
                sealName: obj.signName,
                signatureMethod: this.signatureMethod,
                compactDocumentName:
                    that.compactDocumentList[0].compactDocumentName,
                compactDocumentPage: this.pageTotal,
                compactDocumentType: "01",
                compactId: obj.compactId,
                keySignatureFile: base64,
                originalFileCode:
                    originalFileCode || this.shenzhenFileList[0].fileCode, //` this.shenzhenFileList[0].fileCode` 为深圳市电子印章所需
                userId: JSON.parse($.cookie("userinfo")).userId,
                compactFieldId: obj.id,
                // 下为两个待确定字段，从 Ukey 中读取
                pictureCode:
                    this.pictureCode || sessionStore.get("curPictureCode"),
                signCertificateSn: this.signCertificateSn,

                // shenzhen 加参 ///
                // -------------------------
                sealType: "07",
                certBase64: this.curShenzhenSealCert,
                // -------------------------
            };

            console.log("data >>> ", data);

            this.saveFileBase64(data)
                .then((res) => {
                    if (that.successCheckCode(res)) {
                    } else {
                        this.isCanClick = false;
                    }
                })
                .fail((res) => {
                    this.isCanClick = false;
                });
        },
        successLoadImg(event) {
            if (event.target.complete == true) {
                this.naturalWidth = event.target.naturalWidth;
                // this.rate = this.widthPx / this.naturalWidth;
            }
        },
        cloneMove(cloneMoves) {
            // console.log(cloneMoves);
            if (!cloneMoves) {
                return;
            }

            let self = this;
            var disX = 0;
            var disY = 0;

            cloneMoves.onmousedown = function (event) {
                //附件文档不允许签署
                var enclosure = $(cloneMoves).hasClass("compactDocumentType");
                if (enclosure) {
                    self.$message({
                        message: "附件文档不允许签署",
                        type: "warning",
                        duration: 3000,
                    });
                    return;
                }
                console.log(self.shenzhenSealList);
                console.log($(cloneMoves).attr("data-id"));
                var name = $(cloneMoves).find(".sign-title").text().trim(); //签名跟签章名称   // 注使用 trim() 方法去空白符

                var type = $(cloneMoves).attr("data-type"); // 签名或者签章的类型
                // TODO sealGrantCode 深圳市电子印章的授权码 加入 cloneMove
                var sealGrantCode = $(cloneMoves).attr("data-grant-code"); // 深圳市电子印章的授权码

                var sealCert = $(cloneMoves).attr("data-cert"); // 深圳市电子印章证书
                self.curShenzhenSealCert = sealCert;

                var sealid = $(cloneMoves).attr("data-sealid"); // 签名跟签章的id
                var signatureType = $(cloneMoves).attr("data-signatureType");
                var signatoryId = $(cloneMoves).attr("data-id"); //签署人
                var width = $(cloneMoves).attr("data-width") * self.rate; // 宽  * self.rate
                var height = $(cloneMoves).attr("data-height") * self.rate; // 高   * self.rate
                if (self.isFirstSignatory == 1 && sealid) {
                    signatoryId =
                        self.compactSignatoryList[0].compactSignatoryId;
                }
                // var draggable = false;
                // self.compactFieldList.map(function (data) {
                //     if (data.signatoryId == signatoryId && data.sealId == sealid && data.sealType == type && type == "02" && data.compactFileCode == self.compactFileCode) {
                //         self.$message({
                //             message: "不可以重复签名",
                //             type: "warning",
                //             duration: 3000
                //         });
                //         draggable = true
                //     } else if (data.signatoryId == signatoryId && data.sealType == type && type == "01" && data.compactFileCode == self.compactFileCode) {
                //         self.$message({
                //             message: "不可以重复签章",
                //             type: "warning",
                //             duration: 3000
                //         });
                //         draggable = true
                //     } else if (sealid && data.sealId == sealid && data.sealType == type && data.compactFileCode == self.compactFileCode) {
                //         self.$message({
                //             message: "不可以重复签名",
                //             type: "warning",
                //             duration: 3000
                //         });
                //         draggable = true
                //     }
                // });
                // if (draggable == true) {
                //     return
                // }
                var event = event || window.event;
                disX = event.clientX - this.offsetLeft;
                disY = event.clientY - this.offsetTop;
                var cloneTemp = cloneMoves.cloneNode(true);

                var appendLi = document.createElement("div");
                var id = cloneMoves.id;
                var html = "";
                var isMove = false;

                // 签署位置拖动 是标记标签的拖动
                if (id == "draggable") {
                    // 拖动的是签名
                    if (
                        self.signatureMethod == "03" ||
                        self.signatureMethod == "02"
                    ) {
                        return self.$message.error(
                            "多页/骑缝签章,不支持标记位置签署"
                        );
                    }
                    console.log("拖动的是签名");
                    let name = $(cloneTemp).find(".name").html();
                    html = `
                        <div class='drag_name' title='1231231'>
                            <div class='name'>${$(cloneTemp)
                                .find(".name")
                                .html()}</div>
                            <div class='imgName'>
                                <img src='../../../../static/image/singName.png'>
                            </div>
                            <i class='el-message-box__close el-icon-close'></i>
                        </div>
                        `;
                }
                if (id == "draggable2") {
                    // 拖动的签章
                    if (
                        self.signatureMethod == "03" ||
                        self.signatureMethod == "02"
                    ) {
                        return self.$message.error(
                            "多页/骑缝签章,不支持标记位置签署"
                        );
                    }
                    console.log("拖动的签章");
                    let name = $(cloneTemp).find(".name").html();
                    html = `
                        <div class='drag_Seal'>
                            <div class='name' title='${name}'>${$(cloneTemp)
                        .find(".name")
                        .html()}</div>
                            <div class='imgSeal'>
                                <img src='../../../../static/image/Oval.png'>
                            </div>
                            <i class='el-message-box__close el-icon-close'></i>
                        </div>
                        `;
                }
                if (id == "timeMask") {
                    if (self.signatureMethod == "03") {
                        return self.$message.error("骑缝签章,不支持时间戳签署");
                    }
                    //拖动时间
                    width = $(cloneMoves).find("span").width();
                    height = $(cloneMoves).find("span").height();
                    type = "05";
                    name = "时间戳签名";
                    console.log(self.compactSignatoryList);
                    self.compactSignatoryList.forEach((ele) => {
                        ele.userId == self.userinfo.userId
                            ? (signatoryId = ele.compactSignatoryId)
                            : "";
                    });
                    html = `
                        <div class='autograph_seal singAutograph'>
                            <img src='${self.signTimeSrc}' style='width: ${width}px; height: ${height}px;'>
                            <i class='el-message-box__close el-icon-close'></i>
                        </div>
                        `;
                }
                // 签名签章拖动
                var parentId = cloneMoves.parentNode.id;
                if (
                    ["ukeySign", "ukeySeal", "autograph", "seal"].includes(
                        parentId
                    )
                ) {
                    let src = $(cloneMoves).find(".imgSrc").prop("src");
                    if (
                        $(cloneMoves)
                            .parents("#autograph")
                            .hasClass("singAutograph")
                    ) {
                        //singAutograph?
                        html = `
                            <div class='autograph_seal singAutograph'>
                                <img src='${src}' style='width: ${width}px; height: ${height}px;'>
                                <i class='el-message-box__close el-icon-close'></i>
                            </div>
                            `;
                    } else if (
                        $(cloneMoves).parents("#seal").hasClass("singAutograph")
                    ) {
                        html = `
                            <div class='autograph_seal singAutograph'>
                                <img src='${src}' style='width: ${width}px; height: ${height}px;'>
                                <i class='el-message-box__close el-icon-close'></i>
                            </div>
                            `;
                    } else if (
                        $(cloneMoves)
                            .parents("#ukeySign")
                            .hasClass("singAutograph")
                    ) {
                        html = `
                            <div class='autograph_seal singAutograph'>
                                <img src='${src}' style='width: ${width}px; height: ${height}px;'>
                                <i class='el-message-box__close el-icon-close'></i>
                            </div>
                            `;
                    } else if (
                        $(cloneMoves)
                            .parents("#ukeySeal")
                            .hasClass("singAutograph")
                    ) {
                        html = `
                            <div class='autograph_seal singAutograph'>
                                <img src='${src}' style='width: ${width}px; height: ${height}px;'>
                                <i class='el-message-box__close el-icon-close'></i>
                            </div>
                            `;
                    } else {
                        html = `
                            <div class='autograph_seal'>
                                <img src='${src}' style='width: ${width}px; height: ${height}px;'>
                                <i class='el-message-box__close el-icon-close'></i>
                            </div>
                            `;
                    }
                }
                appendLi.innerHTML = html;
                cloneTemp = appendLi;
                // ??
                appendLi.style.left = 0; // this.currentStyle
                // ? this.currentStyle["left"]
                // : getComputedStyle(this, null)["left"];
                appendLi.style.top = 0; // this.currentStyle
                // ? this.currentStyle["top"]
                // : getComputedStyle(this, null)["top"];
                appendLi.style.position = "absolute";
                appendLi.className = "drag";
                if (signatureType == "01" || signatureType == "04") {
                    appendLi.className = "drag_ukey drag";
                }
                document.body.appendChild(cloneTemp);
                cloneMoves.setCapture && cloneMoves.setCapture(); //将Mouse事件锁定到指定元素上。
                document.onmousemove = function (event) {
                    isMove = true;
                    var event = event || window.event;
                    var iL = event.clientX;
                    /*- disX;*/
                    var iT = event.clientY;
                    /* - disY;*/
                    var maxL =
                        document.documentElement.clientWidth -
                        cloneMoves.offsetWidth;
                    var maxT =
                        document.documentElement.clientHeight -
                        cloneMoves.offsetHeight;
                    iL <= 0 && (iL = 0);
                    iT <= 0 && (iT = 0);
                    iL >= maxL && (iL = maxL);
                    iT >= maxT && (iT = maxT);
                    if (iL < 220) {
                        iL = 220;
                    }
                    cloneTemp.style.left = iL + "px";
                    cloneTemp.style.top = iT + "px";

                    event.stopPropagation && event.stopPropagation();
                    event.preventDefault;
                    event.returnValue = false;
                    event.cancelBubble = true;
                    return false;
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;

                    // TODO 判断是否已有一枚深圳市电子印章
                    let _curShenzhenSeal = self.checkIsShenzhenSealInCompactFieldList(
                        self.compactFieldList
                    );

                    if (self.isShenzhenTab && _curShenzhenSeal) {
                        self.$message({
                            type: "warning",
                            message: "每份合同只允许使用一枚深圳市电子印章",
                            duration: 1500,
                        });

                        return;
                    }

                    let left =
                        document.getElementById("img_box").offsetLeft + 220;
                    let oldLeft = cloneTemp.style.left.slice(
                        0,
                        cloneTemp.style.left.length - 2
                    );
                    if (oldLeft == 0) {
                        oldLeft = 220;
                    }
                    let scrollLeft = $(
                        "#scroll .el-scrollbar__wrap"
                    ).scrollLeft();
                    let top = 50 + 30; // 距离头部的距离跟间距
                    let oldLTop = cloneTemp.style.top.slice(
                        0,
                        cloneTemp.style.top.length - 2
                    );
                    if (oldLTop == 0) {
                        oldLTop = 80;
                    }
                    let scrollTop = $(
                        "#scroll .el-scrollbar__wrap"
                    ).scrollTop();
                    let newLeft = Number(oldLeft) + scrollLeft - left;
                    let newTop = Number(oldLTop) + scrollTop - top - 26;
                    newLeft =
                        newLeft < 0
                            ? 0
                            : newLeft > 778 - cloneTemp.clientWidth
                            ? 775 - cloneTemp.clientWidth
                            : newLeft;
                    newTop =
                        newTop < 0
                            ? 0
                            : newTop > 1100 - cloneTemp.clientHeight
                            ? 1095 - clientHeight
                            : newTop;
                    let obj = {
                        signName: $(cloneTemp).find(".name").html() || name, // 名称
                        compactFileCode: self.compactFileCode, // 合同文件编码
                        compactFileId: self.compactDocumentId, // 合同文件id
                        compactId: self.compactId, // 合同id
                        sealId: sealid, // 签章id
                        signatureMethod: self.signatureMethod, // 签章方式(01：单页签章；02：多页签章；03：骑缝签章；)
                        signatoryId: signatoryId, // 签署人Id
                        signatureCoordinateX: newLeft / self.widthPx,
                        signatureCoordinateY:
                            (self.heightPx - newTop) / self.heightPx, //距离底部的percent
                        signatureEndPage: 1,
                        signatureStartPage: self.pageNumber,
                        sealType: type, // 判断签章或者签名的类型 （01：印章；02：签名；05：时间戳 07: 深圳市电子印章）
                        sealGrantCode, // 深圳市电子印章对应授权码
                        sealCert, // 深圳市电子印章证书
                        imgUrl: $(cloneTemp)
                            .find(".autograph_seal img")
                            .attr("src"),
                        width: width,
                        height: height,
                        signatureType: signatureType,
                        signTime: id == "timeMask" || null,
                        pictureBase64Str:
                            id == "timeMask"
                                ? self.signTimeSrc.split(",")[1]
                                : null, // 时间戳签章base64图片
                        sealWidth: id == "timeMask" ? 600 : null, //时间戳签章宽高及字号 暂时写死
                        sealHeight: id == "timeMask" ? 90 : null,
                        sealFontSize: id == "timeMask" ? 80 : null,
                    };
                    console.log(obj);

                    // TODO shenzhen cloneMove  中 mouseup 时的坐标监听
                    // shenzhen 增加全局监听，供 深圳市电子印章使用
                    // --------------------------
                    self.shenzhenSignatureCoordinateX =
                        obj.signatureCoordinateX;
                    self.shenzhenSignatureCoordinateY =
                        obj.signatureCoordinateY;

                    console.log(
                        self.shenzhenSignatureCoordinateX,
                        self.shenzhenSignatureCoordinateY
                    );
                    // --------------------------

                    let markArr = self.compactFieldList.filter((ele) => {
                        //当前页标记位置
                        return (
                            !ele.sealId &&
                            ele.signatureStartPage == self.pageNumber &&
                            obj.sealType == ele.sealType &&
                            !ele.hasPoxSign
                        );
                    });
                    console.log(isMove, 111);
                    if (markArr.length && !isMove) {
                        obj.signatureCoordinateX =
                            markArr[0].signatureCoordinateX;
                        obj.signatureCoordinateY =
                            markArr[0].signatureCoordinateY;
                    }
                    self.compactFieldList.push(obj);

                    //ukey的草稿、待我签署  //01：ukey印章，02：云签名，03：云印章，04：ukey签名

                    if (
                        (obj.signatureMethod != "01" &&
                            self.editType != "01") ||
                        (obj.signatureMethod != "01" && self.editType == "01")
                    ) {
                        self.dialogVisible = true;
                        self.index = self.compactFieldList.length - 1;
                    }
                    $(cloneTemp).remove();
                    // 判断签署位置     //
                    // console.log(self.editType == '01'); // 模板过来的editType null第一次不验证
                    // if ($(cloneTemp).find('.singAutograph').length > 0 && (self.editType == '01') && !self.dialogVisible) { //单页 editType
                    if (
                        $(cloneTemp).find(".singAutograph").length > 0 &&
                        (self.editType == "01" || self.hasPoiSigns) &&
                        !self.dialogVisible
                    ) {
                        //单页 editType
                        // if ($(cloneTemp).find('.singAutograph').length > 0 && !self.dialogVisible) { //单页 editType
                        //待我
                        let positionFlag = self.positionContrast(
                            obj,
                            self.compactFieldList.length - 1,
                            width,
                            height
                        );
                        if (positionFlag == "forbid") {
                            self.compactFieldList.splice(
                                self.compactFieldList.length - 1,
                                1
                            );
                        } else {
                            self.calcAllStatusSign(); //签署移动签正确，获取当前各种状态的签章状态合集
                        }
                    }

                    self.$nextTick(function () {
                        console.log(self);
                        self.drg();
                    });
                };
                this.setCapture && this.setCapture();
                cloneMoves.releaseCapture && cloneMoves.releaseCapture();
                return false;
            };
        },
        firstPage() {
            this.pageNumber = 1;
            let data = {
                imgUrl:
                    "/compact/file/page?fileCode=" +
                    this.compactDocumentId +
                    "&pageNo=1" +
                    "&compactId=" +
                    this.compactId +
                    "&token=" +
                    this.token +
                    "&_t=" +
                    this.nowTime,
            };
            this.fileList = [data];
        },
        lastPage() {
            this.pageNumber = this.pageTotal;
            let data = {
                imgUrl:
                    "/compact/file/page?fileCode=" +
                    this.compactDocumentId +
                    "&pageNo=" +
                    this.pageTotal +
                    "&compactId=" +
                    this.compactId +
                    "&token=" +
                    this.token +
                    "&_t=" +
                    this.nowTime,
            };
            this.fileList = [data];
        },
        loadMore() {
            if (this.pageNumber >= this.pageTotal) {
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
                    this.pageNumber +
                    "&compactId=" +
                    this.compactId +
                    "&token=" +
                    this.token +
                    "&_t=" +
                    this.nowTime,
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
                    this.pageNumber +
                    "&compactId=" +
                    this.compactId +
                    "&token=" +
                    this.token +
                    "&_t=" +
                    this.nowTime,
            };
            this.fileList = [data];
            $("#scroll .el-scrollbar__wrap").animate({ scrollTop: 5 }, 200);
        },
        // 签名与位置之间对比;width:章模的宽度，height:章模的高度，
        positionContrast(obj, index, width, height, bre) {
            let self = this,
                arr = [];
            let arrNull = [],
                isHadMySign = false, //当前标签是否已经有了移动签
                compactFieldList = this.compactFieldList;
            compactFieldList.map((ele) => {
                !ele.sealId && ele.sealType != "05" ? arrNull.push(ele) : "";
            });
            //无指定签署位置
            if (arrNull.length == 0) {
                this.flag = true;
                return true;
            }

            // //如果所有位置都有正确签章放置
            // console.log(this.filterSignNumFlag());
            // if (this.filterSignNumFlag()) {
            //     return;
            // }

            let flagType = true;
            for (let i = 0; i < this.compactFieldList.length; i++) {
                let data = this.compactFieldList[i],
                    key = i;
                // if (!data.sealId) { //标签(如果当前单页标签巧合位置完全相同--bug--是否导致页面pageNum判断失败)暂时只支持单页
                if (!data.sealId && data.sealType != "05") {
                    if (
                        obj.compactFileCode != data.compactFileCode ||
                        (obj.signatureStartPage != data.signatureStartPage &&
                            obj.signatureMethod == "01")
                    ) {
                        continue;
                    }
                    if (
                        obj.signatureMethod != "01" &&
                        (data.signatureStartPage > obj.signatureEndPage ||
                            data.signatureStartPage < obj.signatureStartPage)
                    ) {
                        continue;
                    }
                    //obj.signatureCoordinateX:纸张宽度与章模宽度的比率
                    //self.widthPx:纸张的宽度

                    let picLeftTopX = obj.signatureCoordinateX * self.widthPx; //章模左上角X轴
                    let picLeftTopY =
                        self.heightPx -
                        obj.signatureCoordinateY * self.heightPx; //章模左上角Y轴
                    let picRightDownX =
                        obj.signatureCoordinateX * self.widthPx + width; //章模右下角X轴
                    let picRightDownY =
                        self.heightPx -
                        obj.signatureCoordinateY * self.heightPx +
                        height; //章模右下角Y轴
                    //判断章模是否在签署范围内（极限重合即可）
                    let bool =
                        picRightDownX >=
                            data.signatureCoordinateX * self.widthPx &&
                        picLeftTopX <=
                            data.signatureCoordinateX * self.widthPx +
                                $("#img_box .drag_list.sign") //
                                    .eq(key)
                                    .width() &&
                        picRightDownY >=
                            self.heightPx -
                                data.signatureCoordinateY * self.heightPx &&
                        picLeftTopY <=
                            self.heightPx -
                                data.signatureCoordinateY * self.heightPx +
                                $("#img_box .drag_list.sign")
                                    .eq(key)
                                    .height() &&
                        self.pageNumber == data.signatureStartPage;
                    if (bool) {
                        //匹配到的=>标签&&在范围内&&当前页  目前只有单页可标签
                        // self.bindPoiAndMySignById(obj,data,data.id); //标签与移动签对应
                        arr.push(i);
                    }
                    if (!bool) {
                        //位置不匹配
                        if (obj.sealType == "02" && data.sealId == null) {
                            // 签名
                            if (!bre) {
                                self.flag = false;
                                // self.compactFieldList[index].signatureMethod = self.signatureMethod;
                                // self.compactFieldList[index].signatureStartPage = self.pageNumber;
                                // self.compactFieldList[index].signatureEndPage = self.pageNumber;
                            }
                        } else if (
                            obj.sealType == "01" &&
                            data.sealId == null
                        ) {
                            if (!bre) {
                                self.flag = false;
                                // self.compactFieldList[index].signatureMethod = self.signatureMethod;
                                // self.compactFieldList[index].signatureStartPage = self.pageNumber;
                                // self.compactFieldList[index].signatureEndPage = self.pageNumber;
                            }
                        }
                    } else if (bool == true && data.sealId != obj.sealId) {
                        // 只要有一个在需要盖章的位置就可以了    在签署范围内、章模id不相等、类型相等的情况下
                        if (obj.sealType == data.sealType) {
                            if (
                                !data.indexPoi ||
                                obj.indexPoi == data.indexPoi
                            ) {
                                //当前位置没有匹配移动签(第一次) || 当前为已匹配移动移动签 //这些判断主要为了避免 1:标签位置重叠
                                self.right = true;
                                self.rightNumber++;
                                self.flag = true;
                                data.hasPoxSign = true;
                                self.bindPoiAndMySignById(obj, data, data.id); //标签与移动签对应
                                self.calcAllStatusSign();
                                break;
                            } else {
                                //匹配到位置了，但是1:标签位置重叠 2：当前标签已有移动签
                                if (arrNull.length - 1 == key) {
                                    //2情况
                                    isHadMySign = true;
                                    break;
                                }
                                continue;
                            }
                            // self.compactFieldList[index].signatureMethod = data.signatureMethod;
                            // self.compactFieldList[index].signatureStartPage = data.signatureStartPage;
                            // self.compactFieldList[index].signatureEndPage = data.signatureEndPage;
                        } else {
                            self.flag = false; //
                            flagType = false; //
                        }
                    }
                }
            }
            if (!self.flag) {
                self.unbindPoiAndMySignById(obj);
                self.calcAllStatusSign();
                let errorMsg =
                    flagType == false
                        ? "您的印章/签名和签署位置类型不匹配"
                        : "请您把印章/签名拖动到对应的签署位置上";
                if (isHadMySign) {
                    errorMsg = "当前位置已设置签章!";
                }
                console.log("您的印章/签名和签署");
                if (
                    self.allNoSignsCurrentDoc.length > 0 &&
                    self.currentPagePoiNoSigns.length > 0
                ) {
                    self.$message({
                        message: errorMsg,
                        type: "warning",
                        duration: 3000,
                    });
                }
                return false;
            }
            if (self.flag && obj.signatureMethod != "01") {
                self.$message({
                    message: "指定位置签署，仅支持单页签署",
                    type: "warning",
                    duration: 3000,
                });
                return "forbid";
            }

            return true;
        },
        ukeySign(params) {
            console.log("ukeySign", params);
            //this.loadingTabel = true;
            this.signUKeyParams = params;
            this.isCanClick = false;
            var that = this;
            this.getAllUKeyListOfSign().then((res) => {
                res = JSON.parse(res);
                if (this.successUKeyCheckCode(res)) {
                    that.pin = "";
                    that.ukeyList = res.keyList;
                    if (that.ukeyList.length > 0) {
                        //默认选中第一个
                        that.ukeychoice = 0;
                    } else {
                        that.ukeychoice = "";
                    }
                    that.UkeyCheck = true;
                } else {
                    $(".drag_ukey").remove(); // ？
                    return;
                }
            });
        },
        deleteSign(index) {
            let delItem = this.compactFieldList.splice(index, 1);
            this.unbindPoiAndMySignById(delItem[0]);
            this.calcAllStatusSign();
            this.compactFieldListChange("sure");
        },
        async detailData() {
            // 合同详情回显
            //this.loadingTabel = true;
            var that = this;
            var userId = JSON.parse($.cookie("userinfo")).userId;
            if (this.editType == "01") {
                // 签署
                await this.signDetail(this.compactId, userId)
                    .then((res) => {
                        this.success(res);
                    })
                    .fail((res) => {
                        this.nodata = true;
                        this.loadingTabel = false;
                    });
            } else {
                // 继续
                await this.detail(this.compactId)
                    .then((res) => {
                        this.success(res);
                    })
                    .fail((res) => {
                        this.nodata = true;
                        this.loadingTabel = false;
                    });
            }
        },
        success(res) {
            let self = this;
            self.loadingTabel = false;
            if (this.successCheckCode(res)) {
                var docfile = res.data.compactDocumentList,
                    arr1 = [],
                    arr2 = [];
                //保证合同在前附件在后
                docfile.map((res) => {
                    if (res.compactDocumentType == "01") {
                        arr1.push(res);
                    } else {
                        arr2.push(res);
                    }
                });
                docfile = arr1.concat(arr2);
                // 根据控件的文件编码获取文件ID
                if (this.isTemp) {
                    this.compactFieldList.forEach((v) => {
                        v.compactFileCode = docfile.find(
                            (val) => v.fileCode === val.compactDocumentCode
                        ).compactDocumentId;
                    });
                }
                this.pageNumber = 1;
                this.compactDocumentList = docfile; // 合同文件集合
                this.compactId = res.data.compactId;
                this.paymentMethod = res.data.paymentMethod;
                this.compactSignatoryList = res.data.compactSignatoryList
                    ? res.data.compactSignatoryList
                    : this.compactSignatoryList;
                this.compactDocumentId = this.compactDocumentList[0].compactDocumentCode; // 默认显示第一个合同
                this.pageTotal = this.compactDocumentList[0].compactDocumentPage;
                this.isFirstSignatory = res.data.isFirstSignatory;
                this.isAuthentication = res.data.isAuthentication;
                //判断是否实名认证
                // this.realNameAuthenticationFn();
                //当前文件
                this.isSignatoryField = res.data.isSignatoryField;
                this.compactFileCode = this.compactDocumentList[0].compactDocumentId;
                if (!this.isTemp) {
                    this.compactFieldList = res.data.compactFieldList
                        ? res.data.compactFieldList
                        : [];
                }
                this.compactDocumentType = this.compactDocumentList[0].compactDocumentType;
                // 标识是否已经签署过 0:否，1是  是否签署人UKey签章 0:否，1是
                this.isKeySignature = res.data.isKeySignature;
                this.signPage.signatureStartPage = 1;
                this.signPage.signatureEndPage = this.pageTotal;
                // 未签署位置（指定签署位置）集合 sealId=null
                let compactFieldListNoSignList = this.compactFieldList.filter(
                    (item) => {
                        return !item.sealId;
                    }
                );
                if (
                    this.compactFieldList.length > 0 &&
                    compactFieldListNoSignList.length == 0
                ) {
                    this.flag = true; //???
                }
                if (
                    compactFieldListNoSignList.length > 0 &&
                    (this.editType == "01" || this.isTemp)
                ) {
                    this.hasPoiSigns = true;
                }
                this.compactFieldListChange();
                if (this.isTemp) {
                    this.signatoryId = this.userinfo.userId;
                } else {
                    //是否第一签署人
                    if (this.isFirstSignatory == 1) {
                        this.signatoryId = this.compactSignatoryList[0].compactSignatoryId;
                    }
                }
                this.fileList = [
                    {
                        imgUrl:
                            "/compact/file/page?fileCode=" +
                            this.compactDocumentList[0].compactDocumentCode +
                            "&pageNo=1" +
                            "&compactId=" +
                            this.compactId +
                            "&token=" +
                            this.token +
                            "&_t=" +
                            this.nowTime,
                    },
                ];
            }

            setTimeout(() => {
                self.drg();
            }, 200);
        },
        //合同文件doc 获取各自的签章签名的数量
        //
        compactFieldListChange(methods) {
            let self = this;
            let list = self.compactFieldList;
            this.compactDocumentList.map(function (
                compactDocument,
                compactDocumentindex
            ) {
                let autographNumber = 0,
                    sealNumber = 0;
                let id = compactDocument.compactDocumentId;
                if (list) {
                    list.map(function (data, index) {
                        if (data.compactFileCode == id) {
                            //合同文件id匹配
                            if (data.sealType == "02") {
                                // 签名
                                autographNumber++;
                            } else if (data.sealType == "01") {
                                // 签章
                                sealNumber++;
                            }
                        }
                        if (data.sealId != null && methods != "sure") {
                            // 删除的时候跟改变签署的list的时候不需要调这个接口 只有详情的时候需要
                            self.signImgUrl(data.sealId) //获取印章详情
                                .then((res) => {
                                    if (self.successCheckCode(res)) {
                                        self.$nextTick(() => {
                                            list[index].imgUrl =
                                                res.data.signatureFilePath +
                                                "&token=" +
                                                self.sessionToken; // 签章的图片路径
                                            list[index].width =
                                                res.data.signatureWidth *
                                                self.rate;
                                            list[index].height =
                                                res.data.signatureHeight *
                                                self.rate;
                                            self.compactFieldList = list;
                                        });
                                    } else {
                                        console.log(res.msg);
                                        console.log("获取印章详接口失败");
                                    }
                                    setTimeout(function () {
                                        self.loadingTabel = false;
                                    }, 100);
                                })
                                .fail((res) => {
                                    self.loadingTabel = false;
                                });
                        } else {
                            self.compactFieldList = list;
                        }
                    });
                    // 标记是否有签名或者盖章
                    compactDocument.autographNumber = autographNumber;
                    compactDocument.sealNumber = sealNumber;
                }
            });
        },
        chosseSign(type) {
            if (this.isTemp && (type === "02" || type === "03")) {
                return this.$message.warning("模板签章不支持多页和骑缝签章");
            }
            this.signatureMethod = type;
            if (type == "02") {
                this.dialogTitle = "多页签署参数";
            } else if (type == "03") {
                this.dialogTitle = "骑缝签署参数";
            }
        },
        //合同图片内drg
        drg() {
            let self = this;
            let arrNull = [];
            this.compactFieldList.map((ele) => {
                !ele.sealId ? arrNull.push(ele) : "";
            });
            $("#img_box>.drag_list").each(function () {
                if ($(this).hasClass("sign")) {
                    return;
                }
                let hasSingDrg = $(this).hasClass("singDrg"); //移动签
                //拖拽结束
                $(this).draggable({
                    stop: function (event, ui) {
                        let index = $(event.target).attr("data-id");
                        let left = ui.position.left;
                        let top = ui.position.top;
                        left = left < 0 ? 0 : left;
                        top = top < 0 ? 0 : top;
                        // TODO shenzhen drg 印章坐标
                        console.log("drg", top, left, self.compactFieldList);
                        self.compactFieldList[index].signatureCoordinateX =
                            left / self.widthPx;
                        self.compactFieldList[index].signatureCoordinateY =
                            (self.heightPx - top) / self.heightPx;

                        // shenzhen 增加全局监听，供 深圳市电子印章使用
                        // --------------------------
                        self.shenzhenSignatureCoordinateX =
                            self.compactFieldList[index].signatureCoordinateX;
                        self.shenzhenSignatureCoordinateY =
                            self.compactFieldList[index].signatureCoordinateY;

                        console.log(
                            self.shenzhenSignatureCoordinateX,
                            self.shenzhenSignatureCoordinateY
                        );
                        // --------------------------

                        if (hasSingDrg == true) {
                            let positionFlag = self.positionContrast(
                                self.compactFieldList[index],
                                index,
                                $(event.target).width(),
                                $(event.target).height()
                            );
                            if (positionFlag == "forbid") {
                                self.compactFieldList.splice(
                                    self.compactFieldList.length - 1,
                                    1
                                );
                                return;
                            }
                        }
                        if (
                            (self.compactFieldList[index].signatureMethod !=
                                "01" &&
                                self.editType != "01") ||
                            (arrNull.length == 0 &&
                                self.editType == "01" &&
                                self.compactFieldList[index].signatureMethod !=
                                    "01")
                        ) {
                            // self.dialogVisible = true;
                            // self.index = index;
                        }
                    },
                });
            });
        },
        getInfo() {
            let info = {
                code: 0,
                data: {
                    compactDocumentList: [
                        {
                            compactDocumentCode: "string", // 合同文档编码
                            compactDocumentName: "string", //  合同文档名称
                            compactDocumentPage: "string", // 合同文档页数
                            compactDocumentType: "string", // 合同文档类型（01：合同文件；02：合同附件；）
                            compactFirstImagePath: "string", // 合同文档第一页文件图片路径
                        },
                    ],
                    compactId: "string", // 合同Id
                    signatoryList: [
                        {
                            compactSignatoryId: "string", // 合同签署人Id
                            compactSignatoryName: "string", // 合同签署人名称
                        },
                    ],
                },
                msg: "string",
            };
        },
        back() {
            if (this.isTemp) {
                return this.$router.push("/contractlist");
            }
            if (this.editType == undefined) {
                this.clearCompactId(this.compactId).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.$router.push({
                            path: "/contractprocess",
                            query: {
                                type: "01",
                                id: this.$route.query.compactId,
                            },
                        });
                    }
                });
            } else {
                history.go(-1);
            }
        },
        //获取某企业的印章列表
        getListData() {
            let data = {
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                esealPictureTypeEnum: "03", //印章
                currPage: this.pageNum2,
                pageSize: this.pageSize2,
            };
            if (!this.autographType) {
                this.getSealSignListByRole(data).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.ukeySealLists = res.data.records;
                        this.total2 = res.data.total;
                        this.currentpage2 = res.data.current;
                        let that = this;

                        setTimeout(function () {
                            that.$nextTick(function () {
                                let autograph = $("#autograph li");
                                let seal = $("#seal li");

                                autograph.map(function (index, el) {
                                    if (index < autograph.length) {
                                        that.cloneMove(el);
                                    }
                                });

                                seal.map(function (index, el) {
                                    if (index < seal.length) {
                                        that.cloneMove(el);
                                    }
                                });
                            });
                        }, 100);
                    }
                });
            }
        },
        tab() {
            this.autographType = !this.autographType;
            // if (this.pageNum2 == 1) {
            //     this.getListData();
            // }
        },
        goMysign(val) {
            if (val == 0) {
                this.$router.push({ path: "/mysign" });
            } else {
                this.$router.push({ path: "/myseal" });
            }
        },
        contractInfo(code, pageTotal, id, compactDocumentType, pageNumber) {
            this.compactDocumentType = compactDocumentType;
            this.compactFileCode = id; // 默认是compactDocumentList数组第一个值的compactFileCode
            this.compactDocumentId = code;
            this.pageTotal = pageTotal;
            this.pageNumber = pageNumber || 1;
            this.signPage.signatureEndPage = pageTotal;
            this.signPage.signatureStartPage = 1;
            this.signPage.ridingPage = "";
            $("#scroll .el-scrollbar__wrap").scrollTop(1); //mouted中监听了滚动
            this.calcAllStatusSign();
            this.fileList = [
                {
                    imgUrl:
                        "/compact/file/page?fileCode=" +
                        this.compactDocumentId +
                        "&pageNo=" +
                        this.pageNumber +
                        "&compactId=" +
                        this.compactId +
                        "&token=" +
                        this.token +
                        "&_t=" +
                        this.nowTime,
                },
            ];
        },
        scrollprev() {
            this.loadprev();
            // if (this.pageNumber > 1) {
            //     this.pageNumber = this.pageNumber - 1;
            //     let height = $("#scroll .list").outerHeight(true);
            //     $("#scroll .el-scrollbar__wrap").animate({scrollTop: (this.pageNumber - 1) * height}, 800);
            // }
        },
        scrollnext() {
            this.loadMore();
            // if (this.pageNumber < this.pageTotal) {
            //     let height = $("#scroll .list").outerHeight(true);
            //     let data = {
            //         imgUrl: "/compact/file/page?fileCode=" + this.compactFileCode + "&pageNo=" + this.pageNumber
            //     };
            //     this.fileList.push(data);
            //     $("#scroll .el-scrollbar__wrap").animate({scrollTop: this.pageNumber * height}, 800);
            //     this.pageNumber = this.pageNumber + 1;
            // }
        },

        //分页选择
        //签名分页
        handleCurrentChange1(val) {
            this.pageNum1 = val;
            this.getCouldSignData();
        },
        //印章分页
        handleCurrentChange2(val) {
            this.pageNum2 = val;
            this.getListData();
        },
        getCouldSignData() {
            let data = {
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                esealPictureTypeEnum: "02", // 云签名 // 01：ukey印章，02：云签名，03：云印章，04：ukey签名 ,05:印章集合，06：签名集合
                currPage: this.pageNum1,
                pageSize: this.pageSize1,
                // pictureCode:"44030145236553"
            };
            if (this.userType == "02") {
                this.getPersonSealSignList(data).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.mySignList = res.data.records;
                        this.total1 = res.data.total;
                        this.currentpage1 = res.data.current;

                        let self = this;
                        setTimeout(function () {
                            self.$nextTick(function () {
                                let autograph = $("#autograph li");
                                let seal = $("#seal li");

                                autograph.map(function (index, el) {
                                    if (index < autograph.length) {
                                        self.cloneMove(el);
                                    }
                                });

                                seal.map(function (index, el) {
                                    if (index < seal.length) {
                                        self.cloneMove(el);
                                    }
                                });
                            });
                        }, 100);
                    }
                });
            } else {
                this.getSealSignListByRole(data).then((res) => {
                    if (this.successCheckCode(res)) {
                        this.mySignList = res.data.records;
                        this.total1 = res.data.total;
                        this.currentpage1 = res.data.current;

                        let self = this;
                        setTimeout(function () {
                            self.$nextTick(function () {
                                let autograph = $("#autograph li");
                                let seal = $("#seal li");

                                autograph.map(function (index, el) {
                                    if (index < autograph.length) {
                                        self.cloneMove(el);
                                    }
                                });

                                seal.map(function (index, el) {
                                    if (index < seal.length) {
                                        self.cloneMove(el);
                                    }
                                });
                            });
                        }, 100);
                    }
                });
            }

            // this.getCouldSignList(1, 100).then(res => {
            //
            // })
        },
        mysign() {
            this.$router.push({ path: "/mysign" });
        },
        draggable(value) {
            this.cover = false;
            let arrIndex = "";
            let self = this;
            self.id = value;
            this.compactSignatoryList.map((item, index) => {
                if (item.compactSignatoryId == value) {
                    self.valueName = item.compactSignatoryName;
                    self.valueUserType = item.userType || "";
                    // if (self.compactSignatoryList.length >= 10) {
                    //     arrIndex = index.toString().substring(index.toString().length - 1, index.toString().length);
                    // } else {
                    //     arrIndex = index;
                    // }
                }
            });
            // this.background = this.color[arrIndex];
        },
        // checkAllDocsSigned() {
        //     let allCompactsignFlage = false;
        //     this.compactDocumentList.some((item) => {
        //         allCompactsignFlage = false;
        //         compactFieldListNew.some((file) => {
        //             if (file.compactFileCode == item.compactDocumentId) { //一份合同值签署一份？？
        //                 allCompactsignFlage = true;
        //                 return true;
        //             }
        //         });
        //         if (!allCompactsignFlage) {
        //             return true;
        //         }
        //     });

        // },
        async sureSign() {
            // 优化处理一下 compactFieldList ，清除脏数据（其 sealType 为 undefined）
            this.compactFieldList = this.compactFieldList.filter(
                (sealItem) => sealItem.sealType
            );

            let _curShenzhenSeal = this.checkIsShenzhenSealInCompactFieldList(
                this.compactFieldList
            );

            let _list = this.compactFieldList;

            // TODO 暂时不允许合同平台印章和深圳市电子印章一起签署
            if (_curShenzhenSeal && _list.length > 1) {
                this.dialogShenzhenTipVisible = true;
                return;
            }

            // TODO shenzhen sureSign
            // ---------------------------
            if (_curShenzhenSeal && !this.hasInvokeSureSign) {
                await this.getPdfHash();
                await this.signTask();
                await this.pushSignResult();

                return;
            }
            // ---------------------------

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // console.log(this.compactFieldList)
            // 指定位置重复则自动去重
            let _orgList = [],
                _idxList = [];

            // 深拷贝原始数组
            _orgList = JSON.parse(JSON.stringify(this.compactFieldList));

            for (let i = 0; i < _orgList.length - 1; i++) {
                for (let j = i + 1; j < _orgList.length; j++) {
                    if (
                        // 同页同类型同位置 -- 满足条件则去重
                        _orgList[j].signatureStartPage ==
                            _orgList[i].signatureStartPage &&
                        _orgList[j].sealType == _orgList[i].sealType &&
                        _orgList[j].signatureCoordinateX ==
                            _orgList[i].signatureCoordinateX &&
                        _orgList[j].signatureCoordinateY ==
                            _orgList[i].signatureCoordinateY
                    ) {
                        _idxList.push(j);
                    }
                }
            }

            _idxList = [...new Set(_idxList)]; // 索引去重

            // 按索引去重
            for (let k = 0; k < _idxList.length; k++) {
                _orgList.splice(_idxList[k] - k, 1);
            }

            this.compactFieldList = _orgList;
            // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

            //editType0 || !isTemp 首发
            this.checkPermission(
                // 权限校验
                this.$perMap.contractMgt.signature.url
            ).then((res) => {
                if (!this.successCheckCode(res)) {
                    return;
                }
                let compactDocumentList = this.compactDocumentList.filter(
                    (item) => {
                        return item.compactDocumentType == "01";
                    }
                );
                if (
                    compactDocumentList.length > 1 &&
                    (this.isFirstSignatory == "1" || this.editType == "01")
                ) {
                    this.$confirm(
                        `当前有${compactDocumentList.length}份文件需要签署，确认都签署完成?`,
                        "风险提示",
                        {
                            type: "warning",
                            confirmButtonText: "确认签署",
                            cancelButtonText: "取消",
                            customClass: "self-icon icon-safe",
                        }
                    ).then(() => {
                        this.renew();
                    });
                } else {
                    this.renew();
                }
            });
        },
        //
        async signInfo(event) {
            //editType 01
            let res = await this.checkPermission(
                // 权限校验
                this.$perMap.contractMgt.signature.url
            );
            if (res.code !== 0) {
                return;
            }
            let compactDocumentList = this.compactDocumentList.filter(
                (item) => {
                    return item.compactDocumentType == "01";
                }
            );
            //(this.isFirstSignatory == '1' && !this.isTemp)
            if (
                compactDocumentList.length > 1 &&
                (this.isFirstSignatory == "1" || this.editType == "01")
            ) {
                this.$confirm(
                    `当前有${compactDocumentList.length}份文件需要签署，确认都签署完成?`,
                    "风险提示",
                    {
                        type: "warning",
                        confirmButtonText: "确认签署",
                        cancelButtonText: "取消",
                        customClass: "self-icon icon-safe",
                    }
                ).then(() => {
                    this.signInfoFn();
                });
            } else {
                this.signInfoFn();
            }
        },
        signInfoFn() {
            let self = this;
            // let arr = JSON.stringify(this.compactFieldList); // 保留签署位置 不改变this.compactFieldList
            var flag = false,
                compactFieldList,
                compactFieldListNew,
                nextCompact = "",
                arr,
                alertMessage = "";
            compactFieldList = JSON.parse(
                JSON.stringify(this.compactFieldList)
            ); // 签署位置list
            // console.log(JSON.stringify(this.compactFieldList));

            // if (this.flag) {
            //     compactFieldList = this.filteringData(JSON.parse(arr));
            //     console.log(compactFieldList)
            //     if (this.warning == true) {
            //         this.$message({
            //             message: "签名不在签署位置范围内",
            //             type: "warning",
            //             duration: 1000
            //         });
            //         return;
            //     }
            //     if (compactFieldList[1] == 0) {
            //         this.$message({
            //             message: "请您拖拽签名或印章到合同上",
            //             type: "warning",
            //             duration: 3000
            //         });
            //         return;
            //     }
            //     compactFieldListNew = compactFieldList[0];
            // }else {
            //     this.compactFieldList.map(res=> {
            //         res.signatoryId = JSON.parse($.cookie("userinfo")).userId;
            //     })
            //     compactFieldListNew = this.compactFieldList
            // }
            // if (this.compactFieldList.length == 0) {
            //     this.$message({
            //         message: "请您拖拽签名或印章到合同上",
            //         type: "warning",
            //         duration: 3000
            //     });
            //     return;
            // }
            arr = compactFieldList.filter((ele) => !ele.sealId); //标记签署位置集合
            compactFieldListNew = compactFieldList.filter((ele) => ele.sealId); //已签署位置集合

            if (!compactFieldListNew.length) {
                this.$message({
                    message: "请您拖拽签名或印章到合同上",
                    type: "warning",
                    duration: 3000,
                });
                return;
            }

            // 给已签署印章添加 signatoryId
            compactFieldListNew.map((ele) => {
                ele.signatoryId = JSON.parse($.cookie("userinfo")).userId;
            });
            // 所有合同文件都需签署校验
            let allCompactsignFlage;
            let compactDocumentList = this.compactDocumentList.filter(
                (item) => {
                    return item.compactDocumentType == "01";
                }
            );
            console.log("zxsure");
            if (this.hasPoiSigns && this.allNoSignsCurrentDoc.length > 0) {
                this.$message({
                    message: "请您把印章/签名拖动到对应的签署位置上",
                    type: "warning",
                    duration: 3000,
                });
                this.toNextPositionSign(); //去下一个未签署或者类型错误的标签
                return;
            }
            compactDocumentList.some((item) => {
                allCompactsignFlage = false;
                compactFieldListNew.some((file) => {
                    if (file.compactFileCode == item.compactDocumentId) {
                        //一份合同值签署一份？？
                        allCompactsignFlage = true;
                        return true;
                    }
                });
                if (!allCompactsignFlage) {
                    nextCompact = item;
                    return true;
                }
            });
            if (!allCompactsignFlage) {
                if (this.allNoSigns.length > 0) {
                    alertMessage = "请您把印章/签名拖动到对应的签署位置上";
                    this.toNextPositionSign();
                } else {
                    alertMessage = "请您为其他文件选择印章/签名进行签署";
                    this.contractInfo(
                        nextCompact.compactDocumentCode,
                        nextCompact.compactDocumentPage,
                        nextCompact.compactDocumentId,
                        nextCompact.compactDocumentType
                    );
                }
                this.$message({
                    message: alertMessage,
                    type: "warning",
                    duration: 3000,
                });
                return;
            }
            //签署位置校验
            if (!!arr.length) {
                let positionResult = this.filterSignNum();
                console.log(positionResult);
                if (!positionResult.flag) {
                    this.$message({
                        message: "请您把印章/签名拖动到对应的签署位置上",
                        type: "warning",
                        duration: 3000,
                    });
                } else if (!positionResult.type) {
                    this.$message({
                        message: "您的印章/签名和签署位置类型不匹配",
                        type: "warning",
                        duration: 3000,
                    });
                }
                if (!positionResult.flag || !positionResult.type) {
                    this.toNextPositionSign();
                    return;
                }
            }

            // 实名认证签署判断
            if (!this.realNameAuthenticationFn()) {
                return;
            }
            // let realNameAuthenticationFlag = JSON.parse($.cookie('userinfo')).realNameAuthenticationFlag;
            // if (this.isAuthentication == 0 && realNameAuthenticationFlag == '0') {
            //     this.$confirm('为保证安全和减少法律风险，您需实名认证后再进行签署。', '风险提示', {
            //         type: 'warning',
            //         confirmButtonText: '去实名认证',
            //         cancelButtonText: '取消',
            //         customClass: 'self-icon icon-safe'
            //     })
            //         .then(() => {
            //             if (this.userType == '01') {
            //                 this.$router.push('/companyauthen');
            //             } else {
            //                 this.$router.push({ path: '/personauthen' });
            //             }
            //         })
            //         .catch(() => {
            //             let theEvent = event || window.event;
            //             let target = theEvent.target || theEvent.srcElement;
            //             let el = target.tagName.toLowerCase();
            //             if (el == 'span' || el == 'button') {
            //                 this.$router.push('/contractlist');
            //             }
            //         });
            //     return;
            // }

            //将时间戳图片过滤存储
            compactFieldListNew = compactFieldList.filter(
                (ele) => ele.sealId || ele.signTime
            );

            // 调用签署的接口
            var list = JSON.parse(JSON.stringify(compactFieldListNew));
            list.map((res) => {
                res.width
                    ? (res.signatureCoordinateX =
                          (res.signatureCoordinateX * 778 + res.width / 2) /
                          778)
                    : "";
                res.width
                    ? (res.signatureCoordinateY =
                          (res.signatureCoordinateY * 1100 - res.height / 2) /
                          1100)
                    : "";
            });
            this.signList = list;
            /*if (list.length > 0) {
                        this.isCloudSignature = 1;
                    } else {
                        this.isCloudSignature = 0;
                    }*/

            //判断是否签署过
            if (list.length < arr.length) {
                this.$message({
                    message: "请您为其他的签署位置选择对应的签名/印章",
                    type: "warning",
                    duration: 3000,
                });
                return;
            }

            //签署序列和签署位置序列比对
            // 签署印章序列
            let signedListSeal = list.filter((item) => {
                return item.sealType == "01";
            });
            // 签署签名序列
            let signedListSign = list.filter((item) => {
                return item.sealType == "02";
            });
            // 签署印章位置序列
            let signListSeal = arr.filter((item) => {
                return item.sealType == "01";
            });
            // 签署签名位置序列
            let signListSign = arr.filter((item) => {
                return item.sealType == "02";
            });
            //判断是否签署过
            if (
                signedListSeal.length < signListSeal.length ||
                signedListSign.length < signListSign.length
            ) {
                this.$message({
                    message: "请您为其他的签署位置选择对应的签名/印章",
                    type: "warning",
                    duration: 3000,
                });
                return;
            }

            this.getSignNumber(list).then((res) => {
                if (res) {
                    if (this.paymentMethod == "03") {
                        this.$confirm(
                            "对不起，你的套餐已用完，请前往购买",
                            "提示",
                            {
                                confirmButtonText: "去购买套餐",
                                cancelButtonText: "取消",
                                type: "warning",
                                customClass: "self-icon icon-warning",
                            }
                        )
                            .then(() => {
                                this.$router.push({
                                    path: "/setmeal",
                                });
                            })
                            .catch(() => {});
                    } else {
                        this.signNumDialog = true;
                    }
                } else {
                    let params = {
                        accountId: JSON.parse($.cookie("userinfo")).accountId,
                        compactFieldSignatureInfoList: list,
                        compactId: this.compactId,
                        userId: JSON.parse($.cookie("userinfo")).userId,
                        isCloudSignature: this.isCloudSignature,
                        isKeySignature: this.isKeySignature,
                        signPassword: "",
                    };
                    console.log(JSON.stringify(params));

                    // ukey签章位置集合
                    let ukeySignList = params.compactFieldSignatureInfoList.filter(
                        (item) => {
                            return (
                                item.signatureType == "01" ||
                                item.signatureType == "04"
                            );
                        }
                    );
                    // ukey签章参数
                    let ukeySignParams = Object.assign({}, params);
                    ukeySignParams.compactFieldInfoList = ukeySignList;
                    // 标记是否进行过ukey签章，传给后台
                    if (!!ukeySignList.length) {
                        this.isKeySignature = 1;
                        ukeySignParams.isKeySignature = 1;
                    }

                    // 云签章位置集合 包括指定位置
                    let cloudSignList = params.compactFieldSignatureInfoList.filter(
                        (item) => {
                            return (
                                item.signatureType != "01" &&
                                item.signatureType != "04"
                            );
                        }
                    );
                    // 云签章参数
                    let cloudSignParams = Object.assign({}, params);
                    // 标记是否进行过云签章，传给后台
                    if (!!cloudSignList.length) {
                        this.isCloudSignature = 1;
                        cloudSignParams.isCloudSignature = 1;
                    }
                    cloudSignParams.compactFieldSignatureInfoList = cloudSignList;
                    this.signParams = cloudSignParams;

                    // 如果有一个ukey签章  先进行ukey签章
                    if (!!ukeySignList.length) {
                        this.signParams.isKeySignature = 1;
                        this.ukeySign(ukeySignParams);
                        return;
                    }

                    this.signPswOpen = true;
                    //校验签署密码
                    // if (!this.isSignPassword) {
                    //     if (this.isMainAccount == 1) {
                    //         this.$confirm('为保障您的签署安全，请先去设置签署密码', '提示', {
                    //             confirmButtonText: '去设置',
                    //             cancelButtonText: '取消',
                    //             type: 'warning',
                    //             customClass: 'self-icon icon-warning'
                    //         })
                    //             .then(() => {
                    //                 this.$router.push({ name: 'accountmanager', query: { safetyType: 2 } });
                    //             })
                    //             .catch(() => {});
                    //     } else {
                    //         this.$confirm('请您先联系管理员（主账号）去设置签署密码', '提示', {
                    //             confirmButtonText: '确定',
                    //             showCancelButton: false,
                    //             type: 'warning'
                    //         })
                    //             .then(() => {})
                    //             .catch(() => {});
                    //     }
                    // } else {
                    //     this.signPswOpen = true;
                    // }
                }
            });
        },
        // 所有的移动签 只要一个位置不符 flag:false 一个类型不符:type:false
        filterSignNum() {
            //可做修改->参考calcAllStatusSigns
            let arr = JSON.parse(JSON.stringify(this.compactFieldList));
            let arrNull = [],
                arrSeal = [],
                self = this,
                rightSeal = 0;
            arr.map((ele) => {
                !ele.sealId && !ele.signTime ? arrNull.push(ele) : ""; //标记位置
                ele.sealId ? arrSeal.push(ele) : ""; //移动签章
            });
            let flag = false;
            let type = false;

            for (let key = 0; key < arrNull.length; key++) {
                let data = arrNull[key];
                flag = false;
                type = false;
                for (let i = 0; i < arrSeal.length; i++) {
                    let obj = arrSeal[i];
                    if (
                        obj.compactFileCode != data.compactFileCode ||
                        obj.signatureStartPage != data.signatureStartPage
                    ) {
                        continue;
                    }

                    let picLeftTopX = obj.signatureCoordinateX * self.widthPx; //章模左上角X轴
                    let picLeftTopY =
                        self.heightPx -
                        obj.signatureCoordinateY * self.heightPx; //章模左上角Y轴
                    let picRightDownX =
                        obj.signatureCoordinateX * self.widthPx + obj.width; //章模右下角X轴
                    let picRightDownY =
                        self.heightPx -
                        obj.signatureCoordinateY * self.heightPx +
                        obj.height; //章模右下角Y轴
                    let width = data.sealType == "02" ? 101 : 180;
                    let height = data.sealType == "02" ? 50 : 101;
                    //判断章模是否在签署范围内
                    let bool =
                        picRightDownX >=
                            data.signatureCoordinateX * self.widthPx &&
                        picLeftTopX <=
                            data.signatureCoordinateX * self.widthPx + width &&
                        picRightDownY >=
                            self.heightPx -
                                data.signatureCoordinateY * self.heightPx &&
                        picLeftTopY <=
                            self.heightPx -
                                data.signatureCoordinateY * self.heightPx +
                                height;
                    if (bool == true && data.sealId != obj.sealId) {
                        // 只要有一个在需要盖章的位置就可以了    在签署范围内、章模id不相等、类型相等的情况下
                        if (obj.sealType == data.sealType) {
                            //位置与l类型ok
                            // self.compactFieldList[i].signatureMethod = data.signatureMethod;
                            // self.compactFieldList[i].signatureStartPage = data.signatureStartPage;
                            // self.compactFieldList[i].signatureEndPage = data.signatureEndPage;
                            flag = true;
                            type = true;
                            break;
                        } else {
                            //位置ok 类型错误
                            flag = true;
                            type = false;
                        }
                    }
                }
                if (!flag) {
                    return {
                        flag: false,
                        type: false,
                    };
                }
                if (flag && !type) {
                    return {
                        flag: true,
                        type: false,
                    };
                }
            }
            return {
                flag: true,
                type: true,
            };
        },
        filterSignNumFlag() {
            //所有移动签=》 单页签章（目前只支持这个） 开始位置ok 同合同id 即true
            let arr = JSON.parse(JSON.stringify(this.compactFieldList));
            let arrNull = [],
                arrSeal = [],
                self = this,
                rightSeal = 0;
            arr.map((ele) => {
                !ele.sealId ? arrNull.push(ele) : "";
                ele.sealId ? arrSeal.push(ele) : "";
            });
            let flag = false;
            let rightSealId = [];
            for (let key = 0; key < arrNull.length; key++) {
                let data = arrNull[key];
                flag = false;
                for (let i = 0; i < arrSeal.length; i++) {
                    let obj = arrSeal[i];

                    if (
                        obj.compactFileCode != data.compactFileCode ||
                        obj.signatureStartPage != data.signatureStartPage
                    ) {
                        continue;
                    }

                    let picLeftTopX = obj.signatureCoordinateX * self.widthPx; //章模左上角X轴
                    let picLeftTopY =
                        self.heightPx -
                        obj.signatureCoordinateY * self.heightPx; //章模左上角Y轴
                    let picRightDownX =
                        obj.signatureCoordinateX * self.widthPx + obj.width; //章模右下角X轴
                    let picRightDownY =
                        self.heightPx -
                        obj.signatureCoordinateY * self.heightPx +
                        obj.height; //章模右下角Y轴
                    let width = data.sealType == "02" ? 101 : 180;
                    let height = data.sealType == "02" ? 50 : 101;

                    //判断章模是否在签署范围内
                    let bool =
                        picRightDownX >=
                            data.signatureCoordinateX * self.widthPx &&
                        picLeftTopX <=
                            data.signatureCoordinateX * self.widthPx + width &&
                        picRightDownY >=
                            self.heightPx -
                                data.signatureCoordinateY * self.heightPx &&
                        picLeftTopY <=
                            self.heightPx -
                                data.signatureCoordinateY * self.heightPx +
                                height;

                    if (bool == true && data.sealId != obj.sealId) {
                        // 只要有一个在需要盖章的位置就可以了    在签署范围内、章模id不相等、类型相等的情况下
                        if (
                            obj.sealType == data.sealType &&
                            obj.signatureMethod != "02" &&
                            obj.signatureMethod != "03"
                        ) {
                            flag = true;
                            break;
                        } else {
                            flag = false;
                        }
                    }
                }
                if (!flag) {
                    return false;
                }
            }
            return flag;
        },
        remind() {
            this.remindSignTime({ compactId: this.compactId }).then((res) => {
                if (this.successCheckCode(res)) {
                    this.$message.success("提醒成功");
                }
                this.signNumDialog = false;
            });
        },
        deduction() {
            this.signNumDialog = false;
            let params = {
                accountId: JSON.parse($.cookie("userinfo")).accountId,
                compactFieldSignatureInfoList: this.signList,
                compactId: this.compactId,
                userId: JSON.parse($.cookie("userinfo")).userId,
                isCloudSignature: this.isCloudSignature,
                isKeySignature: this.isKeySignature,
                signPassword: "",
                targetUserId: JSON.parse($.cookie("userinfo")).userId,
            };
            console.log(JSON.stringify(params));

            // ukey签章位置集合
            let ukeySignList = params.compactFieldSignatureInfoList.filter(
                (item) => {
                    return (
                        item.signatureType == "01" || item.signatureType == "04"
                    );
                }
            );
            // ukey签章参数
            let ukeySignParams = Object.assign({}, params);
            ukeySignParams.compactFieldInfoList = ukeySignList;
            // 标记是否进行过ukey签章，传给后台
            if (!!ukeySignList.length) {
                this.isKeySignature = 1;
                ukeySignParams.isKeySignature = 1;
            }

            // 云签章位置集合 包括指定位置
            let cloudSignList = params.compactFieldSignatureInfoList.filter(
                (item) => {
                    return (
                        item.signatureType != "01" && item.signatureType != "04"
                    );
                }
            );
            // 云签章参数
            let cloudSignParams = Object.assign({}, params);
            // 标记是否进行过云签章，传给后台
            if (!!cloudSignList.length) {
                this.isCloudSignature = 1;
                cloudSignParams.isCloudSignature = 1;
            }
            cloudSignParams.compactFieldSignatureInfoList = cloudSignList;
            this.signParams = cloudSignParams;

            this.getSignNumber(this.signList, "03").then((res) => {
                if (res) {
                    this.$confirm(
                        "对不起，你的套餐已用完，请前往购买",
                        "提示",
                        {
                            confirmButtonText: "去购买套餐",
                            cancelButtonText: "取消",
                            type: "warning",
                            customClass: "self-icon icon-warning",
                        }
                    )
                        .then(() => {
                            this.$router.push({
                                path: "/setmeal",
                            });
                        })
                        .catch(() => {});
                } else {
                    // 如果有一个ukey签章  先进行ukey签章
                    if (!!ukeySignList.length) {
                        this.signParams.isKeySignature = 1;
                        this.ukeySign(ukeySignParams);
                        return;
                    }

                    this.signPswOpen = true;
                    //校验签署密码
                    // if (!this.isSignPassword) {
                    //     if (this.isMainAccount == 1) {
                    //         this.$confirm("为保障您的签署安全，请先去设置签署密码", "提示", {
                    //             confirmButtonText: "去设置",
                    //             cancelButtonText: "取消",
                    //             type: "warning",
                    //             customClass: "self-icon icon-warning",
                    //         }).then(() => {
                    //             this.$router.push({name: "accountmanager", query: {"safetyType": 2}})
                    //         }).catch(() => {
                    //         });
                    //     } else {
                    //         this.$confirm("请您先联系管理员（主账号）去设置签署密码", "提示", {
                    //             confirmButtonText: "确定",
                    //             showCancelButton: false,
                    //             type: "warning",
                    //         }).then(() => {
                    //         }).catch(() => {
                    //         });
                    //     }
                    // } else {
                    //     this.signPswOpen = true;
                    // }
                }
            });
        },
        getSignNumber(list, type) {
            //发起方签署次数不足
            let newList = list.filter((item) => {
                return item.signatureType != "01" && item.signatureType != "04";
            });
            let ukeyList = list.filter((item) => {
                return item.signatureType == "01" || item.signatureType == "04";
            });
            let needTimes = newList.length;
            if (!!ukeyList.length) {
                needTimes += 1;
            }
            var self = this;
            let operate;
            if (!!type) {
                operate = "03";
            } else {
                operate = this.editType == "01" ? "02" : "01";
            }
            return new Promise((resolve, reject) => {
                this.getSignNum({
                    compactId: this.compactId,
                    needTimes: needTimes,
                    operate: operate, //'01':发起签署查询 '02':查询发起人 '03':查询签署人
                    userId: JSON.parse($.cookie("userinfo")).currentUserId,
                })
                    .then((res) => {
                        if (this.successCheckCode(res)) {
                            resolve(res.data);
                        } else {
                            reject(false);
                            setTimeout(function () {
                                self.btnLoding = false;
                            }, 2000);
                        }
                    })
                    .fail((res) => {
                        reject(false);
                        setTimeout(function () {
                            self.btnLoding = false;
                        }, 2000);
                    });
            });
        },
        //判断签约次数是否足够
        getSignNumberFlag(list) {
            if (this.compactSignatoryList.length == 1) {
                return false;
            }
            let flag;
            let newList = list.filter((item) => {
                return item.signatureType != "01" && item.signatureType != "04";
            });
            this.getSignNum({
                compactId: this.compactId,
                needTimes: newList.length,
                operate: this.editType == "01" ? "02" : "01",
                userId: JSON.parse($.cookie("userinfo")).currentUserId,
            })
                .then((res) => {
                    if (this.successCheckCode(res)) {
                        flag = res.data; //ture  不足   false 足
                    } else {
                        setTimeout(function () {
                            self.btnLoding = false;
                        }, 2000);
                        flag = false;
                    }
                })
                .fail((res) => {
                    setTimeout(function () {
                        self.btnLoding = false;
                    }, 2000);
                    flag = false;
                });
            return flag;
        },
        // filteringData(compactFieldList) {
        //     let self = this;
        //     let arr = compactFieldList;
        //     let arrnew = JSON.parse(JSON.stringify(arr));
        //     let numbersealId = 0;
        //     self.rightNumber = 0;
        //     arr.map(function (data, index) {
        //         if (data.sealId == null || data.sealId == undefined || data.sealId == null) {
        //             arrnew.splice(index, 1);
        //         } else {
        //             self.positionContrast(data, arr.length, 101, 50, true);
        //             // 转换单位
        //             console.log(data);
        //             numbersealId++;
        //         }
        //         try {
        //             arrnew[index].signatoryId = JSON.parse($.cookie('userinfo')).userId;
        //         } catch (e) { }
        //     });
        //     if (self.rightNumber == 0) {
        //         self.$message({
        //             message: '签名不在签署位置范围内',
        //             type: 'warning',
        //             duration: 3000
        //         });
        //         self.warning = true;
        //     } else {
        //         self.warning = false;
        //     }
        //     arr = arrnew;
        //     return [arr, numbersealId];
        // },
        noSign() {
            if (this.isTemp) {
                return this.$router.push("/contractlist");
            }
            // 暂不签署 需要进行保存草稿
            this.disabled = true;
            if (this.compactFieldList && this.compactFieldList.length == 0) {
                this.$router.push({ path: "/contractlist" });
                return;
            }
            this.saveSign();
        },
        backlist() {
            // 签署 --- 暂不签署
            if (this.isTemp) {
                return this.$router.push("/contractlist");
            }
            history.go(-1);
        },
        saveSign(text) {
            let params = {
                compactFieldInfoList: this.compactFieldList,
                compactId: this.compactId, //  上个页面保存接口返回的compactId
            };
            this.contractTemporary(params)
                .then((res) => {
                    if (this.successCheckCode(res)) {
                        this.$message({
                            message: "草稿保存成功!",
                            type: "success",
                            duration: 3000,
                        });
                        this.$router.push({ path: "/contractlist" });
                    }
                    this.disabled = false;
                })
                .fail((res) => {
                    this.disabled = false;
                });
        },
        // 签署位置校验
        signPosition() {
            // isSignatoryField  -- 指定签署位置 0 不指定位置 1指定位置
            // isAuthentication -- 0 不需要认证  1 需要认证
            // isFirstSignatory  1 我需要签署  0 我不需要签署
            let self = this;
            var sealId = 0,
                signNumber = 0,
                nextCompact = {},
                alertMessage = "";
            // 如果是第一签署人  自己发起的合同&&自己需要签署  或  模板发起自己需要签署
            if (this.isFirstSignatory == 1 || (this.isTemp && this.signUser)) {
                let compactFieldListNew = this.compactFieldList.filter(
                    (ele) => !!ele.sealId
                );
                let hasSignTime = true;
                if (!this.getSignNumberFlag(compactFieldListNew)) {
                    //true 签约次数不足0.0
                    //isKeySignature为 1 说明签署了ukey
                    this.compactFieldList.map(function (data, index) {
                        if (data.sealId) {
                            // 拖动章的数量  data.sealId为null  表示为制定位置章
                            sealId++;
                        }
                    });
                    // 如果没有拖动签章或者sealId数为0
                    if (
                        (this.compactFieldList &&
                            this.compactFieldList.length == 0) ||
                        sealId == 0
                    ) {
                        this.$message({
                            message: "请您拖拽签名或印章到合同上",
                            type: "warning",
                            duration: 3000,
                        });
                        return;
                    }

                    // 所有合同文件都需签署  compactDocumentList
                    let allCompactsignFlage;
                    // 合同签署文件集合
                    let compactDocumentList = this.compactDocumentList.filter(
                        (item) => {
                            return item.compactDocumentType == "01";
                        }
                    );
                    //每份签署合同都需要签署--这个方法教研了一个合同对因一个签，不能保证合同多个签都签
                    console.log("zxpos");
                    if (
                        this.hasPoiSigns &&
                        this.allNoSignsCurrentDoc.length > 0
                    ) {
                        this.$message({
                            message: "请您把印章/签名拖动到对应的签署位置上",
                            type: "warning",
                            duration: 3000,
                        });
                        this.toNextPositionSign(); //去下一个未签署或者类型错误的标签
                        return;
                    }
                    compactDocumentList.some((item) => {
                        allCompactsignFlage = false;
                        compactFieldListNew.some((file) => {
                            if (
                                file.compactFileCode == item.compactDocumentId
                            ) {
                                allCompactsignFlage = true;
                                return true;
                            }
                        });
                        if (!allCompactsignFlage) {
                            nextCompact = item;
                            return true;
                        }
                    });

                    if (!allCompactsignFlage) {
                        if (this.allNoSigns.length > 0) {
                            alertMessage =
                                "请您把印章/签名拖动到对应的签署位置上";
                            this.toNextPositionSign();
                        } else {
                            alertMessage =
                                "请您为其他文件选择印章/签名进行签署";
                            this.contractInfo(
                                nextCompact.compactDocumentCode,
                                nextCompact.compactDocumentPage,
                                nextCompact.compactDocumentId,
                                nextCompact.compactDocumentType
                            );
                        }
                        this.$message({
                            message: alertMessage,
                            type: "warning",
                            duration: 3000,
                        });
                        return;
                    }
                    if (this.isTemp) {
                        let arr = this.compactFieldList.filter(
                            (ele) => !ele.sealId
                        ); //标记签署位置集合
                        //签署位置校验
                        if (!!arr.length) {
                            let positionResult = this.filterSignNum();
                            if (!positionResult.flag) {
                                this.$message({
                                    message:
                                        "请您把印章/签名拖动到对应的签署位置上",
                                    type: "warning",
                                    duration: 3000,
                                });
                            } else if (!positionResult.type) {
                                this.$message({
                                    message:
                                        "您的印章/签名和签署位置类型不匹配",
                                    type: "warning",
                                    duration: 3000,
                                });
                            }
                            if (!positionResult.flag || !positionResult.type) {
                                this.toNextPositionSign(); //去下一个未签署或者类型错误的标签
                                return;
                            }
                        }
                    }
                } else {
                    this.$confirm(
                        "对不起，你的套餐已用完，请前往购买",
                        "提示",
                        {
                            confirmButtonText: "去购买套餐",
                            cancelButtonText: "取消",
                            type: "warning",
                            customClass: "self-icon icon-warning",
                        }
                    )
                        .then(() => {
                            this.$router.push({
                                path: "/setmeal",
                            });
                        })
                        .catch(() => {});
                    return;
                }
            }
            // 如果需要标记签署位置
            if (this.isSignatoryField == 1) {
                this.compactFieldList.map(function (data, index) {
                    if (!data.sealId) {
                        signNumber++; //拖动的标记位置的数量
                    }
                });
                // 签署人的数量
                var length = this.compactSignatoryList.length;

                /*if (this.isKeySignature == 1) {
                            //isKeySignature为1说明签署了ukey
                            // length--;
                        }*/

                if (this.isFirstSignatory == 1) {
                    // 如果自己是签署人   无需标记   数量-1
                    length--;
                }
                //拖动的标记位置的数量与签署人的数量对比    （预定bug 拖动标记数  如果是同一个需签署人    无需++）
                if (signNumber < length) {
                    this.$message({
                        message: "您需要给所有签署人标记签署位置",
                        type: "warning",
                        duration: 3000,
                    });
                    return;
                }
            }
            // 实名认证判断  需要判断时判断
            let realNameAuthenticationFlag = JSON.parse($.cookie("userinfo"))
                .realNameAuthenticationFlag;
            if (
                this.isAuthentication == 0 &&
                realNameAuthenticationFlag == "0" &&
                this.isFirstSignatory == "1"
            ) {
                return this.$confirm(
                    "为保证安全和减少法律风险，您需实名认证后再进行签署。",
                    "风险提示",
                    {
                        type: "warning",
                        confirmButtonText: "去实名认证",
                        cancelButtonText: "取消",
                        customClass: "self-icon icon-safe",
                    }
                )
                    .then(() => {
                        this.$router.push("/companyauthen");
                    })
                    .catch(() => {});
            }

            /*// this.flag 最终签章位置校验结果  全局变量
                    if (!self.flag && self.editType == "01") {
                        return self.$message({
                            message: "签章/签名不在签署位置范围内",
                            type: "warning",
                            duration: 1000
                        });
                    }*/

            // 所有拖章位置+签署位置
            var list = JSON.parse(JSON.stringify(this.compactFieldList));
            // TODO shenzhen list...
            // list = [...this.shenzhenSealList];

            if (this.isTemp) {
                list = JSON.parse(
                    JSON.stringify(
                        this.compactFieldList.filter(
                            (v) => v.sealId || v.sealType == "05"
                        )
                    )
                );
            }
            //给拖章加上signatoryId
            this.compactSignatoryList.forEach((ele) => {
                list.forEach((v) => {
                    ele.userId == this.userinfo.userId && !v.signatoryId
                        ? (v.signatoryId = ele.compactSignatoryId)
                        : "";
                });
            });
            // 对签章坐标进行重新计算
            list.map((res) => {
                if (res.sealId || res.signTime) {
                    res.signatureCoordinateX =
                        (res.signatureCoordinateX * 778 + res.width / 2) / 778;
                    res.signatureCoordinateY =
                        (res.signatureCoordinateY * 1100 - res.height / 2) /
                        1100;
                } else {
                    res.signatureCoordinateY =
                        (res.signatureCoordinateY * 1100 - 29) / 1100;
                }
            });

            let params = {
                compactFieldInfoList: list,
                compactId: this.compactId,
                compactSponsorId: JSON.parse($.cookie("userinfo")).userId, // 合同发起人Id
                isFirstSignatory: this.isFirstSignatory, // 发起人是否是第一签署人（否：0；是：1）
                // "token": $.cookie('token'),
                accountId: JSON.parse($.cookie("userinfo")).accountId,
                isKeySignature: this.isKeySignature,
                isSignatoryCloudSignature: this.isSignatoryCloudSignature,
                signPassword: "",
                userId: this.userinfo.userId,
            };

            // 原合同平台和深圳市电子印章签署时需要不同参数
            let _curShenzhenSeal = this.checkIsShenzhenSealInCompactFieldList(
                this.compactFieldList
            );
            if (_curShenzhenSeal) {
                // ^ 深圳市电子印章
                params = Object.assign(params, {
                    // TODO  只有有深圳市电子印章签署时，这个值才是1，其他情况是0
                    isKeySignature: 1,
                    // TODO shenzhen `skipCheckSignPassword: '1'`
                    skipCheckSignPassword: "1",
                });
            }

            // console.log(JSON.stringify(params));

            //self.loadingTabel = true;
            // 发起人不需要签署
            if (
                this.isFirstSignatory == 0 &&
                this.editType != "01" &&
                !(this.isTemp && this.signUser)
            ) {
                this.signFromParams(params, "first");
            } else {
                // ukey签章位置集合
                let ukeySignList = params.compactFieldInfoList.filter(
                    (item) => {
                        return (
                            item.signatureType == "01" ||
                            item.signatureType == "04"
                        );
                    }
                );
                // ukey签章参数
                let ukeySignParams = Object.assign({}, params);
                ukeySignParams.compactFieldInfoList = ukeySignList;
                // 标记是否进行过ukey签章，传给后台
                if (!!ukeySignList.length) {
                    this.isKeySignature = 1;
                    ukeySignParams.isKeySignature = 1;
                }
                // 云签章位置集合 包括指定位置
                let cloudSignList = params.compactFieldInfoList.filter(
                    (item) => {
                        return (
                            item.signatureType != "01" &&
                            item.signatureType != "04"
                        );
                    }
                );
                // 云签章参数
                let cloudSignParams = Object.assign({}, params);
                // 标记是否进行过云签章，传给后台
                if (!!cloudSignList.length) {
                    this.isSignatoryCloudSignature = 1;
                    cloudSignParams.isSignatoryCloudSignature = 1;
                }
                // 待我签署  和发起签署接口不同，  传如签章list  入参名不同
                if (this.editType == "01") {
                    cloudSignParams.compactFieldSignatureInfoList = cloudSignList;
                    cloudSignParams.compactFieldInfoList = null;
                } else {
                    cloudSignParams.compactFieldInfoList = cloudSignList;
                }
                // 记录云签章+签署位置参数 在全局
                this.signParams = cloudSignParams;

                // 如果有一个ukey签章  先进行ukey签章
                if (!!ukeySignList.length) {
                    this.signParams.isKeySignature = 1;
                    this.ukeySign(ukeySignParams);
                    return;
                } else {
                    // TODO shenzhen 跳过密码弹窗

                    if (_curShenzhenSeal) {
                        // ^ shenzhen 跳过密码弹窗
                        if (this.editType == "01") {
                            this.signFromParams(this.signParams);
                        } else {
                            this.signFromParams(this.signParams, "first");
                        }
                    } else {
                        // ^ 正常弹窗
                        this.signPswOpen = true;
                    }
                }
            }
        },
        // 签署
        signFromParams(params, type, isFill) {
            // 暂时如此处理，等修改逻辑
            // 以下参数都是 深圳市电子印章需要的添加的参数
            // -------------------------
            // params.compactFieldInfoList[0] = Object.assign(
            //     params.compactFieldInfoList[0],
            //     {
            //         sealType: "07",
            //     }
            // );
            // ----------------------------------

            let self = this;
            this.btnLoding = true;
            this.loadingBtn = true;
            // type=='first' 表示是发起人发起的合同  调取接口名称不同
            if (type == "first") {
                // TODO shenzhen `/compact/signature/field`
                this.saveSignPosition(params)
                    .then((res) => {
                        if (this.successCheckCode(res)) {
                            let msg =
                                this.isFirstSignatory == 0 &&
                                this.editType != "01"
                                    ? "发起签约成功"
                                    : "签署成功";
                            isFill ? (msg = "发起签约成功") : ""; //是否模板发起其他人还未填写控件
                            this.$message({
                                message: msg,
                                type: "success",
                                duration: 3000,
                            });
                            this.$router.push({ path: "/contractlist" });
                        }
                        if (res.code === 2031 && res.msg === "签署密码错误") {
                            this.signPsw = "";
                            setTimeout(() => {
                                this.loadingBtn = false;
                            }, 500);
                        } else if (res.code === 20330) {
                            this.verifyCode = "";
                            setTimeout(() => {
                                this.loadingBtn = false;
                            }, 500);
                        } else {
                            if (this.signPswOpen) {
                                this.signPswCancel();
                            }
                        }
                        setTimeout(function () {
                            self.btnLoding = false;
                            self.loadingTabel = false;
                            self.loadingBtn = false;
                        }, 500);
                    })
                    .fail((res) => {
                        if (this.signPswOpen) {
                            this.signPswCancel();
                        }
                        this.btnLoding = false;
                        this.loadingTabel = false;
                        this.loadingBtn = false;
                    });
            } else {
                // TODO shenzhen `/compact/signature`
                this.signature(params)
                    .then((res) => {
                        console.log(res);

                        if (this.successCheckCode(res)) {
                            this.$message({
                                message: "签署成功",
                                type: "success",
                                duration: 3000,
                            });
                            this.$router.push({ path: "/contractlist" });
                        }
                        if (res.code === 2031 && res.msg === "签署密码错误") {
                            this.signPsw = "";
                            setTimeout(() => {
                                this.loadingBtn = false;
                            }, 500);
                        } else if (res.code === 20330) {
                            this.verifyCode = "";
                            setTimeout(() => {
                                this.loadingBtn = false;
                            }, 500);
                        } else {
                            if (this.signPswOpen) {
                                this.signPswCancel();
                            }
                        }
                        this.loadingBtn = false;
                        this.btnLoding = false;
                        this.loadingBtn = false;
                    })
                    .fail((res) => {
                        if (this.signPswOpen) {
                            this.signPswCancel();
                        }
                        this.loadingBtn = false;
                        this.btnLoding = false;
                        this.loadingBtn = false;
                    });
            }
        },
        //1 续费
        renew() {
            // 校验暂时没做
            // this.$message({
            //     dangerouslyUseHTMLString: true,
            //     message: "对不起，您的套餐已用完，请前往购买。<a href=''>去购买套餐</a>",
            //     type: "warning",
            //     duration: 1000
            // });
            this.sign();
        },
        // 2 是否签名
        sign() {
            // if (this.compactFieldList == 0) { // 这个条件要根据前面一步 是否指定位置签署  后台还没给这个参数
            //     this.$confirm('当前模板没有设置签署人签名位置，建议请先进行设置。', '友情提示', {
            //         confirmButtonText: '立即设置',
            //         cancelButtonText: '忽略',
            //     }).then(() => {
            //
            //     }).catch(() => {
            //         this.signCheck();
            //     });
            // } else {
            //     this.signCheck();
            // }
            this.signCheck();
        },
        //3 签署校验
        signCheck() {
            // 暂时不做校验
            /* let obj = {
                         inputPattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,})$/,
                         inputErrorMessage: '密码格式不正确',
                         confirmButtonText: '确定',
                         cancelButtonText: '取消',
                     }
                     this.$prompt('签署密码', '签署校验', obj).then(({value}) => {
                         obj.inputErrorMessage = "密码错误，剩余3次机会，用完将被冻结1小时"
                         this.signConfirm();
                     }).catch(() => {

                     });*/

            this.signConfirm();
        },
        // 发起签署信息确认
        signConfirm() {
            // this.confirm = true;
            this.signPosition();
        },
        childByValue(value) {
            this.confirm = value;
        },
        submit() {
            if (
                !this.signPage.signatureStartPage ||
                !this.signPage.signatureEndPage
            ) {
                return this.$message.warning("请输入签署页面范围");
            }
            if (
                Number(this.signPage.signatureStartPage) <= 0 ||
                Number(this.signPage.signatureEndPage) > Number(this.pageTotal)
            ) {
                return this.$message.warning("当前页数范围输入有误");
            }
            if (
                Number(this.signPage.signatureStartPage) >
                Number(this.signPage.signatureEndPage)
            ) {
                return this.$message.warning("开始页数不能大于结束页数");
            }
            if (
                Number(this.signPage.signatureStartPage) ==
                Number(this.signPage.signatureEndPage)
            ) {
                if (this.signatureMethod == "02") {
                    return this.$message.warning("签署页数须≥2页");
                } else if (this.signatureMethod == "03") {
                    return this.$message.warning("骑缝页数必须≥2");
                }
            }
            //this.index 当前新增移动签index
            this.compactFieldList[
                this.index
            ].signatureStartPage = this.signPage.signatureStartPage;
            this.compactFieldList[
                this.index
            ].signatureEndPage = this.signPage.signatureEndPage;

            if (this.signatureMethod == "03") {
                this.compactFieldList[this.index].signatureDirection = 1; //签章方向（0：表示左；1：表示右【默认值】；）骑缝签需要设值 ,

                if (
                    !this.signPage.ridingPage &&
                    this.signPage.ridingPage != 0
                ) {
                    return this.$message.warning("请输入每枚章覆盖页数");
                }
                if (this.signPage.ridingPage > Number(this.pageTotal)) {
                    return this.$message.warning(
                        "骑缝章每枚章覆盖页数不能超过总页数"
                    );
                }
                if (
                    this.signPage.ridingPage >
                    Number(
                        this.signPage.signatureEndPage -
                            this.signPage.signatureStartPage +
                            1
                    )
                ) {
                    return this.$message.warning(
                        "骑缝章每枚章覆盖页数不能超过签署页数"
                    );
                }
                if (this.signPage.ridingPage < 2) {
                    return this.$message.warning("骑缝章每枚章覆盖页数必须≥2");
                }
                this.compactFieldList[
                    this.index
                ].coverPageNum = this.signPage.ridingPage; //骑缝签时每枚章的覆盖页数
            }
            // this.compactFieldList[this.index].coverPageNum = 5; //骑缝签时每枚章的覆盖页数

            console.log(this.compactFieldList);
            var current = this.compactFieldList[this.index];

            // 除单页签，并且为ukey签名印章 ，进行ukey签署
            //signatureType 01：ukey印章，02：云签名，03：云印章，04：ukey签名
            /*if (
                        this.signatureMethod != "01" &&
                        current.sealId &&
                        (current.signatureType == "01" || current.signatureType == "04")
                    ) {
                        //签章
                        // this.ukeySignOperator(this.compactFieldList.length - 1);
                    } else {
                        this.dialogVisible = false;
                        setTimeout(() => {
                            this.signPage = {
                                signatureStartPage: 1,
                                signatureEndPage: this.pageTotal
                            };
                        }, 10);
                    }*/
            this.dialogVisible = false;
            setTimeout(() => {
                this.signPage = {
                    signatureStartPage: 1,
                    signatureEndPage: this.pageTotal,
                };
            }, 10);

            let arrNull = [],
                compactFieldList = this.compactFieldList;
            compactFieldList.map((ele) => {
                !ele.sealId ? arrNull.push(ele) : "";
            });
            if (
                arrNull.length > 0 &&
                this.editType == "01" &&
                !this.dialogVisible
            ) {
                //待我
                let positionFlag = this.positionContrast(
                    current,
                    this.compactFieldList.length - 1,
                    current.width,
                    current.height
                );
                if (positionFlag == "forbid") {
                    this.compactFieldList.splice(
                        this.compactFieldList.length - 1,
                        1
                    );
                }
            }
        },
        dialogClose() {
            $(this.tempClone).remove();
            this.loadingTabel = false;
            this.ukeySiging = false;
            this.compactFieldList.splice(this.index, 1);
            this.dialogVisible = false;
            this.signPage = {
                signatureStartPage: 1,
                signatureEndPage: this.pageTotal,
            };
        },
        // 设置多页、骑缝签的起始页数
        regSignPage(val) {
            setTimeout(() => {
                if (val == "start") {
                    this.signPage.signatureStartPage = this.signPage.signatureStartPage.replace(
                        /\D/g,
                        ""
                    );
                } else if (val == "end") {
                    this.signPage.signatureEndPage = this.signPage.signatureEndPage.replace(
                        /\D/g,
                        ""
                    );
                }
            }, 10);
        },
        routerTo(val) {
            this.$router.push(val);
        },
        // 签署次数不足提醒弹窗关闭事件
        signNumDialogClose() {
            this.btnLoding = false;
            this.signNumDialog = false;
        },
        // 读取ukey，获得ukey签名、ukey印章
        readUkey(type) {
            let data = {
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                esealPictureTypeEnum: "01", // 01：ukey印章(个人：ukey印章、ukey签名 集合)，02：云签名，03：云印章，04：ukey签名 ,05:印章集合，06：签名集合
                currPage: 1,
                pageSize: 1000,
                pictureCode: "",
            };
            let isPersonal = false;
            // 设置ukey
            let keyType = "";
            let pictureCode = "";
            let signCertificateSn = "";
            let sealDesc = "";
            let signatureName = ""; //名称
            let signatureWidth = ""; //宽度
            let signatureHeight = ""; //高度
            let signatureFilePath = ""; //图片地址
            let signatureType = ""; //高度
            if (this.checkUKeyNum()) {
                this.getCertInfoObjFn(0).then((res) => {
                    res = JSON.parse(res || {});
                    if (this.successUKeyCheckCode(res)) {
                        res.info.map((item) => {
                            if (item.item_type == 3) {
                                //签章图片code
                                pictureCode = item.item_info;
                                this.pictureCode = item.item_info;
                            }
                            if (item.item_type == 10) {
                                signCertificateSn = item.item_info;
                                this.signCertificateSn = item.item_info;
                            }
                            if (item.item_type == 27) {
                                //ca类型
                                keyType = item.item_info;
                            }
                            if (item.item_type == 19) {
                                //印章类型（判断三所是否是私章）
                                sealDesc = item.item_info;
                            }
                            if (item.item_type == 18) {
                                signatureName = item.item_info;
                            }
                            if (item.item_type == 21) {
                                signatureWidth = item.item_info;
                            }
                            if (item.item_type == 22) {
                                signatureHeight = item.item_info;
                            }
                            if (item.item_type == 20) {
                                signatureFilePath =
                                    "data:image/jpg;base64," + item.item_info;
                            }
                        });
                        console.log(signatureFilePath);
                        if (sealDesc == "电子私章" && keyType == "gass") {
                            return (isPersonal = true);
                        }

                        if (
                            keyType == "netca" ||
                            keyType == "gass" ||
                            keyType == "skf_kfx"
                        ) {
                            this.UkeyReadCheck = true; //需要读取校验
                        } else {
                            data.pictureCode = pictureCode;
                            this.esealcode = data.pictureCode;
                        }
                    }
                });
            } else {
                return this.$message.error("暂无印章数据，请插入UKEY进行读取");
            }
            if (isPersonal) {
                return this.$message.error(
                    "暂不支持个人三所电子印章，敬请期待"
                );
            }
            if (!!this.UkeyReadCheck) {
                return;
            }
            this.getSignSealFromUKey(
                this.esealcode,
                signatureFilePath,
                signatureWidth,
                signatureHeight
            );
        },
        isukeySealSignHadFilePath(list) {
            console.log(list);
            let isAllHadPath = list.some((item) => {
                return !!item.signatureFilePath;
            });
            console.log(isAllHadPath);
            if (!isAllHadPath && list.length > 0) {
                this.$message.error("章模读取出错了，请联系客服");
            }
        },
        getSignSealFromUKey(
            pictureCode,
            signatureFilePath,
            signatureWidth,
            signatureHeight
        ) {
            let data = {
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                esealPictureTypeEnum: "01", // 01：ukey印章(个人：ukey印章、ukey签名 集合)，02：云签名，03：云印章，04：ukey签名 ,05:印章集合，06：签名集合
                currPage: 1,
                pageSize: 1000,
                pictureCode: pictureCode,
            };
            if (this.autographType) {
                // 电子签名
                if (this.userType == "01") {
                    data.esealPictureTypeEnum = "04";
                    this.getSealSignListByRole(data).then((res) => {
                        if (this.successCheckCode(res)) {
                            this.ukeyReading = false;
                            console.log(res.data.records);
                            if (!res.data.records.length) {
                                this.ukeySignList = [];
                                // return this.$message.error('章模读取出错了，请联系客服');
                                return this.$message.error(
                                    "当前账户无此UKey签名，请重新核对印章信息"
                                );
                            }
                            res.data.records[0].signatureFilePath = signatureFilePath;
                            res.data.records[0].signatureWidth
                                ? ""
                                : (res.data.records[0].signatureWidth = signatureWidth);
                            res.data.records[0].signatureHeight
                                ? ""
                                : (res.data.records[0].signatureHeight = signatureHeight);
                            this.ukeySignList = res.data.records.filter(
                                (item) => {
                                    return item.signatureStatus == "01";
                                }
                            );
                            this.isukeySealSignHadFilePath(this.ukeySignList);
                            if (!this.ukeySignList.length) {
                                /*return this.$message.error(
                                            "您的印章未被激活，请先激活"
                                        );*/
                                // 存在未激活印章
                                this.$confirm(
                                    "您的印章未被激活，请先激活",
                                    "提示",
                                    {
                                        confirmButtonText: "去激活",
                                        cancelButtonText: "知道了",
                                        type: "warning",
                                        customClass: "self-icon icon-warning",
                                    }
                                )
                                    .then(() => {
                                        this.$router.push({
                                            path: "/ukeyactivate",
                                            query: {
                                                orderNo:
                                                    res.data.records[0].orderNo,
                                                sealType:
                                                    res.data.records[0]
                                                        .signatureType,
                                            },
                                        });
                                    })
                                    .catch(() => {});
                                return;
                            }
                            let that = this;
                            setTimeout(function () {
                                that.$nextTick(function () {
                                    let ukeySign = $("#ukeySign li");
                                    ukeySign.map(function (index, el) {
                                        if (index < ukeySign.length) {
                                            that.cloneMove(el);
                                        }
                                    });
                                });
                            }, 100);
                        } else {
                            this.ukeyReading = false;
                        }
                    });
                } else {
                    this.getPersonSealSignList(data).then((res) => {
                        if (this.successCheckCode(res)) {
                            this.ukeyReading = false;
                            let list = res.data.records;
                            if (!list.length) {
                                this.ukeySignList = [];
                                // return this.$message.error('章模读取出错了，请联系客服');
                                return this.$message.error(
                                    "当前账户无此UKey签名，请重新核对印章信息"
                                );
                            }
                            list[0].signatureFilePath = signatureFilePath;
                            list[0].signatureWidth
                                ? ""
                                : (list[0].signatureWidth = signatureWidth);
                            list[0].signatureHeight
                                ? ""
                                : (list[0].signatureHeight = signatureHeight);
                            this.ukeySignList = list.filter((item) => {
                                return item.esealStatus == "01";
                            });
                            this.isukeySealSignHadFilePath(this.ukeySignList);
                            if (!this.ukeySignList.length) {
                                // 存在未激活印章
                                this.$confirm(
                                    "您的印章未被激活，请先激活",
                                    "提示",
                                    {
                                        confirmButtonText: "去激活",
                                        cancelButtonText: "知道了",
                                        type: "warning",
                                        customClass: "self-icon icon-warning",
                                    }
                                )
                                    .then(() => {
                                        this.$router.push({
                                            path: "/ukeyactivate",
                                            query: {
                                                orderNo:
                                                    res.data.records[0].orderNo,
                                                sealType:
                                                    res.data.records[0]
                                                        .signatureType,
                                            },
                                        });
                                    })
                                    .catch(() => {});
                                return;
                            }
                            let that = this;
                            setTimeout(function () {
                                that.$nextTick(function () {
                                    let ukeySign = $("#ukeySign li");
                                    ukeySign.map(function (index, el) {
                                        if (index < ukeySign.length) {
                                            // $(el).find('img').error(function () {
                                            //     that.$message.error('网络错误，请稍后再次读取!');
                                            // })
                                            that.cloneMove(el);
                                        }
                                    });
                                });
                            }, 100);
                        } else {
                            this.ukeyReading = false;
                        }
                    });
                }
            } else {
                // 电子印章
                // data.esealPictureTypeEnum = '01'
                if (this.userType == "01") {
                    this.getSealSignListByRole(data).then((res) => {
                        if (this.successCheckCode(res)) {
                            this.ukeyReading = false;
                            // console.log(res.data.records, "records");
                            if (!res.data.records.length) {
                                this.ukeySealList = [];
                                // return this.$message.error('章模读取出错了，请联系客服');
                                return this.$message.error(
                                    "当前账户无此UKey印章，请重新核对印章信息"
                                );
                            }
                            res.data.records[0].signatureFilePath = signatureFilePath;
                            res.data.records[0].signatureWidth
                                ? ""
                                : (res.data.records[0].signatureWidth = signatureWidth);
                            res.data.records[0].signatureHeight
                                ? ""
                                : (res.data.records[0].signatureHeight = signatureHeight);
                            this.ukeySealList = res.data.records.filter(
                                (item) => {
                                    return item.esealStatus == "01";
                                }
                            );
                            this.isukeySealSignHadFilePath(this.ukeySealList);
                            if (!this.ukeySealList.length) {
                                // 存在未激活印章
                                this.$confirm(
                                    "您的印章未被激活，请先激活",
                                    "提示",
                                    {
                                        confirmButtonText: "去激活",
                                        cancelButtonText: "知道了",
                                        type: "warning",
                                        customClass: "self-icon icon-warning",
                                    }
                                )
                                    .then(() => {
                                        this.$router.push({
                                            path: "/ukeyactivate",
                                            query: {
                                                orderNo:
                                                    res.data.records[0].orderNo,
                                                sealType:
                                                    res.data.records[0]
                                                        .signatureType,
                                            },
                                        });
                                    })
                                    .catch(() => {});
                                return;
                            }
                            let that = this;
                            setTimeout(function () {
                                that.$nextTick(function () {
                                    let ukeySeal = $("#ukeySeal li");
                                    ukeySeal.map(function (index, el) {
                                        if (index < ukeySeal.length) {
                                            // console.log($(el).find('img'));
                                            // $(el).find('img').error(function () {
                                            //     console.log("zzzzzz");
                                            //     that.$message.error('网络错误，请稍后再次读取!');
                                            // })
                                            that.cloneMove(el); //绑定移动事件
                                        }
                                    });
                                });
                            }, 100);
                        } else {
                            this.ukeyReading = false;
                        }
                    });
                } else {
                    // 个人现无印章，可注释以下代码
                    this.getPersonSealSignList(data).then((res) => {
                        if (this.successCheckCode(res)) {
                            this.ukeyReading = false;
                            console.log(res.data.records);
                            let list = res.data.records;
                            if (!list) {
                                this.ukeySealList = [];
                                // return this.$message.error('章模读取出错了，请联系客服');
                                return this.$message.error(
                                    "当前账户无此UKey印章，请重新核对印章信息"
                                );
                            }
                            this.ukeySealList = list;
                            let that = this;
                            setTimeout(function () {
                                that.$nextTick(function () {
                                    let ukeySeal = $("#ukeySeal li");
                                    ukeySeal.map(function (index, el) {
                                        if (index < ukeySeal.length) {
                                            that.cloneMove(el);
                                        }
                                    });
                                });
                            }, 100);
                        } else {
                            this.ukeyReading = false;
                        }
                    });
                }
            }
        },
        // ukey驱动版本校验
        checkUkeyVer(callback, type) {
            this.getUKeyVersion().then((res) => {
                if (this.successUKeyCheckCode(res)) {
                    res = JSON.parse(res);
                    let ver = res.version;
                    this.checkUKeyVersion(ver).then((res) => {
                        if (this.successCheckCode(res)) {
                            if (!!res.data.isNewest) {
                                // 待修改回 !!
                                callback(type); //
                            } else {
                                this.$updateUKeyDrive();
                            }
                        }
                    });
                }
            });
        },
        //查询插入ukey数目
        checkUKeyNum() {
            let flag = false;
            // 查询插入ukey数目
            this.getAllUKeyList().then((datas) => {
                const res = JSON.parse(datas || {});
                if (this.successUKeyCheckCode(res)) {
                    if (!res.keyList.length) {
                        flag = false;
                    } else {
                        this.pin = "";
                        this.ukeyList = res.keyList;
                        if (this.ukeyList.length > 0) {
                            //默认选中第一个
                            this.ukeychoice = 0;
                        } else {
                            this.ukeychoice = "";
                        }
                        flag = true;
                    }
                }
            });
            return flag;
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
        },
        // 模板签署
        async signTemp() {
            if (this.signUser) {
                //需要填写模板控件
                let isAllFilled = "",
                    sponsorUserId = "",
                    isCurrentSign = ""; //模板是否都已填充控件
                await this.getFillFieldInfo(this.compactId).then((res) => {
                    if (this.successCheckCode(res)) {
                        isAllFilled = !!res.data.allUserFillFieldFlag;
                        sponsorUserId = res.data.sponsorUserId;
                        isCurrentSign = !!res.data.currentUserSignFlag;
                    }
                });
                if (
                    sponsorUserId == this.userinfo.userId &&
                    (!isAllFilled || !isCurrentSign)
                ) {
                    //模板发起人发起模板签署，此时有其他未填写控件用户
                    // this.signPswOpen = true;
                    let params = {
                        compactFieldInfoList: [],
                        compactId: this.compactId,
                        compactSponsorId: JSON.parse($.cookie("userinfo"))
                            .userId, // 合同发起人Id
                        isFirstSignatory: this.isFirstSignatory, // 发起人是否是第一签署人（否：0；是：1）
                        // "token": $.cookie('token'),
                        accountId: JSON.parse($.cookie("userinfo")).accountId,
                        isKeySignature: this.isKeySignature,
                        isSignatoryCloudSignature: this
                            .isSignatoryCloudSignature,
                        signPassword: "",
                        userId: this.userinfo.userId,
                        skipCheckSignPassword: "1", //模板发起合同无需密码
                    };
                    this.signFromParams(params, "first", true);
                    return false;
                } else if (!isAllFilled) {
                    //模板控件本人已填写，还有未填写用户
                    this.$confirm(
                        "您已完成合同内容填写，请提醒其他签署人完成内容填写后方可进入签署流程",
                        {
                            type: "warning",
                            title: "提示",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                        }
                    ).then((res) => {
                        this.$router.push("/contractlist");
                    });
                    return false;
                }
            }
            if (this.$route.query.editType && !this.isCurrentSign) {
                this.$message.success("合同内容已填写完成，请按顺序来签署");
                this.$router.push("/contractlist");
                return false;
            }
            if (this.$route.query.editType) {
                this.signInfo();
            } else {
                this.sureSign();
            }
        },
        getIsShowSignTime() {
            this.getFillFieldInfo(this.compactId).then((res) => {
                if (this.successCheckCode(res)) {
                    this.isShowSignTime = !!res.data.allUserFillFieldFlag;
                    this.isCurrentSign = !!res.data.currentUserSignFlag;
                }
            });
        },
        changeTab(val) {
            this.dialogTab = val;
            this.signParams.signSms = this.verifyCode = "";
            this.signParams.signPassword = this.signPsw = "";
            if (val == 0 && !this.isSignPassword) {
            }
        },
        async getUserInfo() {
            let data = "";
            if (JSON.parse($.cookie("userinfo")).userType == "02") {
                await this.personDetail().then((res) => {
                    if (this.successCheckCode(res)) {
                        this.phoneNum = res.data.phone;
                        data = res.data;
                    }
                });
            } else {
                await this.enterpriseDetail().then((res) => {
                    if (this.successCheckCode(res)) {
                        this.phoneNum = res.data.linkManPhone;
                        data = res.data;
                    }
                });
            }
            if (!this.isShowSignTime) {
                return false;
            }
            // 获取服务器当前时间 并生成图片
            this.nowDate = data.nowDate;
            this.$nextTick(() => {
                let dragDom = document.getElementById("timeMask");
                // let canvasDom = document.getElementById('signTime');
                let canvas = document.createElement("div");
                canvas.className = "signTime";
                canvas.innerHTML = this.nowDate;
                document.getElementById("scroll").appendChild(canvas);
                this.cloneMove(dragDom);
                html2canvas(canvas, { backgroundColor: null }).then(
                    (canvas) => {
                        this.signTimeSrc = canvas.toDataURL("image/png");
                        // console.log(this.signTimeSrc,55)
                    }
                );
            });
        },
        getSMS() {
            if (!this.phoneNum) {
                return this.$message.error("账号异常，请联系管理员");
            }
            if (this.countdown != 0) {
                return false;
            }
            this.getSignSms({
                phone: this.phoneNum,
                useType: "21",
            }).then((res) => {
                if (this.successCheckCode(res)) {
                    this.$message.success("验证码发送成功");
                    this.countdown = 120;
                    this.timer = setInterval(() => {
                        --this.countdown;
                        if (this.countdown <= 0) {
                            clearInterval(this.timer);
                        }
                    }, 1000);
                }
            });
        },
        setSignPsd() {
            this.signPswOpen = false;
            this.isShowSetSignPwd = true;
            // this.$router.push({ name: 'accountmanager', query: { safetyType: 2 } });
        },
        guideTo() {
            ++this.guideLead;
        },
        //计算当前合同中的所有标签各种状态的集合
        calcAllStatusSign() {
            if (this.hasPoiSigns) {
                //继签或模板签（this.editType == '01' || this.isTemp）
                let compactDocumentId = this.compactFileCode; //当前合同id
                let poiSigns = [], //当前合同位置标签s
                    mySigns = [], //当前合同移动签
                    currentPage = this.pageNumber, //当前页index
                    allNoSignsCurrentDoc = [], //当前合同所有未签署标签
                    allNoSigns = [], //整个合同所有未签署标签
                    currentPagePoiSigns = [], //当前页的标签
                    currentPagePoiHadSigns = [], //当前页的已签名的标签
                    currentPagePoiNoSigns = []; //当前页的未签名的标签
                // if(!((editType == '01'||isTemp) && !data.sealId)){

                // }
                currentPagePoiSigns = this.compactFieldList.filter((c) => {
                    return (
                        compactDocumentId == c.compactFileCode &&
                        currentPage == c.signatureStartPage &&
                        !c.sealId
                    );
                });
                currentPagePoiHadSigns = currentPagePoiSigns.filter((n) => {
                    return n.indexPoi;
                });
                currentPagePoiNoSigns = currentPagePoiSigns.filter((n) => {
                    return !n.indexPoi;
                });
                allNoSignsCurrentDoc = this.compactFieldList.filter((c) => {
                    return (
                        compactDocumentId == c.compactFileCode &&
                        !c.indexPoi &&
                        !c.sealId &&
                        c.sealType != "05"
                    );
                });
                allNoSigns = this.compactFieldList.filter((c) => {
                    return !c.indexPoi && !c.sealId;
                });

                //对当前合同、所有合同未放置印章或签名指定位置排序
                let sortAllNoSignsCurrentDoc = [],
                    sortAllNoSigns = [];
                this.compactDocumentList.forEach((item) => {
                    let currentArr = [],
                        allArr = [];
                    allNoSignsCurrentDoc.forEach((k) => {
                        if (item.compactDocumentId == k.compactFileCode) {
                            currentArr.push(k);
                        }
                    });
                    allNoSigns.forEach((v) => {
                        if (item.compactDocumentId == v.compactFileCode) {
                            allArr.push(v);
                        }
                    });
                    currentArr.sort(
                        (a, b) => a.signatureStartPage - b.signatureStartPage
                    );
                    allArr.sort(
                        (a, b) => a.signatureStartPage - b.signatureStartPage
                    );
                    sortAllNoSignsCurrentDoc.push(...currentArr);
                    sortAllNoSigns.push(...allArr);
                });
                console.log(sortAllNoSignsCurrentDoc, sortAllNoSigns);

                this.currentPagePoiSigns = currentPagePoiSigns;
                this.currentPagePoiHadSigns = currentPagePoiHadSigns;
                this.allNoSignsCurrentDoc = sortAllNoSignsCurrentDoc; //allNoSignsCurrentDoc;
                this.allNoSigns = sortAllNoSigns; //allNoSigns;
                this.currentPagePoiNoSigns = currentPagePoiNoSigns;
                this.signMarkArr = sortAllNoSigns.slice(0, 2);
            }
        },
        toNextPositionSign() {
            let nextSign = null, //当前合同下一个位置标签
                nextPageOrNot = false, //下个标签在当前页还是其他页
                nextSignPage = -1, //下一个标签的pageNumber
                nextDoc = null; //下一份合同
            // this.calcAllStatusSign();*-+
            //当前合同是否有未签署
            if (this.allNoSignsCurrentDoc.length > 0) {
                if (this.currentPagePoiNoSigns.length == 0) {
                    //当前页面都签完移动到下一个页面
                    nextSign = this.allNoSignsCurrentDoc[0];
                    nextSignPage = nextSign.signatureStartPage;
                    this.pageNumber = --nextSignPage; //loadMore加了1 为了抵消
                    console.log("请您把印章/签名拖动到对应的签署位置上！");
                    this.loadMore();
                } else {
                    //还在当前页有未签署
                    console.log("还在当前页", this.allNoSignsCurrentDoc);
                }
            } else {
                if (this.allNoSigns.length > 0) {
                    nextSign = this.allNoSigns[0];
                    nextDoc = this.compactDocumentList.filter((dItem) => {
                        return (
                            dItem.compactDocumentId === nextSign.compactFileCode
                        ); //连个接口变量声明不统一0.0
                    });
                    console.log("nextDoc", nextDoc[0]);
                    console.log("nextSign", nextSign);
                    if (nextDoc[0]) {
                        this.contractInfo(
                            nextDoc[0].compactDocumentCode,
                            nextDoc[0].compactDocumentPage,
                            nextDoc[0].compactDocumentId,
                            nextDoc[0].compactDocumentType,
                            nextSign.signatureStartPage
                        );
                    }
                } else {
                    console.log("全部签署完成:", this.allNoSigns);
                }
            }
        },
        // 设置标签(poiSign)与移动签(mySign)1v1匹配 //id唯一自定义 用于 标签与移动签的绑定
        bindPoiAndMySignById(poiSign, mySign, id) {
            poiSign.indexPoi = mySign.indexPoi = id;
        },
        unbindPoiAndMySignById(mySign) {
            if (mySign.indexPoi) {
                this.compactFieldList.map((item) => {
                    if (mySign.indexPoi === item.indexPoi) {
                        item.indexPoi = mySign.indexPoi = "";
                        delete item.hasPoxSign;
                    }
                });
            }
        },
        //移动签时当前页面是否全部签完
        // currentPageIsAllOverSign() {

        // },
        //实名认证
        realNameAuthenticationFn() {
            let realNameAuthenticationFlag = JSON.parse($.cookie("userinfo"))
                .realNameAuthenticationFlag;
            if (
                this.isAuthentication == 0 &&
                realNameAuthenticationFlag == "0" &&
                (this.isFirstSignatory == "1" ||
                    typeof this.isFirstSignatory == "undefined")
            ) {
                this.$confirm(
                    "为保证安全和减少法律风险，您需实名认证后再进行签署。",
                    "风险提示",
                    {
                        type: "warning",
                        confirmButtonText: "去实名认证",
                        cancelButtonText: "取消",
                        customClass: "self-icon icon-safe",
                    }
                )
                    .then(() => {
                        if (this.userType == "01") {
                            this.$router.push("/companyauthen");
                        } else {
                            this.$router.push({ path: "/personauthen" });
                        }
                    })
                    .catch(() => {
                        let theEvent = event || window.event;
                        let target = theEvent.target || theEvent.srcElement;
                        let el = target.tagName.toLowerCase();
                        if (el == "span" || el == "button") {
                            this.$router.push("/contractlist");
                        }
                    });
                return false;
            } else {
                return true;
            }
        },
        errorImage() {
            this.$message.error("章模读取出错了，请联系客服");
        },
        async imgLoadError() {
            console.log("tupian jaizai chu cuole");
            await this.getTemplateInfo();
            this.detailData();
        },
    },
    // beforeUpdate() {
    //     let self = this;
    //     if (this.fileList.length) {
    //         // 每次页面有更新，校验图片能否加载，以此检查该合同再打开之后是否被别人签署过
    //         $.ajax(this.fileList[0].imgUrl)
    //             .then(async (res) => {
    //                 if (res.code && res.code === 3404) {
    //                     // this.$router.go(0);
    //                     self.updateTimer && clearTimeout(self.updateTimer);
    //                     self.updateTimer = setTimeout(async () => {
    //                     }, 3000);
    //                     // let trigger =  this.delayFn(async function(){
    //                     // },1000);
    //                     // trigger();
    //                 }
    //             })
    //             .fail((err) => {
    //                 console.log(err);
    //             });
    //     }
    // }
};
</script>

<style lang="scss">
@import "./contractsignature/scss/style.scss";
.wrapper-iframe {
    .el-dialog.el-dialog--small {
        width: 870px;
        height: 720px;
    }
}
.wrapper-qrcode {
    .el-dialog.el-dialog--small {
        width: 400px;
        height: 400px;
    }
    #qrcode {
        margin: 20px;
        img {
            margin: 0 auto;
        }
    }
    .tips{
        width: 298px;
        margin: 0 auto;
        text-align: center;
        font-size: 12px;
        line-height: 20px;
    }
}
.wrapper-shenzhentip {
    .el-dialog.el-dialog--small {
        width: 460px;
        // height: 260px;
    }

    .shenzhentip {
        margin: 20px;
        line-height: 26px;

        span {
            color: #993333;
        }
    }
}
.wrapper-shenzhenguide {
    .el-dialog.el-dialog--small {
        width: 660px;
        // height: 260px;
    }

    .wrapper-shenzhenguide--inner {
        margin: 20px;

        .shenzhenguide {
            margin: 20px;
            line-height: 26px;

            // > div:first-child {
            //     color: #993333;
            //     margin-bottom: 20px;
            //     // font-weight: 700;
            // }
        }

        .form-of-type2 {
            margin: 20px;

            .el-form-item {
                margin-bottom: 0;
            }

            .tips__form-type2 {
                color: #911;
                margin-top: 16px;
            }
        }
    }
}
</style>
<style scoped lang="scss">
@import "./contractsignature/scss/style-scoped.scss";
</style>
