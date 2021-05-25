<template>
  <div id="pieMenuRoot" oncontextmenu="event.preventDefault();">
    <div class="menu">
      <div class="center"></div>
      <div class="slices" :class="hoverComputed">
        <div class="slice up">
          <div v-if="upOption" class="title" >
            <span>{{ upOption }}</span>
          </div>
        </div>
        <div class="slice right">
          <div v-if="rightOption" class="title">
            <span>{{ rightOption }}</span>
          </div>
        </div>
        <div class="slice left">
          <div v-if="leftOption" class="title">
            <span>{{ leftOption }}</span>
          </div>
        </div>
        <div class="slice down">
          <div v-if="downOption" class="title">
            <span>{{ downOption }}</span>
          </div>
        </div>
      </div>
    </div>
		<!-- <svg :width="svgWidth" :height="svgHeight" id="menuSvg" xmlns="http://www.w3.org/2000/svg">
			<line x1="110" y1="110" id="menuLine" stroke="black" stroke-width="2" />
		</svg> -->
    <div class="cover"></div>
  </div>
</template>

<script>
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { mapGetters, mapState, mapActions } from "vuex";
const TWEEN = require('@tweenjs/tween.js')


export default {
  data() {
    return {
      object: null,
      id: "pie-menu",
			cancel: false,
      options: null,
			svgLine: null,
			svgWidth: 220,
			svgHeight: 220,
			leftElm: null,
			rightElm: null,
			upElm: null,
			downElm: null,
      hover: "",
      startPos: null,
      cameraAnimation: null,
    };
  },
  watch: {
    menuOptionsSignal() {
      this.options = {
        layeredMenu: false,
        containsLayeredOptions: false,
        ...this.getMenuOptions
      }
			this.object.position.x = this.getCanvasMouseMove.xThree + this.getCamera.position.x;
			this.object.position.y = this.getCanvasMouseMove.yThree + this.getCamera.position.y;
      this.startPos = {
        x: this.object.position.x,
        y: this.object.position.y,
      }
			this.object.visible = true;
      this.setMenuActive(true);
      // 
      if(!this.options.layeredMenu) //eslint-disable-line
        this.startCameraAnimation();
			//this.updateLine();
    },
		canvasMouseMovement(){
			if(this.object.visible){
				//this.updateLine();
        this.setHover();
			}
		}
  },
  mounted() {
    this.object = new CSS3DObject(this.$el);
    this.object.position.z = 1;
		this.object.visible = false;

		this.svgLine = this.$el.querySelector("#menuLine");

		this.leftElm = this.$el.querySelector(".left");
		this.rightElm = this.$el.querySelector(".right");
		this.upElm = this.$el.querySelector(".up");
		this.downElm = this.$el.querySelector(".down");

		this.$el.addEventListener('mouseup', this.handleMouseUp);
		this.$el.addEventListener('mousedown', this.handleMouseDown);

    window.setTimeout(() => {
      this.getScene.add(this.object);
    }, 200);
  },
  computed: {
    ...mapGetters([
      "getScene",
      "getCamera",
      "getGraph",
      "getMenuOptions",
      "getCanvasMouseMove",
    ]),
    ...mapState([
			"menuOptionsSignal",
			"canvasMouseMovement"
		]),
    upOption() {
      if (this.options && this.options.up) return this.options.up.title;
      return "";
    },
    rightOption() {
      if (this.options && this.options.right) return this.options.right.title;
      return "";
    },
    leftOption() {
      if (this.options && this.options.left) return this.options.left.title;
      return "";
    },
    downOption() {
      if (this.options && this.options.down) return this.options.down.title;
      return "";
    },
    hoverComputed(){
      return this.hover;
    }
  },
  methods: {
    ...mapActions([
      "createNewNode",
      "removeNode",
      "setMenuOption",
      "setMenuActive"
    ]),
    upAction() {
      this[this.options.up.id](this.options.up.payload);
			this.object.visible = false;
    },
    rightAction() {
      this[this.options.right.id](this.options.right.payload);
			this.object.visible = false;
    },
    leftAction() {
      this[this.options.left.id](this.options.left.payload);
			this.object.visible = false;
    },
    downAction() {
      this[this.options.down.id](this.options.down.payload);
			this.object.visible = false;
    },
		updateLine(){
			let pos = {
				x: this.getCanvasMouseMove.xThree + this.svgWidth/2 - this.object.position.x - 10,
				y: -this.getCanvasMouseMove.yThree + this.svgHeight/2 + this.object.position.y - 10
			}

			this.svgLine.setAttribute('x2',`${pos.x}`);
			this.svgLine.setAttribute('y2',`${pos.y}`);
		},
    handleMouseDown(e){
      if(e.button === 1 || e.button === 0){
        if(this.options.left && this.determineDirection() == "left") this.leftAction();
				else if(this.options.right && this.determineDirection() == "right") this.rightAction();
				else if(this.options.up && this.determineDirection() == "up") this.upAction();
				else if(this.options.down && this.determineDirection() == "down") this.downAction();
				
				this.object.visible = false;
        this.setMenuActive(false);
        this.reverseCameraAnimation();
      }
    },
		handleMouseUp(e){
      this.cancel = false;
			if(e.button === 2){
				// right button cancel
				this.object.visible = false;
				this.cancel = true;
			}

			if(e.button === 1 && !this.cancel){
        console.log("direction", this.determineDirection())
				if(this.options.left && this.determineDirection() == "left") this.leftAction();
				else if(this.options.right && this.determineDirection() == "right") this.rightAction();
				else if(this.options.up && this.determineDirection() == "up") this.upAction();
				else if(this.options.down && this.determineDirection() == "down") this.downAction();
				
				this.object.visible = false;
			}
      this.setMenuActive(false);
      this.reverseCameraAnimation();
		},
    startCameraAnimation(){
      this.initalCameraZ = this.getCamera.position.z;

      this.cameraAnimation = new TWEEN
				.Tween({z: this.initalCameraZ})
				.to({z: this.initalCameraZ + 20}, 2200)
				.easing(TWEEN.Easing.Elastic.Out)
				.onUpdate(object => {
					this.getCamera.position.z = object.z;
				}).start();
    },
    reverseCameraAnimation(){
      if(this.cameraAnimation)
        this.cameraAnimation.stop();
      
      if(!this.options.containsLayeredOptions) {
        new TWEEN
          .Tween({z: this.getCamera.position.z})
          .to({z: this.initalCameraZ}, 2200)
          .easing(TWEEN.Easing.Elastic.Out)
          .onUpdate(object => {
            this.getCamera.position.z = object.z;
        }).start();
      }
    },
    setHover(){
      if( this.determineDirection() == "left") {
        this.hover = "left";
      }
      else if( this.determineDirection() == "right") {
        this.hover = "right";
      }
      else if( this.determineDirection() == "up") {
        this.hover = "up";
      }
      else if( this.determineDirection() == "down") {
        this.hover = "down";
      }
    },
    determineDirection(){
      let org = this.startPos;
      let point = {
        x: this.getCanvasMouseMove.xThree + this.getCamera.position.x,
        y: this.getCanvasMouseMove.yThree + this.getCamera.position.y,
      };

      let hyp = Math.sqrt(Math.pow(point.x - org.x, 2) + Math.pow(point.y - org.y, 2));
      let adj = point.x - org.x;
      let deltaY = point.y - org.y;

      let angle = Math.acos(adj/hyp) * (180/Math.PI);
      if(deltaY < 0 ){
        angle = 180 + (180 - angle);
      }
      //console.log(angle);
      if(angle > 315 || angle < 45) return "right";
      else if(angle > 45 && angle < 135) return "up";
      else if(angle > 135 && angle < 225) return "left";
      else if(angle > 225 && angle < 315) return "down";
    },
    createTopic() {
      this.createNewNode({
        x: this.getCanvasMouseMove.xThree,
        y: this.getCanvasMouseMove.yThree,
      });
    },
    removeTopic({localRemoveFn, id}){
      // need to cancel mousemove event on topic or something weird about it
      localRemoveFn();
      this.removeNode(id);
    },
    toggleFloating(payload){
      payload.toggleFloating();
    },
    newConnection({localConnectionFn}){
      this.setMenuOption({
        layeredMenu: true,
        right: {title: "regular connection", id: "regularConnection", payload: {localConnectionFn}},
        left: {title: "weak connection", id: "weakConnection", payload: {localConnectionFn}},
      })
    },
    regularConnection({localConnectionFn}){
      localConnectionFn("normal")
    },
    weakConnection({localConnectionFn}){
      localConnectionFn("weak")
    },
    removeConnection({localRemoveConnectionFn}){
      localRemoveConnectionFn()
    }
  },
};
</script>

