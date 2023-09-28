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

	//** (Start) Backdrop for Header Menu Mobile **/
	var showBackdropBtn = document.querySelector('.btn-backdrop');
	var backdrop = null;

	showBackdropBtn.addEventListener('click', function () {
		if (backdrop) {
			backdrop.remove();
			backdrop = null;
		} else {
			backdrop = document.createElement('div');
			backdrop.classList.add('modal-backdrop');
			document.querySelector('.header').appendChild(backdrop);
		}
	});

	document.addEventListener('click', function (event) {
		var backdrop = document.querySelector(".modal-backdrop");

		// Проверяем, был ли клик по backdrop
		if (event.target === backdrop) {
			backdrop.remove();
			backdrop = null;
		}

		var navbar = document.getElementById("headerMenu");
		var target = event.target;

		// Проверяем, является ли кликнутый элемент частью меню
		var isNavbar = navbar.contains(target);

		// Если кликнули вне меню и меню открыто, закрываем его
		if (!isNavbar && navbar.classList.contains("show")) {
			var toggle = document.querySelector("[data-bs-toggle='collapse']");
			toggle.click();
		}
	});
	//** (End) Backdrop for Header Menu Mobile **/


})
