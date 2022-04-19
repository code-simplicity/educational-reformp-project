<!--
 * @Author: bugdr
 * @Date: 2022-04-19 08:59:47
 * @LastEditors: bugdr
 * @LastEditTime: 2022-04-19 09:36:02
 * @FilePath: \educational-reformp-project\src\components\screenfull\index.vue
 * @Description: 全屏组件
-->
<template>
	<div class="screenfull-container" @click="screenfullChange">
		<i
			class="iconfont"
			:class="isFullBrowser ? ' icon-quanping' : 'icon-tuichuquanping-02'"
			style="font-size: 26px"
		/>
	</div>
</template>
<script setup name="ScreenFull">
import { ref, onMounted } from "vue";
import { FullScreen } from "@element-plus/icons-vue";
import screenfull from "screenfull";
const props = defineProps({
	screenfullRef: String,
});
// 是否全屏
let isFullBrowser = ref(false);
onMounted(() => {
	screenfull.on("change", () => {
		isFullBrowser.value = screenfull.isFullscreen;
	});
});
// 实现全屏切换
const screenfullChange = () => {
	// 全屏状态下按esc可以离开
	// 这里我们做一个这样的调整，实现页面全屏和部分内容全屏
	// 首先就是传入一个ref，这个ref是父组件传递过来的。
	if (props.screenfullRef && screenfull.isEnabled) {
		screenfull.toggle(props.screenfullRef); // 触发change事件
	} else {
		// 如果父组件没有传递ref，那么就认为是全局全屏
		screenfull.toggle(); // 触发change事件
	}
};
</script>
<style lang="scss" scoped>
.screenfull-container {
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 999999;
	cursor: pointer;
}
</style>
