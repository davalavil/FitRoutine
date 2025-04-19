// js/ui.js

// ... (Código existente de ui.js: IIFE, MONTH_NAMES, setupTabs, activateTab, modales, prepareModals, renderSports*, updateUser*, renderCalendar*, etc.) ...

const ui = (() => {

    // ... (Variables y funciones existentes) ...

    // ----- Renderizado de Ejercicios -----

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
                button.className = `px-3 py-1 rounded-md filter-btn text-sm ${activeFilter === sport.id ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
                button.dataset.filter = sport.id; // Usar ID del deporte como filtro
                button.textContent = sport.name;
                container.appendChild(button);
            });
         }

         // Marcar visualmente el filtro activo
         container.querySelectorAll('.filter-btn').forEach(btn => {
             if (btn.dataset.filter === activeFilter) {
                 btn.classList.remove('bg-gray-200', 'hover:bg-gray-300');
                 btn.classList.add('bg-blue-600', 'text-white');
             } else {
                  btn.classList.remove('bg-blue-600', 'text-white');
                  btn.classList.add('bg-gray-200', 'hover:bg-gray-300');
             }
         });
    }

    // ... (Resto de funciones y el objeto return) ...

    // Objeto público (AÑADIR renderExerciseList y renderExerciseFilters)
    return {
        // ... (funciones existentes) ...
        setupTabs,
        activateTab,
        openModal,
        closeModal,
        setupModalClosers,
        prepareSportModal,
        prepareUserModal,
        renderSportsSidebar,
        renderSportsList,
        updateUserDropdown,
        updateCurrentUserDisplay,
        renderCalendarGrid,
        showDailyDetails,
        hideDailyDetails,
        updateChecklistItemStyle,
        showMessage,
        renderExerciseList,    // <-- AÑADIDO
        renderExerciseFilters  // <-- AÑADIDO
    };

})(); // Fin de la IIFE
