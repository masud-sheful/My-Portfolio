
import * as THREE from 'three';

// ===============================
// 1. LOADING ANIMATION
// ===============================

const loader = document.getElementById("loader");
const progress = document.getElementById("loaderProgress");

let loadValue = 0;

const loading = setInterval(() => {
    loadValue += Math.random() * 12 + 5;

    if (loadValue >= 100) {
        loadValue = 100;
        clearInterval(loading);

        setTimeout(() => {
            loader.classList.add("hide");
            document.querySelectorAll(".hero .hero-content")
                .forEach(el => el.classList.add("active"));
        }, 400);
    }

    progress.style.width = loadValue + "%";

}, 100);


// ===============================
// 2. MOBILE NAVIGATION
// ===============================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});


// ===============================
// 3. SCROLL REVEAL
// ===============================

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
});


// ===============================
// 4. THREE.JS 3D SCENE
// ===============================

const canvas = document.getElementById("webgl");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    1,
    0.1,
    100
);

camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.8)
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

// Resize scene
function resizeScene() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
}

resizeScene();

window.addEventListener("resize", resizeScene);


// ===============================
// 5. LIGHTING
// ===============================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(ambientLight);

const mainLight = new THREE.PointLight(
    0xffffff,
    80,
    30
);

mainLight.position.set(3, 4, 5);
scene.add(mainLight);

const sideLight = new THREE.PointLight(
    0x888888,
    45,
    30
);

sideLight.position.set(-4, -2, 3);
scene.add(sideLight);


// ===============================
// 6. MAIN 3D SPHERE
// ===============================

const sphereGroup = new THREE.Group();

scene.add(sphereGroup);

const sphereGeometry = new THREE.IcosahedronGeometry(
    1.65,
    5
);

const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x888888,
    metalness: 0.85,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    flatShading: false
});

const sphere = new THREE.Mesh(
    sphereGeometry,
    sphereMaterial
);

sphereGroup.add(sphere);


// ===============================
// 7. WIREFRAME LAYER
// ===============================

const wireGeometry = new THREE.IcosahedronGeometry(
    1.72,
    2
);

const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.13
});

const wireSphere = new THREE.Mesh(
    wireGeometry,
    wireMaterial
);

sphereGroup.add(wireSphere);


// ===============================
// 8. ROTATING ORBIT RINGS
// ===============================

const rings = [];

for (let i = 0; i < 3; i++) {

    const ringGeometry = new THREE.TorusGeometry(
        2.15 + i * 0.15,
        0.008,
        12,
        150
    );

    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35 - i * 0.08
    });

    const ring = new THREE.Mesh(
        ringGeometry,
        ringMaterial
    );

    ring.rotation.x = Math.PI / (2 + i);
    ring.rotation.y = i * 0.7;

    sphereGroup.add(ring);
    rings.push(ring);
}


// ===============================
// 9. FLOATING PARTICLES
// ===============================

const particleCount = 1800;

const particlePositions = new Float32Array(
    particleCount * 3
);

for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3;

    particlePositions[i3] = (Math.random() - 0.5) * 13;
    particlePositions[i3 + 1] = (Math.random() - 0.5) * 9;
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 7;
}

const particleGeometry = new THREE.BufferGeometry();

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
);

const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.018,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true
});

const particles = new THREE.Points(
    particleGeometry,
    particleMaterial
);

scene.add(particles);


// ===============================
// 10. MOUSE INTERACTION
// ===============================

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

window.addEventListener("mousemove", (event) => {

    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;

    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;

});

window.addEventListener("touchmove", (event) => {

    const touch = event.touches[0];

    mouseX = (touch.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (touch.clientY / window.innerHeight - 0.5) * 2;

}, { passive: true });


// ===============================
// 11. ANIMATION LOOP
// ===============================

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    targetX += (mouseX - targetX) * 0.035;
    targetY += (mouseY - targetY) * 0.035;

    // Sphere rotation
    sphere.rotation.y = elapsed * 0.15 + targetX * 0.3;
    sphere.rotation.x = Math.sin(elapsed * 0.3) * 0.2 + targetY * 0.2;

    // Main group movement
    sphereGroup.position.y = Math.sin(elapsed * 0.6) * 0.15;

    sphereGroup.rotation.y = targetX * 0.12;
    sphereGroup.rotation.x = -targetY * 0.1;

    // Orbit animation
    rings.forEach((ring, index) => {
        ring.rotation.z = elapsed * (0.08 + index * 0.04);
    });

    // Particles
    particles.rotation.y = elapsed * 0.015;
    particles.rotation.x = Math.sin(elapsed * 0.15) * 0.04;

    renderer.render(scene, camera);
}

animate();


// ===============================
// 12. PAUSE WHEN TAB IS HIDDEN
// ===============================

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        renderer.render(scene, camera);
    }
});
