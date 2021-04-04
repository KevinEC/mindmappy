<template>
  <div id="app">
    <canvas-viewport />
  </div>
</template>

<script>
import CanvasViewport from './components/CanvasViewport.vue';

export default {
  name: "App",
  components: {
    CanvasViewport
  },
  data() {
    return {
    };
  },
  methods: {
    
  },
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
