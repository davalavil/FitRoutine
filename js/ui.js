// js/ui.js
console.log("ui.js loaded");

// Usamos una IIFE para encapsular y exponer el objeto 'ui'
const ui = (() => {

    const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let justOpenedModal = false; // Flag para evitar cierre inmediato

    // ----- Renderizado de Ejercicios (Definido ANTES de ser usado por renderSportsList) -----
    function renderExerciseList(exercises) {
        const container = document.getElementById('exercise-list-container');
        if (!container) {
            console.error("UI Error: Exercise list container not found!");
            return;
        }
        container.innerHTML = ''; // Limpiar lista

        if (exercises && exercises.length > 0) {
            exercises.forEach(exercise => {
                const div = document.createElement('div');
                div.className = 'border border-gray-200 rounded-lg p-4 exercise-item hover:shadow-md transition-shadow';
                div.dataset.exerciseid = exercise.id;
                // Encontrar el deporte para mostrar su nombre/color (requiere acceso a api.getSportById)
                const sport = (typeof api !== 'undefined') ? api.getSportById(exercise.sportId) : null;
                const sportName = sport ? sport.name : 'General';
                // Usar color del deporte si existe, si no, gris
                const sportColorClass = sport?.color ? sport.color.replace('bg-', 'bg-') + '-100' : 'bg-gray-100';
                const sportTextColorClass = sport?.color ? sport.color.replace('bg-', 'text-') + '-800' : 'text-gray-800';

                div.innerHTML = `
                    <div class="flex justify-between">
                        <div>
                            <h3 class="font-semibold text-lg">${exercise.name || 'Ejercicio sin nombre'}</h3>
                            <span class="${sportColorClass} ${sportTextColorClass} text-xs px-2 py-0.5 rounded">${sportName}</span>
                        </div>
                        <div class="space-x-2 flex-shrink-0">
                            <button title="Editar" class="text-blue-600 hover:text-blue-800 edit-exercise-btn" data-exerciseid="${exercise.id}"><i class="fas fa-edit"></i></button>
                            <button title="Eliminar" class="text-red-600 hover:text-red-800 delete-exercise-btn" data-exerciseid="${exercise.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <p class="text-gray-600 text-sm mt-2">${exercise.description || 'Sin descripción.'}</p>
                    <div class="flex mt-3 text-sm space-x-4">
                        <!-- Detalles como series/reps/tiempo (a implementar) -->
                        <span class="text-gray-500"><i class="fas fa-layer-group mr-1"></i> ? series</span>
                        <span class="text-gray-500"><i class="fas fa-redo mr-1"></i> ? reps</span>
                    </div>`;
                container.appendChild(div);
            });
        } else {
            container.innerHTML = '<p class="text-gray-500 col-span-1 md:col-span-2">No hay ejercicios que coincidan con los filtros.</p>';
        }
    }

    function renderExerciseFilters(sports, activeFilter = 'all') {
         const container = document.getElementById('exercise-filters');
         if (!container) return;

         // Guardar el botón "Todos"
         const allButton = container.querySelector('button[data-filter="all"]');
         container.innerHTML = ''; // Limpiar filtros anteriores
         if(allButton) container.appendChild(allButton); // Re-añadir "Todos"

        // Añadir botones para cada deporte
         if (sports && sports.length > 0) {
            sports.forEach(sport => {
                const button = document.createElement('button');
                // Ajuste de clases para mejor apariencia
                button.className = `px-3 py-1 rounded-md filter-btn text-sm transition-colors duration-150 ease-in-out ${activeFilter === sport.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
                button.dataset.filter = sport.id; // Usar ID del deporte como filtro
                button.textContent = sport.name;
                container.appendChild(button);
            });
         }

         // Marcar visualmente el filtro activo (revisado para asegurar que funcione)
         container.querySelectorAll('.filter-btn').forEach(btn => {
             if (btn.dataset.filter === activeFilter) {
                 btn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
                 btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
             } else {
                  btn.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
                  btn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
             }
         });
    }


    // ----- Pestañas -----
    function setupTabs() {
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');
        if (!tabLinks.length) return;

        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                activateTab(tabId);
                if (typeof window.loadTabData === 'function') {
                    window.loadTabData(tabId);
                } else {
                    console.warn("loadTabData function not found globally.");
                }
            });
        });
    }

    function activateTab(tabId) {
        console.log("UI: Activating tab:", tabId)
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');
        tabLinks.forEach(l => l.classList.remove('bg-blue-100', 'text-blue-700'));
        tabContents.forEach(c => c.classList.remove('active'));
        const activeLink = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(tabId);
        if (activeLink) activeLink.classList.add('bg-blue-100', 'text-blue-700');
        if (activeContent) activeContent.classList.add('active');
        else console.warn(`UI: Tab content not found for id: ${tabId}`);
    }

    // ----- Modales -----
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        console.log(`DEBUG: Attempting to open modal: ${modalId}`, modal);
        if (modal) {
            modal.style.display = 'block';
            console.log(`DEBUG: Modal ${modalId} display set to 'block'`);
            justOpenedModal = true;
            setTimeout(() => {
                justOpenedModal = false;
                console.log("DEBUG: Modal open flag reset.");
             }, 150);
        } else {
            console.warn(`UI: Modal not found: ${modalId}`);
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        console.log(`DEBUG: Attempting to close modal: ${modalId}`, modal);
        if (!modal) return;
        modal.style.display = 'none';
        console.log(`DEBUG: Modal ${modalId} display set to 'none'`);
        const form = modal.querySelector('form');
        if (form) form.reset();
        const multiSelects = modal.querySelectorAll('select[multiple]');
        multiSelects.forEach(select => {
            Array.from(select.options).forEach(option => option.selected = false);
        });
    }

    function setupModalClosers() {
        console.log("DEBUG: Setting up modal closers");
        document.querySelectorAll('.modal .close-button').forEach(button => { /* Listener X */ });
        document.querySelectorAll('.modal .modal-cancel-btn').forEach(button => { /* Listener Cancel */ });
        console.log("DEBUG: Setting up window onclick listener for modals");
        window.onclick = function(event) { /* Listener clic fuera */ };
    }

    // --- Funciones Específicas de Preparación de Modales ---
    function prepareSportModal(sport = null) {
        console.log("DEBUG: Preparing sport modal. Editing:", !!sport);
        const modal = document.getElementById('sportModal');
        const form = document.getElementById('sportForm');
        const title = document.getElementById('sportModalTitle');
        const metricsSelect = document.getElementById('sportMetricsSelect');
        if (!modal || !form || !title || !metricsSelect) {
             console.error("DEBUG: Sport modal elements not found! Cannot prepare.");
             return false;
        }
        try {
            form.reset();
            document.getElementById('sportId').value = '';
            Array.from(metricsSelect.options).forEach(option => option.selected = false);
            if (sport) { /* Rellenar para editar */ } else { title.textContent = "Añadir Deporte"; }
            console.log("DEBUG: Sport modal prepared successfully.");
            return true;
        } catch (error) { console.error("DEBUG: Error during prepareSportModal:", error); return false; }
    }

    function prepareUserModal(user = null) {
         console.log("DEBUG: Preparing user modal. Editing:", !!user);
         const modal = document.getElementById('userModal');
         const form = document.getElementById('userForm');
         if (!modal || !form) { console.error("DEBUG: User modal elements not found!"); return false; }
         try {
             form.reset();
             if (user) { /* Editar */ } else { modal.querySelector('h2').textContent = "Añadir Usuario"; }
              console.log("DEBUG: User modal prepared successfully.");
              return true;
         } catch(error) { console.error("DEBUG: Error during prepareUserModal:", error); return false; }
    }

    // ----- Renderizado de Listas -----

    function renderSportsSidebar(sports) {
        const container = document.getElementById('sports-list-sidebar');
        if (!container) { console.error("UI Error: Sidebar sports container not found!"); return; }
        const addSportBtnLi = container.querySelector('#addSportSidebarBtn')?.parentElement;
        container.innerHTML = '';
        if (sports && sports.length > 0) { /* Añadir lis de deportes */ } else { container.innerHTML = '<li><p>...</p></li>'; }
        if (addSportBtnLi) { container.appendChild(addSportBtnLi); } else { console.warn("UI Warning: Could not find 'Add Sport' button in sidebar."); }
    }

    function renderSportsList(sports) {
        const container = document.getElementById('sports-list-container');
        const addSportCardBtn = document.getElementById('addSportCardBtn');
        if (!container) return;
        container.innerHTML = '';
        if (sports && sports.length > 0) {
            sports.forEach(sport => { /* Crear y añadir tarjeta */ });
        }
        if (addSportCardBtn) { container.appendChild(addSportCardBtn); }
    }

    // ----- Renderizado de Usuarios -----
    function updateUserDropdown(users, currentUserId) { /* ... */ }
    function updateCurrentUserDisplay(user) { /* ... */ }

    // ----- Renderizado del Calendario -----
    function renderCalendarGrid(year, month, sessions = []) { /* ... */ }
    function createCalendarCell(day, isOtherMonth, isToday = false, dateStr = null, sessions = []) { /* ... */ }
    function groupSessionsByDate(sessions) { /* ... */ }
    function showDailyDetails(date, sessions) { /* ... */ }
    function hideDailyDetails() { /* ... */ }
    function updateChecklistItemStyle(checkbox) { /* ... */ }

    // --- Mensajes y Carga ---
    function showMessage(message, type = 'info') { /* ... */ }


    // Objeto público (Verificar que todas las funciones estén definidas ANTES de esta línea)
    return {
        // Funciones de inicialización y configuración
        setupTabs,
        setupModalClosers,
        // Funciones para abrir/cerrar
        openModal,
        closeModal,
        // Funciones para preparar modales específicos
        prepareSportModal,
        prepareUserModal,
        // Funciones de Renderizado
        activateTab, // También actualiza UI
        renderSportsSidebar,
        renderSportsList,
        renderExerciseList,    // Añadida previamente
        renderExerciseFilters, // Añadida previamente
        updateUserDropdown,
        updateCurrentUserDisplay,
        renderCalendarGrid,
        showDailyDetails,
        hideDailyDetails,
        updateChecklistItemStyle,
        // Otras utilidades UI
        showMessage
    };

})(); // Fin de la IIFE
