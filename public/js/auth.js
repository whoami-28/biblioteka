document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('auth-form');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const nameField = document.getElementById('name-field');
    const nameInput = document.getElementById('name-input');
    const submitBtn = document.getElementById('submit-btn');
    const toggleBtn = document.getElementById('toggle-auth-btn');
    const errorDiv = document.getElementById('auth-error');

    let isLoginMode = true;

    toggleBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        errorDiv.classList.add('hidden');
        
        if (isLoginMode) {
            title.innerText = 'Вход';
            subtitle.innerText = 'Войдите, чтобы получить доступ к архивам';
            nameField.classList.add('hidden');
            nameInput.removeAttribute('required');
            submitBtn.innerText = 'Войти';
            toggleBtn.innerText = 'Нет аккаунта? Зарегистрироваться';
        } else {
            title.innerText = 'Регистрация';
            subtitle.innerText = 'Создайте профиль куратора';
            nameField.classList.remove('hidden');
            nameInput.setAttribute('required', 'true');
            submitBtn.innerText = 'Создать аккаунт';
            toggleBtn.innerText = 'Уже есть аккаунт? Войти';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.innerText = 'Загрузка...';
        submitBtn.disabled = true;
        errorDiv.classList.add('hidden');

        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const name = nameInput.value;

        const endpoint = isLoginMode ? '/api/login' : '/api/register';
        const bodyData = isLoginMode ? { email, password } : { name, email, password };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('curator_token', result.token);
                window.location.href = 'account_profile.html';
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            errorDiv.innerText = error.message;
            errorDiv.classList.remove('hidden');
        } finally {
            submitBtn.innerText = isLoginMode ? 'Войти' : 'Создать аккаунт';
            submitBtn.disabled = false;
        }
    });
});