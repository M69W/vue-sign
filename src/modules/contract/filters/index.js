import { accAdd, accSub, accMul, accDiv } from "huaji-calculate";
import moment from "moment";
//实名审核--审核状态
export function changeAuditStatus(type) {
    let str = "";
    switch (type) {
        case 1:
            str = "待审核";
            break;
        case 2:
            str = "待扫脸";
            break;
        case 3:
            str = "已通过";
            break;
        case 4:
            str = "驳回";
            break;
    }
    return str;
}

//价格保留后两位 不四舍五入
export function changePrice(price) {
    if (typeof price == "number") {
        // let s = (accMul(Number(price), 10000) / 10000).toFixed(2);
        let s = Math.floor(accMul(Number(price), 100)) / 100;
        return s;
    } else if (typeof price == "string") {
        return price;
    }
}

export function changeReceiveTime(time) {
    if (time) {
        return moment(time).format("YYYY-MM-DD");
    }
}
