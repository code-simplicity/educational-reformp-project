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
		<div class="error-message" v-if="loadingFailed">
			<h3>模型加载失败</h3>
			<p>无法加载3D模型，请检查文件格式或网络连接</p>
			<el-button type="primary" @click="resetAndReload">重试</el-button>
			</div>
		<div class="enhanced-control-panel" v-if="!isLoading && !loadingFailed">
			<div class="panel-header" @click="toggleControlPanel">
				<span>模型控制面板</span>
				<div class="header-actions">
					<span class="fps-counter">FPS: {{ currentFPS }}</span>
					<el-icon class="toggle-icon"
						><ArrowDown v-if="showControlPanel" /><ArrowRight v-else
				/></el-icon>
			</div>
		</div>

			<div class="panel-content" v-show="showControlPanel">
				<!-- 性能控制区 -->
				<div class="control-group">
					<div class="group-title">性能与显示</div>

					<div class="control-row quality-selector">
						<span>渲染质量:</span>
						<el-radio-group
							v-model="qualityMode"
							@change="setQualityMode"
							size="small"
						>
							<el-radio-button label="auto">自动</el-radio-button>
							<el-radio-button label="low">低</el-radio-button>
							<el-radio-button label="medium">中</el-radio-button>
							<el-radio-button label="high">高</el-radio-button>
						</el-radio-group>
					</div>

					<div class="control-row">
						<span>透明度:</span>
						<el-slider
							v-model="modelOpacity"
							:min="0.1"
							:max="1"
							:step="0.05"
							@change="updateModelOpacity"
							size="small"
						></el-slider>
					</div>

					<div class="control-actions">
						<el-checkbox
							v-model="showWireframe"
							@change="toggleWireframe"
							size="small"
							>线框模式</el-checkbox
						>
						<el-checkbox
							v-model="enableAntiAlias"
							@change="toggleAntiAlias"
							size="small"
							>抗锯齿</el-checkbox
						>
					</div>
				</div>

				<!-- 视图控制区 -->
				<div class="control-group">
					<div class="group-title">视图控制</div>

					<div class="view-buttons">
						<el-button-group>
							<el-button size="small" @click="setCameraView('front')"
								>正视图</el-button
							>
							<el-button size="small" @click="setCameraView('top')"
								>俯视图</el-button
							>
							<el-button size="small" @click="setCameraView('side')"
								>侧视图</el-button
							>
							<el-button size="small" @click="resetCamera">重置</el-button>
						</el-button-group>
					</div>

					<div class="control-actions">
						<el-checkbox
							v-model="autoRotate"
							@change="toggleAutoRotate"
							size="small"
							>自动旋转</el-checkbox
						>
						<el-popover placement="bottom" :width="200" trigger="click">
							<template #reference>
								<el-button size="small" icon="setting">旋转设置</el-button>
							</template>
							<div class="rotation-settings">
								<div class="setting-item">
									<span>旋转速度:</span>
									<el-slider
										v-model="rotationSpeed"
										:min="0.1"
										:max="5"
										:step="0.1"
										@change="updateRotationSpeed"
										size="small"
									></el-slider>
								</div>
							</div>
						</el-popover>
					</div>
				</div>

				<!-- 工具区 -->
				<div class="control-group">
					<div class="group-title">辅助工具</div>

					<div class="tool-buttons">
						<el-button-group>
							<el-button
								size="small"
								:type="showGrid ? 'primary' : ''"
								@click="toggleGrid(!showGrid)"
								>网格</el-button
							>
							<el-button
								size="small"
								:type="showAxes ? 'primary' : ''"
								@click="toggleAxes(!showAxes)"
								>坐标轴</el-button
							>
							<el-button
								size="small"
								:type="showBoundingBox ? 'primary' : ''"
								@click="toggleBoundingBox(!showBoundingBox)"
								>边界框</el-button
							>
						</el-button-group>
					</div>

					<div class="special-actions">
						<el-button
							size="small"
							@click="captureScreenshot"
							type="success"
							icon="camera"
							>截图</el-button
						>
						<el-button
							size="small"
							@click="toggleFullscreen"
							type="primary"
							icon="full-screen"
							>全屏</el-button
						>
					</div>
				</div>

				<!-- 交互区 -->
				<div class="control-group">
					<div class="group-title">模型交互</div>

					<div class="interaction-buttons">
						<el-button-group>
							<el-button
								size="small"
								:type="measureMode ? 'primary' : ''"
								@click="toggleMeasureMode"
								>测量工具</el-button
							>
							<el-button
								size="small"
								:type="explosionMode ? 'primary' : ''"
								@click="toggleExplosionMode"
								>爆炸视图</el-button
							>
						</el-button-group>
					</div>

					<div v-if="measureMode" class="measure-result">
						<span
							>测量结果:
							{{
								measureResult
									? measureResult.toFixed(2) + ' 单位'
									: '请选择两点'
							}}</span
						>
					</div>

					<div v-if="explosionMode" class="explosion-control">
						<span>爆炸程度:</span>
						<el-slider
							v-model="explosionStrength"
							:min="0"
							:max="2"
							:step="0.1"
							@input="updateExplosionView"
							size="small"
						></el-slider>
					</div>
				</div>
			</div>
		</div>
		<div class="coordinates-display" v-if="!isLoading && !loadingFailed">
			<div class="coord-value">
				X: {{ x.toFixed(2) }} Y: {{ y.toFixed(2) }} Z: {{ z.toFixed(2) }}
			</div>
			<div v-if="hoveredObjectInfo" class="object-info">
				{{ hoveredObjectInfo }}
			</div>
		</div>
		<div
			class="mode-indicator"
			v-if="!isLoading && (measureMode || explosionMode)"
		>
			<div v-if="measureMode" class="mode-badge measure">测量模式</div>
			<div v-if="explosionMode" class="mode-badge explosion">爆炸视图</div>
		</div>
	</div>
