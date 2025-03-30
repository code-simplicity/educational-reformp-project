/* * @Author: mikey.zhaopeng * @Date: 2025-03-Su 05:35:41 * @Last Modified by:
mikey.zhaopeng * @Last Modified time: 2025-03-Su 05:35:41 */
<template>
	<div class="gltf-model-container" ref="containerRef">
		<div class="myCanvas" ref="canvasRef"></div>

		<!-- 加载遮罩 -->
		<loading-overlay
			:is-loading="state.isLoading"
			:loading-width="state.loadingWidth"
			:loading-failed="state.loadingFailed"
			@retry="handleRetry"
		/>

		<!-- 控制面板 -->
		<control-panel
			v-if="!state.isLoading && !state.loadingFailed"
			:fps="state.currentFPS"
			:quality-mode="state.qualityMode"
			:model-opacity="state.modelOpacity"
			:auto-rotate="state.autoRotate"
			:rotation-speed="state.rotationSpeed"
			:wireframe="state.showWireframe"
			:anti-alias="state.enableAntiAlias"
			:show-grid="state.showGrid"
			:show-axes="state.showAxes"
			:show-bounding-box="state.showBoundingBox"
			:measure-mode="state.measureMode"
			:measure-result="state.measureResult"
			:explosion-mode="state.explosionMode"
			:explosion-strength="state.explosionStrength"
			:camera-info="state.cameraInfo"
			:is-full-screen="state.isFullScreen"
			@quality-change="handleQualityChange"
			@opacity-change="handleOpacityChange"
			@wireframe-toggle="handleWireframeToggle"
			@antialias-toggle="handleAntialiasToggle"
			@grid-toggle="handleGridToggle"
			@axes-toggle="handleAxesToggle"
			@boundingbox-toggle="handleBoundingBoxToggle"
			@autorotate-toggle="handleAutoRotateToggle"
			@rotation-speed-change="handleRotationSpeedChange"
			@view-change="handleViewChange"
			@reset-view="handleResetView"
			@measurement-toggle="handleMeasurementToggle"
			@explosion-toggle="handleExplosionToggle"
			@explosion-strength-change="handleExplosionStrengthChange"
			@screenshot="handleScreenshot"
			@fullscreen="toggleFullscreen"
			@record-camera-position="handleRecordCameraPosition"
			@goto-model-center="handleGotoModelCenter"
			@copy-camera-position="handleCopyCameraPosition"
		/>

		<!-- 状态栏 -->
		<status-bar
			v-if="!state.isLoading && !state.loadingFailed"
			:coords="state.cameraPosition"
			:hovered-object="state.hoveredObjectInfo"
			:active-modes="activeModes"
		/>
	</div>
</template>

<script setup>
import {
	ref,
	reactive,
	computed,
	onMounted,
	onBeforeUnmount,
	watch,
} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import LoadingOverlay from './components/LoadingOverlay.vue';
import ControlPanel from './components/ControlPanel.vue';
import StatusBar from './components/StatusBar.vue';

// 导入 Three.js 相关库
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

// 导入 API
import { getBimFindAll } from '@/api/service/bim';
import Constants from '@/utils/Constants.js';

// DOM 引用
const containerRef = ref(null);
const canvasRef = ref(null);

// 统一状态管理
const state = reactive({
	// 加载状态
	isLoading: true,
	loadingWidth: 0,
	loadingFailed: false,
	initialized: false,

	// 相机和位置
	cameraPosition: { x: 0, y: 0, z: 0 },
	defaultCameraPosition: { x: 34, y: 98, z: -660 },

	// 性能参数
	currentFPS: 0,
	targetFPS: 30,
	currentQuality: 'medium',
	qualityMode: 'auto',

	// 控制参数
	modelOpacity: 1,
	autoRotate: false,
	rotationSpeed: 1.0,
	showWireframe: false,
	enableAntiAlias: false,
	showGrid: false,
	showAxes: false,
	showBoundingBox: false,

	// 工具状态
	measureMode: false,
	measureResult: null,
	explosionMode: false,
	explosionStrength: 0,
	hoveredObjectInfo: '',

	// 相机信息
	cameraInfo: null,

	// 全屏状态
	isFullScreen: false,
});

// THREE.js 对象
let scene, camera, renderer, controls;
let composer, fxaaPass;
let stats;
let requestID = null;
let lastFrameTime = 0;
let needsRender = true;
let frameCount = 0;
let accumulatedTime = 0;
let cameraAnimation = null;
let cleanupFunctions = [];
let directionIndicator = null;

// 工具相关变量
let gridHelper, axesHelper, boundingBoxHelper;
let measurePoints = [];
let measureLine = null;
let measureMarkers = [];
let originalPositions = new Map();
let model = null;
let isUserInteracting = false;
let interactionTimeout;

// 计算活动模式
const activeModes = computed(() => {
	const modes = [];
	if (state.measureMode) modes.push({ type: 'measure', label: '测量模式' });
	if (state.explosionMode) modes.push({ type: 'explosion', label: '爆炸视图' });
	return modes;
});

// 添加模型信息对象
const modelInfo = {
	size: null,
	center: null,
	boundingBox: null,
};

// ============== 核心初始化函数 ==============

// 主初始化函数
const initializeViewer = async () => {
	try {
		console.log('初始化3D查看器');
		state.isLoading = true;

		// 确保 canvasRef 有值
		if (!canvasRef.value) {
			throw new Error('Canvas引用未找到');
		}

		console.log('Canvas引用:', canvasRef.value);

		// 初始化场景和相机
		initScene();
		initCamera();

		// 初始化渲染器
		initRenderer();

		// 设置光照和后处理
		initLights();
		setupPostProcessing();

		// 初始化控制器和交互
		initControls();
		const cleanupInteraction = setupInteractionTracking();
		const cleanupMousePick = setupMousePick();

		// 添加方向指示器
		const directionIndicator = addDirectionIndicator();

		// 启动渲染循环
		startRenderLoop();

		// 加载背景
		setSceneBackground('scene/cloudySkyBox.jpg');

		// 加载模型
		await loadModel();

		// 添加到清理函数
		cleanupFunctions.push(cleanupInteraction);
		cleanupFunctions.push(cleanupMousePick);

		state.initialized = true;
		return true;
	} catch (error) {
		console.error('初始化3D查看器失败:', error);
		state.loadingFailed = true;
		state.isLoading = false;
		return false;
	}
};

// 初始化场景
const initScene = () => {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf0f0f0);
};

// 初始化相机
const initCamera = () => {
	const aspect =
		containerRef.value?.clientWidth / containerRef.value?.clientHeight || 1;
	camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 20000); // 确保远裁剪面足够远

	// 使用指定的相机位置
	camera.position.set(1914.12, 2012.22, -3766.58);

	// 默认看向坐标原点，稍后会调整
	camera.lookAt(0, 0, 0);
	camera.updateProjectionMatrix();

	// 保存初始位置
	state.cameraPosition = camera.position.clone();
	state.lookAtPosition = new THREE.Vector3(0, 0, 0);
	state.defaultCameraPosition = camera.position.clone();

	console.log('相机初始化完成:', {
		position: camera.position,
		lookAt: state.lookAtPosition,
	});
};

