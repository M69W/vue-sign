import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import '../../../static/js/nc22.js';
import '../../assets/css/VueDraggableResizable.css';
import base from "./base";
// 注册全局
var infiniteScroll = require('vue-infinite-scroll');
Vue.use(infiniteScroll);
Vue.use(base);

window.eventBus = new Vue();
import VueDND from 'awe-dnd';
Vue.use(VueDND);

Vue.prototype.bus = new Vue();
Vue.prototype.$updateUKeyDriveName = '安印Windows本地综合服务V2.0.0.5.rar';
// Vue.prototype.$updateUKeyDriveUrl = 'http://qn1.i-yin.com.cn/sign_iyin_html/rar/%E5%AE%89%E5%8D%B0Windows%E6%9C%AC%E5%9C%B0%E7%BB%BC%E5%90%88%E6%9C%8D%E5%8A%A1V2.0.0.5.rar'
Vue.prototype.$updateUKeyDriveUrl =
    'http://www.i-yin.com.cn/index.php?c=article&a=type&tid=168';

Vue.prototype.$domain = '';
// if(process.env.NODE_ENV === 'development'){
//     Vue.prototype.$domain = '';
// }else{
//     let domain = window.location.hostname;
//     if(domain.indexOf('.sign.oa.com') != -1){
//         Vue.prototype.$domain = 'sign.oa.com';
//     }else if(domain.indexOf('.sign.i-yin.com.cn') != -1){
//         Vue.prototype.$domain = 'sign.i-yin.com.cn';
//     }else{
//         Vue.prototype.$domain = domain;
//     }
// }

Vue.prototype.$updateUKeyDrive = function() {
    this.$confirm(
        '为了更好的使用我们产品，请您安装/更新最新驱动程序',
        '最新驱动',
        {
            confirmButtonText: '下载更新',
            cancelButtonText: '知道了',
            type: 'warning',
            customClass: 'self-icon icon-drive'
        }
    ).then(() => {
        // const download = document.createElement('a');
        // // download.download = this.$updateUKeyDriveName;
        // download.style.display = 'none';
        // try {
        //     download.href = this.$updateUKeyDriveUrl;
        // } catch (e) {}
        // document.body.appendChild(download);
        // download.click();
        // document.body.removeChild(download);
        	this.$store.commit('downVisibleChange', true);
        })
    .catch(() => {});
};

new Vue({
    el: '.app',
    store,
    router,
    template: '<App/>',
    components: { App },
    data() {
        return {
            eventHub: new Vue()
        };
    }
});
