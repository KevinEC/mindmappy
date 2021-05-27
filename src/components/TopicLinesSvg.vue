<template>
  <div id="topicLinesRoot" :class="blurComputed">
		<svg :width="svgWidth" :height="svgHeight" id="topicLinesSvg" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<filter id="red-glow">
					<feDropShadow dx="0" dy="0" stdDeviation="2.5"
						flood-color="red"/>
				</filter>
			</defs>
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
			'getFloatingTopics',
			'getNewConnection',
			'getCanvasMouseMove',
			'getMenuActive',
			'getCamera'
		]),
		...mapState([
			'canvasMouseMovement',
			'floatingTopicsSignal',
			'topicUpdatedSignal',
			'creatingNewConnection',
			'connectionRemovedSignal',
			'connectionsToRemove',
			'glowingConnection',
			'removeGlowingConnection'
		]),
		blurComputed(){
			if(this.getMenuActive) return "blur"
			return ""
		}
	},
	mounted(){
		this.init();
	},
	watch: {
		canvasMouseMovement(){
			if(this.getPressedTopicId){
				this.updateLines();
			}
			if(this.creatingNewConnection){
				this.updateNewConnectionLine();
			} else {
				this.removeNewConnectionLine();
			}
		},
		topicUpdatedSignal(){
			this.updateAllLines();
		},
		floatingTopicsSignal(){
			this.updateFloatingLines();
		},
		connectionRemovedSignal(){
			this.removeLine();
		},
		glowingConnection(connection){
			this.setGlowingConnection(connection);
		},
		removeGlowingConnection(connection){
			this.handleRemoveGlowingConnection(connection);
		},
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
					topic.connections.forEach(connection => {
						this.createLine(topic, this.getTopicById(connection.id), connection.type)
					});
				}
			});
		},
		createLine(parent, child, type){
			let parentId = this.cssifyId(parent.id)
			let childId = this.cssifyId(child.id)
			if(this.svg.querySelector(`.line${parentId}.line${childId}`) == undefined){
				let pos1 = this.threeToSvg(parent.pos);
				let pos2 = this.threeToSvg(child.pos);
				let line = document.createElementNS('http://www.w3.org/2000/svg','line');
				line.setAttribute('class','line line'+parentId+' line'+childId);
				line.setAttribute('x1',`${pos1.x}`);
				line.setAttribute('y1',`${pos1.y}`);
				line.setAttribute('x2',`${pos2.x}`);
				line.setAttribute('y2',`${pos2.y}`);

				if(type == undefined || type == "normal") {
					line.setAttribute("stroke", "black");
					line.setAttribute("stroke-width", "2");
				}
				else if(type == "weak") {
					line.setAttribute("stroke", "black");
					line.setAttribute("stroke-dasharray", "5,5");
					line.setAttribute("stroke-width", "1");
				}

				this.svg.appendChild(line);
			}
		},
		updateLines(){
			let topicToUpdate = this.getTopicById(this.getPressedTopicId);
			if(topicToUpdate == undefined) return;
			topicToUpdate.connections.forEach(connection => {
				this.updateLine(topicToUpdate, this.getTopicById(connection.id));
			})
		},
		updateAllLines(){
			this.getAllTopics.forEach(topic => {
				topic.connections.forEach(connection => {
					this.updateLine(topic, this.getTopicById(connection.id));
				})
			})
		},
		updateFloatingLines(){
			let topicsToUpdate = this.getFloatingTopics;
			let topicToUpdate;
			topicsToUpdate.forEach(floatingId =>{
				topicToUpdate = this.getTopicById(floatingId);
				topicToUpdate.connections.forEach(connection => {
					this.updateLine(topicToUpdate, this.getTopicById(connection.id));
				})

			})
		},
		updateLine(topic1, topic2){
			if(topic1 && topic2) {
				let topic1Id = this.cssifyId(topic1.id);
				let topic2Id = this.cssifyId(topic2.id);
				let line = this.svg.querySelector(`.line${topic1Id}.line${topic2Id}`);
				if(line == undefined){
					this.createLine(topic1, topic2, this.newConnectionType);
					return;
				} 
					
				let pos1 = this.threeToSvg(topic1.pos);
				let pos2 = this.threeToSvg(topic2.pos);
				line.setAttribute('x1',`${pos1.x}`);
				line.setAttribute('y1',`${pos1.y}`);
				line.setAttribute('x2',`${pos2.x}`);
				line.setAttribute('y2',`${pos2.y}`);
			}
		},
		updateNewConnectionLine(){
			let mouseData = this.getCanvasMouseMove;

			let from = this.getTopicById(this.getNewConnection.from).object.position;
			//console.log("camera", this.getCamera.position)
			let to = {x: (mouseData.xThree + this.getCamera.position.x), y: mouseData.yThree + this.getCamera.position.y};
			
			let pos1 = this.threeToSvg(from);
			let pos2 = this.threeToSvg(to);

			let line = this.svg.querySelector("#newConnectionLine")
			if(line == undefined) line = document.createElementNS('http://www.w3.org/2000/svg','line');

			line.setAttribute('id','newConnectionLine');
			line.setAttribute('x1',`${pos1.x}`);
			line.setAttribute('y1',`${pos1.y}`);
			line.setAttribute('x2',`${pos2.x}`);
			line.setAttribute('y2',`${pos2.y}`);

			this.newConnectionType = this.getNewConnection.type;
			if(this.getNewConnection.type == "normal") {
				line.setAttribute("stroke", "black");
				line.setAttribute("stroke-width", "2");
			}
			else if(this.getNewConnection.type == "weak") {
				line.setAttribute("stroke", "black");
				line.setAttribute("stroke-dasharray", "5,5");
				line.setAttribute("stroke-width", "1");
			}
			this.svg.appendChild(line);
		},
		removeNewConnectionLine(){
			let line = this.svg.querySelector("#newConnectionLine");
			if(line) {
				line.remove();
				this.updateAllLines();
			}
		},
		removeLine(){
			let topicId1, topicId2;
			console.log("connectionsToRemove", this.connectionsToRemove)
			this.connectionsToRemove.forEach(connection => {
				topicId1 = this.cssifyId(connection.from);
				topicId2 = this.cssifyId(connection.to);
				//console.log("line ids to remove: ", this.removedConnection);
				this.svg.querySelector(`.line${topicId1}.line${topicId2}`).remove();

			})
		},
		setGlowingConnection(connection){
			if(connection){
				let topicId1 = this.cssifyId(connection.node1);
				let topicId2 = this.cssifyId(connection.node2);
				let line = this.svg.querySelector(`.line${topicId1}.line${topicId2}`)
				if(line){
					line.setAttribute('style', `
						filter: url(#red-glow);
						stroke: rgb(255, 87, 87);
					`);
				}
			}
		},
		handleRemoveGlowingConnection(connection){
			if(connection){
				let topicId1 = this.cssifyId(connection.node1);
				let topicId2 = this.cssifyId(connection.node2);
				let line = this.svg.querySelector(`.line${topicId1}.line${topicId2}`)
				if(line){
					line.setAttribute('style', `
						stroke: black;
					`);
				}
			}
		},
		threeToSvg(pos){
			let x = pos.x + this.svgWidth / 2;
			let y = (-pos.y + this.svgHeight / 2);
			return {x: x, y: y}
		},
		cssifyId(id){
			id += "";
			//console.log("cssified id before:", id);
			id = id.replaceAll(" ", "-")
			id = id.replace(/[^a-zA-Z0-9 ]/g, "")
			return id;
		}
	}
}
</script>

<style lang="scss">
.line{
	transition: all 0.15s ease-out;

}
#topicLinesRoot{

	&.blur{
		filter: blur(1px);
	}
}

</style>