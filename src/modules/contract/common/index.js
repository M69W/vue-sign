/**
 * 登陆密码（并不是注册，登陆与生产运维一致）
 * */
export const isLoginPsw = function (psw) {
    const reg = /^[0-9a-zA-Z]{8,20}$/;
    return reg.test(psw);
};
/**
 * 手机码验证
 * */
export const isphone = function (phone) {
    const reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
    return reg.test(phone);
};

/**
 * 电话号码验证
 * */
export const isTel = function (tel) {
    const reg = /^([0\+]\d{2,3}-)?(\d{3,4}-)?\d{7,8}(-(\d{1,}))?$/;
    return reg.test(tel);
};

// 邮箱验证
export const isEmail = function (email) {
    const reg = /^([a-z0-9A-Z]+[-|_|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    return reg.test(email);
};

// 身份证号码验证
//大陆： 首位非零+5位数字+ 年份前两位18|19|  2 3 \d +年份后两位数字+月份01-09|11-12+日期01-29|10|20|30|31+三位数字+结尾最有一位数字0-9|X|x
export const isIDCard = function (isIDCard) {
    const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
    return reg.test(isIDCard);
};

// 香港身份证号码验证
export const isIDCardHk = function (isIDCard) {
    // const reg = /[A-Z]{1,2}[0-9]{6}([0-9A])/;
    const reg = /[A-Z]{1,2}[0-9]{6}(\([0-9A]\))/;
    return reg.test(isIDCard);
};

// 澳门身份证号码验证
export const isIDCardMc = function (isIDCard) {
    const reg = /^[1|5|7][0-9]{6}\([0-9Aa]\)/;
    return reg.test(isIDCard);
};

// 台湾身份证号码验证
export const isIDCardTw = function (isIDCard) {
    const reg = /^[A-Z][0-9]{9}$/;
    return reg.test(isIDCard);
};

//台湾大陆通行证
export const isIDCardTWIn = function (isIDCard) {
    const reg = /^(\d{8}|[a-zA-Z0-9]{10}|\d{18})$/;
    return reg.test(isIDCard);
};

// 过滤emoji表情
export const filterEmoji = function (val) {
    const reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
    return val.replace(reg, "");
};
