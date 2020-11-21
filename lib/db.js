var mysql = require('mysql');
var db = mysql.createConnection({
    host:'localhost',
    user:'web2020',
    password:'web2020',
    database:'adweb',
    dateStrings : 'date'
});

db.connect();

module.exports = db;