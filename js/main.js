// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, scene, renderer;

init();
render();

function init() {
    // 添加frustumSize控件
    let frustumSize = 5000; // 初始值
    const aspect = window.innerWidth / window.innerHeight;
    // const frustumSize = 5000; // Increase the frustum size to make the view larger
    camera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.001,  // Set a smaller near clipping plane
        200     // Increase the far clipping plane
    );
    camera.position.set(0, 0, -10); // Move the camera back to avoid clipping
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    
    // Initialize the orthographic camera
    // const gui = new GUI();
    // // 控制相机的参数
    // const cameraFolder = gui.addFolder('Camera Parameters');
    // cameraFolder.add(camera, 'near', 0.001, 10).name('Near Clipping Plane');
    // cameraFolder.add(camera, 'far', 10, 500).name('Far Clipping Plane');
    
    // cameraFolder.add(frustumSize, 'value', 1000, 10000).name('Frustum Size');
    
    // cameraFolder.open();


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.add(camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 0.01;
    controls.maxDistance = 280;

    // // 控制OrbitControls的参数
    // const controlsFolder = gui.addFolder('Orbit Controls');
    // controlsFolder.add(controls, 'minDistance', 0.0001, 12).name('Min Distance');
    // controlsFolder.add(controls, 'maxDistance', 0.01, 880).name('Max Distance');
    // controlsFolder.open();
    
    // Load PCD file
    const loader = new PCDLoader();
    loader.load('images/L1NNSGHA4PB024820R.pcd', function (points) {
        points.geometry.center();
        points.geometry.rotateX(Math.PI);
        points.name = 'Zaghetto.pcd';
        scene.add(points);

        // 更新相机位置，使其对准新的点云
        const boundingBox = new THREE.Box3().setFromObject(points);
        const center = boundingBox.getCenter(new THREE.Vector3());
        camera.position.set(center.x, center.y, center.z - 10); // 调整相机位置
        camera.lookAt(center);
        
        // // Add GUI controls for point size and color
        // const gui = new GUI();
        // gui.add(points.material, 'size', 0.001, 1.5).onChange(render);
        // gui.addColor(points.material, 'color').onChange(render);
        // gui.add(frustumSize, 'value', 10, 50000).onChange(render);
        // gui.open();
        
        const gui = new GUI(); // 创建GUI
        gui.add(controls, 'minDistance', 0.05, 10).onChange(render); // 控制最小距离
        gui.add(controls, 'maxDistance', 10, 200).onChange(render); // 控制最大距离
        gui.add(controls, 'enableZoom').name('Enable Zoom').onChange(render); // 控制是否允许缩放
        gui.add(controls, 'enableRotate').name('Enable Rotate').onChange(render); // 控制是否允许旋转
        gui.add(window, 'frustumSize', 10, 50000).onChange(function() {
            onFrustumSizeChange(frustumSize);
        });
        const materialGUI = gui.addFolder('Material Settings'); // 创建一个材质设置的折叠面板
        materialGUI.add(points.material, 'size', 0.001, 1.5).onChange(render); // 控制点的大小
        materialGUI.addColor(points.material, 'color').onChange(render); // 控制点的颜色
        materialGUI.open(); // 默认展开材质设置的折叠面板
        //?
        render();
    });

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    // const frustumSize = 5000; // Ensure this matches the initial frustum size

    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}

function render() {
    renderer.render(scene, camera);
}
