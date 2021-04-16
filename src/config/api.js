const env = process.env.NODE_ENV;
const NODE_ENV = (env || "development").trim();
const hostname = location.hostname;
const ws = location.protocol === "https:" ? "wss" : "ws";
export const MSG_WS =
    // NODE_ENV === "development" ? "ws://10.9.2.146:8008" : `ws://${hostname}/ws`; //消息websocket
    NODE_ENV === "development"
        ? "ws://sign.oa.com/ws"
        : `${ws}://${hostname}/ws`; //消息websocket
