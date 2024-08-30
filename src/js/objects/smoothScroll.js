// File: src/modules/smoothScroll.js
import Lenis from '@studio-freight/lenis';

export function initSmoothScrolling(targetIndex, positions, sceneNum) {
  const lenis = new Lenis({
    smooth: true,
    smoothTouch: false,
  });
  
  let scrollDelta = 0;
  
  window.addEventListener('wheel', (e) => {
    scrollDelta += e.deltaY;
    if (scrollDelta >= 100) {
      targetIndex = Math.min(targetIndex + 1, positions[sceneNum].length - 1);
      scrollDelta = 0;
    } else if (scrollDelta < -100) {
      targetIndex = Math.max(targetIndex - 1, 0);
      scrollDelta = 0;
    }
  });
}