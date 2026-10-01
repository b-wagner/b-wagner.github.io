(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  const navigationLinks = [...document.querySelectorAll('.site-nav a')];
  const sections = navigationLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const desktopLayout = window.matchMedia('(min-width: 960px)');
  let framePending = false;
  const resourcesTitle = document.getElementById('resources-title');
  const resourcesIntro = document.querySelector('#resources .section-intro');

  if (resourcesTitle) resourcesTitle.textContent = 'Influences';
  if (resourcesIntro) resourcesIntro.textContent = 'Books, talks, and references that have shaped how I approach engineering, leadership, and continuous learning.';

  const closeMenu = () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  const setCurrentSection = (id) => {
    navigationLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${id}`;
      link.toggleAttribute('aria-current', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'location');
    });
  };

  const updateCurrentSection = () => {
    const activationLine = desktopLayout.matches ? 96 : header.offsetHeight + 24;
    const current = sections.reduce((active, section) => (
      section.getBoundingClientRect().top <= activationLine ? section : active
    ), sections[0]);
    setCurrentSection(current.id);
    framePending = false;
  };

  const requestCurrentSectionUpdate = () => {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(updateCurrentSection);
    }
  };

  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navigationLinks.forEach((link) => link.addEventListener('click', () => {
    setCurrentSection(link.hash.slice(1));
    closeMenu();
  }));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });

  window.addEventListener('scroll', requestCurrentSectionUpdate, { passive: true });
  window.addEventListener('resize', requestCurrentSectionUpdate);
  window.addEventListener('hashchange', requestCurrentSectionUpdate);
  requestCurrentSectionUpdate();
})();
