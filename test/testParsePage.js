/**
 *
 * User: youxiachai
 * Date: 13-5-22
 * Time: 下午6:13
 * 测试 ParsePage 类
 */

var fs = require('fs');
var cheerio = require('cheerio');
var urlUtils = require("url");
var request = require('request');
var parseList = require("../connect/parsePage");
exports.testParseList = function(test){
   // pageTitle();
    //pargeContent();
    test.done();
}

var pargeContent = function(){
    var content = fs.readFileSync('./pagecontent/'+ '1.html').toString();
    parseList.parseContent(content);

    fs.writeFileSync('./'+ '1.html', parseList.parseContent(content));
}

var pageTitle = function(){
    var content = fs.readFileSync('./listhtml/'+ '1.html').toString();
    var titleArray = parseList.parseTitleUrl(content)
    for(var i in titleArray){
        console.log(titleArray[i]);
    }


};