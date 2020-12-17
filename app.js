var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var compression = require('compression');
var helmet = require('helmet');
var flash = require('connect-flash');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// passport는 내부적으로 session을 사용하기 때문에 passport를 사용하는 코드는 이 코드 밑에 와야함.
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  // store : new FileStore()
  // session file store를 꺼야 로그인, 로그아웃시 UI가 제대로 반영됨.
  // 세션을 파일로 저장하면 세션 파일 생성, 삭제 시 서버가 다시 시작되면서 세션이 정상적으로 작동하지 않는 상황
}))

var passport = require('./lib/passport')(app);

// router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth')(passport);
var boardRouter = require('./routes/board');
var itemRouter = require('./routes/item');
var bidRouter = require('./routes/bid.js');

// app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));
// express.static 미들웨어의 path를 public으로 하면 정적 파일에 접근할 때 경로가 /public..일때 오류남.
// express.static 미들웨어의 path 설정값을 위와 같이 해야 /public 으로 접근할 때 오류나지 않음.
app.use(flash());
// connect-flash 미들웨어는 express-session과 cookie-parser를 사용하므로 이것들보다 뒤에 위치해야함.
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());


// router middleware use
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/board', boardRouter);
app.use('/item', itemRouter);
app.use('/bid', bidRouter);

// use res.local to expose data to all templates.
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);

// module.exports = app;
