// js/app.js
console.log("app.js loaded");

// Estado global simple
let currentViewDate = new Date(); // Para el calendario

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded and parsed. Initializing FitRoutine...");
    if (typeof api === 'undefined') console.error("FATAL: api object is not defined!");
    if (typeof ui === 'undefined') console.error("FATAL: ui object is not defined!");
    if (typeof charts === 'undefined') console.error("FATAL: charts object is not defined!");
    if (!api.getCurrentUser() && api.getUsers().length === 0) {
        console.log("No users found. Please add a user or load data.");
    }
    ui.setupTabs();
    ui.setupModalClosers();
    refreshUI();
    setupEventListeners(); // Configurar listeners DESPUÉS del primer render
    console.log("DEBUG: FitRoutine Initialized.");
});

// --- Función para Refrescar Toda la UI ---
function refreshUI() {
    console.log("DEBUG: Refreshing UI (Rendering state)...");
    try {
        const currentUser = api.getCurrentUser();
        const sports = api.getSports(); // Obtener deportes una vez

        // Renderizar componentes que siempre deben estar actualizados
        ui.updateCurrentUserDisplay(currentUser); // Actualiza avatar y dropdown
        ui.renderSportsSidebar(sports);      // Actualiza lista deportes sidebar
        ui.renderSportsList(sports);         // <-- MODIFICADO: Renderiza siempre la lista principal también

        // Cargar datos específicos de la pestaña activa actual
        const activeTabId = document.querySelector('.tab-link.bg-blue-100')?.dataset.tab || 'dashboard';
        ui.activateTab(activeTabId); // Asegura clase 'active' (no recarga datos)
        loadTabData(activeTabId); // Carga los datos específicos de la pestaña activa

        console.log("DEBUG: UI Refreshed (Rendering complete).");
    } catch (error) {
         console.error("ERROR during refreshUI:", error);
         ui.showMessage("Error al actualizar la interfaz. Revisa la consola.", "error");
    }
}

// --- Carga de Datos por Pestaña ---
// Definimos loadTabData globalmente
window.loadTabData = function(tabId) {
     console.log(`DEBUG: Loading specific data for tab: ${tabId}`);
     try {
        switch (tabId) {
            case 'dashboard': loadDashboardData(); break;
            case 'exercises': loadExerciseData(); break; // Carga inicial sin filtro
            case 'calendar': loadCalendarData(currentViewDate.getFullYear(), currentViewDate.getMonth()); break;
            case 'programs': loadProgramsData(); break;
            case 'analytics': loadAnalyticsData(); break;
            case 'sports': /* Ya renderizado por refreshUI, no necesita carga extra */ break;
            default: console.warn(`No data loading logic defined for tab: ${tabId}`);
        }
     } catch(error) {
         console.error(`ERROR loading data for tab ${tabId}:`, error);
         ui.showMessage(`Error al cargar datos de ${tabId}.`, "error");
     }
}

function loadDashboardData() { console.log("Loading dashboard data..."); charts.initializeActivityChart(null); }
function loadExerciseData(filters = {}) {
    console.log("Loading exercises with filters:", filters);
    const exercises = api.getExercises(filters); // Implementar filtro en api.js si es necesario
    ui.renderExerciseList(exercises); // Necesitas crear ui.renderExerciseList
    ui.renderExerciseFilters(api.getSports()); // Necesitas crear ui.renderExerciseFilters
    console.warn("Exercise rendering implementation pending in ui.js.");
}
function loadCalendarData(year, month) { console.log(`Loading calendar data for ${year}-${month + 1}`); const sessions = api.getSessionsForMonth(year, month); ui.renderCalendarGrid(year, month, sessions); ui.hideDailyDetails(); }
function loadProgramsData() { console.log("Loading programs data..."); /* ui.render... */ }
function loadAnalyticsData() { console.log("Loading analytics data..."); charts.initializeAllCharts(null); }
// loadSportsData ya no es necesaria aquí porque refreshUI llama a renderSportsList

