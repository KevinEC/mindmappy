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
import { mapGetters, mapActions, mapState } from 'vuex';
const TWEEN = require('@tweenjs/tween.js')

export default {
  props:{
    pos: Object
  },
  data(){
    return{
      object: null,
    }
  },
  watch: {
    newTopicPos(){
      this.createNewTopic();
    }
  },
  computed: {
    ...mapGetters([
      'getScene',
      'getCamera',
      'getGraph'
    ]),
    ...mapState(['newTopicPos']),
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
      this.initIdleAnimation();
    },
    createNewTopic(){
      this.setCreatingTopic(true);
      this.object.position.x = this.newTopicPos.x + this.getCamera.position.x;
      this.object.position.y = this.newTopicPos.y + this.getCamera.position.y;
      this.object.visible = true;
      // ??? element isn't created when called
      setTimeout(() => {
        this.$el.querySelector(".createInput").focus();
      }, 50);
    },
    submitNewTopic(e){
      e.preventDefault();
      let value = e.target[0].value;
      let id = value + (this.object.position.x.toFixed(0)) + (this.object.position.y.toFixed(0));
      this.pushTopic({
        title: value,
        floating: false,
        born: true,
        id: id,
        pos: {
          x: this.object.position.x,
          y: this.object.position.y
        },
        connections: []
      });
      console.log(this.getGraph.newNode({id}));
      this.setCreatingTopic(false);
      this.$el.querySelector(".createInput").value = "";
      this.object.visible = false;
    },
    blur(){
      this.setCreatingTopic(false);
      this.$el.querySelector(".createInput").value = "";
      this.object.visible = false;
    },
    initIdleAnimation(){
      new TWEEN.Tween({scaleX: 0.95})
        .to({scaleX: 1.055}, 1250)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .repeat(Infinity)
        .yoyo(true)
        .onUpdate((object) => {
          this.object.scale.x = object.scaleX;
        })
        .start();

      new TWEEN.Tween({scaleY: 0.955})
        .to({scaleY: 1.04}, 1250)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .repeat(Infinity)
        .yoyo(true)
        .delay(150)
        .onUpdate((object) => {
          this.object.scale.y = object.scaleY;
        })
        .start();

    },
  }

}
</script>

<style lang="scss">

.newTopic{

  .form{
    width: 100px;
    height: 100px;
    padding: 10px;
    border-radius: 100%;
    border: 1px solid rgba(var(--create-color), 0.4);
    box-shadow: 0 0 10px rgba(var(--create-color), 0.2),
                0 0 23px rgba(var(--create-color), 0.1),
                0 0 43px rgba(var(--create-color), 0.09);
    display: flex;
    justify-content: center;
    align-items: center;

    .createInput{
      border: none;
      width: 90px;
      border-radius: 0;
      font-family: 'Source Sans Pro';

      &:focus {
        outline: none;
        border: none;
        border-bottom: 1px solid black;
      }
    }
  }
}
</style>