<template>
  <main
    class="bg-black h-screen text-center p-8 md:p-32 md:pr-64 md:pl-64 text-white space-y-4"
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
    <input
      v-model="themePath"
      class="bg-gray-800 h-8 w-full rounded-md pl-2"
      placeholder="Enter path to stylesheeit. Ex. themes/dark.css"
    />
    <button class="w-full bg-blue-700 rounded-md h-8" @click="submitConfigPath">
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
      themePath: '',
    }
  },
  mounted() {
    this.baseURL = localStorage.getItem('baseURL') || ''
    this.configPath = localStorage.getItem('configPath') || ''
    this.themePath = localStorage.getItem('themePath') || ''
  },
  methods: {
    submitConfigPath() {
      localStorage.setItem('baseURL', this.baseURL)
      localStorage.setItem('configPath', this.configPath)
      localStorage.setItem('themePath', this.themePath)

      this.$router.push('/')
    },
  },
})
</script>
