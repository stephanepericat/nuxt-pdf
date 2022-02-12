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
import { defineComponent, onMounted } from '@nuxtjs/composition-api'

import usePdfData from '~/composables/usePdfData'

export default defineComponent({
  name: 'IndexPage',

  setup(_, { root }) {
    const { $pdf } = root

    const onDownload = () => {
      consola.info('download...')
    }

    const onPrint = () => {
      consola.info('print...')
    }

    const { getFile } = usePdfData($pdf)

    onMounted(async () => {
      const doc = await getFile('/compressed.tracemonkey-pldi-09.pdf')
      consola.info('mounted', doc)
    })

    return {
      onDownload,
      onPrint,
    }
  },
})
</script>
<style lang="scss" scoped>
.app {
  .viewer-container {
    background-color: #666;
    height: calc(100vh - 56px);
  }
}
</style>
