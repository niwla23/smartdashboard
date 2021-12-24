<template>
  <div
    class="fixed width-full h-full inset-0"
    style="background-color: rgba(20, 20, 20, 0.5)"
  >
    <section class="flex flex-col justify-center h-screen p-8">
      <div class="bg-gray-900 rounded-lg h-auto p-4">
        <div class="p-4 pt-5 flex flex flex-row flex-wrap justify-center">
          <button
            v-for="currentColor in colors"
            :key="currentColor.toString()"
            :style="{
              backgroundColor: colorToString(currentColor),
            }"
            class="w-20 h-20 rounded-full m-2"
            @click="selectColor(currentColor)"
          />
        </div>
        <input
          v-model="brightness"
          class="w-full"
          type="range"
          min="0"
          max="100"
        />
        <button
          class="rounded-lg p-2 text-lg w-full h-16 mt-8"
          :style="{ backgroundColor: colorToString(color) }"
          @click="close"
        >
          Select
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import rgbToHsb from '~/helpers/rgbToHsb'
import hsbToRgb from '~/helpers/hsbToRgb'

export default Vue.extend({
  data() {
    return {
      color: [0, 0, 0], // rgb
      brightness: 100,
      colors: [
        [0, 0, 0],
        [255, 0, 0],
        [0, 255, 0],
        [0, 0, 255],
        [255, 255, 0],
        [255, 200, 0],
        [255, 100, 0],
        [255, 0, 255],
        [80, 80, 80],
        [0, 255, 255],
        [0, 100, 255],
        [0, 255, 100],
      ],
    }
  },
  watch: {
    brightness() {
      this.color = this.applyBrightnessToColor(this.color)
    },
    async color() {
      const itemName: string = this.$store.state.currentItem
      const _data = await fetch(
        `${localStorage.getItem('baseURL')}/items/${itemName}`,
        {
          method: 'POST',
          body: rgbToHsb(this.color[0], this.color[1], this.color[2]).join(','),
        }
      )
    },
  },

  mounted() {
    this.brightness = rgbToHsb(this.color[0], this.color[1], this.color[2])[2]
    this.color = this.itemStateToRgb(this.$store.state.currentItemState)
  },
  methods: {
    selectColor(color: number[]) {
      this.color = this.applyBrightnessToColor(color)
    },
    applyBrightnessToColor(color: number[]) {
      // take color, convert it to hsb, set brightness, convert to rgb, return
      const hsb = rgbToHsb(color[0], color[1], color[2])
      hsb[2] = this.brightness
      return hsbToRgb(hsb[0], hsb[1], hsb[2])
    },
    colorToString(color: number[]) {
      const processed_color = this.applyBrightnessToColor(color)
      return `rgb(${processed_color[0]},${processed_color[1]},${processed_color[2]})`
    },
    itemStateToRgb(state: string) {
      const split = state.split(',')
      const h = Number(split[0])
      const s = Number(split[1])
      const v = Number(split[2])
      return hsbToRgb(h, s, v)
    },
    close() {
      this.$store.commit('setColorpickerOverlayShown', false)
    },
  },
})
</script>
