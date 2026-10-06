(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  const navigationLinks = [...document.querySelectorAll('.site-nav a')];
  const sections = navigationLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const desktopLayout = window.matchMedia('(min-width: 960px)');
  const themeToggle = document.querySelector('.theme-toggle');
  const warmThemeStylesheet = document.getElementById('warm-theme-stylesheet');
  const themeStorageKey = 'ben-wagner-theme';
  let framePending = false;
  const resourcesTitle = document.getElementById('resources-title');
  const resourcesIntro = document.querySelector('#resources .section-intro');

  if (resourcesTitle) resourcesTitle.textContent = 'Influences';
  if (resourcesIntro) resourcesIntro.textContent = 'Books, talks, and references that have shaped how I approach engineering, leadership, and continuous learning.';

  const applyTheme = (theme) => {
    const useWarmTheme = theme === 'warm';
    warmThemeStylesheet.disabled = !useWarmTheme;
    themeToggle.setAttribute('aria-pressed', String(useWarmTheme));
    themeToggle.setAttribute('aria-label', useWarmTheme ? 'Use dark style' : 'Use warm retro style');
    themeToggle.textContent = useWarmTheme ? 'Dark style' : 'Warm style';
  };

  let savedTheme = 'original';
  try {
    savedTheme = window.localStorage.getItem(themeStorageKey) || 'original';
  } catch {
    // Storage can be unavailable in strict privacy modes; the original theme remains the default.
  }
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = themeToggle.getAttribute('aria-pressed') === 'true' ? 'original' : 'warm';
    applyTheme(nextTheme);
    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // The toggle still works for the current page when storage is unavailable.
    }
  });

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
