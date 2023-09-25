document.addEventListener('DOMContentLoaded', () => {

	const tooltipHeaderList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	const tooltipHeader = tooltipHeaderList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	})


	/** (Start) Адаптивная высота таблицы **/
	function calculateTableHeight() {
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		if (windowWidth >= 768 && windowHeight >= 768) {
			var tableElement = document.getElementById('tableFullScreen');
			var paginationWrapper = document.querySelector('.wrapper-pagination');
			var paginationHeight = paginationWrapper.offsetHeight;
			var tableOffsetTop = tableElement.offsetTop;
			var tableHeight = windowHeight - (tableOffsetTop + paginationHeight);

			tableElement.style.maxHeight = tableHeight + 'px';
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
	var tableElementWrap = document.querySelector('.table-wrapper')
	var tableElement = document.getElementById('tableFullScreen');
	var scrollThreshold = 2;
	var isScrollingDown = false;

	function handleScroll() {
		var scrollTop = tableElement.scrollTop;
		if (scrollTop > scrollThreshold && !isScrollingDown) {
			tableElementWrap.classList.add('scroll');
			isScrollingDown = true;
		} else if (scrollTop <= scrollThreshold && isScrollingDown) {
			tableElementWrap.classList.remove('scroll');
			isScrollingDown = false;
		}
	}

	tableElement.addEventListener('scroll', handleScroll);
	/** (End) Скролл таблицы **/


})
