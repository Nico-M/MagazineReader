<template>
	<view class="uni-pt-1">
		<uni-grid :column="2" :showBorder="false">
			<uni-grid-item v-for="book in rawBooks" :key="book.bookId"> 
				<uni-card @click="navigateToReader(book)">
					<text class="break-word">{{book.title}}</text>
				</uni-card>
			</uni-grid-item>
		</uni-grid>
	</view>
	
</template>

<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	export interface RawBookInfo {
		creator: string;
		description: string;
		title: string;
		bookId: string
	}
	
	const rawBooks = reactive<RawBookInfo[]>([])
	
	onMounted(()=>{
		uniCloud.callFunction({
			name: "getMetaOfRawBook"
		}).then((res:{
			result:RawBookInfo[]}
		) => {
			console.log(res);
			const data = res.result;
			rawBooks.push(...data)
		})
	})
	
	const navigateToReader = (params: RawBookInfo)=>{
		const url =  `/pages/reader/reader?bookId=${params.bookId}&title=${encodeURIComponent(params.title)}`;
	
		uni.navigateTo({
			url
		})
	}

</script>

<style>
	.break-word{
		word-wrap: break-word;
	}
</style>