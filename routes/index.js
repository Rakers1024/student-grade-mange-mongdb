/**
 * @author 卓志诚
 * @time 2020.05.12
 */

const express = require('express');
const router = express.Router();
const mongo = require("mongodb");
/**
 * 方便注册页面
 * @param html  接口与页面同名
 * @param json  页面数据
 */
function regRouter(html, json){
  router.get('/'+html, function(req, res, next) {
    res.render(html, json);
  });
}

/* 主页面 */
router.get('/', function(req, res, next) {
  res.render('index', {username: "Rakers"});
});

/**
 * 学生管理页面
 */
router.get('/grade', function(req, res, next) {
  //从mongodb获取数据
  let MongoClient = mongo.MongoClient;
  let url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    let dbo = db.db("students");
    dbo.collection("scores").find({}).toArray(function(err, result) { // 返回集合中所有数据
      if (err) throw err;
      res.render('grade-manage', {username: "Rakers", data_items: result});
      db.close();
    });
  });

});

//删除学生数据
router.delete('/deleteData', function(req, res, next) {
  let uid = req.body.uid
  console.log("准备删除的uid", req.body.uid)
  //在mogodb进行删除
  let MongoClient = mongo.MongoClient;
  let url = "mongodb://localhost:27017/";
  MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
    if (err) throw err;
    let dbo = db.db("students");
    let whereStr = {'uid': Number(uid)}
    dbo.collection("scores").deleteOne(whereStr).then(r => {
      db.close();
      if(r.deletedCount === 1)
        res.send('ok')
      else
        res.send('error')
    })
  })
})

/**
 * 获取单个学生信息接口
 */
router.get('/getStudentData', (req, res, next)=>{
  let uid = req.query.uid
  console.log("准备查询的uid", req.query.uid)
  let MongoClient = mongo.MongoClient;
  let url = "mongodb://localhost:27017/";
  MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
    if (err) throw err;
    let dbo = db.db("students");
    let whereStr = {'uid': Number(uid)}
    dbo.collection("scores").find(whereStr).toArray((err, result)=>{
      res.send(result)
    })
  })
})


/**
 * 更新学生数据
 */
router.post('/updateStudentData', (req, res, next)=>{
  let body = req.body
  let data = {
    'uid': Number(body.uid),
    'name': body.name,
    'class': body.class,
    'courses': [
      {'course': body['courses[0][course]'], 'score': Number(body['courses[0][score]'])},
      {'course': body['courses[1][course]'], 'score': Number(body['courses[1][score]'])},
      {'course': body['courses[2][course]'], 'score': Number(body['courses[2][score]'])}
    ]
  }
  console.log('准备更新的数据', data)
  let MongoClient = mongo.MongoClient;
  let url = "mongodb://localhost:27017/";
  MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
    if (err) throw err;
    let dbo = db.db("students");
    let whereStr = {'uid': data.uid}
    let updateStr = {$set: data}
    dbo.collection("scores").updateOne(whereStr, updateStr, (err, result)=>{
      if(result.matchedCount === 1)
        res.send('ok')
      else
        res.send('error')
    })
  })
})



/**
 * 添加学生数据
 */
router.post('/addStudentData', (req, res, next)=>{
  let body = req.body
  let data = {
    'uid': Number(body.uid),
    'name': body.name,
    'class': body.class,
    'courses': [
      {'course': body['courses[0][course]'], 'score': Number(body['courses[0][score]'])},
      {'course': body['courses[1][course]'], 'score': Number(body['courses[1][score]'])},
      {'course': body['courses[2][course]'], 'score': Number(body['courses[2][score]'])}
    ]
  }
  console.log('准备添加的数据', data)
  let MongoClient = mongo.MongoClient;
  let url = "mongodb://localhost:27017/";
  MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
    if (err) throw err;
    let dbo = db.db("students");
    dbo.collection("scores").insertOne(data, (err, result)=>{
      if(result.insertedCount === 1)
        res.send('ok')
      else
        res.send('error')
    })
  })
})


regRouter('login');
regRouter('register');
regRouter('403');
regRouter('404');
regRouter('500');

module.exports = router;
