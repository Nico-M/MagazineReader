<template>
	<scroll-view class="uni-pa-8 uv-content">
		<uv-parse v-if="!!readingChapter" :selectable="true" :content="readingChapter.text"></uv-parse>
	</scroll-view>
</template>

<script setup lang="ts">
	import { onLoad, onReady } from "@dcloudio/uni-app";
	import { reactive, ref } from "vue";

	const getChapterService = uniCloud.importObject("getContentOfBook");

	interface Chapter {
		book_id : string;
		chapter_id : string;
		level : number;
		order : number;
		text : string;
		title : string;
		nodes : any[];
	}

	const bookInitial = reactive({
		bookId: "",
		title: "",
	});

	const allChapters = ref<string[]>([]);
	const readingChapter = ref<Chapter | null>(null);

	const pressText = (event : Event) => {
		console.log(event);

	}

	onLoad((query : { bookId : string; title : string }) => {
		const bookId = query.bookId;
		const title = decodeURIComponent(query.title);
		bookInitial.bookId = bookId;
		bookInitial.title = title;
	});

	onReady(async () => {
		uni.setNavigationBarTitle({
			title: bookInitial.title,
		});
		const chaptersRes = await getChapterService.getChaptersOfBook(bookInitial.bookId);
		const { chapterList, chapterContent } = chaptersRes;
		allChapters.value = chapterList;
		readingChapter.value = chapterContent;
	});
</script>

<style scoped>
	.reader-container {
		padding-right: 0.5rpx;
	}

	.text {
		font-size: 0.5rpx;
		margin-top: 0.5rpx;
		margin-bottom: 0.5rpx;
		line-height: 0.6rpx;
		color: #333;
		/* letter-spacing: 0.6px; */
	}

	.link_navbar {
		display: none;
	}
</style>