import { sessionStore } from "@/utils";
import apiMethods from "@/assets/mixin/service";
export default {
    state: {
        companyPhone: sessionStore.get("companyPhone") || "", //公司手机号码
    },
    mutations: {
        SET_CPHONE(state, companyPhone) {
            if (companyPhone) {
                state.companyPhone = companyPhone;
                sessionStore.set("companyPhone", companyPhone); //
            }
        },
        UPDATE_USER(state, data) {
            let userinfo = JSON.stringify({
                loginName: res.data.loginName,
                enterPriseName: res.data.extEnterpriseName,
                accountId: res.data.accountId,
                enterpriseId: res.data.currentPersonalIdOrEnterpriseId,
                userId: res.data.userId,
                currentUserId: res.data.userId,
                userType: res.data.userType, //01：企业用户；02：个人用户
                realNameAuthenticationFlag: res.data.realNameAuthenticationFlag, //是否实名认证（0：未认证，1：认证）
                enterpriseInfoList: res.data.enterpriseInfoList,
                isMainAccount: "1",
            });
            let userinfo = JSON.stringify(data);
            $.cookie("userinfo", userinfo, {
                path: "/",
                domain: this.$domain,
            });
        },
    },
    actions: {
        // GET_NEWUSER({ commit }, userInfo) {
        //     apiMethods.methods.enterpriseDetail(data).then((res) => {
        //         if (apiMethods.methods.successCheckCode(res)) {
        //             let userinfo = JSON.stringify({
        //                 loginName: res.data.loginName,
        //                 enterPriseName: res.data.extEnterpriseName,
        //                 accountId: res.data.accountId,
        //                 enterpriseId: res.data.currentPersonalIdOrEnterpriseId,
        //                 userId: res.data.userId,
        //                 currentUserId: res.data.userId,
        //                 userType: res.data.userType, //01：企业用户；02：个人用户
        //                 realNameAuthenticationFlag:
        //                     res.data.realNameAuthenticationFlag, //是否实名认证（0：未认证，1：认证）
        //                 enterpriseInfoList: res.data.enterpriseInfoList,
        //                 isMainAccount: "1",
        //             });
        //         }
        //     });
        // },
    },
    getters: {},
};
