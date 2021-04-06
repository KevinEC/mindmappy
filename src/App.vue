<template>
  <div id="app">
    <h1> test</h1>
    <canvas-viewport :topics="allTopicsComputed" />
    <mindmap-topics @CSS3DObjectsInit="topicsMounted" />
  </div>
</template>

<script>
import CanvasViewport from './components/CanvasViewport.vue';
import MindmapTopics from './components/MindmapTopics.vue';

export default {
  name: "App",
  components: {
    CanvasViewport,
    MindmapTopics
  },
  data() {
    return {
      allTopics: []
    }
  },
  computed:{
    allTopicsComputed(){
      return this.allTopics;
    }
  },
  methods: {
    topicsMounted(objects){
      console.log("objetcs in app ", objects);
      this.allTopics = objects;
    }
  }
};
</script>

<style>
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