// 初始化渲染器
const initRenderer = () => {
	// 获取 Canvas 元素
	const canvasElement = canvasRef.value;
	if (!canvasElement) {
		throw new Error('Canvas 元素未找到');
	}

	console.log('初始化渲染器');

	// 渲染器优化配置
	renderer = new THREE.WebGLRenderer({
		antialias: false, // 禁用抗锯齿以提高性能
		powerPreference: 'high-performance',
		precision: 'lowp', // 使用低精度
		alpha: false,
		stencil: false,
		depth: true,
		logarithmicDepthBuffer: false, // 禁用对数深度缓冲
	});

	// 设置渲染器尺寸
	renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
	renderer.setPixelRatio(Math.min(1, window.devicePixelRatio)); // 限制像素比

	// 禁用阴影
	renderer.shadowMap.enabled = false;

	// 禁用自动清除
	renderer.autoClear = false;

	// 添加到DOM
	canvasElement.innerHTML = '';
	canvasElement.appendChild(renderer.domElement);

	// 设置样式
	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';

	// 深度测试
	const gl = renderer.getContext();
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	// 禁用多余的功能
	renderer.outputEncoding = THREE.LinearEncoding; // 使用线性编码
	renderer.toneMapping = THREE.NoToneMapping; // 禁用色调映射
};

// 初始化光照
const initLights = () => {
	// 简单环境光
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
	scene.add(ambientLight);

	// 简单平行光
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);
};

// 初始化控制器
const initControls = () => {
	if (!camera || !renderer) {
		throw new Error('相机或渲染器未初始化');
	}

	console.log('初始化控制器');

	// 设置性能优化的控制器
	controls = new OrbitControls(camera, renderer.domElement);

	// 提高性能的设置
	controls.enableDamping = true;
	controls.dampingFactor = 0.1;
	controls.rotateSpeed = 0.5; // 降低旋转速度
	controls.panSpeed = 0.8;
	controls.zoomSpeed = 0.8;

	// 设置限制
	controls.minDistance = 100; // 增加最小距离
	controls.maxDistance = 10000; // 增加最大距离

	// 限制旋转
	controls.minPolarAngle = 0.1;
	controls.maxPolarAngle = Math.PI - 0.1;

	// 减少事件监听器调用频率
	controls.addEventListener('change', () => {
		// 使用防抖动更新相机位置
		if (!controls.updateScheduled) {
			controls.updateScheduled = true;

			setTimeout(() => {
				updateCameraPosition();
				needsRender = true;
				controls.updateScheduled = false;
			}, 100);
		}
	});

	// 交互结束时保存相机位置
	controls.addEventListener('end', () => {
		state.cameraPosition = camera.position.clone();
		state.lookAtPosition = controls.target.clone();
	});

	console.log('控制器初始化完成');
};

// ============== 模型加载函数 ==============

// 获取模型URL
const getBimModelUrl = async () => {
	try {
		const params = {
			pageNum: 1,
			pageSize: 20,
		};

		const result = await getBimFindAll(params);

		if (result.code === Constants.status.SUCCESS) {
			const modelUrl = result.data.list[0].url;
			console.log('获取到模型URL:', modelUrl);
			return modelUrl;
		} else {
			ElMessage.error(result.msg || '获取模型数据失败');
			return null;
		}
	} catch (error) {
		console.error('获取模型数据时出错:', error);
		ElMessage.error('获取模型数据时出错');
		return null;
	}
};

// 创建GLTF加载器
const createGLTFLoader = (manager) => {
	const loader = new GLTFLoader(manager);
	const dracoLoader = new DRACOLoader(manager);

	// 设置Draco解码器路径
	dracoLoader.setDecoderPath('/js/draco/');
	loader.setDRACOLoader(dracoLoader);

	return loader;
};

// 加载模型
const loadModel = async () => {
	if (!scene) {
		throw new Error('场景未初始化');
	}

	state.isLoading = true;
	state.loadingWidth = 0;

	try {
		const modelUrl = await getBimModelUrl();
		if (!modelUrl) {
			throw new Error('未提供模型URL');
		}

		console.log('开始加载模型:', modelUrl);

		// 创建加载管理器
		const manager = new THREE.LoadingManager();

		manager.onProgress = (url, loaded, total) => {
			const progress = Math.min(Math.round((loaded / total) * 100), 100);
			state.loadingWidth = progress;
		};

		// 创建GLTF加载器
		const loader = createGLTFLoader(manager);

		// 加载模型
		const gltf = await new Promise((resolve, reject) => {
			loader.load(modelUrl, resolve, undefined, reject);
		});

		const modelScene = gltf.scene;
		if (!modelScene) {
			throw new Error('模型场景为空');
		}

		// 性能优化 - 使用draco解码器后清理缓存
		if (loader.dracoLoader) {
			loader.dracoLoader.dispose();
		}

		// 优化并添加到场景
		model = optimizeModelForPerformance(modelScene);
		scene.add(model);

		// 计算包围盒
		const box = new THREE.Box3().setFromObject(model);
		const size = box.getSize(new THREE.Vector3());
		const center = box.getCenter(new THREE.Vector3());

		// 保存模型信息
		modelInfo.size = size;
		modelInfo.center = center;
		modelInfo.boundingBox = box;

		// 保存原始位置用于爆炸视图
		saveOriginalPositions(model);

		// 修正相机位置并记录
		fixCameraPosition();

		// 记录相机位置到控制面板
		handleRecordCameraPosition();

		// 完成加载
		state.isLoading = false;
		state.loadingWidth = 100;
		needsRender = true;

		ElMessage.success('模型加载成功');
		return model;
	} catch (error) {
		console.error('加载模型失败:', error);
		state.loadingFailed = true;
		state.isLoading = false;
		ElMessage.error(`加载模型失败: ${error.message || error}`);
		throw error;
	}
};

// 新的高性能模型优化函数
const optimizeModelForPerformance = (modelScene) => {
	console.log('应用性能优化...');

	// 使用更激进的优化策略
	let triangleCount = 0;
	let meshCount = 0;
	let largestMeshSize = 0;

	modelScene.traverse((node) => {
		if (node.isMesh) {
			meshCount++;

			// 计算三角形数量
			if (node.geometry) {
				const geomTriangles = node.geometry.index
					? node.geometry.index.count / 3
					: 0;
				triangleCount += geomTriangles;
				largestMeshSize = Math.max(largestMeshSize, geomTriangles);
			}

			// 极度优化
			node.frustumCulled = true; // 启用视锥体剔除
			node.matrixAutoUpdate = false; // 禁用自动矩阵更新
			node.updateMatrix(); // 更新一次

			// 优化材质
			if (node.material) {
				// 基础优化
				node.material.precision = 'lowp';
				node.material.fog = false;

				// 移除不必要的属性
				if (node.material.map) {
					node.material.map.anisotropy = 1;
					node.material.map.minFilter = THREE.LinearFilter;
					node.material.map.generateMipmaps = false;
				}

				// 保存原材质
				node.userData.originalMaterial = node.material.clone();

				// 对于大型网格，使用更简单的材质
				if (node.geometry && node.geometry.attributes.position.count > 10000) {
					const color = node.material.color
						? node.material.color.clone()
						: new THREE.Color(0xcccccc);
					const basicMaterial = new THREE.MeshBasicMaterial({
						color: color,
						wireframe: state.showWireframe,
						side: THREE.FrontSide,
						transparent: false,
						opacity: 1,
					});
					node.material = basicMaterial;
				}
			}

			// 合并共享材质的对象
			if (node.parent && node.parent.children.length > 10) {
				// 这里可以实现合并处理，但需要更复杂的逻辑
			}
		}
	});

	console.log(
		`模型统计: ${meshCount}个网格, ${triangleCount}个三角形, 最大网格: ${largestMeshSize}个三角形`
	);
	return modelScene;
};

