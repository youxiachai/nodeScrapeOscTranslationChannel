/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-5-23
 * Time: 下午1:07
 * To change this template use File | Settings | File Templates.
 */
var levelup = require('levelup');

var request = require('request');
var cryptoUilts = require('./utils');
var fs = require('fs');
//?type=2&p=1
var pathUtil = require('path');
var parseUrl = require('url');
var parseList = require("../connect/parsePage");
var querystring = require('querystring');

var syncPage = require("../connect/syncOscPage");
//测试对于osc 翻译频道的链接
exports.testListPage = function (test){


   //testOscPageList(); //ok

   //testOscPageContent();
    test.done();
};
var options = {keyEncoding:'json', valueEncoding:'json'};
var testOscPageList = function(){


    var listpagedb = levelup(__dirname + "/testlevellistnormalpagedb", options);
    var errorDb = levelup(__dirname + "/testLevelErrorDb", options);
    var totalPage = 77;
    syncPage.syncOscPageList(listpagedb, errorDb, totalPage);
};

var testOscPageContent = function(){
    //列表数据库
    var listpagedb = levelup(__dirname + "/testlevellistnormalpagedb", options);
    var contentDb = levelup(__dirname + "/testlevelNormalContentdb", options);
    var errorDb = levelup(__dirname + "/testLevelErrorDb", options);
    var totalPage = 77;
    syncPage.syncPageContent(listpagedb,contentDb,  totalPage, errorDb);

}


