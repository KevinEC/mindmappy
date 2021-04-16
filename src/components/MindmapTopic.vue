<template>
  <div class="topic" :class="classesComputed">
		{{ data.title }}
  </div>
</template>

<script>
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { MathUtils } from 'three';

import { mapGetters, mapState, mapActions } from 'vuex'

export default {
	props:{
		data: Object
	},
	data () {
		return {
			object: null,
			id: null,
			selected: false,
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
			'getCanvasMousePressed',
			'getShiftKey',
			'getSelectedTopicsLength',
			'getSelectedTopics'
		]),
		...mapState([
			'canvasMouseMove',
			'canvasMouseMovement',
			'deselectAllTopicsSignal'
		]),
		selectedComputed(){
			return this.selected;
		},
		classesComputed(){
			let result ="";
			if(this.selectedComputed) result += "selected ";
			return result;
		}
	},
	mounted() {
		this.$el.addEventListener('mousemove', this.handleMouseMove);
		this.$el.addEventListener('mousedown', this.handleMouseDown);
		this.$el.addEventListener('mouseup', this.handleMouseUp);

		this.id = this.data.id;
		this.initCSS3DObject();
		this.updateTopicById({id: this.id, updateData: {object: this.object}});
		this.$emit('CSS3DObjectInit', this.object)
	},
	watch: {
		canvasMouseMovement(){
			this.handleCanvasMouseMove();
		},
		deselectAllTopicsSignal(){
			console.log("deselect signal", this.getSelectedTopics[0], "length: ", this.getSelectedTopicsLength)

			if(this.getSelectedTopics[0] !== this.id) {
				console.log("deselected")
				this.selected = false;
			}
		}
	},
	methods: {
		...mapActions([
			'updateTopicById',
			'setPressedTopic',
			'toggleSelectedTopic',
			'deselectAllTopicsBut'
		]),
		handleCanvasMouseMove(){
			if(this.getCanvasMousePressed && this.pressed) {
				this.setPressedTopic(this.id);

				this.currMouseX = this.getCanvasMouseMove.deltaX;
				this.currMouseY = this.getCanvasMouseMove.deltaY;

				this.prevMouseX = MathUtils.lerp(this.prevMouseX, this.currMouseX, 0.1);
				this.prevMouseY = MathUtils.lerp(this.prevMouseY, this.currMouseY, 0.1);

				let x = this.pressedObjX + (this.currMouseX);
				let y = this.pressedObjY + (this.currMouseY);
				this.object.position.x = x;
				this.object.position.y = y;
				this.updateTopicById({
					id: this.id, 
					updateData: {
						pos:{
							x: x, 
							y: y
						} 
					}
				});
			}

		},
		handleMouseDown(e){
			this.pressed = true;
			this.pressedX = e.clientX; 
			this.pressedY = e.clientY;

			this.pressedObjX = this.object.position.x; 
			this.pressedObjY = this.object.position.y;
			this.setPressedTopic(this.id);
		},
		handleMouseUp(){
			this.pressed = false;
			console.log(this.getSelectedTopicsLength, this.getShiftKey);
			if(this.getShiftKey){
				this.selected = !this.selected;
				this.toggleSelectedTopic(this.id);
			} 
			else {
				this.selected = true;
				console.log("selected set true");
				this.toggleSelectedTopic(this.id);
				this.deselectAllTopicsBut(this.id)	
				
			}
		},
		initCSS3DObject(){
			if(this.object === null) {
				this.object = new CSS3DObject(this.$el);
				this.object.userData = this.data;
			}
		}
	}

}
</script>

<style lang="scss">
.topic{
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 300px;
	border: 1px solid rgb(235, 235, 235);
	padding: 10px 20px;
	background-color: white;
	box-shadow: 
				0 0 2px rgba(0,0,0,0.1),
				0 0 5px rgba(0,0,0,0.08),
				0 0 15px rgba(0,0,0,0.15);
	font-family: 'Source Sans Pro';

	&.selected{
		border-color: var(--create-color);
	}
}
</style>