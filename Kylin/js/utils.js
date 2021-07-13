const btf = {
  sidebarPaddingR: () => {
    const innerWidth = window.innerWidth
    const clientWidth = document.body.clientWidth
    const paddingRight = innerWidth - clientWidth
    if (innerWidth !== clientWidth) {
      document.body.style.paddingRight = paddingRight + 'px'
    }
  },

  fadeIn: (ele, time) => {
    ele.style.cssText = `display:block;animation: to_show ${time}s`
  },
  fadeOut: (ele, time) => {
    console.log("触发")
    ele.addEventListener('animationend', function f () {
      ele.style.cssText = "display: none; animation: '' "
      ele.removeEventListener('animationend', f)
    })
    ele.style.animation = `to_hide ${time}s`
  },

}
