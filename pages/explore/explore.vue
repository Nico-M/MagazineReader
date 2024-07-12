<template>
	<view>
		<uni-search-bar @confirm="search" :focus="true" v-model="searchValue" placeholder="Search Your Magazines"
			@clear="clear" />
		<uni-list>
			<uni-list-item v-for="item in magazines" :key="item.id" :title="item.title"
				@click="extractBook" />
		</uni-list>
		<view v-for="item in magazines" :key="item.id" 
			@click="extractBook(item.url,item.id)" >
			{{item.title}}</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { onReady } from '@dcloudio/uni-app';

	interface RequestBody<T> {
		data : T;
		code : number;
		ErrorCode : number;
		message : string;
		errorCode : number;
	}

	type SearchEpubResourceByKey = {
		name : string;
		url : string;
		bookId : string
	}[];

	const searchValue = ref('');

	const magazines = ref<{ id : string; title : string, url : string }[]>([]);

	const extractService = uniCloud.importObject('extractEpub')

	const search = async () => {
		const resourceListResponse : RequestBody<SearchEpubResourceByKey> = await extractService.searchEpubResourceByKey(searchValue.value);
		if (resourceListResponse.code !== 0) {
			uni.showToast({
				title: 'No results found',
				icon: 'none'
			});

		}
		const resourceList = resourceListResponse.data;
		magazines.value = resourceList.map(resource => ({
			id: resource.bookId,
			title: resource.name,
			url: resource.url
		}));
	}

	const clear = () => {
		searchValue.value = '';
	}

	const extractBook = async (url : string, id : string) => {
		console.log('start');
		const result = await extractService.extract(id,url);
		if(result.errCode==0){
			uni.showToast({
				icon:"success",
				title:result.errMsg
			})
		}

	}

	onReady(() => {
		console.log('onReady')
	})
</script>

<style>

</style>