"use strict";

const MAX_SQUARES = 5;
const MIN_WIDTH = 10; // px
const MIN_HEIGHT = 10; // px

const express = require('express');
//const path = require('path');
const WebSocket = require("ws");
const WebSocketServer = WebSocket.Server;

const PORT = process.env.PORT || 5000;

const server = express()
    .get('/', (req, res) => res.sendFile(__dirname + '/wsIndex.html'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
;

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    sendOnlineClients();

    ws.id = (Math.random()).toString().substring(2);
    ws.score = 0;
    
    ws.on('close', () => { 
        console.log('Client disconnected');
        sendOnlineClients();
    });

    ws.onmessage = (data) => {
        messageRouter(ws, JSON.parse(data.data));
    };

    for(let squareId in squares) {
        ws.send(JSON.stringify(squares[squareId]));
    }
});

let messageRouter = (ws, message) => {
    switch (message[0]) {
        case 'click':
            click(ws, message[1], message[2]);
            break;
        default:
            console.log(`Unknown message: ${message}`);
    }
};

let squares = {};

let sendNewSquare = () => {
    if(Object.keys(squares).length >= MAX_SQUARES) {
        return false;
    }
    
    let squareId = (Math.random()).toString().substring(2);
    let square = [
        'newSquare'
        , squareId
        , parseInt(Math.random() * 100 * 5) // x
        , parseInt(Math.random() * 100 * 5) // y
        , parseInt(MIN_WIDTH + Math.random() * 100) // width
        , parseInt(MIN_HEIGHT + Math.random() * 100) // height
    ];
    squares[squareId] = square;
    
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(square));
        }
    });
};

// Init squares
for(let i = 0; i <= MAX_SQUARES; i++) {
    sendNewSquare();
}

let click = (ws, x, y) => {
    console.log(`click: ${ws.id} (${x}, ${y})`);
    for(let squareId in squares) {
        //console.log(`${squares[squareId][0]} - ${squares[squareId][0]} ${squares[squareId][2]}`);
        //console.log(`${squares[squareId][1]} - ${squares[squareId][0]} ${squares[squareId][3]}`);
        if(x > squares[squareId][2] 
                && x < squares[squareId][2] + squares[squareId][4]
                && y > squares[squareId][3]
                && y < squares[squareId][3] + squares[squareId][5]
            ) {
            console.log(`hitSquare`);
            
            delete squares[squareId];

            ws.score += 1;
            
            let score = [ 'score', ws.score ];
            ws.send(JSON.stringify(score));
            
            let hit = [ 'hitSquare', squareId ];
            
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(hit));
                }
            });            
            
            setInterval(sendNewSquare, 1000);
            
            break;
        } else {
            console.log(`wuuuuuu`);
        }
    }
};

let sendOnlineClients = () => {
    let onlineClients = [ 'onlineClients', wss.clients.size ];
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(onlineClients));
        }
    });    
};

const pingClients = () => {
    wss.clients.forEach(client => {
        client.ping();
    });
};

const pingInterval = setInterval(pingClients, 10000);