import Mock from "mockjs";

// import user from './user'
// import role from './role'
// import article from './article'
import message from "./message";
import coupon from "./coupon";

const mocks = [...message, ...coupon];

// for mock server
const responseFake = (url, type, respond) => {
    return {
        url: new RegExp(`/mock${url}`),
        type: type || "get",
        response(req, res) {
            res.json(
                Mock.mock(
                    respond instanceof Function ? respond(req, res) : respond
                )
            );
        },
    };
};

export default mocks.map((route) => {
    return responseFake(route.url, route.type, route.response);
});
