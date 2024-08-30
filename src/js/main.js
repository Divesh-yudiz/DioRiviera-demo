import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";



import gsap from "gsap";

import Lenis from "@studio-freight/lenis/types";

import { loadScenes } from "./objects/sceneLoader";
import { setUpLights } from "./objects/lights";
import { setUpSky } from "./objects/sky";
import { animateCamera } from "./objects/cameraAnimation";
import { setupSmoothScrolling } from './objects/smoothScroll';



export default class Three {
    constructor(canvas) {
        this.canvas = canvas;
        this.setupScene();
        this.setUpRenderer();
        this.setUpLoaders();
        this.clock = new THREE.Clock();
        this.loadGeometry();
        setUpLights(this.scene)
        setUpSky(this.scene ,this.renderer)
        this.render();

    }
    setupScene = () => {
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
    setUpRenderer= () => {
        this.renderer = new THREE.WebGLRenderer({
            canvas : this.canvas,
            alpha : true,
            antialias : true,
            preserveDrawingBuffer : true
        });
        this.renderer.setSize(window.innerWidth , window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    setUpLoaders = () => {
        this.GLTFLoader = new GLTFLoader();
        this.DRACOLoader = new DRACOLoader();
        this.DRACOLoader.setDecoderPath('src/vender/three/draco/');
        this.GLTFLoader.setDRACOLoader(this.DRACOLoader);
    }
    loadGeometry = () => {
        loadScenes(this.GLTFLoader , this.scene , (scenes ,positions , lookAts ) =>{
            this.scenes = scenes;
            this.positions = positions;
            this.lookAts = lookAts;
            setupSmoothScrolling(this);
        });
    }


    render() {
        animateCamera(this);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
      }
}


