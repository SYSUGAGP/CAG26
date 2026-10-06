(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const sections = Array.from(document.querySelectorAll('.page-section'));
  const links = Array.from(document.querySelectorAll('#navigation a'));
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  function showPage(moveFocus) {
    let id = location.hash.slice(1) || 'home';
    if (id === 'main') id = sections.find(section => !section.hidden)?.id || 'home';
    if (!sections.some(section => section.id === id)) id = 'home';
    sections.forEach(section => { section.hidden = section.id !== id; });
    links.forEach(link => {
      if (link.hash === '#' + id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    if (moveFocus) {
      const main = document.querySelector('#main');
      main.focus({ preventScroll: true });
      if (window.scrollY > main.offsetTop) main.scrollIntoView({ block: 'start' });
    }
  }
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    nav.classList.toggle('is-open', expanded);
  });
  window.addEventListener('hashchange', () => showPage(true));
  showPage(false);
})();
