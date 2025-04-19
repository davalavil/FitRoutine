// js/app.js
console.log("app.js loaded");

// Estado global simple
let currentViewDate = new Date(); // Para el calendario

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded and parsed. Initializing FitRoutine...");
    // Verificar objetos globales
    if (typeof api === 'undefined') console.error("FATAL: api object is not defined!");
    if (typeof ui === 'undefined') console.error("FATAL: ui object is not defined!");
    if (typeof charts === 'undefined') console.error("FATAL: charts object is not defined!");
    // Estado inicial sin usuario
    if (!api.getCurrentUser() && api.getUsers().length === 0) {
        console.log("No users found. Please add a user or load data.");
    }
    // Configurar UI básica (tabs, cierre de modales) ANTES de renderizar contenido
    ui.setupTabs();
    ui.setupModalClosers();
    // Renderizar estado inicial de la UI
    refreshUI();
    // Configurar listeners DESPUÉS de que el HTML inicial y los datos se hayan renderizado
    setupEventListeners();
    console.log("DEBUG: FitRoutine Initialized.");
});

// --- Función para Refrescar Toda la UI ---
function refreshUI() {
    console.log("DEBUG: Refreshing UI (Rendering state)...");
    try {
        const currentUser = api.getCurrentUser();
        const sports = api.getSports();
        // Renderizar componentes que siempre deben estar actualizados
        ui.updateCurrentUserDisplay(currentUser);
        ui.renderSportsSidebar(sports);
        ui.renderSportsList(sports); // Renderiza lista principal (incluye botón añadir)
        // Cargar datos específicos de la pestaña activa actual
        const activeTabId = document.querySelector('.tab-link.bg-blue-100')?.dataset.tab || 'dashboard';
        // ui.activateTab(activeTabId); // No es necesario reactivar visualmente aquí
        loadTabData(activeTabId); // Carga los datos específicos
        console.log("DEBUG: UI Refreshed (Rendering complete).");
    } catch (error) { console.error("ERROR during refreshUI:", error); }
}

// --- Carga de Datos por Pestaña ---
window.loadTabData = function(tabId) {
    // ... (sin cambios funcionales, solo logs) ...
};
function loadDashboardData() { /* ... */ }
function loadExerciseData(filters = {}) { /* ... */ }
function loadCalendarData(year, month) { /* ... */ }
function loadProgramsData() { /* ... */ }
function loadAnalyticsData() { /* ... */ }
function loadSportsData() {
    // Esta función ahora es menos necesaria porque refreshUI ya llama a renderSportsList.
    // Podríamos quitarla o dejarla por si añadimos más lógica específica a esta pestaña.
    console.log("Loading sports tab data (list already rendered by refreshUI)...");
    // ui.renderSportsList(api.getSports()); // Ya no es necesario aquí si refreshUI lo hace
}

// --- Event Listeners Setup (FUNCIÓN CENTRALIZADA) ---
function setupEventListeners() {
    console.log("------------------------------------------"); // Separador
    console.log("DEBUG: Setting up ALL event listeners START");
    console.log("------------------------------------------");

    // Función auxiliar para añadir listener y loguear DETALLADAMENTE
    const addListener = (selector, event, handler, parent = document) => {
         const element = parent.querySelector(selector);
         if (element) {
             // Quitar listener previo explícitamente antes de añadir
             element.removeEventListener(event, handler);
             element.addEventListener(event, handler);
             console.log(`DEBUG: OK Listener ${event} attached to ${selector}`);
         } else {
             // Loguear error si no se encuentra, podría indicar un problema
             console.error(`DEBUG: *** Element NOT FOUND for selector: ${selector} ***`);
         }
    };

    // Botones generales
    addListener('#saveDataBtn', 'click', handleSaveData);
    addListener('#loadDataInput', 'change', handleLoadData);

    // Botones para abrir modales (¡VERIFICAR ESTOS SELECTORES!)
    addListener('#addSportSidebarBtn', 'click', handleAddSportClick); // En sidebar
    addListener('#addSportBtn', 'click', handleAddSportClick);       // Botón superior en pestaña Deportes
    addListener('#addSportCardBtn', 'click', handleAddSportClick);    // Tarjeta "+" en pestaña Deportes
    addListener('#addUserBtnDropdown', 'click', handleAddUserClick);  // En dropdown usuario
    addListener('#addExerciseBtn', 'click', handleAddExerciseClick);  // En pestaña Ejercicios
    addListener('#addProgramBtn', 'click', handleAddProgramClick);   // En pestaña Programas
    addListener('#newSessionBtnDashboard', 'click', handleNewSessionClick); // En Dashboard

    // Formularios
    addListener('#sportForm', 'submit', handleSportFormSubmit);
    addListener('#userForm', 'submit', handleUserFormSubmit);
    addListener('#exerciseForm', 'submit', handleExerciseFormSubmit);
    addListener('#programForm', 'submit', handleProgramFormSubmit);
    addListener('#sessionForm', 'submit', handleSessionFormSubmit);

    // Dropdown de usuario (Delegación en el contenedor)
    // Es más robusto usar delegación aquí porque los links internos se regeneran
    const userDropdown = document.querySelector('#user-list-dropdown');
    if (userDropdown) {
        userDropdown.removeEventListener('click', handleUserSwitch); // Limpiar anterior
        userDropdown.addEventListener('click', handleUserSwitch);
        console.log("DEBUG: OK Listener click attached to #user-list-dropdown (delegation)");
    } else {
        console.error("DEBUG: *** Element NOT FOUND for selector: #user-list-dropdown ***");
    }


    // Calendario
    addListener('#prevMonthBtn', 'click', handlePrevMonth);
    addListener('#nextMonthBtn', 'click', handleNextMonth);
    addListener('#todayBtn', 'click', handleToday);
    addListener('#calendar-grid', 'click', handleCalendarDayClick); // Delegación
    addListener('#closeDailyDetailsBtn', 'click', ui.hideDailyDetails); // Directo a función UI
    addListener('#addSessionToDateBtn', 'click', handleAddSessionToDateClick);

    // Checklist (Delegación)
    addListener('#checklist-items', 'change', handleChecklistChange);

    // Delegación para botones Editar/Eliminar en listas
    addListener('#sports-list-container', 'click', handleSportsListActions);
    // addListener('#exercise-list-container', 'click', handleExerciseListActions); // Pendiente
    // addListener('#programs-list-container', 'click', handleProgramListActions); // Pendiente

    console.log("------------------------------------------");
    console.log("DEBUG: Event listeners setup END");
    console.log("------------------------------------------");
}


