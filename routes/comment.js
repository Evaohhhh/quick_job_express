var express = require('express');
var router = express.Router();
var db = require("../conf/db");
var moment = require('moment');


/*
发表评论 “/comment/push”   get  
body:
   {
    "n_id": 1002,
    "c_uid": "1002",
    "c_info": "hello world",
  }
*/
router.get('/push', (req, res) => {
  const query = req.query;
  var n_id = query.n_id;
  var c_uid = query.c_uid;
  var c_text = query.c_text;
  var is_top = 1;
  var current_time =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  var sql = "insert into `Comment` (n_id,c_uid,c_text,is_top,time) values (?,?,?,?,?)";
  params = [n_id,c_uid,c_text,is_top,current_time]
    db.query(sql, params, function (results, fields) {
      var sql1 = "update jobInfo set n_com_num = n_com_num + 1 where n_id = '"+n_id+"'";  //评论成功后，评论数加一
        db.query(sql1, [], function (results1, fields) {
          console.log(results1);
          res.send({
            status: 1,
            msg: '发表评论成功',
            data: results1,
          });
        });
    });
});

/*
回复评论 “/comment/reply   post  
body:
   {
    "c_id": 1,
    "c_reply": "回复一条评论",
    "c_uid": 1002,
    "r_uid": 1001,
    "n_id": 1002
  }
*/
router.post('/reply', (req, res) => {
  const body = req.body;
  var c_id = body.c_id;
  var c_reply = body.c_reply;
  var r_uid = body.r_uid;
  var sql = "update comment set c_reply = '"+c_reply+"' ,r_uid = '"+r_uid+"' where c_id = '"+c_id+"'";
    db.query(sql, [], function (results, fields) {
      console.log(results);
      // res.send({
      //   status: 1,
      //   msg: '回复成功',
      //   data: results,
      // });
      var current_time =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var sql2 = 'insert into message (r_uid,t_uid,n_id,type,date,content,status) values(?,?,?,?,?,?,?)';
        params = [c_uid,r_uid,n_id,'3',current_time,'您的评论已被回复','0'];
        db.query(sql2, params, function (results2, fields) {
          console.log(results2);
          res.send({
            status: 1,
            msg: '回复评论成功',
            data: results2,
          });  
        })
    })

    
});


/*
获取评论 “/comment/get   post
body:
   {
    "n_id": 1001,
  }
*/
router.post('/get', (req, res) => {
  const body = req.body;
  var n_id = body.n_id;
//select * from `Comment` c, `User` u where c.c_uid = u.u_id and n_id = 1002 order by time
  var sql = "select * from `Comment` c, `User` u where c.c_uid = u.u_id  and n_id = '"+n_id+"' order by time";
    db.query(sql, [], function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '获取评论成功',
        data: results,
      });
    })
});



/*
删除评论 “/comment/delete   post  
先调用upload/img 那个接口，上传头像传回的地址 post 
body:
   {
    "c_id": 1001,
  }
*/
router.post('/delete', (req, res) => {
  const body = req.body;
  var c_id = body.c_id;
  var sql = "delete * from `Comment` where c_id = '"+c_id+"' ";
    db.query(sql, [], function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '删除评论成功',
        data: results,
      });
    })
});

/*
获取所有评论信息 “/comment/mget   get  

*/
router.get('/mget', (req, res) => {
  const body = req.body;
  var sql = "select * from `comment` ";
    db.query(sql, [], function (results, fields) {
      console.log(results);
      res.send({
        status: 1,
        msg: '获取评论信息成功',
        data: results,
      });
    })
});

module.exports = router;
