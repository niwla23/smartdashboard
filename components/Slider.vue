<template>
  <div
    class="fixed width-full h-full inset-0"
    style="background-color rgba(0, 0, 0)"
  >
    <section
      v-hammer:tap="close"
      class="flex flex-col justify-center h-screen p-8"
    >
      <div class="bg-black p-4 pt-5 rounded-lg">
        <input
          v-model="value"
          class="w-full h-16 slider"
          type="range"
          min="1"
          max="100"
          @touchend="sendCommand"
          @mouseup="sendCommand"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return { value: 0 }
  },
  mounted() {
    this.value = Number(this.$store.state.currentItemState)
  },
  methods: {
    async sendCommand() {
      const itemName: string = this.$store.state.currentItem
      const _data = await fetch(
        `${localStorage.getItem('baseURL')}/items/${itemName}`,
        { method: 'POST', body: this.value.toString() }
      )
      this.$store.commit('setSliderOverlayShown', false)
    },
    close() {
      this.$store.commit('setSliderOverlayShown', false)
    },
  },
})
</script>

<style scoped>
/* .slider {
  -webkit-appearance: none;
  background: rgba(0, 0, 0);
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 4rem;
  height: 100%;
  background: #04aa6d;
  cursor: pointer;
}
.slider::-moz-range-thumb {
  width: 4rem;
  height: 100%;
  background: #04aa6d;
  cursor: pointer;
} */

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #000;
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  padding: 1.5rem;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 4rem;
  height: 4rem;
  background: #04aa6d;
  cursor: pointer;
  border-radius: 1rem;
}

.slider::-moz-range-thumb {
  width: 4rem;
  height: 4rem;
  background: #04aa6d;
  cursor: pointer;
  border-radius: 1rem;
}
</style>
