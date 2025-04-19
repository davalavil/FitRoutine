// js/app.js
console.log("app.js loaded");

// Estado global simple
let currentViewDate = new Date(); // Para el calendario

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed. Initializing FitRoutine...");

    // Carga inicial de datos (o usa datos por defecto si no hay nada guardado)
    // En este punto, api.appData podría estar vacío o tener datos de una carga previa (pero no de localStorage)
    if (!api.getCurrentUser() && api.getUsers().length === 0) {
        console.log("No users found. Please add a user or load data.");
        // Opcionalmente, añadir un usuario por defecto para pruebas iniciales:
        // api.addUser({ name: "Default User", initials: "DU" });
    }

    // Configurar UI básica (tabs, modales)
    ui.setupTabs();
    ui.setupModalClosers();

    // Renderizar estado inicial de la UI basado en appData
    refreshUI();

    // Configurar todos los Event Listeners
    setupEventListeners();

    console.log("FitRoutine Initialized.");
});

// --- Función para Refrescar Toda la UI ---
function refreshUI() {
    console.log("Refreshing UI...");
    const currentUser = api.getCurrentUser();
    ui.updateCurrentUserDisplay(currentUser);
    ui.renderSportsSidebar(api.getSports());

    // Cargar datos de la pestaña activa actual
    const activeTabId = document.querySelector('.tab-link.bg-blue-100')?.dataset.tab || 'dashboard';
    activateTab(activeTabId); // Asegura que la clase 'active' esté bien
    loadTabData(activeTabId); // Carga los datos específicos

    console.log("UI Refreshed.");
}

// --- Carga de Datos por Pestaña ---
function loadTabData(tabId) {
    console.log(`Loading data for tab: ${tabId}`);
    switch (tabId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'exercises':
            loadExerciseData();
            break;
        case 'calendar':
            loadCalendarData(currentViewDate.getFullYear(), currentViewDate.getMonth());
            break;
        case 'programs':
            loadProgramsData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'sports':
            loadSportsData();
            break;
        default:
            console.warn(`No data loading logic defined for tab: ${tabId}`);
    }
}

function loadDashboardData() {
    console.log("Loading dashboard data...");
    // ui.renderActivitySummary(api.getActivitySummary()); // Implementar api/ui
    // ui.renderUpcomingSessions(api.getUpcomingSessions()); // Implementar api/ui
    charts.initializeActivityChart(null); // Pasar datos reales cuando estén disponibles
}

function loadExerciseData(filters = {}) {
    console.log("Loading exercises with filters:", filters);
    // ui.renderExerciseFilters(api.getSports()); // Implementar ui
    const exercises = api.getExercises(filters);
    // ui.renderExerciseList(exercises); // Implementar ui
    console.warn("Exercise list rendering not implemented yet.");
}

function loadCalendarData(year, month) {
    console.log(`Loading calendar data for ${year}-${month + 1}`);
    const sessions = api.getSessionsForMonth(year, month);
    ui.renderCalendarGrid(year, month, sessions);
    ui.hideDailyDetails(); // Ocultar detalles al cambiar mes
}

function loadProgramsData() {
    console.log("Loading programs data...");
    const programs = api.getPrograms();
    // ui.renderProgramList(programs); // Implementar ui
    console.warn("Program list rendering not implemented yet.");
}

function loadAnalyticsData() {
    console.log("Loading analytics data...");
    const data = api.getAnalyticsData(); // Implementar api
    charts.initializeAllCharts(data);
}

function loadSportsData() {
    console.log("Loading sports data...");
    const sports = api.getSports();
    ui.renderSportsList(sports); // Implementar ui
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    console.log("Setting up event listeners...");

    // Botones generales
    document.getElementById('saveDataBtn')?.addEventListener('click', handleSaveData);
    document.getElementById('loadDataInput')?.addEventListener('change', handleLoadData);

    // Botones para abrir modales
    document.getElementById('addSportSidebarBtn')?.addEventListener('click', handleAddSportClick);
    document.getElementById('addSportBtn')?.addEventListener('click', handleAddSportClick);
    document.getElementById('addSportCardBtn')?.addEventListener('click', handleAddSportClick); // Añadido
    document.getElementById('addUserBtnDropdown')?.addEventListener('click', handleAddUserClick);
    document.getElementById('addExerciseBtn')?.addEventListener('click', handleAddExerciseClick);
    document.getElementById('addProgramBtn')?.addEventListener('click', handleAddProgramClick);
    document.getElementById('newSessionBtnDashboard')?.addEventListener('click', handleNewSessionClick);

    // Formularios
    document.getElementById('sportForm')?.addEventListener('submit', handleSportFormSubmit);
    document.getElementById('userForm')?.addEventListener('submit', handleUserFormSubmit);
    document.getElementById('exerciseForm')?.addEventListener('submit', handleExerciseFormSubmit);
    document.getElementById('programForm')?.addEventListener('submit', handleProgramFormSubmit);
    document.getElementById('sessionForm')?.addEventListener('submit', handleSessionFormSubmit);

    // Dropdown de usuario (delegación)
    document.getElementById('user-list-dropdown')?.addEventListener('click', handleUserSwitch);

    // Calendario
    document.getElementById('prevMonthBtn')?.addEventListener('click', handlePrevMonth);
    document.getElementById('nextMonthBtn')?.addEventListener('click', handleNextMonth);
    document.getElementById('todayBtn')?.addEventListener('click', handleToday);
    document.getElementById('calendar-grid')?.addEventListener('click', handleCalendarDayClick);
    document.getElementById('closeDailyDetailsBtn')?.addEventListener('click', ui.hideDailyDetails);
    document.getElementById('addSessionToDateBtn')?.addEventListener('click', handleAddSessionToDateClick);

    // Checklist (delegación)
    document.getElementById('checklist-items')?.addEventListener('change', handleChecklistChange);

     // Delegación para botones Editar/Eliminar en listas (Ej: Deportes)
     document.getElementById('sports-list-container')?.addEventListener('click', handleSportsListActions);

    // TODO: Añadir listeners para otras acciones (filtros, editar/eliminar ejercicios/programas, etc.)

    console.log("Event listeners setup complete.");
}


