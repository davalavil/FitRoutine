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
    setupEventListeners();
    console.log("DEBUG: FitRoutine Initialized.");
});

// --- Función para Refrescar Toda la UI ---
function refreshUI() {
    console.log("DEBUG: Refreshing UI (Rendering state)...");
    try {
        const currentUser = api.getCurrentUser();
        ui.updateCurrentUserDisplay(currentUser);
        ui.renderSportsSidebar(api.getSports());
        const activeTabId = document.querySelector('.tab-link.bg-blue-100')?.dataset.tab || 'dashboard';
        ui.activateTab(activeTabId);
        loadTabData(activeTabId);
        console.log("DEBUG: UI Refreshed (Rendering complete).");
    } catch (error) {
         console.error("ERROR during refreshUI:", error);
    }
}

// --- Carga de Datos por Pestaña ---
window.loadTabData = function(tabId) {
     console.log(`DEBUG: Loading data for tab: ${tabId}`);
     try {
        switch (tabId) {
            case 'dashboard': loadDashboardData(); break;
            case 'exercises': loadExerciseData(); break;
            case 'calendar': loadCalendarData(currentViewDate.getFullYear(), currentViewDate.getMonth()); break;
            case 'programs': loadProgramsData(); break;
            case 'analytics': loadAnalyticsData(); break;
            case 'sports': loadSportsData(); break;
            default: console.warn(`No data loading logic defined for tab: ${tabId}`);
        }
     } catch(error) {
         console.error(`ERROR loading data for tab ${tabId}:`, error);
     }
}

function loadDashboardData() { console.log("Loading dashboard data..."); charts.initializeActivityChart(null); }
function loadExerciseData(filters = {}) { console.log("Loading exercises..."); /* ui.render... */ }
function loadCalendarData(year, month) { console.log(`Loading calendar data for ${year}-${month + 1}`); const sessions = api.getSessionsForMonth(year, month); ui.renderCalendarGrid(year, month, sessions); ui.hideDailyDetails(); }
function loadProgramsData() { console.log("Loading programs data..."); /* ui.render... */ }
function loadAnalyticsData() { console.log("Loading analytics data..."); charts.initializeAllCharts(null); }
function loadSportsData() { console.log("Loading sports data..."); ui.renderSportsList(api.getSports()); }

// --- Event Listeners Setup ---
function setupEventListeners() {
    console.log("DEBUG: Setting up ALL event listeners...");
    const addListener = (selector, event, handler, parent = document) => {
         const element = parent.querySelector(selector);
         console.log(`DEBUG: Attempting to attach ${event} listener to: ${selector}`, element ? 'Found' : 'NOT FOUND');
         if (element) {
             element.removeEventListener(event, handler);
             element.addEventListener(event, handler);
             // console.log(`DEBUG: Listener ${event} attached to ${selector}`); // Opcional: Descomentar si se necesita mucho detalle
         } else {
             console.warn(`DEBUG: Element not found for selector: ${selector}`);
         }
    };

    // Botones generales
    addListener('#saveDataBtn', 'click', handleSaveData);
    addListener('#loadDataInput', 'change', handleLoadData);

    // Botones para abrir modales
    addListener('#addSportSidebarBtn', 'click', handleAddSportClick);
    addListener('#addSportBtn', 'click', handleAddSportClick);
    addListener('#addSportCardBtn', 'click', handleAddSportClick);
    addListener('#addUserBtnDropdown', 'click', handleAddUserClick);
    addListener('#addExerciseBtn', 'click', handleAddExerciseClick);
    addListener('#addProgramBtn', 'click', handleAddProgramClick);
    addListener('#newSessionBtnDashboard', 'click', handleNewSessionClick);

    // Formularios
    addListener('#sportForm', 'submit', handleSportFormSubmit);
    addListener('#userForm', 'submit', handleUserFormSubmit);
    addListener('#exerciseForm', 'submit', handleExerciseFormSubmit);
    addListener('#programForm', 'submit', handleProgramFormSubmit);
    addListener('#sessionForm', 'submit', handleSessionFormSubmit);

    // Dropdown de usuario (delegación) - ¡Importante añadir el listener aquí!
    addListener('#user-list-dropdown', 'click', handleUserSwitch);

    // Calendario
    addListener('#prevMonthBtn', 'click', handlePrevMonth);
    addListener('#nextMonthBtn', 'click', handleNextMonth);
    addListener('#todayBtn', 'click', handleToday);
    addListener('#calendar-grid', 'click', handleCalendarDayClick);
    addListener('#closeDailyDetailsBtn', 'click', ui.hideDailyDetails); // Listener directo a la función UI
    addListener('#addSessionToDateBtn', 'click', handleAddSessionToDateClick);

    // Checklist (delegación)
    addListener('#checklist-items', 'change', handleChecklistChange);

    // Delegación para botones Editar/Eliminar en listas
    addListener('#sports-list-container', 'click', handleSportsListActions);

    console.log("DEBUG: Event listeners setup complete.");
}


