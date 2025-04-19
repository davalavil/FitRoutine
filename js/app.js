// js/app.js
console.log("app.js loaded");

// Estado global simple
let currentViewDate = new Date(); // Para el calendario

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded and parsed. Initializing FitRoutine...");

    // Verificar que los objetos api, ui, charts existen
    if (typeof api === 'undefined') console.error("FATAL: api object is not defined!");
    if (typeof ui === 'undefined') console.error("FATAL: ui object is not defined!");
    if (typeof charts === 'undefined') console.error("FATAL: charts object is not defined!");

    // Intentar cargar datos o configurar estado inicial
    if (!api.getCurrentUser() && api.getUsers().length === 0) {
        console.log("No users found. Please add a user or load data.");
    }

    // Configurar UI básica (tabs, modales)
    ui.setupTabs();       // Configura listeners para las pestañas
    ui.setupModalClosers(); // Configura listeners para cerrar modales (X, Cancel, clic fuera)

    // Renderizar estado inicial de la UI basado en appData
    // Esta función AHORA NO debe configurar listeners generales, solo mostrar datos
    refreshUI();

    // Configurar TODOS los Event Listeners de la aplicación DESPUÉS de la carga inicial
    setupEventListeners(); // <-- Llamada movida aquí

    console.log("DEBUG: FitRoutine Initialized.");
});

// --- Función para Refrescar Toda la UI (SOLO RENDERIZADO) ---
function refreshUI() {
    console.log("DEBUG: Refreshing UI (Rendering state)...");
    try {
        const currentUser = api.getCurrentUser();
        ui.updateCurrentUserDisplay(currentUser); // Actualiza avatar y dropdown
        ui.renderSportsSidebar(api.getSports()); // Actualiza lista deportes sidebar

        // Cargar datos de la pestaña activa actual (SOLO CARGA DATOS, NO LISTENERS)
        const activeTabId = document.querySelector('.tab-link.bg-blue-100')?.dataset.tab || 'dashboard';
        ui.activateTab(activeTabId); // Asegura clase 'active'
        loadTabData(activeTabId); // Carga los datos específicos

        console.log("DEBUG: UI Refreshed (Rendering complete).");
    } catch (error) {
         console.error("ERROR during refreshUI:", error);
    }
}

