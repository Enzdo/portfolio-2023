import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as Tone from 'tone';

const container = document.getElementById('container3d');
const musiquecheck = document.getElementById('playmusic');
const musiquestop = document.getElementById('stopmusic');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

camera.position.set(0, 0, 5);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

const particleCount = 100;
const particleDistance = 5;

const particleGeometry = new THREE.BufferGeometry();
const positions = [];
const colors = [];

for (let i = 0; i < particleCount; i++) {
    positions.push((Math.random() - 0.5) * 10);
    positions.push((Math.random() - 0.5) * 10);
    positions.push((Math.random() - 0.5) * 10);

    const particlePosition = new THREE.Vector3();
    particlePosition.copy(camera.position).add(camera.getWorldDirection().multiplyScalar(particleDistance));
    positions.push(particlePosition.x, particlePosition.y, particlePosition.z);

    colors.push(Math.random());
    colors.push(Math.random());
    colors.push(Math.random());
}

const particlePositions = new Float32Array(positions);
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleColors = new Float32Array(colors);
particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.1
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

const targetObject = new THREE.Object3D();
scene.add(targetObject);
directionalLight.target = targetObject;

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0.30163266195441185, 1.0944081997354218, 3.426867953332126);
controls.minDistance = 2;
controls.maxDistance = 4;
controls.update();

const music = new Tone.Player('afterDark.mp3').toDestination();
music.autostart = false; 

const analyser = new Tone.Analyser('waveform', 1024);
music.connect(analyser);

musiquecheck.addEventListener("click", () => {
    Tone.start(); 
    music.start(); 
    musiquestop.style.display = 'flex';
    musiquecheck.style.display = 'none';
});

musiquestop.addEventListener("click", () => {
    music.stop(); 
    musiquecheck.style.display = 'flex';
    musiquestop.style.display = 'none';
});

const originalPositions = particleGeometry.getAttribute('position').array.slice();
let waveIntensity = 0.0;

function deformParticles() {
    if (music.state === 'started') {
        const waveform = analyser.getValue();
        const positions = particleGeometry.getAttribute('position').array;

        for (let i = 0; i < positions.length; i += 3) {
            const time = performance.now() * 0.001;
            const scale = 1 + waveform[i % waveform.length] * 0.02 * waveIntensity;
            const waveOffset = Math.sin(positions[i] * 10.0 + time * 2.0) * 0.02 * waveIntensity;
            positions[i] = originalPositions[i] * (scale + waveOffset);
            positions[i + 1] = originalPositions[i + 1] * (scale + waveOffset);
            positions[i + 2] = originalPositions[i + 2] * (scale + waveOffset);
        }

        particleGeometry.getAttribute('position').needsUpdate = true;
    }
}

function animate() {
    requestAnimationFrame(animate);
    deformParticles();
    controls.update();
    renderer.render(scene, camera);
}
animate();
