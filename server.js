var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('./server/passport')();
var winston = require('winston');
var jwt = require("jwt-simple");  
var users = require("./server/users.js");
var cfg = require("./server/config.js");

var app = express();

app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('common'));
app.use(passport.initialize());

app.get('/' , (req, res)=>{
    res.json({
        status:true,
        message:'Home'
    });
});

/**
 * 
 */
app.get("/profile", passport.authenticate(), function(req, res) {  
    winston.info('USER: ', req.user);
    res.json(users[req.user.id]);
});

/**
 * 
 */
app.post("/login", function(req, res) {
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        var user = users.find(function(u) {
            return u.email === email && u.password === password;
        });
        if (user) {
            var payload = {
                id: user.id
            };
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.json({
                token: token
            });
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});


app.listen(3000, ()=>{
    winston.info('Server listening on port 3000 ...');
})