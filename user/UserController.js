var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var URL = require('url');

mongoose.connect('mongodb://localhost:27017/db_demo');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  status: String
});
const Users = mongoose.model('login', UserSchema);

// 用户注册
router.post('/register', function(req, res) {
  const newUser = new Users({
    name: req.body.name,
    password: req.body.password,
    status: req.body.status
  });
  const name = req.body.name;
  Users.find({ name: name }, (err, docs) => {
    if (docs.length > 0) {
      res.send({ isSuccess: false, message: '用户名已存在' });
    } else {
      newUser.save(err => {
        const datas = err ? { isSuccess: false } : { isSuccess: true, message: '注册成功' };
        res.send(datas);
      });
    }
  });
});

// 用户登录,查询数据库，判断用户名和密码是否匹配(fail)
router.post('/login', function(req, res) {
  const name = req.body.name;
  const password = req.body.password;
  Users.findOne({ name: name }, function(err, users) {
    if (err) {
      res.send({ isSuccess: false, message: '登录出错' });
    }
    //用户不存在
    if (!users) {
      res.send({ isSuccess: false, message: '用户不存在' });
    }
    //判断密码是否一致
    else {
      res.send({ isSuccess: true, message: '登陆成功' });
    }
  });
});

//获取用户列表
router.get('/userList', (req, res, next) => {
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  let skip = (page - 1) * pageSize;
  let params = {};
  let usersModel = Users.find(params)
    .skip(skip)
    .limit(pageSize);
  usersModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '400',
        msg: err.message
      });
    } else {
      res.json({
        status: '200',
        msg: '',
        data: {
          count: doc.length,
          list: doc
        }
      });
    }
  });
});

// 删除
router.get('/del', (req, res, next) => {
  let response = res;
  Users.find({ _id: req.body._id }, (err, result, res) => {
    if (err) return console.log(err);
    response.render('del', { result });
  });
});
router.post('/del', (req, res, next) => {
  Users.remove({ _id: req.body._id }, (err, result) => {
    if (err) return console.log(err);
    console.log(result.result);
    res.send("<a href='/'>删除成功，点击返回首页</a>");
  });
});

// 修改密码
router.post('/change', function(req, res) {
  const name = req.body.name;
  const OldPass = req.body.OldPass;
  const NewPass = req.body.NewPass;
  Users.find({ name: name }, function(err, user) {
    if (user.length === 0) {
      res.send({ isSuccess: false, message: '该用户名不存在' });
    } else {
      const data = user[0];
      if (data.password === OldPass) {
        data.password = NewPass;
        data.save(err => {
          const datas = err
            ? { isSuccess: false, message: '密码修改失败' }
            : { isSuccess: true, message: '密码修改成功' };
          res.send(datas);
        });
      } else {
        res.send({ isSuccess: false, message: '您输入的密码不正确' });
      }
    }
  });
});

//查
router.get('/reach', (req, res, next) => {
  let result = null;
  res.render('reach', { result });
});
router.post('/reach', (req, res, next) => {
  keyWord = req.body.name;
  Users.find({ name: keyWord }, (err, result) => {
    if (err) return console.log(err);
    res.send({ result });
  });
});

module.exports = router;
