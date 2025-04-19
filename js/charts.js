// js/charts.js
console.log("charts.js loaded");

// Usamos una IIFE para encapsular y exponer el objeto 'charts'
const charts = (() => {

    // Guardar referencias a las instancias de Chart.js creadas
    let chartInstances = {}; // Renombrado para evitar confusión con el objeto exportado

    const defaultChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true },
            tooltip: { enabled: true }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    // Función interna para inicializar o actualizar un gráfico
    function initializeChartInstance(canvasId, config) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) {
            console.warn(`Canvas with id "${canvasId}" not found.`);
            return null;
        }

        // Destruir gráfico existente si lo hubiera en este canvas
        if (chartInstances[canvasId]) {
            chartInstances[canvasId].destroy();
        }

        try {
            const newChart = new Chart(ctx, config);
            chartInstances[canvasId] = newChart; // Guardar la nueva instancia
            // Ocultar mensaje de "No hay datos" si el gráfico se inicializa
            const msgElement = document.getElementById(`${canvasId}Msg`);
            if (msgElement) msgElement.style.display = 'none';
            console.log(`Chart ${canvasId} initialized successfully.`);
            return newChart;
        } catch (error) {
            console.error(`Error initializing chart ${canvasId}:`, error);
             const msgElement = document.getElementById(`${canvasId}Msg`);
             if (msgElement) msgElement.style.display = 'block'; // Mostrar mensaje de error
            return null;
        }
    }

    // --- Funciones Públicas de Inicialización ---

    function initializeActivityChart(data = null) {
        const config = {
            type: 'line',
            data: data || { labels: [], datasets: [] },
            options: { ...defaultChartOptions, plugins: { title: { display: true, text: 'Actividad Reciente' } } }
        };
        initializeChartInstance('activityChart', config);
    }

    function initializeSportsProgressChart(data = null) {
        const config = {
            type: 'radar',
            data: data || { labels: [], datasets: [] },
            options: { ...defaultChartOptions, scales: { r: { angleLines: { display: true }, suggestedMin: 0, suggestedMax: 100, pointLabels: { font: { size: 10 } } } }, plugins: { title: { display: true, text: 'Progreso por Deporte' } } }
        };
        initializeChartInstance('sportsProgressChart', config);
    }

    function initializeSpecificMetricsChart(data = null, sportName = 'Deporte') {
        const config = {
            type: 'bar',
            data: data || { labels: [], datasets: [] },
            options: { ...defaultChartOptions, plugins: { title: { display: true, text: `Métricas Específicas (${sportName})` } } }
        };
         initializeChartInstance('specificMetricsChart', config);
         // Actualizar también el título en el HTML si es necesario
         const titleSpan = document.getElementById('analyticsSportFocus');
         if(titleSpan) titleSpan.textContent = sportName;
    }

    function initializePerformanceChart(data = null, metricName = 'Métrica') {
        const config = {
            type: 'line',
            data: data || { labels: [], datasets: [] },
            options: { ...defaultChartOptions, plugins: { title: { display: true, text: `Evolución (${metricName})` } } }
        };
         initializeChartInstance('performanceChart', config);
    }

    // Función para inicializar todos los gráficos (útil al cargar datos)
    function initializeAllCharts(analyticsData = null) {
        console.log("Initializing all charts...");
        // Llama a cada función de inicialización de este objeto
        initializeActivityChart(analyticsData?.activity);
        initializeSportsProgressChart(analyticsData?.sportsProgress);
        initializeSpecificMetricsChart(analyticsData?.specificMetrics, analyticsData?.sportFocusName); // Pasar nombre del deporte
        initializePerformanceChart(analyticsData?.performance, analyticsData?.performanceMetricName); // Pasar nombre de métrica
    }

    // --- Funciones de Actualización (si son necesarias) ---
    function updateChartData(chartId, newData) {
        const chart = chartInstances[chartId]; // Usar el objeto interno
        if (chart) {
            chart.data = newData;
            chart.update();
            console.log(`Chart ${chartId} updated.`);
        } else {
            console.warn(`Chart ${chartId} not found for update.`);
        }
    }

    // Objeto público que será asignado a la variable global 'charts'
    return {
        initializeActivityChart,
        initializeSportsProgressChart,
        initializeSpecificMetricsChart,
        initializePerformanceChart,
        initializeAllCharts,
        updateChartData
        // No necesitamos exponer initializeChartInstance directamente
    };

})(); // Fin de la IIFE
