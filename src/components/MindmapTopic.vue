<template>
  <div class="topic">
		{{ title }}
  </div>
</template>

<script>
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { MathUtils } from 'three';

import { mapGetters, mapState } from 'vuex'

export default {
	props:{
		title: {
			type: String,
			default: "new topic"
		},
		pos: Object
	},
	data () {
		return {
			object: null,
			id: null,
			pressed: false,
			currMouseX: 0,
			currMouseY: 0,
			prevMouseX: 0,
			prevMouseY: 0,
		}
	},
	computed: {
		...mapGetters([
			'getCanvasMouseMove',
			'getCanvasMousePressed'
		]),
		...mapState([
			'canvasMouseMove',
			'canvasMouseMovement'
		])
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
	watch: {
		canvasMouseMovement(){
			this.handleCanvasMouseMove();
		}
	},
	methods: {
		handleMouseMove(){
			
		},
		handleCanvasMouseMove(){
			if(this.getCanvasMousePressed && this.pressed) {
				this.currMouseX = this.getCanvasMouseMove.deltaX;
				this.currMouseY = this.getCanvasMouseMove.deltaY;

				this.prevMouseX = MathUtils.lerp(this.prevMouseX, this.currMouseX, 0.1);
				this.prevMouseY = MathUtils.lerp(this.prevMouseY, this.currMouseY, 0.1);

				
				this.object.position.x = 
					this.pressedObjX + (this.currMouseX); //+ this.currMouseX);

				this.object.position.y = 
					this.pressedObjY + (this.currMouseY); //+ this.currMouseY);
			}
		},
		handleMouseDown(e){
			this.pressed = true;
			this.pressedX = e.clientX; 
			this.pressedY = e.clientY;

			this.pressedObjX = this.object.position.x; 
			this.pressedObjY = this.object.position.y;
		},
		handleMouseUp(){
			this.pressed = false;
		},
		initCSS3DObject(){
			if(this.object === null) {
				this.object = new CSS3DObject(this.$el);
				this.object.userData.title = this.title;
				this.object.userData.pos = this.pos;
			}
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
	border-radius: 300px;
	padding: 10px 20px;
	background-color: white;
	box-shadow: 
				0 0 2px rgba(0,0,0,0.1),
				0 0 5px rgba(0,0,0,0.08),
				0 0 15px rgba(0,0,0,0.15);
	font-family: 'Source Sans Pro';
}
</style>