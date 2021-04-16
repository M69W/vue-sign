(function(window) {
    let socket,
        session = {},
        ID_SEQ = 1;
    let config = { listener: null, log: console };
    let listener = null;
    let cbReceive = null; //消息接收成功回调
    const Command = {
        HANDSHAKE: 2,
        BIND: 5,
        UNBIND: 6,
        ERROR: 10,
        OK: 11,
        KICK: 13,
        PUSH: 15,
        ACK: 23,
        UNKNOWN: -1
    };

    function Packet(cmd, body, sessionId) {
        return {
            cmd: cmd,
            flags: 16,
            sessionId: sessionId || ID_SEQ++,
            body: body
        };
    }
    function send(message) {
        config.log.info("----------------------send");
        // if (!socket) {
        //     return;
        // }
        if (socket.readyState == WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            config.log.error("The socket is not open.");
        }
    }
    function copy(cfg) {
        for (let p in cfg) {
            if (cfg.hasOwnProperty(p)) {
                config[p] = cfg[p];
            }
        }
        return config;
    }
    function doClose(code, reason) {
        if (socket) {
            socket.close();
        }
        console.log("doclose", socket);
        config.log.info("try close web socket client, reason=" + reason);
    }

    function handshake() {
        send(
            Packet(Command.HANDSHAKE, {
                deviceId: config.deviceId,
                osName: config.osName,
                osVersion: config.osVersion,
                clientVersion: config.clientVersion
            })
        );
    }

    function bindUser(userId, tags) {
        if (userId && userId != session.userId) {
            session.userId = userId;
            session.tags = tags;
            send(Packet(Command.BIND, { userId: userId, tags: tags }));
        }
    }

    function ack(sessionId) {
        send(Packet(Command.ACK, null, sessionId));
    }
    // function testPush(body) {
    //     send(Packet(Command.PUSH, { message: body || null }));
    // }
    function testPush(msg) {
        // config.log.info("<<< send pushMessage message, userId=" + userId);
        var packet = Packet(Command.PUSH, {
            content: '{userId:"' + config.userId + '",msg:"' + msg + '"}'
        });
        send(packet);
    }
    function dispatch(packet) {
        // console.log(packet);
        switch (packet.cmd) {
            case Command.HANDSHAKE: {
                config.log.debug(">>> handshake ok.");
                listener.onHandshake();
                break;
            }
            case Command.OK: {
                if (packet.body.cmd == Command.BIND) {
                    config.log.debug(">>> bind user ok.");
                    listener.onBindUser(true);
                }
                if (packet.body.cmd == Command.PUSH) {
                    //15
                    cbReceive && cbReceive(packet.body);
                }
                break;
            }
            case Command.ERROR: {
                if (packet.body.cmd == Command.BIND) {
                    config.log.debug(">>> bind user failure.");
                    listener.onBindUser(false);
                }
                break;
            }

            case Command.KICK: {
                if (
                    session.userId == packet.body.userId &&
                    config.deviceId == packet.body.deviceId
                ) {
                    config.log.debug(">>> receive kick user.");
                    listener.onKickUser(
                        packet.body.userId,
                        packet.body.deviceId
                    );
                }
                break;
            }

            case Command.PUSH: {
                // cbReceive&&cbReceive(packet.body);
                config.log.debug(
                    ">>> receive push, content=" + packet.body.content
                );
                let sessionId;
                if ((packet.flags & 8) != 0) {
                    ack(packet.sessionId);
                } else {
                    sessionId = packet.sessionId;
                }
                listener.onReceivePush(packet.body.content, sessionId);
                break;
            }
        }
    }

    function onReceive(event) {
        config.log.debug(">>> receive packet=" + event.data);
        dispatch(JSON.parse(event.data));
    }

    function onOpen(event) {
        config.log.info("Web Socket opened!");
        listener.onOpened(event);
        return true;
    }

    function onClose(e) {
        config.log.info(
            "websocket 断开: " + e + +e.code + " " + e.reason + " " + e.wasClean
        );
        listener.onClosed(e);
        return false;
    }

    function onError(event) {
        config.log.info("Web Socket receive, error");
        doClose();
    }

    function doConnect(cfg, toDoFuns) {
        let ok = false;
        cbReceive = toDoFuns && toDoFuns.cbReceive;
        config = copy(cfg);
        socket = new WebSocket(config.url);
        socket.onmessage = onReceive;
        socket.onopen = onOpen;
        socket.onclose = onClose;
        socket.onerror = onError;
        config.log.debug("try connect to web socket server, url=" + config.url);
        // console.log(socket);
        // console.log(socket.readyState);
        // console.log(WebSocket.OPEN);
        // console.log(ok);
        // return socket;
        // return socket.readyState === WebSocket.OPEN ? socket : null;
    }

    listener = {
        onOpened: function(event) {
            if (config.listener != null) {
                config.listener.onOpened(event);
            }
            handshake();
        },
        onClosed: function(event) {
            if (config.listener != null) {
                config.listener.onClosed(event);
            }
            session = {};
            ID_SEQ = 1;
            socket = null;
        },
        onHandshake: function() {
            session.handshakeOk = true;
            if (config.listener != null) {
                config.listener.onHandshake();
            }
            if (config.userId) {
                bindUser(config.userId, config.tags);
            }
        },
        onBindUser: function(success) {
            if (config.listener != null) {
                config.listener.onBindUser(success);
            }
        },
        onReceivePush: function(message, messageId) {
            if (config.listener != null) {
                config.listener.onReceivePush(message, messageId);
            }
        },
        onKickUser: function(userId, deviceId) {
            if (config.listener != null) {
                config.listener.onKickUser(userId, deviceId);
            }
            doClose(-1, "kick user");
        }
    };
    window.mpush = {
        connect: doConnect,
        send: send,
        testPush: testPush,
        close: doClose,
        bindUser: bindUser
    };
})(window);

function $(id) {
    return document.getElementById(id);
}

let log = {
    log: function() {
        // $("responseText").value += (Array.prototype.join.call(arguments, "") + "\r\n");
        // console.log(Array.prototype.join.call(arguments, "") + "\r\n");
    }
};
log.debug = log.info = log.warn = log.error = log.log;
/**
 *{string} url //请求地址
 *{string} userId //当前登录用户id
 *{Object} toDoFuns //success fail 等callback
 */
export function connect(url, userId, toDoFuns) {
    return mpush.connect(
        {
            url: url,
            userId: userId,
            deviceId: "test-1001",
            osName: "web " + navigator.userAgent,
            osVersion: "55.2",
            clientVersion: "1.0",
            log: log
        },
        toDoFuns
    );
}
export function testPush(msg) {
    mpush.testPush(msg);
}
export function close() {
    mpush.close();
}

export function bind() {
    mpush.bindUser($("userId").value);
}
