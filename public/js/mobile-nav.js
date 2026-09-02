/* ==========================================================
   GYM PRO - COMMON MOBILE NAVIGATION
   Works on every page that contains .sidebar and .topbar.
   ========================================================== */
(function(){
  'use strict';

  function init(){
    const sidebar=document.querySelector('.sidebar');
    const topbar=document.querySelector('.topbar');
    if(!sidebar || !topbar) return;

    let overlay=document.querySelector('.sidebar-overlay');
    if(!overlay){
      overlay=document.createElement('div');
      overlay.className='sidebar-overlay';
      document.body.appendChild(overlay);
    }

    let btn=document.querySelector('.mobile-menu-btn');
    if(!btn){
      btn=document.createElement('button');
      btn.className='mobile-menu-btn';
      btn.type='button';
      btn.setAttribute('aria-label','Open menu');
      btn.setAttribute('aria-expanded','false');
      btn.innerHTML='<i class="bi bi-list"></i>';

      /* Put hamburger at the very beginning of the navbar on ALL admin pages. */
      topbar.insertBefore(btn,topbar.firstElementChild||null);
    }

    function isMobile(){return window.innerWidth<992;}

    function closeMenu(){
      document.body.classList.remove('gp-menu-open');
      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-label','Open menu');
      btn.innerHTML='<i class="bi bi-list"></i>';
    }

    function openMenu(){
      if(!isMobile()) return;
      document.body.classList.add('gp-menu-open');
      btn.setAttribute('aria-expanded','true');
      btn.setAttribute('aria-label','Close menu');
      btn.innerHTML='<i class="bi bi-x-lg"></i>';
    }

    btn.addEventListener('click',function(){
      if(document.body.classList.contains('gp-menu-open')) closeMenu();
      else openMenu();
    });
    overlay.addEventListener('click',closeMenu);
    sidebar.querySelectorAll('a').forEach(function(link){link.addEventListener('click',closeMenu);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape') closeMenu();});
    window.addEventListener('resize',function(){if(!isMobile()) closeMenu();});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
