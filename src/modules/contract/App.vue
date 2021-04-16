<template>
    <div class="app">
        <transition name="fade">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
        </transition>
        <transition name="fade">
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </transition>
        <down-dialog :downVisible="downVisible" @changeDialog="changeDialog"></down-dialog>
    </div>
</template>
<script>
import permission from "@/config/permission"; // 权限配置
import service from "@/assets/mixin/service";
import Vue from "vue";
import ElementUI from "element-ui";
import "../../../static/theme/index.css";

import "../../assets/css/reset.scss";
import "../../assets/css/common.scss";
// import '../../assets/fonts/iconfont.css'
import downDialog from "../../components/downDialog";
import { mapState } from "vuex";

Vue.use(ElementUI);
export default {
    mixins: [service],
    name: "app",
    components: {downDialog},
    computed: {
        ...mapState({
            downVisible: store => store.change.downVisible
        })
    },
    data(){
        return {
            isMac:false,
        }
    },
    watch: {
        $route: {
            handler: function(to, from) {
                if (from.name === "login") {
                    this.setMap();
                }
            }
        }
    },
    created() {
        this.setMap();
        this.isMacSys();
        console.log(this.$route);
        
    },
    methods: {
        setMap() {
            permission();
        },
        isMacSys(){
            var agent = navigator.userAgent.toLowerCase();
            var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
            this.isMac = isMac;
        },
        changeDialog(){
            this.$store.commit('downVisibleChange', false);
        }
    }
};
</script>
<style lang="scss">
.app {
    position: relative;
    height: 100%;
    overflow: hidden;
}
</style>
