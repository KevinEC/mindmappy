<template>
  <div class="topics">
		<topic-lines-svg /> 
		<new-mindmap-topic :pos="createNewTopicPos" />
		<mindmap-topic v-for="(topic, i) in getAllTopics"
			:data="topic"
			@CSS3DObjectInit="atCSS3DObjectInit"
			:key="i"
		/>
	</div>
</template>

<script>
import MindmapTopic from '@/components/MindmapTopic.vue';
import TopicLinesSvg from '@/components/TopicLinesSvg.vue';
import NewMindmapTopic from '@/components/NewMindmapTopic.vue';

import { mapActions, mapGetters } from "vuex"

export default {
	components: {
		MindmapTopic,
		NewMindmapTopic,
		TopicLinesSvg,
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
		...mapActions(['setTopicsMounted']),
		atCSS3DObjectInit(object){
			this.allCSS3DObjects.push(object);
			//this.updateTopicById({id: object.userData.id, updateData: {object: object}});


			// hard coded replacement for watch. unreliable?
			// good performance tho
			if(this.allCSS3DObjects.length === this.getAllTopics.length) {
				this.setTopicsMounted(true);
			}
		}
	}
}
</script>

<style>

</style>