// import * as THREE from 'three';
// import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';
// import nipplejs from 'nipplejs';

// 初始化Three.js
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, -50);
camera.lookAt(0, 0, 0);
// camera.lookAt(1, 0, 1);

adjustWindowSize();
// 窗口大小调整事件
window.addEventListener("resize", adjustWindowSize);

function adjustWindowSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio * 0.7);
  document.body.appendChild(renderer.domElement);

}

// 创建地面
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// 添加灯光
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// 控制器
let controls;
if ('DeviceOrientationEvent' in window) {
  controls = new THREE.DeviceOrientationControls(camera);
} else {
  controls = new THREE.PointerLockControls(camera, document.body);
}

// 子弹
let bullets = [];
// 射击目标
let targets = [];

let score = 0;
const scoreElement = document.getElementById("score");
// 处理玩家移动
const move = { forward: false, backward: false, left: false, right: false };

init();

// 初始化
function init() {

  for (let i = 0; i < 30; i++) {
    createTarget();
  }

  // 创建虚拟摇杆
  const joystick = nipplejs.create({
    zone: document.getElementById('joystick'),
    mode: 'static',
    position: { left: '50px', bottom: '50px' },
    color: 'red',
    size: 100
  });

joystick.on('move', (evt, data) => {
    const deadzone = 0.2; // 设置一个死区
    move.forward = data.vector.y > deadzone;
    move.backward = data.vector.y < -deadzone;
    move.left = data.vector.x < -deadzone;
    move.right = data.vector.x > deadzone;
});

  joystick.on('end', () => {
    move.forward = move.backward = move.left = move.right = false;
  });

  // 添加射击按钮事件
  document.getElementById('shootButton').addEventListener('touchstart', shoot);

  // 添加触摸事件监听器
  document.addEventListener('touchstart', onTouchStart, false);
  document.addEventListener('touchmove', onTouchMove, false);
  document.addEventListener('touchend', onTouchEnd, false);

  animate();
}

// 创建目标物
function createTarget() {
  const targetGeometry = new THREE.BoxGeometry(2, 2, 2);
  const targetMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
  });
  const target = new THREE.Mesh(targetGeometry, targetMaterial);

  let validPosition = false;
  while (!validPosition) {
    target.position.set(Math.random() * 100 - 50, -50, Math.random() * 100 - 50);
    validPosition = true;
    for (let i = 0; i < targets.length; i++) {
      const otherTarget = targets[i];
      if (target.position.distanceTo(otherTarget.position) < 5) {
        validPosition = false;
        break;
      }
    }
  }

  target.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.15, (Math.random() - 0.5) *0* 0.15, (Math.random() - 0.5) * 0.15);
  targets.push(target);
  scene.add(target);
}

function animate() {
  requestAnimationFrame(animate);

  if (controls instanceof THREE.DeviceOrientationControls) {
    controls.update();
  }

  updatePlayer();
  updateBullets();
  updateTargets();

  checkHit();

  renderer.render(scene, camera);
}

// 处理射击
function shoot() {
  const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  bullet.position.copy(camera.position);
  bullet.velocity = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  bullet.gravity = new THREE.Vector3(0, -0.001, 0);
  bullets.push(bullet);
  scene.add(bullet);
}

// 检测是否击中目标
function checkHit() {
  targets.forEach((target, tIndex) => {
    bullets.forEach((bullet, bIndex) => {
      const distance = target.position.distanceTo(bullet.position);
      if (distance < 1) {
        createExplosion(target.position);
        scene.remove(target);
        scene.remove(bullet);
        targets.splice(tIndex, 1);
        bullets.splice(bIndex, 1);
        score += 10;
        scoreElement.innerText = `分数: ${score}`;
        createTarget();
      }
    });
  });
}
// 预加载爆炸纹理
const explosionTexture = new THREE.TextureLoader().load("./shoot.jpg");
// 爆炸效果
function createExplosion(position) {
  const explosionMaterial = new THREE.PointsMaterial({
    size: 1,
    map: explosionTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    color: 0xff4500,
  });

  const explosionGeometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 100; i++) {
    const particle = new THREE.Vector3();
    particle.x = position.x + (Math.random() - 0.5) * 5;
    particle.y = position.y + (Math.random() - 0.5) * 5;
    particle.z = position.z + (Math.random() - 0.5) * 5;
    vertices.push(particle.x, particle.y, particle.z);
  }
  explosionGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

  const explosion = new THREE.Points(explosionGeometry, explosionMaterial);
  scene.add(explosion);
  