// --- Handlers ---

function handleSaveData() { console.log("DEBUG: handleSaveData triggered"); /* ... */ }
function handleLoadData(event) { console.log("DEBUG: handleLoadData triggered"); /* ... */ }

function handleAddSportClick(event) {
    console.log("DEBUG: handleAddSportClick triggered");
    event.preventDefault();
    event.stopPropagation();
    if (ui.prepareSportModal()) {
        ui.openModal('sportModal');
    } else {
        ui.showMessage("Error al preparar el formulario de deporte.", "error");
    }
}

function handleAddUserClick(event) {
     console.log("DEBUG: handleAddUserClick triggered");
     event.preventDefault();
     event.stopPropagation();
     if (ui.prepareUserModal()) {
        ui.openModal('userModal');
     } else {
         ui.showMessage("Error al preparar el formulario de usuario.", "error");
     }
}

function handleAddExerciseClick(event) { console.log("DEBUG: handleAddExerciseClick triggered"); /* ... */ }
function handleAddProgramClick(event) { console.log("DEBUG: handleAddProgramClick triggered"); /* ... */ }
function handleNewSessionClick(event) { console.log("DEBUG: handleNewSessionClick triggered"); /* ... */ }


// --- Handlers para Formularios ---
function handleSportFormSubmit(event) {
    event.preventDefault(); // Prevenir recarga
    console.log("DEBUG: handleSportFormSubmit triggered");
    const form = event.target;
    const formData = new FormData(form); // Crear FormData

    // Construir el objeto de datos manualmente
    const sportData = {
        // Obtener ID solo si existe (para editar)
        id: formData.get('id') || null, // Usar null si no está presente
        name: formData.get('name'),
        icon: formData.get('icon'),
        color: formData.get('color')
        // Las métricas se añaden después
    };

    // Obtener valores seleccionados del <select multiple> CORRECTAMENTE
    const selectedMetrics = Array.from(form.querySelector('#sportMetricsSelect').selectedOptions)
                              .map(option => option.value);
    sportData.metrics = selectedMetrics; // Añadir el array de métricas

    console.log("DEBUG: Saving sport data:", sportData); // Log para ver qué se va a guardar

    let saved = false;
    let errorOccurred = false;

    if (sportData.id) { // Editando
        console.warn("Sport edit logic in api.js not implemented yet.");
        // saved = api.updateSport(sportData); // Cuando implementes api.updateSport
        // if (!saved) errorOccurred = true; // Marcar error si updateSport falla
        ui.showMessage("Funcionalidad de editar deporte pendiente.", "info"); // Mensaje temporal
        // Por ahora, no marcamos como guardado para no refrescar
    } else { // Añadiendo
        try {
            const added = api.addSport(sportData); // Llamar a la función de la API
            if (added) {
                console.log("Sport added via form:", added);
                saved = true;
            } else {
                 // api.addSport devuelve null si falla la validación interna
                 ui.showMessage("Error al añadir el deporte (posiblemente falte el nombre).", "warning");
                 errorOccurred = true;
            }
        } catch (e) {
            console.error("Error calling api.addSport:", e);
            ui.showMessage("Error inesperado al guardar el deporte.", "error");
            errorOccurred = true;
        }
    }

    // Solo actuar si no hubo errores Y se guardó algo (o se intentó editar)
    if (saved && !errorOccurred) {
        ui.closeModal('sportModal');
        refreshUI(); // <-- Refresh completo para asegurar consistencia en todas las listas
        ui.showMessage("Deporte guardado.", "success");
    } else {
        console.log("DEBUG: Sport not saved or error occurred, modal remains open.");
        // No cerrar el modal si hubo un error, para que el usuario pueda corregir
    }
}


