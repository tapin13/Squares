"use strict";

const fs = require('fs');
const path = require('path');
const url = require('url');

const ContentTypes = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
};

exports.httpServerEngine = (req, res) => {
    console.log(`${req.method} ${req.url}`);
    const parsedUrl = url.parse(req.url);
    let pathname = `.${parsedUrl.pathname}`;
    if(pathname === "./") {
        pathname = "./index.html";
    }
    
    pathname = pathname.replace('./', './public/');
    
    const ext = path.parse(pathname).ext;

    fs.exists(pathname, function (exist) {
        if(!exist) {
            // if the file is not found, return 404
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }
        
        res.writeHead(200, {'Content-Type': ContentTypes[ext] || 'text/plain' });
        res.write(fs.readFileSync(pathname, 'utf8'));
        res.end();
    });
    
};
