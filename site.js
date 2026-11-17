// Tolimoto site: language switch, solid top bar on scroll, reveal on scroll
(function () {
  var d = document.documentElement
  function setLang(l) {
    d.setAttribute('data-lang', l); d.lang = l
    try { localStorage.setItem('tl-site-lang', l) } catch (e) {}
    document.querySelectorAll('[data-set-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === l)) })
    var t = document.querySelector('meta[name="tl-title-' + l + '"]')
    if (t) document.title = t.content
  }
  document.querySelectorAll('[data-set-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang')) }) })
  setLang(d.getAttribute('data-lang') || 'ru')

  // the big wordmark fills the full width of the screen exactly
  var wm = document.querySelector('.wordmark b')
  function fit() {
    if (!wm) return
    var box = wm.parentElement, cs = getComputedStyle(box)
    var avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
    wm.style.fontSize = '100px'
    var w = wm.getBoundingClientRect().width
    if (w) wm.style.fontSize = (100 * avail / w).toFixed(2) + 'px'
  }
  fit(); window.addEventListener('resize', fit)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit)

  var bar = document.getElementById('bar')
  function onScroll() { if (bar) bar.classList.toggle('solid', window.scrollY > 20) }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll()

  var els = document.querySelectorAll('.rv')
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in') }); return }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  els.forEach(function (e) { io.observe(e) })
})()
