'use strict';
const PORT = process.env.PORT || 9999;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let fs = require('fs');
let path = require('path');
let session = require('express-session');
let mongoose = require('mongoose');

const UserDB = 'thang';
const PassDB = 'thang01652608118';
const HostDB = 'mongodb://' + UserDB + ':' + PassDB + '@ds253428.mlab.com:53428/vaytragop';
mongoose.connect(HostDB, {useNewUrlParser: true, poolSize: 10, reconnectTries: 30});
var Customer = require('./app/models/customer');
var TLog = require('./app/models/tlog');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.listen(PORT, function(err) {
    if (err) {
        writeLog(err);
        return;
    }

    console.log("Server running...");
});

app.get('/login', function (req, res) {
    if (req.session.sessionUser) {
        res.redirect('/admin');
        return;
    }
    res.redirect('login.html');
});

app.post('/login', function (req, res) {
    let post = req.body;
    if (post.username == "tien" && post.password == "ox") {
        let sessionUser = {
            username: post.username,
            password: post.password,
        };
        req.session.sessionUser = sessionUser;
        res.redirect('/admin');
    } else {
        res.redirect('/login');
    }
});

app.get('/port', function(req, res) {
    let resData = {
        port: PORT
    }
    res.send(resData);
})

function checkAuthAdmin(req, res, next) {
    if (!req.session.sessionUser) {
        res.redirect('login.html');
    } else {
        next();
    }
}

app.get('/admin', checkAuthAdmin, function(req, res) {
    res.redirect('admin.html');
});

app.post('/admin/load', checkAuthAdmin, function(req, res) {
    Customer.find({}, function (err, rows) {
        if (err) {
            res.send({error: "Lỗi hệ thống vui lòng liên hệ (+84) 035 260 8118"});
            return;
        }
        res.send({error: "OK", rows: rows});
    });
});

app.post('/apply', function(req, res) {
    let data = req.body;
    let name = data['name'];
    let phone = data['phone'];
    let amount = data['amount'];
    if (name == ''|| phone == '' || amount == '') {
        res.send({error: "Lỗi hệ thống vui lòng liên hệ (+84) 035 260 8118"});
        return;
    }

    var c = new Customer();
    c.name = name;
    c.phone = phone;
    c.amount = amount;
    c.ishide = false;
    c.save(function(err, customer) {
        if(err) {
            res.send({error: "Lỗi hệ thống vui lòng liên hệ (+84) 035 260 8118"});
            return err;
        }
        else {
            res.send({error: "OK"});
        }
    });
});

function writeLog(err) {
    var tLog = new TLog();
    tLog.content = err + '';
    tLog.save(function(err, customer) {
    })
}