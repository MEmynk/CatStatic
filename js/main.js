/* ============================================================
   PATHAN STEEL — site behaviour
   (is file ko chhedne ki zaroorat nahi hai)
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      var p = document.getElementById("preloader");
      if (p) p.classList.add("is-done");
    }, 550);
  });

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Company details ---------- */
  var C = typeof COMPANY !== "undefined" ? COMPANY : {};
  var phoneText = document.getElementById("phoneText");
  var addressText = document.getElementById("addressText");
  var contactPhone = document.getElementById("contactPhone");
  var contactWa = document.getElementById("contactWhatsapp");
  var mapsLink = document.getElementById("mapsLink");

  if (C.phone && phoneText) phoneText.textContent = C.phone;
  if (C.phone && contactPhone) contactPhone.href = "tel:" + C.phone.replace(/[^\d+]/g, "");
  if (C.address && addressText) addressText.textContent = C.address;
  if (C.whatsapp && contactWa) {
    contactWa.href =
      "https://wa.me/" + C.whatsapp +
      "?text=" + encodeURIComponent("Hello Pathan Steel, I saw your catalogue and would like a quote.");
  }
  if (C.address && mapsLink) {
    mapsLink.style.cursor = "pointer";
    mapsLink.addEventListener("click", function () {
      window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.address), "_blank");
    });
  }

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-stuck", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("is-open");
      navLinks.classList.toggle("is-open");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navToggle.classList.remove("is-open");
        navLinks.classList.remove("is-open");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.setProperty("--d", e.target.dataset.delay || 0);
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  function observeReveals() {
    document.querySelectorAll(".reveal:not(.is-in)").forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- Products ---------- */
  var grid = document.getElementById("grid");
  var gridEmpty = document.getElementById("gridEmpty");
  var filtersBox = document.getElementById("filters");
  var items = typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS) ? PRODUCTS : [];
  var cats = typeof CATEGORIES !== "undefined" && Array.isArray(CATEGORIES) ? CATEGORIES : [];
  var current = "All";

  // sirf wahi categories dikhao jinme product hai
  var usedCats = cats.filter(function (c) {
    return items.some(function (p) { return p.category === c; });
  });
  items.forEach(function (p) {
    if (p.category && usedCats.indexOf(p.category) === -1) usedCats.push(p.category);
  });

  function buildFilters() {
    if (!filtersBox) return;
    if (!items.length) return;
    var all = ["All"].concat(usedCats);
    filtersBox.innerHTML = "";
    all.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "filter" + (c === current ? " is-active" : "");
      b.textContent = c;
      b.addEventListener("click", function () {
        current = c;
        filtersBox.querySelectorAll(".filter").forEach(function (x) { x.classList.remove("is-active"); });
        b.classList.add("is-active");
        render();
      });
      filtersBox.appendChild(b);
    });
  }

  function visible() {
    return current === "All"
      ? items
      : items.filter(function (p) { return p.category === current; });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  function render() {
    if (!grid) return;
    var list = visible();

    if (!items.length) {
      grid.innerHTML = "";
      if (gridEmpty) gridEmpty.hidden = false;
      return;
    }
    if (gridEmpty) gridEmpty.hidden = true;

    grid.innerHTML = list
      .map(function (p, i) {
        var imgs = Array.isArray(p.images) ? p.images : [];
        var cover = imgs[0] || "";
        var count = imgs.length;
        return (
          '<article class="card" data-index="' + items.indexOf(p) + '" style="animation-delay:' + i * 70 + 'ms">' +
            '<div class="card__media">' +
              (cover ? '<img src="' + esc(cover) + '" alt="' + esc(p.name) + '" loading="lazy" />' : "") +
              '<div class="card__veil"></div>' +
              (count > 1 ? '<div class="card__count">' + count + " Photos</div>" : "") +
              '<div class="card__view"><span>View Gallery</span></div>' +
            "</div>" +
            '<div class="card__body">' +
              '<p class="card__cat">' + esc(p.category || "") + "</p>" +
              '<h3 class="card__title">' + esc(p.name) + "</h3>" +
              (p.description ? '<p class="card__desc">' + esc(p.description) + "</p>" : "") +
            "</div>" +
          "</article>"
        );
      })
      .join("");

    grid.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("click", function () {
        openLightbox(parseInt(card.dataset.index, 10), 0);
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbTitle = document.getElementById("lbTitle");
  var lbDesc = document.getElementById("lbDesc");
  var lbCount = document.getElementById("lbCount");
  var pi = 0, ii = 0;

  function currentImages() {
    var p = items[pi];
    return p && Array.isArray(p.images) ? p.images : [];
  }

  function paint() {
    var p = items[pi];
    if (!p || !lb) return;
    var imgs = currentImages();
    if (!imgs.length) return;
    lbImg.classList.remove("is-shown");
    var src = imgs[ii];
    var tmp = new Image();
    tmp.onload = function () {
      lbImg.src = src;
      lbImg.alt = p.name;
      requestAnimationFrame(function () { lbImg.classList.add("is-shown"); });
    };
    tmp.onerror = function () {
      lbImg.src = src;
      lbImg.classList.add("is-shown");
    };
    tmp.src = src;

    lbTitle.textContent = p.name;
    lbDesc.textContent = p.description || "";
    lbCount.textContent = imgs.length > 1 ? ii + 1 + " / " + imgs.length : "";
    document.getElementById("lbPrev").style.display = imgs.length > 1 ? "" : "none";
    document.getElementById("lbNext").style.display = imgs.length > 1 ? "" : "none";
  }

  function openLightbox(productIndex, imageIndex) {
    pi = productIndex;
    ii = imageIndex || 0;
    paint();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function step(dir) {
    var imgs = currentImages();
    if (imgs.length < 2) return;
    ii = (ii + dir + imgs.length) % imgs.length;
    paint();
  }

  if (lb) {
    document.getElementById("lbClose").addEventListener("click", closeLightbox);
    document.getElementById("lbPrev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    document.getElementById("lbNext").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });

    // swipe on mobile
    var sx = 0;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ---------- Light image protection ---------- */
  document.addEventListener("contextmenu", function (e) {
    if (e.target.tagName === "IMG") e.preventDefault();
  });
  document.addEventListener("dragstart", function (e) {
    if (e.target.tagName === "IMG") e.preventDefault();
  });

  /* ---------- Go ---------- */
  buildFilters();
  render();
  observeReveals();
})();
