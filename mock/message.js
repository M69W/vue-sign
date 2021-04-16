export default [
    {
        url: '/message/info/list',
        type: 'post',
        response: config => {
            // console.log(config.body, config.query);
            return {
                code: 0,
                msg: "success",
                data: {
                    "records|1-10": [
                        {
                            "content": "@sentence(3, 5)",
                            "createDate": "@date('yyyy-MM-dd')",
                            "createUser": "@first",
                            "id": "@id",
                            "recordId": "@id",
                            "isRead|0-1":0,
                            "sendTime": "@time",
                            "sendType|1-2": 1,
                            "status|0-2": 0,
                            "summary": "@sentence(3, 5)",
                            "title": "@title",
                            "type|1-2": 1,
                            "updateDate": "@date('yyyy-MM-dd')",
                            "updateUser": "@name"
                        }
                    ],
                    "total": 10
                }
            }
        }
    },
]