var express = require('express');
var router = express.Router();
var db = require("../conf/db");
var moment = require('moment');

/*
发布内推信息接口  “/home/release”   post   
body:
   {
    "post_u_id": "1001",
    "n_type": "2",
    "job_name": "产品经理",  
    "job_intro": "333444555", 
    "c_intro": "负责公司服务端系统以及平台的工程架构设计和研发;负责服务性能优化、稳定性建设;与产品经理、前端工程师一起负责需求的拆解、方案设计和功能开发",
    "job_demand": "岗位要求"
    "n_phone": "13925531258",
    "c_job": "产品经理",
    "c_name": "字节跳动", 
    "n_email": "2342423@ali.com",  
    "begin_time": "2021-04-27 21:05:45",
    "end_time": "2021-04-30 21:05:45",
    "status": "1",
    "n_other": "校招/社招均可，岗位不限，也可直接点击链接进行投递：https://job.toutiao.com/s/eNhVxxB",
    "job_dirction": "软件技术 / 信息技术类",  
    "is_this": "1",  
    "way_intro": "邮箱：2342423@ali.com",
    "city": "广东省｜深圳市",
  }
*/
router.post('/release', (req, res) => {
  const body = req.body;
  var u_id = body.u_id;
  var n_type = body.n_type;
  var job_name = body.job_name;
  var job_intro = body.job_intro;
  var c_intro = body.c_intro;
  var job_demand = body.job_demand;
  var n_phone = body.n_phone;
  var c_name = body.c_name;
  var n_email = body.n_email;
  var begin_time = body.begin_time;
  var end_time = body.end_time;
  var status = body.status;
  var n_other = body.n_other;
  var job_dirction = body.job_dirction;
  var is_this = body.is_this;
  var way_intro = body.way_intro;
  var city = body.city;

  var sql = 'INSERT INTO JobInfo (u_id,n_type,job_name,job_intro,c_intro,job_demand,n_phone,c_name,n_email,begin_time,end_time,status,n_other,job_dirction,is_this,way_intro,city) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var params = [u_id,n_type,job_name,job_intro,c_intro,job_demand,n_phone,c_name,n_email,begin_time,end_time,status,n_other,job_dirction,is_this,way_intro,city];
    db.query(sql, params, function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '发布成功',
        data: body,
      });
    })
});

/* 
home/see
内推信息浏览量 +1  get
/see?nid=1002
nid
*/
router.get('/see', (req, res) => {
  const query = req.query;
  var n_id = query.n_id;
  var sql = "update JobInfo set n_eye_num = n_eye_num + 1 where n_id = '"+n_id+"'";
    db.query(sql, [], function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '浏览量+1',
        data: results,
      });
    })
});


/*
获取内推信息接口  “/home/info" get  
*/
router.get('/info', (req, res) => {
  const body = req.body;
  var sql = 'Select * from JobInfo,User where JobInfo.post_u_id = User.u_id  order by begin_time';
    db.query(sql, [], function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '获取信息成功',
        data: results,
      });
    })
});

/*
投递接口  “/home/push" post
body:{
  "info_id":1002,
  "t_uid":1002,
  "p_date": "2021-04-27 21:05:45",
  "status" : "1",
  "resume" : "/public/temp_files/1619523251926.pdf",
  "place": "广东省｜深圳市",
  "zq_time" : "一个月内"
}
*/
router.post('/push', (req, res) => {
  const body = req.body;
  var sql = 'Insert into `Push` (info_id,t_uid,p_date,status,resume,place,zq_time) values(?,?,?,?,?,?,?)';
  var params = [body.info_id,body.t_uid,body.p_date,body.status,body.resume,body.place,body.zq_time];
    db.query(sql, params, function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '投递成功',
        data: body,
      });
    })
});

/*
查看投递信息接口  “/home/push/see" post
投递状态 1:未查看2:已查看3:已通过4:未通过
body:{
  "p_id": "1001"
}
*/
router.post('push/see', (req, res) => {
  var p_id = req.body.p_id;
  var sql = "update `Push` set status = 2 where p_id = '" + p_id+"'";
    db.query(sql, [], function (results, fields) {
      res.send({
        status: 1,
        msg: '查看投递信息成功',
        data: results,
      });
    })
});
/**
  查看投递信息接口消息接口  “/home/push/see/message" post
  body:{
    "p_id": 1002,
    "r_uid": 1003,
    "n_id": 1001,
  }
 */
