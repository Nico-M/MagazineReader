<template>
	<template v-if="node.type !== 'text'">
		<view :if="node.name == 'view'" :class="node.attrs&&node.attrs.class">
			<RecursiveElement v-for="(child, idx) in node.children" :key="idx" :node="child" />
		</view>
		<view :if="node.name == 'text'">
			<RecursiveElement v-for="(child, idx) in node.children" :key="idx" :node="child" />
		</view>
	</template>
	<template v-else>
		{{ node.text }}
	</template>
</template>

<script lang="ts">
interface TextNode {
	type: 'text';
	text: string;
}

interface ParentNode {
	name: string;
	attrs?: {
		class: string;
	};
	children?: ElementNode;
}

export type ElementNode = (ParentNode | TextNode);
</script>

<script setup lang="ts">
defineProps<{
	node: ElementNode
}>()
</script>

<style></style>