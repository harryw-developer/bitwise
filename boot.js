/* Start-up watchdog: runs before anything else. If Bitwise hasn't started within 12 seconds, or one of its scripts
   fails to download (slow or filtered networks), say so and offer a reload instead of spinning for ever. */
(function () {
  var shown = false;
  function stuck(msg) {
    if (window.BW_BOOTED || shown) return; shown = true;
    var v = document.getElementById("view"); if (!v) return;
    v.innerHTML = '<div class="splash" role="alert"><h2>' + msg + '</h2><p class="muted">Check your internet connection, then reload.</p><button class="cta" id="bootReload">Reload</button></div>';
    document.getElementById("bootReload").onclick = function () { location.reload(); };
  }
  window.addEventListener("error", function (e) { var t = e.target; if (t && t.tagName === "SCRIPT") stuck("Bitwise couldn't finish loading"); }, true);
  setTimeout(function () { stuck("Bitwise is taking too long to load"); }, 12000);
})();
