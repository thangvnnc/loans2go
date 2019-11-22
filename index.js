let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let fs = require('fs');
const PORT = process.env.PORT || 9999;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, function(error) {
    if (error) {
        console.log(error);
        return;
    };
    console.log("Server running...");
});