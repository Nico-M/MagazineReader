// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const { log } = require('console');
const EPub = require('./epub');
const db = uniCloud.databaseForJQL();
const path = require('path');
const fs = require('fs');

const extractAsync = async (url) => {
	const {fileContent} = await uniCloud.downloadFile({fileID:url})
    const zipPath = path.join(__dirname, 'downloaded.epub');
    fs.writeFileSync(zipPath, fileContent);
	const epub = new EPub(zipPath);
	return new Promise((resolve, reject) => {
        epub.on('end', function() {
			const chapters =[];
    		let processedCount = 0;
			let toc = epub.toc;
			let uniqToc = [...new Set(toc)];
			let chapterCount = uniqToc.length;
			uniqToc.forEach(chapter => {
				epub.getChapter(chapter.id, (error, text) => {
					const content = {...chapter};
					content.text = text;
					chapters.push(content);
					processedCount++;
					if (processedCount >= chapterCount) {
						fs.unlinkSync(zipPath);
						resolve({ meta: epub.metadata, chapters });
						
					}
				})
			})
        });

        epub.parse();
    });
};

const addRecordToBookLibrary = async (record)=>{
	const recordCopy = {...record};
	const necessaryFields = ["title",
		"language",
		"creator",
		"description",
		"create_time",
		"cover",
		"book_id"];

	for(const key in recordCopy) {
		if (!necessaryFields.includes(key)) {
			delete recordCopy[key]
		}
	}
	return await db.collection('book_library').add(recordCopy)
}

const addRecordToBookChapters = async (recordList)=>{
	const validRecords = recordList.map(record=>{
		const recordCopy = {...record};
		const necessaryFields = [
			"chapter_id",
			"title",
			"order",
			"level",
			"text",
			"book_id"
			];
		
		for(const key in recordCopy) {
			if (!necessaryFields.includes(key)) {
				delete recordCopy[key]
			}
		}
		return recordCopy
	})
	
	return await db.collection('book_chapters').add(validRecords)
}

module.exports = {
	_before: function () { // 通用预处理器

	},
   extract: async (bookId,url) => {
	   
		   const collection = db.collection('book_library');
		   const ifExistBookResponse =  await collection.where({"bookId":bookId}).get()
		   if(ifExistBookResponse.data.length>0) {
			   return {
				   errCode:0,
				   errMsg:'You already own the book!'
			   }
		   }
		   const {meta,chapters}= await extractAsync(url);
		   const currentCloudDate = new Date();
		   const result =await addRecordToBookLibrary
		   ({
			   book_id:bookId,
			   create_time: currentCloudDate,
			   ...meta
		   })

		   await addRecordToBookChapters(chapters.map((chapter)=>({...chapter,book_id:bookId,chapter_id:chapter.id})))
		   
		   return {
				   errCode:0,
				   errMsg:'You own the book now, check it now!'
			   };
	   
   },
   async searchEpubResourceByKey(key){
	   const rawResource = await db.collection('raw_books').get();
	   return rawResource;
   }
}
