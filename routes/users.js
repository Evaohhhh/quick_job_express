var express = require('express');
var router = express.Router();
var db = require("../conf/db")


// router.get("/userList", (req, res, next) => {
//   // sql查询user表
//   db.query("SELECT * FROM User", [], function (results, fields) {
//    // 以json的形式返回
//    res.json({ results })
//   })
// });

/*
企业验证接口  “/users/verify”   post   
body:
   {
    "u_id": 1002
    "c_name": "腾讯",
    "c_job": "产品经理",
    "c_job_pic": "13360778534",  //工作证图片
    "c_pic": "333444555",  //企业营业执照图片
    "c_department": "2022",  //部门
    "c_info": "数字媒体技术", // 备注
  }
*/
router.post('/verify', (req, res) => {
  const body = req.body;
  var u_id = req.u_id;
  var name = body.name;
  var department = body.department;
  var job = body.job;
  var pic1 = body.pic1;
  var pic2 = body.pic2;
  var info = body.info;

  var sql = "INSERT INTO User (c_name,c_department,c_job,c_job_pic,c_pic,c_info) VALUES (?,?,?,?,?,?) where u_id = '"+u_id+"'";
    var params = [name,department,job,pic1,pic2,info];
    db.query(sql, params, function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '上传信息成功',
        data: results,
      });
    })
});

/*
企业验证通过  “/users/verify/pass”   post   
body:
   {
    "u_id": 1001,
  }
*/
router.post('/verify/pass', (req, res) => {
  const body = req.body;
  var u_id = body.u_id;
  var sql = "update User set u_is_certify = 1 where u_id  = '"+ u_id + "' ";
    var params = [name,department,job,pic1,pic2,info];
    db.query(sql, params, function (results, fields) {
      console.log(results);
      var current_time =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      var sql2 = 'insert into message (r_uid,type,date,content,status) values(?,?,?,?,?)';
      params = [u_id,'1',current_time,'您的企业认证已通过','0'];
      db.query(sql2, params, function (results3, fields) {
        console.log(results3);
        res.send({
          status: 1,
          msg: '您的投递已通过，已发送消息给对方',
          data: results3,
        });  
      })
    })
});






/*
获取个人信息  “/users/info”   post   
body:
   {
    "u_id": 1001,

  }
*/
router.post('/info”', (req, res) => {
  const body = req.body;
  var u_id = body.u_id;
  var sql = "select * from user INTO User where u_id = '"+u_id+"'";
    db.query(sql,[], function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '获取用户信息成功',
        data: results,
      });
    })
});

/*
修改头像 “/users/headpic”   post  
先调用upload/img 那个接口，上传头像传回的地址 post 
body:
   {
    "u_id": 1001,
    "u_pic": "",
  }
*/
router.post('/info”', (req, res) => {
  const body = req.body;
  var u_id = body.u_id;
  var u_pic = body.u_pic;
  var sql = "update user set u_pic = '"+u_pic+"' where u_id = '"+u_pic+"'";
    db.query(sql,[], function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '修改头像成功',
        data: results,
      });
    })
});


/*
获取所有用户信息 “/users/mget   get  
先调用upload/img 那个接口，上传头像传回的地址 post 
body:
   {
    "u_id": 1001,
    "u_pic": "",
  }
*/
router.get('/mget”', (req, res) => {
  const body = req.body;
  var sql = "select * from  user ";
    db.query(sql,[], function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '获取成功',
        data: results,
      });
    })
});


module.exports = router;
