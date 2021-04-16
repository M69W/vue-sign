// import selectBankInput from "@/components/selectBankInput";
import * as filters from "./filters";
const components = {};
const install = function (Vue) {
    for (let key in components) {
        Vue.component(key, components[key]);
    }
    //加载过滤器
    Object.keys(filters).forEach((key) => {
        Vue.filter(key, filters[key]);
    });
};
export default { install };
