const API_BASE = 'http://localhost/directory_db';
const form = document.getElementById('addUserForm');
const submit_button = form.querySelector('button[type="submit"]');

document.addEventListener('DOMContentLoaded', function () {
    const toggle_password = document.getElementById('togglePassword');
    const password_field = document.getElementById('password');
    // отобразить пароль
    toggle_password.addEventListener('click', function() {
        const type = password_field.type === 'password' ? 'text' : 'password';
        password_field.type = type;
        toggle_password.textContent = type === 'password' ? 'Показать пароль' : 'Скрыть пароль';
    });
});

//условия для пароля
function isValidPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasDigit && hasSpecialChar;
}

//
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const fullName = document.getElementById('full_name').value.trim();
    const login = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value.trim();
    const roleId = document.getElementById('role_id').value;

    if (!fullName || !login || !password || !roleId) {
        alert('Пожалуйста, заполните все обязательные поля!');
        return;
    }
    if (!isValidPassword(password)) {
        alert('Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный знак.');
        return;
    }

    const userData = {
        full_name: fullName,
        login: login,
        password: password,
        role_id: roleId,
    };

    submit_button.disabled = true;
    submit_button.textContent = 'Загрузка...';

    try {
        const resp = await fetch(`${API_BASE}/api.php?action=add_user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!resp.ok) {
            throw new Error(`Ошибка на сервере: ${resp.status}`);
        }

        const res = await resp.json();
        if (res.success) {
            alert('Пользователь успешно добавлен');
            window.location.href = 'index.html'; 
        } else {
            alert('Ошибка при добавлении пользователя: ' + (res.message || 'Неизвестная ошибка'));
        }
    } catch (err) {
        console.error('Ошибка при добавлении пользователя:', err);
        alert('Произошла ошибка при отправке данных. Попробуйте позже.');
    } finally {
        submit_button.disabled = false;
        submit_button.textContent = 'Сохранить';
    }
});
