'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const content = await uniCloud.request({
		url:'https://api.github.com/repos/hehonghui/awesome-english-ebooks/contents/01_economist/te_2024.01.06',
		method:"GET",
		header:{
			"Accept":'application/vnd.github+json',
			"User-Agent":"531521711@qq.com",
			"Authorization":"Bearer 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"
		}
	})
	console.log('event : ', content)
	//返回数据给客户端
	return event
};
