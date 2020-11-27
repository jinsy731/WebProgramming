var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var loginCheck = require('../lib/logincheck');
var multer = require('multer');
var upload = multer({dest : '/public/images/'});

router.get('/itemlist', function(req, res) {
    db.query('select * from bid limit ?,?', [0, 10],  function(err, results) {
        if (err) {
            console.error(err);
            throw err;
        }// if err
        else {
                var statusUI = loginCheck.statusUI(req, res);
                console.log(results);
                res.render('./bid/BiditemList.ejs', {list: results, ui : statusUI});
            }
        });
});


router.post('/moreItem', function(req, res) {

})

router.get('/item/:item_no', function(req, res) {
    db.query('select * from bid where item_no = ?', req.params.item_no, function(err, result) {
        if (err) {
            console.error(err);
            throw err;
        }// if err
        else {
            var statusUI = loginCheck.statusUI(req, res);

            console.log('result[0]',result[0]);
            res.render('./bid/BidItem.ejs', {item: result[0], ui : statusUI});
        }
    });
});

router.post('/askprice', function(req, res) {
    var post = req.body;
    db.query('update bid set item_current_price = ? where item_no = ?;', [post.price, post.item_no], function(err) {
        if(err) {
            console.error(err);
            throw err;
        }
        else {
            res.send('success');
        }
    })
})

router.get('/updateprice/:item_no', function(req, res) {
    var item_no = req.params.item_no;
    db.query('select item_current_price from bid where item_no = ?', parseInt(item_no), function(err, result) {
        if (err) {
            console.error(err);
            throw err;
        }// if err
        else {
            // console.log(result[0].item_current_price);
            res.send(result[0].item_current_price.toString());
        }
    })

});

router.get('/additem', function(req, res) {
    var statusUI = loginCheck.statusUI(req, res);
    res.render('./bid/addItem.ejs', {ui : statusUI});
})

router.post('/additem_process', upload.single('item_image'), function(req, res) {
    // res.json(req.file);
    console.log(req.file);
})

module.exports = router;