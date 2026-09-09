/* ============================================================
   PATHAN STEEL — site behaviour
   (is file ko chhedne ki zaroorat nahi hai)
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Image fallback ----------
     Windows kabhi-kabhi download ki hui photo ka naam badal deta hai
     ("photo.jpg" -> "photo (1).jpg"). Agar image na mile to hum
     dono naam apne aap try karte hain. */
  function altNames(src) {
    var q = src.split("#")[0].split("?")[0];
    var dot = q.lastIndexOf(".");
    if (dot < 0) return [];
    var base = q.slice(0, dot), ext = q.slice(dot);
    var out = [];
    if (/ \(\d+\)$/.test(base)) out.push(base.replace(/ \(\d+\)$/, "") + ext);
    else { out.push(base + " (1)" + ext); out.push(base + " (2)" + ext); }
    return out;
  }
  document.addEventListener(
    "error",
    function (e) {
      var img = e.target;
      if (!img || img.tagName !== "IMG") return;
      var tries = img.__tries || altNames(img.getAttribute("src") || "");
      if (!tries.length) return;
      img.__tries = tries.slice(1);
      img.src = tries[0];
    },
    true
  );

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

  /* ---------- WhatsApp per-product enquiry ---------- */
  var WA_ICON =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">' +
    '<path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z"/>' +
    '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23z"/>' +
    "</svg>";

  function slug(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  var WA_NUMBER = String(C.whatsapp || "").replace(/\D/g, "");

  function waLink(p) {
    if (!WA_NUMBER) return null;
    var lines = [
      "Hello Pathan Steel 👋",
      "",
      "Mujhe ye product pasand aaya:",
      "*" + p.name + "*" + (p.category ? " (" + p.category + ")" : ""),
      "",
      "Iske bare me aur jankari chahiye."
    ];
    // live site par product ka direct link bhi bhejo (file:// par nahi)
    if (location.protocol !== "file:") {
      lines.push("", location.href.split("#")[0] + "#p=" + slug(p.name));
    }
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  function openWa(p) {
    var url = waLink(p);
    if (url) window.open(url, "_blank", "noopener");
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
              (WA_NUMBER
                ? '<button class="card__wa" data-wa="' + items.indexOf(p) +
                  '" title="Is product ke bare me poochhein" aria-label="Enquire on WhatsApp">' +
                  WA_ICON + "</button>"
                : "") +
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

    // WhatsApp button — card ka click (gallery) trigger na ho
    grid.querySelectorAll("[data-wa]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        openWa(items[parseInt(b.dataset.wa, 10)]);
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
    if (lbWa) lbWa.style.display = WA_NUMBER ? "" : "none";
  }

  // lightbox ke andar "Enquire on WhatsApp" button
  var lbWa = null;
  (function () {
    var cap = lb && lb.querySelector("figcaption");
    if (!cap || !WA_NUMBER) return;
    lbWa = document.createElement("button");
    lbWa.className = "lightbox__wa";
    lbWa.innerHTML = WA_ICON + "<span>Enquire on WhatsApp</span>";
    lbWa.addEventListener("click", function (e) {
      e.stopPropagation();
      openWa(items[pi]);
    });
    cap.appendChild(lbWa);
  })();

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

  /* ---------- Deep link: #p=product-name se seedha gallery kholo ---------- */
  function openFromHash() {
    var m = /^#p=(.+)$/.exec(location.hash || "");
    if (!m) return;
    var want = decodeURIComponent(m[1]);
    for (var i = 0; i < items.length; i++) {
      if (slug(items[i].name) === want) {
        var idx = i;
        setTimeout(function () { openLightbox(idx, 0); }, 900);
        return;
      }
    }
  }

  /* ---------- Go ---------- */
  buildFilters();
  render();
  observeReveals();
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
})();
