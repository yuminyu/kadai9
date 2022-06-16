

//expressを使う。
const express = require('express');
var app = express();
var http = require('http');
var socket = require('socket.io');

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
  
  var io = socket.listen(server);
  io.sockets.on('connection', function () {
    console.log('hello world im a hot socket');
  });
const crypto = require('crypto');
//クライアントによるPOSTでのリクエストにおけるデータは
//body-parserを入れた上で。「req.body.{name名}」で取得可能。
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

//publicまでのパスを設定
const DOCUMENT_ROOT = __dirname + "/public";



//localhost:3000ににアクセスしたら、/public/login.htmlを表示する。
app.get('/',function(req,res){
    res.sendFile(DOCUMENT_ROOT + '/login.html');
});
//これ↓がないとhtmlでjsファイルを読み込めなかったから重要っぽい。
app.get("/:file", (req, res)=>{
    console.log(req.params.file);
    res.sendFile(DOCUMENT_ROOT + "/" + req.params.file);
    
  });

app.post('/login', (req, res) => {
    console.log(req.body.username);
    console.log(req.body.password);
    res.sendFile(DOCUMENT_ROOT + '/chat.html');
});

/**
 * [イベント] ユーザーが接続
 */
 io.on("connection", (socket)=>{
    console.log("ユーザーが接続しました");
  
    //---------------------------------
    // ログイン
    //---------------------------------
    (()=>{
      // トークンを作成
      const token = makeToken(socket.id);
      console.log(token);
  
      // 本人にトークンを送付
      io.to(socket.id).emit("token", {token:token});
    })();
  
    //---------------------------------
    // 発言を全員に送信
    //---------------------------------
    socket.on("post", (msg)=>{
      io.emit("member-post", msg);
    });
  });



