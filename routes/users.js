var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var logincheck = require('../lib/logincheck');
var fs = require('fs');

var statusUI;

/* GET users listing. */
router.get('/', function(req, res, next) {
    statusUI = logincheck.isLogin(req, res);
    return next(statusUI);
});

router.get('/join', function(req, res) {
  var statusUI = logincheck.statusUI(req, res);
  res.render('./member/JoinForm', { ui : statusUI});
  // ./member와 같이 앞에 현재 경로 나타내줘야함
});


router.post('/join_action', function(req, res) {
  var post = req.body;
  console.log(post);
  db.query('insert into user_info values(?,?,?,?,?,?,?,?,?);',
      [post.id, post.pw, post.email, post.name, post.addr, post.phone, post.gender, post.birth, post.hint],
      function (error, results, fields) {
        if (error) {
          return db.rollback(function () {
            throw error;
          });
        }
        db.commit(function (err) {
          if (err) {
            return connection.rollback(function () {
              throw err;
            });
          }
          console.log('success!');
          res.redirect('/');
        });
      }
  );
});

router.get('/mypage', function(req,res) {
    if (!logincheck.isLogin(req, res)) {
        res.send("<script> alert('로그인 후 이용 가능합니다.'); history.back(); </script>");
    } else {
        var statusUI = logincheck.statusUI(req, res);
        res.render('./member/mypage.ejs', {ui : statusUI});
    }
});


router.get('/viewInfo', function(req, res) {
    db.query('select * from user_info where ID = ?', [req.user.ID], function(err, results) {
        if(err) {
            db.rollback(function() { throw err;});
        } else {
            var result = results[0];
            console.log(result);
            res.json(result);
        }
    })
});

router.post('/secession_action', function(req, res) {
   db.query('select PW from user_info where ID = ?', [req.user.ID], function(err, results) {
       if(err) {
           console.error(err);
           throw err;
       } else {
           if(results[0].PW === req.body.pw) {
               db.query('delete from user_info where ID = ?', [req.user.ID], function(err, results) {
                   if(err) {
                       console.log(err);
                       db.rollback(function() {
                           console.error(err);
                           throw err;
                       })
                   } else {
                       req.logout();
                       req.session.destroy(function() {
                           res.render('./member/secession_complete.ejs', {ui : statusUI});
                       });
                   }
               })
           }
           else {
               res.send("<script> alert('잘못된 비밀번호 입니다.'); history.back(); </script>");
           }
       }
   })
});

router.post('/changePassword_action', function(req,res) {
    db.query('select PW from user_info where ID = ?', [req.user.ID], function(err, results) {
        if(err) {
            console.error(err);
            throw err;
        } else {
            if(results[0].PW === req.body.pw) {
                db.query('update user_info set PW = ? where ID = ?', [req.body.new_pw, req.user.ID], function(err) {
                   if(err) {
                       db.rollback(function() {
                          console.error(err);
                          throw err;
                       });
                   }  else {
                       res.render('./member/change_complete.ejs', {ui: statusUI});
                   }
                });
            } else {
                res.send("<script> alert('비밀번호가 틀립니다.'); history.back(); </script>");
            }
        }
    })
});

router.get('/viewBid', function(req, res) {
    db.query('select * from bid where item_current_bid_id = ?', [req.user.ID], function(err, result) {
        if(err) {
            console.error(err);
            throw err;
        } else {
            res.json(result);
        }
    })
});

router.get('/viewMyProduct', function(req, res) {
    db.query('select * from bid where item_owner = ?', [req.user.ID], function(err, results) {
        if(err) {
            console.error(err);
            throw err;
        } else {
            res.json(results);
        }
    })
});

router.get('/finduser', function(res, res) {
   res.render('./member/finduser.ejs');
});

router.post('/finduser_action', function(req, res) {
    db.query("select hint from user_info where ID = ?", req.body.id, function(err, result) {
        if(err) {
            console.error(error);
            throw err;
        } else if(result.length !== 0) {
            if(result[0].hint === req.body.hint) {
                res.render('./member/reset_password.ejs', {id : req.body.id});
            }
            else {
                res.send("<script> alert('비밀번호 힌트가 다릅니다.'); history.back(); </script>");
            }
        }
        else {
            res.send("<script> alert('존재하지 않는 아이디입니다.'); history.back(); </script>");
        }
    })
});

router.post('/resetPassword', function(req, res) {
    var newPw = req.body.new_pw;
    var newPw2 = req.body.new_pw_verify;
    var id = req.body.id;

    if (newPw !== newPw2) {
        res.send("<script> alert('비밀번호가 다릅니다.'); history.back(); </script> ");
    } else {
        db.query("update user_info set PW = ? where ID = ?", [newPw, id], function(err) {
            if (err) {
                console.log(err);
                db.rollback(function () {
                    throw err;
                });
            } else {
                res.send("<script> alert('비밀번호 변경 완료'); window.close(); </script>");
            }
        })
    }
});

module.exports = router;
