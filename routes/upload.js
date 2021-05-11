var express = require('express');
var router = express.Router();

var db = require("../conf/db");

const multer = require('multer');			//需要先引包 npm i -S multer
const fs = require('fs');
const path = require('path');

//生成的图片放入uploads文件夹下
var upload_img = multer({
  dest: '../public/temp_img'
})

//生成的文件放入uploads文件夹下
var upload_files = multer({
  dest: '../public/temp_files'
})

//upload/img  上传图片
router.post('/img',upload_img.any(), function (req, res, next) {
  console.log(req.files[0]);
  //读取文件路径(uploads/文件夹下面的新建的图片地址)c
  fs.readFile(req.files[0].path,(err,data)=>{
    //如果读取失败
    if(err){return res.send('上传失败')}
    //如果读取成功
    //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
    let time = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*2222);
    //拓展名
    let extname = req.files[0].mimetype.split('/')[1]
    //拼接成图片名
    let keepname = time+'.'+extname
    //三个参数
    //1.图片的绝对路径
    //2.写入的内容
    //3.回调函数
    fs.writeFile(path.join(__dirname,'../public/temp_img/'+keepname),data,(err)=>{
      console.log(err);
        if(err){return res.send('写入失败')}
        res.send({
          mag:'upload success',                    
          filename: req.files[0].originalname,                    
          location :"http://8.129.1.95:3001/img?name="+keepname
        }) 
    });
  });
});

//上传文件
router.post('/files',upload_files.any(), function (req, res, next) {
  console.log(req.files[0]);
  //读取文件路径(uploads/文件夹下面的新建的图片地址)c
  var des_file = __dirname + "/" + req.files[0].originalname;
  fs.readFile(req.files[0].path,(err,data)=>{
    //如果读取失败
    if(err){return res.send('上传失败')}
    //如果读取成功
    //拼接成图片名
    let time = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*2222);
    let keepname = req.files[0].originalname.split('.')[1];
    //三个参数
    //1.图片的绝对路径
    //2.写入的内容
    //3.回调函数

    fs.writeFile(path.join(__dirname,'../public/temp_files/'+keepname),data,(err)=>{
      console.log(err);
        if(err){return res.send('写入失败')}
        res.send({
          mag:'upload success',                    
          filename: req.files[0].originalname,                    
          location :"http://8.129.1.95:3001/file?name="+keepname
        }) 
    });
  });
});

module.exports = router;
