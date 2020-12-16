var express = require('express');
var logincheck = require('../lib/logincheck');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var statusUI = logincheck.statusUI(req,res);
  res.render('index', { title: 'Express', ui : statusUI});
});

module.exports = router;
