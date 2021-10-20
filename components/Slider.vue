<template>
  <div
    class="fixed width-full h-full inset-0"
    style="background-color rgba(0, 0, 0)"
  >
    <section v-hammer:tap="close" class="flex flex-col justify-center h-screen p-8">
      <div class="bg-black p-4 pt-5 rounded-lg">
        <input
          class="w-full h-16 slider"
          type="range"
          min="1"
          max="100"
          v-model="value"
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
  data: function () {
    return { value: 0 }
  },
  mounted: function() {
    this.value = Number(this.$store.state.currentItemState)
  },
  methods: {
    sendCommand: async function () {
      let itemName: string = this.$store.state.currentItem
      const _data = await fetch(
        `${localStorage.getItem('baseURL')}/items/${itemName}`,
        { method: 'POST', body: this.value.toString() }
      )
      this.$store.commit('setSliderOverlayShow', false)
    },
    close: function() {
      this.$store.commit('setSliderOverlayShow', false)
    }
  },
})
</script>

<style>
.slider {
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
}
</style>
