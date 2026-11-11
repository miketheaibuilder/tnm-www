(function(){
  function init(){
    document.querySelectorAll(".carousel--apla").forEach(function(c){
      if(c.dataset.aplaInit) return;
      c.dataset.aplaInit = "1";
      var t = c.querySelector(".carousel__track");
      if(!t) return;
      var prev = c.querySelector("[data-apla-prev]");
      var next = c.querySelector("[data-apla-next]");

      function col(){ var f = t.firstElementChild; return f ? f.getBoundingClientRect().width : 200; }
      function step(){ return window.matchMedia("(min-width: 992px)").matches ? 2 * col() : col(); }
      function upd(){
        if(prev) prev.disabled = t.scrollLeft <= 2;
        if(next) next.disabled = t.scrollLeft + t.clientWidth >= t.scrollWidth - 2;
      }

      if(prev) prev.addEventListener("click", function(){ t.scrollBy({left: -step(), behavior: "smooth"}); });
      if(next) next.addEventListener("click", function(){ t.scrollBy({left: step(), behavior: "smooth"}); });
      t.addEventListener("scroll", upd, {passive: true});
      window.addEventListener("resize", upd);
      new MutationObserver(upd).observe(t, {childList: true});

      var down = false, moved = false, sx = 0, sl = 0;
      t.addEventListener("pointerdown", function(e){
        if(e.pointerType !== "mouse" || e.button !== 0) return;
        down = true; moved = false; sx = e.clientX; sl = t.scrollLeft;
      });
      window.addEventListener("pointermove", function(e){
        if(!down) return;
        var dx = e.clientX - sx;
        if(!moved && Math.abs(dx) > 5){ moved = true; t.classList.add("is-drag"); }
        if(moved) t.scrollLeft = sl - dx;
      });
      window.addEventListener("pointerup", function(){
        if(!down) return;
        down = false;
        if(!moved) return;
        t.classList.remove("is-drag");
        var w = col();
        t.scrollTo({left: Math.round(t.scrollLeft / w) * w, behavior: "smooth"});
      });
      t.addEventListener("click", function(e){
        if(moved){ e.stopPropagation(); e.preventDefault(); moved = false; }
      }, true);

      upd();
    });
  }
  if(document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
