var http = require('http');
var version=0;
var express = require('express');
var app = express();
var NowDate=new Date();
var day=NowDate.getDay();
var path   = require("path");
var ejs = require('ejs');
var dayNames=new Array("星期一","星期二","星期三","星期四","星期五","星期六","星期日");
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
var test1="02patching.app";
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + '/public'));
app.use("/Hook",express.static(__dirname + '/Hook'));
app.use(express.static('views'));
app.use(busboy());
app.set('views', path.join(__dirname, 'views'));

app.get('/',function(req,res){
	 res.render('upload');
	//res.render('upload');
});


app.post('/update_check', function(req, res){
    console.log('接受到Check的请求'+'   '+NowDate.toLocaleString()+'('+dayNames[day]+')');
    res.json({"url":"http://140.112.29.194:3333/Hook/hook.zip","appname":test1,"versionCode":version,"updateMessage":"Fix some awsome bug :) ","number":1});
    res.end();
});

 app.post('/update_file', function (req, res, next)
  {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/Hook/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                //res.redirect('back');
                res.locals.title='上传成功';
                res.locals.success = '上传成功';
                res.render('upload_success');
                console.log("Upload file successful!");        //where to go next
                version=version+1;
                console.log("Now Version:"+version);
            });
        });
    });

// 创建服务端
http.createServer(app).listen('3333', function() {
  console.log('启动服务器完成');
  console.log("Now Version:"+version);
}); 
