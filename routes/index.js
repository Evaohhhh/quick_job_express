var express = require('express');
var router = express.Router();
var db = require("../conf/db");
var bodyParser = require('body-parser');
const { json } = require('body-parser');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '快推网' });
});
/*
图片 显示下载   get
*/
router.get('/img', function (req, res) {
  const query = req.query;
  const name = query.name;
  console.log(req.query)
  res.sendFile( __dirname.slice(0,-6) + "/public/temp_img/" + name);
  console.log("Request for " + req.url + " received.");
})
/*
文件 显示下载   get
*/
router.get('/file', function (req, res) {
  const query = req.query;
  const name = query.name;
  console.log(req.query)
  res.sendFile( __dirname.slice(0,-6) + "/public/temp_files/" + name);
  console.log("Request for " + req.url + " received.");
})
/*
登录接口  “/login” post   
body:{
  {"phone":"13925531258","code":"123456"}
}
*/
router.post('/login', (req, res) => {
  const body = req.body;
  var sql = "SELECT * FROM User where u_phone = '" + body.phone + "' and u_code = '" + body.code + "'";
  db.query(sql, [], function (results, fields) {
    console.log(results);
    if(results.length == 0){
      res.send({
        status: 1,
        msg: '手机号或密码错误',
      });
    }
    else{
      res.send({
        status: 0,
        msg: '登录成功',
        data: results,
      });
    }
  });
});


/*
注册接口  “/register/first”   post   
body:
   {
    "phone": "13360778534",
    "code": "333444555",
  }
*/
router.post('/register/first', (req, res) => {
  const body = req.body;
  var phone = body.phone;
  var code = body.code;
  var identity = 1;
  var is_certify = 0;
  var pic = 'http://8.129.1.95:3001/img?name=1620696008261.jpeg';
  var sql1 = `select count(*) from User  where u_phone = "${phone}" `;
  db.query(sql1, [], function (results, fields) {
    console.log(results);
    if(results[0]["count(*)"]){
      let result = {status:1 ,msg:'该手机号已被注册'};
      res.json(result)
  }else{
    var sql2 = 'INSERT INTO User (u_phone,u_code,u_identity,u_is_certify,u_pic) VALUES (?,?,?,?,?)';
    var params = [phone,code,identity,is_certify,pic];
    db.query(sql2, params, function (results1, fields) {
      console.log(results1);
      var sql3 = "select u_id from  User where u_phone = '"+phone+"'";  //返回 u_id
      db.query(sql3, [], function (results3, fields) {
      console.log(results3);
      res.send({
        status: 0,
        msg: '注册成功',
        data: results3,
      });
    })
    })
  }
  });
});

/*
注册接口  “/register/second”   post   
body:
   {
    "name": "kkk",
    "phone": "13360778534",
    "graduation_time": "2022",
    "expert": "数字媒体技术",
    "school": "北京师范大学珠海分校",
    "pic": "/public/images/mon.jpg",
    "u_intro": "这是我的个人介绍"，
  }
*/
router.post('/register/second', (req, res) => {
  const body = req.body;
  var name = body.name;
  var phone = body.phone;
  var graduation_time = body.graduation_time;
  var expert = body.expert;
  var school = body.school;
  var u_intro = body.u_intro;
  var u_sex = body.u_sex
  var sql = "update User set u_name = '"+name+"'  ,u_graduation_time= '"+graduation_time+"',u_expert = '"+expert+"',u_school= '"+school+"', u_intro = '"+u_intro+"', u_sex = '"+u_sex+"' where phone = '"+phone+"' ";
  db.query(sql, [], function (results, fields) {
    res.send({
      status: 0,
      msg: '注册成功',
      data: results,
    });
  });
});




module.exports = router;



// // 这里挂载对应的路由  示例
// router.get('/get', (req, res) => {
//   // 通过 req.query 获取客户端通过查询字符串，发送到服务器的数据
//   const query = req.query;
//   // 调用 res.send() 方法，向客户端响应处理的结果
//   res.send({
//       status: 0, // 0 表示处理成功。 1 表示处理失败
//       msg: 'GET 请求成功！', // 状态的描述
//       data: query, // 需要响应给客户端的数据
//   });
// });

// 定义 post 接口  示例 
// router.post('/post', (req, res) => {
//   // 通过 req.body() 获取请求体中的 url-encoded 格式的数据
//   const body = req.body;
//   // 调用 res.send() 方法，向客户端响应结果
//   res.send({
//       status: 0,
//       msg: 'POST 请求成功！',
//       data: body,
//   });
// });