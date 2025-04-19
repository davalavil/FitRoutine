// js/ui.js

// ----- Funcionalidad de Pestañas -----
function setupTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabLinks.length) return; // Salir si no hay tabs

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            activateTab(tabId);
        });
    });
}

function activateTab(tabId) {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(l => l.classList.remove('bg-blue-100', 'text-blue-700'));
    tabContents.forEach(c => c.classList.remove('active'));

    const activeLink = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);

    if (activeLink) activeLink.classList.add('bg-blue-100', 'text-blue-700');
    if (activeContent) activeContent.classList.add('active');

    // Opcional: Cargar datos o inicializar gráficos específicos de la pestaña
    // if (tabId === 'analytics') {
    //     Charts.initializeAllCharts(); // Asumiendo que Charts es un objeto/módulo
    // }
}


// ----- Funcionalidad de Modales -----
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.style.display = 'none';
    // Resetear formularios al cerrar
    const form = modal.querySelector('form');
    if (form) form.reset();
    // Limpiar mensajes de error o estados específicos del modal si es necesario
}

function setupModalClosers() {
    const closeButtons = document.querySelectorAll('.modal .close-button');
    closeButtons.forEach(button => {
        const modal = button.closest('.modal');
        if (modal) {
            button.onclick = () => closeModal(modal.id);
        }
    });
    // Cerrar modal si se hace clic fuera del contenido (opcional)
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    }
}

// ----- Actualización de Listas (Ejemplos) -----
function renderExerciseList(exercises) {
    const container = document.getElementById('exercise-list-container');
    if (!container) return;
    container.innerHTML = ''; // Limpiar lista actual
    exercises.forEach(exercise => {
        const div = document.createElement('div');
        div.className = 'border border-gray-200 rounded-lg p-4 exercise-item hover:shadow-md transition-shadow';
        div.dataset.exerciseid = exercise.id; // Asumiendo que cada ejercicio tiene un id
        div.dataset.sport = exercise.sport; // Asumiendo que tiene deporte
        // Construir el HTML interno del item... (más complejo)
        div.innerHTML = `
            <div class="flex justify-between">
                <div>
                    <h3 class="font-semibold text-lg">${exercise.name}</h3>
                    <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">${exercise.sport || 'General'}</span>
                </div>
                <div class="space-x-2">
                    <button class="text-blue-600 hover:text-blue-800 edit-exercise-btn" data-exerciseid="${exercise.id}"><i class="fas fa-edit"></i></button>
                    <button class="text-red-600 hover:text-red-800 delete-exercise-btn" data-exerciseid="${exercise.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <p class="text-gray-600 text-sm mt-2">${exercise.description || ''}</p>
            <div class="flex mt-3 text-sm space-x-4">
                <!-- Detalles como series/reps/tiempo irían aquí -->
            </div>`;
        container.appendChild(div);
    });
}

// ... Más funciones UI (renderProgramList, renderCalendar, updateChecklist, etc.)

// Exportar funciones si usas módulos, o simplemente asegurar que se cargue antes que app.js
// export { setupTabs, openModal, closeModal, setupModalClosers, renderExerciseList, activateTab };