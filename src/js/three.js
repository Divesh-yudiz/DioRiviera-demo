import * as THREE from 'three';
// eslint-disable-next-line import/no-unresolved
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Sky } from 'three/addons/objects/Sky.js';
import fragment from '../shaders/fragment.glsl';
import vertex from '../shaders/vertex.glsl';
import gsap from 'gsap';
import * as dat from 'dat.gui'; // Make sure you have installed dat.gui properly
import { Water } from 'three/addons/objects/Water.js';


const device = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio
};

let sun;
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
    this.ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1, 1));
    this.scene.add(this.ambientLight);

    this.directional = new THREE.DirectionalLight(new THREE.Color(1, 1, 1, 1), 3);
    this.directional.position.set(-3, 4, 0);
    this.scene.add(this.directional);
  }

  setGeometry() {
    this.DRACOLoader.setDecoderPath('../scene/vendor/three/draco/');
    this.GLTFLoader.setDRACOLoader(this.DRACOLoader);

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
      this.scene.add(this.scene1);
      scenes.push(this.scene1);
    });

    this.GLTFLoader.load("src/assets/Scenes/scene-2.glb", (data) => {
      this.scene2 = data.scene;
      this.scene2Water = this.scene2.children[11];
      this.addWaterEffect(this.scene2Water)

      const positions = this.scene2.children[9].geometry.attributes.position.array;
      const lookAt = this.scene2.children[10].geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        scene2positions.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
      }

      for (let i = 0; i < lookAt.length; i += 3) {
        scene2lookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
      }
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
      this.scene.add(this.scene3);
      scenes.push(this.scene3);
      this.setupGUI();
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
      this.scene.add(this.scene4);
      scenes.push(this.scene4);
      // this.setupGUI();
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
      this.scene.add(this.scene5);
      scenes.push(this.scene5);
      this.scene5.position.set(0.6, -10, 0.7);
      // this.setupGUI();
      this.scene5.visible = false;
    });
    console.log("Scenes:", scene5positions);
    this.updateCameraOnScroll();
  }

  addWaterEffect(mesh) {
    if (!mesh) {
      console.error("No mesh provided for water effect");
      return;
    }

    const waterGeometry = mesh.geometry;
    const waterNormals = new THREE.TextureLoader().load(
      'src/assets/Scenes/waternormals.jpg',
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    );

    this.water = new Water(waterGeometry, {
      textureWidth: 1080,
      textureHeight: 1080,
      waterNormals: waterNormals,
      sunDirection: new THREE.Vector3(1, 1, 1).normalize(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
    });

    this.water.rotation.x = -Math.PI / 2;
    this.scene.add(this.water);
  }



  updateCameraOnScroll() {
    let currentIndex = 0;
    let targetIndex = 1;
    let progress = 0;
    let currentSceneIndex = 0;
    let startpos = new THREE.Vector3(0, 0, 0);
    let speed;

    let scrollingEnabled = true;
    const cameraMoveDistance = 2;

    const positions = [scene1positions, scene2positions, scene3positions, scene4positions, scene5positions];
    const lookAts = [scene1lookAt, scene2lookAt, scene3lookAt, scene4lookAt, scene5lookAt];
    const onScroll = (event) => {
      if (!scrollingEnabled) return;

      if (currentSceneIndex === 0) {
        speed = 0.01;
      } else if (currentSceneIndex === 1) {
        speed = 0.07;
        startpos = new THREE.Vector3(1.5568268299102783, 0.20623579621315002, -0.6336781978607178);
      } else if (currentSceneIndex === 2) {
        speed = 0.07;
        startpos = new THREE.Vector3(-0.5011218190193176, -0.24788649380207062, -0.6962001323699951);
      } else if (currentSceneIndex === 3) {
        speed = 0.05;
        startpos = new THREE.Vector3(-0.3586733043193817, -0.19992031157016754, 1.4225597381591797);
      } else if (currentSceneIndex === 4) {
        speed = 0.05;
        startpos = new THREE.Vector3(-0.5087680816650391, -3.6694130897521973, 0.5520180463790894);
      }

      if (event.deltaY > 0 && currentIndex < positions[currentSceneIndex].length - 1) {
        progress += speed;
        if (progress >= 1) {
          progress = 0;
          currentIndex++;
          targetIndex = currentIndex + 1;
        }
      } else if (event.deltaY < 0 && currentIndex > 0) {
        progress -= speed;
        if (progress <= 0) {
          progress = 1;
          currentIndex--;
          targetIndex = currentIndex + 1;
        }
      }

      targetIndex = Math.min(targetIndex, positions[currentSceneIndex].length - 1);
      this.camera.position.lerpVectors(positions[currentSceneIndex][currentIndex], positions[currentSceneIndex][targetIndex], progress);
      if (lookAts[currentSceneIndex][targetIndex]) {
        // console.log("looking at target...");
        const lookAtTarget = new THREE.Vector3().lerpVectors(lookAts[currentSceneIndex][currentIndex], lookAts[currentSceneIndex][targetIndex], progress);
        this.camera.lookAt(lookAtTarget);
      }

      // console.log("looking at scenes...", currentSceneIndex < scenes.length - 1);
      if (currentIndex >= positions[currentSceneIndex].length - 1 && currentSceneIndex < scenes.length - 1) {

        scenes[currentSceneIndex].visible = false;
        console.log("camera position:", this.camera.position);
        this.openDoors();
        scrollingEnabled = false;
        gsap.to(this.camera.position, {
          z: startpos,
          duration: 1,
          delay: 1,
          onComplete: () => {
            // Optional: Re-enable scrolling or trigger any other event
            scrollingEnabled = true;
            if (currentSceneIndex === 0) {
              this.scene1.visible = false;
              this.scene2.visible = true;
            } else if (currentSceneIndex === 1) {
              this.scene2.visible = false;
              this.scene3.visible = true;
              // set orbit controls for scene
            } else if (currentSceneIndex === 2) {
              this.scene3.visible = false;
              this.scene4.visible = true;
            } else if (currentSceneIndex === 3) {
              // set orbit controls for scene
              const controls = new OrbitControls(this.camera, this.renderer.domElement);
              this.scene4.visible = false;
              this.scene5.visible = true;
            }
            // scenes[currentSceneIndex].visible = true;
            currentSceneIndex++;
            // console.log("after Switching scene...", currentSceneIndex);
            // console.log("Current Scene Index:", currentSceneIndex);
            currentIndex = 0;
            targetIndex = 1;
            progress = 0;
          }
        });
        // console.log("before Switching scene...", currentSceneIndex);

      }

      // console.log("Progress:", progress);
      // console.log("Current Index:", currentIndex);
      // console.log("Current Scene Index:", currentSceneIndex);
    };

    document.addEventListener('wheel', onScroll);

    this.camera.updateMatrixWorld();
  }

  openDoors() {
    console.log("Doors opening...");
    gsap.to(this.leftDoor.rotation, { y: THREE.MathUtils.degToRad(70), duration: 1 });
    gsap.to(this.rightDoor.rotation, { y: THREE.MathUtils.degToRad(-70), duration: 1 });
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

  setupGUI() {
    const gui = new dat.GUI(); // Ensure 'dat' is used for the GUI instance

    // Check if scene3 is loaded before setting up GUI
    if (this.scene5) {
      const scene3Folder = gui.addFolder('Scene5');

      // Add position controls
      scene3Folder.add(this.scene5.position, 'x', -5.0, 5.0).name('Position X').step(0.1);
      scene3Folder.add(this.scene5.position, 'y', -5.0, 5.0).name('Position Y').step(0.1);
      scene3Folder.add(this.scene5.position, 'z', -5.0, 5.0).name('Position Z').step(0.1);

      // Add rotation controls
      scene3Folder.add(this.scene5.rotation, 'x', -Math.PI, Math.PI).name('Rotation X');
      scene3Folder.add(this.scene5.rotation, 'y', -Math.PI, Math.PI).name('Rotation Y');
      scene3Folder.add(this.scene5.rotation, 'z', -Math.PI, Math.PI).name('Rotation Z');

      scene3Folder.open();
    }
  }
}