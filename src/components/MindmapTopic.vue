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
		}
	},
	data () {
		return {
			object: null,
			id: null
		}
	},
	created(){
		this.id = Math.floor(Math.random() * Math.pow(10, 15));
	},
	mounted() {
		this.$el.addEventListener('mousemove', () => {
			this.object.position.x += 10;
			console.log(this.object.position.x);
		}, this);
		this.initCSS3DObject();
		this.$emit('CSS3DObjectInit', this.object)
	},
	methods: {
		handleClick(e){
			console.log("onclick topic", e);
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