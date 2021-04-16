import Vue from "vue";
import Router from "vue-router";
const main = () => import("../components/main");
const login = () => import("../components/login");
const index = () => import("../components/index");
const contractlist = () => import("../components/contractlist"); //合同管理
const contractsign = () => import("../components/contractsign");
const contractprocess = () => import("../components/contractprocess");
const contractsignature = () => import("../components/contractsignature");
const contractmore = () => import("../components/contractmore");
const sealmanage = () => import("../components/sealmanage");
const usercenter = () => import("../components/usercenter");
const mysign = () => import("../components/mysign");
const myseal = () => import("../components/myseal");
const ukeyorder = () => import("../components/ukeyorder");
const loginfo = () => import("../components/loginfo");
// const list = ()=>import("../components/list");
const register = () => import("../components/register");
const addcloudsign = () => import("../components/addcloudsign"); //印章管理--我的签名--添加云签名
const addukeysign = () => import("../components/addukeysign"); //印章管理--我的签名--添加ukey签名
const init = () => import("../components/init");
const orderconfirm = () => import("../components/orderconfirm"); //印章管理--我的签名--添加ukey签名--ukey订单确认
const orderpay = () => import("../components/orderpay"); //印章管理--我的签名--添加ukey签名--ukey订单支付
const costmanager = () => import("../components/costmanager");
const couponmanage = () => import("../components/coupon/couponManage"); //我的优惠券管理
const contactmanager = () => import("../components/contactmanager");
const accountmanager = () => import("../components/accountmanager");
const authentication = () => import("../components/authentication");
const orderpayresult = () => import("../components/orderpayresult");
const ukeyrenew = () => import("../components/ukeyrenew"); // 印章管理--我的签名--ukey签名续期
const ukeyrenewpay = () => import("../components/ukeyrenewpay");
const renewpayresult = () => import("../components/renewpayresult");
const ukeyrenewupdate = () => import("../components/ukeyrenewupdate");
const renewupdateresult = () => import("../components/renewupdateresult");
const cancelreport = () => import("../components/cancelreport"); // 印章管理--我的签名--取消挂失
const orderdetail = () => import("../components/orderdetail"); // 印章管理--ukey订单--查看订单
const addseal = () => import("../components/addseal"); // 印章管理--电子印章--添加印章
const addukeysealinfo = () => import("../components/addukeysealinfo"); // 印章管理--电子印章--添加印章--补全资料
const addukeylist = () => import("../components/addukeylist"); // 印章管理--电子印章--添加印章--添加印章列表
// const addukeyread = () => import("../components/addukeyread"); // 印章管理--电子印章--添加印章--用户责任书
const charactermanagers = () => import("../components/charactermanagers"); // 角色管理
const charactermanageradd = () => import("../components/charactermanageradd"); // 角色管理--创建角色
const accountmanagers = () => import("../components/accountmanagers"); // 账号管理
const messageManage = () => import("../components/messageManage/messageManage"); // 账号管理--消息中心
const messageDetail = () => import("../components/messageManage/messageDetail"); // 账号管理--消息中心
const newbieGuide = () => import("../components/newbieGuide");
const demo = () => import("../components/demo");
const agreement = () => import("../components/agreement");
const setmeal = () => import("../components/setmeal");
const packpay = () => import("../components/packpay");
const packpayresult = () => import("../components/packpayresult");
const ukeydetails = () => import("../components/ukeydetails");
const ukeyactivate = () => import("../components/ukeyactivate");
const alipayNotifyReturn = () => import("../components/alipayNotifyReturn");
const UserStatistics = () => import("../components/UserStatistics");
const downPage = () => import("../components/downPage");
const ukeylogin = () => import("../components/ukeylogin");
const manualAudit = () => import("../components/manualAudit");
//ukeyManage
const ukeysealmanage = () => import("../components/ukeysealmanage");

// 模板管理
const templatemanage = () => import("../components/tmpManage/templatemanage"); // 模板列表
const wordTemplate = () => import("../components/tmpManage/wordTemplate"); // 编辑模板
const contractTemplateStep1 = () =>
    import("../components/tmpManage/contractTemplateStep1"); // 新建/编辑模板第一步
