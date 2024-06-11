// main.js
import * as THREE from 'https://gcore.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

export function init() {
    // 初始化场景、相机和渲染器
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 创建点云几何体
    var geometry = new THREE.BufferGeometry();

    // 假设我们有一个点云数据数组
    var positions = []; // 这里应该是你的点云数据

    for (var i = 0; i < 100; i++) {
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        var z = Math.random() * 2 - 1;
        positions.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    // 创建点材质
    var material = new THREE.PointsMaterial({
        size: 0.02,
        sizeAttenuation: true
    });

    // 创建点云对象
    var points = new THREE.Points(geometry, material);
    scene.add(points);

    // 设置相机位置
    camera.position.z = 5;

    // 渲染循环
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // 处理窗口大小变化
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
