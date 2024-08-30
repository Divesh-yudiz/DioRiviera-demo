// sceneLoader.js
import * as THREE from 'three';

export function loadScenes(GLTFLoader, scene, callback) {
  const scenes = [];
  const positions = [];
  const lookAts = [];
  let loadedCount = 0;
  const totalScenes = 5; 

  function onLoad(sceneIndex, data) {
    console.log(`Scene ${sceneIndex + 1} loaded`);
    const loadedScene = data.scene;
    console.log(loadedScene);
    
    scenes[sceneIndex] = loadedScene;

    // Extract positions and lookAt points
    const positionsArray = loadedScene.children.find(child => child.name === "camera-position").geometry.attributes.position.array;
    const lookAtArray = loadedScene.children.find(child => child.name === "camera-lookat").geometry.attributes.position.array;

    const scenePositions = [];
    const sceneLookAts = [];

    for (let i = 0; i < positionsArray.length; i += 3) {
      scenePositions.push(new THREE.Vector3(positionsArray[i], positionsArray[i + 1], positionsArray[i + 2]));
    }

    for (let i = 0; i < lookAtArray.length; i += 3) {
      sceneLookAts.push(new THREE.Vector3(lookAtArray[i], lookAtArray[i + 1], lookAtArray[i + 2]));
    }

    positions[sceneIndex] = interpolatePoints(scenePositions, 10);
    lookAts[sceneIndex] = interpolatePoints(sceneLookAts, 10);

    scene.add(loadedScene);
    if (sceneIndex > 0) {
      loadedScene.visible = false;
    }

    loadedCount++;
    if (loadedCount === totalScenes) {
      callback(scenes, positions, lookAts);
    }
  }

  function onProgress(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  }

  function onError(error) {
    console.error('An error happened', error);
  }

  // Load each scene
  for (let i = 0; i < totalScenes; i++) {
    GLTFLoader.load(
      `src/assets/Scenes/scene-${i + 1}.glb`,
      (gltf) => onLoad(i, gltf),
      onProgress,
      onError
    );
  }
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