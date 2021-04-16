<template>
    <div class="demo">
        {{ this.val}}
        <ul id="demo">
            <li v-for="item in compact">
                <div class="list">
                    {{item}}
                </div>
            </li>
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="1">
                <div class="loading">加载中...</div>
            </div>
        </ul>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                compact:[],
                busy:false,
                val:1
            }
        },
        mounted(){
            this.compact.push(this.val)
        },
        methods:{
            loadMore(){
                this.val++;
                if(this.val>5){
                    this.busy = true;
                    return;
                }
                this.compact.push(this.val);
            }
        }
    }
</script>

<style >
html,body{
    width: 100%;
    height: 100%;
}
.demo{
    height: 100%;
    width: 100%;
}
ul#demo{
    margin: 20px auto;
    width: 200px;
    height: 200px;
    border: 1px solid #666;
    overflow: auto;
}
ul#demo li{
    height: 300px;
    background: pink;
}
</style>
