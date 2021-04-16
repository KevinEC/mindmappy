<template>
  <div id="TopicLinesRoot">
		<svg :width="svgWidth" :height="svgHeight" id="topicLinesSvg" xmlns="http://www.w3.org/2000/svg">
			
		</svg>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

export default {
	data(){
		return {
			object: null,
			svg: null,
			svgWidth: 10000,
			svgHeight: 10000,
		}
	},
	computed: {
		...mapGetters([
			'getScene',
			'getAllTopics',
			'getTopicById',
			'getCanvasMousePressed',
			'getPressedTopicId',
		]),
		...mapState(['canvasMouseMovement']),
	},
	mounted(){
		this.init();
	},
	watch: {
		canvasMouseMovement(){
			if(this.getCanvasMousePressed){
				this.updateLines();
			}
		}
	},
	methods: {
		init(){
			this.svg = this.$el.querySelector("#topicLinesSvg");
			this.object = new CSS3DObject(this.$el);
			this.getScene.add(this.object);
			this.initLines();
		},
		initLines(){
			this.getAllTopics.forEach(topic => {
				if(topic.connections.length > 0) {
					topic.connections.forEach(id => {
						this.createLine(topic, this.getTopicById(id))
					});
				}
			});
		},
		createLine(parent, child){
			if(this.svg.querySelector(`.line${parent.id}, .line${child.id}`) == undefined){
				let pos1 = this.threeToSvg(parent.pos);
				let pos2 = this.threeToSvg(child.pos);
				let line = document.createElementNS('http://www.w3.org/2000/svg','line');
				line.setAttribute('class','line'+parent.id+' line'+child.id);
				line.setAttribute('x1',`${pos1.x}`);
				line.setAttribute('y1',`${pos1.y}`);
				line.setAttribute('x2',`${pos2.x}`);
				line.setAttribute('y2',`${pos2.y}`);
				line.setAttribute("stroke", "black");
				line.setAttribute("stroke-width", "2");
				this.svg.appendChild(line);
			}
		},
		updateLines(){
			let topicToUpdate = this.getTopicById(this.getPressedTopicId);
			topicToUpdate.connections.forEach(id => {
				this.updateLine(topicToUpdate, this.getTopicById(id));
			})
		},
		updateLine(topic1, topic2){
			let line = this.svg.querySelector(`.line${topic1.id}, .line${topic2.id}`)
			let pos1 = this.threeToSvg(topic1.pos);
			let pos2 = this.threeToSvg(topic2.pos);
			line.setAttribute('x1',`${pos1.x}`);
			line.setAttribute('y1',`${pos1.y}`);
			line.setAttribute('x2',`${pos2.x}`);
			line.setAttribute('y2',`${pos2.y}`);
		},
		threeToSvg(pos){
			let x = pos.x + this.svgWidth / 2;
			let y = (-pos.y + this.svgHeight / 2);
			return {x: x, y: y}
		}
	}
}
</script>

<style>
#topicLinesSvg{
}
</style>