// 新增：创建一个平面来显示shoot.jpg
  const shootPlaneGeometry = new THREE.PlaneGeometry(4, 4); // 调整大小
  const shootPlaneMaterial = new THREE.MeshBasicMaterial({
    map: explosionTexture,
    transparent: true,
    opacity: 0,
  });
  const shootPlane = new THREE.Mesh(shootPlaneGeometry, shootPlaneMaterial);
  shootPlane.position.copy(position);
  shootPlane.lookAt(camera.position); // 使平面始终面向相机
  scene.add(shootPlane);

  // 移除爆炸效果，显示shoot.jpg，然后移除shoot.jpg
  setTimeout(() => {
    scene.remove(explosion);
  // 显示shoot.jpg
    shootPlaneMaterial.opacity = 1;

    // 在短暂显示后淡出并移除shoot.jpg
    setTimeout(() => {
      const fadeOutDuration = 500; // 淡出时间（毫秒）
      const startTime = Date.now();

      function fadeOut() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / fadeOutDuration, 1);
        shootPlaneMaterial.opacity = 1 - progress;

        if (progress < 1) {
          requestAnimationFrame(fadeOut);
        } else {
          scene.remove(shootPlane);
        }
      }

      fadeOut();
    }, 200); // shoot.jpg 显示时间（毫秒）
  }, 100);
}


// 更新子弹位置
function updateBullets() {
  bullets = bullets.filter((bullet) => {
    bullet.velocity.add(bullet.gravity);
    bullet.position.add(bullet.velocity);
    if (bullet.position.length() >= 100) {
      scene.remove(bullet);
      return false;
    }
    return true;
  });
}

// 更新目标物位置
function updateTargets() {
  targets.forEach((target) => {
    target.position.add(target.velocity);
    if (target.position.x > 50 || target.position.x < -50) target.velocity.x = -target.velocity.x;
    if (target.position.y > 50 || target.position.y < -50) target.velocity.y = -target.velocity.y;
    if (target.position.z > 50 || target.position.z < -50) target.velocity.z = -target.velocity.z;
  });
}

// 更新玩家位置
function updatePlayer() {
  const speed = 0.25;
  const direction = new THREE.Vector3();
  if (move.forward) direction.z += speed;
  if (move.backward) direction.z -= speed;
  if (move.left) direction.x -= speed;
  if (move.right) direction.x += speed;

  camera.position.add(direction.applyQuaternion(camera.quaternion));
}

// 触摸事件处理
function onTouchStart(event) {
  // 可以在这里添加触摸开始的逻辑
}

function onTouchMove(event) {
  // 可以在这里添加触摸移动的逻辑
}

function onTouchEnd(event) {
  // 可以在这里添加触摸结束的逻辑
}

// 处理方向键和空格键按下事件（保留键盘控制，以便在桌面设备上测试）
const onKeyDown = function (event) {
  switch (event.code) {
    case "ArrowUp":
      move.forward = true;
      break;
    case "ArrowLeft":
      move.left = true;
      break;
    case "ArrowDown":
      move.backward = true;
      break;
    case "ArrowRight":
      move.right = true;
      break;
    case "Space":
      shoot();
      break;
  }
};

// 处理方向键弹起事件
const onKeyUp = function (event) {
  switch (event.code) {
    case "ArrowUp":
      move.forward = false;
      break;
    case "ArrowLeft":
      move.left = false;
      break;
    case "ArrowDown":
      move.backward = false;
      break;
    case "ArrowRight":
      move.right = false;
      break;
  }
};

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
