<template>
  <div class="pdf-viewer">
    <slot />
  </div>
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'PDFViewer',

  setup() {},
})
</script>
<style lang="scss" scoped>
.pdf-viewer {
  background-color: #666;
  height: 100%;
  overflow: auto;
}
</style>
