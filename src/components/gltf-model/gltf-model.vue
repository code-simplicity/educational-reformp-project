<!--
 * @Author: bugdr
 * @Date: 2022-04-25 17:25:39
 * @LastEditors: bugdr
 * @LastEditTime: 2022-04-25 17:48:00
 * @FilePath: \educational-reformp-project\src\components\gltf-model\gltf-model.vue
 * @Description: gltf模型
-->
<template>
	<div class="concatioa" ref="screenfullRef">
		<div id="stats-panel"></div>
		<div id="myCanvas" class="myCanvas" ref="myCanvas"></div>
		<div class="maskLoading" v-if="isLoading">
			<div class="loading">
				<div class="login-box" :style="{ width: loadingWidth + '%' }"></div>
			</div>
			<div class="show-loading-tip">{{ parseInt(loadingWidth) }}%</div>
		</div>
		<div class="mask" v-else>
			<div class="coordinate">
				<p>x: {{ x }}</p>
				<p>y: {{ y }}</p>
				<p>z: {{ z }}</p>
			</div>
			<div class="icon-box" @click="isAutoFun">
				<el-icon v-if="autoRotate" class="pauseIcon" size="40px"
					><video-play
				/></el-icon>
				<el-icon v-else class="pauseIcon" size="40px"><video-pause /></el-icon>
			</div>
		</div>
		<ScreenFull :screenfullRef="screenfullRef" />
	</div>
</template>
<script setup name="GltfModel">
import { onMounted, reactive, ref, toRefs, defineProps } from "vue";
import {
	Color, // 颜色构造器
	DirectionalLight, // 平行光
	DirectionalLightHelper, // 平行光 DirectionalLight 的辅助对象. 其中包含了表示光位置的平面和表示光方向的线段.
	HemisphereLight, // 半球光 光源直接放置于场景之上，光照颜色从天空光线颜色颜色渐变到地面光线颜色。
	HemisphereLightHelper, // 半球光辅助对象
	PerspectiveCamera, // 透视相机
	Scene, // 场景构造器
	WebGLRenderer, // 使用webGl渲染场景
} from "three";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; // 对场景进行控制 缩放 平移 旋转 等
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js"; // 第一人称
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js"; // 3D视觉
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; // 用于加载3D模型
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"; // 用于加载3D模型
import { VideoPause, VideoPlay } from "@element-plus/icons-vue";
import Stats from "stats.js"; // 帧率
import { getBimFindAll } from "../../api/service/bim";
import Constants from "../../utils/Constants.js";
import ScreenFull from "../screenfull/index.vue";
const page = ref({
	pageNum: 1,
	pageSize: 20,
});
// 父组件全屏的容器
const screenfullRef = ref();
// 路径
let gltfUrl = ref("");
// 获取bim模型
const getBimAll = async () => {
	const params = { ...page.value };
	const result = await getBimFindAll(params);
	if (result.code === Constants.status.SUCCESS) {
		// 模型地址
		gltfUrl = result.data.list[0].url;
	} else {
		ElMessage.error(result.msg);
	}
	return gltfUrl;
};
// 显示不用克制按钮
const autoRotate = ref(false);
const loader = new GLTFLoader(); //引入模型的loader实例
// 相机位置
const defaultMap = {
	x: 34,
	y: 98,
	z: -660,
}; // 相机的默认坐标
const map = reactive(defaultMap); // 把相机坐标设置成可观察对象
const { x, y, z } = toRefs(map); // 输出坐标给模板使用
let scene,
	camera,
	renderer,
	controls,
	floor,
	dhelper,
	hHelper,
	directionalLight,
	statsjs,
	hemisphereLight; // 定义所有three实例变量
let isLoading = ref(true); //是否显示loading  这个load模型监听的进度
let loadingWidth = ref(0); // loading的进度

