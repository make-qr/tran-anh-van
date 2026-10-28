(function () {
  var seal = document.getElementById("seal");
  var home = document.getElementById("home");
  var nav = document.querySelector("[data-nav]");
  var box = document.getElementById("box");
  var boxImg = box.querySelector(".box-img");
  var boxCap = box.querySelector(".box-cap");

  function closeSeal() {
    if (!seal) return;
    seal.classList.add("is-gone");
    try {
      if (home) home.focus({ preventScroll: true });
    } catch (err) {}
  }

  if (location.hash === "#home") closeSeal();
  window.addEventListener("hashchange", function () {
    if (location.hash === "#home") closeSeal();
  });
  var open = seal && seal.querySelector(".seal-open");
  if (open) {
    open.addEventListener("click", function () {
      closeSeal();
    });
  }

  var onScroll = function () {
    nav.classList.toggle("is-solid", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var visible = new Map();
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        var current = "";
        var best = 0;
        visible.forEach(function (ratio, id) {
          if (ratio > best) {
            best = ratio;
            current = id;
          }
        });
        links.forEach(function (link) {
          var on = link.getAttribute("href") === "#" + current;
          if (on) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-20% 0px -45% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    sections.forEach(function (section) { io.observe(section); });
  }

  document.querySelectorAll("[data-img]").forEach(function (button) {
    button.addEventListener("click", function () {
      boxImg.src = button.getAttribute("data-img");
      boxImg.alt = button.querySelector("img").alt;
      boxCap.textContent = button.getAttribute("data-cap");
      if (typeof box.showModal === "function") box.showModal();
    });
  });

  box.querySelector("[data-close]").addEventListener("click", function () {
    box.close();
  });
  box.addEventListener("click", function (event) {
    if (event.target === box) box.close();
  });
})();
