import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';

const device = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio
};

let sun;
let interpolated = false;
let scenes = [];
let scene1positions = [];
let scene1lookAt = [];
let scene2positions = [];
let scene2lookAt = [];
let scene3positions = [];
let scene3lookAt = [];
let scene4positions = [];
let scene4lookAt = [];
let scene5positions = [];
let scene5lookAt = [];

let currentIndex = 0;
let scrollDelta = 0;
let targetIndex = 0;

export default class Three {
  constructor(canvas) {
    this.canvas = canvas;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      device.width / device.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0.7, 3);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));

    this.GLTFLoader = new GLTFLoader();
    this.DRACOLoader = new DRACOLoader();
    sun = new THREE.Vector3();
    this.clock = new THREE.Clock();
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);

    this.setLights();
    this.setSky();
    this.setGeometry();
    this.render();
    this.setResize();
  }

  setLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);

    this.directional = new THREE.DirectionalLight(0xffffff, 3);
    this.directional.position.set(-3, 4, 0);
    this.scene.add(this.directional);
  }

  setGeometry() {
    this.DRACOLoader.setDecoderPath('src/vendor/three/draco/');
    this.GLTFLoader.setDRACOLoader(this.DRACOLoader);

    // Load your scenes and set up positions and lookAt arrays
    this.GLTFLoader.load("src/assets/Scenes/scene-1.glb", (data) => {
      this.scene1 = data.scene;
      this.rightDoor = this.scene1.children[13];
      this.leftDoor = this.scene1.children[14];
      const positions = this.scene1.children[18].geometry.attributes.position.array;
      const lookAt = this.scene1.children[19].geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        scene1positions.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
      }

      for (let i = 0; i < lookAt.length; i += 3) {
        scene1lookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
      }

      let position = this.interpolatePoints(scene1positions, 10);
      scene1positions = position;
      let lookAts = this.interpolatePoints(scene1lookAt, 10);
      scene1lookAt = lookAts;

      // scene1lookAt.updateProjectionMatrix = true;
      this.position1interpolated = true;

      this.positions = [scene1positions, scene2positions, scene3positions, scene4positions, scene5positions];
      this.lookAts = [scene1lookAt, scene2lookAt, scene3lookAt, scene4lookAt, scene5lookAt];

      this.scene.add(this.scene1);
      scenes.push(this.scene1);
    });

    this.GLTFLoader.load("src/assets/Scenes/scene-2.glb", (data) => {
      this.scene2 = data.scene;
      const positions = this.scene2.children[9].geometry.attributes.position.array;
      const lookAt = this.scene2.children[10].geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        scene2positions.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
      }

      for (let i = 0; i < lookAt.length; i += 3) {
        scene2lookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
      }

      let position = this.interpolatePoints(scene2positions, 10);
      scene2positions = position;
      let lookAts = this.interpolatePoints(scene2lookAt, 10);
      scene2lookAt = lookAts;

      this.positions = [scene1positions, scene2positions, scene3positions, scene4positions, scene5positions];
      this.lookAts = [scene1lookAt, scene2lookAt, scene3lookAt, scene4lookAt, scene5lookAt];

      this.scene.add(this.scene2);
      scenes.push(this.scene2);
      this.scene2.visible = false;
    });

    this.GLTFLoader.load("src/assets/Scenes/scene-3.glb", (data) => {
      this.scene3 = data.scene;
      this.scene3.children[1].visible = false;
      this.scene3.children[0].visible = false;
      this.scene3Water = this.scene3.children[0];
      this.scene3Water1 = this.scene3.children[1];

      const positions = this.scene3.children[6].geometry.attributes.position.array;
      const lookAt = this.scene3.children[5].geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        scene3positions.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
      }

      for (let i = 0; i < lookAt.length; i += 3) {
        scene3lookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
      }

      let position = this.interpolatePoints(scene3positions, 10);
      scene3positions = position;
      let lookAts = this.interpolatePoints(scene3lookAt, 10);
      scene3lookAt = lookAts;

      this.positions = [scene1positions, scene2positions, scene3positions, scene4positions, scene5positions];
      this.lookAts = [scene1lookAt, scene2lookAt, scene3lookAt, scene4lookAt, scene5lookAt];

      this.scene.add(this.scene3);
      scenes.push(this.scene3);
      this.scene3.position.set(-1.8, -1, 1.6);
      this.scene3.visible = false;
    });

    this.GLTFLoader.load("src/assets/Scenes/scene-4.glb", (data) => {
      this.scene4 = data.scene;
      const positions = this.scene4.children[20].geometry.attributes.position.array;
      const lookAt = this.scene4.children[21].geometry.attributes.position.array;
      this.scene4Water = this.scene4.children[18];
      this.scene4Water1 = this.scene4.children[19];
      for (let i = 0; i < positions.length; i += 3) {
        scene4positions.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
      }

      for (let i = 0; i < lookAt.length; i += 3) {
        scene4lookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
      }

      let position = this.interpolatePoints(scene4positions, 10);
      scene4positions = position;
      let lookAts = this.interpolatePoints(scene4lookAt, 10);
      scene4lookAt = lookAts;

      this.scene.add(this.scene4);
      scenes.push(this.scene4);
      this.scene4.position.set(0, -0.2, 0);
      this.scene4.visible = false;
    });

    this.GLTFLoader.load("src/assets/Scenes/scene-5.glb", (data) => {
      this.scene5 = data.scene;
      console.log("Scene 5:", this.scene5);
      const positions = this.scene5.children[23].geometry.attributes.position.array;
      const lookAt = this.scene5.children[24].geometry.attributes.position.array;
      this.scene5Water = this.scene5.children[7];
      for (let i = 0; i < positions.length; i += 3) {
        scene5positions.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
      }

      for (let i = 0; i < lookAt.length; i += 3) {
        scene5lookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
      }

      let position = this.interpolatePoints(scene5positions, 10);
      scene5positions = position;
      let lookAts = this.interpolatePoints(scene5lookAt, 10);
      scene5lookAt = lookAts;

      this.positions = [scene1positions, scene2positions, scene3positions, scene4positions, scene5positions];
      this.lookAts = [scene1lookAt, scene2lookAt, scene3lookAt, scene4lookAt, scene5lookAt];

      this.scene.add(this.scene5);
      scenes.push(this.scene5);
      this.scene5.position.set(0.6, -10, 0.7);
      this.scene5.visible = false;
    });

    this.initSmoothScrolling();
  }

  interpolatePoints(points, numInterpolations) {
    const interpolatedPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      const startPoint = points[i];
      const endPoint = points[i + 1];
      for (let j = 0; j <= numInterpolations; j++) {
        const t = j / numInterpolations;
        const interpolatedPoint = new THREE.Vector3(
          startPoint.x * (1 - t) + endPoint.x * t,
          startPoint.y * (1 - t) + endPoint.y * t,
          startPoint.z * (1 - t) + endPoint.z * t
        );
        interpolatedPoints.push(interpolatedPoint);
      }
    }
    interpolated = true;

    return interpolatedPoints;
  }

  initSmoothScrolling() {
    // Smooth scroll with Lenis
    const lenis = new Lenis({
      smooth: true,
      smoothTouch: false,
    });
    window.addEventListener('wheel', (e) => {
      scrollDelta += e.deltaY;
      if (scrollDelta >= 100) {
        targetIndex = Math.min(targetIndex + 1, this.positions[0].length - 1);
        scrollDelta = 0;
      } else if (scrollDelta < -100) {
        targetIndex = Math.max(targetIndex - 1, 0);
        scrollDelta = 0;
      }
    });
  }


  animateCamera() {
    if (!this.position1interpolated) return;

    if (currentIndex !== targetIndex) {
      const targetPosition = this.positions[0][targetIndex];
      const targetLookAt = this.lookAts[0][targetIndex];

      console.log('Animating camera', targetPosition, targetLookAt);
      console.log('Current index:', currentIndex);

      gsap.to(this.camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
        }
      });

      gsap.to(this.camera.lookAt, {
        x: targetLookAt.x,
        y: targetLookAt.y,
        z: targetLookAt.z,
        duration: 1.5,
        ease: 'power2.out',
      });

      currentIndex = targetIndex;
    }
  }

  setSky() {
    this.sky = new Sky();
    this.sky.scale.setScalar(450000);
    this.scene.add(this.sky);

    const skyUniforms = this.sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 0.5;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    const sun = new THREE.Vector3();
    const phi = THREE.MathUtils.degToRad(90);
    const theta = THREE.MathUtils.degToRad(90);
    sun.setFromSphericalCoords(100000, phi, theta);
    skyUniforms['sunPosition'].value.copy(sun);
  }

  render() {
    // if (scene1positions.length > 21) {
    this.animateCamera();
    // }
    const elapsedTime = this.clock.getElapsedTime();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  setResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    device.width = window.innerWidth;
    device.height = window.innerHeight;
    this.camera.aspect = device.width / device.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
  }
}
