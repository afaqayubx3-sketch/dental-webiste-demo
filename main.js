/* ==============================================================
   Aurelia — Private Dental Atelier
   Site interactions (extracted from index.html)

   Requires (loaded before this file in index.html):
     - GSAP 3.12.5  + ScrollTrigger
     - Lenis 1.1.13 (smooth scroll)
   All animation is gated behind prefers-reduced-motion.
   ============================================================== */

/* ============================================================
   PART 1 — Smooth scroll, nav, reveals & section interactions
   ============================================================ */
(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = !!(window.gsap);
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scrolling (Lenis) tied to ScrollTrigger ---------- */
  var lenis = null;
  if (window.Lenis && !reduce){
    lenis = new Lenis({ duration:1.1, easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t));}, smoothWheel:true });
    lenis.on('scroll', function(){ if(window.ScrollTrigger) ScrollTrigger.update(); });
    gsap.ticker.add(function(t){ lenis.raf(t*1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Anchor links go through Lenis ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if(id.length<2) return;
      var el = document.querySelector(id);
      if(!el) return;
      e.preventDefault();
      closeMenu();
      if(lenis){ lenis.scrollTo(el, {offset:-90}); }
      else { el.scrollIntoView({behavior: reduce?'auto':'smooth'}); }
    });
  });

  /* ---------- Cursor glow (signature) ---------- */
  var glow = document.querySelector('.cursor-glow');
  if(glow && !reduce && hasGSAP && !('ontouchstart' in window)){
    var gx = gsap.quickTo(glow,'x',{duration:.6,ease:'power3'});
    var gy = gsap.quickTo(glow,'y',{duration:.6,ease:'power3'});
    window.addEventListener('mousemove', function(e){ glow.style.opacity=1; gx(e.clientX); gy(e.clientY); });
    window.addEventListener('mouseout', function(){ glow.style.opacity=0; });
  }

  /* ---------- Nav scrolled state + magnetic buttons ---------- */
  var nav = document.getElementById('nav');
  function onScroll(){ if(window.scrollY>20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled'); }
  window.addEventListener('scroll', onScroll); onScroll();

  if(hasGSAP && !reduce && !('ontouchstart' in window)){
    document.querySelectorAll('.magnetic').forEach(function(btn){
      var xT = gsap.quickTo(btn,'x',{duration:.5,ease:'power3'});
      var yT = gsap.quickTo(btn,'y',{duration:.5,ease:'power3'});
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        xT((e.clientX-(r.left+r.width/2))*.35); yT((e.clientY-(r.top+r.height/2))*.45);
      });
      btn.addEventListener('mouseleave', function(){ xT(0); yT(0); });
    });
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burger');
  function closeMenu(){ document.body.classList.remove('menu-open'); burger && burger.setAttribute('aria-expanded','false'); if(lenis) lenis.start(); }
  if(burger){
    burger.addEventListener('click', function(){
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open?'true':'false');
      if(lenis){ open ? lenis.stop() : lenis.start(); }
    });
  }

  /* ============================================================
     GSAP-dependent animations
     ============================================================ */
  if(hasGSAP){

    /* ----- Hero split-text headline ----- */
    var title = document.querySelector('[data-hero-title]');
    if(title){
      // split into words, preserving the .shine span as one unit
      var nodes = Array.prototype.slice.call(title.childNodes);
      title.innerHTML='';
      nodes.forEach(function(n){
        if(n.nodeType===3){ // text
          n.textContent.split(/(\s+)/).forEach(function(tok){
            if(tok.trim()===''){ title.appendChild(document.createTextNode(tok)); return; }
            var w=document.createElement('span'); w.className='word';
            var inner=document.createElement('span'); inner.textContent=tok;
            w.appendChild(inner); title.appendChild(w);
          });
        } else { // the .shine element
          var w2=document.createElement('span'); w2.className='word';
          n.style.display='inline-block'; w2.appendChild(n); title.appendChild(w2);
          title.appendChild(document.createTextNode(' '));
        }
      });
    }

    if(!reduce){
      var heroWords = title ? title.querySelectorAll('.word > span, .word > .shine') : [];
      gsap.set(heroWords,{yPercent:115});
      gsap.set('.hero [data-reveal]',{y:24,opacity:0});   // scope to hero only
      var artEls = document.querySelectorAll('[data-hero-art] > *');
      gsap.set(artEls,{opacity:0,scale:.86,y:30});

      var tl = gsap.timeline({ delay:.15, defaults:{ease:'power4.out'} });
      tl.from('.nav-inner',{y:-26,opacity:0,duration:.8},0)
        .to(heroWords,{yPercent:0,duration:1.1,stagger:.07},.15)
        .to('.hero [data-reveal]',{y:0,opacity:1,duration:.9,stagger:.08},'-=.7')
        .to(artEls,{opacity:1,scale:1,y:0,duration:1,stagger:.12,ease:'power3.out'},'-=1');

      // animated shine sweep on the .shine word
      gsap.to('.shine',{backgroundPositionX:'-220%',duration:6,ease:'none',repeat:-1,yoyo:true});

      /* ----- Floating hero elements (ambient parallax) ----- */
      document.querySelectorAll('[data-float]').forEach(function(el,i){
        var amp = 8 + (parseInt(el.getAttribute('data-float'),10)||1)*6;
        gsap.to(el,{y:'+='+amp, duration:3+i*0.4, ease:'sine.inOut', repeat:-1, yoyo:true, delay:i*.2});
      });
      // mouse parallax on hero art
      var art = document.querySelector('[data-hero-art]');
      if(art && !('ontouchstart' in window)){
        art.addEventListener('mousemove', function(e){
          var r=art.getBoundingClientRect(), mx=(e.clientX-r.left)/r.width-.5, my=(e.clientY-r.top)/r.height-.5;
          art.querySelectorAll('[data-float]').forEach(function(el,i){
            gsap.to(el,{x:mx*(14+i*8),rotate:mx*4,duration:.8,ease:'power3'});
          });
        });
        art.addEventListener('mouseleave', function(){ gsap.to(art.querySelectorAll('[data-float]'),{x:0,rotate:0,duration:1,ease:'power3'}); });
      }
    } else {
      gsap.set('[data-reveal], .word > span, .word > .shine, [data-hero-art] > *',{clearProps:'all',opacity:1,y:0,yPercent:0,scale:1});
    }

    /* ----- Generic scroll reveals ----- */
    if(window.ScrollTrigger && !reduce){
      // single elements
      gsap.utils.toArray('.section [data-reveal]').forEach(function(el){
        gsap.set(el,{y:30,opacity:0});
        gsap.to(el,{y:0,opacity:1,duration:.9,ease:'power3.out',
          scrollTrigger:{trigger:el,start:'top 88%'}});
      });
      // staggered groups (per section)
      var groups = {};
      gsap.utils.toArray('[data-reveal-stagger]').forEach(function(el){
        var sec = el.closest('section') || document.body;
        var key = sec.id || Math.random();
        (groups[key]=groups[key]||[]).push(el);
      });
      Object.keys(groups).forEach(function(k){
        var els = groups[k];
        gsap.set(els,{y:36,opacity:0});
        ScrollTrigger.batch(els,{ start:'top 90%',
          onEnter:function(b){ gsap.to(b,{y:0,opacity:1,duration:.8,ease:'power3.out',stagger:.09}); } });
      });
      // footer mark
      gsap.from('.foot-mark',{y:60,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'.footer',start:'top 85%'}});
    } else if(reduce){
      gsap.set('[data-reveal],[data-reveal-stagger]',{opacity:1,y:0});
    }

    /* ----- Animated counters ----- */
    document.querySelectorAll('[data-count]').forEach(function(el){
      var end = parseFloat(el.getAttribute('data-count'));
      var div = parseFloat(el.getAttribute('data-divide')||'1');
      var dec = parseInt(el.getAttribute('data-decimals')||'0',10);
      var suf = el.getAttribute('data-suffix')||'';
      var fmt = function(v){ return (dec>0? v.toFixed(dec) : Math.round(v).toLocaleString('en-GB')) + suf; };
      var obj = {v:0};
      var run = function(){
        if(reduce){ el.textContent = fmt(end/div); return; }
        gsap.to(obj,{v:end,duration:1.8,ease:'power2.out',onUpdate:function(){ el.textContent = fmt(obj.v/div); }});
      };
      if(window.ScrollTrigger){
        ScrollTrigger.create({trigger:el,start:'top 92%',once:true,onEnter:run});
      } else run();
    });

    /* ----- Trust marquee ----- */
    var mq = document.getElementById('marquee');
    if(mq){
      mq.innerHTML += mq.innerHTML; // duplicate for seamless loop
      if(!reduce){
        var total = mq.scrollWidth/2;
        gsap.to(mq,{x:-total,duration:26,ease:'none',repeat:-1,modifiers:{x:function(x){ return (parseFloat(x)%total)+'px'; }}});
      }
    }

    /* ----- Technology horizontal scroll (pinned) ----- */
    var track = document.getElementById('techTrack');
    var pin = document.getElementById('techPin');
    if(track && pin && window.ScrollTrigger && !reduce && window.innerWidth>720){
      gsap.to(track,{ x:function(){ return -(track.scrollWidth - document.querySelector('.tech-pin .wrap').offsetWidth); },
        ease:'none',
        scrollTrigger:{ trigger:pin, start:'top 18%', end:function(){ return '+='+(track.scrollWidth*.9); },
          scrub:1, pin:true, invalidateOnRefresh:true } });
    }

    /* ----- Testimonials auto-marquee (pausable) ----- */
    var tt = document.getElementById('testiTrack');
    if(tt && !reduce){
      tt.innerHTML += tt.innerHTML;
      var tw = tt.scrollWidth/2;
      var tAnim = gsap.to(tt,{x:-tw,duration:38,ease:'none',repeat:-1,modifiers:{x:function(x){return (parseFloat(x)%tw)+'px';}}});
      tt.addEventListener('mouseenter',function(){ tAnim.timeScale(.15); });
      tt.addEventListener('mouseleave',function(){ tAnim.timeScale(1); });
    }

    /* ----- Process timeline fill + node activation ----- */
    var fill = document.getElementById('tlFill');
    var timeline = document.getElementById('timeline');
    if(fill && timeline && window.ScrollTrigger){
      ScrollTrigger.create({ trigger:timeline, start:'top 60%', end:'bottom 75%', scrub:true,
        onUpdate:function(self){ fill.style.height = (self.progress*100)+'%'; } });
      gsap.utils.toArray('[data-step]').forEach(function(step){
        ScrollTrigger.create({trigger:step,start:'top 65%',
          onEnter:function(){step.classList.add('on');}, onLeaveBack:function(){step.classList.remove('on');}});
      });
    }
  } /* end hasGSAP */
  else {
    // No GSAP: make sure everything is visible
    document.querySelectorAll('[data-reveal],[data-reveal-stagger],[data-hero-art] > *').forEach(function(el){el.style.opacity=1;});
    document.querySelectorAll('[data-count]').forEach(function(el){
      var end=parseFloat(el.getAttribute('data-count'))/parseFloat(el.getAttribute('data-divide')||'1');
      var dec=parseInt(el.getAttribute('data-decimals')||'0',10);
      el.textContent=(dec>0?end.toFixed(dec):Math.round(end).toLocaleString('en-GB'))+(el.getAttribute('data-suffix')||'');
    });
  }

  /* ============================================================
     Vanilla interactions (work without GSAP)
     ============================================================ */

  /* ----- Before / after slider ----- */
  (function(){
    var ba=document.getElementById('ba'); if(!ba) return;
    var dragging=false;
    function setRev(clientX){
      var r=ba.getBoundingClientRect();
      var p=Math.max(0,Math.min(1,(clientX-r.left)/r.width));
      ba.style.setProperty('--rev',(p*100)+'%');
      ba.setAttribute('aria-valuenow',Math.round(p*100));
    }
    ba.addEventListener('pointerdown',function(e){dragging=true; ba.setPointerCapture(e.pointerId); setRev(e.clientX);});
    ba.addEventListener('pointermove',function(e){ if(dragging) setRev(e.clientX);});
    window.addEventListener('pointerup',function(){dragging=false;});
    ba.addEventListener('keydown',function(e){
      var cur=parseFloat(ba.getAttribute('aria-valuenow'))||50;
      if(e.key==='ArrowLeft'){cur-=4;} else if(e.key==='ArrowRight'){cur+=4;} else return;
      cur=Math.max(0,Math.min(100,cur)); ba.style.setProperty('--rev',cur+'%'); ba.setAttribute('aria-valuenow',cur); e.preventDefault();
    });
    ba.style.setProperty('--rev','55%'); ba.setAttribute('aria-valuenow','55');
  })();

  /* ----- FAQ accordion ----- */
  document.querySelectorAll('.acc-item').forEach(function(item){
    var q=item.querySelector('.acc-q'), a=item.querySelector('.acc-a');
    q.addEventListener('click',function(){
      var open=item.classList.contains('open');
      // close siblings
      item.parentElement.querySelectorAll('.acc-item.open').forEach(function(o){
        if(o!==item){o.classList.remove('open'); o.querySelector('.acc-q').setAttribute('aria-expanded','false'); animateH(o.querySelector('.acc-a'),0);}
      });
      if(open){ item.classList.remove('open'); q.setAttribute('aria-expanded','false'); animateH(a,0); }
      else { item.classList.add('open'); q.setAttribute('aria-expanded','true'); animateH(a,a.querySelector('.inner').offsetHeight); }
    });
  });
  function animateH(el,h){
    if(hasGSAP && !reduce){ gsap.to(el,{height:h,duration:.5,ease:'power3.inOut'}); }
    else { el.style.height=h+'px'; }
  }

  /* ----- Contact form (front-end only demo) ----- */
  var submit=document.getElementById('submitBtn');
  if(submit){
    submit.addEventListener('click',function(){
      var form=document.getElementById('form');
      var email=document.getElementById('em');
      var fn=document.getElementById('fn');
      if(!fn.value.trim() || !email.value.trim() || email.value.indexOf('@')<0){
        (fn.value.trim()?email:fn).focus();
        if(hasGSAP) gsap.fromTo(form,{x:-6},{x:0,duration:.4,ease:'elastic.out(1,.4)'});
        return;
      }
      var lbl=submit.querySelector('.lbl');
      lbl.textContent='Thank you — we\u2019ll be in touch ✦';
      submit.style.setProperty('--bgc','var(--ink)'); submit.style.color='#fff';
      if(hasGSAP) gsap.fromTo(submit,{scale:.96},{scale:1,duration:.5,ease:'back.out(2)'});
    });
  }

  /* refresh ScrollTrigger after fonts load (layout shift safety) */
  if(document.fonts && document.fonts.ready && window.ScrollTrigger){
    document.fonts.ready.then(function(){ ScrollTrigger.refresh(); });
  }
  window.addEventListener('load', function(){ if(window.ScrollTrigger) ScrollTrigger.refresh(); });
})();


