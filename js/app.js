// js/app.js

// Importar funciones si usas módulos
// import { setupTabs, openModal, closeModal, setupModalClosers, renderExerciseList, activateTab } from './ui.js';
// import * as api from './api.js';
// import { initializeAllCharts } from './charts.js';

// Estado global simple (podría ser más complejo)
let currentUser = null;
let currentViewDate = new Date(); // Para el calendario

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("FitRoutine Pro V3 Initializing...");
    // Configurar UI básica
    setupTabs(); // Ahora definido en ui.js
    setupModalClosers(); // Ahora definido en ui.js

    // Cargar datos iniciales (ej: usuario actual, deportes, etc.)
    loadInitialData();

    // Configurar Event Listeners globales para botones, formularios, etc.
    setupEventListeners();

    // Mostrar la pestaña inicial (ej: dashboard)
    activateTab('dashboard'); // Ahora definido en ui.js

    // Cargar datos específicos de la pestaña activa inicial (opcional, si no se hace en activateTab)
    loadDashboardData();
});

// --- Carga de Datos ---
function loadInitialData() {
    currentUser = api.getCurrentUser(); // api.js
    if (!currentUser) {
        // Quizás redirigir a login o mostrar un estado por defecto
        console.log("No current user found.");
        // Simular un usuario por defecto para desarrollo
        currentUser = { id: 'user_default', name: 'Usuario Test', initials: 'UT', email:'test@example.com' };
        api.setCurrentUser(currentUser);
    }
    updateUserUI();
    loadSportsSidebar();
    // Cargar otros datos necesarios globalmente
}

function loadDashboardData() {
    // Cargar resumen, próximas sesiones, gráfico de actividad
    console.log("Loading dashboard data...");
    // const summary = api.getActivitySummary(); // Necesitas crear esta función en api.js
    // ui.renderActivitySummary(summary); // Necesitas crear esta función en ui.js
    // const upcoming = api.getUpcomingSessions();
    // ui.renderUpcomingSessions(upcoming);
    // const activityData = api.getActivityChartData();
    // charts.initializeActivityChart(activityData); // charts.js
}

 function loadExerciseData(filters = {}) {
    console.log("Loading exercises with filters:", filters);
    const exercises = api.getExercises(filters); // api.js
    ui.renderExerciseList(exercises); // ui.js
}

function loadSportsSidebar() {
    const sports = api.getSports();
    // TODO: Crear ui.renderSportsSidebar(sports) en ui.js
}

// ... funciones para cargar datos de otras pestañas (loadCalendarData, loadProgramsData, etc.)


// --- UI Updates ---
function updateUserUI() {
    if (!currentUser) return;
    document.getElementById('currentUserInitials').textContent = currentUser.initials || '??';
    document.getElementById('currentUserName').textContent = currentUser.name || 'Usuario';
    document.getElementById('currentUserEmail').textContent = currentUser.email || '';
    // TODO: Actualizar el avatar color si se guarda
    // TODO: Actualizar la lista de otros usuarios en el dropdown
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Botones para abrir modales
    document.getElementById('addExerciseBtn')?.addEventListener('click', handleAddExerciseClick);
    document.getElementById('addProgramBtn')?.addEventListener('click', handleAddProgramClick);
    document.getElementById('addSportBtn')?.addEventListener('click', handleAddSportClick);
    document.getElementById('addSportSidebarBtn')?.addEventListener('click', handleAddSportClick); // Mismo handler
    document.getElementById('addUserBtn')?.addEventListener('click', handleAddUserClick);
    document.getElementById('newSessionBtnDashboard')?.addEventListener('click', handleNewSessionClick);

    // Formularios (usando delegación si el modal se recrea, o directo si siempre existe)
    document.getElementById('exerciseForm')?.addEventListener('submit', handleExerciseFormSubmit);
    document.getElementById('programForm')?.addEventListener('submit', handleProgramFormSubmit);
    document.getElementById('sportForm')?.addEventListener('submit', handleSportFormSubmit);
    document.getElementById('userForm')?.addEventListener('submit', handleUserFormSubmit);
    document.getElementById('sessionForm')?.addEventListener('submit', handleSessionFormSubmit);


    // Delegación de eventos para botones Editar/Eliminar en listas dinámicas
    document.getElementById('exercise-list-container')?.addEventListener('click', handleExerciseListActions);
    // ... añadir listeners para programs-list-container, sports-list-container, etc. ...

    // Listener para filtros de ejercicios
     document.getElementById('exercise-filters')?.addEventListener('click', handleExerciseFilterClick);

     // Listener para clics en el calendario
     document.getElementById('calendar-grid')?.addEventListener('click', handleCalendarDayClick);
     document.getElementById('closeDailyDetailsBtn')?.addEventListener('click', () => ui.hideDailyDetails()); // Necesitas ui.hideDailyDetails()
     document.getElementById('addSessionToDateBtn')?.addEventListener('click', handleAddSessionToDateClick);

     // Listener para checklist
     document.getElementById('daily-details-section')?.addEventListener('change', handleChecklistChange); // Delegación dentro de la sección
}