// --- Handlers (Añadidos logs al INICIO de cada handler) ---

function handleSaveData() { console.log(">>> DEBUG: handleSaveData TRIGGERED"); /* ... */ }
function handleLoadData(event) { console.log(">>> DEBUG: handleLoadData TRIGGERED"); /* ... */ }

function handleAddSportClick(event) {
    console.log(">>> DEBUG: handleAddSportClick TRIGGERED"); // <-- LOG AÑADIDO
    event.preventDefault();
    event.stopPropagation();
    if (ui.prepareSportModal()) {
        ui.openModal('sportModal');
    } else {
        ui.showMessage("Error al preparar el formulario de deporte.", "error");
    }
}

function handleAddUserClick(event) {
     console.log(">>> DEBUG: handleAddUserClick TRIGGERED"); // <-- LOG AÑADIDO
     event.preventDefault();
     event.stopPropagation();
     if (ui.prepareUserModal()) {
        ui.openModal('userModal');
     } else {
         ui.showMessage("Error al preparar el formulario de usuario.", "error");
     }
}

function handleAddExerciseClick(event) { console.log(">>> DEBUG: handleAddExerciseClick TRIGGERED"); /* ... */ }
function handleAddProgramClick(event) { console.log(">>> DEBUG: handleAddProgramClick TRIGGERED"); /* ... */ }
function handleNewSessionClick(event) { console.log(">>> DEBUG: handleNewSessionClick TRIGGERED"); /* ... */ }

function handleSportFormSubmit(event) { console.log(">>> DEBUG: handleSportFormSubmit TRIGGERED"); /* ... */ }
function handleUserFormSubmit(event) { console.log(">>> DEBUG: handleUserFormSubmit TRIGGERED"); /* ... */ }
function handleExerciseFormSubmit(e) { console.log(">>> DEBUG: handleExerciseFormSubmit TRIGGERED"); /* ... */ }
function handleProgramFormSubmit(e) { console.log(">>> DEBUG: handleProgramFormSubmit TRIGGERED"); /* ... */ }
function handleSessionFormSubmit(e) { console.log(">>> DEBUG: handleSessionFormSubmit TRIGGERED"); /* ... */ }

function handleUserSwitch(event) { console.log(">>> DEBUG: handleUserSwitch TRIGGERED"); /* ... */ }

function handlePrevMonth() { console.log(">>> DEBUG: handlePrevMonth TRIGGERED"); /* ... */ }
function handleNextMonth() { console.log(">>> DEBUG: handleNextMonth TRIGGERED"); /* ... */ }
function handleToday() { console.log(">>> DEBUG: handleToday TRIGGERED"); /* ... */ }
function handleCalendarDayClick(event) { console.log(">>> DEBUG: handleCalendarDayClick TRIGGERED"); /* ... */ }
function handleAddSessionToDateClick(event) { console.log(">>> DEBUG: handleAddSessionToDateClick TRIGGERED"); /* ... */ }

function handleChecklistChange(event) { console.log(">>> DEBUG: handleChecklistChange TRIGGERED"); /* ... */ }

function handleSportsListActions(event) { console.log(">>> DEBUG: handleSportsListActions TRIGGERED"); /* ... */ }

// Handler para clic en deporte de la sidebar
function handleSidebarSportClick(event) { console.log(">>> DEBUG: handleSidebarSportClick TRIGGERED"); /* ... */ }
