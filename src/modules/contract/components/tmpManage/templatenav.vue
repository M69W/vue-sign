<template>
    <div class="template-nav">
        <ul class="template-menus">
            <li
                :class="{ active: path === '/templatemanage' }"
                @click="routerTo('templatemanage')"
            >自定义模板</li>
            <li
                :class="{ active: path === '/templatedown' }"
                @click="routerTo('templatedown')"
            >模板范本下载</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'template-nav',
    mixins: [],
    props: [],
    data() {
        return {
            path: ''
        };
    },
    watch: {},
    mounted() {
        this.path = this.$route.path;
        console.log(this.path);
    },
    methods: {
        routerTo(val) {
            this.$router.push(val);
        }
    }
};
</script>

<style lang="scss">
.template-nav {
    width: 206px;
    height: calc(100% - 160px);
    background: #e8ecef;
    position: fixed;
    overflow: auto;
    z-index: 10;
    .template-menus {
        padding-top: 20px;
        li {
            height: 40px;
            line-height: 40px;
            padding-left: 47px;
            position: relative;
            font-size: 14px;
            cursor: pointer;
        }
        li.active {
            background: #ffffff;
            color: #02adff;
            &::before {
                content: '';
                position: absolute;
                height: 100%;
                width: 2px;
                left: 0;
                top: 0;
                background: #02adff;
            }
        }
        li:nth-child(1) {
            background: url(../../../../../static/image/temp.svg) no-repeat 20px center;
        }
        li.active:nth-child(1) {
            background: url(../../../../../static/image/temp_active.svg) no-repeat 20px center #fff;
        }
        li:nth-child(2) {
            background: url(../../../../../static/image/tempdown.svg) no-repeat 20px center;
        }
        li.active:nth-child(2) {
            background: url(../../../../../static/image/tempdown_active.svg) no-repeat 20px center #fff;
        }
    }
}
</style>
