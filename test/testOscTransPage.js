/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-5-23
 * Time: 下午6:04
 * To change this template use File | Settings | File Templates.
 */
var levelup = require('level');

var request = require('request');

var fs = require('fs');

var parseUrl = require('url');
var transPage = require("../../connect/transPage");

var options = {keyEncoding:'json', valueEncoding:'json'};
var config = require('./config');
// 把原始页面转换为 mobile 页面
var mobileList = function(){
    var listpagedb = levelup(__dirname + "/" + config.listDb, options);
    var totalPage = 87;
    var resultdb =  levelup(__dirname + "/" + config.mobileListDb, options);

    transPage.transList(listpagedb, resultdb);
};

var testArticlesContent = function(){
    var listpagedb = levelup(__dirname + "/" + config.articlesDb, options);
    var transContentDb = levelup(__dirname + "/" + config.mobileArticleDb, options);
    var testlevelImageDb = levelup(__dirname + "/" + config.imgListDb, options);
    transPage.transArticles(listpagedb, transContentDb, testlevelImageDb);
}
var parseUrl = require('url');
var testImageDonwland = function(){
    var testlevelImageDb = levelup(__dirname + "/" + config.imgListDb, options);
    var dir = __dirname + '/image';
    transPage.imageSync(testlevelImageDb, dir, function(err, datakey){
        if(err){
            console.log('error-->'+err);
        }else{
           // var pathKey = parseUrl.parse(imageurl).path;
            console.log("success-->" + datakey);
            testlevelImageDb.del(datakey);
        }
    });
}

var converMobileList = false;
var converMobileArticles = true;
var imageDownload = false;

if(converMobileList){
    mobileList();
}

if(converMobileArticles){
    testArticlesContent();
}

if(imageDownload){
    testImageDonwland();
}

