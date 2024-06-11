// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建一个点云材质
const pointCloudMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });

// 创建一个点云几何体，并添加一些随机的点
const pointCloudGeometry = new THREE.Geometry();
for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 10;
    const z = (Math.random() - 0.5) * 10;
    pointCloudGeometry.vertices.push(new THREE.Vector3(x, y, z));
}

// 创建点云对象并添加到场景中
const pointCloud = new THREE.Points(pointCloudGeometry, pointCloudMaterial);
scene.add(pointCloud);



// 加载PCD文件
const loader = new THREE.PCDLoader();
loader.load('pointcloud.pcd', function (pointCloud) {
    scene.add(pointCloud);
});


// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    pointCloud.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
