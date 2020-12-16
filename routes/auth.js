var express = require('express');
var db = require('../lib/db');
var logincheck = require('../lib/logincheck');
var router = express.Router();
module.exports = function(passport) {

    // var prevUrl;
    // router.use('/', function(req, res, next) {
    //     prevUrl = req.body.prevUrl;
    //     console.log('prevUrl', prevUrl);
    //     return next(prevUrl);
    // });

    router.post('/login',
        passport.authenticate('local', { successRedirect: '/auth/successCallback',
                                        failureRedirect: '/auth/failureCallback',
                                        failureFlash : true}));

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

    router.get('/failureCallback', function(req,res) {
       var fmsg = req.flash().error[0];

       if(fmsg === "Incorrect ID") {
            res.send("<script> alert('잘못된 아이디입니다.'); history.back(); </script>");
       }
       else {
           res.send("<script> alert('잘못된 비밀번호입니다.'); history.back(); </script>");
       }
    });

    router.get('/successCallback', function(req, res) {
       res.send('<script> location.href = "/";  </script>');
    });



    return router;
}