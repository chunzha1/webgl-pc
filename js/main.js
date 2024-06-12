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
				let orthographicCamera;

				function createOrthographicCamera() {
				    const aspect = window.innerWidth / window.innerHeight;
				    const frustumSize = 1;
				
				    orthographicCamera = new THREE.OrthographicCamera(
				        frustumSize * aspect / - 2,
				        frustumSize * aspect / 2,
				        frustumSize / 2,
				        frustumSize / - 2,
				        0.01,
				        10
				    );
				
				    orthographicCamera.position.set(0, 0, 1);
				    orthographicCamera.lookAt(new THREE.Vector3(0, 0, 0));
				}
				//
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				scene = new THREE.Scene();
				
				// 初始化正视投影摄像机
				createOrthographicCamera();
				camera = orthographicCamera; // Use only orthographic camera

				// camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.001, 120 );
				// camera.position.set( 0, 0, 1 );
				// camera.lookAt(new THREE.Vector3(1, 0, 1));
				scene.add( camera );

				// const controls = new OrbitControls( camera, renderer.domElement );
				// controls.addEventListener( 'change', render ); // use if there is no animation loop
				// controls.minDistance = 0.05;
				// controls.maxDistance = 80;

				
				// 添加切换到正视投影视角的按钮
				// const switchToOrthographicViewButton = document.createElement('button');
				// switchToOrthographicViewButton.textContent = 'Switch to Orthographic View';
				// switchToOrthographicViewButton.style.position = 'absolute';
				// switchToOrthographicViewButton.style.top = '10px';
				// switchToOrthographicViewButton.style.left = '10px';
				// document.body.appendChild(switchToOrthographicViewButton);
				
				// switchToOrthographicViewButton.addEventListener('click', function() {
				// camera = orthographicCamera; // 切换到正视投影摄像机
				// render(); // 重新渲染
				// });

				
				//scene.add( new THREE.AxesHelper( 1 ) );	
				const loader = new PCDLoader();
				loader.load( 'images/L1NNSGHA4PB024820R.pcd', function ( points ) {

					points.geometry.center();
					points.geometry.rotateX( Math.PI );
					points.name = 'Zaghetto.pcd';
					scene.add( points );

					//

					const gui = new GUI();

					gui.add( points.material, 'size', 0.001, 0.5 ).onChange( render );
					gui.addColor( points.material, 'color' ).onChange( render );
					gui.open();

					//

					render();

				} );

				window.addEventListener( 'resize', onWindowResize );
				// const switchViewButton = document.createElement('button');
				// switchViewButton.textContent = 'Switch to Orthographic View';
				// switchViewButton.style.position = 'absolute';
				// switchViewButton.style.top = '10px';
				// switchViewButton.style.left = '10px';
				// document.body.appendChild(switchViewButton);

				// switchViewButton.addEventListener('click', function() {
				// camera.position.set(0, 0, 0); // 设置摄像机位置
				// camera.lookAt(new THREE.Vector3(1, 1, 0)); // 设置摄像机朝向
				// render(); // 重新渲染
				// });

			}
			
			function onWindowResize() {
				
				camera.left = -window.innerWidth / 2;
				camera.right = window.innerWidth / 2;
				camera.top = window.innerHeight / 2;
				camera.bottom = -window.innerHeight / 2;
				camera.updateProjectionMatrix();
				
				// camera.aspect = window.innerWidth / window.innerHeight;
				// camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			function render() {

				renderer.render( scene, camera );

			}

