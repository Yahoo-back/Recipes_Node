var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipesSchema = new Schema({
  name: String, //菜名
  updateTime: String, //上传时间
  imgs: String, //图片
  foods: String, //材料
  time: String, //耗费时间
  introductions: String //做法介绍
});

module.exports = mongoose.model('recipes', recipesSchema);
