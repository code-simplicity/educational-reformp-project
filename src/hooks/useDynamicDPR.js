/**
 * 动态设备像素比Hook
 *
 * 根据FPS动态调整设备像素比(DPR)以优化性能
 * 当FPS低于阈值时降低DPR，当FPS恢复时提高DPR
 *
 * @author AI Assistant
 */

import { ref, onBeforeUnmount } from "vue";

/**
 * 动态设备像素比Hook
 *
 * @param {Object} options - 配置选项
 * @param {THREE.WebGLRenderer} options.renderer - Three.js渲染器实例
 * @param {number} options.minFPS - 最低FPS阈值，低于此值时降低DPR (默认: 30)
 * @param {number} options.targetFPS - 目标FPS，高于此值时可以提高DPR (默认: 55)
 * @param {number} options.maxDPR - 最大DPR值 (默认: 设备DPR或2)
 * @param {number} options.minDPR - 最小DPR值 (默认: 0.5)
 * @param {number} options.sampleSize - FPS采样大小 (默认: 10)
 * @param {number} options.cooldownFrames - 调整DPR后的冷却帧数 (默认: 60)
 * @returns {Object} 动态DPR控制器对象
 */
export default function useDynamicDPR(options = {}) {
	// 默认选项
	const defaultOptions = {
		renderer: null,
		minFPS: 30,
		targetFPS: 55,
		maxDPR: Math.min(window.devicePixelRatio || 1, 2),
		minDPR: 0.5,
		sampleSize: 10,
		cooldownFrames: 60,
	};

	// 合并选项
	const config = { ...defaultOptions, ...options };

	// 验证渲染器
	if (!config.renderer) {
		console.warn("useDynamicDPR: 未提供渲染器实例，动态DPR将不会生效");
	}

	// 状态
	const currentFPS = ref(60);
	const currentDPR = ref(config.renderer ? config.renderer.getPixelRatio() : 1);
	const isEnabled = ref(true);

	// 内部状态
	let frameCount = 0;
	let lastTime = 0;
	let fpsSamples = [];
	let cooldownCounter = 0;
	let isAdjusting = false;

	/**
	 * 记录帧率
	 * 每帧调用此函数以更新FPS计数
	 */
	const recordFrame = () => {
		if (!isEnabled.value || !config.renderer) return;

		const now = performance.now();

		// 初始化lastTime
		if (lastTime === 0) {
			lastTime = now;
			return;
		}

		// 计算delta时间
		const deltaTime = now - lastTime;
		lastTime = now;

		// 计算当前帧率
		const fps = 1000 / deltaTime;

		// 添加到采样数组
		fpsSamples.push(fps);
		if (fpsSamples.length > config.sampleSize) {
			fpsSamples.shift();
		}

		// 计算平均帧率
		const avgFPS = fpsSamples.reduce((sum, fps) => sum + fps, 0) / fpsSamples.length;
		currentFPS.value = Math.round(avgFPS);

		// 冷却期间不调整DPR
		if (cooldownCounter > 0) {
			cooldownCounter--;
			return;
		}

		// 根据帧率调整DPR
		adjustDPR();

		// 每60帧更新一次控制台信息
		frameCount++;
		if (frameCount % 60 === 0) {
			console.log(`当前FPS: ${currentFPS.value}, 当前DPR: ${currentDPR.value.toFixed(2)}`);
		}
	};

	/**
	 * 根据帧率调整DPR
	 */
	const adjustDPR = () => {
		if (!config.renderer || isAdjusting) return;

		// 获取当前DPR
		const currentPixelRatio = config.renderer.getPixelRatio();

		// 根据帧率调整DPR
		if (currentFPS.value < config.minFPS) {
			// 帧率过低，降低DPR
			const newDPR = Math.max(currentPixelRatio * 0.8, config.minDPR);
			if (newDPR < currentPixelRatio) {
				setDPR(newDPR);
				cooldownCounter = config.cooldownFrames;
			}
		} else if (currentFPS.value > config.targetFPS && currentPixelRatio < config.maxDPR) {
			// 帧率良好，可以尝试提高DPR
			const newDPR = Math.min(currentPixelRatio * 1.1, config.maxDPR);
			if (newDPR > currentPixelRatio) {
				setDPR(newDPR);
				cooldownCounter = config.cooldownFrames;
			}
		}
	};

	/**
	 * 设置DPR
	 * @param {number} dpr - 新的DPR值
	 */
	const setDPR = (dpr) => {
		if (!config.renderer) return;

		isAdjusting = true;

		try {
			// 保存渲染器尺寸
			const width = config.renderer.domElement.clientWidth;
			const height = config.renderer.domElement.clientHeight;

			// 设置新的DPR
			config.renderer.setPixelRatio(dpr);

			// 更新渲染器尺寸
			config.renderer.setSize(width, height, false);

			// 更新状态
			currentDPR.value = dpr;

			console.log(`DPR已调整为: ${dpr.toFixed(2)}, FPS: ${currentFPS.value}`);
		} catch (e) {
			console.error("设置DPR失败:", e);
		} finally {
			isAdjusting = false;
		}
	};

	/**
	 * 启用动态DPR
	 */
	const enable = () => {
		isEnabled.value = true;
	};

	/**
	 * 禁用动态DPR
	 */
	const disable = () => {
		isEnabled.value = false;
	};

	/**
	 * 重置DPR为设备默认值
	 */
	const resetDPR = () => {
		if (!config.renderer) return;

		setDPR(Math.min(window.devicePixelRatio || 1, config.maxDPR));
	};

	/**
	 * 清理资源
	 */
	const dispose = () => {
		// 重置DPR
		resetDPR();

		// 清空状态
		fpsSamples = [];
		lastTime = 0;
		frameCount = 0;
		cooldownCounter = 0;
	};

	// 组件卸载时清理资源
	onBeforeUnmount(() => {
		dispose();
	});

	// 返回动态DPR控制器对象
	return {
		currentFPS,
		currentDPR,
		isEnabled,
		recordFrame,
		setDPR,
		enable,
		disable,
		resetDPR,
		dispose,
	};
}
