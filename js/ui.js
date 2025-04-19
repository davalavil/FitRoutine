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
            loadTabData(tabId); // Cargar datos al activar (definida en app.js)
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
    if (modal) modal.style.display = 'block';
    else console.warn(`UI: Modal not found: ${modalId}`);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'none';
    const form = modal.querySelector('form');
    if (form) form.reset();
}

function setupModalClosers() {
    document.querySelectorAll('.modal .close-button').forEach(button => {
        const modal = button.closest('.modal');
        if (modal) button.onclick = () => closeModal(modal.id);
    });
     document.querySelectorAll('.modal .modal-cancel-btn').forEach(button => {
        const modal = button.closest('.modal');
        if (modal) button.onclick = () => closeModal(modal.id);
    });
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

    form.reset();
    document.getElementById('sportId').value = '';

    if (sport) {
        title.textContent = "Editar Deporte";
        document.getElementById('sportId').value = sport.id;
        document.getElementById('sportName').value = sport.name;
        document.getElementById('sportIcon').value = sport.icon || '';
        document.getElementById('sportColor').value = sport.color || '';
         form.querySelectorAll('input[name="metrics"]').forEach(checkbox => {
            checkbox.checked = sport.metrics?.includes(checkbox.value) || false;
        });
    } else {
        title.textContent = "Añadir Deporte";
    }
}

function prepareUserModal(user = null) {
     const modal = document.getElementById('userModal');
     const form = document.getElementById('userForm');
     if (!modal || !form) return;
     form.reset();
     if (user) {
         console.warn("UI: Edit user UI not fully implemented");
         modal.querySelector('h2').textContent = "Editar Usuario"; // Cambiar título si se edita
         // Rellenar campos...
         // document.getElementById('userIdHiddenInput').value = user.id // Necesitarías un input hidden para el ID
     } else {
         modal.querySelector('h2').textContent = "Añadir Usuario";
     }
}

// ----- Renderizado de Listas -----

