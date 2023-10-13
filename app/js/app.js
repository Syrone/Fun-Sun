document.addEventListener('DOMContentLoaded', () => {

	const tooltipHeaderList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	const tooltipHeader = tooltipHeaderList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	})


	/** (Start) Адаптивная высота таблицы **/
	const tableElements = document.querySelectorAll('.table-fullscreen');
	const tabTableElements = document.querySelectorAll('.tab-table-fullscreen');
	const navLinksTable = document.querySelectorAll('.nav-link-table');

	function calculateTableHeight() {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		const calculateHeight = (tableElement) => {
			const tableOffsetTop = tableElement.getBoundingClientRect().top;
			const wrapPagination = document.querySelector('.wrapper-pagination');
			const paginationHeight = wrapPagination.offsetHeight + 10;
			const tableHeight = windowHeight - tableOffsetTop - paginationHeight;

			if (windowWidth >= 992 && windowHeight >= 768) {
				tableElement.style.maxHeight = tableHeight + 'px';
			} else {
				tableElement.style.maxHeight = '';
			}
		};

		tableElements.forEach(tableElement => {
			calculateHeight(tableElement);
		});

		const tabTableElements = document.querySelectorAll('.tab-pane-table');

		if (tabTableElements.length > 0) {
			tabTableElements.forEach(tabTableElement => {
				const tableElement = tabTableElement.querySelector('.tab-table-fullscreen');
				const wrapPagination = tabTableElement.querySelector('.wrapper-pagination');
				const paginationHeight = wrapPagination.offsetHeight + 10;
				const tableOffsetTop = tableElement.getBoundingClientRect().top;
				const tableHeight = windowHeight - tableOffsetTop - paginationHeight;

				if (windowWidth >= 992 && windowHeight >= 768) {
					tableElement.style.maxHeight = tableHeight + 'px';
				} else {
					tableElement.style.maxHeight = '';
				}
			});
		}
	}

	function handleScroll(event) {
		const tableElement = event.target;
		const scrollTop = tableElement.scrollTop;
		const scrollThreshold = 2;
		let isScrollingDown

		if (scrollTop > scrollThreshold && !isScrollingDown) {
			tableElement.classList.add('scroll');
			isScrollingDown = true;
		} else if (scrollTop <= scrollThreshold && isScrollingDown) {
			tableElement.classList.remove('scroll');
			isScrollingDown = false;
		} else if (scrollTop === 0) {
			tableElement.classList.remove('scroll');
			isScrollingDown = false;
		}

		calculateTableHeight();
	}

	function handleResize() {
		if (window.innerWidth >= 992) {
			tableElements.forEach(function (tableElement) {
				tableElement.addEventListener('scroll', handleScroll);
			});
		} else {
			tableElements.forEach(function (tableElement) {
				tableElement.removeEventListener('scroll', handleScroll);
			});
		}
	}

	window.addEventListener('load', function () {
		calculateTableHeight();
		handleResize();
	});

	window.addEventListener('resize', function () {
		calculateTableHeight();
		handleResize();
	});

	function handleMutation(mutationsList, observerTableHeight) {
		calculateTableHeight();
	}

	const observerTableHeight = new MutationObserver(handleMutation);
	observerTableHeight.observe(document.body, { subtree: true, childList: true });

	tabTableElements.forEach(function (tabTableElement) {
		tabTableElement.addEventListener('scroll', handleScroll);
	});

	navLinksTable.forEach(function (navLinkTable) {
		navLinkTable.addEventListener('hidden.bs.tab', function () {
			navLinkTable.addEventListener('transitionend', function () {
				calculateTableHeight();
			});
		});

		navLinkTable.addEventListener('shown.bs.tab', function () {
			navLinkTable.addEventListener('transitionend', function () {
				calculateTableHeight();
			});
		});
	});
	/** (End) Адаптивная высота таблицы **/

	//** (Start) Backdrop for Header Menu Mobile **/
	const showBackdropBtn = document.querySelector('.btn-backdrop');
	let backdrop = null;

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
		const backdropModal = document.querySelector(".modal-backdrop");
		let backdrop = null;

		// Проверяем, был ли клик по backdrop
		if (event.target === backdropModal) {
			backdropModal.remove();
			backdrop = null;
		}

		const navbar = document.getElementById("headerMenu");
		const target = event.target;

		// Проверяем, является ли кликнутый элемент частью меню
		const isNavbar = navbar.contains(target);

		// Если кликнули вне меню и меню открыто, закрываем его
		if (!isNavbar && navbar.classList.contains("show")) {
			const toggle = document.querySelector("[data-bs-toggle='collapse']");
			toggle.click();
		}
	});
	//** (End) Backdrop for Header Menu Mobile **/

	//** (Start) Swiper Buttons **//
	const swiperButtons = new Swiper('.swiper-buttons', {
		slidesPerView: 'auto',
		spaceBetween: 8,
		freeMode: true,
	});
	//** (End) Swiper Buttons **//

	//** (Start) Close Buttons Dropdown **//
	const dropdownFilters = document.querySelectorAll('.dropdown-filter');

	dropdownFilters.forEach(dropdownFilter => {
		const dropdownNested = dropdownFilter.querySelectorAll('.dropdown-nested');

		dropdownNested.forEach(nested => {
			const dropdownMenu = nested.querySelector('.dropdown-menu');
			const observer = new MutationObserver(mutations => {
				let hasOpenMenu = false;

				dropdownNested.forEach(nested => {
					const dropdownMenu = nested.querySelector('.dropdown-menu');
					if (dropdownMenu.classList.contains('show')) {
						hasOpenMenu = true;
					}
				});

				if (hasOpenMenu) {
					dropdownFilter.classList.add('nested');
				} else {
					dropdownFilter.classList.remove('nested');
				}
			});

			observer.observe(dropdownMenu, { attributes: true });
		});
	});
	//** (End) Close Buttons Dropdown **//

	//** (Start) Close Buttons Dropdown **//
	const closeDropdownButtons = document.getElementsByClassName('dropdown-dissmis');
	for (let i = 0; i < closeDropdownButtons.length; i++) {
		closeDropdownButtons[i].addEventListener('click', function () {
			const dropdownMenu = this.parentNode.parentNode.parentNode;
			const dropdownToggle = dropdownMenu.parentNode.querySelector('.dropdown-toggle');
			dropdownMenu.classList.remove('show');
			dropdownToggle.classList.remove('show');
			dropdownToggle.setAttribute('aria-expanded', 'false');
		});
	}
	//** (End) Close Buttons Dropdown **//

	//** (Start) Checked From Check **//
	const checkboxes = document.querySelectorAll('.form-check-input');
	const formChecks = document.querySelectorAll('.form-check');

	checkboxes.forEach(function (checkbox, index) {
		if (!checkbox.classList.contains('is-radio')) {
			checkbox.addEventListener('change', function () {
				if (this.checked) {
					formChecks[index].classList.add('checked');
				} else {
					formChecks[index].classList.remove('checked');
				}
			});
		}
	});
	//** (End) Checked From Check **//

	// Получаем значение переменной цвета из CSS
	const rootStyles = getComputedStyle(document.documentElement);
	const colors = {
		accent: rootStyles.getPropertyValue('--accent'),
		secondary: rootStyles.getPropertyValue('--secondary')
	};

	//** (Start) Graph Without Scales **//
	const canvasTrendingUp = document.getElementById('canvasTrendingUp')
	const canvasTrendingDown = document.getElementById('canvasTrendingDown')

	if (canvasTrendingUp) {
		const GraphTrendingUp = new Chart(canvasTrendingUp, {
			type: 'line',
			data: {
				labels: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'],
				datasets: [{
					label: 'Продажи',
					data: [25, 5, 20, 0, 30],
					backgroundColor: 'rgba(0, 0, 0, 0)',
					borderColor: colors.secondary,
					tension: .45,
					borderWidth: 2,
					pointStyle: false,
				}]
			},
			options: {
				responsive: false,
				scales: {
					y: {
						display: false,
					},
					x: {
						display: false
					}
				},
				plugins: {
					legend: {
						display: false
					}
				}
			}
		});
	}

	if (canvasTrendingDown) {
		const GraphTrendingDown = new Chart(canvasTrendingDown, {
			type: 'line',
			data: {
				labels: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'],
				datasets: [{
					label: 'Продажи',
					data: [0, 30, 20, 25, 22],
					backgroundColor: 'rgba(0, 0, 0, 0)',
					borderColor: colors.accent,
					tension: .5,
					borderWidth: 2,
					pointStyle: false,
				}]
			},
			options: {
				responsive: false,
				scales: {
					y: {
						display: false,
					},
					x: {
						display: false
					}
				},
				plugins: {
					legend: {
						display: false
					}
				}
			}
		});
	}
	//** (End) Graph Without Scales **//

	// const modal123 = new bootstrap.Modal(document.getElementById('editedToolsModal'));
	// modal123.show();

})
