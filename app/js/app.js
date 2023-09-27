document.addEventListener('DOMContentLoaded', () => {

	const tooltipHeaderList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	const tooltipHeader = tooltipHeaderList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	})


	/** (Start) Адаптивная высота таблицы **/
	function calculateTableHeight() {
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		if (windowWidth >= 992 && windowHeight >= 768) {
			var tableElement = document.getElementById('tableFullScreen');
			var tabletableElementHeight = document.querySelector('.table-responsive')
			var paginationWrapper = document.querySelector('.wrapper-pagination');
			var paginationHeight = paginationWrapper.offsetHeight;
			var tableOffsetTop = tableElement.offsetTop;
			var tableHeight = windowHeight - (tableOffsetTop + paginationHeight) - 20;

			tabletableElementHeight.style.maxHeight = tableHeight + 'px';
		} else {
			var tabletableElementHeight = document.querySelector('.table-responsive')
			tabletableElementHeight.style.maxHeight = '';
		}
	}

	function handleResize() {
		calculateTableHeight();
	}

	function handleMutation(mutationsList, observerTableHeight) {
		calculateTableHeight();
	}

	window.addEventListener('load', calculateTableHeight);
	window.addEventListener('resize', handleResize);

	var observerTableHeight = new MutationObserver(handleMutation);
	observerTableHeight.observe(document.body, { subtree: true, childList: true });
	/** (End) Адаптивная высота таблицы **/

	/** (End) Скролл таблицы **/
	var tableElement = document.getElementById('tableFullScreen');
	var tabletableElementHeight = document.querySelector('.table-responsive')
	var scrollThreshold = 2;
	var isScrollingDown = false;

	function handleScroll() {
		var scrollTop = tabletableElementHeight.scrollTop;
		if (scrollTop > scrollThreshold && !isScrollingDown) {
			tableElement.classList.add('scroll');
			isScrollingDown = true;
		} else if (scrollTop <= scrollThreshold && isScrollingDown) {
			tableElement.classList.remove('scroll');
			isScrollingDown = false;
		}
	}

	tabletableElementHeight.addEventListener('scroll', handleScroll);
	/** (End) Скролл таблицы **/


})
