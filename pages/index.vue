<template>
  <main>
    <Slider v-if="this.$store.state.sliderOverlayShown" />
    <div
      v-hammer:swipe.left="nextPage"
      v-hammer:pan="swipeUp"
      class="grid auto-rows-fr gap-6 h-screen p-4 bg-cover"
      :style="{
        'grid-template-columns': `repeat(${pageConfig.columns}, minmax(0, 1fr))`,
        'background-color': pageConfig.background_color,
        'background-image': `url(${pageConfig.background_image})`,
      }"
    >
      <Item
        v-for="item in pageConfig.items"
        :key="item.item_name"
        :cellColor="pageConfig.box_color"
        :itemName="item.item_name"
        :label="item.label"
        :suffix="item.suffix"
        :refresh="pageConfig.refresh"
      />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { DashboardConfig, Page } from '@/types'

const emptyConfig: DashboardConfig = {"pages": [{"name": "test", "refresh": 2, "columns": 3, "background_color": "#000", "background_image": "", box_color: "#fff", "items": []}]}

declare global {
  interface Element {
      requestFullScreen?(): void;
      mozRequestFullScreen?(): void;
      webkitRequestFullscreen?(): void;
      msRequestFullscreen?(): void;
  }
}

export default Vue.extend({
  data: () => {
    return {
      dashboardConfig: emptyConfig,
      page: 0,
    }
  },
  methods: {
    loadDashboardConfig: async function() {
      const response = await fetch(localStorage.getItem("configPath") || "")
      const dashboardConfig: DashboardConfig = await response.json()
      this.dashboardConfig = dashboardConfig
    },
    swipeUp: function () {
      let elem = document.documentElement
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen()
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen()
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen()
      }
    },
    nextPage: function () {
      if (this.page === this.dashboardConfig.pages.length - 1) {
        this.page = 0
      } else {
        this.page += 1
      }
    },
  },
  mounted: function() {
    this.loadDashboardConfig()
  },
  computed: {
    pageConfig: function (): Page {
      return this.dashboardConfig.pages[this.page]
    },
  },
})
</script>
