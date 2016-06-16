'use strict';

/* 不得姐笑话采集工具 */

var request = require('requrl');
var assert = require('assert');

/*
 * 采集主函数
 * @param {number} 开始页码
 * @param {number} 结束页码
 * @param {function} 完成后的回调函数，参数为数组
 */
module.exports = function(pagefrom, pageto, cb){
	assert(typeof pagefrom == 'number', 'Invalid pagefrom type');
	assert(typeof pageto == 'number', 'Invalid pageto type');
	assert(typeof cb == 'function', 'Invalid callback type');
	
	// 整理页码
	var from = pagefrom <= pageto ? pagefrom : pageto;
	var to = pageto >= pagefrom ? pageto : pagefrom;
	
	// 保存结果的数组
	var result = [];
	
	//  已完成的页数
	var finished = 0;
	
	// 开始采集
	for(var i = from; i <= to; i++){
		var page = i;
		request({
			url: 'http://www.budejie.com/text/' + i,
			headers: {
				"referer": 'http:///www.budejie.com/',
				"user-agent": 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84'
			},
			success: function(data){
				var matches = data.toString().replace(/\n|\r/gm, '').match(/<div class=\"j\-r\-list\-c\-desc\">.*?<\/div>/gm);
				for(var j = 0 ; j < matches.length; j++){
					var str = matches[j].match(/^\<div.*\>(.*?)\<\/div\>$/)[1].trim();
					str = str.replace(/\s/g, '');
					str = str.replace(/\&nbsp\;/g, ' ');
					str = str.replace(/<br \/>/g, "\n");
					result.push(str);
				}
				finished++;
				if(finished == to - from + 1) cb.call(null, result);
			},
			error: function(err){
				console.log('获取第' + page + '页失败');
				finished++;
				if(finished == to - from + 1) cb.call(null, result);
			}
		});
	}
}