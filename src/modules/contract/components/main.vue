<template>
    <div class="contents">
        <div class="main">
           <heads ref="heads"></heads>
           <div class="scroll" @scroll="contentScroll" ref="scroll">
               <div class="content">
                   <router-view></router-view>
               </div>
           </div>
            <foot></foot>
        </div>
    </div>
</template>
<script>
import heads from "./heads";
import foot from "./foot";
export default {
    mixins: [],
    components: { heads, foot },
    props: {},
    data() {
        return {
            hideMenu: false,
            menu: ""
        };
    },
    computed: {},
    watch: {
        $route() {
            this.pageTitle = this.$route.name;
            if( this.pageTitle == "index"  ||  this.$route.meta.parentPath == "/index"){
                $(".scroll").addClass("background");
            }else {
                $(".scroll").removeClass("background");
            }
        }
    },
    mounted() {
        this.menu = this.$route.meta.parentpath;

        this.pageTitle = this.$route.name;
        if( this.pageTitle == "index" ||  this.$route.meta.parentPath == "/index"){
            $(".scroll").addClass("background");
        }else {
            $(".scroll").removeClass("background");
        }

        // if (localStorage.hideMenu) {
        //     this.hideMenu = true;
        // } else {
        //     this.hideMenu = false;
        // }
        // var that = this
        // this.$root.eventHub.$on('moveleft',(val)=>{
        //     that.hideMenu = val
        // })
        if (!sessionStorage.getItem('token') || sessionStorage.getItem('token') == 'undefined') {
            // $.removeCookie('token', { path: "/" });
            // $.removeCookie('userinfo', { path: "/" });
            // localStorage.removeItem('userResource');
            // // localStorage.clear();
            localStorage.removeItem("anyinUserinfo")
            this.$router.replace('/login')
        }
    },
    activated() {
        this.$nextTick(() => {
            this.menu = this.$route.meta.parentpath;
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.menu = this.$route.meta.parentpath;
        next();
    },
    methods: {
        contentScroll(){
            let scrollTop = this.$refs.scroll.scrollTop ;
            if(scrollTop>200){
                this.$refs.heads.returnBorderColor(false)
            }else{
                this.$refs.heads.returnBorderColor(true)
            }
        }
    }
};
</script>
<style lang="scss">
.contents {
    background: #ffffff;
    height: 100%;
    min-height: 100%;
}
.main {
    width: 100%;
    top: 0;
    bottom: 0;
    height: 100%;
    .scroll{
        width: 100%;
        height: calc(100% - 120px);
        overflow: auto;
        background-color: #F4F6F8;
        .content {
            width: 1200px;
            margin: 20px auto;
            min-height: calc(100% - 40px);
            background-color:#ffffff;
        }
    }
    .scroll.background{
        background-color: #fff;
        .content {
            width: 100%;
            margin: 0px auto;
            min-height: 100%;
            background-color:#ffffff;
        }
    }
}
</style>
