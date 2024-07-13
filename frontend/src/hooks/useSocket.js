import { useEffect, useState } from "react";
import { useUser } from "../Store/hooks/useUser.js";
var WS_URL = "ws://localhost:8080";
console.log(WS_URL);
export var useSocket = function () {
    var _a = useState(null), socket = _a[0], setSocket = _a[1];
    var user = useUser();
    useEffect(function () {
        if (!user)
            return;
        var ws = new WebSocket("".concat(WS_URL, "?id=").concat(user.id));
        ws.onopen = function () {
            setSocket(ws);
        };
        ws.onclose = function () {
            setSocket(null);
        };
        return function () {
            ws.close();
        };
    }, [user]);
    return socket;
};
