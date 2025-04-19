// js/ui.js
console.log("ui.js loaded");

// Usamos una IIFE para encapsular y exponer el objeto 'ui'
const ui = (() => {

    const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let justOpenedModal = false; // Flag para evitar cierre inmediato

    // ----- Pestañas -----
    function setupTabs() {
        // ... (sin cambios) ...
    }
    function activateTab(tabId) {
        // ... (sin cambios) ...
    }

    // ----- Modales -----
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        console.log(`DEBUG: Attempting to open modal: ${modalId}`, modal);
        if (modal) {
            modal.style.display = 'block';
            console.log(`DEBUG: Modal ${modalId} display set to 'block'`);
            justOpenedModal = true; // <-- Poner flag al abrir
            // Quitar flag después de un breve instante
            setTimeout(() => {
                justOpenedModal = false;
                console.log("DEBUG: Modal open flag reset.");
             }, 150); // 150ms de gracia
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
        // Botones X
        document.querySelectorAll('.modal .close-button').forEach(button => {
            const modal = button.closest('.modal');
            if (modal) {
                 console.log(`DEBUG: Adding close listener (X) for modal: ${modal.id}`);
                 button.onclick = (event) => {
                    event.stopPropagation(); // Detener propagación por si acaso
                    closeModal(modal.id);
                 }
            }
        });
         // Botones Cancelar
         document.querySelectorAll('.modal .modal-cancel-btn').forEach(button => {
            const modal = button.closest('.modal');
            if (modal) {
                 console.log(`DEBUG: Adding close listener (Cancel) for modal: ${modal.id}`);
                 button.onclick = (event) => {
                    event.stopPropagation(); // Detener propagación
                    closeModal(modal.id);
                 }
            }
        });
        // Clic fuera
        console.log("DEBUG: Setting up window onclick listener for modals");
        window.onclick = function(event) {
             // Ignorar si acabamos de abrir el modal
             if (justOpenedModal) {
                 console.log("DEBUG: Window click ignored (just opened modal flag is true)");
                 // No reseteamos el flag aquí, lo hace el setTimeout en openModal
                 return;
             }
             // Solo cerrar si se hace clic DIRECTAMENTE en el fondo del modal
             if (event.target.classList.contains('modal')) {
                 console.log(`DEBUG: Click outside detected ON modal backdrop: ${event.target.id}`);
                 closeModal(event.target.id);
             }
        }
    }

    // --- Funciones Específicas de Preparación de Modales ---
    function prepareSportModal(sport = null) {
        console.log("DEBUG: Preparing sport modal. Editing:", !!sport);
        const modal = document.getElementById('sportModal');
        const form = document.getElementById('sportForm');
        const title = document.getElementById('sportModalTitle');
        const metricsSelect = document.getElementById('sportMetricsSelect');

        // Comprobar existencia de elementos ANTES de continuar
        if (!modal || !form || !title || !metricsSelect) {
             console.error("DEBUG: Sport modal elements not found! Cannot prepare.");
             // Mostrar un mensaje al usuario podría ser útil aquí
             // showMessage("Error interno: No se pudo encontrar el formulario de deporte.", "error");
             return false; // <-- Indicar fallo
        }

        try {
            form.reset();
            document.getElementById('sportId').value = '';
            Array.from(metricsSelect.options).forEach(option => option.selected = false);

            if (sport) {
                title.textContent = "Editar Deporte";
                document.getElementById('sportId').value = sport.id;
                document.getElementById('sportName').value = sport.name;
                document.getElementById('sportIcon').value = sport.icon || '';
                document.getElementById('sportColor').value = sport.color || '';
                if (sport.metrics && Array.isArray(sport.metrics)) {
                    console.log("DEBUG: Selecting metrics:", sport.metrics);
                    sport.metrics.forEach(savedMetric => {
                        const option = Array.from(metricsSelect.options).find(opt => opt.value === savedMetric);
                        if (option) {
                            option.selected = true;
                        } else {
                            console.warn(`DEBUG: Metric option not found for value: ${savedMetric}`);
                        }
                    });
                }
            } else {
                title.textContent = "Añadir Deporte";
            }
            console.log("DEBUG: Sport modal prepared successfully.");
            return true; // <-- Indicar éxito
        } catch (error) {
            console.error("DEBUG: Error during prepareSportModal:", error);
            // showMessage("Error al preparar el formulario de deporte.", "error");
            return false; // <-- Indicar fallo
        }
    }

    function prepareUserModal(user = null) {
         // ... (igual que antes, pero devolviendo true/false) ...
         console.log("DEBUG: Preparing user modal. Editing:", !!user);
         const modal = document.getElementById('userModal');
         const form = document.getElementById('userForm');
         if (!modal || !form) {
              console.error("DEBUG: User modal elements not found!");
              return false; // <-- Indicar fallo
         }
         try {
             form.reset();
             if (user) {
                 console.warn("UI: Edit user UI not fully implemented");
                 modal.querySelector('h2').textContent = "Editar Usuario";
             } else {
                 modal.querySelector('h2').textContent = "Añadir Usuario";
             }
              console.log("DEBUG: User modal prepared successfully.");
              return true; // <-- Indicar éxito
         } catch(error) {
             console.error("DEBUG: Error during prepareUserModal:", error);
             return false; // <-- Indicar fallo
         }
    }

    // ... (Resto de funciones de ui.js: renderizado, etc.) ...

    // Objeto público
    return {
        setupTabs,
        activateTab,
        openModal,
        closeModal,
        setupModalClosers,
        prepareSportModal, // Modificado para devolver true/false
        prepareUserModal,  // Modificado para devolver true/false
        // ... (resto de funciones exportadas) ...
        renderSportsSidebar,
        renderSportsList,
        updateUserDropdown,
        updateCurrentUserDisplay,
        renderCalendarGrid,
        showDailyDetails,
        hideDailyDetails,
        updateChecklistItemStyle,
        showMessage
    };

})(); // Fin de la IIFE
