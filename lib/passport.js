var db = require('../lib/db')

module.exports = function(app) {

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());
    // passport.js 사용을 위한 미들웨어 use 추가

    // 최초 로그인 성공시 호출.. 세션에 로그인 정보 저장
    passport.serializeUser(function (user, done) {
        console.log("serializeUser", user);
        done(null, user.ID);
    });

    // 페이지 로드시 마다 호출.. 세션에 저장된 아이디와 사용자 아이디를 대조 (로그인 여부 확인)
    passport.deserializeUser(function (id, done) {
        db.query('select ID, PW from user_info where ID = ?', id, function(err, user) {
            console.log('deserialize', user[0]);
            done(null, user[0]);
        });
    });


    // 사용자가 로그인을 시도할 때 호출
    passport.use(new LocalStrategy({
            usernameField: 'id',
            passwordField: 'pw'
            //post로 넘어온 데이터들의 name field 설정
        },
        function(username, password, done) {
            db.query('select ID, PW from user_info where ID = ?', [username], function(err, results, fields) {
                if (err) {
                    console.error(err);
                    db.rollback(function () {
                        console.error('rollback error');
                        throw err;
                    });
                }// if err

                console.log(results);
                if(results.length != 0) {
                        if(results[0].PW === password) {
                            console.log("success");
                            return done(null, results[0]); //success
                        } else {
                            return done(null, false, { message : 'Incorrect password'});  // password mismatch
                        }
                } else {
                    return done(null, false, { mesasge : 'Incorrect ID'});
                }

            }) // query callback end
        }
    ));

    return passport;

}

