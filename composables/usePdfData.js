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

  const renderSvg = async (page) => {
    const viewport = page.getViewport({ scale: $pdf.PixelsPerInch.CSS })
    const opList = await page.getOperatorList({
      annotationMode: $pdf.AnnotationMode.ENABLED_FORMS,
    })
    const svgGfx = new $pdf.SVGGraphics(page.commonObjs, page.objs, true)

    const svg = await svgGfx.getSVG(opList, viewport)
    svg.style.width = '100%'
    svg.style.height = '100%'
    svg.classList.add('render')

    return svg
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

  const renderTextLayer = async (page) => {
    const SVG_NS = 'http://www.w3.org/2000/svg'
    const textContent = await page.getTextContent()
    const viewport = page.getViewport({ scale: $pdf.PixelsPerInch.CSS })

    const svg = document.createElementNS(SVG_NS, 'svg:svg')
    svg.setAttribute('width', viewport.width + 'px')
    svg.setAttribute('height', viewport.height + 'px')
    // items are transformed to have 1px font size
    svg.setAttribute('font-size', 1)

    // processing all items
    textContent.items.forEach(function (textItem) {
      // we have to take in account viewport transform, which includes scale,
      // rotation and Y-axis flip, and not forgetting to flip text.
      const tx = $pdf.Util.transform(
        $pdf.Util.transform(viewport.transform, textItem.transform),
        [1, 0, 0, -1, 0, 0]
      )
      const style = textContent.styles[textItem.fontName]
      // adding text element
      const text = document.createElementNS(SVG_NS, 'svg:text')
      text.setAttribute('transform', 'matrix(' + tx.join(' ') + ')')
      text.setAttribute('font-family', style.fontFamily)
      text.textContent = textItem.str
      svg.appendChild(text)
      svg.classList.add('text-overlay')
      svg.setAttribute('viewBox', `0 0 ${viewport.width} ${viewport.height}`)
    })
    return svg
  }

  return {
    getBase64,
    getFile,
    getPages,
    renderPage,
    renderTextLayer,
  }
}
