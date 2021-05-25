<template>
  <div id="app">
    <canvas-viewport
      :topics="allTopicsComputed"
      :topicsLength="topicsLengthComputed"
      @createNewTopic="createNewTopic"
    />
    <mindmap-topics
      :createNewTopicPos="createNewTopicPosComputed"
    />
  </div>
</template>

<script>
import CanvasViewport from './components/CanvasViewport.vue';
import MindmapTopics from './components/MindmapTopics.vue';

import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    CanvasViewport,
    MindmapTopics
  },
  beforeCreate(){
    this.$store.commit('INIT_TOPICS');
  },
  data() {
    return {
      allTopics: [],
      createNewTopicPos: {},
			topicsLength: null,
    }
  },
  computed:{
    createNewTopicPosComputed(){
      return this.createNewTopicPos;
    }
  },
  methods: {
    ...mapActions([
      'initTopics'
    ]),
    createNewTopic(pos){
      this.createNewTopicPos = pos;
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@500&family=Source+Sans+Pro:ital,wght@0,600;0,700;1,600&display=swap');
:root{
  --create-color: 53, 238, 223;
}
html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
body {
  margin: 0px;
}
#app {
  height: 100%;
}
</style>
