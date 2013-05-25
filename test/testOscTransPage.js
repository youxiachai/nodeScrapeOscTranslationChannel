/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-5-23
 * Time: 下午6:04
 * To change this template use File | Settings | File Templates.
 */
var levelup = require('levelup');

var request = require('request');
var cryptoUilts = require('./utils');
var fs = require('fs');
//?type=2&p=1
var pathUtil = require('path');
var parseUrl = require('url');
var transPage = require("../connect/transPage");
var querystring = require('querystring');
var options = {keyEncoding:'json', valueEncoding:'json'};
exports.testListPage = function (test){

    testPageList();

    //testPageContent();
    //testImageDonwland();
    test.done();
};

var testPageList = function(){
    var listpagedb = levelup(__dirname + "/testlevellistnormalpagedb", options);
    var totalPage = 77;
    var resultdb =  levelup(__dirname + "/pageListDb", options);

    transPage.transList(listpagedb, resultdb);
};

var testPageContent = function(){
    var listpagedb = levelup(__dirname + "/testlevelNormalContentdb", options);
    var transContentDb = levelup(__dirname + "/testlevelTransContentDb", options);
    var testlevelImageDb = levelup(__dirname + "/testlevelImageDb", options);
    transPage.transContent(listpagedb, transContentDb, testlevelImageDb);
}

var testImageDonwland = function(){
    var testlevelImageDb = levelup(__dirname + "/testlevelImageDb", options);
    transPage.imageSync(testlevelImageDb);
}