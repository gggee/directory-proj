const API_BASE = 'http://localhost/directory_db';

async function getUsers() {
    try {
        const resp = await fetch(`${API_BASE}/api.php?action=get_users`);
        const users = await resp.json();
        if (users.error) {
            console.error(users.error);
            return;
        }
        const users_table = document.querySelector('#usersTable tbody');
        users_table.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            const ban_status = user.status; 
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.full_name}</td>
                <td>${user.login}</td>
                <td>${user.role_name}</td>
                <td>${ban_status}</td>
                <td>
                    <button class="btn edit-btn" onclick="editUser(${user.id})">Редактировать</button>
                    <button class="btn block-btn" onclick="blockUser(${user.id})">Заблокировать</button>
                </td>

            `;
            users_table.appendChild(row);
        });
    } catch (err) {
        console.error('Ошибка при получении пользователей:', err);
    }
}

// Функция для редактирования
async function editUser(userId) {
    try {
        const resp = await fetch(`${API_BASE}/api.php?action=get_user_info&id=${userId}`);
        const user = await resp.json();
        if (user.error) {
            alert('Ошибка при получении данных пользователя');
            return;
        }

        document.getElementById('editUserId').value = user.id;
        document.getElementById('editFullName').value = user.full_name;
        document.getElementById('editLogin').value = user.login;
        document.getElementById('editRole').value = user.role_id;
        document.getElementById('editModal').style.display = 'flex';
    } catch (err) {
        console.error('Ошибка при получении данных пользователя:', err);
    }
}

// Сохранение изменений
document.getElementById('editUserForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const userId = document.getElementById('editUserId').value;
    const fullName = document.getElementById('editFullName').value.trim();
    const login = document.getElementById('editLogin').value.trim();
    const roleId = document.getElementById('editRole').value;

    try {
        const resp = await fetch(`${API_BASE}/api.php?action=update_user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, full_name: fullName, login, role_id: roleId }),
        });

        const result = await resp.json();
        if (result.success) {
            alert('Изменения успешно сохранены');
            closeEditModal();
            getUsers(); // Обновление
        } else {
            alert(`Ошибка: ${result.message}`);
        }
    } catch (err) {
        console.error('Ошибка при сохранении данных:', err);
        alert('Ошибка при сохранении данных');
    }
});

//Функция для бана
async function blockUser(userId) {
    document.getElementById('blockUserId').value = userId;
    document.getElementById('blockModal').style.display = 'flex';
}

//Для отображения ввода причины
document.getElementById('blockReason').addEventListener('change', function() {
    const other_reason_block = document.getElementById('otherReasonBlock');
    if (this.value === 'Другое') {
        other_reason_block.style.display = 'flex';
    } else {
        other_reason_block.style.display = 'none';
    }
});

//Сохранение блокировки
document.getElementById('blockUserForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const userId = document.getElementById('blockUserId').value;
    const hours = document.getElementById('blockHours').value;
    let reason = document.getElementById('blockReason').value;
    if (reason === 'Другое') {
        reason = document.getElementById('otherReason').value.trim();
        if (!reason) {  alert('Пожалуйста, укажите причину'); return;   }
    }

    try {
        const resp = await fetch(`${API_BASE}/api.php?action=block_user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, hours, reason }),
        });

        const result = await resp.json();
        if (result.success) {
            alert('Пользователь заблокирован');
            closeBlockModal();
            getUsers(); // Обновление 
        } else {
            alert(`Ошибка: ${result.message}`);
        }
    } catch (err) {
        console.error('Ошибка при блокировке пользователя:', err);
        alert('Ошибка при блокировке пользователя');
    }
});

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function closeBlockModal() {
    document.getElementById('blockModal').style.display = 'none';
}

window.onload = getUsers;