<template>
  <main class="">
    <link rel="stylesheet" :href="stylesheetUrl" />
    <Slider v-if="$store.state.sliderOverlayShown" />
    <Colorpicker v-if="$store.state.colorpickerOverlayShown" />
    <div class="smartdashboard-bg h-screen flex flex-row gap-0" :data-page-name="pageConfig.name">
      <aside class="flex flex-col gap-2 w-16">
        <button class="smartdashboard-page-button" @click="page = i" v-for="(p, i) in dashboardConfig.pages" :class="{'smartdashboard-page-button-active': i === page}">
          <img :src="p.icon" />
        </button>
        <div class="flex-grow" />
        <button class="smartdashboard-page-button" @click="swipeUp">
        <img src="https://www.svgrepo.com/show/238217/expand-fullscreen.svg" />
        </button>
      </aside>
      <div v-hammer:swipe.left="nextPage" v-hammer:pan="swipeUp"
        class="grid auto-rows-fr gap-6 h-full bg-cover flex-grow smartdashboard-grid" :style="{
            'grid-template-columns': `repeat(${pageConfig.columns}, minmax(0, 1fr))`,
        }">
        <Item v-for="item in pageConfig.items" :key="item.item_name" :item-name="item.item_name" :label="item.label"
          :suffix="item.suffix" :refresh="pageConfig.refresh" :digits="item.digits" />
      </div>
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
      icon: '',
      title: 'Test',
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
      try {
        const response = await fetch(localStorage.getItem('configPath') || '')
        const dashboardConfig: DashboardConfig = await response.json()
        this.dashboardConfig = dashboardConfig
      } catch {
        alert("configuration incomplete or incorrect, you will be redirected to the config page")
        this.$router.push("/config")
      }
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
