// js/ui.js
console.log("ui.js loaded");

// Usamos una IIFE para encapsular y exponer el objeto 'ui'
const ui = (() => {

    const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

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
                // Asegurarse de que la función global loadTabData exista y llamarla
                if (typeof window.loadTabData === 'function') {
                    window.loadTabData(tabId); // Llama a la función global definida en app.js
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
                 button.onclick = () => closeModal(modal.id);
            }
        });
         // Botones Cancelar
         document.querySelectorAll('.modal .modal-cancel-btn').forEach(button => {
            const modal = button.closest('.modal');
            if (modal) {
                 console.log(`DEBUG: Adding close listener (Cancel) for modal: ${modal.id}`);
                 button.onclick = () => closeModal(modal.id);
            }
        });
        // Clic fuera
        console.log("DEBUG: Setting up window onclick listener for modals");
        window.onclick = function(event) {
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
             console.error("DEBUG: Sport modal elements not found!");
             return;
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
        } catch (error) {
            console.error("DEBUG: Error during prepareSportModal:", error);
        }
    }

    function prepareUserModal(user = null) {
         console.log("DEBUG: Preparing user modal. Editing:", !!user); // Log añadido
         const modal = document.getElementById('userModal');
         const form = document.getElementById('userForm');
         if (!modal || !form) {
              console.error("DEBUG: User modal elements not found!");
              return;
         }
         try {
             form.reset();
             // No hay ID visible/oculto por defecto, si se añade, limpiar aquí:
             // document.getElementById('userIdHidden').value = '';
             if (user) {
                 console.warn("UI: Edit user UI not fully implemented");
                 modal.querySelector('h2').textContent = "Editar Usuario";
                 // Rellenar campos para editar si se implementa
                 // document.getElementById('userName').value = user.name;
                 // ...etc
             } else {
                 modal.querySelector('h2').textContent = "Añadir Usuario";
             }
              console.log("DEBUG: User modal prepared successfully.");
         } catch(error) {
             console.error("DEBUG: Error during prepareUserModal:", error);
         }
    }

    // ----- Renderizado de Listas -----

    function renderSportsSidebar(sports) {
        // ... (sin cambios) ...
        const container = document.getElementById('sports-list-sidebar');
        if (!container) return;
        const addSportBtnLi = container.querySelector('#addSportSidebarBtn')?.parentElement;
        container.innerHTML = '';

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
        if (addSportBtnLi) {
            container.appendChild(addSportBtnLi);
        }
    }

    function renderSportsList(sports) {
        // ... (sin cambios) ...
        const container = document.getElementById('sports-list-container');
        const addSportCardBtn = document.getElementById('addSportCardBtn');
        if (!container) return;
        container.innerHTML = '';

        if (sports && sports.length > 0) {
            sports.forEach(sport => {
                const div = document.createElement('div');
                const iconClass = sport.icon || 'fas fa-question-circle';
                const headerColor = sport.color || 'bg-gray-500';
                const tagBgColor = headerColor.includes('gray') || headerColor.includes('white') ? 'bg-gray-200' : headerColor.replace('bg-', 'bg-') + '-100';
                const tagTextColor = headerColor.includes('gray') || headerColor.includes('white') ? 'text-gray-700' : headerColor.replace('bg-', 'text-') + '-800';

                const exerciseCount = typeof api !== 'undefined' ? api.getExercises({ sportId: sport.id }).length : 0;

                div.className = 'bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden';
                div.dataset.sportid = sport.id;
                div.innerHTML = `
                    <div class="${headerColor} text-white p-4">
                        <div class="flex justify-between items-center">
                            <h2 class="text-xl font-bold truncate" title="${sport.name}">${sport.name}</h2>
                            <i class="${iconClass} text-2xl opacity-75 flex-shrink-0 ml-2"></i>
                        </div>
                    </div>
                    <div class="p-4">
                        <div class="flex flex-wrap gap-1 mb-4 min-h-[20px]">
                            ${sport.metrics && sport.metrics.length > 0
                                ? sport.metrics.map(metric => `<span class="${tagBgColor} ${tagTextColor} text-xs px-2 py-0.5 rounded whitespace-nowrap">${metric}</span>`).join('')
                                : '<span class="text-xs text-gray-400">Sin métricas</span>'}
                        </div>
                        <div class="flex justify-between items-center mt-2 pt-2 border-t">
                            <span class="text-sm text-gray-500">${exerciseCount} ${exerciseCount === 1 ? 'ejercicio' : 'ejercicios'}</span>
                            <div>
                                <button title="Configurar / Editar" class="text-blue-600 hover:text-blue-800 configure-sport-btn" data-sportid="${sport.id}"><i class="fas fa-cog"></i></button>
                                <button title="Eliminar" class="text-red-600 hover:text-red-800 delete-sport-btn ml-2" data-sportid="${sport.id}"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>`;
                container.appendChild(div);
            });
        }
        if (addSportCardBtn) {
             container.appendChild(addSportCardBtn);
        }
    }

    // ----- Renderizado de Usuarios -----
    function updateUserDropdown(users, currentUserId) {
       // ... (sin cambios) ...
        const container = document.getElementById('user-list-dropdown');
        if (!container) return;
        container.innerHTML = '';
        let otherUsersExist = false;
        if (users && users.length > 0) {
            users.forEach((user, index) => {
                if (user.id === currentUserId) return;
                otherUsersExist = true;
                const a = document.createElement('a');
                a.href = '#';
                a.className = 'text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 user-switch-link';
                a.dataset.userid = user.id;
                const avatarColor = `bg-${['green', 'purple', 'yellow', 'indigo', 'pink', 'blue', 'red'][index % 7]}-500`;
                a.innerHTML = `...`; // Contenido del link
                container.appendChild(a);
            });
        }
        if (!otherUsersExist) { /* Mensaje si no hay otros */ }
    }

    function updateCurrentUserDisplay(user) {
       // ... (sin cambios) ...
        const avatar = document.getElementById('currentUserAvatar');
        const initialsSpan = document.getElementById('currentUserInitials');
        const nameP = document.getElementById('currentUserName');
        const emailP = document.getElementById('currentUserEmail');
        if(avatar) avatar.className = 'user-avatar cursor-pointer flex items-center justify-center';
        if (user && typeof api !== 'undefined') { /* Rellenar datos */ } else { /* Estado sin usuario */ }
        updateUserDropdown(typeof api !== 'undefined' ? api.getUsers() : [], user?.id); // Asegurar que api exista
    }


    // ----- Renderizado del Calendario -----
    function renderCalendarGrid(year, month, sessions = []) {
       // ... (sin cambios) ...
    }
    function createCalendarCell(day, isOtherMonth, isToday = false, dateStr = null, sessions = []) {
       // ... (sin cambios) ...
    }
    function groupSessionsByDate(sessions) {
       // ... (sin cambios) ...
    }
    function showDailyDetails(date, sessions) {
       // ... (sin cambios) ...
    }
    function hideDailyDetails() {
       // ... (sin cambios) ...
    }
    function updateChecklistItemStyle(checkbox) {
       // ... (sin cambios) ...
    }

    // --- Mensajes y Carga ---
    function showMessage(message, type = 'info') {
       // ... (sin cambios) ...
    }


    // Objeto público (AÑADIR prepareUserModal aquí)
    return {
        setupTabs,
        activateTab,
        openModal,
        closeModal,
        setupModalClosers,
        prepareSportModal,
        prepareUserModal, // <-- AÑADIDO AQUÍ
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
