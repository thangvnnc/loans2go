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
    secret: 'ABCDEFGHIJK',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.listen(PORT, function(err) {
    if (err) {
        writeLog(err);
        return;
    };

    initDatabaseSQLite();
    console.log("Server running...");
});

app.get('/login', function (req, res) {
    res.redirect('login.html');
});

app.post('/login', function (req, res) {
    var post = req.body;
    if (post.username === 'tien' && post.password === '0978248835ox') {
        let sessionUser = {
            username: post.username,
            password: post.password,            
        }
        req.session.sessionUser = sessionUser;
        res.redirect('/admin');
    } else {
      res.send('Bad user/pass');
    }
});

function checkAuth(req, res, next) {
    if (!req.session.sessionUser) {
        res.redirect('login.html');
    } else {
        next();
    }
}

app.use('/admin', checkAuth, function(req, res) {
    res.redirect('admin.html');
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
    }

    insertCustomer(customer, function(err) {
        if (err) {
            res.send({error: "Lỗi hệ thống vui lòng liên hệ (+84) 035 260 8118"});
            return;
        } 
        res.send({error: "OK"});
    });
});

function insertCustomer(customer, fn) {
    connect(function(db) {
        let stmt = db.prepare("INSERT INTO Customers (name, phone, amount)  VALUES (?, ?, ?)", function(err) {
            if (err) {
                fn(err);
                writeLog("Error prepare INSERT INTO Customers");
                writeLog(err);                
                return;
            }

            stmt.run([customer.name, customer.phone, customer.amount], function(err) {
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

function writeLog(message) {
    message += '';
    fs.appendFileSync("./log.txt", message + "\n");
}

function initDatabaseSQLite() {
    connect(function(db) {
        db.run("CREATE TABLE IF NOT EXISTS Customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, amount REAL)",
        function (err) {
            if (err) {
                db.close();
                writeLog(err);
                return;
            }
            db.close();
        });        
    })
}

function connect(fn) {
    let db = new sqlite3.Database(DBInfo, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
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



    // var db = new sqlite3.Database(':memory:');
    // db.serialize(function() {
    //     db.run("CREATE TABLE IF NOT EXISTS Customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount REAL, phone TEXT)");
    //     var stmt = db.prepare("INSERT INTO Customers (name, amount, phone)  VALUES (?, ?, ?)");
    //     for (var i = 0; i < 10; i++) {
    //         stmt.run("a " + i, "a " + i, "b " + i);
    //     }
    //     stmt.finalize();
    //     db.each("SELECT id, name FROM Customers", function(err, row) {
    //         console.log(row.id + ": " + row.name);
    //     });
    // });