<style lang="scss">
  #pieMenuRoot {
  --height: 220;
  $width: 220px;
  $height: $width;
  $padding: 10px;
  $border-width: 1px;

  width: $width;
  height: $height;
	border-radius: 100%;
  
	#menuSvg{
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: -1;
		border-radius: 100%;
	}
  .menu {
		width: 100%;
		height: 100%;
		padding: $padding;
		//border: $border-width solid rgb(235, 235, 235);

    .center {
      position: absolute;
      background-color: #1d1d1d;
      box-shadow: 0 0 3px rgba(#1d1d1d, 0.6),
                  0 0 10px rgba(#1d1d1d, 0.8);
      width: 12px;
      height: 12px;
      transform: rotate(45deg);
      left: ($width + $padding)/2;
      top: ($width + $padding)/2;
    }

    .slices {
      display: flex;
      flex-flow: row wrap;
      transform: rotate(45deg);
      z-index: 5;

      .slice {
        flex: 0 0 (220px - 2px)/2;
        height: ($height - 2)/2;
        position: relative;
        display: block;

        .title {
          display: inline-block;
          position: absolute;
          width: 190px;
          cursor: pointer;

          span {
            display: inline-block;
            padding: 5px;
            background-color: white;
            border: 1px solid rgb(235, 235, 235);
            border-radius: 5px;
            font-family: "Source Sans Pro";
            transition: transform cubic-bezier(0.18, 0.89, 0, 2.3) 0.2s;
          }
        }
      }
      .up {
        border-right: 1px solid transparent;
        border-bottom: 1px solid transparent;

        .title {
          transform: rotate(-45deg) translateX(-10px);
        }
      }
      .right {
        border-bottom: 1px solid transparent;

        .title {
          transform: rotate(-45deg) translateX(-10px);
        }
      }
      .down {

        .title {
          transform: rotate(-45deg) translateX(-10px);
        }
      }
      .left {
        border-right: 1px solid transparent;

        .title {
          transform: rotate(-45deg) translateX(-110px);
          text-align: right;
        }
      }

      &.up{
        .slice.up{ 
            background: radial-gradient(ellipse at right bottom, rgba(var(--create-color), 0.4), transparent 70%);

          .title > span{
            transform: scale(1.1);
          }
        }
      }
      &.down{
        .slice.down{ 
            background: radial-gradient(ellipse at left top, rgba(var(--create-color), 0.4), transparent 70%);

          .title > span{
            transform: scale(1.1);
          }
        }
      }
      &.left{
        .slice.left{ 
            background: radial-gradient(ellipse at right top, rgba(var(--create-color), 0.4), transparent 70%);

          .title > span{
            transform: scale(1.1);
          }
        }
      }
      &.right{
        .slice.right{ 
          background: radial-gradient(ellipse at left bottom, rgba(var(--create-color), 0.4), transparent 70%);

          .title > span{
            transform: scale(1.1);
          }
        }
      }
    }
  }
  .cover {
    position: absolute;
    z-index: -50;
    margin-top: -5000vh;
    margin-left: -5000vw;
    width: 10000vw;
    height: 10000vh;
    background-color: rgba(black, 0.1);
  }
}
</style>