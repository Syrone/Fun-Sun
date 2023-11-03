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
	const tablesHandleScroll = document.querySelectorAll('[data-handle-scroll]')

	function calculateTableHeight() {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		const calculateHeight = (tableElement) => {
			const tableOffsetTop = tableElement.getBoundingClientRect().top;
			const wrapPagination = document.querySelector('.wrapper-pagination');
			const paginationHeight = wrapPagination ? wrapPagination.offsetHeight : 0;
			const tableHeight = windowHeight - tableOffsetTop - paginationHeight - 20;

			if (windowWidth >= 992 && windowHeight >= 768) {
				tableElement.style.height = tableHeight + 'px';
			} else {
				tableElement.style.height = '';
			}
		};

		tableElements.forEach(tableElement => {
			if (tableElements.length > 0) {
				calculateHeight(tableElement);
			}
		});

		const tabPaneTable = document.querySelectorAll('.tab-pane-table');

		if (tabPaneTable.length > 0 && tabTableElements.length > 0) {
			tabPaneTable.forEach(tabTableElement => {
				const tableElement = tabTableElement.querySelector('.tab-table-fullscreen');
				const wrapPagination = tabTableElement.querySelector('.wrapper-pagination');
				const paginationHeight = wrapPagination ? wrapPagination.offsetHeight : 0;
				const tableOffsetTop = tableElement.getBoundingClientRect().top;
				const tableHeight = windowHeight - tableOffsetTop - paginationHeight - 20;

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

		const parentElement = tableElement.closest('.table-wrapper');

		if (scrollTop > scrollThreshold && !isScrollingDown) {
			parentElement.classList.add('scroll');
			isScrollingDown = true;
		} else if (scrollTop <= scrollThreshold && isScrollingDown) {
			parentElement.classList.remove('scroll');
			isScrollingDown = false;
		} else if (scrollTop === 0) {
			parentElement.classList.remove('scroll');
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

		if (tablesHandleScroll.length > 0) {
			tablesHandleScroll.forEach(function (tableHandleScroll) {
				tableHandleScroll.addEventListener('scroll', handleScroll)
			})
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

	if (tablesHandleScroll.length > 0) {
		tablesHandleScroll.forEach(function (tableHandleScroll) {
			tableHandleScroll.addEventListener('scroll', handleScroll)
		})
	}

	tabTableElements.forEach(function (tabTableElement) {
		tabTableElement.addEventListener('scroll', handleScroll);
		observerTabTableHeight.observe(tabTableElement, { childList: true, subtree: true });
	});
	/** (End) Адаптивная высота таблицы **/

	/** (Start) Проверка наличия Scroll **/
	const elementsScroll = document.querySelectorAll('[data-scroll-check]');

	function elementsHandleScroll() {
		if (elementsScroll.length > 0) {
			elementsScroll.forEach(element => {
				const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
				element.setAttribute('data-scroll-check', hasVerticalScrollbar);
			});
		}
	}

	if (navLinksTable.length > 0) {
		navLinksTable.forEach(function (navLinkTable) {
			navLinkTable.addEventListener('hidden.bs.tab', function () {
				elementsHandleScroll();
			});

			navLinkTable.addEventListener('shown.bs.tab', function () {
				navLinkTable.addEventListener('transitionend', function () {
					elementsHandleScroll();
				});
			});
		});
	}

	if (elementsScroll.length > 0) {
		const observerElementsHeight = new MutationObserver(() => {
			elementsHandleScroll();
		});

		elementsScroll.forEach(element => {
			observerElementsHeight.observe(element, { attributes: true, attributeFilter: ['class'], subtree: true });
		});

		elementsHandleScroll()
		document.addEventListener('resize', elementsHandleScroll)
		document.addEventListener('load', elementsHandleScroll)
	}
	/** (End) Проверка наличия Scroll **/

	//** (Start) Backdrop for Header Menu Mobile **/
	const showBackdropBtn = document.querySelector('.btn-backdrop');
	let backdrop = null;

	if (showBackdropBtn) {
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
	}

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
		slideToClickedSlide: true,
	});

	const swiperButtonsTab = new Swiper('.swiper-buttons-tab', {
		slidesPerView: 'auto',
		spaceBetween: 8,
		freeMode: true,
		slideToClickedSlide: true,
		breakpoints: {
			0: {
				slidesPerView: 2,
				spaceBetween: 8,
			},
			375: {
				slidesPerView: 'auto',
			},
		}
	});

	const swiperButtonsTabOverflow = new Swiper('.swiper-buttons-tab-overflow', {
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

	//** (Start) For Switch Tables **//
	function handleSwitchTable() {
		const switchTables = document.querySelectorAll('.switch-tables input[type="checkbox"]');
		const switchTablesWrapper = document.querySelector('.switch-tables-wrapper');

		const updateClasses = () => {
			const checkedCount = document.querySelectorAll('.switch-tables input[type="checkbox"]:checked');
			const checkedCountData = checkedCount.length;

			if (checkedCountData === 1) {
				switchTablesWrapper.classList.add('is-one-coll');
				switchTablesWrapper.classList.remove('is-two-coll');
			} else if (checkedCountData > 1) {
				switchTablesWrapper.classList.add('is-two-coll');
				switchTablesWrapper.classList.remove('is-one-coll');
			} else {
				switchTablesWrapper.classList.remove('is-one-coll');
				switchTablesWrapper.classList.remove('is-two-coll');
			}
		};

		const updateTables = (checkbox) => {
			const switchTableId = checkbox.id;
			const switchTableBlock = document.querySelector(`[data-switch-table="${switchTableId}"]`);

			if (checkbox.checked) {
				switchTableBlock.classList.remove('d-none');
			} else {
				const otherCheckedCount = document.querySelectorAll('.switch-tables input[type="checkbox"]:checked:not(#' + switchTableId + ')');
				if (otherCheckedCount.length > 0) {
					switchTableBlock.classList.add('d-none');
				} else {
					checkbox.checked = true;
				}
			}
		};

		switchTables.forEach((checkbox) => {
			checkbox.addEventListener('change', () => {
				updateClasses();
				updateTables(checkbox);
			});
		});

		updateClasses();
		updateTables(switchTables[0]);
	}

	const switchTables = document.querySelectorAll('.switch-tables input[type="checkbox"]');
	const switchTablesWrapper = document.querySelector('.switch-tables-wrapper');

	if (switchTables && switchTablesWrapper) {
		handleSwitchTable()

		document.addEventListener('load', handleSwitchTable);
	}
	//** (End) For Switch Tables **//

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
		const dropdownBootstrap = new bootstrap.Dropdown(dropdownButton);
		const dropdownButtonFirstDate = dropdownButton.querySelector('.first')
		const dropdownButtonSecondDate = dropdownButton.querySelector('.second')
		const vanilaCalendar = dropdownCalendar.querySelector('.vanilla-calendar')
		const vanilaCalendarMultiple = dropdownCalendar.querySelector('.vanilla-calendar--multiple')

		const defaultTemplate = `
			<div class="vanilla-calendar-header">
					<div class="vanilla-calendar-top">
							<div class="vanilla-calendar-tabs">
									<button class="btn btn-calendar-tab btn-calendar-default is-active">Дата</button>
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
					<button class="btn btn-calendar-tab btn-calendar-multiple is-active">Диапазон</button>
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
					const selectedDate = calendarMultiple.HTMLElement.querySelector('.vanilla-calendar-top__selected_date')

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

		const calendar = new VanillaCalendar(vanilaCalendar, optionsSingle);
		const calendarMultiple = new VanillaCalendar(vanilaCalendarMultiple, optionsMultiple);
		calendar.init();
		calendarMultiple.init();

		function calendarDaysFirstLast() {
			const vanillaCalendarDays = vanilaCalendarMultiple.querySelectorAll('.vanilla-calendar-days');

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

		function calendarDefaultButtons() {
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
				} else if (event.target.matches('.btn-calendar-multiple')) {
					vanilaCalendar.classList.add('d-none');
					vanilaCalendarMultiple.classList.remove('d-none');
					calendar.reset();
				}
			});
		}

		function calendarMultipleButtons() {
			vanilaCalendarMultiple.addEventListener('click', function (event) {
				if (event.target.matches('.vanilla-calendar-buttons__close')) {
					hideCalendar();
				} else if (event.target.matches('.vanilla-calendar-buttons__save')) {
					const selectedDates = calendarMultiple.selectedDates;
					let firstDate = selectedDates[0];
					let lastDate = selectedDates[selectedDates.length - 1];
					if (selectedDates.length > 1) {
						dropdownButton.classList.add('multiple')
						dropdownButtonFirstDate.textContent = formatterForButton(firstDate);
						dropdownButtonSecondDate.textContent = formatterForButton(lastDate);
						hideCalendar();
					}
				} else if (event.target.matches('.btn-calendar-default')) {
					vanilaCalendarMultiple.classList.add('d-none');
					vanilaCalendar.classList.remove('d-none');
					calendarMultiple.reset();
				}
			});
		}

		const observerConfig = {
			childList: true,
		};

		if (vanilaCalendarMultiple) {
			const selectedDateMultiple = vanilaCalendarMultiple.querySelector('.vanilla-calendar-top__selected_date')
			let calendarMultipleType = calendarMultiple.currentType
			vanilaCalendarMultiple.classList.add('d-none');

			if (calendarMultipleType === 'multiple') {
				calendarToDay(selectedDateMultiple);
				calendarMultipleButtons();
				calendarDaysFirstLast();
			}

			const observerMultipleCalendar = new MutationObserver(function (mutationsList, observer) {
				let calendarMultipleType = calendarMultiple.currentType
				const selectedDates = calendarMultiple.selectedDates;
				let firstDate = selectedDates[0];
				let lastDate = selectedDates[selectedDates.length - 1];

				dropdownBootstrap.update()

				if (calendarMultipleType === 'multiple') {
					requestAnimationFrame(function () {
						const selectedDateMultiple = vanilaCalendarMultiple.querySelector('.vanilla-calendar-top__selected_date');
						if (selectedDates.length === 1) {
							selectedDateMultiple.textContent = formatterForSelected(firstDate)
						} else if (selectedDates.length > 1) {
							selectedDateMultiple.textContent = `${formatterForSelected(firstDate)} - ${formatterForSelected(lastDate)}`;
						} else {
							calendarToDay(selectedDateMultiple);
							calendarMultipleButtons();
						}
						calendarDaysFirstLast();
					});
				}
			});

			observerMultipleCalendar.observe(vanilaCalendarMultiple, observerConfig);
		}

		if (vanilaCalendar) {
			const selectedDate = vanilaCalendar.querySelector('.vanilla-calendar-top__selected_date')
			let calendarDefaultType = calendar.currentType

			if (calendarDefaultType === 'default') {
				calendarToDay(selectedDate);
				calendarDefaultButtons();
			}

			const observerDefaultCalendar = new MutationObserver(function (mutationsList, observer) {
				calendarDefaultType = calendar.currentType;
				const selectedDates = calendar.selectedDates;
				let firstDate = selectedDates[0];

				dropdownBootstrap.update()

				if (calendarDefaultType === 'default') {
					requestAnimationFrame(function () {
						const selectedDate = vanilaCalendar.querySelector('.vanilla-calendar-top__selected_date');
						if (selectedDates.length === 1) {
							selectedDate.textContent = formatterForSelected(firstDate)
						} else {
							calendarToDay(selectedDate);
							calendarDefaultButtons();
						}
					});
				}
			});

			observerDefaultCalendar.observe(vanilaCalendar, observerConfig);
		}
	});
	//** (End) Vanilla Calendar **//

	//** (Start) Progress Bar **//
	const progressBars = document.querySelectorAll('.progress-bar');

	if (progressBars.length > 0) {
		progressBars.forEach(progressBar => {
			const currentValue = parseFloat(progressBar.getAttribute('aria-valuenow'));
			const maxValue = parseFloat(progressBar.getAttribute('aria-valuemax'));
			const fillPercentage = (currentValue / maxValue) * 100;
			progressBar.style.width = `${fillPercentage}%`;
		});
	}
	//** (End) Progress Bar **//
})
