import { sessionStore } from "@/utils";
export default {
    state: {
        hasMsg: sessionStore.get("hasMsg") || "false" //是否有消息
    },
    mutations: {
        SET_HASMSG(state, notRead) {
            if (notRead == 1) {
                state.hasMsg = "true";
                sessionStore.set("hasMsg", true); //这样设置请查考sessionStore对象
            } else {
                state.hasMsg = "false";
                sessionStore.set("hasMsg", false);
            }
        },
        DEL_MSG(state) {
            state.hasMsg = "false";
            sessionStore.set("hasMsg", false);
        }
    },
    actions: {},
    getters: {}
};