// --- Handlers (Funciones que responden a eventos) ---

function handleAddExerciseClick() {
    ui.prepareExerciseModal(); // Función en ui.js para resetear y poner título "Añadir"
    ui.openModal('exerciseModal');
}
function handleAddProgramClick() { /*...*/ ui.openModal('programModal'); }
function handleAddSportClick(e) { e.preventDefault(); /*...*/ ui.openModal('sportModal'); }
function handleAddUserClick(e) { e.preventDefault(); /*...*/ ui.openModal('userModal'); }
function handleNewSessionClick() { /*...*/ ui.openModal('sessionModal'); }


function handleExerciseFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const exerciseData = Object.fromEntries(formData.entries());
    console.log("Saving exercise:", exerciseData);
    const savedExercise = api.saveExercise(exerciseData); // api.js
    ui.closeModal('exerciseModal');
    loadExerciseData(); // Recargar la lista
    // Opcional: Mostrar notificación de éxito
}
function handleProgramFormSubmit(e) { e.preventDefault(); /* ... Lógica similar ... */ }
function handleSportFormSubmit(e) { e.preventDefault(); /* ... Lógica similar ... */ }
function handleUserFormSubmit(e) { e.preventDefault(); /* ... Lógica similar ... */ }
function handleSessionFormSubmit(e) { e.preventDefault(); /* ... Lógica similar ... */ }


function handleExerciseListActions(e) {
    const editBtn = e.target.closest('.edit-exercise-btn');
    const deleteBtn = e.target.closest('.delete-exercise-btn');

    if (editBtn) {
        const exerciseId = editBtn.dataset.exerciseid;
        console.log("Edit exercise:", exerciseId);
        const exercise = api.getExerciseById(exerciseId); // Necesitas api.getExerciseById
        if (exercise) {
            ui.prepareExerciseModal(exercise); // Función en ui.js para rellenar el form
            ui.openModal('exerciseModal');
        }
    } else if (deleteBtn) {
        const exerciseId = deleteBtn.dataset.exerciseid;
        if (confirm(`¿Seguro que quieres eliminar este ejercicio?`)) {
            console.log("Delete exercise:", exerciseId);
            api.deleteExercise(exerciseId); // api.js
            loadExerciseData(); // Recargar lista
        }
    }
}
 function handleExerciseFilterClick(e) {
    if (e.target.tagName === 'BUTTON') {
        const filter = e.target.dataset.filter;
        console.log("Filtering exercises by:", filter);
         // TODO: Marcar botón activo en ui.js
         loadExerciseData({ sport: filter === 'all' ? null : filter }); // Pasar filtro a la carga
    }
}

 function handleCalendarDayClick(e) {
     const dayElement = e.target.closest('.calendar-day');
     if (dayElement) {
         const date = dayElement.dataset.date;
         console.log("Clicked on date:", date);
         const sessions = api.getSessionsForDate(date); // api.js
         ui.showDailyDetails(date, sessions); // Necesitas esta función en ui.js
     }
 }

  function handleAddSessionToDateClick() {
    const date = document.getElementById('selected-date-title')?.innerText; // O mejor desde un data attribute
    if (date) {
         ui.prepareSessionModal(date); // Necesitas ui.prepareSessionModal en ui.js
         ui.openModal('sessionModal');
    }
 }

 function handleChecklistChange(e) {
    if (e.target.type === 'checkbox') {
        const exerciseId = e.target.dataset.exerciseid; // Asumiendo data-exerciseid en el input
        const sessionId = e.target.closest('[data-sessionid]')?.dataset.sessionid; // Asumiendo data-sessionid en el contenedor
        const isCompleted = e.target.checked;
        console.log(`Exercise ${exerciseId} in session ${sessionId} marked as ${isCompleted ? 'completed' : 'incomplete'}`);
        // TODO: Guardar estado con api.updateChecklistItemStatus(sessionId, exerciseId, isCompleted)
        ui.updateChecklistItemStyle(e.target); // Necesitas ui.updateChecklistItemStyle en ui.js
    }
 }

// ... más handlers ...
