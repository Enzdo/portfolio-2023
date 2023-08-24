


import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import * as Tone from 'tone';

const container = document.getElementById('container3d');
const musiquecheck = document.getElementById('playmusic');
const musiquestop = document.getElementById('stopmusic');

const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
        vNormal = normal;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float waveIntensity;
    uniform vec3 uBaseColor; 
    uniform vec3 uWaveColor; 
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vec3 lightDir = normalize(vec3(20.0, 20.0, 20.0));
        float intensity = dot(vNormal, lightDir);

        // Couleur de base
        vec3 baseColor = uBaseColor;

        // Couleur des vagues
        vec3 waveColor = mix(vec3(20.0, 20.0, 20.0), uWaveColor, intensity);

        // Calcul de la couleur finale en fonction de l'intensité lumineuse et des vagues
        vec3 finalColor = mix(baseColor, waveColor, waveIntensity) * intensity;

        // Calcul de la couleur émissive (glow)
        vec3 emissiveColor = finalColor * 0.9; // Ajustez la valeur pour obtenir l'effet d'éclat souhaité

        gl_FragColor = vec4(finalColor + emissiveColor, 20.0);
    }
`;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

camera.position.set(0, 0, 5);

const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
const colors = new Float32Array(sphereGeometry.attributes.position.count * 3);
sphereGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const material = new THREE.ShaderMaterial({
    uniforms: {
        uBaseColor: { value: new THREE.Vector3(0.0, 0.0, 0.2) }, // Couleur de base bleu foncé
        uWaveColor: { value: new THREE.Vector3(0.0, 0.0, 1.0) } // Couleur des vagues bleue
    },
    vertexShader,
    fragmentShader
});
const sphere = new THREE.Mesh(sphereGeometry, material);

scene.add(sphere);

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

// Copier les positions originales des sommets de la sphère
const originalPositions = sphere.geometry.attributes.position.array.slice();
let waveIntensity = 0.0;
function updateShaders() {
    const waveform = analyser.getValue();
    const bassIntensity = waveform[0] * 5;
    const color = new THREE.Vector3(bassIntensity, 1.0 - waveform[1], 1.0 - waveform[2]);
    
    // Mettez à jour les uniformes uBaseColor et uWaveColor du matériau
    material.uniforms.uBaseColor.value = new THREE.Vector3(0.8, 0.8, 0.8); // Couleur de base bleu foncé
    material.uniforms.uWaveColor.value = new THREE.Vector3(0.8, 0.8, 0.8); // Couleur des vagues bleue
    
    waveIntensity = bassIntensity;
}

// Animation avec GSAP
const lightMoveDuration = 1; // Durée en secondes
const lightPosition = new THREE.Vector3(1, 1, 1); // Position initiale de la lumière

function onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Convertir les coordonnées de la souris en un vecteur de direction
    const mouseDirection = new THREE.Vector3(mouseX, mouseY, 0.5);
    mouseDirection.unproject(camera).sub(camera.position).normalize();

    // Multiplier le vecteur de direction par une distance pour obtenir la nouvelle position de la lumière
    const newLightPosition = camera.position.clone().add(mouseDirection.multiplyScalar(lightPosition.distanceTo(camera.position)));

    // Animer la position de la lumière avec GSAP
    gsap.to(lightPosition, {
        x: newLightPosition.x,
        y: newLightPosition.y,
        z: newLightPosition.z,
        duration: lightMoveDuration,
        onUpdate: () => {
            // Mettre à jour la position de la lumière dans la scène
            directionalLight.position.copy(lightPosition);
        }
    });
}

// Ajouter un écouteur d'événement pour le mouvement de la souris
document.addEventListener('mousemove', onMouseMove);

const textureCoords = new Float32Array(sphereGeometry.attributes.position.count * 2);
for (let i = 0; i < textureCoords.length; i += 2) {
    const u = i / textureCoords.length;
    textureCoords[i] = u;
    textureCoords[i + 1] = 0; // La coordonnée v reste constante car nous n'avons pas de déplacement vertical
}
sphereGeometry.setAttribute('uv2', new THREE.BufferAttribute(textureCoords, 2));

function deformSphere() {
    if (music.state === 'started') {
        const waveform = analyser.getValue();
        const vertices = sphere.geometry.attributes.position.array;
        const textureCoords = sphere.geometry.attributes.uv2.array;

        for (let i = 0; i < vertices.length; i += 3) {
                    const time = performance.now() * 0.001;
        const scale = 1 + waveform[i % waveform.length] * 0.02 * waveIntensity;
        const waveOffset = Math.sin(vertices[i] * 10.0 + time * 2.0) * 0.02 * waveIntensity;
        vertices[i] = originalPositions[i] * (scale + waveOffset);
        vertices[i + 1] = originalPositions[i + 1] * (scale + waveOffset);
        vertices[i + 2] = originalPositions[i + 2] * (scale + waveOffset);

        textureCoords[i / 3 * 2] = (vertices[i] - originalPositions[i]) * 0.1;
    }

    sphere.geometry.attributes.position.needsUpdate = true;
    sphere.geometry.attributes.uv2.needsUpdate = true;
}
}

function animate() {
    requestAnimationFrame(animate);
    updateShaders();
    deformSphere();
    sphere.rotation.x += 0.005;
    sphere.rotation.y += 0.005;
    controls.update();
    renderer.render(scene, camera);
}
animate();
