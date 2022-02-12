<template>
  <div ref="container" class="pdf-page">
    <div class="text-layer"></div>
  </div>
</template>
<script>
import consola from 'consola'
// eslint-disable-next-line no-unused-vars
import {
  computed,
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
    const textLayer = computed(
      () => container.value?.querySelector('.text-layer') || null
    )
    const { $pdf } = useContext()

    const { page, renderingType } = toRefs(props)

    const { renderPage } = usePdfData($pdf)

    onMounted(async () => {
      try {
        const view = await renderPage(page.value, renderingType.value)
        container.value.insertBefore(view, textLayer.value)
      } catch (e) {
        consola.error(e)
      }
    })

    return {
      container,
      textLayer,
    }
  },
})
</script>
<style lang="scss" scoped>
.pdf-page {
  position: relative;
  background: #fff;
  margin: 40px auto;
  max-width: 1200px;
}
</style>
