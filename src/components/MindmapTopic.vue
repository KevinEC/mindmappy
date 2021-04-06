<template>
  <div class="topic">
		{{ title }}
  </div>
</template>

<script>
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

export default {
	props:{
		title: {
			type: String,
			default: "new topic"
		},
		canvasMove: {
			type: Object,
			default: null
		}
	},
	data () {
		return {
			object: null,
			id: null,
			pressed: false,
			pressedX: null,
			pressedY: null,
			pressedObjX: null,
			pressedObjY: null,
		}
	},
	computed: {
		canvasMoveComputed(){
			return this.canvasMove;
		}
	},
	created(){
		this.id = Math.floor(Math.random() * Math.pow(10, 15));
	},
	mounted() {
		this.$el.addEventListener('mousemove', this.handleMouseMove);
		this.$el.addEventListener('mousedown', this.handleMouseDown);
		this.$el.addEventListener('mouseup', this.handleMouseUp);

		this.initCSS3DObject();
		this.$emit('CSS3DObjectInit', this.object)
	},
	methods: {
		handleMouseMove(e){
			console.log("canvasMove in topic:", this.canvasMoveComputed);
			if(this.pressed) {
				let factor = 3;
				let deltaX = (e.clientX - this.pressedX) / factor;
				let deltaY = (-e.clientY + this.pressedY) / factor;
				console.log("delta", deltaX, deltaY)
				//console.log("move", e.clientX, e.clientY)
				this.object.position.x = this.pressedObjX + deltaX;
				this.object.position.y = this.pressedObjY + deltaY;

			}
		},
		handleMouseDown(e){
			this.pressed = true;
			this.pressedX = e.clientX; 
			this.pressedY = e.clientY;

			this.pressedObjX = this.object.position.x; 
			this.pressedObjY = this.object.position.y;
			
			console.log("down at", this.pressedX, this.pressedY);
			console.log("down object pos", this.object.position.x, this.object.position.y);
		},
		handleMouseUp(){
			console.log("up")
			this.pressed = false;
		},
		initCSS3DObject(){
			if(this.object === null)
				this.object = new CSS3DObject(this.$el);
		}
	}

}
</script>

<style>
.topic{
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	padding: 20px;
	background-color: blanchedalmond;
	box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
</style>