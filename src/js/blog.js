document.addEventListener('DOMContentLoaded', () => {
  const filterBtn = document.getElementById('filter-toggle-btn');
  const filterDrawer = document.getElementById('filter-drawer');

  // Guard clause to prevent errors if elements aren't rendered on the page
  if (!filterBtn || !filterDrawer) return;

  /**
   * Helper function to update filter drawer state
   * @param {boolean} isOpen - Desired open state
   */
  const setDrawerState = (isOpen) => {
    filterDrawer.classList.toggle('is-open', isOpen);
    filterBtn.classList.toggle('bg-neutral-700', isOpen);
    filterBtn.classList.toggle('bg-black', !isOpen);
    filterBtn.setAttribute('aria-expanded', String(isOpen));
  };

  // 1. Toggle filter drawer state on button click
  filterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = filterDrawer.classList.contains('is-open');
    setDrawerState(!isOpen);
  });

  // 2. Prevent clicks inside the drawer from bubbling up to the document
  filterDrawer.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // 3. Global document click listener to close when clicking outside
  document.addEventListener('click', () => {
    if (filterDrawer.classList.contains('is-open')) {
      setDrawerState(false);
    }
  });

  // 4. Accessibility: Close drawer when pressing the Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && filterDrawer.classList.contains('is-open')) {
      setDrawerState(false);
      filterBtn.focus(); // Return focus to button for keyboard users
    }
  });
});