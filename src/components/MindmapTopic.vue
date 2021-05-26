<template>
  <div class="topic" :class="classesComputed" :tabindex="-2	">
		{{ data.title }}
		<!-- {{ data.id }} -->
		<!-- <div>{{positionComputed}}</div>  -->
  </div>
</template>

<script>
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { MathUtils } from 'three';
const TWEEN = require('@tweenjs/tween.js')

import { mapGetters, mapState, mapActions } from 'vuex'

export default {
	props:{
		data: Object,
		tabindex: Number
	},
	data () {
		return {
			object: null,
			id: null,
			selected: false,
			pressed: false,
			floating: false,
			floatAnimation: null,
			floatingTweens: null,
			blobAnimation: null,
			localMenuActive: false,
			currMouseX: 0,
			currMouseY: 0,
			prevMouseX: 0,
			prevMouseY: 0,
			preventFloatingResume: false,
			pos: {},
		}
	},
	computed: {
		...mapGetters([
			'getCanvasMouseMove',
			'getCanvasMousePressed',
			'getShiftKey',
			'getSelectedTopicsLength',
			'getSelectedTopics',
			'getTopicCoordinateExtremeties',
			'getTopicById',
			'getGraph',
			'getScene',
			'getGraphLayout',
			'getCreatingNewConnection',
			'getNewConnection',
			'getRemoveConnectionId',
			'getMenuActive'
		]),
		...mapState([
			'canvasMouseMove',
			'canvasMouseMovement',
			'deselectAllTopicsSignal',
			'topicUpdatedSignal'
		]),
		selectedComputed(){
			return this.selected;
		},
		floatingComputed(){
			return this.floating;
		},
		classesComputed(){
			let result ="";
			if(this.selectedComputed) result += "selected ";
			if(this.floatingComputed) result += "floating ";
			if(this.data.root) result += "root ";
			if(this.getMenuActive) result += "blur ";
			return result;
		},
		positionComputed(){
			if(this.object)
				return `x: ${this.object.position.x.toFixed(0)}, y: ${this.object.position.y.toFixed(0)}, `
			else 
				return "";
		},
	},
	mounted() {
		this.$el.addEventListener('mousemove', this.handleMouseMove);
		this.$el.addEventListener('mouseleave', this.handleMouseLeave);
		this.$el.addEventListener('mousedown', this.handleMouseDown);
		this.$el.addEventListener('mouseup', this.handleMouseUp);
		this.$el.addEventListener('keydown', this.onKeyDown);


		this.id = this.data.id;
		this.initCSS3DObject();
		this.updateTopicById({id: this.id, updateData: {object: this.object}});
		this.$emit('CSS3DObjectInit', this.object);
		this.initFloating();
		this.initBlobAnimation();
		this.blobAnimation.start();
	},
	watch: {
		canvasMouseMovement(){
			this.handleCanvasMouseMove();
		},
		deselectAllTopicsSignal(){
			if(this.getSelectedTopics[0] !== this.id) {
				this.selected = false;
			}
		},
		floating(newVal){
			this.handleFloatingAnimation(newVal);
		},
	},
	methods: {
		...mapActions([
			'updateTopicById',
			'setPressedTopic',
			'toggleSelectedTopic',
			'deselectAllTopicsBut',
			'toggleFloatingTopic',
			'triggerFloatingTopicsSignal',
			'setNewConnection',
			'pushTopicConnection',
			'setRemoveConnectionId',
			'removeConnection',
			'removeNode',
			'setMenuOption',
			'setConnectionGlow',
			'removeConnectionGlow'
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

				this.pos.x = x;
				this.pos.y = y;

				this.object.position.x = x;
				this.object.position.y = y;

				this.getTopicById(this.id).graphNode.point.p.x = x / 50;
				this.getTopicById(this.id).graphNode.point.p.y = y / 50;
				
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
			if(e.button === 0) {
				this.pressed = true;
			}
			this.pressedX = e.clientX; 
			this.pressedY = e.clientY;

			this.pressedObjX = this.object.position.x; 
			this.pressedObjY = this.object.position.y;

			this.setPressedTopic(this.id);
			this.handleSelection();
			this.handleMenu(e);
			//this.toggleFloating(e); // <-- should be in the menu
			this.handleGraphNodeMouseDown();
			this.handleNewConnection(e);
			this.handleRemoveConnection();
			
			if(this.floating){
				// V this is deffo a part of the problem
				//if(!this.localMenuActive) 
				this.floatingPaused = true;
				this.handleFloatingAnimation(false);
			}

		},
		handleMouseUp(e){
			this.pressed = false;
			this.setPressedTopic(null);
			this.handleGraphNodeMouseUp();

			if(this.floatingPaused && !this.preventFloatingResume) {
				this.initFloatAnimation();
				this.handleFloatingAnimation(true);
				this.floatingPaused = false;
			}
			if(e.button === 1){
				this.localMenuActive = false;
			}
		},
		handleMouseMove(){
			//connection removal in process
			if(this.getRemoveConnectionId != null){
				this.setConnectionGlow({node1: this.id, node2: this.getRemoveConnectionId});
			}
		},
		handleMouseLeave(){
			//connection removal in process
			if(this.getRemoveConnectionId != null){
				this.removeConnectionGlow({node1: this.id, node2: this.getRemoveConnectionId});
			}
		},
		onKeyDown(e){
			if(e.key == 'c' || e.key == 'C'){
				this.initNewConnection("normal");
			}
			if(e.key == 'x' || e.key == 'X'){
				this.initNewConnection("weak");
			}
			if(e.key == 'b' || e.key == 'B'){
				this.initRemoveConnection();
			}
			if(e.key == 'n' || e.key == 'N'){
				this.remove();
				this.removeNode(this.id);
			}
		},
		initCSS3DObject(){
			if(this.object === null) {
				this.object = new CSS3DObject(this.$el);
				this.object.userData = this.data;
				this.object.position.z = 0;
				this.getScene.add(this.object);
			}
		},
		handleSelection(){
			if(this.getShiftKey){
				this.selected = !this.selected;
				this.toggleSelectedTopic(this.id);
			} 
			else {
				if(this.selected){
					this.selected = false;
					this.deselectAllTopicsBut("all")	

				} else {
					this.selected = true;
					this.toggleSelectedTopic(this.id);
					this.deselectAllTopicsBut(this.id)	
				}
			}
		},
		toggleFloating(){
			this.floating = !this.floating;
			if(this.floating){
				this.initFloatAnimation();
				this.preventFloatingResume = false;
			}
			else {
				this.preventFloatingResume = true;
			}

			this.handleBlobAnimation()
			this.toggleFloatingTopic(this.id);
			
		},
		initNewConnection(type){
			this.setNewConnection({from: this.id, to: null, type});
		},
		handleNewConnection(){
			if(this.getCreatingNewConnection && this.getNewConnection.from != this.id){
				let connection = {from: this.getNewConnection.from, to: this.id, type: this.getNewConnection.type};
				this.setNewConnection(connection);
				this.pushTopicConnection(connection);
			}
			// if(e.button === 2) {
				
			// }			
		},
		initFloatAnimation(){
			let n = 10;
			let positions = [];
			// generate random positions
			let range = this.getTopicCoordinateExtremeties;
			for (let i = 0; i < n; i++) {
				const x = range.minX + Math.random()*(Math.abs(range.minX - range.maxX));
				const y = range.minY + Math.random()*(Math.abs(range.minY - range.maxY));
				positions.push({x: x, y: y});	
			}

			// create tweens
			let tweens = [];
			let startX, startY;
			let duration = 10000; //10s
			for (let i = 0; i < n; i++) {
				if(i == 0) {
					startX = this.object.position.x;
					startY = this.object.position.y;
				} else {
					startX = positions[i-1].x;
					startY = positions[i-1].y;
				}
				tweens.push(
					new TWEEN
						.Tween({
							x: startX,
							y: startY
						})
						.to({
							x: positions[i].x,
							y: positions[i].y,
						}, duration)
						.easing(TWEEN.Easing.Quadratic.InOut)
						.onUpdate((object) => {
							this.object.position.x = object.x;
							this.object.position.y = object.y;

							if(this.getTopicById(this.id).graphNode) {
								this.getTopicById(this.id).graphNode.point.p.x = object.x / 50;
								this.getTopicById(this.id).graphNode.point.p.y = object.y / 50;
							}
							
							this.updateTopicById({
								id: this.id, 
								updateData: {
									pos:{
										x: object.x, 
										y: object.y
									} 
								}
							});
							this.triggerFloatingTopicsSignal();
						})
				);
			}
			tweens.forEach((tween, i) => {
				if(i < tweens.length-1)
					tweens[i].chain(tweens[i+1])
				else
					tweens[tweens.length-1].chain(tweens[0]); // loop them
			})
			this.floatAnimation = tweens[0]; 
			this.floatingTweens = tweens; // prevent garbage collection
			// does the remaining tweens get garbage collected??
		},
		initFloating(){
			if(this.data.floating != undefined) {
				this.floating = this.data.floating;
				// make sure the animation start position is updated
				if(this.floating){
					this.object.position.x = this.data.pos.x;
					this.object.position.y = this.data.pos.y;
					this.initFloatAnimation();
				}
				this.toggleFloatingTopic(this.id);
			}
		},
		initBlobAnimation(){
			let lower = 0.8; 
			let upper = 1;
			this.blobAnimation = new TWEEN
				.Tween({scaleX: lower, scaleY: lower})
				.to({scaleX: upper, scaleY: upper}, 750)
				.easing(TWEEN.Easing.Elastic.Out)
				.onUpdate(object => {
					this.object.scale.x = object.scaleX;
					this.object.scale.y = object.scaleY;
				});
		},
		handleBlobAnimation(){
			if(this.blobAnimation._isPlaying){
				this.blobAnimation.stop();
				this.blobAnimation.start();
			} else {
				this.blobAnimation.start();
			}
		},
		handleFloatingAnimation(floating){
			if(floating){
				this.floatingTweens[0].start();
			} else {
				// find which tween is currently playing and stop it
				for (const tween of this.floatingTweens) {
					if(tween._isPlaying){
						tween.stop();
					}
				}	
			}
		},
		handleGraphNodeMouseDown(){
			if(this.getTopicById(this.id).graphNode && this.getGraphLayout.graph.adjacency[this.id]){
				this.getTopicById(this.id).graphNode.point.m = 100;
				let springId;
				if(!this.getCreatingNewConnection) {
					Object.values(this.getGraphLayout.graph.adjacency[this.id]).forEach(edge => {
						//console.log(edge[0].id);
						springId = edge[0].id;
						this.getGraphLayout.edgeSprings[springId].k = 20;
					})
				}
			}
			
		},
		handleGraphNodeMouseUp(){
			if(this.getTopicById(this.id).graphNode && this.getGraphLayout.graph.adjacency[this.id]){
				this.getTopicById(this.id).graphNode.point.m = 1;
	
				let connectedTopic, newKValue;
				let newKValues = {};
				
				this.data.connections.forEach(connection => {
					if(connection.type != "weak"){
						connectedTopic = this.getTopicById(connection.id);
						newKValue = Math.sqrt(
							Math.pow(this.pos.x - connectedTopic.pos.x, 2) +
							Math.pow(this.pos.y - connectedTopic.pos.y, 2)
						);
						newKValues[connection.id] = newKValue;
					}
				})
				let springId;
				let adjacentTopics = this.getGraphLayout.graph.adjacency[this.id];
				Object.keys(adjacentTopics).forEach(connectionId => {
					springId = adjacentTopics[connectionId][0].id;
					if(newKValues[connectionId]) {
						let newK = (1 / newKValues[connectionId]) * 10000;
						this.getGraphLayout.edgeSprings[springId].k  = newK;
					}
				})
			}
		},
		initRemoveConnection(){
			this.setRemoveConnectionId(this.id);
		},
		handleRemoveConnection(){
			if(this.getRemoveConnectionId != null){
				this.removeConnection({from: this.getRemoveConnectionId, to: this.id});
			} else {
				console.log("no connection to remove here!")
			}
		},
		remove(){
			this.object.parent.remove(this.object);
			this.data.connections.forEach(connection => {
				this.removeConnection({from: this.id, to: connection.id, removeAdjacent: true});
			})
		},
		handleMenu(e){
			if(e.button === 1){
				let menu = {
					containsLayeredOptions: true,
					right: {title: "new connection", id: "newConnection", payload: { localConnectionFn: this.initNewConnection} },
					down: {title: "remove topic", id: "removeTopic", payload: {localRemoveFn: this.remove, id: this.id}},
					up: {title: "toggle floating", id: "toggleFloating", payload: { toggleFloating: this.toggleFloating}},
				};

				if(this.getSelectedTopics.length === 1){
					menu.left = { title: "remove connection", id: "removeConnection", payload: {localRemoveConnectionFn: this.initRemoveConnection}}
				}
				this.setMenuOption(menu);
				e.stopPropagation();
			}
		}
	}

}
</script>

<style lang="scss">
.topic{
	position: absolute;
	display: flex;
	flex-flow: column wrap;
	justify-content: center;
	align-items: center;
	text-align: center;
	border-radius: 300px;
	max-width: 100px;
	border: 1px solid rgb(235, 235, 235);
	padding: 10px 15px;
	background-color: white;
	box-shadow: 
				0 0 2px rgba(0,0,0,0.1),
				0 0 5px rgba(0,0,0,0.08),
				0 0 15px rgba(0,0,0,0.15);
	font-family: 'Source Sans Pro';
	transition: 0.25s ease-in-out width,
				0.25s ease-in-out height,
				0.05s ease-in filter;


	&:focus{
		outline: 0;
	}
	&.selected{
		border-color: rgba(var(--create-color));
	}
	&.floating{
		width: 100px;
		padding: 10px;
		height: 100px;
		border-radius: 100%;
	}
	&.root{
		font-size: 20px;
		padding: 10px;
		font-weight: 700;
		text-transform: capitalize;
	}
	&.blur{
		filter: blur(1px);
	}
}
</style>