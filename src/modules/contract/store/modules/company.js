import { sessionStore } from "@/utils";
export default {
    state: {
        companyPhone: sessionStore.get("companyPhone") || "" //公司手机号码
    },
    mutations: {
        SET_CPHONE(state, companyPhone) {
            if (companyPhone) {
                state.companyPhone = companyPhone;
                sessionStore.set("companyPhone", companyPhone); //
            }
        }
    },
    actions: {},
    getters: {}
};
