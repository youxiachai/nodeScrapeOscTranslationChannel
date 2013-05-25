/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-5-22
 * Time: 下午4:35
 * 测试 node levelup 数据库
 */
var levelup = require('levelup');

var request = require('request');
var cryptoUilts = require('./utils');
var fs = require('fs');
var testVal = "http://www.oschina.net/translate/list?type=2";
exports.testMark = function(test){
    // 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
   // var db = levelup('./tesgmydb')
// first study request save file
    var options = {keyEncoding:'json', valueEncoding:'json'};

    var db = levelup(__dirname + "/testleveldb", options);
//   db.put('isinit', 0);
//    var key = {};

    var ke2 = {type :'3', p : '100'};
 //   db.put(ke2, ke2);
      db.get(ke2, function(err, value){
       console.log(value);
   });

//    for(var i = 1; i< 100; i++){
//        key.i = i + "";
//        db.put(i + "", key);
//    }

 //   for(var i = 1; i< 100; i++){
//        key.i = 88 +"";
//        db.get(JSON.stringify(key), function(err, value){
//            console.log(value);
//        });
 //   }

    test.done();
}