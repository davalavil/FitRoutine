// js/ui.js
console.log("ui.js loaded");

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
            // Cargar datos específicos de la pestaña al activarla
            loadTabData(tabId);
        });
    });
     // Activar la pestaña inicial (ej. dashboard)
    activateTab('dashboard');
}

function activateTab(tabId) {
    console.log("Activating tab:", tabId)
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(l => l.classList.remove('bg-blue-100', 'text-blue-700'));
    tabContents.forEach(c => c.classList.remove('active'));

    const activeLink = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);

    if (activeLink) activeLink.classList.add('bg-blue-100', 'text-blue-700');
    if (activeContent) activeContent.classList.add('active');
    else console.warn(`Tab content not found for id: ${tabId}`);
}

// ----- Modales -----
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
    else console.warn(`Modal not found: ${modalId}`);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'none';
    const form = modal.querySelector('form');
    if (form) form.reset();
}

function setupModalClosers() {
    // Botones X dentro de los modales
    document.querySelectorAll('.modal .close-button').forEach(button => {
        const modal = button.closest('.modal');
        if (modal) button.onclick = () => closeModal(modal.id);
    });
     // Botones Cancelar dentro de los modales
     document.querySelectorAll('.modal .modal-cancel-btn').forEach(button => {
        const modal = button.closest('.modal');
        if (modal) button.onclick = () => closeModal(modal.id);
    });
    // Clic fuera del contenido
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    }
}

// --- Funciones Específicas de Preparación de Modales ---
function prepareSportModal(sport = null) {
    const modal = document.getElementById('sportModal');
    const form = document.getElementById('sportForm');
    const title = document.getElementById('sportModalTitle');
    if (!modal || !form || !title) return;

    form.reset(); // Limpia el formulario
    document.getElementById('sportId').value = ''; // Limpia ID oculto

    if (sport) { // Editando
        title.textContent = "Editar Deporte";
        document.getElementById('sportId').value = sport.id;
        document.getElementById('sportName').value = sport.name;
        document.getElementById('sportIcon').value = sport.icon || '';
        document.getElementById('sportColor').value = sport.color || '';
        // Marcar checkboxes de métricas
         form.querySelectorAll('input[name="metrics"]').forEach(checkbox => {
            checkbox.checked = sport.metrics?.includes(checkbox.value) || false;
        });
    } else { // Añadiendo
        title.textContent = "Añadir Deporte";
    }
}

function prepareUserModal(user = null) {
     const modal = document.getElementById('userModal');
     const form = document.getElementById('userForm');
     if (!modal || !form) return;
     form.reset();
     // No hay campo ID visible, no necesitamos limpiarlo explícitamente aquí
     if (user) {
         // Lógica para editar usuario (si se implementa)
         console.warn("Edit user UI not fully implemented");
     } else {
         modal.querySelector('h2').textContent = "Añadir Usuario";
     }
}

// ----- Renderizado de Listas -----

function renderSportsSidebar(sports) {
    const container = document.getElementById('sports-list-sidebar');
    if (!container) return;

    // Guardar el botón "Añadir Deporte" para reinsertarlo
    const addSportBtnLi = container.querySelector('#addSportSidebarBtn')?.parentElement;

    container.innerHTML = ''; // Limpiar todo

    if (sports && sports.length > 0) {
        sports.forEach(sport => {
            const li = document.createElement('li');
            const iconClass = sport.icon || 'fas fa-question-circle';
            const colorClass = sport.color || 'bg-gray-200';
            const textColor = colorClass.replace('bg-', 'text-') + '-700'; // Intenta derivar color de texto

            li.innerHTML = `
                <a href="#" class="flex items-center p-2 rounded-md hover:bg-gray-100 sport-link" data-sportid="${sport.id}">
                    <div class="sport-icon ${colorClass} ${textColor} mr-2">
                        <i class="${iconClass}"></i>
                    </div>
                    <span>${sport.name}</span>
                </a>`;
            container.appendChild(li);
        });
    } else {
        container.innerHTML = '<li><p class="p-2 text-xs text-gray-500">Añade un deporte</p></li>';
    }

    // Reinsertar el botón "Añadir Deporte" al final
    if (addSportBtnLi) {
        container.appendChild(addSportBtnLi);
    }
}

