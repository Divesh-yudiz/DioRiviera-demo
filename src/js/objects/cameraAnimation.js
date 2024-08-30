// File: src/modules/cameraAnimation.js
import gsap from 'gsap';

export function animateCamera(camera, positions, lookAts, currentIndex, targetIndex, sceneNum) {
  if (currentIndex !== targetIndex) {
    const targetPosition = positions[sceneNum][targetIndex];
    const targetLookAt = lookAts[sceneNum][targetIndex];

    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1.5,
      ease: 'power2.out',
    });

    if (targetLookAt) {
      gsap.to(camera.lookAt, {
        x: targetLookAt.x,
        y: targetLookAt.y,
        z: targetLookAt.z,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          camera.lookAt(targetLookAt);
        }
      });
    }

    currentIndex = targetIndex;
  }
}