// 保存原始位置
const saveOriginalPositions = (modelScene) => {
	originalPositions.clear();

	modelScene.traverse((node) => {
		if (node.isMesh) {
			originalPositions.set(node.uuid, {
				position: node.position.clone(),
				parent: node.parent,
			});
		}
	});
};

// ============== 渲染和性能函数 ==============

// 设置后处理
const setupPostProcessing = () => {
	if (!renderer || !scene || !camera) return;

	// 在低帧率下禁用后处理
	if (state.currentFPS < 30) {
		console.log('帧率过低，禁用后处理以提高性能');
		return;
	}

	try {
		composer = new EffectComposer(renderer);
		const renderPass = new RenderPass(scene, camera);
		composer.addPass(renderPass);

		// 只在高质量模式下添加FXAA
		if (state.currentQuality === 'high' && state.enableAntiAlias) {
			fxaaPass = new ShaderPass(FXAAShader);
			updateShaderResolution();
			fxaaPass.enabled = true;
			composer.addPass(fxaaPass);
		}
	} catch (e) {
		console.error('初始化后处理失败:', e);
		composer = null;
		fxaaPass = null;
	}
};

// 更新着色器分辨率
const updateShaderResolution = () => {
	if (!renderer || !fxaaPass) return;

	const pixelRatio = renderer.getPixelRatio();
	const width = renderer.domElement.width;
	const height = renderer.domElement.height;

	fxaaPass.uniforms['resolution'].value.set(
		1 / (width * pixelRatio),
		1 / (height * pixelRatio)
	);
};

// 优化渲染循环，使用更高效的渲染策略
const startRenderLoop = () => {
	let rafId = null;
	let lastTime = 0;
	let fpsUpdateTime = 0;
	let frameCounter = 0;

	// 使用requestIdleCallback来处理非关键任务
	const scheduleIdleTask = (callback) => {
		if (window.requestIdleCallback) {
			window.requestIdleCallback(callback, { timeout: 1000 });
		} else {
			setTimeout(callback, 1);
		}
	};

	const animate = (time) => {
		rafId = requestAnimationFrame(animate);

		// 计算delta时间
		const delta = time - lastTime;
		lastTime = time;

		// FPS计算 - 简化版本
		frameCounter++;
		if (time - fpsUpdateTime > 1000) {
			state.currentFPS = frameCounter;
			frameCounter = 0;
			fpsUpdateTime = time;

			// 在空闲时间调整质量
			if (state.qualityMode === 'auto') {
				scheduleIdleTask(() => {
					if (state.currentFPS < 15) {
						// 更保守的阈值
						if (state.currentQuality !== 'low') {
							state.currentQuality = 'low';
							applyQuality('low');
							console.log(`检测到低帧率(${state.currentFPS})，降低质量`);
						}
					}
				});
			}
		}

		// 只在必要时更新控制器
		if (isUserInteracting) {
			if (controls) controls.update();
		}

		// 只在必要时渲染
		if (needsRender || state.autoRotate || isUserInteracting) {
			if (renderer) {
				renderer.clear();

				try {
					if (composer && composer.passes.length > 0 && state.enableAntiAlias) {
						composer.render();
					} else {
						renderer.render(scene, camera);
					}
				} catch (e) {
					console.error('渲染出错:', e);
				}

				needsRender = false;
			}
		}

		// 更新方向指示器（如果存在）
		if (directionIndicator && typeof directionIndicator.update === 'function') {
			directionIndicator.update();
		}

		// 更新爆炸视图
		if (state.explosionMode) {
			updateExplosionView(state.explosionStrength);
		}
	};

	lastTime = performance.now();
	animate(lastTime);

	// 返回清理函数
	return () => {
		if (rafId) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	};
};

// 设置用户交互跟踪
const setupInteractionTracking = () => {
	if (!renderer) {
		throw new Error('渲染器未初始化');
	}

	const canvas = renderer.domElement;
	let interactionTimer = null;

	const startInteraction = () => {
		isUserInteracting = true;
		needsRender = true; // 确保交互时渲染

		// 清除现有定时器
		clearTimeout(interactionTimer);
	};

	const endInteraction = () => {
		clearTimeout(interactionTimer);

		// 设置新定时器，在交互结束500ms后停止持续渲染
		interactionTimer = setTimeout(() => {
			isUserInteracting = false;
			// 交互结束时再渲染一帧，确保最终状态正确
			needsRender = true;
		}, 500);
	};

	// 添加事件监听
	canvas.addEventListener('mousedown', startInteraction);
	canvas.addEventListener('mousemove', startInteraction);
	canvas.addEventListener('mouseup', endInteraction);
	canvas.addEventListener('touchstart', startInteraction);
	canvas.addEventListener('touchmove', startInteraction);
	canvas.addEventListener('touchend', endInteraction);
	canvas.addEventListener('wheel', startInteraction, { passive: true });

	// 返回清理函数
	return () => {
		canvas.removeEventListener('mousedown', startInteraction);
		canvas.removeEventListener('mousemove', startInteraction);
		canvas.removeEventListener('mouseup', endInteraction);
		canvas.removeEventListener('touchstart', startInteraction);
		canvas.removeEventListener('touchmove', startInteraction);
		canvas.removeEventListener('touchend', endInteraction);
		canvas.removeEventListener('wheel', startInteraction);
		clearTimeout(interactionTimer);
	};
};

// 更新相机位置
const updateCameraPosition = () => {
	if (!camera) return;

	state.cameraPosition = {
		x: Math.round(camera.position.x),
		y: Math.round(camera.position.y),
		z: Math.round(camera.position.z),
	};

	// 更新相机信息，如果已经激活
	if (state.cameraInfo) {
		state.cameraInfo = {
			position: camera.position.clone(),
			target: controls ? controls.target.clone() : new THREE.Vector3(),
		};
	}
};

// 调整窗口大小
const handleResize = () => {
	if (!camera || !renderer || !canvasRef.value) return;

	const width = canvasRef.value.clientWidth;
	const height = canvasRef.value.clientHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);

	if (composer) {
		composer.setSize(width, height);
		updateShaderResolution();
	}

	needsRender = true;
};

// ============== 质量和性能优化 ==============

