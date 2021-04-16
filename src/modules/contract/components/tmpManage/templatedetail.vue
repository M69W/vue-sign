<template>
    <div class="template-detail">
        <div class="bread">
            <div class="bread-left">
                <span @click="routerTo('templatemanage')">模板管理</span> / <span @click="routerTo('templatedown')">模板范本下载</span> / {{fileInfo.name}}
            </div>
            <div>
                <!-- <span class="bread-print" @click="print">打印</span> -->
                <span class="bread-down" @click="getDown">下载</span>
            </div>
        </div>
        <div class="detail-content">
            <div class="detail-head">
                <div class="temp-num">
                    模板编号：{{fileInfo.codeNum}}
                </div>
                <div>
                    页码：{{this.pageNo}} / {{this.pageTotal}}
                </div>
                <div class="temp-info">
                    <span>发布时间：{{fileInfo.uploadDate}}</span>
                    <span>浏览量：{{fileInfo.initViewCount}}</span>
                    <span>下载量：{{fileInfo.initDownloadCount}}</span>
                </div>
            </div>
            <div class="temp-content">
                <img :src="filePath" alt="" width="100%">
            </div>
        </div>
        <div id="printcnt" style="display: none" v-if="isPrint">
            <!--startprint-->
            <!-- <div style="page-break-after:always;" v-for="(item, key) in pageTotal" :key="key">
                <img :src="`${imgSrc}&pageNo=${key+1}&token=${token}`" alt="">
            </div> -->
            <!-- <div >
                <img src="http://localhost:9040/static/image/u1579.jpg" width="100%">
            </div>
            <div >
                <img src="http://localhost:9040/api/compact/auth/file/page?fileCode=d19873af-e5dc-4da5-ad5f-325bfeca8439&pageNo=2&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2NDE2NjgzMDI1MDE4Mzg4NDgiLCJhY2NvdW50IjoiMTg1NzY2NDE1MzciLCJhY2NvdW50SWQiOiI2NDE2NjgzMDI1MDE4Mzg4NDgiLCJ1c2VyVHlwZSI6IjAyIiwidXNlcklkIjoiNjQxNjY3NTc3MDQyNDM2MDk2IiwicGVyc29uYWxJZCI6IjY0MTY2ODMwMzQxNjE5NzEyMSIsImVudGVycHJpc2VJZCI6IiIsImFjY291bnRPcmdJZCI6IiIsImNsaWVudElkIjoiMDIiLCJlbnRlcnByaXNlX21hc3Rlcl9hY2NvdW50X2ZsYWciOiIxIiwibWFzdGVyX2FjY291bnRfaWQiOiI2NDE2NjgzMDI1MDE4Mzg4NDgiLCJtYXN0ZXJfdXNlcl9pZCI6IjY0MTY2NzU3NzA0MjQzNjA5NiIsIm1hc3Rlcl9lbnRlcnByaXNlX2lkIjoiIiwicm9sZVBlcm1pc3Npb25PcmdJZHMiOiIiLCJ1Y1Nlc3Npb25Ub2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSklVelV4TWlKOS5leUp6ZFdJaU9pSTJOREUyTmpnek1ESTFNREU0TXpnNE5EZ2lMQ0poWTJOdmRXNTBTV1FpT2lJMk5ERTJOamd6TURJMU1ERTRNemc0TkRnaUxDSmhZMk52ZFc1MFRuVnRZbVZ5SWpvaU1UZzFOelkyTkRFMU16Y2lMQ0ppYVhwRGIyUmxJam9pYVhscGJsOWpiMjUwY21GamRDSXNJbU5zYVdWdWRFbGtJam9pTURJaUxDSnBjM01pT2lKcGVXbHVMV052Ym5SeVlXTjBJaXdpYVdGMElqb3hOVGN6TURnNU1qZ3hMQ0psZUhBaU9qRTFOek14TnpVMk9ERjkuV2NkNWhTVWp6dnhuWnpSRXh3SWJSYmJ6eGtaTnpMa2dBRUFBMVRmWTNHeXdsQlVaVUhvWkp5NzkwaV9QT25PaEFrM2R0YmlvckZwOTBScEk3a2VmS0EiLCJpc3MiOiJpeWluLWNvbnRyYWN0IiwiaWF0IjoxNTczMDg5MTA3LCJleHAiOjE1NzU2ODExMDd9.huBY_m56BRYc659xyUw-8JWhxAHfI1tedSOGbsZH5QelbPABUfqlhfxgjrf10PpyaHO8hE4FZDD9qVhkrB6IqQ" width="100%">
            </div> -->
            <!-- <div >111111111</div>
            <div >
                <img src="https://yun.i-yin.net/mp_web/iyin/banner3%282%29.jpg" alt="" width="100%">
            </div> -->
            <!--endprint-->
        </div>
    </div>
</template>