</template>
<script setup name="GltfModel">
import {
	onMounted,
	reactive,
	ref,
	toRefs,
	defineProps,
	onBeforeUnmount,
} from 'vue';
import {
	Color, // 颜色构造器
	DirectionalLight, // 平行光
	DirectionalLightHelper, // 平行光 DirectionalLight 的辅助对象. 其中包含了表示光位置的平面和表示光方向的线段.
	HemisphereLight, // 半球光 光源直接放置于场景之上，光照颜色从天空光线颜色颜色渐变到地面光线颜色。
	HemisphereLightHelper, // 半球光辅助对象
	PerspectiveCamera, // 透视相机
	Scene, // 场景构造器
	WebGLRenderer, // 使用webGl渲染场景
} from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // 对场景进行控制 缩放 平移 旋转 等
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'; // 第一人称
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'; // 3D视觉
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // 用于加载3D模型
// 正确地导入 DRACOLoader - 检查路径是否与您的 Three.js 版本匹配
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'; // 用于加载3D模型
import {
	VideoPause,
	VideoPlay,
	ArrowDown,
	ArrowRight,
	FullScreen,
	Camera,
} from '@element-plus/icons-vue';
import Stats from 'stats.js'; // 帧率
import { getBimFindAll } from '../../api/service/bim';
import Constants from '../../utils/Constants.js';
import ScreenFull from '../screenfull/index.vue';
import { ElMessage } from 'element-plus'; // 添加消息组件
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

const page = ref({
	pageNum: 1,
	pageSize: 20,
});
// 父组件全屏的容器
const screenfullRef = ref();
// 路径
let gltfUrl = ref('');
// 获取bim模型
const getBimAll = async () => {
	try {
	const params = { ...page.value };
	const result = await getBimFindAll(params);
	if (result.code === Constants.status.SUCCESS) {
		// 模型地址
		gltfUrl = result.data.list[0].url;
			console.log('获取到模型URL:', gltfUrl);
	} else {
			ElMessage.error(result.msg || '获取模型数据失败');
		}
		return gltfUrl;
	} catch (error) {
		console.error('获取模型数据时出错:', error);
		ElMessage.error('获取模型数据时出错');
		return null;
	}
};
// 显示不用克制按钮
const autoRotate = ref(false);
// 为了安全起见，修改创建加载器的代码，使其在 DRACOLoader 不可用时降级
const createEnhancedLoader = () => {
	try {
		// 尝试创建支持 Draco 的加载器
		const loader = new GLTFLoader();

		// 检查 DRACOLoader 是否可用
		if (typeof DRACOLoader !== 'undefined') {
			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
			loader.setDRACOLoader(dracoLoader);
			console.log('DRACO 压缩支持已启用');
		} else {
			console.warn('DRACO 压缩支持不可用，使用标准 GLTFLoader');
		}

		return loader;
	} catch (error) {
		console.error('创建增强加载器失败，使用标准加载器:', error);
		return new GLTFLoader();
	}
};

// 使用增强版加载器
const loader = createEnhancedLoader();

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
let loadingFailed = ref(false); // 添加加载失败标志

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
	try {
	scene = new Scene();
		renderer = new WebGLRenderer({
			antialias: false,
			powerPreference: 'high-performance',
			precision: 'mediump',
			alpha: false,
			stencil: false,
			depth: true,
		});

		renderer.setPixelRatio(1);
		renderer.shadowMap.enabled = false;
		renderer.outputEncoding = THREE.LinearEncoding;

		const canvas = document.querySelector('.myCanvas');
		if (!canvas) {
			console.error('找不到canvas元素');
			return;
		}

		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		canvas.appendChild(renderer.domElement);

		const gl = renderer.getContext();
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		renderer.autoClear = false;

		console.log('场景和渲染器已创建');

		setupStats();
	} catch (error) {
		console.error('创建场景时出错:', error);
		loadingFailed.value = true;
		ElMessage.error('初始化3D场景失败');
	}
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
	controls.addEventListener('change', render);
};
//返回坐标信息
const render = () => {
	map.x = Number.parseInt(camera.position.x);
	map.y = Number.parseInt(camera.position.y);
	map.z = Number.parseInt(camera.position.z);
};
// 全局渲染质量控制
let currentQuality = 'medium'; // 'low', 'medium', 'high'
let targetFPS = 30; // 目标帧率
let accumulatedTime = 0;
let frameCount = 0;
let lastFrameTime = 0;
let currentFPS = ref(0);

// 自动调整质量
const autoAdjustQuality = (fps) => {
	console.log(`当前FPS: ${fps}`);

	// 更智能的FPS阈值
	const lowThreshold = 25;
	const highThreshold = 45;

	// 基于FPS自动调整质量
	if (fps < lowThreshold) {
		// 性能不足，降低质量
		if (currentQuality !== 'low') {
			currentQuality = 'low';
			ElMessage.info('已自动降低渲染质量以提高性能');
		}
	} else if (fps > highThreshold) {
		// 性能充足，提高质量
		if (currentQuality === 'low') {
			currentQuality = 'medium';
		} else if (currentQuality === 'medium' && fps > 55) {
			currentQuality = 'high';
		}
	}
	// 如果FPS处于中间范围，保持当前质量级别
};

// 应用不同质量级别
const applyQuality = (quality) => {
	switch (quality) {
		case 'low':
			// 低质量模式：性能优先
			renderer.setPixelRatio(1);

			// 禁用任何后处理效果
			if (composer) {
				composer.passes.forEach((pass) => {
					if (pass !== composer.passes[0]) {
						// 保留第一个RenderPass
						pass.enabled = false;
					}
				});
			}

			// 应用低质量材质
			scene.traverse((node) => {
				if (node.isMesh && node.material) {
					// 使用平面着色
					node.material.flatShading = true;

					// 低精度
					node.material.precision = 'lowp';

					// 禁用复杂特性
					node.material.fog = false;

					// 降低纹理质量
					if (node.material.map) {
						node.material.map.minFilter = THREE.NearestFilter;
						node.material.map.magFilter = THREE.NearestFilter;
						node.material.map.anisotropy = 1;
					}

					node.material.needsUpdate = true;
				}
			});
			break;

		case 'medium':
			// 中等质量模式：平衡
			renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));

			// 启用基本后处理
			if (composer && fxaaPass) {
				fxaaPass.enabled = enableAntiAlias.value;
			}

			// 应用中等质量材质
			scene.traverse((node) => {
				if (node.isMesh && node.material) {
					// 使用平滑着色
					node.material.flatShading = false;

					// 中等精度
					node.material.precision = 'mediump';

					// 启用适当的效果
					node.material.dithering = true;

					// 中等纹理质量
					if (node.material.map) {
						node.material.map.minFilter = THREE.LinearFilter;
						node.material.map.magFilter = THREE.LinearFilter;
						node.material.map.anisotropy = 2;
					}

					node.material.needsUpdate = true;
				}
			});
			break;

		case 'high':
			// 高质量模式：质量优先
			renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

			// 启用所有后处理
			if (composer) {
				composer.passes.forEach((pass) => {
					pass.enabled = true;
				});
			}

			// 应用高质量材质
			scene.traverse((node) => {
				if (node.isMesh && node.userData.highQualityMaterial) {
					// 使用高质量材质
					node.material = node.userData.highQualityMaterial.clone();

					// 设置高质量纹理
					if (node.material.map) {
						node.material.map.minFilter = THREE.LinearMipmapLinearFilter;
						node.material.map.magFilter = THREE.LinearFilter;
						node.material.map.anisotropy = 4;
					}
				}
			});
			break;
	}
};