// 应用质量设置
const applyQuality = (quality) => {
	if (!scene || !renderer) return;

	console.log(`应用${quality}质量设置`);

	switch (quality) {
		case 'low':
			// 极低质量 - 最大化性能
			renderer.setPixelRatio(0.5);

			// 禁用后处理
			if (composer) {
				composer.passes.forEach((pass) => {
					if (pass !== composer.passes[0]) {
						pass.enabled = false;
					}
				});
			}

			// 使用最基础的材质
			scene.traverse((node) => {
				if (node.isMesh) {
					const color =
						node.material?.color?.clone() || new THREE.Color(0xcccccc);
					const basicMaterial = new THREE.MeshBasicMaterial({
						color: color,
						wireframe: state.showWireframe,
						side: THREE.FrontSide,
					});

					if (!node.userData.savedMaterial) {
						node.userData.savedMaterial = node.material;
					}
					node.material = basicMaterial;

					// 降低几何体精度
					if (node.geometry && node.geometry.attributes.position.count > 1000) {
						// 对于大型几何体，间隔渲染顶点
						const positions = node.geometry.attributes.position.array;
						const stride = 2; // 每隔一个顶点渲染一次

						for (let i = 0; i < positions.length; i += stride * 3) {
							if (i + stride * 3 < positions.length) {
								positions[i] = positions[i + stride * 3];
								positions[i + 1] = positions[i + stride * 3 + 1];
								positions[i + 2] = positions[i + stride * 3 + 2];
							}
						}

						node.geometry.attributes.position.needsUpdate = true;
					}
				}
			});
			break;

		case 'medium':
			// 中等质量 - 平衡性能与质量
			renderer.setPixelRatio(Math.min(1, window.devicePixelRatio));

			// 启用抗锯齿（如果需要）
			if (composer && fxaaPass) {
				fxaaPass.enabled = state.enableAntiAlias;
			}

			// 恢复标准材质
			scene.traverse((node) => {
				if (node.isMesh) {
					// 恢复原始材质或使用标准材质
					if (node.userData.savedMaterial) {
						node.material = node.userData.savedMaterial;
						delete node.userData.savedMaterial;
					}

					if (node.userData.originalMaterial) {
						const material = node.userData.originalMaterial.clone();
						material.flatShading = true;
						material.precision = 'lowp';
						material.wireframe = state.showWireframe;
						node.material = material;
					}
				}
			});
			break;

		case 'high':
			// 高质量 - 视觉优先
			renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));

			// 启用所有后处理
			if (composer) {
				composer.passes.forEach((pass) => {
					if (pass.name === 'FXAAPass') {
						pass.enabled = state.enableAntiAlias;
					} else {
						pass.enabled = true;
					}
				});
			}

			// 使用高质量材质
			scene.traverse((node) => {
				if (node.isMesh) {
					if (node.userData.highQualityMaterial) {
						const material = node.userData.highQualityMaterial.clone();
						material.wireframe = state.showWireframe;
						node.material = material;
					}
				}
			});
			break;
	}

	needsRender = true;
};

// 设置场景背景
const setSceneBackground = (url) => {
	if (!scene) return;

	if (/\.hdr$/i.test(url)) {
		new RGBELoader().load(url, (texture) => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			scene.background = texture;
			needsRender = true;
		});
	} else if (/\.(jpg|jpeg|png|gif|bmp)$/i.test(url)) {
		new THREE.TextureLoader().load(url, (texture) => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			scene.background = texture;
			needsRender = true;
		});
	}
};

// ============== 相机控制函数 ==============

// 自动适应模型
const autoFitCameraToObject = (object, fitOffset = 1.2) => {
	if (!camera || !controls || !object) {
		console.warn('自动适应相机位置：相机、控制器或对象未初始化');
		return;
	}

	try {
		console.log('自动适应相机到模型...');

		// 计算包围盒
		const box = new THREE.Box3().setFromObject(object);
		const size = box.getSize(new THREE.Vector3());
		const center = box.getCenter(new THREE.Vector3());

		if (size.length() === 0) {
			console.warn('模型尺寸为零，无法适应相机');
			return;
		}

		// 记录模型大小信息
		console.log('模型尺寸:', size);
		console.log('模型中心:', center);

		// 检查模型是否过大，如果是，使用更合适的缩放系数
		const isLargeModel = size.length() > 5000;
		const actualFitOffset = isLargeModel ? 0.8 : fitOffset;

		// 重新定位相机，确保能看到整个模型
		// 使用您提供的模型位置作为参考
		const targetPosition = new THREE.Vector3(
			center.x + size.x * 0.5,
			center.y + size.y * 0.5,
			center.z - size.z * 0.5
		);

		console.log('目标相机位置:', targetPosition);
		console.log('目标观察中心:', center);

		// 设置相机位置
		animateCamera(targetPosition, center, 1000);

		// 确保模型在视图中
		setTimeout(() => {
			controls.target.copy(center);
			controls.update();

			// 保存这个位置作为默认重置位置
			state.defaultCameraPosition = camera.position.clone();
			state.cameraPosition = camera.position.clone();
			state.lookAtPosition = center.clone();

			controls.saveState(); // 保存为重置点
			needsRender = true;

			console.log('相机位置已更新:', camera.position);
			console.log('相机目标已更新:', controls.target);
		}, 1100);
	} catch (error) {
		console.error('自动适应相机到模型失败:', error);
	}
};

// 设置相机视角
const setCameraView = (view) => {
	if (!scene || !camera) return;

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

		// 使用平滑动画
		animateCamera(targetPosition, center);
	} catch (error) {
		console.error('设置相机视角失败:', error);
	}
};

// 重置相机
const resetCamera = () => {
	if (!camera || !controls) return;

	try {
		if (modelInfo.center) {
			// 如果有模型信息，则重置到适合查看模型的位置
			const center = modelInfo.center;
			const targetPosition = new THREE.Vector3(
				center.x + 100,
				center.y + 300,
				center.z - 300
			);

			animateCamera(targetPosition, center, 1000);
			console.log('重置相机到模型视图位置');
		} else {
			// 否则重置到默认位置
			animateCamera(
				new THREE.Vector3(2500, 800, -1800),
				new THREE.Vector3(2500, 500, -2000),
				1000
			);
			console.log('重置相机到默认位置');
		}
	} catch (error) {
		console.error('重置相机失败:', error);
	}
};

// 相机动画
const animateCamera = (
	targetPosition,
	lookAtPosition,
	duration = 1000,
	onComplete
) => {
	if (!camera || !controls) return;

	const startPosition = camera.position.clone();
	const startLookAt = controls ? controls.target.clone() : new THREE.Vector3();
	const startTime = Date.now();

	// 确保目标位置为Vector3类型
	const targetPos =
		targetPosition instanceof THREE.Vector3
			? targetPosition.clone()
			: new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);

	const targetLookAt =
		lookAtPosition instanceof THREE.Vector3
			? lookAtPosition.clone()
			: lookAtPosition
			? new THREE.Vector3(lookAtPosition.x, lookAtPosition.y, targetLookAt.z)
			: startLookAt.clone();

	console.log('相机动画 - 从:', startPosition, '到:', targetPos);
	console.log('视线动画 - 从:', startLookAt, '到:', targetLookAt);

	cameraAnimation = {
		startPosition: startPosition,
		targetPosition: targetPos,
		startLookAt: startLookAt,
		targetLookAt: targetLookAt,
		startTime: startTime,
		duration: duration,
		active: true,
		onComplete: onComplete, // 新增动画结束回调
	};

	needsRender = true;
};

