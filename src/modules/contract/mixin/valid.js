import {
    isIDCard,
    isIDCardHk,
    isIDCardMc,
    isIDCardTw,
    isIDCardTWIn,
} from "../common";
export default {
    mixins: [],
    data() {
        return {};
    },
    mounted() {},
    methods: {
        //汉字验证
        checkNames(rule, value, callback) {
            let reg = /^[\u4E00-\u9FFF]+$/; //不含符号
            if (!reg.test(value)) {
                callback(new Error("仅可编写汉字"));
            } else {
                callback();
            }
        },
        //不含空格校验
        checkSpace(rule, value, callback) {
            let reg = /^\S+$/;
            if (!reg.test(value)) {
                callback(new Error("输入内容不能包含空格"));
            } else {
                callback();
            }
        },
        //密码校验
        checkPasswords(rule, value, callback) {
            // let reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
            // 8-20位数字和字母
            let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
            if (!value) {
                callback(new Error("密码不能为空"));
            } else if (!reg.test(value)) {
                callback(new Error("请设置8~20位字母+数字为密码"));
            } else {
                callback();
            }
        },
        //电话和手机号同时验证
        checkTel(rule, value, callback) {
            let tel = /^(((\d3,4|0\d{2,3}-|\s)?\d{7,8})|(1[3-9][0-9]{9}))$/;
            if (!tel.test(value)) {
                callback(new Error("请输入正确的电话，固话区号后请加“-”"));
            } else {
                callback();
            }
        },
        checkTelphone(rule, value, callback) {
            if (!/^1[3-9][0-9]{9}$/.test(value)) {
                return callback(new Error("请输入正确的手机号码"));
            }
            callback();
        },
        //检测身份证
        checkIdCard(rule, value, callback) {
            console.log(
                isIDCard(value),
                isIDCardHk(value),
                isIDCardMc(value),
                isIDCardTw(value),
                isIDCardTWIn(value)
            );
            if (
                isIDCard(value) ||
                isIDCardHk(value) ||
                isIDCardMc(value) ||
                isIDCardTw(value) ||
                isIDCardTWIn(value)
            ) {
                callback();
            } else {
                callback(new Error("请输入正确的身份证号码"));
            }
        },
        //账户名检验
        validAccoutName(rule, value, callback) {
            if (/^[a-zA-Z0-9]{6,20}$/.test(value)) {
                callback();
            } else {
                callback(new Error("请输入英文字母或数字"));
            }
        },
        //统一社会信用代码
        checkUniformCreditCode(rule, value, callback) {
            if (/^[A-Z0-9]{18}$/.test(value)) {
                callback();
            } else {
                callback(new Error("请输入正确的统一社会信用代码"));
            }
        },
        //企业名检验
        checkEnterpriseName(rule, value, callback) {
            var flag = false;
            for (var i = 0; i < value.length; i++) {
                var val = value.charAt(i);
                if (isNaN(parseInt(val))) {
                    flag = true;
                } else {
                    flag = false;
                    break;
                }
            }
            if (flag && value.replace(/(^\s*)|(\s*$)/g, "").length != 0) {
                callback();
            } else {
                callback(new Error("请输入正确的企业名称"));
            }
        },
        //联系人检验
        checkLinkName(rule, value, callback) {
            var flag = false;
            for (var i = 0; i < value.length; i++) {
                var val = value.charAt(i);
                if (isNaN(parseInt(val))) {
                    flag = true;
                } else {
                    flag = false;
                    break;
                }
            }
            if (flag && value.replace(/(^\s*)|(\s*$)/g, "").length != 0) {
                callback();
            } else {
                callback(new Error("请输入正确的联系人姓名"));
            }
        },
    },
};
