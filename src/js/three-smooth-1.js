import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';


import { setupSky } from './objects/sky';
import { setupLights } from './objects/lights';
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();




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


let sceneNum = 0;

let currentIndex = 0;
let scrollDelta = 0;
let targetIndex = 2;




export default class Three {
  constructor(canvas) {
    this.canvas = canvas;

    this.GLTFLoader = new GLTFLoader();
    this.DRACOLoader = new DRACOLoader();
    sun = new THREE.Vector3();
    this.clock = new THREE.Clock();


    this.cursor = {
      x: 0,
      y: 0
    }

    this.setUpScene();
    this.setUpRenderer();
    setupSky(this.scene);
    setupLights(this.scene);
    this.setGeometry();
    this.render();
    this.setResize();

    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);

    // Mouse move event
    window.addEventListener('mousemove', (event) => {
      this.cursor.x = event.clientX / window.innerWidth * 2 - 1
      this.cursor.y = - (event.clientY / window.innerHeight) * 2 + 1
    })

    document.getElementById('closePopupBtn').addEventListener('click', this.closePopup.bind(this));

    this.renderer.domElement.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObjects([this.scene1.children[0].children[11],
      this.scene1.children[0].children[12], this.scene2.children[0].children[16], this.scene3.children[0].children[9], this.scene4.children[0].children[15]]);

