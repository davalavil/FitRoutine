// js/app.js
console.log("app.js loaded");

// Estado global simple
let currentViewDate = new Date(); // Para el calendario

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed. Initializing FitRoutine...");

    if (!api.getCurrentUser() && api.getUsers().length === 0) {
        console.log("No users found. Please add a user or load data.");
    }

    ui.setupTabs();
    ui.setupModalClosers();

    refreshUI(); // Renderizar estado inicial

    setupEventListeners(); // Configurar listeners después de UI inicial

    console.log("FitRoutine Initialized.");
});

// --- Función para Refrescar Toda la UI ---
function refreshUI() {
    console.log("Refreshing UI...");
    const currentUser = api.getCurrentUser();
    ui.updateCurrentUserDisplay(currentUser); // Actualiza avatar y dropdown
    ui.renderSportsSidebar(api.getSports()); // Actualiza lista deportes sidebar

    // Cargar datos de la pestaña activa actual
    const activeTabId = document.querySelector('.tab-link.bg-blue-100')?.dataset.tab || 'dashboard';
    ui.activateTab(activeTabId); // Asegura clase 'active'
    loadTabData(activeTabId); // Carga los datos específicos

    console.log("UI Refreshed.");
}

// --- Carga de Datos por Pestaña ---
// Definimos loadTabData globalmente para que ui.js pueda llamarla
window.loadTabData = function(tabId) {
    console.log(`Loading data for tab: ${tabId}`);
    switch (tabId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'exercises':
            loadExerciseData();
            break;
        case 'calendar':
            // Si el calendario ya fue renderizado una vez, usa la fecha actual de la vista
            // si no, usa new Date()
            const year = currentViewDate.getFullYear();
            const month = currentViewDate.getMonth();
            loadCalendarData(year, month);
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
    charts.initializeActivityChart(null); // Limpiar/inicializar gráfico
}

function loadExerciseData(filters = {}) {
    console.log("Loading exercises with filters:", filters);
    const exercises = api.getExercises(filters);
    // ui.renderExerciseList(exercises); // Pendiente implementar en ui.js
    console.warn("Exercise list rendering not implemented yet.");
     // Renderizar filtros si es necesario
     // ui.renderExerciseFilters(api.getSports()); // Pendiente implementar en ui.js
}

function loadCalendarData(year, month) {
    console.log(`Loading calendar data for ${year}-${month + 1}`);
    const sessions = api.getSessionsForMonth(year, month);
    ui.renderCalendarGrid(year, month, sessions);
    ui.hideDailyDetails();
}

function loadProgramsData() {
    console.log("Loading programs data...");
    const programs = api.getPrograms();
    // ui.renderProgramList(programs); // Pendiente implementar en ui.js
    console.warn("Program list rendering not implemented yet.");
}

function loadAnalyticsData() {
    console.log("Loading analytics data...");
    const data = api.getAnalyticsData(); // Pendiente implementar en api.js
    charts.initializeAllCharts(data); // Inicializar/limpiar todos los gráficos
}

function loadSportsData() {
    console.log("Loading sports data...");
    const sports = api.getSports();
    ui.renderSportsList(sports); // Renderizar lista en la pestaña
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
    document.getElementById('addSportCardBtn')?.addEventListener('click', handleAddSportClick);
    document.getElementById('addUserBtnDropdown')?.addEventListener('click', handleAddUserClick);
    document.getElementById('addExerciseBtn')?.addEventListener('click', handleAddExerciseClick);
    document.getElementById('addProgramBtn')?.addEventListener('click', handleAddProgramClick);
    document.getElementById('newSessionBtnDashboard')?.addEventListener('click', handleNewSessionClick);

    // Formularios
    document.getElementById('sportForm')?.addEventListener('submit', handleSportFormSubmit);
    document.getElementById('userForm')?.addEventListener('submit', handleUserFormSubmit);
    // ... otros formularios ...

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

     // Delegación para botones Editar/Eliminar en listas
     document.getElementById('sports-list-container')?.addEventListener('click', handleSportsListActions);

    console.log("Event listeners setup complete.");
}


// --- Handlers ---

function handleSaveData() {
    // ... (Sin cambios aquí) ...
    console.log("Save Data button clicked.");
    try {
        const dataToSave = api.getAllData();
        const jsonString = JSON.stringify(dataToSave, null, 2);
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
    // ... (Sin cambios aquí) ...
    console.log("Load Data input changed.");
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) {
         ui.showMessage("Por favor, selecciona un archivo .json", "warning");
         event.target.value = null;
         return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const parsedData = JSON.parse(e.target.result);
            if (api.loadAllData(parsedData)) {
                console.log("Data loaded from file, refreshing UI...");
                refreshUI();
                ui.showMessage("Datos cargados correctamente.", "success");
            } else {
                 ui.showMessage("Error: El archivo JSON no tiene el formato esperado.", "error");
            }
        } catch (error) {
            console.error("Error parsing JSON file:", error);
             ui.showMessage("Error al leer o procesar el archivo JSON.", "error");
        } finally {
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
    ui.prepareSportModal(); // Prepara modal para añadir
    ui.openModal('sportModal');
}

function handleAddUserClick(event) {
     event.preventDefault();
     console.log("Add User button clicked.");
     ui.prepareUserModal();
     ui.openModal('userModal');
}

function handleAddExerciseClick() { ui.openModal('exerciseModal'); console.warn("Exercise modal preparation not implemented."); }
function handleAddProgramClick() { ui.openModal('programModal'); console.warn("Program modal preparation not implemented."); }
function handleNewSessionClick() { ui.openModal('sessionModal'); console.warn("Session modal preparation not implemented."); }

// Handlers para Formularios
function handleSportFormSubmit(event) {
    event.preventDefault();
    console.log("Sport form submitted.");
    const form = event.target;
    const formData = new FormData(form);
    const sportData = Object.fromEntries(formData.entries()); // Obtiene name, icon, color, id (si existe)

    // Obtener valores seleccionados del <select multiple>
    const selectedMetrics = Array.from(form.querySelector('#sportMetricsSelect').selectedOptions).map(option => option.value);
    sportData.metrics = selectedMetrics; // Añadir/sobrescribir el array de métricas

    let saved = false;
    if (sportData.id) { // Editando
        console.warn("Sport edit logic in api.js not implemented yet.");
        // saved = api.updateSport(sportData); // Descomentar cuando se implemente api.updateSport
        ui.showMessage("Funcionalidad de editar deporte pendiente.", "info"); // Mensaje temporal
    } else { // Añadiendo
        const added = api.addSport(sportData);
        if (added) {
            console.log("Sport added via form:", added);
            saved = true;
        } else {
             ui.showMessage("Error al añadir el deporte.", "error");
        }
    }

    if(saved){
        ui.closeModal('sportModal');
        ui.renderSportsSidebar(api.getSports()); // Actualizar sidebar
        // Solo actualizar la lista principal si la pestaña "Deportes" está activa
        if (document.getElementById('sports')?.classList.contains('active')) {
             loadSportsData(); // Recarga los datos de la pestaña (que incluye renderSportsList)
        }
        ui.showMessage("Deporte guardado.", "success");
    } else if (!sportData.id) { // Si falló al añadir (no al editar)
        // No hacer nada más, el mensaje de error ya se mostró
    }
}

function handleUserFormSubmit(event) {
     // ... (Sin cambios aquí) ...
     event.preventDefault();
     console.log("User form submitted.");
     const formData = new FormData(event.target);
     const userData = Object.fromEntries(formData.entries());

     const added = api.addUser(userData);
     if (added) {
        console.log("User added via form:", added);
        refreshUI(); // Refresh completo para asegurar consistencia
        ui.closeModal('userModal');
        ui.showMessage("Usuario añadido.", "success");
     } else {
          ui.showMessage("Error al añadir el usuario (verifica nombre/iniciales).", "error");
     }
}

// ... otros handlers de formulario ...

// Handler para Cambio de Usuario
function handleUserSwitch(event) {
     // ... (Sin cambios aquí) ...
    event.preventDefault();
    const link = event.target.closest('.user-switch-link');
    if (link) {
        const userId = link.dataset.userid;
        console.log("Switching user to:", userId);
        const oldUser = api.getCurrentUser()?.name; // Nombre antes del cambio
        if (api.setCurrentUser(userId)) {
             const newUser = api.getCurrentUser()?.name; // Nombre después del cambio
             ui.showMessage(`Usuario cambiado de ${oldUser || 'nadie'} a ${newUser}.`, "info");
             refreshUI(); // Recarga completa para el nuevo usuario
        } else {
             ui.showMessage("No se pudo cambiar el usuario.", "error");
        }
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
    // ... (Sin cambios aquí) ...
    const cell = event.target.closest('.calendar-day-cell:not(.other-month)');
    if (cell) {
        const date = cell.dataset.date;
        console.log("Calendar day clicked:", date);
        const sessions = api.getSessionsForDate(date);
        ui.showDailyDetails(date, sessions);
    }
}
 function handleAddSessionToDateClick() {
     // ... (Sin cambios aquí) ...
    const date = document.getElementById('selected-date-title')?.textContent; // Usar textContent
    // Extraer la fecha YYYY-MM-DD si está formateada (necesita lógica más robusta)
    // O mejor, obtenerla del dataset del día seleccionado previamente
    const selectedDay = document.querySelector('.calendar-day-cell.bg-blue-50'); // Ejemplo de cómo encontrarlo
    const dateValue = selectedDay?.dataset.date; // ¡Esto es más seguro!

    if (dateValue) {
         console.log("Add session to date:", dateValue);
         // ui.prepareSessionModal(dateValue); // Implementar ui
         ui.openModal('sessionModal');
         console.warn("Session modal preparation not fully implemented.");
    } else {
        console.warn("Could not determine selected date for adding session.");
        ui.showMessage("Selecciona un día en el calendario primero.", "warning");
    }
 }

// Handler Checklist
function handleChecklistChange(event) {
    // ... (Sin cambios aquí) ...
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
     // ... (Sin cambios aquí) ...
     const deleteBtn = event.target.closest('.delete-sport-btn');
     const configBtn = event.target.closest('.configure-sport-btn'); // Botón editar/configurar

    if (deleteBtn) {
        const sportId = deleteBtn.dataset.sportid;
         const sport = api.getSportById(sportId);
         if (sport && confirm(`¿Seguro que quieres eliminar el deporte "${sport.name}"? Esto no se puede deshacer.`)) {
             if (api.deleteSport(sportId)) {
                 ui.showMessage("Deporte eliminado.", "success");
                 refreshUI(); // Refresh completo para asegurar consistencia
             } else {
                  ui.showMessage("Error al eliminar el deporte.", "error");
             }
         }
     } else if (configBtn) {
         const sportId = configBtn.dataset.sportid;
         const sport = api.getSportById(sportId);
         if (sport) {
            console.log("Editing sport:", sport);
            ui.prepareSportModal(sport); // Rellena el modal con datos existentes
            ui.openModal('sportModal');
         } else {
             console.warn("Sport not found for editing:", sportId);
         }
     }
}
