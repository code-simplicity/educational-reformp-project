/**
 * 节流渲染Hook
 *
 * 实现高效的渲染策略，只在必要时调用renderer.render()
 * 监听controls.change事件，并在事件触发或needsRender为true时才进行渲染
 *
 * @author AI Assistant
 */

import { ref, onBeforeUnmount } from "vue";

/**
 * 节流渲染Hook
 *
 * @param {Object} options - 配置选项
 * @param {THREE.WebGLRenderer} options.renderer - Three.js渲染器实例
 * @param {THREE.Scene} options.scene - Three.js场景实例
 * @param {THREE.Camera} options.camera - Three.js相机实例
 * @param {THREE.OrbitControls} options.controls - Three.js控制器实例
 * @param {THREE.EffectComposer} options.composer - Three.js后处理器实例（可选）
 * @param {boolean} options.useComposer - 是否使用后处理器渲染（默认: false）
 * @param {boolean} options.autoRotate - 是否启用自动旋转（默认: false）
 * @param {Function} options.onBeforeRender - 渲染前回调函数
 * @param {Function} options.onAfterRender - 渲染后回调函数
 * @param {number} options.idleFrameRate - 静止状态下的最大帧率（默认: 10）
 * @returns {Object} 节流渲染控制器对象
 */
export default function useThrottleRender(options = {}) {
	// 默认选项
	const defaultOptions = {
		renderer: null,
		scene: null,
		camera: null,
		controls: null,
		composer: null,
		useComposer: false,
		autoRotate: false,
		onBeforeRender: null,
		onAfterRender: null,
		idleFrameRate: 5, // 降低静止状态下的帧率以提高性能
	};

	// 合并选项
	const config = { ...defaultOptions, ...options };

	// 验证必要参数
	if (!config.renderer || !config.scene || !config.camera) {
		console.warn("useThrottleRender: 缺少必要参数(renderer, scene, camera)，节流渲染将不会生效");
		return {
			needsRender: ref(false),
			requestRender: () => {},
			setAutoRotate: () => {},
			addAnimationCallback: () => () => {},
			dispose: () => {},
		};
	}

	// 状态
	const needsRender = ref(false);
	const isUserInteracting = ref(false);
	const autoRotate = ref(config.autoRotate);

	// 内部状态
	let rafId = null;
	let lastRenderTime = 0;
	let idleInterval = 1000 / config.idleFrameRate;
	let animationCallbacks = [];
	let controlsChangeHandler = null;

	/**
	 * 请求渲染
	 * 将needsRender设置为true，触发下一帧渲染
	 */
	const requestRender = () => {
		needsRender.value = true;
	};

	/**
	 * 设置自动旋转
	 * @param {boolean} value - 是否启用自动旋转
	 */
	const setAutoRotate = (value) => {
		autoRotate.value = value;

		if (config.controls) {
			config.controls.autoRotate = value;
		}
	};

	/**
	 * 添加动画回调函数
	 * @param {Function} callback - 动画回调函数，返回true表示需要渲染
	 * @returns {Function} 移除回调的函数
	 */
	const addAnimationCallback = (callback) => {
		if (typeof callback !== "function") return () => {};

		animationCallbacks.push(callback);

		// 返回移除回调的函数
		return () => {
			const index = animationCallbacks.indexOf(callback);
			if (index !== -1) {
				animationCallbacks.splice(index, 1);
			}
		};
	};

	/**
	 * 渲染循环 - 高度优化版本
	 * 使用帧率限制、渲染节流和帧跳过来显著提高性能
	 */
	const animate = () => {
		// 使用防抖方式请求下一帧
		rafId = requestAnimationFrame(animate);

		const currentTime = performance.now();
		const deltaTime = currentTime - lastRenderTime;

		// 静态场景优化：使用帧跳过技术
		// 如果没有交互且没有动画，大幅降低渲染频率
		const isStatic = !isUserInteracting.value && !autoRotate.value && animationCallbacks.length === 0;
		if (isStatic) {
			// 静态场景每秒只渲染几次
			if (deltaTime < 200 && !needsRender.value) { // 5fps for static scenes
				return;
			}
		} else {
			// 动态场景但非交互状态，适度降低帧率
			const minFrameInterval = isUserInteracting.value ? 0 : idleInterval;
			if (deltaTime < minFrameInterval && !needsRender.value) {
				return;
			}
		}

		// 更新控制器 - 只在必要时更新
		if (config.controls) {
			// 只在自动旋转或用户交互时更新控制器
			if (isUserInteracting.value || autoRotate.value) {
				config.controls.update();
			}
		}

		// 执行动画回调 - 使用try-catch包装每个回调以提高稳定性
		let animationNeedsRender = false;
		if (animationCallbacks.length > 0) {
			// 使用for循环而不是forEach以提高性能
			for (let i = 0; i < animationCallbacks.length; i++) {
				try {
					if (animationCallbacks[i](deltaTime) === true) {
						animationNeedsRender = true;
					}
				} catch (e) {
					console.error("动画回调执行出错:", e);
				}
			}
		}

		// 判断是否需要渲染 - 使用更严格的条件
		// 1. 显式请求渲染
		// 2. 用户正在交互且已经过了足够时间
		// 3. 自动旋转已启用
		// 4. 动画回调请求渲染
		// 5. 已经过了最大帧间隔时间
		const shouldRender =
			needsRender.value ||
			(isUserInteracting.value && deltaTime > 16) || // 约60fps
			autoRotate.value ||
			animationNeedsRender ||
			deltaTime > idleInterval;

		if (shouldRender) {
			try {
				// 渲染前回调
				if (typeof config.onBeforeRender === "function") {
					config.onBeforeRender();
				}

				// 执行渲染
				if (config.useComposer && config.composer) {
					config.composer.render();
				} else {
					config.renderer.render(config.scene, config.camera);
				}

				// 渲染后回调
				if (typeof config.onAfterRender === "function") {
					config.onAfterRender();
				}

				// 重置状态
				needsRender.value = false;
				lastRenderTime = currentTime;
			} catch (e) {
				console.error("渲染过程出错:", e);
			}
		}
	};

	/**
	 * 设置交互事件监听 - 高度优化版本
	 * 使用事件节流和被动事件监听器提高性能
	 */
	const setupInteractionListeners = () => {
		if (!config.renderer || !config.renderer.domElement) return;

		const canvas = config.renderer.domElement;
		let interactionTimer = null;
		let lastInteractionTime = 0;
		let mouseMoveThrottleTimer = null;
		const INTERACTION_TIMEOUT = 300; // 降低交互超时时间以提高响应性
		const MOUSE_MOVE_THROTTLE = 50; // 鼠标移动事件节流时间（毫秒）

		// 节流函数 - 限制高频事件的触发频率
		const throttle = (callback, delay) => {
			let lastCallTime = 0;

			return function (...args) {
				const now = performance.now();
				if (now - lastCallTime >= delay) {
					lastCallTime = now;
					callback.apply(this, args);
				}
			};
		};

		// 开始交互 - 基础版本，用于mousedown等低频事件
		const startInteraction = () => {
			isUserInteracting.value = true;
			needsRender.value = true;
			lastInteractionTime = performance.now();

			clearTimeout(interactionTimer);
		};

		// 鼠标移动交互 - 节流版本，减少触发频率
		const handleMouseMove = throttle(() => {
			isUserInteracting.value = true;
			needsRender.value = true;
			lastInteractionTime = performance.now();

			clearTimeout(interactionTimer);

			// 设置新定时器，在交互结束后停止持续渲染
			interactionTimer = setTimeout(() => {
				// 只有在没有新交互的情况下才结束交互状态
				if (performance.now() - lastInteractionTime >= INTERACTION_TIMEOUT) {
					isUserInteracting.value = false;
					needsRender.value = true; // 交互结束时再渲染一帧
				}
			}, INTERACTION_TIMEOUT);
		}, MOUSE_MOVE_THROTTLE);

		// 结束交互 - 使用更短的超时时间提高响应性
		const endInteraction = () => {
			clearTimeout(interactionTimer);

			interactionTimer = setTimeout(() => {
				isUserInteracting.value = false;
				needsRender.value = true; // 交互结束时再渲染一帧
			}, INTERACTION_TIMEOUT);
		};

		// 添加事件监听 - 使用被动事件监听器提高滚动性能
		canvas.addEventListener("mousedown", startInteraction, { passive: true });
		canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
		canvas.addEventListener("mouseup", endInteraction, { passive: true });
		canvas.addEventListener("touchstart", startInteraction, { passive: true });
		canvas.addEventListener("touchmove", handleMouseMove, { passive: true });
		canvas.addEventListener("touchend", endInteraction, { passive: true });
		canvas.addEventListener("wheel", startInteraction, { passive: true });

		// 返回清理函数
		return () => {
			canvas.removeEventListener("mousedown", startInteraction);
			canvas.removeEventListener("mousemove", handleMouseMove);
			canvas.removeEventListener("mouseup", endInteraction);
			canvas.removeEventListener("touchstart", startInteraction);
			canvas.removeEventListener("touchmove", handleMouseMove);
			canvas.removeEventListener("touchend", endInteraction);
			canvas.removeEventListener("wheel", startInteraction);

			clearTimeout(interactionTimer);
			clearTimeout(mouseMoveThrottleTimer);
		};
	};

	/**
	 * 设置控制器变化监听
	 */
	const setupControlsChangeListener = () => {
		if (!config.controls) return;

		// 控制器变化处理函数
		controlsChangeHandler = () => {
			needsRender.value = true;
		};

		// 添加事件监听
		config.controls.addEventListener("change", controlsChangeHandler);

		// 返回清理函数
		return () => {
			if (config.controls && controlsChangeHandler) {
				config.controls.removeEventListener("change", controlsChangeHandler);
			}
		};
	};

	/**
	 * 初始化
	 */
	const init = () => {
		// 设置交互事件监听
		const cleanupInteraction = setupInteractionListeners();

		// 设置控制器变化监听
		const cleanupControls = setupControlsChangeListener();

		// 设置自动旋转
		setAutoRotate(autoRotate.value);

		// 启动渲染循环
		lastRenderTime = performance.now();
		animate();

		// 返回清理函数
		return () => {
			cleanupInteraction();
			cleanupControls();

			if (rafId) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}
		};
	};

	// 初始化并获取清理函数
	const cleanup = init();

	/**
	 * 清理资源
	 */
	const dispose = () => {
		// 执行清理函数
		if (cleanup) {
			cleanup();
		}

		// 清空回调数组
		animationCallbacks = [];
	};

	// 组件卸载时清理资源
	onBeforeUnmount(() => {
		dispose();
	});

	// 返回节流渲染控制器对象
	return {
		needsRender,
		isUserInteracting,
		autoRotate,
		requestRender,
		setAutoRotate,
		addAnimationCallback,
		dispose,
		// 添加新方法，允许外部设置帧率
		setIdleFrameRate: (rate) => {
			if (rate > 0) {
				config.idleFrameRate = rate;
				idleInterval = 1000 / rate;
			}
		},
	};
}
