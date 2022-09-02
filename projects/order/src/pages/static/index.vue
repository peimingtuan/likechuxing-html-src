<template>
  <iframe id="iframe" :src=src></iframe>
</template>

<script>
  import PAGE from '../../common/pageAddress'
  export default {
    data () {
      return {
        title: '',
        src: ''
      }
    },
    methods: {},
    components: {},
    created: function () {
      let query = getQuery(window.location.hash)
      this.title = PAGE[query.page].title
      this.src = PAGE[query.page].src
      setVchatTitle(this.title)
    }
  }

  function setVchatTitle (title, img) {
    if (title === undefined || window.document.title === title) {
      return
    }
    document.title = title
    var mobile = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(mobile)) {
      var iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      // 替换成站标favicon路径或者任意存在的较小的图片即可
      iframe.setAttribute('src', img || '/favicon.ico')
      var iframeCallback = function () {
        setTimeout(function () {
          iframe.removeEventListener('load', iframeCallback)
          document.body.removeChild(iframe)
        }, 0)
      }
      iframe.addEventListener('load', iframeCallback)
      document.body.appendChild(iframe)
    }
  }

  function getQuery (str) {
    let query = {}
    str.split('?')[1].split('&').forEach(item => {
      let _item = item.split('=')
      query[_item[0]] = decodeURI(_item[1])
    })
    return query
  }
</script>

<style scoped>
  #iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
