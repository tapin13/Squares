"use strict";

const MAX_SQUARES = 5;
const MIN_WIDTH = 10; // px
const MIN_HEIGHT = 10; // px

const express = require('express');
//const path = require('path');
const WebSocketServer = require("ws").Server;

const PORT = process.env.PORT || 5000;

const server = express()
    .get('/', (req, res) => res.sendFile(__dirname + '/wsIndex.html'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
;

const wss = new WebSocketServer({ server });
const wssClients = {};

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.id = (Math.random()).toString().substring(2);
    wssClients[ws.id] = ws;
    
    ws.on('close', () => { 
        delete wssClients[ws.id];
        console.log('Client disconnected');
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
    if(Object.keys(squares).length > MAX_SQUARES) {
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
    
    for(let wsId in wssClients) {
        wssClients[wsId].send(JSON.stringify(square));
    }
};

setInterval(sendNewSquare, 10000);

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
            let hit = [ 'hitSquare', squareId ];
            
            for(let wsId in wssClients) {
                wssClients[wsId].send(JSON.stringify(hit));
            }
            
            delete squares[squareId];
            
            break;
        } else {
            console.log(`wuuuuuu`);
        }
    }
};