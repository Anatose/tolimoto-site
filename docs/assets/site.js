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

  // install pictures open large, with previous / next step
  var lb = document.getElementById('lightbox')
  if (lb) {
    var stage = lb.querySelector('.lb-stage'), cap = lb.querySelector('figcaption')
    var prev = lb.querySelector('.lb-prev'), next = lb.querySelector('.lb-next'), list = [], at = 0, opener = null
    function fit() {
      var m = stage.firstElementChild; if (!m) return
      var z = Math.min((window.innerHeight - (window.innerWidth < 600 ? 270 : 190)) / (200 * 17 / 9), (window.innerWidth - (window.innerWidth < 600 ? 48 : 180)) / 200)
      z = Math.max(1, Math.min(z, 3.2))
      stage.style.zoom = z
    }
    function show(i) {
      at = i
      var li = list[i]
      stage.innerHTML = ''; stage.appendChild(li.querySelector('.mock').cloneNode(true))
      cap.innerHTML = li.querySelector('.st-txt').innerHTML
      prev.disabled = i === 0; next.disabled = i === list.length - 1
      fit()
    }
    function close() { lb.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus() }
    document.querySelectorAll('.steps .zoom').forEach(function (b) {
      b.addEventListener('click', function () {
        list = [].slice.call(b.closest('.steps').children); opener = b
        lb.hidden = false; document.body.style.overflow = 'hidden'
        show(list.indexOf(b.closest('li'))); lb.querySelector('.lb-close').focus()
      })
    })
    prev.addEventListener('click', function () { if (at > 0) show(at - 1) })
    next.addEventListener('click', function () { if (at < list.length - 1) show(at + 1) })
    lb.querySelector('.lb-close').addEventListener('click', close)
    lb.addEventListener('click', function (e) { if (e.target === lb) close() })
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft' && at > 0) show(at - 1)
      if (e.key === 'ArrowRight' && at < list.length - 1) show(at + 1)
    })
    window.addEventListener('resize', fit)
  }

  // guide: highlight the section being read in the table of contents
  var toc = [].slice.call(document.querySelectorAll('.g-toc a'))
  if (toc.length && 'IntersectionObserver' in window) {
    var secs = toc.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)) }).filter(Boolean)
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) toc.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id) }) })
    }, { rootMargin: '-30% 0px -60% 0px' })
    secs.forEach(function (s) { tio.observe(s) })
  }

  // beta sign-up form → Apps Script web app
  var bf = document.querySelector('.beta-form')
  if (bf) bf.addEventListener('submit', function (e) {
    e.preventDefault()
    var d = bf.dataset, msg = bf.querySelector('.beta-msg'), btn = bf.querySelector('button')
    var email = bf.email.value.trim()
    function say(text, cls) { msg.textContent = text; msg.className = 'beta-msg' + (cls ? ' ' + cls : '') }
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) { say(d.invalid, 'bad'); bf.email.focus(); return }
    if (!bf.consent.checked) { say(d.consent, 'bad'); return }
    btn.disabled = true; say(d.wait)
    var body = new URLSearchParams({ email: email, consent: '1', company: bf.company.value, lang: d.lang, page: location.pathname })
    fetch(bf.action, { method: 'POST', body: body })
      .then(function (r) { return r.json() })
      .then(function (r) {
        if (r.status === 'new' || r.status === 'exists') { bf.classList.add('done'); say(r.status === 'new' ? d.new : d.exists, 'ok'); return }
        say(d[r.status] || d.error, 'bad')
      })
      .catch(function () { say(d.error, 'bad') })
      .then(function () { btn.disabled = false })
  })

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