router.post('push/see/message', (req, res) => {
  var p_id = req.body.p_id;
  var r_uid = req.body.r_uid;
  var n_id = req.body.n_id;
  var type = 2;
  var current_time =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  var sql = 'insert into `Message` (e_p_id,r_uid,n_id,type,date,content,status) values(?,?,?,?,?,?,?)';
  params = [p_id,r_uid,n_id,type,current_time,'投递已被查看','0'];
  db.query(sql, [], function (results, fields) {
    res.send({
      status: 1,
      msg: '投递已被查看，已发送消息给对方',
      data: results,
    });
  })
});



/*
通过投递信息接口  “/home/push/pass" post
投递状态 1:未查看2:已查看3:已通过4:未通过
body:{
  "p_id": 1001
}
*/
router.post('push/pass', (req, res) => {
  var p_id = req.body.p_id;
  var sql = "Update `Push` set status = 3 where p_id = '" + p_id+"'";
    db.query(sql, [], function (results, fields) {
      res.send({
        status: 1,
        msg: '通过投递信息',
        data: results,
      });
      
    })
});

/**
  通过投递信息接口消息接口  “/home/push/pass/message" post
  body:{
    "p_id": 1002,
    "r_uid": 1003,
    "n_id": 1001,
  }
 */
  router.post('push/pass/message', (req, res) => {
    var p_id = req.body.p_id;
    var r_uid = req.body.r_uid;
    var n_id = req.body.n_id;
    var type = 2;
    var current_time =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var sql = 'insert into `Message` (e_p_id,r_uid,n_id,type,date,content,status) values(?,?,?,?,?,?,?)';
    params = [p_id,r_uid,n_id,type,current_time,'您的投递已通过','0'];
    db.query(sql, [], function (results, fields) {
      res.send({
        status: 1,
        msg: '您的投递已通过，已发送消息给对方',
        data: results,
      });
    })
  });

/*
拒绝通过投递信息接口  “/home/push/fail" post
投递状态 1:未查看2:已查看3:已通过4:未通过
body:{
  "p_id": "1001"
}
*/
router.post('push/fail', (req, res) => {
  var p_id = req.body.p_id;
  var sql = "update `Push` set status = 4 where p_id = '" + p_id+"'";
    db.query(sql, [], function (results, fields) {
      res.send({
        status: 1,
        msg: '消息投递拒绝成功',
        data: results,
      });
    })
});

/**
  拒绝通过投递信息接口消息接口  “/home/push/fail/message" post
  body:{
    "p_id": 1002,
    "r_uid": 1003,
    "n_id": 1001,
  }
 */
  router.post('push/fail/message', (req, res) => {
    var p_id = req.body.p_id;
    var r_uid = req.body.r_uid;
    var n_id = req.body.n_id;
    var type = 2;
    var current_time =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var sql = 'insert into `Message` (e_p_id,r_uid,n_id,type,date,content,status) values(?,?,?,?,?,?,?)';
    params = [p_id,r_uid,n_id,type,current_time,'您的投递已被拒绝','0'];
    db.query(sql, [], function (results, fields) {
      res.send({
        status: 1,
        msg: '投递已被拒绝，已发送消息给对方',
        data: results,
      });
    })
  });



/*
获取所有投递信息 “/push/mget   get
*/
router.get('/push/mget', (req, res) => {
  var sql = "select Push.*, User.u_id, User.u_name, User.u_pic, JobInfo.n_id, JobInfo.post_u_id, JobInfo.c_name, JobInfo.job_name from User, JobInfo, Push where Push.info_id = JobInfo.n_id and JobInfo.post_u_id = User.u_id";
  db.query(sql, [], function (results, fields) {
    console.log(results);
    res.send({
      status: 1,
      msg: '所有投递信息获取成功',
      data: results,
    });
  })
});


module.exports = router;
