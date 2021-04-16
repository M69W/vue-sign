<template>
    <div class="list">
        <p>单位列表</p>
    </div>
</template>
<script>
import base from "../mixin/base";
export default {
    mixins: [base],
    components: {},
    data() {
        return {
            pageTitle: ""
        };
    },
    computed: {},
    watch: {},
    mounted() {
        this.pageTitle = this.$route.meta.title
    },
    methods: {}
};
</script>
<style lang="scss">
.list {
    background: #fff;
}
</style>