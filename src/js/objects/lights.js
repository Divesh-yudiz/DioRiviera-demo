import * as THREE from 'three';

export function setupLights(scene) {
  const ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1, 1));
  scene.add(ambientLight);

  const directional = new THREE.DirectionalLight(new THREE.Color(1, 1, 1, 1), 3);
  directional.position.set(-3, 4, 0);
  scene.add(directional);
}