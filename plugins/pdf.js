import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'

export default (ctx) => {
  pdfjs.GlobalWorkerOptions.workerSrc = ctx.$config.workerSrc
  ctx.$pdf = pdfjs
}
