<template>
    <div class="navbox">
        <div class="heads logo">
            <a href="/">
                <img style="width: 100px;" src="../../../../static/image/logo.png" alt="">
                <p>用户管理中心</p>
            </a>
        </div>
        <div class="menus">
            <el-menu :default-active="pagedefault" router unique-opened class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                <el-submenu index="1">
                    <template slot="title"><i class="navicon nav-1"></i>用户中心</template>
                    <el-menu-item index="list">单位列表</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>

    </div>
</template>
<script>
export default {
    mixins: [],
    props: {},
    components: {},
    data() {
        return {
            pagedefault: ""
        };
    },
    computed: {},
    watch: {
        $route() {
            if (this.$route.meta.parentPath) {
                this.pagedefault = this.$route.meta.parentPath
            }
        }
    },
    activated() {
        this.$nextTick(() => {});
    },
    mounted() {
        this.$nextTick(() => {});
        if (this.$route.meta.parentPath) {
            this.pagedefault = this.$route.meta.parentPath
        }
    },
    methods: {
        directPath(path) {
            this.$router.push(path);
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
};
</script>
<style lang="scss">
    .left-nav{
        width:206px;
        height:100%;
        background-color: #E8ECEF;
        position:absolute;
        left:0;
        top:0;
    }
</style>
