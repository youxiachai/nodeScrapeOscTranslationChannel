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
var parseList = require("osctranslatecrawler");

/**
 * 处理下载
 * @param levelDb
 * @param errorDb
 * @param url
 * @param cb
 */
var handleDownload = function(levelDb, errorDb, url, cb){
    request(url, function(error, response, body){
       if(error){
           console.log('handleDownload-->'+error +'url' +url);
           errorDb.put(url , error);
           //网络链接问题错误500ms 后重试...
           setTimeout(handleDownload(levelDb, errorDb,url, cb), 500);
       } else{
           if (response.statusCode == 200) {
               //把返回的结果解析保存
               console.log('Done-->' + response.request.uri.href);
               levelDb.put(response.request.uri.path, body, function(err){
                   if(err){
                       console.log(err);
                       return cb(err);
                   }
               });
               //删除错误日志
               errorDb.del(response.request.uri.href);
           }else{
               //失败重试
               if(response){
                   console.log(response.request.uri.href + "code-->"+response.statusCode);
                   //添加错误日志
                   errorDb.put(response.request.uri.href, response.statusCode);
                   //服务器问题 100ms 后重试...
                   setTimeout(handleDownload(levelDb, errorDb, response.request.uri.href, cb), 100);
               }
           }
       }
    });
}

//对osc 方法用于同步原始翻译列表
exports.syncOscPageList = function(listDb, errorDb,totalPage, cb){
    var listUrl = "http://www.oschina.net/translate/list?";
    //只获取译文
    var type = "type=2&p=";
    //当前页面总数

    // 获取所有翻译频道的list 页面
    for(var i = 1; i <= totalPage; i++){
       var requestUrl = listUrl + type + i;
       handleDownload(listDb, errorDb, requestUrl, cb);
    }
};

//用于同步文章内容
/**
 *
 * @param listDb
 * @param articlesDb
 * @param totalPage
 * @param errorDb
 * @param cb
 */
exports.syncArticles = function(listDb, articlesDb, totalPage, errorDb, cb){
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
                   var pathKey = parseUrl.parse(titleUrl[i]);
                   (function(pathKey){
                       //下载数据库没有的数据
                       articlesDb.get(pathKey.path, function(err, value){
                           if(err){
                               handleDownload(articlesDb, errorDb, pathKey.href, cb);
                           }
                       });
                   })(pathKey);
               }
           }
        });
    }
};



