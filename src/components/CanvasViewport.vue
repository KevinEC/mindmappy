<template>
  <div class="viewport">
  </div>
  
</template>

<script>
import {
    Scene,
    PerspectiveCamera,
    Color,
    FogExp2,
    // CylinderBufferGeometry,
    // MeshPhongMaterial,
    // Mesh,
    // DirectionalLight,
    // AmbientLight,
    MOUSE,
    // LineBasicMaterial,
    // Geometry,
    // Vector3,
    // Line
  } from "three"

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
export default {
  props: {
    topics: Object,
  },
  data () {
    return {
      height: 0,
      allTopics: null
    };
  },
  mounted () {
    this.allTopics = this.topics;
    this.init();
    this.animate();

    window.addEventListener("resize", () => {
      this.resize(this.$el.offsetWidth, this.$el.offsetHeight);
    }, this);

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  },
  watch: {
    topics() {
      this.allTopics = this.topics;
      this.updateSceneObjects();
    }
  },
  methods: {
    setSize(){
      this.width = this.$el.offsetWidth;
      this.height = this.$el.offsetHeight;
    },
    resize(width, height){
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.controls.handleResize();
      this.renderer.render(this.scene, this.camera);
    },
    initRenderer(){
      this.renderer = new CSS3DRenderer();
      this.renderer.setSize(this.width, this.height);
      this.$el.appendChild(this.renderer.domElement);
    },
    initCamera(){
      this.camera = new PerspectiveCamera(90, this.width / this.height, 1, 1000);
      this.camera.position.z = 100;
    },
    initControls(){
      this.controls = new TrackballControls(
        this.camera,
        this.renderer.domElement
      );
      this.controls.enabled = false;
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.panSpeed = 0.1;
      this.controls.noZoom = false;
      this.controls.noPan = false;
      this.controls.noRotate = true;
      this.controls.staticMoving = false;
      this.controls.dynamicDampingFactor = 0.05;
      this.controls.mouseButtons.LEFT = MOUSE.PAN;
      this.controls.mouseButtons.RIGHT = MOUSE.ROTATE;
    },
    initScene(){
      this.scene = new Scene();
      this.scene.background = new Color(0xcccccc);
      this.scene.fog = new FogExp2(0xcccccc, 0.002);
      this.pyramids = [];

      {
      // let geometry = new CylinderBufferGeometry(0, 10, 30, 4, 1);
      // let material = new MeshPhongMaterial({
      //   color: 0xffffff,
      //   flatShading: true
      // });
      
      // for (let i = 0; i < 500; i++) {
      //   let mesh = new Mesh(geometry, material);
      //   mesh.position.x = (Math.random() - 0.5) * 1000;
      //   mesh.position.y = (Math.random() - 0.5) * 1000;
      //   mesh.position.z = 0;
      //   mesh.updateMatrix();
      //   mesh.matrixAutoUpdate = false;
      //   this.pyramids.push(mesh);
      // }
      // this.scene.add(...this.pyramids);
      // // lights
      // let lightA = new DirectionalLight(0xffffff);
      // lightA.position.set(1, 1, 1);
      // this.scene.add(lightA);
      // let lightB = new DirectionalLight(0x002288);
      // lightB.position.set(-1, -1, -1);
      // this.scene.add(lightB);
      // let lightC = new AmbientLight(0x222222);
      // this.scene.add(lightC);
      }
    },
    init(){
      this.setSize();
      this.initRenderer();
      this.initCamera();
      this.initControls();
      this.initScene();
      this.renderer.render(this.scene, this.camera);
      this.controls.addEventListener("change", () => {
        this.renderer.render(this.scene, this.camera);
      });
    },
    updateSceneObjects(){
      console.log("updating scene objects. adding ", this.allTopics.length);
      this.allTopics.forEach((obj, i) => {
        //obj = new CSS3DObject(obj);
        obj.position.x = 0;
        obj.position.y = i*80;
        obj.position.z = 0;
        
        this.scene.add(obj);
      }, this);
      //this.renderer.render(this.scene, this.camera);
    },
    animate(){
      window.requestAnimationFrame(() => {
        this.animate();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      });
    },
    onKeyDown(e){
      if(e.key === "Control"){
        this.controls.enabled = true;
      }
    },
    onKeyUp(e){
      if(e.key === "Control"){
        this.controls.enabled = false;
      }
    }
  }
};
</script>

<style lang="scss">
  .viewport {
    height: 100%;
    width: 100%;
  }
</style>