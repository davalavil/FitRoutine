// js/api.js

const STORAGE_KEY_PREFIX = 'fitroutine_';

// Función auxiliar para obtener datos de localStorage
function getData(key) {
    try {
        const data = localStorage.getItem(STORAGE_KEY_PREFIX + key);
        return data ? JSON.parse(data) : []; // Devuelve array vacío si no hay nada
    } catch (e) {
        console.error(`Error reading ${key} from localStorage`, e);
        return [];
    }
}

// Función auxiliar para guardar datos en localStorage
function saveData(key, data) {
    try {
        localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error saving ${key} to localStorage`, e);
    }
}

// --- Funciones CRUD (Ejemplos con localStorage) ---

function getExercises() {
    // TODO: Implementar filtros si es necesario
    return getData('exercises');
}

function saveExercise(exerciseData) {
    let exercises = getData('exercises');
    if (exerciseData.id) { // Actualizar existente
        exercises = exercises.map(ex => ex.id === exerciseData.id ? exerciseData : ex);
    } else { // Añadir nuevo
        exerciseData.id = `ex_${Date.now()}`; // Generar ID simple
        exercises.push(exerciseData);
    }
    saveData('exercises', exercises);
    return exerciseData; // Devuelve el ejercicio guardado (con ID si es nuevo)
}

 function deleteExercise(exerciseId) {
    let exercises = getData('exercises');
    exercises = exercises.filter(ex => ex.id !== exerciseId);
    saveData('exercises', exercises);
}

function getPrograms() { return getData('programs'); }
function saveProgram(programData) { /* ... lógica similar a saveExercise ... */ }
function deleteProgram(programId) { /* ... lógica similar a deleteExercise ... */ }

function getSports() { return getData('sports'); }
function saveSport(sportData) { /* ... */ }
function deleteSport(sportId) { /* ... */ }

function getUsers() { return getData('users'); }
function saveUser(userData) { /* ... */ }
function getCurrentUser() { return getData('currentUser') || null; } // Podría guardar solo el ID o el objeto
function setCurrentUser(user) { saveData('currentUser', user); }

function getSessionsForDate(date) { // date en formato 'YYYY-MM-DD'
    const allSessions = getData('sessions');
    return allSessions.filter(session => session.date === date);
}
function saveSession(sessionData) { /* ... */ }

// ... más funciones API para calendario, analytics, etc.

// Exportar si usas módulos
// export { getExercises, saveExercise, deleteExercise, getPrograms, ... };