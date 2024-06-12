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

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.001, 120 );
				camera.position.set( 0, 0, 1 );
				camera.lookAt(new THREE.Vector3(1, 0, 1));
				scene.add( camera );

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render ); // use if there is no animation loop
				controls.minDistance = 0.05;
				controls.maxDistance = 80;

				//scene.add( new THREE.AxesHelper( 1 ) );
				const uploadButton = document.createElement('button');
				uploadButton.textContent = 'Upload CSV';
				document.body.appendChild(uploadButton);
				
				// 处理文件上传事件
				uploadButton.addEventListener('change', function(event) {
				const file = event.target.files[0];
				if (file) {
				readCSVFile(file);
				}
				});
				
				//
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

			}

			//new function
			function readCSVFile(file) {
			  const reader = new FileReader();
			  reader.onload = function(event) {
			    const csvData = event.target.result;
			    createPointCloudFromCSV(csvData);
			  };
			  reader.readAsText(file);
			}
			
			function createPointCloudFromCSV(csvData) {
			  const points = [];
			  const lines = csvData.split('\n');
			  for (let i = 1; i < lines.length; i++) { // 跳过CSV头部
			    const line = lines[i];
			    const values = line.split(',');
			    if (values.length >= 3) {
			      const x = parseFloat(values[0]);
			      const y = parseFloat(values[1]);
			      const z = parseFloat(values[2]);
			      points.push(x, y, z);
			    }
			  }
			
			  const geometry = new THREE.BufferGeometry();
			  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
			
			  const material = new THREE.PointsMaterial({ size: 0.02, sizeAttenuation: true });
			  const pointCloud = new THREE.Points(geometry, material);
			
			  scene.add(pointCloud);
			  render();
			}


			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			function render() {

				renderer.render( scene, camera );

			}

