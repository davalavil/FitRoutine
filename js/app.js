// js/app.js
console.log("app.js loaded");

// Estado global simple
let currentViewDate = new Date(); // Para el calendario

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    // ... (inicio sin cambios) ...
    console.log("DOM fully loaded and parsed. Initializing FitRoutine...");
    if (!api.getCurrentUser() && api.getUsers().length === 0) {
        console.log("No users found. Please add a user or load data.");
    }
    ui.setupTabs();
    ui.setupModalClosers();
    refreshUI();
    setupEventListeners();
    console.log("FitRoutine Initialized.");
});

// --- Función para Refrescar Toda la UI ---
function refreshUI() {
    // ... (sin cambios) ...
    console.log("Refreshing UI...");
    const currentUser = api.getCurrentUser();
    ui.updateCurrentUserDisplay(currentUser);
    ui.renderSportsSidebar(api.getSports());
    const activeTabId = document.querySelector('.tab-link.bg-blue-100')?.dataset.tab || 'dashboard';
    ui.activateTab(activeTabId);
    loadTabData(activeTabId);
    console.log("UI Refreshed.");
}

// --- Carga de Datos por Pestaña ---
window.loadTabData = function(tabId) {
    // ... (sin cambios) ...
    console.log(`Loading data for tab: ${tabId}`);
    // ... (switch case sin cambios) ...
     switch (tabId) {
        case 'dashboard': loadDashboardData(); break;
        case 'exercises': loadExerciseData(); break;
        case 'calendar': loadCalendarData(currentViewDate.getFullYear(), currentViewDate.getMonth()); break;
        case 'programs': loadProgramsData(); break;
        case 'analytics': loadAnalyticsData(); break;
        case 'sports': loadSportsData(); break;
        default: console.warn(`No data loading logic defined for tab: ${tabId}`);
    }
}
function loadDashboardData() { /* ... */ }
function loadExerciseData(filters = {}) { /* ... */ }
function loadCalendarData(year, month) { /* ... */ }
function loadProgramsData() { /* ... */ }
function loadAnalyticsData() { /* ... */ }
function loadSportsData() { /* ... */ }

// --- Event Listeners Setup ---
function setupEventListeners() {
    // ... (sin cambios) ...
}

// --- Handlers ---

function handleSaveData() { /* ... */ }
function handleLoadData(event) { /* ... */ }

// Handlers para Modales (MODIFICADOS)
function handleAddSportClick(event) {
    event.preventDefault();
    event.stopPropagation(); // Detener la propagación del clic original
    console.log("Add Sport button clicked.");
    // Solo abrir si la preparación fue exitosa
    if (ui.prepareSportModal()) { // Ahora prepareSportModal devuelve true/false
        ui.openModal('sportModal');
    } else {
        ui.showMessage("Error al preparar el formulario de deporte.", "error");
    }
}

function handleAddUserClick(event) {
     event.preventDefault();
     event.stopPropagation(); // Detener propagación
     console.log("Add User button clicked.");
      // Solo abrir si la preparación fue exitosa
     if (ui.prepareUserModal()) { // Ahora prepareUserModal devuelve true/false
        ui.openModal('userModal');
     } else {
         ui.showMessage("Error al preparar el formulario de usuario.", "error");
     }
}

function handleAddExerciseClick(event) {
    event.preventDefault(); event.stopPropagation(); // Añadir stopPropagation
    // TODO: Implementar ui.prepareExerciseModal() que devuelva true/false
    // if (ui.prepareExerciseModal()) {
    //     ui.openModal('exerciseModal');
    // } else { ... }
    ui.openModal('exerciseModal'); // Temporalmente abrir sin chequeo
    console.warn("Exercise modal preparation check not implemented.");
}
function handleAddProgramClick(event) {
     event.preventDefault(); event.stopPropagation(); // Añadir stopPropagation
     // TODO: Implementar ui.prepareProgramModal() que devuelva true/false
     ui.openModal('programModal');
     console.warn("Program modal preparation check not implemented.");
 }
function handleNewSessionClick(event) {
     event.preventDefault(); event.stopPropagation(); // Añadir stopPropagation
     // TODO: Implementar ui.prepareSessionModal() que devuelva true/false
     ui.openModal('sessionModal');
     console.warn("Session modal preparation check not implemented.");
}

// Handlers para Formularios
function handleSportFormSubmit(event) { /* ... (sin cambios) ... */ }
function handleUserFormSubmit(event) { /* ... (sin cambios) ... */ }
// ... otros handlers de formulario ...

// Handler para Cambio de Usuario
function handleUserSwitch(event) { /* ... (sin cambios) ... */ }

// Handlers Calendario
function handlePrevMonth() { /* ... */ }
function handleNextMonth() { /* ... */ }
function handleToday() { /* ... */ }
function handleCalendarDayClick(event) { /* ... */ }
 function handleAddSessionToDateClick(event) {
      event.stopPropagation(); // Añadir stopPropagation aquí también
      // ... (resto del código sin cambios) ...
 }

// Handler Checklist
function handleChecklistChange(event) { /* ... */ }

// Handler para Acciones en Lista de Deportes
function handleSportsListActions(event) {
    const deleteBtn = event.target.closest('.delete-sport-btn');
    const configBtn = event.target.closest('.configure-sport-btn'); // Botón editar/configurar

    if (deleteBtn) {
        event.stopPropagation(); // Detener si se hace clic en eliminar
        const sportId = deleteBtn.dataset.sportid;
        const sport = api.getSportById(sportId);
        if (sport && confirm(`¿Seguro que quieres eliminar el deporte "${sport.name}"? Esto no se puede deshacer.`)) {
            if (api.deleteSport(sportId)) {
                ui.showMessage("Deporte eliminado.", "success");
                refreshUI();
            } else {
                 ui.showMessage("Error al eliminar el deporte.", "error");
            }
        }
    } else if (configBtn) {
        event.stopPropagation(); // Detener si se hace clic en configurar
        const sportId = configBtn.dataset.sportid;
        const sport = api.getSportById(sportId);
        if (sport) {
           console.log("Editing sport (handler):", sport);
           // Solo abrir si la preparación fue exitosa
           if(ui.prepareSportModal(sport)){ // Pasar el deporte a preparar
                ui.openModal('sportModal');
           } else {
               ui.showMessage("Error al preparar el formulario para editar el deporte.", "error");
           }
        } else {
            console.warn("Sport not found for editing:", sportId);
        }
    }
 }
