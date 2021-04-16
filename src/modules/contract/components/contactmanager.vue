<template>
    <div class="contactmanager">
        <div class="top-title clearfix">
            <div class="titinfo">联系人管理</div>
            <div class="titbtn">
                <el-button type="primary" @click="add">添加联系人</el-button>
            </div>
        </div>
        <div class="list">
            <el-form class="search clearfix" label-position="left">
                <el-form-item>
                    <el-input placeholder="请输入个人姓名或企业名称" class="border-gray" v-model="searchForm.contactsName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="请输入手机号码/邮箱" class="border-gray" v-model="searchForm.contactsWay"></el-input>
                </el-form-item>
                <el-button class="searchbtn" @click="search">查询</el-button>
            </el-form>
            <el-table
                :data="tableData"
                style="width: 100%"
                stripe
                tooltip-effect="light"
                v-loading="loadingTabel"
            >
                <el-table-column
                    :resizable="false"
                    prop="contactsName"
                    label="姓名/企业名称"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    :resizable="false"
                    prop="contactsWay"
                    label="手机号码/邮箱"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column :resizable="false" prop="safetyLevel" label="安全等级">
                    <template slot-scope="scope">{{levelMapping[scope.row.safetyLevel]}}</template>
                </el-table-column>
                <el-table-column :resizable="false" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
                <el-table-column :resizable="false" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="edit(scope.$index)">修改</el-button>
                        <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" v-if="total > pageSize">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentpage"
                    :page-size="pageSize"
                    :total="total"
                    layout="total, prev, pager, next"
                ></el-pagination>
            </div>
        </div>
        <el-dialog :visible.sync="dialogModel" :before-close="dialogClose" class="dialog" top="24%">
            <div class="dialogTitle">
                <span class="el-dialog__title">{{dialogTitle}}</span>
            </div>
            <div class="dialog-body">
                <el-form
                    :model="formData"
                    :rules="rules"
                    ref="formTab"
                    label-width="110px"
                    label-position="right"
                >
                    <el-form-item label="手机号码/邮箱" prop="contactsWay">
                        <el-input
                            v-model="formData.contactsWay"
                            placeholder="请输入手机号码/邮箱"
                            @blur="getUserInfo"
                        ></el-input>
                        <span v-if="isShow" class="userInfo">{{'已注册用户：'+userInfo}}</span>
                    </el-form-item>
                    <el-form-item label="姓名/企业名称" prop="contactsName">
                        <el-input v-model="formData.contactsName" placeholder="请输入个人姓名或企业名称"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button @click="dialogClose">取 消</el-button>
                <el-button type="primary" @click="submit_Form('formTab')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import base from "../mixin/base";
