(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const sections = Array.from(
    document.querySelectorAll('.page-section')
  );

  const navigationLinks = Array.from(
    document.querySelectorAll('#navigation a')
  );

  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');

  const talkCards = Array.from(
    document.querySelectorAll('#program .talk-card')
  );

  function showPage(moveFocus) {
    let id;

    try {
      id = decodeURIComponent(location.hash.slice(1)) || 'home';
    } catch {
      id = 'home';
    }

    if (id === 'main') {
      id = sections.find(section => !section.hidden)?.id || 'home';
    }

    const target = document.getElementById(id);
    const targetSection = target?.closest('.page-section');
    const sectionId = targetSection?.id || 'home';

    sections.forEach(section => {
      section.hidden = section.id !== sectionId;
    });

    navigationLinks.forEach(link => {
      if (link.hash === '#' + sectionId) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    navigation?.classList.remove('is-open');
    menu?.setAttribute('aria-expanded', 'false');

    // Keep Program visible and open the selected abstract.
    const talk = target?.closest('.talk-card');

    if (talk) {
      talk.open = true;
    }

    if (moveFocus || talk) {
      requestAnimationFrame(() => {
        if (talk) {
          talk.querySelector('summary').focus({
            preventScroll: true
          });

          talk.scrollIntoView({
            block: 'start'
          });
        } else if (targetSection && target !== targetSection) {
          target.scrollIntoView({
            block: 'start'
          });
        } else {
          const main = document.querySelector('#main');

          main?.focus({
            preventScroll: true
          });

          if (main && window.scrollY > main.offsetTop) {
            main.scrollIntoView({
              block: 'start'
            });
          }
        }
      });
    }
  }

  // Mobile navigation menu.
  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';

    menu.setAttribute('aria-expanded', String(expanded));
    navigation?.classList.toggle('is-open', expanded);
  });

  // Reopen an abstract when the same timetable link is clicked again.
  document.querySelectorAll('#program a[data-talk]').forEach(link => {
    link.addEventListener('click', event => {
      if (link.hash === location.hash) {
        event.preventDefault();
        showPage(true);
      }
    });
  });

  // Expand all abstracts.
  document.getElementById('expand-abstracts')
    ?.addEventListener('click', () => {
      talkCards.forEach(card => {
        card.open = true;
      });
    });

  // Collapse all abstracts.
  document.getElementById('collapse-abstracts')
    ?.addEventListener('click', () => {
      talkCards.forEach(card => {
        card.open = false;
      });
    });

  // Include all abstracts when printing.
  let beforePrintState = null;

  window.addEventListener('beforeprint', () => {
    if (beforePrintState === null) {
      beforePrintState = talkCards.map(card => card.open);
    }

    talkCards.forEach(card => {
      card.open = true;
    });
  });

  // Restore the previous expansion state after printing.
  window.addEventListener('afterprint', () => {
    if (beforePrintState !== null) {
      talkCards.forEach((card, index) => {
        card.open = beforePrintState[index];
      });

      beforePrintState = null;
    }
  });

  window.addEventListener('hashchange', () => {
    showPage(true);
  });

  showPage(false);
})();
