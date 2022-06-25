<template>
  <main>
    <link rel="stylesheet" :href="stylesheetUrl" />
    <Slider v-if="$store.state.sliderOverlayShown" />
    <Colorpicker v-if="$store.state.colorpickerOverlayShown" />
    <div v-hammer:swipe.left="nextPage" v-hammer:pan="swipeUp"
      class="grid auto-rows-fr gap-6 h-screen p-4 bg-cover smartdashboard-bg" :style="{
        'grid-template-columns': `repeat(${pageConfig.columns}, minmax(0, 1fr))`,
      }" :data-page-name="pageConfig.name">
      <Item v-for="item in pageConfig.items" :key="item.item_name" :item-name="item.item_name" :label="item.label"
        :suffix="item.suffix" :refresh="pageConfig.refresh" :digits="item.digits" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { DashboardConfig, Page } from '@/types'

const emptyConfig: DashboardConfig = {
  pages: [
    {
      name: 'test',
      refresh: 2,
      columns: 3,
      items: [],
    },
  ],
}

declare global {
  interface Element {
    requestFullScreen?(): void
    mozRequestFullScreen?(): void
    webkitRequestFullscreen?(): void
    msRequestFullscreen?(): void
  }
}

export default Vue.extend({
  data: () => {
    return {
      dashboardConfig: emptyConfig,
      page: 0,
      tempColor: [100, 100, 6],
      stylesheetUrl: ''
    }
  },
  computed: {
    pageConfig(): Page {
      return this.dashboardConfig.pages[this.page]
    },
  },
  mounted() {
    this.loadDashboardConfig()
    this.stylesheetUrl = localStorage.getItem('themePath')
  },
  methods: {
    async loadDashboardConfig() {
      const response = await fetch(localStorage.getItem('configPath') || '')
      const dashboardConfig: DashboardConfig = await response.json()
      this.dashboardConfig = dashboardConfig
    },
    swipeUp() {
      const elem = document.documentElement
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
    nextPage() {
      if (this.page === this.dashboardConfig.pages.length - 1) {
        this.page = 0
      } else {
        this.page += 1
      }
    },
    // getStylesheetUrl() {
    //   return ""
    // }
  },
})
</script>