// 更新渲染循环中的相机动画部分
const updateCameraAnimation = () => {
	if (!cameraAnimation || !cameraAnimation.active || !camera || !controls)
		return false;

	const now = Date.now();
	const elapsed = now - cameraAnimation.startTime;

	if (elapsed >= cameraAnimation.duration) {
		// 动画结束，直接设置到目标位置
		camera.position.copy(cameraAnimation.targetPosition);
		controls.target.copy(cameraAnimation.targetLookAt);
		controls.update();

		state.cameraPosition = camera.position.clone();
		state.lookAtPosition = controls.target.clone();

		cameraAnimation.active = false;
		if (cameraAnimation.onComplete) {
			cameraAnimation.onComplete();
		}
		return true;
	}

	// 使用缓动函数计算进度
	const progress = easeOutCubic(elapsed / cameraAnimation.duration);

	camera.position.lerpVectors(
		cameraAnimation.startPosition,
		cameraAnimation.targetPosition,
		progress
	);
	controls.target.lerpVectors(
		cameraAnimation.startLookAt,
		cameraAnimation.targetLookAt,
		progress
	);

	controls.update();
	return true;
};

// 缓动函数
const easeOutCubic = (t) => {
	return 1 - Math.pow(1 - t, 3);
};

// ============== 辅助和控制函数 ==============

// 切换线框模式
const toggleWireframe = (value) => {
	if (!scene) return;

	state.showWireframe = value;

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

	needsRender = true;
};

// 更新模型透明度
const updateModelOpacity = (value) => {
	if (!scene) return;

	state.modelOpacity = value;

	scene.traverse((node) => {
		if (node.isMesh && node.material) {
			if (value < 1) {
				node.material.transparent = true;
				node.material.opacity = value;
			} else {
				node.material.transparent = false;
				node.material.opacity = 1;
			}
			node.material.needsUpdate = true;
		}
	});

	needsRender = true;
};

// 切换自动旋转
const toggleAutoRotate = (value) => {
	if (!controls) return;

	state.autoRotate = value;
	controls.autoRotate = value;
	needsRender = true;
};

// 更新旋转速度
const updateRotationSpeed = (value) => {
	if (!controls) return;

	state.rotationSpeed = value;
	controls.autoRotateSpeed = value;
	needsRender = true;
};

// 切换抗锯齿
const toggleAntiAlias = (value) => {
	state.enableAntiAlias = value;

	if (fxaaPass) {
		fxaaPass.enabled = value;
	}

	needsRender = true;
};

// 截图功能
const captureScreenshot = () => {
	if (!renderer || !scene || !camera) {
		ElMessage.error('无法捕获截图');
		return;
	}

	try {
		// 临时提高渲染质量
		const originalPixelRatio = renderer.getPixelRatio();
		renderer.setPixelRatio(window.devicePixelRatio);

		// 渲染高质量图像
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

		// 恢复原始质量
		renderer.setPixelRatio(originalPixelRatio);

		ElMessage.success('截图已保存');
	} catch (error) {
		console.error('截图失败:', error);
		ElMessage.error('截图失败');
	}
};

// 全屏切换
const toggleFullscreen = () => {
	try {
		const element = containerRef.value || document.documentElement;

		if (!document.fullscreenElement) {
			// 进入全屏
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen();
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen();
			}
			state.isFullScreen = true;
		} else {
			// 退出全屏
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
			state.isFullScreen = false;
		}

		// 过渡效果：等待尺寸调整
		setTimeout(handleResize, 100);
	} catch (error) {
		console.error('切换全屏失败:', error);
		ElMessage.error('切换全屏失败');
	}
};

// ============== 辅助工具函数 ==============

// 切换网格辅助
const toggleGrid = (value) => {
	if (!scene) return;

	state.showGrid = value;

	if (value && !gridHelper) {
		try {
			const box = new THREE.Box3().setFromObject(scene);
			const size = box.getSize(new THREE.Vector3());
			const maxSize = Math.max(size.x, size.z) * 2;

			gridHelper = new THREE.GridHelper(maxSize, 20, 0x888888, 0x444444);
			gridHelper.position.y = box.min.y - 1; // 放在模型底部
			scene.add(gridHelper);
		} catch (error) {
			console.error('创建网格辅助失败:', error);
		}
	} else if (!value && gridHelper) {
		scene.remove(gridHelper);
		gridHelper = null;
	}

	needsRender = true;
};

// 切换坐标轴辅助
const toggleAxes = (value) => {
	if (!scene) return;

	state.showAxes = value;

	if (value && !axesHelper) {
		try {
			const box = new THREE.Box3().setFromObject(scene);
			const size = box.getSize(new THREE.Vector3());
			const maxSize = Math.max(size.x, size.y, size.z);

			axesHelper = new THREE.AxesHelper(maxSize / 2);
			scene.add(axesHelper);
		} catch (error) {
			console.error('创建坐标轴辅助失败:', error);
		}
	} else if (!value && axesHelper) {
		scene.remove(axesHelper);
		axesHelper = null;
	}

	needsRender = true;
};

// 切换边界盒辅助
const toggleBoundingBox = (value) => {
	if (!scene) return;

	state.showBoundingBox = value;

	if (value && !boundingBoxHelper) {
		try {
			const box = new THREE.Box3().setFromObject(scene);
			boundingBoxHelper = new THREE.Box3Helper(box, 0xffff00);
			scene.add(boundingBoxHelper);
		} catch (error) {
			console.error('创建边界盒辅助失败:', error);
		}
	} else if (!value && boundingBoxHelper) {
		scene.remove(boundingBoxHelper);
		boundingBoxHelper = null;
	}

	needsRender = true;
};

// ============== 测量工具函数 ==============

// 切换测量模式
const toggleMeasureMode = () => {
	state.measureMode = !state.measureMode;

	if (!state.measureMode) {
		clearMeasurement();
	} else {
		ElMessage.info('点击两点进行测量，右键或ESC清除测量');
	}
};

// 清理测量
const clearMeasurement = () => {
	if (!scene) return;

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
	state.measureResult = null;

	needsRender = true;
};

// 处理测量点击
const handleMeasureClick = (event) => {
	if (!scene || !camera || !state.measureMode) return;

	// 创建射线
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	// 计算坐标
	const rect = event.currentTarget.getBoundingClientRect();
	mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
	mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

	// 射线检测
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children, true);

	if (intersects.length === 0) return;

	const point = intersects[0].point.clone();

	// 创建标记
	const markerGeometry = new THREE.SphereGeometry(2, 16, 16);
	const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff4444 });
	const marker = new THREE.Mesh(markerGeometry, markerMaterial);
	marker.position.copy(point);
	scene.add(marker);

	// 保存点和标记
	measurePoints.push(point);
	measureMarkers.push(marker);

	// 如果有两个点，计算距离
	if (measurePoints.length === 2) {
		const [point1, point2] = measurePoints;

		// 如果已有测量线，移除它
		if (measureLine) {
			scene.remove(measureLine);
		}

		// 创建线段
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
		state.measureResult = distance;

		// 添加中点标记
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

	needsRender = true;
};

// 测量右键处理
const handleMeasureRightClick = (event) => {
	if (state.measureMode) {
		event.preventDefault();
		clearMeasurement();
	}
};

// 测量键盘处理
const handleMeasureKeyDown = (event) => {
	if (event.key === 'Escape' && state.measureMode) {
		clearMeasurement();
	}
};

