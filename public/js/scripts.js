"use strict";

let HOST = location.origin.replace(/^http/, 'ws');
let ws = new WebSocket(HOST);

document.addEventListener("click", onClick);

function onClick(data) {
    let click = [
        "click", data.clientX, data.clientY
    ];
    ws.send(JSON.stringify(click));
};

ws.onopen = function () {
    console.log(`connected`);
};

ws.onmessage = function (event) {
    messageRouter(JSON.parse(event.data));
};

let messageRouter = (message) => {
    switch (message[0]) {
        case 'newSquare':
            newSquare(message[1], message[2], message[3], message[4], message[5]);
            break;
        case 'hit':
            hit(message[1]);
            break;
        case 'onlineClients':
            onlineClients(message[1]);
            break;
        case 'score':
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