//创建灯光
const setLight = () => {
	directionalLight = new DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(-4, 8, 4);
	dhelper = new DirectionalLightHelper(directionalLight, 5, 0xff0000);
	hemisphereLight = new HemisphereLight(0xffffff, 0xffffff, 0.4);
	hemisphereLight.position.set(0, 8, 0);
	hHelper = new HemisphereLightHelper(hemisphereLight, 5);
	scene.add(directionalLight);
	scene.add(hemisphereLight);
};
let myCanvas = ref(null);
// 创建场景
const setScene = () => {
	scene = new Scene();
	renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(innerWidth, innerHeight);
	document.querySelector(".myCanvas").appendChild(renderer.domElement);
};
// 创建相机
const setCamera = () => {
	const { x, y, z } = defaultMap;
	camera = new PerspectiveCamera(
		50,
		myCanvas.value.clientWidth / myCanvas.value.clientHeight,
		0.01, // 摄像机视锥体近端面
		2000 // 摄像机视锥体远端面
	);
	camera.position.set(x, y, z);
};
// 设置模型控制
const setControls = () => {
	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableKeys = true;
	controls.autoRotateSpeed = 1.0; // 自动旋转速度
	controls.autoRotate = false; // 是否自动旋转
	controls.dampingFactor = 0.2; // 阻尼因子
	controls.rotateSpeed = 0.25; // 手动旋转速度
	controls.addEventListener("change", render);
};
//返回坐标信息
const render = () => {
	map.x = Number.parseInt(camera.position.x);
	map.y = Number.parseInt(camera.position.y);
	map.z = Number.parseInt(camera.position.z);
};
// 循环场景 、相机、 位置更新
const loop = () => {
	requestAnimationFrame(loop);
	renderer.render(scene, camera);
	controls.update();
};
//是否自动转动
const isAutoFun = () => {
	controls.autoRotate = !controls.autoRotate;
	autoRotate.value = !autoRotate.value;
};

// 加载请求文件
const loadFile = (url) => {
	return new Promise((resolve, reject) => {
		loader.load(
			url,
			(gltf) => {
				resolve(gltf);
			},
			({ loaded, total }) => {
				let load = Math.abs((loaded / total) * 100);
				loadingWidth.value = load;
				if (load >= 100) {
					setTimeout(() => {
						isLoading.value = false;
					}, 1000);
				}
			},
			(err) => {
				reject(err);
			}
		);
	});
};
// 更新帧率
const updateStats = () => {
	statsjs = new Stats();
	//设置统计模式
	statsjs.setMode(0); // 0: fps, 1: ms
	document.getElementById("stats-panel").appendChild(statsjs.dom);
};

// 动画
const animation = () => {
	// 更新fps
	statsjs.update();
	// 渲染自己
	requestAnimationFrame(animation);
};

// 加载场景
const loadRGBELoaderScene = (url) => {
	if (/\.hdr$/i.test(url)) {
		new RGBELoader().load(url, (texture) => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			scene.background = texture;
			// scene.environment = texture;
		});
	} else if (/\.(jpg|jpeg|png|gif|bmp)$/i.test(url)) {
		new THREE.TextureLoader().load(url, (texture) => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			scene.background = texture;
			// scene.environment = texture;
		});
	}
};
//初始化所有函数
const init = async () => {
	setScene();
	setCamera();
	setLight();
	setControls();
	updateStats();
	loadRGBELoaderScene("scene/cloudySkyBox.jpg");
	animation();
	const gltf = await getBimAll();
	// 传入url
	const gltfVal = await loadFile(gltf);
	scene.add(gltfVal.scene);
	loop();
};

//用vue钩子函数调用
onMounted(() => {
	init();
});
</script>
<style lang="scss" scoped>
.concatioa {
	width: 100%;
	#stats-panel {
		position: absolute;
		z-index: 9999;
	}
	#myCanvas {
		position: absolute;
		z-index: 1000;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		cursor: pointer;
	}
	.maskLoading {
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 99999;

		.loading {
			width: 300px;
			height: 16px;
			border: 1px solid #fff;
			background: rgba(248, 0, 0, 0.26);
			overflow: hidden;
			border-radius: 8px;
			.login-box {
				background: rgb(12, 16, 253);
				height: 16px;
				width: 0;
				transition-duration: 500ms;
				transition-timing-function: ease-in;
			}
		}
		.show-loading-tip {
			margin-left: 10px;
		}
	}
	.mask {
		position: absolute;
		z-index: 9999;
		bottom: 20px;
		left: 46%;
		display: flex;
		align-items: center;
		color: rgb(255, 0, 0);

		.coordinate {
			width: 80px;
			font-size: 16px;
		}
		.icon-box {
			cursor: pointer;
			.pauseIcon {
				margin: 10px;
				&:hover {
					color: rgb(4, 92, 255);
				}
			}
		}
	}
}
</style>