function renderSportsList(sports) {
    const container = document.getElementById('sports-list-container');
     const addSportCardBtn = document.getElementById('addSportCardBtn'); // Guardar el botón añadir
    if (!container) return;

    container.innerHTML = ''; // Limpiar lista

    if (sports && sports.length > 0) {
        sports.forEach(sport => {
            const div = document.createElement('div');
             const iconClass = sport.icon || 'fas fa-question-circle';
             const headerColor = sport.color || 'bg-gray-500';
             const tagBgColor = headerColor.replace('bg-', 'bg-') + '-100';
             const tagTextColor = headerColor.replace('bg-', 'text-') + '-800';

            div.className = 'bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden';
            div.dataset.sportid = sport.id;
            div.innerHTML = `
                <div class="${headerColor} text-white p-4">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-bold">${sport.name}</h2>
                        <i class="${iconClass} text-2xl opacity-75"></i>
                    </div>
                </div>
                <div class="p-4">
                    <p class="text-gray-600 mb-4 text-sm">Deporte personalizado.</p> <!-- Placeholder desc -->
                    <div class="flex flex-wrap gap-1 mb-4">
                        ${sport.metrics && sport.metrics.length > 0
                            ? sport.metrics.map(metric => `<span class="${tagBgColor} ${tagTextColor} text-xs px-2 py-0.5 rounded">${metric}</span>`).join('')
                            : '<span class="text-xs text-gray-400">Sin métricas</span>'}
                    </div>
                    <div class="flex justify-between items-center mt-2 pt-2 border-t">
                        <span class="text-sm text-gray-500">${api.getExercises({sportId: sport.id}).length} ejercicios</span> <!-- Necesita filtro en api.js -->
                        <div>
                            <button title="Configurar" class="text-blue-600 hover:text-blue-800 configure-sport-btn" data-sportid="${sport.id}"><i class="fas fa-cog"></i></button>
                            <button title="Eliminar" class="text-red-600 hover:text-red-800 delete-sport-btn ml-2" data-sportid="${sport.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>`;
            container.appendChild(div);
        });
    } else {
         container.innerHTML = '<p class="text-gray-500 col-span-3">No hay deportes añadidos.</p>';
    }
     // Reinsertar el botón "Añadir Deporte"
    if (addSportCardBtn) {
         container.appendChild(addSportCardBtn);
    }
}

// ----- Renderizado de Usuarios -----

function updateUserDropdown(users) {
    const container = document.getElementById('user-list-dropdown');
    if (!container) return;
    container.innerHTML = ''; // Limpiar

    if (users && users.length > 0) {
        users.forEach(user => {
            // No añadir el usuario actual a la lista de cambio
            if (user.id === api.getCurrentUser()?.id) return;

            const a = document.createElement('a');
            a.href = '#';
            a.className = 'text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 user-switch-link';
            a.dataset.userid = user.id;
            a.innerHTML = `
                <div class="flex items-center">
                    <div class="user-avatar mr-2 text-xs bg-gray-400 flex items-center justify-center"> <!-- Color dinámico pendiente -->
                        <span>${user.initials}</span>
                    </div>
                    <span>${user.name}</span>
                </div>`;
            container.appendChild(a);
        });
         if (container.innerHTML === '') { // Si solo había 1 usuario, mostrar mensaje
            container.innerHTML = '<p class="px-4 py-2 text-xs text-gray-500">No hay otros usuarios.</p>';
        }
    } else {
        container.innerHTML = '<p class="px-4 py-2 text-xs text-gray-500">Añade un usuario.</p>';
    }
}

function updateCurrentUserDisplay(user) {
    const avatar = document.getElementById('currentUserAvatar');
    const initialsSpan = document.getElementById('currentUserInitials');
    const nameP = document.getElementById('currentUserName');
    const emailP = document.getElementById('currentUserEmail');

    if (user) {
        if(initialsSpan) initialsSpan.textContent = user.initials || '--';
        if(nameP) nameP.textContent = user.name || 'Usuario';
        if(emailP) emailP.textContent = user.email || '';
        // TODO: Actualizar color del avatar si se guarda en los datos del usuario
        if(avatar) avatar.classList.remove('bg-gray-500'); // Quitar color por defecto si lo hubiera
        if(avatar) avatar.classList.add('bg-green-500'); // Poner un color por defecto
    } else {
        // Estado cuando no hay usuario
        if(initialsSpan) initialsSpan.textContent = '--';
        if(nameP) nameP.textContent = 'Sin Usuario';
        if(emailP) emailP.textContent = '';
        if(avatar) avatar.classList.remove('bg-green-500'); // Quitar colores específicos
        if(avatar) avatar.classList.add('bg-gray-500'); // Poner color gris
    }
     // Actualizar también el dropdown para quitar al usuario actual de la lista
     updateUserDropdown(api.getUsers());
}


// ----- Renderizado del Calendario -----

