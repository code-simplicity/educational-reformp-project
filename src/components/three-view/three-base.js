import * as THREE from "three"
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader.js';
import {
    FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader.js';
import {
    RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader.js';

export default class ThreeBase {
    constructor(el, options) {
        this.dom = el; // 匹配dom
        // 配置参数
        this.option = {
            sceneUrl: '', // 场景url
            modelUrl: '', // 模型url
            autoRotate: false, //是否自动旋转,
            isFullBrowser: false, // 生成的canvas是否铺面屏幕
            ...options
        };
        // 场景
        this.scene = null;
        // 摄像机
        this.camera = null;
        // 渲染器
        this.renderer = null;
        // 控制器
        this.controls = null;
        // 模型
        this.model = null;
        // 初始化
        this.init();
    }
    // 初始化
    init() {
        // 场景初始化
        this.sceneInit();
        // 相机初始化
        this.cameraInit();
        // 渲染器初始化
        this.rendererInit();
        // 控制器初始化
        this.controlsInit();
        // 动画加载
        this.animate()
        // 加载场景
        if (this.option.sceneUrl) {
            this.loadScene(this.option.sceneUrl)
        }
        // 加载模型
        if (this.option.modelUrl) {
            this.loadModel(this.option.modelUrl)
        }
        // 窗口响应大小
        if (this.option.isFullBrowser) {
            window.addEventListener("resize", this.onWindowResize.bind(this));
        }
    }
    // 场景初始化
    sceneInit() {
        this.scene = new THREE.Scene();
        // 环境光,初始值为白色
        let ambient = new THREE.AmbientLight(0x111111)
        // 环境光装填
        this.scene.add(ambient)
    }
    // 相机初始化
    cameraInit() {
        this.camera = new THREE.PerspectiveCamera(
            70, // 摄像机视锥体垂直视野角度
            this.getWidth() / this.getHeight(), // 摄像机视锥体长宽比
            0.01, // 摄像机视锥体近端面
            2000, // 摄像机视锥体远端面
        )
        this.camera.position.set(0, 0, 1.8);
    }
    // 渲染器初始化
    rendererInit() {
        this.renderer = new THREE.WebGL1Renderer({
            antialias: true, // 抗锯齿
            alpha: true, // canvas是否包含alpha
        })
        // 设置渲染器的宽度和高度
        this.renderer.setSize(this.getWidth(), this.getHeight())
        // 设置像素
        this.renderer.setPixelRatio(window.devicePixelRatio)
        // 创建一个dom节点
        this.dom.appendChild(this.renderer.domElement)
    }
    // 控制器初始化
    controlsInit() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.autoRotateSpeed = 1.0; // 自动旋转速度
        this.controls.autoRotate = this.autoRotate; // 是否自动旋转
        this.controls.enableDamping = true; // 是否惯性滑动
        this.controls.dampingFactor = 0.2; // 阻尼因子
        this.controls.rotateSpeed = 0.25; // 手动旋转速度
        this.controlsRotate(this.option.autoRotate);
        this.controls.update();
    }
    // 控制器旋转
    controlsRotate(autoRotate) {
        this.controls.autoRotate = autoRotate || false;
        if (autoRotate) {
            // 停止操作3s后继续自动旋转
            let timer = null;
            this.controls.addEventListener('start', () => {
                if (timer) {
                    // 清除定时器
                    clearTimeout(timer)
                }
                this.controls.autoRotate = false
            })
            this.controls.addEventListener('end', () => {
                timer = setTimeout(() => {
                    // 自动旋转开始
                    this.controls.autoRotate = true;
                    // 更新控制器
                    this.controls.update();
                }, 3000)
            })
        }
    }
    // 动画渲染
    animate() {
        requestAnimationFrame(() => {
            this.animate();
        })
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    // 加载场景
    loadScene(url) {
        if (/\.hdr$/i.test(url)) {
            new RGBELoader().load(url, (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.background = texture;
                this.scene.environment = texture;
            })
        } else if (/\.(jpg|jpeg|png|gif|bmp)$/i.test(url)) {
            new THREE.TextureLoader().load(url, (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                this.scene.background = texture;
                this.scene.environment = texture;
            });
        }
    }
    // 加载模型
    loadModel(url) {
        // 加载gltf
        if (/\.gltf$/i.test(url)) {
            // glft加载器
            new GLTFLoader().load(url, (gltf) => {
                // 判断原来模块是否存在，存在就进行覆盖
                if (this.model) {
                    this.scene.remove(this.model);
                }
                let model = gltf.scene;
                this.adjustModel(model);
                this.model = model;
                this.scene.add(this.model)
            }, () => {

            }, (error) => {
                console.error("模型加载失败:", error)
            })
        } else if (/\.obj$/i.test(url)) {
            // OBJ加载模型
            new OBJLoader().load(url, (obj) => {
                if (this.model) {
                    this.scene.remove(this.model);
                }
                this.adjustModel(obj);
                this.model = obj;
                this.scene.add(this.model);
            }, () => {

            }, (error) => {
                console.error("模型加载失败:", error)
            })
        } else if (/\.fbx$/i.test(url)) {
            // OBJ加载模型
            new FBXLoader().load(url, (obj) => {
                if (this.model) {
                    this.scene.remove(this.model);
                }
                this.adjustModel(obj);
                this.model = obj;
                this.scene.add(this.model);
            }, () => {

            }, (error) => {
                console.error("模型加载失败:", error)
            })
        }
    }
    // 根据模型调整相机
    adjustModel(model) {
        // 设置相机盒子
        let box3 = new THREE.Box3().setFromObject(model)
        // 设置三维向量
        let vector3 = new THREE.Vector3();
        // 根据向量调整盒子
        box3.getSize(vector3);
        // 三维向量的定位
        model.position.y = -(vector3.y / 4)
        // 获取距离
        let distance = (vector3.x + vector3.y + vector3.z) / 3
        // 相机定位
        this.camera.position.set(0, 0, distance)
        // 更新投影矩阵
        this.camera.updateProjectionMatrix();
    }
    // 响应窗体大小
    onWindowResize() {
        // 重置相机层面
        this.camera.aspect = this.getWidth() / this.getHeight();
        // 重置投影矩阵
        this.camera.updateProjectionMatrix();
        // 重置渲染器的大小
        this.renderer.setSize(this.getWidth(), this.getHeight());
    }
    // 获取宽度
    getWidth() {
        return this.option.isFullBrowser ? window.innerWidth : this.dom.offsetWidth;
    }
    // 获取高度
    getHeight() {
        return this.option.isFullBrowser ? window.innerHeight : this.dom.offsetHeight;
    }
}