// 用户交互状态跟踪
let isUserInteracting = false;
let interactionTimeout;

// 添加交互事件监听
const setupInteractionTracking = () => {
	const canvas = document.querySelector('.myCanvas');

	const startInteraction = () => {
		isUserInteracting = true;
		clearTimeout(interactionTimeout);
	};

	const endInteraction = () => {
		clearTimeout(interactionTimeout);
		interactionTimeout = setTimeout(() => {
			isUserInteracting = false;
		}, 1000); // 交互结束1秒后恢复
	};

	// 鼠标事件
	canvas.addEventListener('mousedown', startInteraction);
	canvas.addEventListener('mousemove', startInteraction);
	canvas.addEventListener('mouseup', endInteraction);

	// 触摸事件
	canvas.addEventListener('touchstart', startInteraction);
	canvas.addEventListener('touchmove', startInteraction);
	canvas.addEventListener('touchend', endInteraction);

	// 滚轮事件
	canvas.addEventListener('wheel', startInteraction, { passive: true });
};

// 更新帧率
const updateStats = () => {
	statsjs = new Stats();
	//设置统计模式
	statsjs.setMode(0); // 0: fps, 1: ms
	document.getElementById('stats-panel').appendChild(statsjs.dom);
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

// 添加到 setup 中的响应式变量
const isControlPanelVisible = ref(true);
const qualityLevel = ref('medium');

// 更改渲染质量
const changeQuality = (level) => {
	currentQuality = level;
	applyQuality(level);
};

// 设置不同视图
const setView = (viewType) => {
	const { x, y, z } = defaultMap;
	let targetPosition;

	switch (viewType) {
		case 'top':
			targetPosition = { x: 0, y: Math.abs(y) * 1.2, z: 0 };
			break;
		case 'front':
			targetPosition = { x: 0, y: 0, z: Math.abs(z) * 0.5 };
			break;
		case 'side':
			targetPosition = { x: Math.abs(x) * 1.2, y: 0, z: 0 };
			break;
		default:
			return;
	}

	// 使用平滑动画过渡到新视图
	animateCamera(targetPosition);
};

// 重置视图
const resetView = () => {
	animateCamera(defaultMap);
};

// 使用平滑动画移动相机
const animateCamera = (targetPosition, lookAtPos) => {
	// 创建动画开始值的克隆
	const startPosition = {
		x: camera.position.x,
		y: camera.position.y,
		z: camera.position.z,
	};

	// 如果未提供lookAt位置，默认看向原点
	lookAtPos = lookAtPos || new THREE.Vector3(0, 0, 0);

	// 动画持续时间
	const duration = 1000;
	const startTime = Date.now();

	// 动画函数
	function animate() {
		const now = Date.now();
		const elapsed = now - startTime;

		if (elapsed < duration) {
			// 计算插值
			const t = elapsed / duration;
			const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // 使用缓动函数

			// 更新相机位置
			camera.position.x =
				startPosition.x + (targetPosition.x - startPosition.x) * easedT;
			camera.position.y =
				startPosition.y + (targetPosition.y - startPosition.y) * easedT;
			camera.position.z =
				startPosition.z + (targetPosition.z - startPosition.z) * easedT;

			// 相机看向指定点
			if (lookAtPos instanceof THREE.Vector3) {
				camera.lookAt(lookAtPos);
			} else {
				camera.lookAt(new THREE.Vector3(0, 0, 0));
			}

			// 继续动画
			requestAnimationFrame(animate);
		} else {
			// 设置最终位置
			camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
			if (lookAtPos instanceof THREE.Vector3) {
				camera.lookAt(lookAtPos);
			} else {
				camera.lookAt(new THREE.Vector3(0, 0, 0));
			}
		}
	}

	// 开始动画
	animate();
};

// 更新模型透明度
const updateModelOpacity = (value) => {
	scene.traverse((node) => {
		if (node.isMesh && node.material) {
			if (value < 1) {
				node.material.transparent = true;
				node.material.opacity = value;
				node.material.needsUpdate = true;
			} else {
				node.material.transparent = false;
				node.material.opacity = 1;
				node.material.needsUpdate = true;
			}
		}
	});
};

// 地面网格
let gridHelper = null;

// 坐标轴
let axesHelper = null;

// 添加到 setup 中的响应式变量
const measureMode = ref(false);
const measureResult = ref(null);
let measurePoints = [];
let measureLine = null;
let measureMarkers = [];

// 切换测量模式
const toggleMeasureMode = () => {
	measureMode.value = !measureMode.value;

	if (!measureMode.value) {
		// 清理测量状态
		clearMeasurement();
	} else {
		// 显示测量提示
		ElMessage.info('点击两个点进行测量，右键或ESC清除测量');
	}
};

// 清理测量
const clearMeasurement = () => {
	// 移除测量线
	if (measureLine) {
		scene.remove(measureLine);
		measureLine = null;
	}

	// 移除测量点标记
	measureMarkers.forEach((marker) => {
		scene.remove(marker);
	});
	measureMarkers = [];

	// 重置测量点
	measurePoints = [];
	measureResult.value = null;
};

// 添加到 setup 中的响应式变量
const sectionMode = ref(false);
const sectionPlaneX = ref(0);
const sectionPlaneY = ref(0);
const sectionPlaneZ = ref(0);
let sectionPlane = null;
let sectionPlaneHelper = null;

// 切换截面模式
const toggleSectionMode = () => {
	sectionMode.value = !sectionMode.value;

	if (sectionMode.value) {
		enableSectionMode();
	} else {
		disableSectionMode();
	}
};

// 启用截面模式
const enableSectionMode = () => {
	// 创建裁剪平面
	sectionPlane = new THREE.Plane(
		new THREE.Vector3(1, 0, 0),
		sectionPlaneX.value
	);

	// 创建平面辅助对象以便可视化
	sectionPlaneHelper = new THREE.PlaneHelper(sectionPlane, 500, 0xff0000);
	scene.add(sectionPlaneHelper);

	// 应用裁剪平面到所有材质
	scene.traverse((node) => {
		if (node.isMesh) {
			// 保存原始材质
			if (!node.userData.originalClipMaterial) {
				node.userData.originalClipMaterial = node.material;
			}

			// 应用裁剪平面
			node.material = new THREE.MeshBasicMaterial({
				color: 0xff0000,
				transparent: true,
				opacity: 0.5,
			});
		}
	});
};

// 禁用截面模式
const disableSectionMode = () => {
	// 移除裁剪平面
	scene.traverse((node) => {
		if (node.isMesh) {
			node.material = node.userData.originalClipMaterial;
			node.userData.originalClipMaterial = null;
		}
	});
};

// 更新裁剪平面
const updateSectionPlane = () => {
	// 移除之前的裁剪平面
	if (sectionPlane) {
		scene.traverse((node) => {
			if (node.isMesh) {
				node.material = node.userData.originalClipMaterial;
				node.userData.originalClipMaterial = null;
			}
		});
	}

	// 创建新的裁剪平面
	sectionPlane = new THREE.Plane(
		new THREE.Vector3(1, 0, 0),
		sectionPlaneX.value
	);

	// 创建新的平面辅助对象以便可视化
	sectionPlaneHelper = new THREE.PlaneHelper(sectionPlane, 500, 0xff0000);
	scene.add(sectionPlaneHelper);

	// 应用裁剪平面到所有材质
	scene.traverse((node) => {
		if (node.isMesh) {
			// 保存原始材质
			if (!node.userData.originalClipMaterial) {
				node.userData.originalClipMaterial = node.material;
			}

			// 应用裁剪平面
			node.material = new THREE.MeshBasicMaterial({
				color: 0xff0000,
				transparent: true,
				opacity: 0.5,
			});
		}
	});
};

// 控制面板数据
const showControlPanel = ref(true);
const qualityMode = ref('auto');
const modelOpacity = ref(1);
const showWireframe = ref(false);
const showGrid = ref(false);
const showAxes = ref(false);
const showBoundingBox = ref(false);
let boundingBoxHelper = null;

// 切换控制面板显示
const toggleControlPanel = () => {
	showControlPanel.value = !showControlPanel.value;
};

// 设置质量模式
const setQualityMode = (mode) => {
	qualityMode.value = mode;

	if (mode !== 'auto') {
		// 覆盖自动质量控制
		applyQuality(mode);
		currentQuality = mode;
	}
};

// 设置相机视角
const setCameraView = (view) => {
	try {
		// 获取模型边界
		const box = new THREE.Box3().setFromObject(scene);
		const center = box.getCenter(new THREE.Vector3());
		const size = box.getSize(new THREE.Vector3());
		const maxDim = Math.max(size.x, size.y, size.z);
		const distance = maxDim * 2;

		let targetPosition = new THREE.Vector3();

		switch (view) {
			case 'front':
				targetPosition.set(center.x, center.y, center.z + distance);
				break;
			case 'top':
				targetPosition.set(center.x, center.y + distance, center.z);
				break;
			case 'side':
				targetPosition.set(center.x + distance, center.y, center.z);
				break;
			default:
				return;
		}

		// 修正animateCamera调用，使用正确的参数
		animateCamera(targetPosition);
	} catch (error) {
		console.error('相机视角设置失败:', error);
	}
};

// 重置相机
const resetCamera = () => {
	try {
		// 直接调用正确参数的动画函数
		animateCamera({
			x: defaultMap.x,
			y: defaultMap.y,
			z: defaultMap.z,
		});
	} catch (error) {
		console.error('重置相机失败:', error);
	}
};

// 切换线框模式
const toggleWireframe = (value) => {
	scene.traverse((node) => {
		if (node.isMesh && node.material) {
			if (Array.isArray(node.material)) {
				node.material.forEach((mat) => {
					mat.wireframe = value;
					mat.needsUpdate = true;
				});
			} else {
				node.material.wireframe = value;
				node.material.needsUpdate = true;
			}
		}
	});
};

// 切换自动旋转
const toggleAutoRotate = (value) => {
	if (controls) {
		controls.autoRotate = value;
		autoRotate.value = value;
	}
};

// 显示/隐藏辅助工具
const toggleGrid = (value) => {
	if (value && !gridHelper) {
		// 创建网格辅助工具
		const box = new THREE.Box3().setFromObject(scene);
		const size = box.getSize(new THREE.Vector3());
		const maxSize = Math.max(size.x, size.z) * 2;

		gridHelper = new THREE.GridHelper(maxSize, 20, 0x888888, 0x444444);
		gridHelper.position.y = box.min.y - 1; // 放在模型底部
		scene.add(gridHelper);
	} else if (!value && gridHelper) {
		scene.remove(gridHelper);
		gridHelper = null;
	}
};

const toggleAxes = (value) => {
	if (value && !axesHelper) {
		const box = new THREE.Box3().setFromObject(scene);
		const size = box.getSize(new THREE.Vector3());
		const maxSize = Math.max(size.x, size.y, size.z);

		axesHelper = new THREE.AxesHelper(maxSize / 2);
		scene.add(axesHelper);
	} else if (!value && axesHelper) {
		scene.remove(axesHelper);
		axesHelper = null;
	}
};

const toggleBoundingBox = (value) => {
	if (value && !boundingBoxHelper) {
		const box = new THREE.Box3().setFromObject(scene);
		boundingBoxHelper = new THREE.Box3Helper(box, 0xffff00);
		scene.add(boundingBoxHelper);
	} else if (!value && boundingBoxHelper) {
		scene.remove(boundingBoxHelper);
		boundingBoxHelper = null;
	}
};

// 添加缺失的函数 - updateSceneElements
const updateSceneElements = (deltaTime) => {
	// 这个函数在loop中被调用但未定义
	// 可以在这里处理场景中需要随时间更新的元素
	// 例如动画、粒子系统等
};

// 修复初始化函数，确保所有必要的组件被正确初始化
const init = async () => {
	try {
		console.log('开始初始化3D场景');

		myCanvas.value = document.querySelector('.myCanvas');
		if (!myCanvas.value) {
			throw new Error('找不到Canvas元素');
		}

		// 设置场景、相机和渲染器
	setScene();
	setCamera();
	setLight();
	setControls();

		// 设置交互
		const interactionHandlers = setupObjectInteraction();
		const keyboardCleanup = setupKeyboardShortcuts();

		// 在组件卸载时清理这些处理器
		onBeforeUnmount(() => {
			const canvas = document.querySelector('.myCanvas');
			if (canvas && interactionHandlers) {
				canvas.removeEventListener(
					'mousemove',
					interactionHandlers.onMouseMove
				);
				canvas.removeEventListener('click', interactionHandlers.onClick);
			}
			if (keyboardCleanup) keyboardCleanup();
		});

		// 设置用户交互跟踪
		setupInteractionTracking();

		// 加载背景和环境
	loadRGBELoaderScene('scene/cloudySkyBox.jpg');

		// 获取模型URL
		const modelUrl = await getBimAll();
		console.log('模型URL:', modelUrl);

		if (!modelUrl) {
			throw new Error('无法获取模型URL');
		}

		try {
			// 加载模型
			console.log('开始加载模型...');
			const gltf = await loadModel(modelUrl);

			// 添加模型到场景
			scene.add(gltf.scene);
			console.log('模型已添加到场景');

			// 完成加载
			isLoading.value = false;

			// 自动设置合适的相机位置
			autoFitCameraToObject(gltf.scene);

			// 开始渲染循环
			requestAnimationFrame(loop);
		} catch (modelError) {
			console.error('加载模型失败:', modelError);
			loadingFailed.value = true;
			isLoading.value = false;
			ElMessage.error('模型加载失败，请检查网络连接或文件格式');
		}
	} catch (error) {
		console.error('初始化3D场景时出错:', error);
		loadingFailed.value = true;
		isLoading.value = false;
		ElMessage.error('初始化3D场景失败');
	}
};

// 自动调整相机以适应模型
const autoFitCameraToObject = (object) => {
	// 计算对象的边界盒
	const boundingBox = new THREE.Box3().setFromObject(object);

	// 获取边界盒的中心和大小
	const center = boundingBox.getCenter(new THREE.Vector3());
	const size = boundingBox.getSize(new THREE.Vector3());

	// 计算最大尺寸和适当的相机距离
	const maxDim = Math.max(size.x, size.y, size.z);
	const fov = camera.fov * (Math.PI / 180);
	let cameraDistance = maxDim / (2 * Math.tan(fov / 2));

	// 添加一些额外的空间
	cameraDistance *= 1.5;

	// 设置相机位置
	camera.position.set(
		center.x + cameraDistance,
		center.y + cameraDistance * 0.8,
		center.z + cameraDistance
	);

	// 让相机看向对象中心
	camera.lookAt(center);

	// 更新控制器
	controls.target.copy(center);

	// 更新默认视图以便于重置
	defaultMap.x = camera.position.x;
	defaultMap.y = camera.position.y;
	defaultMap.z = camera.position.z;

	// 更新相机矩阵
	camera.updateProjectionMatrix();
	controls.update();
};

// 添加重置并重新加载的函数
const resetAndReload = () => {
	// 重置状态
	loadingFailed.value = false;
	isLoading.value = true;
	loadingWidth.value = 0;

	// 清理所有现有资源
	if (scene) {
		scene.traverse((object) => {
			if (object.geometry) {
				object.geometry.dispose();
			}
			if (object.material) {
				if (Array.isArray(object.material)) {
					object.material.forEach((material) => material.dispose());
				} else {
					object.material.dispose();
				}
			}
		});

		// 清空场景
		while (scene.children.length > 0) {
			scene.remove(scene.children[0]);
		}
	}

	// 重新初始化
	setTimeout(() => {
		init();
	}, 100);
};

// 窗口调整处理
const handleResize = () => {
	if (!camera || !renderer || !myCanvas.value) return;

	const width = myCanvas.value.clientWidth;
	const height = myCanvas.value.clientHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);

	// 更新后处理组合器大小
	if (composer) {
		composer.setSize(width, height);
	}

	// 更新FXAA抗锯齿通道的分辨率
	if (fxaaPass) {
		fxaaPass.uniforms['resolution'].value.set(
			1 / (width * renderer.getPixelRatio()),
			1 / (height * renderer.getPixelRatio())
		);
	}

	// 重新渲染一帧以立即更新显示
	if (renderer) {
		renderer.render(scene, camera);
	}
};

