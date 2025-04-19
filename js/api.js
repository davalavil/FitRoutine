// js/api.js
console.log("api.js loaded");

// Objeto principal para almacenar todos los datos de la aplicación en memoria
let appData = {
    users: [],
    sports: [],
    exercises: [],
    programs: [],
    sessions: [], // { id, date, userId, exercises: [{exerciseId, sets, reps, time, completed}, ...] }
    currentUser: null, // Almacena el ID del usuario actual
    settings: {
        // futuras configuraciones
    }
};

// --- Funciones de Acceso a Datos ---

function getAllData() {
    console.log("getAllData called");
    return appData;
}

function loadAllData(loadedData) {
    console.log("loadAllData called");
    // Validación básica (podría ser más robusta)
    if (loadedData && typeof loadedData === 'object' && Array.isArray(loadedData.users)) {
        appData = loadedData;
        console.log("Data loaded successfully:", appData);
        return true;
    } else {
        console.error("Error loading data: Invalid format.", loadedData);
        alert("Error: El archivo de datos no tiene el formato esperado.");
        return false;
    }
}

// --- Gestión de Usuarios ---

function getUsers() {
    return appData.users || [];
}

function getUserById(userId) {
    return appData.users.find(u => u.id === userId);
}

function addUser(userData) {
    if (!userData || !userData.name || !userData.initials) {
        console.error("addUser error: name and initials are required.");
        return null;
    }
    const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, // ID único más robusto
        name: userData.name.trim(),
        email: userData.email ? userData.email.trim() : null,
        initials: userData.initials.trim().toUpperCase(),
        // Otros campos si se añaden al formulario
    };
    appData.users.push(newUser);
    console.log("User added:", newUser);
    // Si es el primer usuario, seleccionarlo automáticamente
    if (appData.users.length === 1) {
        setCurrentUser(newUser.id);
    }
    return newUser;
}

function setCurrentUser(userId) {
    const userExists = appData.users.some(u => u.id === userId);
    if (userExists) {
        appData.currentUser = userId;
        console.log("Current user set to:", userId);
        return true;
    } else {
        console.warn("setCurrentUser failed: User ID not found", userId);
        // Si no hay usuario o el ID no es válido, deseleccionar
        if (appData.users.length > 0) {
            appData.currentUser = appData.users[0].id; // Seleccionar el primero como fallback
            console.log("Fallback: Set current user to first user:", appData.currentUser);
        } else {
            appData.currentUser = null; // No hay usuarios
        }
        return false;
    }
}

function getCurrentUser() {
    if (!appData.currentUser) {
        // Si no hay usuario seleccionado pero hay usuarios, selecciona el primero
        if (appData.users && appData.users.length > 0) {
           setCurrentUser(appData.users[0].id);
        } else {
             return null; // No hay usuarios en absoluto
        }
    }
    return getUserById(appData.currentUser);
}

// --- Gestión de Deportes ---

function getSports() {
    return appData.sports || [];
}

function getSportById(sportId) {
    return appData.sports.find(s => s.id === sportId);
}

function addSport(sportData) {
     if (!sportData || !sportData.name) {
        console.error("addSport error: name is required.");
        return null;
    }
    // Sanitizar un poco el icono y color
    const safeIcon = sportData.icon ? sportData.icon.trim().toLowerCase() : 'fas fa-question-circle';
    const safeColor = sportData.color ? sportData.color.trim() : 'bg-gray-500'; // Default color

    const newSport = {
        id: `sport_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: sportData.name.trim(),
        icon: safeIcon,
        color: safeColor,
        metrics: Array.isArray(sportData.metrics) ? sportData.metrics : (sportData.metrics ? [sportData.metrics] : []) // Asegura que sea un array
    };
    appData.sports.push(newSport);
    console.log("Sport added:", newSport);
    return newSport;
}

function deleteSport(sportId) {
    const initialLength = appData.sports.length;
    appData.sports = appData.sports.filter(s => s.id !== sportId);
    if (appData.sports.length < initialLength) {
        console.log("Sport deleted:", sportId);
        // TODO: Considerar qué hacer con ejercicios/programas que usaban este deporte
        return true;
    }
    return false;
}


// --- Gestión de Ejercicios (Placeholder) ---
function getExercises(filters = {}) {
    // TODO: Implementar filtrado real
    return appData.exercises || [];
}
function saveExercise(exerciseData) { /* ... */ }
function deleteExercise(exerciseId) { /* ... */ }

// --- Gestión de Programas (Placeholder) ---
function getPrograms() { return appData.programs || []; }
function saveProgram(programData) { /* ... */ }
function deleteProgram(programId) { /* ... */ }

// --- Gestión de Sesiones (Placeholder) ---
function getSessionsForDate(date) { // date en formato 'YYYY-MM-DD'
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    return appData.sessions.filter(s => s.date === date && s.userId === currentUser.id);
}
function getSessionsForMonth(year, month) { // month es 0-11
     const currentUser = getCurrentUser();
     if (!currentUser) return [];
     const monthStr = String(month + 1).padStart(2, '0');
     const yearStr = String(year);
     return appData.sessions.filter(s => s.date.startsWith(`${yearStr}-${monthStr}-`) && s.userId === currentUser.id);
}
function saveSession(sessionData) { /* ... */ }


// --- Gestión de Datos del Calendario ---
// (Ya incluidos en sesiones)

// --- Gestión de Datos de Analíticas (Placeholder) ---
function getAnalyticsData(period) {
    // TODO: Calcular datos para gráficos basados en appData.sessions y appData.exercises
    console.warn("getAnalyticsData not implemented");
    return {};
}