// --- Event Listeners Setup ---
function setupEventListeners() {
    console.log("DEBUG: Setting up ALL event listeners...");
    const addListener = (selector, event, handler, parent = document) => {
         // ... (función auxiliar sin cambios) ...
    };

    // ... (Listeners generales: save, load, modales, formularios sin cambios) ...
    addListener('#saveDataBtn', 'click', handleSaveData);
    addListener('#loadDataInput', 'change', handleLoadData);
    addListener('#addSportSidebarBtn', 'click', handleAddSportClick);
    addListener('#addSportBtn', 'click', handleAddSportClick);
    addListener('#addSportCardBtn', 'click', handleAddSportClick);
    addListener('#addUserBtnDropdown', 'click', handleAddUserClick);
    addListener('#addExerciseBtn', 'click', handleAddExerciseClick);
    addListener('#addProgramBtn', 'click', handleAddProgramClick);
    addListener('#newSessionBtnDashboard', 'click', handleNewSessionClick);
    addListener('#sportForm', 'submit', handleSportFormSubmit);
    addListener('#userForm', 'submit', handleUserFormSubmit);
    // ... otros forms ...
    addListener('#user-list-dropdown', 'click', handleUserSwitch); // Delegación para cambio usuario
    addListener('#prevMonthBtn', 'click', handlePrevMonth);
    addListener('#nextMonthBtn', 'click', handleNextMonth);
    addListener('#todayBtn', 'click', handleToday);
    addListener('#calendar-grid', 'click', handleCalendarDayClick);
    addListener('#closeDailyDetailsBtn', 'click', ui.hideDailyDetails);
    addListener('#addSessionToDateBtn', 'click', handleAddSessionToDateClick);
    addListener('#checklist-items', 'change', handleChecklistChange);
    addListener('#sports-list-container', 'click', handleSportsListActions); // Acciones en pestaña Deportes

    // Listener para clics en la sidebar de deportes (NUEVO)
    addListener('#sports-list-sidebar', 'click', handleSidebarSportClick);

    console.log("DEBUG: Event listeners setup complete.");
}


// --- Handlers ---

function handleSaveData() { /* ... */ }
function handleLoadData(event) { /* ... */ }
function handleAddSportClick(event) { /* ... */ }
function handleAddUserClick(event) { /* ... */ }
function handleAddExerciseClick(event) { /* ... */ }
function handleAddProgramClick(event) { /* ... */ }
function handleNewSessionClick(event) { /* ... */ }
function handleSportFormSubmit(event) {
    event.preventDefault();
    console.log("DEBUG: handleSportFormSubmit triggered");
    const form = event.target;
    const formData = new FormData(form);
    const sportData = { id: formData.get('id') || null, name: formData.get('name'), icon: formData.get('icon'), color: formData.get('color') };
    const selectedMetrics = Array.from(form.querySelector('#sportMetricsSelect').selectedOptions).map(option => option.value);
    sportData.metrics = selectedMetrics;
    console.log("DEBUG: Saving sport data:", sportData);
    let saved = false;
    let errorOccurred = false;
    if (sportData.id) { // Editando (Pendiente en API)
        console.warn("Sport edit logic in api.js not implemented yet.");
        ui.showMessage("Funcionalidad de editar deporte pendiente.", "info");
    } else { // Añadiendo
        try {
            const added = api.addSport(sportData);
            if (added) { saved = true; } else { ui.showMessage("Error al añadir el deporte (posiblemente falte el nombre).", "warning"); errorOccurred = true; }
        } catch (e) { console.error("Error calling api.addSport:", e); ui.showMessage("Error inesperado al guardar el deporte.", "error"); errorOccurred = true; }
    }
    if (saved && !errorOccurred) {
        ui.closeModal('sportModal');
        refreshUI(); // <-- Llama a refreshUI que AHORA actualiza ambas listas
        ui.showMessage("Deporte guardado.", "success");
    } else { console.log("DEBUG: Sport not saved or error occurred, modal remains open."); }
}
function handleUserFormSubmit(event) { /* ... */ }
// ... otros handlers de formulario ...
function handleUserSwitch(event) { /* ... */ }
function handlePrevMonth() { /* ... */ }
function handleNextMonth() { /* ... */ }
function handleToday() { /* ... */ }
function handleCalendarDayClick(event) { /* ... */ }
function handleAddSessionToDateClick(event) { /* ... */ }
function handleChecklistChange(event) { /* ... */ }
function handleSportsListActions(event) { /* ... */ }

// Handler para clic en deporte de la sidebar (NUEVO)
function handleSidebarSportClick(event) {
    console.log("DEBUG: handleSidebarSportClick triggered");
    const link = event.target.closest('.sport-link'); // Busca el enlace padre
    if (link) {
        event.preventDefault(); // Prevenir navegación si es un '#'
        const sportId = link.dataset.sportid;
        const sport = api.getSportById(sportId); // Obtener datos del deporte
        if (sport) {
            console.log(`Clicked on sidebar sport: ${sport.name} (ID: ${sportId})`);

            // Acción 1: Cambiar a la pestaña de Ejercicios
            ui.activateTab('exercises'); // Activa visualmente la pestaña

            // Acción 2: Cargar y mostrar SOLO los ejercicios de ese deporte
            loadExerciseData({ sportId: sportId }); // Llama a la función que carga/filtra/renderiza

            // Acción futura: podrías llevar a una vista de detalle del deporte, o a análisis filtrados, etc.
            ui.showMessage(`Mostrando ejercicios para ${sport.name}.`, 'info');

        } else {
            console.warn(`Sidebar sport link clicked, but sport not found for ID: ${sportId}`);
        }
    }
}
