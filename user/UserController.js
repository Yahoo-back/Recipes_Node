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

// 用户注册，向数据库中添加用户数据
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

//用户查询
router.get('/search', function(req, res, next) {
  Users.find().exec(function(err, aa, count) {
    res.send(aa);
  });
});
// router.post('/search', function(req, res, next) {
//   const name = req.query.name;
//   Users.find({ name: name }).exec(function(err, doc) {
//     if (err) {
//       res.json({
//         status: '400',
//         msg: err.message
//       });
//     } else {
//       res.json({
//         status: '200',
//         msg: '',
//         data: {
//           count: doc.length,
//           list: doc
//         }
//       });
//     }
//   });
// });

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

//退出登录
// app.get('/layout', function(req,res){
// 	delete req.session.users;
// //delete app.locals.user; // 删除全局变量user,否则点击退出登录,页面无变化

// });

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

// router.post('/destroy', function(req, res) {
//   var params = URL.parse(req.url, true).query;
//   console.log(params);
//   //根据待办事项的id 来删除它
//   Users.findByIdAndRemove(params.id, function(err, user) {
//     res.status(200).send('User: ' + user.name + ' was deleted.');
//   });
// });

// 删除
router.delete('/:id', function(req, res) {
  var id = req.query.id;
  if (id) {
    Users.remove({ _id: id }, function(err, user) {
      if (err) {
        res.send('fail');
      } else {
        res.send({ isSuccess: 1 });
      }
    });
  }
  // Users.findByIdAndRemove(req.params.id, function(err, user) {
  //   if (err) return res.status(500).send('There was a problem deleting the user.');
  //   res.status(200).send('User: ' + user.name + ' was deleted.');
  // });
});

// router.get('/destroy', function(req, res) {
//   var params = URL.parse(req.url, true).query;
//   console.log(params);
//   //根据待办事项的id 来删除它
//   Users.findByIdAndRemove(params.id, function(err, user) {
//     res.status(200).send('User: ' + user.name + ' was deleted.');
//   });
// });

// 修改
router.put('/:id', function(req, res) {
  Users.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, user) {
    if (err) return res.status(500).send('There was a problem updating the user.');
    res.status(200).send(user);
  });
});

module.exports = router;
