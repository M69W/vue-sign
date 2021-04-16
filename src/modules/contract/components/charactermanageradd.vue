<template>
    <div class="contactmanageradd">
        <div class="top-title">
            <div class="titinfo">角色创建</div>
        </div>
        <div class="form-content">
            <el-form class="search clearfix" label-position="left">
                <div class="form-title cl">
                    <div class="title">角色名称</div>
                    <div class="input-content">
                        <el-input placeholder="请输入角色名称" :maxlength="20" v-model="roleName"></el-input>
                    </div>
                </div>
                <div class="top-content">
                    <div class="content-header cl">
                        <div class="content-header-l">合同平台操作权限设置</div>
                        <div class="content-header-r">
                            <el-checkbox v-model="checkedAllComp" @change="checkedAllCompChange">全选</el-checkbox>
                        </div>
                    </div>
                    <div class="top-content-content">
                        <!--<el-checkbox-group v-model="checkedListOut">-->
                        <div
                            class="top-content-item"
                            v-for="item in menuTypeList"
                            :key="item.menuType"
                        >
                            <div class="top-content-item-out cl">
                                <div class="top-content-item-out-title">
                                    <div class="checkbox-box">
                                        <label>
                                            <input type="checkbox" :value="item">
                                            {{item}}
                                            <span class="checkbox-label"></span>
                                        </label>
                                        <!--<el-checkbox :label="item">{{item}}</el-checkbox>-->
                                    </div>
                                </div>
                                <!--<el-checkbox-group v-model="checkedListMiddle">-->
                                <div
                                    class="top-content-item-middle cl"
                                    v-for="item2 in menuSecendTypeListObj"
                                    v-if="item2.parent==item"
                                >
                                    <template v-show="item2.parent==item">
                                        <div class="top-content-item-middle-title">
                                            <div class="checkbox-box">
                                                <label>
                                                    <input type="checkbox" :value="item2.name">
                                                    {{item2.name}}
                                                    <span class="checkbox-label"></span>
                                                </label>
                                                <!--<el-checkbox :label="item2.name">{{item2.name}}</el-checkbox>-->
                                            </div>
                                        </div>
                                        <div class="top-content-item-in cl">
                                            <!--<el-checkbox-group v-model="checkedList">-->
                                            <div
                                                class="top-content-item-in-title"
                                                v-for="item3 in roleList"
                                                v-if="item3.menuType==item&&item3.menuSecendType==item2.name"
                                            >
                                                <div class="checkbox-box">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            :value="item3.menuUri"
                                                        >
                                                        {{item3.menuName}}
                                                        <span
                                                            class="checkbox-label"
                                                        ></span>
                                                    </label>
                                                    <!--<el-checkbox :label="item3.menuUri">{{item3.menuName}}-->
                                                    <!--</el-checkbox>-->
                                                </div>
                                            </div>
                                            <!--</el-checkbox-group>-->
                                        </div>
                                    </template>
                                </div>
                                <!--</el-checkbox-group>-->
                            </div>
                        </div>
                        <!--</el-checkbox-group>-->
                    </div>
                </div>
                <div class="bottom-content">
                    <div class="content-header cl">
                        <div class="content-header-l">数据访问权限设置</div>
                        <div class="content-header-r">
                            <el-checkbox
                                v-model="checkedAllDataPermission"
                                @change="checkedAllDataPermissionChange"
                            >全选</el-checkbox>
                        </div>
                    </div>
                    <div class="tab-header">
                        <div
                            class="tab-header-l"
                            :class="{'active':tabActive==0}"
                            @click="tabActive=0"
                        >电子印章</div>
                        <div
                            class="tab-header-r"
                            :class="{'active':tabActive==1}"
                            @click="tabActive=1"
                        >电子合同</div>
                    </div>
                    <p class="tips" v-show="tabActive==1">按照组织结构来设置合同权限</p>
                    <div class="tab-content-box">
                        <div class="tab-content" v-show="tabActive==0">
                            <div class="tab-content-seal cl">
                                <div class="tab-content-seal-l">
                                    <p :class="{'active':sealType==0}" @click="sealType=0">我的印章</p>
                                    <p :class="{'active':sealType==1}" @click="sealType=1">我的签名</p>
                                </div>
                                <div class="tab-content-seal-r">
                                    <div class="tab-content-seal-r-seal" v-show="sealType==0">
                                        <el-table
                                            ref="sealTable"
                                            :data="tableSealData"
                                            style="width: 100%"
                                            stripe
                                            tooltip-effect="light"
                                            v-loading="loadingTabel"
                                            header-row-class-name="checkAll"
                                            @selection-change="handleMySealPermissionSelectionChange"
                                        >
                                            <el-table-column
                                                :resizable="false"
                                                type="selection"
                                                width="50"
                                                align="center"
                                            ></el-table-column>
                                            <el-table-column
                                                :resizable="false"
                                                prop="signatureName"
                                                label="名称"
                                                show-overflow-tooltip
                                            ></el-table-column>
                                            <el-table-column
                                                :resizable="false"
                                                prop="signatureTypeDesc"
                                                label="类型"
                                                show-overflow-tooltip
                                            ></el-table-column>
                                        </el-table>
                                    </div>
                                    <div class="tab-content-seal-r-com" v-show="sealType==1">
                                        <el-table
                                            ref="signTable"
                                            :data="tableSignData"
                                            style="width: 100%"
                                            stripe
                                            tooltip-effect="light"
                                            v-loading="loadingTabel"
                                            header-row-class-name="checkAll"
                                            @selection-change="handleMySignPermissionSelectionChange"
                                        >
                                            <el-table-column type="selection" width="50" align="center"></el-table-column>
                                            <el-table-column
                                                :resizable="false"
                                                prop="signatureName"
                                                label="名称"
                                                show-overflow-tooltip
                                            ></el-table-column>
                                            <el-table-column
                                                :resizable="false"
                                                prop="signatureTypeDesc"
                                                label="类型"
                                                show-overflow-tooltip
                                            ></el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-content tree" v-show="tabActive==1">
                            <el-tree
                                ref="compTree"
                                node-key="orgId"
                                :check-strictly="true"
                                :setCheckedNodes="computedListChecked"
                                :default-checked-keys="defaultComputedList"
                                show-checkbox
                                :default-expand-all="true"
                                :expand-on-click-node="false"
                                icon-class="comp-arr"
                                :data="computedList"
                                :props="defaultProps"
                            ></el-tree>
                        </div>
                        <div class="tab-bottom">
                            <p>数据查看说明</p>
                            <p>1、根据角色来配置，电子印章数据的查看范围；</p>
                            <p>2、电子合同数据查看范围是根据企业组织结构来进行设置，每份合同对应的组织结构是按照创建人的组织结构来划分；</p>
                        </div>
                    </div>
                </div>
                <div class="bottom-btn">
                    <el-button @click="$router.go(-1)">返回</el-button>
                    <el-button @click="save" type="primary">保存</el-button>
                    <!--                    <span @click="$router.go(-1)" class="el-button&#45;&#45;default">返回</span>-->
                    <!--                    <span @click="save" class="el-button&#45;&#45;default">保存</span>-->
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import base from "../mixin/base";
import service from "../../../assets/mixin/service";

