(function () {
  function capLastRow() {
    var rows = document.querySelectorAll(".photo-row");
    if (rows.length < 2) return;
    var last = rows[rows.length - 1];
    if (last.children.length >= 3) return;
    var prev = rows[rows.length - 2];
    var cap = Math.round(prev.getBoundingClientRect().height);
    if (!(cap > 0)) return;
    last.querySelectorAll("a, img").forEach(function (el) {
      el.style.maxHeight = cap + "px";
    });
  }

  function whenReady() {
    var images = document.querySelectorAll(".photo-gallery img");
    var pending = images.length;
    if (!pending) {
      capLastRow();
      return;
    }
    function done() {
      pending -= 1;
      if (pending <= 0) capLastRow();
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
    timer = setTimeout(capLastRow, 80);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", whenReady);
  } else {
    whenReady();
  }
})();
