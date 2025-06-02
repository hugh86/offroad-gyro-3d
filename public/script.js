import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

let scene, camera, renderer, vehicle;

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  // TEST OBJECT (green cube fallback)
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0.5, 0);
  scene.add(cube);

  console.log('Script loaded. Starting GLTF load...');

  const loader = new GLTFLoader();
  loader.load(
    '/offroad.glb',
    function (gltf) {
      console.log('GLB model loaded successfully.');
      vehicle = gltf.scene;
      vehicle.scale.set(1, 1, 1);
      scene.add(vehicle);
    },
    function (xhr) {
      console.log(`GLB loading: ${(xhr.loaded / xhr.total * 100).toFixed(1)}% loaded`);
    },
    function (error) {
      console.error('Error loading GLB model:', error);
    }
  );

  window.addEventListener('deviceorientation', handleOrientation);
  window.addEventListener('resize', onWindowResize);
}

function handleOrientation(event) {
  if (!vehicle) return;

  const pitch = THREE.MathUtils.degToRad(event.beta || 0);
  const roll = THREE.MathUtils.degToRad(event.gamma || 0);
  const yaw = THREE.MathUtils.degToRad(event.alpha || 0);

  vehicle.rotation.x = pitch;
  vehicle.rotation.y = yaw;
  vehicle.rotation.z = -roll;
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