      if (intersects.length > 0) {
        this.openPopup(intersects[0].object);
      }
    });

    window.addEventListener('click', (event) => {
      const popup = document.getElementById('popup');
      if (popup.style.display === 'block') {
        // Close popup if click is outside popup
        if (!popup.contains(event.target) && !this.renderer.domElement.contains(event.target)) {
          this.closePopup();
        }
      }
    });

  }

  openPopup(object) {
    this.setTextOnPopup(object)
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
    popup.style.opacity = 0;
    popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
    popup.style.left = '50%';
    popup.style.top = '50%';

    gsap.to(popup, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out'
    });
  }
  setTextOnPopup(object) {
    switch (object.name) {
      case "Tigne_low":
        popupText.innerText = 'This is the text for the Tiger Object!';
        break;
      case "girafe_LOW":
        popupText.innerText = 'This is the text for the Girrafic object!';
        break;
      case "bag":
        popupText.innerText = 'This is the text for the bag object!';
        break;
      case "sandal":
        popupText.innerText = 'This is the text for the sandal object!';
        break;
      case "surf":
        popupText.innerText = 'This is the text for the surf object!';
      default:
        break;
    }
  }
  closePopup() {
    const popup = document.getElementById('popup');
    gsap.to(popup, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        popup.style.display = 'none';
      }
    });
  }

  //! new function

  setUpScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0.7, 3);
    this.scene.add(this.camera);
  }
  setUpRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  setResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  setGeometry() {

    this.DRACOLoader.setDecoderPath('src/vendor/three/draco/');
    this.GLTFLoader.setDRACOLoader(this.DRACOLoader);

    // Load your scenes and set up positions and lookAt arrays
    this.GLTFLoader.load("src/assets/Scenes/scene-1.glb", (data) => {
      this.scene1 = data.scene;
      this.scene1.visible = true;



      this.rightDoor = this.scene1.children[0].children[13];
      this.leftDoor = this.scene1.children[0].children[14];

      const positions = this.scene1.children[0].children[18].geometry.attributes.position.array;
      const lookAt = this.scene1.children[0].children[19].geometry.attributes.position.array;

      this.hidePositionAndLookAt(this.scene1.children[0].children[18], this.scene1.children[0].children[19]);
      this.drawPositionAndLookAt(positions, lookAt, scene1positions, scene1lookAt)

      let position = this.interpolatePoints(scene1positions, 10);
      scene1positions = position;
      let lookAts = this.interpolatePoints(scene1lookAt, 10);
      scene1lookAt = lookAts;

      this.position1interpolated = true;

      this.positions = [scene1positions, scene2positions, scene3positions, scene4positions, scene5positions];
      this.lookAts = [scene1lookAt, scene2lookAt, scene3lookAt, scene4lookAt, scene5lookAt];

      this.scene.add(this.scene1);
      scenes.push(this.scene1);
    });

    this.GLTFLoader.load("src/assets/Scenes/scene-2.glb", (data) => {
      this.scene2 = data.scene;
      console.log("scene2", this.scene2);

      this.scene2.visible = false;

      const positions = this.scene2.children[0].children[9].geometry.attributes.position.array;
      const lookAt = this.scene2.children[0].children[10].geometry.attributes.position.array;

      this.hidePositionAndLookAt(this.scene2.children[0].children[9], this.scene2.children[0].children[10]);

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

    });

    this.GLTFLoader.load("src/assets/Scenes/scene-3.glb", (data) => {
      this.scene3 = data.scene;
      this.scene3.visible = false;
      console.log('%c Scene3', 'color: #f200e2', this.scene3);

      this.scene3Water = this.scene3.children[0].children[0];
      this.scene3Water1 = this.scene3.children[0].children[1];

      const positions = this.scene3.children[0].children[6].geometry.attributes.position.array;
      const lookAt = this.scene3.children[0].children[5].geometry.attributes.position.array;


      this.hidePositionAndLookAt(this.scene3.children[0].children[6], this.scene3.children[0].children[5]);

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

    });

    this.GLTFLoader.load("src/assets/Scenes/scene-4.glb", (data) => {
      this.scene4 = data.scene;
      console.log("scene4", this.scene4);

      this.scene4.visible = false;

      const positions = this.scene4.children[0].children[19].geometry.attributes.position.array;
      const lookAt = this.scene4.children[0].children[20].geometry.attributes.position.array;

      this.hidePositionAndLookAt(this.scene4.children[0].children[19], this.scene4.children[0].children[20]);

      this.scene4Water = this.scene4.children[0].children[17];
      this.scene4Water1 = this.scene4.children[0].children[18];


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

      this.positions = [scene1positions, scene2positions, scene3positions, scene4positions, scene5positions];
      this.lookAts = [scene1lookAt, scene2lookAt, scene3lookAt, scene4lookAt, scene5lookAt];

      this.scene.add(this.scene4);
      scenes.push(this.scene4);
      this.scene4.position.set(0, -0.2, 0);
    });

    this.GLTFLoader.load("src/assets/Scenes/scene-5.glb", (data) => {
      this.scene5 = data.scene;
      this.scene5.visible = false;
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
  openDoors() {
    gsap.to(this.leftDoor.rotation, { y: THREE.MathUtils.degToRad(70), duration: 1 });
    gsap.to(this.rightDoor.rotation, {
      y: THREE.MathUtils.degToRad(-70), duration: 1, onComplete: () => {
        this.switchScene(1);
      }
    });
  }
  closeDoors() {
    gsap.to(this.leftDoor.rotation, { y: THREE.MathUtils.degToRad(0), duration: 1 });
    gsap.to(this.rightDoor.rotation, { y: THREE.MathUtils.degToRad(0), duration: 1 });
  }
  initSmoothScrolling() {
    const lenis = new Lenis({
      smooth: true,
      smoothTouch: false,
    });
    window.addEventListener('wheel', (e) => {
      scrollDelta += e.deltaY;
      if (scrollDelta >= 100) {
        targetIndex = Math.min(targetIndex + 1, this.positions[sceneNum].length - 1);
        scrollDelta = 0;
      } else if (scrollDelta < -100) {
        targetIndex = Math.max(targetIndex - 1, 0);
        scrollDelta = 0;
      }
    });
  }
  hidePositionAndLookAt = (CamPosition, CamLookAt) => {
    CamPosition.visible = false;
    CamLookAt.visible = false;
  }
  drawPositionAndLookAt(positions, lookAt, scenePosition, sceneLookAt) {
    for (let i = 0; i < positions.length; i += 3) {
      scenePosition.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
    }
    for (let i = 0; i < lookAt.length; i += 3) {
      sceneLookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
    }
  }
  animateCamera() {
    if (!this.position1interpolated) return;

    if (currentIndex !== targetIndex) {
      const targetPosition = this.positions[sceneNum][targetIndex];
      const targetLookAt = this.lookAts[sceneNum][targetIndex];

      gsap.to(this.camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
          this.checkSceneSwitch();
        }
      });
      if (targetLookAt) {
        gsap.to(this.camera.userData, {
          lookAtX: targetLookAt.x,
          lookAtY: targetLookAt.y,
          lookAtZ: targetLookAt.z,
          duration: 1.5,
          ease: 'power2.out'
        })
      }

    }
  }
  checkSceneSwitch() {
    const camPos = this.camera.position;
    if (camPos.x === 0.036001 && camPos.y === 0.125627 && camPos.z === -4.169852 && sceneNum === 0) {
      this.openDoors();
    } else if (camPos.x === -2.887793 && camPos.y === 0.02631 && camPos.z === 0.960087 && sceneNum === 1) {
      this.switchScene(2);
    } else if (camPos.x === -1.004758 && camPos.y === -1.134391 && camPos.z === -5.235442 && sceneNum === 2) {
      this.switchScene(3);
    }

  }
  switchScene(newSceneIndex) {
    console.log('Switching to scene:', newSceneIndex);
    if (newSceneIndex === 1) {
      this.scene1.visible = false;
      this.scene2.visible = true;
      sceneNum = 1;
      targetIndex = 4;
    } else if (newSceneIndex === 2) {
      this.scene2.visible = false;
      this.scene3.visible = true;
      targetIndex = 4;
      sceneNum = 2;
    } else if (newSceneIndex === 3) {
      this.scene3.visible = false;
      this.scene4.visible = true;
      targetIndex = 5;
      sceneNum = 3;
    } else if (newSceneIndex === 4) {
      this.scene4.visible = false;
      this.scene5.visible = true;
      targetIndex = 0;
      sceneNum = 4;
    }
  }
  render() {
    this.animateCamera();
    const elapsedTime = this.clock.getElapsedTime();

    if (this.cursor) {
      this.camera.position.x += (this.cursor.x * 0.5 - this.camera.position.x) * 0.002 * elapsedTime
      this.camera.position.y += (- this.cursor.y * 0.5 - this.camera.position.y) * 0.002 * elapsedTime
    }

    const lookAtTarget = new THREE.Vector3(
      this.camera.userData.lookAtX,
      this.camera.userData.lookAtY,
      this.camera.userData.lookAtZ
    );
    this.camera.lookAt(lookAtTarget);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

}