// --- Handlers (Funciones de respuesta a eventos) ---

// Guardar/Cargar Datos
function handleSaveData() {
    console.log("Save Data button clicked.");
    try {
        const dataToSave = api.getAllData();
        const jsonString = JSON.stringify(dataToSave, null, 2); // Indented JSON
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        a.download = `fitroutine_data_${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("Data saved to file.");
        ui.showMessage("Datos guardados correctamente.", "success");
    } catch (error) {
        console.error("Error saving data:", error);
        ui.showMessage("Error al guardar los datos.", "error");
    }
}

function handleLoadData(event) {
    console.log("Load Data input changed.");
    const file = event.target.files[0];
    if (!file) {
        console.log("No file selected.");
        return;
    }
    if (!file.name.endsWith('.json')) {
         ui.showMessage("Por favor, selecciona un archivo .json", "warning");
         event.target.value = null; // Reset input
         return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const parsedData = JSON.parse(e.target.result);
            if (api.loadAllData(parsedData)) { // Carga los datos en api.js
                console.log("Data loaded from file, refreshing UI...");
                refreshUI(); // Refresca toda la interfaz
                 ui.showMessage("Datos cargados correctamente.", "success");
            } else {
                // El mensaje de error ya se mostró en api.js
            }
        } catch (error) {
            console.error("Error parsing JSON file:", error);
             ui.showMessage("Error al leer o procesar el archivo JSON.", "error");
        } finally {
             // Resetear el input para permitir cargar el mismo archivo de nuevo si falla
             event.target.value = null;
        }
    };
    reader.onerror = () => {
        console.error("Error reading file:", reader.error);
         ui.showMessage("Error al leer el archivo.", "error");
         event.target.value = null;
    };
    reader.readAsText(file);
}


// Handlers para Modales
function handleAddSportClick(event) {
    event.preventDefault();
    console.log("Add Sport button clicked.");
    ui.prepareSportModal(); // Prepara el modal para añadir
    ui.openModal('sportModal');
}

function handleAddUserClick(event) {
     event.preventDefault();
     console.log("Add User button clicked.");
     ui.prepareUserModal();
     ui.openModal('userModal');
}

function handleAddExerciseClick() { ui.openModal('exerciseModal'); /* TODO: Preparar modal */ }
function handleAddProgramClick() { ui.openModal('programModal'); /* TODO: Preparar modal */ }
function handleNewSessionClick() { ui.openModal('sessionModal'); /* TODO: Preparar modal */ }

// Handlers para Formularios
function handleSportFormSubmit(event) {
    event.preventDefault();
    console.log("Sport form submitted.");
    const formData = new FormData(event.target);
    // Recoger métricas seleccionadas
    const metrics = Array.from(formData.getAll('metrics'));
    const sportData = Object.fromEntries(formData.entries());
    sportData.metrics = metrics; // Reemplazar con el array

    // Eliminar 'metrics' individual si existe (por si acaso)
    delete sportData.metrics;

    if (sportData.id) { // Editando (lógica pendiente)
        console.warn("Sport edit logic not implemented yet.");
        // const updated = api.updateSport(sportData);
    } else { // Añadiendo
        const added = api.addSport(sportData);
        if (added) {
            console.log("Sport added via form:", added);
        } else {
             ui.showMessage("Error al añadir el deporte.", "error");
             return; // No cerrar modal ni refrescar si falla
        }
    }

    ui.closeModal('sportModal');
    ui.renderSportsSidebar(api.getSports()); // Actualizar sidebar
    if (document.getElementById('sports')?.classList.contains('active')) {
         ui.renderSportsList(api.getSports()); // Actualizar lista en pestaña si está activa
    }
     ui.showMessage("Deporte guardado.", "success");
}

function handleUserFormSubmit(event) {
     event.preventDefault();
     console.log("User form submitted.");
     const formData = new FormData(event.target);
     const userData = Object.fromEntries(formData.entries());

     const added = api.addUser(userData);
     if (added) {
        console.log("User added via form:", added);
        ui.updateCurrentUserDisplay(api.getCurrentUser()); // Actualiza el avatar/nombre principal
        ui.updateUserDropdown(api.getUsers()); // Actualiza la lista del dropdown
         ui.closeModal('userModal');
         ui.showMessage("Usuario añadido.", "success");
     } else {
          ui.showMessage("Error al añadir el usuario (verifica nombre/iniciales).", "error");
     }
}

function handleExerciseFormSubmit(e) { e.preventDefault(); console.warn("Exercise form submit not implemented"); }
function handleProgramFormSubmit(e) { e.preventDefault(); console.warn("Program form submit not implemented"); }
function handleSessionFormSubmit(e) { e.preventDefault(); console.warn("Session form submit not implemented"); }


// Handler para Cambio de Usuario
function handleUserSwitch(event) {
    event.preventDefault();
    const link = event.target.closest('.user-switch-link');
    if (link) {
        const userId = link.dataset.userid;
        console.log("Switching user to:", userId);
        if (api.setCurrentUser(userId)) {
             ui.updateCurrentUserDisplay(api.getCurrentUser());
             ui.showMessage(`Usuario cambiado a ${api.getCurrentUser().name}.`, "info");
             // TODO: Recargar datos relevantes para el nuevo usuario (ej: dashboard, calendario)
             refreshUI(); // Recarga completa por ahora
        } else {
             ui.showMessage("No se pudo cambiar el usuario.", "error");
        }
        // Cerrar el dropdown (puede requerir CSS o JS adicional si no se cierra solo)
        const dropdown = link.closest('.group-hover\\:block');
        // if (dropdown) dropdown.classList.remove('group-hover:block'); // Esto podría no funcionar bien con hover
    }
}

// Handlers Calendario
function handlePrevMonth() {
    currentViewDate.setMonth(currentViewDate.getMonth() - 1);
    loadCalendarData(currentViewDate.getFullYear(), currentViewDate.getMonth());
}
function handleNextMonth() {
    currentViewDate.setMonth(currentViewDate.getMonth() + 1);
    loadCalendarData(currentViewDate.getFullYear(), currentViewDate.getMonth());
}
function handleToday() {
    currentViewDate = new Date();
    loadCalendarData(currentViewDate.getFullYear(), currentViewDate.getMonth());
}
function handleCalendarDayClick(event) {
    const cell = event.target.closest('.calendar-day-cell:not(.other-month)'); // Solo días del mes actual
    if (cell) {
        const date = cell.dataset.date;
        console.log("Calendar day clicked:", date);
        const sessions = api.getSessionsForDate(date); // Obtener sesiones para ESE día
        ui.showDailyDetails(date, sessions);
    }
}
 function handleAddSessionToDateClick() {
    const date = document.getElementById('selected-date-title')?.innerText;
    if (date) {
         console.log("Add session to date:", date);
         // ui.prepareSessionModal(date); // Implementar ui
         ui.openModal('sessionModal');
         console.warn("Session modal preparation not fully implemented.");
    }
 }

// Handler Checklist
function handleChecklistChange(event) {
    if (event.target.type === 'checkbox') {
        const exerciseId = event.target.dataset.exerciseid;
        const sessionId = event.target.closest('[data-sessionid]')?.dataset.sessionid;
        const isCompleted = event.target.checked;

        if (exerciseId && sessionId) {
             console.log(`Checklist item changed: Session ${sessionId}, Exercise ${exerciseId}, Completed: ${isCompleted}`);
             // api.updateChecklistItemStatus(sessionId, exerciseId, isCompleted); // Implementar api
             ui.updateChecklistItemStyle(event.target);
        } else {
             console.warn("Could not get session/exercise ID from checklist item.");
        }
    }
}


// Handler para Acciones en Lista de Deportes (Editar/Eliminar)
function handleSportsListActions(event) {
     const deleteBtn = event.target.closest('.delete-sport-btn');
     const configBtn = event.target.closest('.configure-sport-btn');

    if (deleteBtn) {
        const sportId = deleteBtn.dataset.sportid;
         const sport = api.getSportById(sportId);
         if (sport && confirm(`¿Seguro que quieres eliminar el deporte "${sport.name}"? Esto no se puede deshacer.`)) {
             if (api.deleteSport(sportId)) {
                 ui.showMessage("Deporte eliminado.", "success");
                 ui.renderSportsSidebar(api.getSports());
                 ui.renderSportsList(api.getSports()); // Actualiza la lista principal
             } else {
                  ui.showMessage("Error al eliminar el deporte.", "error");
             }
         }
     } else if (configBtn) {
         const sportId = configBtn.dataset.sportid;
         const sport = api.getSportById(sportId);
         if (sport) {
            ui.prepareSportModal(sport); // Rellena el modal con datos existentes
            ui.openModal('sportModal');
         }
         console.warn("Configure sport button clicked, edit logic pending.", sportId);
         // TODO: Implementar lógica de configuración avanzada si es necesario
     }
}

// --- Helper para activar pestaña y cargar datos ---
function activateTab(tabId) {
    ui.activateTab(tabId);
    // No llamamos a loadTabData aquí para evitar doble carga en inicio
}
