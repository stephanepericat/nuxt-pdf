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
    <PdfViewer class="viewer-container">
      <PdfPage
        v-for="page in pages"
        :key="page._pageIndex"
        class="pdf-page"
        :page="page"
        rendering-type="canvas"
      />
    </PdfViewer>
  </div>
</template>

<script>
import consola from 'consola'
import {
  defineComponent,
  onMounted,
  ref,
  useContext,
} from '@nuxtjs/composition-api'

import PdfViewer from '~/components/Viewer.vue'
import PdfPage from '~/components/Page.vue'

import usePdfData from '~/composables/usePdfData'

export default defineComponent({
  name: 'IndexPage',

  components: {
    PdfPage,
    PdfViewer,
  },

  setup() {
    const { $pdf } = useContext()
    const doc = ref(null)
    const pages = ref(null)

    const onDownload = () => {
      consola.info('download...')
    }

    const onPrint = () => {
      consola.info('print...')
    }

    const { getFile, getPages } = usePdfData($pdf)

    onMounted(async () => {
      doc.value = await getFile('/compressed.tracemonkey-pldi-09.pdf')
      pages.value = await getPages(doc.value)
    })

    return {
      onDownload,
      onPrint,
      pages,
    }
  },
})
</script>
<style lang="scss" scoped>
.app {
  .viewer-container {
    height: calc(100vh - 56px);
  }

  .pdf-page {
    margin: 40px auto;
    max-width: 1200px;
  }
}
</style>
