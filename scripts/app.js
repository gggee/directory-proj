const API_BASE = 'http://localhost/directory_db';

async function getUsers() {
    try {
        const resp = await fetch(`${API_BASE}/api.php?action=get_users`);
        const users = await resp.json();
        if (users.error) {
            console.error(users.error);
            return;
        }
        //отображение данных
        const users_table = document.querySelector('#usersTable tbody');
        users_table.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.full_name}</td>
                <td>${user.login}</td>
                <td>${user.role_name}</td>
            `;
            users_table.appendChild(row);
        });
    } catch (err) {
        console.error('Ошибка при получении пользователей:', err);
    }
}
window.onload = getUsers;