export default {
    mixins: [base, service],
    components: {},
    data() {
        return {
            show: false,
            roleId: "",
            checkedAllDataPermission: false, //数据访问权限全选
            checkedAllComp: false, //合同平台权限全选
            roleName: "",
            oldRoleName: "",
            menuTypeList: [],
            menuSecendTypeList: [],
            menuSecendTypeListObj: [],
            checkedSignList: [],
            computedList: [],
            defaultProps: {
                children: "list",
                label: "orgName"
            },
            roleList: [
                {
                    menuType: "合同管理",
                    menuSecendType: "合同操作",
                    menuUri: "发起签约",
                    menuName: "发起签约"
                },
                {
                    menuType: "合同管理",
                    menuSecendType: "合同操作",
                    menuUri: "下载合同",
                    menuName: "下载合同"
                },
                {
                    menuType: "印章管理",
                    menuSecendType: "我的签名",
                    menuUri: "添加云签名",
                    menuName: "添加云签名"
                },
                {
                    menuType: "印章管理",
                    menuSecendType: "我的签名",
                    menuUri: "删除云签名",
                    menuName: "删除云签名"
                },
                {
                    menuType: "印章管理",
                    menuSecendType: "电子印章",
                    menuUri: "添加云印章",
                    menuName: "添加云印章"
                },
                {
                    menuType: "印章管理",
                    menuSecendType: "电子印章",
                    menuUri: "删除云印章",
                    menuName: "删除云印章"
                }
            ],
            roleListDsc: [],
            checkedListOut: [],
            checkedListMiddle: [],
            checkedList: [],
            tabActive: 0,
            sealType: 0,
            orgId: "",
            tableSealData: [],
            tableSignData: [],
            mySignPermissionList: [], //签名权限列表
            mySealPermissionList: [], //印章权限列表
            defaultComputedList: [], //默认选中组织列
            computedListChecked: [], //选中组织列,
            mainOrgId: "",
            allOrgIdList: [],
            isEdit: ""
        };
    },
    created() {
        if (this.$route.query.roleId) {
            this.roleId = this.$route.query.roleId;
            this.roleName = this.$route.query.roleName;
            this.oldRoleName = this.$route.query.roleName;
        }
    },
    computed: {
        levelMapping() {
            let o = {};
            this.safetyLevel.map(ele => {
                o[ele.value] = ele.label;
            });
            return o;
        }
    },
    watch: {},
    mounted() {
        this.isEdit = this.$route.query.isEdit;
        this.getInfo();
        this.getSealList(1, 100);
        this.getSignList(1, 100);
        this.getComList();
    },
    methods: {
        open() {
            this.show = true;
        },
        close() {
            this.show = false;
        },
        getSealList() {
            this.tableSealData = [];
            // "01", "ukey印章"、"02", "云签名"、"03", "云印章"、"04", "ukey签名"、05：印章集合、06：签名集合
            let data = {
                esealPictureTypeEnum: "05",
                currPage: "1",
                pageSize: "100",
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
            };
            let data2 = {
                esealPictureTypeEnum: "01",
                currPage: "1",
                pageSize: "100",
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
            };
            this.getSealSignList(data).then(res => {
                if (this.successCheckCode(res)) {
                    this.tableSealData = this.tableSealData.concat(
                        res.data.records
                    );
                    if (this.roleId) {
                        this.getRoleSealPermission("seal");
                    }
                }
            });
            // this.getSealSignList(data2).then(res => {
            //     if (this.successCheckCode(res)) {
            //         this.tableSealData = this.tableSealData.concat(res.data.records);
            //     }
            // })
        },
        getSignList() {
            this.tableSignData = [];
            // "01", "ukey印章"、"02", "云签名"、"03", "云印章"、"04", "ukey签名"、05：印章集合、06：签名集合
            let data = {
                esealPictureTypeEnum: "06",
                currPage: "1",
                pageSize: "100",
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
            };
            // let data2 = {
            //     esealPictureTypeEnum: '04',
            //     currPage: '1',
            //     pageSize: '100',
            //     enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
            // }
            this.getSealSignList(data).then(res => {
                if (this.successCheckCode(res)) {
                    this.tableSignData = this.tableSignData.concat(
                        res.data.records
                    );
                    if (this.roleId) {
                        this.getRoleSealPermission("sign");
                    }
                }
            });
            // this.getSealSignList(data2).then(res => {
            //     if (this.successCheckCode(res)) {
            //         this.tableSignData = this.tableSignData.concat(res.data.records);
            //     }
            // })
        },
        getComList() {
            let data = {
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
                // enterpriseId:"12212",
            };
            this.findOrgInfoByParentId(data).then(res => {
                if (this.successCheckCode(res)) {
                    let arr = [];
                    arr.push(res.data);
                    this.computedList = arr;
                    this.mainOrgId = arr[0].orgId;

                    if (this.roleId) {
                        this.getRoleOrgPermission();
                    }

                    let arrList = [];
                    function allOrgIdList(arr) {
                        if (arr.length) {
                            arr.map(item => {
                                if (item.orgId) {
                                    arrList.push(item.orgId);
                                }
                                if (item.list.length) {
                                    allOrgIdList(item.list);
                                }
                            });
                        }
                    }
                    allOrgIdList(arr);
                    console.log(arrList);
                    this.allOrgIdList = arrList;
                }
            });
        },
        getRolePermission() {
            let data = {
                // roleId:'535461475053993984',
                // enterpriseId:"12356",
                roleId: this.roleId,
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
            };
            this.permissionRoleSet(data).then(res => {
                if (this.successCheckCode(res)) {
                    let arr = res.data;
                    this.$nextTick(() => {
                        let show = false;
                        if (
                            jQuery(
                                '.top-content-item-in input[type="checkbox"]'
                            ).length
                        ) {
                            jQuery(
                                '.top-content-item-in input[type="checkbox"]'
                            ).each(function(i, e) {
                                if (arr.includes(jQuery(e).val())) {
                                    jQuery(e)
                                        .prop("checked", true)
                                        .change();
                                }
                            });
                            return;
                        }
                        //防止获取不到jq元素，轮询渲染
                        let intervalRender = setInterval(function() {
                            if (
                                jQuery(
                                    '.top-content-item-in input[type="checkbox"]'
                                ).length &&
                                !show
                            ) {
                                jQuery(
                                    '.top-content-item-in input[type="checkbox"]'
                                ).each(function(i, e) {
                                    if (arr.includes(jQuery(e).val())) {
                                        jQuery(e)
                                            .prop("checked", true)
                                            .change();
                                    }
                                });
                                show = true;
                            } else if (show) {
                                clearInterval(intervalRender);
                            } else {
                                return;
                            }
                        }, 200);
                    });
                }
            });
        },
        getRoleSealPermission(type) {
            let data = {
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                roleId: this.roleId
            };
            this.getSealRoleSetByRole(data).then(res => {
                if (this.successCheckCode(res)) {
                    let checkedSeal = [];
                    let checkedSign = [];
                    if (type == "seal") {
                        this.tableSealData.map(item => {
                            if (res.data.includes(item.pictureCode)) {
                                checkedSeal.push(item);
                            }
                        });
                        this.toggleSelection("seal", checkedSeal);
                    } else {
                        this.tableSignData.map(item => {
                            if (res.data.includes(item.pictureCode)) {
                                checkedSign.push(item);
                            }
                        });
                        this.toggleSelection("sign", checkedSign);
                    }
                }
            });
        },
        getRoleOrgPermission() {
            let data = {
                // roleId:'535461475053993984',
                // enterpriseId:"12356",
                roleId: this.roleId,
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
            };
            this.permissionOrgRoleSet(data).then(res => {
                if (this.successCheckCode(res)) {
                    let arr = res.data;
                    this.defaultComputedList = arr.map(item => {
                        return item.orgId;
                    });
                    this.$refs.compTree.setCheckedKeys(
                        this.defaultComputedList
                    );
                }
            });
        },
        saveForm() {
            if (this.index == -1) {
                //添加
                this.addUser({
                    contactsName: this.formData.contactsName,
                    contactsWay: this.formData.contactsWay,
                    remark: this.formData.remark
                }).then(res => {
                    if (this.successCheckCode(res)) {
                        this.$message({
                            type: "success",
                            message: "添加联系人成功"
                        });
                        this.dialogModel = false;
                        this.cancelForm("formTab");
                        this.getListData();
                    }
                });
            } else {
                // 修改
                this.editUser({
                    contactsName: this.formData.contactsName,
                    contactsWay: this.formData.contactsWay,
                    id: this.formData.id,
                    remark: this.formData.remark
                }).then(res => {
                    if (this.successCheckCode(res)) {
                        this.$message({
                            type: "success",
                            message: "修改联系人成功"
                        });
                        this.dialogModel = false;
                        this.cancelForm("formTab");
                        this.getListData();
                    }
                });
            }
        },
        mathHeight() {
            // 高度计算
            jQuery(".top-content-item").each(function(index, element) {
                let that = $(element);
                that.find(".top-content-item-middle").each(function(i, e) {
                    let thatm = $(e);
                    thatm.find(".top-content-item-in").each(function(iin, ein) {
                        let thatin = $(ein);
                        let height = thatin.outerHeight() + "px";
                        // console.log(height);
                        thatin.siblings(".top-content-item-middle-title").css({
                            height: height,
                            "line-height": height
                        });
                    });
                });
            });
            jQuery(".top-content-item").each(function(index, element) {
                let that = $(element);
                let total = 0;
                that.find(".top-content-item-middle").each(function(i, e) {
                    let thatm = $(e);
                    let height = thatm.outerHeight();
                    total += height;
                });
                total += "px";
                that.find(".top-content-item-out-title").css({
                    height: total,
                    "line-height": total
                });
            });
            // jQuery('.checkbox-box input[type="checkbox"]').prop('checked',true)
            // 一级控制
            jQuery('.top-content-item-out-title input[type="checkbox"]').on(
                "change",
                function() {
                    let changeStatus = jQuery(this).prop("checked");
                    // console.log(changeStatus);
                    jQuery(this)
                        .parents(".top-content-item-out-title")
                        .siblings(".top-content-item-middle")
                        .find('input[type="checkbox"]')
                        .prop("checked", changeStatus);
                }
            );
            // 二级控制
            jQuery('.top-content-item-middle-title input[type="checkbox"]').on(
                "change",
                function() {
                    let changeStatus = jQuery(this).prop("checked");
                    // console.log(changeStatus);
                    jQuery(this)
                        .parents(".top-content-item-middle-title")
                        .siblings(".top-content-item-in")
                        .find('input[type="checkbox"]')
                        .prop("checked", changeStatus);

                    if (!changeStatus) {
                        jQuery(this)
                            .parents(".top-content-item-middle")
                            .siblings(".top-content-item-out-title")
                            .find('input[type="checkbox"]')
                            .prop("checked", false);
                    } else {
                        let parentCheck = true;
                        jQuery(this)
                            .parents(".top-content-item-middle")
                            .siblings(".top-content-item-middle")
                            .find(".top-content-item-middle-title")
                            .find('input[type="checkbox"]')
                            .each(function(i, e) {
                                if (!jQuery(e).prop("checked")) {
                                    parentCheck = false;
                                }
                            });
                        jQuery(this)
                            .parents(".top-content-item-middle")
                            .siblings(".top-content-item-out-title")
                            .find('input[type="checkbox"]')
                            .prop("checked", parentCheck);
                    }
                }
            );
            // 三级控制
            jQuery('.top-content-item-in input[type="checkbox"]').on(
                "change",
                function() {
                    let changeStatus = jQuery(this).prop("checked");
                    if (!changeStatus) {
                        // 控制二级
                        jQuery(this)
                            .parents(".top-content-item-in")
                            .siblings(".top-content-item-middle-title")
                            .find('input[type="checkbox"]')
                            .prop("checked", false);
                        // 控制一级
                        jQuery(this)
                            .parents(".top-content-item-middle")
                            .siblings(".top-content-item-out-title")
                            .find('input[type="checkbox"]')
                            .prop("checked", false);
                    } else {
                        // 控制二级
                        let parentCheck = true;
                        jQuery(this)
                            .parents(".top-content-item-in-title")
                            .siblings(".top-content-item-in-title")
                            .find('input[type="checkbox"]')
                            .each(function(i, e) {
                                if (!jQuery(e).prop("checked")) {
                                    parentCheck = false;
                                }
                            });
                        jQuery(this)
                            .parents(".top-content-item-in")
                            .siblings(".top-content-item-middle-title")
                            .find('input[type="checkbox"]')
                            .prop("checked", parentCheck);

                        // 控制一级
                        let fatherCheck = true;
                        jQuery(this)
                            .parents(".top-content-item-out")
                            .find(".top-content-item-middle")
                            .find(".top-content-item-middle-title")
                            .find('input[type="checkbox"]')
                            .each(function(j, k) {
                                if (!jQuery(k).prop("checked")) {
                                    fatherCheck = false;
                                }
                            });
                        jQuery(this)
                            .parents(".top-content-item-middle")
                            .siblings(".top-content-item-out-title")
                            .find('input[type="checkbox"]')
                            .prop("checked", fatherCheck);
                    }
                }
            );
        },
        getInfo() {
            // this.renderCheckboxHtml(this.roleList);
            this.getUserRoleMenuInfos({}).then(res => {
                if (res.code == 0) {
                    let data = res.data;
                    this.roleList = data;
                    this.renderCheckboxHtml(data);
                    if (this.roleId) {
                        this.getRolePermission();
                    }
                }
            });
        },
        renderCheckboxHtml(data) {
            let roleListDsc = [];
            let menuSecendTypeList = [];
            let menuTypeList = [];

            let menuSecendTypeListObj = [];
            data.map(item => {
                // debugger
                roleListDsc.push(item.menuUri);

                var menuArr = [];
                var menuSecendArr = [];
                // 主菜单
                if (!menuTypeList.includes(item.menuType)) {
                    menuTypeList.push(item.menuType);
                }
                // 二级菜单
                if (!menuSecendTypeList.includes(item.menuSecendType)) {
                    menuSecendTypeList.push(item.menuSecendType);
                    menuSecendArr.push(item);
                    menuSecendTypeListObj.push({
                        name: item.menuSecendType,
                        parent: item.menuType,
                        list: menuSecendArr
                    });
                } else {
                    menuSecendTypeListObj.map((ele, i) => {
                        if (ele.name == item.menuSecendType) {
                            // debugger
                            menuSecendTypeListObj[i].list.push(item);
                        }
                    });
                }
            });
            this.menuTypeList = menuTypeList;
            this.menuSecendTypeList = menuSecendTypeList;
            this.menuSecendTypeListObj = menuSecendTypeListObj;

            // console.log(menuSecendTypeListObj);

            this.roleListDsc = roleListDsc;
            this.$nextTick(() => {
                this.mathHeight();
            });
        },
        handleMySignPermissionSelectionChange(val) {
            this.mySignPermissionList = val;
        },
        handleMySealPermissionSelectionChange(val) {
            this.mySealPermissionList = val;
        },
        // 合同权限全选
        checkedAllCompChange() {
            let flag = this.checkedAllComp;
            jQuery(".top-content-item-out-title")
                .find('input[type="checkbox"]')
                .prop("checked", flag)
                .change();
        },
        // 数据访问权限全选
        checkedAllDataPermissionChange() {
            let flag = this.checkedAllDataPermission;
            if (flag) {
                // this.mySignPermissionList = this.tableSignData;
                // this.mySealPermissionList = this.tableSealData;
                this.$refs.sealTable.clearSelection();
                this.$refs.signTable.clearSelection();
                this.tableSealData.forEach(row => {
                    this.$refs.sealTable.toggleRowSelection(row);
                });
                this.tableSignData.forEach(row => {
                    this.$refs.signTable.toggleRowSelection(row);
                });

                this.$refs.compTree.setCheckedKeys(this.allOrgIdList);
            } else {
                // this.mySignPermissionList = [];
                // this.mySealPermissionList = [];
                this.$refs.sealTable.clearSelection();
                this.$refs.signTable.clearSelection();
                this.$refs.compTree.setCheckedKeys([]);
            }
        },
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
        },
        toggleSelection(type, rows) {
            if (type == "seal") {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.sealTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.sealTable.clearSelection();
                }
            } else {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.signTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.signTable.clearSelection();
                }
            }
        },
        save() {
            if (this.roleName.trim() == "") {
                this.$message.error("请输入角色名称");
                return;
            }
            // 菜单权限
            let manu = "";
            jQuery(".top-content-item-in")
                .find('input[type="checkbox"]:checked')
                .each(function(i, e) {
                    if (jQuery(e).val()) {
                        manu += jQuery(e).val() + ",";
                    }
                });
            if (manu == "") {
                this.$message.error("请先勾选权限后再提交");
                return;
            }
            if (this.roleId) {
                // this.saveContinue(this.roleId);
                let name = {
                    enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                    id: this.roleId,
                    roleName: this.roleName
                };
                if (this.oldRoleName == this.roleName) {
                    this.saveContinue(this.roleId);
                } else {
                    this.updateUserRole(name).then(res => {
                        if (this.successCheckCode(res)) {
                            this.saveContinue(this.roleId);
                        }
                    });
                }
                return;
            }
            let data = {
                roleName: this.roleName,
                enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId
                // enterpriseId:12356
            };
            this.addUserRole(data).then(res => {
                if (this.successCheckCode(res)) {
                    this.saveContinue(res.data);
                }
            });
        },
        saveContinue(datas) {
            this.$nextTick(() => {
                let arr = this.$refs.compTree.getCheckedNodes();
                this.orgId = arr.map(item => {
                    return item.orgId;
                });
                this.orgId = this.orgId.join(",");

                // 菜单权限
                let manu = "";
                let successText = "创建成功";
                if (this.roleId) {
                    successText = "修改成功";
                }
                jQuery(".top-content-item-in")
                    .find('input[type="checkbox"]:checked')
                    .each(function(i, e) {
                        if (jQuery(e).val()) {
                            manu += jQuery(e).val() + ",";
                        }
                    });
                manu = manu.substring(0, manu.length - 1);

                // 印章签名权限
                let sealIds = "";
                this.mySealPermissionList.map(item => {
                    sealIds += item.pictureCode + ",";
                });
                this.mySignPermissionList.map(item => {
                    sealIds += item.pictureCode + ",";
                });
                sealIds = sealIds.substring(0, sealIds.length - 1);

                // 组织结构权限
                let orgIds = this.$refs.compTree.getCheckedKeys();
                let orgIdsStr = "";
                orgIds.map(item => {
                    orgIdsStr += item + ",";
                });
                orgIdsStr = orgIdsStr.substring(0, orgIdsStr.length - 1);

                let data = {
                    roleId: datas,
                    // enterpriseId:'12356',
                    enterpriseId: JSON.parse($.cookie("userinfo")).enterpriseId,
                    sealIds: sealIds,
                    menuUris: manu,
                    orgIds: orgIdsStr || this.orgId
                };

                if (this.isEdit == "1") {
                    this.updateRoleSealOrgMenuRelationship(data).then(res => {
                        if (this.successCheckCode(res)) {
                            this.$message.success(successText);
                            this.$router.go(-1);
                        }
                    });
                } else {
                    this.addRoleSealOrgMenuRelationship(data).then(res => {
                        if (this.successCheckCode(res)) {
                            this.$message.success(successText);
                            this.$router.go(-1);
                        }
                    });
                }
            });
        }
    }
};
</script>
<style scoped lang="scss">
.contactmanageradd {
    .top-title {
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        color: #333;
        border-bottom: 1px solid #e8ecef;
    }

    .form-content {
        .form-title {
            padding: 30px 0;

            .title {
                display: inline-block;
                float: left;
                height: 36px;
                line-height: 36px;
                font-size: 14px;
                color: #626262;
                padding-right: 20px;
            }

            .input-content {
                width: 320px;
                float: left;
            }
        }

        .content-header {
            border-bottom: 1px solid #eee;
            height: 40px;
            padding: 0 20px;
            line-height: 40px;
            background-color: #e8ecef;

            .content-header-l {
                float: left;
                color: #333;
                font-size: 16px;
            }

            .content-header-r {
                float: right;
            }
        }

        .top-content {
            border: 1px solid #eee;

            .top-content-content {
                .top-content-item {
                    border-bottom: 1px solid #ceced2;

                    &:last-of-type {
                        border-bottom: none;
                    }

                    .top-content-item-out {
                        &:last-child {
                            border: none;
                        }

                        .top-content-item-out-title {
                            float: left;
                            height: 40px;
                            line-height: 40px;
                            width: 120px;
                            text-align: center;
                            border-right: 1px solid #eee;
                            background-color: #f4f6f8;
                        }

                        .top-content-item-middle {
                            width: 810px;
                            float: left;
                            border-bottom: 1px solid #eee;

                            &:last-child {
                                border-bottom: none;
                            }

                            .top-content-item-middle-title {
                                padding-left: 14px;
                                float: left;
                                height: 40px;
                                line-height: 40px;
                                width: 112px;
                                border-right: 1px solid #eee;

                                &:last-of-type {
                                    border: none;
                                }
                            }

                            .top-content-item-in {
                                float: left;
                                width: 698px;

                                .top-content-item-in-title {
                                    padding-left: 14px;
                                    width: 130px;
                                    display: inline-block;
                                    height: 40px;
                                    line-height: 40px;
                                }
                            }
                        }
                    }
                }

                .checkbox-box {
                    label {
                        position: relative;
                        cursor: pointer;
                        /*padding-left: 4px;*/
                        input {
                            opacity: 0;
                            /*outline: 0;
                                position: absolute;
                                margin: 0;
                                width: 0;
                                height: 0;
                                left: -999px;*/
                        }

                        input + .checkbox-label {
                            position: absolute;
                            width: 16px;
                            height: 16px;
                            border: 1px solid #ccc;
                            border-radius: 2px;
                            background-color: #fff;
                            top: 2px;
                            left: 0;
                        }

                        input:checked + .checkbox-label {
                            background-color: #02adff;
                            border-color: #02adff;

                            &:after {
                                content: "\2714";
                                position: absolute;
                                width: 14px;
                                height: 14px;
                                line-height: 14px;
                                text-align: center;
                                top: 0;
                                left: 0;
                                color: #fff;
                            }
                        }
                    }
                }
            }
        }

        .bottom-content {
            margin-top: 30px;
            border: 1px solid #eee;
            position: relative;

            .tab-header {
                margin: 6px auto;
                width: 402px;
                height: 36px;
                border-radius: 18px;
                overflow: hidden;
                border: 1px solid #ceced2;

                p {
                    color: #999;
                    font-size: 14px;
                }

                .tab-header-l,
                .tab-header-r {
                    float: left;
                    width: 200px;
                    height: 36px;
                    line-height: 36px;
                    color: #626262;
                    background-color: #fff;
                    font-size: 14px;
                    text-align: center;
                    cursor: pointer;
                }

                .tab-header-l.active,
                .tab-header-r.active {
                    background-color: #02adff;
                    color: #fff;
                }
            }

            .tips {
                position: absolute;
                font-size: 14px;
                color: #999;
                right: 20px;
                top: 54px;
            }

            .tab-content-box {
                .tab-content {
                    border-top: 1px solid #eee;
                    border-bottom: 1px solid #eee;
                    /*height: 632px;*/
                    &.tree {
                        padding: 20px;
                    }

                    .tab-content-seal {
                        height: 632px;
                        /*overflow-y: scroll;*/
                        .tab-content-seal-l {
                            float: left;
                            width: 122px;
                            height: 632px;
                            padding: 20px 0;
                            border-right: 1px solid #eee;
                            p {
                                padding: 10px 20px;
                                font-size: 14px;
                                color: #626262;
                                cursor: pointer;

                                &.active {
                                    color: #02adff;
                                }
                            }
                        }

                        .tab-content-seal-r {
                            width: 810px;
                            float: left;
                            padding: 20px;
                            height: 632px;
                            overflow-y: scroll;
                        }
                    }
                }

                .tab-bottom {
                    padding: 10px 20px;

                    p {
                        color: #3f3f3f;
                        font-size: 12px;
                        line-height: 30px;

                        &:first-of-type {
                            color: #626262;
                            font-size: 14px;
                        }
                    }
                }
            }
        }

        .bottom-btn {
            padding: 30px 0;
            text-align: center;
            button {
                width: 100px;
            }
            span {
                display: inline-block;
                border: 1px solid #c0ccda;
                border-radius: 4px;
                background-color: #fff;
                font-size: 14px;
                color: #626262;
                width: 100px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                cursor: pointer;

                &:last-of-type {
                    color: #fff;
                    background-color: #02adff;
                    border-color: #02adff;
                    margin-left: 16px;
                }
            }
        }
    }
}
</style>
<style lang="scss">
/*.contactmanageradd .form-content .top-content .top-content-content .top-content-item .top-content-item-out .top-content-item-middle .top-content-item-in .top-content-item-in-title {
        .el-checkbox {
            color: #626262;
        }
    }

    .contactmanageradd .form-content .top-content {
        .el-checkbox__inner {
            border-radius: 2px;
            width: 16px;
            height: 16px;
        }

        .el-checkbox__label {
            padding-left: 8px;
        }

        .el-checkbox__input {
            !*zoom: .9;*!
        }
    }*/

/*自定义tree样式*/
.contactmanageradd {
    .el-tree {
        border: none;
    }

    .el-tree-node__expand-icon {
        zoom: 0.9;
        border-left-color: #ccc;

        &.is-leaf {
            border-color: transparent;
            cursor: default;
        }
    }

    .el-tree-node__content {
        position: relative;

        .el-dropdown {
            position: absolute;
            right: 10px;
            top: 11px;
            width: 14px;
            height: 14px;
        }
    }

    .el-tree-node__content:hover {
        i.self-tree-item-more {
            opacity: 1;
        }
    }

    .el-tree-node.is-current {
        > .el-tree-node__content {
            span {
                color: #02adff;
            }
        }
    }

    .el-tree-node__content:hover {
        color: #02adff;
        background-color: #fff;
    }
}
</style>
