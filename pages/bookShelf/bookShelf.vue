<template>
	<view class="uni-pt-1">
		<uni-grid :column="2" :showBorder="false">
			
			<uni-grid-item v-for="book in rawBooks" :key="book.bookId" >  
				<view class="uni-pa-4" @tap="()=>navigateToReader(book)">
					<image style="width: 100%;" src="https://env-00jxgx7alot1.normal.cloudstatic.cn/books/covers/20240622_DE_AP.jpg" alt="" />
					<text class="break-word">{{book.title}}</text>
				</view>
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
		console.log('test');
		const url =  `/pages/reader/reader?bookId=${params.bookId}&title=${encodeURIComponent(params.title)}`;
		console.log(url);
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