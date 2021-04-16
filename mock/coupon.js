export default [
    {
        url: "/couponRecord/page",
        type: "post",
        response: (config) => {
            // console.log(config.body, config.query);
            return {
                code: 0,
                msg: "success",
                data: {
                    "records|1-10": [
                        {
                            accountName: "@first",
                            "accountNumber|11": 0,
                            availableDay: 2,
                            batchNumber: "1",
                            couponMoney: 1,
                            couponName: "@first",
                            "couponNumber|11": 0,
                            couponType: 2, //卡券类型：1现金券；2折扣券
                            createTime: "@date('yyyy-MM-dd')",
                            discount: 8,
                            id: "@id",
                            "moneyType|1-2": 1, //面额单位：1元；2折扣
                            moreAvailable: 200,
                            receiveTime: "@date('yyyy-MM-dd')",
                            sendTips: "@sentence",
                            "status|1-3": 1,
                            userId: "@id",
                        },
                    ],
                    total: 10,
                },
            };
        },
    },
];
