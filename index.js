const DBInfo = "./Info.db";
const PORT = process.env.PORT || 9999;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let fs = require('fs');
let path = require('path');
let sqlite3 = require('sqlite3').verbose();
let session = require('express-session');

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

    initDatabaseSQLite();
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
    getAllCustomer(function(err, rows) {
        if (err) {
            res.send({error: "Lỗi hệ thống vui lòng liên hệ (+84) 035 260 8118"});
            return;
        } 
        res.send({error: "OK", rows: rows});
    })
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

    let customer = {
        name : name,
        phone : phone,
        amount : amount,
    };

    insertCustomer(customer, function(err) {
        if (err) {
            res.send({error: "Lỗi hệ thống vui lòng liên hệ (+84) 035 260 8118"});
            return;
        }
        res.send({error: "OK"});
    });
});

function getAllCustomer(fn) {
    connect(function(db) {
        db.all("SELECT id, name, phone, amount, ishide FROM Customers", function(err,rows){
            if(err) {
                fn(err, null);
                writeLog("SELECT id, name, phone, amount, ishide FROM Customers");
                writeLog(err);
                return;
            }
           
            fn(null, rows);
        })
    })
}

function insertCustomer(customer, fn) {
    connect(function(db) {
        var stmt = db.prepare("INSERT INTO Customers (name, phone, amount, ishide)  VALUES (?, ?, ?, ?)", function(err) {
            if (err) {
                fn(err);
                writeLog("Error prepare INSERT INTO Customers");
                writeLog(err);
                return;
            }

            stmt.run([customer.name, customer.phone, customer.amount, 0], function(err) {
                if (err) {
                    fn(err);
                    writeLog("Error run INSERT INTO Customers");
                    writeLog(err);
                    return;
                }

                fn(null);
            });  
        });
             
    });
}

function writeLog(err) {
    console.error(err);
    let message = err + '';
    fs.appendFileSync("./log.txt", message + "\n");
}

function initDatabaseSQLite() {
    connect(function(db) {
        db.run("CREATE TABLE IF NOT EXISTS Customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, amount REAL, ishide INTEGER)",
        function (err) {
            if (err) {
                writeLog(err);
                return;
            }
        });        
    })
}

function connect(fn) {
    var db = new sqlite3.Database(DBInfo, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
        , (err) => {
            if (err) {
                writeLog(err);
                return;
            }
    
            db.serialize(function() {
                fn(db);
            });
        });
}