

/**
 * DOM以加载
 */
document.addEventListener("DOMContentLoaded",function () {
  let blogNameWidth = document.getElementById("site_name").offsetWidth
  let menusEle = document.querySelector('.menus .menus_items');
  let menusWidth = menusEle && menusEle.offsetWidth
  console.log(blogNameWidth);
  console.log(menusEle)
  console.log(menusWidth)
  let detectFontSizeChange = false

  let adjustMenu = function () {
    if (detectFontSizeChange){
      //重新为一下元素赋值
      blogNameWidth = document.getElementById('site_name').offsetWidth
      menusWidth = menusEle && menusEle.offsetWidth
      detectFontSizeChange = false
    }
    const nav = document.getElementById("nav")
    let t
    if (window.innerWidth < 768){
      t = true
    }
    else t = blogNameWidth + menusWidth > nav.offsetWidth -120
    if (t) nav.classList.add("hide_menu")
    else nav.classList.remove("hide_menu")
  }

  let sidebarFn = function(){
    const toggleMenu = document.getElementById("toggle_menu")
    console.log(toggleMenu)
    let sidebarMenus = document.getElementById("sidebar-menus")
    console.log(sidebarMenus)
    let menuMask = document.getElementById("menu-mask")
    console.log(menuMask)
    let body = document.body
    console.log(body)

    function openMobileSidebar(){
      btf.sidebarPaddingR()
      body.style.overflow = 'hidden'
      btf.fadeIn(menuMask, 0.5)
      sidebarMenus.classList.add('open')
    }
    function closeMobileSidebar(){
      body.style.overflow = ''
      body.style.paddingRight = ''
      btf.fadeOut(menuMask, 0.5)
      sidebarMenus.classList.remove('open')
    }
    toggleMenu.addEventListener("click",openMobileSidebar)

    menuMask.addEventListener('click', e => {
      if (sidebarMenus.classList.contains('open')) {
        closeMobileSidebar()
      }
    })
  }

  let scrollFn = function(){
    let nav = document.getElementById("nav")

    window.addEventListener("scroll",function (e) {
      const currentTop = window.scrollY || document.documentElement.scrollTop
      console.log(currentTop)
      if (currentTop > 56){
        // nav.style.backgroundColor = '#fff'
      }
    })
  }
  window.refreshFn = function (){
    adjustMenu()
    sidebarFn()
  }
  refreshFn()
  scrollFn()

})