<script>
import base from "../../mixin/base";
export default {
    name: "template-detail",
    mixins: [base],
    props: [],
    data() {
        return {
            id: '',
            fileInfo: {},
            imgSrc: '',
            pageTotal: 1,
            isPrint: false,
            pageNo: 1,
            token: sessionStorage.getItem('token'),
            scrollHeight: '',
            fileCode: ''
        };
    },
    computed: {
        filePath(){
            if(this.imgSrc){
                return `${this.imgSrc}&pageNo=${this.pageNo}&token=${this.token}`;
            }
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        this.getDetails(this.id);
    },
    methods: {
        getDetails(id){
            this.tempModelDetail(id).then(res => {
                if(this.successCheckCode(res)){
                    this.fileInfo = res.data;
                    this.imgSrc = res.data.fileHomePagePath.replace(/\&.*/,'');
                    this.pageTotal = res.data.pageTotal;
                    this.fileCode = res.data.fileCode;
                    this.$nextTick(() => {
                        this.scrollFn();
                    })
                }
            })
        },
        getDown(){
            this.tempModelDown(this.id).then(res => {
                if(this.successCheckCode(res)){
                    var a = document.createElement('a');
                    a.href = res.data;
                    a.style.display = 'none';
                    a.download = this.fileInfo.name;
                    document.body.appendChild(a)
                    a.click();
                    document.body.removeChild(a);
                }
            })
        },
        print(){
            var that = this;
            $.ajax({
                type: 'get',
                url: '/api/compact/html/'+ this.fileCode,
                beforeSend: function(request) {
                    request.setRequestHeader('Authorization', sessionStorage.getItem('token'));
                },
                success: function(data) {
                    if(data.code){
                        return that.$message.error('数据请求出错，请稍后重试');
                    }
                    that.isPrint = true;
                    that.$nextTick(() => {
                        // var printCnt = document.getElementById('printcnt').innerHTML;
                        var pwind = window.open('','');
                        pwind.document.write(data);
                        pwind.print();
                        pwind.close();
                        // pwind.document.body.innerHTML = printCnt;
                        // pwind.print();
                        // pwind.close();
                        // window.document.body.innerHTML = printCnt;
                        // window.print();
                        // window.location.reload();
                    })
                },
                error: function() {
                    that.$message.error('数据请求出错，请稍后重试');
                }
            })
            // this.getPrintHtml('d19873af-e5dc-4da5-ad5f-325bfeca8439').then(res => {
            //     // if(this.successCheckCode(res)){
            //     this.isPrint = true;
            //     this.$nextTick(() => {
            //         // var printCnt = document.getElementById('printcnt').innerHTML;
            //         var pwind = window.open('','');
            //         pwind.document.write(res.data);
            //         pwind.print();
            //         pwind.close();
            //         // pwind.document.body.innerHTML = printCnt;
            //         // pwind.print();
            //         // pwind.close();
            //         // window.document.body.innerHTML = printCnt;
            //         // window.print();
            //         // window.location.reload();
            //     })
            //     // }
            // })
        },
        scrollFn(){
            let that = this;
            $('.scroll').get(0).addEventListener('scroll', this.bindFn)
            // $('.scroll').scroll()
        },
        bindFn(){
            this.scrollHeight = $('.scroll>.content').outerHeight(true) - $('.scroll').height();
            console.log($('.scroll').scrollTop(),this.scrollHeight);
            if($('.scroll').scrollTop() >= this.scrollHeight){
                this.loadMore();
            }
            if($('.scroll').scrollTop() == 0){
                this.loadPrev();
            }
        },
        loadMore(){
            if(this.pageNo >= this.pageTotal){
                return false;
            }
            this.pageNo++;
            $('.scroll').animate({scrollTop: 10}, 200);
        },
        loadPrev(){
            if(this.pageNo <= 1){
                return false;
            }
            this.pageNo--;
            $('.scroll').animate({scrollTop: 10}, 200);
        },
        routerTo(val){
            this.$router.push(val);
        }
    },
    beforeRouteLeave (to, from, next) {
        $('.scroll').get(0).removeEventListener('scroll',this.bindFn);
        next();
    }
};
</script>

<style lang="scss">
.template-detail{
    .bread{
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;
        background: #f4f6f8;
        .bread-left{
            color: #999999;
            span{
                color: #999999;
                cursor: pointer;
            }
        }
        .bread-print{
            cursor: pointer;
            padding-left: 22px;
            background: url(../../../../../static/image/dayin.svg) no-repeat left center;
            margin-right: 10px;
        }
        .bread-down{
            cursor: pointer;
            padding-left: 22px;
            background: url(../../../../../static/image/down.svg) no-repeat left center;
        }
    }
    .detail-content{
        padding: 0 30px;
        .detail-head{
            line-height: 60px;
            border-bottom: 1px solid #E8ECEF;
            display: flex;
            justify-content: space-between;
            .temp-num{
                font-size: 16px;
            }
            .temp-info{
                color: #99A9BF;
                span:nth-child(2){
                    margin: 0 10px;
                }
            }
        }
    }
}
</style>
