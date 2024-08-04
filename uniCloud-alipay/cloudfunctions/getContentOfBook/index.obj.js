// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.databaseForJQL();
const {
	log
} = require("console");
const htmlparser2 = require("htmlparser2");
const {
	DomHandler
} = require('domhandler');

// 定义标签转换规则
const tagMap = {
	'div': 'view',
	'a': 'uni-link',
};
// 解析 HTML 字符串


async function parseHTMLString(htmlString) {
	const tagMapping = [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
	];
	return new Promise((resolve, reject) => {
		let parsedText = "";
		const handler = new DomHandler((error, dom) => {
			if (error) {
				console.error(error);
				return;
			}

			// 递归处理 DOM 节点
			const processNode = (node) => {
				if (node.type === 'tag') {
					// 转换标签
					// if (tagMapping.includes(node.name)) {
					// 	node.name = 'view';
					// 	node.attribs.class = [node.attribs.class, node.name].join(' ');
					// } else if (node.name === 'div') {
					// 	node.name = 'view';
					// 	// node.attribs.class=[node.attribs.class,"text"].join(' ');
					// } else if (node.name === 'a') {
					// 	node.name = 'uni-link';
					// 	node.attribs.class = [node.attribs.class, "link"].join(' ');
					// } else if (node.name === 'b') {
					// 	node.name = 'text';
					// 	node.attribs.class = [node.attribs.class, "bold"].join(' ');
					// } else if (node.name === 'small') {
					// 	node.name = 'text';
					// 	node.attribs.class = [node.attribs.class, "small"].join(' ');
					// } else {
					// 	node.name = 'text';
					// }

					// 去除 <img> 标签
					if (node.name === 'img') {
						return null;
					}
					if (node.name === 'figure') {
						return null;
					}
					
					log(node);

					// 递归处理子节点
					if (node.children) {
						node.children = node.children.map(processNode).filter(Boolean);
					}
				}
				return node;
			};

			const newDom = dom.map(processNode).filter(Boolean);

			// 将新的 DOM 转换回 HTML 字符串
			const html = htmlparser2.DomUtils.getOuterHTML(newDom);
			resolve(html);
		});
		const parser = new htmlparser2.Parser(handler);
		parser.write(htmlString);
		parser.end();

	});
}

module.exports = {
	_before: function() {
		// 通用预处理器
	},
	async getChaptersOfBook(bookId, chapterId = "") {
		let chapterContent = null;
		let chapterList = [];
		if (!chapterId) {
			const allChapterListRes = await db
				.collection("book_chapters")
				.where({
					book_id: "the_economist_2026_06_02",
				})
				.field("chapter_id")
				.orderBy("order")
				.get();
			if (allChapterListRes.code == 0) {
				chapterList = allChapterListRes.data.map((v) => v.chapter_id);

				chapterId = chapterList[0];
			}
		}
		const chapterRes = await db
			.collection("book_chapters")
			.where({
				book_id: "the_economist_2026_06_02",
				chapter_id: chapterId,
			})
			.orderBy("order")
			.get();

		if (chapterRes.code == 0) {
			chapterContent = chapterRes.data[0];
			const rawContent = chapterContent.text;
			const fileStr = await parseHTMLString(rawContent);
			chapterContent.text = rawContent;
		}

		return {
			chapterList,
			chapterContent,
		};
	},
};