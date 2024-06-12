// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// main.js
let camera, scene, renderer;

init();
render();

function init() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 1;
    const orthographicCamera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.01,
        10
    );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = orthographicCamera;
    camera.position.set(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    const loader = new PCDLoader();
    loader.load('images/L1NNSGHA4PB024820R.pcd', function(points) {
        points.geometry.center();
        points.geometry.rotateX(Math.PI);
        points.name = 'Zaghetto.pcd';
        scene.add(points);

        render();
    });

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 1;
    camera.left = -frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}

function render() {
    renderer.render(scene, camera);
}

