<!--
 * @Author: bugdr
 * @Date: 2022-04-18 19:25:08
 * @LastEditors: bugdr
 * @LastEditTime: 2022-04-18 19:33:27
 * @FilePath: \educational_reformp-project\src\components\bim-model\bim-model.vue
 * @Description: bim模型组件
-->
<template>
	<div class="bim-container">
		<canvas id="myCanvas"></canvas>
		<canvas id="myAxisGizmoCanvas"></canvas>
		<canvas id="myNavCubeCanvas"></canvas>
		<div id="myDatGuiContainer"></div>
	</div>
</template>
<script setup name="BimModel">
import { ref, onUnmounted } from "vue";
import {
	Viewer,
	GLTFLoaderPlugin,
	AxisGizmoPlugin,
	LocaleService,
	NavCubePlugin,
	DirLight,
	AmbientLight,
} from "@xeokit/xeokit-sdk";
import * as dat from "dat.gui";
import { getBimFindAll } from "../../api/service/bim";
import Constants from "../../utils/Constants.js";
const page = ref({
	pageNum: 1,
	pageSize: 20,
});

// 获取bim模型
const getBimAll = async () => {
	const params = { ...page.value };
	const result = await getBimFindAll(params);
	if (result.code === Constants.status.SUCCESS) {
		// 模型地址
		const gltfUrl = result.data.list[0].url;
		gltfModelInit(gltfUrl);
	} else {
		ElMessage.error(result.msg);
	}
};
getBimAll();
// 放大初始值
let glftZoom = ref(0);
let model = null;

// 模型初始化方法
const gltfModelInit = (gltfUrl) => {
	// 首先定义viewr视图,传入dom的id
	const viewer = new Viewer({
		canvasId: "myCanvas", // dom的id
		transparent: true, // 属性值为透明
		// 语言服务，提供方向
		localeService: new LocaleService({
			messages: {
				en: {
					// English
					NavCube: {
						front: "前",
						back: "后",
						top: "上",
						bottom: "下",
						left: "左",
						right: "右",
					},
				},
			},
			locale: "en",
		}),
	});
	// 默认的语言服务
	viewer.localeService.locale = "en";
	// 以视图驱动相机
	viewer.camera.orbitPitch(0); // 轨道间距为20
	viewer.camera.orbitYaw(0); // 轨道偏航
	// 开启sao,环境光遮蔽
	viewer.scene.sao.enabled = true;
	viewer.scene.sao.numSamples = 60;
	viewer.scene.sao.kernelRadius = 170;
	viewer.camera.project.fov = 45;
	// 缩放
	viewer.camera.zoom(5);

	// 点位注解
	viewer.scene.camera.eye = [-2.37, 18.97, -26.12];
	viewer.scene.camera.look = [10.97, 5.82, -11.22];
	viewer.scene.camera.up = [0.36, 0.83, 0.4];
	// 场景所选材料为填充阿尔法
	viewer.scene.selectedMaterial.fillAlpha = 0.1;

	// 开启右侧方向控制
	new NavCubePlugin(viewer, {
		canvasId: "myNavCubeCanvas",
		color: "lightblue",
		visible: true,
		size: 250,
		cameraFly: true,
		cameraFitFOV: 45,
		cameraFlyDuration: 0.5,
	});

	const guiParams = new (function () {
		this["Current Locale"] = viewer.localeService.locale;
	})();

	const update = function () {
		viewer.localeService.locale = guiParams["Current Locale"];
		requestAnimationFrame(update);
	};

	update();
	// 数据gui加速
	const gui = new dat.GUI({ autoPlace: false, width: "100%" });

	const localizationFolder = gui.addFolder("Localization");
	localizationFolder.add(
		guiParams,
		"Current Locale",
		viewer.localeService.locales
	);
	localizationFolder.open();

	const customContainer = document.getElementById("myDatGuiContainer");
	customContainer.appendChild(gui.domElement);

	window.viewer = viewer;

	// 加载器插件
	const gltfLoader = new GLTFLoaderPlugin(viewer);

	// 坐标轴
	new AxisGizmoPlugin(viewer, {
		canvasId: "myAxisGizmoCanvas",
	});
	// 缩放比例值
	// 设置模型，并且加载模型
	model = gltfLoader.load({
		id: "myModel",
		src: gltfUrl,
		// 边缘化
		edges: true,
		// 表现化
		performance: true,
		rotation: [0, 0, 0], // 位置
		scale: [0.5, 0.5, 0.5], // 缩放
		position: [glftZoom.value * 100, 0, 0], // 放大
		pbr: true, // 加载多个模型
		sao: true, // 加载多个模型
	});

	// 加载模型
	model.on("loaded", () => {
		// 设置元模型
		// 相机飞行
		viewer.cameraFlight.flyTo(model);
		viewer.cameraControl.on("picked", function (e) {
			console.log(e.entity.id);
		});
	});
	// 模型场景化
	model = viewer.scene.models["myModel"];

	// 方向光
	new DirLight(viewer.scene, {
		dir: [-0.8, -0.6, -0.8],
		color: [1.0, 1.0, 0.9],
		intensity: 1.0,
		space: "world",
	});
	// 环境光
	new AmbientLight(viewer.scene, {
		color: [0.9, 0.9, 1.0],
		intensity: 0.8, // 强度
	});
};

// 销毁模型
onUnmounted(() => {
	model.destroy();
});
</script>
<style lang="scss" scoped>
.bim-container {
	height: 80vh;
	width: 100%;
	#myCanvas {
		position: absolute;
		z-index: 100000;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background: lightblue;
		background-image: linear-gradient(lightblue, white);
	}
	#myAxisGizmoCanvas {
		position: absolute;
		width: 140px;
		height: 140px;
		bottom: 20px;
		left: 20px;
		z-index: 200000;
	}
	#myNavCubeCanvas {
		position: absolute;
		width: 140px;
		height: 140px;
		bottom: 20px;
		right: 20px;
		z-index: 200000;
	}
	.myZoom {
		position: absolute;
		top: 50px;
		right: 50px;
		z-index: 200000;
	}
}
</style>
