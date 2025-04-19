// js/ui.js
console.log("ui.js loaded");

// Usamos una IIFE para encapsular y exponer el objeto 'ui'
const ui = (() => {

    const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let justOpenedModal = false; // Flag para evitar cierre inmediato

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
        // Botones X
        document.querySelectorAll('.modal .close-button').forEach(button => {
            const modal = button.closest('.modal');
            if (modal) {
                 console.log(`DEBUG: Adding close listener (X) for modal: ${modal.id}`);
                 button.onclick = (event) => {
                    event.stopPropagation();
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
                    event.stopPropagation();
                    closeModal(modal.id);
                 }
            }
        });
        // Clic fuera
        console.log("DEBUG: Setting up window onclick listener for modals");
        window.onclick = function(event) {
             if (justOpenedModal) {
                 console.log("DEBUG: Window click ignored (just opened modal flag is true)");
                 return;
             }
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
        } catch (error) { /* ... */ return false; }
    }

    function prepareUserModal(user = null) {
         console.log("DEBUG: Preparing user modal. Editing:", !!user);
         const modal = document.getElementById('userModal');
         const form = document.getElementById('userForm');
         if (!modal || !form) {
              console.error("DEBUG: User modal elements not found!");
              return false;
         }
         try {
             form.reset();
             if (user) { /* Editar */ } else { modal.querySelector('h2').textContent = "Añadir Usuario"; }
              console.log("DEBUG: User modal prepared successfully.");
              return true;
         } catch(error) { /* ... */ return false; }
    }

    // ----- Renderizado de Listas -----

    function renderSportsSidebar(sports) {
        const container = document.getElementById('sports-list-sidebar');
        if (!container) {
            console.error("UI Error: Sidebar sports container not found!");
            return;
        }
        const addSportBtnLi = container.querySelector('#addSportSidebarBtn')?.parentElement;
        container.innerHTML = ''; // Limpiar contenido anterior

        if (sports && sports.length > 0) {
            sports.forEach(sport => {
                const li = document.createElement('li');
                const iconClass = sport.icon || 'fas fa-question-circle';
                const colorClass = sport.color || 'bg-gray-200';
                const bgColorTest = sport.color?.includes('yellow') || sport.color?.includes('gray') || sport.color?.includes('white') ? 'light' : 'dark';
                const textColor = bgColorTest === 'light' ? 'text-gray-800' : 'text-white';
                const hoverColor = 'hover:bg-gray-100';

                li.innerHTML = `
                    <a href="#" class="flex items-center p-2 rounded-md ${hoverColor} sport-link" data-sportid="${sport.id}" title="${sport.name}">
                        <div class="sport-icon ${colorClass} ${textColor} mr-2 flex-shrink-0">
                            <i class="${iconClass}"></i>
                        </div>
                        <span class="truncate">${sport.name}</span>
                    </a>`;
                container.appendChild(li);
            });
        } else {
            container.innerHTML = '<li><p class="p-2 text-xs text-gray-500">Añade un deporte</p></li>';
        }
        // Re-añadir el botón "Añadir Deporte" al final
        if (addSportBtnLi) {
            container.appendChild(addSportBtnLi);
        } else {
             console.warn("UI Warning: Could not find the 'Add Sport' button in the sidebar to re-append it.");
             // Podríamos recrearlo si fuera necesario, pero es mejor asegurar que esté en el HTML inicial.
        }
    }

    function renderSportsList(sports) {
        // ... (código sin cambios funcionales, asumiendo que api está definido globalmente) ...
         const container = document.getElementById('sports-list-container');
        const addSportCardBtn = document.getElementById('addSportCardBtn');
        if (!container) return;
        container.innerHTML = '';

        if (sports && sports.length > 0) {
            sports.forEach(sport => { /* Crear y añadir tarjeta de deporte */ });
        }
        if (addSportCardBtn) {
             container.appendChild(addSportCardBtn);
        }
    }

    // ----- Renderizado de Usuarios -----
    function updateUserDropdown(users, currentUserId) {
       // ... (sin cambios) ...
    }
    function updateCurrentUserDisplay(user) {
        const avatar = document.getElementById('currentUserAvatar');
        const initialsSpan = document.getElementById('currentUserInitials');
        const nameP = document.getElementById('currentUserName');
        const emailP = document.getElementById('currentUserEmail');

        if(avatar) avatar.className = 'user-avatar cursor-pointer flex items-center justify-center'; // Reset

        // Asegurarse de que 'api' existe antes de llamarlo
        const currentUsers = (typeof api !== 'undefined') ? api.getUsers() : [];

        if (user) {
             if(initialsSpan) initialsSpan.textContent = user.initials || '--';
             if(nameP) nameP.textContent = user.name || 'Usuario';
             if(emailP) emailP.textContent = user.email || '';
             const userIndex = currentUsers.findIndex(u => u.id === user.id);
             const color = ['green', 'purple', 'yellow', 'indigo', 'pink', 'blue', 'red'][userIndex >= 0 ? userIndex % 7 : 0];
             if(avatar) avatar.classList.add(`bg-${color}-500`);
        } else {
            if(initialsSpan) initialsSpan.textContent = '--';
            if(nameP) nameP.textContent = 'Sin Usuario';
            if(emailP) emailP.textContent = '';
            if(avatar) avatar.classList.add('bg-gray-500');
        }
        // Llamar a updateUserDropdown DESPUÉS de actualizar los datos principales
        updateUserDropdown(currentUsers, user?.id);
    }


    // ----- Renderizado del Calendario -----
    function renderCalendarGrid(year, month, sessions = []) { /* ... */ }
    function createCalendarCell(day, isOtherMonth, isToday = false, dateStr = null, sessions = []) { /* ... */ }
    function groupSessionsByDate(sessions) { /* ... */ }
    function showDailyDetails(date, sessions) { /* ... */ }
    function hideDailyDetails() { /* ... */ }
    function updateChecklistItemStyle(checkbox) { /* ... */ }

    // --- Mensajes y Carga ---
    function showMessage(message, type = 'info') { /* ... */ }


    // Objeto público (ASEGURARSE DE QUE TODAS LAS FUNCIONES NECESARIAS ESTÉN AQUÍ)
    return {
        setupTabs,
        activateTab,
        openModal,
        closeModal,
        setupModalClosers,
        prepareSportModal,
        prepareUserModal,
        renderSportsSidebar, // <-- ¡ASEGURARSE DE QUE ESTÁ AQUÍ!
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
