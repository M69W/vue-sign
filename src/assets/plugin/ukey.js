import service from "../mixin/service";
export default {
    mixins: [service],
    data() {
        return {
            ukey: null,
            KeyManage: null,
            isAvailableUkey: true,
            ukeylist: [],
            PINResult: null,
            ctx: "http://127.0.0.1:9825/"
        };
    },
    mounted() {
        this.ukeyInit();
    },
    methods: {
        ukeyInit() {
            // 这里就是注册表中CLSID文件夹根目录的文件夹名称
            try {
                var ActiveXObject = window.ActiveXObject;
                console.log(ActiveXObject);
                this.ukey =
                    ActiveXObject !== undefined &&
                    new ActiveXObject("IYIN_SIGNACTIVE.IYIN_SignActiveCtrl.1");
                this.KeyManage = new ActiveXObject("KeyManage.ConnManage.1");
                this.SealWrite = new ActiveXObject("SEALWRITE.SealWriteCtrl.1");
            } catch (e) {
                if (ActiveXObject === undefined) {
                    this.isAvailableUkey = false;
                } else {
                    console.log("uninstall KeyManage");
                }
            }
        },
        issupport() {
            if (!this.isAvailableUkey || !this.ukey) {
                this.tip("请插入ukey并安装驱动后在IE浏览器下使用");
                return false;
            }
            console.log(this.isAvailableUkey);
            console.log(this.ukey);
            return true;
        },
        tip(text) {
            this.$message({
                message: text,
                type: "error",
                duration: 2000
            });
        },
        //获取随机数
        randomNum(esealCode) {
            return this.getRandomNum({
                esealCode: esealCode
            }).done(function(data) {}).responseJSON.data;
        },
        //获取所有ukey名（数组）
        getukeyNames() {
            var that = this;
            console.log(this.ukey);
            if (this.issupport()) {
                var nCount = that.ukey.GetCertCount();
                this.ukeylist = [];
                for (var i = 0; i < nCount; i++) {
                    that.ukey.SetCertIndex(i); //获取第几个ukey
                    this.ukeylist[i] = {};
                    this.ukeylist[i].value = i.toString();
                    this.ukeylist[i].id = i;
                    this.ukeylist[i].label = that.ukey.GetCertInfo(0);
                }
                if (this.ukeylist.length <= 0) {
                    this.tip("暂无印章数据，请插入UKEY进行读取");
                } else {
                    return this.ukeylist;
                }
            }
        },
        getCertCountNew() {},
        getKeyID(selectukeyInd) {
            //获取设备id/sn
            if (this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetKeyID();
            }
        },
        // 获取证书名称
        getCertName(selectukeyInd) {
            if (this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertInfo(0);
            }
        },
        getCertSignSN(selectukeyInd) {
            //获取签名证书序列号
            if (this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertInfo(10);
            }
        },
        trustId(selectukeyInd) {
            //GDCA 信任号；
            if (this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertInfo(12);
            }
        },
        getCertEncSN(selectukeyInd) {
            //获取加密证书序列号
            if (this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertInfo(11);
            }
        },
        dCertPublicKey(selectukeyInd) {
            //数字加密证书公钥；
            if (selectukeyInd !== undefined && this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertInfo(9);
            }
        },
        PIN(val, selectukeyInd) {
            // 验证PIN密码
            if (val && this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.SetCertPin(val); //Boolean
            }
        },
        dSignature(selectukeyInd, randomNum) {
            //客服端数字签名；
            if (randomNum && this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.Signature(randomNum, randomNum.length);
            }
        },
        dCertificate(selectukeyInd) {
            //数字加密证书；
            if (selectukeyInd !== undefined && this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertData(1);
            }
        },
        getSignatureCert(selectukeyInd) {
            //签名证书
            if (selectukeyInd !== undefined && this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertData(0);
            }
        },
        esealCode(val, selectukeyInd) {
            //印章编码
            var checkResult = null;
            if (this.PIN(val, selectukeyInd)) {
                this.ukey.SetCertIndex(selectukeyInd);
                checkResult = this.ukey.SetCertPin(val);
            }
            return this.ukey.GetCertInfo(3);
        },
        esealstartDate(selectukeyInd) {
            //印章有效起始期
            if (selectukeyInd !== undefined && this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertInfo(5);
            }
        },
        esealendDate(selectukeyInd) {
            //印章有效终止期
            if (selectukeyInd !== undefined && this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertInfo(6);
            }
        },
        //获取证书厂商
        certificateFirms: function(selectukeyInd) {
            if (selectukeyInd !== undefined && this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                //var arrKeyOEM = new Array("GDCA","NETCA","SZCA","BJCA","未知");
                //1.GDCA、2.NETCA、3.SZCA、4.BJCA
                return this.ukey.GetCertInfo(7) - 0 + 1;
            }
        },
        getCertType(selectukeyInd) {
            //1==ODC OR 0==IYIN
            if (selectukeyInd !== undefined && this.issupport()) {
                //this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertInfo(2);
            }
        },
        CertType(selectukeyInd) {
            //个人or机构==0
            if (selectukeyInd !== undefined && this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertInfo(4);
            }
        },
        // ConnectKey(dwKeyIndex, bandRates) {//检测ukey
        //     //console.log(JSON.stringify())
        //     return this.KeyManage.ConnectKey()
        // },
        SetPIN(PassWord) {
            if (this.issupport()) {
                return this.KeyManage.SetPIN(PassWord);
            }
        },
        ChangePin(PINType, oldPIN, newPIN) {
            if (this.issupport()) {
                return this.KeyManage.ChangePin(PINType, oldPIN, newPIN);
            }
        },
        GetKeyID(PassWord) {
            if (this.issupport()) {
                return this.KeyManage.GetKeyID();
            }
        },
        //获取Oid
        GetOid(selectukeyInd) {
            if (selectukeyInd !== undefined && this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertInfo(1);
            }
        },
        GetenterpriseCode(selectukeyInd) {
            //获取组织机构代码
            if (selectukeyInd !== undefined && this.issupport()) {
                this.ukey.SetCertIndex(selectukeyInd);
                return this.ukey.GetCertInfo(8);
            }
        },
        //写入章模
        WriteSignDataToKey(WriteSignDataToKeyText) {
            if (this.issupport()) {
                return this.KeyManage.WriteSignDataToKey(
                    WriteSignDataToKeyText
                );
            }
        },
        GetSealDataFromKey() {
            //ODC印章数据结构
            if (this.issupport()) {
                var pwd = prompt("请输入KEY的PIN码", "111111");
                var ispin = this.PIN(pwd, 0);
                this.SealWrite.SetKeyIndex(0);
                var setpin = this.SetPIN(ispin);
                return this.SealWrite.GetSealDataFromKey();
            }
        },
        GetSealImageByStr() {
            //SealHeight
            if (this.issupport()) {
                return this.SealWrite.GetSealImageByStr();
            }
        },
        SealHeight() {
            //SealHeight
            if (this.issupport()) {
                return this.SealWrite.SealHeight;
            }
        },
        SetSealImage(base, baselen) {
            //SealHeight
            if (this.issupport()) {
                return this.SealWrite.SetSealImage(base, baselen);
            }
        },
        SealWriteAttr() {
            //写入netca属性
            if (this.issupport()) {
                return this.SealWrite;
            }
        },
        ListKey() {
            //签章时获取ukey列表
            var sign = document.getElementById("sign");
            if (sign.ListKey) {
                return sign.ListKey();
            } else {
                this.tip("UKey驱动程序异常，请重新安装");
                return false;
            }
        },
        LoginKey(index, pin) {
            //签章之前登录
            var sign = document.getElementById("sign");
            return sign.LoginKey(index, pin);
        },
        SignSingle(page, posx, posy, pdf) {
            //单页签章
            var sign = document.getElementById("sign");
            return sign.SignSingle(page, posx, posy, pdf);
        },
        SignMulti(pageBegin, pageEnd, posx, posy, pdf) {
            var sign = document.getElementById("sign");
            return sign.SignMulti(pageBegin, pageEnd, posx, posy, pdf);
        },
        SignPaging(pageBegin, pageEnd, part, leftOrRight, posy, pdf) {
            var sign = document.getElementById("sign");
            return sign.SignPaging(
                pageBegin,
                pageEnd,
                part,
                leftOrRight,
                posy,
                pdf
            );
        }
    }
};
