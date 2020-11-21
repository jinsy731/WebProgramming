var express = require('express');
var db = require('../lib/db');
var logincheck = require('../lib/logincheck');
var router = express.Router();

module.exports = function(passport) {

    router.post('/login',
        passport.authenticate('local', { successRedirect: '/',
            failureRedirect: '/' }));

    router.get('/logout', function (request, response) {
        request.logout();
        request.session.destroy(function() {
            response.redirect('/');
        })
        /*request.session.save(function () {
            response.redirect('/');
        });*/
    });

    router.get('/logincheck', function(req, res) {
        var check = logincheck.isLogin(req, res);
        res.send(check);
    })

    router.get('/join', function(req, res) {
        res.render('./member/JoinForm');
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

    return router;
}