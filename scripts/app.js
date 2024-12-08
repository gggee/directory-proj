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
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.full_name}</td>
                <td>${user.login}</td>
                <td>${user.role_name}</td>
                <td>
                    <button class="edit-btn" onclick="editUser(${user.id})">Редактировать</button>
                    <button class="block-btn" onclick="blockUser(${user.id})">Заблокировать</button>
                </td>
            `;
            users_table.appendChild(row);
        });
    } catch (err) {
        console.error('Ошибка при получении пользователей:', err);
    }
}

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
        document.getElementById('editModal').style.display = 'block';
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

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

window.onload = getUsers;