// js/charts.js
console.log("charts.js loaded");

// Guardar referencias a los gráficos para poder actualizarlos/destruirlos
let charts = {};
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

function initializeChart(ctx, config) {
    if (!ctx) return null;
    const chartId = ctx.canvas.id;
    if (charts[chartId]) {
        charts[chartId].destroy(); // Destruir gráfico existente si lo hubiera
    }
    try {
        const newChart = new Chart(ctx, config);
        charts[chartId] = newChart;
        // Ocultar mensaje de "No hay datos" si el gráfico se inicializa
        const msgElement = document.getElementById(`${chartId}Msg`);
        if (msgElement) msgElement.style.display = 'none';
        return newChart;
    } catch (error) {
        console.error(`Error initializing chart ${chartId}:`, error);
         const msgElement = document.getElementById(`${chartId}Msg`);
         if (msgElement) msgElement.style.display = 'block';
        return null;
    }
}

// --- Funciones de Inicialización Específicas ---

function initializeActivityChart(data = null) {
    const ctx = document.getElementById('activityChart')?.getContext('2d');
    const config = {
        type: 'line',
        data: data || { labels: [], datasets: [] }, // Espera datos o vacío
        options: { ...defaultChartOptions }
    };
    initializeChart(ctx, config);
}

function initializeSportsProgressChart(data = null) {
    const ctx = document.getElementById('sportsProgressChart')?.getContext('2d');
    const config = {
        type: 'radar',
        data: data || { labels: [], datasets: [] },
        options: { ...defaultChartOptions, scales: { r: { angleLines: { display: true }, suggestedMin: 0, suggestedMax: 100 } } }
    };
    initializeChart(ctx, config);
}

function initializeSpecificMetricsChart(data = null) {
    const ctx = document.getElementById('specificMetricsChart')?.getContext('2d');
    const config = {
        type: 'bar',
        data: data || { labels: [], datasets: [] },
        options: { ...defaultChartOptions }
    };
     initializeChart(ctx, config);
}

function initializePerformanceChart(data = null) {
    const ctx = document.getElementById('performanceChart')?.getContext('2d');
    const config = {
        type: 'line',
        data: data || { labels: [], datasets: [] },
        options: { ...defaultChartOptions }
    };
     initializeChart(ctx, config);
}

function initializeAllCharts(analyticsData = null) {
    console.log("Initializing all charts...");
    // Llama a cada función de inicialización, pasando los datos adecuados o null
    initializeActivityChart(analyticsData?.activity);
    initializeSportsProgressChart(analyticsData?.sportsProgress);
    initializeSpecificMetricsChart(analyticsData?.specificMetrics);
    initializePerformanceChart(analyticsData?.performance);
}

// --- Funciones de Actualización (si son necesarias) ---
function updateChartData(chartId, newData) {
    const chart = charts[chartId];
    if (chart) {
        chart.data = newData;
        chart.update();
        console.log(`Chart ${chartId} updated.`);
    } else {
        console.warn(`Chart ${chartId} not found for update.`);
    }
}