// 修改onMounted钩子以正确初始化
onMounted(() => {
	console.log('组件已挂载，开始初始化');

	// 延迟一帧初始化，确保DOM已完全渲染
	requestAnimationFrame(() => {
	init();
});

	// 添加窗口大小调整事件
	window.addEventListener('resize', handleResize);

	// 添加全屏变化事件监听
	document.addEventListener('fullscreenchange', handleResize);
	document.addEventListener('webkitfullscreenchange', handleResize);
	document.addEventListener('mozfullscreenchange', handleResize);
	document.addEventListener('MSFullscreenChange', handleResize);
});

// 组件卸载时的清理
onBeforeUnmount(() => {
	console.log('组件卸载，清理资源');

	// 移除事件监听器
	window.removeEventListener('resize', handleResize);
	document.removeEventListener('fullscreenchange', handleResize);
	document.removeEventListener('webkitfullscreenchange', handleResize);
	document.removeEventListener('mozfullscreenchange', handleResize);
	document.removeEventListener('MSFullscreenChange', handleResize);

	// 停止渲染循环
	if (requestID) {
		cancelAnimationFrame(requestID);
		requestID = null;
	}

	// 清理THREE.js资源
	if (scene) {
		scene.traverse((object) => {
			if (object.geometry) {
				object.geometry.dispose();
			}
			if (object.material) {
				if (Array.isArray(object.material)) {
					object.material.forEach((material) => material.dispose());
				} else {
					object.material.dispose();
				}
			}
		});
	}

	// 清理渲染器
	if (renderer) {
		renderer.dispose();
		renderer.forceContextLoss();
		renderer.domElement = null;
	}

	// 清理后处理效果
	if (composer) {
		composer.passes.forEach((pass) => {
			if (pass.dispose) {
				pass.dispose();
			}
		});
	}

	// 清理控制器
	if (controls) {
		controls.dispose();
	}

	console.log('组件资源已清理');
});