import service from "../../../assets/mixin/service";
export default {
    mixins: [base, service],
    components: {},
    data() {
        var validateWay = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("请输入手机号码/邮箱"));
            } else if (
                !/^1[3-9][0-9]{9}$/.test(value) &&
                !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
                    value
                )
            ) {
                return callback(new Error("请输入正确的手机号和邮箱"));
            }
            callback();
        };
        return {
            searchForm: {},
            tableData: [],
            dialogModel: false,
            dialogTitle: "添加联系人",
            index: -1,
            formData: {},
            rules: {
                contactsName: [
                    {
                        required: true,
                        message: "请输入个人姓名或企业名称",
                        trigger: "blur"
                    }
                ],
                contactsWay: [{ validator: validateWay, trigger: "blur" }]
            },
            userInfo: "",
            isShow: false,
            safetyLevel: [
                {
                    value: "01",
                    label: "安全"
                },
                {
                    value: "02",
                    label: "有风险"
                }
            ]
        };
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
        this.getListData();
    },
    methods: {
        getListData() {
            this.loadingTabel = true;
            this.userList(this.pageNum, this.pageSize, {
                contactsName: this.searchForm.contactsName,
                contactsWay: this.searchForm.contactsWay
            })
                .then(res => {
                    if (this.successCheckCode(res)) {
                        this.tableData = res.data.records;
                        this.total = res.data.total;
                        this.currentpage = res.data.current;
                    }
                    setTimeout(() => {
                        this.loadingTabel = false;
                    }, 200);
                })
                .fail(res => {
                    this.loadingTabel = false;
                });
        },
        submit_Form(ref) {
            this.$refs[ref].validate(valid => {
                if (valid) {
                    this.saveForm();
                } else {
                    return false;
                }
            });
        },
        add() {
            this.checkPermission(
                // 权限校验
                this.$perMap.userCenter.contact.addUser.url,
                this.$perMap.userCenter.contact.addUser.method
            ).then(res => {
                if (!this.successCheckCode(res)) {
                    return;
                }

                this.dialogModel = true;
                this.index = -1;
                this.dialogTitle = "添加联系人";
            });
        },
        dialogClose() {
            this.cancelForm("formTab");
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
        cancelForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogModel = false;
            this.formData = {};
            this.isShow = false;
            this.userInfo = "";
        },
        edit(index) {
            this.checkPermission(
                // 权限校验
                this.$perMap.userCenter.contact.editUser.url,
                this.$perMap.userCenter.contact.editUser.method
            ).then(res => {
                if (!this.successCheckCode(res)) {
                    return;
                }
                this.dialogModel = true;
                this.index = index;
                this.dialogTitle = "修改联系人";
                this.formData = JSON.parse(
                    JSON.stringify(this.tableData[index])
                );
            });
        },
        del(val) {
            this.checkPermission(
                // 权限校验
                this.$perMap.userCenter.contact.delUser.url,
                this.$perMap.userCenter.contact.delUser.method
            ).then(res => {
                if (!this.successCheckCode(res)) {
                    return;
                }
                this.$confirm("您确认要删除当前联系人？", "删除联系人", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    customClass:"icon-delete self-icon",
                })
                    .then(() => {
                        this.delUser(val).then(res => {
                            if (this.successCheckCode(res)) {
                                this.$message({
                                    type: "success",
                                    message: "删除联系人成功"
                                });
                                this.getListData();
                            }
                        });
                    })
                    .catch(() => {});
            });
        },
        search() {
            this.pageNum = 1;
            this.getListData();
        },
        getUserInfo() {
            if (
                /^1[3-9][0-9]{9}$/.test(this.formData.contactsWay) ||
                /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
                    this.formData.contactsWay
                )
            ) {
                this.getUser({
                    phoneOrEmail: this.formData.contactsWay
                })
                    .then(res => {
                        if (res.code == 0) {
                            if (res.data && res.data.name) {
                                this.isShow = true;
                                this.userInfo = this.format(
                                    res.data.name,
                                    res.data.userType
                                );
                            } else {
                                this.isShow = false;
                                this.userInfo = "";
                            }
                        }
                    })
                    .fail(res => {
                        this.isShow = false;
                        this.userInfo = "";
                    });
            }
        },
        format(val, type) {
            if (type == "01") {
                return val.substr(0, 3) + Array(val.length - 2).join("*");
            } else {
                return val.substr(0, 1) + Array(val.length).join("*");
            }
        }
    }
};
</script>
<style lang="scss">
.delete-user {
    width: 380px;
    .el-button--primary:focus {
        background: #4ca1f4;
        border-color: #4ca1f4;
    }
}
.delete-user .el-message-box__message p {
    font-size: 16px;
}
.contactmanager {
    .top-title {
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #e8ecef;
        // margin-bottom: 25px;
        .titinfo {
            float: left;
            font-size: 18px;
            color: #333333;
        }
        .titbtn {
            float: right;
            .el-button {
                width: 120px;
                height: 36px;
            }
        }
    }
    .list {
        .search {
            padding: 20px 0;
            .el-form-item {
                float: left;
                line-height: 36px;
                margin-right: 50px;
                margin-bottom: 0;
                width: 40%;
                .el-input__inner {
                    background: none;
                }
            }
            .searchbtn {
                float: right;
                width: 80px;
                // border-color: #00AFFF;
                // span{
                //     color: #00AFFF;
                // }
            }
        }
        .el-table {
            table thead th .cell {
                font-size: 14px;
            }
        }
    }
    .dialog {
        .el-form {
            padding: 10px 20px;
            .userInfo {
                font-size: 12px;
                color: #ff4949;
                position: absolute;
                top: 100%;
                left: 0;
                line-height: 1;
                padding-top: 4px;
            }
        }
        .el-form-item.is-required .el-form-item__label:before {
            display: none;
        }
        .dialog-body{
            padding-right: 40px;
            textarea.el-textarea__inner{
                height: 70px;
            }
        }
        .el-dialog__footer{
            padding-bottom: 30px;
            button{
                width: 80px;
                &:last-of-type{
                    margin-left: 16px;
                }
            }
        }
    }
}
</style>
