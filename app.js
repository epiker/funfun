var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webRouter = require('./web_routers');
var session = require('express-session');
var oauth2=require('./controllers/oauth2');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'mysession',
    cookie:{
        maxAge: 300*1000 // 5min
    }
}));
app.use(function(req, res, next){
    req.session._garbage = Date();
    req.session.touch();
    next();
});

app.use(oauth2);
var isAuthenticated = function(req, res, next) {
    console.log(req.session)
    if (typeof (req.session.user) !='undefined')
    {
        return true;
    }
    else
    {
        res.redirect('/login');
    }
};
//app.use('/',isAuthenticated,webRouter);//认证开关
app.use(webRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
