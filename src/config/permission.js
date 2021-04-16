// 权限配置
import Vue from "vue";
const perMap = {
    3: "role_update", // 修改角色
    4: "role_delete", //  删除角色
    5: "role_add", //  添加角色
    6: "add_user", //  添加账户
    7: "delete_user", //  删除账户
    8: "update_user", //  修改账户
    9: "report_seal", //  挂失印章
    10: "update_seal", //  修改印章
    11: "delete_cloud_seal", //  删除云印章
    12: "add_seal", //  添加云印章
    13: "report_sign", //  挂失签名
    14: "delete_cloud_sign", //  删除云签名
    15: "add_sign", //  添加云签名
    16: "refuse_sign_compact", //  拒签合同
    17: "direct_sign_compact", //  转签合同
    18: "sign_compact", //  签署合同
    19: "delete_compact", //  删除合同
    20: "download_compact", //  下载合同
    21: "begin_sign", //  发起签约
    23: "get_record", //  查看日志
    24: "order_delete", //  删除订单
    25: "order_update", //  编辑订单
    26: "order_cancel", //  取消订单
    27: "get_order", //  查看订单
    28: "add_relation", //  添加联系人
    29: "delete_relation", //  删除联系人
    30: "update_relation", //  修改联系人
    31: "buy_packages", //  购买套餐
    32: "get_cost", //  查看费用
    1001: "ukey_add_seal", //  申请ukey印章
    1002: "ukey_add_sign" //  申请ukey签名
};

const permissionMap = () => {
    const map = {
        // 印章管理
        sealMgt: {
            electronicSeal: {
                // 添加ukey印章
                addSeal: {
                    url: perMap[1001]
                },
                addCloudSeal: {
                    url: perMap[12]
                },
                editCloudSeal: {
                    url: perMap[10]
                },
                delCloudSeal: {
                    url: perMap[11]
                },
                // ukey印章挂失
                createSignReport: {
                    url: perMap[9]
                }
            },
            mySign: {
                addCloudSign: {
                    url: perMap[15]
                },
                deleteCouldSign: {
                    url: perMap[14]
                },
                //创建ukey签名订单初始化
                signOrderInit: {
                    url: perMap[1002]
                },
                //挂失签名
                reportSign: {
                    url: perMap[13]
                }
            },
            ukeyOrder: {
                // 企业订单查看和提交
                orderDetailEnterprise: {
                    url: perMap[27]
                },
                // 个人订单查看
                orderDetailPersonal: {
                    url: perMap[27]
                },
                // 取消
                cancelUkeyOrder: {
                    url: perMap[26]
                },
                // 编辑
                editUkeyOrder: {
                    url: perMap[25]
                },
                // 删除
                deleteUkeyOrder: {
                    url: perMap[24]
                }
            }
        },
        // 合同管理
        contractMgt: {
            // 拒签
            refuse: {
                url: perMap[16]
            },
            // 转签
            contractTransfer: {
                url: perMap[17]
            },
            // 完成签署
            signature: {
                url: perMap[18]
            },
            // 下载文件
            download: {
                url: perMap[20]
            },
            // 发起签约
            saveSignPosition: {
                url: perMap[21]
            },
            // 删除
            deleteCompact: {
                url: perMap[19]
            }
        },
        userCenter: {
            log: {
                logInfoList: {
                    url: perMap[23]
                }
            },
            contact: {
                addUser: {
                    url: perMap[28]
                },
                editUser: {
                    url: perMap[30]
                },
                delUser: {
                    url: perMap[29]
                }
            },
            roleMgt: {
                addUserRole: {
                    url: perMap[5]
                },
                // 修改角色
                updateUserRole: {
                    url: perMap[3]
                },
                // 删除角色
                permissionRoleDelete: {
                    url: perMap[4]
                }
            },
            costMgt: {
                // 购买套餐
                subPackage: {
                    url: perMap[31]
                },
                // 查看费用
                getCostOrderList: {
                    url: perMap[32]
                }
            },
            acountMgt: {
                // 添加账户
                addEnterpriseOfAccount: {
                    url: perMap[6]
                },
                getCostOrderList: {
                    url: perMap[6]
                },
                // 修改账户
                updateEnterpriseOfAccount: {
                    url: perMap[8]
                },
                // 删除账户
                deleteEnterpriseOfAccount: {
                    url: perMap[7]
                }
            }
        }
    };
    Vue.prototype.$perMap = map;
    console.log(Vue.prototype.$perMap);
};
export default permissionMap;
