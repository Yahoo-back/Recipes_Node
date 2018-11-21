var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var mongoStore = require('connect-mongo')(session);
// var dbUrl = 'mongodb://localhost:27017/db_demo';

var app = express();

// app.use(cookieParser());
// app.use(
//   session({
//     secret: 'express',
//     store: new mongoStore({
//       url: dbUrl,
//       collection: 'sessions'
//     })
//   })
// );
// 模拟登录注册接口
var UserController = require('./user/UserController');
app.use('/user', UserController);

var Recipes = require('./routes/recipes');
app.use('/recipes', Recipes);

module.exports = app;
