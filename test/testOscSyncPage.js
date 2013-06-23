/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-5-23
 * Time: 下午1:07
 * To change this template use File | Settings | File Templates.
 */
var levelup = require('level');
var syncPage = require("../../connect/syncOscPage");
//测试对于osc 翻译频道的链接

var options = {keyEncoding:'json', valueEncoding:'json'};
var config = require('./config');
var testConfig = function () {
    console.log(config.listDb);
    console.log(config.listErrorDb);

    console.log(config.articlesDb);
    console.log(config.articleErrorDb);
}

var testArticlesList = function(){
    var listpagedb = levelup(__dirname + "/" + config.listDb, options);
    var errorDb = levelup(__dirname + "/" + config.listErrorDb, options);
    var totalPage = 87;
    syncPage.syncOscPageList(listpagedb, errorDb, totalPage, function(err){
        console.log('testpage-->' + err);
    });
};

var testArticles = function(){
    //列表数据库
    var listpagedb = levelup(__dirname + "/" + config.listDb, options);
    var contentDb = levelup(__dirname + "/" + config.articlesDb, options);
    var errorDb = levelup(__dirname + "/" + config.articleErrorDb, options);
    var totalPage = 87;
    syncPage.syncArticles(listpagedb,contentDb,  totalPage, errorDb, function(err){
        console.log('testpage-->' + err);
    });

}

var testList = false;

var testPage = true;

var testConfigF = false;

if(testConfigF){
    testConfig();
}

if(testList){
    console.log('download --> list')
    testArticlesList();
}

if(testPage){
    console.log('download --> Articles')
    testArticles();
}



