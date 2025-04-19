// js/ui.js
console.log("ui.js loaded");

// Usamos una IIFE para encapsular y exponer el objeto 'ui'
const ui = (() => {

    const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // ----- Pestañas -----
    function setupTabs() {
        // ... (sin cambios) ...
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
        // ... (sin cambios) ...
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
        console.log(`DEBUG: Attempting to open modal: ${modalId}`, modal); // <-- DEBUG LOG AÑADIDO
        if (modal) {
            modal.style.display = 'block';
            console.log(`DEBUG: Modal ${modalId} display set to 'block'`); // <-- DEBUG LOG AÑADIDO
        } else {
            console.warn(`UI: Modal not found: ${modalId}`);
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        console.log(`DEBUG: Attempting to close modal: ${modalId}`, modal); // <-- DEBUG LOG AÑADIDO
        if (!modal) return;
        modal.style.display = 'none';
        console.log(`DEBUG: Modal ${modalId} display set to 'none'`); // <-- DEBUG LOG AÑADIDO
        const form = modal.querySelector('form');
        if (form) form.reset();
        const multiSelects = modal.querySelectorAll('select[multiple]');
        multiSelects.forEach(select => {
            Array.from(select.options).forEach(option => option.selected = false);
        });
    }

    function setupModalClosers() {
        console.log("DEBUG: Setting up modal closers"); // <-- DEBUG LOG AÑADIDO
        // Botones X
        document.querySelectorAll('.modal .close-button').forEach(button => {
            const modal = button.closest('.modal');
            if (modal) {
                 console.log(`DEBUG: Adding close listener (X) for modal: ${modal.id}`); // <-- DEBUG LOG AÑADIDO
                 button.onclick = () => closeModal(modal.id);
            }
        });
         // Botones Cancelar
         document.querySelectorAll('.modal .modal-cancel-btn').forEach(button => {
            const modal = button.closest('.modal');
            if (modal) {
                 console.log(`DEBUG: Adding close listener (Cancel) for modal: ${modal.id}`); // <-- DEBUG LOG AÑADIDO
                 button.onclick = () => closeModal(modal.id);
            }
        });
        // Clic fuera
        console.log("DEBUG: Setting up window onclick listener for modals"); // <-- DEBUG LOG AÑADIDO
        window.onclick = function(event) {
             // Solo cerrar si se hace clic DIRECTAMENTE en el fondo del modal
             if (event.target.classList.contains('modal')) {
                 console.log(`DEBUG: Click outside detected ON modal backdrop: ${event.target.id}`); // <-- DEBUG LOG AÑADIDO
                 closeModal(event.target.id);
             } else {
                 // console.log(`DEBUG: Window click detected, target is not modal backdrop:`, event.target); // Opcional
             }
        }
    }

    // --- Funciones Específicas de Preparación de Modales ---
    function prepareSportModal(sport = null) {
        console.log("DEBUG: Preparing sport modal. Editing:", !!sport); // <-- DEBUG LOG AÑADIDO
        const modal = document.getElementById('sportModal');
        const form = document.getElementById('sportForm');
        const title = document.getElementById('sportModalTitle');
        const metricsSelect = document.getElementById('sportMetricsSelect');

        if (!modal || !form || !title || !metricsSelect) {
             console.error("DEBUG: Sport modal elements not found!"); // <-- DEBUG LOG ERROR
             return; // Salir si falta algún elemento esencial
        }

        try { // Envolver en try...catch por si algo falla con los options
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
                    console.log("DEBUG: Selecting metrics:", sport.metrics); // <-- DEBUG LOG AÑADIDO
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
            console.log("DEBUG: Sport modal prepared successfully."); // <-- DEBUG LOG AÑADIDO
        } catch (error) {
            console.error("DEBUG: Error during prepareSportModal:", error); // <-- DEBUG LOG ERROR
        }
    }

    // ... (resto de funciones de ui.js sin cambios: prepareUserModal, renderSportsSidebar, etc.) ...

     // Objeto público
    return {
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
        showMessage
    };

})(); // Fin de la IIFE
