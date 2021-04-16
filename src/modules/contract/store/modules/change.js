export default {
    state: {
        isLogin: false,
        downVisible: false,
        guideStep: localStorage.getItem('guideStep') || ''
    },
    mutations: {
        updateChange(state, valObj) {
            for (let key in valObj) {
                state[key] = valObj[key];
            }
        },
        downVisibleChange(state, val){
            state.downVisible = val;
        },
        changeGuideStep(state, val){
            state.guideStep = val;
        }
    },
    actions: {},
    getters: {}
}
