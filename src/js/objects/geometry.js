// File: src/modules/geometry.js
import * as THREE from 'three';
import gsap from 'gsap';

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

export function setupGeometry(GLTFLoader, DRACOLoader, scene, camera) {
  DRACOLoader.setDecoderPath('src/vendor/three/draco/');
  GLTFLoader.setDRACOLoader(DRACOLoader);

  loadScene1(GLTFLoader, scene, camera);
  loadScene2(GLTFLoader, scene);
  loadScene3(GLTFLoader, scene);
  loadScene4(GLTFLoader, scene);
  loadScene5(GLTFLoader, scene);
}

function loadScene1(GLTFLoader, scene, camera) {
  GLTFLoader.load("src/assets/Scenes/scene-1.glb", (data) => {
    const scene1 = data.scene;
    console.log(scene1.children);

    const rightDoor = scene1.children[13];
    const leftDoor = scene1.children[14];
    const positions = scene1.children[18].geometry.attributes.position.array;
    const lookAt = scene1.children[19].geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      scene1positions.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
    }

    for (let i = 0; i < lookAt.length; i += 3) {
      scene1lookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
    }

    scene1positions = interpolatePoints(scene1positions, 10);
    scene1lookAt = interpolatePoints(scene1lookAt, 10);

    scene.add(scene1);
    scenes.push(scene1);

    setupDoorInteraction(rightDoor, leftDoor, camera);
  });
}

function loadScene2(GLTFLoader, scene) {
  GLTFLoader.load("src/assets/Scenes/scene-2.glb", (data) => {
    const scene2 = data.scene;
    const positions = scene2.children[9].geometry.attributes.position.array;
    const lookAt = scene2.children[10].geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      scene2positions.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
    }

    for (let i = 0; i < lookAt.length; i += 3) {
      scene2lookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
    }

    scene2positions = interpolatePoints(scene2positions, 10);
    scene2lookAt = interpolatePoints(scene2lookAt, 10);

    scene.add(scene2);
    scenes.push(scene2);
    scene2.visible = false;
  });
}

function loadScene3(GLTFLoader, scene) {
  GLTFLoader.load("src/assets/Scenes/scene-3.glb", (data) => {
    const scene3 = data.scene;
    scene3.children[1].visible = false;
    scene3.children[0].visible = false;
    const scene3Water = scene3.children[0];
    const scene3Water1 = scene3.children[1];

    const positions = scene3.children[6].geometry.attributes.position.array;
    const lookAt = scene3.children[5].geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      scene3positions.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
    }

    for (let i = 0; i < lookAt.length; i += 3) {
      scene3lookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
    }

    scene3positions = interpolatePoints(scene3positions, 10);
    scene3lookAt = interpolatePoints(scene3lookAt, 10);

    scene.add(scene3);
    scenes.push(scene3);
    scene3.position.set(-1.8, -1, 1.6);
    scene3.visible = false;
  });
}

function loadScene4(GLTFLoader, scene) {
  GLTFLoader.load("src/assets/Scenes/scene-4.glb", (data) => {
    const scene4 = data.scene;
    const positions = scene4.children[20].geometry.attributes.position.array;
    const lookAt = scene4.children[21].geometry.attributes.position.array;
    const scene4Water = scene4.children[18];
    const scene4Water1 = scene4.children[19];
    
    for (let i = 0; i < positions.length; i += 3) {
      scene4positions.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
    }

    for (let i = 0; i < lookAt.length; i += 3) {
      scene4lookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
    }

    scene4positions = interpolatePoints(scene4positions, 10);
    scene4lookAt = interpolatePoints(scene4lookAt, 10);

    scene.add(scene4);
    scenes.push(scene4);
    scene4.position.set(0, -0.2, 0);
    scene4.visible = false;
  });
}

function loadScene5(GLTFLoader, scene) {
  GLTFLoader.load("src/assets/Scenes/scene-5.glb", (data) => {
    const scene5 = data.scene;
    console.log("Scene 5:", scene5);
    const positions = scene5.children[23].geometry.attributes.position.array;
    const lookAt = scene5.children[24].geometry.attributes.position.array;
    const scene5Water = scene5.children[7];
    
    for (let i = 0; i < positions.length; i += 3) {
      scene5positions.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
    }

    for (let i = 0; i < lookAt.length; i += 3) {
      scene5lookAt.push(new THREE.Vector3(lookAt[i], lookAt[i + 1], lookAt[i + 2]));
    }

    scene5positions = interpolatePoints(scene5positions, 10);
    scene5lookAt = interpolatePoints(scene5lookAt, 10);

    scene.add(scene5);
    scenes.push(scene5);
    scene5.position.set(0.6, -10, 0.7);
    scene5.visible = false;
  });
}

function interpolatePoints(points, numInterpolations) {
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
  return interpolatedPoints;
}

function setupDoorInteraction(rightDoor, leftDoor, camera) {
  let doorOpen = false;

  window.addEventListener('keydown', (event) => {
    if (event.key === 'e' || event.key === 'E') {
      if (!doorOpen) {
        openDoors(rightDoor, leftDoor);
      } else {
        closeDoors(rightDoor, leftDoor);
      }
      doorOpen = !doorOpen;
    }
  });
}

function openDoors(leftDoor, rightDoor) {
  console.log("Doors opening...");
  gsap.to(leftDoor.rotation, { y: THREE.MathUtils.degToRad(70), duration: 1 });
  gsap.to(rightDoor.rotation, { y: THREE.MathUtils.degToRad(-70), duration: 1, onComplete: () => {
    sceneNum = 1;
    scenes[0].visible = false;
    scenes[1].visible = true;
  }});
}

function closeDoors(leftDoor, rightDoor) {
  console.log("Doors closing...");
  gsap.to(leftDoor.rotation, { y: THREE.MathUtils.degToRad(0), duration: 1 });
  gsap.to(rightDoor.rotation, { y: THREE.MathUtils.degToRad(0), duration: 1 });
}

export { scene1positions, scene1lookAt, scene2positions, scene2lookAt, scene3positions, scene3lookAt, scene4positions, scene4lookAt, scene5positions, scene5lookAt, sceneNum };