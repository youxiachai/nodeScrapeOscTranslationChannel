/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-5-22
 * Time: 下午7:47
 * To change this template use File | Settings | File Templates.
 */

var cheerio = require('cheerio');
var urlUtils = require("url");
var request = require('request');
var fs = require('fs');
var pathUtil = require('path');
var mkdirp = require('mkdirp');
//简化翻译频道的列表
exports.parseList = function(body){
    $ = cheerio.load(body);
    var content ="";
    $('div.article').each(function (index, item) {
        var $body = $(item);
        var dateTime = '<div>' + $body.find('dd.remark').html() + '</div>';
        $body.find('dd.remark').remove();

        var $dt = $body.find('dt');
        $dt.find('a').after(dateTime);
        var itemPath = urlUtils.parse($body.find('dt a').attr('href')).pathname;
        $dt.find('a').attr("href", itemPath).removeAttr("target");
        $dt.replaceWith("<header><h5>" + $body.find('dt').html() + "</h5></header>");

        var $dd = $body.find('dd.content');
        var itemText = $dd.text();
        $dd.replaceWith("<div>" + itemText + "</div>");

//        var bodyText = $body.find('dl').html();
        var $itemContent =  $body.children();
        $itemContent.replaceWith("<li><div class='content'>" + $itemContent.html() + "</div></li>");
        content +=  $body.html();
    });

    return "<ul class='nav nav-list'>"+ content+'</ul>';
};
//获取列表里面文章链接
exports.parseTitleUrl = function(body){
    var titleUrl = new Array();
    $ = cheerio.load(body);
    $('div.article').each(function (index, item) {
        var $body = $(item);
        //console.log($body.find('dt a').attr('href'));
        titleUrl.push($body.find('dt a').attr('href'));
    });


    return titleUrl;
}



exports.parseContent = function(body, imageDb){
    $ = cheerio.load(body);
    //获取标题
    var title = $('div.Article div.Top h1').text();
    //移除翻译者
    $('td.translater').remove();
    $('table').addClass("table").addClass("table-striped").addClass("table-bordered").addClass("table-hover");

    //图片下载
    $('img').each(function (index, item) {
        var imgUrl = $(item).attr('src');
        var imagePath = urlUtils.parse(imgUrl);
        if (imagePath.host !== null ) {
          //  console.log("dir -->" + __dirname + pathUtil.dirname(imagePath.pathname));
            //console.log("fiename -->" + pathUtil.basename(imagePath.pathname));
            imageDb.put(imgUrl,imgUrl);
          //  imgDowload(imagePath);
            $(item).attr('src', imagePath.pathname);
        }
    });

    var contentHtml = "";
    $('div.Body').children('div').each(function (index, item) {


        var itemText = $(this).find('div.TextContent').html();

       $(this).find('table.paragraph_chs').replaceWith( "" + itemText + "");

       contentHtml += $(this).html();
    });
//   console.log(contentHtml);
    contentHtml = "<div class='container-fluid content'>" + contentHtml + "</div>"
    return contentHtml;
};
//把图片下载下来放到本地
exports.imgDowload = function(imagePath, imageDb){
    var filename = pathUtil.basename(imagePath.pathname)
    var downloadDir = "."+ "/public" + pathUtil.dirname(imagePath.pathname) + "/";
    var imageUrl = urlUtils.format(imagePath);
    mkdirp(downloadDir, function (err) {

        if (err){
            console.log(err);
            return;
        }

        // 对于流的处理没做好，得研究一下api才行。。。
        request(imageUrl, function(error, response, body){
            if(error){
                console.log(response.request.uri.href+"----" + error);
            }else{
                console.log("down--del");
                imageDb.del(response.request.uri.href);
            }
        }).pipe(fs.createWriteStream(downloadDir + filename).on('error', function(err){
                console.log(err + downloadDir);
            }));
        //  console.log("img -->" + JSON.stringify(imagePath));
    });
};