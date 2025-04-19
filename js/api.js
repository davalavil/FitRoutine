// js/api.js
console.log("api.js loaded");

// Usamos una IIFE (Immediately Invoked Function Expression) para encapsular
// y exponer solo el objeto 'api' globalmente.
const api = (() => {

    // Objeto principal para almacenar todos los datos de la aplicación en memoria
    // Ahora está encapsulado dentro del scope de la IIFE
    let appData = {
        users: [],
        sports: [],
        exercises: [],
        programs: [],
        sessions: [], // { id, date, userId, exercises: [{exerciseId, sets, reps, time, completed}, ...] }
        currentUser: null, // Almacena el ID del usuario actual
        settings: {}
    };

    // --- Funciones de Acceso a Datos ---

    function getAllData() {
        console.log("API: getAllData called");
        // Devolvemos una copia para evitar modificaciones externas accidentales
        return JSON.parse(JSON.stringify(appData));
    }

    function loadAllData(loadedData) {
        console.log("API: loadAllData called");
        if (loadedData && typeof loadedData === 'object' && Array.isArray(loadedData.users)) {
            // Reemplaza completamente los datos internos
            appData = loadedData;
            // Asegurarse de que las propiedades principales existan si faltan en el JSON cargado
            appData.users = appData.users || [];
            appData.sports = appData.sports || [];
            appData.exercises = appData.exercises || [];
            appData.programs = appData.programs || [];
            appData.sessions = appData.sessions || [];
            appData.settings = appData.settings || {};
            // Validar currentUser ID después de cargar usuarios
            if (appData.currentUser && !appData.users.some(u => u.id === appData.currentUser)) {
                console.warn("Loaded currentUser ID not found in users list. Resetting.");
                appData.currentUser = appData.users.length > 0 ? appData.users[0].id : null;
            } else if (!appData.currentUser && appData.users.length > 0) {
                 appData.currentUser = appData.users[0].id; // Select first if none selected
            }

            console.log("API: Data loaded successfully:", appData);
            return true;
        } else {
            console.error("API Error loading data: Invalid format.", loadedData);
            // No mostramos alert aquí, dejamos que app.js lo maneje
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
            console.error("API: addUser error: name and initials are required.");
            return null;
        }
        const newUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: userData.name.trim(),
            email: userData.email ? userData.email.trim() : null,
            initials: userData.initials.trim().toUpperCase().substring(0, 2), // Asegura max 2 chars
        };
        // Asegurarse de que el array exista
        if (!Array.isArray(appData.users)) {
             appData.users = [];
        }
        appData.users.push(newUser);
        console.log("API: User added:", newUser);
        if (appData.users.length === 1 || !appData.currentUser) {
            setCurrentUser(newUser.id);
        }
        return newUser;
    }

    function setCurrentUser(userId) {
        const userExists = appData.users.some(u => u.id === userId);
        if (userExists) {
            appData.currentUser = userId;
            console.log("API: Current user set to:", userId);
            return true;
        } else {
            console.warn("API: setCurrentUser failed: User ID not found", userId);
             // Fallback si el ID no es válido
             if (appData.users.length > 0) {
                 appData.currentUser = appData.users[0].id;
                 console.log("API Fallback: Set current user to first user:", appData.currentUser);
             } else {
                 appData.currentUser = null;
             }
            return false;
        }
    }

    function getCurrentUser() {
        if (!appData.currentUser && appData.users && appData.users.length > 0) {
           // Si no hay usuario seleccionado pero sí hay usuarios, selecciona el primero
           setCurrentUser(appData.users[0].id);
        }
        return appData.currentUser ? getUserById(appData.currentUser) : null;
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
            console.error("API: addSport error: name is required.");
            return null;
        }
        const safeIcon = sportData.icon ? sportData.icon.trim().toLowerCase() : 'fas fa-question-circle';
        const safeColor = sportData.color ? sportData.color.trim() : 'bg-gray-500';

        const newSport = {
            id: `sport_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: sportData.name.trim(),
            icon: safeIcon,
            color: safeColor,
            // Asegurarse de que 'metrics' sea siempre un array
            metrics: Array.isArray(sportData.metrics) ? sportData.metrics : []
        };
        // Asegurarse de que el array exista
        if (!Array.isArray(appData.sports)) {
             appData.sports = [];
        }
        appData.sports.push(newSport);
        console.log("API: Sport added:", newSport);
        return newSport;
    }

    function deleteSport(sportId) {
        const initialLength = appData.sports.length;
        appData.sports = appData.sports.filter(s => s.id !== sportId);
        if (appData.sports.length < initialLength) {
            console.log("API: Sport deleted:", sportId);
            // TODO: Considerar limpiar ejercicios/programas huérfanos
            return true;
        }
        return false;
    }

     // --- Gestión de Ejercicios ---
     function getExercises(filters = {}) {
         let exercises = appData.exercises || [];
         if (filters.sportId && filters.sportId !== 'all') {
            exercises = exercises.filter(ex => ex.sportId === filters.sportId);
         }
         // TODO: Implementar búsqueda por nombre si se añade filtro de búsqueda
         return exercises;
     }

     function getExerciseById(exerciseId) {
         return appData.exercises.find(ex => ex.id === exerciseId);
     }

     // --- Gestión de Sesiones ---
     function getSessionsForDate(date) {
         const currentUserId = appData.currentUser;
         if (!currentUserId) return [];
         return (appData.sessions || []).filter(s => s.date === date && s.userId === currentUserId);
     }

     function getSessionsForMonth(year, month) {
         const currentUserId = appData.currentUser;
         if (!currentUserId) return [];
         const monthStr = String(month + 1).padStart(2, '0');
         const yearStr = String(year);
         return (appData.sessions || []).filter(s => s.date.startsWith(`${yearStr}-${monthStr}-`) && s.userId === currentUserId);
     }

    // --- Gestión de Programas (Placeholder) ---
    function getPrograms() { return appData.programs || []; }
    // function saveProgram(programData) { /* ... */ }
    // function deleteProgram(programId) { /* ... */ }

    // --- Gestión de Datos de Analíticas (Placeholder) ---
    function getAnalyticsData(period) {
        console.warn("API: getAnalyticsData not implemented");
        return {};
    }


    // Objeto público que será asignado a la variable global 'api'
    return {
        getAllData,
        loadAllData,
        getUsers,
        getUserById,
        addUser,
        setCurrentUser,
        getCurrentUser,
        getSports,
        getSportById,
        addSport,
        deleteSport,
        getExercises,
        getExerciseById,
        // saveExercise, // Descomentar cuando se implementen
        // deleteExercise, // Descomentar cuando se implementen
        getPrograms,
        // saveProgram, // Descomentar cuando se implementen
        // deleteProgram, // Descomentar cuando se implementen
        getSessionsForDate,
        getSessionsForMonth,
        // saveSession, // Descomentar cuando se implementen
        getAnalyticsData
    };

})(); // Fin de la IIFE y ejecución inmediata
