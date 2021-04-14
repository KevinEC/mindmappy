<template>
  <div class="topics">
		<new-mindmap-topic :pos="createNewTopicPos" />
		<mindmap-topic v-for="(topic, i) in getAllTopics"
			:title="topic.title"
			:pos="topic.pos"
			@CSS3DObjectInit="atCSS3DObjectInit"
			:key="i"
		/>
	</div>
</template>

<script>
import MindmapTopic from '@/components/MindmapTopic.vue';
import NewMindmapTopic from '@/components/NewMindmapTopic.vue';

import { mapGetters } from "vuex"

export default {
	components: {
		MindmapTopic,
		NewMindmapTopic
	},
	props: {
		createNewTopicPos: Object
	},
	data() {
		return{
			allCSS3DObjects: []
		}
	},
	computed: {
		...mapGetters(['getAllTopics']),
	},
	methods: {
		atCSS3DObjectInit(object){
			this.allCSS3DObjects.push(object);

			// hard coded replacement for watch. unreliable?
			// good performance tho
			if(this.allCSS3DObjects.length === this.getAllTopics.length) {
				this.$emit('CSS3DObjectsInit', this.allCSS3DObjects);
			}
		}
	}
}
</script>

<style>

</style>