// 添加到setup中的变量
const enableAntiAlias = ref(false);
const rotationSpeed = ref(1.0);
const explosionMode = ref(false);
const explosionStrength = ref(0);
const hoveredObjectInfo = ref('');
let originalPositions = new Map();
let composer;
let fxaaPass;

// 后处理设置
const setupPostProcessing = () => {
	// 创建后处理组合器
	composer = new EffectComposer(renderer);

	// 添加场景渲染通道
	const renderPass = new RenderPass(scene, camera);
	composer.addPass(renderPass);

	// 添加FXAA抗锯齿通道
	fxaaPass = new ShaderPass(FXAAShader);
	fxaaPass.uniforms['resolution'].value.set(
		1 / (window.innerWidth * renderer.getPixelRatio()),
		1 / (window.innerHeight * renderer.getPixelRatio())
	);
	fxaaPass.enabled = enableAntiAlias.value;
	composer.addPass(fxaaPass);
};

// 切换抗锯齿
const toggleAntiAlias = (value) => {
	enableAntiAlias.value = value;
	if (fxaaPass) {
		fxaaPass.enabled = value;
	}
};

// 更新旋转速度
const updateRotationSpeed = (value) => {
	if (controls) {
		controls.autoRotateSpeed = value;
	}
};

// 优化的渲染循环
const loop = (time) => {
	// 请求下一帧
	requestAnimationFrame(loop);

	// 计算帧率
	const deltaTime = time - lastFrameTime;
	lastFrameTime = time;

	if (deltaTime > 0) {
		// 累计时间和帧数
		accumulatedTime += deltaTime;
		frameCount++;

		// 每秒更新一次FPS
		if (accumulatedTime >= 1000) {
			currentFPS.value = frameCount;
			frameCount = 0;
			accumulatedTime = 0;

			// 自动调整质量
			if (qualityMode.value === 'auto') {
				autoAdjustQuality(currentFPS);
			}
		}
	}

	// 检查用户是否与场景交互
	if (isUserInteracting) {
		// 用户交互时降低质量以保持响应速度
		applyQuality('low');
	} else if (qualityMode.value === 'auto') {
		// 非交互时使用自动调整的质量
		applyQuality(currentQuality);
	}

	// 更新爆炸视图
	if (explosionMode.value) {
		updateExplosionView(explosionStrength.value);
	}

	// 更新控制器
	controls.update();

	// 使用后处理进行渲染
	renderer.clear();
	if (composer && composer.passes.length > 0) {
		composer.render();
	} else {
		renderer.render(scene, camera);
	}

	// 更新统计信息
	if (statsjs) statsjs.update();
};

