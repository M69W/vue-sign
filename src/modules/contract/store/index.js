import Vue from "vue";
import Vuex from "vuex";
import change from "./modules/change";
import message from "./modules/message";
import company from "./modules/company";
import getters from "./getters";
Vue.config.productionTip = false; //去掉开发模式console
Vue.use(Vuex);
export default new Vuex.Store({
    actions: {},
    mutations: {},
    getters,
    modules: {
        change,
        message,
        company
    }
});
