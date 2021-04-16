<template>
    <div class="ukeysealmanage">
        <div class="main-content">
            <router-view></router-view>
        </div>
        <online></online>
    </div>
</template>
<script>
import usernav from "./usernav";
import online from "../../../components/online";
export default {
    mixins: [],
    components: { usernav, online },
    data() {
        return {};
    },
    computed: {},
    watch: {
        $route: {
            handler(to, from) {
                if (to.name === "costmanager") {
                    $.cookie("costmanagerActive", "");
                }
            }
        }
    },
    mounted() {},
    methods: {}
};
</script>
<style lang="scss">
.ukeysealmanage {
    position: relative;
    .left-nav {
        width: 206px;
        float: left;
        background: #e8ecef;
        position: fixed;
        height: calc(100% - 160px);
        overflow: auto;
    }
    .main-content {
        padding: 0 30px 40px 30px;
        // margin-left: 206px;
        min-height: 100%;
        background-color: #ffffff;
    }
}
</style>
