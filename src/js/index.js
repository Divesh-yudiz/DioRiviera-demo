import Three from './three-smooth';

document.addEventListener('DOMContentLoaded', () => { });

window.addEventListener('load', () => {
  const canvas = document.querySelector('#canvas');

  if (canvas) {
    new Three(document.querySelector('#canvas'));
  }
});
