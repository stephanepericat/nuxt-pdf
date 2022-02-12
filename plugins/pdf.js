import Vue from 'vue'

import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'

export default ({ $config }) => {
  pdfjs.GlobalWorkerOptions.workerSrc = $config.workerSrc
  Vue.prototype.$pdf = pdfjs
}
