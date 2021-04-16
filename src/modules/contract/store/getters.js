const getters = {
    hasMsg: state => state.message.hasMsg, //vuex全局挂载 是否有消息flag
    companyPhone: state => state.company.companyPhone //vuex全局挂载 是否有消息flag
};
export default getters;
