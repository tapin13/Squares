var pg = require('pg');

var heroconfig = {
user: 'luivilngvuldrc',
database: 'd9tqgf60joq96g',
password: '5c6cb16785f2f3f5e35bf0364249142e70ca82a475167b76632fc68d7e3204ed',
host: 'ec2-54-243-252-91.compute-1.amazonaws.com',
port: 5432,
max: 10,
idleTimeoutMillis: 30000,
};

var pool = new pg.Pool(heroconfig);
var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

app.get('/cool', function(request, response) {
    response.send(cool());
});

app.get('/times', function(request, response) {
    var result = '';
    var times = process.env.TIMES || 5;
    for (i=0; i < times; i++) {
        result += i + ' ';
    }
    response.send(result);
});

app.get('/db', function (request, response) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.error(err);
            response.send("Error: " + err);
            return;
        }
        
        
        
        client.query('Select * from test_table', function (err, result) {
            done();
            if (err) {
                console.error(err);
                response.send("Error: " + err);
            } else {
                response.render('pages/db', {results: result.rows});
            }
        });
        
        
        client.query("insert int test_table ('1', " + request.get('User-Agent') + ")", function (err, result) {
            if (err) {
                console.error(err);
                response.send("Error: " + err);
            } else {
                response.send('User-Agent: ' + request.get('User-Agent'));
            }
        });
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
