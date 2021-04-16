import service from "../../../assets/mixin/service";
import moment from "moment";
export default {
    mixins: [service],
    data() {
        return {
            pageNum: 1,
            pageSize: 10,
            currentpage: 1,
            total: 0,
            treeData: [],
            loadingTabel: false,
            loadingtree: false,
            userinfo:"",
            isIe:false,
            sessionToken: sessionStorage.getItem('sessionToken') //$.cookie('sessionToken')
        }
    },
    mounted() {
        this.placeholder();
        this.userinfo = JSON.parse($.cookie("userinfo"));

        this.isIE();
    },
    computed: {
        compToken(val){
            return function (val) {
                if(val){
                    return `${val}&token=${this.sessionToken}`;
                }
            }
        }
    },
    methods: {
        init() {},
        isIE(){
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                this.isIe = true;
            } else {
                this.isIe = false;
            }
            // console.log(this.isIe);
        },
        getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            if (!window.location.href.split("?")[1]) {
                return "";
            }
            var r = window.location.href.split("?")[1].match(reg);
            var context = "";
            if (r != null) {
                return context = decodeURIComponent(r[2]) || ""
            }
        },
        placeholder() {
            var JPlaceHolder = {
                //检测
                _check: function () {
                    return 'placeholder' in document.createElement('input');
                },
                //初始化
                init: function () {
                    if (!this._check()) {
                        var _this = this;
                        setTimeout(function () {
                            _this.fix();
                        }, 100);

                    }
                },
                //修复
                fix: function () {
                    jQuery('.el-input__inner:input[placeholder]').each(function (index, element) {
                        // jQuery(':input[placeholder]').each(function(index, element) {
                        var self = $(this),
                            txt = self.attr('placeholder');
                        // self.wrap($('<div></div>').css({ position: 'relative', zoom: '1', border: 'none', background: 'none', padding: 'none', margin: 'none' }));
                        var pos = self.position(),
                            h = self.outerHeight(true),
                            l = self.height(),
                            paddingleft = self.css('padding-left');
                        var holder = $('<span class="placeholder"></span>').text(txt).css({ position: 'absolute', left: pos.left, top: pos.top, height: h, lienHeight: l, paddingLeft: paddingleft, color: '#b2b2b2' }).appendTo(self.parent());
                        self.focusin(function (e) {
                            holder.hide();
                        }).focusout(function (e) {
                            if (!self.val()) {
                                holder.show();
                            }
                        });
                        holder.click(function (e) {
                            holder.hide();
                            self.focus();
                        });
                    });
                }
            };
            //执行
            JPlaceHolder.init();
            return JPlaceHolder;
        },
        //分页选择
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getListData();
        },
        //表格列表日期格式化
        dateFormat(row, column) {
            var date = row[column.property];
            if (date == undefined) {
                return "";
            }
            return moment(date).format("YYYY-MM-DD");
        },
        //表格列表日期格式化
        timeFormat(row, column) {
            var date = row[column.property];
            if (date == undefined) {
                return "";
            }
            return moment(date).format("YYYY-MM-DD HH:mm:ss");
        },
        //单个日期格式化
        FormatDate(data) {
            if (data == undefined) {
                return "";
            }
            return moment(data).format("YYYY-MM-DD");
        },
        //单个时间格式化
        FormatTime(data) {
            if (data == undefined) {
                return "";
            }
            return moment(data).format("YYYY-MM-DD HH:mm:ss");
        },
        goAuthentication(){
            this.dialogTips = false;
            let type = JSON.parse($.cookie('userinfo')).userType
            if(type == '01'){
                this.$router.push('/companyauthen');
            }else{
                this.$router.push('/personauthen');
            }
        },
        sureContinueSign(){
            this.dialogTips = false;
            this.$router.push({path: "/contractsign", query: {index: true}});
        },
        //放大缩小
        certEnlarge(val,type){
            var ind = this.ind;
            if(!this.certInfoList[ind].certificatePath||this.certInfoList[ind].certificatePath==""){
                return;
            }
            if(type){
                if(this.times<2&&val=='1'){
                    this.times+=0.05;
                }else if(this.times>0.25&&val=='-1'){
                    this.times-=0.05;
                }else if(val=='0'){
                    this.times=1;
                };
            }else{
                if(0.5>this.times>=0.25){
                    this.times = 0.25
                }else if(0.75>this.times>=0.5){
                    this.times = 0.5
                }else if(1>this.times>=0.75){
                    this.times = 0.75
                }else if(1.25>this.times>=1){
                    this.times = 1
                }else if(1.5>this.times>=1.25){
                    this.times = 1.25
                }else if(1.75>this.times>=1.5){
                    this.times = 1.5
                }else if(this.times>=1.75){
                    this.times = 1.75
                }
                if(this.times<2&&val=='1'){
                    this.times+=0.25;
                }else if(this.times>0.25&&val=='-1'){
                    this.times-=0.25;
                }else if(val=='0'){
                    this.times=1;
                };
            }
            var clientHeight = document.body.clientHeight-50-40;
            var clientWidth = document.body.clientWidth;
            var H = Math.round(clientHeight*this.times);
            var W = Math.round(clientWidth*this.times);
            var T = Math.round((H-clientHeight)/2);
            var L = Math.round((W-clientWidth)/2);
            this.times>1?$(".certList").animate({"height":H+"px","width":W+"px","top":-T+"px","left":-L+"px"},100):$(".certList").animate({"height":clientHeight+"px","width":"100%","top":0,"left":0},100);
            $(".certList img").animate({"height":H+"px"},100);
            var style = {"height":H,"width":W,"left":-L,"top":-T};
            $(".certList").attr("data-style",JSON.stringify(style));
        },
        changePicture(val){
            this.times = 1;
            if(val==0){
                this.ind--;
            }else if(val==1){
                this.ind++;
            }
            if(this.ind<0&&val==0){
                this.$message({
                    message: "已经是第一张了",
                    type: 'warning',
                    duration: 1500
                });
                this.ind = 0;
            }else if(this.ind>this.certInfoList.length-1&&val==1){
                this.$message({
                    message: "已经是最后一张了",
                    type: 'warning',
                    duration: 1500
                });
                this.ind = this.certInfoList.length-1;
            }else{
                this.nopicture = false;
                var ind = this.ind;
                if(!this.certInfoList[ind].certificatePath||this.certInfoList[ind].certificatePath==""){
                    this.nopicture = true;
                }
                this.certName = this.certInfoList[ind].certificateName
                this.sealsrc = this.certInfoList[ind].certificatePath;
                this.certEnlarge(0);
            }
        },
        delayFn(fn, timeout = 500) {
            return (...args) => {
                this.st && clearTimeout(this.st);
                this.st = setTimeout(() => {
                    fn.apply(null, args);
                }, timeout);
            }
        },
        pictureDrag(){
            var that = this;
            $(".certTrans").mousedown(function(e){
                var x = e.pageX; //获得鼠标指针离DIV元素左边界的距离
                var y = e.pageY; //获得鼠标指针离DIV元素上边界的距离
                var data = {"height":600,"width":600,"left":0,"top":0};
                if($(".certList").attr("data-style")){
                    var style = JSON.parse($(".certList").attr("data-style"));
                }else{
                    var style = data;
                }
                var divH = style.height;
                var divW = style.width;
                var moveL,moveT;
                $(document).bind("mousemove", function(ev){
                    var clientHeight = document.body.clientHeight-50-40;
                    var clientWidth = document.body.clientWidth;
                    var _x = ev.pageX - x; //获得X轴方向移动的值
                    var _y = ev.pageY - y; //获得Y轴方向移动的值
                    moveL = style.left + _x;
                    moveT = style.top + _y;
                    moveL = moveL >=0?0:moveL;
                    moveL = moveL <(clientWidth-divW)?(clientWidth-divW):moveL;
                    moveT = moveT>=0?0:moveT;
                    moveT = moveT<clientHeight-divH?clientHeight-divH:moveT;
                    if(that.times>1){
                        $(".certList").animate({
                            left: moveL + "px",
                            top: moveT + "px"
                        }, 10);
                    }
                })
                $(document).mouseup(function() {
                    var style = {"height":divH,"width":divW,"left":moveL,"top":moveT};
                    $(".certList").attr("data-style",JSON.stringify(style));
                    $(this).unbind("mousemove");
                })
            })
            $('.certTrans').on('mousewheel', function(event) {
                if(event.deltaY>0){//放大
                    that.certEnlarge("1",true)
                }else if(event.deltaY<0){
                    that.certEnlarge("-1",true)
                }
            });
        }

    }
};
