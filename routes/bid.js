var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var loginCheck = require('../lib/logincheck');
var path = require('path');
var multer = require('multer');
var moment = require('moment');
var fs = require('fs');
var gm = require('gm');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/item_image/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

// 파일 확장자 필터
var fileFilter = function(req, file, cb) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        cb(new Error('Wrong Extension'), false);
    }
    else {
        cb(null,true);
    }
}

var upload = multer({
            storage : storage,
            fileFilter : fileFilter,
            limits : { fileSize : 5 * 1024 * 1024},
            });

router.get('/itemlist', function(req, res) {

    if(req.query.item == null) {
        db.query('select * from bid where item_bid_end_date > current_date limit ?,?', [0, 10],  function(err, results) {
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
    } else {
        var item = req.query.item;
        db.query(`select * from bid where item_name like ? limit ?,?`, ['%'+item+'%', 0, 10], function(err, results) {
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
    }

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
    db.query('select item_bid_end_date, item_owner, item_start_price, item_max_price, item_current_price from bid where item_no = ?', post.item_no, function(err, result) {
        if (err) {
            console.error(err);
            db.rollback(function () {
                console.error('rollback error');
                throw err;
            });
        }// if err
        else {
            if(result[0].item_bid_end_date < moment().format('YYYY-MM-DD HH:mm:ss')) {
                res.send("입찰 종료된 상품입니다.");
            } else if(result[0].item_owner === req.user.ID) {
                res.send("자신의 상품엔 입찰할 수 없습니다.");
            }
            else {
                db.query('update bid set item_current_price = ? where item_no = ?;', [post.price, post.item_no], function(err) {
                    if (err) {
                        console.error(err);
                        db.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }// if err

                });

                db.query('update bid set item_current_bid_id = ? where item_no = ?', [req.user.ID, post.item_no], function(err) {
                    if (err) {
                        console.error(err);
                        db.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }// if err

                    else {
                        res.send("입찰 성공");
                    }
                });
            }
        }
    })

})

router.get('/updateprice/:item_no', function(req, res) {
    var item_no = req.params.item_no;
    db.query('select item_current_price from bid where item_no = ?', parseInt(item_no), function(err, result) {
        var result_data = result[0].item_current_price;
        if (err) {
            console.error(err);
            throw err;
        }// if err
        else {
            if(result_data !== null) {
                res.send(result[0].item_current_price.toString());
            } else {
                res.send('0');
            }
        }
    })

});

router.get('/additem', function(req, res) {
    if(!loginCheck.isLogin(req,res)) {
        res.send('<script> alert("로그인 후 이용 가능합니다."); history.back(); </script>');
    } else {
        var statusUI = loginCheck.statusUI(req, res);
        res.render('./bid/addItem.ejs', {ui: statusUI});
    }
})

router.post('/additem_process', upload.single('item_image'), function(req, res) {
    if(!loginCheck.isLogin(req,res)) {
        res.send('<script> alert("로그인 후 이용 가능합니다."); history.back(); </script>');
    } else {
        var post = req.body;
        var date = moment().format('YYYY-MM-DD HH:mm:ss');
        var end_date = moment().add(parseInt(post.durationRadio), 'hours').format('YYYY-MM-DD HH:mm:ss');
        var insert_data = [post.item_name, req.user.ID, date, post.item_start_price, post.item_max_price, null, post.item_description,'/'+req.file.destination+req.file.filename, null, null, end_date];

        var filesrc = '/'+req.file.destination+req.file.filename;

        db.query('insert into bid(item_name, item_owner, item_date, item_start_price, item_max_price, item_bid_update, item_description, item_image_src, item_current_price, item_current_bid_id, item_bid_end_date) values(?,?,?,?,?,?,?,?,?,?,?)' ,
            insert_data, function(err) {
                if (err) {
                    console.error(err);
                    db.rollback(function () {
                        console.error('rollback error');
                        throw err;
                    });
                }// if err
                else {
                    res.redirect('/bid/itemlist');
                }
            });
    }
})

router.get('/buyitem/:item_no', function(req, res) {
    var item_no = req.params.item_no;
    // 마이 페이지 탭에서 구매를 눌러 정상적으로 접근했는지 체크
   db.query("select item_current_bid_id from bid where item_no = ?", item_no, function(err, result) {
       if (err) {
           console.log(err);
           throw err;
       } else {
           if(!loginCheck.isLogin(req, res)) {
               res.send("<script> alert('잘못된 접근입니다.'); history.back(); </script> ");
           }
           else if(result[0].item_current_bid_id !== req.user.ID) {
               res.send("<script> alert('잘못된 접근입니다.'); history.back(); </script> ");
           }
           else {
               db.query("select * from bid where item_no = ?", item_no, function(err, results) {
                   if (err) {
                       console.log(err);
                       throw err;
                   } else {
                       var statusUI = loginCheck.statusUI(req, res);
                       res.render('./bid/buyItem.ejs', {ui : statusUI, item : results[0]});
                   }
               });
           }
       }
   });




});

module.exports = router;