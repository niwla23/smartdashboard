<template>
  <section
    class="w-full h-full bg-white rounded-lg flex justify-center"
    :style="{ 'background-color': cellColor }"
  >
    <div
      v-hammer:tap="handleClick"
      class="
        h-full
        w-full
        flex flex-col
        justify-center
        font-sans
        text-white text-center
      "
    >
      <div class="leading-none">
        <div class="text-4xl">{{ label }}</div>
        <div class="text-6xl font-bold">
          <animated-number
            v-if="type === 'Number' || type === 'Dimmer'"
            :value="value"
            :duration="300"
            :formatValue="formatValue"
          />
          <section class="w-full flex flex-row justify-center p-4" v-else-if="type === 'Color'">
            <figure class="w-40 h-40 rounded-full" :style="{ 'background-color': rgbColor }" />
          </section>
          <p v-else>{{ value.toString() + (suffix || '') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import AnimatedNumber from 'animated-number-vue'
import hsbToRgb from '@/helpers/hsbToRgb'

export default Vue.extend({
  props: {
    cellColor: String,
    itemName: String,
    label: String,
    suffix: String,
    refresh: Number,
  },

  components: {
    AnimatedNumber,
  },

  data: () => {
    return {
      value: '0',
      timer: null,
      type: 'number',
    }
  },

  methods: {
    loadState: async function () {
      const state = await fetch(
        `${localStorage.getItem('baseURL')}/items/${this.itemName}/state`
      )
      this.value = await state.text()
    },

    loadType: async function () {
      const state = await fetch(
        `${localStorage.getItem('baseURL')}/items/${this.itemName}`
      )
      const data = await state.json()
      this.type = data.type
    },

    formatValue: function (value: number) {
      return `${value.toFixed(0)}${this.suffix || ''}`
    },

    handleClick: async function (event) {
      if (this.type === 'Switch') {
        // switch action handling (toggle)
        const _data = await fetch(
          `${localStorage.getItem('baseURL')}/items/${this.itemName}`,
          { method: 'POST', body: this.value === 'ON' ? 'OFF' : 'ON' }
        )
        this.loadState()
      } else if (this.type === 'Dimmer') {
        // dimmer action handling (open slider)
        this.$store.commit('setItem', this.itemName)
        this.$store.commit('setItemState', this.value)
        this.$store.commit('setSliderOverlayShow', true)
      }
    },
  },

  mounted: function () {
    this.loadType()
    this.loadState()
    this.timer = setInterval(() => {
      this.loadState()
    }, this.refresh * 1000)
  },

  computed: {
    rgbColor: function (): null | string {
      if (this.type === 'Color') {
        let hsb = this.value.split(',')
        let rgb = hsbToRgb(Number(hsb[0]), Number(hsb[1]), Number(hsb[2]))
        return `rgb(${rgb.join(',')})`
      }
      return null
    },
  },

  destroyed: function () {
    this.timer = null
  },
})
</script>