function handleUserFormSubmit(event) {
    console.log("DEBUG: handleUserFormSubmit triggered");
     event.preventDefault();
     const formData = new FormData(event.target);
     const userData = Object.fromEntries(formData.entries());

     try {
         const added = api.addUser(userData);
         if (added) {
            console.log("User added via form:", added);
            refreshUI(); // Refresh completo
            ui.closeModal('userModal');
            ui.showMessage("Usuario añadido.", "success");
         } else {
              ui.showMessage("Error al añadir el usuario (verifica nombre/iniciales).", "warning");
         }
     } catch (e) {
          console.error("Error calling api.addUser:", e);
          ui.showMessage("Error inesperado al guardar el usuario.", "error");
     }
}

function handleExerciseFormSubmit(e) { e.preventDefault(); console.log("DEBUG: handleExerciseFormSubmit triggered"); console.warn("Exercise form submit not implemented"); }
function handleProgramFormSubmit(e) { e.preventDefault(); console.log("DEBUG: handleProgramFormSubmit triggered"); console.warn("Program form submit not implemented"); }
function handleSessionFormSubmit(e) { e.preventDefault(); console.log("DEBUG: handleSessionFormSubmit triggered"); console.warn("Session form submit not implemented"); }


// Handler para Cambio de Usuario
function handleUserSwitch(event) {
    console.log("DEBUG: handleUserSwitch triggered by click on dropdown area");
    const link = event.target.closest('.user-switch-link');
    if (link) {
        event.preventDefault();
        const userId = link.dataset.userid;
        console.log("Switching user to:", userId);
        const oldUser = api.getCurrentUser()?.name;
        if (api.setCurrentUser(userId)) {
             const newUser = api.getCurrentUser()?.name;
             ui.showMessage(`Usuario cambiado de ${oldUser || 'nadie'} a ${newUser}.`, "info");
             refreshUI();
        } else {
             ui.showMessage("No se pudo cambiar el usuario.", "error");
        }
    }
}

// Handlers Calendario
function handlePrevMonth() { console.log("DEBUG: handlePrevMonth triggered"); currentViewDate.setMonth(currentViewDate.getMonth() - 1); loadCalendarData(currentViewDate.getFullYear(), currentViewDate.getMonth()); }
function handleNextMonth() { console.log("DEBUG: handleNextMonth triggered"); currentViewDate.setMonth(currentViewDate.getMonth() + 1); loadCalendarData(currentViewDate.getFullYear(), currentViewDate.getMonth()); }
function handleToday() { console.log("DEBUG: handleToday triggered"); currentViewDate = new Date(); loadCalendarData(currentViewDate.getFullYear(), currentViewDate.getMonth()); }
function handleCalendarDayClick(event) { console.log("DEBUG: handleCalendarDayClick triggered"); const cell = event.target.closest('.calendar-day-cell:not(.other-month)'); if (cell) { const date = cell.dataset.date; const sessions = api.getSessionsForDate(date); ui.showDailyDetails(date, sessions); } }
 function handleAddSessionToDateClick(event) { console.log("DEBUG: handleAddSessionToDateClick triggered"); /* ... (lógica pendiente) ... */ }

// Handler Checklist
function handleChecklistChange(event) { console.log("DEBUG: handleChecklistChange triggered"); /* ... (lógica pendiente) ... */ }

// Handler para Acciones en Lista de Deportes
function handleSportsListActions(event) { console.log("DEBUG: handleSportsListActions triggered"); /* ... (lógica sin cambios funcionales) ... */ }
