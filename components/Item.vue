<template>
  <section class="w-full h-full flex justify-center smartdashboard-box"
    :class="{ 'smartdashboard-box-active': value === 'ON' }" :data-item-name="itemName" :data-item-state="value">
    <div v-hammer:tap="handleClick" class="h-full w-full flex flex-col justify-center font-sans text-center">
      <div class="leading-none">
        <div class="text-2xl md:text-4xl xl:text-5xl">{{ label }}</div>
        <div class="text-4xl md:text-6xl xl:text-8xl font-bold">
          <animated-number v-if="/^Number|^Dimmer/.test(type)" :value="value.split(' ')[0].trim()" :duration="300"
            :format-value="formatValue" />
          <section v-else-if="type === 'Color'" class="w-full flex flex-row justify-center p-4">
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
  components: {
    AnimatedNumber,
  },
  props: {
    itemName: { type: String, required: true },
    label: { type: String, required: true },
    suffix: { type: String, required: true },
    digits: { type: Number, default: 0 },
    refresh: { type: Number, default: 5 },
  },

  data: () => {
    return {
      value: '0',
      timer: null,
      type: 'number',
    }
  },

  computed: {
    rgbColor(): null | string {
      if (this.type === 'Color') {
        const hsb = this.value.split(',')
        const rgb = hsbToRgb(Number(hsb[0]), Number(hsb[1]), Number(hsb[2]))
        return `rgb(${rgb.join(',')})`
      }
      return null
    },
  },

  mounted() {
    this.loadType()
    this.loadState()
    this.timer = setInterval(() => {
      this.loadState()
    }, this.refresh * 1000)
  },

  destroyed() {
    this.timer = null
  },

  methods: {
    async loadState() {
      const state = await fetch(
        `${localStorage.getItem('baseURL')}/items/${this.itemName}/state`
      )
      this.value = await state.text()
    },

    async loadType() {
      const state = await fetch(
        `${localStorage.getItem('baseURL')}/items/${this.itemName}`
      )
      const data = await state.json()
      this.type = data.type
    },

    formatValue(value: number) {
      return `${value.toFixed(this.digits)}${this.suffix || ''}`
    },

    async handleClick(event) {
      this.$store.commit('setItem', this.itemName)
      this.$store.commit('setItemState', this.value)
      if (this.type === 'Switch') {
        // switch action handling (toggle)
        const _data = await fetch(
          `${localStorage.getItem('baseURL')}/items/${this.itemName}`,
          { method: 'POST', body: this.value === 'ON' ? 'OFF' : 'ON' }
        )
        this.loadState()
      } else if (this.type === 'Dimmer') {
        // dimmer action handling (open slider)
        this.$store.commit('setSliderOverlayShown', true)
      } else if (this.type === 'Color') {
        // dimmer action handling (open slider)
        this.$store.commit('setColorpickerOverlayShown', true)
      }
    },
  },
})
</script>