function renderCalendarGrid(year, month, sessions = []) { // month es 0-11
    const grid = document.getElementById('calendar-grid');
    const monthYearSpan = document.getElementById('calendar-month-year');
    if (!grid || !monthYearSpan) return;

    grid.innerHTML = ''; // Limpiar calendario
    monthYearSpan.textContent = `${MONTH_NAMES[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = (firstDayOfMonth.getDay() || 7) - 1; // 0=Lunes, 6=Domingo

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Días del mes anterior
    const lastDayOfPrevMonth = new Date(year, month, 0);
    const daysInPrevMonth = lastDayOfPrevMonth.getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const cell = document.createElement('div');
        cell.className = 'calendar-day-cell other-month';
        cell.innerHTML = `<span class="day-number">${day}</span>`;
        grid.appendChild(cell);
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        cell.className = 'calendar-day-cell';
        cell.dataset.date = dateStr;

        let dayHtml = `<span class="day-number">${day}</span>`;
        if (dateStr === todayStr) {
            cell.classList.add('today');
        }

        // Buscar sesiones para este día
        const sessionsToday = sessions.filter(s => s.date === dateStr);
        if (sessionsToday.length > 0) {
             // Añadir puntos o indicadores por cada sesión o tipo de sesión
             dayHtml += `<div class="mt-1 text-center">`;
             sessionsToday.slice(0, 3).forEach(session => { // Mostrar max 3 puntos
                 // TODO: Usar colores según el tipo de sesión si hay datos
                 dayHtml += `<span class="calendar-event-dot bg-blue-500"></span>`;
             });
             dayHtml += `</div>`;
        }

        cell.innerHTML = dayHtml;
        grid.appendChild(cell);
    }

    // Días del mes siguiente
    const totalCells = startDayOfWeek + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day-cell other-month';
        cell.innerHTML = `<span class="day-number">${i}</span>`;
        grid.appendChild(cell);
    }
}

function showDailyDetails(date, sessions) {
    const section = document.getElementById('daily-details-section');
    const title = document.getElementById('selected-date-title');
    const noWorkoutMsg = document.getElementById('no-workout-message');
    const checklistContainer = document.getElementById('workout-checklist-container');
    const checklistItemsDiv = document.getElementById('checklist-items');

    if (!section || !title || !noWorkoutMsg || !checklistContainer || !checklistItemsDiv) return;

    title.textContent = date; // Podría formatearse mejor
    checklistItemsDiv.innerHTML = ''; // Limpiar checklist

    if (sessions && sessions.length > 0) {
        noWorkoutMsg.style.display = 'none';
        checklistContainer.style.display = 'block';
        checklistContainer.dataset.sessionid = sessions[0].id; // Asume una sesión por día por ahora

        sessions[0].exercises.forEach((item, index) => {
            // TODO: Obtener nombre real del ejercicio desde api.getExerciseById(item.exerciseId)
            const exerciseName = `Ejercicio ${item.exerciseId}`; // Placeholder
            const details = `(${item.sets || '-'}x${item.reps || '-'} / ${item.time || '-'}s)`; // Placeholder details
            const isChecked = item.completed ? 'checked' : '';
            const itemDiv = document.createElement('div');
            itemDiv.className = `checklist-item ${item.completed ? 'completed' : ''}`;
            itemDiv.innerHTML = `
                <input type="checkbox" id="chk-ex-${index}" data-exerciseid="${item.exerciseId}" ${isChecked}>
                <label for="chk-ex-${index}">${exerciseName} ${details}</label>
                <button class="text-xs text-gray-500 hover:text-blue-600 ml-2 info-exercise-btn" data-exerciseid="${item.exerciseId}"><i class="fas fa-info-circle"></i></button>
            `;
            checklistItemsDiv.appendChild(itemDiv);
        });

    } else {
        noWorkoutMsg.style.display = 'block';
        checklistContainer.style.display = 'none';
        checklistContainer.removeAttribute('data-sessionid');
    }

    section.classList.remove('hidden');
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideDailyDetails() {
     const section = document.getElementById('daily-details-section');
     if(section) section.classList.add('hidden');
}

function updateChecklistItemStyle(checkbox) {
    const listItem = checkbox.closest('.checklist-item');
    if (!listItem) return;
    if (checkbox.checked) {
        listItem.classList.add('completed');
    } else {
        listItem.classList.remove('completed');
    }
}

// --- Otras Funciones UI ---
function showLoading(elementId) {
    // TODO: Mostrar indicador de carga
}

function hideLoading(elementId) {
     // TODO: Ocultar indicador de carga
}

function showMessage(message, type = 'info') {
    // TODO: Implementar un sistema simple de notificaciones/mensajes
    alert(`${type.toUpperCase()}: ${message}`);
}