// 优化Stats面板显示
const setupStats = () => {
	statsjs = new Stats();
	statsjs.showPanel(0); // 0: FPS, 1: MS, 2: MB

	// 明确设置Stats位置
	statsjs.dom.style.position = 'absolute';
	statsjs.dom.style.top = '0px';
	statsjs.dom.style.left = '0px';
	statsjs.dom.style.zIndex = '10000';

	// 改进Stats样式使其更易读
	statsjs.dom.style.opacity = '0.8';

	document.getElementById('stats-panel').innerHTML = ''; // 清除之前的内容
	document.getElementById('stats-panel').appendChild(statsjs.dom);
	console.log('Stats面板已设置');
};

// 优化模型加载过程
const loadModel = async (url) => {
	if (!url) {
		throw new Error('模型URL不能为空');
	}

	return new Promise((resolve, reject) => {
		// 显示加载状态
		isLoading.value = true;
		loadingWidth.value = 0;

		loader.load(
			url,
			(gltf) => {
				console.log('模型加载成功');

				// 处理模型以提高性能
				optimizeModel(gltf);

				// 保存原始位置用于爆炸视图
				saveOriginalPositions(gltf.scene);

				resolve(gltf);
			},
			(progress) => {
				let load = Math.round((progress.loaded / progress.total) * 100);
				loadingWidth.value = load;
				console.log(`加载进度: ${load}%`);
			},
			(error) => {
				console.error('加载模型时出错:', error);
				reject(error);
			}
		);
	});
};

// 优化模型函数
const optimizeModel = (gltf) => {
	console.log('正在优化模型...');

	// 遍历所有网格
	gltf.scene.traverse((node) => {
		if (node.isMesh) {
			// 1. 降低几何体精度
			if (node.geometry.attributes.position.count > 50000) {
				console.log(`优化高精度网格: ${node.name || 'unnamed'}`);
				// 这里可以添加几何体简化代码，但需要额外库如SimplifyModifier
			}

			// 2. 优化材质
			if (node.material) {
				// 使用更高效的着色器
				node.material.precision = 'lowp';

				// 禁用不必要的功能
				node.material.fog = false;
				node.material.dithering = false;

				// 初始设置更简单的材质模式
				node.material.flatShading = true;

				// 存储高质量材质作为备份
				node.userData.highQualityMaterial = node.material.clone();
				node.userData.highQualityMaterial.flatShading = false;

				// 纹理优化
				if (node.material.map) {
					node.material.map.anisotropy = 1; // 降低初始各向异性过滤
					node.material.map.minFilter = THREE.LinearFilter;
					node.material.map.generateMipmaps = false;
				}
			}

			// 3. 视锥体剔除优化
			node.frustumCulled = true;

			// 4. 预计算包围盒和球以加速射线检测
			node.geometry.computeBoundingBox();
			node.geometry.computeBoundingSphere();

			// 5. 禁用不需要的自动更新
			node.matrixAutoUpdate = node.children.length === 0;

			// 6. 给每个网格添加唯一ID以便于交互
			node.userData.id = THREE.MathUtils.generateUUID();
		}
	});

	return gltf;
};

// 保存原始位置用于爆炸视图
const saveOriginalPositions = (model) => {
	originalPositions.clear();

	model.traverse((node) => {
		if (node.isMesh) {
			originalPositions.set(node.uuid, {
				position: node.position.clone(),
				parent: node.parent,
			});
		}
	});
};

// 爆炸视图更新
const updateExplosionView = (strength) => {
	if (!originalPositions || originalPositions.size === 0) return;

	scene.traverse((node) => {
		if (node.isMesh && originalPositions.has(node.uuid)) {
			// 获取原始位置
			const originalPos = originalPositions.get(node.uuid).position;

			// 计算爆炸方向（从中心向外）
			const direction = new THREE.Vector3()
				.subVectors(node.position, new THREE.Vector3(0, 0, 0))
				.normalize();

			// 爆炸强度从0到50单位
			const explodeDistance = 50 * strength;

			// 设置新位置
			node.position
				.copy(originalPos)
				.add(direction.multiplyScalar(explodeDistance));
		}
	});
};

// 切换爆炸视图模式
const toggleExplosionMode = () => {
	explosionMode.value = !explosionMode.value;

	if (!explosionMode.value) {
		// 恢复原始位置
		resetExplosionView();
	} else {
		// 确保我们有原始位置数据
		if (originalPositions.size === 0) {
			saveOriginalPositions(scene);
		}
	}
};

// 重置爆炸视图
const resetExplosionView = () => {
	scene.traverse((node) => {
		if (node.isMesh && originalPositions.has(node.uuid)) {
			const originalData = originalPositions.get(node.uuid);
			node.position.copy(originalData.position);
		}
	});
	explosionStrength.value = 0;
};

