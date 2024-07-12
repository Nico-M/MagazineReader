<template>
	<scroll-view class="uni-pa-8">
		<view v-html="(readingChapter && readingChapter.text) ||''"></view>
	</scroll-view>
</template>

<script setup lang="ts">
	import { onLoad, onReady } from '@dcloudio/uni-app';
	import { computed, reactive, ref } from 'vue';

	const getChapterService = uniCloud.importObject('getContentOfBook');

	interface Chapter {
		"book_id" : string,
		"chapter_id" : string,
		"level" : number,
		"order" : number,
		"text" : string,
		"title" : string
	}

	const bookInitial = reactive({
		bookId: '',
		title: ''
	})

	const allChapters = ref<string[]>([]);

	const readingChapter = ref<Chapter>(null);


	onLoad((query : { bookId : string; title : string }) => {
		const bookId = query.bookId;
		const title = decodeURIComponent(query.title);
		bookInitial.bookId = bookId;
		bookInitial.title = title;
	})

	onReady(async () => {
		uni.setNavigationBarTitle({
			title: bookInitial.title
		});
		const chaptersRes = await getChapterService.getChaptersOfBook(bookInitial.bookId);
		if (chaptersRes.code == 0 && chaptersRes.data) {
			const { chapterList,
				chapterContent } = (chaptersRes.data);
			allChapters.value = chapterList;
			readingChapter.value = chapterContent;
		}

	})
</script>

<style>
	.te_section_title {}
</style>