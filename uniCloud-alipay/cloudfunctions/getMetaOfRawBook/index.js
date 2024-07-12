'use strict';
const db = uniCloud.database()

function transformUnderscoreToCamelCase(obj){
	return Object.keys(obj).reduce((acc, key) => {
		const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
		acc[camelCaseKey] = obj[key];
		return acc;
	}, {});
}

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const dbConnection = db.collection('book_library')
	const res = await dbConnection.limit(10).get()
	let list = res.data;
	if(list.length){
		list = list.map(transformUnderscoreToCamelCase);
	}
	return list
};
