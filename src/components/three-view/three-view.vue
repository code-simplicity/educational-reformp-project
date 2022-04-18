<template>
	<div ref="threeRef" id="three-conctiner"></div>
</template>

<script setup name="ThreeView">
import { ref, watch, onMounted, defineProps } from "vue";
import ThreeBase from "./three-base.js";
const props = defineProps({
	// 场景纹理url
	sceneUrl: {
		type: String,
		required: true,
	},
	// 模型url
	modelUrl: {
		type: String,
	},
	// 是否自动旋转
	autoRotate: {
		type: Boolean,
		default: false,
	},
	// 生成的canvas是否铺满浏览器
	isFullBrowser: {
		type: Boolean,
		default: true,
	},
});

// three实例
let threeView = ref(null);
const threeRef = ref(null);
onMounted(() => {
	threeView = new ThreeBase(threeRef.value, {
		sceneUrl: props.sceneUrl,
		modelUrl: props.modelUrl,
		autoRotate: props.autoRotate,
		isFullBrowser: props.isFullBrowser,
	});
});

// 观察场景纹理url
watch(props.sceneUrl, (newVal) => {
	threeView.value.loadScene(newVal);
});
// 观察模型url
watch(props.modelUrl, (newVal) => {
	threeView.value.loadModel(newVal);
});
// 观察是否自动旋转
watch(props.sceneUrl, (newVal) => {
	threeView.value.controlsRotate(newVal);
});
</script>
<style lang="scss" scoped>
#three-conctiner {
	width: 100%;
	height: 100%;
	cursor: grab;
}
</style>