const fillTemplate = () => import("../components/tmpManage/fillTemplate"); // 填写模板
const setSignProcess = () => import("../components/tmpManage/setSignProcess"); // 设置签署流程
const templatedown = () => import("../components/tmpManage/templatedown"); // 模板下载
const templatedetail = () => import("../components/tmpManage/templatedetail"); // 模板下载详情

const invitation = () => import("../components/invitation/invitation");
const inviteLand = () => import("../components/invitation/landing");

// demo
const vueDraggableResizable = () =>
    import("../components/demo/vue-draggable-resizable");

Vue.use(Router);
export default new Router({
    routes: [
        {
            path: "/demo",
            component: demo,
            name: "demo",
            meta: { title: "demo" },
        },
        {
            path: "/vue-draggable-resizable",
            component: vueDraggableResizable,
            name: "vue-draggable-resizable",
            meta: { title: "vueDraggableResizable" },
        },
        {
            path: "/fillTemplate",
            component: fillTemplate,
            name: "fillTemplate",
            meta: { title: "填写模板" },
        },
        {
            path: "/newbieGuide",
            component: newbieGuide,
            name: "newbieGuide",
            meta: { title: "新手指引" },
        },
        {
            path: "/login",
            component: login,
            name: "login",
            meta: { title: "登录", parentPath: "/login" },
        },
        {
            path: "/ukeylogin",
            component: ukeylogin,
            name: "ukeylogin",
            meta: { title: "续期登录", parentPath: "/ukeylogin" },
        },
        {
            path: "/register",
            component: register,
            name: "register",
            meta: { title: "用户注册", parentPath: "/register" },
        },
        {
            path: "/personinit",
            component: init,
            name: "personinit",
            meta: { title: "UKey账户绑定", parentPath: "/personinit" },
        },
        {
            path: "/companyinit",
            component: init,
            name: "companyinit",
            meta: { title: "UKey账户绑定", parentPath: "/companyinit" },
        },
        {
            path: "/forgetpsd",
            component: register,
            name: "forgetpsd",
            meta: { title: "找回密码", parentPath: "/forgetpsd" },
        },
        {
            path: "/UserStatistics",
            component: UserStatistics,
            name: "UserStatistics",
            meta: { title: "用户统计" },
        },
        {
            path: "/",
            component: main,
            name: "",
            meta: { title: "首页", parentPath: "/index" },
            children: [
                {
                    path: "/",
                    component: index,
                    name: "",
                    meta: { title: "首页", parentPath: "/index" },
                },
                {
                    path: "/index",
                    component: index,
                    name: "index",
                    meta: { title: "首页", parentPath: "/index" },
                },
                {
                    path: "/contractlist",
                    component: contractlist,
                    name: "contractlist",
                    meta: { title: "合同管理", parentPath: "/contractlist" },
                },
                {
                    path: "/contractsign",
                    component: contractsign,
                    name: "contractsign",
                    meta: { title: "创建合同", parentPath: "/contractlist" },
                },
                {
                    path: "/contractprocess",
                    component: contractprocess,
                    name: "contractprocess",
                    meta: { title: "签署流程", parentPath: "/contractlist" },
                },
                {
                    path: "/setSignProcess",
                    component: setSignProcess,
                    name: "setSignProcess",
                    meta: {
                        title: "设置签署流程-使用模板",
                        parentPath: "/contractlist",
                    },
                },
                {
                    path: "/templatemanage",
                    component: templatemanage,
                    name: "templatemanage",
                    meta: { title: "模板管理", parentPath: "/templatemanage" },
                },
                {
                    path: "/contractTemplateStep1",
                    component: contractTemplateStep1,
                    name: "contractTemplateStep1",
                    meta: { title: "新建模板", parentPath: "/templatemanage" },
                },
                {
                    path: "/wordTemplate",
                    component: wordTemplate,
                    name: "wordTemplate",
                    meta: { title: "编辑模板", parentPath: "/wordTemplate" },
                },
                {
                    path: "/templatedown",
                    component: templatedown,
                    name: "templatedown",
                    meta: { title: "模板下载", parentPath: "/templatemanage" },
                },
                {
                    path: "/templatedetail",
                    component: templatedetail,
                    name: "templatedetail",
                    meta: {
                        title: "模板下载详情",
                        parentPath: "/templatemanage",
                    },
                },
                {
                    path: "/sealmanage",
                    component: sealmanage,
                    name: "sealmanage",
                    meta: { title: "印章管理", parentPath: "/sealmanage" },
                    children: [
                        {
                            path: "/mysign",
                            component: mysign,
                            name: "mysign",
                            meta: {
                                title: "我的签名",
                                parentPath: "/sealmanage",
                            },
                        },
                        {
                            path: "/myseal",
                            component: myseal,
                            name: "myseal",
                            meta: {
                                title: "电子印章",
                                parentPath: "/sealmanage",
                            },
                        },
                        {
                            path: "/ukeyorder",
                            component: ukeyorder,
                            name: "ukeyorder",
                            meta: {
                                title: "Ukey订单",
                                parentPath: "/sealmanage",
                            },
                        },
                        {
                            path: "/addcloudsign",
                            component: addcloudsign,
                            name: "addcloudsign",
                            meta: {
                                title: "添加云签名",
                                parentPath: "/sealmanage",
                            },
                        },
                        {
                            path: "/addukeysign",
                            component: addukeysign,
                            name: "addukeysign",
                            meta: {
                                title: "添加Ukey签名",
                                parentPath: "/sealmanage",
                            },
                        },
                        // {
                        //     path: "/addukeysealinfo",
                        //     component: addukeysealinfo,
                        //     name: "addukeysealinfo",
                        //     meta: {
                        //         title: "添加Ukey印章",
                        //         parentPath: "/sealmanage"
                        //     }
                        // },
                        {
                            path: "/orderdetail",
                            component: orderdetail,
                            name: "orderdetail",
                            meta: {
                                title: "Ukey订单详情",
                                parentPath: "/sealmanage",
                            },
                        },
                        {
                            path: "/ukeyrenewaldetails",
                            component: ukeydetails,
                            name: "ukeyrenewaldetails",
                            meta: {
                                title: "UKey续期订单详情",
                                parentPath: "/sealmanage",
                            },
                        },
                        {
                            path: "/addseal",
                            component: addseal,
                            name: "addseal",
                            meta: {
                                title: "添加云印章",
                                parentPath: "/sealmanage",
                            },
                        },
                        {
                            path: "/editseal",
                            component: addseal,
                            name: "editseal",
                            meta: {
                                title: "修改云印章",
                                parentPath: "/sealmanage",
                            },
                        },
                        // {
                        //     path: "/addukeyseal",
                        //     component: addseal,
                        //     // component: addukeysealinfo,
                        //     name: "addukeyseal",
                        //     meta: {
                        //         title: "添加Ukey印章",
                        //         parentPath: "/sealmanage"
                        //     }
                        // }
                    ],
                },
                {
                    path: "/ukeysealmanage",
                    component: ukeysealmanage,
                    name: "ukeysealmanage",
                    meta: {
                        title: "UKEY印章管理",
                        parentPath: "/ukeysealmanage",
                    },
                    children: [
                        {
                            path: "/addukeyseal",
                            component: addukeysealinfo,
                            // component: addseal,
                            name: "addukeyseal",
                            meta: {
                                title: "添加企业信息",
                                parentPath: "/sealmanage",
                            },
                        },
                        {
                            path: "/addukeylist",
                            component: addukeylist,
                            // component: addseal,
                            name: "addukeylist",
                            meta: {
                                title: "添加印章列表",
                                parentPath: "/sealmanage",
                            },
                        },
                    ],
                },
                {
                    path: "/usercenter",
                    component: usercenter,
                    name: "usercenter",
                    meta: { title: "用户中心", parentPath: "/usercenter" },
                    children: [
                        {
                            path: "/costmanager",
                            component: costmanager,
                            name: "costmanager",
                            meta: {
                                title: "费用管理",
                                parentPath: "/usercenter",
                            },
                        },
                        {
                            path: "/couponmanage",
                            component: couponmanage,
                            name: "couponmanage",
                            meta: {
                                title: "我的优惠券",
                                parentPath: "/usercenter",
                            },
                        },
                        {
                            path: "/contactmanager",
                            component: contactmanager,
                            name: "contactmanager",
                            meta: {
                                title: "联系人管理",
                                parentPath: "/usercenter",
                            },
                        },
                        {
                            path: "/accountmanager",
                            component: accountmanager,
                            name: "accountmanager",
                            meta: {
                                title: "账户管理",
                                parentPath: "/usercenter",
                            },
                        },
                        {
                            path: "/loginfo",
                            component: loginfo,
                            name: "loginfo",
                            meta: {
                                title: "签章记录",
                                parentPath: "/usercenter",
                            },
                        },
                        {
                            path: "/ukeydetails",
                            component: ukeydetails,
                            name: "ukeydetails",
                            meta: {
                                title: "UKey续期订单详情",
                                parentPath: "/usercenter",
                            },
                        },
                        {
                            path: "/ukeyorderdetail",
                            component: orderdetail,
                            name: "ukeyorderdetail",
                            meta: {
                                title: "Ukey订单详情",
                                parentPath: "/usercenter",
                            },
                        },
                        {
                            path: "/charactermanagers",
                            component: charactermanagers,
                            name: "charactermanagers",
                            meta: {
                                title: "角色管理",
                                parentPath: "/usercenter",
                            },
                        },
                        {
                            path: "/charactermanageradd",
                            component: charactermanageradd,
                            name: "charactermanageradd",
                            meta: {
                                title: "角色创建",
                                parentPath: "/usercenter",
                            },
                        },
                        {
                            path: "/accountmanagers",
                            component: accountmanagers,
                            name: "accountmanagers",
                            meta: {
                                title: "账号管理",
                                parentPath: "/usercenter",
                            },
                        },
                        {
                            path: "/messageManage",
                            component: messageManage,
                            name: "messageManage",
                            meta: {
                                title: "消息中心列表",
                                parentPath: "/usercenter",
                            },
                        },
                        {
                            path: "/messageDetail",
                            component: messageDetail,
                            name: "messageDetail",
                            meta: {
                                title: "消息中心详情",
                                parentPath: "/usercenter",
                                indexPath: "/messageManage",
                            },
                        },
                        {
                            path: "/invitation",
                            component: invitation,
                            name: "invitation",
                            meta: {
                                title: "/邀请好友",
                                parentPath: "/usercenter",
                            }
                        }
                    ],
                },
                {
                    path: "/orderconfirm",
                    component: orderconfirm,
                    name: "orderconfirm",
                    meta: { title: "UKEY订单确认", parentPath: "/sealmanage" },
                },
                {
                    path: "/sealorderconfirm",
                    component: orderconfirm,
                    name: "sealorderconfirm",
                    meta: { title: "UKEY订单确认", parentPath: "/sealmanage" },
                },
                {
                    path: "/orderpay",
                    component: orderpay,
                    name: "orderpay",
                    meta: { title: "UKEY订单支付", parentPath: "/sealmanage" },
                },
                {
                    path: "/sealorderpay",
                    component: orderpay,
                    name: "sealorderpay",
                    meta: { title: "UKEY订单支付", parentPath: "/sealmanage" },
                },
                {
                    path: "/orderpayresult",
                    component: orderpayresult,
                    name: "orderpayresult",
                    meta: { title: "订单支付结果", parentPath: "/sealmanage" },
                },
                {
                    path: "/sealorderpayresult",
                    component: orderpayresult,
                    name: "sealorderpayresult",
                    meta: { title: "订单支付结果", parentPath: "/sealmanage" },
                },
                {
                    path: "/ukeyrenew",
                    component: ukeyrenew,
                    name: "ukeyrenew",
                    meta: { title: "UKEY签名续期", parentPath: "/sealmanage" },
                },
                {
                    path: "/ukeysealrenew",
                    component: ukeyrenew,
                    name: "ukeysealrenew",
                    meta: { title: "UKEY印章续期", parentPath: "/sealmanage" },
                },
                {
                    path: "/ukeyrenewpay",
                    component: ukeyrenewpay,
                    name: "ukeyrenewpay",
                    meta: {
                        title: "UKEY签名续期支付",
                        parentPath: "/sealmanage",
                    },
                },
                {
                    path: "/ukeysealrenewpay",
                    component: ukeyrenewpay,
                    name: "ukeysealrenewpay",
                    meta: {
                        title: "UKEY印章续期支付",
                        parentPath: "/sealmanage",
                    },
                },
                {
                    path: "/renewpayresult",
                    component: renewpayresult,
                    name: "renewpayresult",
                    meta: {
                        title: "UKEY签名续期支付结果",
                        parentPath: "/sealmanage",
                    },
                },
                {
                    path: "/sealrenewpayresult",
                    component: renewpayresult,
                    name: "sealrenewpayresult",
                    meta: {
                        title: "UKEY印章续期支付结果",
                        parentPath: "/sealmanage",
                    },
                },
                {
                    path: "/ukeyrenewupdate",
                    component: ukeyrenewupdate,
                    name: "ukeyrenewupdate",
                    meta: {
                        title: "UKEY签名续期更新证书",
                        parentPath: "/sealmanage",
                    },
                },
                {
                    path: "/renewupdateresult",
                    component: renewupdateresult,
                    name: "renewupdateresult",
                    meta: {
                        title: "UKEY签名续期更新证书结果",
                        parentPath: "/sealmanage",
                    },
                },
                {
                    path: "/cancelreport",
                    component: cancelreport,
                    name: "cancelreport",
                    meta: { title: "取消UKEY挂失", parentPath: "/sealmanage" },
                },
                {
                    path: "/packpay",
                    component: packpay,
                    name: "packpay",
                    meta: { title: "电子合同套餐", parentPath: "/usercenter" },
                },
                {
                    path: "/packpayresult",
                    component: packpayresult,
                    name: "packpayresult",
                    meta: { title: "电子合同套餐", parentPath: "/usercenter" },
                },
                {
                    path: "/ukeyactivate",
                    component: ukeyactivate,
                    name: "ukeyactivate",
                    meta: { title: "ukey激活", parentPath: "/sealmanage" },
                },
            ],
        },
        // {
        //     path: "/addukeyread",
        //     component: addukeyread,
        //     name: "addukeyread",
        //     meta: {
        //         title: "我的签名",
        //         parentPath: "/ukeysealmanage"
        //     }
        // },
        {
            path: "/contractsignature",
            component: contractsignature,
            name: "contractsignature",
            meta: { title: "签署合同", parentPath: "/contractsignature" },
        },
        {
            path: "/contractmore",
            component: contractmore,
            name: "contractmore",
            meta: { title: "签署合同更多", parentPath: "/contractmore" },
        },
        {
            path: "/personauthen",
            component: authentication,
            name: "personauthen",
            meta: { title: "个人实名认证", parentPath: "/usercenter" },
        },
        {
            path: "/companyauthen",
            component: authentication,
            name: "companyauthen",
            meta: { title: "企业实名认证", parentPath: "/usercenter" },
        },
        {
            path: "/agreement",
            component: agreement,
            name: "agreement",
            meta: { title: "用户注册与使用协议", parentPath: "" },
        },
        {
            path: "/privacy",
            component: agreement,
            name: "privacy",
            meta: { title: "隐私声明", parentPath: "" },
        },
        {
            path: "/setmeal",
            component: setmeal,
            name: "setmeal",
            meta: { title: "电子合同套餐", parentPath: "/usercenter" },
        },
        {
            path: "/alipayNotifyReturn",
            component: alipayNotifyReturn,
            name: "alipayNotifyReturn",
            meta: { title: "订单支付结果", parentPath: "/sealmanage" },
        },
        {
            path: "/landing",
            component: downPage,
            name: "landing",
            meta: { title: "安印电子合同平台", parentPath: "/landing" },
        },
        {
            path: "/manualAudit",
            component: manualAudit,
            name: "manualAudit",
            meta: { title: "人工实名认证", parentPath: "/usercenter" },
        },
        {
            path: "/manualAuditDetail",
            component: manualAudit,
            name: "manualAudit",
            meta: { title: "人工实名认证详情", parentPath: "/usercenter" },
        },
        {
            path: "/inviteLand",
            component: inviteLand,
            name: "inviteLand",
            meta: { title: "邀请好友落地页", parentPath: "", keepAlive: true },
        },
    ],
});
