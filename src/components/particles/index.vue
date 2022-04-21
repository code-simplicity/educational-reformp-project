<template>
	<div class="point-style">
		<div id="indexLizi" />
	</div>
</template>

<script>
import * as THREE from "three";
let count = 0;
// 用来跟踪鼠标水平位置
let mouseX = 0;
let windowHalfX = null;
// 相机
let camera = null;
// 场景
let scene = null;
// 批量管理粒子
let particles = null;
// 渲染器
let renderer = null;
export default {
	name: "Pointwave",
	props: {
		amountX: {
			type: Number,
			default: 65,
		},
		amountY: {
			type: Number,
			default: 55,
		},
		color: {
			type: Number,
			default: 0x6495ed,
		},
		top: {
			type: Number,
			default: 170,
		},
	},
	data() {
		return {};
	},
	mounted() {
		this.init();
		this.animate();
	},
	methods: {
		init() {
			const SEPARATION = 100;
			const SCREEN_WIDTH = window.innerWidth;
			const SCREEN_HEIGHT = window.innerHeight;
			const container = document.createElement("div");
			windowHalfX = window.innerHeight / 2;
			container.style.position = "relative";
			container.style.top = `${this.top}px`;
			container.style.height = `${SCREEN_HEIGHT - this.top}px`;
			document.getElementById("indexLizi").appendChild(container);

			camera = new THREE.PerspectiveCamera(
				75,
				SCREEN_WIDTH / SCREEN_HEIGHT,
				1,
				10000
			);
			camera.position.z = 1000;

			scene = new THREE.Scene();

			const numParticles = this.amountX * this.amountY;
			const positions = new Float32Array(numParticles * 3);
			const scales = new Float32Array(numParticles);
			// 初始化粒子位置和大小
			let i = 0;
			let j = 0;
			for (let ix = 0; ix < this.amountX; ix++) {
				for (let iy = 0; iy < this.amountY; iy++) {
					positions[i] = ix * SEPARATION - (this.amountX * SEPARATION) / 2;
					positions[i + 1] = 0;
					positions[i + 2] = iy * SEPARATION - (this.amountY * SEPARATION) / 2;
					scales[j] = 1;
					i += 3;
					j++;
				}
			}

			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute(
				"position",
				new THREE.BufferAttribute(positions, 3)
			);
			geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
			// 初始化粒子材质
			const material = new THREE.ShaderMaterial({
				uniforms: {
					color: { value: new THREE.Color(this.color) },
				},
				vertexShader: `
          attribute float scale;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4( position, 2.0 );
            gl_PointSize = scale * ( 300.0 / - mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
				fragmentShader: `
          uniform vec3 color;
          void main() {
            if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
            gl_FragColor = vec4( color, 1.0 );
          }
        `,
			});

			particles = new THREE.Points(geometry, material);
			scene.add(particles);

			renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			renderer.setSize(container.clientWidth, container.clientHeight);
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setClearAlpha(0);
			container.appendChild(renderer.domElement);

			window.addEventListener("resize", this.onWindowResize, {
				passive: false,
			});
			document.addEventListener("mousemove", this.onDocumentMouseMove, {
				passive: false,
			});
			document.addEventListener("touchstart", this.onDocumentTouchStart, {
				passive: false,
			});
			document.addEventListener("touchmove", this.onDocumentTouchMove, {
				passive: false,
			});
		},
		render() {
			camera.position.x += (mouseX - camera.position.x) * 0.05;
			camera.position.y = 400;
			camera.lookAt(scene.position);
			const positions = particles.geometry.attributes.position.array;
			const scales = particles.geometry.attributes.scale.array;
			// 计算粒子位置及大小
			let i = 0;
			let j = 0;
			for (let ix = 0; ix < this.amountX; ix++) {
				for (let iy = 0; iy < this.amountY; iy++) {
					positions[i + 1] =
						Math.sin((ix + count) * 0.3) * 100 +
						Math.sin((iy + count) * 0.5) * 100;
					scales[j] =
						(Math.sin((ix + count) * 0.3) + 1) * 8 +
						(Math.sin((iy + count) * 0.5) + 1) * 8;
					i += 3;
					j++;
				}
			}
			// 重新渲染粒子
			particles.geometry.attributes.position.needsUpdate = true;
			particles.geometry.attributes.scale.needsUpdate = true;
			renderer.render(scene, camera);
			count += 0.1;
		},
		animate() {
			requestAnimationFrame(this.animate);
			this.render();
		},
		onDocumentMouseMove(event) {
			mouseX = event.clientX - windowHalfX;
		},
		onDocumentTouchStart(event) {
			if (event.touches.length === 1) {
				mouseX = event.touches[0].pageX - windowHalfX;
			}
		},
		onDocumentTouchMove: function (event) {
			if (event.touches.length === 1) {
				event.preventDefault();
				mouseX = event.touches[0].pageX - windowHalfX;
			}
		},
		onWindowResize() {
			windowHalfX = window.innerWidth / 2;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		},
	},
};
</script>

<style lang="scss" scoped>
.point-style {
	background-color: #141a48;
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	z-index: 0;
}
</style>