/* ============================================================
   AMBIENT DENTAL MOTION
   Floating enamel-tooth outlines, soft glassmorphism particles
   and a faint smile-arc — drifting, with scroll + mouse parallax.
   Subtle and luxurious; fully disabled for reduced-motion.
   ============================================================ */
(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var G = window.gsap;
  var layer = document.getElementById('ambient');
  if(!layer || reduce) return;                 // honour reduced-motion: no ambient motion
  var touch = ('ontouchstart' in window);
  var small = window.matchMedia('(max-width:720px)').matches;

  var TOOTH = "M9 41 C5 21,18 7,31 14 C40 19,46 19,50 16 C54 19,60 19,69 14 C82 7,95 21,91 41 "
            + "C88 58,85 67,80 83 C75 97,74 112,68 115 C64 117,60 103,56 91 C54 85,52 84,50 86 "
            + "C48 84,46 85,44 91 C40 103,36 117,32 115 C26 112,25 97,20 83 C15 67,12 58,9 41 Z";

  // curated placements so it feels composed, not random  {x%, y%, size px, rot, depth, op}
  var TEETH = [
    {x:8,  y:16, s:120, r:-18, d:18, o:.15},
    {x:84, y:24, s:160, r:14,  d:34, o:.13},
    {x:68, y:62, s:96,  r:-8,  d:24, o:.12},
    {x:14, y:72, s:140, r:22,  d:42, o:.12},
    {x:46, y:40, s:78,  r:6,   d:14, o:.10},
    {x:90, y:82, s:110, r:-12, d:30, o:.14},
    {x:30, y:50, s:64,  r:30,  d:10, o:.10}
  ];
  var PARTS = [
    {x:22, y:30, s:240, c:'rgba(255,154,122,.30)', d:50},
    {x:78, y:46, s:300, c:'rgba(139,123,255,.26)', d:64},
    {x:52, y:78, s:220, c:'rgba(255,111,160,.24)', d:40},
    {x:12, y:60, s:200, c:'rgba(255,184,140,.22)', d:56}
  ];

  function el(html){var d=document.createElement('div'); d.innerHTML=html; return d.firstChild;}
  var items=[];

  // soft particles (depth + glassmorphism)
  PARTS.forEach(function(p){
    var n=document.createElement('div'); n.className='amb-particle';
    n.style.cssText='left:'+p.x+'%;top:'+p.y+'%;width:'+p.s+'px;height:'+p.s+'px;background:radial-gradient(circle,'+p.c+',transparent 70%)';
    layer.appendChild(n); items.push({n:n, d:p.d, base:0});
  });

  // floating teeth
  var count = small ? 4 : TEETH.length;
  for(var i=0;i<count;i++){
    var t=TEETH[i];
    var n=el('<div class="amb-tooth"><svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet"><path d="'+TOOTH+'"/></svg></div>');
    n.style.cssText='left:'+t.x+'%;top:'+t.y+'%;width:'+t.s+'px;height:'+(t.s*1.2)+'px;opacity:'+t.o;
    n.style.transform='rotate('+t.r+'deg)';
    layer.appendChild(n);
    items.push({n:n, d:t.d, rot:t.r, tooth:true});
  }

  // faint smile arc near the hero
  var arc=el('<div class="amb-arc"><svg viewBox="0 0 600 200" width="100%" height="100%"><path d="M20 60 Q300 200 580 60"/></svg></div>');
  arc.style.cssText='left:50%;top:6%;width:min(60vw,640px);height:200px;transform:translateX(-50%)';
  layer.appendChild(arc);

  if(!G){ return; } // static placement if GSAP missing

  // gentle perpetual drift (each element breathes on its own rhythm)
  items.forEach(function(it,idx){
    var amp = it.tooth ? 16 : 26;
    G.to(it.n,{ y:'+='+amp, duration:5+idx*0.7, ease:'sine.inOut', repeat:-1, yoyo:true, delay:idx*0.25 });
    if(it.tooth){
      G.to(it.n,{ rotate:it.rot + (idx%2?6:-6), duration:8+idx, ease:'sine.inOut', repeat:-1, yoyo:true });
    }
  });
  G.to(arc,{ y:'+=14', duration:7, ease:'sine.inOut', repeat:-1, yoyo:true });

  // scroll parallax (depth) — works alongside Lenis via ScrollTrigger
  if(window.ScrollTrigger){
    items.forEach(function(it){
      G.to(it.n,{ yPercent:-it.d, ease:'none',
        scrollTrigger:{ trigger:document.body, start:'top top', end:'bottom bottom', scrub:1 } });
    });
    G.to(arc,{ yPercent:-40, ease:'none',
      scrollTrigger:{ trigger:document.body, start:'top top', end:'bottom bottom', scrub:1 } });
  }

  // mouse drift (interactive depth)
  if(!touch){
    var qx=[];
    items.forEach(function(it){ qx.push(G.quickTo(it.n,'x',{duration:1.1,ease:'power3'})); });
    window.addEventListener('mousemove', function(e){
      var mx=(e.clientX/window.innerWidth-.5), my=(e.clientY/window.innerHeight-.5);
      items.forEach(function(it,k){ qx[k](mx*it.d*0.9); });
    });
  }
})();
