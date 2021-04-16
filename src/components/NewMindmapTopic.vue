<template>
  <div class="newTopic">
      <form @submit.prevent="submitNewTopic" 
            class="form">
         <input @blur="blur" tabindex="5" type="text" class="createInput" />
      </form>
  </div>
</template>

<script>
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { mapGetters, mapActions } from 'vuex';

export default {
  props:{
    pos: Object
  },
  data(){
    return{
      object: null
    }
  },
  watch: {
    pos(){
      this.createNewTopic();
    }
  },
  computed: {
    ...mapGetters([
      'getScene',
      'getCamera',
    ]),
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions([
      'setCreatingTopic',
      'pushTopic',
    ]),
    init(){
      this.object = new CSS3DObject(this.$el);
      this.getScene.add(this.object);
      this.object.position.z = 0;
      this.object.visible = false;
    },
    createNewTopic(){
      this.setCreatingTopic(true);
      this.object.position.x = this.pos.x + this.getCamera.position.x;
      this.object.position.y = this.pos.y + this.getCamera.position.y;
      this.object.visible = true;
      // ??? element isn't created when called
      setTimeout(() => {
        this.$el.querySelector(".createInput").focus();
      }, 50);
    },
    submitNewTopic(e){
      e.preventDefault();
      let value = e.target[0].value;
      this.pushTopic({
        title: value,
        id: value + (this.object.position.x) + (this.object.position.y),
        pos: {
          x: this.object.position.x,
          y: this.object.position.y
        },
        connections: []
      });
      this.setCreatingTopic(false);
      this.$el.querySelector(".createInput").value = "";
      this.object.visible = false;
    },
    blur(){
      this.setCreatingTopic(false);
      this.object.visible = false;
    }
  }

}
</script>

<style lang="scss">
.newTopic{
  padding: 5px;

  .form{

    .createInput{
      border: none;
      border-radius: 0;
      font-family: 'Source Sans Pro';

      &:focus{
        border: 1px solid black;
      }
    }
  }
}
</style>