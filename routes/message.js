var express = require('express');
var router = express.Router();
var db = require("../conf/db")
var moment = require('moment');

// router.get("/userList", (req, res, next) => {
//   // sql查询user表
//   db.query("SELECT * FROM User", [], function (results, fields) {
//    // 以json的形式返回
//    res.json({ results })
//   })
// });

/*
发送私信接口  “/send   post   
body:
   {
    "t_uid": "1001",
    "r_uid": "1002",
    "type": "4",  //类型 1、系统消息；2、投递消息；3、回复消息；4、私信
    "status": "1",  //状态 0：未读；1：已读
    "content": "你好",
  }
*/
router.post('/send', (req, res) => {
  const body = req.body;
  var t_uid = body.t_uid;
  var r_uid = body.r_uid;
  var type = 4;
  var status = 0;
  var content = body.content;

  var current_time =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  console.log(current_time);
  var sql = 'INSERT INTO Message (t_uid,r_uid,type,status,content,date) VALUES (?,?,?,?,?,?)';
    var params = [t_uid,r_uid,type,status,content,current_time];
    db.query(sql, params, function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '发送私信成功',
        data: results,
      });
    })
});

/*
消息已读接口  “/see   post   
body:
   {
    "m_id": "1001",
  }
*/
router.post('/see', (req, res) => {
  const body = req.body;
  var m_id = body.m_id;
  var sql = "update Message set status = 1 where m_id = '"+m_id+"'";
    var params = [t_uid,r_uid,type,status,content,current_time];
    db.query(sql, params, function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '私信已查看',
        data: results,
      });
    })
});



/*
获取私信内容  “/get   get
body:{
  type: '4',
}   
*/
router.post('/get', (req, res) => {
  const query = req.query;
  var type = query.type;
  var sql = "select * from  `Message` where type = '"+type+"'";
  db.query(sql, [], function (results, fields) {
    console.log(results);
    res.send({
      status: 1,
      msg: '获取成功',
      data: results,
    });
  })
});

/*
获取所有消息 “/message/mget   get
 
*/
router.get('/mget', (req, res) => {
  const body = req.body;
  var type = body.type;
  //"select Push.*, User.u_id, User.u_name, User.u_pic, JobInfo.n_id, JobInfo.post_u_id, JobInfo.c_name, JobInfo.job_name from User, JobInfo, Push where Push.info_id = JobInfo.n_id and JobInfo.post_u_id = User.u_id";
  var sql = "select `Message`.*, User.u_id, User.u_name, User.u_pic from `Message`, User where `Message`.t_uid = User.u_id";
  db.query(sql, [], function (results, fields) {
    console.log(results);
    res.send({
      status: 1,
      msg: '所有消息获取成功',
      data: results,
    });
  })
});






module.exports = router;
