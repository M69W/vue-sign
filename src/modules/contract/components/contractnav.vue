<template>
    <div class="menus">
        <el-button class="add el-icon-plus" type="primary" @click="sign($event)">发起签约</el-button>
        <ul class="menusList">
            <li
                v-for="(menus ,index) in menulist"
                :class="{active: menus.type == type}"
                @click="selectType(menus , menus.type)"
            >
                <p class="clearfix">
                    <span class="left nav_icon" :class="`nav_${menus.type}`"></span>
                    <span class="left">{{menus.name}}</span>
                    <span class="right pd">{{menus.num}}</span>
                </p>
            </li>
            <li class="line"></li>
            <li :class="{active: 'word' == type}" class="word-li" @click="getCompactFolder">
                <p class="clearfix">
                    <span class="left nav_icon nav_10"></span>
                    <span class="left">归档文件夹</span>
                    <span class="right">
                        <el-dropdown @command="addWord" size="mini" placement="top-end">
                            <span class="word">+</span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>新建文件夹</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                </p>
                <p
                    class="word-list"
                    @click="confirmWordId(item.id,item.folderName)"
                    :class="{active: wordId == item.id}"
                    :key="item.id"
                    v-for="item in CompactFolderList"
                >
                    <span class="word-list-name" :title="item.folderName">{{item.folderName}}</span>
                    <span class="word-list-more">
                        <el-dropdown @command="handleCommand" size="mini" placement="top-end">
                            <span class="word-list-dropdown"></span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                    :command="{
                                type:'change',
                                id:item.id,
                                value:item.folderName
                            }"
                                >重新命名</el-dropdown-item>
                                <el-dropdown-item
                                    :command="{
                                type:'delete',
                                id:item.id,
                                value:item.folderName
                            }"
                                >删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                </p>
                <!--<p v-show="'word' == type" class="word-list cl">省公司合同-->
                <!--<span class="word-list-more">-->
                <!--<el-dropdown @command="handleCommand" size="mini" placement="top-end">-->
                <!--<span>...</span>-->
                <!--<el-dropdown-menu slot="dropdown">-->
                <!--<el-dropdown-item command="change">重新命名</el-dropdown-item>-->
                <!--<el-dropdown-item command="delete">删除</el-dropdown-item>-->
                <!--</el-dropdown-menu>-->
                <!--</el-dropdown>-->
                <!--</span>-->
                <!--</p>-->
            </li>
            <!--<li class="flie_list" @click="selectType( filelist[0].name , filelist[0].type )"-->
            <!--:class="{active: filelist[0].type == type}"><p class="clearfix"><span>归档文件夹</span><span-->
            <!--class="right el-icon-plus"></span></p>-->
            <!--<ul v-show="showul">-->
            <!--<li v-for="(menus ,index) in filelist" class="file" :class="{active:menus.type == type}"-->
            <!--@click.stop="selectType(menus , menus.type)">-->
            <!--&lt;!&ndash;@click.stop="selectType(menus.name , '1-' + index , menus.id)"&ndash;&gt;-->
            <!--<span :title="menus.name">{{menus.name}}</span>-->
            <!--<div class="right" @mouseover="showEdit(index)"-->
            <!--@mouseout="showEditout(index)">-->
            <!--<span class="point_img"></span>-->
            <!--<div class="edit" v-show="index == indexactive">-->
            <!--<span class="changeName" @click.stop="changeName()">重命名</span>-->
            <!--<span class="delete" @click.stop="deleteName()">删除</span>-->
            <!--</div>-->
            <!--</div>-->
            <!--</li>-->
            <!--</ul>-->
            <!--</li>-->
        </ul>
        <el-dialog
            title="移动"
            :visible.sync="dialogVisible"
            custom-class="custom-dialog"
            width="30%"
            top="35%"
            :before-close="handleClose"
            :modal-append-to-body="false"
        >
            <div class="dialog-content">
                <p>请选择目标文件夹</p>
                <el-select v-model="wordList" placeholder="请选择文件夹">
                    <el-option label="安印公司" value="安印公司"></el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>&nbsp;
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import base from "../mixin/base";

