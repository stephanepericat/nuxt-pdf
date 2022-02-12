import { ref } from '@nuxtjs/composition-api'

export default ($pdf) => {
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

  return {
    getBase64,
    getFile,
    getPages,
  }
}
