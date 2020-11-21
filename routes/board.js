var express = require('express');
var db = require('../lib/db');
var logincheck = require('../lib/logincheck');
var moment = require('moment');
var router = express.Router();

router.get('/boardlist/:pageNum', function(req, res) {
    var page = req.params.pageNum;
    var begin = (page-1)*10;
    var last = page*10;
    var list = [];
    console.log('page', page, 'begin', begin, 'last', last);
    db.query('select * from board order by board_no desc limit ?, ?;', [begin, last], function(err, results) {
        list = results;
        console.log('results', results);
        console.log('list', list);

        console.log('list[0]', list[0]);

        var statusUI = logincheck.statusUI(req, res);
        res.render('./board/BoardList.ejs', { list : list, ui : statusUI});
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
    // db.query('select * from board where board_no = ?', req.params.board_no, function(err, results) {
    //     var board = results[0];
    //     var statusUI = logincheck.statusUI(req, res);
    //     var userID;
    //
    //     if(req.user) { userID = req.user.ID;}
    //     res.render('./board/BoardContent.ejs', { board : board, id : userID, ui : statusUI});
    // })

    db.query('select * from board b left outer join comment c on b.board_no = c.board_no where b.board_no = ?;', req.params.board_no,
        function(err, results) {
        var board = results[0];
        var comment = results;
        var statusUI = logincheck.statusUI(req, res);
        var userID;

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

module.exports = router;