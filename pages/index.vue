<template>
  <div class="app">
    <b-navbar type="light" variant="light">
      <b-navbar-nav class="ml-auto">
        <b-nav-item @click="onDownload">
          <b-icon icon="download" />&nbsp;Download
        </b-nav-item>
        <b-nav-item @click="onPrint">
          <b-icon icon="printer" />&nbsp;Print
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <div class="viewer-container">contents</div>
  </div>
</template>

<script>
import consola from 'consola'

export default {
  name: 'IndexPage',

  methods: {
    onDownload() {
      consola.info('download...')
    },

    onPrint() {
      consola.info('print...')
    },
  },
}
</script>
<style lang="scss" scoped>
.app {
  .viewer-container {
    background-color: #999;
    height: calc(100vh - 56px);
  }
}
</style>
