/* rickyjordan.com — runtime.
   Reveals, split headlines, a sticky chapter panel, the pinned pipeline pan,
   count-ups, a drafting-crosshair cursor, and a magnetic pull on buttons.
   Everything scroll-linked runs transform-only inside one rAF. */
(function () {
  'use strict';
  var doc = document;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover)').matches;

  /* The intro curtain and the hero parallax both assume the page opens at the
     top; a browser-restored scroll position lands the visitor mid-page behind
     a curtain that is already animating out. Anchored entries still work —
     only a bare reload is pinned. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) scrollTo(0, 0);

  /* ---------------- fades + unveils ---------------- */
  var els = doc.querySelectorAll('[data-fade],[data-unveil]');
  if ('IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- split headlines: word-by-word mask reveal ---------------- */
  doc.querySelectorAll('[data-split]').forEach(function (el) {
    if (still) return;
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.textContent = '';
    el.classList.add('split');
    words.forEach(function (w, i) {
      var m = doc.createElement('span');
      m.className = 'wmask';
      m.setAttribute('aria-hidden', 'true');
      var inner = doc.createElement('span');
      inner.className = 'w';
      inner.style.transitionDelay = (i * 0.05) + 's';
      inner.textContent = w;
      m.appendChild(inner);
      el.appendChild(m);
      el.appendChild(doc.createTextNode(' '));
    });
    if ('IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          el.classList.add('in');
          setTimeout(function () { el.classList.add('done'); }, 900 + words.length * 50);
          so.disconnect();
        });
      }, { rootMargin: '0px 0px -10% 0px' });
      so.observe(el);
    } else { el.classList.add('in', 'done'); }
  });

  /* ---------------- signal path draws itself once in view ---------------- */
  doc.querySelectorAll('[data-fly]').forEach(function (el) {
    if (!('IntersectionObserver' in window)) { el.classList.add('in'); return; }
    var fo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { el.classList.add('in'); fo.unobserve(el); } });
    }, { threshold: 0.4 });
    fo.observe(el);
  });

  /* ---------------- count-ups ---------------- */
  var counters = doc.querySelectorAll('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (still) { el.textContent = String(target); return; }
      var t0 = null, dur = 1500;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window && !still) {
      var cco = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); cco.unobserve(e.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cco.observe(el); });
    } else { counters.forEach(runCount); }
  }

  /* ---------------- marquee: pointer position nudges playback rate ---------------- */
  doc.querySelectorAll('.tick').forEach(function (band) {
    var strip = band.querySelector('.tickrow');
    if (!strip || still || !strip.animate) return;
    var anim = strip.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
      { duration: 32000, iterations: Infinity }
    );
    band.addEventListener('pointermove', function (e) {
      var r = band.getBoundingClientRect();
      var edge = Math.abs((e.clientX - r.left) / r.width - 0.5) * 2;
      anim.playbackRate = 1 + edge * 2.2;
    });
    band.addEventListener('pointerleave', function () { anim.playbackRate = 1; });
  });

  /* ---------------- magnetic pull ---------------- */
  if (!still && fine) {
    doc.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.32;
        var y = (e.clientY - r.top - r.height / 2) * 0.32;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------------- one rAF for every scroll-linked effect ---------------- */
  var hero = doc.querySelector('.hero');
  var heroField = hero && hero.querySelector('.field');
  var heroCopy = hero && hero.querySelector('.copy');
  var bar = doc.querySelector('.bar');
  var progress = doc.querySelector('.scroll-progress');
  var chapters = doc.querySelector('.chapters');
  var entries = chapters ? Array.prototype.slice.call(chapters.querySelectorAll('.entry')) : [];
  var shots = chapters ? Array.prototype.slice.call(chapters.querySelectorAll('.shot')) : [];
  var pan = doc.querySelector('.pan');
  var panRow = pan && pan.querySelector('.panrow');
  var plx = Array.prototype.slice.call(doc.querySelectorAll('[data-plx]'));
  var litKey = null;
  var ticking = false;

  function frame() {
    var y = scrollY, vh = innerHeight;

    if (bar) bar.classList.toggle('stuck', y > 40);

    if (progress) {
      var max = doc.documentElement.scrollHeight - doc.documentElement.clientHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }

    if (hero && !still && y < hero.offsetHeight) {
      var p = y / (hero.offsetHeight || 1);
      if (heroField) heroField.style.transform = 'translateY(' + (p * 9) + '%)';
      if (heroCopy) {
        heroCopy.style.transform = 'translateY(' + (p * -13) + '%)';
        heroCopy.style.opacity = String(Math.max(0, 1 - p * 1.35));
      }
    }

    /* the chapter nearest the middle of the screen owns the panel. Resolved
       every frame rather than by an intersection band, so a fast scroll or a
       jump-to-anchor can never leave the panel showing the wrong diagram. */
    if (entries.length) {
      var mid = vh * 0.5, best = null, bestD = Infinity;
      for (var i = 0; i < entries.length; i++) {
        var r = entries[i].getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        var d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < bestD) { bestD = d; best = entries[i]; }
      }
      if (best) {
        var key = best.getAttribute('data-key');
        if (key !== litKey) {
          litKey = key;
          entries.forEach(function (en) { en.classList.toggle('lit', en === best); });
          shots.forEach(function (s) { s.classList.toggle('on', s.getAttribute('data-key') === key); });
        }
      }
    }

    if (pan && panRow && !still && innerWidth > 760) {
      var pr = pan.getBoundingClientRect();
      var total = pan.offsetHeight - vh;
      var pp = Math.min(1, Math.max(0, -pr.top / (total || 1)));
      var travel = panRow.scrollWidth - innerWidth;
      panRow.style.transform = 'translateX(' + (-pp * Math.max(0, travel)).toFixed(1) + 'px)';
    }

    if (plx.length && !still) {
      plx.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var q = ((r.top + r.height / 2) - vh / 2) / vh;
        el.style.transform = 'translateY(' + (q * parseFloat(el.getAttribute('data-plx') || 16)).toFixed(1) + 'px)';
      });
    }

    ticking = false;
  }

  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  addEventListener('resize', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  frame();
})();
