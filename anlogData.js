/**
 * 模拟数据到mongdb
 */
const Mock = require('mockjs');
const mongo = require("mongodb");
let data = Mock.mock({
    //模拟1000个学生数据
    'list|1000': [{
        // 模拟学生学号是一个自增数，起始值为 1，每次增 1
        'uid|+1': 10000,
        'name': '@cname',
        'class|1':["1班","2班","3班", "4班", "5班"],
        'courses': [
            {'course':"语文", 'score|30-100':1},
            {'course':"数学", 'score|30-100':1},
            {'course':"外语", 'score|30-100':1},
        ],

    }]
})
// 输出结果
console.log(data.list)

//插入模拟的学生成绩数据
const MongoClient = mongo.MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    let dbo = db.db("students");
    data = data.list;
    for(let i = 0; i < data.length;i++)
        dbo.collection("scores").insertOne(data[i]);
    console.log('插入模拟数据到mongodb完成')
});