// --- Carga de Datos por Pestaña ---
window.loadTabData = function(tabId) {
     console.log(`DEBUG: Loading data for tab: ${tabId}`);
     try { // Envuelve en try-catch por si falla la carga de datos de una pestaña
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

// --- Event Listeners Setup (FUNCIÓN CENTRALIZADA) ---
function setupEventListeners() {
    console.log("DEBUG: Setting up ALL event listeners...");

    // Función auxiliar para añadir listener y loguear
    const addListener = (selector, event, handler, parent = document) => {
         const element = parent.querySelector(selector); // Usar querySelector para más flexibilidad
         console.log(`DEBUG: Attempting to attach ${event} listener to: ${selector}`, element ? 'Found' : 'NOT FOUND');
         if (element) {
             element.removeEventListener(event, handler); // Quitar listener previo por si acaso
             element.addEventListener(event, handler);
             console.log(`DEBUG: Listener ${event} attached to ${selector}`);
         } else {
             console.warn(`DEBUG: Element not found for selector: ${selector}`);
         }
    };

    // Botones generales
    addListener('#saveDataBtn', 'click', handleSaveData);
    addListener('#loadDataInput', 'change', handleLoadData);

    // Botones para abrir modales (usando #id)
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


    // Dropdown de usuario (delegación en el contenedor)
    // Quitamos la delegación por ahora para simplificar, usamos el listener directo al link si existe
    // Si la lista se carga dinámicamente SÍ necesitaríamos delegación.
    //addListener('#user-list-dropdown', 'click', handleUserSwitch);


    // Calendario
    addListener('#prevMonthBtn', 'click', handlePrevMonth);
    addListener('#nextMonthBtn', 'click', handleNextMonth);
    addListener('#todayBtn', 'click', handleToday);
    addListener('#calendar-grid', 'click', handleCalendarDayClick); // Delegación en la cuadrícula
    addListener('#closeDailyDetailsBtn', 'click', ui.hideDailyDetails);
    addListener('#addSessionToDateBtn', 'click', handleAddSessionToDateClick);

    // Checklist (delegación en el contenedor)
    addListener('#checklist-items', 'change', handleChecklistChange);

     // Delegación para botones Editar/Eliminar en listas
     addListener('#sports-list-container', 'click', handleSportsListActions);
     // addListener('#exercise-list-container', 'click', handleExerciseListActions); // Pendiente
     // addListener('#programs-list-container', 'click', handleProgramListActions); // Pendiente


    console.log("DEBUG: Event listeners setup complete.");
}


// --- Handlers (Añadir logs al inicio de cada uno) ---

function handleSaveData() { console.log("DEBUG: handleSaveData triggered"); /* ... */ }
function handleLoadData(event) { console.log("DEBUG: handleLoadData triggered"); /* ... */ }

function handleAddSportClick(event) {
    console.log("DEBUG: handleAddSportClick triggered"); // <-- Log añadido
    event.preventDefault();
    event.stopPropagation();
    if (ui.prepareSportModal()) {
        ui.openModal('sportModal');
    } else {
        ui.showMessage("Error al preparar el formulario de deporte.", "error");
    }
}

function handleAddUserClick(event) {
     console.log("DEBUG: handleAddUserClick triggered"); // <-- Log añadido
     event.preventDefault();
     event.stopPropagation();
     if (ui.prepareUserModal()) {
        ui.openModal('userModal');
     } else {
         ui.showMessage("Error al preparar el formulario de usuario.", "error");
     }
}

function handleAddExerciseClick(event) { console.log("DEBUG: handleAddExerciseClick triggered"); event.preventDefault(); event.stopPropagation(); ui.openModal('exerciseModal'); console.warn("Exercise modal preparation check not implemented."); }
function handleAddProgramClick(event) { console.log("DEBUG: handleAddProgramClick triggered"); event.preventDefault(); event.stopPropagation(); ui.openModal('programModal'); console.warn("Program modal preparation check not implemented."); }
function handleNewSessionClick(event) { console.log("DEBUG: handleNewSessionClick triggered"); event.preventDefault(); event.stopPropagation(); ui.openModal('sessionModal'); console.warn("Session modal preparation check not implemented."); }


function handleSportFormSubmit(event) { console.log("DEBUG: handleSportFormSubmit triggered"); /* ... (resto sin cambios) ... */ }
function handleUserFormSubmit(event) { console.log("DEBUG: handleUserFormSubmit triggered"); /* ... (resto sin cambios) ... */ }
function handleExerciseFormSubmit(e) { e.preventDefault(); console.log("DEBUG: handleExerciseFormSubmit triggered"); console.warn("Exercise form submit not implemented"); }
function handleProgramFormSubmit(e) { e.preventDefault(); console.log("DEBUG: handleProgramFormSubmit triggered"); console.warn("Program form submit not implemented"); }
function handleSessionFormSubmit(e) { e.preventDefault(); console.log("DEBUG: handleSessionFormSubmit triggered"); console.warn("Session form submit not implemented"); }


function handleUserSwitch(event) {
    console.log("DEBUG: handleUserSwitch triggered");
    // REIMPLEMENTAR: Listener directo en los links que se añaden dinámicamente
    // O usar delegación correctamente:
    const link = event.target.closest('.user-switch-link'); // Comprobar si el clic fue en un link de usuario
    if (link) {
        event.preventDefault(); // Prevenir acción del link '#'
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
function handlePrevMonth() { console.log("DEBUG: handlePrevMonth triggered"); /* ... */ }
function handleNextMonth() { console.log("DEBUG: handleNextMonth triggered"); /* ... */ }
function handleToday() { console.log("DEBUG: handleToday triggered"); /* ... */ }
function handleCalendarDayClick(event) { console.log("DEBUG: handleCalendarDayClick triggered"); /* ... */ }
 function handleAddSessionToDateClick(event) { console.log("DEBUG: handleAddSessionToDateClick triggered"); /* ... */ }

// Handler Checklist
function handleChecklistChange(event) { console.log("DEBUG: handleChecklistChange triggered"); /* ... */ }

// Handler para Acciones en Lista de Deportes
function handleSportsListActions(event) { console.log("DEBUG: handleSportsListActions triggered"); /* ... */ }
