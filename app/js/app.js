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

	//** (End) For Tables Collapse **//
	const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

	//** (Start) For Tables Buttons **//
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
	// function datePickerFormatter(date) {
	// 	const options = { day: 'numeric', month: 'numeric', year: '2-digit' };
	// 	const formattedDate = new Date(date);
	// 	const formattedDateString = formattedDate.toLocaleDateString('en', options);
	// 	const [month, day, year] = formattedDateString.split('/');
	// 	return `${day}.${month}.${year}`;
	// }

	// const options = {
	// 	settings: {
	// 		lang: 'ru',
	// 		visibility: {
	// 			theme: 'light',
	// 		},
	// 	},
	// 	input: true,
	// 	actions: {
	// 		changeToInput(e, calendar, dates, time, hours, minutes, keeping) {
	// 			if (dates[0]) {
	// 				const formattedDate = datePickerFormatter(dates[0]);
	// 				const btnCalendar = document.querySelector('.btn-calendar');
	// 				const firstSpan = btnCalendar.querySelector('.first');
	// 				firstSpan.textContent = formattedDate;
	// 			} else {
	// 				const btnCalendar = document.querySelector('.btn-calendar');
	// 				const firstSpan = btnCalendar.querySelector('.first');
	// 				firstSpan.textContent = '';
	// 			}
	// 			if (dates[1]) {
	// 				const formattedDate = datePickerFormatter(dates[1]);
	// 				const btnCalendar = document.querySelector('.btn-calendar');
	// 				const firstSpan = btnCalendar.querySelector('.second');
	// 				firstSpan.textContent = formattedDate;
	// 			} else {
	// 				const btnCalendar = document.querySelector('.btn-calendar');
	// 				const firstSpan = btnCalendar.querySelector('.second');
	// 				firstSpan.textContent = '';
	// 			}
	// 		},
	// 	},
	// };

	const vanillaCalendars = document.querySelectorAll('.vanilla-calendar')

	vanillaCalendars.forEach((vanillaCalendar) => {

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

			DOMTemplates: {
				default: `
							<div class="vanilla-calendar-header">
			
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

			CSSClasses: {
				calendarBtnClose: 'vanilla-calendar-buttons__close',
				calendarBtnSave: 'vanilla-calendar-buttons__save',
			},
		};

		const calendar = new VanillaCalendar(vanillaCalendar, options);
		calendar.init();
	})

	const dropdownCalendars = document.querySelectorAll('.dropdown-calendar');

	dropdownCalendars.forEach(function (dropdownCalendar) {
		const dropdownButton = dropdownCalendar.querySelector('.btn-calendar')
		const dropdownMenu = dropdownCalendar.querySelector('.dropdown-menu')
		const closeButton = dropdownCalendar.querySelector('.vanilla-calendar-buttons__close')

		closeButton.addEventListener('click', function () {
			dropdownCalendar.classList.remove('is-active');
			dropdownButton.classList.remove('show');
			dropdownButton.setAttribute('aria-expanded', 'false');
			dropdownMenu.classList.remove('show');
		});
	});
	//** (End) Vanilla Calendar **//

	// const modal123 = new bootstrap.Modal(document.getElementById('bindCountryModal'));
	// modal123.show();


})
