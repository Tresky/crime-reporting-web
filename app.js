'use strict';
/**
 * Module dependencies.
 */
var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
require('dotenv').config();
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var ejsEngine = require('ejs-mate');
// var lusca = require('lusca');
var Promise = require('bluebird');

var flash = require('express-flash');
var path = require('path');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var crimeController = require('./controllers/crime');
var commentController = require('./controllers/comment');
var notificationsController = require('./controllers/notification');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.engine('ejs', ejsEngine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable("trust proxy");
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')]
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());

Promise.longStackTraces();

var db = require('./models/sequelize');

//PostgreSQL Store
app.use(session({
  store: new pgSession({
    conString: secrets.postgres,
    tableName: secrets.sessionTable
  }),
  secret: secrets.sessionSecret,
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true
    // secure: true // only when on HTTPS
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  console.log('TYLER', res.locals.user);
  res.locals.gaCode = secrets.googleAnalyticsCode;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) req.session.returnTo = req.path;
  next();
});
// app.use(lusca({
//   csrf: { angular: true },
//   xframe: 'SAMEORIGIN',
//   xssProtection: true
// }));
// app.use(function(req, res, next) {
//   res.cookie('XSRF-TOKEN', res.locals._csrf, {httpOnly: false});
//   next();
// });
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));


/**
 * Primary app routes.
 */
app.get('/app', homeController.app);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.delete('/account', passportConf.isAuthenticated, userController.deleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/crimes', crimeController.index);
app.post('/api/crimes', crimeController.create);
app.get('/api/comments', commentController.index);
app.post('/api/comments', commentController.create);
app.get('/api/notifications', notificationsController.index);
app.get('/api/notifications/:id', notificationsController.show);
app.post('/api/notifications', notificationsController.create);
app.post('/api/notifications_viewed', notificationsController.view);

function safeRedirectToReturnTo(req, res) {
  var returnTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(returnTo);
}

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/facebook', passport.authenticate('facebook', secrets.facebook.authOptions));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);
app.get('/auth/google', passport.authenticate('google', secrets.google.authOptions));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */

db
  .sequelize
  .sync({ force: false })
  .then(function() {
    // https.createServer({
    //   key: fs.readFileSync('server.key'),
    //   cert: fs.readFileSync('server.pem')
    // }, app).listen(443, function() {
    //   console.log('Express server listening on port %d in %s mode', 443, app.get('env'));
    // });
    http.createServer(app).listen(3000, function() {
      console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
    });
  });

module.exports = app;
