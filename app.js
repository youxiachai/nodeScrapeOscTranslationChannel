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
var downloader = require('downloader');
var pathUtil = require('path');
//配置
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
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
var jsdom = require("jsdom");
var fs = require("fs");
var urlUtils = require("url");
var jquery = fs.readFileSync("./jquery.js").toString();
var HashMap = require('hashmap').HashMap;
var map = new HashMap();
var ipMap = new HashMap();

//下载测试用list 列表
//var url = "http://www.oschina.net/translate/list?type=2";
//dom 测试用
//var listFile = fs.readFileSync("./list.html").toString();
//路由
var listcontent = "";
var listUrl = "http://www.oschina.net/translate/list?type=2";
//记录ip访问
var ipLog = function (ipString, fileName) {
    console.log(ipMap.get(ipString));
    var mapIp = ipMap.get(ipString);

    if (mapIp === undefined) {
        ipMap.set(ipString, 0);
        console.log("set " + ipString + "index" + ipMap.get(ipString));
        fs.appendFile(fileName, ipString + '\n', function (err) {
            if (err) return err;
            console.log('ok');
        });
    } else {
        ipMap.set(ipString, ipMap.get(ipString) + 1);
    }
}

//翻译列表
app.get('/', function (req, res) {
    //获取访问ip
    var clientIp = req.connection.remoteAddress
    ipLog('list: ' + clientIp, './listip');

    //如果列表没有生成的话,对列表进行生成
    if (listcontent === "") {
        jsdom.env({
            html: listUrl,
            src: [jquery],
            done: function (errors, window) {
                var $ = window.$;
                //获取页数
//            var lastPage = $('ul.pager li').slice(-2, -1).text();
//            console.log("lastPage-->" + lastPage);

                //初始化内容列表
                var listContent = "";
                $('div.article').each(function (index, item) {
                    //封装jquery 对象
                    var $body = $(item);
                    //解析原始链接,过去path路径
                    var itemPath = urlUtils.parse($body.find('dt a').attr('href')).pathname;
                    //console.log("index->" + index + "->" + itemPath);

                    //build Title :li header h2 a
                    //太傻了,可以用replace with 优雅的完成...以后再改吧,佩服自己的傻劲..
                    var header = $body.find('dt a').attr("href", itemPath).removeAttr("target").unwrap().wrap('<header>').wrap('<h5/>').parent();
//            console.log("index->" + index + "->"+header.html());
                    //build DateTime : div a
                    var dateTime = $body.find('dd.remark').wrap("<div />").find('a').unwrap().parent();
//            console.log("index->" + index + "->"+dateTime.html());
                    //insert dateTime after title
                    header.after(dateTime);

                    //replace dd.content --> div
//            var $item = $item.replaceWith("<div>"+itemText + "</div>");
                    $body.find('dd.content').replaceWith(function () {
                        var itemText = $(this).text();
                        return "<div>" + itemText + "</div>";
                    });


                    //build review: replace dl -> div
                    $body.find('dl').wrap("<li />").replaceWith(function () {
                        var html = $(this).wrapInner("<div />").children().addClass("content");
                        return html;
                    });
                    //console.log("index->" + index + "->" + $body.html());
                    listContent += $body.wrap("<li />").html();

                });
                var listhtml = "<ul class='nav nav-list'>" + listContent + "</ul>";

                window.close();
                listcontent = listhtml;
                res.render('list', {listcontent: listcontent});
            }

        });
    } else {
        res.render('list', {listcontent: listcontent});
    }

});

//翻译具体文章
app.get('/translate/:title', function (req, res) {
    var pageTitle = req.params.title;

    var clientIp = req.connection.remoteAddress
    ipLog(pageTitle + ': ' + clientIp, './page.txt');
    //http://www.oschina.net/translate/optimize-requirejs-projects
    var url = "http://www.oschina.net/translate/" + pageTitle;
    console.log("key->" + pageTitle);
    var article = map.get(pageTitle);
    if (!article) {
        console.log("build---");
        jsdom.env({
            html: url,
            src: [jquery],
            done: function (errors, window) {
                //获取分类
                var $ = window.$;
//     /  var title = $('#OSC_Banner div.wp998 dl dt:last a:eq(1)')
                //   console.log(title.html() + "href->" + title.attr('href'));
                //获取标题
                var title = $('div.Article div.Top h1').text();
//        console.log(title);
                //移除翻译者
                $('td.translater').remove();
                $('table').addClass("table").addClass("table-striped").addClass("table-bordered").addClass("table-hover");



                //图片下载
                $('img').each(function (index, item) {
                    var imgUrl = $(item).attr('src');
                    var imagePath = urlUtils.parse(imgUrl);
                    if (imagePath.host !== null ) {
                        console.log("dir -->" + __dirname + pathUtil.dirname(imagePath.pathname));
                        console.log("fiename -->" + pathUtil.basename(imagePath.pathname));
                        var filename = pathUtil.basename(imagePath.pathname)
                        var downloadDir = __dirname+ "/public/" + pathUtil.dirname(imagePath.pathname) + "/";
                        mkdirp(downloadDir, function (err) {
                            if (err) return;
                            downloader.download(imgUrl, downloadDir);
                            console.log("img -->" + JSON.stringify(imagePath));
                        });
                        $(item).attr('src', imagePath.pathname);
                    }

                });

                var contentHtml = "";
                $('div.Body').each(function (index, item) {
                    var $body = $(item);
                    $body.find('table.paragraph_chs').replaceWith(function () {
                        var itemText = $(this).find('div.TextContent').html();
                        return "<div>" + itemText + "</div>";
                    });
                    contentHtml += $body.html();
                });



                contentHtml = "<div class='container-fluid content'>" + contentHtml + "</div>"
                window.close();
                var renderBody = {title: title, contentHtml: contentHtml};
                map.set(pageTitle, renderBody);
                res.render('content', renderBody);
            }

        });
    } else {
        console.log("map-> reuse");
        res.render('content', article);
    }


    //  res.render('content', {title: title})
    // res.send(req.params.title);
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});