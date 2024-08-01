<template>
	<view class="cust-card">
		<image class="card-img" mode="aspectFit"
			:src="cardInfo.coverUrlPreview" alt=""></image>
		<view class="info">
			<view>
				<uni-title class="h4" type="h4" :title="cardInfo.title">
				</uni-title>
				<view class="sub-title">
					{{cardInfo.date}}
				</view>
			</view>
			<view class="action">
				<view class="add-btn" @click="activeStar">
					<uni-icons :type="starActive?'star-filled':'star'" :color="starActive?'#e43d33':''"></uni-icons>
					<text>
						Add to Bookshelf
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
	interface Item {
			coverUrl : string,
			title : string,
			date : string,
			version : string,
			coverUrlPreview : string
		}
	const props = defineProps<{
		item : Item
	}>()
	const cardInfo  = props.item;
	const starActive = ref(false);
	const activeStar = ()=>{
		starActive.value=!starActive.value;
		if(starActive.value) {
			uni.showToast({
				title:'The book has added !'
			})
		}
		
	}
</script>

<style lang="scss">
	.cust-card {
		display: flex;

		.card-img {
			width: 128px;
			height: 170px;
		}

		.info {
			padding: 0 4px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.sub-title {
				font-size: 30rpx;
				color: $uni-info;
			}
		}
	}
</style>