export default {
    name: "contractnav",
    mixins: [base],
    props: ["tableData","phoneNum"],
    data() {
        return {
            userinfo: "",
            pagedefault: "",
            showul: false,
            indexactive: null,
            type: "",
            menulist: [],
            filelist: [
                {
                    name: "集团公司合同集团公司合同",
                    type: "1"
                },
                {
                    name: "省公司合同",
                    type: "2"
                }
            ],
            navClass: {
                "09": "syht",
                "08": "dwqs",
                "07": "dtrq",
                "06": "jjjz",
                "05": "jjgq",
                "04": "qywc",
                "03": "yjq",
                "02": "ycx",
                "01": "cgx"
            },
            dialogVisible: false,
            wordList: [],
            CompactFolderList: [],
            wordName: "",
            wordId: ""
        };
    },
    watch: {
        tableData(curVal, oldVal) {
            this.getStatList();
        },
        $route() {
            console.log("type" in this.$route.query);
            if (!("type" in this.$route.query)) {
                this.type = "09";
                this.$emit("title", { name: "所有合同", num: 0, type: "09" });
            }
        }
    },
    mounted() {
        console.log(this.tableData);
        this.type = this.$route.query.type;
        this.userinfo = JSON.parse($.cookie("userinfo"));
        if (this.type == undefined) {
            this.type = "09";
        }
        let self = this;
        this.menulist.map(function(data) {
            if (self.type == data.type) {
                self.$emit("title", data);
                self.selectType(data, data.type);
            }
        });
        this.filelist.map(function(data) {
            if (self.type == data.type) {
                self.$emit("title", data);
                self.selectType(data, data.type);
            }
        });
        this.getStatList();
        let enterpriseId = JSON.parse($.cookie("userinfo")).userId;
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
    methods: {
        // 合同状态
        getStatList() {
            this.signState(this.userinfo.userId).then(res => {
                if (this.successCheckCode(res)) {
                    this.menulist = res.data.list;
                }
            });
        },
        selectType(data, type) {
            this.$router.push({ path: "/contractlist", query: { type: type } });
            this.wordId = "";
            this.type = type;
            setTimeout(function() {
                $(".menusList>.active")
                    .parents("li")
                    .eq(0)
                    .addClass("active");
                $(".menusList>.active")
                    .siblings("li")
                    .removeClass("active");
            }, 10);
            this.$emit("title", data);
        },
        toggle() {
            this.showul = !this.showul;
        },
        showEdit(index) {
            this.indexactive = index;
        },
        showEditout() {
            this.indexactive = null;
        },
        changeName() {},
        deleteName() {},
        sign(event) {
            this.checkPermission(
                // 权限校验
                this.$perMap.contractMgt.saveSignPosition.url,
                this.$perMap.contractMgt.saveSignPosition.method
            ).then(res => {
                if (!this.successCheckCode(res)) {
                    return;
                }
                if (
                    JSON.parse($.cookie("userinfo"))
                        .realNameAuthenticationFlag == "0"
                ) {
                    this.$emit("dialogTipsFun", true);
                } else if (!this.phoneNum) {
                    this.$router.push("/companyinit");
                } else {
                    this.$router.push("/contractsign");
                }
            });
        },
        handleCommand(n) {
            console.log(n.type);
            // this.dialogVisible=true;
            // this.changeWord();
            if (n.type == "change") {
                this.changeWord(n.value, n.id);
            } else if (n.type == "delete") {
                this.deleteWord(n.value, n.id);
            }
        },
        confirmWordId(id, name) {
            this.wordId = id;
            this.wordName = name;

            this.$router.push({
                path: "/contractlist",
                query: { type: "10", folderId: id }
            });
            this.$emit("title", { folderId: id, name: name, type: "09" });
        },
        addWord() {
            this.$prompt("请输入新文件夹名", "新建文件夹", {
                inputPlaceholder: "请输入文件夹名称",
                customClass: "self-icon self-input",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(({ value }) => {
                if (!value) {
                    return this.$message.error("请输入文件夹名称！");
                }
                if (value.length >= 25) {
                    return this.$message.error("文件夹名称不能超过25个汉字");
                }
                let data = {
                    userId: JSON.parse($.cookie("userinfo")).userId,
                    folderName: value,
                    // enterpriseId:"12424",
                    enterpriseId: JSON.parse($.cookie("userinfo")).userId
                };

                this.addCompactFolder(data).then(res => {
                    if (this.successCheckCode(res)) {
                        this.$message({
                            type: "success",
                            message: "添加成功！"
                        });
                        this.getCompactFolder();
                        this.$emit("title", { type: "updateWord" });
                    }
                });
            });
        },
        deleteWord(name, id) {
            const h = this.$createElement;
            this.$msgbox({
                title: "删除当前文件夹",
                message: h("div", null, [
                    h("p", null, [
                        h(
                            "span",
                            {
                                style:
                                    "color: #282828;line-height:26px;font-size:16px"
                            },
                            "是否确认删除当前文件夹 "
                        ),
                        h(
                            "span",
                            {
                                style:
                                    "color: #30BCFF;line-height:26px;font-size:18px"
                            },
                            name
                        ),
                        h(
                            "span",
                            {
                                style:
                                    "color: #626262;line-height:26px;font-size:14px"
                            },
                            " ？"
                        )
                    ]),
                    h(
                        "p",
                        {
                            style: "color: #999;line-height:26px;font-size:14px"
                        },
                        "该操作不会删除文件夹内存放的合同文件，仅删除文件夹。"
                    )
                    // h('p', {style: 'color: #999;line-height:26px;font-size:14px'}, '仅删除文件夹。')
                ]),
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                customClass:"icon-delete self-icon delete-word",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        this.deleteCompactFolder({ folderId: id }).then(res => {
                            if (this.successCheckCode(res)) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.getCompactFolder();
                                this.$emit("title", { type: "updateWord" });
                                done();
                            }
                        });
                    } else {
                        done();
                    }
                }
            });
        },
        changeWord(name, id) {
            this.$prompt("请输入新的文档名", "重新命名", {
                inputPlaceholder: "请输入文件夹名称",
                customClass: "self-icon self-input",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValue: name
            }).then(({ value }) => {
                if (!value) {
                    return this.$message.error("请输入文件夹名称！");
                }
                if (value.length >= 25) {
                    return this.$message.error("文件夹名称不能超过25个汉字");
                }
                let data = {
                    id: id,
                    folderName: value
                };
                this.updateCompactFolder(data).then(res => {
                    if (this.successCheckCode(res)) {
                        this.$message({
                            type: "success",
                            message: "修改成功！"
                        });
                        this.$emit("title", { type: "updateWord" });
                        this.getCompactFolder();
                    }
                });
            });
        },
        handleClose() {},
        //合同归档列表
        getCompactFolder() {
            this.type = "word";
            let enterpriseId = JSON.parse($.cookie("userinfo")).userId;
            // let enterpriseId = 12424 ;
            this.getCompactFolderList(enterpriseId).then(res => {
                if (this.successCheckCode(res)) {
                    this.CompactFolderList = res.data;
                    /*if(!this.wordId){
                            this.wordId = res.data[0].id
                        }*/
                }
            });
        }
    }
};
</script>

