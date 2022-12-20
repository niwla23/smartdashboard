<template>
  <main class="">
    <link rel="stylesheet" :href="stylesheetUrl" />
    <Slider v-if="$store.state.sliderOverlayShown" />
    <Colorpicker v-if="$store.state.colorpickerOverlayShown" />
    <div class="smartdashboard-bg h-screen flex flex-row gap-0" :data-page-name="pageConfig.name">
      <aside class="flex flex-col gap-2">
        <button v-for="(p, i) in dashboardConfig.pages" :key="i" class="smartdashboard-page-button w-16" :class="{'smartdashboard-page-button-active': i === page}" @click="page = i">
          <img :src="p.icon" />
        </button>
        <div class="flex-grow" />
        <button class="smartdashboard-page-button" @click="swipeUp">
        <img src="/icons/fullscreen.svg" />
        </button>
      </aside>
      <div v-hammer:swipe.left="nextPage" v-hammer:pan="swipeUp"
        class="grid auto-rows-fr gap-6 h-full bg-cover flex-grow smartdashboard-grid" :style="{
            'grid-template-columns': `repeat(${pageConfig.columns}, minmax(0, 1fr))`,
        }">
        <Item v-for="item in pageConfig.items" :key="item.item_name" :item-name="item.item_name" :label="item.label"
          :suffix="item.suffix" :refresh="pageConfig.refresh" :digits="item.digits" :value="itemStates.get(item.item_name) || '0'" />
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
      stylesheetUrl: '',
      itemStates: new Map<string, string>()
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

    const evtSource = new EventSource("https://openhab.b49.cloudserver.click/rest/events");
    evtSource.onmessage = this.handleEvent
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
    handleEvent(event: MessageEvent) {
      const data = JSON.parse(event.data)
      const payload = JSON.parse(data.payload)
      if (data.type === "ItemStateEvent") {
        const itemName = data.topic.split("/")[2]
        this.itemStates.set(itemName, payload.value)
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
  },
})
</script>
