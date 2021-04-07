<template>
  <div class="topics">
		<mindmap-topic v-for="(topic, i) in topics"
			:title="topic.title"
			@CSS3DObjectInit="atCSS3DObjectInit"
			:key="i"
		/>
	</div>
</template>

<script>
import MindmapTopic from '@/components/MindmapTopic.vue';

export default {
	components: {
		MindmapTopic
	},
	props: {
		canvasMouseMove: Object
	},
	data() {
		return{
			topics: [
				{
					title: "mindmap",
				},
				{
					title: "idea"
				}
			],
			allCSS3DObjects: []
		}
	},
	methods: {
		atCSS3DObjectInit(object){
			this.allCSS3DObjects.push(object);

			// hard coded replacement for watch. unreliable?
			// good performance tho
			if(this.allCSS3DObjects.length === this.topics.length) {
				this.$emit('CSS3DObjectsInit', this.allCSS3DObjects);
			}
		}
	}
}
</script>

<style>

</style>