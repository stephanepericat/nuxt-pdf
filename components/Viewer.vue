<template>
  <div ref="viewer" class="pdf-viewer">
    <slot />
  </div>
</template>
<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { throttledWatch, useScroll } from '@vueuse/core'

export default defineComponent({
  name: 'PDFViewer',

  emits: ['scroll'],

  setup(_, { emit }) {
    const viewer = ref(null)
    const { x, y, isScrolling, arrivedState, directions } = useScroll(viewer)

    throttledWatch(
      [x, y, isScrolling, arrivedState, directions],
      () => emit('scroll', { x, y, isScrolling, arrivedState, directions }),
      { throttle: 250 }
    )

    return {
      viewer,
    }
  },
})
</script>
<style lang="scss" scoped>
.pdf-viewer {
  background-color: #666;
  height: 100%;
  overflow: auto;
}
</style>