<style scoped lang="scss">
.menus {
    .el-icon-plus:before {
        content: "\E61C";
        margin-right: 6px;
    }

    .add {
        text-align: center;
        width: 180px;
        height: 36px;
        margin-top: 10px;
        margin-bottom: 15px;
        margin-left: 13px;
        border: none;
    }

    .add:hover {
        background: #0073bd;
    }

    .menusList {
        > li {
            &:hover {
                background-color: inherit;
                p {
                    background-color: #fff;
                }
            }
            &.active p:hover {
                background-color: #fff;
            }
            &.active:hover p {
                background-color: #fff;
            }
        }

        li {
            padding: 0 !important;
            &.line {
                margin: 10px 0;
                border-bottom: 1px dashed #d0d0d0;
            }
            p {
                border-left: 2px solid transparent;
                padding: 0px 20px;
                cursor: pointer;
                height: 40px;
                line-height: 40px;
            }

            li {
                padding: 0 30px;
                height: 40px;
                line-height: 40px;
                background-color: #fafafa;

                > span {
                    padding-left: 30px;
                    cursor: pointer;
                    height: 40px;
                    display: inline-block;
                    width: 135px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                > span:hover {
                    color: #30bcff;
                }
            }

            .active {
                color: #30bcff;
            }

            .left {
                float: left;
            }
            .nav_icon {
                margin-right: 8px;
                margin-top: 12px;
                width: 15px;
                height: 16px;
                text-align: center;
                display: inline-block;
                background-size: 100%;
                background-repeat: no-repeat;
                &.nav_09 {
                    background-image: url("../../../../static/image/contractNav/syht.svg");
                }
                &.nav_08 {
                    background-image: url("../../../../static/image/contractNav/dwqs.svg");
                }
                &.nav_07 {
                    background-image: url("../../../../static/image/contractNav/dtrq.svg");
                }
                &.nav_06 {
                    background-image: url("../../../../static/image/contractNav/jjjz.svg");
                }
                &.nav_05 {
                    background-image: url("../../../../static/image/contractNav/jjgq.svg");
                }
                &.nav_04 {
                    background-image: url("../../../../static/image/contractNav/qywc.svg");
                }
                &.nav_03 {
                    background-image: url("../../../../static/image/contractNav/yjq.svg");
                }
                &.nav_02 {
                    background-image: url("../../../../static/image/contractNav/ycx.svg");
                }
                &.nav_01 {
                    background-image: url("../../../../static/image/contractNav/cgx.svg");
                }
                &.nav_10 {
                    background-image: url("../../../../static/image/contractNav/gd.svg");
                }
            }

            .right {
                float: right;
                .word {
                    font-size: 22px;
                    padding: 0 18px;
                    cursor: pointer;
                    color: #999;
                }
                &.pd {
                    padding-right: 20px;
                }
            }

            .el-icon-plus.right {
                color: #999;
                margin-top: 13px;
            }
        }

        li:hover p {
            background: rgb(209, 219, 229);
            &.word-list {
                border-left: none;
                /*background-color: transparent;*/
                color: #666;
            }
        }

        li:after {
            content: "";
            display: block;
            clear: both;
        }

        p.word-list {
            border-left: none;
            background-color: transparent;
            color: #666;
            font-size: 14px;
            padding-left: 44px;
            padding-right: 38px;
            position: relative;
            width: 206px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &.active,
            &:hover {
                /*color: #30bcff !important;*/
            }
            .word-list-more {
                position: absolute;
                right: 18px;
                top: 0;
            }
            .word-list-dropdown {
                display: inline-block;
                width: 17px;
                height: 8px;
                background: url("../../../../static/image/point.png") no-repeat
                    center;
                background-size: 100%;
                &:hover {
                    background: url("../../../../static/image/point_hover.png")
                        no-repeat center;
                }
            }
        }

        .active,
        .is-active {
            p {
                background: #fff;
                border-left: 2px solid #02adff;
                color: #30bcff;

                &.word-list {
                    background-color: #fafafa;
                    border-left: none;
                    color: #666;
                }

                .nav_icon {
                    &.nav_09 {
                        background-image: url("../../../../static/image/contractNav/syht_hover.svg");
                    }
                    &.nav_08 {
                        background-image: url("../../../../static/image/contractNav/dwqs_hover.svg");
                    }
                    &.nav_07 {
                        background-image: url("../../../../static/image/contractNav/dtrq_hover.svg");
                    }
                    &.nav_06 {
                        background-image: url("../../../../static/image/contractNav/jjjz_hover.svg");
                    }
                    &.nav_05 {
                        background-image: url("../../../../static/image/contractNav/jjgq_hover.svg");
                    }
                    &.nav_04 {
                        background-image: url("../../../../static/image/contractNav/qywc_hover.svg");
                    }
                    &.nav_03 {
                        background-image: url("../../../../static/image/contractNav/yjq_hover.svg");
                    }
                    &.nav_02 {
                        background-image: url("../../../../static/image/contractNav/ycx_hover.svg");
                    }
                    &.nav_01 {
                        background-image: url("../../../../static/image/contractNav/cgx_hover.svg");
                    }
                   /* &.nav_10 {
                        background-image: url("../../../../static/image/contractNav/gd_hover.svg");
                    }*/
                }
            }
        }
        li.word-li{
            cursor: default;
            p{
                cursor: default;
                border-left: 2px solid transparent;
            }
            &:hover{
                background-color: transparent;
                p{
                    /*cursor: default;*/
                    background-color: transparent;
                    border-left: 2px solid transparent;
                }
            }
            .word-list{
                cursor: pointer;
                border-left: 2px solid transparent;
                &:hover{
                    background-color: #d1dbe5;
                }
            }
            &.active{
                p{
                    background-color: transparent;
                    border-left-color: transparent;
                    color: #333;
                }
                .word-list.active{
                    border-left: 2px solid #02adff;
                    background-color: #fff;
                    color: #30bcff;
                }
            }
        }
    }

    ul {
        li {
            position: relative;

            .right:hover .point_img {
                background: url("../../../../static/image/point_hover.png")
                    no-repeat center;
            }

            .right {
                position: absolute;
                right: 0;
                top: 0;
                cursor: pointer;

                .point_img {
                    display: inline-block;
                    width: 75px;
                    height: 5px;
                    background: url("../../../../static/image/point.png")
                        no-repeat center;
                }
            }

            .edit {
                position: absolute;
                right: 0;
                top: 39px;
                border: 1px solid #d3dce6;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
                    0 0 6px 0 rgba(0, 0, 0, 0.04);
                border-radius: 2px;
                z-index: 200;
                width: 80px;
                background: #fff;

                span {
                    display: block;
                    width: 100%;
                    color: #999999;
                    padding: 0 10px;
                }

                span:hover {
                    color: #475669;
                    background: #f9fafc;
                }
            }
        }

        .active {
            ul {
                /*display: block !important;*/
            }
        }
    }
}
</style>
<style lang="scss">
.el-message-box.self-msg-box {
    margin-top: -150px;
    /*width: 570px;*/
    .el-message-box__input {
        padding-top: 0;
    }

    .el-message-box__content {
        padding-bottom: 10px;
    }

    .el-message-box__btns {
        padding-top: 0;
    }
}

.menus .custom-dialog.el-dialog.el-dialog--small {
    border-radius: 10px;
    width: 390px;

    .el-dialog__header {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        padding: 0;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        background-color: #e8ecef;

        .el-dialog__title {
            font-size: 16px;
            font-weight: 500;
        }

        .el-dialog__headerbtn {
            margin-top: 0;
            padding: 12px 18px 20px;
        }
    }

    .dialog-content {
        padding-top: 30px;
        padding-bottom: 10px;

        p {
            color: #475669;
            font-size: 14px;
            padding-bottom: 10px;
        }

        .el-select {
            width: 100%;
        }
    }

    .el-button {
        width: 80px;
    }
}
</style>
