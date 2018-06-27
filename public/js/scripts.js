"use strict";

const EVENTS ={ 
    ONLINECLIENTS: 0
    , SCORE: 1
    , NEWSQUARE: 2
    , HIT: 3
    , CLICK: 4
};

let HOST = location.origin.replace(/^http/, 'ws');
let ws = new WebSocket(HOST);
ws.binaryType = 'arraybuffer';

document.addEventListener("click", onClick);

function onClick(data) {
    console.log(`(${data.clientX}, ${data.clientY})`);
    let click = new Uint16Array([
        4, data.clientX, data.clientY
    ]);
    console.log(click);
    ws.send(click);
};

ws.onopen = function () {
    console.log(`connected`);
};

ws.onmessage = function (event) {
    console.log(event.data);
    messageRouter(new Uint16Array(event.data));
};

let messageRouter = (message) => {
    switch (message[0]) {
        case EVENTS.NEWSQUARE:
            newSquare(message[1], message[2], message[3], message[4], message[5]);
            break;
        case EVENTS.HIT:
            hit(message[1]);
            break;
        case EVENTS.ONLINECLIENTS:
            onlineClients(message[1]);
            break;
        case EVENTS.SCORE:
            score(message[1]);
            break;
        default:
            console.log(`Unknown message: ${message}`);
    }
};

let newSquare = (id, x, y, width, height) => {
    let square = document.createElement("div");
    square.setAttribute("id", id);
    square.setAttribute("class", "square");
    square.style.left = x + "px";
    square.style.top = y + "px";
    square.style.width = width + "px";
    square.style.height = height + "px";

    document.body.appendChild(square);
};

let hit = (id) => {
    document.getElementById(id).remove();
};

let onlineClients = (onlineClients) => {
    document.getElementById("onlineClients").innerHTML = onlineClients;
};

let score = (score) => {
    document.getElementById("score").innerHTML = score;
};