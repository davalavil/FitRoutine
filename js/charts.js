// js/charts.js

// Guardar referencias a los gráficos para poder actualizarlos/destruirlos
let charts = {};

function initializeChart(ctx, config) {
    if (!ctx) return null;
    // Destruir gráfico existente si lo hubiera en este canvas
    const chartId = ctx.canvas.id;
    if (charts[chartId]) {
        charts[chartId].destroy();
    }
    const newChart = new Chart(ctx, config);
    charts[chartId] = newChart;
    return newChart;
}

function initializeActivityChart(data) {
    const ctx = document.getElementById('activityChart')?.getContext('2d');
    const config = {
        type: 'line',
        data: data || { // Datos por defecto o pasados como argumento
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [/* ... */]
        },
        options: { /* ... Opciones del gráfico ... */ }
    };
    initializeChart(ctx, config);
}

function initializeSportsProgressChart(data) {
     const ctx = document.getElementById('sportsProgressChart')?.getContext('2d');
     const config = { type: 'radar', data: data, options: { /* ... */ } };
     initializeChart(ctx, config);
}

 function initializeSpecificMetricsChart(data) {
    const ctx = document.getElementById('specificMetricsChart')?.getContext('2d'); // Cambiado ID del HTML
    const config = { type: 'bar', data: data, options: { /* ... */ } };
    initializeChart(ctx, config);
}

function initializePerformanceChart(data) {
    const ctx = document.getElementById('performanceChart')?.getContext('2d');
    const config = { type: 'line', data: data, options: { /* ... */ } };
    initializeChart(ctx, config);
}

function initializeAllCharts(analyticsData) {
    // Llamar a cada función de inicialización, pasando los datos adecuados
    // Estos datos vendrían de api.js
    try {
        initializeActivityChart(analyticsData?.activity);
        initializeSportsProgressChart(analyticsData?.sportsProgress);
        initializeSpecificMetricsChart(analyticsData?.specificMetrics);
        initializePerformanceChart(analyticsData?.performance);
    } catch (error) {
        console.error("Error initializing charts:", error);
    }
}

// Exportar si se usan módulos
// export { initializeAllCharts, initializeActivityChart, ... };