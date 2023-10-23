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
				tableElement.style.height = tableHeight + 'px';
			} else {
				tableElement.style.height = '';
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
					tableElement.style.height = tableHeight + 'px';
				} else {
					tableElement.style.height = '';
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

	dropdownCalendars.forEach(function (dropdownCalendar, index) {
		const dropdownButton = dropdownCalendar.querySelector('.btn-calendar')
		const dropdownBootstrap = new bootstrap.Dropdown(dropdownButton);
		const dropdownButtonFirstDate = dropdownButton.querySelector('.first')
		const dropdownButtonSecondDate = dropdownButton.querySelector('.second')
		const dropdownMenu = dropdownCalendar.querySelector('.dropdown-menu')
		const vanilaCalendar = dropdownCalendar.querySelector('.vanilla-calendar')

		const defaultTemplate = `
			<div class="vanilla-calendar-header">
					<div class="vanilla-calendar-top">
							<div class="vanilla-calendar-tabs">
									<button class="btn btn-calendar-tab btn-calendar-default">Дата</button>
									<button class="btn btn-calendar-tab btn-calendar-multiple">Диапазон</button>
							</div>

							<span class="vanilla-calendar-top__selected_date"></span>
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
		`;

		const multipleTemplate = `
		<div class="vanilla-calendar-grid">
			<div class="vanilla-calendar-top">
				<div class="vanilla-calendar-tabs">
					<button class="btn btn-calendar-tab btn-calendar-default">Дата</button>
					<button class="btn btn-calendar-tab btn-calendar-multiple">Диапазон</button>
				</div>

				<span class="vanilla-calendar-top__selected_date"></span>
			</div>
			<#Multiple>
				<div class="vanilla-calendar-column">
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
				</div>
			<#/Multiple>
			<div class="vanilla-calendar-buttons">
				<button class="btn vanilla-calendar-buttons__close">Закрыть</button>
				<button class="btn vanilla-calendar-buttons__save">Ок</button>
			</div>
		</div>
	`;

		const optionsSingle = {
			type: 'default',
			settings: {
				lang: 'ru',
				visibility: {
					theme: 'light',
					weekend: false,
					daysOutside: false,
				},
				selection: {
					day: 'single',
				},
			},

			actions: {
				clickDay: function (e, dates) {
					const selectedDate = calendar.HTMLElement.querySelector('.vanilla-calendar-top__selected_date')

					if (dates[1]) {
						dates.sort((a, b) => +new Date(a) - +new Date(b));
						selectedDate.textContent = `${formatterForSelected(dates[0])} - ${formatterForSelected(dates[dates.length - 1])}`;
					} else if (dates[0]) {
						selectedDate.textContent = formatterForSelected(dates[0])
					}
				},
			},
			DOMTemplates: {
				default: defaultTemplate,
			},
		};

		const optionsMultiple = {
			type: 'multiple',
			settings: {
				lang: 'ru',
				visibility: {
					theme: 'light',
					weekend: false,
					daysOutside: false,
				},
				selection: {
					day: 'multiple-ranged',
				},
			},

			actions: {
				clickDay: function (e, dates) {
					const selectedDate = calendar.HTMLElement.querySelector('.vanilla-calendar-top__selected_date')

					if (dates[1]) {
						dates.sort((a, b) => +new Date(a) - +new Date(b));
						selectedDate.textContent = `${formatterForSelected(dates[0])} - ${formatterForSelected(dates[dates.length - 1])}`;
					} else if (dates[0]) {
						selectedDate.textContent = formatterForSelected(dates[0])
					}
				},
			},
			DOMTemplates: {
				multiple: multipleTemplate,
			},
		};

		var calendar = new VanillaCalendar(vanilaCalendar, optionsMultiple);
		calendar.init();

		const selectedDate = dropdownCalendar.querySelector('.vanilla-calendar-top__selected_date')
		let calendarType = calendar.currentType

		function handleCalendarChanges() {
			const vanillaCalendarDays = dropdownCalendar.querySelectorAll('.vanilla-calendar-days');

			vanillaCalendarDays.forEach(function (vanillaCalendarDays) {
				const vanillaCalendarDayItems = vanillaCalendarDays.querySelectorAll('.vanilla-calendar-day');

				let firstNonEmptyIndex = -1;
				let lastNonEmptyIndex = -1;

				vanillaCalendarDayItems.forEach(function (vanillaCalendarDayItem, index) {
					if (vanillaCalendarDayItem.querySelector('.vanilla-calendar-day__btn')) {
						if (firstNonEmptyIndex === -1) {
							firstNonEmptyIndex = index;
						}
						lastNonEmptyIndex = index;
					}
				});

				if (firstNonEmptyIndex !== -1 && lastNonEmptyIndex !== -1) {
					vanillaCalendarDayItems[firstNonEmptyIndex].classList.add('vanilla-calendar-day__first');
					vanillaCalendarDayItems[lastNonEmptyIndex].classList.add('vanilla-calendar-day__last');
				}
			});
		}

		function hideCalendar() {
			dropdownCalendar.classList.remove('is-active')
			dropdownBootstrap.hide()
		}

		function restartCalendar(type) {
			if (type === 'default') {
				calendar = new VanillaCalendar(vanilaCalendar, optionsSingle);
			} else if (type === 'multiple') {
				calendar = new VanillaCalendar(vanilaCalendar, optionsMultiple);
			}
			calendar.init();
		}

		function formatterForButton(date) {
			const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
			const formattedDate = new Date(date);
			const formattedDateString = formattedDate.toLocaleDateString('ru', options);
			const [day, month, year] = formattedDateString.split('.');
			return `${day}.${month}.${year}`;
		}

		function formatterForSelected(date) {
			const options = { day: '2-digit', month: 'long', year: 'numeric' };
			const formattedDate = new Date(date);
			const formattedDateString = formattedDate.toLocaleDateString('ru', options);
			return formattedDateString;
		}

		function calendarToDay(_selectedDate) {
			const today = new Date();
			_selectedDate.textContent = formatterForSelected(today);
		}

		function handleCalendarButtons() {
			vanilaCalendar.addEventListener('click', function (event) {
				if (event.target.matches('.vanilla-calendar-buttons__close')) {
					hideCalendar();
				} else if (event.target.matches('.vanilla-calendar-buttons__save')) {
					const selectedDates = calendar.selectedDates;
					let firstDate = selectedDates[0];
					let lastDate = selectedDates[selectedDates.length - 1];
					if (selectedDates.length === 1) {
						dropdownButton.classList.remove('multiple')
						dropdownButtonFirstDate.textContent = formatterForButton(firstDate);
						dropdownButtonSecondDate.textContent = '';
						hideCalendar();
					} else if (selectedDates.length > 1) {
						dropdownButton.classList.add('multiple')
						dropdownButtonFirstDate.textContent = formatterForButton(firstDate);
						dropdownButtonSecondDate.textContent = formatterForButton(lastDate);
						hideCalendar();
					}
				} else if (event.target.matches('.btn-calendar-default')) {
					if (calendarType === 'multiple') {
						restartCalendar('default');
						vanilaCalendar.classList.remove('vanilla-calendar_multiple');
					}
				} else if (event.target.matches('.btn-calendar-multiple')) {
					if (calendarType === 'default') {
						restartCalendar('multiple');
						vanilaCalendar.classList.remove('vanilla-calendar_default');
					}
				}
			});
		}

		if (calendarType === 'default' || calendarType === 'multiple') {
			requestAnimationFrame(function () {
				calendarToDay(selectedDate);
				handleCalendarButtons();
				handleCalendarChanges()
			})
		}

		const observerCalendar = new MutationObserver(function (mutationsList, observer) {
			calendarType = calendar.currentType
			const selectedDates = calendar.selectedDates;
			let firstDate = selectedDates[0];
			let lastDate = selectedDates[selectedDates.length - 1];

			dropdownBootstrap.update()

			if (calendarType === 'default') {
				requestAnimationFrame(function () {
					const selectedDate = dropdownCalendar.querySelector('.vanilla-calendar-top__selected_date');
					if (selectedDates.length === 1) {
						selectedDate.textContent = formatterForSelected(firstDate)
					} else {
						calendarToDay(selectedDate);
						handleCalendarButtons();
					}

					handleCalendarChanges();
				});
			}

			if (calendarType === 'multiple') {
				requestAnimationFrame(function () {
					const selectedDate = dropdownCalendar.querySelector('.vanilla-calendar-top__selected_date');
					if (selectedDates.length === 1) {
						selectedDate.textContent = formatterForSelected(firstDate)
					} else if (selectedDates.length > 1) {
						selectedDate.textContent = `${formatterForSelected(firstDate)} - ${formatterForSelected(lastDate)}`;
					} else {
						calendarToDay(selectedDate);
						handleCalendarButtons();
					}

					handleCalendarChanges();
				});
			}
		});

		const observerConfig = {
			childList: true,
		};

		observerCalendar.observe(vanilaCalendar, observerConfig);
	});
	//** (End) Vanilla Calendar **//

	// const modal123 = new bootstrap.Modal(document.getElementById('bindCountryModal'));
	// modal123.show();


})