function renderSportsSidebar(sports) {
    const container = document.getElementById('sports-list-sidebar');
    if (!container) return;
    const addSportBtnLi = container.querySelector('#addSportSidebarBtn')?.parentElement;
    container.innerHTML = '';

    if (sports && sports.length > 0) {
        sports.forEach(sport => {
            const li = document.createElement('li');
            const iconClass = sport.icon || 'fas fa-question-circle';
            const colorClass = sport.color || 'bg-gray-200';
             // Intenta generar un color de texto con contraste básico (muy simple)
            const bgColorTest = sport.color?.includes('yellow') || sport.color?.includes('gray') || sport.color?.includes('white') ? 'light' : 'dark';
            const textColor = bgColorTest === 'light' ? 'text-gray-800' : 'text-white';
             const hoverColor = 'hover:bg-gray-100'; // hover siempre gris claro

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
    const container = document.getElementById('sports-list-container');
    const addSportCardBtn = document.getElementById('addSportCardBtn');
    if (!container) return;
    container.innerHTML = ''; // Limpiar solo las tarjetas, no el botón de añadir

    if (sports && sports.length > 0) {
        sports.forEach(sport => {
            const div = document.createElement('div');
            const iconClass = sport.icon || 'fas fa-question-circle';
            const headerColor = sport.color || 'bg-gray-500';
            // Genera colores para tags basados en el color principal
            const tagBgColor = headerColor.includes('gray') || headerColor.includes('white') ? 'bg-gray-200' : headerColor.replace('bg-', 'bg-') + '-100';
            const tagTextColor = headerColor.includes('gray') || headerColor.includes('white') ? 'text-gray-700' : headerColor.replace('bg-', 'text-') + '-800';

            // Intenta obtener el número de ejercicios (usa api.getExercises)
            const exerciseCount = api.getExercises({ sportId: sport.id }).length; // CORREGIDO: Llamar a api.getExercises

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
                    <div class="flex flex-wrap gap-1 mb-4 min-h-[20px]"> <!-- Min height for empty metrics -->
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
    } else {
         // No añadir mensaje aquí, dejar que el botón de añadir sea lo único visible
    }
    // Asegurarse de que el botón añadir esté al final
    if (addSportCardBtn) {
         container.appendChild(addSportCardBtn);
    }
}

// ----- Renderizado de Usuarios -----

function updateUserDropdown(users, currentUserId) {
    const container = document.getElementById('user-list-dropdown');
    if (!container) return;
    container.innerHTML = '';

    let otherUsersExist = false;
    if (users && users.length > 0) {
        users.forEach(user => {
            if (user.id === currentUserId) return; // No añadir el actual a la lista de cambio

            otherUsersExist = true;
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 user-switch-link';
            a.dataset.userid = user.id;
            // Determinar color de avatar (simple)
             const avatarColor = `bg-${['green', 'purple', 'yellow', 'indigo', 'pink'][users.indexOf(user) % 5]}-500`;

            a.innerHTML = `
                <div class="flex items-center">
                    <div class="user-avatar mr-2 text-xs ${avatarColor} flex items-center justify-center text-white flex-shrink-0">
                        <span>${user.initials}</span>
                    </div>
                    <span class="truncate" title="${user.name}">${user.name}</span>
                </div>`;
            container.appendChild(a);
        });
    }

    if (!otherUsersExist) {
        container.innerHTML = `<p class="px-4 py-2 text-xs text-gray-500">${users.length > 0 ? 'No hay otros usuarios.' : 'Añade un usuario.'}</p>`;
    }
}

function updateCurrentUserDisplay(user) {
    const avatar = document.getElementById('currentUserAvatar');
    const initialsSpan = document.getElementById('currentUserInitials');
    const nameP = document.getElementById('currentUserName');
    const emailP = document.getElementById('currentUserEmail');

    // Resetear clases de color del avatar
     if(avatar) avatar.className = 'user-avatar cursor-pointer flex items-center justify-center'; // Reset base classes

    if (user) {
        if(initialsSpan) initialsSpan.textContent = user.initials || '--';
        if(nameP) nameP.textContent = user.name || 'Usuario';
        if(emailP) emailP.textContent = user.email || '';
         // Aplicar color (simple, basado en índice para consistencia visual)
         const users = api.getUsers();
         const userIndex = users.findIndex(u => u.id === user.id);
         const color = ['green', 'purple', 'yellow', 'indigo', 'pink', 'blue', 'red'][userIndex % 7];
         if(avatar) avatar.classList.add(`bg-${color}-500`);

    } else {
        if(initialsSpan) initialsSpan.textContent = '--';
        if(nameP) nameP.textContent = 'Sin Usuario';
        if(emailP) emailP.textContent = '';
        if(avatar) avatar.classList.add('bg-gray-500'); // Color gris por defecto
    }
     // Actualizar el dropdown
     updateUserDropdown(api.getUsers(), user?.id);
}


// ----- Renderizado del Calendario -----

function renderCalendarGrid(year, month, sessions = []) {
    const grid = document.getElementById('calendar-grid');
    const monthYearSpan = document.getElementById('calendar-month-year');
    if (!grid || !monthYearSpan) return;

    grid.innerHTML = '';
    monthYearSpan.textContent = `${MONTH_NAMES[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 0=Lunes, 6=Domingo

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        grid.appendChild(createCalendarCell(day, true));
    }

    // Días del mes actual
    const sessionsByDate = groupSessionsByDate(sessions); // Agrupar sesiones
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const daySessions = sessionsByDate[dateStr] || [];
        grid.appendChild(createCalendarCell(day, false, isToday, dateStr, daySessions));
    }

    // Días del mes siguiente
    const totalCells = startDayOfWeek + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
        grid.appendChild(createCalendarCell(i, true));
    }
}

// Helper para crear celdas del calendario
function createCalendarCell(day, isOtherMonth, isToday = false, dateStr = null, sessions = []) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell relative text-xs sm:text-sm'; // Base classes

    let dayHtml = `<span class="day-number absolute top-1 right-1 sm:top-2 sm:right-2">${day}</span>`;

    if (isOtherMonth) {
        cell.classList.add('other-month');
    } else {
        cell.dataset.date = dateStr; // Solo añadir dataset para días del mes actual
        if (isToday) {
            cell.classList.add('today');
            // Aplicar el estilo "today" al número mismo
            dayHtml = `<span class="day-number absolute top-1 right-1 sm:top-2 sm:right-2 bg-blue-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">${day}</span>`;
        }
        // Añadir indicadores de sesión
        if (sessions.length > 0) {
             dayHtml += `<div class="absolute bottom-1 left-1 right-1 flex justify-center space-x-1">`;
             // TODO: Usar colores basados en tipo de sesión/deporte
             sessions.slice(0, 3).forEach((session, index) => {
                 const colors = ['bg-red-500', 'bg-green-500', 'bg-purple-500'];
                 dayHtml += `<span class="calendar-event-dot ${colors[index % colors.length]}" title="Sesión ${index+1}"></span>`;
             });
              if (sessions.length > 3) dayHtml += `<span class="text-[9px] text-gray-400">+${sessions.length-3}</span>`; // Indicate more
             dayHtml += `</div>`;
        }
    }

    cell.innerHTML = dayHtml;
    return cell;
}

// Helper para agrupar sesiones por fecha
function groupSessionsByDate(sessions) {
     return (sessions || []).reduce((acc, session) => {
         if (!acc[session.date]) {
             acc[session.date] = [];
         }
         acc[session.date].push(session);
         return acc;
     }, {});
}


function showDailyDetails(date, sessions) {
    const section = document.getElementById('daily-details-section');
    const title = document.getElementById('selected-date-title');
    const noWorkoutMsg = document.getElementById('no-workout-message');
    const checklistContainer = document.getElementById('workout-checklist-container');
    const checklistItemsDiv = document.getElementById('checklist-items');
    if (!section || !title || !noWorkoutMsg || !checklistContainer || !checklistItemsDiv) return;

    // Formatear fecha para mostrar
    const dateObj = new Date(`${date}T00:00:00`); // Asegurar que se interprete localmente
    const formattedDate = dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    title.textContent = formattedDate;
    checklistItemsDiv.innerHTML = '';

    if (sessions && sessions.length > 0) {
        noWorkoutMsg.style.display = 'none';
        checklistContainer.style.display = 'block';
        checklistContainer.dataset.sessionid = sessions[0].id; // Asumiendo 1 sesión por ahora

        if (sessions[0].exercises && sessions[0].exercises.length > 0) {
            sessions[0].exercises.forEach((item, index) => {
                const exercise = api.getExerciseById(item.exerciseId); // Obtener datos del ejercicio
                const exerciseName = exercise ? exercise.name : `Ejercicio ID: ${item.exerciseId}`;
                const details = `(${item.sets || '-'}x${item.reps || '-'} / ${item.time || '-'}s)`;
                const isChecked = item.completed ? 'checked' : '';
                const itemDiv = document.createElement('div');
                itemDiv.className = `checklist-item ${item.completed ? 'completed' : ''}`;
                itemDiv.innerHTML = `
                    <input type="checkbox" id="chk-ex-${index}" data-exerciseid="${item.exerciseId}" ${isChecked} class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <label for="chk-ex-${index}" class="ml-2 block text-sm text-gray-900">${exerciseName} <span class="text-gray-500 text-xs">${details}</span></label>
                    <button class="text-xs text-gray-400 hover:text-blue-600 ml-auto info-exercise-btn" data-exerciseid="${item.exerciseId}" title="Ver detalles del ejercicio"><i class="fas fa-info-circle"></i></button>
                `;
                checklistItemsDiv.appendChild(itemDiv);
            });
        } else {
             checklistItemsDiv.innerHTML = `<p class="text-sm text-gray-500">No hay ejercicios en esta sesión.</p>`;
        }

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

// --- Mensajes y Carga ---
function showMessage(message, type = 'info') {
    // Implementación simple con alert, reemplazar por algo mejor
    const prefix = type === 'error' ? 'ERROR: ' : (type === 'success' ? 'ÉXITO: ' : 'INFO: ');
    alert(prefix + message);
    console.log(`Message (${type}): ${message}`);
}