// 截图功能
const captureScreenshot = () => {
	try {
		// 临时提高渲染质量
		const originalPixelRatio = renderer.getPixelRatio();
		renderer.setPixelRatio(window.devicePixelRatio);

		// 渲染一帧高质量图像
		renderer.render(scene, camera);

		// 获取图像数据
		const imageData = renderer.domElement.toDataURL('image/png');

		// 创建下载链接
		const link = document.createElement('a');
		link.href = imageData;
		link.download = `3d-model-screenshot-${Date.now()}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// 恢复原始渲染质量
		renderer.setPixelRatio(originalPixelRatio);

		ElMessage.success('截图已保存');
	} catch (error) {
		console.error('截图失败:', error);
		ElMessage.error('截图失败');
	}
};

// 全屏切换功能
const toggleFullscreen = () => {
	try {
		if (!document.fullscreenElement) {
			// 进入全屏
			const element = screenfullRef.value || document.documentElement;
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen();
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen();
			}
		} else {
			// 退出全屏
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}

		// 全屏状态变化后调整尺寸
		setTimeout(() => {
			handleResize();
		}, 100);
	} catch (error) {
		console.error('切换全屏失败:', error);
		ElMessage.error('切换全屏失败');
	}
};

// 绑定键盘快捷键
const setupKeyboardShortcuts = () => {
	const onKeyDown = (event) => {
		switch (event.key) {
			case 'Escape':
				// ESC键 - 取消测量模式或爆炸视图
				if (measureMode.value) {
					toggleMeasureMode();
				} else if (explosionMode.value) {
					toggleExplosionMode();
				}
				break;

			case 'p':
			case 'P':
				// P键 - 截图
				captureScreenshot();
				break;

			case 'f':
			case 'F':
				// F键 - 全屏
				toggleFullscreen();
				break;

			case 'r':
			case 'R':
				// R键 - 重置视图
				resetCamera();
				break;

			case 'm':
			case 'M':
				// M键 - 切换测量模式
				toggleMeasureMode();
				break;

			case 'e':
			case 'E':
				// E键 - 切换爆炸视图
				toggleExplosionMode();
				break;

			case ' ':
				// 空格键 - 切换自动旋转
				toggleAutoRotate(!autoRotate.value);
				break;
		}
	};

	// 添加键盘事件监听
	window.addEventListener('keydown', onKeyDown);

	// 返回清理函数
	return () => {
		window.removeEventListener('keydown', onKeyDown);
	};
};

// 添加交互和悬停效果
const setupObjectInteraction = () => {
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	let hoveredObject = null;

	const canvas = document.querySelector('.myCanvas');
	if (!canvas) return;

	const onMouseMove = (event) => {
		// 计算归一化设备坐标
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		// 更新射线
		raycaster.setFromCamera(mouse, camera);

		// 检测相交对象
		const intersects = raycaster.intersectObjects(scene.children, true);

		if (intersects.length > 0) {
			const newHoveredObject = intersects[0].object;

			// 如果悬停的对象改变了
			if (hoveredObject !== newHoveredObject) {
				// 恢复之前悬停对象的材质
				if (hoveredObject && hoveredObject.userData.isHovered) {
					hoveredObject.material = hoveredObject.userData.originalMaterial;
					hoveredObject.userData.isHovered = false;
				}

				// 设置新对象为悬停状态
				hoveredObject = newHoveredObject;

				// 保存原始材质
				if (!hoveredObject.userData.originalMaterial) {
					hoveredObject.userData.originalMaterial =
						hoveredObject.material.clone();
				}

				// 创建悬停材质
				const hoverMaterial = hoveredObject.material.clone();
				hoverMaterial.emissive = new THREE.Color(0x444444);
				hoverMaterial.emissiveIntensity = 0.5;
				hoverMaterial.transparent = true;
				hoverMaterial.opacity = 0.9;

				// 应用悬停材质
				hoveredObject.material = hoverMaterial;
				hoveredObject.userData.isHovered = true;

				// 更新悬停信息
				hoveredObjectInfo.value =
					hoveredObject.name ||
					(hoveredObject.parent ? hoveredObject.parent.name : '未命名对象');

				// 改变鼠标样式
				document.body.style.cursor = 'pointer';
			}
		} else {
			// 如果之前有悬停对象，恢复其材质
			if (hoveredObject && hoveredObject.userData.isHovered) {
				hoveredObject.material = hoveredObject.userData.originalMaterial;
				hoveredObject.userData.isHovered = false;
				hoveredObject = null;

				// 清除悬停信息
				hoveredObjectInfo.value = '';

				// 恢复鼠标样式
				document.body.style.cursor = 'default';
			}
		}
	};

	const onClick = (event) => {
		if (measureMode.value) {
			handleMeasureClick(raycaster, mouse);
			return;
		}

		// 标准点击处理
		const intersects = raycaster.intersectObjects(scene.children, true);

		if (intersects.length > 0) {
			const clickedObject = intersects[0].object;

			// 显示对象信息
			const objectName =
				clickedObject.name ||
				(clickedObject.parent ? clickedObject.parent.name : '未命名对象');
			const position = clickedObject.position.clone();

			// 使用Element UI显示详细信息
			ElMessage({
				message: `已选择: ${objectName} (位置: ${position.x.toFixed(
					2
				)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`,
				type: 'info',
				duration: 3000,
			});

			// 这里可以添加对象选择效果或其他交互
		}
	};

	// 添加事件监听器
	canvas.addEventListener('mousemove', onMouseMove);
	canvas.addEventListener('click', onClick);

	// 记录处理函数以便后续清理
	return { onMouseMove, onClick };
};

// 测量工具功能
const handleMeasureClick = (raycaster, mouse) => {
	// 更新射线
	raycaster.setFromCamera(mouse, camera);

	// 检测相交对象
	const intersects = raycaster.intersectObjects(scene.children, true);

	if (intersects.length === 0) return;

	const point = intersects[0].point.clone();

	// 创建标记球体
	const markerGeometry = new THREE.SphereGeometry(2, 16, 16);
	const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff4444 });
	const marker = new THREE.Mesh(markerGeometry, markerMaterial);
	marker.position.copy(point);
	scene.add(marker);

	// 添加到测量点和标记数组
	measurePoints.push(point);
	measureMarkers.push(marker);

	// 如果有两个点，绘制线段并计算距离
	if (measurePoints.length === 2) {
		const [point1, point2] = measurePoints;

		// 如果已经有测量线，移除它
		if (measureLine) {
			scene.remove(measureLine);
		}

		// 创建线段几何体
		const lineGeometry = new THREE.BufferGeometry().setFromPoints(
			measurePoints
		);
		const lineMaterial = new THREE.LineBasicMaterial({
			color: 0xffff00,
			linewidth: 2,
		});
		measureLine = new THREE.Line(lineGeometry, lineMaterial);
		scene.add(measureLine);

		// 计算距离
		const distance = point1.distanceTo(point2);
		measureResult.value = distance;

		// 添加距离标签
		const midPoint = new THREE.Vector3()
			.addVectors(point1, point2)
			.multiplyScalar(0.5);
		const labelGeometry = new THREE.SphereGeometry(1, 8, 8);
		const labelMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		const label = new THREE.Mesh(labelGeometry, labelMaterial);
		label.position.copy(midPoint);
		scene.add(label);
		measureMarkers.push(label);

		// 重置点数组，准备下一次测量
		measurePoints = [];

		// 显示测量结果
		ElMessage({
			message: `测量距离: ${distance.toFixed(2)} 单位`,
			type: 'success',
			duration: 3000,
		});
	}
};
</script>
<style lang="scss" scoped>
.concatioa {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: #f8f9fa;

	#stats-panel {
		position: absolute;
		z-index: 101;
		div {
			position: absolute !important;
		}
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

	/* 加载状态 */
	.maskLoading {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 100;
		background: linear-gradient(to bottom, #f8f9fa, #e9ecef);

		.loading {
			width: 300px;
			height: 8px;
			border-radius: 4px;
			background: rgba(0, 0, 0, 0.1);
			overflow: hidden;
			box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);

			.login-box {
				background: linear-gradient(to right, #4c8dff, #2979ff);
				height: 100%;
				width: 0;
				border-radius: 4px;
				transition: width 0.3s ease;
				box-shadow: 0 0 10px rgba(41, 121, 255, 0.5);
			}
		}

		.show-loading-tip {
			margin-top: 15px;
			color: #333;
			font-size: 16px;
			font-weight: 500;
		}
	}

	/* 控制面板 */
	.enhanced-control-panel {
		position: absolute;
		top: 15px;
		right: 15px;
		width: 320px;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 10px;
		box-shadow: 0 3px 15px rgba(0, 0, 0, 0.12);
		z-index: 1001;
		backdrop-filter: blur(10px);
		overflow: hidden;
		border: 1px solid rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;

		.panel-header {
			padding: 12px 15px;
			background: linear-gradient(to right, #4c8dff, #2979ff);
			color: white;
			font-weight: 600;
			font-size: 15px;
		display: flex;
			justify-content: space-between;
		align-items: center;
			cursor: pointer;

			.header-actions {
				display: flex;
				align-items: center;
				gap: 12px;

				.fps-counter {
					font-size: 13px;
					background-color: rgba(0, 0, 0, 0.2);
					padding: 3px 8px;
					border-radius: 12px;
					font-family: monospace;
				}

				.toggle-icon {
					transition: transform 0.3s;
				}
			}
		}

		.panel-content {
			max-height: 75vh;
			overflow-y: auto;
			padding: 0;

			&::-webkit-scrollbar {
				width: 6px;
			}

			&::-webkit-scrollbar-track {
				background: rgba(0, 0, 0, 0.05);
			}

			&::-webkit-scrollbar-thumb {
				background: rgba(0, 0, 0, 0.15);
				border-radius: 3px;
			}

			.control-group {
				padding: 15px;
				border-bottom: 1px solid rgba(0, 0, 0, 0.05);

				&:last-child {
					border-bottom: none;
				}

				.group-title {
					font-size: 14px;
					font-weight: 600;
					margin-bottom: 12px;
					color: #333;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.control-row {
					margin-bottom: 12px;
					display: flex;
					align-items: center;
					gap: 10px;

					span {
						min-width: 65px;
						font-size: 13px;
						color: #555;
					}

					&.quality-selector {
						margin-bottom: 15px;
					}
				}

				.control-actions,
				.special-actions,
				.tool-buttons,
				.view-buttons,
				.interaction-buttons {
					display: flex;
					flex-wrap: wrap;
					gap: 10px;
					margin-bottom: 10px;

					&:last-child {
						margin-bottom: 0;
					}
				}

				.measure-result,
				.explosion-control {
					margin-top: 10px;
					padding: 8px 10px;
					background-color: rgba(0, 0, 0, 0.05);
					border-radius: 6px;
					font-size: 13px;
				}

				.rotation-settings {
					.setting-item {
						display: flex;
						flex-direction: column;
						gap: 8px;

						span {
							font-size: 13px;
							color: #555;
						}
					}
				}
			}
		}
	}

	/* 坐标信息显示 */
	.coordinates-display {
		position: absolute;
		left: 15px;
		bottom: 15px;
		background-color: rgba(0, 0, 0, 0.6);
		color: white;
		padding: 8px 12px;
		border-radius: 6px;
		font-family: monospace;
		font-size: 14px;
		z-index: 1001;
		backdrop-filter: blur(4px);

		.coord-value {
			margin-bottom: 4px;

			&:last-child {
				margin-bottom: 0;
			}
		}

		.object-info {
			font-size: 12px;
			color: #aaa;
			margin-top: 4px;
		}
	}

	/* 模式指示器 */
	.mode-indicator {
		position: absolute;
		top: 15px;
		left: 15px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		z-index: 1001;

		.mode-badge {
			background-color: rgba(0, 0, 0, 0.6);
			color: white;
			padding: 6px 12px;
			border-radius: 4px;
			font-size: 13px;
			display: flex;
			align-items: center;
			backdrop-filter: blur(4px);

			&.measure {
				background-color: rgba(25, 118, 210, 0.8);

				&::before {
					content: '📏';
					margin-right: 6px;
				}
			}

			&.explosion {
				background-color: rgba(211, 47, 47, 0.8);

				&::before {
					content: '💥';
					margin-right: 6px;
				}
			}
		}
	}

	/* 错误消息 */
	.error-message {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		padding: 25px;
		border-radius: 10px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		text-align: center;
		z-index: 10000;
		max-width: 90%;
		width: 400px;

		h3 {
			color: #d32f2f;
			margin: 0 0 15px;
			font-size: 20px;
		}

		p {
			margin: 0 0 20px;
			color: #555;
			font-size: 15px;
			line-height: 1.5;
		}
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.enhanced-control-panel {
			width: 85%;
			max-width: 300px;
		right: 10px;
			top: 10px;
		}

		.coordinates-display {
			left: 10px;
			bottom: 10px;
			font-size: 12px;
			padding: 6px 10px;
		}
	}
}
</style>
<style lang="scss">
.concatioa {
	#stats-panel {
		div {
			position: absolute !important;
			z-index: 101 !important;
		}
	}
}
</style>
