/**
 * User: youxiachai
 * Date: 13-5-22
 * Time: 下午5:11
 * 测试request 的使用
 */
var request = require('request');
var parseUrl = require('url');
var querystring = require('querystring');
var fs = require('fs');
exports.testRequest = function(test){
    var testVal = "http://www.oschina.net/translate/list";
    var requestObj = parseUrl.parse(testVal);
    var type = 2;
    var totlePage = 76;
    requestObj.query =  {'type':type,'p': 1};
//    request(parseUrl.format(requestObj), function (error, response, body) {
//        if(error) {
//            console.log(error);
//            return;
//        }
//        if (!error && response.statusCode == 200) {
//           // console.log(body) // Print the google web page.
//            var queryObj =querystring.parse( response.request.uri.query);
//            console.log(queryObj.p);
//            console.log(response.request.uri);
//            console.log(response.request.uri.href);
//            console.log(response.request.uri.path);
//
//        }
//    })

    request.get(parseUrl.format(requestObj), function (error, response, body) {
        if(error) {
            console.log(error);
            return;
        }
        if (!error && response.statusCode == 200) {
           // console.log(body) // Print the google web page.
            var queryObj =querystring.parse( response.request.uri.query);
            console.log(queryObj.p);
            console.log(response.request.uri);
            console.log(response.request.uri.href);
            console.log(response.request.uri.path);

        }
    }).pipe(fs.createWriteStream(__dirname + "/xxxxxtest.html"));

    test.done();
}