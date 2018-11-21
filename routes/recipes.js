var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var URL = require('url');

mongoose.connect('mongodb://localhost:27017/db_demo');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var recipesSchema = new mongoose.Schema({
  name: String, //菜名
  updateTime: String, //上传时间
  imgs: String, //图片
  foods: String, //材料
  time: String, //耗费时间
  introductions: String //做法介绍
});
const Recipes = mongoose.model('recipe', recipesSchema);

// 查询列表数据
router.get('/recipesList', (req, res, next) => {
  // 接受前端传来的参数
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  let sort = req.param('sort');
  let ascsort = { type: 1 }; //升序
  let descsort = { type: -1 }; //降序
  let skip = (page - 1) * pageSize;
  let params = {};
  let recipesModel = Recipes.find(params)
    .skip(skip)
    .limit(pageSize);
  recipesModel.sort({ updateTime: sort });
  recipesModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  });
});

//添加
router.post('/addRecipes', function(req, res) {
  const newRecipes = new Recipes({
    name: req.body.name, //菜名
    updateTime: req.body.updateTime, //上传时间
    imgs: req.body.imgs, //图片
    foods: req.body.foods, //材料
    time: req.body.time, //耗费时间
    introductions: req.body.introductions //做法介绍
  });
  const name = req.body.name;
  Recipes.find({ name: name }, (err, docs) => {
    if (docs.length > 0) {
      res.send({ isSuccess: false, message: '菜谱已存在' });
    } else {
      newRecipes.save(err => {
        const datas = err ? { isSuccess: false } : { isSuccess: true, message: '菜谱添加成功' };
        res.send(datas);
      });
    }
  });
});

//修改
router.post('/editRecipes', function(req, res) {
  const name = req.body.name;
  const Oldfoods = req.body.Oldfoods;
  const Newfoods = req.body.Newfoods;
  const Oldtime = req.body.Oldtime;
  const Newtime = req.body.Newtime;
  Recipes.find({ name: name }, function(err, recipes) {
    if (recipes.length === 0) {
      res.send({ isSuccess: false, message: '该菜单不存在' });
    } else {
      const data = recipes[0];
      if (data.foods === Oldfoods || data.time === Oldtime) {
        data.foods = Newfoods;
        data.time = Newtime;
        data.save(err => {
          const datas = err
            ? { isSuccess: false, message: '菜谱修改失败' }
            : { isSuccess: true, message: '菜谱修改成功' };
          res.send(datas);
        });
      } else {
        res.send({ isSuccess: false, message: '您输入食材不正确' });
      }
    }
  });
});

module.exports = router;
