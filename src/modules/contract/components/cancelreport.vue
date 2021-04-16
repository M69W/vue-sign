<template>
    <div class="ukeyrenew">
        <div class="orderpage-topbar clearfix">
            <div class="orderpage-tit">撤销Ukey挂失 {{picCode}}</div>
        </div>
        <div class="orderpage-cont">
            <div class="orderpage-item-tit">Ukey查验</div>
            <el-row class="ukeychackcont">
                <el-col :span="9">
                    <el-input placeholder="请插入UKEY" :disabled="!!ukeyName" v-model="ukeyName">
                        <template slot="prepend">UKEY</template>
                        <!--<el-select v-model="ukeyselect" placeholder="请选择UKEY">-->
                        <!--<el-option v-for="item in ukeylist" :key="item.id" :label="item.label" :value="item.value"></el-option>-->
                        <!--</el-select>-->
                    </el-input>
                </el-col>
                <el-col :span="2">
                    <div class="readUkeyBtn" @click="refresh">读取</div>
                    <!--<el-button class="refresh" type="primary" :loading="loadingBtnKey1" @click="refresh"></el-button>-->
                </el-col>
                <el-col :span="9">
                    <el-input placeholder="请输入PIN码" v-model="PINpsw">
                        <template slot="prepend">PIN码</template>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button class="readsure" @click="validateReportPin">确定</el-button>
                </el-col>
            </el-row>
            <div class="orderpage-item-tit">签名信息表</div>
            <el-table :data="tableData" style="width: 100%; margin-top:10px;">
                <el-table-column :resizable="false" prop="name" label="印章名称" width="180"></el-table-column>
                <el-table-column :resizable="false" prop="type" label="印章类型"></el-table-column>
                <el-table-column :resizable="false" prop="signcode" label="印章编码"></el-table-column>
                <el-table-column :resizable="false" prop="expiryDate" label="有效期" width="280"></el-table-column>
            </el-table>
        </div>
        <div class="orderpage-footbtn">
            <el-button @click="back">返回</el-button>
            <el-button type="primary" @click="submitFrom">提交</el-button>
        </div>

    </div>
</template>
<script>
    import ukey from "../../../assets/plugin/ukey.js";

    export default {
        mixins: [ukey],
        components: {},
        data() {
            return {
                tableData: [{
                    signImg: "https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=7bcb659c9745d688a302b5a29cf91a23/2934349b033b5bb571dc8c5133d3d539b600bc12.jpg",
                    name: "合同章",
                    type: "合同章",
                    signcode: "4111321333",
                    expiryDate: "2017-01-30 至 2019-01-30",
                }],
                formData: {},
                rules: {},
                ukeyInfo: {},
                ukeyselect: '',
                ukeyName: '',
                ukeyIdNum: '',
                PINpsw: '',
                picCode: '00'
            }
        },
        computed: {},
        watch: {},
        mounted() {
        },
        methods: {
            //刷新按钮
            refresh() {
                this.ukeyselect = "";
                this.ukeylist = [];
                this.getukeyNames();

                if (this.issupport()) {
                    this.getukeyNames();
                    // this.ukeyIdNum=this.getKeyID(0);

                    this.ukeyName = this.ukeylist[0].label;
                    this.ukeyInfo = this.ukeylist[0];
                    console.log(this.esealCode(this.loginForm.kpassword, 0), this.GetOid(0), this.getCertSignSN(), typeof (this.getCertSignSN()))
                }
                if (this.ukeylist.length > 0) {
                    this.$message({
                        message: `刷新成功`,
                        type: "success",
                        duration: 1500,
                    });
                }
            },
            back() {
                this.$router.go(-1);
            },
            validateReportPin(){
                if(!this.PIN(this.PINpsw, 0)){
                    return this.$message.error('PIN码输入错误，请重新输入')
                }
                this.picCode = this.esealCode(this.PINpsw,0)

            },
            submitFrom() {
                this.$confirm('您的UKey设备读取到的信息和取消挂失签名信息不匹配，请重新插入对应UKey。', '错误提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    customClass:"self-icon icon-unmatch",
                }).then(() => {
                    return false;
                })
            }
        }
    }
</script>

<style lang="scss">
    .ukeyrenew {
        .el-input-group__prepend {
            border: 0;
            padding: 0 20px 0 0;
            color: #626262;
        }

        .el-input__inner {
            background-color: #fff;
        }

        .el-button--default {
            color: #626262;
        }

        .el-button--default:hover {
            color: #fff;
        }

        .readUkeyBtn {
            font-size: 14px;
            color: #00AFFF;
            height: 36px;
            line-height: 36px;
            cursor: pointer;
            width: 60px;
            text-align: center;
        }

        .ukeychackcont {
            margin-top: 10px;

            .el-button {
                border: 1px solid #00AFFF;
                float: right;
                width: 100px;
            }
        }
    }
</style>
<style>
    .el-table th > div.cell {
        line-height: 30px;
    }

    .el-table table thead th, .el-table table thead th .cell {
        /*background-color: #E8ECEF;*/
        /*color: #626262;*/
    }

    .ukeyrenew .readsure {
        color: #00AFFF;
    }
</style>
