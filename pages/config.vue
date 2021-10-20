<template>
  <main
    class="
      bg-black
      h-screen
      text-center
      p-8
      md:p-32 md:pr-64 md:pl-64
      text-white
      space-y-4
    "
  >
    <input
      v-model="baseURL"
      class="bg-gray-800 h-8 w-full rounded-md pl-2"
      placeholder="Enter base url of openhab API. Ex.: http://openhab.local/rest (no end slash)"
    />
    <input
      v-model="configPath"
      class="bg-gray-800 h-8 w-full rounded-md pl-2"
      placeholder="Enter path to config file. Ex. livingroom.json"
    />
    <button @click="submitConfigPath" class="w-full bg-blue-700 rounded-md h-8">
      Save
    </button>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => {
    return {
      baseURL: '',
      configPath: '',
    }
  },
  methods: {
    submitConfigPath: function () {
      localStorage.setItem('baseURL', this.baseURL)
      localStorage.setItem('configPath', this.configPath)

      this.$router.push('/')
    },
  },
  mounted: function () {
    this.baseURL = localStorage.getItem('baseURL') || ''
    this.configPath = localStorage.getItem('configPath') || ''
  },
})
</script>
