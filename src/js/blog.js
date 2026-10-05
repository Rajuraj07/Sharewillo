$(document).ready(function () {
  const $filterBtn = $('#filter-toggle-btn');
  const $filterDrawer = $('#filter-drawer');

  // Toggle Dropdown
  $filterBtn.on('click', function (e) {
    e.stopPropagation();
    $filterDrawer.toggleClass('is-open');
    $(this).toggleClass('bg-neutral-700 bg-black');
  });

  // Close when clicking outside
  $(document).on('click', function (e) {
    if (!$filterDrawer.is(e.target) && $filterDrawer.has(e.target).length === 0 && !$filterBtn.is(e.target)) {
      $filterDrawer.removeClass('is-open');
      $filterBtn.removeClass('bg-neutral-700').addClass('bg-black');
    }
  });
});