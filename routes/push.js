var express = require('express');
var router = express.Router();
var db = require("../conf/db")
var moment = require('moment');

/**
 * 获取投递信息 “push/get”
 * query:{
 *  "n_id": 1001
 * }
 */
 router.post('/get', (req, res) => {
  const body = req.body;
  var n_id = body.n_id;
  var sql = "select * from Push,User,JobInfo where Push.info_id = JobInfo.n_id and Job_Info.post_u_id = User.u_id  and info_id = '"+n_id+"'";
  db.query(sql, [], function (results, fields) {
    res.send({
      status: 0,
      msg: '获取投递信息成功',
      data: results,
    });
  });
});




module.exports = router;