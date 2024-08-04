<template>
	<view>
		<uni-search-bar @confirm="search" v-model="searchValue" placeholder="Search Your Magazines"
			@clear="clear" />
		<!-- <uni-list>
			<uni-list-item v-for="item in magazines" :key="item.id" :title="item.title" @click="extractBook" />
		</uni-list> -->
		<!-- <view v-for="item in magazines" :key="item.id" 
			@click="extractBook(item.url,item.id)" >
			{{item.title}}</view> -->
		<view class="uni-pa-8">
			<view class="uni-mb-4" v-for="cover in coverList" :key="cover.cover_url">
				<cust-card :item="cover"></cust-card>
			</view>
		</view>

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

	interface CoverInfo {
		cover_url : string,
		title : string,
		date : string,
		version : string,
		cover_url_preview : string
	}

	const searchValue = ref('');

	const magazines = ref<{ id : string; title : string, url : string }[]>([]);
	
	const coverList = ref<CoverInfo[]>([]);

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
		const result = await extractService.extract(id, url);
		if (result.errCode == 0) {
			uni.showToast({
				icon: "success",
				title: result.errMsg
			})
		}

	}

	onReady(async () => {
		const coverRes = await extractService.getCoverList<CoverInfo[]>();
		
		coverList.value = coverRes;
			
	})
</script>

<style lang="scss" scoped>

</style>