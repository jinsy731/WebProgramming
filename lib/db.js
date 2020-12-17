var mysql = require('mysql');
var db = mysql.createConnection({
    host:'172.17.0.2',
    user:'web2020',
    password:'web2020',
    database:'adweb',
    dateStrings : 'date'
});

db.connect();

module.exports = db;