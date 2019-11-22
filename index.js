let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let fs = require('fs');
let path = require('path');
const PORT = process.env.PORT || 9999;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, function(error) {
    if (error) {
        console.log(error);
        return;
    };
    console.log("Server running...");
});