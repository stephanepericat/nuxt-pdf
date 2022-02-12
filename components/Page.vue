<template>
  <div ref="container" class="pdf-page">
    <div ref="textLayer" class="text-layer"></div>
  </div>
</template>
<script>
import consola from 'consola'
// eslint-disable-next-line no-unused-vars
import {
  defineComponent,
  onMounted,
  ref,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api'
import usePdfData from '~/composables/usePdfData'

export default defineComponent({
  name: 'PDFPage',

  props: {
    page: { type: Object, required: true },
    renderingType: {
      type: String,
      default: 'canvas',
      validator: (v) => ['canvas', 'svg'].includes(v),
    },
  },

  setup(props) {
    const container = ref(null)
    const textLayer = ref(null)

    const { $pdf } = useContext()

    const { page, renderingType } = toRefs(props)

    const { renderPage } = usePdfData($pdf)

    const renderView = async () => {
      try {
        const view = await renderPage(page.value, renderingType.value)
        container.value.insertBefore(view, textLayer.value)
      } catch (e) {
        consola.error(e)
      }
    }

    onMounted(renderView)

    return {
      container,
      textLayer,
      renderView,
    }
  },
})
</script>
<style lang="scss" scoped>
.pdf-page {
  position: relative;
  background: #fff;

  .text-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // background: #f70;
    // opacity: 0.25;
  }
}
</style>
