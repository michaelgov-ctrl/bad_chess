"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
class EventMessage {
    type;
    payload;
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
    }
    toJSON() {
        return {
            type: this.type,
            //payload: this.payload,
            payload: JSON.parse(this.payload),
        };
    }
}
class JoinMatchEventMessage {
    timeControl;
    constructor(timeControl) {
        this.timeControl = timeControl;
    }
}
class MakeMoveEventMessage {
    move;
    constructor(move) {
        this.move = move;
    }
}
class PropagateMoveEventMessage {
    playerColor;
    moveEventMessage;
    constructor(playerColor, mvEvtMsg) {
        this.playerColor = playerColor;
        this.moveEventMessage = mvEvtMsg;
    }
}
class ErrorEventMessage {
    error;
    constructor(err) {
        this.error = err;
    }
}
class WebSocketManager {
    socket = null;
    connect() {
        this.socket = new WebSocket('ws://localhost:8080/ws');
        this.socket.addEventListener('open', () => {
            console.log('ws conn opened');
        });
        this.socket.addEventListener('message', (evt) => {
            const msg = JSON.parse(evt.data);
            routeEventMessage(msg);
        });
        this.socket.addEventListener('error', (err) => {
            console.error('resp error:', err);
        });
        this.socket.addEventListener('close', (c) => {
            console.log('ws conn closed', c);
            this.socket = null;
        });
    }
    send(evtMsg) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(evtMsg));
        }
        else {
            console.log('cannot send message websocket not open.');
        }
    }
}
function routeEventMessage(evtMsg) {
    if (evtMsg.type === undefined) {
        alert('no type field in the event');
    }
    switch (evtMsg.type) {
        default:
            console.log('resp:', evtMsg);
            break;
    }
}
async function getEventType() {
    return new Promise((resolve) => {
        rl.question('event type: ', (resp) => {
            resolve(resp);
        });
    });
}
async function getEventPayload() {
    return new Promise((resolve) => {
        rl.question('event payload:', (resp) => {
            resolve(resp);
        });
    });
}
const wsManager = new WebSocketManager();
wsManager.connect();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function main() {
    while (true) {
        var type = await getEventType();
        var payload = await getEventPayload();
        const evtMsg = new EventMessage(type, payload);
        console.log(JSON.stringify(evtMsg));
        wsManager.send(evtMsg);
    }
    rl.close();
}
main();
//wsManager.send('{"type":"join_match","payload":{"time_control":"1m"}}');
