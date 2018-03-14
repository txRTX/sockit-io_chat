//express模块
var express = require('express');
var io = require('socket.io');

var app = express();

//托管 Express 应用内的静态资源。
 app.use(express.static(__dirname));

 var server = app.listen(3000,'localhost');

 var ws = io.listen(server);

 ws.on('connection',function(client){
    
    //用户加入
    client.on('join',function(msg){
        if(checkNickname(msg)){
            //发出一个消息
            client.emit('nickname','昵称有重复');
        }else{
            client.nickname = msg;
            ws.sockets.emit('announcement', '系统', msg + ' 加入了聊天室!')
        }
    });

    //监听消息发送
    client.on('send.message',function(msg){
        //广播一个消息
        client.broadcast.emit('send.message',client.nickname,msg);
    });

    //断开连接
    client.on('disconnect',function(){
        if(client.name){
            client.broadcast.emit('send.message','系统',client.nickname+'离开聊天室');
        }
    })
 });

 var checkNickname = function(name){
    for(var i in ws.sockets.sockets){
        if(ws.sockets.sockets.hasOwnProperty(i)){
            if(ws.sockets.sockets[i] && ws.sockets.sockets[i].nickname == name){
                return true;
            }
        }
    }

    return false;
 }