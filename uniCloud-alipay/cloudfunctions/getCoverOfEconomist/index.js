'use strict';

const cheerio = require('cheerio');
const {html:sourceCode} = require('./economistHTML')

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const $ = cheerio.load(sourceCode)
	//返回数据给客户端
	const editionItems = $('.edition-teaser');
	const coverList = [];
	editionItems.each((idx,item)=>{
		const imgEle = $(item).find('img');
		const title = imgEle.attr('alt');
		const coverUrl = imgEle.attr('src');
		const headerLink = $(item).find('.headline-link');
		const versionRaw = headerLink.attr('href');
		const version = versionRaw.split('/').slice(-1)[0];
		coverList.push({
			coverUrl,
			title,
			version
		})
	})	
	console.log('coverList : ', coverList)
	return coverList;
};