// 设置测量工具监听器
const setupMeasurementListeners = () => {
	const canvas = canvasRef.value || document.getElementById('myCanvas');
	if (!canvas) return;

	// 添加事件监听
	canvas.addEventListener('click', handleMeasureClick);
	canvas.addEventListener('contextmenu', handleMeasureRightClick);
	window.addEventListener('keydown', handleMeasureKeyDown);

	// 返回清理函数
	return () => {
		canvas.removeEventListener('click', handleMeasureClick);
		canvas.removeEventListener('contextmenu', handleMeasureRightClick);
		window.removeEventListener('keydown', handleMeasureKeyDown);
	};
};

// ============== 爆炸视图函数 ==============

// 切换爆炸视图模式
const toggleExplosionMode = () => {
	state.explosionMode = !state.explosionMode;

	if (!state.explosionMode) {
		resetExplosionView();
	} else {
		if (originalPositions.size === 0 && scene) {
			saveOriginalPositions(scene);
		}
	}
};

// 更新爆炸视图
const updateExplosionView = (strength) => {
	if (!scene || originalPositions.size === 0) return;

	state.explosionStrength = strength;

	scene.traverse((node) => {
		if (node.isMesh && originalPositions.has(node.uuid)) {
			// 获取原始位置
			const originalPos = originalPositions.get(node.uuid).position;

			// 计算爆炸方向
			const direction = new THREE.Vector3()
				.subVectors(node.position, new THREE.Vector3(0, 0, 0))
				.normalize();

			// 爆炸距离
			const explodeDistance = 50 * strength;

			// 设置新位置
			node.position
				.copy(originalPos)
				.add(direction.multiplyScalar(explodeDistance));
		}
	});

	needsRender = true;
};

// 重置爆炸视图
const resetExplosionView = () => {
	if (!scene) return;

	scene.traverse((node) => {
		if (node.isMesh && originalPositions.has(node.uuid)) {
			const originalData = originalPositions.get(node.uuid);
			node.position.copy(originalData.position);
		}
	});

	state.explosionStrength = 0;
	needsRender = true;
};

// ============== 事件处理方法 ==============

// 重试加载
const handleRetry = () => {
	state.loadingFailed = false;
	state.isLoading = true;
	state.loadingWidth = 0;

	// 清理现有资源
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

	// 重新加载
	setTimeout(() => {
		loadModel();
	}, 100);
};

const handleQualityChange = (mode) => {
	state.qualityMode = mode;
	if (mode !== 'auto') {
		state.currentQuality = mode;
		applyQuality(mode);
	}
};

const handleOpacityChange = (value) => {
	updateModelOpacity(value);
};

const handleWireframeToggle = (value) => {
	toggleWireframe(value);
};

const handleAntialiasToggle = (value) => {
	toggleAntiAlias(value);
};

const handleGridToggle = (value) => {
	toggleGrid(value);
};

const handleAxesToggle = (value) => {
	toggleAxes(value);
};

const handleBoundingBoxToggle = (value) => {
	toggleBoundingBox(value);
};

const handleAutoRotateToggle = (value) => {
	toggleAutoRotate(value);
};

const handleRotationSpeedChange = (value) => {
	updateRotationSpeed(value);
};

const handleViewChange = (view) => {
	setCameraView(view);
};

const handleResetView = () => {
	resetCamera();
};

const handleMeasurementToggle = () => {
	toggleMeasureMode();
};

const handleExplosionToggle = () => {
	toggleExplosionMode();
};

const handleExplosionStrengthChange = (value) => {
	updateExplosionView(value);
};

const handleScreenshot = () => {
	captureScreenshot();
};

const handleFullscreen = () => {
	toggleFullscreen();
};

// ============== 生命周期钩子 ==============

// 清理资源
const cleanupResources = () => {
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
		renderer = null;
	}

	// 清理控制器
	if (controls) {
		controls.dispose();
		controls = null;
	}

	// 清理其他资源
	scene = null;
	camera = null;
	composer = null;
	model = null;
};

// 添加键盘控制
const setupKeyboardControls = () => {
	window.addEventListener('keydown', handleKeyDown);

	return () => {
		window.removeEventListener('keydown', handleKeyDown);
	};
};

// 键盘控制处理
const handleKeyDown = (event) => {
	if (!camera || !controls || !model) return;

	const key = event.key.toLowerCase();
	const speed = 0.5; // 移动速度

	// 移动控制
	if (key === 'w') {
		// 前进
		camera.position.z -= speed;
		controls.target.z -= speed;
		needsRender = true;
	} else if (key === 's') {
		// 后退
		camera.position.z += speed;
		controls.target.z += speed;
		needsRender = true;
	} else if (key === 'a') {
		// 左移
		camera.position.x -= speed;
		controls.target.x -= speed;
		needsRender = true;
	} else if (key === 'd') {
		// 右移
		camera.position.x += speed;
		controls.target.x += speed;
		needsRender = true;
	} else if (key === 'q') {
		// 上升
		camera.position.y += speed;
		controls.target.y += speed;
		needsRender = true;
	} else if (key === 'e') {
		// 下降
		camera.position.y -= speed;
		controls.target.y -= speed;
		needsRender = true;
	}

	// 视图控制
	if (key === '1') {
		setCameraView('front');
	} else if (key === '2') {
		setCameraView('top');
	} else if (key === '3') {
		setCameraView('side');
	} else if (key === '4') {
		setCameraView('bottom');
	} else if (key === '5') {
		setCameraView('back');
	} else if (key === 'r') {
		resetCamera();
	}

	// 特殊功能
	if (key === 'f') {
		// 拟合视图
		autoFitCameraToObject(model, 1.5);
	} else if (key === 'h') {
		// 隐藏/显示控制面板
		state.showControls = !state.showControls;
	}

	controls.update();
	updateCameraPosition();
};

