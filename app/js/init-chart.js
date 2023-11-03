document.addEventListener('DOMContentLoaded', () => {

		//** (Start) Var CSS **//
		const rootStyles = getComputedStyle(document.documentElement);
		const colors = {
			background: rootStyles.getPropertyValue('--background'),
			accent: rootStyles.getPropertyValue('--accent'),
			accent50: rootStyles.getPropertyValue('--accent-50'),
			secondary: rootStyles.getPropertyValue('--secondary'),
			secondary50: rootStyles.getPropertyValue('--secondary-50'),
			third: rootStyles.getPropertyValue('--third'),
			fourth: rootStyles.getPropertyValue('--fourth'),
			fifth: rootStyles.getPropertyValue('--fifth'),
			warning: rootStyles.getPropertyValue('--warning'),
			textDark: rootStyles.getPropertyValue('--text-color--dark'),
			textLight: rootStyles.getPropertyValue('--text-color--light'),
		};
		//** (End) Var CSS **//

		//** (Start) Graph Functions **//
		function getDoughnutGradient(chart) {
			const { ctx } = chart
	
			const gradientSegment = ctx.createLinearGradient(20, 20, 150, 150)
			gradientSegment.addColorStop(0, '#8EB8FF');
			gradientSegment.addColorStop(1, '#4872F2');
			return gradientSegment
		}
	
		const getOrCreateTooltip = (chart) => {
			const container = chart.canvas.parentNode;
			let tooltipEl = container.querySelector('.tooltip-canvas');
	
			if (!tooltipEl) {
				tooltipEl = document.createElement('div');
				tooltipEl.classList.add('tooltip-canvas');
				const tooltipUl = document.createElement('ul');
				tooltipUl.classList.add('tooltip-list', 'list-group');
				tooltipEl.appendChild(tooltipUl);
	
				container.appendChild(tooltipEl);
			}
	
			return tooltipEl;
		};
		const externalTooltipHandler = (context) => {
			const { chart, tooltip } = context
			const tooltipEl = getOrCreateTooltip(chart)
	
			if (tooltip.opacity === 0) {
				tooltipEl.style.opacity = 0
				return
			}
	
			if (tooltip.dataPoints.length > 0) {
				const label = tooltip.dataPoints[0].dataset.label
				const labelData = tooltip.dataPoints[0].dataset.label[tooltip.dataPoints[0].dataIndex]
				const data = tooltip.dataPoints[0].dataset.data[tooltip.dataPoints[0].dataIndex]
				const date = new Date(tooltip.dataPoints[0].chart.data.labels[tooltip.dataPoints[0].dataIndex])
				const formatterDate = date.toLocaleString('ru-RU', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}).replace(' г.', '');
				const tooltipUl = tooltipEl.querySelector('ul')
				const tooltipLi = document.createElement('li')
				tooltipLi.classList.add('list-group-item')
				const tooltipTitleSpan = document.createElement('span')
				const tooltipDateSpan = document.createElement('date')
				const tooltipDate = document.createTextNode(formatterDate)
				let tooltipTitle
				if (Array.isArray(label)) {
					tooltipTitle = document.createTextNode(data + ' ' + labelData)
				} else {
					tooltipTitle = document.createTextNode(data + ' ' + label)
				}
				tooltipTitleSpan.classList.add('title')
				tooltipDateSpan.classList.add('date')
				tooltipUl.appendChild(tooltipLi)
				tooltipLi.appendChild(tooltipTitleSpan)
				tooltipLi.appendChild(tooltipDateSpan)
				tooltipTitleSpan.appendChild(tooltipTitle)
				tooltipDateSpan.appendChild(tooltipDate)
	
				while (tooltipUl.firstChild) {
					tooltipUl.firstChild.remove()
				}
	
				tooltipUl.appendChild(tooltipLi)
				tooltipEl.style.opacity = 1
			}
	
			const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
			const tooltipWidth = tooltipEl.offsetWidth;
			const tooltipHeight = tooltipEl.offsetHeight;
			const containerHeight = chart.height;
	
			// Учитываем смещение прокрутки
			const container = chart.canvas.parentNode.parentNode;
			const containerWidth = chart.canvas.parentNode.parentNode.offsetWidth;
			const scrollLeft = container.scrollLeft;
	
			let tooltipLeft = positionX + tooltip.caretX - (tooltipWidth / 2);
			let tooltipTop = positionY + tooltip.caretY - tooltipHeight - 20;
	
			if (tooltip.caretX - (tooltipWidth / 2) < scrollLeft) {
				tooltipLeft = scrollLeft;
				tooltipEl.classList.add('overflow-start')
			} else if (tooltip.caretX + (tooltipWidth / 2) > containerWidth + scrollLeft) {
				tooltipLeft = containerWidth - tooltipWidth + scrollLeft;
				tooltipEl.classList.add('overflow-end')
			} else {
				tooltipEl.classList.remove('overflow-start')
				tooltipEl.classList.remove('overflow-end')
			}
	
			if (tooltipTop < 0) {
				tooltipTop = 0;
			} else if (tooltipTop + tooltipHeight > containerHeight) {
				tooltipTop = containerHeight - tooltipHeight;
			}
	
			tooltipEl.style.left = tooltipLeft + "px";
			tooltipEl.style.top = tooltipTop + "px";
		}

		function createDiagonalPattern(colorStroke, colorFill) {
			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');

			const size = 20;
			const stroke = 8;
			const strokeOffset = stroke / 2;
			canvas.width = size;
			canvas.height = size;

			context.fillStyle = colorFill;
			context.fillRect(0, 0, size, size);

			context.strokeStyle = colorStroke, colorFill;
			context.lineWidth = stroke;

			// Отрисовка наклонных линий
			context.moveTo(-strokeOffset, size / 2 - strokeOffset);
			context.lineTo(size / 2 + strokeOffset, size + strokeOffset);
			context.moveTo(size / 2 - strokeOffset, -strokeOffset);
			context.lineTo(size + strokeOffset, size / 2 + strokeOffset);
			context.stroke();

			// Создание временного холста для разворота
			const tempCanvas = document.createElement('canvas');
			const tempContext = tempCanvas.getContext('2d');
			tempCanvas.width = size;
			tempCanvas.height = size;
			tempContext.drawImage(canvas, 0, 0);

			// Создание развернутого узора
			const mirroredCanvas = document.createElement('canvas');
			const mirroredContext = mirroredCanvas.getContext('2d');
			mirroredCanvas.width = size;
			mirroredCanvas.height = size;
			mirroredContext.scale(-1, 1);
			mirroredContext.translate(-size, 0);
			mirroredContext.drawImage(tempCanvas, 0, 0);

			return mirroredContext.createPattern(mirroredCanvas, 'repeat');
		}
		//** (End) Graph Functions **//

		//** (Start) Graph Plugins **//
		const doughnetBackground = {
			beforeDatasetsDraw(chart) {
				const { ctx, data } = chart;
				const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius
				const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius
				const sliceThickness = (outerRadius - innerRadius) + 6
				const angle = Math.PI / 180
	
				ctx.save();
	
				data.datasets.forEach((dataset, index) => {
					chart.getDatasetMeta(index).data[0].innerRadius = innerRadius - (sliceThickness * index)
					chart.getDatasetMeta(index).data[0].outerRadius = outerRadius - (sliceThickness * index)
	
					ctx.beginPath();
					ctx.lineWidth = chart.getDatasetMeta(index).data[0].outerRadius - chart.getDatasetMeta(index).data[0].innerRadius
					ctx.arc(chart.getDatasetMeta(index).data[0].x, chart.getDatasetMeta(index).data[0].y, chart.getDatasetMeta(index).data[0].outerRadius - (chart.getDatasetMeta(index).data[0].outerRadius - chart.getDatasetMeta(index).data[0].innerRadius) / 2, 0, angle * 360, false)
					ctx.strokeStyle = '#919EAB29'
					ctx.stroke();
	
				})
			}
		}
	
		const doughnetGradient = {
			beforeDatasetsDraw(chart) {
				const { ctx } = chart;
	
				const gradientAccent = ctx.createLinearGradient(20, 20, 220, 220);
				const gradientWarning = ctx.createLinearGradient(20, 20, 220, 220);
				gradientAccent.addColorStop(0, '#8EB8FF');
				gradientAccent.addColorStop(1, '#4872F2');
				gradientWarning.addColorStop(0, '#FA9596');
				gradientWarning.addColorStop(1, '#E73C3E');
				chart.getDatasetMeta(0).data[0].options.backgroundColor = gradientAccent
				if (chart.getDatasetMeta().length > 1) {
					chart.getDatasetMeta(1).data[0].options.backgroundColor = gradientWarning
				}
			}
		}
	
		const doughnutLabel = {
			beforeInit(chart) {
				const { ctx, data } = chart;
	
				const totalData = data.datasets.reduce((total, dataset) => total + dataset.data.reduce((sum, value) => sum + value, 0), 0);
	
				const labelContainer = document.createElement('div');
				labelContainer.classList.add('current-data');
				labelContainer.innerHTML = `
					Всего
					<span>${totalData.toLocaleString('en-US')}</span>
				`;
	
				ctx.canvas.parentNode.appendChild(labelContainer);
			}
		}
		//** (End) Graph Plugins **//
	
		//** (Start) Graph Init **//
		const canvasTrendingUp = document.getElementById('canvasTrendingUp')
		const canvasTrendingDown = document.getElementById('canvasTrendingDown')
		const canvasTypePromotion = document.getElementById('graphTypePromotion')
		const canvasAttribution = document.getElementById('graphAttribution')
		const canvasStatus = document.getElementById('graphStatus')
		const canvasMarketingDivision = document.getElementById('graphMarketingDivision')
		const canvasQuantityByMonth = document.getElementById('graphQuantityByMonth')
		const canvasQuantityByMonthAxesY = document.getElementById('graphQuantityByMonthAxesY')
		let max
	
		if (canvasTrendingUp) {
			const graphTrendingUp = new Chart(canvasTrendingUp, {
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
					maintainAspectRatio: false,
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
						},
						tooltip: {
							enabled: false,
						}
					}
				}
			});
		}
	
		if (canvasTrendingDown) {
			const graphTrendingDown = new Chart(canvasTrendingDown, {
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
					maintainAspectRatio: false,
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
						},
						tooltip: {
							enabled: false,
						}
					}
				}
			});
		}
	
		if (canvasTypePromotion) {
			const dates = [
				new Date('2022-01-01'),
			];
	
			const graphTypePromotion = new Chart(canvasTypePromotion, {
				type: 'doughnut',
				data: {
					labels: dates,
					datasets: [
						{
							label: 'B2B',
							data: [5000],
							pointStyle: false,
							circumference: (ctx) => {
								const dataPoints = ctx.chart.data.datasets.map((dataset) => {
									return dataset.data[0]
								})
								max = Math.max(...dataPoints)
								return ctx.dataset.data / max * 275
							},
						},
					]
				},
				options: {
					borderColor: '',
					hoverBorderColor: '',
					borderWidth: 0,
					borderRadius: 16,
					cutout: 85,
					layout: {
						padding: 2,
					},
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							enabled: false,
							external: externalTooltipHandler,
						}
					},
				},
				plugins: [doughnutLabel, doughnetBackground, doughnetGradient]
			});
		}
	
		if (canvasAttribution) {
			const dates = [
				new Date('2022-01-01'),
				new Date('2022-02-01'),
			];
	
			const graphAttribution = new Chart(canvasAttribution, {
				type: 'doughnut',
				data: {
					labels: dates,
					datasets: [
						{
							label: 'Есть',
							data: [5000],
							pointStyle: false,
							circumference: (ctx) => {
								const dataPoints = ctx.chart.data.datasets.map((dataset) => {
									return dataset.data[0]
								})
								max = Math.max(...dataPoints)
								return ctx.dataset.data / max * 330
							},
						},
						{
							label: 'Нет',
							data: [5989],
							pointStyle: false,
							circumference: (ctx) => {
								return ctx.dataset.data / max * 180
							},
						}
					]
				},
				options: {
					borderColor: '',
					hoverBorderColor: '',
					borderWidth: 0,
					borderRadius: 16,
					cutout: 85,
					layout: {
						padding: 2,
					},
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							enabled: false,
							external: externalTooltipHandler,
						}
					},
				},
				plugins: [doughnutLabel, doughnetBackground, doughnetGradient]
			});
		}
	
		if (canvasStatus) {
			const dates = [
				new Date('2022-01-01'),
				new Date('2022-02-01'),
			];
	
			const graphStatus = new Chart(canvasStatus, {
				type: 'doughnut',
				data: {
					labels: dates,
					datasets: [
						{
							label: ['Заплонированных', 'Выполненных'],
							data: [8500, 2489],
							backgroundColor: (context) => {
								const chart = context.chart;
								const { chartArea } = chart
								if (!chartArea) {
									return null
								}
								return getDoughnutGradient(chart);
							},
							pointStyle: false,
						}
					]
				},
				options: {
					borderColor: 'rgb(255, 255, 255)',
					hoverBorderColor: 'rgb(255, 255, 255)',
					borderWidth: 5,
					cutout: 85,
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							enabled: false,
							external: externalTooltipHandler,
						}
					},
				},
				plugins: [doughnutLabel]
			});
		}
	
		if (canvasMarketingDivision) {
			const dates = [
				new Date('2022-01-01'),
				new Date('2022-02-01'),
				new Date('2022-03-01'),
				new Date('2022-04-01'),
				new Date('2022-05-01'),
				new Date('2022-06-01'),
			];
	
			const graphMarketingDivision = new Chart(canvasMarketingDivision, {
				type: 'doughnut',
				data: {
					labels: dates,
					datasets: [
						{
							label: [
								'Operational Marketing',
								'Advertising',
								'E-Commerce',
								'SMM B2C',
								'Franchising',
								'ЗТА'
							],
							data: [6989, 6989, 2000, 2989, 2989, 2989],
							backgroundColor: [
								colors.accent,
								colors.secondary,
								colors.third,
								colors.warning,
								colors.fourth,
								colors.fifth
							],
							pointStyle: false,
						}
					]
				},
				options: {
					borderColor: 'rgb(255, 255, 255)',
					hoverBorderColor: 'rgb(255, 255, 255)',
					borderWidth: 5,
					cutout: 88,
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							enabled: false,
							external: externalTooltipHandler,
						}
					},
				},
				plugins: [doughnutLabel]
			});
		}
	
		if (canvasQuantityByMonth && canvasQuantityByMonthAxesY) {
			const dates = [
				new Date('2022-01-01'),
				new Date('2022-02-13'),
				new Date('2022-03-21'),
				new Date('2022-04-11'),
				new Date('2022-05-06'),
				new Date('2022-06-26'),
				new Date('2022-07-24'),
				new Date('2022-08-24'),
				new Date('2022-09-02'),
				new Date('2022-10-11'),
				new Date('2022-11-11'),
				new Date('2022-12-01'),
			];
	
			const data = {
				labels: dates,
				datasets: [
					{
						label: 'Выполненных',
						data: [450, 250, 350, 400, 150, 500, 450, 300, 350, 400, 470, 470],
						backgroundColor: colors.secondary,
						hoverBackgroundColor: createDiagonalPattern(colors.secondary, colors.secondary50),
						pointStyle: false,
					},
					{
						label: 'Запланированных',
						data: [550, 210, 500, 700, 270, 250, 550, 250, 500, 700, 250, 250],
						backgroundColor: colors.accent,
						hoverBackgroundColor: createDiagonalPattern(colors.accent, colors.accent50),
						pointStyle: false,
					}
				]
			}
	
			const graphQuantityByMonth = new Chart(canvasQuantityByMonth, {
				type: 'bar',
				data,
				options: {
					maintainAspectRatio: false,
					layout: {
						padding: {
							top: 28.2,
						},
					},
					borderRadius: {
						topLeft: 8,
						topRight: 8,
						bottomLeft: 0,
						bottomRight: 0
					},
					scales: {
						x: {
							border: {
								display: false,
							},
							grid: {
								display: false,
								drawTicks: false,
							},
							display: true,
							type: 'timeseries',
							time: {
								unit: 'month',
								displayFormats: {
									month: 'MMM'
								},
							},
							ticks: {
								callback: function (value, index, values) {
									const date = new Date(value);
									const month = date.toLocaleString('ru-RU', { month: 'short' }).slice(0, 3);
									return month.charAt(0).toUpperCase() + month.slice(1);
								},
								font: {
									family: 'Open-sans',
									size: 14,
									weight: '400',
								},
								color: colors.textLight,
								padding: 20,
							},
							offset: true,
							offsetPercentage: 10,
						},
						y: {
							beginAtZero: true,
							border: {
								display: false,
							},
							grid: {
								color: '#f5f5f5',
								drawTicks: false,
							},
							ticks: {
								display: false,
							}
						}
					},
					plugins: {
						legend: {
							display: false
						},
						interaction: {
							mode: 'index',
							intersect: false,
						},
						tooltip: {
							enabled: false,
							external: externalTooltipHandler,
						},
					},
					barPercentage: 0.8,
				},
			});
	
			const graphQuantityByMonthAxesY = new Chart(canvasQuantityByMonthAxesY, {
				type: 'bar',
				data,
				options: {
					maintainAspectRatio: false,
					layout: {
						padding: {
							bottom: 59.35,
						},
					},
					borderRadius: {
						topLeft: 8,
						topRight: 8,
						bottomLeft: 0,
						bottomRight: 0
					},
					scales: {
						x: {
							display: false,
						},
						y: {
							beginAtZero: true,
							afterFit: (ctx) => {
								ctx.width = 46
							},
							border: {
								display: false,
							},
							grid: {
								color: '#f5f5f5',
								drawTicks: false,
							},
							ticks: {
								font: {
									family: 'Open-sans',
									size: 14,
									weight: '400',
								},
								color: colors.textLight,
								padding: 20,
							}
						}
					},
					plugins: {
						legend: {
							display: false
						},
						interaction: {
							mode: 'index',
							intersect: false,
						},
					},
				},
			});
	
			//** (Start) Graph Change Font-size **//
			function responsiveFonts() {
				const screenWidth = window.innerWidth
	
				if (screenWidth < 1200) {
					graphQuantityByMonth.config._config.options.scales.x.ticks.font.size = '10'
					graphQuantityByMonthAxesY.config._config.options.scales.y.ticks.font.size = '10'
				} else if (screenWidth > 1200) {
					graphQuantityByMonth.config._config.options.scales.x.ticks.font.size = '14'
					graphQuantityByMonthAxesY.config._config.options.scales.y.ticks.font.size = '14'
				}
	
				graphQuantityByMonth.resize()
				graphQuantityByMonthAxesY.resize()
			}
	
			window.addEventListener('resize', responsiveFonts)
			window.addEventListener('onload', responsiveFonts)
			//** (End) Graph Change Font-size **//
		}
		//** (End) Graph Init **//

})