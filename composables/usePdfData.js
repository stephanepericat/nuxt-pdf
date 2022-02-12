import { ref } from '@nuxtjs/composition-api'

export default ($pdf) => {
  const CANVAS_SCALE = 2.0

  const pageCount = ref(0)

  const getBase64 = async (str) => {
    const doc = await $pdf.getDocument({ data: atob(str) }).promise
    pageCount.value = doc.numPages
    return doc
  }

  const getFile = async (path) => {
    const doc = await $pdf.getDocument(path).promise
    pageCount.value = doc.numPages
    return doc
  }

  const getPages = async (doc) => {
    const pages = []

    for (let i = 1; i <= pageCount.value; ++i) {
      const page = await doc.getPage(i)
      pages.push(page)
    }

    return pages
  }

  const renderCanvas = async (page) => {
    const canvas = document?.createElement('canvas') || null

    if (!canvas) {
      throw new Error('Cannot create page canvas')
    }

    const viewport = page.getViewport({ scale: CANVAS_SCALE })
    const outputScale = window.devicePixelRatio || 1
    const canvasContext = canvas.getContext('2d')

    canvas.width = Math.floor(viewport.width * outputScale)
    canvas.height = Math.floor(viewport.height * outputScale)
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.classList.add('render')

    const transform =
      outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null

    try {
      await page.render({
        canvasContext,
        transform,
        viewport,
      })

      return canvas
    } catch (e) {
      throw new Error(e)
    }
  }

  const renderSvg = (page) => {
    return Promise.resolve({})
  }

  const renderPage = async (page, renderingType) => {
    try {
      const render =
        renderingType === 'svg'
          ? await renderSvg(page)
          : await renderCanvas(page)
      return render
    } catch (e) {
      throw new Error(e)
    }
  }

  return {
    getBase64,
    getFile,
    getPages,
    renderPage,
  }
}
