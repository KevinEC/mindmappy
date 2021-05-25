<template>
    <div class="resetBtnRoot">
        <button class="resetBtn" @click="togglePrompt">
            reset data
        </button>
        <div v-if="promptComputed" id="prompt">
            <p>Are you sure you want to reset your mindmap?</p>
            <button @click="resetLocalStorage">Yes, clear data</button>
            <button @click="togglePrompt">No</button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            prompt: false
        }
    },
    computed: {
        promptComputed(){
            return this.prompt;
        }
    },
    methods: {
        resetLocalStorage(){
            window.localStorage.clear();
            this.prompt = false;
        },
        togglePrompt(){
            this.prompt = !this.prompt;
            console.log("prompt", this.prompt)
        }
    }
}
</script>

<style lang="scss">
.resetBtnRoot{
    position: absolute;
    bottom: 0;
    right: 0;

    .resetBtn{
        margin: 10px;
    }

    #prompt{
        width: 200px;
        padding: 20px;
        border-radius: 5px;
        background-color: white;
        border: 1px solid #eaeaea;
        position: absolute;
        top: -55vh;
        left: -50vw;
    }
}
</style>