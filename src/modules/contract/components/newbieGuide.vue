<template>
    <div id="newbieGuide">
        <div class="newbieGuide-content" v-show="show" @click="close">
            <div class="content" @click.stop>
                <div class="block">
                    <el-carousel height="464px" ref="carousel" indicator-position="none" @change="carouselChange"
                                 :initial-index="0"
                                 :autoplay="false">
                        <el-carousel-item>
                            <video autoplay loop ref="bgVideo" poster="../../../../static/image/movie-bg.png">
                                <source src="https://qn1.i-yin.com.cn/sign_iyin_html/mp4/bg.mp4 " type="video/mp4">
                            </video>
                            <div class="text">
                                <h4>新手引导</h4>
                                <p>欢迎使用安印电子合同，</p>
                                <p>新手用户可以按照以下<span>3步</span>&nbsp;完成&nbsp;发起合同签约。</p>
                            </div>
                        </el-carousel-item>
                        <el-carousel-item>
                            <video controls ref="firstlyVideo" poster="../../../../static/image/movie-1.png">
                                <source src=" https://qn1.i-yin.com.cn/sign_iyin_html/mp4/movie-1.mp4" type="video/mp4">
                            </video>
                        </el-carousel-item>
                        <!--<el-carousel-item>-->
                        <!--<video src="../../../../static/video/first.mp4" controls ref="firstVideo"></video>-->
                        <!--</el-carousel-item>-->
                        <el-carousel-item>
                            <video controls ref="secVideo" poster="../../../../static/image/movie-2.png">
                                <source src="https://qn1.i-yin.com.cn/sign_iyin_html/mp4/movie-2.mp4" type="video/mp4">
                            </video>
                        </el-carousel-item>
                        <el-carousel-item>
                            <video src="https://qn1.i-yin.com.cn/sign_iyin_html/mp4/movie-3.mp4" @ended="isEnd" controls
                                   ref="thirVideo" poster="../../../../static/image/movie-3.png" type="video/mp4"></video>
                            <div class="end-box" v-if="playEnd">
                                <span @click="show=false">关闭</span>
                                <span @click="review">再看一遍</span>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="btn-box">
                    <div class="first-btn" v-if="active=='0'">
                        <span @click="show=false">跳过</span>
                        <span @click="next">查看</span>
                    </div>
                    <div class="secon-btn" v-if="active=='1'">
                        <div class="secon-btn-l pdl">
                            <p>第一步：上传需要签署的合同文件</p>
                            <p>点击发起签约 —— 进入上传合同页面 —— 选择需要签约的合同文件 —— 填写合同信息</p>
                        </div>
                        <div class="secon-btn-r" @click="next"></div>
                    </div>
                    <div class="secon-btn" v-if="active=='2'">
                        <div class="secon-btn-r pre" @click="prev"></div>
                        <div class="secon-btn-l center">
                            <p>第二步： 设置合同签署方式、签署人</p>
                            <p>完成合同签署信息设置 —— 添加签署人 —— 点击下一步</p>
                        </div>
                        <div class="secon-btn-r" @click="next"></div>
                    </div>
                    <div class="secon-btn" v-if="active=='3'">
                        <div class="secon-btn-r pre" @click="prev"></div>
                        <div class="secon-btn-l center">
                            <p>第三步： 完成签署、发起签约</p>
                            <p>拖拽自己的签名或者印章完成合同签署 —— 输入签署密码 —— 成功发起合同签约</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<!--<script src="../../../../static/js/html5media.min.js"></script>-->
