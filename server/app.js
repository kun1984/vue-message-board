var colors = require("colors");
var express = require('express');
var httpProxy = require('http-proxy');
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require("path");
var staticroot = path.resolve(path.dirname(__filename), '../');
	
// start server
var app = express();
var port =  8080;


var server = http.createServer(app);
var mysql      = require('mysql');
var multipart = require('connect-multiparty');
var bodyParser = require('body-parser');
var multipartMiddleware = multipart();
var moment = require('moment');
var dbConfig = require("./dbconfig");
var indexPath = path.resolve(staticroot, 'index.html');
var db;
var connection;

function handleError (err) {

  if (err) {
    // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connect();
    } else {
      console.error(err.stack || err);
    }
  }
}

// 连接数据库
function connect () {
  connection = mysql.createConnection(dbConfig);
  connection.connect(handleError);
  connection.on('error', handleError);
}


//connect();


server.listen(port, function(){
	console.log("HTTP SERVER start running port:"+port);
});



app.use(bodyParser.json());


app.get('/messages-sql',multipartMiddleware, function(req, res) {
	var data = req.body;
	var messages = 'select * from message';
	var param = [];
	connection.query(messages, param, function(error, result){
		console.log(error)
	    if(error)
	    {
	          res.json({error:1});

	    }else{
	    		console.log(result)
	          res.json(result);
	    }
	});
})

app.post('/messages-sql',multipartMiddleware, function(req, res) {
	var data = req.body;
	var addMessage = 'insert into message(author,content,createDateTime) values(?,?,?)';
	console.log(data)
	var param = [data.author,data.content,new Date];
	connection.query(addMessage, param, function(error, result){
	    if(error)
	    {
	          res.json({error:1});

	    }else{
	          res.json({error:0});
	    }
	});
})


app.get('/', function(req, res, next){
	res.setHeader("Content-Type","text/html");
	res.setHeader("Content-Encoding","utf8");
	fs.createReadStream(indexPath).pipe(res);
});


app.get('/messages',multipartMiddleware, function(req, res) {
	readJson(res);
})

app.post('/messages',multipartMiddleware, function(req, res) {
	var data = req.body;
	writeJson(data,res);

})

app.delete('/messages',multipartMiddleware, function(req, res) {

	var file_path = path.resolve(staticroot, 'server/db/data.json');
    fs.readFile(file_path,function(err,data){
        if(err){
            return console.error(err);
        }

        var str = "[]";
        fs.writeFile(file_path,str,function(err){
            if(err){
                console.error(err);
            }
            res.json({error:0});
        })
    })

})

app.delete('/messages/:id',multipartMiddleware, function(req, res) {

  var id = req.param('id');
  deleteJson(id,res)

})

function deleteJson(id,res){

	var file_path = path.resolve(staticroot, 'server/db/data.json');
    fs.readFile(file_path ,function(err,data){
        if(err){
            return console.error(err);
        }
        var person = data.toString();
        person = JSON.parse(person);
        for(var i = 0; i < person.length;i++){
            if(id == person[i].id){
                person.splice(i,1);
            }
        }
        var str = JSON.stringify(person);
        fs.writeFile(file_path ,str,function(err){
           res.json(JSON.parse(str));
        })
    })
}


function writeJson(message,res){
	var file_path = path.resolve(staticroot, 'server/db/data.json');
    fs.readFile(file_path,function(err,data){
        if(err){
            return console.error(err);
        }
        var result = data.toString();
        if(!result){
        	result = "[]";
        }
        var list = JSON.parse(result);
        var id = 1;
        if(list&&list.length>0){
        	var last = list[0];
        	id = last.id+1;
        }
        
        message.id = id;

        list.unshift(message);//将传来的对象push进数组对象中
        var str = JSON.stringify(list);
        fs.writeFile(file_path,str,function(err){
            if(err){
                console.error(err);
            }
            res.json(id);
        })
    })
}


function readJson(res){
	var file_path = path.resolve(staticroot, 'server/db/data.json');
    fs.readFile(file_path,function(err,data){
        if(err){
            return console.error(err);
        }
        var result = data.toString();
        if(!result){
        	result = "[]";
        }	
        res.json(JSON.parse(result));
    })
}



	// res static
app.use(express.static(staticroot));

