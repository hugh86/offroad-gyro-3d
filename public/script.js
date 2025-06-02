import * as THREE from './libs/three.module.js';

let scene, camera, renderer;
let orientationLine;

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Light
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  // Simple line indicating orientation
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  orientationLine = new THREE.Line(geometry, material);
  scene.add(orientationLine);

  window.addEventListener('deviceorientation', handleOrientation);
  window.addEventListener('resize', onWindowResize);
}

function handleOrientation(event) {
  const beta = event.beta || 0;  // X-axis (pitch)
  const gamma = event.gamma || 0; // Y-axis (roll)
  const alpha = event.alpha || 0; // Z-axis (yaw)

  // Convert degrees to radians
  const pitch = THREE.MathUtils.degToRad(beta);
  const roll = THREE.MathUtils.degToRad(gamma);
  const yaw = THREE.MathUtils.degToRad(alpha);

  // Update line direction based on orientation
  const length = 2;
  const x = Math.sin(roll) * length;
  const y = Math.cos(pitch) * length;
  const z = Math.sin(yaw) * length;

  const newPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];
  orientationLine.geometry.setFromPoints(newPoints);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
