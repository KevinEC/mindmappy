<template>
  <div class="viewport">
    <div id="createTopicGraphics"></div>
  </div>
</template>

<script>
import {
    Scene,
    PerspectiveCamera,
    Color,
    FogExp2,
    MOUSE,
  } from "three"

import { mapActions, mapGetters, mapState } from 'vuex'

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

//import { createNoisyEasing } from "../animate.js"
const TWEEN = require('@tweenjs/tween.js')

export default {
  props: {
    topics: Object,
    topicsLength: Number
  },
  data () {
    return {
      height: 0,
      allTopics: null,
      createTopicObject: null,
      mouseData: {
        prevSampleCounter: 9
      }
    };
  },
  computed: {
    ...mapGetters([
      'getCreatingTopic',
      'getAllTopicsLength',
      'getAllTopics',
      'getShiftKey',
      'getPressedTopicId'
    ]),
    ...mapState(['topicsMounted']),
  },
  watch: {
    topicsMounted(){
      this.allTopics = this.getAllTopics;
      this.updateSceneObjects();
    }
  },
  mounted() {
    this.allTopics = this.topics;
    this.init();
    this.animate();

    window.addEventListener("resize", () => {
      this.resize(this.$el.offsetWidth, this.$el.offsetHeight);
    }, this);

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    this.$el.addEventListener('mousemove', this.handleMouseMove);
		this.$el.addEventListener('mousedown', this.handleMouseDown);
		this.$el.addEventListener('mouseup', this.handleMouseUp);
  },
  methods: {
    ...mapActions([
      'updateCanvasMouseMove',
      'updateCanvasMousePressed',
      'setScene',
      'setCamera',
      'updateTopicById',
      'setShiftKey',
      'deselectAllTopics'
    ]),
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
      this.camera.position.z = 300;
      this.setCamera(this.camera);
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
      this.setScene(this.scene);
    },
    init(){
      this.setSize();
      this.initRenderer();
      this.initCamera();
      this.initControls();
      this.initScene();
      this.initCreateTopic();

      this.renderer.render(this.scene, this.camera);
      this.controls.addEventListener("change", () => {
        this.renderer.render(this.scene, this.camera);
      });
    },
    initCreateTopic(){
      this.createTopicObject = new CSS3DObject(this.$el.querySelector('#createTopicGraphics'));
      this.createTopicObject.position.x = 0;
      this.createTopicObject.position.y = 0;
      this.createTopicObject.position.z = 0;
      this.createTopicObject.width = this.createTopicObject.element.offsetWidth;
      this.createTopicObject.height = this.createTopicObject.element.offsetHeight;
      this.initCreatTopicIdleAnimation();

      this.scene.add(this.createTopicObject);
    },
    updateSceneObjects(){
      this.allTopics.forEach((topic) => {
        console.log(topic.object)
        topic.object.position.x = topic.pos.x;
        topic.object.position.y = topic.pos.y;
        topic.object.position.z = 0;
        
        this.scene.add(topic.object);
      }, this);
    },
    updateCreateTopicObject(x,y){
      this.createTopicObject.position.x = x + this.camera.position.x;
      this.createTopicObject.position.y = y + this.camera.position.y;
    
      if(this.collideWith(this.createTopicObject, this.allTopics) || this.getCreatingTopic)
        this.setCreateTopicOpacity(false);
      else 
        this.setCreateTopicOpacity(true);
    },
    animate(){
      window.requestAnimationFrame(() => {
        this.animate();
        TWEEN.update();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      });
    },
    collideWith(object, collection){
      let hit = false;
      collection.forEach((otherTopic) => {
        if(Math.abs(object.position.x - otherTopic.object.position.x) < object.width &&
           Math.abs(object.position.y - otherTopic.object.position.y) < object.height)
        { hit = true; }
      })
      return hit;
    },
    onKeyDown(e){
      if(e.key === "Control"){
        this.controls.enabled = true;
        this.setCreateTopicOpacity(false);
      }
      if(e.key === "Shift") {
        this.setShiftKey(true);
      }
    },
    onKeyUp(e){
      if(e.key === "Control"){
        this.controls.enabled = false;
        this.setCreateTopicOpacity(true);
      }
      if(e.key === "Shift") {
        this.setShiftKey(false);
      }
    },
    handleMouseMove(e){
      this.updateMouseData(e);
      this.updateCreateTopicObject(this.mouseData.xThree, this.mouseData.yThree);
		},
		handleMouseDown(e){
      this.pressed = true;
      this.updateCanvasMousePressed(true);
			this.pressedX = e.clientX; 
			this.pressedY = e.clientY;
      this.createNewTopic(e);
		},
		handleMouseUp(){
      this.pressed = false;
			this.updateCanvasMousePressed(false);
		},
    updateMouseData(e){
      let factor = this.$el.offsetHeight / (this.camera.position.z * 2.0);
      
      let mouseX = (e.clientX - (this.$el.offsetWidth / 2))/factor;
      let mouseY = (-e.clientY + (this.$el.offsetHeight / 2))/factor;

      this.mouseData.xThree = mouseX;
      this.mouseData.yThree = mouseY;

      if(this.mouseData.prevSampleCounter === 9) {
        this.mouseData.prevXClient = e.clientX;
        this.mouseData.prevYClient = e.clientY;
        this.mouseData.prevSampleCounter = 0;
      }
      this.mouseData.prevSampleCounter += 1;

      let deltaX = e.clientX - this.mouseData.prevXClient;
      let deltaY = e.clientY - this.mouseData.prevYClient;
      let speed = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
      this.mouseData.speed = speed;

      let angle = Math.atan(deltaY/deltaX);
      this.mouseData.angle = angle;
      
      if(this.pressed) {
        let deltaXPressed = (e.clientX - this.pressedX) / factor;
        let deltaYPressed = (-e.clientY + this.pressedY) / factor;
        this.mouseData.deltaX = deltaXPressed;
        this.mouseData.deltaY = deltaYPressed;
        this.mouseData.pressedX = this.pressedX;
        this.mouseData.pressedY = this.pressedY;
			}
      this.updateCanvasMouseMove(this.mouseData);
      //console.log("mousedata result: ", speed, angle);
    },
    setCreateTopicOpacity(visibility){
      if(visibility){
        this.createTopicObject.element.style.opacity = 1;
        this.createTopicObject.element.style.zIndex = 10;
      } else {
        this.createTopicObject.element.style.opacity = 0;
        this.createTopicObject.element.style.zIndex = -1;
      }
    },
    initCreatTopicIdleAnimation(){
      new TWEEN.Tween({scaleX: 0.98})
        .to({scaleX: 1.015}, 750)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .repeat(Infinity)
        .yoyo(true)
        .onUpdate((object) => {
          this.createTopicObject.scale.x = object.scaleX;
        })
        .start();

      new TWEEN.Tween({scaleY: 0.995})
        .to({scaleY: 1.01}, 750)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .repeat(Infinity)
        .yoyo(true)
        .delay(150)
        .onUpdate((object) => {
          this.createTopicObject.scale.y = object.scaleY;
        })
        .start();

      new TWEEN.Tween({rotation: -Math.PI/4})
        .to({rotation: Math.PI/4}, 4000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .repeat(Infinity)
        .onUpdate((object) => {
          
          this.createTopicObject.rotation.z = object.rotation;
        })
        //.start();
    },
    createNewTopic(e){
      if(e.button === 1) // right mb
      {
        this.$emit('createNewTopic', {x: this.mouseData.xThree, y: this.mouseData.yThree});
        this.setCreateTopicOpacity(false);
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
  $createColor: rgba(53, 238, 223);
  #createTopicGraphics{
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 100%;
    background: transparent;
    border: 1px solid rgba($createColor, 0.4);
    box-shadow: 0 0 10px rgba($createColor, 0.2),
                0 0 23px rgba($createColor, 0.1),
                0 0 43px rgba($createColor, 0.09);
    z-index: 10;
    transition: opacity 0.2s ease-out;
    opacity: 1;
  }
</style>