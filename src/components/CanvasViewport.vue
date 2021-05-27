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
const Springy = require('@/springy.js')

export default {
  props: {
    topics: Object,
    topicsLength: Number
  },
  data () {
    return {
      height: 0,
      allTopics: null,
      graph: null,
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
      'getPressedTopicId',
      'getTopicById'
    ]),
    ...mapState(['topicsMounted']),
  },
  watch: {
    topicsMounted(){
      this.allTopics = this.getAllTopics;
      //this.updateSceneObjects();
      if(this.graph === null)
        this.initGraph();
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
    document.addEventListener('keypress', this.onKeyPress);

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
      'deselectAllTopics',
      'setGraph',
      'setGraphLayout',
      'setMenuOption',
      'saveTopicsToLocalStorage',
      "setRemoveConnectionId"
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
      this.controls.zoomSpeed = 0.2;
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
        //console.log(topic.object)
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
        // optimization: calculate frame time and pass to TWEEN
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
      if(e.key === "Alt") {
        this.recalculateGraph();
      }
      if(e.key === "ö" || e.key === "Ö") {
        this.saveTopicsToLocalStorage();
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
      //this.createNewTopic(e);
      this.handleMenu(e);
      this.setRemoveConnectionId(null)
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

      let angle = Math.atan(-deltaY/deltaX);
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
      //console.log("mousedata result: ", speed, angle*(180/Math.PI));
      //console.log("mousedata result: ", "deltaX:",deltaX, "deltaY:",-deltaY, angle*(180/Math.PI));
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
      if(e.button === 1) // middle mb
      {
        //this.$emit('createNewTopic', {x: this.mouseData.xThree, y: this.mouseData.yThree});
        this.createNewTopic({x: this.mouseData.xThree, y: this.mouseData.yThree});
        this.setCreateTopicOpacity(false);
      }
    },
    handleMenu(e){
      if(e.button === 1){
        this.setCreateTopicOpacity(false);
        this.setMenuOption({
          right: {title: "create topic", id: "createTopic"}, 
          //left: {title: "gather topics", id: "gatherTopics"}
        });
      }
    },
    initGraph(){
      let nodes = [];
      let edges = [];
      this.getAllTopics.forEach(topic => {
        nodes.push(""+topic.id);
        topic.connections.forEach(connection => {
          edges.push([""+topic.id, ""+connection.id, connection.k]);
        });
      });
      let graphData = {
        "nodes": nodes,
        "edges": edges
      };

      this.graph = new Springy.Graph();
      this.graph.loadJSON(graphData);

      this.graphLayout = new Springy.Layout.ForceDirected(
        this.graph,
        120.0, // Spring stiffness
        50.0, // Node repulsion
        0.6, // Damping
        0.0, // minEnergyThreshold
        10 // maxSpeed
      );

      let x, y;
      let coordFactor = 50;
      this.setGraph(this.graph);
      this.setGraphLayout(this.graphLayout);
      this.graphRenderer = new Springy.Renderer(
        this.graphLayout,
        function clear() {
          // code to clear screen
        },
        function drawEdge(/*edge, p1, p2*/) {
          //console.log("edge data: ", edge, p1, p2);

        },
        (node, point) => { // drawNode
          //console.log("node data: ", node, p);
          x = point.p.x*coordFactor;
          y = point.p.y*coordFactor;
          this.updateTopicById({
            id: node.id, 
            updateData: {
              pos: {
                x: x,
                y: y
              },
              graphNode: {node, point}
            }
          })
        }
      );
      this.graphRenderer.start();
    },
    recalculateGraph(){
      this.getAllTopics.forEach(topic => {
        topic.graphNode.point.p.x = topic.pos.x / 50;
        topic.graphNode.point.p.y = topic.pos.y / 50;
      })
      this.graphRenderer.start();
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
    width: 100px;
    height: 100px;
    padding: 10px;
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