// 添加一个辅助函数，帮助找出理想的相机位置
const setupCameraDebug = () => {
	// 只在开发环境添加调试功能
	if (process.env.NODE_ENV !== 'development') return;

	// 创建调试按钮和面板
	const debugContainer = document.createElement('div');
	debugContainer.style.position = 'absolute';
	debugContainer.style.top = '10px';
	debugContainer.style.right = '10px';
	debugContainer.style.zIndex = '9999';
	debugContainer.style.background = 'rgba(0,0,0,0.7)';
	debugContainer.style.color = 'white';
	debugContainer.style.padding = '10px';
	debugContainer.style.borderRadius = '5px';
	debugContainer.style.fontFamily = 'monospace';
	debugContainer.style.fontSize = '12px';
	debugContainer.style.maxWidth = '300px';

	// 添加一个按钮来记录当前相机位置
	const logButton = document.createElement('button');
	logButton.textContent = '记录相机位置';
	logButton.style.marginRight = '10px';
	logButton.style.padding = '5px';

	logButton.onclick = () => {
		if (!camera || !controls) return;

		const position = camera.position;
		const target = controls.target;

		console.log(
			`相机位置: new THREE.Vector3(${position.x.toFixed(
				2
			)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`
		);
		console.log(
			`相机目标: new THREE.Vector3(${target.x.toFixed(2)}, ${target.y.toFixed(
				2
			)}, ${target.z.toFixed(2)})`
		);

		positionInfo.textContent = `位置: x=${position.x.toFixed(
			2
		)}, y=${position.y.toFixed(2)}, z=${position.z.toFixed(2)}`;
		targetInfo.textContent = `目标: x=${target.x.toFixed(
			2
		)}, y=${target.y.toFixed(2)}, z=${target.z.toFixed(2)}`;

		// 复制到剪贴板
		const text = `position: [${position.x.toFixed(2)}, ${position.y.toFixed(
			2
		)}, ${position.z.toFixed(2)}], lookAt: [${target.x.toFixed(
			2
		)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`;
		navigator.clipboard
			.writeText(text)
			.then(() => {
				copyStatus.textContent = '已复制到剪贴板!';
				setTimeout(() => {
					copyStatus.textContent = '';
				}, 2000);
			})
			.catch((err) => {
				copyStatus.textContent = '复制失败: ' + err;
			});
	};

	// 添加一个按钮设置相机到模型中心
	const centerButton = document.createElement('button');
	centerButton.textContent = '移动到模型中心';
	centerButton.style.padding = '5px';

	centerButton.onclick = () => {
		if (!camera || !controls || !model) return;

		const box = new THREE.Box3().setFromObject(model);
		const center = box.getCenter(new THREE.Vector3());

		// 计算向量，从中心点向后偏移一定距离
		const direction = new THREE.Vector3(1, 0.5, -1).normalize();
		const distance = box.getSize(new THREE.Vector3()).length() * 0.8;
		const position = center.clone().add(direction.multiplyScalar(distance));

		camera.position.copy(position);
		controls.target.copy(center);
		controls.update();

		positionInfo.textContent = `位置: x=${position.x.toFixed(
			2
		)}, y=${position.y.toFixed(2)}, z=${position.z.toFixed(2)}`;
		targetInfo.textContent = `目标: x=${center.x.toFixed(
			2
		)}, y=${center.y.toFixed(2)}, z=${center.z.toFixed(2)}`;

		needsRender = true;
	};

	// 添加信息显示区域
	const positionInfo = document.createElement('div');
	positionInfo.style.marginTop = '10px';

	const targetInfo = document.createElement('div');
	targetInfo.style.marginTop = '5px';

	const copyStatus = document.createElement('div');
	copyStatus.style.marginTop = '5px';
	copyStatus.style.color = '#aaffaa';

	// 添加所有元素到容器
	debugContainer.appendChild(logButton);
	debugContainer.appendChild(centerButton);
	debugContainer.appendChild(positionInfo);
	debugContainer.appendChild(targetInfo);
	debugContainer.appendChild(copyStatus);

	// 添加到DOM
	document.body.appendChild(debugContainer);

	// 返回清理函数
	return () => {
		if (document.body.contains(debugContainer)) {
			document.body.removeChild(debugContainer);
		}
	};
};

// 添加 setupMousePick 函数 (需要添加在初始化部分)
const setupMousePick = () => {
	if (!renderer) return () => {};

	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	const onDoubleClick = (event) => {
		if (!camera || !scene || !model) return;

		// 计算鼠标在画布中的归一化坐标
		const rect = renderer.domElement.getBoundingClientRect();
		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		// 设置射线原点和方向
		raycaster.setFromCamera(mouse, camera);

		// 计算射线与模型的交点
		const intersects = raycaster.intersectObject(model, true);

		if (intersects.length > 0) {
			// 获取第一个交点
			const point = intersects[0].point;

			// 设置控制器目标到点击点
			const startTarget = controls.target.clone();

			// 使用动画平滑过渡
			const startTime = Date.now();
			const duration = 500; // 毫秒

			const animateTarget = () => {
				const now = Date.now();
				const elapsed = now - startTime;

				if (elapsed < duration) {
					const progress = easeOutCubic(elapsed / duration);
					controls.target.lerpVectors(startTarget, point, progress);
					controls.update();
					needsRender = true;

					requestAnimationFrame(animateTarget);
				} else {
					controls.target.copy(point);
					controls.update();
					needsRender = true;
				}
			};

			animateTarget();

			// 显示点击点坐标
			ElMessage({
				message: `选中点: X=${point.x.toFixed(2)}, Y=${point.y.toFixed(
					2
				)}, Z=${point.z.toFixed(2)}`,
				type: 'success',
				duration: 2000,
			});
		}
	};

	renderer.domElement.addEventListener('dblclick', onDoubleClick);

	return () => {
		renderer.domElement.removeEventListener('dblclick', onDoubleClick);
	};
};

// 添加方向指示器函数
const addDirectionIndicator = () => {
	if (!scene || !camera) return null;

	// 创建轴向辅助对象
	const axesHelper = new THREE.AxesHelper(1);
	axesHelper.position.set(-4, -3, -4); // 放在屏幕左下角

	// 缩放以适应可见性
	axesHelper.scale.set(0.5, 0.5, 0.5);

	// 添加到场景
	scene.add(axesHelper);

	// 添加标签
	const createLabel = (text, position, color) => {
		const canvas = document.createElement('canvas');
		canvas.width = 64;
		canvas.height = 32;

		const ctx = canvas.getContext('2d');
		ctx.fillStyle = color;
		ctx.font = '24px Arial';
		ctx.fillText(text, 10, 20);

		const texture = new THREE.CanvasTexture(canvas);

		const material = new THREE.SpriteMaterial({
			map: texture,
			transparent: true,
		});

		const sprite = new THREE.Sprite(material);
		sprite.position.copy(position);
		sprite.scale.set(0.5, 0.25, 1);

		return sprite;
	};

	// 添加X、Y、Z标签
	const xLabel = createLabel('X', new THREE.Vector3(-3.7, -3, -4), 'red');
	const yLabel = createLabel('Y', new THREE.Vector3(-4, -2.7, -4), 'green');
	const zLabel = createLabel('Z', new THREE.Vector3(-4, -3, -3.7), 'blue');

	scene.add(xLabel);
	scene.add(yLabel);
	scene.add(zLabel);

	return {
		axesHelper,
		labels: [xLabel, yLabel, zLabel],
		update: () => {
			// 保持方向指示器在视图中的固定位置，但朝向跟随相机
			axesHelper.quaternion.copy(camera.quaternion);
			xLabel.quaternion.copy(camera.quaternion);
			yLabel.quaternion.copy(camera.quaternion);
			zLabel.quaternion.copy(camera.quaternion);
		},
	};
};

// 完全重写移动到模型中心的函数
const handleGotoModelCenter = () => {
	if (!camera || !controls || !model) return;

	try {
		console.log('移动到模型中心...');

		// 计算模型包围盒和中心
		const box = new THREE.Box3().setFromObject(model);
		const center = box.getCenter(new THREE.Vector3());
		const size = box.getSize(new THREE.Vector3());

		// 计算合适的距离
		const maxDim = Math.max(size.x, size.y, size.z);
		const distance = maxDim * 1.5;

		// 固定方向向量 - 与调试工具一致
		const direction = new THREE.Vector3(1, 0.5, -1).normalize();
		const targetPosition = center
			.clone()
			.add(direction.multiplyScalar(distance));

		// 保存当前的damping状态
		const wasDampingEnabled = controls.enableDamping;

		// 暂时关闭damping，避免额外的运动效果
		controls.enableDamping = false;

		// 直接设置位置，不使用动画
		camera.position.copy(targetPosition);
		controls.target.copy(center);

		// 强制更新一次，确保位置正确
		controls.update();

		// 确保渲染应用了新位置
		renderer.render(scene, camera);

		// 等待渲染完成后再恢复damping并记录位置
		setTimeout(() => {
			// 恢复原始damping状态
			controls.enableDamping = wasDampingEnabled;

			// 保存状态并更新相机信息
			state.cameraPosition = camera.position.clone();
			state.lookAtPosition = controls.target.clone();

			if (state.cameraInfo) {
				state.cameraInfo = {
					position: camera.position.clone(),
					target: controls.target.clone(),
				};
			}

			// 确保再次渲染一帧
			needsRender = true;
		}, 50);

		ElMessage.success('已移动到模型中心');
	} catch (error) {
		console.error('移动到模型中心失败:', error);
		ElMessage.error('移动到模型中心失败');
	}
};

