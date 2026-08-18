(function () {
  function layoutGallery() {
    var gallery = document.querySelector(".photo-gallery");
    if (!gallery) return;

    var items = Array.prototype.slice.call(gallery.querySelectorAll("a"));
    if (!items.length) return;

    var styles = window.getComputedStyle(gallery);
    var gap = parseFloat(styles.columnGap || styles.gap) || 4;
    var width = gallery.clientWidth;
    if (width < 1) return;

    var target = Math.round(Math.min(360, Math.max(150, window.innerHeight * 0.34)));
    var row = [];
    var rowAr = 0;

    function aspect(el) {
      var img = el.querySelector("img");
      if (img && img.naturalWidth > 0) return img.naturalWidth / img.naturalHeight;
      var ar = parseFloat(el.getAttribute("data-ar"));
      return ar > 0 ? ar : 1.5;
    }

    function flush(stretch) {
      if (!row.length) return;
      var totalGap = gap * (row.length - 1);
      var height = stretch ? (width - totalGap) / rowAr : target;
      row.forEach(function (el) {
        var ar = aspect(el);
        el.style.width = ar * height + "px";
        el.style.height = height + "px";
        el.style.flexGrow = "0";
        el.style.flexShrink = "0";
        el.style.flexBasis = "auto";
      });
      row = [];
      rowAr = 0;
    }

    items.forEach(function (el) {
      var ar = aspect(el);
      var nextAr = rowAr + ar;
      var nextWidth = nextAr * target + gap * row.length;
      if (row.length && nextWidth > width) flush(true);
      row.push(el);
      rowAr += ar;
    });
    flush(false);
    gallery.classList.add("is-ready");
  }

  function whenReady() {
    var images = document.querySelectorAll(".photo-gallery img");
    var pending = images.length;
    if (!pending) {
      layoutGallery();
      return;
    }
    function done() {
      pending -= 1;
      if (pending <= 0) layoutGallery();
    }
    Array.prototype.forEach.call(images, function (img) {
      if (img.complete) done();
      else {
        img.addEventListener("load", done);
        img.addEventListener("error", done);
      }
    });
  }

  var timer;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(layoutGallery, 80);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", whenReady);
  } else {
    whenReady();
  }
})();
