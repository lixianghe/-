var 
   http= require('http'),
   url = require('url'),
   fs= require('fs')

var server= http.createServer(function(request, response){
    var urls= request.url;
    var params = url.parse(urls, true).query;
    var route  = (urls.indexOf("?") > -1) ? urls.substr(0, urls.indexOf("?")) : urls
    switch (route) {
        case '/':
            fs.readFile('./index.html',function(err, data){
                if(!err){
                    response.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});
                    response.end(data);
                }else{
                    throw err;
                }
            })
            break;
        case '/api/index':
            fs.readFile('./data/index.json', function(err, data){
                if(!err){
                    response.writeHead(200, {"Content-Type": "text/json;charset=UTF-8"});
                    response.end(data);
                }else{
                    throw err;
                }
            })
            break;
    
        default:
            console.log("err");
            break;
    }
});
server.listen(5000);   
console.log("server is running at http://127.0.0.1:5000");