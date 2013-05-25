/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-5-22
 * Time: 下午5:10
 * 测试工具类
 */
var cryptoUilts = require('./utils');

exports.testMark = function(test){
    var testVal = "http://www.oschina.net/translate/list?type=2";
    var md5Val = cryptoUilts.md5(testVal);

    //MD5 测试
    console.log(md5Val);
    console.log(md5Val.length);

    //测试随机字符
    console.log(cryptoUilts.randomString(10));

    //加密
    var encry = cryptoUilts.encrypt(testVal, md5Val);
    console.log( encry);

    //解密
    var decrypt = cryptoUilts.decrypt(encry, md5Val);
    console.log(decrypt);


    test.done();
}