var express = require('express');
var db = require('../lib/db');
var logincheck = require('../lib/logincheck');
var moment = require('moment');
var router = express.Router();

router.get('/boardlist/:pageNum', function(req, res) {
    var page = req.params.pageNum;
    var begin = (page-1)*20;
    var last = 20;
    var list = [];
    var total_list;
    console.log('page', page, 'begin', begin, 'last', last);
    db.query('select count(*) from board', function(err, results) { total_list = results[0]['count(*)']; })
    db.query('select * from board order by board_no desc limit ?, ?;', [begin, last], function(err, results) {
        list = results;
        var statusUI = logincheck.statusUI(req, res);
        res.render('./board/BoardList.ejs', { total_list : total_list, list : list, ui : statusUI});
        // 쿼리 처리를 비동기식으로 하기 때문에 쿼리 콜백 함수 안에 넣어줘야 제대로 처리됨.
    });

})

router.get('/write', function(req, res) {
    var statusUI = logincheck.statusUI(req, res);
    res.render('./board/BoardWrite.ejs', { ui : statusUI});
})

router.post('/write_action', function(req, res) {
    var post = req.body;
    var data = {
        author : req.user.ID,
        date : moment().format('YYYY-MM-DD hh:mm:ss').toString(),
        subject : post.board_subject,
        content : post.board_content,
    };
    console.log('author', data.author,'subject', data.subject,'content', data.content, 'date', data.date);

    db.query('insert into board(author, date, subject, content) values (?,?,?,?)', [data.author, data.date, data.subject, data.content], function(err, results, fields) {
        if (err) {
            console.error(err);
            db.rollback(function () {
                console.error('rollback error');
                throw err;
            });
        }// if err
        else {
            res.redirect('/board/boardlist/1');
        }
    });

})

router.get('/content/:board_no', function(req,res) {

    db.query('select * from board b left outer join comment c on b.board_no = c.comment_board_no where b.board_no = ?;', req.params.board_no,
        function(err, results) {
        var board = results[0];
        var comment = results;
        var statusUI = logincheck.statusUI(req, res);
        var userID;
        console.log('content result', board);

        if(req.user) { userID = req.user.ID;}
        res.render('./board/BoardContent.ejs', { comment : comment ,board : board, id : userID, ui : statusUI});
    });
});

router.post('/comment_write', function(req,res) {
    var post = req.body;
    var date = moment().format('YYYY-MM-DD HH:mm:ss');

    if(!req.user) {
        res.send('auth_error');
    } else {
        db.query('insert into comment values(?,?,?,?);', [post.num, req.user.ID, post.content, date],
            function(err, results) {
                if(err) { throw err; res.send('failed'); }
                else {
                    res.send('success');
                }
            }); // query end
    }

});

router.get("/modify/:num", function(req, res) {
    var num = req.params.num;
    db.query("select * from board where board_no = ?", num, function(err, results) {
        if (err) {
            console.error(err);
            db.rollback(function () {
                console.error('rollback error');
                throw err;
            });
        }// if err
       if(!logincheck.isLogin(req, res)) {
           res.send("<script> alert('로그인 후 이용 가능합니다.'); history.back(); </script> ");
       }
       else {
           if(req.user.ID !== results[0].author) {
               res.send("<script> alert('작성자만 이용 가능합니다.'); history.back(); </script> ");
           }
           else {
               var statusUI = logincheck.statusUI(req, res);
               res.render("./board/BoardModify.ejs", {ui : statusUI, board : results[0]})
           }
       }

    });

});

router.post("/modify_action", function(req, res) {
    if(!req.body) {
        res.send("<script> alert('잘못된 접근입니다.'); history.back(); </script>");
    }
    else {
        var post = req.body;
        console.log(post);
        console.log(post.modify_board_no);
        db.query("update board set subject = ? where board_no = ?", [post.modify_board_subject, post.modify_board_no], function(err) {
          if (err) {
              console.error(err);
              db.rollback(function () {
                  console.error('rollback error');
                  throw err;
              });
          }// if err
        });
        db.query("update board set content = ? where board_no = ?", [post.modify_board_content, post.modify_board_no], function(err) {
            if (err) {
                console.error(err);
                db.rollback(function () {
                    console.error('rollback error');
                    throw err;
                });
            }// if err
            else {
                db.query("select * from board where board_no = ?", [post.modify_board_no], function(err, results) {
                    if (err) {
                        console.error(err);
                        db.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }// if err
                    else {
                        res.redirect('/board/content/'+post.modify_board_no);
                    }
                })
            }
        });
    }
});

router.get("/delete/:num", function(req, res) {
    var num = req.params.num;
    db.query("select * from board where board_no = ?", num, function(err, results) {
        if (err) {
            console.error(err);
            db.rollback(function () {
                console.error('rollback error');
                throw err;
            });
        }// if err
        else {
            if(!logincheck.isLogin(req, res)) {
                res.send("<script> alert('로그인 후 이용 가능합니다.'); history.back(); </script> ");
            }
            else {
                if(req.user.ID !== results[0].author) {
                    res.send("<script> alert('작성자만 이용 가능합니다.'); history.back(); </script> ");
                }
                else {
                    db.query("delete from board where board_no = ?", num, function(err) {
                        if (err) {
                            console.error(err);
                            db.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }// if err
                        else {
                            res.send("<script> alert('삭제 완료'); location.href = '/board/boardlist/1'; </script>");
                        }
                    });
                }
            }
        }

    });
});

module.exports = router;