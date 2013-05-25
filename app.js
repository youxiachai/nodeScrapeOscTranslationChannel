/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-5-5
 * Time: 上午2:08
 * To change this template use File | Settings | File Templates.
 */

var express = require('express')
    , http = require('http')
    , path = require('path');

var app = express();
var mkdirp = require('mkdirp');

//配置
app.configure(function () {
    app.set('port', process.env.PORT || 10003);
    app.set('views', __dirname + '/views');
    app.use(express.favicon());
    app.set('view engine', 'ejs');
   app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});


var appDb = require("./leveldb/appDb");
//翻译列表
app.get('/', function (req, res) {
    //获取访问ip
    var clientIp = req.connection.remoteAddress
    appDb.ipLog(clientIp, req.path);
    var page = req.query.p;
    var key = "/translate/list?type=2&p=1";
    if(page){
        // /translate/list?type=2&p=1
         key = "/translate/list?type=2&p="+page;
    }
    appDb.pageList(key , function(err, value){
        res.render('list', {listcontent: value});
    });
});

//翻译具体文章
app.get('/translate/:title', function (req, res) {
    var pageTitle = req.params.title;
    var title = req.query.title;
    //获取返回ip
    var clientIp = req.connection.remoteAddress
    appDb.ipLog(clientIp, req.path);
    var url = "/translate/" + pageTitle;
    appDb.pageContent(url, function(err, value){
        if(err){
            console.log(err);
            var renderBody = {title: pageTitle, contentHtml: err};
            res.render('content', renderBody);
            return;
        }
        var renderBody = {};
        if(!title){
            renderBody = {title: title, contentHtml: value};
        }else{
            renderBody = {title: pageTitle, contentHtml: value};
        }

        res.render('content', renderBody);
    });

});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});