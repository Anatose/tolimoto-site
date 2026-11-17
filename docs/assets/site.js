// Tolimoto site: remembered language, menu closing, install tabs, solid top bar, reveal on scroll
(function () {
  // a language picked from the menu is remembered, so the English home page stops redirecting
  document.querySelectorAll('.langs a[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () { try { localStorage.setItem('tl-site-lang', a.getAttribute('data-lang')) } catch (e) {} })
  })
  var menu = document.querySelector('.langs')
  document.addEventListener('click', function (e) { if (menu && menu.open && !menu.contains(e.target)) menu.open = false })
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu) menu.open = false })

  // install guide: iPhone / Android tabs; Android phones start on their own tab
  var tabs = [].slice.call(document.querySelectorAll('.os-tabs [role=tab]'))
  function pick(tab) {
    tabs.forEach(function (t) {
      var on = t === tab
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1
      var panel = document.getElementById(t.getAttribute('aria-controls'))
      if (panel) { panel.hidden = !on; if (on) panel.querySelectorAll('.rv').forEach(function (e) { e.classList.add('in') }) }
    })
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t) })
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; pick(n); n.focus() }
    })
  })
  if (tabs.length && /android/i.test(navigator.userAgent)) pick(tabs[1])

  var bar = document.getElementById('bar')
  function onScroll() { if (bar && !bar.classList.contains('fixed-solid')) bar.classList.toggle('solid', window.scrollY > 20 || document.body.classList.contains('doc-page')) }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll()

  var els = document.querySelectorAll('.rv')
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in') }); return }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
  els.forEach(function (e) { io.observe(e) })
})()