<script>
    export default {
        data() {
            return {
                active: 0,
                show: false,
                playEnd: false,
                item: [1, 2, 3]
            };
        },
        methods: {
            next() {
                this.playEnd = false;
                this.$refs.carousel.next();
            },
            prev() {
                this.playEnd = false;
                this.$refs.carousel.prev();

            },
            carouselChange(i) {
                this.active = i;
            },
            open() {
                this.show = true;
            },
            isEnd() {
                this.playEnd = true;
            },
            review() {
                this.$refs.carousel.setActiveItem(1);
            },
            close(){
                this.show=false;
                this.$refs.carousel.setActiveItem(0);
                this.active = 0 ;
            }
        },
        watch: {
            active(val) {
                if (val == 0) {
                    this.$refs.bgVideo.load();
                    this.$refs.bgVideo.play();
                }
                if (val == 1) {
                    this.$refs.firstlyVideo.load();
                    this.$refs.firstlyVideo.play();
                }
                if (val == 2) {
                    this.$refs.secVideo.load();
                    this.$refs.secVideo.play();
                }
                if (val == 3) {
                    this.$refs.thirVideo.load();
                    this.$refs.thirVideo.play();
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    #newbieGuide {
        .newbieGuide-content {
            z-index: 9999;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(18, 34, 66, .5);

            > .content {
                width: 700px;
                height: 540px;
                min-height: 540px;
                position: absolute;
                top: 50%;
                left: 50%;
                /*transform: translate(-50%, -55%);*/
                margin-top: -300px;
                margin-left: -350px;
                background-color: #fff;

                .block {
                    background-color: #000;
                    .text {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 464px;
                        padding-top: 130px;
                        text-align: center;
                        background-color: rgba(18, 34, 66, .3);

                        h4 {
                            font-size: 30px;
                            margin-bottom: 20px;
                            color: #02ADFF;
                            font-weight: 500;
                        }

                        p {
                            line-height: 30px;
                            font-size: 16px;
                            color: #fff;
                            font-weight: 500;

                            span {
                                font-size: 24px;
                            }
                        }
                    }

                    video {
                        width: 100%;
                        height: 100%;
                        object-fit: fill;
                    }

                    .video-box {
                        width: 700px;
                        height: 464px;

                        video {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }

                    .end-box {
                        background-color: rgba(18, 34, 66, .3);
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        span {
                            display: inline-block;
                            width: 100px;
                            height: 40px;
                            line-height: 40px;
                            text-align: center;
                            border: 1px solid #02ADFF;
                            border-radius: 4px;
                            color: #02ADFF;
                            background-color: #fff;
                            font-size: 14px;
                            cursor: pointer;

                            &:last-of-type {
                                color: #fff;
                                margin-left: 20px;
                                background-color: #02ADFF;
                            }
                        }
                    }
                }

                .btn-box {
                    height: 106px;
                    background-color: #fff;

                    .first-btn {
                        height: 100%;
                        line-height: 106px;
                        text-align: center;
                        background: #F1F2F6;

                        span {
                            display: inline-block;
                            width: 100px;
                            height: 40px;
                            line-height: 40px;
                            text-align: center;
                            border: 1px solid #02ADFF;
                            border-radius: 4px;
                            color: #02ADFF;
                            background-color: #fff;
                            font-size: 14px;
                            cursor: pointer;

                            &:last-of-type {
                                color: #fff;
                                margin-left: 20px;
                                background-color: #02ADFF;
                            }
                        }
                    }

                    .secon-btn {
                        /*display: flex;*/
                        /*align-items: center;*/
                        background: #F1F2F6;
                        height: 100%;
                        padding: 21px 10px;

                        .secon-btn-l {
                            float: left;
                            text-align: center;
                            min-width: 550px;
                            p {
                                color: #02ADFF;
                                font-size: 16px;
                                line-height: 22px;
                                margin-top: 9px;

                                &:last-of-type {
                                    color: #626262;
                                    font-size: 14px;
                                    line-height: 20px;
                                }
                            }
                            &.pdl{
                                padding-left: 64px;
                            }
                        }

                        .secon-btn-r {
                            float: right;
                            cursor: pointer;
                            width: 64px;
                            height: 64px;
                            background-image: url("../../../../static/image/next.svg");
                            background-size: 100%;
                            &:hover{
                                background-image: url("../../../../static/image/next_hover.svg");
                            }
                            &.pre{
                                float: left;
                                transform: rotate(180deg);
                                -ms-transform:rotate(180deg);
                            }
                        }
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
    #newbieGuide .el-carousel__arrow {
        /*display: none !important;*/
        opacity: 0 !important;
    }
</style>
