/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-5-23
 * Time: 下午6:06
 * To change this template use File | Settings | File Templates.
 */

var parsePage = require("osctranslatecrawler");
//参考
var tans = function(originDb, key){
    var local = key;
    originDb.get(local, function(error, value){
   //     var query = "/translate/list?";
//    //只获取译文
//    var type = 2;
//    //当前页面总数
//
//    // 获取所有翻译频道的list 页面
//    for(var i = 1; i <= totalPage; i++){
//        var keyQuery = query + "type=2&p=" + i;
//       // console.log(keyQuery);
//        tans(originDb, keyQuery);
//
//    }
        if(error){
            console.log(error);
        }else{
            console.log(key +'local' +local);
        }
    });
}

exports.transList = function(originDb, resultDb){

    //转换原始列表
    originDb.createReadStream()
        .on('data', function (data) {
            resultDb.put(data.key, parsePage.parseList(data.value));
        })
        .on('error', function (err) {
            console.log('Oh my!', err)
        })
        .on('close', function () {
            console.log('Stream closed')
        })
        .on('end', function () {
            console.log('Stream end')
        });
};

var setArticleToDb = function(data, resultDb , imageDb){
    parsePage.parseArticle(data.value, function (resultHtml, imageArray) {
        if(imageArray.length){
            imageDb.put(data.key, imageArray);
        }
        resultDb.put(data.key, resultHtml);
    });
}

exports.transArticles = function(originDb, resultDb, imageDb){
    //转换文章内容
    originDb.createReadStream()
        .on('data', function (data) {
            setArticleToDb(data, resultDb, imageDb);
        })
        .on('error', function (err) {
            console.log('Oh my!', err)
        })
        .on('close', function () {
            console.log('Stream closed')
        })
        .on('end', function () {
            console.log('Stream end')
        });
};




var imgDownload = function(imageDb, data, dir, cb) {
    parsePage.pageImgDownload(data.value, dir, function(err, body){
        if(err){
            cb(err, body);
        }else{
            cb(null, data.key);
        }
    });
};

exports.imageSync = function(imageDb, dir, cb){
    imageDb.createReadStream()
        .on('data', function (data) {
            imgDownload(imageDb, data, dir, cb);
            //resultDb.put(data.key, parsePage.parseContent(data.value, imageDb));
          //  parsePage.imgDowload(urlUtils.parse(data.value), imageDb);
        })
        .on('error', function (err) {
            console.log('Oh my!', err)
        })
        .on('close', function () {
            console.log('Stream closed')
        })
        .on('end', function () {
            console.log('Stream end')
        });
}