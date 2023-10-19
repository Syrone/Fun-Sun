document.addEventListener('DOMContentLoaded', () => {

	const tooltipHeaderList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'))
	const tooltipHeader = tooltipHeaderList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	})

	const tooltipHeaderListLight = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip-light"]'))
	const tooltipHeaderLight = tooltipHeaderListLight.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl, {
			customClass: 'tooltip-light'
		});
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
			const paginationHeight = wrapPagination ? wrapPagination.offsetHeight : 0;
			const tableHeight = windowHeight - tableOffsetTop - paginationHeight - 10;

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
				const paginationHeight = wrapPagination ? wrapPagination.offsetHeight : 0;
				const tableOffsetTop = tableElement.getBoundingClientRect().top;
				const tableHeight = windowHeight - tableOffsetTop - paginationHeight - 10;

				if (windowWidth >= 992 && windowHeight >= 768) {
					tableElement.style.maxHeight = tableHeight + 'px';
				} else {
					tableElement.style.maxHeight = '';
				}
			});
		}
	}

	function closeDropdownMenus() {
		const dropdownCellButtons = document.querySelectorAll('.table-wrapper tbody .cell-button.is-active');
		dropdownCellButtons.forEach((dropdownCellButton) => {
			dropdownCellButton.classList.remove('is-active');
		});

		const dropdownButtons = document.querySelectorAll('.table-wrapper tbody .dropdown-toggle');
		dropdownButtons.forEach((dropdownButton) => {
			dropdownButton.classList.remove('show');
			dropdownButton.setAttribute('aria-expanded', 'false');
		});

		const dropdownMenus = document.querySelectorAll('.table-wrapper tbody .dropdown-menu.show');
		dropdownMenus.forEach((dropdownMenu) => {
			dropdownMenu.classList.remove('show');
		});
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
		closeDropdownMenus();
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

		closeDropdownMenus();
	}

	window.addEventListener('load', function () {
		calculateTableHeight();
		handleResize();
	});

	window.addEventListener('resize', function () {
		calculateTableHeight();
		handleResize();
	});

	navLinksTable.forEach(function (navLinkTable) {
		navLinkTable.addEventListener('hidden.bs.tab', function () {
			calculateTableHeight();
		});

		navLinkTable.addEventListener('shown.bs.tab', function () {
			navLinkTable.addEventListener('transitionend', function () {
				calculateTableHeight();
			});
		});
	});

	const observerTabTableHeight = new MutationObserver(function (mutationsList, observer) {
		calculateTableHeight();
	});

	tabTableElements.forEach(function (tabTableElement) {
		tabTableElement.addEventListener('scroll', handleScroll);
		observerTabTableHeight.observe(tabTableElement, { childList: true, subtree: true });
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

	const swiperButtonsTab = new Swiper('.swiper-buttons-tab', {
		slidesPerView: 'auto',
		spaceBetween: 8,
		freeMode: true,
		slideToClickedSlide: true,
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

	//** (Start) Close Buttons Dropdown Nested **//
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
	//** (End) Close Buttons Dropdown Nested **//

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

	//** (Start) For Tables Collapse **//
	const collapseWrappers = document.querySelectorAll('.table-collapse-nested');

	collapseWrappers.forEach((wrapper) => {
		const collapseElement = wrapper.querySelector('.collapse');

		if (collapseElement.classList.contains('show')) {
			wrapper.classList.add('is-active');
		}

		collapseElement.addEventListener('show.bs.collapse', (event) => {
			event.stopPropagation();
			wrapper.classList.add('is-active');
		});

		collapseElement.addEventListener('hidden.bs.collapse', (event) => {
			event.stopPropagation();
			wrapper.classList.remove('is-active');
		});
	});
	//** (End) For Tables Collapse **//

	//** (Start) For Tables Buttons **//
	const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

	dropdownToggles.forEach(dropdownToggle => {
		dropdownToggle.addEventListener('show.bs.dropdown', () => {
			const cellButton = dropdownToggle.closest('.cell-button');
			if (cellButton) cellButton.classList.add('is-active');
		});

		dropdownToggle.addEventListener('hide.bs.dropdown', () => {
			const cellButton = dropdownToggle.closest('.cell-button');
			if (cellButton) cellButton.classList.remove('is-active');
		});
	});
	//** (End) For Tables Buttons **//

	//** (Start) Vanilla Calendar **//
	const dropdownCalendars = document.querySelectorAll('.dropdown-calendar');

	dropdownCalendars.forEach(function (dropdownCalendar) {
		const dropdownButton = dropdownCalendar.querySelector('.btn-calendar')
		const dropdownButtonFirstDate = dropdownButton.querySelector('.first')
		const dropdownButtonSecondDate = dropdownButton.querySelector('.second')
		const dropdownMenu = dropdownCalendar.querySelector('.dropdown-menu')
		const vanilaCalendar = dropdownCalendar.querySelector('.vanilla-calendar')

		function hideCalendar() {
			dropdownCalendar.classList.remove('is-active')
			dropdownButton.classList.remove('show');
			dropdownButton.setAttribute('aria-expanded', 'false');
			dropdownMenu.classList.remove('show');
		}

		function datePickerFormatter(date) {
			const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
			const formattedDate = new Date(date);
			const formattedDateString = formattedDate.toLocaleDateString('ru', options);
			const [day, month, year] = formattedDateString.split('.');
			return `${day}.${month}.${year}`;
		}

		function dateSelectedFormatter(date) {
			const options = { day: '2-digit', month: 'long', year: 'numeric' };
			const formattedDate = new Date(date);
			const formattedDateString = formattedDate.toLocaleDateString('ru', options);
			return formattedDateString;
		}

		const options = {
			type: 'default',
			settings: {
				lang: 'ru',
				visibility: {
					theme: 'light',
					weekend: false,
					daysOutside: false,
				},
			},

			actions: {
				clickDay: function (e, dates) {
					const selected = dates[0];
					selectedDate.textContent = dateSelectedFormatter(selected);
				},
			},

			DOMTemplates: {
				default: `
									<div class="vanilla-calendar-header">
										<div class="vanilla-calendar-header__top">
											<span class="vanilla-calendar-header__selected_date"></span>
										</div>

										<div class="vanilla-calendar-header__bottom">
											<div class="vanilla-calendar-header__content">
												<#Month />
												<#Year />
											</div>
											<div class="vanilla-calendar-header__navigation">
												<#ArrowPrev />
												<#ArrowNext />
											</div>
										</div>
									</div>
									<div class="vanilla-calendar-wrapper">
										<#WeekNumbers />
										<div class="vanilla-calendar-content">
											<#Week />
											<#Days />
										</div>
									</div>
									<div class="vanilla-calendar-buttons">
										<button class="btn vanilla-calendar-buttons__close">Закрыть</button>
										<button class="btn vanilla-calendar-buttons__save">Ок</button>
									</div>
								`
			},
		};

		const calendar = new VanillaCalendar(vanilaCalendar, options);
		calendar.init();
		let calendarType = calendar.currentType

		const selectedDate = calendar.HTMLElement.querySelector('.vanilla-calendar-header__selected_date')
		const closeButton = calendar.HTMLElement.querySelector('.vanilla-calendar-buttons__close')
		const saveButton = calendar.HTMLElement.querySelector('.vanilla-calendar-buttons__save')

		function handleCalendarTypeChange() {
			const today = new Date();
			selectedDate.textContent = dateSelectedFormatter(today);

			closeButton.addEventListener('click', function () {
				hideCalendar();
			});

			saveButton.addEventListener('click', function () {
				if (calendar.selectedDates.length > 0) {
					const formattedDateFirst = datePickerFormatter(calendar.selectedDates[0]);
					dropdownButtonFirstDate.textContent = formattedDateFirst;
					hideCalendar();
				}
			});
		}

		handleCalendarTypeChange()
		
		const observerCalendarType = new MutationObserver(function(mutationsList) {
			for (let mutation of mutationsList) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					handleCalendarTypeChange();
					break;
				}
			}
		});
		
		observerCalendarType.observe(vanilaCalendar, { attributes: true });
	});
	//** (End) Vanilla Calendar **//

	// const modal123 = new bootstrap.Modal(document.getElementById('bindCountryModal'));
	// modal123.show();


})
