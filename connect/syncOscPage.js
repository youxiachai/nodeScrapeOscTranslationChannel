/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-5-23
 * Time: 下午5:01
 * To change this template use File | Settings | File Templates.
 */


var request = require('request');
var fs = require('fs');
var parseUrl = require('url');
var parseList = require("../connect/parsePage");

//处理下载错误
var handleDownload = function(levelDb,errorDb, url){
    request(url, function(error, response, body){
       if(error){
           errorDb.put(response.request.uri.href , error);
           console.log(error);
           handleDownload(levelDb, errorDb,response.request.uri.href);
       } else{
           if (!error && response.statusCode == 200) {
               //把返回的结果解析保存
               levelDb.put(response.request.uri.path, body, function(err){
                   if(err){
                       console.log(err);
                       return;
                   }
               });
               errorDb.del(response.request.uri.href);
           }else{
               //失败重试
               errorDb.put(response.request.uri.href, response.statusCode);
               console.log(response.request.uri.href + "code-->"+response.statusCode);
               handleDownload(levelDb, errorDb, response.request.uri.href);
           }
       }
    });
}

//对osc 方法用于同步原始翻译列表
exports.syncOscPageList = function(listDb, errorDb,totalPage){
    var listUrl = "http://www.oschina.net/translate/list?";
    //只获取译文
    var type = 2;
    //当前页面总数

    // 获取所有翻译频道的list 页面
    for(var i = 1; i <= totalPage; i++){
       var requestUrl = listUrl + "type=2&p=" + i;
       handleDownload(listDb, errorDb, requestUrl);
    }
};

//用于同步文章内容
exports.syncPageContent = function(listDb, contentDb, totalPage,errorDb){
    //用已经同步好的osc 列表
    var query = "/translate/list?type=2&p=";
    for(var p = 1; p <= totalPage; p++){
        var queryKey = query + p;
        listDb.get(queryKey, function(err, value){
           if(err){
               console.log(err);
           } else{
              // console.log(value);
               var titleUrl = parseList.parseTitleUrl(value);
               for(var i in titleUrl){
                   var contentUrl = titleUrl[i];
                   handleDownload(contentDb, errorDb, contentUrl);
               }
           }
        });
    }
};



