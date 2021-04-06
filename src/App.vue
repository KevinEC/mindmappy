<template>
  <div id="app">
    <h1> test</h1>
    <canvas-viewport
      :topics="allTopicsComputed" 
      @canvasMouseMove="onCanvasMouseMove"
    />
    <mindmap-topics 
      @CSS3DObjectsInit="topicsMounted"
      :canvasMouseMove="canvasMouseMoveComputed"
    />
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
      allTopics: [],
      canvasMouseMove: null
    }
  },
  computed:{
    allTopicsComputed(){
      return this.allTopics;
    },
    canvasMouseMoveComputed(){
      return this.canvasMouseMove;
    }
  },
  methods: {
    topicsMounted(objects){
      console.log("objetcs in app ", objects);
      this.allTopics = objects;
    },
    onCanvasMouseMove(move){
      this.canvasMouseMove = move;
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