// 添加相机控制方法
// 复制相机位置信息
const handleCopyCameraPosition = () => {
	if (!camera || !controls || !state.cameraInfo) return;

	const position = state.cameraInfo.position;
	const target = state.cameraInfo.target;

	const text = `
相机位置:
new THREE.Vector3(${position.x.toFixed(2)}, ${position.y.toFixed(
		2
	)}, ${position.z.toFixed(2)})

相机目标:
new THREE.Vector3(${target.x.toFixed(2)}, ${target.y.toFixed(
		2
	)}, ${target.z.toFixed(2)})

// 代码片段:
camera.position.set(${position.x.toFixed(2)}, ${position.y.toFixed(
		2
	)}, ${position.z.toFixed(2)});
controls.target.set(${target.x.toFixed(2)}, ${target.y.toFixed(
		2
	)}, ${target.z.toFixed(2)});
controls.update();
`;

	try {
		navigator.clipboard.writeText(text).then(() => {
			ElMessage.success('相机位置信息已复制到剪贴板');
		});
	} catch (e) {
		console.error('复制到剪贴板失败:', e);
		// 显示备用对话框
		ElMessageBox.alert(text, '相机位置信息', {
			confirmButtonText: '关闭',
		});
	}
};

// 前往预设视图
const handleGotoPreset = (preset) => {
	if (!camera || !controls || !model) return;

	// 计算模型包围盒
	const box = new THREE.Box3().setFromObject(model);
	const size = box.getSize(new THREE.Vector3());
	const center = box.getCenter(new THREE.Vector3());
	const maxDim = Math.max(size.x, size.y, size.z);
	const distance = maxDim * 1.5;

	let targetPosition = new THREE.Vector3();

	switch (preset) {
		case 'default':
			// 使用初始相机位置
			targetPosition.set(1914.12, 2012.22, -3766.58);
			animateCamera(targetPosition, center, 1000);
			break;

		case 'front':
			targetPosition.copy(center).add(new THREE.Vector3(0, 0, distance));
			animateCamera(targetPosition, center, 1000);
			break;

		case 'top':
			targetPosition.copy(center).add(new THREE.Vector3(0, distance, 0));
			animateCamera(targetPosition, center, 1000);
			break;

		case 'side':
			targetPosition.copy(center).add(new THREE.Vector3(distance, 0, 0));
			animateCamera(targetPosition, center, 1000);
			break;

		default:
			console.warn('未知的预设视图:', preset);
			return;
	}

	ElMessage.success(
		`已切换到${
			preset === 'default'
				? '默认'
				: preset === 'front'
				? '前'
				: preset === 'top'
				? '顶'
				: '侧'
		}视图`
	);
};

// 修改记录相机位置方法，更新cameraInfo
const handleRecordCameraPosition = () => {
	if (!camera || !controls) return;

	const position = camera.position.clone();
	const target = controls.target.clone();

	// 更新相机信息状态
	state.cameraInfo = {
		position: position,
		target: target,
	};

	console.log('记录相机位置:', {
		position: position,
		target: target,
	});

	ElMessage.success('相机位置已记录');
};

// 确保初始化时记录相机位置
const fixCameraPosition = () => {
	if (!camera || !controls || !model) return;

	try {
		console.log('调整相机位置...');

		// 首先计算模型包围盒
		const box = new THREE.Box3().setFromObject(model);
		const center = box.getCenter(new THREE.Vector3());

		// 使用指定的相机位置
		camera.position.set(1914.12, 2012.22, -3766.58);

		// 设置目标为模型中心
		controls.target.copy(center);
		controls.update();

		// 记录初始相机信息
		handleRecordCameraPosition();

		needsRender = true;

		console.log('相机位置已调整:', {
			position: camera.position,
			target: controls.target,
		});
	} catch (error) {
		console.error('调整相机位置失败:', error);
	}
};

onMounted(() => {
	console.log('GLTF模型组件已挂载');
	console.log('Canvas引用 (挂载时):', canvasRef.value);
	console.log('Container引用 (挂载时):', containerRef.value);

	// 延迟初始化以确保DOM已完全渲染
	setTimeout(async () => {
		console.log('延迟后的Canvas引用:', canvasRef.value);

		if (canvasRef.value) {
			try {
				// 检查WebGL支持
				const canvas = document.createElement('canvas');
				const gl =
					canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
				if (!gl) {
					throw new Error('您的浏览器不支持WebGL');
				}

				// 初始化Three.js
				await initializeViewer();

				// 添加窗口调整事件监听
				window.addEventListener('resize', handleResize);

				// 添加键盘控制
				const cleanupKeyboard = setupKeyboardControls();

				// 添加到清理函数列表
				cleanupFunctions.push(() => {
					window.removeEventListener('resize', handleResize);
					cleanupKeyboard();
				});
			} catch (error) {
				console.error('初始化失败:', error);
				state.loadingFailed = true;
				ElMessage.error(error.message || '初始化3D场景失败');
			}
		} else {
			console.error('Canvas元素在延迟后仍未找到');
			state.loadingFailed = true;
			ElMessage.error('无法找到Canvas元素');
		}
	}, 100);

	// 处理全屏状态变化
	const handleFullscreenChange = () => {
		state.isFullScreen = !!document.fullscreenElement || 
							 !!document.webkitFullscreenElement || 
							 !!document.mozFullscreenElement;
		console.log('全屏状态已更新:', state.isFullScreen);
		// 确保渲染一帧以响应全屏变化
		needsRender = true;
	};

	// 添加事件监听
	document.addEventListener('fullscreenchange', handleFullscreenChange);
	document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
	document.addEventListener('mozfullscreenchange', handleFullscreenChange);
	
	// 将事件清理添加到清理函数列表
	cleanupFunctions.push(() => {
		document.removeEventListener('fullscreenchange', handleFullscreenChange);
		document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
		document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
	});
});

onBeforeUnmount(() => {
	console.log('组件卸载，清理资源');

	// 执行所有清理函数
	cleanupFunctions.forEach((cleanup) => {
		if (typeof cleanup === 'function') {
			try {
				cleanup();
			} catch (error) {
				console.error('执行清理函数时出错:', error);
			}
		}
	});

	// 清理资源
	cleanupResources();

	// 移除全屏事件监听
	document.removeEventListener('fullscreenchange', () => {});
	document.removeEventListener('webkitfullscreenchange', () => {});
	document.removeEventListener('mozfullscreenchange', () => {});
});
</script>

<style lang="scss" scoped>
.gltf-model-container {
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

	.myCanvas {
		position: absolute;
		z-index: 1000;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		cursor: pointer;

		/* 添加这个样式确保渲染器的canvas能够正确显示 */
		canvas {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
}
</style>
